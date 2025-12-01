import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, DollarSign, AlertTriangle, TrendingUp, Book } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
    const navigate = useNavigate();
    // Mock Data for Charts
    const attendanceData = [
        { name: 'Mon', present: 1 },
        { name: 'Tue', present: 1 },
        { name: 'Wed', present: 0.5 }, // Half day
        { name: 'Thu', present: 1 },
        { name: 'Fri', present: 1 },
        { name: 'Sat', present: 0 },
    ];

    const marksData = [
        { subject: 'Math', marks: 85 },
        { subject: 'Phys', marks: 78 },
        { subject: 'Chem', marks: 92 },
        { subject: 'CS', marks: 88 },
        { subject: 'Eng', marks: 75 },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Student Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Rahul! Here's your academic overview.</p>
                </div>
                <div className="text-sm text-gray-500">
                    Last login: Today, 10:30 AM
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
                    <h3 className="text-3xl font-bold mb-1">85%</h3>
                    <p className="text-gray-400 text-sm">Total Attendance</p>
                    <div className="mt-4 inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold">
                        Good Standing
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
                    <h3 className="text-3xl font-bold mb-1">8.4</h3>
                    <p className="text-gray-400 text-sm">Current CGPA</p>
                    <div className="mt-4 inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded font-bold">
                        Semester 5
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
                            <BarChart data={marksData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="subject" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="marks" fill="#d4af37" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Attendance */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Weekly Attendance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
