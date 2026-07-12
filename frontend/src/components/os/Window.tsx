import React, { useState, useRef, useEffect } from 'react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isFocused: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
}

export function Window({
  title,
  children,
  isFocused,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  initialX = 100,
  initialY = 50,
  width = 800,
  height = 600,
}: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    onFocus();
    if (isMaximized) return; // Can't drag if maximized
    setIsDragging(true);
    dragStartPos.current = { x: position.x, y: position.y };
    dragStartMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartMousePos.current.x;
    const dy = e.clientY - dragStartMousePos.current.y;
    setPosition({
      x: dragStartPos.current.x + dx,
      y: Math.max(0, dragStartPos.current.y + dy), // Prevent dragging above screen
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (isMinimized) return null;

  const style: React.CSSProperties = isMaximized ? {
    left: 0,
    top: 0,
    width: '100%',
    height: 'calc(100vh - 28px)', // 28px is taskbar height
    zIndex: isFocused ? 100 : 10,
  } : {
    left: position.x,
    top: position.y,
    width,
    height,
    zIndex: isFocused ? 100 : 10,
  };

  return (
    <div
      className={`absolute nice90s-window flex flex-col bg-[#c0c0c0] shadow-[inset_1px_1px_0px_white,inset_-1px_-1px_0px_#000,1px_1px_0px_#000] p-[2px] ${isMaximized ? 'transition-all duration-150 ease-in-out' : ''}`}
      style={style}
      onPointerDown={onFocus}
    >
      {/* Title Bar (Draggable handle) */}
      <div 
        className={`flex items-center justify-between px-1 py-[2px] cursor-default shrink-0 ${isFocused ? 'bg-[#000080] text-white' : 'bg-[#808080] text-[#c0c0c0]'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-2 font-bold text-sm tracking-wide select-none">
          <span>★</span>
          <span>{title}</span>
        </div>
        <div className="flex gap-[2px]">
          <button 
            className="w-4 h-4 bg-[#c0c0c0] border border-b-black border-r-black border-t-white border-l-white flex items-center justify-center text-black font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-[10px]"
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            _
          </button>
          <button 
            className="w-4 h-4 bg-[#c0c0c0] border border-b-black border-r-black border-t-white border-l-white flex items-center justify-center text-black font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-[10px]"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isMaximized ? '🗗' : '🗖'}
          </button>
          <button 
            className="w-4 h-4 bg-[#c0c0c0] border border-b-black border-r-black border-t-white border-l-white flex items-center justify-center text-black font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-[10px]"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            X
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden mt-[2px] bg-white border border-b-white border-r-white border-t-gray-500 border-l-gray-500">
        {children}
      </div>
    </div>
  );
}
