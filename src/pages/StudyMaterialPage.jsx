import React, { useState } from 'react';
import { BookOpen, Upload, Download, FileText, Trash2, Eye, Search, Filter } from 'lucide-react';

const StudyMaterialPage = () => {
    const [selectedClass, setSelectedClass] = useState('CSE - Sem 5');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const classes = ['CSE - Sem 5', 'CSE - Sem 3', 'ISE - Sem 5', 'ECE - Sem 4'];
    const subjects = [
        'All Subjects',
        'Database Management Systems',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering',
        'Web Technologies',
    ];

    const materials = [
        { id: 1, title: 'DBMS - Module 1 Notes', subject: 'Database Management Systems', type: 'PDF', size: '2.5 MB', uploadedBy: 'Dr. Kumar', date: '2025-11-20' },
        { id: 2, title: 'OS Lab Manual', subject: 'Operating Systems', type: 'PDF', size: '1.8 MB', uploadedBy: 'Prof. Sharma', date: '2025-11-18' },
        { id: 3, title: 'CN Question Bank', subject: 'Computer Networks', type: 'PDF', size: '890 KB', uploadedBy: 'Dr. Patel', date: '2025-11-15' },
        { id: 4, title: 'SE Case Studies', subject: 'Software Engineering', type: 'DOCX', size: '1.2 MB', uploadedBy: 'Prof. Reddy', date: '2025-11-12' },
        { id: 5, title: 'Web Tech Tutorial', subject: 'Web Technologies', type: 'PDF', size: '3.1 MB', uploadedBy: 'Dr. Iyer', date: '2025-11-10' },
        { id: 6, title: 'DBMS - Module 2 PPT', subject: 'Database Management Systems', type: 'PPTX', size: '4.5 MB', uploadedBy: 'Dr. Kumar', date: '2025-11-08' },
    ];

    const filteredMaterials = materials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All Subjects' || material.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            alert(`Uploading: ${selectedFile.name}`);
            setSelectedFile(null);
            setShowUploadModal(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Study Materials</h1>
                    <p className="text-gray-400">Manage and share study materials with students</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                >
                    <Upload size={18} />
                    Upload Material
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search materials..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Materials List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Size</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Uploaded By</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredMaterials.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-[#d4af37]" size={20} />
                                            <span className="text-white font-medium">{material.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{material.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                                            {material.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{material.size}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{material.uploadedBy}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{material.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">Upload Study Material</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    placeholder="Enter material title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <select className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none">
                                    {subjects.filter(s => s !== 'All Subjects').map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">File</label>
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    accept=".pdf,.docx,.pptx,.doc,.ppt"
                                />
                                {selectedFile && (
                                    <p className="mt-2 text-sm text-gray-400">Selected: {selectedFile.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                }}
                                className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile}
                                className="px-4 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyMaterialPage;
