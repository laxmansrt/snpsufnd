import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Minus, Maximize2, Bot, User, Loader2, Sparkles, Mic, MicOff, Image, Paperclip, Trash2 } from 'lucide-react';
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
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // Voice Recognition Setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessage(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Image Upload Logic
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size too large (max 5MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setPreviewUrl(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Typing animation effect
    const typeMessage = async (text, callback) => {
        setIsTyping(true);
        let displayText = '';
        const words = text.split(' ');

        for (let i = 0; i < words.length; i++) {
            displayText += (i > 0 ? ' ' : '') + words[i];
            callback(displayText);
            await new Promise(resolve => setTimeout(resolve, 50)); // Typing speed
        }
        setIsTyping(false);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const finalMessage = message.trim();
        if ((!finalMessage && !selectedImage) || loading) return;

        const currentImage = selectedImage;
        const currentUserMessage = finalMessage;

        setMessage('');
        setSelectedImage(null);
        setPreviewUrl(null);

        // Add user message with image if present
        setChatHistory(prev => [...prev, {
            role: 'user',
            parts: [{ text: currentUserMessage || (currentImage ? "Image sent" : "") }],
            image: currentImage,
            timestamp: new Date()
        }]);

        setLoading(true);

        try {
            const response = await aiAPI.chat(currentUserMessage, currentImage, chatHistory);

            // Add AI response with typing effect
            const aiMessage = {
                role: 'model',
                parts: [{ text: '' }],
                timestamp: new Date()
            };

            setChatHistory(prev => [...prev, aiMessage]);

            // Simulate typing
            await typeMessage(response.reply, (partialText) => {
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].parts[0].text = partialText;
                    return newHistory;
                });
            });

        } catch (error) {
            console.error('AI Chat Error:', error);
            setChatHistory(prev => [...prev, {
                role: 'model',
                parts: [{ text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }],
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-[#0f172a] text-white rounded-xl shadow-2xl flex items-center gap-0 hover:gap-4 p-3 hover:p-4 hover:pr-6 transition-all duration-300 z-50 group border border-gray-800 animate-slide-in max-w-[60px] hover:max-w-md overflow-hidden"
            >
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e293b] transition-colors">
                    <MessageSquare size={20} className="text-[#d4af37]" />
                </div>
                <div className="text-left w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                    <h3 className="font-bold text-base flex items-center gap-2">
                        Hi <span className="animate-wave">👋</span> I'm SNPSU AI Assistant
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        I can help you with results, voice search, and image analysis!
                    </p>
                </div>
            </button>
        );
    }

    return (
        <div className={clsx(
            "fixed bottom-6 right-6 w-96 bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-700 flex flex-col transition-all duration-500 z-50 overflow-hidden",
            isMinimized ? "h-16 scale-95" : "h-[500px] scale-100",
            "animate-slide-up"
        )}>
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0f172a] to-[#1a2942] border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)] rounded-xl flex items-center justify-center text-[#0f172a]">
                            <Bot size={22} strokeWidth={2.5} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0f172a] shadow-lg"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                            SNPSU AI Assistant
                            <Sparkles size={14} className="text-[#d4af37] animate-pulse" />
                        </h3>
                        <div className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Always Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-8 animate-fade-in">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#c5a028] rounded-2xl flex items-center justify-center text-[#0f172a] mx-auto mb-4 shadow-lg animate-bounce-slow">
                                    <Bot size={32} />
                                </div>
                                <h4 className="text-white font-bold mb-2 text-lg">Welcome{user ? `, ${user.name}` : ''}! 👋</h4>
                                <p className="text-gray-400 text-sm px-6 leading-relaxed">
                                    {user
                                        ? "I'm your intelligent assistant. Ask me anything about announcements, attendance, results, or portal features."
                                        : "I can help you with registration, login, or general information about Sapthagiri NPS University."}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    {['Check Results', 'View Attendance', 'Latest Notices'].map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMessage(suggestion)}
                                            className="px-3 py-1.5 bg-[#0f172a] border border-gray-700 rounded-lg text-xs text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-200 hover:scale-105"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "flex items-start gap-2.5 animate-slide-in",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                                style={{
                                    animationDelay: `${idx * 0.1}s`
                                }}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
                                    msg.role === 'user'
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                        : "bg-gradient-to-br from-[#d4af37] to-[#c5a028] text-[#0f172a]"
                                )}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={clsx(
                                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg transition-all duration-300 hover:shadow-xl",
                                    msg.role === 'user'
                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none"
                                        : "bg-[#0f172a] text-gray-200 border border-gray-700 rounded-tl-none"
                                )}>
                                    {msg.image && (
                                        <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                                            <img src={msg.image} alt="User upload" className="max-w-full h-auto" />
                                        </div>
                                    )}
                                    {msg.parts[0].text}
                                    {isTyping && idx === chatHistory.length - 1 && (
                                        <span className="inline-block w-1 h-4 bg-[#d4af37] ml-1 animate-pulse"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && !isTyping && (
                            <div className="flex items-start gap-2.5 animate-pulse">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] text-[#0f172a] flex items-center justify-center shadow-md">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-[#0f172a] text-gray-400 border border-gray-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-xs">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="px-4 bg-gradient-to-r from-[#0f172a] to-[#1a2942] border-t border-gray-700">
                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="py-2 flex items-center gap-2 animate-slide-up">
                                <div className="relative group">
                                    <img src={previewUrl} className="w-12 h-12 rounded-lg object-cover border border-[#d4af37]" alt="Preview" />
                                    <button
                                        onClick={removeImage}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-lg group-hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                                <span className="text-[10px] text-gray-400">Image attached</span>
                            </div>
                        )}

                        <form onSubmit={handleSend} className="py-4">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={clsx(
                                        "p-2 rounded-lg transition-all hover:scale-110",
                                        selectedImage ? "text-[#d4af37] bg-[#d4af37]/10" : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    )}
                                    title="Upload photo"
                                >
                                    <Image size={20} />
                                </button>

                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={isListening ? "Listening..." : "Type your message..."}
                                        className="w-full bg-[#1e293b] border border-gray-700 rounded-xl pl-4 pr-20 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all duration-200"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={toggleListening}
                                            className={clsx(
                                                "p-2 rounded-lg transition-all",
                                                isListening ? "text-red-500 bg-red-500/10 animate-pulse" : "text-gray-400 hover:text-white"
                                            )}
                                        >
                                            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={(!message.trim() && !selectedImage) || loading}
                                            className="p-2 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AIChat;
