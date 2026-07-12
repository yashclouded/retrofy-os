import os

# Profiles Configuration
PROFILES = {
    "ultra": {
        "name": "Ultra",
        "description": "High quality retro",
        "sample_rate": 44100,
        "bit_depth": 16,
        "channels": 2,
        "codec": "libmp3lame",
        "bitrate": "128k"
    },
    "retro": {
        "name": "Retro",
        "description": "Standard retro sound",
        "sample_rate": 22050,
        "bit_depth": 8,
        "channels": 1,
        "codec": "libmp3lame",
        "bitrate": "64k"
    },
    "balanced": {
        "name": "Balanced",
        "description": "Noticeably degraded but clear",
        "sample_rate": 16000,
        "bit_depth": 8,
        "channels": 1,
        "codec": "libmp3lame",
        "bitrate": "32k"
    },
    "extreme": {
        "name": "Extreme",
        "description": "Heavily compressed and distorted",
        "sample_rate": 8000,
        "bit_depth": 8,
        "channels": 1,
        "codec": "libmp3lame",
        "bitrate": "16k"
    },
    "impossible": {
        "name": "Impossible",
        "description": "Barely recognizable audio",
        "sample_rate": 4000,
        "bit_depth": 4,
        "channels": 1,
        "codec": "libmp3lame",
        "bitrate": "8k"
    }
}

# Presets Configuration
PRESETS = [
    {"id": "vinyl", "name": "Vinyl", "effects": ["crackle", "pop", "eq"]},
    {"id": "cd_skip", "name": "Scratched CD", "effects": ["cd_skip"]},
    {"id": "worn_cassette", "name": "Worn Cassette", "effects": ["wow_flutter", "hiss", "saturation"]},
    {"id": "vhs_tape", "name": "Degraded VHS", "effects": ["vhs", "hiss"]}
]

# Directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOADS_DIR = os.path.join(DATA_DIR, "uploads")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")
TEMP_DIR = os.path.join(DATA_DIR, "temp")
CACHE_DIR = os.path.join(DATA_DIR, "cache")
