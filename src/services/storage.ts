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

export const defaultDemoAccounts: RegisteredAccount[] = [
  {
    user: initialFaculty, // rajesh.sharma@college.edu
    passwordHash: 'Faculty@123',
  },
  {
    user: {
      id: 2,
      fullName: 'Dr. Vikram Varma',
      email: 'vikram.varma@college.edu',
      phone: '+91 98111 22233',
      designation: 'Professor & HOD',
      department: 'Electronics & Communication Engg',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
    passwordHash: 'Faculty@123',
  },
  {
    user: {
      id: 3,
      fullName: 'System Administrator',
      email: 'admin@college.edu',
      phone: '+91 99999 88888',
      designation: 'System Administrator',
      department: 'Computer Science & Engineering',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    },
    passwordHash: 'Admin@1234',
  },
];

export const storageService = {
  getAccounts(): RegisteredAccount[] {
    const data = localStorage.getItem(KEYS.ACCOUNTS);
    if (!data) {
      localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(defaultDemoAccounts));
      return defaultDemoAccounts;
    }
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(defaultDemoAccounts));
    return defaultDemoAccounts;
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

  findAccount(identifier: string): RegisteredAccount | undefined {
    const accounts = this.getAccounts();
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, ''); // Digits only for phone matching

    return accounts.find(a => {
      const emailMatch = a.user.email.toLowerCase() === clean;
      const phoneClean = a.user.phone ? a.user.phone.toLowerCase() : '';
      const phoneDigits = phoneClean.replace(/\D/g, '');
      
      const phoneExactMatch = phoneClean === clean;
      const phoneDigitsMatch = cleanDigits.length >= 7 && phoneDigits.length >= 7 && (phoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(phoneDigits));

      return emailMatch || phoneExactMatch || phoneDigitsMatch;
    });
  },

  updatePassword(identifier: string, newPasswordHash: string): boolean {
    const accounts = this.getAccounts();
    const account = this.findAccount(identifier);
    if (!account) return false;

    const updatedAccounts = accounts.map(a => {
      if (a.user.email.toLowerCase() === account.user.email.toLowerCase()) {
        return { ...a, passwordHash: newPasswordHash };
      }
      return a;
    });

    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));
    return true;
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
