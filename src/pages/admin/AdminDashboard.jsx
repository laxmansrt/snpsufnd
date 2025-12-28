import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, IndianRupee, BookOpen, UserCheck, TrendingUp, AlertCircle, Plus, Bell, X, MessageSquare, Download, Upload, Video, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import * as XLSX from 'xlsx';
import { authAPI, announcementAPI } from '../../services/api';
import { attendanceAPI } from '../../services/attendanceService';
import { marksAPI } from '../../services/marksService';

const AdminDashboard = () => {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showPostNoticeModal, setShowPostNoticeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [inquiries, setInquiries] = useState([]);
    const [stats, setStats] = useState({
        students: 0,
        faculty: 0,
        staff: 0,
        total: 0,
        attendance: 0,
        results: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [allUsers, attStats, resStats] = await Promise.all([
                authAPI.getUsers(),
                attendanceAPI.getGlobalStats(),
                marksAPI.getGlobalStats()
            ]);

            const counts = {
                students: allUsers.filter(u => u.role === 'student').length,
                faculty: allUsers.filter(u => u.role === 'faculty').length,
                staff: allUsers.filter(u => u.role === 'staff' || u.role === 'admin').length,
                total: allUsers.length,
                attendance: attStats.percentage,
                results: resStats.averagePercentage
            };
            setStats(counts);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        const loadInquiries = () => {
            const data = JSON.parse(localStorage.getItem('inquiries') || '[]');
            setInquiries(data);
        };
        loadInquiries();
        const interval = setInterval(loadInquiries, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDownloadInquiries = () => {
        const worksheet = XLSX.utils.json_to_sheet(inquiries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
        XLSX.writeFile(workbook, "Web_Inquiries.xlsx");
    };

    // Add User Form State
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student', // Default role
        department: '',
    });

    // Post Notice Form State
    const [noticeData, setNoticeData] = useState({
        title: '',
        content: '',
        category: 'general',
        priority: 'normal',
        targetAudience: 'all',
    });

    const handleDownloadStudents = () => {
        const students = [
            { id: 1, name: 'Rahul Sharma', usn: '1SP21CS001', email: 'rahul@example.com', dept: 'CSE', semester: 5, cgpa: 8.5, status: 'Active' },
            { id: 2, name: 'Priya Patel', usn: '1SP21CS002', email: 'priya@example.com', dept: 'CSE', semester: 5, cgpa: 9.2, status: 'Active' },
            { id: 3, name: 'Amit Kumar', usn: '1SP21CS003', email: 'amit@example.com', dept: 'CSE', semester: 5, cgpa: 7.8, status: 'Inactive' },
            { id: 4, name: 'Sneha Gupta', usn: '1SP21EC001', email: 'sneha@example.com', dept: 'ECE', semester: 3, cgpa: 8.9, status: 'Active' },
            { id: 5, name: 'Vikram Singh', usn: '1SP21ME001', email: 'vikram@example.com', dept: 'ME', semester: 7, cgpa: 7.5, status: 'Active' },
            { id: 6, name: 'Anjali Desai', usn: '1SP21CV001', email: 'anjali@example.com', dept: 'Civil', semester: 5, cgpa: 8.1, status: 'Active' },
            { id: 7, name: 'Arjun Reddy', usn: '1SP21CS004', email: 'arjun@example.com', dept: 'CSE', semester: 3, cgpa: 7.2, status: 'Active' },
            { id: 8, name: 'Meera Iyer', usn: '1SP21EC002', email: 'meera@example.com', dept: 'ECE', semester: 7, cgpa: 9.5, status: 'Active' }
        ];

        const worksheet = XLSX.utils.json_to_sheet(students);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
        XLSX.writeFile(workbook, "Student_Database.xlsx");
    };

    // Mock Data
    const enrollmentData = [
        { name: 'CSE', students: 450 },
        { name: 'ECE', students: 320 },
        { name: 'ME', students: 280 },
        { name: 'Civil', students: 200 },
        { name: 'MBA', students: 150 },
    ];

    const revenueData = [
        { name: 'Jan', amount: 400000 },
        { name: 'Feb', amount: 300000 },
        { name: 'Mar', amount: 550000 },
        { name: 'Apr', amount: 450000 },
        { name: 'May', amount: 200000 },
        { name: 'Jun', amount: 600000 },
    ];

    const recentActivities = [
        { id: 1, user: 'Dr. Sharma', action: 'Uploaded Marks for CSE Sem 5', time: '2 mins ago' },
        { id: 2, user: 'Admin', action: 'Approved New Student Registration', time: '1 hour ago' },
        { id: 3, user: 'System', action: 'Automated Backup Completed', time: '3 hours ago' },
        { id: 4, user: 'Rahul (Student)', action: 'Paid Semester Fees', time: '5 hours ago' },
    ];

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });
        try {
            await authAPI.register(userData);
            setMessage({ type: 'success', content: 'User created successfully!' });
            setUserData({ name: '', email: '', password: '', role: 'student', department: '' });
            setTimeout(() => setShowAddUserModal(false), 1500);
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePostNotice = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });
        try {
            await announcementAPI.createAnnouncement(noticeData);
            setMessage({ type: 'success', content: 'Notice posted successfully!' });
            setNoticeData({ title: '', content: '', category: 'general', priority: 'normal', targetAudience: 'all' });
            setTimeout(() => setShowPostNoticeModal(false), 1500);
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Admin Overview</h1>
                    <p className="text-gray-500">Welcome back, Administrator. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))/0.9] transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add User</span>
                    </button>
                    <button
                        onClick={() => setShowPostNoticeModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] font-bold rounded-lg hover:bg-[hsl(var(--secondary))/0.9] transition-colors"
                    >
                        <Bell size={18} />
                        <span>Post Notice</span>
                    </button>
                    <Link
                        to="/dashboard/admin/bulk-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <Upload size={18} />
                        <span>Bulk Upload</span>
                    </Link>
                    <Link
                        to="/dashboard/admin/meetings"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Video size={18} />
                        <span>Meet</span>
                    </Link>
                    <Link
                        to="/dashboard/admin/create-exam"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <BookOpen size={18} />
                        <span>Create Exam</span>
                    </Link>
                    <Link
                        to="/dashboard/admin/gallery"
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <ImageIcon size={18} />
                        <span>Gallery</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Total Students</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.students.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-green-400">
                            <TrendingUp size={16} />
                            <span>+12% from last year</span>
                        </div>
                        <button
                            onClick={handleDownloadStudents}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold"
                            title="Download Student Database"
                        >
                            <Download size={12} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Total Faculty</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.faculty.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <UserCheck size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                        <span>Active across 8 depts</span>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Attendance</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.attendance}%</h3>
                        </div>
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                        <TrendingUp size={16} />
                        <span>University average</span>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Performance</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.results}%</h3>
                        </div>
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-purple-400">
                        <TrendingUp size={16} />
                        <span>Average marks</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Student Enrollment by Dept</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="students" fill="#d4af37" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Revenue Trends (6 Months)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">Recent System Activity</h3>
                </div>
                <div className="divide-y divide-gray-700">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">
                                    {activity.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{activity.action}</p>
                                    <p className="text-sm text-gray-400">by {activity.user}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-800/30 text-center">
                    <button className="text-[hsl(var(--secondary))] text-sm font-bold hover:underline">View All Activity</button>
                </div>
            </div>

            {/* Recent Web Inquiries */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare size={20} className="text-[#d4af37]" />
                        Recent Web Inquiries
                    </h3>
                    <button
                        onClick={handleDownloadInquiries}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-gray-800/50 text-gray-400 font-medium">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Message</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No inquiries yet
                                    </td>
                                </tr>
                            ) : (
                                inquiries.slice(0, 5).map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-sm">{new Date(inquiry.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-white">{inquiry.firstName} {inquiry.lastName}</td>
                                        <td className="p-4 text-sm">{inquiry.email}</td>
                                        <td className="p-4 text-sm">{inquiry.phone}</td>
                                        <td className="p-4 text-sm truncate max-w-xs">{inquiry.message}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                                                {inquiry.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {inquiries.length > 5 && (
                    <div className="p-4 bg-gray-800/30 text-center border-t border-gray-700">
                        <button className="text-[#d4af37] text-sm font-bold hover:underline">View All Inquiries</button>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Add New User</h3>
                            <button onClick={() => setShowAddUserModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            {message.content && (
                                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message.content}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                        value={userData.role}
                                        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                        <option value="parent">Parent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                        value={userData.department}
                                        onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-[hsl(var(--primary))] text-white rounded-lg font-bold hover:bg-[hsl(var(--primary))/0.9] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Post Notice Modal */}
            {showPostNoticeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Post New Notice</h3>
                            <button onClick={() => setShowPostNoticeModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handlePostNotice} className="p-6 space-y-4">
                            {message.content && (
                                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message.content}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                    value={noticeData.title}
                                    onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                    value={noticeData.content}
                                    onChange={(e) => setNoticeData({ ...noticeData, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                        value={noticeData.category}
                                        onChange={(e) => setNoticeData({ ...noticeData, category: e.target.value })}
                                    >
                                        <option value="general">General</option>
                                        <option value="academic">Academic</option>
                                        <option value="event">Event</option>
                                        <option value="exam">Exam</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="video">Video Conference</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                    <select
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                        value={noticeData.targetAudience}
                                        onChange={(e) => setNoticeData({ ...noticeData, targetAudience: e.target.value })}
                                    >
                                        <option value="all">All</option>
                                        <option value="students">Students</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="parents">Parents</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] rounded-lg font-bold hover:bg-[hsl(var(--secondary))/0.9] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post Notice'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
