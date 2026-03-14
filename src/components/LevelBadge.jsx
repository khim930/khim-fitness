import React from "react";

const calcLevel = (totalCaloriesLogged, streakDays, workoutsTotal) => {
  const xp = totalCaloriesLogged * 0.1 + streakDays * 50 + workoutsTotal * 30;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  return { level: Math.min(level, 99), xp: Math.round(xp), xpInLevel: Math.round(xpInLevel), xpToNext: 500 };
};

const LevelBadge = ({ level, xpInLevel, xpToNext, color }) => (
  <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"6px 10px"}}>
    <div style={{
      width:32, height:32, borderRadius:"50%",
      background:`conic-gradient(${color} ${(xpInLevel/xpToNext)*360}deg, rgba(255,255,255,0.08) 0deg)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative",
    }}>
      <div style={{width:24,height:24,borderRadius:"50%",background:"#0d1320",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color,lineHeight:1}}>{level}</span>
      </div>
    </div>
    <div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color,letterSpacing:1}}>LEVEL {level}</div>
      <div style={{fontSize:8,color:"rgba(240,237,232,0.35)",letterSpacing:0.5}}>{xpInLevel}/{xpToNext} XP</div>
    </div>
  </div>
);

export { calcLevel, LevelBadge };
