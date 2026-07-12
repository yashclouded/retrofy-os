import React from 'react';

export function RecycleBinApp() {
  return (
    <div className="w-full h-full bg-white flex flex-col font-sans text-sm select-none">
      
      {/* Menu Bar */}
      <div className="flex gap-4 p-1 border-b border-gray-300 bg-[#c0c0c0] text-black">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">View</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-400 bg-[#c0c0c0]">
        <span className="ml-2 font-bold text-black border border-gray-400 bg-white px-2 py-[2px] flex-1">
          Recycle Bin
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 bg-white flex flex-col items-center justify-center text-gray-500 gap-4">
        <span className="text-6xl grayscale opacity-50">🗑️</span>
        <span className="font-bold text-lg">Recycle Bin is empty.</span>
      </div>
      
      <div className="border-t border-gray-400 bg-[#c0c0c0] px-2 py-[2px] text-xs text-gray-700 shadow-[inset_0_1px_0_#fff]">
        0 object(s)
      </div>

    </div>
  );
}
