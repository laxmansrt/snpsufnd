import React, { useState, useEffect } from 'react';
import { Briefcase, Building, Users, TrendingUp, Plus, Calendar, IndianRupee, MapPin, Search, Edit2, Trash2, X, CheckCircle, XCircle } from 'lucide-react';
import { placementAPI } from '../services/placementService';

const PlacementsHRDPage = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDrive, setNewDrive] = useState({
        companyName: '',
        role: '',
        package: '',
        description: '',
        eligibilityCriteria: { cgpa: 0, activeBacklogs: 0, branches: 'CSE, ISE, ECE' },
        deadline: '',
        dateOfDrive: ''
    });

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const data = await placementAPI.getDrives();
            setDrives(data);
        } catch (error) {
            console.error('Failed to fetch drives:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDrive = async (e) => {
        e.preventDefault();
        try {
            // Format branches into array
            const formattedDrive = {
                ...newDrive,
                eligibilityCriteria: {
                    ...newDrive.eligibilityCriteria,
                    branches: newDrive.eligibilityCriteria.branches.split(',').map(b => b.trim())
                }
            };
            await placementAPI.createDrive(formattedDrive);
            setIsModalOpen(false);
            fetchDrives();

            // Reset form
            setNewDrive({
                companyName: '', role: '', package: '', description: '',
                eligibilityCriteria: { cgpa: 0, activeBacklogs: 0, branches: 'CSE, ISE, ECE' },
                deadline: '', dateOfDrive: ''
            });
        } catch (error) {
            console.error('Failed to create drive:', error);
            alert('Failed to create placement drive');
        }
    };

    const handleDeleteDrive = async (id) => {
        if (!confirm('Are you sure you want to delete this placement drive?')) return;
        try {
            await placementAPI.deleteDrive(id);
            fetchDrives();
        } catch (error) {
            console.error('Failed to delete drive:', error);
        }
    };

    const openViewModal = async (driveId) => {
        try {
            const data = await placementAPI.getDriveById(driveId);
            setSelectedDrive(data);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch drive details', error);
        }
    };

    const handleUpdateApplicantStatus = async (driveId, studentId, status) => {
        try {
            await placementAPI.updateApplicantStatus(driveId, studentId, status);
            // Refresh the modal data
            openViewModal(driveId);
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const filteredDrives = drives.filter(drive =>
        drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats calculations
    const activeDrives = drives.filter(d => d.status === 'upcoming' || d.status === 'ongoing').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Placement Management</h1>
                    <p className="text-gray-400">Manage placement drives, student applications, and track statistics.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] font-medium rounded-lg hover:bg-[#c5a028] transition-colors"
                >
                    <Plus size={18} /><span>Post New Drive</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Briefcase size={24} /></div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Active Drives</p>
                            <h3 className="text-2xl font-bold text-white">{activeDrives}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><Users size={24} /></div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Drives</p>
                            <h3 className="text-2xl font-bold text-white">{drives.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-white">Campus Drives</h2>
                    <div className="relative w-full md:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search company or role..."
                            className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-[#d4af37]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-8">Loading drives...</div>
                ) : filteredDrives.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDrives.map(drive => (
                            <div key={drive._id} className="bg-[#0f172a] rounded-xl border border-gray-700 overflow-hidden hover:border-[#d4af37] transition-all flex flex-col">
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{drive.companyName}</h3>
                                            <p className="text-[#d4af37] font-medium">{drive.role}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleDeleteDrive(drive._id)} className="text-gray-500 hover:text-red-400">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <IndianRupee size={14} className="text-green-500" />
                                            <span className="text-gray-300">{drive.package}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={14} className="text-blue-500" />
                                            <span className="text-gray-300">
                                                Deadline: {new Date(drive.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Users size={14} className="text-purple-500" />
                                            <span className="text-gray-300">{drive.applicants?.length || 0} Applicants</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {drive.eligibilityCriteria.branches.map(branch => (
                                            <span key={branch} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md border border-gray-700">
                                                {branch}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t border-gray-800 p-4 bg-gray-800/20">
                                    <button
                                        onClick={() => openViewModal(drive._id)}
                                        className="w-full py-2 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0f172a] rounded-lg transition-colors font-medium text-sm"
                                    >
                                        View Details & Applicants
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">No placement drives found. Click "Post New Drive" to create one.</div>
                )}
            </div>

            {/* Create Drive Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-700 bg-[#0f172a] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Post New Campus Drive</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form id="createDriveForm" onSubmit={handleCreateDrive} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                                        <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.companyName} onChange={e => setNewDrive({ ...newDrive, companyName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Job Role</label>
                                        <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.role} onChange={e => setNewDrive({ ...newDrive, role: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Package (CTC)</label>
                                        <input type="text" placeholder="e.g. 12 LPA" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.package} onChange={e => setNewDrive({ ...newDrive, package: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date of Drive</label>
                                        <input type="date" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.dateOfDrive} onChange={e => setNewDrive({ ...newDrive, dateOfDrive: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Job Description</label>
                                    <textarea required rows="3" className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white resize-none"
                                        value={newDrive.description} onChange={e => setNewDrive({ ...newDrive, description: e.target.value })} />
                                </div>

                                <h3 className="text-white font-medium border-b border-gray-700 pb-2 mt-6 mb-4">Eligibility Criteria</h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Minimum CGPA</label>
                                        <input type="number" step="0.1" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.eligibilityCriteria.cgpa} onChange={e => setNewDrive({ ...newDrive, eligibilityCriteria: { ...newDrive.eligibilityCriteria, cgpa: e.target.value } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Max Active Backlogs</label>
                                        <input type="number" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.eligibilityCriteria.activeBacklogs} onChange={e => setNewDrive({ ...newDrive, eligibilityCriteria: { ...newDrive.eligibilityCriteria, activeBacklogs: e.target.value } })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Registration Deadline</label>
                                        <input type="date" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.deadline} onChange={e => setNewDrive({ ...newDrive, deadline: e.target.value })} />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-sm text-gray-400 mb-1">Eligible Branches (Comma separated)</label>
                                        <input type="text" required className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white"
                                            value={newDrive.eligibilityCriteria.branches} onChange={e => setNewDrive({ ...newDrive, eligibilityCriteria: { ...newDrive.eligibilityCriteria, branches: e.target.value } })} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-700 bg-[#0f172a] flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg">Cancel</button>
                            <button type="submit" form="createDriveForm" className="px-6 py-2 bg-[#d4af37] text-[#0f172a] font-bold rounded-lg">Post Drive</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Drive & Applicants Modal */}
            {isViewModalOpen && selectedDrive && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-4xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-700 bg-[#0f172a] flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedDrive.companyName}</h2>
                                <p className="text-[#d4af37]">{selectedDrive.role} - {selectedDrive.package}</p>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Applicants ({selectedDrive.applicants.length})</h3>

                            {selectedDrive.applicants.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#0f172a] text-gray-400 text-sm">
                                            <tr>
                                                <th className="p-3 rounded-tl-lg">Student Name</th>
                                                <th className="p-3">USN</th>
                                                <th className="p-3">Department</th>
                                                <th className="p-3">Resume</th>
                                                <th className="p-3">Current Status</th>
                                                <th className="p-3 rounded-tr-lg">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {selectedDrive.applicants.map((app) => (
                                                <tr key={app._id} className="hover:bg-gray-800/30">
                                                    <td className="p-3 text-white font-medium">{app.student.name}</td>
                                                    <td className="p-3 text-gray-400">{app.student.studentData?.usn}</td>
                                                    <td className="p-3 text-gray-400">{app.student.studentData?.department}</td>
                                                    <td className="p-3">
                                                        {app.resumeUrl ? (
                                                            <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View</a>
                                                        ) : (
                                                            <span className="text-gray-600">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium 
                                                            ${app.status === 'applied' ? 'bg-gray-700 text-gray-300' :
                                                                app.status === 'shortlisted' ? 'bg-blue-500/20 text-blue-400' :
                                                                    app.status === 'interviewing' ? 'bg-purple-500/20 text-purple-400' :
                                                                        app.status === 'selected' ? 'bg-green-500/20 text-green-400' :
                                                                            'bg-red-500/20 text-red-400'
                                                            }`}
                                                        >
                                                            {app.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <select
                                                            className="bg-[#0f172a] border border-gray-600 text-white rounded p-1 text-sm outline-none focus:border-[#d4af37]"
                                                            value={app.status}
                                                            onChange={(e) => handleUpdateApplicantStatus(selectedDrive._id, app.student._id, e.target.value)}
                                                        >
                                                            <option value="applied">Applied</option>
                                                            <option value="shortlisted">Shortlisted</option>
                                                            <option value="interviewing">Interviewing</option>
                                                            <option value="selected">Selected</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 py-4 text-center">No students have applied to this drive yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementsHRDPage;
