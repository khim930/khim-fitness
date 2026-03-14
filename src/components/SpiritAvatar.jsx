import React from "react";
import { SPIRIT_ANIMALS } from "../data/constants";

const SpiritAvatar = ({ animalId, size = 48, ring = true }) => {
  const animal = SPIRIT_ANIMALS.find((a) => a.id === animalId) || SPIRIT_ANIMALS[5];

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      overflow: "hidden",
      border: ring ? `2px solid ${animal.color}88` : "none",
      boxShadow: ring ? `0 0 12px ${animal.color}44` : "none",
      background: animal.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.48,
    }}>
      {animal.emoji}
    </div>
  );
};

export default SpiritAvatar;
