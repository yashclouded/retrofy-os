import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../components/os/FileSystemContext';

export function TerminalApp() {
  const { fileSystem, writeFile, createDir } = useFileSystem();
  
  const [history, setHistory] = useState<string[]>(['Macrohard(R) OS 98', '(C) Copyright Macrohard Corp 1981-1998.', '']);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState(['HARD DISK (C:)']);
  const [textColor, setTextColor] = useState('#c0c0c0');
  const [bgColor, setBgColor] = useState('#000000');
  
  const endRef = useRef<HTMLDivElement>(null);

  // Helper to format path for display: 'C:\WINDOWS'
  const displayPath = (pathArr: string[]) => {
    return pathArr.map(p => {
      if (p.includes('(C:)')) return 'C:';
      if (p.includes('(A:)')) return 'A:';
      if (p.includes('(D:)')) return 'D:';
      return p;
    }).join('\\');
  };

  const resolvePath = (pathArg: string): string[] | null => {
    if (pathArg === '\\' || pathArg === '/') return ['HARD DISK (C:)'];
    
    let tempPath = [...currentPath];
    const parts = pathArg.split(/[/\\]/);
    
    for (const part of parts) {
      if (part === '.' || part === '') continue;
      if (part === '..') {
        if (tempPath.length > 1) tempPath.pop();
        continue;
      }
      
      let currentDir = fileSystem.root;
      for (let i = 0; i < tempPath.length; i++) {
        currentDir = currentDir.children![tempPath[i]];
      }
      
      const upperPart = part.toUpperCase();
      let matchedKey = null;

      // Handle direct name or drive letter mappings
      if (currentDir.children) {
        for (const key of Object.keys(currentDir.children)) {
          if (key.toUpperCase() === upperPart || 
              (upperPart === 'C:' && key.includes('(C:)')) ||
              (upperPart === 'A:' && key.includes('(A:)')) ||
              (upperPart === 'D:' && key.includes('(D:)'))) {
            matchedKey = key;
            break;
          }
        }
      }

      if (matchedKey && currentDir.children![matchedKey].type !== 'file') {
        tempPath.push(matchedKey);
      } else {
        return null; // Path not found or is a file
      }
    }
    return tempPath;
  };

  const getDirNode = (pathArray: string[]) => {
    let currentDir = fileSystem.root;
    for (let i = 0; i < pathArray.length; i++) {
      currentDir = currentDir.children![pathArray[i]];
    }
    return currentDir;
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, `${displayPath(currentPath)}\\>`]);
      return;
    }

    const args = trimmed.split(' ').filter(Boolean);
    const command = args[0].toLowerCase();
    let output: string | string[] = '';

    switch (command) {
      case 'help':
        output = [
          'Available commands:',
          '  CD <dir>       - Change directory',
          '  DIR            - List directory contents',
          '  TYPE <file>    - Display text file content',
          '  ECHO <text>    - Print text to screen',
          '  MKDIR <dir>    - Create a directory',
          '  CLS            - Clear the screen',
          '  TIME           - Display current time',
          '  DATE           - Display current date',
          '  PING <host>    - Ping a network host',
          '  WHOAMI         - Display current user',
          '  COLOR <hex>    - Change text color (e.g., COLOR #00ff00)',
          '  VER            - Display OS version',
          '  EXIT           - Exit terminal'
        ];
        break;

      case 'dir':
        const node = getDirNode(currentPath);
        const contents = node.children;
        const lines = [
          ` Volume in drive ${displayPath([currentPath[0]])} has no label.`,
          ` Volume Serial Number is 1A2B-3C4D`,
          ``,
          ` Directory of ${displayPath(currentPath)}\\`,
          ``
        ];
        
        let fileCount = 0;
        let dirCount = 0;
        let totalSize = 0;

        lines.push(`07/11/1998  10:00 AM    <DIR>          .`);
        lines.push(`07/11/1998  10:00 AM    <DIR>          ..`);
        dirCount += 2;

        if (contents) {
          for (const [name, data] of Object.entries<any>(contents)) {
            const isDir = data.type === 'dir' || data.type === 'drive';
            if (isDir) dirCount++; else { fileCount++; totalSize += data.size || 0; }
            
            const sizeStr = isDir ? '<DIR>' : (data.size || 0).toString();
            // Simplify drive names in DIR output if at root
            const displayName = currentPath.length === 0 ? name : name;
            lines.push(`07/11/1998  10:00 AM    ${sizeStr.padEnd(14, ' ')} ${displayName}`);
          }
        }
        
        lines.push(`               ${fileCount} File(s)     ${totalSize.toLocaleString()} bytes`);
        lines.push(`               ${dirCount} Dir(s)   1,234,567,890 bytes free`);
        output = lines;
        break;

      case 'cd':
        if (args.length < 2) {
          output = displayPath(currentPath) + '\\';
        } else {
          const newPath = resolvePath(args[1]);
          if (newPath) {
            setCurrentPath(newPath);
            output = ''; 
          } else {
            output = 'The system cannot find the path specified.';
          }
        }
        break;

      case 'mkdir':
      case 'md':
        if (args.length < 2) {
          output = 'The syntax of the command is incorrect.';
        } else {
          createDir(currentPath, args[1].toUpperCase());
          output = '';
        }
        break;

      case 'type':
      case 'cat':
        if (args.length < 2) {
          output = 'The syntax of the command is incorrect.';
        } else {
          const node = getDirNode(currentPath);
          const contents = node.children;
          let matchedKey = null;
          
          if (contents) {
            for (const key of Object.keys(contents)) {
              if (key.toUpperCase() === args[1].toUpperCase()) {
                matchedKey = key;
                break;
              }
            }
          }

          if (matchedKey && contents![matchedKey].type === 'file') {
            output = contents![matchedKey].content || '';
          } else {
            output = 'The system cannot find the file specified.';
          }
        }
        break;

      case 'echo':
        // Extremely simple file writing: echo "hello" > file.txt
        const fullEchoStr = trimmed.substring(5);
        if (fullEchoStr.includes('>')) {
          const parts = fullEchoStr.split('>');
          const content = parts[0].trim().replace(/^"|"$/g, '');
          const filename = parts[1].trim().toUpperCase();
          writeFile(currentPath, filename, content);
          output = '';
        } else {
          output = fullEchoStr;
        }
        break;

      case 'time':
        output = `Current time is: ${new Date().toLocaleTimeString()}`;
        break;

      case 'date':
        output = `Current date is: ${new Date().toLocaleDateString()}`;
        break;

      case 'ping':
        if (args.length < 2) {
          output = 'Usage: ping <host>';
        } else {
          const host = args[1];
          output = [
            `Pinging ${host} with 32 bytes of data:`,
            `Reply from ${host}: bytes=32 time<1ms TTL=128`,
            `Reply from ${host}: bytes=32 time<1ms TTL=128`,
            `Reply from ${host}: bytes=32 time=1ms TTL=128`,
            `Reply from ${host}: bytes=32 time<1ms TTL=128`,
            ``,
            `Ping statistics for ${host}:`,
            `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`
          ];
        }
        break;

      case 'whoami':
        output = 'MACROHARD\\yash';
        break;

      case 'color':
        if (args.length < 2) {
          output = `Current color is ${textColor}`;
        } else {
          setTextColor(args[1]);
          output = '';
        }
        break;

      case 'cls':
        setHistory([]);
        return;

      case 'ver':
        output = 'Macrohard(R) OS 98 [Version 4.10.1998]';
        break;

      case 'exit':
        output = 'You cannot escape.';
        break;

      default:
        output = `'${command}' is not recognized as an internal or external command,\noperable program or batch file.`;
    }

    const outputLines = Array.isArray(output) ? output : output.split('\n');
    setHistory(prev => [...prev, `${displayPath(currentPath)}\\>${cmd}`, ...(output ? outputLines : [])]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setHistory(prev => [...prev, `${displayPath(currentPath)}\\>${input}^C`]);
      setInput('');
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history]);

  return (
    <div 
      className="w-full h-full font-mono p-2 text-sm overflow-y-auto cursor-text select-none" 
      onClick={() => document.getElementById('term-input')?.focus()}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap min-h-[20px]">{line}</div>
      ))}
      <div className="flex">
        <span>{displayPath(currentPath)}\&gt;</span>
        <input 
          id="term-input"
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-1 ml-1 font-mono"
          style={{ color: textColor }}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
