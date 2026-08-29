from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'school', 'is_active', 'date_joined')
    list_filter = ('role', 'school', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
