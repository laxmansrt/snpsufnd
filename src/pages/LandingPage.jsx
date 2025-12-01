import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Users, GraduationCap, TrendingUp, Award, CheckCircle, MapPin, Phone, Mail, Clock, ArrowRight, BookOpen, Building2, Microscope, Briefcase, Heart } from 'lucide-react';
import campus1 from '../assets/campus1.png';
import campus2 from '../assets/campus2.png';
import campus3 from '../assets/campus3.png';
import campus4 from '../assets/campus4.png';
import campus5 from '../assets/campus5.png';
import campus6 from '../assets/campus6.png';
import campus7 from '../assets/campus7.png';
import campus8 from '../assets/campus8.png';
import feature1 from '../assets/feature_section_1.png';
import feature2 from '../assets/feature_section_2.png';

const LandingPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const campusImages = [
        campus1,
        campus2,
        campus3,
        campus4,
        campus5,
        campus6,
        campus7,
        campus8
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % campusImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const existingInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
            const newInquiry = {
                id: Date.now(),
                ...formData,
                date: new Date().toISOString(),
                status: 'New'
            };
            localStorage.setItem('inquiries', JSON.stringify([newInquiry, ...existingInquiries]));
            setSubmitStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
            setTimeout(() => setSubmitStatus(null), 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        }
    };

    const schools = [
        {
            icon: BookOpen,
            title: 'School of Engineering and Technology',
            programs: ['Computer Science & Engineering', 'CSE (AI & ML)', 'CSE (AI & Data Science)', 'Electronics & Communication', 'Electrical & Electronics'],
            color: 'from-blue-600 to-blue-800'
        },
        {
            icon: GraduationCap,
            title: 'School of Applied Science',
            programs: ['BCA (General, Data Science, AI & ML)', 'MCA (AI & Data Science, Cyber Security)'],
            color: 'from-purple-600 to-purple-800'
        },
        {
            icon: Briefcase,
            title: 'School of Management Studies',
            programs: ['MBA (Finance, HR, Marketing)', 'Business Analytics', 'Healthcare Management'],
            color: 'from-green-600 to-green-800'
        },
        {
            icon: Heart,
            title: 'School of Medicine',
            programs: ['MBBS', 'MD (Multiple Specializations)', 'MS (Surgery, Orthopaedics)', 'DM & M.Ch (Super Speciality)'],
            color: 'from-red-600 to-red-800'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1d35] to-[#1a2942]"></div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-[#d4af37] rounded-full animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: Math.random() * 0.5 + 0.3
                            }}
                        ></div>
                    ))}
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2942] border border-[#d4af37]/30 rounded-full">
                                <Sparkles className="text-[#d4af37]" size={18} />
                                <span className="text-[#d4af37] font-semibold text-sm">Admissions Open 2025-26</span>
                            </div>

                            {/* Heading */}
                            <div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                                    Shape Your
                                    <br />
                                    <span className="text-[#d4af37]">Bright Future</span>
                                </h1>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
                                Join a legacy of excellence at one of India's premier universities. Experience world-class education, cutting-edge research, and industry-ready skills.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/login"
                                    className="group px-8 py-4 bg-[#d4af37] text-[#0a1628] rounded-xl font-bold text-lg hover:bg-[#c5a028] transition-all transform hover:scale-105 shadow-lg shadow-[#d4af37]/20 flex items-center gap-2"
                                >
                                    Apply Now
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>
                                <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/5 transition-all flex items-center gap-2">
                                    <Globe size={20} />
                                    Virtual Tour
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 pt-8">
                                <div>
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                        20K<span className="text-[#d4af37]">+</span>
                                    </div>
                                    <div className="text-gray-400 text-sm">Students</div>
                                </div>
                                <div>
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                        500<span className="text-[#d4af37]">+</span>
                                    </div>
                                    <div className="text-gray-400 text-sm">Faculty</div>
                                </div>
                                <div>
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                        98<span className="text-[#d4af37]">%</span>
                                    </div>
                                    <div className="text-gray-400 text-sm">Placements</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Images */}
                        <div className="relative hidden lg:block">
                            {/* Main Building Image */}
                            <div className="relative">
                                <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-[#d4af37]/20 to-blue-600/20 rounded-3xl blur-xl"></div>
                                <div className="relative bg-gradient-to-br from-[#1a2942] to-[#0f1d35] p-4 rounded-3xl border border-white/10 shadow-2xl">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden">
                                        <img
                                            src={campus1}
                                            alt="University Campus"
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    {/* NAAC Badge */}
                                    <div className="absolute top-8 right-8 bg-white rounded-2xl p-3 shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <Award className="text-[#d4af37]" size={24} />
                                            <div>
                                                <div className="font-bold text-[#0a1628] text-sm">NAAC A++</div>
                                                <div className="text-xs text-gray-600">Accredited</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Facilities Card */}
                            <div className="absolute -bottom-32 -left-16 bg-gradient-to-br from-[#1a2942] to-[#0f1d35] p-4 rounded-3xl border border-white/10 shadow-2xl max-w-sm">
                                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden mb-3">
                                    <img
                                        src={campus2}
                                        alt="Facilities"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-bold">Premium Facilities</div>
                                        <div className="text-[#d4af37] text-sm font-semibold">500+ Seats</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Schools & Departments Section */}
            <section className="py-24 bg-[#0f1d35] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Schools & Departments</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Explore diverse programs across multiple disciplines designed for academic excellence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {schools.map((school, index) => (
                            <div key={index} className="group bg-[#1a2942] p-8 rounded-2xl border border-white/10 hover:border-[#d4af37]/50 transition-all hover:transform hover:scale-105">
                                <div className={`w-16 h-16 bg-gradient-to-br ${school.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <school.icon className="text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{school.title}</h3>
                                <ul className="space-y-2">
                                    {school.programs.map((program, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-400">
                                            <CheckCircle className="text-[#d4af37] flex-shrink-0 mt-0.5" size={16} />
                                            <span>{program}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Campus Life Slideshow */}
            <section className="relative h-screen bg-[#0a1628] overflow-hidden">
                {/* Slideshow Images */}
                {campusImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Campus Life ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent"></div>
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-12 z-10 bg-gradient-to-t from-[#0a1628] to-transparent">
                    <div className="container mx-auto">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                            Life at <span className="text-[#d4af37]">SNPSU</span>
                        </h2>
                        <p className="text-xl text-gray-200 max-w-2xl drop-shadow-md">
                            Experience the vibrant campus life, world-class facilities, and a community that feels like home.
                        </p>
                    </div>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-12 right-12 flex gap-3 z-20">
                    {campusImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-[#d4af37] w-8' : 'bg-white/50 hover:bg-white'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Feature Sections */}
            <section className="w-full">
                <img
                    src={feature1}
                    alt="Feature Section 1"
                    className="w-full h-auto object-cover"
                />
            </section>
            <section className="w-full">
                <img
                    src={feature2}
                    alt="Feature Section 2"
                    className="w-full h-auto object-cover"
                />
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-[#0a1628]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose SNPSU</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Discover what makes Sapthagiri NPS University the perfect choice for your academic journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Award, title: 'NAAC A++ Accredited', desc: 'Recognized for academic excellence and quality education standards' },
                            { icon: Users, title: 'Expert Faculty', desc: '500+ experienced professors dedicated to student success' },
                            { icon: TrendingUp, title: '98% Placement Rate', desc: 'Strong industry connections ensuring bright career prospects' },
                            { icon: Building2, title: 'World-Class Infrastructure', desc: 'State-of-the-art facilities and modern learning environment' },
                            { icon: Globe, title: 'Global Exposure', desc: 'International collaborations and exchange programs' },
                            { icon: CheckCircle, title: 'Industry Integration', desc: 'Curriculum designed with industry requirements in mind' }
                        ].map((item, index) => (
                            <div key={index} className="group bg-[#1a2942] p-8 rounded-2xl border border-white/10 hover:border-[#d4af37]/50 transition-all hover:transform hover:scale-105">
                                <div className="w-14 h-14 bg-[#d4af37]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/30 transition-colors">
                                    <item.icon className="text-[#d4af37]" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-[#0f1d35]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
                        <p className="text-gray-400 text-lg">We're here to answer your questions and guide you</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 bg-[#1a2942] rounded-2xl border border-white/10">
                                <MapPin className="text-[#d4af37] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="text-white font-bold mb-2">Address</h3>
                                    <p className="text-gray-400">#14/5, Chikkasandra, Hesarghatta Main Road, Bengaluru – 560057</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-[#1a2942] rounded-2xl border border-white/10">
                                <Phone className="text-[#d4af37] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="text-white font-bold mb-2">Phone</h3>
                                    <p className="text-gray-400">9900072632</p>
                                    <p className="text-gray-400">9035922191/92/93/94/95</p>
                                    <p className="text-gray-400">080-28372800 / 080-29633636</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-[#1a2942] rounded-2xl border border-white/10">
                                <Mail className="text-[#d4af37] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="text-white font-bold mb-2">Email</h3>
                                    <p className="text-gray-400">admissions@snpsu.edu.in</p>
                                    <p className="text-gray-400">director.marketing@snpsu.edu.in</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-[#1a2942] rounded-2xl border border-white/10">
                                <Clock className="text-[#d4af37] flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="text-white font-bold mb-2">Office Hours</h3>
                                    <p className="text-gray-400">Monday - Saturday: 9:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-[#1a2942] rounded-2xl p-8 border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {submitStatus === 'success' && (
                                    <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 flex items-center gap-2">
                                        <CheckCircle size={20} />
                                        Message sent successfully! We'll get back to you soon.
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                                        Failed to send message. Please try again.
                                    </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#0a1628] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#0a1628] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a1628] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a1628] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Message</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a1628] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none resize-none transition-all"
                                        placeholder="Tell us about your inquiry..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#d4af37] text-[#0a1628] font-bold rounded-xl hover:bg-[#c5a028] transition-all transform hover:scale-105 shadow-lg shadow-[#d4af37]/20"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
