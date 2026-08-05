from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, IntegerField, DateField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError, Optional
from models import Faculty, Department, Subject, Student

class LoginForm(FlaskForm):
    email = StringField('Faculty Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired(), Length(min=3, max=100)])
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    designation = StringField('Designation', default='Assistant Professor')
    department = StringField('Department', default='Computer Science & Engineering')
    phone = StringField('Phone Number', validators=[Optional(), Length(max=15)])
    submit = SubmitField('Register Account')

    def validate_email(self, email):
        user = Faculty.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('This email is already registered. Please log in or use a different email.')

class DepartmentForm(FlaskForm):
    department_code = StringField('Department Code', validators=[DataRequired(), Length(max=20)])
    department_name = StringField('Department Name', validators=[DataRequired(), Length(max=100)])
    hod_name = StringField('HOD Name', validators=[Optional(), Length(max=100)])
    intake_capacity = IntegerField('Intake Capacity', default=120)
    submit = SubmitField('Save Department')

class SubjectForm(FlaskForm):
    subject_code = StringField('Subject Code', validators=[DataRequired(), Length(max=20)])
    subject_name = StringField('Subject Name', validators=[DataRequired(), Length(max=100)])
    department_id = SelectField('Department', coerce=int, validators=[DataRequired()])
    semester = SelectField('Semester', coerce=int, choices=[(i, f'Semester {i}') for i in range(1, 9)], validators=[DataRequired()])
    credits = IntegerField('Credits', default=4)
    subject_type = SelectField('Subject Type', choices=[('Theory', 'Theory'), ('Lab', 'Lab'), ('Seminar', 'Seminar'), ('Project', 'Project')], default='Theory')
    submit = SubmitField('Save Subject')

class StudentForm(FlaskForm):
    roll_number = StringField('Roll Number', validators=[DataRequired(), Length(max=30)])
    full_name = StringField('Full Name', validators=[DataRequired(), Length(max=100)])
    gender = SelectField('Gender', choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], validators=[DataRequired()])
    date_of_birth = DateField('Date of Birth', format='%Y-%m-%d', validators=[DataRequired()])
    department_id = SelectField('Department', coerce=int, validators=[DataRequired()])
    year = SelectField('Year', choices=[('1st Year', '1st Year'), ('2nd Year', '2nd Year'), ('3rd Year', '3rd Year'), ('4th Year', '4th Year')], validators=[DataRequired()])
    semester = SelectField('Semester', coerce=int, choices=[(i, f'Semester {i}') for i in range(1, 9)], validators=[DataRequired()])
    section = SelectField('Section', choices=[('A', 'Section A'), ('B', 'Section B'), ('C', 'Section C')], default='A')
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    phone_number = StringField('Phone Number', validators=[Optional(), Length(max=15)])
    address = TextAreaField('Address', validators=[Optional()])
    parent_name = StringField('Parent/Guardian Name', validators=[Optional(), Length(max=100)])
    parent_phone = StringField('Parent Phone Number', validators=[Optional(), Length(max=15)])
    photo = FileField('Student Photo', validators=[FileAllowed(['jpg', 'png', 'jpeg', 'webp'], 'Images only!')])
    submit = SubmitField('Save Student')

class FacultyProfileForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired(), Length(max=100)])
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    phone = StringField('Phone Number', validators=[Optional(), Length(max=15)])
    designation = StringField('Designation', validators=[DataRequired()])
    department = StringField('Department', validators=[DataRequired()])
    photo = FileField('Update Profile Picture', validators=[FileAllowed(['jpg', 'png', 'jpeg', 'webp'], 'Images only!')])
    submit = SubmitField('Update Profile')
