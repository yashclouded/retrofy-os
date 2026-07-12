import React from 'react';

interface SettingsAppProps {
  bgColor: string;
  setBgColor: (color: string) => void;
  showLogo: boolean;
  setShowLogo: (show: boolean) => void;
}

export function SettingsApp({ bgColor, setBgColor, showLogo, setShowLogo }: SettingsAppProps) {
  const colors = [
    { name: 'Teal (Default)', value: '#008080' },
    { name: 'Deep Blue', value: '#000080' },
    { name: 'Pitch Black', value: '#000000' },
    { name: 'Olive', value: '#808000' },
    { name: 'Gray', value: '#808080' },
  ];

  return (
    <div className="w-full h-full bg-[#c0c0c0] p-4 font-sans text-sm select-none overflow-y-auto">
      
      <fieldset className="border border-gray-400 p-4 mb-4">
        <legend className="px-1 text-black font-bold">Desktop Background</legend>
        <div className="flex flex-col gap-2">
          {colors.map((color) => (
            <label key={color.value} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="bgColor" 
                value={color.value}
                checked={bgColor === color.value}
                onChange={() => setBgColor(color.value)}
              />
              <div className="w-4 h-4 border border-black" style={{ backgroundColor: color.value }}></div>
              <span>{color.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-gray-400 p-4 mb-4">
        <legend className="px-1 text-black font-bold">Display Settings</legend>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showLogo}
            onChange={(e) => setShowLogo(e.target.checked)}
          />
          <span>Show "Macrohard" Logo on Desktop</span>
        </label>
      </fieldset>

      <div className="flex justify-end gap-2 mt-4">
        <button className="nice90s-button px-4 py-1 font-bold min-w-[80px]">OK</button>
      </div>
      
    </div>
  );
}
