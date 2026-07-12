import React, { useState } from 'react';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNum = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (op: string) => {
    if (operator && !newNumber) {
      handleEqual();
    }
    setOperator(op);
    setPrevious(parseFloat(display));
    setNewNumber(true);
  };

  const handleEqual = () => {
    if (!operator || previous === null) return;
    const current = parseFloat(display);
    let result = 0;
    switch (operator) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '*': result = previous * current; break;
      case '/': result = previous / current; break;
    }
    setDisplay(result.toString());
    setPrevious(null);
    setOperator(null);
    setNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperator(null);
    setNewNumber(true);
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  return (
    <div className="w-full h-full bg-[#c0c0c0] p-2 flex flex-col gap-2 select-none font-sans">
      <div className="bg-white border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white p-2 text-right text-2xl font-mono overflow-hidden mb-2 shadow-[inset_1px_1px_0_#000]">
        {display.substring(0, 12)}
      </div>
      
      <button 
        onClick={handleClear}
        className="text-red-700 font-bold bg-[#c0c0c0] shadow-[inset_1px_1px_1px_#fff,inset_2px_2px_1px_#dfdfdf,inset_-1px_-1px_0_#000,inset_-2px_-2px_0_#808080] active:shadow-[inset_1px_1px_1px_#000,inset_2px_2px_1px_#808080,inset_-1px_-1px_0_#fff] py-1 mb-2"
      >
        CLEAR
      </button>

      <div className="flex-1 grid grid-rows-4 gap-1">
        {buttons.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-1">
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === '=') handleEqual();
                  else if (['+', '-', '*', '/'].includes(btn)) handleOp(btn);
                  else handleNum(btn);
                }}
                className="font-bold text-lg bg-[#c0c0c0] shadow-[inset_1px_1px_1px_#fff,inset_2px_2px_1px_#dfdfdf,inset_-1px_-1px_0_#000,inset_-2px_-2px_0_#808080] active:shadow-[inset_1px_1px_1px_#000,inset_2px_2px_1px_#808080,inset_-1px_-1px_0_#fff]"
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
