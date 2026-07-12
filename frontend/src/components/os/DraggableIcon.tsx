import React, { useState, useRef } from 'react';

interface DraggableIconProps {
  id: string;
  icon: string;
  label: string;
  initialX: number;
  initialY: number;
  onDoubleClick: () => void;
}

export function DraggableIcon({ id, icon, label, initialX, initialY, onDoubleClick }: DraggableIconProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: position.x, y: position.y };
    dragStartMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartMousePos.current.x;
    const dy = e.clientY - dragStartMousePos.current.y;
    
    // Snap to rough grid (optional, but gives that 90s feel)
    const newX = Math.max(0, dragStartPos.current.x + dx);
    const newY = Math.max(0, dragStartPos.current.y + dy);

    setPosition({
      x: Math.round(newX / 20) * 20,
      y: Math.round(newY / 20) * 20
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="absolute flex flex-col items-center gap-1 cursor-pointer group w-20 z-0"
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={onDoubleClick}
    >
      <div className="text-4xl drop-shadow-md group-active:brightness-75 pointer-events-none">{icon}</div>
      <span className="text-white text-xs px-1 text-center bg-transparent group-active:bg-[#000080] group-active:text-white drop-shadow-[1px_1px_1px_#000] pointer-events-none">
        {label}
      </span>
    </div>
  );
}
