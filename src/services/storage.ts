import { Department, Subject, Student, FacultyUser, AttendanceSession, ActivityLog } from '../types';
import { initialDepartments, initialSubjects, initialStudents, initialFaculty, initialAttendanceSessions, initialActivities } from '../data/initialData';

const KEYS = {
  FACULTY: 'sams_faculty',
  DEPARTMENTS: 'sams_departments',
  SUBJECTS: 'sams_subjects',
  STUDENTS: 'sams_students',
  ATTENDANCE: 'sams_attendance',
  ACTIVITIES: 'sams_activities',
  THEME: 'sams_theme',
  AUTH: 'sams_is_authenticated',
  ACCOUNTS: 'sams_user_accounts',
};

export interface RegisteredAccount {
  user: FacultyUser;
  passwordHash: string;
}

export const storageService = {
  getAccounts(): RegisteredAccount[] {
    const data = localStorage.getItem(KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : [];
  },

  registerAccount(user: FacultyUser, passwordHash: string): void {
    const accounts = this.getAccounts();
    const existingIndex = accounts.findIndex(a => a.user.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      accounts[existingIndex] = { user, passwordHash };
    } else {
      accounts.push({ user, passwordHash });
    }
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  findAccount(email: string): RegisteredAccount | undefined {
    const accounts = this.getAccounts();
    return accounts.find(a => a.user.email.toLowerCase() === email.toLowerCase());
  },
  getFaculty(): FacultyUser {
    const data = localStorage.getItem(KEYS.FACULTY);
    return data ? JSON.parse(data) : initialFaculty;
  },

  saveFaculty(faculty: FacultyUser): void {
    localStorage.setItem(KEYS.FACULTY, JSON.stringify(faculty));
  },

  getDepartments(): Department[] {
    const data = localStorage.getItem(KEYS.DEPARTMENTS);
    return data ? JSON.parse(data) : initialDepartments;
  },

  saveDepartments(depts: Department[]): void {
    localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(depts));
  },

  getSubjects(): Subject[] {
    const data = localStorage.getItem(KEYS.SUBJECTS);
    return data ? JSON.parse(data) : initialSubjects;
  },

  saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getStudents(): Student[] {
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : initialStudents;
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },

  getAttendance(): AttendanceSession[] {
    const data = localStorage.getItem(KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : initialAttendanceSessions;
  },

  saveAttendance(sessions: AttendanceSession[]): void {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(sessions));
  },

  getActivities(): ActivityLog[] {
    const data = localStorage.getItem(KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : initialActivities;
  },

  addActivity(title: string, description: string, type: ActivityLog['type']): void {
    const current = this.getActivities();
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      title,
      description,
      type
    };
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify([newLog, ...current.slice(0, 19)]));
  },

  isAuthenticated(): boolean {
    const auth = localStorage.getItem(KEYS.AUTH);
    return auth === null ? true : JSON.parse(auth);
  },

  setAuthenticated(val: boolean): void {
    localStorage.setItem(KEYS.AUTH, JSON.stringify(val));
  },

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(KEYS.THEME, theme);
  }
};
