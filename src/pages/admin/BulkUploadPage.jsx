import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Save, Download } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const BulkUploadPage = () => {
    const { user, token } = useAuth(); // Assuming token is available in context or we fetch it
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
            setResults(null);
            setError(null);
        }
    };

    const parseFile = (file) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setPreviewData(jsonData);
            } catch (err) {
                setError('Failed to parse file. Please ensure it is a valid Excel file.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        if (previewData.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            // Transform data if necessary to match backend expectations
            // The backend expects: { name, email, role, ...roleData }
            // We assume the Excel columns match these keys.

            // We need to make sure we send the token. 
            // Since we don't have direct access to axios instance here easily without importing api service,
            // we will use fetch or the existing api service if possible. 
            // Let's assume we use fetch for now to be self-contained or import api.

            // Better to use the existing API pattern if possible, but for now I'll use fetch with the token from context/localStorage
            const storedToken = localStorage.getItem('token'); // Fallback

            const response = await fetch('http://localhost:5000/api/auth/bulk-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(previewData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            setResults(data);
            setPreviewData([]);
            setFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                name: 'Student Name',
                email: 'student@example.com',
                role: 'student',
                password: 'password123',
                usn: '1SI23CS001',
                class: 'CSE - Sem 1',
                semester: 1,
                department: 'CSE'
            },
            {
                name: 'Faculty Name',
                email: 'faculty@example.com',
                role: 'faculty',
                password: 'password123',
                employeeId: 'FAC001',
                designation: 'Professor',
                department: 'CSE'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "User_Upload_Template.xlsx");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[hsl(var(--primary))] font-serif">Bulk User Upload</h1>
                    <p className="text-gray-500">Upload multiple users via Excel/CSV file.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/admin')}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <label className="flex-1 md:flex-none cursor-pointer">
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-300">
                            <FileSpreadsheet size={20} />
                            <span>{file ? file.name : 'Select Excel File'}</span>
                        </div>
                    </label>
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 px-4 py-2 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/0.1] rounded-lg transition-colors font-medium"
                    >
                        <Download size={18} />
                        Template
                    </button>
                </div>

                {previewData.length > 0 && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))/0.9] transition-colors disabled:opacity-50"
                    >
                        {uploading ? (
                            <>Uploading...</>
                        ) : (
                            <>
                                <Save size={20} />
                                Upload {previewData.length} Users
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                </div>
            )}

            {/* Success Results */}
            {results && (
                <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={28} className="text-green-600" />
                        <div>
                            <h3 className="text-lg font-bold">Upload Complete</h3>
                            <p>{results.message}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                            <p className="text-sm text-gray-500">Successful</p>
                            <p className="text-2xl font-bold text-green-600">{results.results.success}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                            <p className="text-sm text-gray-500">Failed</p>
                            <p className="text-2xl font-bold text-red-600">{results.results.failed}</p>
                        </div>
                    </div>

                    {results.results.errors.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold mb-2">Errors:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-700 max-h-40 overflow-y-auto">
                                {results.results.errors.map((err, idx) => (
                                    <li key={idx}>
                                        <span className="font-medium">{err.email}:</span> {err.error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Data Preview */}
            {previewData.length > 0 && !results && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">Data Preview</h3>
                        <span className="text-sm text-gray-500">{previewData.length} records found</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    {Object.keys(previewData[0]).slice(0, 8).map((key) => (
                                        <th key={key} className="px-6 py-3 capitalize">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {previewData.slice(0, 10).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        {Object.values(row).slice(0, 8).map((val, i) => (
                                            <td key={i} className="px-6 py-3 text-gray-600 max-w-xs truncate">
                                                {val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.length > 10 && (
                            <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 border-t border-gray-100">
                                ...and {previewData.length - 10} more rows
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!file && !results && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Upload className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No file selected</h3>
                    <p className="text-gray-500 mt-1">Upload an Excel or CSV file to get started</p>
                </div>
            )}
        </div>
    );
};

export default BulkUploadPage;
