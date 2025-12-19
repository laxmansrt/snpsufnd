import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI } from '../services/attendanceService';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, Save, Download } from 'lucide-react';
import clsx from 'clsx';

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

            const attendanceData = students.map(student => ({
                studentUsn: student.studentData.usn,
                studentName: student.name,
                status: attendance[student.studentData.usn] || 'present',
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'absent':
                return <XCircle className="text-red-500" size={20} />;
            case 'late':
                return <Clock className="text-yellow-500" size={20} />;
            case 'excused':
                return <AlertCircle className="text-blue-500" size={20} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-500/20 border-green-500 text-green-400';
            case 'absent':
                return 'bg-red-500/20 border-red-500 text-red-400';
            case 'late':
                return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
            case 'excused':
                return 'bg-blue-500/20 border-blue-500 text-blue-400';
            default:
                return 'bg-gray-800 border-gray-700 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Attendance Management</h1>
                    <p className="text-gray-400">Track and manage student attendance</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={20} />
                    <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Tabs */}
            {(user?.role === 'faculty' || user?.role === 'admin') && (
                <div className="flex gap-2 bg-gray-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('mark')}
                        className={clsx(
                            'px-6 py-2 rounded-md font-medium transition-all',
                            activeTab === 'mark'
                                ? 'bg-[#d4af37] text-[#111827]'
                                : 'text-gray-400 hover:text-white'
                        )}
                    >
                        Mark Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('view')}
                        className={clsx(
                            'px-6 py-2 rounded-md font-medium transition-all',
                            activeTab === 'view'
                                ? 'bg-[#d4af37] text-[#111827]'
                                : 'text-gray-400 hover:text-white'
                        )}
                    >
                        View Reports
                    </button>
                </div>
            )}

            {/* Mark Attendance Tab */}
            {activeTab === 'mark' && (user?.role === 'faculty' || user?.role === 'admin') && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                >
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                >
                                    {subjects.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Student List */}
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading students...</div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No students found for this class</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-900">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">USN</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student Name</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Attendance Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {students.map((student) => (
                                                <tr key={student._id} className="hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                                                        {student.studentData.usn}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white font-medium">
                                                        {student.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            {['present', 'absent', 'late', 'excused'].map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => handleMarkAttendance(student.studentData.usn, status)}
                                                                    className={clsx(
                                                                        'px-4 py-2 rounded-lg border-2 font-medium capitalize text-sm transition-all',
                                                                        attendance[student.studentData.usn] === status
                                                                            ? getStatusColor(status)
                                                                            : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                                                                    )}
                                                                >
                                                                    {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveAttendance}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={20} />
                                    {saving ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* View Reports Tab */}
            {activeTab === 'view' && (
                <div className="space-y-6">
                    {/* Class Selector for Faculty/Admin in View Mode */}
                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Class to View Report</label>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    >
                                        {classes.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading report...</div>
                    ) : report ? (
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-green-400 text-sm font-medium">Present</span>
                                        <CheckCircle className="text-green-500" size={24} />
                                    </div>
                                    <div className="text-3xl font-bold text-white">{report.stats.present}</div>
                                </div>

                                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-red-400 text-sm font-medium">Absent</span>
                                        <XCircle className="text-red-500" size={24} />
                                    </div>
                                    <div className="text-3xl font-bold text-white">{report.stats.absent}</div>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-yellow-400 text-sm font-medium">Late</span>
                                        <Clock className="text-yellow-500" size={24} />
                                    </div>
                                    <div className="text-3xl font-bold text-white">{report.stats.late}</div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-blue-400 text-sm font-medium">Percentage</span>
                                        <Users className="text-blue-500" size={24} />
                                    </div>
                                    <div className="text-3xl font-bold text-white">{report.stats.percentage}%</div>
                                </div>
                            </div>

                            {/* Attendance History */}
                            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                <div className="p-6 border-b border-gray-700">
                                    <h3 className="text-xl font-bold text-white">Attendance History</h3>
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
                                            {report.records.map((record) => (
                                                <tr key={record._id} className="hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white">
                                                        {record.subject}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center items-center gap-2">
                                                            {getStatusIcon(record.status)}
                                                            <span className={clsx(
                                                                'capitalize font-medium',
                                                                record.status === 'present' && 'text-green-400',
                                                                record.status === 'absent' && 'text-red-400',
                                                                record.status === 'late' && 'text-yellow-400',
                                                                record.status === 'excused' && 'text-blue-400'
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
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-400">No attendance records found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
