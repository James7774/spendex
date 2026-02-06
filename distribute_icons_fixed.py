
import os
import shutil
import re

# Config
SOURCE_DIR = "my_icons"
DEST_BASE = "android/app/src/main/res"

# Map EXACT size numbers to folder names
MAPPING = {
    48: "mipmap-mdpi",
    72: "mipmap-hdpi",
    96: "mipmap-xhdpi",
    144: "mipmap-xxhdpi",
    196: "mipmap-xxxhdpi", # User's file is 196 (close enough to 192 standard)
    192: "mipmap-xxxhdpi"
}

def distribute_icons():
    files = os.listdir(SOURCE_DIR)
    
    for filename in files:
        if not filename.endswith(".png"):
            continue

        # Extract the number from the filename using regex
        match = re.search(r'(\d+)', filename)
        if not match:
            print(f"⚠️ Could not find number in {filename}")
            continue
            
        size = int(match.group(1))
        
        target_folder = MAPPING.get(size)
        
        if target_folder:
            full_dest_dir = os.path.join(DEST_BASE, target_folder)
            os.makedirs(full_dest_dir, exist_ok=True)

            src_path = os.path.join(SOURCE_DIR, filename)
            
            # Destination 1: Standard Launcher
            dest_path_square = os.path.join(full_dest_dir, "ic_launcher.png")
            shutil.copy2(src_path, dest_path_square)
            
            # Destination 2: Round Launcher
            dest_path_round = os.path.join(full_dest_dir, "ic_launcher_round.png")
            shutil.copy2(src_path, dest_path_round)
            
            print(f"✅ Corrected: {filename} ({size}px) -> {target_folder}")
        else:
            print(f"⚠️ No mapping found for size {size} in {filename}")

if __name__ == "__main__":
    distribute_icons()
