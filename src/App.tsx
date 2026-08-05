import React, { useState, useEffect } from 'react';
import { storageService } from './services/storage';
import {
  FacultyUser,
  Department,
  Subject,
  Student,
  AttendanceSession,
  ActivityLog,
  ToastMessage
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DepartmentManager } from './components/DepartmentManager';
import { SubjectManager } from './components/SubjectManager';
import { StudentManager } from './components/StudentManager';
import { AttendanceModule } from './components/AttendanceModule';
import { AttendanceLogs } from './components/AttendanceLogs';
import { ReportsModule } from './components/ReportsModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { FacultyProfile } from './components/FacultyProfile';
import { LoginPage } from './components/LoginPage';
import { ToastContainer } from './components/Toast';
import { ErrorPage } from './components/ErrorPages';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storageService.isAuthenticated());
  const [faculty, setFaculty] = useState<FacultyUser>(storageService.getFaculty());
  const [departments, setDepartments] = useState<Department[]>(storageService.getDepartments());
  const [subjects, setSubjects] = useState<Subject[]>(storageService.getSubjects());
  const [students, setStudents] = useState<Student[]>(storageService.getStudents());
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(storageService.getAttendance());
  const [activities, setActivities] = useState<ActivityLog[]>(storageService.getActivities());

  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(storageService.getTheme() === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      storageService.setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      storageService.setTheme('light');
    }
  }, [darkMode]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      message,
    };
    setToasts((prev) => [newToast, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Department CRUD Handlers
  const handleAddDepartment = (newDeptData: Omit<Department, 'id' | 'createdAt'>) => {
    const newDept: Department = {
      ...newDeptData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...departments, newDept];
    setDepartments(updated);
    storageService.saveDepartments(updated);
    storageService.addActivity('Department Added', `Created ${newDept.name} (${newDept.code})`, 'department');
    setActivities(storageService.getActivities());
    showToast(`Department "${newDept.code}" created successfully!`, 'success');
  };

  const handleEditDepartment = (updatedDept: Department) => {
    const updated = departments.map((d) => (d.id === updatedDept.id ? updatedDept : d));
    setDepartments(updated);
    storageService.saveDepartments(updated);
    showToast(`Department "${updatedDept.code}" updated!`, 'success');
  };

  const handleDeleteDepartment = (id: number) => {
    const updated = departments.filter((d) => d.id !== id);
    setDepartments(updated);
    storageService.saveDepartments(updated);
    showToast('Department deleted.', 'warning');
  };

  // Subject CRUD Handlers
  const handleAddSubject = (newSubjData: Omit<Subject, 'id'>) => {
    const newSubj: Subject = {
      ...newSubjData,
      id: Date.now(),
    };
    const updated = [...subjects, newSubj];
    setSubjects(updated);
    storageService.saveSubjects(updated);
    storageService.addActivity('Subject Added', `Created ${newSubj.code} - ${newSubj.name}`, 'subject');
    setActivities(storageService.getActivities());
    showToast(`Subject "${newSubj.code}" added successfully!`, 'success');
  };

  const handleEditSubject = (updatedSubj: Subject) => {
    const updated = subjects.map((s) => (s.id === updatedSubj.id ? updatedSubj : s));
    setSubjects(updated);
    storageService.saveSubjects(updated);
    showToast(`Subject "${updatedSubj.code}" updated!`, 'success');
  };

  const handleDeleteSubject = (id: number) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    storageService.saveSubjects(updated);
    showToast('Subject deleted.', 'warning');
  };

  // Student CRUD Handlers
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: Date.now(),
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    storageService.saveStudents(updated);
    storageService.addActivity('Student Enrolled', `Registered ${newStudent.fullName} (${newStudent.rollNumber})`, 'student');
    setActivities(storageService.getActivities());
    showToast(`Student "${newStudent.fullName}" enrolled!`, 'success');
  };

  const handleEditStudent = (updatedStudent: Student) => {
    const updated = students.map((st) => (st.id === updatedStudent.id ? updatedStudent : st));
    setStudents(updated);
    storageService.saveStudents(updated);
    showToast(`Student record for ${updatedStudent.fullName} updated!`, 'success');
  };

  const handleDeleteStudent = (id: number) => {
    const updated = students.filter((st) => st.id !== id);
    setStudents(updated);
    storageService.saveStudents(updated);
    showToast('Student record removed.', 'warning');
  };

  // Attendance Handlers
  const handleSaveAttendance = (newSessionData: Omit<AttendanceSession, 'id'>) => {
    const newSession: AttendanceSession = {
      ...newSessionData,
      id: Date.now(),
    };
    const updated = [newSession, ...attendanceSessions];
    setAttendanceSessions(updated);
    storageService.saveAttendance(updated);
    storageService.addActivity(
      'Attendance Saved',
      `Marked ${newSession.departmentCode} Sem ${newSession.semester} ${newSession.subjectCode}`,
      'attendance'
    );
    setActivities(storageService.getActivities());
    showToast('Attendance recorded and committed to database!', 'success');
  };

  const handleUpdateAttendance = (updatedSession: AttendanceSession) => {
    const updated = attendanceSessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setAttendanceSessions(updated);
    storageService.saveAttendance(updated);
    showToast('Attendance records updated!', 'success');
  };

  // Authentication Handlers
  const handleLoginSuccess = (user: FacultyUser) => {
    setFaculty(user);
    storageService.saveFaculty(user);
    setIsAuthenticated(true);
    storageService.setAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    storageService.setAuthenticated(false);
    showToast('Signed out of faculty account.', 'info');
  };

  // Faculty Profile Handler
  const handleUpdateFacultyProfile = (updatedFaculty: FacultyUser) => {
    setFaculty(updatedFaculty);
    storageService.saveFaculty(updatedFaculty);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onShowToast={showToast}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            faculty={faculty}
            departments={departments}
            subjects={subjects}
            students={students}
            attendanceSessions={attendanceSessions}
            activities={activities}
            onNavigate={setCurrentPage}
          />
        );
      case 'departments':
        return (
          <DepartmentManager
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteDepartment}
          />
        );
      case 'subjects':
        return (
          <SubjectManager
            subjects={subjects}
            departments={departments}
            onAddSubject={handleAddSubject}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        );
      case 'students':
        return (
          <StudentManager
            students={students}
            departments={departments}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'attendance':
        return (
          <AttendanceModule
            departments={departments}
            subjects={subjects}
            students={students}
            attendanceSessions={attendanceSessions}
            onSaveAttendance={handleSaveAttendance}
            onUpdateAttendance={handleUpdateAttendance}
          />
        );
      case 'attendance-logs':
        return (
          <AttendanceLogs
            attendanceSessions={attendanceSessions}
            departments={departments}
            subjects={subjects}
            onSelectSessionToEdit={(session) => {
              setCurrentPage('attendance');
            }}
          />
        );
      case 'reports':
        return (
          <ReportsModule
            departments={departments}
            subjects={subjects}
            students={students}
            attendanceSessions={attendanceSessions}
          />
        );
      case 'analytics':
        return (
          <AnalyticsModule
            departments={departments}
            subjects={subjects}
            students={students}
            attendanceSessions={attendanceSessions}
          />
        );
      case 'profile':
        return (
          <FacultyProfile
            faculty={faculty}
            onUpdateProfile={handleUpdateFacultyProfile}
            onShowToast={showToast}
          />
        );
      default:
        return <ErrorPage type="404" onHome={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased font-sans">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Responsive Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          faculty={faculty}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 font-medium">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>B.Tech Final Year Capstone Project &bull; Student Attendance Management System</span>
            </p>
            <p className="text-[11px]">Academic Year 2025-2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
