import json
import os
import random

# Configuration
COLLECTION_NAME = "RhymeChain Genesis Test"
IMAGE_BASE_URI = "ipfs://QmTestHash/" # Placeholder
OUTPUT_DIR = "/Users/devtehen/Desktop/Dev/portfolio-monorep0/scripts/nft-generator/test_metadata"

TRAITS = {
    "Archetype": ["Quantum Spitter", "DeFi Hustler", "Node Guardian", "Gasless Assassin"],
    "Outfit": ["Holographic Hoodie", "Kevlar Vest", "Digital Fur Coat", "Smart-Suit"],
    "Implant": ["Neural Link", "Bionic Eye", "Led Teeth", "Gold Skin"],
    "Background": ["zkSync Mainframe", "Cyber-Slums", "Neon Rooftop", "Zero-Knowledge Void"],
    "Rarity": ["Common", "Rare", "Epic", "Legendary"]
}

def generate_test_json(token_id):
    dna = {k: random.choice(v) for k, v in TRAITS.items()}
    
    metadata = {
        "name": f"{COLLECTION_NAME} #{token_id}",
        "description": "Genesis Test Card for RhymeChain. Experience the future of fantasy hip-hop.",
        "image": f"{IMAGE_BASE_URI}{token_id}.png",
        "attributes": [
            {"trait_type": k, "value": v} for k, v in dna.items()
        ]
    }
    
    with open(os.path.join(OUTPUT_DIR, f"{token_id}.json"), "w") as f:
        json.dump(metadata, f, indent=4)
    return metadata

if __name__ == "__main__":
    print(f"Generating 5 test metadata files in {OUTPUT_DIR}...")
    for i in range(1, 6):
        generate_test_json(i)
    print("Generation complete.")