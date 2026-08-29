from rest_framework import viewsets, permissions, decorators, status
from rest_framework.response import Response
from apps.fees.models import StudentFee
from apps.fees.serializers import StudentFeeSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsParent
from apps.authentication.models import ActivityLog

class StudentFeeViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = StudentFee.objects.all().order_by('-due_date')
    serializer_class = StudentFeeSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'collect_payment']:
            # School admin only
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        # Read-only access for parents (who can see their children's bills)
        return [permissions.IsAuthenticated(), IsActiveUser()]

    @decorators.action(detail=True, methods=['post'])
    def collect_payment(self, request, pk=None):
        """
        Record a payment towards a fee.
        Format: { "amount_paid": 500.00 }
        """
        fee = self.get_object()
        amount = request.data.get('amount_paid')
        
        if not amount:
            return Response({"detail": "amount_paid field is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            amount_dec = float(amount)
        except ValueError:
            return Response({"detail": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

        fee.amount_paid += amount_dec
        
        # Calculate status
        if fee.amount_paid >= fee.amount_due:
            fee.status = 'PAID'
        elif fee.amount_paid > 0:
            fee.status = 'PARTIAL'
        else:
            fee.status = 'UNPAID'
            
        fee.save()

        ActivityLog.objects.create(
            user=request.user,
            school=request.user.school,
            action=f"Collected fee payment of {amount_dec} for student: {fee.student.name}"
        )

        serializer = self.get_serializer(fee)
        return Response(serializer.data, status=status.HTTP_200_OK)
