import { Department, Subject, Student, FacultyUser, AttendanceSession, ActivityLog } from '../types';

export const initialFaculty: FacultyUser = {
  id: 1,
  fullName: 'Dr. Rajesh Sharma',
  email: 'rajesh.sharma@college.edu',
  phone: '+91 9876543210',
  designation: 'Professor & HOD',
  department: 'Computer Science & Engineering',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
};

export const initialDepartments: Department[] = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering', hodName: 'Dr. Rajesh Sharma', intakeCapacity: 180, createdAt: '2026-01-10' },
  { id: 2, code: 'ECE', name: 'Electronics & Communication Engg', hodName: 'Dr. Vikram Varma', intakeCapacity: 120, createdAt: '2026-01-10' },
  { id: 3, code: 'ME', name: 'Mechanical Engineering', hodName: 'Dr. Suresh Kumar', intakeCapacity: 90, createdAt: '2026-01-10' },
  { id: 4, code: 'EEE', name: 'Electrical & Electronics Engg', hodName: 'Dr. Meena Iyer', intakeCapacity: 60, createdAt: '2026-01-10' },
];

export const initialSubjects: Subject[] = [
  { id: 1, code: 'CS701', name: 'AI & Machine Learning', departmentId: 1, departmentCode: 'CSE', semester: 7, credits: 4, type: 'Theory' },
  { id: 2, code: 'CS702', name: 'Cloud Computing', departmentId: 1, departmentCode: 'CSE', semester: 7, credits: 3, type: 'Theory' },
  { id: 3, code: 'CS703', name: 'Compiler Design', departmentId: 1, departmentCode: 'CSE', semester: 7, credits: 4, type: 'Theory' },
  { id: 4, code: 'CS791', name: 'AI & ML Lab', departmentId: 1, departmentCode: 'CSE', semester: 7, credits: 2, type: 'Lab' },
  { id: 5, code: 'EC701', name: 'VLSI Design', departmentId: 2, departmentCode: 'ECE', semester: 7, credits: 4, type: 'Theory' },
  { id: 6, code: 'EC702', name: 'Wireless Communication', departmentId: 2, departmentCode: 'ECE', semester: 7, credits: 3, type: 'Theory' },
  { id: 7, code: 'ME501', name: 'Thermodynamics', departmentId: 3, departmentCode: 'ME', semester: 5, credits: 4, type: 'Theory' },
];

