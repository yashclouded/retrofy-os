import os
import soundfile as sf
import numpy as np
import ffmpeg
from app.effects.dsp import apply_effect

def process_audio_pipeline(input_path: str, output_path: str, preset: dict, profile: dict) -> str:
    """
    Orchestrates the audio processing pipeline:
    1. Loads the audio.
    2. Applies the preset DSP effects.
    3. Compresses the audio using the profile settings via ffmpeg.
    """
    # 1. Load Audio
    # Load with native sample rate
    audio, sr = sf.read(input_path)
    
    # Soundfile returns (frames, channels), we want (channels, frames)
    if len(audio.shape) > 1:
        audio = audio.T
    else:
        # Mono
        audio = audio.reshape(1, -1)
        
    # 2. Apply DSP Effects from Preset
    for effect_name in preset.get("effects", []):
        audio = apply_effect(effect_name, audio, sr)
        
    # Normalize peak to 0.9 before export to restore volume lost during filtering
    max_amp = np.max(np.abs(audio))
    if max_amp > 0:
        audio = (audio / max_amp) * 0.9
        
    # Avoid hard digital clipping
    audio = np.clip(audio, -1.0, 1.0)
    
    # 3. Save intermediate uncompressed file
    temp_intermediate = input_path + "_temp.wav"
    sf.write(temp_intermediate, audio.T, sr)
    
    # 4. Apply Compression Profile directly with FFmpeg
    target_sr = profile.get("sample_rate", sr)
    target_channels = profile.get("channels", audio.shape[0])
    target_bitrate = profile.get("bitrate", "128k")
    
    try:
        (
            ffmpeg
            .input(temp_intermediate)
            .output(output_path, ar=target_sr, ac=target_channels, audio_bitrate=target_bitrate, format='mp3')
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
    except ffmpeg.Error as e:
        print(f"FFmpeg error: {e.stderr.decode()}")
        raise RuntimeError(f"Compression failed: {e.stderr.decode()}")
    finally:
        # Cleanup intermediate file
        if os.path.exists(temp_intermediate):
            os.remove(temp_intermediate)
            
    return output_path
