import React, { useState } from 'react';
import { useFileSystem } from '../components/os/FileSystemContext';

export function NotepadApp() {
  const [text, setText] = useState('');
  const { writeFile } = useFileSystem();

  const handleSave = () => {
    const filename = prompt('Enter filename (e.g. NOTES.TXT):', 'NOTES.TXT');
    if (filename) {
      const success = writeFile(['HARD DISK (C:)', 'MY DOCUMENTS'], filename.toUpperCase(), text);
      if (success) {
        alert(`Saved ${filename} to C:\\MY DOCUMENTS\\`);
      } else {
        alert(`Failed to save file.`);
      }
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans text-sm">
      {/* Menu Bar */}
      <div className="flex gap-4 p-1 border-b border-gray-300 bg-[#c0c0c0] text-black select-none">
        <div className="relative group cursor-default">
          <span className="hover:bg-[#000080] hover:text-white px-1">File</span>
          {/* Dropdown would go here if fully implemented */}
          <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black border-2 shadow-[1px_1px_0_#808080] z-50 min-w-[120px] py-1 text-black">
            <button className="text-left px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => setText('')}>New</button>
            <button className="text-left px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={handleSave}>Save</button>
          </div>
        </div>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Search</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>
      
      {/* Text Area */}
      <textarea 
        className="flex-1 w-full p-1 border-none outline-none resize-none font-mono text-sm shadow-[inset_1px_1px_0_#000]"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
