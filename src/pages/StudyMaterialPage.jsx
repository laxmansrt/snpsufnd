import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studyMaterialAPI } from '../services/studyMaterialService';
import { BookOpen, Upload, Download, FileText, Trash2, Eye, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

const StudyMaterialPage = () => {
    const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('CSE - Sem 5');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadData, setUploadData] = useState({
        title: '',
        subject: 'Database Management Systems',
        class: 'CSE - Sem 5'
    });

    const classes = ['CSE - Sem 5', 'CSE - Sem 3', 'ISE - Sem 5', 'ECE - Sem 4'];
    const subjects = [
        'All Subjects',
        'Database Management Systems',
        'Operating Systems',
        'Computer Networks',
        'Software Engineering',
        'Web Technologies',
    ];

    useEffect(() => {
        loadMaterials();
    }, [selectedClass, selectedSubject]);

    const loadMaterials = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (selectedClass !== 'All Classes') filters.class = selectedClass;
            if (selectedSubject !== 'All Subjects') filters.subject = selectedSubject;

            const data = await studyMaterialAPI.getMaterials(filters);
            setMaterials(data);
        } catch (error) {
            console.error('Error loading materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('File size must be less than 2MB');
                e.target.value = null;
                return;
            }
            setSelectedFile(file);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadData.title) {
            alert('Please fill all fields and select a file');
            return;
        }

        try {
            const base64File = await convertToBase64(selectedFile);

            await studyMaterialAPI.uploadMaterial({
                ...uploadData,
                type: selectedFile.name.split('.').pop().toUpperCase(),
                size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
                fileUrl: base64File
            });

            setShowUploadModal(false);
            setSelectedFile(null);
            setUploadData({ title: '', subject: 'Database Management Systems', class: 'CSE - Sem 5' });
            loadMaterials();
            alert('Material uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload material');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await studyMaterialAPI.deleteMaterial(id);
                loadMaterials();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete material');
            }
        }
    };

    const handleDownload = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredMaterials = materials.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canManage = user?.role === 'faculty' || user?.role === 'admin';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Study Materials</h1>
                    <p className="text-gray-400">Access course materials and resources</p>
                </div>
                {canManage && (
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                    >
                        <Upload size={18} />
                        Upload Material
                    </button>
                )}
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
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Loading materials...</td>
                                </tr>
                            ) : filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No materials found</td>
                                </tr>
                            ) : (
                                filteredMaterials.map((material) => (
                                    <tr key={material._id} className="hover:bg-gray-700/50 transition-colors">
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
                                        <td className="px-6 py-4 text-sm text-gray-300">{material.uploadedBy?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {new Date(material.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleDownload(material.fileUrl, material.title)}
                                                    className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download size={16} />
                                                </button>
                                                {canManage && (
                                                    <button
                                                        onClick={() => handleDelete(material._id)}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                                    value={uploadData.title}
                                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    placeholder="Enter material title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                                <select
                                    value={uploadData.class}
                                    onChange={(e) => setUploadData({ ...uploadData, class: e.target.value })}
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
                                    value={uploadData.subject}
                                    onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                >
                                    {subjects.filter(s => s !== 'All Subjects').map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">File (Max 2MB)</label>
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    accept=".pdf,.docx,.pptx,.doc,.ppt,.txt,.jpg,.png"
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
                                disabled={!selectedFile || !uploadData.title}
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
