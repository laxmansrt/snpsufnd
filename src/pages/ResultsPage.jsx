import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
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

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await marksAPI.getMarks();
            setResults(data.map(r => ({
                id: r._id,
                studentName: r.studentName,
                usn: r.studentUsn,
                semester: r.class.split('Sem ')[1] || 'N/A',
                branch: r.class.split(' - ')[0] || 'Unknown',
                sgpa: (r.obtainedMarks / r.maxMarks * 10).toFixed(1),
                cgpa: (r.obtainedMarks / r.maxMarks * 10).toFixed(1),
                status: r.obtainedMarks >= (r.maxMarks * 0.4) ? 'Pass' : 'Fail'
            })));
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
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
            const response = await marksAPI.publishResults(selectedBranch, selectedSemester);
            alert(response.message);
        } catch (error) {
            console.error('Publish error:', error);
            alert(error.message || 'Failed to publish results');
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
                                        <button className="text-[#d4af37] hover:text-[#c5a028]">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
