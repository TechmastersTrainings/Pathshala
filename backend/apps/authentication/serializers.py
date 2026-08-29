from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from apps.schools.models import School, Plan, Subscription, Payment
from apps.authentication.models import ActivityLog
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'school', 'phone', 'first_name', 'last_name')
        read_only_fields = ('id', 'role', 'school')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['school_id'] = user.school_id if user.school else None
        
        if user.school:
            token['school_name'] = user.school.name
            token['school_status'] = user.school.status
        else:
            token['school_name'] = None
            token['school_status'] = None
            
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        # Enforce validation rules
        # 1. User must be active and not deleted
        if not user.is_active or user.is_deleted:
            raise serializers.ValidationError("This user account is inactive or deleted.")
            
        # Auto-promote django-admin superusers to SUPER_ADMIN role
        if user.is_superuser and user.role != 'SUPER_ADMIN':
            user.role = 'SUPER_ADMIN'
            user.save(update_fields=['role'])
            
        # 2. School status check (for school-affiliated roles)
        if user.role != 'SUPER_ADMIN':
            if not user.school:
                raise serializers.ValidationError("User is not assigned to any school.")
                
            school = user.school
            if school.status == 'PENDING':
                raise serializers.ValidationError("Your school registration is pending approval/payment verification.")
            elif school.status == 'INACTIVE':
                raise serializers.ValidationError("Your school has been deactivated by the administrator.")
            elif school.status == 'SUSPENDED':
                raise serializers.ValidationError("Your school account is suspended.")
            elif school.status == 'SUBSCRIPTION_EXPIRED':
                raise serializers.ValidationError("Your school's subscription has expired. Please renew to login.")

        # Add profile info to response body
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'school_id': user.school_id,
            'school_name': user.school.name if user.school else None,
            'school_status': user.school.status if user.school else None,
        }
        
        # Log active login attempt
        ActivityLog.objects.create(
            user=user,
            school=user.school,
            action=f"User login successful: {user.username}"
        )
        
        return data


class SchoolRegistrationSerializer(serializers.Serializer):
    # School Info
    school_name = serializers.CharField(max_length=255)
    school_email = serializers.EmailField()
    school_phone = serializers.CharField(max_length=20)
    school_address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    pincode = serializers.CharField(max_length=10)
    school_type = serializers.CharField(max_length=100)
    
    # Optional School Info
    logo = serializers.ImageField(required=False, allow_null=True)
    website_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    gst_number = serializers.CharField(max_length=15, required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    # Admin Info
    admin_full_name = serializers.CharField(max_length=255)
    admin_email = serializers.EmailField()
    admin_phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    # Subscription Info
    plan_id = serializers.IntegerField()
    subscription_duration_months = serializers.IntegerField(default=1) # Duration in months
    
    # Razorpay payment verification
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_order_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=255)

    def validate_school_email(self, value):
        if School.objects.filter(email=value).exists():
            raise serializers.ValidationError("A school with this email already exists.")
        return value

    def validate_admin_email(self, value):
        if User.objects.filter(email=value).exists() or User.objects.filter(username=value).exists():
            raise serializers.ValidationError("An admin account with this email/username already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
            
        # Verify Plan exists
        try:
            Plan.objects.get(id=data['plan_id'])
        except Plan.DoesNotExist:
            raise serializers.ValidationError({"plan_id": "Plan does not exist."})
            
        return data

    @transaction.atomic
    def create(self, validated_data):
        # 1. Mock Razorpay payment verification (We verify the transaction is not empty)
        payment_id = validated_data['razorpay_payment_id']
        order_id = validated_data['razorpay_order_id']
        signature = validated_data['razorpay_signature']
        
        if not payment_id or not order_id or not signature:
            raise serializers.ValidationError("Razorpay payment details are invalid.")
            
        # 2. Get Subscription Plan
        plan = Plan.objects.get(id=validated_data['plan_id'])
        
        # 3. Create the School (starts as ACTIVE because payment is successful)
        school = School.objects.create(
            name=validated_data['school_name'],
            email=validated_data['school_email'],
            phone=validated_data['school_phone'],
            address=validated_data['school_address'],
            city=validated_data['city'],
            state=validated_data['state'],
            pincode=validated_data['pincode'],
            school_type=validated_data['school_type'],
            logo=validated_data.get('logo'),
            website_url=validated_data.get('website_url'),
            gst_number=validated_data.get('gst_number'),
            description=validated_data.get('description'),
            status='ACTIVE' # activated directly due to payment verification success
        )
        
        # 4. Create the School Admin user
        full_name = validated_data['admin_full_name']
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        admin_user = User.objects.create_user(
            username=validated_data['admin_email'], # email acts as username
            email=validated_data['admin_email'],
            first_name=first_name,
            last_name=last_name,
            phone=validated_data['admin_phone'],
            role='SCHOOL_ADMIN',
            school=school
        )
        admin_user.set_password(validated_data['password'])
        admin_user.save()
        
        # 5. Create Subscription
        duration_days = plan.duration_days * validated_data['subscription_duration_months']
        start_date = timezone.now()
        end_date = start_date + timedelta(days=duration_days)
        
        subscription = Subscription.objects.create(
            school=school,
            plan=plan,
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )
        
        # 6. Record Payment
        amount = plan.price * validated_data['subscription_duration_months']
        Payment.objects.create(
            school=school,
            subscription=subscription,
            amount=amount,
            razorpay_order_id=order_id,
            razorpay_payment_id=payment_id,
            razorpay_signature=signature,
            status='SUCCESS'
        )
        
        # 7. Log Activity
        ActivityLog.objects.create(
            user=admin_user,
            school=school,
            action=f"School registered and activated. Admin user created: {admin_user.username}"
        )
        
        # 8. Send Welcome & Onboarding Email to School Admin
        from django.core.mail import send_mail
        from django.conf import settings
        import logging

        logger = logging.getLogger(__name__)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        login_url = f"{frontend_url}/login"

        subject = f"Welcome to Pathshala ERP - {school.name} is Activated!"
        message = (
            f"Dear {admin_user.get_full_name() or admin_user.first_name},\n\n"
            f"Congratulations! Your institution \"{school.name}\" has been successfully registered and activated on Pathshala ERP.\n\n"
            f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            f"INSTITUTION PORTAL CREDENTIALS\n"
            f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            f"Portal URL: {login_url}\n"
            f"Username / Login Email: {admin_user.email}\n"
            f"Assigned Role: School Administrator\n"
            f"Subscription Tier: {plan.name} ({validated_data['subscription_duration_months']} Month/s)\n"
            f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            f"You can now sign in to your dashboard to manage student admissions, faculty rosters, timetables, and fee collections.\n\n"
            f"Need assistance? Contact our technical support team at Techmastersinnovations@gmail.com or +91 9880768222.\n\n"
            f"Best regards,\n"
            f"Techmasters Innovations Private Limited\n"
            f"Pathshala ERP Cloud Services"
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
                recipient_list=[admin_user.email],
                fail_silently=False
            )
        except Exception as e:
            logger.warning(f"Could not dispatch welcome email to {admin_user.email}: {e}")
        
        return school
