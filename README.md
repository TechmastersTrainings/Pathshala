# Pathshala ERP

> **A Flagship Product of Techmasters Innovations Private Limited**  
> Modern, High-Performance Multi-Tenant Cloud ERP for Educational Institutions.

---

## 🌟 Overview

**Pathshala ERP** is a full-featured, enterprise-grade, multi-tenant school management SaaS platform engineered by **Techmasters Innovations Private Limited**. It streamlines daily institutional operations including student lifecycle records, automated attendance rosters, examination grading, fee ledgers, timetable generation, fleet transport logistics, and dedicated role-based portals for administrators, faculties, and guardians.

---

## 🚀 Key Features & Modules

- **🏫 Multi-Tenant Architecture**: Strict row-level database partitioning via `school_id` isolation middleware.
- **🛡️ Granular RBAC (Role-Based Access Control)**:
  - **Super Admin Portal**: Institution provisioning, subscription management, payment auditing, system health checks.
  - **School Admin Portal**: Student & faculty rosters, class sections, tuition fee ledgers, timetables, circulars.
  - **Faculty Portal**: One-touch roster attendance marking, exam marks entry, personal timetable view, remarks.
  - **Parent & Student Portal**: Real-time attendance tracking, exam scorecards, digital fee payment & receipts.
- **💎 Glassmorphic Design System**: Modern translucent glass interfaces, fluid Framer Motion animations, interactive platform simulator, and responsive UI.
- **💳 Subscription & Invoicing Engine**: Automated billing cycles with monthly/annual tiers, discount calculations, and payment gateway integration.
- **🔐 Secure Authentication**: JWT authentication with rotating refresh tokens, cryptographic password reset flows, and Google App Password SMTP support.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS & Vanilla CSS Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios

### **Backend**
- **Framework**: Django 6.0 & Django REST Framework (DRF)
- **Language**: Python 3.14
- **Database**: MySQL (PyMySQL engine with ACID transactional integrity)
- **Authentication**: `djangorestframework-simplejwt`
- **CORS**: `django-cors-headers`
- **Configuration**: `django-environ`

---

## 💻 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- MySQL Server (Port 3306)

---

### 2. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Apply database migrations
python manage.py migrate

# Start Django Development Server
python manage.py runserver 0.0.0.0:8000
```

---

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js Development Server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏢 Corporate Credits & Support

**Techmasters Innovations Private Limited**  
- **Support Email**: [Techmastersinnovations@gmail.com](mailto:Techmastersinnovations@gmail.com)  
- **Phone**: +91 98807 68222  
- **Location**: Bidar, Karnataka, India  

© 2026 Techmasters Innovations Private Limited. All rights reserved.
