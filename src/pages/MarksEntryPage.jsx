import React, { useState } from 'react';
import { FileText, Upload, Save, Download, Search, Filter } from 'lucide-react';

const MarksEntryPage = () => {
    const [selectedClass, setSelectedClass] = useState('CSE - Sem 5');
    const [selectedSubject, setSelectedSubject] = useState('Database Management Systems');
    const [selectedExam, setSelectedExam] = useState('Mid-Term 1');
    const [marks, setMarks] = useState({});
    const [saving, setSaving] = useState(false);

    const classes = ['CSE - Sem 5', 'CSE - Sem 3', 'ISE - Sem 5', 'ECE - Sem 4'];
    const subjects = [
        'Database Management Systems',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering',
        'Web Technologies',
    ];
    const exams = ['Mid-Term 1', 'Mid-Term 2', 'Assignment 1', 'Assignment 2', 'Final Exam'];

    const students = [
        { id: 1, name: 'Rahul Kumar', usn: '1SI21CS045' },
        { id: 2, name: 'Priya Sharma', usn: '1SI21CS048' },
        { id: 3, name: 'Amit Singh', usn: '1SI21CS052' },
        { id: 4, name: 'Sneha Gupta', usn: '1SI21CS055' },
        { id: 5, name: 'Vikram Reddy', usn: '1SI21CS058' },
        { id: 6, name: 'Anjali Desai', usn: '1SI21CS061' },
        { id: 7, name: 'Arjun Patel', usn: '1SI21CS064' },
        { id: 8, name: 'Meera Iyer', usn: '1SI21CS067' },
    ];

    const handleMarkChange = (usn, value) => {
        setMarks(prev => ({
            ...prev,
            [usn]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Marks saved successfully!');
        setSaving(false);
    };

    const handleExport = () => {
        alert('Exporting marks to Excel...');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Marks Entry</h1>
                    <p className="text-gray-400">Enter and manage student marks and grades</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                    <Download size={18} />
                    Export Marks
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        >
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        >
                            {subjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Exam Type</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                        >
                            {exams.map(exam => (
                                <option key={exam} value={exam}>{exam}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Marks Entry Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">USN</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student Name</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Marks (Out of 100)</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {students.map((student) => {
                                const mark = marks[student.usn] || '';
                                const grade = mark >= 90 ? 'A+' : mark >= 80 ? 'A' : mark >= 70 ? 'B+' : mark >= 60 ? 'B' : mark >= 50 ? 'C' : mark >= 40 ? 'D' : 'F';

                                return (
                                    <tr key={student.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                                            {student.usn}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white font-medium">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={mark}
                                                onChange={(e) => handleMarkChange(student.usn, e.target.value)}
                                                className="w-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:ring-2 focus:ring-[#d4af37] outline-none"
                                                placeholder="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${grade === 'A+' || grade === 'A' ? 'bg-green-500/20 text-green-400' :
                                                    grade === 'B+' || grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                                                        grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            grade === 'D' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-red-500/20 text-red-400'
                                                }`}>
                                                {mark ? grade : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Marks'}
                </button>
            </div>
        </div>
    );
};

export default MarksEntryPage;
