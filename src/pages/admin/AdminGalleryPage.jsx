import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, Video, Image as ImageIcon, Trash2, Plus, X, Link as LinkIcon, Save, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import { API_URL } from '../../services/config';

const AdminGalleryPage = () => {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'image',
        url: '',
        category: 'Function'
    });

    const categories = ['Function', 'Campus', 'Sports', 'Academic', 'Event'];

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await axios.get(`${API_URL}/gallery`);
            setItems(response.data);
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Failed to load gallery items');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.post(
                `${API_URL}/gallery`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Gallery item added successfully!');
            setFormData({ title: '', description: '', type: 'image', url: '', category: 'Function' });
            setShowForm(false);
            fetchGallery();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add gallery item');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await axios.delete(
                `${API_URL}/gallery/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setItems(items.filter(item => item._id !== id));
            setSuccess('Item deleted');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 font-serif">Gallery Management</h1>
                    <p className="text-gray-500">Manage photos and videos for the virtual tour</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-6 py-2 rounded-xl hover:opacity-90 transition-all shadow-lg"
                    >
                        <Plus size={20} />
                        Add New Media
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800">Add New Gallery Item</h2>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Annual Day 2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none h-24 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the event..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'image', url: '' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.type === 'image' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.05] text-[hsl(var(--primary))]' : 'text-gray-400'}`}
                                    >
                                        <ImageIcon size={24} />
                                        <span className="text-sm font-medium">Image</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'video', url: '' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.type === 'video' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.05] text-[hsl(var(--primary))]' : 'text-gray-400'}`}
                                    >
                                        <Video size={24} />
                                        <span className="text-sm font-medium">Video</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                            {formData.type === 'image' ? (
                                <div className="space-y-4">
                                    <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        {formData.url ? (
                                            <img src={formData.url} className="h-40 rounded-xl shadow-md" alt="Preview" />
                                        ) : (
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Upload className="text-gray-400" />
                                            </div>
                                        )}
                                        <span className="text-gray-500 font-medium">Click to upload photo</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Video Link (YouTube/Drive)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="url"
                                            required
                                            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">Supported: YouTube, Vimeo, and direct MP4 links</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 text-gray-500 font-semibold hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !formData.url}
                                className="flex items-center gap-2 bg-[hsl(var(--primary))] text-white px-8 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-bold shadow-lg"
                            >
                                {submitting ? <LoadingSpinner size="sm" color="white" /> : <Save size={20} />}
                                Save Item
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="py-20 flex justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">No media found</h3>
                            <p className="text-gray-500">Add photos and videos to show in the Virtual Tour</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                                <div className="aspect-video relative overflow-hidden bg-gray-100">
                                    {item.type === 'image' ? (
                                        <img src={item.url} className="w-full h-full object-cover" alt={item.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                            <Video className="text-white opacity-50" size={48} />
                                            <div className="absolute inset-0 bg-black/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        {item.type === 'image' ? <ImageIcon size={14} className="text-blue-500" /> : <Video size={14} className="text-red-500" />}
                                        <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminGalleryPage;
