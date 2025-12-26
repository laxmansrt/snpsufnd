import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    FileText,
    DollarSign,
    Bus,
    Home,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    HelpCircle
} from 'lucide-react';
import clsx from 'clsx';
import AIChat from '../components/AIChat';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close sidebar on mobile when route changes
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Define menu items based on role
    const getMenuItems = (role) => {
        const common = [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: HelpCircle, label: 'Lost & Found', path: '/dashboard/lost-found' },
        ];

        const admin = [
            { icon: Users, label: 'User Management', path: '/dashboard/users' },
            { icon: BookOpen, label: 'Academics', path: '/dashboard/academics' },
            { icon: Calendar, label: 'Attendance', path: '/dashboard/attendance' },
            { icon: FileText, label: 'Results', path: '/dashboard/results' },
            { icon: DollarSign, label: 'Finance', path: '/dashboard/finance' },
            { icon: Bus, label: 'Transport', path: '/dashboard/transport' },
            { icon: Home, label: 'Hostel', path: '/dashboard/hostel' },
            { icon: Bell, label: 'Communication', path: '/dashboard/communication' },
            { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        ];

        const faculty = [
            { icon: Calendar, label: 'Attendance', path: '/dashboard/attendance' },
            { icon: FileText, label: 'Marks Entry', path: '/dashboard/marks' },
            { icon: BookOpen, label: 'Study Material', path: '/dashboard/materials' },
            { icon: Users, label: 'Student Insights', path: '/dashboard/students' },
            { icon: Bell, label: 'Announcements', path: '/dashboard/announcements' },
        ];

        const student = [
            { icon: BookOpen, label: 'My Academics', path: '/dashboard/academics' },
            { icon: FileText, label: 'Study Material', path: '/dashboard/materials' },
            { icon: Calendar, label: 'Attendance', path: '/dashboard/attendance' },
            { icon: DollarSign, label: 'Fee Status', path: '/dashboard/fees' },
            { icon: Bus, label: 'Transport', path: '/dashboard/transport' },
            { icon: Home, label: 'Hostel', path: '/dashboard/hostel' },
            { icon: Bell, label: 'Notices', path: '/dashboard/notices' },
        ];

        const parent = [
            { icon: Users, label: 'Child Progress', path: '/dashboard/child' },
            { icon: Calendar, label: 'Attendance', path: '/dashboard/attendance' },
            { icon: DollarSign, label: 'Fee Payment', path: '/dashboard/fees' },
            { icon: Bus, label: 'Bus Tracking', path: '/dashboard/transport' },
            { icon: Bell, label: 'Messages', path: '/dashboard/messages' },
        ];

        switch (role) {
            case 'admin': return [...common, ...admin];
            case 'faculty': return [...common, ...faculty];
            case 'student': return [...common, ...student];
            case 'parent': return [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: Users, label: 'Child Progress', path: '/dashboard/child' },
                { icon: Calendar, label: 'Attendance', path: '/dashboard/attendance' },
                { icon: DollarSign, label: 'Fee Payment', path: '/dashboard/fees' },
                { icon: Bus, label: 'Bus Tracking', path: '/dashboard/transport' },
                { icon: Bell, label: 'Messages', path: '/dashboard/messages' },
            ];
            default: return common;
        }
    };

    const menuItems = getMenuItems(user?.role);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0f172a] flex transition-colors duration-300">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen shadow-xl lg:shadow-none",
                    !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
                )}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1f2937] shrink-0">
                    <div className={clsx("flex items-center gap-3 overflow-hidden transition-all duration-300", !isSidebarOpen && "lg:hidden")}>
                        <div className="w-12 h-12 bg-[#ede1d1] rounded-lg overflow-hidden flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300">
                            <img
                                src="/assets/sidebar-logo.jpg"
                                alt="Logo"
                                className="w-10 h-10 object-contain animate-float"
                            />
                        </div>
                        <span className="font-serif font-bold text-xl whitespace-nowrap text-gray-900 dark:text-white">snpsu.edu.in</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
                    <div className={clsx("flex items-center gap-3 mb-8 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md", !isSidebarOpen && "lg:justify-center lg:p-2")}>
                        <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-[#d4af37] shadow-md transition-transform hover:scale-110 duration-200" />
                        <div className={clsx("overflow-hidden", !isSidebarOpen && "lg:hidden")}>
                            <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative my-1 transform hover:translate-x-1",
                                    location.pathname === item.path
                                        ? "text-[#d4af37] bg-white dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-transparent scale-[1.02]"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                                    !isSidebarOpen && "lg:justify-center"
                                )}
                                title={!isSidebarOpen ? item.label : ''}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {location.pathname === item.path && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d4af37] rounded-r-full animate-fade-in"></div>
                                )}
                                <item.icon size={20} className={clsx("transition-transform group-hover:rotate-12", location.pathname === item.path && "text-[#d4af37]")} />
                                <span className={clsx(!isSidebarOpen && "lg:hidden")}>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-transparent">
                    <button
                        onClick={handleLogout}
                        className={clsx(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-all hover:scale-105 active:scale-95",
                            !isSidebarOpen && "lg:justify-center"
                        )}
                    >
                        <LogOut size={20} />
                        <span className={clsx(!isSidebarOpen && "lg:hidden")}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={clsx(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm transition-colors duration-300">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-[#d4af37]/50 outline-none w-64 text-sm placeholder-gray-500 dark:placeholder-gray-600 transition-all focus:w-72 duration-300"
                            />
                        </div>

                        <button className="relative text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors hover:scale-110 transform duration-200">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111827] animate-pulse"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden bg-gray-100 dark:bg-[#0f172a] transition-colors duration-300 animate-fade-in">
                    <Outlet />
                </main>
                <AIChat />
            </div>
        </div>
    );
};

export default DashboardLayout;
