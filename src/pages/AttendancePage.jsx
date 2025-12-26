import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI } from '../services/attendanceService';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, Save, Download } from 'lucide-react';
import clsx from 'clsx';
import LoadingSpinner from '../components/LoadingSpinner';

const AttendancePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState((user?.role === 'faculty' || user?.role === 'admin') ? 'mark' : 'view');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('CSE - Sem 5');
    const [selectedSubject, setSelectedSubject] = useState('Database Management Systems');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [report, setReport] = useState(null);

    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([
        'Database Management Systems',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering',
        'Web Technologies',
    ]);

    // Load classes on mount
    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const data = await attendanceAPI.getClasses();
            setClasses(data);
            if (data.length > 0) {
                setSelectedClass(data[0]);
            }
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    };

    // Load students for selected class
    useEffect(() => {
        if (activeTab === 'mark' && selectedClass) {
            loadStudents();
        }
    }, [selectedClass, activeTab]);

    // Load report for student, parent, or class-wise for faculty/admin
    useEffect(() => {
        if (activeTab === 'view') {
            if (user?.role === 'student' || user?.role === 'parent') {
                const usn = user?.role === 'parent' ? user?.parentData?.childUsn : user?.studentData?.usn;
                if (usn) loadReport({ studentUsn: usn });
            } else if ((user?.role === 'faculty' || user?.role === 'admin') && selectedClass) {
                loadReport({ class: selectedClass });
            }
        }
    }, [activeTab, selectedClass]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await attendanceAPI.getStudentsForClass(selectedClass);
            setStudents(data);

            // Initialize attendance state
            const initialAttendance = {};
            data.forEach(student => {
                initialAttendance[student.studentData.usn] = 'present';
            });
            setAttendance(initialAttendance);
        } catch (error) {
            console.error('Error loading students:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadReport = async (filters) => {
        try {
            setLoading(true);
            const data = await attendanceAPI.getAttendanceReport(filters);
            setReport(data);
        } catch (error) {
            console.error('Error loading report:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = (usn, status) => {
        setAttendance(prev => ({
            ...prev,
            [usn]: status,
        }));
    };

    const handleSaveAttendance = async () => {
        try {
            setSaving(true);
            const attendanceData = Object.keys(attendance).map(usn => ({
                studentUsn: usn,
                status: attendance[usn],
            }));

            await attendanceAPI.markAttendance(
                selectedClass,
                selectedSubject,
                selectedDate,
                attendanceData
            );

            alert('Attendance marked successfully!');
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {user?.role === 'parent' ? "Child's Attendance" : "Attendance Management"}
                    </h1>
                    <p className="text-gray-400">
                        {user?.role === 'parent' ? "Monitor your child's daily attendance records." : "Track and manage student attendance across classes."}
                    </p>
                </div>
                <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                        <button
                            onClick={() => setActiveTab('mark')}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === 'mark' ? "bg-[#d4af37] text-[#111827]" : "text-gray-400 hover:text-white"
                            )}
                        >
                            Mark Attendance
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('view')}
                        className={clsx(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === 'view' ? "bg-[#d4af37] text-[#111827]" : "text-gray-400 hover:text-white"
                        )}
                    >
                        View Reports
                    </button>
                </div>
            </div>

            {activeTab === 'mark' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="text-[#d4af37]" size={20} />
                                Session Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Class</label>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    >
                                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    >
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveAttendance}
                            disabled={saving || students.length === 0}
                            className="w-full py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <LoadingSpinner size="sm" color="white" /> : <Save size={20} />}
                            {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>

                    {/* Student List */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="text-[#d4af37]" size={20} />
                                    Students ({students.length})
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const allPresent = {};
                                            students.forEach(s => allPresent[s.studentData.usn] = 'present');
                                            setAttendance(allPresent);
                                        }}
                                        className="text-xs font-medium text-green-400 hover:text-green-300"
                                    >
                                        Mark All Present
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">USN</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center">
                                                    <LoadingSpinner size="lg" className="mx-auto" />
                                                    <p className="mt-4 text-gray-400">Loading student list...</p>
                                                </td>
                                            </tr>
                                        ) : students.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                                                    No students found for the selected class.
                                                </td>
                                            </tr>
                                        ) : (
                                            students.map((student) => (
                                                <tr key={student._id} className="hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <span className="text-white font-medium">{student.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">
                                                        {student.studentData.usn}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleMarkAttendance(student.studentData.usn, 'present')}
                                                                className={clsx(
                                                                    "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                                                                    attendance[student.studentData.usn] === 'present'
                                                                        ? "bg-green-500 text-white shadow-lg shadow-green-900/20"
                                                                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                                                )}
                                                            >
                                                                Present
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAttendance(student.studentData.usn, 'absent')}
                                                                className={clsx(
                                                                    "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                                                                    attendance[student.studentData.usn] === 'absent'
                                                                        ? "bg-red-500 text-white shadow-lg shadow-red-900/20"
                                                                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                                                )}
                                                            >
                                                                Absent
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
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* View Reports Tab */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <LoadingSpinner size="xl" />
                            <p className="mt-4 text-gray-400">Generating report...</p>
                        </div>
                    ) : report ? (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                                    <p className="text-gray-400 text-sm">Overall Percentage</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{report.stats.percentage}%</h3>
                                    <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-[#d4af37] h-1.5 rounded-full"
                                            style={{ width: `${report.stats.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                                    <p className="text-gray-400 text-sm">Total Classes</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{report.stats.total}</h3>
                                </div>
                                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                                    <p className="text-gray-400 text-sm">Present</p>
                                    <h3 className="text-3xl font-bold text-green-400 mt-1">{report.stats.present}</h3>
                                </div>
                                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                                    <p className="text-gray-400 text-sm">Absent</p>
                                    <h3 className="text-3xl font-bold text-red-400 mt-1">{report.stats.absent}</h3>
                                </div>
                            </div>

                            {/* Detailed Logs */}
                            <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">Attendance Logs</h3>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                                        <Download size={16} />
                                        Export Report
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {report.records.map((record, index) => (
                                                <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-400">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white font-medium">
                                                        {record.subject}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center items-center gap-2">
                                                            {record.status === 'present' ? (
                                                                <CheckCircle className="text-green-500" size={18} />
                                                            ) : (
                                                                <XCircle className="text-red-500" size={18} />
                                                            )}
                                                            <span className={clsx(
                                                                "text-sm font-medium capitalize",
                                                                record.status === 'present' ? "text-green-400" : "text-red-400"
                                                            )}>
                                                                {record.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1e293b] p-12 rounded-xl border border-gray-700 text-center">
                            <AlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
                            <p className="text-gray-400">Select a class or student to view attendance reports.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
