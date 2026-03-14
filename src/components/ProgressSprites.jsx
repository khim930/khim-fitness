import React from "react";

const HydrationSprite = ({ current, goal }) => {
  const pct = Math.min(current / goal, 1);
  const level = pct === 0 ? "empty" : pct < 0.4 ? "low" : pct < 0.75 ? "mid" : "full";
  const states = {
    empty: { emoji:"💀", color:"#666",    label:"Dehydrated!", pulse:false },
    low:   { emoji:"😰", color:"#F59E0B", label:"Drink up!",   pulse:true  },
    mid:   { emoji:"💧", color:"#4A9EFF", label:"Hydrating",   pulse:false },
    full:  { emoji:"⚡", color:"#10B981", label:"Hydrated!",   pulse:true  },
  };
  const s = states[level];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <span style={{
        fontSize:22, lineHeight:1,
        display:"block",
        animation: s.pulse ? "pulse 1.2s ease-in-out infinite" : "none",
        filter: `drop-shadow(0 0 6px ${s.color}88)`,
      }}>{s.emoji}</span>
      <span style={{fontSize:8,color:s.color,fontWeight:700,letterSpacing:0.5,fontFamily:"'Bebas Neue',sans-serif"}}>{s.label}</span>
    </div>
  );
};

/* Calorie Flame — changes intensity based on net calorie balance */
const CalorieFlamSprite = ({ net, goal }) => {
  const pct = net / goal;
  const level = pct <= 0 ? "crushed" : pct < 0.6 ? "burning" : pct < 0.9 ? "steady" : pct < 1.1 ? "balanced" : "over";
  const states = {
    crushed:  { emoji:"🌟", color:"#10B981", label:"Crushed it!", pulse:true  },
    burning:  { emoji:"🔥", color:"#C9A84C", label:"On fire!",    pulse:true  },
    steady:   { emoji:"✨", color:"#F59E0B", label:"Steady",      pulse:false },
    balanced: { emoji:"⚖️",  color:"#4A9EFF", label:"Balanced",   pulse:false },
    over:     { emoji:"⚠️",  color:"#EF4444", label:"Over goal",  pulse:true  },
  };
  const s = states[level];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <span style={{
        fontSize:22, lineHeight:1,
        animation: s.pulse ? "pulse 1s ease-in-out infinite" : "none",
        filter: `drop-shadow(0 0 6px ${s.color}88)`,
      }}>{s.emoji}</span>
      <span style={{fontSize:8,color:s.color,fontWeight:700,letterSpacing:0.5,fontFamily:"'Bebas Neue',sans-serif"}}>{s.label}</span>
    </div>
  );
};

/* Streak Beast — the streak counter becomes a living creature */
const StreakBeast = ({ days }) => {
  const tier = days === 0 ? 0 : days < 3 ? 1 : days < 7 ? 2 : days < 14 ? 3 : days < 30 ? 4 : 5;
  const beasts = [
    { emoji:"😴", label:"Sleeping",   color:"#666",    title:"Start your streak!" },
    { emoji:"🐣", label:"Hatching",   color:"#F59E0B", title:"Just woke up" },
    { emoji:"🦊", label:"Awakening",  color:"#C9A84C", title:"Getting warmed up" },
    { emoji:"🐺", label:"Unleashed",  color:"#8B5CF6", title:"Week streak unlocked" },
    { emoji:"🦁", label:"Dominant",   color:"#10B981", title:"2-week warrior" },
    { emoji:"🐉", label:"LEGENDARY",  color:"#F59E0B", title:"30-day BEAST MODE" },
  ];
  const b = beasts[tier];
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{
        fontSize:26,
        animation: days > 0 ? "pulse 1.4s ease-in-out infinite" : "none",
        filter: `drop-shadow(0 0 8px ${b.color}99)`,
        display:"block",
      }}>{b.emoji}</span>
      <div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:b.color,letterSpacing:1,lineHeight:1}}>{days} DAY{days!==1?"S":""}</div>
        <div style={{fontSize:9,color:b.color,opacity:0.8,letterSpacing:1,fontWeight:700}}>{b.label.toUpperCase()}</div>
      </div>
    </div>
  );
};

/* XP / Level system */

export { HydrationSprite, CalorieFlamSprite, StreakBeast };
