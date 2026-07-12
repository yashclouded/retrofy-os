import React, { useState } from 'react';

export function TicTacToeApp() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || calculateWinner(board)) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((square) => square !== null);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#c0c0c0] p-4 font-sans select-none">
      <div className="mb-4 text-xl font-bold bg-white px-4 py-2 border-2 border-black nice90s-inset">
        {status}
      </div>
      
      <div className="grid grid-cols-3 gap-1 bg-black p-1">
        {board.map((square, i) => (
          <button
            key={i}
            className="w-20 h-20 bg-[#c0c0c0] border-t-white border-l-white border-b-gray-600 border-r-gray-600 border-[3px] active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white text-5xl font-bold flex items-center justify-center focus:outline-none"
            onClick={() => handleClick(i)}
          >
            <span className={square === 'X' ? 'text-blue-700' : 'text-red-700'}>
              {square}
            </span>
          </button>
        ))}
      </div>

      <button
        className="mt-6 nice90s-button px-6 py-2 uppercase font-bold"
        onClick={() => {
          setBoard(Array(9).fill(null));
          setXIsNext(true);
        }}
      >
        Restart Game
      </button>
    </div>
  );
}
