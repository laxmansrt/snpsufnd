import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, Clock, BookOpen } from 'lucide-react';
import { examAPI } from '../../services/examService';
import { useNavigate } from 'react-router-dom';

const CreateExamPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState({
        title: '',
        description: '',
        semester: '1',
        branch: 'CSE',
        duration: 60,
        date: '',
        questions: [
            { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }
        ]
    });

    const handleAddQuestion = () => {
        setExam({
            ...exam,
            questions: [...exam.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }]
        });
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = exam.questions.filter((_, i) => i !== index);
        setExam({ ...exam, questions: newQuestions });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...exam.questions];
        newQuestions[index][field] = value;
        setExam({ ...exam, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...exam.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setExam({ ...exam, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const createdExam = await examAPI.createExam(exam);
            if (window.confirm('Exam created! Send invitations to students now?')) {
                await examAPI.sendInvites(createdExam._id);
            }
            navigate('/dashboard/admin');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Online Exam</h1>
                    <p className="text-gray-400">Design your MCQ examination and notify students.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Exam Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                            value={exam.title}
                            onChange={(e) => setExam({ ...exam, title: e.target.value })}
                            placeholder="e.g. Data Structures Mid-Term"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                        <select
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                            value={exam.branch}
                            onChange={(e) => setExam({ ...exam, branch: e.target.value })}
                        >
                            <option value="CSE">CSE</option>
                            <option value="ISE">ISE</option>
                            <option value="ECE">ECE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                        <select
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                            value={exam.semester}
                            onChange={(e) => setExam({ ...exam, semester: e.target.value })}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration (mins)</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                            value={exam.duration}
                            onChange={(e) => setExam({ ...exam, duration: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Exam Date</label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-[#d4af37]"
                            value={exam.date}
                            onChange={(e) => setExam({ ...exam, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Questions</h2>
                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg font-bold hover:bg-[#c5a028] transition-all"
                        >
                            <Plus size={18} />
                            Add Question
                        </button>
                    </div>

                    {exam.questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 space-y-4 relative group">
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestion(qIdx)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Question {qIdx + 1}</label>
                                <textarea
                                    required
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                                    placeholder="Enter your question here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex gap-3 items-center">
                                        <input
                                            type="radio"
                                            name={`correct-${qIdx}`}
                                            checked={q.correctAnswer === oIdx}
                                            onChange={() => handleQuestionChange(qIdx, 'correctAnswer', oIdx)}
                                            className="text-[#d4af37] focus:ring-[#d4af37]"
                                        />
                                        <input
                                            type="text"
                                            required
                                            className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm text-white outline-none"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                            placeholder={`Option ${oIdx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/admin')}
                        className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save size={18} />
                                Create Exam & Notify
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExamPage;
