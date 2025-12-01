import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description, icon: Icon }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    {Icon ? (
                        <Icon size={80} className="text-gray-600" strokeWidth={1.5} />
                    ) : (
                        <Construction size={80} className="text-gray-600" strokeWidth={1.5} />
                    )}
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
                <p className="text-gray-400 mb-6">
                    {description || "This feature is currently under development. Stay tuned!"}
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-[#111827] font-semibold rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default PlaceholderPage;
