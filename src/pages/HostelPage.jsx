import React, { useState } from 'react';
import { Home, Users, Bed, Utensils, Phone, Mail, AlertCircle } from 'lucide-react';

const HostelPage = () => {
    const [activeTab, setActiveTab] = useState('rooms');
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [formData, setFormData] = useState({
        studentUsn: '',
        studentName: '',
        email: '',
        phone: '',
        semester: '',
        department: '',
        roomPreference: 'double',
        blockPreference: 'Block A',
        guardianName: '',
        guardianPhone: '',
        guardianRelation: '',
        permanentAddress: {
            street: '',
            city: '',
            state: '',
            pincode: '',
        },
        anyMedicalConditions: false,
        medicalDetails: '',
    });

    const rooms = [
        {
            _id: '1',
            blockName: 'Block A',
            roomNumber: 'A-101',
            floor: 1,
            roomType: 'double',
            capacity: 2,
            occupants: [
                { studentName: 'Rahul Kumar', studentUsn: '1SI21CS045', feeStatus: 'paid' },
                { studentName: 'Amit Sharma', studentUsn: '1SI21CS046', feeStatus: 'paid' },
            ],
            status: 'full',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'attached-bathroom'],
        },
        {
            _id: '2',
            blockName: 'Block A',
            roomNumber: 'A-102',
            floor: 1,
            roomType: 'triple',
            capacity: 3,
            occupants: [
                { studentName: 'Priya Singh', studentUsn: '1SI21EC021', feeStatus: 'paid' },
            ],
            status: 'occupied',
            facilities: ['bed', 'table', 'chair', 'wardrobe'],
        },
        {
            _id: '3',
            blockName: 'Block A',
            roomNumber: 'A-103',
            floor: 1,
            roomType: 'quad',
            capacity: 4,
            occupants: [
                { studentName: 'Suresh Reddy', studentUsn: '1SI21IS012', feeStatus: 'paid' },
                { studentName: 'Deepak Patel', studentUsn: '1SI21IS013', feeStatus: 'pending' },
            ],
            status: 'occupied',
            facilities: ['bed', 'table', 'chair', 'wardrobe'],
        },
        {
            _id: '4',
            blockName: 'Block A',
            roomNumber: 'A-201',
            floor: 2,
            roomType: 'double',
            capacity: 2,
            occupants: [],
            status: 'available',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'balcony'],
        },
        {
            _id: '5',
            blockName: 'Block A',
            roomNumber: 'A-202',
            floor: 2,
            roomType: 'triple',
            capacity: 3,
            occupants: [],
            status: 'available',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'attached-bathroom'],
        },
        {
            _id: '6',
            blockName: 'Block B',
            roomNumber: 'B-101',
            floor: 1,
            roomType: 'single',
            capacity: 1,
            occupants: [
                { studentName: 'Arun Kumar', studentUsn: '1SI21ME034', feeStatus: 'paid' },
            ],
            status: 'full',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'attached-bathroom', 'ac'],
        },
        {
            _id: '7',
            blockName: 'Block B',
            roomNumber: 'B-102',
            floor: 1,
            roomType: 'double',
            capacity: 2,
            occupants: [
                { studentName: 'Vikram Singh', studentUsn: '1SI21CV019', feeStatus: 'paid' },
            ],
            status: 'occupied',
            facilities: ['bed', 'table', 'chair', 'wardrobe'],
        },
        {
            _id: '8',
            blockName: 'Block B',
            roomNumber: 'B-201',
            floor: 2,
            roomType: 'quad',
            capacity: 4,
            occupants: [],
            status: 'available',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'balcony'],
        },
        {
            _id: '9',
            blockName: 'Block B',
            roomNumber: 'B-202',
            floor: 2,
            roomType: 'triple',
            capacity: 3,
            occupants: [],
            status: 'available',
            facilities: ['bed', 'table', 'chair', 'wardrobe'],
        },
        {
            _id: '10',
            blockName: 'Block C',
            roomNumber: 'C-101',
            floor: 1,
            roomType: 'double',
            capacity: 2,
            occupants: [],
            status: 'available',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'attached-bathroom'],
        },
        {
            _id: '11',
            blockName: 'Block C',
            roomNumber: 'C-102',
            floor: 1,
            roomType: 'quad',
            capacity: 4,
            occupants: [
                { studentName: 'Neha Gupta', studentUsn: '1SI21EC045', feeStatus: 'paid' },
                { studentName: 'Pooja Mehta', studentUsn: '1SI21EC046', feeStatus: 'paid' },
            ],
            status: 'occupied',
            facilities: ['bed', 'table', 'chair', 'wardrobe'],
        },
        {
            _id: '12',
            blockName: 'Block C',
            roomNumber: 'C-201',
            floor: 2,
            roomType: 'triple',
            capacity: 3,
            occupants: [],
            status: 'available',
            facilities: ['bed', 'table', 'chair', 'wardrobe', 'balcony', 'attached-bathroom'],
        },
    ];

    const messMenu = [
        { day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Vegetable, Chapati', dinner: 'Rice, Sambar, Rasam, Curd' },
        { day: 'Tuesday', breakfast: 'Pongal, Vada, Chutney', lunch: 'Rice, Sambar, Dry Vegetable, Chapati', dinner: 'Rice, Dal, Vegetable, Curd' },
        { day: 'Wednesday', breakfast: 'Upma, Banana', lunch: 'Rice, Rasam, Vegetable, Chapati', dinner: 'Rice, Sambar, Palya, Curd' },
        { day: 'Thursday', breakfast: 'Dosa, Chutney, Sambhar', lunch: 'Rice, Dal, Vegetable, Chapati', dinner: 'Rice, Sambar, Fry, Curd' },
        { day: 'Friday', breakfast: 'Poha, Chutney', lunch: 'Rice, Special Curry, Chapati', dinner: 'Rice, Dal, Vegetable, Curd' },
        { day: 'Saturday', breakfast: 'Paratha, Curd', lunch: 'Biriyani, Raita, Salad', dinner: 'Rice, Sambar, Poriyal, Curd' },
        { day: 'Sunday', breakfast: 'Chapati, Curry', lunch: 'Rice, Special Dish, Chapati', dinner: 'Rice, Dal, Vegetable, Curd' },
    ];

    const warden = {
        name: 'Dr. Lakshmi Devi',
        phone: '+91 98765 12345',
        email: 'warden@snpsu.edu.in',
        block: 'All Blocks',
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-500/20 text-green-400';
            case 'occupied':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'full':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hostel Management</h1>
                <p className="text-gray-400">Room allocation and hostel facilities</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('rooms')}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'rooms' ? 'bg-[#d4af37] text-[#111827]' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Rooms
                </button>
                <button
                    onClick={() => setActiveTab('mess')}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'mess' ? 'bg-[#d4af37] text-[#111827]' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Mess Menu
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'contact' ? 'bg-[#d4af37] text-[#111827]' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Contact
                </button>
            </div>

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <div key={room._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Home className="text-blue-400" size={24} />
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{room.roomNumber}</h3>
                                        <p className="text-sm text-gray-400">{room.blockName} - Floor {room.floor}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(room.status)}`}>
                                    {room.status}
                                </span>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-300">
                                    <span>Type:</span>
                                    <span className="text-white capitalize">{room.roomType}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Capacity:</span>
                                    <span className="text-white">{room.capacity} students</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Occupied:</span>
                                    <span className="text-white">{room.occupants.length} / {room.capacity}</span>
                                </div>
                            </div>

                            {room.occupants.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <p className="text-xs text-gray-400 mb-2">Occupants:</p>
                                    {room.occupants.map((occupant, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                                            <Users size={14} />
                                            <span>{occupant.studentName}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-xs text-gray-400 mb-2">Facilities:</p>
                                <div className="flex flex-wrap gap-2">
                                    {room.facilities.map((facility, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs capitalize">
                                            {facility.replace('-', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mess Menu Tab */}
            {activeTab === 'mess' && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <Utensils className="text-orange-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Weekly Mess Menu</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Day</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Breakfast</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Lunch</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Dinner</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {messMenu.map((menu, index) => (
                                    <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-white">{menu.day}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{menu.breakfast}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{menu.lunch}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{menu.dinner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <div className="max-w-2xl">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <Users className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Hostel Warden</h3>
                                <p className="text-gray-400">{warden.block}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg">
                                <Users className="text-blue-400" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400">Name</p>
                                    <p className="text-white font-medium">{warden.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg">
                                <Phone className="text-green-400" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400">Phone</p>
                                    <p className="text-white font-medium">{warden.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg">
                                <Mail className="text-purple-400" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-white font-medium">{warden.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3 mt-6">
                        <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-blue-300">
                            <p className="font-semibold mb-1">Emergency Contact</p>
                            <p className="text-blue-400">For emergencies, contact the security office at +91 80 9876 5432 (24x7)</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelPage;
