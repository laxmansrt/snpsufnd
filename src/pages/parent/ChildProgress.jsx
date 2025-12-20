import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI } from '../../services/attendanceService';
import { marksAPI } from '../../services/marksService';
import {
    BookOpen,
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Award,
    FileText
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import clsx from 'clsx';
import LoadingSpinner from '../../components/LoadingSpinner';

const ChildProgress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attendanceReport, setAttendanceReport] = useState(null);
    const [marks, setMarks] = useState([]);
    const [activeTab, setActiveTab] = useState('academics');

    useEffect(() => {
        if (user?.parentData?.childUsn) {
            fetchProgressData();
        }
    }, [user]);

    const fetchProgressData = async () => {
        try {
            setLoading(true);
            const usn = user.parentData.childUsn;

            // Fetch Attendance & Marks in parallel
            const [attData, marksData] = await Promise.all([
                attendanceAPI.getAttendanceReport({ studentUsn: usn }),
                marksAPI.getMarks({ studentUsn: usn })
            ]);

            setAttendanceReport(attData);
            setMarks(marksData);
        } catch (error) {
            console.error('Error fetching progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Child Progress</h1>
                    <p className="text-gray-400">
                        Academic performance and attendance for <span className="text-[#d4af37] font-semibold">{user?.parentData?.childName}</span>
                    </p>
                </div>
                <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('academics')}
                        className={clsx(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === 'academics' ? "bg-[#d4af37] text-[#111827]" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Academics
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={clsx(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === 'attendance' ? "bg-[#d4af37] text-[#111827]" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Attendance
                    </button>
                </div>
            </div>

            {activeTab === 'academics' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Marks Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="text-[#d4af37]" size={20} />
                                Subject-wise Performance
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={marks}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                            cursor={{ fill: '#374151' }}
                                        />
                                        <Bar dataKey="obtainedMarks" name="Marks Obtained" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Detailed Marks Table */}
                        <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-700">
                                <h3 className="text-lg font-bold text-white">Detailed Results</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Type</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Marks</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {marks.map((m, index) => (
                                            <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-white font-medium">{m.subject}</td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-400">{m.examType}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-white font-bold">{m.obtainedMarks}</span>
                                                    <span className="text-gray-500 text-xs ml-1">/ {m.maxMarks}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={clsx(
                                                        "px-2 py-1 rounded text-xs font-bold",
                                                        m.obtainedMarks >= 80 ? "bg-green-500/20 text-green-400" :
                                                            m.obtainedMarks >= 60 ? "bg-blue-500/20 text-blue-400" :
                                                                "bg-yellow-500/20 text-yellow-400"
                                                    )}>
                                                        {m.obtainedMarks >= 90 ? 'A+' : m.obtainedMarks >= 80 ? 'A' : m.obtainedMarks >= 70 ? 'B+' : 'B'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Academic Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#d4af37]/20 to-transparent p-6 rounded-xl border border-[#d4af37]/30 shadow-lg">
                            <Award className="text-[#d4af37] mb-4" size={32} />
                            <p className="text-gray-400 text-sm">Overall CGPA</p>
                            <h2 className="text-4xl font-bold text-white mt-1">
                                {(marks.reduce((acc, m) => acc + (m.obtainedMarks / m.maxMarks), 0) / (marks.length || 1) * 10).toFixed(2)}
                            </h2>
                            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                                <TrendingUp size={16} />
                                <span>Top 15% of class</span>
                            </div>
                        </div>

                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h4 className="text-white font-semibold mb-4">Quick Insights</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Strongest Subject</p>
                                        <p className="text-sm text-white font-medium">
                                            {marks.length > 0 ? marks.reduce((prev, current) => (prev.obtainedMarks > current.obtainedMarks) ? prev : current).subject : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Total Credits Earned</p>
                                        <p className="text-sm text-white font-medium">24 / 26</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Attendance Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <p className="text-gray-400 text-sm">Overall Attendance</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{attendanceReport?.stats?.percentage}%</h3>
                            <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                                <div
                                    className="bg-[#d4af37] h-1.5 rounded-full"
                                    style={{ width: `${attendanceReport?.stats?.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <p className="text-gray-400 text-sm">Total Classes</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{attendanceReport?.stats?.total}</h3>
                        </div>
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <p className="text-gray-400 text-sm">Present</p>
                            <h3 className="text-3xl font-bold text-green-400 mt-1">{attendanceReport?.stats?.present}</h3>
                        </div>
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                            <p className="text-gray-400 text-sm">Absent</p>
                            <h3 className="text-3xl font-bold text-red-400 mt-1">{attendanceReport?.stats?.absent}</h3>
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-lg font-bold text-white">Recent Attendance Logs</h3>
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
                                    {attendanceReport?.records?.slice(0, 10).map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white font-medium">{record.subject}</td>
                                            <td className="px-6 py-4 text-center">
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
            )}
        </div>
    );
};

export default ChildProgress;
