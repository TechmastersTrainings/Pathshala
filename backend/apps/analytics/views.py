from rest_framework import views, permissions
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from apps.schools.models import School, Subscription, Payment
from apps.students.models import Student, Class, ParentProfile, StudentParentMapping
from apps.faculty.models import FacultyProfile, FacultySubjectAssignment
from apps.attendance.models import StudentAttendance
from apps.fees.models import StudentFee
from apps.results.models import StudentResult
from apps.system_settings.models import Timetable
from apps.exams.models import Exam

class DashboardAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        role = user.role
        
        if role == 'SUPER_ADMIN':
            return self.get_super_admin_analytics()
        elif role == 'SCHOOL_ADMIN':
            return self.get_school_admin_analytics(user.school)
        elif role == 'FACULTY':
            return self.get_faculty_analytics(user)
        elif role == 'PARENT':
            return self.get_parent_analytics(user)
            
        return Response({"detail": "Role analytics not supported."}, status=400)

    def get_super_admin_analytics(self):
        total_schools = School.objects.count()
        active_schools = School.objects.filter(status='ACTIVE').count()
        suspended_schools = School.objects.filter(status='SUSPENDED').count()
        pending_schools = School.objects.filter(status='PENDING').count()
        
        # Revenue
        total_revenue = Payment.objects.filter(status='SUCCESS').aggregate(sum_amount=Sum('amount'))['sum_amount'] or 0.00
        
        # Active subscriptions
        active_subscriptions = Subscription.objects.filter(status='ACTIVE', end_date__gte=timezone.now()).count()
        
        # System Activity
        recent_payments = Payment.objects.filter(status='SUCCESS').order_by('-created_at')[:5]
        payments_data = [{
            "school_name": p.school.name,
            "amount": float(p.amount),
            "date": p.created_at
        } for p in recent_payments]

        return Response({
            "role": "SUPER_ADMIN",
            "stats": [
                {"label": "Total Schools", "value": total_schools, "change": "+2 this month", "icon": "school"},
                {"label": "Active Schools", "value": active_schools, "change": "Active SaaS clients", "icon": "check_circle"},
                {"label": "Pending Schools", "value": pending_schools, "change": "Awaiting approval", "icon": "hourglass_empty"},
                {"label": "Total Revenue", "value": f"₹{total_revenue:,.2f}", "change": "Lifetime collection", "icon": "monetization_on"},
                {"label": "Active Subscriptions", "value": active_subscriptions, "change": "Paid tenants", "icon": "card_membership"},
            ],
            "recent_payments": payments_data
        })

    def get_school_admin_analytics(self, school):
        if not school:
            return Response({"detail": "User not associated with a school."}, status=400)

        total_students = Student.objects.filter(school=school).count()
        total_faculty = FacultyProfile.objects.filter(school=school).count()
        active_faculty = FacultyProfile.objects.filter(school=school, status='ACTIVE').count()
        pending_faculty = FacultyProfile.objects.filter(school=school, status='PENDING').count()
        total_classes = Class.objects.filter(school=school).count()
        
        # Attendance today
        today = timezone.now().date()
        total_attendance_today = StudentAttendance.objects.filter(school=school, date=today).count()
        present_today = StudentAttendance.objects.filter(school=school, date=today, status='PRESENT').count()
        
        attendance_rate = 100.0
        if total_attendance_today > 0:
            attendance_rate = round((present_today / total_attendance_today) * 100, 1)
        else:
            # Fallback check for last available attendance
            last_attendance = StudentAttendance.objects.filter(school=school).order_by('-date').first()
            if last_attendance:
                last_date = last_attendance.date
                total_last = StudentAttendance.objects.filter(school=school, date=last_date).count()
                present_last = StudentAttendance.objects.filter(school=school, date=last_date, status='PRESENT').count()
                if total_last > 0:
                    attendance_rate = round((present_last / total_last) * 100, 1)

        # Fees Collected vs Pending
        fees = StudentFee.objects.filter(school=school)
        total_due = fees.aggregate(sum_due=Sum('amount_due'))['sum_due'] or 0.00
        total_paid = fees.aggregate(sum_paid=Sum('amount_paid'))['sum_paid'] or 0.00
        total_pending = total_due - total_paid

        return Response({
            "role": "SCHOOL_ADMIN",
            "school_name": school.name,
            "school_status": school.status,
            "stats": [
                {"label": "Total Students", "value": total_students, "change": "Enrolled", "icon": "people"},
                {"label": "Active Faculty", "value": active_faculty, "change": f"{pending_faculty} pending approval", "icon": "badge"},
                {"label": "Classes", "value": total_classes, "change": "Standard cohorts", "icon": "class"},
                {"label": "Fees Collected", "value": f"₹{total_paid:,.2f}", "change": f"₹{total_pending:,.2f} pending", "icon": "payments"},
                {"label": "Attendance Rate", "value": f"{attendance_rate}%", "change": "Average attendance", "icon": "playlist_add_check"},
            ]
        })

    def get_faculty_analytics(self, user):
        school = user.school
        try:
            profile = user.faculty_profile
        except FacultyProfile.DoesNotExist:
            return Response({"detail": "Faculty profile not found."}, status=404)
            
        # Class assignments count
        assignments = FacultySubjectAssignment.objects.filter(school=school, faculty=profile)
        assigned_subjects_count = assignments.values('subject').distinct().count()
        assigned_classes_count = assignments.values('class_obj').distinct().count()
        
        # Timetable count
        timetable_count = Timetable.objects.filter(school=school, faculty=profile).count()

        # Exams created
        exams_count = Exam.objects.filter(school=school, subject__faculty_assignments__faculty=profile).distinct().count()

        return Response({
            "role": "FACULTY",
            "stats": [
                {"label": "Assigned Subjects", "value": assigned_subjects_count, "change": "Across classes", "icon": "book"},
                {"label": "Assigned Classes", "value": assigned_classes_count, "change": "Sections", "icon": "group"},
                {"label": "Weekly Sessions", "value": timetable_count, "change": "Scheduled slots", "icon": "schedule"},
                {"label": "Exams Conducted", "value": exams_count, "change": "Evaluations", "icon": "assignment"},
            ]
        })

    def get_parent_analytics(self, user):
        school = user.school
        try:
            profile = user.parent_profile
        except ParentProfile.DoesNotExist:
            return Response({"detail": "Parent profile not found."}, status=404)

        # Get students mapped to this parent
        mappings = StudentParentMapping.objects.filter(school=school, parent=profile)
        students = [m.student for m in mappings]
        
        children_data = []
        for child in students:
            # Attendance summary
            total_days = StudentAttendance.objects.filter(school=school, student=child).count()
            present_days = StudentAttendance.objects.filter(school=school, student=child, status='PRESENT').count()
            att_rate = 100.0
            if total_days > 0:
                att_rate = round((present_days / total_days) * 100, 1)
                
            # Fees
            child_fees = StudentFee.objects.filter(school=school, student=child)
            due = child_fees.aggregate(sum_due=Sum('amount_due'))['sum_due'] or 0.00
            paid = child_fees.aggregate(sum_paid=Sum('amount_paid'))['sum_paid'] or 0.00
            pending_fee = due - paid
            
            # Grades Average
            avg_grade = StudentResult.objects.filter(school=school, student=child).aggregate(avg_mark=Avg('marks_obtained'))['avg_mark'] or 0.00
            
            children_data.append({
                "id": child.id,
                "name": child.name,
                "roll_number": child.roll_number,
                "class_name": f"{child.class_obj.name}-{child.class_obj.section}",
                "attendance_rate": f"{att_rate}%",
                "pending_fee": float(pending_fee),
                "avg_marks": float(round(avg_grade, 2))
            })

        return Response({
            "role": "PARENT",
            "children": children_data
        })
