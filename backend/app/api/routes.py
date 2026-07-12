from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse, JSONResponse
from app.core.config import PRESETS, PROFILES, UPLOADS_DIR, PROCESSED_DIR
from app.processors.pipeline import process_audio_pipeline
import uuid
import os
import shutil

router = APIRouter()

# Ensure directories exist
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1] or ".mp3"
    safe_filename = f"{file_id}{extension}"
    file_path = os.path.join(UPLOADS_DIR, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"file_id": file_id, "filename": file.filename, "message": "File uploaded successfully"}

@router.post("/process")
async def process_audio(preset_id: str = Form(...), profile_id: str = Form(...), file_id: str = Form(...)):
    # Find original file
    uploaded_files = [f for f in os.listdir(UPLOADS_DIR) if f.startswith(file_id)]
    if not uploaded_files:
        raise HTTPException(status_code=404, detail="Uploaded file not found")
        
    input_path = os.path.join(UPLOADS_DIR, uploaded_files[0])
    output_filename = f"processed_{file_id}.mp3"
    output_path = os.path.join(PROCESSED_DIR, output_filename)
    
    # Find preset and profile
    preset = next((p for p in PRESETS if p["id"] == preset_id), None)
    profile = PROFILES.get(profile_id)
    
    if not preset or not profile:
        raise HTTPException(status_code=400, detail="Invalid preset or profile ID")
        
    try:
        # Run pipeline
        process_audio_pipeline(input_path, output_path, preset, profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
        
    return {
        "file_id": file_id, 
        "preset": preset_id, 
        "profile": profile_id, 
        "status": "completed",
        "download_url": f"/api/download/{file_id}"
    }

@router.get("/download/{file_id}")
async def download_audio(file_id: str):
    output_filename = f"processed_{file_id}.mp3"
    output_path = os.path.join(PROCESSED_DIR, output_filename)
    
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Processed file not found")
        
    return FileResponse(output_path, media_type="audio/mpeg", filename=output_filename)

@router.get("/presets")
async def get_presets():
    return {"presets": PRESETS, "profiles": PROFILES}
