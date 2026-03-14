import React, { useState, useEffect } from "react";
import { SPIRIT_ANIMALS } from "../data/constants";

const ANIMAL_PROMPTS = {
  silverback: "A premium minimalist fitness app icon. Deep navy blue circular background. White silhouette line art portrait of a powerful Silverback gorilla head. Clean geometric lines, negative space defining muscle structure. Professional athletic branding. Square image, icon style.",
  gazelle:    "A premium minimalist fitness app icon. Deep navy blue circular background. White silhouette line art of a leaping Gazelle in profile, showing speed and agility. Fluid dynamic geometric lines. Square image, icon style.",
  owl:        "A premium minimalist fitness app icon. Deep navy blue circular background. White silhouette of a soaring Eagle head and eye symbolizing vision. Clean geometric lines, sharp focused expression. Square image, icon style.",
  panther:    "A vibrant vector illustration fitness app profile icon. Panther in low stalking pose. Bold flat shapes with electric blue and deep purple gradients suggesting agility. Circular cool teal energy aura background. Energetic non-robotic design. Square image.",
  bear:       "A vibrant vector illustration fitness app profile icon. Powerful Bear head. Bold flat shapes with fiery orange and gold gradients suggesting strength and heat. Circular deep red energy aura background. Energetic non-robotic design. Square image.",
  eagle:      "A premium minimalist fitness app icon. Deep navy blue circular background. Bold white geometric eagle head silhouette with sharp beak and fierce eye. Clean line art, powerful athletic aesthetic. Square image, icon style.",
  wolf:       "A vibrant vector illustration fitness app profile icon. Wolf head howling. Bold flat shapes with indigo and electric purple gradients. Circular midnight blue energy aura background. Pack leader energy, non-robotic. Square image.",
  dolphin:    "A vibrant vector illustration fitness app profile icon. Dolphin leaping. Bold flat shapes with aqua and sky blue gradients suggesting flow and clarity. Circular ocean teal energy aura background. Energetic non-robotic design. Square image.",
};

const AVATAR_CACHE_KEY = "jhimfit_animal_avatars_v1";

const getAvatarCache = () => {
  try { return JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY)||"{}"); }
  catch { return {}; }
};

const setAvatarCache = (cache) => {
  try { localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache)); }
  catch {}
};

const generateAnimalImage = async (animalId) => {
  // API calls to Anthropic are blocked by CORS on deployed sites — use emoji avatars
  return null;
};

/* Spirit animal avatar component — loads AI image, falls back to emoji */
const SpiritAvatar = ({ animalId, seed, size=48, ring=true }) => {
  const animal = SPIRIT_ANIMALS.find(a=>a.id===animalId) || SPIRIT_ANIMALS[5];
  const [imgSrc, setImgSrc] = React.useState(() => {
    const cache = getAvatarCache();
    return cache[animalId] || null;
  });
  const [loading, setLoading] = React.useState(!imgSrc);

  React.useEffect(() => {
    if (imgSrc) return;
    let cancelled = false;
    setLoading(true);
    generateAnimalImage(animalId).then(src => {
      if (!cancelled) { setImgSrc(src); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [animalId]);

  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0, overflow:"hidden",
      border: ring ? `2px solid ${animal.color}88` : "none",
      boxShadow: ring ? `0 0 12px ${animal.color}44` : "none",
      background: animal.bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative",
    }}>
      {loading && (
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center",
          justifyContent:"center", background:animal.bg, borderRadius:"50%",
          fontSize: size * 0.38,
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          {animal.emoji}
        </div>
      )}
      {imgSrc && (
        <img src={imgSrc} alt={animal.name} width={size} height={size}
          style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%"}}
          onError={() => setImgSrc(null)}
        />
      )}
      {!loading && !imgSrc && (
        <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:size*0.48}}>
          {animal.emoji}
        </div>
      )}
    </div>
  );
};

export default SpiritAvatar;
export { generateAnimalImage };
