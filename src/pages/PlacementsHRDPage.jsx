import React from 'react';
import { Briefcase, Building, Users, TrendingUp, Plus } from 'lucide-react';

const PlacementsHRDPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Placement Management</h1>
                    <p className="text-gray-400">Manage placement drives, student applications, and track statistics.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] font-medium rounded-lg hover:bg-[#c5a028] transition-colors">
                    <Plus size={18} />
                    <span>Post New Drive</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-[#d4af37] transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Active Drives</p>
                            <h3 className="text-2xl font-bold text-white">12</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-[#d4af37] transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Students Placed</p>
                            <h3 className="text-2xl font-bold text-white">450</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-[#d4af37] transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
                            <Building size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Companies Visited</p>
                            <h3 className="text-2xl font-bold text-white">45</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-[#d4af37] transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Highest CTC</p>
                            <h3 className="text-2xl font-bold text-white">₹42 LPA</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State / Coming Soon */}
            <div className="bg-[#1e293b] p-12 rounded-xl border border-gray-700 text-center flex flex-col items-center justify-center">
                <Briefcase size={48} className="text-gray-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Drive Management Coming Soon</h2>
                <p className="text-gray-400 max-w-lg">
                    The detailed list of upcoming campus drives and student applications will appear here once the API backend is fully integrated into this screen.
                </p>
            </div>
        </div>
    );
};

export default PlacementsHRDPage;
