import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, User, Lock, Phone, X, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student'); // Default role
    const [loginMethod, setLoginMethod] = useState('username'); // username or phone
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetStatus, setResetStatus] = useState({ type: '', message: '' });

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        setResetStatus({ type: 'success', message: 'Password reset link has been sent to your email.' });
        setTimeout(() => {
            setShowForgotPassword(false);
            setResetStatus({ type: '', message: '' });
        }, 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const success = await login(selectedRole, {
            email: formData.username,
            password: formData.password
        });

        if (success) {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const roles = [
        { id: 'student', label: 'Student' },
        { id: 'parent', label: 'Parent' },
        { id: 'faculty', label: 'Faculty' },
        { id: 'admin', label: 'Admin' },
    ];

    const features = [
        'Academic Excellence with Global Recognition',
        'State-of-the-Art Infrastructure & Facilities',
        'Industry-Integrated Curriculum',
        'Research & Innovation Hub',
        '100% Placement Assistance'
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-6xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">

                {/* Left Side - Info & Branding */}
                <div className="md:w-1/2 bg-[#172033] p-12 flex flex-col justify-center text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-5"></div>

                    <div className="relative z-10">
                        <div className="mb-10">
                            <img src="/assets/logo.png" alt="Sapthagiri NPS University" className="h-20 w-64 mb-6 object-contain" />
                            <h1 className="text-4xl font-bold font-serif mb-2 text-white">Sapthagiri NPS University</h1>
                            <p className="text-gray-400 text-lg">Excellence in Education Since 2001</p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white">Why Choose Us?</h3>
                            <ul className="space-y-4">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 bg-[#0f172a] p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-400">Sign in to access your academic portal</p>
                        </div>

                        {/* Role Selection */}
                        <div className="bg-[#1e293b] p-2 rounded-xl mb-8 border border-gray-700">
                            <p className="text-center text-gray-400 text-sm mb-2">Select Your Role:</p>
                            <div className="grid grid-cols-4 gap-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={clsx(
                                            "py-2 px-1 rounded-lg text-sm font-medium transition-all",
                                            selectedRole === role.id
                                                ? "bg-[#334155] text-white border border-gray-600 shadow-lg"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Login Method Toggle */}
                        <div className="flex bg-[#1e293b] rounded-lg p-1 mb-6 border border-gray-700">
                            <button
                                onClick={() => setLoginMethod('username')}
                                className={clsx(
                                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                    loginMethod === 'username' ? "bg-[#8d7847] text-white shadow" : "text-gray-400 hover:text-white"
                                )}
                            >
                                Username Login
                            </button>
                            <button
                                onClick={() => setLoginMethod('phone')}
                                className={clsx(
                                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                                    loginMethod === 'phone' ? "bg-[#8d7847] text-white shadow" : "text-gray-400 hover:text-white"
                                )}
                            >
                                Phone Login
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    {loginMethod === 'username' ? 'Username' : 'Phone Number'}
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        {loginMethod === 'username' ? <User size={18} /> : <Phone size={18} />}
                                    </div>
                                    <input
                                        type={loginMethod === 'username' ? 'text' : 'tel'}
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1e293b] border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
                                        placeholder={loginMethod === 'username' ? 'admin' : '9876543210'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1e293b] border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded bg-[#1e293b] border-gray-700 text-[#d4af37] focus:ring-[#d4af37]" />
                                    <span className="text-gray-400">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-[#d4af37] hover:text-[#f3cd57] transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-lg bg-[#d4af37] hover:bg-[#c5a028] text-[#1e293b] font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700 animate-fade-in">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Reset Password</h3>
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetStatus({ type: '', message: '' });
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                                {resetStatus.message && (
                                    <div className={`p-3 rounded-lg text-sm ${resetStatus.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {resetStatus.message}
                                    </div>
                                )}
                                <p className="text-gray-400 text-sm">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-[#d4af37] hover:bg-[#c5a028] text-[#1e293b] font-bold transition-colors"
                                >
                                    Send Reset Link
                                </button>
                            </form>

                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <span className="relative bg-[#1e293b] px-4 text-sm text-gray-400">OR</span>
                            </div>

                            <button
                                onClick={() => window.open('https://wa.me/916361774363?text=Hello%2C%20I%20forgot%20my%20password.%20Please%20assist%20me%20with%20the%20recovery%20process.', '_blank')}
                                className="w-full py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} />
                                Chat with Admin on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
