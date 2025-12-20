import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ size = 'md', color = 'primary', className }) => {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4'
    };

    const colors = {
        primary: 'border-[#d4af37]',
        white: 'border-white',
        gray: 'border-gray-400'
    };

    return (
        <div className={clsx(
            "animate-spin rounded-full border-t-transparent",
            sizes[size],
            colors[color],
            className
        )}></div>
    );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
            <div className="relative">
                {/* Outer Ring */}
                <div className="h-24 w-24 rounded-full border-4 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
                {/* Inner Ring */}
                <div className="absolute inset-2 h-20 w-20 rounded-full border-4 border-white/10 border-b-white/40 animate-spin-slow"></div>
                {/* Center Logo/Icon Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 bg-[#d4af37] rounded-lg flex items-center justify-center text-[#111827] font-bold text-xl">
                        N
                    </div>
                </div>
            </div>
            <p className="mt-6 text-white font-medium tracking-widest uppercase text-sm animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default LoadingSpinner;
