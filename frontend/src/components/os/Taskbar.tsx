import React, { useState, useEffect, useRef } from 'react';

interface TaskbarProps {
  openWindows: { id: string; title: string; isFocused: boolean; isMinimized: boolean }[];
  onWindowClick: (id: string) => void;
  onOpenApp: (id: string) => void;
}

export function Taskbar({ openWindows, onWindowClick, onOpenApp }: TaskbarProps) {
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setStartOpen(false);
        setActiveMenu(null);
      }
    };
    if (startOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startOpen]);

  const handleAppLaunch = (id: string) => {
    onOpenApp(id);
    setStartOpen(false);
    setActiveMenu(null);
  };

  const getAppIcon = (id: string) => {
    switch (id) {
      case 'retrofy': return '★';
      case 'notepad': return '📝';
      case 'snake': return '🐍';
      case 'tictactoe': return '✖️';
      case 'calculator': return '🖩';
      case 'terminal': return '⌨️';
      case 'mycomputer': return '💻';
      case 'paint': return '🎨';
      case 'browser': return '🌐';
      case 'systeminfo': return '⚙️';
      case 'minesweeper': return '💣';
      case 'recyclebin': return '🗑️';
      case 'imageviewer': return '🖼️';
      case 'settings': return '🔧';
      default: return '📄';
    }
  };

  return (
    <div className="h-7 bg-[#c0c0c0] w-full border-t-white border-t-[1px] shadow-[0_-1px_0_#dfdfdf,inset_0_1px_0_#fff] flex items-center justify-between px-1 z-50 relative select-none">
      
      {/* Start Menu Popup */}
      {startOpen && (
        <div 
          ref={startMenuRef}
          className="absolute bottom-full left-0 mb-[1px] w-64 bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 flex flex-col shadow-[1px_1px_0_#808080]"
        >
          {/* Vertical Banner */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center pb-2">
            <span className="text-white font-bold tracking-widest text-sm" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Macrohard OS 98
            </span>
          </div>

          <div className="ml-8 py-[2px] flex flex-col bg-[#c0c0c0]">
            
            {/* Programs Menu Item */}
            <div 
              className={`relative flex items-center justify-between px-4 py-2 hover:bg-[#000080] hover:text-white text-sm cursor-default ${activeMenu === 'programs' ? 'bg-[#000080] text-white' : ''}`}
              onMouseEnter={() => setActiveMenu('programs')}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl drop-shadow-md">📁</span> <span className="font-medium">Programs</span>
              </div>
              <span>▶</span>

              {/* Submenu */}
              {activeMenu === 'programs' && (
                <div className="absolute left-full bottom-[-2px] w-48 bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border-2 flex flex-col shadow-[1px_1px_0_#808080] py-1 z-10">
                  <button onClick={() => handleAppLaunch('retrofy')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">★</span> Retrofy System</button>
                  <button onClick={() => handleAppLaunch('browser')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">🌐</span> Internet Explorer</button>
                  <button onClick={() => handleAppLaunch('mycomputer')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">💻</span> My Computer</button>
                  <div className="h-[2px] bg-white border-t border-gray-500 mx-1 my-1"></div>
                  <button onClick={() => handleAppLaunch('notepad')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">📝</span> Notepad</button>
                  <button onClick={() => handleAppLaunch('paint')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">🎨</span> RetroPaint</button>
                  <button onClick={() => handleAppLaunch('calculator')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">🖩</span> Calculator</button>
                  <button onClick={() => handleAppLaunch('terminal')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">⌨️</span> MS-DOS Prompt</button>
                  <button onClick={() => handleAppLaunch('imageviewer')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">🖼️</span> Image Viewer</button>
                </div>
              )}
            </div>

            {/* Games Menu Item */}
            <div 
              className={`relative flex items-center justify-between px-4 py-2 hover:bg-[#000080] hover:text-white text-sm cursor-default ${activeMenu === 'games' ? 'bg-[#000080] text-white' : ''}`}
              onMouseEnter={() => setActiveMenu('games')}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl drop-shadow-md">🎮</span> <span className="font-medium">Games</span>
              </div>
              <span>▶</span>

              {/* Submenu */}
              {activeMenu === 'games' && (
                <div className="absolute left-full bottom-[-2px] w-48 bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border-2 flex flex-col shadow-[1px_1px_0_#808080] py-1 z-10">
                  <button onClick={() => handleAppLaunch('minesweeper')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">💣</span> Minesweeper</button>
                  <button onClick={() => handleAppLaunch('snake')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">🐍</span> Snake</button>
                  <button onClick={() => handleAppLaunch('tictactoe')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">✖️</span> Tic-Tac-Toe</button>
                </div>
              )}
            </div>

            {/* Settings Menu Item */}
            <div 
              className={`relative flex items-center justify-between px-4 py-2 hover:bg-[#000080] hover:text-white text-sm cursor-default ${activeMenu === 'settings' ? 'bg-[#000080] text-white' : ''}`}
              onMouseEnter={() => setActiveMenu('settings')}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl drop-shadow-md">⚙️</span> <span className="font-medium">Settings</span>
              </div>
              <span>▶</span>

              {/* Submenu */}
              {activeMenu === 'settings' && (
                <div className="absolute left-full bottom-[-2px] w-48 bg-[#c0c0c0] text-black border-t-white border-l-white border-b-black border-r-black border-2 flex flex-col shadow-[1px_1px_0_#808080] py-1 z-10">
                  <button onClick={() => handleAppLaunch('settings')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">🔧</span> Control Panel</button>
                  <button onClick={() => handleAppLaunch('systeminfo')} className="flex items-center gap-3 px-4 py-1 hover:bg-[#000080] hover:text-white"><span className="text-lg">💻</span> System Properties</button>
                </div>
              )}
            </div>
            
            <div className="h-[2px] bg-white border-t border-gray-500 mx-1 my-1"></div>
            
            <button onMouseEnter={() => setActiveMenu(null)} onClick={() => window.location.reload()} className="flex items-center gap-3 px-4 py-2 hover:bg-[#000080] hover:text-white text-sm">
              <span className="text-2xl drop-shadow-md">⏻</span> <span className="font-medium">Shut Down...</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center h-full gap-1">
        {/* Start Button */}
        <button 
          onClick={() => setStartOpen(!startOpen)}
          className={`flex items-center gap-1 h-[22px] px-1 font-bold text-xs ${
            startOpen 
            ? 'bg-[#c0c0c0] shadow-[inset_1px_1px_1px_#000,inset_2px_2px_1px_#808080,inset_-1px_-1px_0_#fff]' 
            : 'bg-[#c0c0c0] shadow-[inset_1px_1px_1px_#fff,inset_2px_2px_1px_#dfdfdf,inset_-1px_-1px_0_#000,inset_-2px_-2px_0_#808080]'
          } active:shadow-[inset_1px_1px_1px_#000,inset_2px_2px_1px_#808080,inset_-1px_-1px_0_#fff]`}
        >
          <div className="grid grid-cols-2 gap-[1px] w-3 h-3 ml-1 transform skew-x-[-10deg]">
            <div className="bg-[#ff0000]"></div>
            <div className="bg-[#00ff00]"></div>
            <div className="bg-[#0000ff]"></div>
            <div className="bg-[#ffff00]"></div>
          </div>
          <span className="ml-1 mr-1">Start</span>
        </button>

        {/* Separator */}
        <div className="w-[2px] h-5 bg-white border-l border-gray-500 mx-1"></div>

        {/* Open Windows Tabs */}
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onWindowClick(win.id)}
            className={`flex items-center gap-1 h-[22px] px-2 min-w-[120px] max-w-[150px] text-xs font-bold truncate ${
              win.isFocused && !win.isMinimized
                ? 'bg-[#c0c0c0] shadow-[inset_1px_1px_1px_#000,inset_2px_2px_1px_#808080,inset_-1px_-1px_0_#fff]' 
                : 'bg-[#c0c0c0] shadow-[inset_1px_1px_1px_#fff,inset_2px_2px_1px_#dfdfdf,inset_-1px_-1px_0_#000,inset_-2px_-2px_0_#808080]'
            } active:shadow-[inset_1px_1px_1px_#000,inset_2px_2px_1px_#808080,inset_-1px_-1px_0_#fff]`}
          >
            <span className="text-sm">{getAppIcon(win.id)}</span> 
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center h-[22px] px-2 shadow-[inset_1px_1px_1px_#808080,inset_-1px_-1px_0_#fff] text-xs">
        <span className="mr-2 text-sm">🔊</span>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
