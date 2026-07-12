import numpy as np
from scipy import signal

def apply_effect(effect_name: str, audio: np.ndarray, sample_rate: float) -> np.ndarray:
    """Applies a single DSP effect to the audio array using scipy and numpy."""
    
    if effect_name == "bandpass":
        # Simple bandpass using Butterworth filter (300Hz - 3000Hz)
        nyq = 0.5 * sample_rate
        low = 300 / nyq
        high = 3000 / nyq
        # Scipy expects btype="band"
        b, a = signal.butter(4, [low, high], btype='band')
        audio = signal.lfilter(b, a, audio, axis=1)
        
    elif effect_name == "noise":
        # Generate white noise and mix
        noise = np.random.normal(0, 0.03, audio.shape).astype(np.float32)
        audio = audio + noise
        
    elif effect_name == "saturation":
        # Soft clipping / tanh distortion
        drive = 3.0
        audio = np.tanh(audio * drive)
        
    elif effect_name == "distortion":
        # Harder distortion
        drive = 10.0
        audio = np.tanh(audio * drive)
        
    elif effect_name == "compression":
        # Simple crude compressor: soft limit
        # In a real app we'd track envelopes, but simple waveshaping helps fake it
        audio = np.where(np.abs(audio) > 0.5, 0.5 + (np.abs(audio) - 0.5) * 0.25, np.abs(audio)) * np.sign(audio)
        
    elif effect_name == "wow_flutter":
        # Fake wow/flutter by adding low freq pitch wobble via resampling, 
        # but for simplicity, we just add a slight tremolo (AM modulation)
        t = np.arange(audio.shape[1]) / sample_rate
        modulator = 1.0 + 0.1 * np.sin(2 * np.pi * 3.0 * t)
        audio = audio * modulator
        
    elif effect_name == "hiss":
        # High pass filtered noise
        noise = np.random.normal(0, 0.05, audio.shape).astype(np.float32)
        nyq = 0.5 * sample_rate
        b, a = signal.butter(2, 4000 / nyq, btype='high')
        hiss = signal.lfilter(b, a, noise, axis=1)
        audio = audio + hiss * 0.5
        
    elif effect_name == "crackle" or effect_name == "pop":
        # Random impulses
        crackle = np.zeros_like(audio)
        if len(audio.shape) > 1:
            indices = np.random.choice(audio.shape[1], size=int(audio.shape[1] * 0.0001), replace=False)
            crackle[:, indices] = np.random.choice([-0.8, 0.8], size=len(indices))
        else:
            indices = np.random.choice(audio.shape[0], size=int(audio.shape[0] * 0.0001), replace=False)
            crackle[indices] = np.random.choice([-0.8, 0.8], size=len(indices))
        audio = audio + crackle
        
    elif effect_name == "eq":
        # Boost lows, cut highs
        nyq = 0.5 * sample_rate
        b_low, a_low = signal.butter(2, 200 / nyq, btype='low')
        lows = signal.lfilter(b_low, a_low, audio, axis=1)
        audio = audio * 0.5 + lows * 1.5
        
    elif effect_name == "fuzz":
        # Hard clipping
        audio = np.clip(audio * 5.0, -0.8, 0.8)
        
    elif effect_name == "bitcrush":
        # Quantize to 8-bit equivalent
        steps = 2**8
        audio = np.round(audio * steps) / steps
        
    elif effect_name == "downsample":
        # Pre-filter to prevent aliasing before pydub downsamples
        nyq = 0.5 * sample_rate
        if 4000 < nyq:
            b, a = signal.butter(4, 4000 / nyq, btype='low')
            audio = signal.lfilter(b, a, audio, axis=1)
            
    elif effect_name == "cd_skip":
        # Simulate CD skipping by randomly repeating small blocks
        skip_prob = 0.0005 # Probability of a skip starting per frame
        block_size = int(sample_rate * 0.1) # 100ms block
        num_samples = audio.shape[1] if len(audio.shape) > 1 else audio.shape[0]
        
        i = 0
        while i < num_samples - block_size:
            if np.random.random() < skip_prob:
                repeats = np.random.randint(2, 8)
                block = audio[:, i:i+block_size] if len(audio.shape) > 1 else audio[i:i+block_size]
                
                # Apply skip
                for r in range(repeats):
                    start = min(i + r * block_size, num_samples - block_size)
                    if len(audio.shape) > 1:
                        audio[:, start:start+block_size] = block
                    else:
                        audio[start:start+block_size] = block
                
                i += block_size * repeats
            else:
                i += block_size
                
    elif effect_name == "vhs":
        # Simulate VHS tape with a 60Hz hum, slight chorusing and lowpass
        t = np.arange(audio.shape[1] if len(audio.shape) > 1 else audio.shape[0]) / sample_rate
        
        # 60 Hz hum
        hum = 0.05 * np.sin(2 * np.pi * 60.0 * t).astype(np.float32)
        if len(audio.shape) > 1:
            audio = audio + hum
        else:
            audio = audio + hum
            
        # Lowpass filter for muffled sound
        nyq = 0.5 * sample_rate
        b, a = signal.butter(4, 8000 / nyq, btype='low')
        if len(audio.shape) > 1:
            audio = signal.lfilter(b, a, audio, axis=1)
        else:
            audio = signal.lfilter(b, a, audio)
            
        # Pitch wobble (wow/flutter)
        modulator = 1.0 + 0.01 * np.sin(2 * np.pi * 0.5 * t)
        audio = audio * modulator
            
    return audio
