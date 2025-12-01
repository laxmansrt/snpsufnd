import React, { useState } from 'react';
import { DollarSign, Download, CreditCard, Calendar, CheckCircle, AlertCircle, Clock, X, Smartphone, Building2, Wallet } from 'lucide-react';

const FeeStatusPage = () => {
    const [selectedSemester, setSelectedSemester] = useState('Current Semester');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [processing, setProcessing] = useState(false);

    const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Current Semester'];

    // Mock student fee data
    const feeStructure = {
        tuitionFee: 85000,
        examFee: 5000,
        libraryFee: 2000,
        labFee: 8000,
        sportsFee: 1500,
        developmentFee: 3500,
        total: 105000
    };

    const payments = [
        { id: 1, date: '2025-08-15', amount: 52500, type: 'Installment 1', method: 'Online', status: 'Completed', receiptNo: 'RCP001234' },
        { id: 2, date: '2025-10-20', amount: 52500, type: 'Installment 2', method: 'Card', status: 'Completed', receiptNo: 'RCP001456' },
    ];

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const balance = feeStructure.total - totalPaid;
    const paymentPercentage = (totalPaid / feeStructure.total) * 100;

    const handleDownloadReceipt = (receiptNo) => {
        alert(`Downloading receipt: ${receiptNo}`);
    };

    const handlePayNow = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessing(false);
        setShowPaymentModal(false);
        alert(`Payment of ₹${balance.toLocaleString()} processed successfully via ${selectedPaymentMethod}!`);
        setSelectedPaymentMethod('');
    };

    const paymentMethods = [
        { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
        { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
        { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Paytm, Amazon Pay' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Fee Status</h1>
                    <p className="text-gray-400">View your fee details and payment history</p>
                </div>
                {balance > 0 && (
                    <button
                        onClick={handlePayNow}
                        className="flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                    >
                        <CreditCard size={20} />
                        Pay Now
                    </button>
                )}
            </div>

            {/* Semester Filter */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Semester</label>
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-[#d4af37] outline-none"
                >
                    {semesters.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>
            </div>

            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-blue-400 text-sm font-medium">Total Fee</span>
                        <DollarSign className="text-blue-500" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white">₹{feeStructure.total.toLocaleString()}</div>
                    <p className="text-gray-400 text-sm mt-2">For {selectedSemester}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-green-400 text-sm font-medium">Amount Paid</span>
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white">₹{totalPaid.toLocaleString()}</div>
                    <p className="text-gray-400 text-sm mt-2">{paymentPercentage.toFixed(0)}% Completed</p>
                </div>

                <div className={`bg-gradient-to-br ${balance > 0 ? 'from-red-500/20 to-red-600/10 border-red-500/30' : 'from-green-500/20 to-green-600/10 border-green-500/30'} border rounded-xl p-6`}>
                    <div className="flex items-center justify-between mb-3">
                        <span className={`${balance > 0 ? 'text-red-400' : 'text-green-400'} text-sm font-medium`}>Balance Due</span>
                        {balance > 0 ? <AlertCircle className="text-red-500" size={24} /> : <CheckCircle className="text-green-500" size={24} />}
                    </div>
                    <div className="text-3xl font-bold text-white">₹{balance.toLocaleString()}</div>
                    <p className="text-gray-400 text-sm mt-2">{balance > 0 ? 'Payment Pending' : 'Fully Paid'}</p>
                </div>
            </div>

            {/* Payment Progress Bar */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">Payment Progress</h3>
                    <span className="text-gray-400 text-sm">{paymentPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-[#d4af37] to-[#f3cd57] h-full rounded-full transition-all duration-500"
                        style={{ width: `${paymentPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Fee Structure Breakdown */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Fee Structure Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Fee Type</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            <tr className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white">Tuition Fee</td>
                                <td className="px-6 py-4 text-right text-gray-300">₹{feeStructure.tuitionFee.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white">Examination Fee</td>
                                <td className="px-6 py-4 text-right text-gray-300">₹{feeStructure.examFee.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white">Library Fee</td>
                                <td className="px-6 py-4 text-right text-gray-300">₹{feeStructure.libraryFee.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white">Laboratory Fee</td>
                                <td className="px-6 py-4 text-right text-gray-300">₹{feeStructure.labFee.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white">Sports Fee</td>
                                <td className="px-6 py-4 text-right text-gray-300">₹{feeStructure.sportsFee.toLocaleString()}</td>
                            </tr>
                            <tr className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white">Development Fee</td>
                                <td className="px-6 py-4 text-right text-gray-300">₹{feeStructure.developmentFee.toLocaleString()}</td>
                            </tr>
                            <tr className="bg-gray-900">
                                <td className="px-6 py-4 text-white font-bold text-lg">Total</td>
                                <td className="px-6 py-4 text-right text-[#d4af37] font-bold text-lg">₹{feeStructure.total.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Method</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-500" />
                                            {new Date(payment.date).toLocaleDateString('en-IN')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{payment.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{payment.method}</td>
                                    <td className="px-6 py-4 text-right text-green-400 font-bold">₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                            <CheckCircle size={12} />
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDownloadReceipt(payment.receiptNo)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors text-sm"
                                        >
                                            <Download size={14} />
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Due Date Alert */}
            {balance > 0 && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <Clock className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="text-yellow-400 font-bold text-lg mb-2">Payment Reminder</h4>
                            <p className="text-gray-300">
                                You have a pending balance of <span className="font-bold text-white">₹{balance.toLocaleString()}</span>.
                                Please complete your payment before the due date to avoid late fees.
                            </p>
                            <button
                                onClick={handlePayNow}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
                            >
                                <CreditCard size={18} />
                                Pay Balance Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Select Payment Method</h3>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedPaymentMethod('');
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Amount to Pay</span>
                                    <span className="text-2xl font-bold text-[#d4af37]">₹{balance.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                            className={`w-full p-4 rounded-lg border-2 transition-all ${selectedPaymentMethod === method.id
                                                    ? 'border-[#d4af37] bg-[#d4af37]/10'
                                                    : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${selectedPaymentMethod === method.id
                                                        ? 'bg-[#d4af37]/20 text-[#d4af37]'
                                                        : 'bg-gray-800 text-gray-400'
                                                    }`}>
                                                    <Icon size={24} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className={`font-semibold ${selectedPaymentMethod === method.id ? 'text-white' : 'text-gray-300'
                                                        }`}>
                                                        {method.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{method.description}</div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id
                                                        ? 'border-[#d4af37] bg-[#d4af37]'
                                                        : 'border-gray-600'
                                                    }`}>
                                                    {selectedPaymentMethod === method.id && (
                                                        <CheckCircle size={16} className="text-gray-900" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-700 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedPaymentMethod('');
                                }}
                                className="flex-1 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={!selectedPaymentMethod || processing}
                                className="flex-1 px-4 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Proceed to Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeStatusPage;
