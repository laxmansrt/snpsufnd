import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feedbackAPI } from '../services/feedbackService';
import { MessageCircle, Plus, X, Star, Trash2, CheckCircle, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

const FeedbackPage = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRespondModal, setShowRespondModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'general',
        questions: [{ question: '', type: 'rating', required: true }],
    });

    const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await feedbackAPI.getFeedbackForms();
            setFeedbacks(data);
        } catch (error) {
            console.error('Error loading feedback forms:', error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', type: 'rating', required: true }],
        }));
    };

    const updateQuestion = (index, field, value) => {
        setFormData(prev => {
            const newQuestions = [...prev.questions];
            newQuestions[index] = { ...newQuestions[index], [field]: value };
            return { ...prev, questions: newQuestions };
        });
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await feedbackAPI.createFeedback(formData);
            setShowCreateModal(false);
            setFormData({ title: '', description: '', type: 'general', questions: [{ question: '', type: 'rating', required: true }] });
            loadFeedbacks();
            alert('Feedback form created successfully!');
        } catch (error) {
            alert(error.message);
        }
    };

    const openRespond = (feedback) => {
        setSelectedFeedback(feedback);
        setAnswers(feedback.questions.map((q, i) => ({
            questionIndex: i,
            ratingValue: q.type === 'rating' ? 0 : undefined,
            textValue: q.type === 'text' ? '' : undefined,
            selectedOption: q.type === 'multiple_choice' ? '' : undefined,
        })));
        setShowRespondModal(true);
    };

    const handleRespond = async () => {
        try {
            await feedbackAPI.submitResponse(selectedFeedback._id, { answers, isAnonymous: true });
            setShowRespondModal(false);
            setSelectedFeedback(null);
            loadFeedbacks();
            alert('Response submitted! Thank you.');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this feedback form?')) return;
        try {
            await feedbackAPI.deleteFeedback(id);
            loadFeedbacks();
        } catch (error) {
            alert(error.message);
        }
    };

    const StarRating = ({ value, onChange }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => onChange(star)}
                    className={clsx('transition-colors', star <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400')}>
                    <Star size={28} fill={star <= value ? 'currentColor' : 'none'} />
                </button>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Feedback & Surveys</h1>
                    <p className="text-gray-400">{isAdmin ? 'Create and manage feedback forms' : 'Share your feedback anonymously'}</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors">
                        <Plus size={20} /> New Survey
                    </button>
                )}
            </div>

            {/* Feedback List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading feedback forms...</div>
            ) : feedbacks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No feedback forms available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedbacks.map(fb => (
                        <div key={fb._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{fb.title}</h3>
                                    <p className="text-gray-400 text-sm">{fb.description}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 capitalize">
                                    {fb.type}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <span>{fb.questions?.length || 0} questions</span>
                                <span className="flex items-center gap-1"><BarChart3 size={14} /> {fb.totalResponses || 0} responses</span>
                            </div>

                            <div className="flex gap-2">
                                {user?.role === 'student' && !fb.hasResponded && (
                                    <button onClick={() => openRespond(fb)}
                                        className="flex-1 px-4 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg text-sm transition-colors">
                                        Give Feedback
                                    </button>
                                )}
                                {user?.role === 'student' && fb.hasResponded && (
                                    <span className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 font-semibold rounded-lg text-sm text-center flex items-center justify-center gap-1">
                                        <CheckCircle size={16} /> Submitted
                                    </span>
                                )}
                                {isAdmin && (
                                    <button onClick={() => handleDelete(fb._id)}
                                        className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Feedback Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
                            <h2 className="text-2xl font-bold text-white">Create Feedback Form</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white p-2">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="e.g. Course Feedback - DBMS" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none" placeholder="Brief description of this survey" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none">
                                    <option value="general">General</option>
                                    <option value="course">Course</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="infrastructure">Infrastructure</option>
                                </select>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-300">Questions</label>
                                    <button type="button" onClick={addQuestion} className="text-[#d4af37] text-sm font-semibold hover:underline">+ Add Question</button>
                                </div>
                                {formData.questions.map((q, i) => (
                                    <div key={i} className="flex gap-2 mb-3 items-start">
                                        <div className="flex-1 space-y-2">
                                            <input type="text" required value={q.question} onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm outline-none" placeholder={`Question ${i + 1}`} />
                                            <select value={q.type} onChange={(e) => updateQuestion(i, 'type', e.target.value)}
                                                className="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 text-xs">
                                                <option value="rating">⭐ Rating (1-5)</option>
                                                <option value="text">📝 Text Answer</option>
                                            </select>
                                        </div>
                                        {formData.questions.length > 1 && (
                                            <button type="button" onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-300 p-1 mt-1">
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors">
                                    Create Survey
                                </button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Respond Modal */}
            {showRespondModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">{selectedFeedback.title}</h2>
                            <p className="text-gray-400 text-sm mt-1">Your response is anonymous</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {selectedFeedback.questions.map((q, i) => (
                                <div key={i}>
                                    <p className="text-white font-medium mb-3">{i + 1}. {q.question}</p>
                                    {q.type === 'rating' ? (
                                        <StarRating value={answers[i]?.ratingValue || 0}
                                            onChange={(val) => { const newAnswers = [...answers]; newAnswers[i] = { ...newAnswers[i], ratingValue: val }; setAnswers(newAnswers); }} />
                                    ) : (
                                        <textarea rows={3} value={answers[i]?.textValue || ''}
                                            onChange={(e) => { const newAnswers = [...answers]; newAnswers[i] = { ...newAnswers[i], textValue: e.target.value }; setAnswers(newAnswers); }}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm outline-none" placeholder="Your answer..." />
                                    )}
                                </div>
                            ))}
                            <button onClick={handleRespond}
                                className="w-full px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors">
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackPage;
