import React, { useState } from 'react';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { DraggableIcon } from './DraggableIcon';
import { FileSystemProvider } from './FileSystemContext';

import { RetrofyApp } from '@/apps/RetrofyApp';
import { NotepadApp } from '@/apps/NotepadApp';
import { SnakeApp } from '@/apps/SnakeApp';
import { TicTacToeApp } from '@/apps/TicTacToeApp';
import { SettingsApp } from '@/apps/SettingsApp';
import { TerminalApp } from '@/apps/TerminalApp';
import { MyComputerApp } from '@/apps/MyComputerApp';
import { PaintApp } from '@/apps/PaintApp';
import { BrowserApp } from '@/apps/BrowserApp';
import { SystemInfoApp } from '@/apps/SystemInfoApp';
import { MinesweeperApp } from '@/apps/MinesweeperApp';
import { RecycleBinApp } from '@/apps/RecycleBinApp';
import { ImageViewerApp } from '@/apps/ImageViewerApp';
import { CalculatorApp } from '@/apps/CalculatorApp';

interface WindowState {
  id: string;
  title: string;
  component: React.ReactNode;
  isFocused: boolean;
  isMinimized: boolean;
  width?: number;
  height?: number;
}

export function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [bgColor, setBgColor] = useState('#008080'); // Classic Teal
  const [showLogo, setShowLogo] = useState(true);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const openApp = (id: string, title: string, component: React.ReactNode, width?: number, height?: number) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => ({
          ...w,
          isFocused: w.id === id,
          isMinimized: w.id === id ? false : w.isMinimized
        }));
      }
      return [
        ...prev.map(w => ({ ...w, isFocused: false })),
        { id, title, component, isFocused: true, isMinimized: false, width, height }
      ];
    });
  };

  const handleAppLaunch = (id: string) => {
    setContextMenu(null);
    switch(id) {
      case 'retrofy': openApp('retrofy', 'Retrofy Audio System', <RetrofyApp />, 800, 750); break;
      case 'notepad': openApp('notepad', 'Notepad', <NotepadApp />, 600, 400); break;
      case 'snake': openApp('snake', 'Snake.exe', <SnakeApp />, 430, 520); break;
      case 'tictactoe': openApp('tictactoe', 'Tic-Tac-Toe', <TicTacToeApp />, 350, 420); break;
      case 'terminal': openApp('terminal', 'MS-DOS Prompt', <TerminalApp />, 640, 400); break;
      case 'mycomputer': openApp('mycomputer', 'My Computer', <MyComputerApp />, 500, 400); break;
      case 'paint': openApp('paint', 'RetroPaint', <PaintApp />, 700, 500); break;
      case 'browser': openApp('browser', 'Internet Explorer', <BrowserApp />, 800, 600); break;
      case 'systeminfo': openApp('systeminfo', 'System Properties', <SystemInfoApp />, 450, 450); break;
      case 'minesweeper': openApp('minesweeper', 'Minesweeper', <MinesweeperApp />, 300, 360); break;
      case 'recyclebin': openApp('recyclebin', 'Recycle Bin', <RecycleBinApp />, 500, 400); break;
      case 'imageviewer': openApp('imageviewer', 'Image Viewer', <ImageViewerApp />, 400, 400); break;
      case 'calculator': openApp('calculator', 'Calculator', <CalculatorApp />, 250, 350); break;
      case 'settings':
        openApp('settings', 'Control Panel', <SettingsApp 
          bgColor={bgColor} setBgColor={setBgColor} 
          showLogo={showLogo} setShowLogo={setShowLogo} 
        />, 350, 400);
        break;
    }
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true, isFocused: false } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => ({
      ...w,
      isFocused: w.id === id,
      isMinimized: w.id === id ? false : w.isMinimized
    })));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only show if clicking directly on the desktop background
    if (e.target === e.currentTarget) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const closeContextMenu = () => {
    if (contextMenu) setContextMenu(null);
  };

  return (
    <FileSystemProvider>
      <div 
        className="w-full h-screen flex flex-col overflow-hidden select-none"
        style={{ backgroundColor: bgColor }}
        onContextMenu={handleContextMenu}
        onClick={closeContextMenu}
      >
        
        {/* Desktop Area */}
        <div className="flex-1 relative p-4 h-[calc(100vh-28px)] z-10" onContextMenu={handleContextMenu}>
          
          {/* Draggable Desktop Icons */}
          <DraggableIcon id="mycomputer" icon="💻" label="My Computer" initialX={20} initialY={20} onDoubleClick={() => handleAppLaunch('mycomputer')} />
          <DraggableIcon id="recyclebin" icon="🗑️" label="Recycle Bin" initialX={20} initialY={100} onDoubleClick={() => handleAppLaunch('recyclebin')} />
          <DraggableIcon id="browser" icon="🌐" label="Internet" initialX={20} initialY={180} onDoubleClick={() => handleAppLaunch('browser')} />
          <DraggableIcon id="retrofy" icon="★" label="Retrofy" initialX={20} initialY={260} onDoubleClick={() => handleAppLaunch('retrofy')} />
          <DraggableIcon id="paint" icon="🎨" label="RetroPaint" initialX={20} initialY={340} onDoubleClick={() => handleAppLaunch('paint')} />
          <DraggableIcon id="terminal" icon="⌨️" label="MS-DOS" initialX={20} initialY={420} onDoubleClick={() => handleAppLaunch('terminal')} />
          <DraggableIcon id="settings" icon="🔧" label="Settings" initialX={20} initialY={500} onDoubleClick={() => handleAppLaunch('settings')} />

          {/* Render Windows */}
          {windows.map(win => (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              isFocused={win.isFocused}
              isMinimized={win.isMinimized}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              width={win.width}
              height={win.height}
            >
              {win.component}
            </Window>
          ))}

          {/* Context Menu */}
          {contextMenu && (
            <div 
              className="absolute bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 flex flex-col shadow-[1px_1px_0_#808080] py-1 z-[999] text-sm w-48 text-black"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              <button className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => window.location.reload()}>Refresh</button>
              <div className="h-[2px] bg-white border-t border-gray-500 mx-1 my-1"></div>
              <button className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => handleAppLaunch('notepad')}>New Text Document</button>
              <div className="h-[2px] bg-white border-t border-gray-500 mx-1 my-1"></div>
              <button className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => handleAppLaunch('settings')}>Properties</button>
            </div>
          )}

        </div>

        {/* Macrohard Background Logo */}
        {showLogo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-80">
            <div className="grid grid-cols-2 gap-2 w-48 h-48 transform -skew-y-6 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
              <div className="bg-[#ff0000] border-2 border-black rounded-tl-3xl"></div>
              <div className="bg-[#00ff00] border-2 border-black rounded-tr-3xl"></div>
              <div className="bg-[#0000ff] border-2 border-black rounded-bl-3xl"></div>
              <div className="bg-[#ffff00] border-2 border-black rounded-br-3xl"></div>
            </div>
            <h1 className="text-white text-6xl font-black mt-8 tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] italic">
              Macrohard
            </h1>
          </div>
        )}

        {/* Taskbar */}
        <Taskbar 
          openWindows={windows}
          onWindowClick={(id) => focusWindow(id)}
          onOpenApp={(id) => handleAppLaunch(id)}
        />

      </div>
    </FileSystemProvider>
  );
}