export const initialStudents: Student[] = [
  {
    id: 1,
    rollNumber: '210101',
    fullName: 'Aarav Patel',
    gender: 'Male',
    dateOfBirth: '2003-05-14',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'aarav.patel@student.edu',
    phoneNumber: '+91 9123456780',
    address: '12 Park Street, Tech Zone, City',
    parentName: 'Ramesh Patel',
    parentPhone: '+91 9811122233',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    rollNumber: '210102',
    fullName: 'Ananya Deshmukh',
    gender: 'Female',
    dateOfBirth: '2003-08-22',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'ananya.d@student.edu',
    phoneNumber: '+91 9123456781',
    address: '45 Green Park, Block B',
    parentName: 'Suresh Deshmukh',
    parentPhone: '+91 9811122234',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 3,
    rollNumber: '210103',
    fullName: 'Rohan Gupta',
    gender: 'Male',
    dateOfBirth: '2002-11-10',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'rohan.g@student.edu',
    phoneNumber: '+91 9123456782',
    address: '89 Station Road, Sector 4',
    parentName: 'Mahesh Gupta',
    parentPhone: '+91 9811122235',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 4,
    rollNumber: '210104',
    fullName: 'Priya Sharma',
    gender: 'Female',
    dateOfBirth: '2003-02-19',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'priya.s@student.edu',
    phoneNumber: '+91 9123456783',
    address: '102 Lake View Apartments',
    parentName: 'Vinod Sharma',
    parentPhone: '+91 9811122236',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 5,
    rollNumber: '210105',
    fullName: 'Vikram Singh',
    gender: 'Male',
    dateOfBirth: '2003-07-04',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'vikram.s@student.edu',
    phoneNumber: '+91 9123456784',
    address: '56 Civil Lines, City',
    parentName: 'Harpreet Singh',
    parentPhone: '+91 9811122237',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 6,
    rollNumber: '210106',
    fullName: 'Sneha Kulkarni',
    gender: 'Female',
    dateOfBirth: '2003-09-30',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'sneha.k@student.edu',
    phoneNumber: '+91 9123456785',
    address: '77 Ring Road, North Enclave',
    parentName: 'Prakash Kulkarni',
    parentPhone: '+91 9811122238',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 7,
    rollNumber: '210107',
    fullName: 'Aditya Verma',
    gender: 'Male',
    dateOfBirth: '2003-01-15',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'aditya.v@student.edu',
    phoneNumber: '+91 9123456786',
    address: '23 Sunrise Colony',
    parentName: 'Sunil Verma',
    parentPhone: '+91 9811122239',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 8,
    rollNumber: '210108',
    fullName: 'Kavya Nair',
    gender: 'Female',
    dateOfBirth: '2003-12-05',
    departmentId: 1,
    departmentCode: 'CSE',
    year: '4th Year',
    semester: 7,
    section: 'A',
    email: 'kavya.n@student.edu',
    phoneNumber: '+91 9123456787',
    address: '90 Palm Grove Estate',
    parentName: 'Gopal Nair',
    parentPhone: '+91 9811122240',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  }
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const prevDay = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

export const initialAttendanceSessions: AttendanceSession[] = [
  {
    id: 1,
    departmentId: 1,
    departmentCode: 'CSE',
    semester: 7,
    section: 'A',
    subjectId: 1,
    subjectCode: 'CS701',
    subjectName: 'AI & Machine Learning',
    facultyId: 1,
    facultyName: 'Dr. Rajesh Sharma',
    date: today,
    records: [
      { studentId: 1, status: 'Present', remarks: 'On time' },
      { studentId: 2, status: 'Present', remarks: 'On time' },
      { studentId: 3, status: 'Absent', remarks: 'Sick leave' },
      { studentId: 4, status: 'Present', remarks: 'On time' },
      { studentId: 5, status: 'Late', remarks: '10 mins late' },
      { studentId: 6, status: 'Present', remarks: 'On time' },
      { studentId: 7, status: 'Present', remarks: 'On time' },
      { studentId: 8, status: 'Absent', remarks: 'Uninformed' },
    ]
  },
  {
    id: 2,
    departmentId: 1,
    departmentCode: 'CSE',
    semester: 7,
    section: 'A',
    subjectId: 2,
    subjectCode: 'CS702',
    subjectName: 'Cloud Computing',
    facultyId: 1,
    facultyName: 'Dr. Rajesh Sharma',
    date: yesterday,
    records: [
      { studentId: 1, status: 'Present' },
      { studentId: 2, status: 'Present' },
      { studentId: 3, status: 'Present' },
      { studentId: 4, status: 'Present' },
      { studentId: 5, status: 'Present' },
      { studentId: 6, status: 'Absent' },
      { studentId: 7, status: 'Present' },
      { studentId: 8, status: 'Absent' },
    ]
  },
  {
    id: 3,
    departmentId: 1,
    departmentCode: 'CSE',
    semester: 7,
    section: 'A',
    subjectId: 3,
    subjectCode: 'CS703',
    subjectName: 'Compiler Design',
    facultyId: 1,
    facultyName: 'Dr. Rajesh Sharma',
    date: prevDay,
    records: [
      { studentId: 1, status: 'Present' },
      { studentId: 2, status: 'Present' },
      { studentId: 3, status: 'Absent' },
      { studentId: 4, status: 'Present' },
      { studentId: 5, status: 'Late' },
      { studentId: 6, status: 'Present' },
      { studentId: 7, status: 'Present' },
      { studentId: 8, status: 'Absent' },
    ]
  }
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: 'Just now',
    title: 'Attendance Saved',
    description: 'Marked attendance for CSE Sem 7 Sec A - AI & Machine Learning',
    type: 'attendance'
  },
  {
    id: 'act-2',
    timestamp: '2 hours ago',
    title: 'Student Profile Updated',
    description: 'Updated records for Aarav Patel (Roll: 210101)',
    type: 'student'
  },
  {
    id: 'act-3',
    timestamp: 'Yesterday',
    title: 'New Subject Added',
    description: 'Added CS791 - AI & ML Lab (2 Credits) under CSE',
    type: 'subject'
  },
  {
    id: 'act-4',
    timestamp: '2 days ago',
    title: 'Faculty Logged In',
    description: 'Dr. Rajesh Sharma authenticated successfully',
    type: 'auth'
  }
];
