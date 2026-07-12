import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../components/os/FileSystemContext';

export function MyComputerApp() {
  const { fileSystem } = useFileSystem();
  const [path, setPath] = useState<string[]>(['My Computer']);
  const [addressInput, setAddressInput] = useState('My Computer');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    let pathStr = path[0];
    if (path.length > 1) {
      pathStr = path.slice(1).join('\\');
      if (pathStr.endsWith(':')) pathStr += '\\';
    }
    setAddressInput(pathStr);
    setSelectedItem(null);
  }, [path]);

  const getCurrentDir = () => {
    let currentDir = fileSystem.root;
    for (let i = 1; i < path.length; i++) {
      if (path[i] === 'C:') {
        currentDir = currentDir.children?.['HARD DISK (C:)'] as any;
      } else if (path[i] === 'A:') {
        currentDir = currentDir.children?.['3.5 Floppy (A:)'] as any;
      } else if (path[i] === 'D:') {
        currentDir = currentDir.children?.['CD-ROM (D:)'] as any;
      } else {
        currentDir = currentDir.children?.[path[i]] as any;
      }
      if (!currentDir) return null;
    }
    return currentDir;
  };

  const currentDir = getCurrentDir();
  const items = currentDir?.children ? Object.entries(currentDir.children) : [];

  const handleUpClick = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  const handleItemDoubleClick = (name: string, data: any) => {
    if (data.type === 'drive') {
      if (name.includes('A:')) setPath(['My Computer', 'A:']);
      else if (name.includes('C:')) setPath(['My Computer', 'C:']);
      else if (name.includes('D:')) setPath(['My Computer', 'D:']);
    } else if (data.type === 'dir') {
      setPath([...path, name]);
    } else if (data.type === 'file') {
      alert(`Cannot open ${name}. No associated program.`);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = addressInput.trim().toUpperCase();
    
    if (input === 'MY COMPUTER') {
      setPath(['My Computer']);
      return;
    }

    if (input.startsWith('C:') || input.startsWith('C:\\')) {
      const parts = input.replace(/^C:\\?/, '').split('\\').filter(Boolean);
      let testDir = fileSystem.root.children?.['HARD DISK (C:)'];
      let valid = !!testDir;
      for (const part of parts) {
        if (testDir?.children && testDir.children[part] && testDir.children[part].type === 'dir') {
          testDir = testDir.children[part];
        } else {
          valid = false;
          break;
        }
      }

      if (valid) {
        setPath(['My Computer', 'C:', ...parts]);
      } else {
        alert('Cannot find path. Check spelling and try again.');
        setPath([...path]); 
      }
    } else {
      alert('Cannot find path. Check spelling and try again.');
      setPath([...path]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' bytes';
  };

  let statusText = `${items.length} object(s)`;
  if (selectedItem && currentDir?.children) {
    const item = currentDir.children[selectedItem];
    if (item.type === 'file') {
      statusText = `1 object(s) selected (${formatSize(item.size || 0)})`;
    } else if (item.type === 'drive') {
      statusText = `Free Space: ${formatSize(item.free || 0)}, Total Size: ${formatSize(item.size || 0)}`;
    } else {
      statusText = `1 object(s) selected`;
    }
  }

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans text-sm select-none" onClick={() => setSelectedItem(null)}>
      
      {/* Menu Bar */}
      <div className="flex gap-4 p-1 border-b border-gray-300 bg-[#c0c0c0] text-black">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">View</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-400 bg-[#c0c0c0]">
        <div className="flex gap-1">
          <button 
            className="nice90s-button px-2 py-1 flex flex-col items-center disabled:opacity-50"
            onClick={handleUpClick}
            disabled={path.length === 1}
          >
            <span className="text-lg">📁</span>
            <span className="text-[10px]">Up</span>
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleAddressSubmit} className="flex items-center gap-2 p-1 border-b border-gray-400 bg-[#c0c0c0]">
        <span className="text-gray-700 font-bold px-1">Address</span>
        <input 
          type="text" 
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="flex-1 border border-gray-500 shadow-[inset_1px_1px_0_#000] px-1 py-[2px] font-sans text-sm bg-white outline-none text-black"
        />
        <button type="submit" className="nice90s-button px-4">Go</button>
      </form>

      {/* Content */}
      <div className="flex-1 p-4 bg-white flex flex-wrap gap-8 items-start content-start overflow-auto">
        {items.map(([name, data]: [string, any]) => (
          <div 
            key={name}
            className="flex flex-col items-center gap-1 cursor-pointer w-24"
            onClick={(e) => { e.stopPropagation(); setSelectedItem(name); }}
            onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(name, data); }}
          >
            <div className={`text-4xl drop-shadow-sm ${selectedItem === name ? 'opacity-70' : ''}`}>
              {data.icon || (data.type === 'dir' ? '📁' : '📄')}
            </div>
            <span className={`text-center px-1 break-words w-full ${selectedItem === name ? 'bg-[#000080] text-white border border-dotted border-white' : 'text-black border border-transparent'}`}>
              {name}
            </span>
          </div>
        ))}

        {items.length === 0 && (
          <div className="w-full text-center text-gray-500 mt-8">
            This folder is empty.
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center px-2 py-[2px] border-t border-gray-400 bg-[#c0c0c0] text-xs text-gray-700 shadow-[inset_0_1px_0_#fff]">
        <span>{statusText}</span>
        <div className="flex items-center gap-4">
          <span className="w-[2px] h-3 bg-gray-500"></span>
          <span>My Computer</span>
        </div>
      </div>

    </div>
  );
}
