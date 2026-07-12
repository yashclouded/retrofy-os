import React, { useState, useEffect, useCallback } from 'react';

const ROWS = 8;
const COLS = 8;
const MINES = 10;

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export function MinesweeperApp() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [face, setFace] = useState('🙂');

  const initializeBoard = useCallback(() => {
    let newBoard: Cell[][] = Array(ROWS).fill(null).map((_, r) => 
      Array(COLS).fill(null).map((_, c) => ({
        row: r, col: c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS) {
                if (newBoard[r + dr][c + dc].isMine) count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setFace('🙂');
  }, []);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || board[r][c].isRevealed || board[r][c].isFlagged) return;

    const newBoard = [...board.map(row => [...row])];
    
    if (newBoard[r][c].isMine) {
      // Game Over
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setGameOver(true);
      setFace('😵');
      return;
    }

    // Flood fill algorithm for empty cells
    const stack = [[r, c]];
    while (stack.length > 0) {
      const [currR, currC] = stack.pop()!;
      if (!newBoard[currR][currC].isRevealed && !newBoard[currR][currC].isFlagged) {
        newBoard[currR][currC].isRevealed = true;
        if (newBoard[currR][currC].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = currR + dr;
              const nc = currC + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);

    // Check Win
    let unrevealedSafe = 0;
    newBoard.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    if (unrevealedSafe === 0) {
      setGameWon(true);
      setFace('😎');
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || board[r][c].isRevealed) return;
    const newBoard = [...board.map(row => [...row])];
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-blue-900', 'text-red-900', 'text-teal-600', 'text-black', 'text-gray-600'];

  return (
    <div className="w-full h-full bg-[#c0c0c0] flex flex-col p-1 font-sans select-none items-center">
      
      {/* Menu */}
      <div className="w-full flex gap-4 p-1 bg-[#c0c0c0] text-black text-sm mb-2 border-b border-gray-400">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Game</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      <div className="bg-[#c0c0c0] border-t-gray-600 border-l-gray-600 border-b-white border-r-white border-2 p-1.5 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full bg-[#c0c0c0] border-t-gray-600 border-l-gray-600 border-b-white border-r-white border-2 p-1 mb-1.5 flex justify-between items-center">
          <div className="bg-black text-red-600 font-mono text-2xl px-1 shadow-[inset_1px_1px_0_#fff]">
            {MINES.toString().padStart(3, '0')}
          </div>
          
          <button 
            className="nice90s-button w-8 h-8 flex items-center justify-center text-xl"
            onClick={initializeBoard}
            onPointerDown={() => setFace('😮')}
            onPointerUp={() => setFace(gameOver ? '😵' : (gameWon ? '😎' : '🙂'))}
            onPointerLeave={() => setFace(gameOver ? '😵' : (gameWon ? '😎' : '🙂'))}
          >
            {face}
          </button>
          
          <div className="bg-black text-red-600 font-mono text-2xl px-1 shadow-[inset_1px_1px_0_#fff]">
            000
          </div>
        </div>

        {/* Grid */}
        <div className="bg-[#c0c0c0] border-t-gray-600 border-l-gray-600 border-b-white border-r-white border-[3px] shadow-[0_0_0_1px_#808080]">
          {board.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  className={`w-6 h-6 font-bold flex items-center justify-center text-sm outline-none focus:outline-none ${
                    cell.isRevealed
                      ? (cell.isMine ? 'bg-red-500 border border-gray-400' : 'bg-[#c0c0c0] border border-gray-400')
                      : 'bg-[#c0c0c0] border-t-white border-l-white border-b-gray-600 border-r-gray-600 border-[2px] active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white active:bg-[#c0c0c0]'
                  }`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                >
                  {cell.isRevealed
                    ? (cell.isMine ? '💣' : (cell.neighborMines > 0 ? <span className={colors[cell.neighborMines]}>{cell.neighborMines}</span> : ''))
                    : (cell.isFlagged ? <span className="text-red-600">🚩</span> : '')}
                </button>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
