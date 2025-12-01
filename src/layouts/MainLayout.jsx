import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-panel border-b-0 rounded-none">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/assets/logo.png" alt="SNPSU Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-serif tracking-tight text-[hsl(var(--primary))]">Sapthagiri NPS</span>
                            <span className="text-xs font-medium tracking-widest text-[hsl(var(--text-muted))] uppercase">University</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#about" className="text-sm font-medium hover:text-[hsl(var(--primary-light))] transition-colors">About</a>
                        <a href="#academics" className="text-sm font-medium hover:text-[hsl(var(--primary-light))] transition-colors">Academics</a>
                        <a href="#admissions" className="text-sm font-medium hover:text-[hsl(var(--primary-light))] transition-colors">Admissions</a>
                        <a href="#contact" className="text-sm font-medium hover:text-[hsl(var(--primary-light))] transition-colors">Contact</a>

                        <Link to="/login" className="btn btn-primary text-sm py-2 px-5 shadow-lg shadow-blue-900/20">
                            <LogIn size={18} />
                            <span>Portal Login</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow pt-20">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-[#001540] text-white pt-16 pb-8 mt-auto border-t-4 border-[#d4af37]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        {/* Column 1: Login, Newsletter, Careers, Contact */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-xl font-bold mb-4 relative inline-block">
                                    Login
                                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                    <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li><Link to="/login" className="hover:text-[#d4af37] transition-colors">Student Login</Link></li>
                                    <li><Link to="/login" className="hover:text-[#d4af37] transition-colors">Staff Login</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-bold mb-4 relative inline-block">
                                    Newsletter
                                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                    <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li><a href="#" className="hover:text-[#d4af37] transition-colors">SYNAPSE VOL 1 ISSUE 1</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-bold mb-4 relative inline-block">
                                    Careers
                                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                    <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li><a href="#" className="hover:text-[#d4af37] transition-colors">Current Openings</a></li>
                                    <li><a href="#" className="hover:text-[#d4af37] transition-colors">Alumni</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xl font-bold mb-4 relative inline-block">
                                    Contact
                                    <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                    <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li><a href="#contact" className="hover:text-[#d4af37] transition-colors">Contact</a></li>
                                    <li><a href="#" className="hover:text-[#d4af37] transition-colors">FAQ</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 2: Happenings */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 relative inline-block">
                                Happenings
                                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                            </h4>
                            <ul className="space-y-3 text-gray-300 text-sm">
                                {['News', 'Events', 'Activity & Workshops', 'Image Gallery', 'Video Gallery', 'Press Release', 'Media Coverage', 'Archives'].map((item) => (
                                    <li key={item}><a href="#" className="hover:text-[#d4af37] transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Others */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 relative inline-block">
                                Others
                                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                            </h4>
                            <ul className="space-y-3 text-gray-300 text-sm">
                                {['Sitemap', 'Blog', 'Terms & Conditions', 'Privacy Policy', 'Fee Payment', 'Hostel Registration', 'Transportation Services', 'Faculty Profile', 'Grievance Redressal', 'Anti Ragging', 'Committees', 'CME/CONFERENCE'].map((item) => (
                                    <li key={item}><a href="#" className="hover:text-[#d4af37] transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact Info & Map */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 relative inline-block">
                                Contact Info
                                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#d4af37]"></span>
                                <span className="absolute -bottom-1 left-14 w-8 h-1 bg-[#d4af37]/50"></span>
                            </h4>
                            <div className="space-y-4 text-gray-300 text-sm mb-6">
                                <p>#14/5, Chikkasandra, Hesarghatta Main Road, Bengaluru – 560057</p>
                                <div>
                                    <p className="font-bold text-white">Phone:</p>
                                    <p>9900072632</p>
                                    <p>9035922191/92/93/94/95</p>
                                    <p>080-28 372800/080-29633636</p>
                                </div>
                                <div>
                                    <p className="font-bold text-white">Email:</p>
                                    <p>admissions@snpsu.edu.in</p>
                                    <p>director.marketing@snpsu.edu.in</p>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="flex gap-3 mb-6">
                                {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((social) => (
                                    <a key={social} href="#" className="w-8 h-8 rounded-full bg-white text-[#001540] flex items-center justify-center hover:bg-[#d4af37] hover:text-white transition-colors">
                                        <img src={`/assets/icons/${social}.svg`} alt={social} className="w-4 h-4" onError={(e) => e.target.style.display = 'none'} />
                                    </a>
                                ))}
                            </div>

                            {/* Map */}
                            <div className="rounded-lg overflow-hidden border-2 border-white/20 h-48 w-full">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.683679051328!2d77.50866831482294!3d13.05580599080076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d1c55555555%3A0x5f4f9f9f9f9f9f9f!2sSapthagiri%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                        © 2025 Sapthagiri NPS University. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
