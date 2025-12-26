import json
import os

# Charger les métadonnées existantes
metadata_dir = "/Users/devtehen/Desktop/Dev/portfolio-monorep0/scripts/nft-generator/test_metadata"
output_dir = "/Users/devtehen/Desktop/Dev/portfolio-monorep0/scripts/nft-generator/generated_images"

# Créer le dossier de sortie
os.makedirs(output_dir, exist_ok=True)

print("🎨 RhymeChain NFT Image Generator")
print("=" * 60)
print(f"\nReading metadata from: {metadata_dir}")
print(f"Output directory: {output_dir}\n")

# Lire toutes les métadonnées
metadata_files = sorted([f for f in os.listdir(metadata_dir) if f.endswith('.json')])

print(f"Found {len(metadata_files)} metadata files\n")

# Pour chaque métadonnée, générer un prompt pour l'image
generated_prompts = []

for metadata_file in metadata_files:
    with open(os.path.join(metadata_dir, metadata_file), 'r') as f:
        metadata = json.load(f)
    
    # Extraire les attributs
    attributes = {attr['trait_type']: attr['value'] for attr in metadata['attributes']}
    
    # Construire le prompt basé sur le system_prompt_zk_synth
    prompt = f"""
[ARTISTIC_DIRECTION]
Hyper-realistic digital photography mixed with gritty street art textures.
High-contrast "Neon Noir" lighting with Cyan (#00F0FF) and Magenta (#FF00FF) key lights.
85mm Portrait Lens, f/1.8 aperture, sharp focus on eyes and accessories.
Chromatic aberration on edges, slight film grain, glitch artifacts on holographic elements.

[SUBJECT_DNA]
Archetype: {attributes.get('Archetype', 'Unknown')}
Outfit: {attributes.get('Outfit', 'Tech-wear fashion')}
Cybernetics: {attributes.get('Implant', 'Neural implants')} with glowing circuit lines
Pose: Aggressive rapping stance

[ENVIRONMENT_MATRIX]
Location: {attributes.get('Background', 'Cyber city')}
Atmosphere: Heavy rain, steam rising from vents, floating holographic crypto advertisements

[QUALITY_GATES]
Resolution: 8K UHD
Render Engine: Octane Render style
Detail Level: Insane detail (visible fabric weaves, realistic skin pores, reflective metal)

Generate a single portrait of a futuristic hip-hop artist with these exact characteristics.
"""
    
    generated_prompts.append({
        'token_id': metadata_file.replace('.json', ''),
        'name': metadata['name'],
        'prompt': prompt.strip(),
        'attributes': attributes
    })
    
    print(f"✅ Generated prompt for: {metadata['name']}")
    print(f"   Archetype: {attributes.get('Archetype')}")
    print(f"   Outfit: {attributes.get('Outfit')}")
    print(f"   Background: {attributes.get('Background')}\n")

# Sauvegarder les prompts
prompts_file = os.path.join(output_dir, "generation_prompts.json")
with open(prompts_file, 'w') as f:
    json.dump(generated_prompts, f, indent=2)

print("=" * 60)
print(f"\n✅ Generation Complete!")
print(f"\nPrompts saved to: {prompts_file}")
print(f"\n📝 Summary:")
print(f"   Total NFTs: {len(generated_prompts)}")
print(f"   Unique Archetypes: {len(set(p['attributes'].get('Archetype') for p in generated_prompts))}")
print(f"   Unique Backgrounds: {len(set(p['attributes'].get('Background') for p in generated_prompts))}")

print(f"\n💡 Next Steps:")
print(f"   1. Use these prompts with Stable Diffusion/DALL-E/Midjourney")
print(f"   2. Generate images (1024x1024 recommended)")
print(f"   3. Upload to IPFS via Pinata")
print(f"   4. Update metadata with real IPFS hashes")
print("\n" + "=" * 60)
