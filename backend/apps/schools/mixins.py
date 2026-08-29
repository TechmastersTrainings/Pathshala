from rest_framework import exceptions

class TenantIsolationMixin:
    """
    Mixin to automatically enforce tenant isolation.
    Filters the queryset to the user's school and inserts the school into the created object.
    """
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if not user or not user.is_authenticated:
            return queryset.none()
            
        if user.role == 'SUPER_ADMIN':
            # Super admin can view everything, or filter by school if query param is provided
            school_id = self.request.query_params.get('school_id')
            if school_id:
                return queryset.filter(school_id=school_id)
            return queryset
            
        if not user.school:
            raise exceptions.PermissionDenied("User is not associated with any school.")
            
        # Return only current school's records
        return queryset.filter(school=user.school)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'SUPER_ADMIN':
            if not user.school:
                raise exceptions.PermissionDenied("User is not associated with any school.")
            serializer.save(school=user.school)
        else:
            # Super Admin must specify school or default to None
            school_id = self.request.data.get('school_id')
            if not school_id and hasattr(serializer.Meta.model, 'school'):
                raise exceptions.ValidationError({"school_id": "Super Admin must specify a school_id."})
            serializer.save()
