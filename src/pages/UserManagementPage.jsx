import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit, Trash2, UserCheck, UserX, Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { authAPI } from '../services/api';
import { useEffect } from 'react';

const UserManagementPage = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState({ students: [], faculty: [], staff: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '', email: '', password: 'password123', role: 'student',
        studentData: { usn: '', department: 'CSE', semester: '1' },
        facultyData: { employeeId: '', department: 'CSE', designation: 'Assistant Professor' }
    });

    const tabs = [
        { id: 'students', label: 'Students' },
        { id: 'faculty', label: 'Faculty' },
        { id: 'parents', label: 'Parents' },
        { id: 'staff', label: 'Staff' },
    ];

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const allUsers = await authAPI.getUsers();
            const organizedUsers = {
                students: allUsers.filter(u => u.role === 'student').map(u => ({
                    id: u._id, name: u.name, email: u.email,
                    usn: u.studentData?.usn || 'N/A', department: u.studentData?.department || 'N/A',
                    semester: u.studentData?.semester || 'N/A', status: 'Active', raw: u,
                })),
                faculty: allUsers.filter(u => u.role === 'faculty').map(u => ({
                    id: u._id, name: u.name, email: u.email,
                    employeeId: u.facultyData?.employeeId || 'N/A', department: u.facultyData?.department || 'N/A',
                    designation: u.facultyData?.designation || 'N/A', status: 'Active', raw: u,
                })),
                parents: allUsers.filter(u => u.role === 'parent').map(u => ({
                    id: u._id, name: u.name, email: u.email,
                    childUsn: u.parentData?.childUsn || 'N/A', childName: u.parentData?.childName || 'N/A',
                    status: 'Active', raw: u,
                })),
                staff: allUsers.filter(u => u.role === 'staff' || u.role === 'admin').map(u => ({
                    id: u._id, name: u.name, email: u.email,
                    employeeId: u.facultyData?.employeeId || 'N/A', department: u.facultyData?.department || 'N/A',
                    designation: u.facultyData?.designation || 'N/A', status: 'Active', raw: u,
                })),
            };
            setUsers(organizedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await authAPI.register(newUser);
            alert('User created successfully!');
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert(error.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await authAPI.deleteUser(userId);
            alert('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            alert(error.message || 'Failed to delete user');
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({
            id: user.id, name: user.name, email: user.email,
            role: user.raw?.role || 'student', phone: user.raw?.phone || '',
            studentData: user.raw?.studentData || {},
            facultyData: user.raw?.facultyData || {},
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await authAPI.updateUser(editingUser.id, editingUser);
            alert('User updated successfully!');
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            alert(error.message || 'Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentUsers = users[activeTab] || [];
    const filteredUsers = currentUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToExcel = () => {
        const exportData = filteredUsers.map(user => {
            if (activeTab === 'students') {
                return { 'Name': user.name, 'Email': user.email, 'USN': user.usn, 'Department': user.department, 'Semester': user.semester, 'Status': user.status };
            } else {
                return { 'Name': user.name, 'Email': user.email, 'Employee ID': user.employeeId, 'Department': user.department, 'Designation': user.designation, 'Status': user.status };
            }
        });
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, activeTab.charAt(0).toUpperCase() + activeTab.slice(1));
        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `${activeTab}_data_${date}.xlsx`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-gray-400">Manage students, faculty, and staff accounts.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={fetchUsers} className="p-2 text-gray-400 hover:text-white transition-colors" title="Refresh List">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                </button>
                <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white border border-gray-700 rounded-lg hover:bg-[#0f172a] transition-colors">
                    <Download size={18} /><span>Export to Excel</span>
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors">
                    <Plus size={18} /><span>Add New User</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center justify-between">
                    <p>{error}</p>
                    <button onClick={fetchUsers} className="text-sm underline hover:text-red-300">Retry</button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-gray-400 hover:text-gray-300'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#0f172a] border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                                    {activeTab === 'students' ? 'USN' : activeTab === 'parents' ? 'Child USN' : 'Employee ID'}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                                    {activeTab === 'parents' ? 'Child Name' : 'Department'}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                                    {activeTab === 'students' ? 'Semester' : activeTab === 'parents' ? 'Role' : 'Designation'}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[#0f172a] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {activeTab === 'students' ? user.usn : activeTab === 'parents' ? user.childUsn : user.employeeId}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {activeTab === 'parents' ? user.childName : user.department}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {activeTab === 'students' ? user.semester : activeTab === 'parents' ? 'Parent' : user.designation}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                            <UserCheck size={12} />Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEditClick(user)} className="p-2 text-gray-400 hover:text-[#d4af37] transition-colors" title="Edit User">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete User">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-400">No users found matching your criteria.</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{filteredUsers.length}</span> of{' '}
                    <span className="font-medium text-white">{currentUsers.length}</span> users
                </p>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 bg-[#0f172a] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Add New User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                    <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                        value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input type="email" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                        value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                    <input type="password" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                        value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                    <select className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                        value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                {newUser.role === 'student' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">USN</label>
                                            <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                                value={newUser.studentData.usn} onChange={(e) => setNewUser({ ...newUser, studentData: { ...newUser.studentData, usn: e.target.value } })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                                            <select className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                                value={newUser.studentData.department} onChange={(e) => setNewUser({ ...newUser, studentData: { ...newUser.studentData, department: e.target.value } })}>
                                                <option value="CSE">CSE</option><option value="ISE">ISE</option><option value="ECE">ECE</option><option value="EEE">EEE</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Semester</label>
                                            <select className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                                value={newUser.studentData.semester} onChange={(e) => setNewUser({ ...newUser, studentData: { ...newUser.studentData, semester: e.target.value } })}>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </>
                                ) : newUser.role === 'faculty' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Employee ID</label>
                                            <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                                value={newUser.facultyData.employeeId} onChange={(e) => setNewUser({ ...newUser, facultyData: { ...newUser.facultyData, employeeId: e.target.value } })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                                            <select className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                                value={newUser.facultyData.department} onChange={(e) => setNewUser({ ...newUser, facultyData: { ...newUser.facultyData, department: e.target.value } })}>
                                                <option value="CSE">CSE</option><option value="ISE">ISE</option><option value="ECE">ECE</option><option value="EEE">EEE</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#d4af37] text-[#0f172a] font-bold rounded-lg hover:bg-[#c5a028] transition-colors disabled:opacity-50">
                                    {isSubmitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 bg-[#0f172a] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Edit User</h2>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input type="email" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                <input type="text" className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} placeholder="Phone number" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                <select className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                                    value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                    <option value="parent">Parent</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting}
                                    className="px-6 py-2 bg-[#d4af37] text-[#0f172a] font-bold rounded-lg hover:bg-[#c5a028] transition-colors disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
