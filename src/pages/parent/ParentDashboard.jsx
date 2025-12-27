import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Calendar, DollarSign, TrendingUp, AlertCircle, MessageSquare, Bus, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI } from '../../services/attendanceService';
import { marksAPI } from '../../services/marksService';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [childInfo, setChildInfo] = useState({
        name: user?.parentData?.childName || "Student",
        class: "N/A",
        rollNo: user?.parentData?.childUsn || "N/A",
        attendance: 0,
        cgpa: 0
    });

    const [attendanceData, setAttendanceData] = useState([]);
    const [marksData, setMarksData] = useState([]);
    const [feeData, setFeeData] = useState([
        { name: 'Paid', value: 105000 },
        { name: 'Pending', value: 0 },
    ]);

    useEffect(() => {
        if (user?.parentData?.childUsn) {
            fetchChildData();
        }
    }, [user]);

    const fetchChildData = async () => {
        try {
            setLoading(true);
            const usn = user.parentData.childUsn;

            // Fetch Attendance
            const attReport = await attendanceAPI.getAttendanceReport({ studentUsn: usn });
            setAttendanceData(attReport.records.slice(0, 5).map(r => ({
                name: r.subject,
                present: r.status === 'present',
                dateLabel: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            })));

            // Fetch Marks
            const marks = await marksAPI.getMarks({ studentUsn: usn });
            setMarksData(marks.map(m => ({
                subject: m.subject,
                marks: m.obtainedMarks,
                total: m.maxMarks
            })));

            // Update Child Info
            setChildInfo(prev => ({
                ...prev,
                attendance: attReport.stats.percentage,
                cgpa: (marks.reduce((acc, m) => acc + (m.obtainedMarks / m.maxMarks), 0) / (marks.length || 1) * 10).toFixed(2)
            }));

        } catch (error) {
            console.error('Error fetching child data:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#10b981', '#ef4444'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Parent Portal</h1>
                    <p className="text-gray-500">Monitoring progress for <span className="font-bold text-[hsl(var(--secondary))]">{childInfo.name}</span></p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))/0.9] transition-colors">
                        <MessageSquare size={18} />
                        <span>Contact Mentor</span>
                    </button>
                </div>
            </div>

            {/* Fee Payment Alert - Only show if pending > 0 */}
            {feeData[1].value > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-800">Fee Payment Due</h3>
                        <p className="text-red-600 text-sm mt-1">
                            You have an outstanding balance of ₹{feeData[1].value.toLocaleString()} for the current semester. Please clear it before 30th Nov to avoid late fees.
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
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Attendance</p>
                            <h3 className="text-3xl font-bold mt-1">{childInfo.attendance}%</h3>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                        <span>Total Classes: 450</span>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Current CGPA</p>
                            <h3 className="text-3xl font-bold mt-1">{childInfo.cgpa}</h3>
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                        <span>Class Rank: 12/60</span>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Fee Pending</p>
                            <h3 className="text-3xl font-bold mt-1">₹{feeData[1].value.toLocaleString()}</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${feeData[1].value > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {feeData[1].value > 0 ? <DollarSign size={24} /> : <CheckCircle size={24} />}
                        </div>
                    </div>
                    {feeData[1].value > 0 ? (
                        <button className="mt-4 w-full py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded hover:bg-red-500/30 transition-colors">
                            PAY NOW
                        </button>
                    ) : (
                        <div className="mt-4 text-green-400 text-sm flex items-center gap-2">
                            <CheckCircle size={16} />
                            Fully Paid
                        </div>
                    )}
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Transport</p>
                            <h3 className="text-lg font-bold mt-1">Route #12</h3>
                        </div>
                        <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                            <Bus size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-green-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Bus is on time
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Academic Performance (Sem 5)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marksData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="subject" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="marks" fill="#d4af37" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fee Breakdown */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Fee Status</h3>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={feeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {feeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-gray-400 text-xs">Total</p>
                                <p className="text-white font-bold text-lg">₹1.1L</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-300 text-sm">Paid</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-300 text-sm">Pending</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Attendance */}
                <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Recent Attendance</h3>
                        <button
                            onClick={() => navigate('/dashboard/attendance')}
                            className="text-[hsl(var(--secondary))] text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {attendanceData.length > 0 ? (
                            attendanceData.map((record, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "p-2 rounded-lg",
                                            record.present ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                        )}>
                                            {record.present ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{record.name}</p>
                                            <p className="text-sm text-gray-400">{record.present ? 'Present' : 'Absent'}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{record.dateLabel}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">No recent attendance records</div>
                        )}
                    </div>
                </div>

                {/* Recent Notices */}
                <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Notices & Circulars</h3>
                        <button
                            onClick={() => navigate('/dashboard/messages')}
                            className="text-[hsl(var(--secondary))] text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {[
                            { title: "Parent-Teacher Meeting", date: "Nov 28, 2025", type: "Event" },
                            { title: "Semester Exam Schedule Released", date: "Nov 25, 2025", type: "Academic" },
                            { title: "Holiday on account of State Festival", date: "Nov 20, 2025", type: "General" },
                        ].map((notice, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-700 rounded-lg text-[hsl(var(--secondary))]">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{notice.title}</p>
                                        <p className="text-sm text-gray-400">{notice.type}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{notice.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
