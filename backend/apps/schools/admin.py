from django.contrib import admin
from .models import School, Plan, Subscription, Payment

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'city', 'state', 'school_type', 'status')
    list_filter = ('status', 'school_type')
    search_fields = ('name', 'email', 'phone', 'city')

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days', 'max_students', 'max_faculty')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('school', 'plan', 'start_date', 'end_date', 'status')
    list_filter = ('status',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('school', 'subscription', 'amount', 'status', 'created_at')
    list_filter = ('status',)
