import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Award, AlertCircle, Eye, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const StudentInsightsPage = () => {
    const [selectedClass, setSelectedClass] = useState('CSE - Sem 5');


    const classes = ['CSE - Sem 5', 'CSE - Sem 3', 'ISE - Sem 5', 'ECE - Sem 4'];

    const students = [
        { id: 1, name: 'Rahul Kumar', usn: '1SI21CS045', cgpa: 8.5, attendance: 92, rank: 5, trend: 'up' },
        { id: 2, name: 'Priya Sharma', usn: '1SI21CS048', cgpa: 9.2, attendance: 95, rank: 1, trend: 'up' },
        { id: 3, name: 'Amit Singh', usn: '1SI21CS052', cgpa: 7.8, attendance: 78, rank: 12, trend: 'down' },
        { id: 4, name: 'Sneha Gupta', usn: '1SI21CS055', cgpa: 8.9, attendance: 88, rank: 3, trend: 'up' },
        { id: 5, name: 'Vikram Reddy', usn: '1SI21CS058', cgpa: 7.5, attendance: 85, rank: 15, trend: 'down' },
        { id: 6, name: 'Anjali Desai', usn: '1SI21CS061', cgpa: 8.1, attendance: 90, rank: 8, trend: 'up' },
        { id: 7, name: 'Arjun Patel', usn: '1SI21CS064', cgpa: 7.2, attendance: 82, rank: 18, trend: 'down' },
        { id: 8, name: 'Meera Iyer', usn: '1SI21CS067', cgpa: 9.5, attendance: 98, rank: 1, trend: 'up' },
    ];

    const performanceData = [
        { month: 'Aug', avg: 75 },
        { month: 'Sep', avg: 78 },
        { month: 'Oct', avg: 82 },
        { month: 'Nov', avg: 85 },
    ];

    const subjectPerformance = [
        { subject: 'DBMS', avg: 85 },
        { subject: 'OS', avg: 78 },
        { subject: 'CN', avg: 82 },
        { subject: 'SE', avg: 88 },
        { subject: 'WT', avg: 80 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Student Insights</h1>
                    <p className="text-gray-400">View student performance and analytics</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Class Filter */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Class</label>
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-blue-400 text-sm font-medium">Total Students</span>
                        <Users className="text-blue-500" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white">{students.length}</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-green-400 text-sm font-medium">Avg CGPA</span>
                        <Award className="text-green-500" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {(students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-purple-400 text-sm font-medium">Avg Attendance</span>
                        <TrendingUp className="text-purple-500" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {(students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(0)}%
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-red-400 text-sm font-medium">At Risk</span>
                        <AlertCircle className="text-red-500" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {students.filter(s => s.attendance < 80 || s.cgpa < 7.5).length}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6">Class Performance Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="avg" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6">Subject-wise Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="subject" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="avg" fill="#d4af37" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Student Performance Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">USN</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student Name</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">CGPA</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Attendance</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Trend</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {students.sort((a, b) => a.rank - b.rank).map((student) => (
                                <tr key={student.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${student.rank <= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                                            student.rank <= 10 ? 'bg-green-500/20 text-green-400' :
                                                'bg-gray-700 text-gray-400'
                                            }`}>
                                            #{student.rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{student.usn}</td>
                                    <td className="px-6 py-4 text-sm text-white font-medium">{student.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${student.cgpa >= 9 ? 'bg-green-500/20 text-green-400' :
                                            student.cgpa >= 8 ? 'bg-blue-500/20 text-blue-400' :
                                                student.cgpa >= 7 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {student.cgpa}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${student.attendance >= 90 ? 'bg-green-500/20 text-green-400' :
                                            student.attendance >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {student.attendance}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {student.trend === 'up' ? (
                                            <TrendingUp className="inline text-green-400" size={20} />
                                        ) : (
                                            <TrendingDown className="inline text-red-400" size={20} />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentInsightsPage;
