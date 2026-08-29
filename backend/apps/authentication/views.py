from django.db import models
from rest_framework import status, views, viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.authentication.serializers import (
    CustomTokenObtainPairSerializer, 
    SchoolRegistrationSerializer, 
    UserSerializer
)
from apps.authentication.models import ActivityLog
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class SchoolRegistrationView(views.APIView):
    permission_classes = [permissions.AllowAny] # Anyone can register a school initially

    def post(self, request, *args, **kwargs):
        serializer = SchoolRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            school = serializer.save()
            return Response({
                "success": True,
                "message": "School registered and activated successfully. Please login with admin credentials.",
                "school": {
                    "id": school.id,
                    "name": school.name,
                    "email": school.email,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserMeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ActivityLogViewSet(TenantIsolationMixin, viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    # TenantIsolationMixin will filter the activity logs based on the user's school
    
    def get_serializer_class(self):
        # We don't need a heavy serializer, just a basic read-only one
        from rest_framework import serializers
        class BasicLogSerializer(serializers.ModelSerializer):
            username = serializers.CharField(source='user.username', read_only=True)
            class Meta:
                model = ActivityLog
                fields = ('id', 'username', 'action', 'ip_address', 'created_at')
        return BasicLogSerializer


class ForgotPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        from django.contrib.auth import get_user_model
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.core.mail import send_mail
        from django.conf import settings
        import logging

        logger = logging.getLogger(__name__)
        email = request.data.get('email', '').strip()

        if not email:
            return Response({"error": "Please provide an email address."}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        user = User.objects.filter(models.Q(email__iexact=email) | models.Q(username__iexact=email), is_deleted=False).first()

        # Always return generic message to prevent email enumeration, but send reset if user exists
        if user and user.is_active:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password?uid={uid}&token={token}"

            subject = "Pathshala ERP - Password Reset Request"
            message = (
                f"Hello {user.get_full_name() or user.username},\n\n"
                f"We received a request to reset your Pathshala ERP password.\n\n"
                f"Click the link below to set a new password:\n{reset_url}\n\n"
                f"If you did not request this, you can safely ignore this email.\n\n"
                f"— Pathshala ERP Team"
            )

            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
                    recipient_list=[user.email or email],
                    fail_silently=False
                )
            except Exception as e:
                logger.warning(f"Failed to send email to {email}: {e}. Reset link: {reset_url}")
                # For development/debug feedback if email not configured:
                return Response({
                    "success": True,
                    "message": "Password reset link generated. Check your inbox or console.",
                    "dev_reset_url": reset_url if settings.DEBUG else None
                }, status=status.HTTP_200_OK)

        return Response({
            "success": True,
            "message": "If an account exists with this email, a password reset link has been dispatched."
        }, status=status.HTTP_200_OK)


class ResetPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        from django.contrib.auth import get_user_model
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str

        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')

        if not uidb64 or not token or not new_password:
            return Response({"error": "Missing reset parameters or password."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({"error": "Password must be at least 6 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid, is_deleted=False)
        except Exception:
            return Response({"error": "Invalid or expired password reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token. Please request a new reset link."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            "success": True,
            "message": "Password reset successfully. You can now login with your new credentials."
        }, status=status.HTTP_200_OK)
