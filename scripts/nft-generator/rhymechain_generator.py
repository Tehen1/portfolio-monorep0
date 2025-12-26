import os
import json
import random
import time
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

# ==========================================
# 1. CONFIGURATION DU GÉNÉRATEUR
# ==========================================

CONFIG = {
    "collection_name": "RhymeChain Origins",
    "description": "The first authentic Hip-Hop card game on-chain.",
    "base_image_url": "ipfs://YOUR_CID_HERE/",
    "output_dir": "./build",
    "total_supply": 20, # Pour le test
    "image_size": (1080, 1080),
    "styles": ["street_art", "minimalist"] # Supporte le switch
}

# Définition des Layers et de leurs poids de rareté (Rarity Weights)
LAYERS = {
    "Background": [
        {"name": "Concrete Grey", "file": "bg_concrete.png", "weight": 40},
        {"name": "Subway Tiles", "file": "bg_subway.png", "weight": 30},
        {"name": "Red Brick", "file": "bg_brick.png", "weight": 20},
        {"name": "Gold Vault", "file": "bg_gold.png", "weight": 10}, # Legend
    ],
    "Artist": [
        {"name": "MC Flow", "file": "artist_mc_flow.png", "weight": 50},
        {"name": "Lil Bit", "file": "artist_lil_bit.png", "weight": 50},
    ],
    "Accessory": [
        {"name": "None", "file": None, "weight": 40},
        {"name": "Mic", "file": "acc_mic.png", "weight": 30},
        {"name": "Boombox", "file": "acc_boombox.png", "weight": 20},
        {"name": "Gold Chain", "file": "acc_chain.png", "weight": 10},
    ],
    "Frame": [
        {"name": "Rusted Iron", "file": "frame_rust.png", "weight": 50, "rarity_label": "Common"},
        {"name": "Brushed Steel", "file": "frame_steel.png", "weight": 30, "rarity_label": "Rare"},
        {"name": "Neon Circuit", "file": "frame_neon.png", "weight": 15, "rarity_label": "Epic"},
        {"name": "Solid Gold", "file": "frame_gold.png", "weight": 5, "rarity_label": "Legend"},
    ]
}

# ==========================================
# 2. LOGIQUE DE TRAITEMENT D'IMAGE (VIBE ENGINE)
# ==========================================

def apply_street_art_filter(image):
    """
    Transforme une image clean en style 'Zine Underground/Photocopie'
    """
    # 1. Convertir en N&B pour l'effet photocopie
    img = ImageOps.grayscale(image)
    
    # 2. Augmenter drastiquement le contraste (High Contrast)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.8) 
    
    # 3. Ajouter du bruit (Grain) - Simulation simple
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    
    # 4. Coloriser (Duotone) - Noir vers Cyan Cyberpunk (#00F0FF)
    img = ImageOps.colorize(img, black="black", white="#00F0FF")
    
    return img.convert("RGBA")

def apply_minimalist_filter(image):
    """
    Style propre, haute définition, légèrement désaturé
    """
    enhancer = ImageEnhance.Color(image)
    img = enhancer.enhance(0.8) # Légère désaturation chic
    return img

# ==========================================
# 3. MOTEUR DE GÉNÉRATION
# ==========================================

class NFTGenerator:
    def __init__(self):
        self.setup_directories()
        
    def setup_directories(self):
        if not os.path.exists(CONFIG["output_dir"]):
            os.makedirs(CONFIG["output_dir"])
            os.makedirs(f"{CONFIG['output_dir']}/images")
            os.makedirs(f"{CONFIG['output_dir']}/metadata")

    def select_layer(self, layer_name):
        options = LAYERS[layer_name]
        weights = [item["weight"] for item in options]
        selection = random.choices(options, weights=weights, k=1)[0]
        return selection

    def build_nft(self, token_id, style="street_art"):
        print(f"🔨 Generating Token #{token_id} [{style}]...")
        
        # 1. Sélection des Traits
        bg_trait = self.select_layer("Background")
        artist_trait = self.select_layer("Artist")
        acc_trait = self.select_layer("Accessory")
        frame_trait = self.select_layer("Frame")
        
        # 2. Composition d'Image
        canvas = Image.new("RGBA", CONFIG["image_size"])
        
        assets_path = "./assets" 
        
        try:
            # Layer 1: Background
            if bg_trait['file']:
                bg_img = Image.open(f"{assets_path}/bg/{bg_trait['file']}").convert("RGBA")
                bg_img = bg_img.resize(CONFIG["image_size"])
                canvas.alpha_composite(bg_img)
            
            # Layer 2: Artist (Appliquer le style ICI)
            if artist_trait['file']:
                artist_img = Image.open(f"{assets_path}/artist/{artist_trait['file']}").convert("RGBA")
                artist_img = artist_img.resize(CONFIG["image_size"])
                
                if style == "street_art":
                    processed_artist = apply_street_art_filter(artist_img)
                    final_artist = Image.new("RGBA", CONFIG["image_size"])
                    final_artist.paste(processed_artist, (0,0), mask=artist_img.split()[3])
                    canvas.alpha_composite(final_artist)
                else:
                    canvas.alpha_composite(artist_img)

            # Layer 3: Accessory
            if acc_trait["file"]:
                acc_img = Image.open(f"{assets_path}/acc/{acc_trait['file']}").convert("RGBA")
                acc_img = acc_img.resize(CONFIG["image_size"])
                canvas.alpha_composite(acc_img)

            # Layer 4: Frame
            if frame_trait['file']:
                frame_img = Image.open(f"{assets_path}/frame/{frame_trait['file']}").convert("RGBA")
                frame_img = frame_img.resize(CONFIG["image_size"])
                canvas.alpha_composite(frame_img)
            
            # Sauvegarde Image
            file_name = f"{token_id}.png"
            canvas.save(f"{CONFIG['output_dir']}/images/{file_name}")
            
            # 3. Génération Metadata
            metadata = {
                "name": f"{CONFIG['collection_name']} #{token_id}",
                "description": CONFIG["description"],
                "image": f"{CONFIG['base_image_url']}{file_name}",
                "attributes": [
                    {"trait_type": "Background", "value": bg_trait["name"]},
                    {"trait_type": "Artist", "value": artist_trait["name"]},
                    {"trait_type": "Accessory", "value": acc_trait["name"]},
                    {"trait_type": "Frame", "value": frame_trait["name"]},
                    {"trait_type": "Rarity", "value": frame_trait["rarity_label"]},
                    {"trait_type": "Style", "value": style}
                ]
            }
            
            with open(f"{CONFIG['output_dir']}/metadata/{token_id}.json", "w") as f:
                json.dump(metadata, f, indent=4)
                
        except Exception as e:
            print(f"❌ Error building #{token_id}: {e}")

if __name__ == "__main__":
    gen = NFTGenerator()
    
    for i in range(1, 11):
        gen.build_nft(i, style="street_art")
        
    for i in range(11, 21):
        gen.build_nft(i, style="minimalist")
        
    print("✅ Job Done. Check ./build folder.")
