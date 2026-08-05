# Student Attendance Management System

A comprehensive, production-ready **Student Attendance Management System** built for B.Tech Final Year Capstone Project.

## 🚀 Features

- **Faculty Authentication**: Secure Registration, Login, Remember Me, Password Hashing, Session Management.
- **Dashboard**: Live counter stats, Recent activity feed, Chart.js visualizations (Attendance Trends, Department Comparison, Present/Absent Pie Chart).
- **Department Management**: Complete CRUD operations for B.Tech Departments (CSE, ECE, ME, EEE, etc.) with HOD & intake capacity tracking.
- **Subject Management**: Complete CRUD for subjects with credit points, subject types (Theory/Lab/Project), department mapping, and semester assignment (Sem 1 to 8).
- **Student Management**: Student records with Roll Number, Photo preview/upload, Contact info, Parent Details, Filter by Dept/Year/Sem/Section, Search & Pagination.
- **Attendance Marking Module**: Select Dept, Semester, Section, Subject, Date; Mark Present/Absent/Late with 1-click toggles; Prevent duplicate attendance submissions with edit functionality.
- **Reports & Exports**: Daily, Weekly, Monthly, Student-wise, Subject-wise, Department-wise attendance reports; <75% attendance warning threshold highlight; Print View, PDF export (jsPDF), Excel export (XLSX).
- **Analytics Dashboard**: Interactive charts powered by Chart.js showcasing monthly attendance trends, section performance, and low attendance lists.
- **Faculty Profile**: Update personal details, profile picture upload, and password change.
- **Dark Mode & Responsive UI**: Seamless blue & white professional theme, dark mode toggle, mobile-responsive sidebar and navbar.

---

## 🛠️ Technology Stack

### Backend
- **Python 3.10+**
- **Flask**
- **Flask-SQLAlchemy**
- **Flask-Login**
- **Flask-WTF & WTForms**
- **Werkzeug (Security & File Handling)**

### Database
- **MySQL 8.0+**
- **SQLAlchemy ORM**

### Frontend
- **HTML5 & CSS3**
- **Bootstrap 5.3**
- **Font Awesome 6 / Lucide Icons**
- **Chart.js**
- **jsPDF & XLSX**

---

## 📂 Project Structure

```
student_attendance_system/
├── app.py                   # Main Flask application entry point
├── config.py                # Database & app configurations
├── requirements.txt         # Python dependencies
├── database.sql             # Full MySQL schema & sample seed data
├── models.py                # SQLAlchemy Database Models
├── forms.py                 # Flask-WTF Form Definitions
├── routes/                  # Modular Route Controllers
│   ├── auth.py              # Login / Register / Logout routes
│   ├── main.py              # Dashboard & home routes
│   ├── departments.py       # Department CRUD routes
│   ├── subjects.py          # Subject CRUD routes
│   ├── students.py          # Student CRUD & Photo upload routes
│   ├── attendance.py        # Attendance marking & history routes
│   ├── reports.py           # Reports generation & export routes
│   ├── analytics.py        # Analytics & charts data routes
│   └── profile.py           # Faculty profile management
├── templates/               # Jinja2 HTML Templates
│   ├── base.html            # Master layout with sidebar/navbar
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── departments.html
│   ├── subjects.html
│   ├── students.html
│   ├── attendance.html
│   ├── reports.html
│   ├── analytics.html
│   ├── profile.html
│   ├── 404.html
│   └── 500.html
├── static/                  # Static CSS, JS, Images
│   ├── css/style.css        # Custom styles & dark mode
│   ├── js/main.js           # Client-side scripts & Chart.js init
│   └── uploads/             # Student & faculty photo storage
└── instance/                # Flask instance folder
```

---

## ⚙️ Installation & Setup Guide

### 1. Database Setup (MySQL)
1. Open MySQL Workbench or MySQL Command Line Client.
2. Run the `database.sql` script to create the database and tables:
   ```bash
   mysql -u root -p < database.sql
   ```

### 2. Python Environment Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Configure Database Credentials
Edit `config.py` with your MySQL credentials:
```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:yourpassword@localhost/student_attendance_system'
```

### 4. Run Application
```bash
python app.py
```
Open your browser and navigate to `http://localhost:5000`.

---

## 👤 Default Login Credentials (from Sample Data)

- **Email:** `rajesh.sharma@college.edu`
- **Password:** `password123`
