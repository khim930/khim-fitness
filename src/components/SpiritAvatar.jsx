import React, { useState } from "react";
import { SPIRIT_ANIMALS } from "../data/constants";



/* Spirit animal avatar component */
const SpiritAvatar = ({ animalId, seed, size=48, ring=true }) => {
  const animal = SPIRIT_ANIMALS.find(a=>a.id===animalId) || SPIRIT_ANIMALS[5];
  const [imgSrc] = React.useState(null);



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
