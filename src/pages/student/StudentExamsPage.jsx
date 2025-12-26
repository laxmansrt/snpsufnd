import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { examAPI } from '../../services/examService';
import { Link } from 'react-router-dom';

const StudentExamsPage = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await examAPI.getExams();
                setExams(data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading exams...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Online Examinations</h1>
                <p className="text-gray-400">View and attempt your scheduled MCQ tests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.length === 0 ? (
                    <div className="col-span-full p-12 bg-[#1e293b] rounded-xl border border-gray-700 text-center">
                        <ClipboardList size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-lg font-bold text-white">No Exams Found</h3>
                        <p className="text-gray-400">There are no examinations scheduled for your branch at the moment.</p>
                    </div>
                ) : (
                    exams.map((exam) => (
                        <div key={exam._id} className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden hover:border-[#d4af37] transition-all group">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase">Active</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors">{exam.title}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-1">{exam.description || 'No description provided.'}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{exam.duration} Mins</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{new Date(exam.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/dashboard/exam/${exam._id}`}
                                    className="flex items-center justify-between w-full p-3 bg-[#0f172a] rounded-lg text-[#d4af37] font-bold hover:bg-[#d4af37] hover:text-[#0f172a] transition-all group/btn"
                                >
                                    <span>Start Examination</span>
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Internal Calendar mock if missing
const Calendar = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export default StudentExamsPage;
