import React, { useState } from 'react';
import { BookOpen, Search, Plus, Filter } from 'lucide-react';

const AcademicsPage = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [selectedClass, setSelectedClass] = useState('CSE 5A');

    const tabs = [
        { id: 'courses', label: 'Courses & Departments' },
        { id: 'subjects', label: 'Subjects & Syllabus' },
        { id: 'timetable', label: 'Class Timetable' },
    ];

    // Mock Data
    const departments = [
        { id: 1, name: 'Computer Science & Engineering', code: 'CSE', duration: '4 Years', students: 240, hod: 'Dr. N C Mahendra Babu' },
        { id: 2, name: 'Electronics & Communication', code: 'ECE', duration: '4 Years', students: 180, hod: 'Dr. R. Kumar' },
        { id: 3, name: 'Information Science & Engineering', code: 'ISE', duration: '4 Years', students: 120, hod: 'Dr. B. S. Prasad' },
        { id: 4, name: 'Electrical & Electronics', code: 'EEE', duration: '4 Years', students: 120, hod: 'Dr. S. Sharma' },
    ];

    const subjects = [
        { id: 1, name: 'Data Structures', code: 'CS301', semester: '3', credits: 4, department: 'CSE' },
        { id: 2, name: 'Operating Systems', code: 'CS401', semester: '4', credits: 4, department: 'CSE' },
        { id: 3, name: 'Database Management', code: 'CS402', semester: '4', credits: 3, department: 'CSE' },
        { id: 4, name: 'Digital Logic Design', code: 'EC201', semester: '2', credits: 4, department: 'ECE' },
    ];

    const timetables = {
        'CSE 5A': [
            { day: 'Monday', slots: ['Data Structures', 'OS Lab', 'DBMS', 'Break', 'Mathematics', 'Physics'] },
            { day: 'Tuesday', slots: ['DBMS', 'Data Structures', 'OS', 'Break', 'Chemistry', 'English'] },
            { day: 'Wednesday', slots: ['Operating Systems', 'DBMS Lab', 'Mathematics', 'Break', 'Data Structures', 'Sports'] },
            { day: 'Thursday', slots: ['Mathematics', 'Physics', 'DBMS', 'Break', 'OS', 'Data Structures'] },
            { day: 'Friday', slots: ['Chemistry', 'English', 'Data Structures', 'Break', 'Project Work', 'Project Work'] },
        ],
        'CSE 5B': [
            { day: 'Monday', slots: ['OS', 'DBMS', 'Data Structures', 'Break', 'Physics', 'Mathematics'] },
            { day: 'Tuesday', slots: ['Data Structures', 'OS Lab', 'English', 'Break', 'DBMS', 'Chemistry'] },
            { day: 'Wednesday', slots: ['Mathematics', 'Physics', 'Sports', 'Break', 'DBMS Lab', 'OS'] },
            { day: 'Thursday', slots: ['DBMS', 'Data Structures', 'OS', 'Break', 'Mathematics', 'Physics'] },
            { day: 'Friday', slots: ['Project Work', 'Project Work', 'Chemistry', 'Break', 'English', 'Data Structures'] },
        ],
        'ECE 3A': [
            { day: 'Monday', slots: ['Network Analysis', 'Digital Electronics', 'Signals & Systems', 'Break', 'Mathematics', 'Physics'] },
            { day: 'Tuesday', slots: ['Signals & Systems', 'DE Lab', 'Mathematics', 'Break', 'Network Analysis', 'English'] },
            { day: 'Wednesday', slots: ['Digital Electronics', 'NA Lab', 'English', 'Break', 'Signals & Systems', 'Sports'] },
            { day: 'Thursday', slots: ['Mathematics', 'Physics', 'Network Analysis', 'Break', 'Digital Electronics', 'Signals & Systems'] },
            { day: 'Friday', slots: ['Chemistry', 'Mathematics', 'Signals & Systems', 'Break', 'Project Work', 'Project Work'] },
        ],
        'ISE 3A': [
            { day: 'Monday', slots: ['Discrete Mathematics', 'Java Programming', 'Data Comm', 'Break', 'Physics', 'Chemistry'] },
            { day: 'Tuesday', slots: ['Java Lab', 'Discrete Math', 'English', 'Break', 'Data Comm', 'Mathematics'] },
            { day: 'Wednesday', slots: ['Data Comm', 'Java', 'Sports', 'Break', 'Math Lab', 'Discrete Math'] },
            { day: 'Thursday', slots: ['Physics', 'Chemistry', 'Java', 'Break', 'Data Comm', 'Discrete Math'] },
            { day: 'Friday', slots: ['English', 'Mathematics', 'Project Work', 'Break', 'Project Work', 'Java'] },
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Academic Management</h1>
                    <p className="text-gray-400">Manage courses, subjects, and academic structure.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors">
                    <Plus size={18} />
                    <span>Add New</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6">
                {activeTab === 'courses' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search departments..."
                                    className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#0f172a] border-b border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Department</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Duration</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Students</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">HOD</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {departments.map((dept) => (
                                        <tr key={dept.id} className="hover:bg-[#0f172a] transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{dept.name}</td>
                                            <td className="px-6 py-4 text-gray-300">{dept.code}</td>
                                            <td className="px-6 py-4 text-gray-300">{dept.duration}</td>
                                            <td className="px-6 py-4 text-gray-300">{dept.students}</td>
                                            <td className="px-6 py-4 text-gray-300">{dept.hod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search subjects..."
                                    className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                />
                            </div>
                            <select className="px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none">
                                <option>All Semesters</option>
                                <option>Semester 1</option>
                                <option>Semester 2</option>
                                <option>Semester 3</option>
                                <option>Semester 4</option>
                            </select>
                            <select className="px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none">
                                <option>All Departments</option>
                                <option>CSE</option>
                                <option>ECE</option>
                                <option>EEE</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#0f172a] border-b border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Subject Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Semester</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Credits</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Department</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {subjects.map((subject) => (
                                        <tr key={subject.id} className="hover:bg-[#0f172a] transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{subject.name}</td>
                                            <td className="px-6 py-4 text-gray-300">{subject.code}</td>
                                            <td className="px-6 py-4 text-gray-300">{subject.semester}</td>
                                            <td className="px-6 py-4 text-gray-300">{subject.credits}</td>
                                            <td className="px-6 py-4 text-gray-300">{subject.department}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'timetable' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Weekly Timetable - {selectedClass}</h3>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                            >
                                <option value="CSE 5A">CSE 5A</option>
                                <option value="CSE 5B">CSE 5B</option>
                                <option value="ECE 3A">ECE 3A</option>
                                <option value="ISE 3A">ISE 3A</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#0f172a] border-b border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Day</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">9:00-10:00</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">10:00-11:00</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">11:00-12:00</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">12:00-1:00</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">1:00-2:00</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">2:00-3:00</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {timetables[selectedClass].map((day, idx) => (
                                        <tr key={idx} className="hover:bg-[#0f172a] transition-colors">
                                            <td className="px-4 py-3 text-white font-medium">{day.day}</td>
                                            {day.slots.map((slot, slotIdx) => (
                                                <td key={slotIdx} className="px-4 py-3 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${slot === 'Break'
                                                        ? 'bg-gray-700 text-gray-300'
                                                        : 'bg-[#d4af37]/20 text-[#d4af37]'
                                                        }`}>
                                                        {slot}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicsPage;
