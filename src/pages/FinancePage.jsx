import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, Plus, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

const FinancePage = () => {
    // Mock Data
    const stats = [
        { title: 'Total Revenue', amount: '₹45,23,000', change: '+12.5%', trend: 'up' },
        { title: 'Pending Fees', amount: '₹8,45,000', change: '-5.2%', trend: 'down' },
        { title: 'Total Expenses', amount: '₹32,10,000', change: '+8.3%', trend: 'up' },
        { title: 'Net Income', amount: '₹13,13,000', change: '+15.8%', trend: 'up' },
    ];

    const revenueData = [
        { month: 'Jan', revenue: 3500000, expenses: 2800000 },
        { month: 'Feb', revenue: 4200000, expenses: 3100000 },
        { month: 'Mar', revenue: 3800000, expenses: 2900000 },
        { month: 'Apr', revenue: 4500000, expenses: 3200000 },
        { month: 'May', revenue: 4100000, expenses: 3000000 },
        { month: 'Jun', revenue: 4523000, expenses: 3210000 },
    ];

    const expenseData = [
        { name: 'Salaries', value: 18000000 },
        { name: 'Infrastructure', value: 8000000 },
        { name: 'Utilities', value: 3000000 },
        { name: 'Maintenance', value: 2000000 },
        { name: 'Others', value: 1210000 },
    ];

    const COLORS = ['#d4af37', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const transactions = [
        { id: 1, student: 'Rahul Sharma', type: 'Tuition Fee', amount: 85000, date: '2023-11-20', status: 'Completed', mode: 'Online' },
        { id: 2, student: 'Priya Patel', type: 'Hostel Fee', amount: 45000, date: '2023-11-19', status: 'Completed', mode: 'UPI' },
        { id: 3, student: 'Amit Kumar', type: 'Exam Fee', amount: 2500, date: '2023-11-18', status: 'Pending', mode: 'Cash' },
        { id: 4, student: 'Sneha Gupta', type: 'Library Fee', amount: 1000, date: '2023-11-17', status: 'Completed', mode: 'Card' },
    ];

    const handleDownloadReport = () => {
        const worksheet = XLSX.utils.json_to_sheet(transactions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "Finance_Report.xlsx");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Financial Overview</h1>
                    <p className="text-gray-400">Track revenue, expenses, and transactions.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white border border-gray-700 rounded-lg hover:bg-[#0f172a] transition-colors"
                    >
                        <Download size={18} />
                        <span>Download Report</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f172a] rounded-lg hover:bg-[#c5a028] transition-colors">
                        <Plus size={18} />
                        <span>Record Transaction</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">{stat.title}</span>
                            <DollarSign className="text-[#d4af37]" size={20} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{stat.amount}</h3>
                        <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span>{stat.change} from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Expenses */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6">Revenue vs Expenses</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Distribution */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6">Expense Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#0f172a] border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Mode</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-[#0f172a] transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{txn.student}</td>
                                    <td className="px-6 py-4 text-gray-300">{txn.type}</td>
                                    <td className="px-6 py-4 text-white font-bold">₹{txn.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-300">{txn.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${txn.status === 'Completed'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{txn.mode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancePage;
