import React, { useState } from 'react';

export function SystemInfoApp() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="w-full h-full bg-[#c0c0c0] flex flex-col font-sans text-xs select-none">
      
      {/* Tabs */}
      <div className="flex px-2 pt-2">
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1 border-t border-l border-r border-gray-400 rounded-t-sm z-10 ${
            activeTab === 'general' ? 'bg-[#c0c0c0] border-b-[#c0c0c0]' : 'bg-[#e0e0e0] border-b-gray-400 mt-[2px]'
          }`}
          style={{ marginBottom: activeTab === 'general' ? '-1px' : '0' }}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab('hardware')}
          className={`px-3 py-1 border-t border-l border-r border-gray-400 rounded-t-sm z-10 ${
            activeTab === 'hardware' ? 'bg-[#c0c0c0] border-b-[#c0c0c0]' : 'bg-[#e0e0e0] border-b-gray-400 mt-[2px]'
          }`}
          style={{ marginBottom: activeTab === 'hardware' ? '-1px' : '0' }}
        >
          Device Manager
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 border border-gray-400 bg-[#c0c0c0] m-2 mt-0 p-4 shadow-[1px_1px_0_#fff]">
        
        {activeTab === 'general' && (
          <div className="flex gap-4">
            <div className="w-32 flex flex-col items-center">
              {/* Fake Computer Icon */}
              <div className="w-16 h-16 bg-[#008080] border-4 border-gray-600 rounded-md relative flex items-center justify-center">
                <div className="absolute top-1 w-12 h-8 bg-black rounded-sm border-2 border-white shadow-[inset_0_0_8px_rgba(255,255,255,0.5)]"></div>
                <div className="absolute bottom-1 w-8 h-2 bg-gray-400 rounded-sm"></div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <p className="font-bold mb-1">System:</p>
                <p className="ml-4">Macrohard OS 98</p>
                <p className="ml-4">Second Edition</p>
                <p className="ml-4">4.10.1998</p>
              </div>

              <div>
                <p className="font-bold mb-1">Registered to:</p>
                <p className="ml-4">Yash Singh</p>
                <p className="ml-4">LalaLands Corporation</p>
                <p className="ml-4">79321-OEM-0019982-12345</p>
              </div>

              <div>
                <p className="font-bold mb-1">Computer:</p>
                <p className="ml-4">GenuineIntel</p>
                <p className="ml-4">Pentium(r) II Processor</p>
                <p className="ml-4">64.0MB RAM</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="w-full h-full bg-white border border-gray-500 shadow-[inset_1px_1px_0_#000] p-2 overflow-auto">
            <ul className="pl-4">
              <li className="flex items-center gap-2 mb-1">💻 <span>Computer</span></li>
              <ul className="pl-6 border-l border-dotted border-gray-400 ml-[9px]">
                <li className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400">-</span> 💿 <span>CDROM</span>
                </li>
                <li className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400">-</span> 💽 <span>Disk drives</span>
                  <ul className="pl-6 border-l border-dotted border-gray-400 ml-[9px]">
                    <li className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400">-</span> 💾 <span>GENERIC IDE DISK TYPE47</span>
                    </li>
                  </ul>
                </li>
                <li className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400">-</span> 📺 <span>Display adapters</span>
                </li>
                <li className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400">-</span> ⌨️ <span>Keyboard</span>
                </li>
                <li className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400">-</span> 🖱️ <span>Mouse</span>
                </li>
                <li className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400">-</span> 🔊 <span>Sound, video and game controllers</span>
                </li>
              </ul>
            </ul>
          </div>
        )}

      </div>

      <div className="flex justify-end gap-2 px-2 pb-2">
        <button className="nice90s-button px-6 py-1 min-w-[80px]">OK</button>
        <button className="nice90s-button px-6 py-1 min-w-[80px]">Cancel</button>
      </div>

    </div>
  );
}
