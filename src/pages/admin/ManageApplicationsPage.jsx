import React, { useState, useEffect } from 'react';
import { transportAPI } from '../../services/transportService';
import { hostelAPI } from '../../services/hostelService';
import { FileText, Bus, Home, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import clsx from 'clsx';

const ManageApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('transport');
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, [activeTab]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = activeTab === 'transport'
                ? await transportAPI.getApplications()
                : await hostelAPI.getApplications();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        const remarks = window.prompt('Enter remarks (optional):', '');
        try {
            if (activeTab === 'transport') {
                await transportAPI.updateApplicationStatus(id, { status, remarks });
            } else {
                await hostelAPI.updateApplicationStatus(id, { status, remarks });
            }
            alert(`Application ${status} successfully!`);
            fetchApplications();
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredApplications = applications.filter(app =>
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentUsn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Manage Applications</h1>
                    <p className="text-gray-400">Review and process student service requests.</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-[#1e293b] p-1 rounded-xl border border-gray-700 w-fit">
                    <button
                        onClick={() => setActiveTab('transport')}
                        className={clsx(
                            'flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all',
                            activeTab === 'transport' ? 'bg-[#d4af37] text-[#0f172a]' : 'text-gray-400 hover:text-white'
                        )}
                    >
                        <Bus size={18} />
                        Transport
                    </button>
                    <button
                        onClick={() => setActiveTab('hostel')}
                        className={clsx(
                            'flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all',
                            activeTab === 'hostel' ? 'bg-[#d4af37] text-[#0f172a]' : 'text-gray-400 hover:text-white'
                        )}
                    >
                        <Home size={18} />
                        Hostel
                    </button>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by USN or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                    />
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#0f172a] border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">USN / Dept</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Request Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-12 text-center text-gray-500">Loading applications...</td></tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr><td colSpan="6" className="p-12 text-center text-gray-500">No pending applications found.</td></tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-[#0f172a] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-black">
                                                    {app.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{app.studentName}</p>
                                                    <p className="text-xs text-gray-400">{app.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white text-sm">{app.studentUsn}</p>
                                            <p className="text-xs text-gray-400">{app.department} - Sem {app.semester}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {activeTab === 'transport' ? (
                                                <div>
                                                    <p className="text-white text-sm font-medium">{app.routeName}</p>
                                                    <p className="text-xs text-gray-400">Pickup: {app.pickupPoint}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-white text-sm font-medium capitalize">{app.roomPreference} Room</p>
                                                    <p className="text-xs text-gray-400">{app.blockPreference}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-gray-300 text-sm">{new Date(app.appliedDate).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                'px-3 py-1 rounded-full text-[10px] font-black border',
                                                app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
                                                    app.status === 'approved' ? 'bg-green-500/20 text-green-500 border-green-500/50' :
                                                        'bg-red-500/20 text-red-500 border-red-500/50'
                                            )}>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                        className="p-2 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-[#0f172a] rounded-lg transition-all"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-[#0f172a] rounded-lg transition-all"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageApplicationsPage;
