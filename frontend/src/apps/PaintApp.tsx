import React, { useRef, useState, useEffect } from 'react';

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  const colors = [
    '#000000', '#808080', '#ff0000', '#800000', 
    '#ffff00', '#808000', '#00ff00', '#008000', 
    '#00ffff', '#008080', '#0000ff', '#000080', 
    '#ff00ff', '#800080', '#ffffff', '#c0c0c0'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent) => {
    setIsDrawing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="w-full h-full flex bg-[#c0c0c0] font-sans text-sm select-none">
      
      {/* Sidebar Tool Palette */}
      <div className="w-16 flex flex-col p-1 border-r border-gray-400 shadow-[1px_0_0_#fff]">
        <div className="flex flex-wrap gap-1 mb-4">
          {colors.map(c => (
            <button 
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 border ${color === c ? 'border-2 border-black shadow-[inset_1px_1px_1px_#000]' : 'border-gray-500 shadow-[inset_1px_1px_0_#fff,1px_1px_0_#000]'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1 items-center bg-white border border-gray-500 shadow-[inset_1px_1px_0_#000] p-1">
          <button 
            onClick={() => setBrushSize(1)}
            className={`w-full flex justify-center py-1 ${brushSize === 1 ? 'bg-blue-200' : ''}`}
          ><div className="w-1 h-1 bg-black rounded-full" /></button>
          <button 
            onClick={() => setBrushSize(3)}
            className={`w-full flex justify-center py-1 ${brushSize === 3 ? 'bg-blue-200' : ''}`}
          ><div className="w-3 h-3 bg-black rounded-full" /></button>
          <button 
            onClick={() => setBrushSize(6)}
            className={`w-full flex justify-center py-1 ${brushSize === 6 ? 'bg-blue-200' : ''}`}
          ><div className="w-6 h-6 bg-black rounded-full" /></button>
        </div>

        <button onClick={clearCanvas} className="mt-auto nice90s-button text-xs py-1">Clear</button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-2 bg-[#808080] overflow-auto shadow-[inset_1px_1px_0_#000]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          className="bg-white shadow-[1px_1px_0_#fff]"
          style={{ cursor: 'crosshair', touchAction: 'none' }}
        />
      </div>

    </div>
  );
}
