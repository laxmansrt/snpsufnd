import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Globe, Moon, Shield, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SettingsPage = () => {
    const { user, updateProfile, updatePassword } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+91 98765 43210',
    });

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Notification State
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notification_prefs');
        return saved ? JSON.parse(saved) : [
            { id: 'email', title: 'Email Notifications', desc: 'Receive emails about your account activity.', enabled: true },
            { id: 'push', title: 'Push Notifications', desc: 'Receive push notifications on your device.', enabled: true },
            { id: 'sms', title: 'SMS Alerts', desc: 'Receive text messages for urgent updates.', enabled: false },
            { id: 'digest', title: 'Weekly Digest', desc: 'Receive a weekly summary of your activity.', enabled: false },
        ];
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name,
                email: user.email,
                phone: '+91 98765 43210',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await updateProfile({
            name: profileForm.name,
            email: profileForm.email
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update profile.' });
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await updatePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update password.' });
        }
        setLoading(false);
    };

    const handleNotificationToggle = (id) => {
        const updated = notifications.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n);
        setNotifications(updated);
        localStorage.setItem('notification_prefs', JSON.stringify(updated));
        setMessage({ type: 'success', text: 'Notification preferences updated!' });
    };

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

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p>{message.text}</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setMessage({ type: '', text: '' });
                            }}
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
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Profile Information</h2>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-2xl font-bold border-2 border-[#d4af37]/30">
                                    {user?.name?.charAt(0)}
                                </div>
                                <button type="button" className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#0f172a] transition-colors">
                                    Change Avatar
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={user?.studentData?.department || user?.facultyData?.department || 'N/A'}
                                        disabled
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-all font-bold disabled:opacity-50"
                                >
                                    {loading ? <LoadingSpinner size="sm" color="white" /> : <Save size={18} />}
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                {notifications.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <h3 className="font-medium text-white">{item.title}</h3>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={item.enabled}
                                                onChange={() => handleNotificationToggle(item.id)}
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Security Settings</h2>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full p-2.5 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-all font-bold disabled:opacity-50"
                                    >
                                        {loading ? <LoadingSpinner size="sm" color="white" /> : <Shield size={18} />}
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-4">Appearance Settings</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all group ${theme === 'light'
                                        ? 'border-[#d4af37] bg-white shadow-lg shadow-[#d4af37]/5'
                                        : 'border-gray-700 hover:bg-[#0f172a]'
                                        }`}
                                >
                                    <div className="h-24 bg-gray-50 border rounded-lg mb-3 shadow-sm overflow-hidden">
                                        <div className="h-4 bg-gray-200 border-b"></div>
                                        <div className="p-2 space-y-1">
                                            <div className="h-2 w-3/4 bg-gray-300 rounded"></div>
                                            <div className="h-2 w-1/2 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                    <p className={`text-center font-medium ${theme === 'light' ? 'text-[#d4af37]' : 'text-gray-400 group-hover:text-white'}`}>
                                        Light Mode {theme === 'light' && '(Active)'}
                                    </p>
                                </div>
                                <div
                                    onClick={() => theme === 'light' && toggleTheme()}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all group ${theme === 'dark'
                                        ? 'border-[#d4af37] bg-[#0f172a] shadow-lg shadow-[#d4af37]/5'
                                        : 'border-gray-700 hover:bg-[#0f172a]'
                                        }`}
                                >
                                    <div className="h-24 bg-[#0f172a] border-gray-800 border rounded-lg mb-3 shadow-sm overflow-hidden">
                                        <div className="h-4 bg-gray-900 border-b border-gray-800"></div>
                                        <div className="p-2 space-y-1">
                                            <div className="h-2 w-3/4 bg-gray-800 rounded"></div>
                                            <div className="h-2 w-1/2 bg-gray-800 rounded"></div>
                                        </div>
                                    </div>
                                    <p className={`text-center font-medium ${theme === 'dark' ? 'text-[#d4af37]' : 'text-gray-400 group-hover:text-white'}`}>
                                        Dark Mode {theme === 'dark' && '(Active)'}
                                    </p>
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
