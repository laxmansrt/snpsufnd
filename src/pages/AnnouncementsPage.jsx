import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { announcementAPI } from '../services/announcementService';
import { academicAPI } from '../services/academicService';
import { Bell, Plus, X, AlertTriangle, Info, Calendar, User, Trash2, Edit, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const AnnouncementsPage = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        targetAudience: ['all'],
        targetClasses: [],
        priority: 'normal',
        expiresAt: '',
    });

    const categories = [
        { id: 'all', label: 'All', color: 'gray' },
        { id: 'academic', label: 'Academic', color: 'blue' },
        { id: 'event', label: 'Event', color: 'purple' },
        { id: 'exam', label: 'Exam', color: 'red' },
        { id: 'general', label: 'General', color: 'green' },
        { id: 'urgent', label: 'Urgent', color: 'orange' },
        { id: 'video', label: 'Video Conference', color: 'yellow' },
    ];

    useEffect(() => {
        loadAnnouncements();
        loadDepartments();
    }, [selectedCategory]);

    const loadDepartments = async () => {
        try {
            const data = await academicAPI.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const handleAudienceToggle = (value) => {
        setFormData(prev => {
            let newAudience;
            if (value === 'all') {
                newAudience = ['all'];
            } else {
                const filtered = prev.targetAudience.filter(a => a !== 'all');
                if (filtered.includes(value)) {
                    newAudience = filtered.filter(a => a !== value);
                } else {
                    newAudience = [...filtered, value];
                }
                if (newAudience.length === 0) newAudience = ['all'];
            }
            // Clear departments if student is deselected
            const newClasses = newAudience.includes('student') ? prev.targetClasses : [];
            return { ...prev, targetAudience: newAudience, targetClasses: newClasses };
        });
    };

    const handleDeptToggle = (deptCode) => {
        setFormData(prev => {
            const current = prev.targetClasses;
            if (current.includes(deptCode)) {
                return { ...prev, targetClasses: current.filter(d => d !== deptCode) };
            } else {
                return { ...prev, targetClasses: [...current, deptCode] };
            }
        });
    };

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (selectedCategory !== 'all') {
                filters.category = selectedCategory;
            }
            const data = await announcementAPI.getAnnouncements(filters);
            setAnnouncements(data);
        } catch (error) {
            console.error('Error loading announcements:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await announcementAPI.createAnnouncement(formData);
            setShowCreateModal(false);
            setFormData({
                title: '',
                content: '',
                category: 'general',
                targetAudience: ['all'],
                targetClasses: [],
                priority: 'normal',
                expiresAt: '',
            });
            loadAnnouncements();
            alert('Announcement created successfully!');
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert(error.message);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await announcementAPI.deleteAnnouncement(id);
            loadAnnouncements();
            alert('Announcement deleted successfully!');
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert(error.message);
        }
    };

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.color : 'gray';
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            low: 'bg-gray-500/20 text-gray-400',
            normal: 'bg-green-500/20 text-green-400',
            medium: 'bg-blue-500/20 text-blue-400',
            high: 'bg-orange-500/20 text-orange-400',
            urgent: 'bg-red-500/20 text-red-400',
        };
        return colors[priority] || colors.medium;
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'urgent' || priority === 'high') {
            return <AlertTriangle size={16} />;
        }
        return <Info size={16} />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
                    <p className="text-gray-400">Stay updated with latest news and notifications</p>
                </div>
                {(user?.role === 'faculty' || user?.role === 'admin') && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        New Announcement
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={clsx(
                            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all',
                            selectedCategory === category.id
                                ? 'bg-[#d4af37] text-[#111827]'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        )}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading announcements...</div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <Bell size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No announcements found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(announcement => (
                        <div
                            key={announcement._id}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                                        <span className={clsx(
                                            'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                                            getPriorityBadge(announcement.priority)
                                        )}>
                                            <span className="flex items-center gap-1">
                                                {getPriorityIcon(announcement.priority)}
                                                {announcement.priority}
                                            </span>
                                        </span>
                                        <span className={clsx(
                                            'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                                            `bg-${getCategoryColor(announcement.category)}-500/20 text-${getCategoryColor(announcement.category)}-400`
                                        )}>
                                            {announcement.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                                </div>
                                {(user?.role === 'faculty' || user?.role === 'admin') && (
                                    <button
                                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-400 pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{announcement.publishedBy?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{new Date(announcement.publishedAt).toLocaleDateString()}</span>
                                </div>
                                {announcement.targetAudience && (
                                    <div className="flex items-center gap-2">
                                        <Bell size={16} />
                                        <span className="capitalize">{announcement.targetAudience.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Announcement Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
                            <h2 className="text-2xl font-bold text-white">Create Announcement</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    placeholder="Enter announcement title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    placeholder="Enter announcement details"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    >
                                        <option value="general">General</option>
                                        <option value="academic">Academic</option>
                                        <option value="event">Event</option>
                                        <option value="exam">Exam</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="video">Video Conference</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { value: 'all', label: 'All' },
                                        { value: 'student', label: 'Students' },
                                        { value: 'faculty', label: 'Faculty' },
                                        { value: 'parent', label: 'Parents' },
                                        { value: 'admin', label: 'Admin' },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleAudienceToggle(option.value)}
                                            className={clsx(
                                                'px-4 py-2 rounded-lg font-medium text-sm transition-all border',
                                                formData.targetAudience.includes(option.value)
                                                    ? 'bg-[#d4af37] text-[#111827] border-[#d4af37]'
                                                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Department Selection - visible when 'student' is selected */}
                            {formData.targetAudience.includes('student') && departments.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Target Departments {formData.targetClasses.length === 0 && <span className="text-gray-500">(All departments if none selected)</span>}
                                    </label>
                                    <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-900 border border-gray-700 max-h-40 overflow-y-auto">
                                        {departments.map(dept => (
                                            <button
                                                key={dept._id || dept.code}
                                                type="button"
                                                onClick={() => handleDeptToggle(dept.code)}
                                                className={clsx(
                                                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                                                    formData.targetClasses.includes(dept.code)
                                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                                        : 'bg-gray-800 text-gray-400 border-gray-600 hover:border-gray-400'
                                                )}
                                            >
                                                {dept.name} ({dept.code})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Expires At (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                                >
                                    Create Announcement
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsPage;
