import React, { useState } from 'react';
import { Search, Filter, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const ResultsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');

    // Mock Data
    const results = [
        { id: 1, studentName: 'Rahul Sharma', usn: '1SP21CS001', semester: '5', sgpa: '8.5', cgpa: '8.2', status: 'Pass' },
        { id: 2, studentName: 'Priya Patel', usn: '1SP21CS002', semester: '5', sgpa: '9.1', cgpa: '8.9', status: 'Pass' },
        { id: 3, studentName: 'Amit Kumar', usn: '1SP21CS003', semester: '5', sgpa: '4.5', cgpa: '6.0', status: 'Fail' },
        { id: 4, studentName: 'Sneha Gupta', usn: '1SP21CS004', semester: '3', sgpa: '7.8', cgpa: '7.5', status: 'Pass' },
        { id: 5, studentName: 'Vikram Singh', usn: '1SP21CS005', semester: '3', sgpa: '8.0', cgpa: '7.9', status: 'Pass' },
    ];

    const filteredResults = results.filter(result => {
        const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.usn.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === 'all' || result.semester === selectedSemester;
        return matchesSearch && matchesSemester;
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
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors"
                >
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
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
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="all">All Semesters</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">SGPA</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">CGPA</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredResults.map((result) => (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.semester}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{result.sgpa}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{result.cgpa}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${result.status === 'Pass'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {result.status === 'Pass' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
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
                {filteredResults.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No results found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
