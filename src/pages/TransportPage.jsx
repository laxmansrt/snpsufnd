import React, { useState } from 'react';
import { Bus, MapPin, Clock, Phone, User, AlertCircle, Send } from 'lucide-react';
import { transportAPI } from '../services/transportService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const TransportPage = () => {
    const [routes] = useState([
        {
            _id: '507f1f77bcf86cd799439011',
            routeNumber: 'R01',
            routeName: 'BTM Layout - College',
            driverName: 'Rajesh Kumar',
            driverPhone: '+91 98765 43210',
            busNumber: 'KA-01-AB-1234',
            capacity: 40,
            status: 'active',
            stops: [
                { stopName: 'BTM Layout', arrivalTime: '07:00 AM', departureTime: '07:05 AM' },
                { stopName: 'Silk Board', arrivalTime: '07:20 AM', departureTime: '07:25 AM' },
                { stopName: 'Bommanahalli', arrivalTime: '07:35 AM', departureTime: '07:40 AM' },
                { stopName: 'College Gate', arrivalTime: '08:00 AM', departureTime: '-' },
            ],
            schedule: {
                morningStart: '07:00 AM',
                morningEnd: '08:00 AM',
                eveningStart: '05:00 PM',
                eveningEnd: '06:00 PM',
            },
        },
        {
            _id: '507f1f77bcf86cd799439012',
            routeNumber: 'R02',
            routeName: 'Marathahalli - College',
            driverName: 'Suresh Nair',
            driverPhone: '+91 98765 43211',
            busNumber: 'KA-01-CD-5678',
            capacity: 45,
            status: 'active',
            stops: [
                { stopName: 'Marathahalli', arrivalTime: '07:10 AM', departureTime: '07:15 AM' },
                { stopName: 'Kundalahalli', arrivalTime: '07:25 AM', departureTime: '07:30 AM' },
                { stopName: 'Whitefield', arrivalTime: '07:40 AM', departureTime: '07:45 AM' },
                { stopName: 'College Gate', arrivalTime: '08:00 AM', departureTime: '-' },
            ],
            schedule: {
                morningStart: '07:10 AM',
                morningEnd: '08:00 AM',
                eveningStart: '05:00 PM',
                eveningEnd: '06:00 PM',
            },
        },
    ]);

    const { user } = useAuth();
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [applying, setApplying] = useState(false);

    const handleApply = async (route) => {
        if (user?.role !== 'student') {
            alert('Only students can apply for transport.');
            return;
        }

        if (!window.confirm(`Are you sure you want to apply for ${route.routeName}?`)) {
            return;
        }

        try {
            setApplying(true);
            await transportAPI.submitApplication({
                routeId: route._id,
                routeName: route.routeName,
                routeNumber: route.routeNumber,
                pickupPoint: route.stops[0].stopName, // Default to first stop
            });
            alert('Transport application submitted successfully! You can check status in your dashboard.');
        } catch (error) {
            console.error('Apply error:', error);
            alert(error.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Transport Management</h1>
                <p className="text-gray-400">Bus routes and transportation services</p>
            </div>

            {/* Route Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {routes.map((route) => (
                    <div
                        key={route._id}
                        className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-[#d4af37] transition-all cursor-pointer"
                        onClick={() => setSelectedRoute(selectedRoute?._id === route._id ? null : route)}
                    >
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Bus className="text-blue-400" size={24} />
                                        <h3 className="text-xl font-bold text-white">{route.routeName}</h3>
                                    </div>
                                    <p className="text-gray-300">Route {route.routeNumber}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold capitalize">
                                    {route.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <User size={16} />
                                    <span>{route.driverName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Phone size={16} />
                                    <span>{route.driverPhone}</span>
                                </div>
                            </div>
                        </div>

                        {selectedRoute?._id === route._id && (
                            <div className="p-6 space-y-4">
                                {/* Bus Details */}
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-3">Bus Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-300">
                                            <span>Bus Number:</span>
                                            <span className="font-mono text-white">{route.busNumber}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span>Capacity:</span>
                                            <span className="text-white">{route.capacity} seats</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stops */}
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <MapPin size={18} />
                                        Bus Stops & Timings
                                    </h4>
                                    <div className="space-y-3">
                                        {route.stops.map((stop, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-blue-400 font-semibold text-sm">{index + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-medium">{stop.stopName}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                                        <span>Arrival: {stop.arrivalTime}</span>
                                                        {stop.departureTime !== '-' && (
                                                            <span>Departure: {stop.departureTime}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <Clock size={18} />
                                        Schedule
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400 mb-1">Morning</p>
                                            <p className="text-white">{route.schedule.morningStart} - {route.schedule.morningEnd}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 mb-1">Evening</p>
                                            <p className="text-white">{route.schedule.eveningStart} - {route.schedule.eveningEnd}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Apply Button */}
                                {user?.role === 'student' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleApply(route);
                                        }}
                                        disabled={applying}
                                        className="w-full py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                                    >
                                        {applying ? <LoadingSpinner size="sm" color="white" /> : <Send size={20} />}
                                        {applying ? 'Submitting...' : 'Apply for this Route'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Transport Information</p>
                    <p className="text-blue-400">For any queries or route changes, please contact the transport office at +91 80 1234 5678</p>
                </div>
            </div>
        </div>
    );
};

export default TransportPage;
