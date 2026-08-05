import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  X,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { Student, Department, Year, Section, Gender } from '../types';

interface StudentManagerProps {
  students: Student[];
  departments: Department[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: number) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  departments,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<number | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<Year | 'all'>('all');
  const [semFilter, setSemFilter] = useState<number | 'all'>('all');
  const [secFilter, setSecFilter] = useState<Section | 'all'>('all');

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Form Fields
  const [rollNumber, setRollNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [dob, setDob] = useState('2003-01-01');
  const [departmentId, setDepartmentId] = useState<number>(departments[0]?.id || 1);
  const [year, setYear] = useState<Year>('4th Year');
  const [semester, setSemester] = useState<number>(7);
  const [section, setSection] = useState<Section>('A');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const openAddModal = () => {
    setEditingStudent(null);
    setRollNumber(`2101${Math.floor(10 + Math.random() * 90)}`);
    setFullName('');
    setGender('Male');
    setDob('2003-05-15');
    setDepartmentId(departments[0]?.id || 1);
    setYear('4th Year');
    setSemester(7);
    setSection('A');
    setEmail('');
    setPhone('+91 ');
    setAddress('');
    setParentName('');
    setParentPhone('+91 ');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
    setShowFormModal(true);
  };

  const openEditModal = (st: Student) => {
    setEditingStudent(st);
    setRollNumber(st.rollNumber);
    setFullName(st.fullName);
    setGender(st.gender);
    setDob(st.dateOfBirth);
    setDepartmentId(st.departmentId);
    setYear(st.year);
    setSemester(st.semester);
    setSection(st.section);
    setEmail(st.email);
    setPhone(st.phoneNumber);
    setAddress(st.address);
    setParentName(st.parentName);
    setParentPhone(st.parentPhone);
    setPhotoUrl(st.photo);
    setShowFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !fullName || !email) return;

    const deptObj = departments.find(d => d.id === Number(departmentId));

    if (editingStudent) {
      onEditStudent({
        ...editingStudent,
        rollNumber,
        fullName,
        gender,
        dateOfBirth: dob,
        departmentId: Number(departmentId),
        departmentCode: deptObj?.code || 'CSE',
        year,
        semester: Number(semester),
        section,
        email,
        phoneNumber: phone,
        address,
        parentName,
        parentPhone,
        photo: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      });
    } else {
      onAddStudent({
        rollNumber,
        fullName,
        gender,
        dateOfBirth: dob,
        departmentId: Number(departmentId),
        departmentCode: deptObj?.code || 'CSE',
        year,
        semester: Number(semester),
        section,
        email,
        phoneNumber: phone,
        address,
        parentName,
        parentPhone,
        photo: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      });
    }

    setShowFormModal(false);
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'all' || st.departmentId === deptFilter;
    const matchesYear = yearFilter === 'all' || st.year === yearFilter;
    const matchesSem = semFilter === 'all' || st.semester === semFilter;
    const matchesSec = secFilter === 'all' || st.section === secFilter;

    return matchesSearch && matchesDept && matchesYear && matchesSem && matchesSec;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Student Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain complete B.Tech student directory, roll numbers, photos, guardian contacts, and batch allocations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Multi-Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, roll no, email..."
            className="w-full pl-10 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Dept Filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.code}</option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value as any)}
          className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
        >
          <option value="all">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        {/* Sem Filter */}
        <select
          value={semFilter}
          onChange={(e) => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
        >
          <option value="all">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        {/* Sec Filter */}
        <select
          value={secFilter}
          onChange={(e) => setSecFilter(e.target.value as any)}
          className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
        >
          <option value="all">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>
      </div>

      {/* Student List Grid / Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="p-4">Student</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Department</th>
                <th className="p-4">Year & Sem</th>
                <th className="p-4">Section</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No student records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photo}
                          alt={st.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{st.fullName}</p>
                          <p className="text-[10px] text-slate-400">{st.gender} &bull; DOB: {st.dateOfBirth}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{st.rollNumber}</td>
                    <td className="p-4 font-medium">{st.departmentCode || 'CSE'}</td>
                    <td className="p-4">{st.year} &bull; Sem {st.semester}</td>
                    <td className="p-4 font-bold">{st.section}</td>
                    <td className="p-4">
                      <p className="text-slate-700 dark:text-slate-300">{st.email}</p>
                      <p className="text-[10px] text-slate-400">{st.phoneNumber}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(st)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(st)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(st.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student View Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Student Academic Dossier</span>
              </h3>
              <button onClick={() => setViewingStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-slate-700/50">
                <img src={viewingStudent.photo} alt={viewingStudent.fullName} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20" />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{viewingStudent.fullName}</h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Roll No: {viewingStudent.rollNumber}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {viewingStudent.departmentCode} &bull; {viewingStudent.year} &bull; Sem {viewingStudent.semester} &bull; Sec {viewingStudent.section}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
                <div className="space-y-2">
                  <p><strong className="text-slate-900 dark:text-slate-100">Gender:</strong> {viewingStudent.gender}</p>
                  <p><strong className="text-slate-900 dark:text-slate-100">DOB:</strong> {viewingStudent.dateOfBirth}</p>
                  <p><strong className="text-slate-900 dark:text-slate-100">Email:</strong> {viewingStudent.email}</p>
                  <p><strong className="text-slate-900 dark:text-slate-100">Phone:</strong> {viewingStudent.phoneNumber}</p>
                </div>
                <div className="space-y-2">
                  <p><strong className="text-slate-900 dark:text-slate-100">Parent/Guardian:</strong> {viewingStudent.parentName || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-slate-100">Parent Contact:</strong> {viewingStudent.parentPhone || 'N/A'}</p>
                  <p><strong className="text-slate-900 dark:text-slate-100">Address:</strong> {viewingStudent.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Add/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as Section)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent/Guardian Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {editingStudent ? 'Update Student' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
