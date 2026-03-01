import React, { useState, useEffect } from 'react';
import { Briefcase, Building, IndianRupee, Calendar, MapPin, CheckCircle, GraduationCap, Clock } from 'lucide-react';
import { placementAPI } from '../services/placementService';
import { useAuth } from '../context/AuthContext';

const PlacementsStudentPage = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');

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

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await placementAPI.applyForDrive(selectedDrive._id, { resumeUrl });
            alert('Application submitted successfully!');
            setIsApplyModalOpen(false);
            setResumeUrl('');
            fetchDrives();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to apply for drive');
        }
    };

    const getApplicantStatus = (drive) => {
        const application = drive.applicants?.find(app => (app.student._id || app.student) === user._id);
        return application ? application.status : null;
    };

    // Filter drives available for this student's department/branches (basic filter)
    const availableDrives = drives.filter(drive => {
        const studentDept = user.studentData?.department || 'CSE';
        return drive.eligibilityCriteria.branches.includes(studentDept) ||
            drive.eligibilityCriteria.branches.includes('All Branches');
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-700 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <GraduationCap className="text-[#d4af37]" /> Campus Placements
                    </h1>
                    <p className="text-gray-400 mt-1">Discover and apply to upcoming placement drives.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading placement drives...</div>
            ) : availableDrives.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {availableDrives.map(drive => {
                        const status = getApplicantStatus(drive);
                        const isDeadlinePassed = new Date(drive.deadline) < new Date();

                        return (
                            <div key={drive._id} className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-[#0f172a] border border-gray-700 flex items-center justify-center flex-shrink-0">
                                                <Building size={24} className="text-[#d4af37]" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{drive.companyName}</h3>
                                                <p className="text-[#d4af37] font-medium">{drive.role}</p>
                                            </div>
                                        </div>

                                        {status ? (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                                ${status === 'applied' ? 'bg-gray-800 border-gray-600 text-gray-300' :
                                                    status === 'shortlisted' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                                                        status === 'interviewing' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' :
                                                            status === 'selected' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                                                                'bg-red-500/20 border-red-500/30 text-red-400'
                                                }`}
                                            >
                                                {status.toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold">
                                                OPEN
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{drive.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <IndianRupee size={16} className="text-green-500" />
                                            <span className="font-medium">{drive.package}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Calendar size={16} className="text-blue-500" />
                                            <span className="font-medium">Drive: {new Date(drive.dateOfDrive).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300 col-span-2">
                                            <Clock size={16} className="text-orange-500" />
                                            <span className="font-medium">Reg. Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#0f172a] rounded-lg p-3 border border-gray-700">
                                        <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Eligibility Requirements</p>
                                        <div className="flex gap-4 text-sm text-gray-300">
                                            <span>CGPA: <span className="text-white font-medium">{drive.eligibilityCriteria.cgpa}+</span></span>
                                            <span>Max Backlogs: <span className="text-white font-medium">{drive.eligibilityCriteria.activeBacklogs}</span></span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-1">
                                            Branches: {drive.eligibilityCriteria.branches.map(b => (
                                                <span key={b} className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 p-4 bg-gray-800/20">
                                    {status ? (
                                        <button disabled className="w-full py-2.5 bg-[#334155] text-gray-400 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                            <CheckCircle size={18} /> Already Applied
                                        </button>
                                    ) : isDeadlinePassed ? (
                                        <button disabled className="w-full py-2.5 bg-red-500/10 text-red-500/50 border border-red-500/20 rounded-lg font-bold cursor-not-allowed">
                                            Registration Closed
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setSelectedDrive(drive); setIsApplyModalOpen(true); }}
                                            className="w-full py-2.5 bg-[#d4af37] text-[#0f172a] hover:bg-[#c5a028] rounded-lg font-bold transition-colors shadow-lg shadow-amber-900/20"
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-[#1e293b] p-12 rounded-xl border border-gray-700 text-center">
                    <Briefcase size={48} className="text-gray-500 mb-4 mx-auto" />
                    <h2 className="text-xl font-bold text-white mb-2">No Active Drives</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        There are currently no placement drives matching your department profile. Check back later!
                    </p>
                </div>
            )}

            {/* Apply Modal */}
            {isApplyModalOpen && selectedDrive && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-700 bg-[#0f172a]">
                            <h2 className="text-xl font-bold text-white mb-1">Apply for {selectedDrive.companyName}</h2>
                            <p className="text-[#d4af37] text-sm">{selectedDrive.role}</p>
                        </div>
                        <form onSubmit={handleApply} className="p-6 space-y-4">

                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-4 text-sm text-blue-200">
                                Please ensure your profile meets the eligibility criteria ({selectedDrive.eligibilityCriteria.cgpa} CGPA, Max {selectedDrive.eligibilityCriteria.activeBacklogs} Backlogs) before applying. Your application may be rejected if criteria are not met.
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Resume Link (Google Drive, GitHub, etc.)</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    placeholder="https://"
                                    value={resumeUrl}
                                    onChange={(e) => setResumeUrl(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">Make sure the link is publicly accessible.</p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-700 mt-6">
                                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 bg-[#d4af37] text-[#0f172a] font-bold rounded-lg hover:bg-[#c5a028] transition-colors">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementsStudentPage;
