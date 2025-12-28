import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { marksAPI } from '../services/marksService';
import { useAuth } from '../context/AuthContext';

const ResultsPage = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);

    // Details Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentMarks, setStudentMarks] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await marksAPI.getMarks();
            // Group by student USN to show summary in main table
            const grouped = data.reduce((acc, curr) => {
                if (!acc[curr.studentUsn]) {
                    acc[curr.studentUsn] = {
                        id: curr.studentUsn, // Use USN as unique ID for the student entry
                        studentName: curr.studentName,
                        usn: curr.studentUsn,
                        semester: curr.class.split('Sem ')[1] || 'N/A',
                        branch: curr.class.split(' - ')[0] || 'Unknown',
                        totalObtained: 0,
                        totalMax: 0,
                        subjectsCount: 0
                    };
                }
                acc[curr.studentUsn].totalObtained += curr.obtainedMarks;
                acc[curr.studentUsn].totalMax += curr.maxMarks;
                acc[curr.studentUsn].subjectsCount += 1;
                return acc;
            }, {});

            setResults(Object.values(grouped).map(r => ({
                ...r,
                sgpa: (r.totalObtained / r.totalMax * 10).toFixed(1),
                status: (r.totalObtained / r.totalMax) >= 0.4 ? 'Pass' : 'Fail'
            })));
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (student) => {
        try {
            setSelectedStudent(student);
            setLoadingDetails(true);
            const data = await marksAPI.getMarks({ studentUsn: student.usn });
            setStudentMarks(data);
        } catch (error) {
            alert('Failed to fetch detailed marks');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handlePublish = async () => {
        if (selectedBranch === 'all' || selectedSemester === 'all') {
            alert('Please select a specific Branch and Semester to publish results.');
            return;
        }

        if (!window.confirm(`Are you sure you want to publish results for ${selectedBranch} - Semester ${selectedSemester}? This will notify all selected students.`)) {
            return;
        }

        try {
            setIsPublishing(true);
            console.log('Publishing results for:', { branch: selectedBranch, semester: selectedSemester });
            const response = await marksAPI.publishResults(selectedBranch, selectedSemester);
            console.log('Publish Response:', response);
            alert(response.message || 'Results published successfully!');
        } catch (error) {
            console.error('Publish error:', error);
            alert(error.message || 'Failed to publish results. Please ensure marks are uploaded for this selection.');
        } finally {
            setIsPublishing(false);
        }
    };

    const filteredResults = results.filter(result => {
        const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.usn.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === 'all' || result.semester === selectedSemester;
        const matchesBranch = selectedBranch === 'all' || result.branch === selectedBranch;
        return matchesSearch && matchesSemester && matchesBranch;
    });

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredResults);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
        XLSX.writeFile(workbook, "Examination_Results.xlsx");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Examination Results</h1>
                    <p className="text-gray-400">View and manage student academic performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    {user?.role === 'admin' && (
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <FileText size={18} />
                            <span>{isPublishing ? 'Publishing...' : 'Publish Results'}</span>
                        </button>
                    )}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors"
                    >
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Name or USN..."
                        className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        className="p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="all">All Branches</option>
                        <option value="CSE">CSE</option>
                        <option value="ISE">ISE</option>
                    </select>
                    <select
                        className="p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="all">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#0f172a] border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">USN</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">SGPA</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-400">Loading results...</td></tr>
                            ) : filteredResults.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-400">No results found.</td></tr>
                            ) : filteredResults.map((result) => (
                                <tr key={result.id} className="hover:bg-[#0f172a] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold text-xs">
                                                {result.studentName.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{result.studentName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.usn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.branch}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.semester}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{result.sgpa}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${result.status === 'Pass' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {result.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(result)}
                                            className="text-[#d4af37] hover:text-[#c5a028] font-bold"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Marksheet Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-700 bg-[#0f172a] flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedStudent.studentName}</h2>
                                <p className="text-sm text-gray-400">USN: {selectedStudent.usn} | Semester {selectedStudent.semester}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {loadingDetails ? (
                                <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                                    <p>Loading marksheet...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold">SGPA</p>
                                            <p className="text-2xl font-black text-[#d4af37]">{selectedStudent.sgpa}</p>
                                        </div>
                                        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Result</p>
                                            <p className={`text-lg font-bold ${selectedStudent.status === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>{selectedStudent.status}</p>
                                        </div>
                                        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Obtained</p>
                                            <p className="text-lg text-white font-bold">{selectedStudent.totalObtained} / {selectedStudent.totalMax}</p>
                                        </div>
                                        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Percentage</p>
                                            <p className="text-lg text-white font-bold">{((selectedStudent.totalObtained / (selectedStudent.totalMax || 1)) * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-xl border border-gray-700">
                                        <table className="w-full text-sm">
                                            <thead className="bg-[#0f172a] text-gray-400">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Subject</th>
                                                    <th className="px-4 py-3 text-center">Marks</th>
                                                    <th className="px-4 py-3 text-center">Max</th>
                                                    <th className="px-4 py-3 text-right">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700 text-gray-300">
                                                {studentMarks.map((m, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-800/50">
                                                        <td className="px-4 py-3 font-medium text-white">{m.subject}</td>
                                                        <td className="px-4 py-3 text-center">{m.obtainedMarks}</td>
                                                        <td className="px-4 py-3 text-center">{m.maxMarks}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-[#d4af37]">
                                                            {(m.obtainedMarks / m.maxMarks * 100) >= 90 ? 'O' :
                                                                (m.obtainedMarks / m.maxMarks * 100) >= 80 ? 'A+' :
                                                                    (m.obtainedMarks / m.maxMarks * 100) >= 70 ? 'A' :
                                                                        (m.obtainedMarks / m.maxMarks * 100) >= 60 ? 'B+' :
                                                                            (m.obtainedMarks / m.maxMarks * 100) >= 50 ? 'B' :
                                                                                (m.obtainedMarks / m.maxMarks * 100) >= 40 ? 'P' : 'F'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-[#0f172a] border-t border-gray-700 flex justify-end">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
