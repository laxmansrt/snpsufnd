import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transportAPI } from '../../services/transportService';
import { hostelAPI } from '../../services/hostelService';
import { FileText, Bus, Home, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import clsx from 'clsx';

const ApplicationsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('transport');
    const [loading, setLoading] = useState(false);
    const [myApplications, setMyApplications] = useState({
        transport: null,
        hostel: null
    });

    // Form States
    const [transportForm, setTransportForm] = useState({
        phone: user?.phone || '',
        semester: user?.studentData?.semester || 1,
        department: user?.studentData?.department || '',
        routeId: '',
        routeName: '',
        pickupPoint: ''
    });

    const [hostelForm, setHostelForm] = useState({
        phone: user?.phone || '',
        semester: user?.studentData?.semester || 1,
        department: user?.studentData?.department || '',
        roomPreference: 'single',
        blockPreference: 'Block A',
        guardianName: '',
        guardianPhone: '',
        guardianRelation: '',
        permanentAddress: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        }
    });

    // Update form when user data is available
    useEffect(() => {
        if (user) {
            setTransportForm(prev => ({
                ...prev,
                semester: user.studentData?.semester || 1,
                department: user.studentData?.department || ''
            }));
            setHostelForm(prev => ({
                ...prev,
                semester: user.studentData?.semester || 1,
                department: user.studentData?.department || ''
            }));
        }
    }, [user]);

    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transportRoutes, transportApp, hostelApp] = await Promise.all([
                transportAPI.getRoutes(),
                transportAPI.getMyApplication(),
                hostelAPI.getMyApplication()
            ]);
            setRoutes(transportRoutes);
            setMyApplications({ transport: transportApp, hostel: hostelApp });
        } catch (error) {
            console.error('Error fetching application data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransportSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const selectedRoute = routes.find(r => r._id === transportForm.routeId);
            await transportAPI.submitApplication({
                ...transportForm,
                studentId: user.id,
                studentUsn: user.studentData?.usn || 'N/A',
                studentName: user.name,
                email: user.email,
                routeName: selectedRoute?.routeName || ''
            });
            alert('Transport application submitted successfully!');
            fetchData();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleHostelSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await hostelAPI.submitApplication({
                ...hostelForm,
                studentId: user.id,
                studentUsn: user.studentData?.usn || 'N/A',
                studentName: user.name,
                email: user.email
            });
            alert('Hostel application submitted successfully!');
            fetchData();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            approved: 'bg-green-500/20 text-green-400 border-green-500/50',
            rejected: 'bg-red-500/20 text-red-400 border-red-500/50'
        };
        return (
            <span className={clsx('px-3 py-1 rounded-full text-xs font-bold border', styles[status] || styles.pending)}>
                {status?.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FileText className="text-[#d4af37]" />
                        Application Center
                    </h1>
                    <p className="text-gray-400 mt-1">Apply for university services and track your application status.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#1e293b] p-1 rounded-xl border border-gray-700 w-fit">
                <button
                    onClick={() => setActiveTab('transport')}
                    className={clsx(
                        'flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all',
                        activeTab === 'transport' ? 'bg-[#d4af37] text-[#0f172a]' : 'text-gray-400 hover:text-white'
                    )}
                >
                    <Bus size={18} />
                    Transport (Bus Pass)
                </button>
                <button
                    onClick={() => setActiveTab('hostel')}
                    className={clsx(
                        'flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all',
                        activeTab === 'hostel' ? 'bg-[#d4af37] text-[#0f172a]' : 'text-gray-400 hover:text-white'
                    )}
                >
                    <Home size={18} />
                    Hostel Accommodation
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application Form */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'transport' ? (
                        <div className="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-700 bg-[#0f172a]">
                                <h2 className="text-xl font-bold text-white">Transport Enrollment Form</h2>
                                <p className="text-sm text-gray-400">Apply for a new bus pass or route change.</p>
                            </div>
                            <form onSubmit={handleTransportSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={transportForm.phone}
                                            onChange={(e) => setTransportForm({ ...transportForm, phone: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Semester</label>
                                        <input
                                            type="number"
                                            required
                                            value={transportForm.semester}
                                            onChange={(e) => setTransportForm({ ...transportForm, semester: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={transportForm.department}
                                        onChange={(e) => setTransportForm({ ...transportForm, department: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Select Route</label>
                                    <select
                                        required
                                        value={transportForm.routeId}
                                        onChange={(e) => setTransportForm({ ...transportForm, routeId: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    >
                                        <option value="">Select a Route</option>
                                        {routes.map(route => (
                                            <option key={route._id} value={route._id}>{route.routeName} ({route.routeNumber})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pickup Point</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your nearest stop"
                                        value={transportForm.pickupPoint}
                                        onChange={(e) => setTransportForm({ ...transportForm, pickupPoint: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || myApplications.transport?.status === 'pending'}
                                    className="w-full bg-[#d4af37] hover:bg-[#c5a028] text-[#0f172a] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    <Send size={18} />
                                    {myApplications.transport?.status === 'pending' ? 'Application Pending' : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-700 bg-[#0f172a]">
                                <h2 className="text-xl font-bold text-white">Hostel Admission Form</h2>
                                <p className="text-sm text-gray-400">Request for hostel room allotment.</p>
                            </div>
                            <form onSubmit={handleHostelSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Student Phone</label>
                                        <input
                                            type="text"
                                            required
                                            value={hostelForm.phone}
                                            onChange={(e) => setHostelForm({ ...hostelForm, phone: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Semester</label>
                                        <input
                                            type="number"
                                            required
                                            value={hostelForm.semester}
                                            onChange={(e) => setHostelForm({ ...hostelForm, semester: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={hostelForm.department}
                                        onChange={(e) => setHostelForm({ ...hostelForm, department: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Room Type</label>
                                        <select
                                            value={hostelForm.roomPreference}
                                            onChange={(e) => setHostelForm({ ...hostelForm, roomPreference: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        >
                                            <option value="single">Single Room</option>
                                            <option value="double">Double Sharing</option>
                                            <option value="triple">Triple Sharing</option>
                                            <option value="quad">Quad Sharing</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Block Preference</label>
                                        <select
                                            value={hostelForm.blockPreference}
                                            onChange={(e) => setHostelForm({ ...hostelForm, blockPreference: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        >
                                            <option value="Block A">Block A</option>
                                            <option value="Block B">Block B</option>
                                            <option value="Girls Hostel">Girls Hostel</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Guardian Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={hostelForm.guardianName}
                                            onChange={(e) => setHostelForm({ ...hostelForm, guardianName: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Guardian Phone</label>
                                        <input
                                            type="text"
                                            required
                                            value={hostelForm.guardianPhone}
                                            onChange={(e) => setHostelForm({ ...hostelForm, guardianPhone: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Guardian Relation</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Father, Mother, etc."
                                            value={hostelForm.guardianRelation}
                                            onChange={(e) => setHostelForm({ ...hostelForm, guardianRelation: e.target.value })}
                                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Permanent Address</label>
                                    <textarea
                                        required
                                        rows="2"
                                        placeholder="Street Address..."
                                        value={hostelForm.permanentAddress.street}
                                        onChange={(e) => setHostelForm({
                                            ...hostelForm,
                                            permanentAddress: { ...hostelForm.permanentAddress, street: e.target.value }
                                        })}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={hostelForm.permanentAddress.city}
                                            onChange={(e) => setHostelForm({
                                                ...hostelForm,
                                                permanentAddress: { ...hostelForm.permanentAddress, city: e.target.value }
                                            })}
                                            className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={hostelForm.permanentAddress.state}
                                            onChange={(e) => setHostelForm({
                                                ...hostelForm,
                                                permanentAddress: { ...hostelForm.permanentAddress, state: e.target.value }
                                            })}
                                            className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Pincode"
                                            value={hostelForm.permanentAddress.pincode}
                                            onChange={(e) => setHostelForm({
                                                ...hostelForm,
                                                permanentAddress: { ...hostelForm.permanentAddress, pincode: e.target.value }
                                            })}
                                            className="bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || myApplications.hostel?.status === 'pending'}
                                    className="w-full bg-[#d4af37] hover:bg-[#c5a028] text-[#0f172a] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    <Send size={18} />
                                    {myApplications.hostel?.status === 'pending' ? 'Application Pending' : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Status Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#1e293b] rounded-2xl border border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="text-[#d4af37]" />
                            Recent Tracking
                        </h3>
                        <div className="space-y-4">
                            {/* Transport Status */}
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">Transport</p>
                                        <p className="text-sm font-bold text-white">Bus Pass Application</p>
                                    </div>
                                    {myApplications.transport ? (
                                        <StatusBadge status={myApplications.transport.status} />
                                    ) : (
                                        <span className="text-[10px] text-gray-600">No active application</span>
                                    )}
                                </div>
                                {myApplications.transport && (
                                    <div className="space-y-1 mt-3 pt-3 border-t border-gray-700/50">
                                        <p className="text-xs text-gray-400">Route: <span className="text-gray-200">{myApplications.transport.routeName}</span></p>
                                        <p className="text-xs text-gray-400">Applied: <span className="text-gray-200">{new Date(myApplications.transport.appliedDate).toLocaleDateString()}</span></p>
                                        {myApplications.transport.remarks && (
                                            <p className="text-xs text-yellow-500 mt-2 bg-yellow-500/10 p-2 rounded">Note: {myApplications.transport.remarks}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Hostel Status */}
                            <div className="p-4 bg-[#0f172a] rounded-xl border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">Hostel</p>
                                        <p className="text-sm font-bold text-white">Allotment Request</p>
                                    </div>
                                    {myApplications.hostel ? (
                                        <StatusBadge status={myApplications.hostel.status} />
                                    ) : (
                                        <span className="text-[10px] text-gray-600">No active application</span>
                                    )}
                                </div>
                                {myApplications.hostel && (
                                    <div className="space-y-1 mt-3 pt-3 border-t border-gray-700/50">
                                        <p className="text-xs text-gray-400">Type: <span className="text-gray-200 capitalize">{myApplications.hostel.roomPreference}</span></p>
                                        <p className="text-xs text-gray-400">Applied: <span className="text-gray-200">{new Date(myApplications.hostel.appliedDate).toLocaleDateString()}</span></p>
                                        {myApplications.hostel.remarks && (
                                            <p className="text-xs text-yellow-500 mt-2 bg-yellow-500/10 p-2 rounded">Note: {myApplications.hostel.remarks}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#d4af37]/20 to-transparent p-6 rounded-2xl border border-[#d4af37]/30">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2">
                            <AlertCircle size={18} className="text-[#d4af37]" />
                            Need Help?
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            If you're facing issues with your application or need a custom request, visit the Administrative Office between 10 AM - 4 PM.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsPage;
