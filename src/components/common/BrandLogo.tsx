import React from 'react';

interface BrandLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
    animated?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
    size = 'md',
    showText = true,
    className = '',
    animated = true
}) => {
    const sizeClasses = {
        sm: { icon: 'w-8 h-8', text: 'text-2xl' },
        md: { icon: 'w-12 h-12', text: 'text-4xl' },
        lg: { icon: 'w-16 h-16', text: 'text-5xl' },
        xl: { icon: 'w-18 h-18', text: 'text-6xl' }
    };

    const currentSize = sizeClasses[size];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                className={`${currentSize.icon} fill-[#FFD646] dark:fill-[#FFD646] glow-effect ${animated ? 'animate-pulse' : ''}`}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    '--window-color': 'white',
                    '--glow-color': 'rgba(255, 214, 70, 0.4)',
                } as React.CSSProperties}
            >
                <style>
                    {`
                        .dark { --window-color: white; --glow-color: rgba(255, 214, 70, 0.6); }
                        .window-fill { fill: white; }
                        .glow-effect { filter: drop-shadow(0 0 15px var(--glow-color)); }
                    `}
                </style>
                {/* House Roof & Main Body */}
                <path d="M10 55 L50 20 L90 55 L90 85 L10 85 Z" />
                {/* Windows/Details from the original brand identity */}
                <rect x="55" y="65" width="12" height="12" className="window-fill" rx="1.5" />
                <rect x="38" y="65" width="12" height="12" className="window-fill" rx="1.5" />
            </svg>
            {showText && (
                <h1 className={`text-[#FFD646] dark:text-[#FFD646] font-['Plus_Jakarta_Sans'] ${currentSize.text} font-extrabold tracking-tight leading-none`}>
                    StayHub
                </h1>
            )}
        </div>
    );
};

export default BrandLogo;