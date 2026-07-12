# Retrofy

Retrofy is an application that intentionally compresses music into extremely small file sizes while recreating the nostalgic sound of old devices such as cassette players, AM radios, Game Boys, CRT televisions, telephones, and vintage speakers.

This is **not** a normal music converter. The goal is to make songs sound old, rough, nostalgic, and heavily compressed while keeping them recognizable.

## Architecture

Retrofy uses a modern web stack for the frontend and a powerful Python backend for audio DSP (Digital Signal Processing).

```
Frontend (Next.js) -> FastAPI Backend -> Audio Processing Engine -> Effects Pipeline -> Compression Engine -> Export Engine
```

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand
- **Backend**: Python 3.12, FastAPI, Uvicorn, pedalboard, librosa, numpy, scipy, soundfile, pydub, ffmpeg

## Project Structure

- `frontend/` - Next.js UI Application
- `backend/` - FastAPI Python Server
  - `app/api/` - REST API Endpoints
  - `app/core/` - Configuration (Profiles, Presets)
  - `app/effects/` - Modular audio effects (cassette, radio, etc.)
  - `app/processors/` - Audio pipeline orchestrator
  - `data/` - Local storage (uploads, processed files, cache, etc.)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.12+)
- FFmpeg (must be installed on your system)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   API is available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Frontend is available at `http://localhost:3000`

## Development Roadmap
1. [x] Foundation Setup (Folder structure, API scaffolding, Next.js init)
2. [ ] UI Implementation (Upload, preset selector, preview player)
3. [ ] DSP Pipeline Architecture (Audio loading, effect chaining)
4. [ ] Core Effects Implementation (Bitcrusher, Bandpass, Saturation, Noise)
5. [ ] Preset Tuning (AM Radio, Game Boy, Worn Cassette)
6. [ ] Export & Compression Engine
7. [ ] ESP32 Retro Music Player Integration
8. [ ] Spotify Playback Integration
9. [ ] AI-Generated Presets
