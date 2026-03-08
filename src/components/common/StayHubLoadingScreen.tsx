import React from 'react';

interface StayHubLoadingScreenProps {
    progress?: number; // 0-100
}

const StayHubLoadingScreen: React.FC<StayHubLoadingScreenProps> = ({ progress = 0 }) => {
    return (
        <div className="min-h-screen bg-[#121417] overflow-hidden flex justify-center items-center font-['Plus_Jakarta_Sans'] relative">
            {/* Grid Background Animation */}
            <div
                className="absolute top-0 left-0 w-[200%] h-[200%] opacity-30"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    animation: 'moveGrid 20s linear infinite',
                }}
            />

            {/* Ambient Glow */}
            <div className="absolute w-[400px] h-[400px] bg-radial-gradient(circle, rgba(255, 214, 70, 0.04) 0%, transparent 70%) rounded-full -z-10" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Logo Section */}
                <div className="flex items-center gap-4 mb-8 animate-fadeInUp">
                    <svg
                        className="w-18 h-18 fill-[#FFD646] animate-pulse drop-shadow-[0_0_15px_rgba(255,214,70,0.4)]"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* House Roof & Main Body */}
                        <path d="M10 55 L50 20 L90 55 L90 85 L10 85 Z" />
                        {/* Windows/Details from the original brand identity */}
                        <rect x="55" y="65" width="12" height="12" fill="#121417" rx="1.5" />
                        <rect x="38" y="65" width="12" height="12" fill="#121417" rx="1.5" />
                    </svg>
                    <h1 className="text-[#FFD646] text-6xl font-extrabold tracking-tight leading-none">
                        StayHub
                    </h1>
                </div>

                {/* Progress Bar */}
                <div className="w-80 h-1 bg-white/5 rounded-xl overflow-hidden mb-6 animate-fadeIn">
                    <div
                        className="h-full bg-[#FFD646] shadow-[0_0_15px_rgba(255,214,70,0.5)] transition-all duration-300 ease-out"
                        style={{
                            width: `${progress}%`,
                            animation: progress === 100 ? 'none' : 'progress 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                        }}
                    />
                </div>

                {/* Tagline */}
                <p className="text-white/50 text-base font-normal max-w-[450px] leading-relaxed animate-fadeIn">
                    Hệ sinh thái lưu trú thông minh, <br />
                    kết nối trải nghiệm và tối ưu không gian sống
                </p>
            </div>

            <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(-25%, -25%); }
          100% { transform: translate(0, 0); }
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes progress {
          0% { width: 0%; left: 0; }
          50% { width: 70%; }
          100% { width: 100%; left: 0; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 15px rgba(255, 214, 70, 0.4)); }
          50% { transform: scale(1.03); opacity: 0.85; filter: drop-shadow(0 0 25px rgba(255, 214, 70, 0.6)); }
        }
      `}</style>
        </div>
    );
};

export default StayHubLoadingScreen;