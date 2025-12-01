import React, { useState } from 'react';
import { Upload, FileText, Calendar, Search, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FacultyDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // File upload handler
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only PDF, DOCX, and image files are allowed');
                return;
            }
            setSelectedFile(file);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect({ target: { files: [file] } });
        }
    };

    // Upload file function
    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        setUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('document', selectedFile);

            // TODO: Replace with actual API endpoint
            // const response = await fetch('/api/documents/upload', {
            //     method: 'POST',
            //     body: formData,
            // });

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert('File uploaded successfully!');
            setSelectedFile(null);
            setActiveTab('documents');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    // Mock Data
    const classPerformance = [
        { subject: 'CSE A', avg: 85 },
        { subject: 'CSE B', avg: 78 },
        { subject: 'CSE C', avg: 82 },
        { subject: 'ISE A', avg: 75 },
    ];

    const students = [
        { id: 1, name: 'Rahul Kumar', usn: '1SI21CS045', feesPaid: 65000, feesTotal: 110000, status: 'Partial' },
        { id: 2, name: 'Priya Sharma', usn: '1SI21CS048', feesPaid: 110000, feesTotal: 110000, status: 'Paid' },
        { id: 3, name: 'Amit Singh', usn: '1SI21CS052', feesPaid: 0, feesTotal: 110000, status: 'Unpaid' },
        { id: 4, name: 'Sneha Gupta', usn: '1SI21CS055', feesPaid: 80000, feesTotal: 110000, status: 'Partial' },
    ];

    const documents = [
        { id: 1, name: 'DBMS Question Bank - Module 1', type: 'PDF', date: '2025-11-20' },
        { id: 2, name: 'OS Lab Manual', type: 'DOCX', date: '2025-11-18' },
        { id: 3, name: 'Class Time Table - Sem 5', type: 'IMG', date: '2025-11-15' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Faculty Portal</h1>
                    <p className="text-gray-500">Manage your classes, documents, and student details.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))/0.9] transition-colors"
                    >
                        <Upload size={18} />
                        <span>Upload Document</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-[hsl(var(--primary))]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Overview
                    {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--primary))]"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'students' ? 'text-[hsl(var(--primary))]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Student Fees & Details
                    {activeTab === 'students' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--primary))]"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'documents' ? 'text-[hsl(var(--primary))]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Documents
                    {activeTab === 'documents' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--primary))]"></span>}
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-6">Class Performance Average</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="subject" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} cursor={{ fill: '#374151' }} />
                                    <Bar dataKey="avg" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm">Today's Classes</p>
                                    <h3 className="text-3xl font-bold mt-1">4</h3>
                                </div>
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Calendar size={24} />
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">09:00 AM</span>
                                    <span>CSE A - DBMS</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">11:00 AM</span>
                                    <span>ISE B - OS</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm">Pending Evaluations</p>
                                    <h3 className="text-3xl font-bold mt-1">25</h3>
                                </div>
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                    <FileText size={24} />
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 bg-yellow-500/20 text-yellow-400 text-sm font-bold rounded hover:bg-yellow-500/30 transition-colors">
                                Start Grading
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Student Fee Details</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Name or USN..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">USN</th>
                                    <th className="px-6 py-4">Fees Paid</th>
                                    <th className="px-6 py-4">Total Fees</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{student.usn}</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">₹{student.feesPaid.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600">₹{student.feesTotal.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                student.status === 'Unpaid' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-[hsl(var(--primary))] hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(activeTab === 'documents' || activeTab === 'upload') && (
                <div className="space-y-6">
                    {activeTab === 'upload' && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Upload New Document</h3>

                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileSelect}
                                accept=".pdf,.docx,.jpg,.jpeg,.png"
                            />

                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[hsl(var(--primary))] transition-colors cursor-pointer bg-gray-50"
                                onClick={() => document.getElementById('fileInput').click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="w-16 h-16 bg-blue-100 text-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload size={32} />
                                </div>
                                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-400 mt-2">PDF, DOCX, IMG (Max 10MB)</p>

                                {selectedFile && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm font-medium text-blue-900">Selected: {selectedFile.name}</p>
                                        <p className="text-xs text-blue-600 mt-1">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setActiveTab('documents');
                                        setSelectedFile(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || uploading}
                                    className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))/0.9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Files'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">My Documents</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium">{doc.name}</p>
                                            <p className="text-sm text-gray-500">{doc.type} • {doc.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600">View</button>
                                        <button className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
