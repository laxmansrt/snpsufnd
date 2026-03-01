import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI } from '../services/assignmentService';
import { PenTool, Plus, X, Calendar, User, Trash2, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import clsx from 'clsx';

const AssignmentsPage = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        class: '',
        department: '',
        dueDate: '',
        maxMarks: 100,
    });

    const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            setLoading(true);
            const data = await assignmentAPI.getAssignments();
            setAssignments(data);
        } catch (error) {
            console.error('Error loading assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await assignmentAPI.createAssignment(formData);
            setShowCreateModal(false);
            setFormData({ title: '', description: '', subject: '', class: '', department: '', dueDate: '', maxMarks: 100 });
            loadAssignments();
            alert('Assignment created successfully!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSubmit = async () => {
        if (!selectedAssignment) return;
        try {
            await assignmentAPI.submitAssignment(selectedAssignment._id, { submissionText });
            setShowSubmitModal(false);
            setSubmissionText('');
            setSelectedAssignment(null);
            loadAssignments();
            alert('Assignment submitted successfully!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;
        try {
            await assignmentAPI.deleteAssignment(id);
            loadAssignments();
        } catch (error) {
            alert(error.message);
        }
    };

    const getStatus = (assignment) => {
        const now = new Date();
        const due = new Date(assignment.dueDate);
        if (assignment.mySubmission) return { label: 'Submitted', color: 'text-green-400 bg-green-500/20', icon: CheckCircle };
        if (now > due) return { label: 'Overdue', color: 'text-red-400 bg-red-500/20', icon: AlertCircle };
        return { label: 'Pending', color: 'text-yellow-400 bg-yellow-500/20', icon: Clock };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Assignments</h1>
                    <p className="text-gray-400">{isAdmin ? 'Create and manage assignments' : 'View and submit your assignments'}</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        New Assignment
                    </button>
                )}
            </div>

            {/* Assignments List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading assignments...</div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <PenTool size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No assignments found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {assignments.map(assignment => {
                        const status = user?.role === 'student' ? getStatus(assignment) : null;
                        return (
                            <div key={assignment._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{assignment.title}</h3>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                                {assignment.subject}
                                            </span>
                                            {status && (
                                                <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1', status.color)}>
                                                    <status.icon size={14} />
                                                    {status.label}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-300 text-sm mb-3">{assignment.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {user?.role === 'student' && !assignment.mySubmission && new Date() <= new Date(assignment.dueDate) && (
                                            <button
                                                onClick={() => { setSelectedAssignment(assignment); setShowSubmitModal(true); }}
                                                className="px-4 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg text-sm transition-colors flex items-center gap-1"
                                            >
                                                <Send size={16} />
                                                Submit
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(assignment._id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-400 pt-3 border-t border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>{assignment.createdBy?.name}</span>
                                    </div>
                                    <span className="text-gray-500">Class: {assignment.class}</span>
                                    <span className="text-gray-500">Max Marks: {assignment.maxMarks}</span>
                                    {isAdmin && <span className="text-gray-500">Submissions: {assignment.submissions?.length || assignment.submissionCount || 0}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
                            <h2 className="text-2xl font-bold text-white">Create Assignment</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="Assignment title" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="Assignment description and instructions" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="e.g. DBMS" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                                    <input type="text" required value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="e.g. CSE - Sem 5" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                                    <input type="datetime-local" required value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Marks</label>
                                    <input type="number" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors">
                                    Create Assignment
                                </button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submit Modal */}
            {showSubmitModal && selectedAssignment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Submit: {selectedAssignment.title}</h2>
                            <button onClick={() => { setShowSubmitModal(false); setSelectedAssignment(null); }} className="text-gray-400 hover:text-white p-2">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Your Answer / Submission</label>
                                <textarea rows={6} value={submissionText} onChange={(e) => setSubmissionText(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="Type your submission here..." />
                            </div>
                            <button onClick={handleSubmit} className="w-full px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors">
                                Submit Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
