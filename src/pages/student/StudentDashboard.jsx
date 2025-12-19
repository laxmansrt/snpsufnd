import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI as attendanceService } from '../../services/attendanceService';
import { marksAPI } from '../../services/marksService';
import { Users, BookOpen, Calendar, DollarSign, AlertTriangle, TrendingUp, Book } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [attendanceStats, setAttendanceStats] = useState({ percentage: 0, total: 0, present: 0 });
    const [marksData, setMarksData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Data for Weekly Attendance (since real API gives aggregate stats usually, or we'd need complex logic to map daily)
    // For now, we'll keep the weekly chart static or try to map if we fetch daily records.
    // Let's fetch daily records for the current week if possible, otherwise keep mock for the chart but real for the stat card.
    const [weeklyAttendance, setWeeklyAttendance] = useState([
        { name: 'Mon', present: 1 },
        { name: 'Tue', present: 1 },
        { name: 'Wed', present: 1 },
        { name: 'Thu', present: 1 },
        { name: 'Fri', present: 1 },
        { name: 'Sat', present: 0 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.studentData?.usn) {
                try {
                    // Fetch Attendance
                    const attendanceReport = await attendanceService.getAttendanceReport({
                        studentUsn: user.studentData.usn
                    });
                    setAttendanceStats(attendanceReport.stats);

                    // Fetch Marks
                    const marks = await marksAPI.getMarks({
                        studentUsn: user.studentData.usn
                    });

                    // Transform marks for chart (group by subject, take average or latest)
                    // Simple transformation: just take the latest marks for unique subjects
                    const uniqueSubjects = {};
                    marks.forEach(m => {
                        if (!uniqueSubjects[m.subject] || new Date(m.date) > new Date(uniqueSubjects[m.subject].date)) {
                            uniqueSubjects[m.subject] = m;
                        }
                    });

                    const chartData = Object.values(uniqueSubjects).map(m => ({
                        subject: m.subject,
                        marks: (m.obtainedMarks / m.maxMarks) * 100 // Normalize to percentage
                    }));
                    setMarksData(chartData);

                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Student Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user?.name}! Here's your academic overview.</p>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Alert Section */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-red-800">Fee Payment Due</h3>
                    <p className="text-red-600 text-sm mt-1">
                        You have an outstanding balance of ₹45,000 for the current semester. Please clear it before 30th Nov to avoid late fees.
                    </p>
                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard/fees')}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Pay Now
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/fees')}
                            className="px-4 py-2 bg-white text-red-600 text-sm font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Attendance Card */}
                <div className="bg-[#1e293b] rounded-xl p-6 text-white shadow-lg border border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Calendar size={64} />
                    </div>
                    <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                        <Calendar size={24} />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{attendanceStats.percentage}%</h3>
                    <p className="text-gray-400 text-sm">Total Attendance</p>
                    <div className={`mt-4 inline-block px-2 py-1 ${parseFloat(attendanceStats.percentage) >= 75 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} text-xs rounded font-bold`}>
                        {parseFloat(attendanceStats.percentage) >= 75 ? 'Good Standing' : 'Low Attendance'}
                    </div>
                </div>

                {/* CGPA Card */}
                <div className="bg-[#1e293b] rounded-xl p-6 text-white shadow-lg border border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={64} />
                    </div>
                    <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                        <TrendingUp size={24} />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{user?.studentData?.cgpa || 'N/A'}</h3>
                    <p className="text-gray-400 text-sm">Current CGPA</p>
                    <div className="mt-4 inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded font-bold">
                        Semester {user?.studentData?.semester || 'Current'}
                    </div>
                </div>

                {/* Library Card */}
                <div className="bg-[#1e293b] rounded-xl p-6 text-white shadow-lg border border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <BookOpen size={64} />
                    </div>
                    <div className="bg-amber-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-amber-400">
                        <Book size={24} />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">3</h3>
                    <p className="text-gray-400 text-sm">Books Issued</p>
                    <div className="mt-4 inline-block px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded font-bold">
                        Return in 2 days
                    </div>
                </div>

                {/* Fee Card */}
                <div className="bg-[#1e293b] rounded-xl p-6 text-white shadow-lg border border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign size={64} />
                    </div>
                    <div className="bg-red-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-red-400">
                        <DollarSign size={24} />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">₹45k</h3>
                    <p className="text-gray-400 text-sm">Pending Dues</p>
                    <div className="mt-4 inline-block px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded font-bold">
                        Due Soon
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Subject Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marksData.length > 0 ? marksData : [{ subject: 'No Data', marks: 0 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="subject" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="marks" fill="#d4af37" radius={[4, 4, 0, 0]} name="Marks %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Attendance */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Weekly Attendance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyAttendance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" domain={[0, 1]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Status" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
