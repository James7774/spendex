
import os
from PIL import Image

# Configuration
SOURCE_IMAGE = "android/app/src/main/res/drawable/ic_brand_logo.png"
BASE_PATH = "android/app/src/main/res"

# Map of folder suffix to size (px)
ICON_SIZES = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192
}

def generate_icons():
    if not os.path.exists(SOURCE_IMAGE):
        print(f"Error: Source image not found at {SOURCE_IMAGE}")
        return

    try:
        img = Image.open(SOURCE_IMAGE)
        print(f"Loaded source image: {img.size}")

        for density, size in ICON_SIZES.items():
            folder_name = f"mipmap-{density}"
            folder_path = os.path.join(BASE_PATH, folder_name)
            
            # Ensure folder exists
            os.makedirs(folder_path, exist_ok=True)
            
            # Resize
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save as standard launcher names
            # 1. Square/Normal
            square_path = os.path.join(folder_path, "ic_launcher.png")
            resized_img.save(square_path, "PNG")
            
            # 2. Round (For now, just using the same image as a placeholder for round)
            # Ideally this would be masked, but for a "quick fix" this ensures files exist.
            # If the source is already a circle (common in logos), this is perfect.
            round_path = os.path.join(folder_path, "ic_launcher_round.png")
            resized_img.save(round_path, "PNG")
            
            print(f"Generated {size}x{size} icons in {folder_name}")
            
    except Exception as e:
        print(f"Failed to generate icons: {e}")

if __name__ == "__main__":
    generate_icons()
