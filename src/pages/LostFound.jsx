import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getItems, addItem, claimItem, deleteItem } from '../services/lostFoundService';
import { Search, MapPin, Phone, Tag, CheckCircle, AlertCircle, Trash2, Upload } from 'lucide-react';
import clsx from 'clsx';

const LostFound = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('board'); // board, report-lost, report-found
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all'); // all, lost, found
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        contact: user?.email || '',
        type: 'lost'
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        const data = await getItems();
        setItems(data);
        setLoading(false);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setSelectedImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newItem = {
            ...formData,
            type: activeTab === 'report-lost' ? 'lost' : 'found',
            user: { name: user.name, role: user.role },
            image: imagePreview // Include the image preview as base64
        };
        await addItem(newItem);
        setFormData({ title: '', description: '', location: '', contact: user?.email || '', type: 'lost' });
        setSelectedImage(null);
        setImagePreview(null);
        setActiveTab('board');
        loadItems();
    };

    const handleClaim = async (id) => {
        if (window.confirm('Are you sure you want to claim this item? The finder will be notified.')) {
            await claimItem(id, user.name);
            loadItems();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this post?')) {
            await deleteItem(id);
            loadItems();
        }
    };

    const filteredItems = items.filter(item => {
        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-[hsl(var(--primary))]">Lost & Found Board</h1>
                    <p className="text-gray-500">Report lost items or help others find theirs.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('board')}
                        className={clsx("px-4 py-2 rounded-lg font-medium transition-colors", activeTab === 'board' ? "bg-[hsl(var(--primary))] text-white" : "bg-white text-gray-600 hover:bg-gray-50")}
                    >
                        View Board
                    </button>
                    <button
                        onClick={() => setActiveTab('report-lost')}
                        className={clsx("px-4 py-2 rounded-lg font-medium transition-colors", activeTab === 'report-lost' ? "bg-red-100 text-red-700 border border-red-200" : "bg-white text-gray-600 hover:bg-gray-50")}
                    >
                        Report Lost
                    </button>
                    <button
                        onClick={() => setActiveTab('report-found')}
                        className={clsx("px-4 py-2 rounded-lg font-medium transition-colors", activeTab === 'report-found' ? "bg-green-100 text-green-700 border border-green-200" : "bg-white text-gray-600 hover:bg-gray-50")}
                    >
                        Report Found
                    </button>
                </div>
            </div>

            {activeTab === 'board' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] outline-none"
                            />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setFilter('all')}
                                className={clsx("flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium border", filter === 'all' ? "bg-gray-100 border-gray-300 text-gray-900" : "border-transparent text-gray-500 hover:bg-gray-50")}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('lost')}
                                className={clsx("flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium border", filter === 'lost' ? "bg-red-50 border-red-200 text-red-700" : "border-transparent text-gray-500 hover:bg-gray-50")}
                            >
                                Lost Items
                            </button>
                            <button
                                onClick={() => setFilter('found')}
                                className={clsx("flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium border", filter === 'found' ? "bg-green-50 border-green-200 text-green-700" : "border-transparent text-gray-500 hover:bg-gray-50")}
                            >
                                Found Items
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-48 bg-gray-100">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Tag size={48} />
                                        </div>
                                    )}
                                    <div className={clsx("absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm",
                                        item.type === 'lost' ? "bg-red-500 text-white" : "bg-green-500 text-white"
                                    )}>
                                        {item.type}
                                    </div>
                                    {item.status === 'claimed' && (
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold border border-green-200 flex items-center gap-2">
                                                <CheckCircle size={18} /> Claimed
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-[hsl(var(--primary))]" />
                                            {item.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-[hsl(var(--primary))]" />
                                            {item.contact}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {item.user.name.charAt(0)}
                                            </div>
                                            <span className="text-xs text-gray-500">{item.user.name}</span>
                                        </div>

                                        {item.status !== 'claimed' && (
                                            <div className="flex gap-2">
                                                {user.role === 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Post"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleClaim(item.id)}
                                                    className="px-3 py-1.5 bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] text-xs font-bold rounded-lg hover:brightness-110 transition-all"
                                                >
                                                    Claim Item
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(activeTab === 'report-lost' || activeTab === 'report-found') && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-center mb-8">
                        <div className={clsx("w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4",
                            activeTab === 'report-lost' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        )}>
                            {activeTab === 'report-lost' ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'report-lost' ? 'Report a Lost Item' : 'Report a Found Item'}
                        </h2>
                        <p className="text-gray-500">
                            {activeTab === 'report-lost'
                                ? 'Provide details to help us find your item.'
                                : 'Thank you for being honest! Help us return this item.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] outline-none"
                                placeholder="e.g., Blue Dell Laptop Bag"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] outline-none"
                                placeholder="Describe the item (color, brand, unique marks)..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {activeTab === 'report-lost' ? 'Last Seen Location' : 'Found Location'}
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] outline-none"
                                        placeholder="e.g., Library 2nd Floor"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] outline-none"
                                        placeholder="Phone or Email"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (Optional)</label>
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />

                                {!imagePreview ? (
                                    <label
                                        htmlFor="imageUpload"
                                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[hsl(var(--primary))] hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </label>
                                ) : (
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-300">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className={clsx("w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1",
                                    activeTab === 'report-lost'
                                        ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                                        : "bg-green-600 hover:bg-green-700 shadow-green-500/20"
                                )}
                            >
                                Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LostFound;
