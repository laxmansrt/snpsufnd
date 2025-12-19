import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Minus, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import { aiAPI } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const AIChat = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = message.trim();
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
        setLoading(true);

        try {
            const response = await aiAPI.chat(userMessage, chatHistory);
            setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response.reply }] }]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setChatHistory(prev => [...prev, {
                role: 'model',
                parts: [{ text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#d4af37] text-[#0f172a] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
            >
                <MessageSquare size={28} />
                <span className="absolute right-16 bg-[#1e293b] text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                    Need help? Ask AI
                </span>
            </button>
        );
    }

    return (
        <div className={clsx(
            "fixed bottom-6 right-6 w-96 bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-700 flex flex-col transition-all z-50 overflow-hidden",
            isMinimized ? "h-16" : "h-[500px]"
        )}>
            {/* Header */}
            <div className="p-4 bg-[#0f172a] border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#d4af37]/20 rounded-lg flex items-center justify-center text-[#d4af37]">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Nexus AI Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-400">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center text-[#d4af37] mx-auto mb-3">
                                    <Bot size={24} />
                                </div>
                                <h4 className="text-white font-medium mb-1">Welcome{user ? `, ${user.name}` : ''}!</h4>
                                <p className="text-gray-400 text-xs px-6">
                                    I'm your intelligent assistant. {user ? "Ask me anything about announcements, attendance, results, or portal features." : "I can help you with registration, login, or general information about Sapthagiri NPS University."}
                                </p>
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={clsx(
                                "flex items-start gap-2.5",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div className={clsx(
                                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                    msg.role === 'user' ? "bg-blue-500/20 text-blue-400" : "bg-[#d4af37]/20 text-[#d4af37]"
                                )}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={clsx(
                                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-[#0f172a] text-gray-200 border border-gray-700 rounded-tl-none"
                                )}>
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-[#0f172a] text-gray-400 border border-gray-700 p-3 rounded-2xl rounded-tl-none">
                                    <Loader2 size={16} className="animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-[#0f172a] border-t border-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default AIChat;
