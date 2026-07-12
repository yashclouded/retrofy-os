import React, { useState, useEffect, useRef } from 'react';

export function RetrofyApp() {
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<any>({ presets: [], profiles: {} });
  const [presetId, setPresetId] = useState('vinyl');
  const [profileId, setProfileId] = useState('telephone');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing'>('idle');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Custom Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/presets')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setOriginalUrl(URL.createObjectURL(e.target.files[0]));
      setProcessedUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const processAudio = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();

      setStatus('processing');
      const processDataForm = new FormData();
      processDataForm.append('file_id', uploadData.file_id);
      processDataForm.append('preset_id', presetId);
      processDataForm.append('profile_id', profileId);
      
      const processRes = await fetch('/api/process', {
        method: 'POST',
        body: processDataForm,
      });

      if (!processRes.ok) {
        const errData = await processRes.json();
        throw new Error(errData.detail || 'Processing failed');
      }

      const processData = await processRes.json();
      setProcessedUrl(`/api/download/${processData.file_id}`);
      setStatus('idle');
      
      // Auto-play when ready
      if (audioRef.current) {
        audioRef.current.load();
        setTimeout(() => togglePlay(), 500);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      setStatus('idle');
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#222] overflow-y-auto font-sans select-none p-4">
      
      {/* Hidden Audio Element */}
      {processedUrl && (
        <audio 
          ref={audioRef}
          src={processedUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* WINAMP STYLE TOP UNIT */}
      <div className="w-full max-w-[600px] mx-auto bg-gradient-to-b from-[#333] to-[#111] border-2 border-gray-600 rounded-lg p-3 shadow-2xl relative">
        <div className="absolute top-1 left-2 text-[10px] text-gray-500 font-bold">RETROFY AMP V1.0</div>
        
        <div className="flex gap-4 mt-4">
          {/* LCD Display */}
          <div className="flex-1 bg-black border-[3px] border-gray-700 shadow-[inset_2px_2px_10px_#000] p-2 flex flex-col justify-between relative overflow-hidden rounded-md">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTAgNEwwIDBMMCAwTDAgNEwwIDRMMCAweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] opacity-50 pointer-events-none z-10"></div>
            
            <div className="flex justify-between items-start z-20">
              <div className="text-[#0f0] font-mono text-2xl font-black drop-shadow-[0_0_5px_#0f0] tracking-widest">
                {formatTime(currentTime)}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#0f0] font-mono text-xs drop-shadow-[0_0_2px_#0f0]">kbps 128</span>
                <span className="text-[#0f0] font-mono text-xs drop-shadow-[0_0_2px_#0f0]">kHz 44.1</span>
              </div>
            </div>

            <div className="z-20 mt-2 whitespace-nowrap overflow-hidden">
              <span className={`text-[#0f0] font-mono text-sm font-bold uppercase drop-shadow-[0_0_3px_#0f0] ${isPlaying ? 'animate-[marquee_5s_linear_infinite] inline-block' : ''}`}>
                {file ? `*** ${file.name} *** RETROFY DSP ACTIVE ***` : '*** NO TAPE LOADED ***'}
              </span>
            </div>

            {/* Fake EQ */}
            <div className="flex items-end gap-[2px] h-10 mt-2 z-20">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
                  {[...Array(8)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`w-full h-[3px] rounded-[1px] ${
                        isPlaying && Math.random() > (j / 8) 
                        ? (j > 5 ? 'bg-red-500 shadow-[0_0_4px_#f00]' : j > 3 ? 'bg-yellow-400 shadow-[0_0_4px_#ff0]' : 'bg-[#0f0] shadow-[0_0_4px_#0f0]') 
                        : 'bg-gray-800'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transport Controls & Settings */}
        <div className="flex mt-4 gap-4 items-center">
          
          <div className="flex gap-1 bg-[#222] p-1 rounded-md border border-gray-700 shadow-inner">
            <button onClick={() => audioRef.current && (audioRef.current.currentTime -= 5)} className="w-10 h-8 bg-gradient-to-b from-gray-300 to-gray-500 border border-gray-600 rounded shadow-[inset_1px_1px_1px_#fff,1px_1px_2px_#000] active:shadow-[inset_2px_2px_2px_#000] active:from-gray-500 active:to-gray-400 flex justify-center items-center font-bold text-xs">
              ⏪
            </button>
            <button onClick={togglePlay} disabled={!processedUrl} className="w-12 h-10 bg-gradient-to-b from-gray-300 to-gray-500 border border-gray-600 rounded shadow-[inset_1px_1px_1px_#fff,1px_1px_2px_#000] active:shadow-[inset_2px_2px_2px_#000] active:from-gray-500 active:to-gray-400 flex justify-center items-center text-lg">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={stopPlay} disabled={!processedUrl} className="w-10 h-8 bg-gradient-to-b from-gray-300 to-gray-500 border border-gray-600 rounded shadow-[inset_1px_1px_1px_#fff,1px_1px_2px_#000] active:shadow-[inset_2px_2px_2px_#000] active:from-gray-500 active:to-gray-400 flex justify-center items-center font-bold text-xs mt-2">
              ⏹
            </button>
            <button onClick={() => audioRef.current && (audioRef.current.currentTime += 5)} className="w-10 h-8 bg-gradient-to-b from-gray-300 to-gray-500 border border-gray-600 rounded shadow-[inset_1px_1px_1px_#fff,1px_1px_2px_#000] active:shadow-[inset_2px_2px_2px_#000] active:from-gray-500 active:to-gray-400 flex justify-center items-center font-bold text-xs mt-2">
              ⏩
            </button>
          </div>

          <div className="flex flex-col ml-2 gap-1">
            <button onClick={() => fileInputRef.current?.click()} className="w-16 h-8 bg-gradient-to-b from-blue-300 to-blue-500 border border-gray-600 rounded shadow-[inset_1px_1px_1px_#fff,1px_1px_2px_#000] active:shadow-[inset_2px_2px_2px_#000] active:from-blue-500 active:to-blue-400 flex justify-center items-center font-bold text-[10px] text-white tracking-tighter leading-none mt-2">
              ⏏ LOAD
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleChange} />
          </div>

          {/* Volume Slider (Fake for aesthetic, though could be wired) */}
          <div className="flex-1 px-4">
             <div className="h-2 w-full bg-black rounded-full border border-gray-600 shadow-inner relative">
               <div className="absolute top-1/2 -translate-y-1/2 left-[70%] w-3 h-6 bg-gradient-to-b from-gray-200 to-gray-500 border border-gray-700 rounded shadow-md cursor-pointer"></div>
             </div>
             <div className="flex justify-between text-[9px] text-gray-400 mt-1 uppercase font-bold">
               <span>Vol -</span><span>Vol +</span>
             </div>
          </div>
        </div>
      </div>


      {/* DSP CONFIGURATION RACK */}
      <div className="w-full max-w-[600px] mx-auto mt-4 bg-gradient-to-b from-[#333] to-[#222] border-2 border-gray-600 rounded-lg p-4 shadow-2xl">
        <h2 className="text-gray-400 font-bold text-xs uppercase mb-3 border-b border-gray-600 pb-1">DSP Config Rack</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-[10px] uppercase font-bold">Format Profile</label>
            <select 
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              className="bg-black text-[#0f0] font-mono text-sm border-2 border-gray-600 p-1 outline-none"
            >
              {Object.entries(config.profiles).map(([id, p]: any) => (
                <option key={id} value={id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-[10px] uppercase font-bold">Hardware Emulation</label>
            <select 
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className="bg-black text-[#0f0] font-mono text-sm border-2 border-gray-600 p-1 outline-none"
            >
              {config.presets.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
            onClick={processAudio}
            disabled={!file || status === 'uploading' || status === 'processing'}
            className="w-full mt-4 bg-gradient-to-b from-red-600 to-red-900 border-2 border-red-950 rounded shadow-[inset_1px_1px_2px_#ffaaaa,2px_2px_5px_#000] active:shadow-[inset_2px_2px_5px_#000] active:from-red-900 active:to-red-800 text-white font-black text-lg py-2 tracking-widest uppercase disabled:opacity-50 disabled:grayscale"
          >
            {status === 'idle' ? 'PROCESS AUDIO' : status === 'uploading' ? 'TRANSMITTING...' : 'PROCESSING DSP...'}
        </button>
        {errorMessage && <div className="text-red-500 font-bold text-center mt-2 text-sm">{errorMessage}</div>}
      </div>


      {/* VISUALIZER DECK (VINYL OR CASSETTE) */}
      <div className="flex-1 w-full max-w-[600px] mx-auto mt-4 flex items-center justify-center p-4">
        {presetId === 'vinyl' ? (
          
          /* MASSIVE VINYL PLAYER */
          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-[#1a1a1a] rounded-xl border-[4px] border-gray-800 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Platter Base */}
            <div className="absolute w-[95%] h-[95%] rounded-full bg-black shadow-[inset_0_0_20px_#222]"></div>
            
            {/* The Vinyl */}
            <div 
              className={`w-[90%] h-[90%] rounded-full flex items-center justify-center relative overflow-hidden border-2 border-gray-900 ${isPlaying ? 'animate-[spin_1.8s_linear_infinite]' : 'transition-transform duration-[2s] ease-out'}`}
              style={{
                background: 'repeating-radial-gradient(#111 0px, #000 2px, #1a1a1a 3px, #000 4px)'
              }}
            >
              {/* Shine */}
              <div className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen" style={{ background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.15) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.15) 225deg, transparent 270deg)' }}></div>
              
              {/* Label */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 border border-gray-900 flex flex-col items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                <span className="text-[10px] text-white font-black tracking-[0.3em] uppercase mb-1">RETROFY</span>
                {/* Spindle */}
                <div className="w-3 h-3 rounded-full bg-gray-300 border-[2px] border-gray-800 shadow-sm flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
                <span className="text-[8px] text-white/80 mt-2 font-bold uppercase">{profileId}</span>
              </div>
            </div>

            {/* Tonearm (Static for now, but looks cool) */}
            <div className="absolute right-4 bottom-4 w-6 h-32 origin-bottom-right rotate-12">
              <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-500 rounded-full border border-gray-600 shadow-lg relative">
                <div className="absolute -top-4 -left-2 w-10 h-12 bg-[#222] border border-gray-500 rounded-md shadow-lg transform -rotate-12"></div>
                <div className="absolute bottom-2 left-1 w-4 h-4 rounded-full bg-black border-2 border-gray-400"></div>
              </div>
            </div>
          </div>

        ) : (

          /* CASSETTE TAPE PLAYER */
          <div className="relative w-80 h-48 bg-[#ccc] rounded-md border-4 border-gray-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.5),10px_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center p-2">
            <div className="w-full h-full bg-black rounded border-2 border-gray-700 relative overflow-hidden flex flex-col items-center justify-center">
              
              {/* Cassette Label Area */}
              <div className="w-[80%] h-24 bg-[#eaeaea] rounded-sm mt-4 border border-gray-400 flex flex-col p-2 relative shadow-inner">
                <div className="w-full border-b-2 border-blue-500 mb-1 font-marker text-lg text-blue-900 text-center leading-none">
                  {file ? file.name.substring(0, 20) : "MIX TAPE"}
                </div>
                <div className="w-full border-b-2 border-red-500 h-4"></div>
                <div className="w-full border-b-2 border-red-500 h-4 mt-1"></div>
                
                {/* Spools */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-12 bg-black/10 rounded-full border border-gray-400/50 flex justify-between px-2 items-center">
                   {/* Left Spool */}
                   <div className={`w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                     <div className="w-3 h-3 bg-black/20 rounded-full"></div>
                     <div className="absolute w-8 h-[2px] bg-black/20 transform rotate-0"></div>
                     <div className="absolute w-8 h-[2px] bg-black/20 transform rotate-60"></div>
                     <div className="absolute w-8 h-[2px] bg-black/20 transform rotate-120"></div>
                   </div>
                   {/* Right Spool */}
                   <div className={`w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                     <div className="w-3 h-3 bg-black/20 rounded-full"></div>
                     <div className="absolute w-8 h-[2px] bg-black/20 transform rotate-0"></div>
                     <div className="absolute w-8 h-[2px] bg-black/20 transform rotate-60"></div>
                     <div className="absolute w-8 h-[2px] bg-black/20 transform rotate-120"></div>
                   </div>
                </div>
              </div>

              <div className="absolute bottom-2 w-32 h-6 bg-[#333] rounded-t-lg border-t border-l border-r border-gray-500 flex justify-center items-end px-2">
                <div className="w-2 h-2 rounded-full bg-gray-800 shadow-inner mb-1"></div>
                <div className="flex-1"></div>
                <div className="w-2 h-2 rounded-full bg-gray-800 shadow-inner mb-1"></div>
              </div>
            </div>
          </div>

        )}
      </div>

    </div>
  );
}
