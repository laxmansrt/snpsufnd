import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { examAPI } from '../../services/examService';
import clsx from 'clsx';

const TakeExamPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const data = await examAPI.getExamById(id);
                setExam(data);
                setTimeLeft(data.duration * 60);
                // Pre-fill answers
                setAnswers(data.questions.map((_, idx) => ({ questionIndex: idx, selectedOption: -1 })));
            } catch (error) {
                alert(error.message);
                navigate('/dashboard/student');
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id, navigate]);

    useEffect(() => {
        if (timeLeft > 0 && !score && exam) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && exam && !score) {
            handleSubmit();
        }
    }, [timeLeft, score, exam]);

    const handleAnswerChange = (qIndex, oIndex) => {
        const newAnswers = [...answers];
        newAnswers[qIndex].selectedOption = oIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const unattempted = answers.filter(a => a.selectedOption === -1).length;
        if (unattempted > 0 && timeLeft > 0) {
            if (!window.confirm(`You have ${unattempted} unattempted questions. Are you sure you want to submit?`)) {
                return;
            }
        }

        try {
            setSubmitting(true);
            const result = await examAPI.submitExam(id, answers);
            setScore(result);
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-medium">Loading examination details...</p>
        </div>
    );

    if (score) {
        return (
            <div className="max-w-md mx-auto bg-[#1e293b] p-8 rounded-2xl border border-gray-700 text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={48} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Exam Submitted!</h2>
                    <p className="text-gray-400 mt-1">Thank you for appearing for the examination.</p>
                </div>
                <div className="py-6 px-4 bg-[#0f172a] rounded-xl border border-gray-700">
                    <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Your Score</p>
                    <p className="text-4xl font-black text-[#d4af37] mt-2">{score.score} / {score.maxScore}</p>
                    <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-green-500 h-full transition-all duration-1000"
                            style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard/student')}
                    className="w-full py-3 bg-[#d4af37] text-[#0f172a] rounded-xl font-bold hover:bg-[#c5a028] transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-20 relative">
            {/* Header Sticky Bar */}
            <div className="sticky top-[70px] z-30 bg-[#1e293b]/90 backdrop-blur-md p-4 rounded-xl border border-gray-700 mb-6 flex items-center justify-between shadow-xl">
                <div>
                    <h1 className="text-xl font-bold text-white">{exam.title}</h1>
                    <p className="text-xs text-gray-400">{exam.branch} - Semester {exam.semester}</p>
                </div>
                <div className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg border",
                    timeLeft < 300 ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" : "bg-[#0f172a] text-[#d4af37] border-gray-700"
                )}>
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="space-y-6">
                {exam.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg">
                        <div className="flex gap-4">
                            <span className="w-8 h-8 rounded-lg bg-[#0f172a] text-gray-400 flex items-center justify-center font-bold flex-shrink-0">
                                {qIdx + 1}
                            </span>
                            <div className="space-y-4 flex-1">
                                <h3 className="text-white font-medium text-lg leading-relaxed">{q.question}</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {q.options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleAnswerChange(qIdx, oIdx)}
                                            className={clsx(
                                                "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3",
                                                answers[qIdx]?.selectedOption === oIdx
                                                    ? "bg-blue-600/10 border-blue-500 text-blue-400 ring-1 ring-blue-500"
                                                    : "bg-[#0f172a] border-gray-700 text-gray-400 hover:border-gray-500"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                                answers[qIdx]?.selectedOption === oIdx ? "border-blue-500" : "border-gray-600"
                                            )}>
                                                {answers[qIdx]?.selectedOption === oIdx && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-scale-in"></div>}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 pointer-events-none">
                <div className="bg-[#0f172a] border border-gray-700 p-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto">
                    <p className="text-gray-400 text-sm">
                        Attempted: <span className="text-white font-bold">{answers.filter(a => a.selectedOption !== -1).length}</span> / {exam.questions.length}
                    </p>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Finish Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeExamPage;
