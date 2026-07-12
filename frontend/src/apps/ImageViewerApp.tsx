import React from 'react';

export function ImageViewerApp() {
  return (
    <div className="w-full h-full bg-[#c0c0c0] flex flex-col font-sans text-sm select-none">
      
      {/* Menu Bar */}
      <div className="flex gap-4 p-1 border-b border-gray-300 bg-[#c0c0c0] text-black">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">View</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      {/* Content */}
      <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto shadow-[inset_1px_1px_0_#000]">
        
        {/* Fake 8-bit image */}
        <div className="w-64 h-64 border-4 border-gray-600 bg-white grid grid-cols-4 grid-rows-4 relative shadow-lg">
          <div className="bg-red-500"></div><div className="bg-white"></div><div className="bg-blue-500"></div><div className="bg-yellow-400"></div>
          <div className="bg-yellow-400"></div><div className="bg-red-500"></div><div className="bg-white"></div><div className="bg-blue-500"></div>
          <div className="bg-blue-500"></div><div className="bg-yellow-400"></div><div className="bg-red-500"></div><div className="bg-white"></div>
          <div className="bg-white"></div><div className="bg-blue-500"></div><div className="bg-yellow-400"></div><div className="bg-red-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-white text-6xl font-black drop-shadow-[2px_2px_0_#000]">98</span>
          </div>
        </div>

      </div>

    </div>
  );
}
