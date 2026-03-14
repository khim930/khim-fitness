export const SPORT_FONT = "'Bebas Neue', 'Impact', sans-serif";
export const BODY_FONT  = "Georgia, 'Times New Roman', serif";

export const AVATARS = ["🦁","🐯","🦊","🐻","🐼","🦅","🐬","🌟","🔥","⚡","🌿","🏆"];
export const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const CATS    = ["All","Breakfast","Lunch","Dinner","Snack"];

export const GOALS = [
  { id:"lose",     label:"Lose Weight",    calAdj:-500, desc:"0.5kg/week deficit" },
  { id:"maintain", label:"Stay Healthy",   calAdj:0,    desc:"Maintain current weight" },
  { id:"gain",     label:"Build Muscle",   calAdj:300,  desc:"Lean bulk surplus" },
];

export const SPIRIT_ANIMALS = [
  { id:"silverback", name:"Silverback", emoji:"🦍", trait:"Strength",   color:"#8B5CF6", bg:"rgba(139,92,246,0.15)",  goal:"gain" },
  { id:"gazelle",    name:"Gazelle",    emoji:"🦌", trait:"Endurance",  color:"#10B981", bg:"rgba(16,185,129,0.15)",  goal:"lose" },
  { id:"owl",        name:"Wise Owl",   emoji:"🦉", trait:"Wellness",   color:"#4A9EFF", bg:"rgba(74,158,255,0.15)",  goal:"maintain" },
  { id:"panther",    name:"Panther",    emoji:"🐆", trait:"Agility",    color:"#F59E0B", bg:"rgba(245,158,11,0.15)",  goal:"lose" },
  { id:"bear",       name:"Bear",       emoji:"🐻", trait:"Resilience", color:"#EF4444", bg:"rgba(239,68,68,0.15)",   goal:"gain" },
  { id:"eagle",      name:"Eagle",      emoji:"🦅", trait:"Vision",     color:"#C9A84C", bg:"rgba(201,168,76,0.15)",  goal:"maintain" },
  { id:"wolf",       name:"Wolf",       emoji:"🐺", trait:"Pack",       color:"#6366F1", bg:"rgba(99,102,241,0.15)",  goal:"gain" },
  { id:"dolphin",    name:"Dolphin",    emoji:"🐬", trait:"Flow",       color:"#06B6D4", bg:"rgba(6,182,212,0.15)",   goal:"maintain" },
];

export const STORAGE_KEYS = {
  PROFILES:  "jhimfit_profiles_v4",
  SESSION:   "jhimfit_session",
  USER_DATA: "kfd_",
  AVATARS:   "jhimfit_animal_avatars_v1",
};
