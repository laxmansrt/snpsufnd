import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Shield, Activity, TrendingUp, Users, GraduationCap,
    Award, CheckCircle, Clock, ArrowRight, BookOpen, Zap,
    Database, Lock, MessageCircle, Bell, Sun, Moon, Volume2
} from 'lucide-react';
import AIChat from '../components/AIChat';

const LandingPage = () => {
    const [systemHealth, setSystemHealth] = useState({ status: 'Stable', color: 'green' });
    const [stats, setStats] = useState({ students: 0, faculty: 0, notices: 0, uptime: 0 });
    const [darkMode, setDarkMode] = useState(true);
    const [dailyTip, setDailyTip] = useState('');
    const [recentActivity, setRecentActivity] = useState([]);

    // Animated counter effect
    useEffect(() => {
        const targetStats = { students: 2847, faculty: 156, notices: 12, uptime: 99.9 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setStats({
                students: Math.floor(targetStats.students * progress),
                faculty: Math.floor(targetStats.faculty * progress),
                notices: Math.floor(targetStats.notices * progress),
                uptime: (targetStats.uptime * progress).toFixed(1)
            });

            if (currentStep >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Daily AI tip
    useEffect(() => {
        const tips = [
            "💡 Pro tip: Check your attendance regularly to stay on track!",
            "🎯 Success is the sum of small efforts repeated daily.",
            "📚 Knowledge is power. Keep learning, keep growing!",
            "⚡ Your portal is AI-protected and optimized for speed.",
            "🌟 Excellence is not a skill, it's an attitude."
        ];
        const today = new Date().getDate();
        setDailyTip(tips[today % tips.length]);
    }, []);

    // Simulated live activity feed
    useEffect(() => {
        const activities = [
            { text: "New results published for Semester 5", time: "2 min ago", icon: Award },
            { text: "Exam schedule updated", time: "15 min ago", icon: Bell },
            { text: "Fee payment deadline extended", time: "1 hour ago", icon: Clock },
        ];
        setRecentActivity(activities);
    }, []);

    const features = [
        {
            icon: Shield,
            title: "AI Protected",
            description: "Advanced System Guardian monitors and protects your data 24/7",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized for speed with intelligent caching and pagination",
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: Database,
            title: "Smart Storage",
            description: "Predictive analytics prevent data overflow and ensure stability",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Lock,
            title: "Secure & Private",
            description: "Role-based access control with enterprise-grade security",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
            {/* System Health Badge - Floating */}
            <div className="fixed top-20 right-6 z-50 animate-fade-in">
                <div className={`px-4 py-2 rounded-full backdrop-blur-md border ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
                    } shadow-lg flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full ${systemHealth.status === 'Stable' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                        }`}></div>
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        System: {systemHealth.status}
                    </span>
                    <Shield size={14} className="text-[#d4af37]" />
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-20 left-6 z-50 p-3 rounded-full bg-[#d4af37] hover:bg-[#c5a028] transition-all shadow-lg"
            >
                {darkMode ? <Sun size={20} className="text-[#0a1628]" /> : <Moon size={20} className="text-white" />}
            </button>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Animated Background */}
                <div className={`absolute inset-0 ${darkMode
                        ? 'bg-gradient-to-br from-[#0a1628] via-[#0f1d35] to-[#1a2942]'
                        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
                    }`}></div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute rounded-full ${darkMode ? 'bg-[#d4af37]' : 'bg-purple-400'} opacity-20`}
                            style={{
                                width: Math.random() * 6 + 2 + 'px',
                                height: Math.random() * 6 + 2 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 animate-slide-in-left">
                            {/* AI Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 backdrop-blur-sm">
                                <Sparkles size={16} className="text-[#d4af37]" />
                                <span className={`text-sm font-medium ${darkMode ? 'text-[#d4af37]' : 'text-purple-700'}`}>
                                    AI-Powered University Portal
                                </span>
                            </div>

                            <h1 className={`text-5xl lg:text-7xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                Welcome to
                                <span className="block bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent mt-2">
                                    Nexus System
                                </span>
                            </h1>

                            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                Experience the future of education with our intelligent, secure, and lightning-fast portal.
                                Powered by AI, protected by advanced security.
                            </p>

                            {/* AI Welcome Message */}
                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                } border backdrop-blur-sm flex items-start gap-3 animate-bounce-subtle`}>
                                <MessageCircle className="text-[#d4af37] mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Hi 👋 I'm your AI Assistant
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                        I can help you find results, notices, admissions info, and more!
                                    </p>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/login"
                                    className="group px-8 py-4 bg-[#d4af37] hover:bg-[#c5a028] text-[#0a1628] font-bold rounded-xl transition-all shadow-lg shadow-[#d4af37]/20 flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className={`px-8 py-4 ${darkMode
                                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                        : 'bg-white hover:bg-gray-50 text-gray-900'
                                    } font-bold rounded-xl transition-all border ${darkMode ? 'border-gray-700' : 'border-gray-200'
                                    } shadow-lg`}>
                                    Learn More
                                </button>
                            </div>

                            {/* Daily Tip */}
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                                } border flex items-center gap-2`}>
                                <Sparkles size={16} className="text-blue-500" />
                                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                    {dailyTip}
                                </p>
                            </div>
                        </div>

                        {/* Right Content - Stats Dashboard */}
                        <div className="space-y-6 animate-slide-in-right">
                            {/* Real-Time Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                    } border backdrop-blur-sm hover:scale-105 transition-transform`}>
                                    <Users className="text-[#d4af37] mb-3" size={32} />
                                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.students.toLocaleString()}
                                    </div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                        Active Students
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                    } border backdrop-blur-sm hover:scale-105 transition-transform`}>
                                    <GraduationCap className="text-blue-500 mb-3" size={32} />
                                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.faculty}
                                    </div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                        Faculty Members
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                    } border backdrop-blur-sm hover:scale-105 transition-transform`}>
                                    <Bell className="text-green-500 mb-3" size={32} />
                                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.notices}
                                    </div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                        Notices Today
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                    } border backdrop-blur-sm hover:scale-105 transition-transform`}>
                                    <Activity className="text-purple-500 mb-3" size={32} />
                                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.uptime}%
                                    </div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                        System Uptime
                                    </div>
                                </div>
                            </div>

                            {/* Live Activity Feed */}
                            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                } border backdrop-blur-sm`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="text-[#d4af37]" size={20} />
                                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Live Activity
                                    </h3>
                                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="space-y-3">
                                    {recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-3 group">
                                            <activity.icon size={16} className="text-[#d4af37] mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {activity.text}
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Portal */}
            <section className={`py-20 relative ${darkMode ? 'bg-[#0f1d35]' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Why Choose <span className="text-[#d4af37]">Nexus System</span>?
                        </h2>
                        <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                            Built with cutting-edge AI technology and designed for excellence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className={`group p-8 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                                    } border hover:border-[#d4af37] transition-all hover:scale-105 hover:shadow-2xl`}
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={32} className="text-white" />
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, text: "99.9% Uptime Guaranteed", color: "blue" },
                            { icon: Lock, text: "Enterprise-Grade Security", color: "green" },
                            { icon: Zap, text: "AI-Optimized Performance", color: "purple" }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 p-6 rounded-xl ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100'
                                    } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                            >
                                <item.icon className={`text-${item.color}-500`} size={24} />
                                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {item.text}
                                </span>
                                <CheckCircle className="ml-auto text-green-500" size={20} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Chat Component */}
            <AIChat />

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out;
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
