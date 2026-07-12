import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FileSystemNode = {
  type: 'dir' | 'file' | 'drive' | 'root';
  icon?: string;
  size?: number;
  free?: number;
  content?: string;
  children?: { [key: string]: FileSystemNode };
};

export type FileSystemState = {
  root: FileSystemNode;
};

interface FileSystemContextType {
  fileSystem: FileSystemState;
  writeFile: (path: string[], fileName: string, content: string) => boolean;
  createDir: (path: string[], dirName: string) => boolean;
}

const defaultFS: FileSystemState = {
  root: {
    type: 'root',
    children: {
      '3.5 Floppy (A:)': { type: 'drive', icon: '💾', size: 1440000, free: 1440000 },
      'HARD DISK (C:)': { 
        type: 'drive', 
        icon: '💽',
        size: 2147483648,
        free: 1234567890,
        children: {
          'WINDOWS': { 
            type: 'dir', 
            icon: '📁',
            children: { 
              'SYSTEM32': { type: 'dir', icon: '📁', children: {} },
              'EXPLORER.EXE': { type: 'file', icon: '🪟', size: 124000 },
              'WIN.COM': { type: 'file', icon: '⚙️', size: 45000 }
            } 
          },
          'PROGRAM FILES': { 
            type: 'dir', 
            icon: '📁',
            children: { 
              'MACROHARD': { type: 'dir', icon: '📁', children: {} } 
            } 
          },
          'MY DOCUMENTS': { 
            type: 'dir', 
            icon: '📁',
            children: { 
              'SECRET.TXT': { type: 'file', icon: '📝', size: 55, content: 'You found the secret text file!\nMacrohard rules.' }
            } 
          },
          'GAMES': { 
            type: 'dir', 
            icon: '📁',
            children: { 
              'DOOM.EXE': { type: 'file', icon: '👾', size: 2400000 },
              'QUAKE.EXE': { type: 'file', icon: '👾', size: 4500000 }
            } 
          },
          'AUTOEXEC.BAT': { type: 'file', icon: '📄', size: 420, content: '@ECHO OFF\nCLS' },
          'CONFIG.SYS': { type: 'file', icon: '📄', size: 210, content: 'DEVICE=C:\\WINDOWS\\HIMEM.SYS' },
        }
      },
      'CD-ROM (D:)': { type: 'drive', icon: '💿', size: 700000000, free: 0 }
    }
  }
};

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [fileSystem, setFileSystem] = useState<FileSystemState>(defaultFS);

  // path is array of keys starting from drive letters or root, e.g. ['HARD DISK (C:)', 'MY DOCUMENTS']
  const traversePath = (state: FileSystemState, path: string[]) => {
    let current = state.root;
    for (const part of path) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const writeFile = (path: string[], fileName: string, content: string): boolean => {
    setFileSystem(prev => {
      const newState = JSON.parse(JSON.stringify(prev)); // Deep clone
      const targetDir = traversePath(newState, path);
      if (targetDir && (targetDir.type === 'dir' || targetDir.type === 'drive')) {
        if (!targetDir.children) targetDir.children = {};
        targetDir.children[fileName] = {
          type: 'file',
          icon: '📄',
          size: content.length,
          content: content
        };
        return newState;
      }
      return prev; // Failed
    });
    return true; // Simplified return
  };

  const createDir = (path: string[], dirName: string): boolean => {
    setFileSystem(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const targetDir = traversePath(newState, path);
      if (targetDir && (targetDir.type === 'dir' || targetDir.type === 'drive')) {
        if (!targetDir.children) targetDir.children = {};
        targetDir.children[dirName] = {
          type: 'dir',
          icon: '📁',
          children: {}
        };
        return newState;
      }
      return prev;
    });
    return true;
  };

  return (
    <FileSystemContext.Provider value={{ fileSystem, writeFile, createDir }}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}
