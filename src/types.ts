export type Gender = 'Male' | 'Female' | 'Other';
export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type Section = 'A' | 'B' | 'C';
export type SubjectType = 'Theory' | 'Lab' | 'Seminar' | 'Project';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface FacultyUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  photo: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  hodName: string;
  intakeCapacity: number;
  createdAt: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  departmentCode?: string;
  semester: number;
  credits: number;
  type: SubjectType;
}

export interface Student {
  id: number;
  rollNumber: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  departmentId: number;
  departmentCode?: string;
  year: Year;
  semester: number;
  section: Section;
  email: string;
  phoneNumber: string;
  address: string;
  parentName: string;
  parentPhone: string;
  photo: string;
}

export interface AttendanceRecordDetail {
  studentId: number;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSession {
  id: number;
  departmentId: number;
  departmentCode: string;
  semester: number;
  section: Section;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  facultyId: number;
  facultyName: string;
  date: string;
  records: AttendanceRecordDetail[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'attendance' | 'student' | 'department' | 'subject' | 'auth';
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
