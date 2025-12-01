import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Moon, Shield, Save } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Moon },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-[#d4af37] text-[#0f172a]'
                                : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155] border border-gray-700'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-[#1e293b] rounded-xl border border-gray-700 p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Profile Information</h2>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-2xl font-bold">
                                    JD
                                </div>
                                <button className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#0f172a]">
                                    Change Avatar
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                    <input type="text" defaultValue="John Doe" className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                    <input type="email" defaultValue="john.doe@example.com" className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                    <input type="tel" defaultValue="+91 98765 43210" className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                                    <input type="text" defaultValue="Computer Science" disabled className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-gray-500" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button className="flex items-center gap-2 px-6 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'Email Notifications', desc: 'Receive emails about your account activity.' },
                                    { title: 'Push Notifications', desc: 'Receive push notifications on your device.' },
                                    { title: 'SMS Alerts', desc: 'Receive text messages for urgent updates.' },
                                    { title: 'Weekly Digest', desc: 'Receive a weekly summary of your activity.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2">
                                        <div>
                                            <h3 className="font-medium text-white">{item.title}</h3>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Security Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                                    <input type="password" className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                                    <input type="password" className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                                    <input type="password" className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37]" />
                                </div>
                                <div className="pt-4">
                                    <button className="flex items-center gap-2 px-6 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors">
                                        <Shield size={18} />
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Appearance Settings</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-gray-600 rounded-xl p-4 cursor-pointer hover:bg-[#0f172a]">
                                    <div className="h-20 bg-white border rounded-lg mb-2 shadow-sm"></div>
                                    <p className="text-center font-medium text-gray-300">Light Mode</p>
                                </div>
                                <div className="border-2 border-[#d4af37] rounded-xl p-4 cursor-pointer bg-[#0f172a]">
                                    <div className="h-20 bg-gray-900 border-gray-700 border rounded-lg mb-2 shadow-sm"></div>
                                    <p className="text-center font-medium text-[#d4af37]">Dark Mode</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
