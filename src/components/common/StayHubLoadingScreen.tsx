import React, { useEffect, useRef } from 'react';
import BrandLogo from './BrandLogo';

interface StayHubLoadingScreenProps {
  progress?: number; // 0-100
}

const StayHubLoadingScreen: React.FC<StayHubLoadingScreenProps> = ({ progress = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    dx: 0,
    dy: 0,
    score: 0,
    gameActive: true,
    lastTimestamp: 0,
    gameSpeed: 100,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 20;
    canvas.width = canvas.height = gridSize * tileCount;
    const gameState = gameStateRef.current;

    const spawnFood = () => {
      gameState.food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };
      gameState.snake.forEach((part) => {
        if (part.x === gameState.food.x && part.y === gameState.food.y) {
          spawnFood();
        }
      });
    };

    const moveSnake = () => {
      if (gameState.dx === 0 && gameState.dy === 0) return;

      const head = {
        x: gameState.snake[0].x + gameState.dx,
        y: gameState.snake[0].y + gameState.dy,
      };

      if (head.x < 0) head.x = tileCount - 1;
      if (head.x >= tileCount) head.x = 0;
      if (head.y < 0) head.y = tileCount - 1;
      if (head.y >= tileCount) head.y = 0;

      gameState.snake.unshift(head);

      if (head.x === gameState.food.x && head.y === gameState.food.y) {
        gameState.score++;
        spawnFood();
      } else {
        gameState.snake.pop();
      }
    };

    const checkCollision = () => {
      const head = gameState.snake[0];
      for (let i = 1; i < gameState.snake.length; i++) {
        if (gameState.snake[i].x === head.x && gameState.snake[i].y === head.y) {
          gameOver();
        }
      }
    };

    const gameOver = () => {
      gameState.snake = [{ x: 10, y: 10 }];
      gameState.score = 0;
      gameState.dx = gameState.dy = 0;
    };

    const drawHouse = (x: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(x + gridSize / 2, y + 4);
      ctx.lineTo(x + 4, y + gridSize / 2 + 2);
      ctx.lineTo(x + gridSize - 4, y + gridSize / 2 + 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x + 6, y + gridSize / 2 + 2, gridSize - 12, gridSize / 2 - 6);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Food
      ctx.fillStyle = '#FFD646';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD646';
      ctx.beginPath();
      ctx.arc(
        gameState.food.x * gridSize + gridSize / 2,
        gameState.food.y * gridSize + gridSize / 2,
        gridSize / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      gameState.snake.forEach((part, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#FFD646' : 'rgba(255, 214, 70, 0.3)';

        if (isHead) {
          drawHouse(part.x * gridSize, part.y * gridSize);
        } else {
          ctx.beginPath();
          ctx.roundRect(
            part.x * gridSize + 2,
            part.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4,
            4
          );
          ctx.fill();
        }
      });
    };

    const gameLoop = (timestamp: number) => {
      if (!gameState.gameActive) return;

      if (timestamp - gameState.lastTimestamp > gameState.gameSpeed) {
        moveSnake();
        checkCollision();
        draw();
        gameState.lastTimestamp = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (gameState.dy !== 1) {
            gameState.dx = 0;
            gameState.dy = -1;
          }
          break;
        case 'ArrowDown':
          if (gameState.dy !== -1) {
            gameState.dx = 0;
            gameState.dy = 1;
          }
          break;
        case 'ArrowLeft':
          if (gameState.dx !== 1) {
            gameState.dx = -1;
            gameState.dy = 0;
          }
          break;
        case 'ArrowRight':
          if (gameState.dx !== -1) {
            gameState.dx = 1;
            gameState.dy = 0;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#121417] overflow-hidden flex justify-center items-center relative">
      {/* Grid Background Animation */}
      <div
        className="absolute top-0 left-0 w-[200%] h-[200%] opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'moveGrid 20s linear infinite',
        }}
      />

      {/* Ambient Glow */}
      <div className="absolute w-[400px] h-[400px] bg-radial-gradient(circle, rgba(255, 214, 70, 0.04) 0%, transparent 70%) rounded-full -z-10 animate-ambient-glow" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-8 animate-fadeInUp">
          <BrandLogo size="xl" animated />
        </div>

        {/* Snake Game */}
        <div className="mb-8 animate-fadeIn">
          <canvas
            ref={canvasRef}
            className="bg-black/30 border border-white/10 rounded-lg shadow-lg"
            style={{ display: 'block' }}
          />
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

        {/* Game Instructions */}
        <p className="text-white/40 text-xs mt-4 animate-fadeIn">
          Sử dụng các phím mũi tên để điều khiển con rắn • Thu thập các điểm vàng
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