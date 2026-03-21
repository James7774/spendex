
import os
import shutil

# Config
SOURCE_DIR = "my_icons"
DEST_BASE = "android/app/src/main/res"

# Map filename keywords to folder names
MAPPING = {
    "48": "mipmap-mdpi",
    "72": "mipmap-hdpi",
    "96": "mipmap-xhdpi",
    "144": "mipmap-xxhdpi",
    "196": "mipmap-xxxhdpi"  # User named it 196, usually 192 but we map it here
}

def distribute_icons():
    if not os.path.exists(SOURCE_DIR):
        print("Error: my_icons folder not found!")
        return

    files = os.listdir(SOURCE_DIR)
    print(f"Found files: {files}")

    for filename in files:
        if not filename.endswith(".png"):
            continue

        # Find which bucket this file belongs to
        target_folder = None
        for key, folder in MAPPING.items():
            if key in filename:
                target_folder = folder
                break
        
        if target_folder:
            full_dest_dir = os.path.join(DEST_BASE, target_folder)
            os.makedirs(full_dest_dir, exist_ok=True)

            src_path = os.path.join(SOURCE_DIR, filename)
            
            # Destination 1: Standard Launcher
            dest_path_square = os.path.join(full_dest_dir, "ic_launcher.png")
            shutil.copy2(src_path, dest_path_square)
            
            # Destination 2: Round Launcher (using same img)
            dest_path_round = os.path.join(full_dest_dir, "ic_launcher_round.png")
            shutil.copy2(src_path, dest_path_round)
            
            print(f"✅ Moved {filename} -> {target_folder}/ic_launcher.png (& round)")
        else:
            print(f"⚠️ Skipped {filename} (Could not match size in name)")

if __name__ == "__main__":
    distribute_icons()
