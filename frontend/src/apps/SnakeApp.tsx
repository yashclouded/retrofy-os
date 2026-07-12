import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export function SnakeApp() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 10 });
    setGameOver(false);
    setScore(0);
    containerRef.current?.focus();
  };

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, generateFood]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameOver) return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center bg-[#c0c0c0] outline-none select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <div className="flex justify-between w-[400px] mb-2 px-2 border-2 border-white border-b-gray-600 border-r-gray-600 bg-[#000080] text-white font-bold text-sm">
        <span>SCORE: {score}</span>
        <span>SNAKE.EXE</span>
      </div>

      <div 
        className="bg-[#008080] border-4 border-gray-600 border-t-black border-l-black relative"
        style={{ width: 400, height: 400 }}
      >
        {/* Food */}
        <div 
          className="absolute bg-red-500 border border-black"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            width: 20,
            height: 20
          }}
        />
        
        {/* Snake */}
        {snake.map((segment, i) => (
          <div 
            key={i}
            className={`absolute border border-black ${i === 0 ? 'bg-yellow-400' : 'bg-yellow-200'}`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
              width: 20,
              height: 20
            }}
          />
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4 text-red-500">GAME OVER</h2>
            <button 
              className="nice90s-button px-6 py-2 text-black bg-[#c0c0c0]"
              onClick={resetGame}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-xs font-bold">Use Arrow Keys to move. Click to focus.</p>
    </div>
  );
}
