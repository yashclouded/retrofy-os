import { create } from 'zustand';

interface AudioState {
  file: File | null;
  fileId: string | null;
  originalUrl: string | null;
  processedUrl: string | null;
  profileId: string;
  presetId: string;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
  
  setFile: (file: File) => void;
  setProfileId: (id: string) => void;
  setPresetId: (id: string) => void;
  processAudio: () => Promise<void>;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  file: null,
  fileId: null,
  originalUrl: null,
  processedUrl: null,
  profileId: 'extreme',
  presetId: 'vinyl',
  status: 'idle',
  errorMessage: null,

  setFile: (file) => {
    const url = URL.createObjectURL(file);
    set({ file, originalUrl: url, status: 'idle', processedUrl: null, errorMessage: null });
  },

  setProfileId: (id) => set({ profileId: id }),
  setPresetId: (id) => set({ presetId: id }),

  processAudio: async () => {
    const { file, profileId, presetId } = get();
    if (!file) return;

    try {
      set({ status: 'uploading', errorMessage: null });

      // 1. Upload
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      const newFileId = uploadData.file_id;
      
      set({ fileId: newFileId, status: 'processing' });

      // 2. Process
      const processForm = new FormData();
      processForm.append('preset_id', presetId);
      processForm.append('profile_id', profileId);
      processForm.append('file_id', newFileId);

      const processRes = await fetch('http://localhost:8000/api/process', {
        method: 'POST',
        body: processForm,
      });

      if (!processRes.ok) {
        const errData = await processRes.json();
        throw new Error(errData.detail || 'Processing failed');
      }

      const processData = await processRes.json();
      
      set({ 
        status: 'completed', 
        processedUrl: `http://localhost:8000${processData.download_url}` 
      });

    } catch (error: any) {
      set({ status: 'error', errorMessage: error.message });
    }
  },

  reset: () => set({ 
    file: null, fileId: null, originalUrl: null, processedUrl: null, 
    status: 'idle', errorMessage: null 
  })
}));
