import React from 'react';
import BrandLogo from './BrandLogo';

interface StayHubLoadingScreenProps {
    progress?: number; // 0-100
}

const StayHubLoadingScreen: React.FC<StayHubLoadingScreenProps> = ({ progress = 0 }) => {
    return (
        <div className="min-h-screen bg-[#121417] overflow-hidden flex justify-center items-center relative">
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
            <div className="absolute w-[400px] h-[400px] bg-radial-gradient(circle, rgba(255, 214, 70, 0.04) 0%, transparent 70%) rounded-full -z-10 animate-ambient-glow" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Logo Section (reuse BrandLogo component) */}
                <div className="flex items-center gap-4 mb-8 animate-fadeInUp">
                    <BrandLogo size="xl" animated />
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

        .animate-ambient-glow {
          animation: ambientGlow 4s ease-in-out infinite;
        }

        @keyframes ambientGlow {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
            filter: blur(0px);
          }
          25% {
            transform: scale(1.1) rotate(90deg);
            opacity: 0.5;
            filter: blur(2px);
          }
          50% {
            transform: scale(0.9) rotate(180deg);
            opacity: 0.4;
            filter: blur(1px);
          }
          75% {
            transform: scale(1.05) rotate(270deg);
            opacity: 0.6;
            filter: blur(3px);
          }
        }
      `}</style>
        </div>
    );
};

export default StayHubLoadingScreen;