import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Filter, Edit2, Trash2, X } from 'lucide-react';
import { academicAPI } from '../services/academicService';

const AcademicsPage = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [selectedClass, setSelectedClass] = useState('CSE 5A');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'department', 'subject', 'timetable'
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [deptsData, subsData, timesData] = await Promise.all([
                academicAPI.getDepartments(),
                academicAPI.getSubjects(),
                academicAPI.getTimetables()
            ]);
            setDepartments(deptsData);
            setSubjects(subsData);
            setTimetables(timesData);
        } catch (error) {
            console.error('Error fetching academic data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = user?.role === 'admin';

    const tabs = [
        { id: 'courses', label: 'Courses & Departments' },
        { id: 'subjects', label: 'Subjects & Syllabus' },
        { id: 'timetable', label: 'Class Timetable' },
    ];

    const handleOpenModal = (type, item = null) => {
        setModalType(type);
        setEditItem(item);
        if (item) {
            setFormData(item);
        } else {
            setFormData(type === 'timetable' ? { slots: ['', '', '', '', '', ''] } : {});
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditItem(null);
        setFormData({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'department') {
                if (editItem) {
                    await academicAPI.updateDepartment(editItem._id, formData);
                } else {
                    await academicAPI.createDepartment(formData);
                }
            } else if (modalType === 'subject') {
                if (editItem) {
                    await academicAPI.updateSubject(editItem._id, formData);
                } else {
                    await academicAPI.createSubject(formData);
                }
            } else if (modalType === 'timetable') {
                if (editItem) {
                    await academicAPI.updateTimetable(editItem._id, formData);
                } else {
                    await academicAPI.createTimetable(formData);
                }
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            if (type === 'department') await academicAPI.deleteDepartment(id);
            if (type === 'subject') await academicAPI.deleteSubject(id);
            if (type === 'timetable') await academicAPI.deleteTimetable(id);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const renderTimetable = () => {
        const filteredTimetable = timetables.filter(t => t.className === selectedClass);
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        return (
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
                            {isAdmin && <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {days.map((day) => {
                            const entry = filteredTimetable.find(t => t.day === day) || { slots: ['', '', '', '', '', ''] };
                            return (
                                <tr key={day} className="hover:bg-[#0f172a] transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{day}</td>
                                    {entry.slots.map((slot, slotIdx) => (
                                        <td key={slotIdx} className="px-4 py-3 text-center">
                                            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${slot === 'Break' || !slot
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-[#d4af37]/20 text-[#d4af37]'
                                                }`}>
                                                {slot || '-'}
                                            </span>
                                        </td>
                                    ))}
                                    {isAdmin && (
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenModal('timetable', { ...entry, day, className: selectedClass })} className="p-1 text-blue-400 hover:bg-blue-400/10 rounded">
                                                    <Edit2 size={16} />
                                                </button>
                                                {entry._id && (
                                                    <button onClick={() => handleDelete('timetable', entry._id)} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Academic Management</h1>
                    <p className="text-gray-400">Manage courses, subjects, and academic structure.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenModal(activeTab === 'courses' ? 'department' : activeTab === 'subjects' ? 'subject' : 'timetable')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add New {activeTab === 'courses' ? 'Department' : activeTab === 'subjects' ? 'Subject' : 'Timetable'}</span>
                    </button>
                )}
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
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
                    </div>
                ) : (
                    <>
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
                                                {isAdmin && <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {departments.map((dept) => (
                                                <tr key={dept._id} className="hover:bg-[#0f172a] transition-colors">
                                                    <td className="px-6 py-4 text-white font-medium">{dept.name}</td>
                                                    <td className="px-6 py-4 text-gray-300">{dept.code}</td>
                                                    <td className="px-6 py-4 text-gray-300">{dept.duration}</td>
                                                    <td className="px-6 py-4 text-gray-300">{dept.students}</td>
                                                    <td className="px-6 py-4 text-gray-300">{dept.hod}</td>
                                                    {isAdmin && (
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => handleOpenModal('department', dept)} className="p-1 text-blue-400 hover:bg-blue-400/10 rounded">
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button onClick={() => handleDelete('department', dept._id)} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
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
                                        {departments.map(d => <option key={d._id} value={d.code}>{d.code}</option>)}
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
                                                {isAdmin && <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {subjects.map((subject) => (
                                                <tr key={subject._id} className="hover:bg-[#0f172a] transition-colors">
                                                    <td className="px-6 py-4 text-white font-medium">{subject.name}</td>
                                                    <td className="px-6 py-4 text-gray-300">{subject.code}</td>
                                                    <td className="px-6 py-4 text-gray-300">{subject.semester}</td>
                                                    <td className="px-6 py-4 text-gray-300">{subject.credits}</td>
                                                    <td className="px-6 py-4 text-gray-300">{subject.department}</td>
                                                    {isAdmin && (
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => handleOpenModal('subject', subject)} className="p-1 text-blue-400 hover:bg-blue-400/10 rounded">
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button onClick={() => handleDelete('subject', subject._id)} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
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
                                {renderTimetable()}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {editItem ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {modalType === 'department' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Department Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Code</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                            value={formData.code || ''}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                                value={formData.duration || ''}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Students</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                                value={formData.students || ''}
                                                onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">HOD</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                            value={formData.hod || ''}
                                            onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {modalType === 'subject' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Subject Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Code</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                            value={formData.code || ''}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Semester</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                                value={formData.semester || ''}
                                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Credits</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                                value={formData.credits || ''}
                                                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                                        <select
                                            required
                                            className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                            value={formData.department || ''}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(d => <option key={d._id} value={d.code}>{d.name} ({d.code})</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            {modalType === 'timetable' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Class</label>
                                            <input
                                                type="text"
                                                required
                                                readOnly={!!editItem}
                                                className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none opacity-70"
                                                value={formData.className || selectedClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Day</label>
                                            <input
                                                type="text"
                                                required
                                                readOnly={!!editItem}
                                                className="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none opacity-70"
                                                value={formData.day || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">Slots</label>
                                        {formData.slots?.map((slot, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <span className="text-xs text-gray-500 w-20">Slot {idx + 1}</span>
                                                <input
                                                    type="text"
                                                    placeholder="Subject Name or 'Break'"
                                                    className="flex-1 p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                                    value={slot}
                                                    onChange={(e) => {
                                                        const newSlots = [...formData.slots];
                                                        newSlots[idx] = e.target.value;
                                                        setFormData({ ...formData, slots: newSlots });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-[#d4af37] text-[#0f172a] rounded-lg font-bold hover:bg-[#c5a028] transition-colors mt-4"
                            >
                                {editItem ? 'Update' : 'Create'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicsPage;
