import React, { useState } from 'react';

export function BrowserApp() {
  const [url, setUrl] = useState('http://www.geocities.com/retrofy');
  const [loading, setLoading] = useState(false);

  const handleGo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#c0c0c0] font-sans select-none text-sm">
      {/* Browser Menu */}
      <div className="flex gap-4 p-1 border-b border-gray-300">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">View</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Favorites</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-400">
        <div className="flex gap-1">
          <button className="nice90s-button px-2 py-1 flex flex-col items-center disabled:opacity-50" disabled>
            <span className="text-lg">⬅</span>
            <span className="text-[10px]">Back</span>
          </button>
          <button className="nice90s-button px-2 py-1 flex flex-col items-center disabled:opacity-50" disabled>
            <span className="text-lg">➡</span>
            <span className="text-[10px]">Forward</span>
          </button>
          <button className="nice90s-button px-2 py-1 flex flex-col items-center" onClick={() => handleGo()}>
            <span className="text-lg">✖</span>
            <span className="text-[10px]">Stop</span>
          </button>
          <button className="nice90s-button px-2 py-1 flex flex-col items-center" onClick={() => handleGo()}>
            <span className="text-lg">⟳</span>
            <span className="text-[10px]">Refresh</span>
          </button>
          <button className="nice90s-button px-2 py-1 flex flex-col items-center" onClick={() => setUrl('http://www.geocities.com/retrofy')}>
            <span className="text-lg">🏠</span>
            <span className="text-[10px]">Home</span>
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleGo} className="flex items-center gap-2 p-1 border-b border-gray-400">
        <span className="text-gray-700 font-bold px-1">Address</span>
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border border-gray-500 shadow-[inset_1px_1px_0_#000] px-1 py-[2px] font-mono text-sm bg-white outline-none"
        />
        <button type="submit" className="nice90s-button px-4 font-bold">Go</button>
      </form>

      {/* Page Content */}
      <div className="flex-1 bg-white overflow-auto shadow-[inset_1px_1px_0_#000] relative">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="animate-spin text-4xl mb-4">⌛</span>
            <span className="font-mono">Dialing modem...</span>
          </div>
        ) : (
          <div className="w-full min-h-full flex flex-col items-center py-8 px-4 text-center" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#ffffcc' }}>
            
            <h1 className="text-red-600 text-4xl font-black italic underline drop-shadow-md mb-8 blink">
              WELCOME TO MY HOMEPAGE
            </h1>
            
            <div className="bg-blue-600 text-yellow-300 font-mono text-xl p-4 border-[6px] border-dashed border-red-500 mb-8 max-w-lg shadow-[8px_8px_0_#000]">
              <p>Hi! I am building a retro OS in my browser.</p>
              <br/>
              <p>Please sign my Guestbook!</p>
            </div>

            <div className="flex items-center justify-center gap-4 border-4 border-outset border-gray-400 p-2 bg-[#c0c0c0]">
              <span className="text-4xl">🚧</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-black bg-yellow-400 px-2">UNDER CONSTRUCTION</span>
                <span className="text-xs">Created with Macrohard FrontPage</span>
              </div>
              <span className="text-4xl">🚧</span>
            </div>

            <div className="mt-8 flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Netscape_icon.svg" className="w-12 h-12 grayscale opacity-50 blur-[1px]" alt="Best Viewed in Netscape" />
            </div>

          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center px-2 py-[2px] border-t border-gray-400 bg-[#c0c0c0] text-[10px] text-gray-700 shadow-[inset_0_1px_0_#fff]">
        <span>{loading ? 'Connecting...' : 'Done'}</span>
        <div className="flex items-center gap-4">
          <span className="w-[2px] h-3 bg-gray-500"></span>
          <span>Internet Zone</span>
        </div>
      </div>
    </div>
  );
}
