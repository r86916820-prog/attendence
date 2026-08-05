from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Faculty(UserMixin, db.Model):
    __tablename__ = 'faculty'
    
    faculty_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15))
    designation = db.Column(db.String(50), default='Assistant Professor')
    department = db.Column(db.String(100), default='Computer Science & Engineering')
    photo = db.Column(db.String(255), default='default_avatar.png')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    attendances = db.relationship('Attendance', backref='faculty', lazy=True)

    def get_id(self):
        return str(self.faculty_id)

class Department(db.Model):
    __tablename__ = 'departments'
    
    department_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    department_code = db.Column(db.String(20), unique=True, nullable=False)
    department_name = db.Column(db.String(100), nullable=False)
    hod_name = db.Column(db.String(100))
    intake_capacity = db.Column(db.Integer, default=120)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    subjects = db.relationship('Subject', backref='department', lazy=True, cascade="all, delete-orphan")
    students = db.relationship('Student', backref='department', lazy=True, cascade="all, delete-orphan")
    attendances = db.relationship('Attendance', backref='department', lazy=True, cascade="all, delete-orphan")

class Subject(db.Model):
    __tablename__ = 'subjects'
    
    subject_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subject_code = db.Column(db.String(20), unique=True, nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.department_id', ondelete='CASCADE'), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    credits = db.Column(db.Integer, default=4)
    subject_type = db.Column(db.Enum('Theory', 'Lab', 'Seminar', 'Project'), default='Theory')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    attendances = db.relationship('Attendance', backref='subject', lazy=True, cascade="all, delete-orphan")

class Student(db.Model):
    __tablename__ = 'students'
    
    student_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    roll_number = db.Column(db.String(30), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.Enum('Male', 'Female', 'Other'), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.department_id', ondelete='CASCADE'), nullable=False)
    year = db.Column(db.String(20), nullable=False)  # '1st Year', '2nd Year', '3rd Year', '4th Year'
    semester = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(5), nullable=False, default='A')
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15))
    address = db.Column(db.Text)
    parent_name = db.Column(db.String(100))
    parent_phone = db.Column(db.String(15))
    photo = db.Column(db.String(255), default='default_student.png')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    attendance_details = db.relationship('AttendanceDetail', backref='student', lazy=True, cascade="all, delete-orphan")

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    attendance_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.department_id', ondelete='CASCADE'), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(5), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.subject_id', ondelete='CASCADE'), nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.faculty_id', ondelete='CASCADE'), nullable=False)
    attendance_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique Constraint per class session
    __table_args__ = (
        db.UniqueConstraint('department_id', 'semester', 'section', 'subject_id', 'attendance_date', name='unique_attendance_record'),
    )
    
    # Relationships
    details = db.relationship('AttendanceDetail', backref='attendance', lazy=True, cascade="all, delete-orphan")

class AttendanceDetail(db.Model):
    __tablename__ = 'attendance_details'
    
    detail_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    attendance_id = db.Column(db.Integer, db.ForeignKey('attendance.attendance_id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.Enum('Present', 'Absent', 'Late'), nullable=False, default='Present')
    remarks = db.Column(db.String(255))
    
    __table_args__ = (
        db.UniqueConstraint('attendance_id', 'student_id', name='unique_student_attendance'),
    )
