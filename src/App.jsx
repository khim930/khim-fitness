import { useState, useEffect } from "react";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const GHANAIAN_MEALS = [
  // BREAKFAST
  { id:1,  name:"Tom Brown Porridge",       category:"Breakfast", calories:180, protein:6,  carbs:35, fat:3,  emoji:"🌾", description:"Roasted corn & groundnut porridge — traditional morning fuel",             benefits:["Slow release energy","Gut friendly","Low fat"],        color:"#a0522d" },
  { id:2,  name:"Koose (Bean Cakes)",        category:"Breakfast", calories:210, protein:9,  carbs:28, fat:8,  emoji:"🫓", description:"Deep-fried black-eyed pea fritters — beloved Ghanaian street-food snack", benefits:["Plant protein","Quick energy","Portable"],              color:"#d4a017" },
  { id:3,  name:"Hausa Koko & Koose",        category:"Breakfast", calories:260, protein:8,  carbs:42, fat:7,  emoji:"🍵", description:"Spiced millet porridge paired with crispy bean cakes",                    benefits:["Iron rich","Warming","Balanced carbs"],                 color:"#b8600a" },
  { id:4,  name:"Boiled Yam & Egg Stew",    category:"Breakfast", calories:320, protein:14, carbs:44, fat:9,  emoji:"🥚", description:"Hearty boiled yam slices with spiced tomato egg sauce",                  benefits:["High protein","Sustaining","Vitamin B12"],             color:"#c4860a" },
  // LUNCH
  { id:5,  name:"Jollof Rice",              category:"Lunch",     calories:420, protein:12, carbs:68, fat:11, emoji:"🍚", description:"Smoky tomato-based one-pot rice — Ghana's most celebrated dish",          benefits:["High energy","Lycopene rich","Iron source"],           color:"#e05c2a" },
  { id:6,  name:"Waakye",                   category:"Lunch",     calories:380, protein:14, carbs:62, fat:8,  emoji:"🫘", description:"Rice & beans cooked with sorghum leaves — a street-food classic",        benefits:["Complete protein","High fibre","Low glycaemic"],       color:"#8b4513" },
  { id:7,  name:"Banku & Tilapia",          category:"Lunch",     calories:510, protein:38, carbs:52, fat:14, emoji:"🐟", description:"Fermented corn & cassava dumpling with grilled whole tilapia",           benefits:["High protein","Omega-3","Probiotic benefits"],         color:"#1a7a4a" },
  { id:8,  name:"Ampesi & Palava Sauce",    category:"Lunch",     calories:340, protein:11, carbs:55, fat:10, emoji:"🍠", description:"Boiled yam & plantain served with rich leafy cocoyam sauce",             benefits:["Complex carbs","Potassium rich","Filling"],            color:"#c4860a" },
  { id:9,  name:"Rice & Stew",              category:"Lunch",     calories:390, protein:15, carbs:60, fat:12, emoji:"🍛", description:"Plain white rice smothered in rich Ghanaian tomato-based chicken stew",  benefits:["Balanced macros","Protein rich","Comforting"],         color:"#cc4e1a" },
  { id:10, name:"Kenkey & Fried Fish",      category:"Lunch",     calories:480, protein:32, carbs:58, fat:13, emoji:"🌽", description:"Fermented corn dumpling with crispy fried fish and pepper sauce",       benefits:["High protein","Probiotic","Omega-3"],                  color:"#e09020" },
  // DINNER
  { id:11, name:"Fufu & Light Soup",        category:"Dinner",    calories:460, protein:24, carbs:62, fat:12, emoji:"🍲", description:"Pounded cassava & plantain served in a light, spiced chicken soup",     benefits:["High energy","Digestive aid","Protein rich"],          color:"#2d7a5a" },
  { id:12, name:"Omotuo & Groundnut Soup",  category:"Dinner",    calories:460, protein:22, carbs:58, fat:16, emoji:"🥜", description:"Soft rice balls in deep, rich groundnut (peanut) soup with chicken",   benefits:["Healthy fats","High protein","Energy dense"],          color:"#b5541e" },
  { id:13, name:"Kontomire Stew & Rice",    category:"Dinner",    calories:350, protein:18, carbs:48, fat:14, emoji:"🥬", description:"Cocoyam leaves stewed with smoked fish & palm oil served over rice",    benefits:["Very high iron","Vitamin A","Antioxidants"],           color:"#2d6a2d" },
  { id:14, name:"Egusi Soup & Fufu",        category:"Dinner",    calories:520, protein:28, carbs:54, fat:22, emoji:"🌿", description:"Ground melon-seed soup with leafy greens, fish & beef over fufu",      benefits:["Protein packed","Zinc rich","Filling"],                color:"#5a7a2a" },
  { id:15, name:"Palm Nut Soup & Rice",     category:"Dinner",    calories:490, protein:26, carbs:52, fat:20, emoji:"🫙", description:"Velvety palm nut soup with chicken and crabs — festive favourite",     benefits:["Vitamin E","Beta-carotene","Iron"],                    color:"#c04020" },
  { id:16, name:"Abunabun (Garden Egg Stew)",category:"Dinner",   calories:280, protein:12, carbs:30, fat:14, emoji:"🍆", description:"Roasted garden egg (eggplant) stew with smoked fish and tomatoes",     benefits:["Low calorie","Antioxidants","Fibre rich"],             color:"#6a3a8a" },
  { id:17, name:"Tuo Zaafi & Ayoyo",        category:"Dinner",    calories:410, protein:16, carbs:66, fat:9,  emoji:"🌾", description:"Northern Ghana staple — thick millet porridge with jute leaf soup",    benefits:["Iron rich","High fibre","Traditional"],               color:"#3a6a3a" },
  { id:18, name:"Chicken Peanut Stew",      category:"Dinner",    calories:440, protein:34, carbs:28, fat:22, emoji:"🍗", description:"Slow-simmered chicken in a thick, aromatic groundnut sauce",           benefits:["High protein","Healthy fats","Vitamin B6"],           color:"#b5700a" },
  // SNACKS
  { id:19, name:"Kelewele",                 category:"Snack",     calories:190, protein:2,  carbs:38, fat:6,  emoji:"🍌", description:"Spiced fried plantain cubes — a sweet and fiery street-food treat",    benefits:["Quick energy","Potassium","Antioxidants"],             color:"#e0a020" },
  { id:20, name:"Roasted Groundnuts",       category:"Snack",     calories:170, protein:8,  carbs:10, fat:12, emoji:"🥜", description:"Salted roasted peanuts — the most popular Ghanaian on-the-go snack",  benefits:["Healthy fats","Plant protein","Satisfying"],           color:"#a06020" },
];

const WORKOUTS = [
  { id:1, name:"Morning Jog",       icon:"🏃", calories:280, duration:30 },
  { id:2, name:"Strength Training", icon:"💪", calories:350, duration:45 },
  { id:3, name:"Dance Aerobics",    icon:"💃", calories:320, duration:40 },
  { id:4, name:"Cycling",           icon:"🚴", calories:400, duration:45 },
  { id:5, name:"Swimming",          icon:"🏊", calories:450, duration:60 },
  { id:6, name:"Yoga",              icon:"🧘", calories:150, duration:45 },
  { id:7, name:"Football",          icon:"⚽", calories:500, duration:60 },
  { id:8, name:"Jump Rope",         icon:"🪢", calories:370, duration:30 },
];

const GOALS = [
  { id:"lose",     label:"Lose Weight",   icon:"🔥", desc:"Calorie deficit focus",    calAdj:-300 },
  { id:"maintain", label:"Stay Fit",      icon:"⚖️", desc:"Balanced maintenance",     calAdj:0    },
  { id:"gain",     label:"Build Muscle",  icon:"💪", desc:"Calorie surplus + protein", calAdj:300  },
];

const AVATARS = ["🦁","🐯","🦊","🐻","🐼","🦅","🐬","🌟","🔥","⚡","🌿","🏆"];
const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const fmt     = (d) => d.toISOString().split("T")[0];
const TODAY   = fmt(new Date());
const CATS    = ["All","Breakfast","Lunch","Dinner","Snack"];

function calcCalGoal(p) {
  const { weight, height, age, sex, activity, goal } = p;
  if (!weight || !height || !age) return 2000;
  const base = sex === "female"
    ? 10*+weight + 6.25*+height - 5*+age - 161
    : 10*+weight + 6.25*+height - 5*+age + 5;
  const actMap = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };
  return Math.round(base*(actMap[activity]||1.375)) + (GOALS.find(g=>g.id===goal)?.calAdj||0);
}

const PK = "khimfit_profiles_v4";
const lp  = () => { try { return JSON.parse(localStorage.getItem(PK)||"{}"); } catch { return {}; } };
const sp  = (v) => localStorage.setItem(PK, JSON.stringify(v));
const ld  = (uid) => { try { return JSON.parse(localStorage.getItem(`kfd_${uid}`)||"{}"); } catch { return {}; } };
const sd  = (uid,v) => localStorage.setItem(`kfd_${uid}`, JSON.stringify(v));

/* ─── Responsive hook ────────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

/* ─── Onboarding ─────────────────────────────────────────────────────────── */
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", avatar:"🦁", age:"", sex:"male", weight:"", height:"", activity:"moderate", goal:"maintain" });
  const existing = Object.values(lp());
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const finish = () => {
    const profile = { ...form, name:form.name.trim(),
      id: form.name.trim().toLowerCase().replace(/\s+/g,"_")+"_"+Date.now(),
      calorieGoal: calcCalGoal(form), createdAt: TODAY };
    const all = lp(); all[profile.name] = profile; sp(all);
    onComplete(profile);
  };

  const card = { background:"#141820", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:28 };

  const steps = [
    /* 0 – Welcome */
    <div key="w" style={{textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>🇬🇭</div>
      <div style={{fontSize:36,fontWeight:900,letterSpacing:-1.5,marginBottom:8}}>Khim<span style={{color:"#e05c2a"}}>Fit</span></div>
      <div style={{fontSize:15,color:"rgba(240,237,232,0.5)",lineHeight:1.8,marginBottom:40}}>Your personal Ghanaian fitness<br/>& nutrition tracker</div>
      {existing.length>0 && <>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:14}}>Existing Profiles</div>
        {existing.map(p=>(
          <button key={p.id} onClick={()=>onComplete(p)} style={{width:"100%",...card,padding:"14px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:16,color:"#f0ede8",textAlign:"left",border:"1px solid rgba(255,255,255,0.1)"}}>
            <span style={{fontSize:34}}>{p.avatar}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:17}}>{p.name}</div>
              <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2}}>{GOALS.find(g=>g.id===p.goal)?.label} · {p.weight}kg · {p.calorieGoal} kcal/day</div>
            </div>
            <span style={{color:"#e05c2a",fontSize:22}}>→</span>
          </button>
        ))}
        <div style={{color:"rgba(240,237,232,0.25)",fontSize:13,margin:"16px 0"}}>— or create a new profile —</div>
      </>}
      <button onClick={()=>setStep(1)} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:16,padding:"17px",color:"#fff",fontWeight:900,fontSize:17,cursor:"pointer",letterSpacing:0.5}}>
        {existing.length>0?"+ New Profile":"Get Started →"}
      </button>
    </div>,

    /* 1 – Name & Avatar */
    <div key="n">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>What's your name?</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:24}}>Personalises your entire experience</div>
      <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name"
        style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,padding:"16px 18px",color:"#f0ede8",fontSize:22,fontWeight:900,outline:"none",fontFamily:"Georgia",boxSizing:"border-box",marginBottom:26}}/>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Choose your avatar</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9,marginBottom:30}}>
        {AVATARS.map(a=>(
          <button key={a} onClick={()=>set("avatar",a)} style={{background:form.avatar===a?"rgba(224,92,42,0.3)":"rgba(255,255,255,0.05)",border:`2px solid ${form.avatar===a?"#e05c2a":"transparent"}`,borderRadius:13,padding:"11px 0",fontSize:28,cursor:"pointer",transition:"all 0.2s"}}>{a}</button>
        ))}
      </div>
      <button disabled={!form.name.trim()} onClick={()=>setStep(2)}
        style={{width:"100%",background:form.name.trim()?"#e05c2a":"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"16px",color:form.name.trim()?"#fff":"rgba(255,255,255,0.25)",fontWeight:800,fontSize:16,cursor:form.name.trim()?"pointer":"default"}}>
        Continue →
      </button>
    </div>,

    /* 2 – Body stats */
    <div key="s">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>Your body stats</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:26}}>We calculate your personalised calorie goal</div>
      {[{l:"Age",k:"age",u:"yrs",p:"e.g. 25"},{l:"Weight",k:"weight",u:"kg",p:"e.g. 70"},{l:"Height",k:"height",u:"cm",p:"e.g. 170"}].map(f=>(
        <div key={f.k} style={{marginBottom:18}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:8}}>{f.l}</div>
          <div style={{position:"relative"}}>
            <input type="number" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p}
              style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:13,padding:"14px 50px 14px 16px",color:"#f0ede8",fontSize:17,outline:"none",fontFamily:"Georgia",boxSizing:"border-box"}}/>
            <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>{f.u}</span>
          </div>
        </div>
      ))}
      <div style={{marginBottom:22}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:10}}>Sex</div>
        <div style={{display:"flex",gap:10}}>
          {["male","female"].map(s=>(
            <button key={s} onClick={()=>set("sex",s)} style={{flex:1,background:form.sex===s?"rgba(224,92,42,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${form.sex===s?"#e05c2a":"rgba(255,255,255,0.1)"}`,borderRadius:13,padding:"12px",color:form.sex===s?"#e05c2a":"rgba(240,237,232,0.5)",cursor:"pointer",fontSize:15,transition:"all 0.2s"}}>
              {s==="male"?"♂ Male":"♀ Female"}
            </button>
          ))}
        </div>
      </div>
      <button onClick={()=>setStep(3)} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>Continue →</button>
    </div>,

    /* 3 – Activity & Goal */
    <div key="g">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>Activity & Goal</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:22}}>Fine-tune your daily calorie target</div>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:11}}>Activity Level</div>
      {[{id:"sedentary",l:"Sedentary",d:"Little or no exercise"},{id:"light",l:"Lightly Active",d:"1–3 days/week"},{id:"moderate",l:"Moderately Active",d:"3–5 days/week"},{id:"active",l:"Very Active",d:"6–7 days/week"}].map(a=>(
        <button key={a.id} onClick={()=>set("activity",a.id)} style={{width:"100%",background:form.activity===a.id?"rgba(224,92,42,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${form.activity===a.id?"#e05c2a":"rgba(255,255,255,0.08)"}`,borderRadius:13,padding:"12px 16px",marginBottom:9,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#f0ede8",transition:"all 0.2s"}}>
          <span style={{fontWeight:700,fontSize:14}}>{a.l}</span>
          <span style={{fontSize:12,color:"rgba(240,237,232,0.4)"}}>{a.d}</span>
        </button>
      ))}
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",margin:"20px 0 12px"}}>Your Goal</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {GOALS.map(g=>(
          <button key={g.id} onClick={()=>set("goal",g.id)} style={{background:form.goal===g.id?"rgba(224,92,42,0.2)":"rgba(255,255,255,0.04)",border:`1px solid ${form.goal===g.id?"#e05c2a":"rgba(255,255,255,0.08)"}`,borderRadius:15,padding:"16px 8px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
            <div style={{fontSize:28,marginBottom:6}}>{g.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:form.goal===g.id?"#e05c2a":"#f0ede8"}}>{g.label}</div>
          </button>
        ))}
      </div>
      <div style={{background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.25)",borderRadius:14,padding:"14px 18px",marginBottom:22,textAlign:"center"}}>
        <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginBottom:4}}>YOUR ESTIMATED DAILY CALORIE GOAL</div>
        <div style={{fontSize:30,fontWeight:900,color:"#e05c2a"}}>{calcCalGoal(form)} <span style={{fontSize:15,fontWeight:400}}>kcal</span></div>
      </div>
      <button onClick={finish} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:16,padding:"18px",color:"#fff",fontWeight:900,fontSize:18,cursor:"pointer",letterSpacing:0.5}}>🚀 Start My Journey</button>
    </div>
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"Georgia,serif",color:"#f0ede8"}}>
      <div style={{width:"100%",maxWidth:480}}>
        {step>0 && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:30}}>
            <button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",cursor:"pointer",fontSize:14,padding:0}}>← Back</button>
            <div style={{display:"flex",gap:6}}>
              {[1,2,3].map(i=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i<=step?"#e05c2a":"rgba(255,255,255,0.1)",transition:"all 0.3s"}}/>)}
            </div>
          </div>
        )}
        {steps[step]}
        {/* Footer credit */}
        <div style={{textAlign:"center",marginTop:32,fontSize:11,color:"rgba(240,237,232,0.2)",letterSpacing:1}}>
          BUILT BY JOACHIM · KHIMFIT v2.0
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Profile ───────────────────────────────────────────────────────── */
function EditProfile({ profile, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({...profile});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => {
    const u = {...form, calorieGoal: calcCalGoal(form)};
    const all = lp(); if(form.name!==profile.name) delete all[profile.name];
    all[u.name]=u; sp(all); onSave(u);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#141820",borderRadius:22,padding:28,width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",color:"#f0ede8"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:900}}>Edit Profile</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",fontSize:24,cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7,marginBottom:22}}>
          {AVATARS.map(a=><button key={a} onClick={()=>set("avatar",a)} style={{background:form.avatar===a?"rgba(224,92,42,0.3)":"rgba(255,255,255,0.05)",border:`2px solid ${form.avatar===a?"#e05c2a":"transparent"}`,borderRadius:11,padding:"9px 0",fontSize:24,cursor:"pointer"}}>{a}</button>)}
        </div>
        {[{l:"Name",k:"name",t:"text"},{l:"Age",k:"age",t:"number"},{l:"Weight (kg)",k:"weight",t:"number"},{l:"Height (cm)",k:"height",t:"number"}].map(f=>(
          <div key={f.k} style={{marginBottom:16}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:7}}>{f.l}</div>
            <input type={f.t} value={form[f.k]} onChange={e=>set(f.k,e.target.value)}
              style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:11,padding:"12px 15px",color:"#f0ede8",fontSize:15,outline:"none",fontFamily:"Georgia",boxSizing:"border-box"}}/>
          </div>
        ))}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:10}}>Goal</div>
          <div style={{display:"flex",gap:9}}>
            {GOALS.map(g=><button key={g.id} onClick={()=>set("goal",g.id)} style={{flex:1,background:form.goal===g.id?"rgba(224,92,42,0.2)":"rgba(255,255,255,0.05)",border:`1px solid ${form.goal===g.id?"#e05c2a":"rgba(255,255,255,0.08)"}`,borderRadius:11,padding:"10px 4px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22}}>{g.icon}</div>
              <div style={{fontSize:10,color:form.goal===g.id?"#e05c2a":"rgba(240,237,232,0.5)",marginTop:3}}>{g.label}</div>
            </button>)}
          </div>
        </div>
        <div style={{background:"rgba(224,92,42,0.09)",border:"1px solid rgba(224,92,42,0.22)",borderRadius:12,padding:"11px 16px",marginBottom:18,textAlign:"center"}}>
          <span style={{fontSize:12,color:"rgba(240,237,232,0.4)"}}>New calorie goal: </span>
          <span style={{fontSize:18,fontWeight:900,color:"#e05c2a"}}>{calcCalGoal(form)} kcal/day</span>
        </div>
        <button onClick={save} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:14,padding:"15px",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",marginBottom:10}}>Save Changes</button>
        <button onClick={onDelete} style={{width:"100%",background:"rgba(255,50,50,0.08)",border:"1px solid rgba(255,50,50,0.2)",borderRadius:14,padding:"12px",color:"rgba(255,110,110,0.75)",cursor:"pointer",fontSize:13}}>Delete This Profile</button>
      </div>
    </div>
  );
}

/* ─── Meal Row (no image) ────────────────────────────────────────────────── */
function MealCard({ meal, isSelected, onSelect, onLog }) {
  return (
    <div onClick={onSelect} style={{
      background: isSelected ? `linear-gradient(135deg,${meal.color}1a,${meal.color}0d)` : "rgba(255,255,255,0.025)",
      border: `1px solid ${isSelected ? meal.color+"88" : "rgba(255,255,255,0.07)"}`,
      borderRadius:16, marginBottom:10, cursor:"pointer", overflow:"hidden",
      transition:"all 0.22s ease"
    }}>
      {/* Header row */}
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px"}}>
        <div style={{width:48,height:48,borderRadius:13,background:`${meal.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
          {meal.emoji}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div>
              <div style={{fontWeight:800,fontSize:15,lineHeight:1.2}}>{meal.name}</div>
              <div style={{fontSize:10,color:meal.color,letterSpacing:2,marginTop:3,textTransform:"uppercase"}}>{meal.category}</div>
            </div>
            <div style={{background:`${meal.color}22`,border:`1px solid ${meal.color}44`,borderRadius:20,padding:"4px 12px",fontSize:13,fontWeight:800,color:meal.color,flexShrink:0,whiteSpace:"nowrap"}}>
              {meal.calories} kcal
            </div>
          </div>
          <div style={{fontSize:12,color:"rgba(240,237,232,0.45)",marginTop:5,lineHeight:1.5}}>{meal.description}</div>
        </div>
      </div>

      {/* Macro bar */}
      <div style={{display:"flex",borderTop:`1px solid rgba(255,255,255,0.05)`}}>
        {[{l:"Protein",v:meal.protein,c:"#4fc3a1"},{l:"Carbs",v:meal.carbs,c:"#f0a500"},{l:"Fat",v:meal.fat,c:"#e05c2a"}].map((m,i)=>(
          <div key={m.l} style={{flex:1,padding:"9px 0",textAlign:"center",borderRight:i<2?"1px solid rgba(255,255,255,0.05)":undefined}}>
            <div style={{fontSize:14,fontWeight:800,color:m.c}}>{m.v}g</div>
            <div style={{fontSize:9,color:"rgba(240,237,232,0.35)",letterSpacing:1,textTransform:"uppercase"}}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Expanded */}
      {isSelected && (
        <div style={{padding:"14px 16px",borderTop:`1px solid rgba(255,255,255,0.05)`}}>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
            {meal.benefits.map(b=>(
              <span key={b} style={{background:`${meal.color}1a`,border:`1px solid ${meal.color}44`,color:meal.color,borderRadius:20,padding:"4px 12px",fontSize:11}}>✓ {b}</span>
            ))}
          </div>
          <button onClick={e=>{e.stopPropagation();onLog();}} style={{width:"100%",background:meal.color,border:"none",borderRadius:12,padding:"14px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",letterSpacing:0.5}}>
            + Log {meal.name}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
const StatCard = ({label,val,unit,color}) => (
  <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px 18px"}}>
    <div style={{fontSize:26,fontWeight:900,color}}>{val}</div>
    <div style={{fontSize:10,color,opacity:0.7,marginTop:1}}>{unit}</div>
    <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:5}}>{label}</div>
  </div>
);

/* ─── Main App ───────────────────────────────────────────────────────────── */
export default function KhimFitness() {
  const isMobile = useIsMobile();
  const [profile, setProfile]     = useState(null);
  const [tab, setTab]             = useState("home");
  const [data, setData]           = useState({ log:{}, workoutLog:{}, water:{}, weightLog:{} });
  const [weightInput, setWI]      = useState("");
  const [selectedMeal, setSM]     = useState(null);
  const [filterCat, setFC]        = useState("All");
  const [toast, setToast]         = useState(null);
  const [showEdit, setShowEdit]   = useState(false);
  const [showSwitch, setShowSw]   = useState(false);

  useEffect(() => {
    if (!profile) return;
    const s = ld(profile.id);
    setData({ log:s.log||{}, workoutLog:s.workoutLog||{}, water:s.water||{}, weightLog:s.weightLog||{} });
  }, [profile?.id]);

  useEffect(() => {
    if (!profile) return;
    sd(profile.id, data);
  }, [data, profile?.id]);

  const toast_ = (msg, color="#1a7a4a") => { setToast({msg,color}); setTimeout(()=>setToast(null),2500); };
  if (!profile) return <Onboarding onComplete={p=>{ setProfile(p); setTab("home"); }}/>;

  const { log, workoutLog, water, weightLog } = data;
  const calGoal     = profile.calorieGoal||2000;
  const tMeals      = log[TODAY]||[];
  const tWorkouts   = workoutLog[TODAY]||[];
  const tWater      = water[TODAY]||0;
  const totCal      = tMeals.reduce((s,m)=>s+m.calories,0);
  const totPro      = tMeals.reduce((s,m)=>s+m.protein,0);
  const totCarb     = tMeals.reduce((s,m)=>s+m.carbs,0);
  const totFat      = tMeals.reduce((s,m)=>s+m.fat,0);
  const burned      = tWorkouts.reduce((s,w)=>s+w.calories,0);
  const netCal      = totCal - burned;
  const calPct      = Math.min((totCal/calGoal)*100,100);
  const waterGoal   = 8;

  const upd  = (k,v) => setData(d=>({...d,[k]:v}));
  const addM = m  => { upd("log",{...log,[TODAY]:[...(log[TODAY]||[]),{...m,logId:Date.now()}]}); toast_(`${m.emoji} ${m.name} added!`); setSM(null); };
  const rmM  = id => upd("log",{...log,[TODAY]:(log[TODAY]||[]).filter(m=>m.logId!==id)});
  const addW = w  => { upd("workoutLog",{...workoutLog,[TODAY]:[...(workoutLog[TODAY]||[]),{...w,logId:Date.now()}]}); toast_(`${w.icon} ${w.name} logged!`,"#e05c2a"); };
  const addWater = () => { upd("water",{...water,[TODAY]:(water[TODAY]||0)+1}); toast_("💧 +250ml logged!","#1e90ff"); };
  const saveWt   = () => { if(!weightInput) return; upd("weightLog",{...weightLog,[TODAY]:parseFloat(weightInput)}); toast_(`⚖️ ${weightInput}kg saved!`); setWI(""); };

  const weekStats = DAYS.map((d,i)=>{ const dt=new Date(); dt.setDate(dt.getDate()-(6-i)); const k=fmt(dt); const ms=log[k]||[]; const ws=workoutLog[k]||[]; return {day:d,cals:ms.reduce((s,m)=>s+m.calories,0),burned:ws.reduce((s,w)=>s+w.calories,0),w:weightLog[k]||null}; });
  const maxCals   = Math.max(...weekStats.map(s=>s.cals),calGoal,1);
  const filtered  = filterCat==="All" ? GHANAIAN_MEALS : GHANAIAN_MEALS.filter(m=>m.category===filterCat);
  const others    = Object.values(lp()).filter(p=>p.id!==profile.id);

  const delProfile = () => { const a=lp(); delete a[profile.name]; sp(a); localStorage.removeItem(`kfd_${profile.id}`); setProfile(null); setShowEdit(false); };

  /* Layout constants */
  const sideW   = 260;
  const contentPad = isMobile ? "16px" : "28px 32px";
  const navItems = [{id:"home",icon:"⌂",label:"Home"},{id:"diet",icon:"🍽",label:"Diet"},{id:"workout",icon:"🏋",label:"Workout"},{id:"stats",icon:"📊",label:"Stats"}];

  /* ── Sidebar (desktop) ── */
  const Sidebar = () => (
    <div style={{width:sideW,flexShrink:0,background:"#0e1218",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
      {/* Logo */}
      <div style={{padding:"28px 24px 20px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:4}}>Fitness & Nutrition</div>
        <div style={{fontSize:28,fontWeight:900,letterSpacing:-1}}>Khim<span style={{color:"#e05c2a"}}>Fit</span></div>
      </div>

      {/* Profile */}
      <button onClick={()=>setShowEdit(true)} style={{margin:"0 14px",background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.25)",borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,color:"#f0ede8",marginBottom:10}}>
        <span style={{fontSize:30}}>{profile.avatar}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.name}</div>
          <div style={{fontSize:11,color:"#e05c2a",marginTop:2}}>{calGoal} kcal goal</div>
        </div>
        <span style={{fontSize:12,color:"rgba(240,237,232,0.3)"}}>✏️</span>
      </button>

      {others.length>0 && (
        <button onClick={()=>setShowSw(true)} style={{margin:"0 14px 20px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"9px 14px",cursor:"pointer",color:"rgba(240,237,232,0.5)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
          <span>👥</span> Switch Profile ({others.length})
        </button>
      )}

      {/* Nav */}
      <nav style={{flex:1,padding:"0 14px"}}>
        {navItems.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",background:tab===t.id?"rgba(224,92,42,0.15)":"transparent",border:`1px solid ${tab===t.id?"rgba(224,92,42,0.4)":"transparent"}`,borderRadius:13,padding:"13px 16px",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:tab===t.id?"#e05c2a":"rgba(240,237,232,0.55)",fontSize:15,textAlign:"left",fontWeight:tab===t.id?700:400,transition:"all 0.2s"}}>
            <span style={{fontSize:20}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {/* Footer credit */}
      <div style={{padding:"16px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",fontSize:10,color:"rgba(240,237,232,0.2)",letterSpacing:1,lineHeight:1.8}}>
        KHIMFIT v2.0<br/>
        BUILT BY JOACHIM<br/>
        🇬🇭 ACCRA, GHANA
      </div>
    </div>
  );

  /* ── Bottom nav (mobile) ── */
  const BottomNav = () => (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.07)",display:"grid",gridTemplateColumns:"repeat(4,1fr)",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {navItems.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"12px 0 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <span style={{fontSize:21,filter:tab===t.id?"none":"grayscale(1) opacity(0.38)"}}>{t.icon}</span>
          <span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:tab===t.id?"#e05c2a":"rgba(240,237,232,0.3)"}}>{t.label}</span>
          {tab===t.id&&<div style={{width:18,height:2.5,background:"#e05c2a",borderRadius:2}}/>}
        </button>
      ))}
    </div>
  );

  /* ── Shared content sections ── */
  const HomeContent = () => (
    <div>
      <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginBottom:20}}>{new Date().toLocaleDateString("en-GH",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>

      {/* Calorie ring + stats */}
      <div style={{background:"linear-gradient(135deg,#1a1f2e,#141820)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"22px 24px",marginBottom:16,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
        <svg width={96} height={96} style={{flexShrink:0}}>
          <circle cx={48} cy={48} r={38} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9}/>
          <circle cx={48} cy={48} r={38} fill="none" stroke={calPct>=100?"#e03030":"#e05c2a"} strokeWidth={9}
            strokeDasharray={`${2*Math.PI*38}`} strokeDashoffset={`${2*Math.PI*38*(1-calPct/100)}`}
            strokeLinecap="round" transform="rotate(-90 48 48)" style={{transition:"stroke-dashoffset 0.7s ease"}}/>
          <text x={48} y={44} textAnchor="middle" fill="#f0ede8" fontSize={16} fontWeight="800" fontFamily="Georgia">{totCal}</text>
          <text x={48} y={60} textAnchor="middle" fill="rgba(240,237,232,0.4)" fontSize={9} fontFamily="Georgia">kcal eaten</text>
        </svg>
        <div style={{flex:1,display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,minWidth:180}}>
          {[{l:"Goal",v:calGoal,u:"kcal",c:"#e05c2a"},{l:"Burned",v:burned,u:"kcal",c:"#1a7a4a"},{l:"Net",v:netCal,u:"kcal",c:netCal>calGoal?"#e03030":"#4fc3a1"},{l:"Protein",v:totPro,u:"g",c:"#f0a500"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,0.04)",borderRadius:11,padding:"9px 12px"}}>
              <div style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}<span style={{fontSize:10,fontWeight:400}}> {s.u}</span></div>
              <div style={{fontSize:10,color:"rgba(240,237,232,0.4)",marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal badge */}
      <div style={{background:"rgba(224,92,42,0.08)",border:"1px solid rgba(224,92,42,0.2)",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:24}}>{GOALS.find(g=>g.id===profile.goal)?.icon}</span>
        <div>
          <div style={{fontWeight:700,fontSize:13}}>{GOALS.find(g=>g.id===profile.goal)?.label} Mode</div>
          <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{GOALS.find(g=>g.id===profile.goal)?.desc} · {calGoal} kcal/day target</div>
        </div>
      </div>

      {/* Macros */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",marginBottom:14,textTransform:"uppercase"}}>Macros Today</div>
        {[{l:"Carbohydrates",v:totCarb,max:250,c:"#e05c2a"},{l:"Protein",v:totPro,max:profile.goal==="gain"?120:80,c:"#1a7a4a"},{l:"Fat",v:totFat,max:65,c:"#f0a500"}].map(m=>(
          <div key={m.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
              <span style={{color:"rgba(240,237,232,0.6)"}}>{m.l}</span>
              <span style={{color:m.c,fontWeight:700}}>{m.v}g / {m.max}g</span>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:10}}>
              <div style={{height:"100%",borderRadius:10,background:m.c,width:`${Math.min((m.v/m.max)*100,100)}%`,transition:"width 0.6s"}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Water */}
      <div style={{background:"rgba(30,144,255,0.08)",border:"1px solid rgba(30,144,255,0.2)",borderRadius:16,padding:"16px 18px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(30,144,255,0.75)",textTransform:"uppercase"}}>Water Intake</div>
            <div style={{fontSize:20,fontWeight:800,marginTop:3}}>{tWater} <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>/ {waterGoal} glasses</span></div>
          </div>
          <button onClick={addWater} style={{background:"rgba(30,144,255,0.2)",border:"1px solid rgba(30,144,255,0.4)",color:"#7ab8ff",borderRadius:13,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>+ 250ml</button>
        </div>
        <div style={{display:"flex",gap:6}}>
          {Array.from({length:waterGoal}).map((_,i)=>(
            <div key={i} style={{flex:1,height:26,borderRadius:7,background:i<tWater?"rgba(30,144,255,0.6)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"background 0.3s"}}>
              {i<tWater&&"💧"}
            </div>
          ))}
        </div>
      </div>

      {/* Today's meals */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Today's Meals</div>
        {tMeals.length===0
          ? <div style={{background:"rgba(255,255,255,0.03)",border:"1px dashed rgba(255,255,255,0.1)",borderRadius:14,padding:24,textAlign:"center",color:"rgba(240,237,232,0.3)",fontSize:14}}>No meals logged yet — go to the Diet tab 🍽️</div>
          : tMeals.map(m=>(
            <div key={m.logId} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"11px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:`${m.color||"#e05c2a"}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{m.emoji}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>{m.name}</div>
                  <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{m.calories} kcal · {m.protein}g protein · {m.carbs}g carbs</div>
                </div>
              </div>
              <button onClick={()=>rmM(m.logId)} style={{background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.2)",color:"#e05c2a",borderRadius:9,padding:"4px 12px",cursor:"pointer",fontSize:13,flexShrink:0}}>✕</button>
            </div>
          ))
        }
      </div>

      {/* Weight */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px 18px"}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Log Today's Weight</div>
        <div style={{display:"flex",gap:10}}>
          <input type="number" placeholder={`e.g. ${profile.weight||"70"}`} value={weightInput} onChange={e=>setWI(e.target.value)}
            style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:11,padding:"11px 15px",color:"#f0ede8",fontSize:15,outline:"none",fontFamily:"Georgia"}}/>
          <button onClick={saveWt} style={{background:"#e05c2a",border:"none",borderRadius:11,padding:"11px 20px",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:14,flexShrink:0}}>Save kg</button>
        </div>
        {weightLog[TODAY] && <div style={{marginTop:10,fontSize:13,color:"#4fc3a1"}}>⚖️ Today: {weightLog[TODAY]}kg recorded</div>}
      </div>
    </div>
  );

  const DietContent = () => (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Ghanaian Diet Guide 🇬🇭</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.45)"}}>Tap any meal to expand details and log it</div>
      </div>
      {/* Category tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setFC(c)} style={{background:filterCat===c?"#e05c2a":"rgba(255,255,255,0.06)",border:filterCat===c?"none":"1px solid rgba(255,255,255,0.1)",color:filterCat===c?"#fff":"rgba(240,237,232,0.6)",borderRadius:22,padding:"7px 18px",cursor:"pointer",fontSize:13,whiteSpace:"nowrap",fontWeight:filterCat===c?700:400,transition:"all 0.2s"}}>
            {c}
          </button>
        ))}
      </div>
      {/* Meal count */}
      <div style={{fontSize:11,color:"rgba(240,237,232,0.3)",marginBottom:14,letterSpacing:1}}>{filtered.length} MEALS</div>
      {filtered.map(meal=>(
        <MealCard key={meal.id} meal={meal}
          isSelected={selectedMeal?.id===meal.id}
          onSelect={()=>setSM(selectedMeal?.id===meal.id?null:meal)}
          onLog={()=>addM(meal)}/>
      ))}
    </div>
  );

  const WorkoutContent = () => (
    <div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Workouts</div>
      <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:20}}>Log your activity to track calorie burn</div>
      {tWorkouts.length>0 && (
        <div style={{background:"rgba(26,122,74,0.1)",border:"1px solid rgba(26,122,74,0.3)",borderRadius:16,padding:"16px 18px",marginBottom:20}}>
          <div style={{fontSize:11,letterSpacing:2,color:"#1a7a4a",textTransform:"uppercase",marginBottom:12}}>Logged Today</div>
          {tWorkouts.map(w=>(
            <div key={w.logId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,fontSize:14}}>
              <span>{w.icon} {w.name}</span>
              <span style={{color:"#4fc3a1",fontWeight:700}}>−{w.calories} kcal · {w.duration}min</span>
            </div>
          ))}
          <div style={{borderTop:"1px solid rgba(26,122,74,0.2)",marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>Total burned</span>
            <span style={{fontSize:17,color:"#4fc3a1",fontWeight:900}}>{burned} kcal</span>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
        {WORKOUTS.map(w=>(
          <div key={w.id} onClick={()=>addW(w)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"20px 14px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
            <div style={{fontSize:38,marginBottom:10}}>{w.icon}</div>
            <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{w.name}</div>
            <div style={{fontSize:12,color:"#e05c2a",fontWeight:600}}>{w.calories} kcal</div>
            <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginBottom:12}}>{w.duration} min</div>
            <div style={{background:"rgba(26,122,74,0.15)",border:"1px solid rgba(26,122,74,0.3)",borderRadius:9,padding:"5px 0",fontSize:12,color:"#4fc3a1",fontWeight:600}}>+ Log</div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatsContent = () => (
    <div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Weekly Stats</div>
      <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:22}}>7-day overview for {profile.name}</div>

      {/* Bar chart */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Calories vs Goal ({calGoal} kcal)</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
          {weekStats.map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div style={{width:"100%",height:90,display:"flex",flexDirection:"column",justifyContent:"flex-end",gap:2}}>
                {s.burned>0&&<div style={{width:"100%",background:"rgba(26,122,74,0.55)",height:`${(s.burned/maxCals)*90}px`,borderRadius:"5px 5px 0 0",minHeight:4}}/>}
                <div style={{width:"100%",background:s.cals>0?(s.cals>calGoal?"#e03030":"#e05c2a99"):"rgba(255,255,255,0.06)",height:`${(s.cals/maxCals)*90}px`,borderRadius:"5px 5px 0 0",minHeight:s.cals>0?5:2,transition:"height 0.6s"}}/>
              </div>
              <div style={{fontSize:9,color:"rgba(240,237,232,0.4)"}}>{s.day}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,marginTop:12}}>
          {[{c:"#e05c2a99",l:"Eaten"},{c:"rgba(26,122,74,0.55)",l:"Burned"},{c:"#e03030",l:"Over goal"}].map(x=>(
            <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:11,height:11,background:x.c,borderRadius:3}}/>
              <span style={{fontSize:11,color:"rgba(240,237,232,0.4)"}}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        <StatCard label="Avg Daily Cals" val={Math.round(weekStats.reduce((s,d)=>s+d.cals,0)/7)} unit="kcal" color="#e05c2a"/>
        <StatCard label="Total Burned"   val={weekStats.reduce((s,d)=>s+d.burned,0)}                unit="kcal" color="#4fc3a1"/>
        <StatCard label="Active Days"    val={weekStats.filter(d=>d.burned>0).length}                unit="/ 7 days" color="#1a7a4a"/>
        <StatCard label="Meals Logged"   val={Object.values(log).flat().length}                      unit="total"    color="#f0a500"/>
      </div>

      {/* Weight history */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Weight History</div>
        {weekStats.every(d=>d.w===null)
          ? <div style={{textAlign:"center",color:"rgba(240,237,232,0.3)",fontSize:14,padding:"16px 0"}}>Log your weight on the Home tab ⚖️</div>
          : weekStats.filter(d=>d.w!==null).map((d,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <span style={{fontSize:14,color:"rgba(240,237,232,0.6)"}}>{d.day}</span>
              <span style={{fontSize:14,fontWeight:800,color:"#4fc3a1"}}>{d.w} kg</span>
            </div>
          ))
        }
      </div>

      {/* Profile summary */}
      <div style={{background:"rgba(224,92,42,0.06)",border:"1px solid rgba(224,92,42,0.2)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <span style={{fontSize:40}}>{profile.avatar}</span>
          <div>
            <div style={{fontWeight:900,fontSize:20}}>{profile.name}</div>
            <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2}}>Member since {profile.createdAt||TODAY}</div>
          </div>
        </div>
        {[{l:"Age",v:`${profile.age} years`},{l:"Weight",v:`${profile.weight} kg`},{l:"Height",v:`${profile.height} cm`},{l:"Activity",v:profile.activity},{l:"Goal",v:GOALS.find(g=>g.id===profile.goal)?.label},{l:"Calorie Target",v:`${calGoal} kcal/day`}].map(r=>(
          <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>{r.l}</span>
            <span style={{fontSize:13,fontWeight:700,textTransform:"capitalize"}}>{r.v}</span>
          </div>
        ))}
        <button onClick={()=>setShowEdit(true)} style={{width:"100%",background:"rgba(224,92,42,0.15)",border:"1px solid rgba(224,92,42,0.3)",borderRadius:13,padding:"12px",color:"#e05c2a",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:16}}>✏️ Edit Profile</button>
      </div>
    </div>
  );

  const contentMap = { home:<HomeContent/>, diet:<DietContent/>, workout:<WorkoutContent/>, stats:<StatsContent/> };

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",color:"#f0ede8",fontFamily:"Georgia,'Times New Roman',serif",display:"flex",position:"relative"}}>
      {/* BG glow */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse at 15% 10%,rgba(224,92,42,0.1),transparent 55%),radial-gradient(ellipse at 85% 85%,rgba(26,122,74,0.08),transparent 55%)"}}/>

      {/* Toast */}
      {toast && <div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"11px 24px",borderRadius:32,zIndex:999,fontSize:14,fontWeight:700,boxShadow:"0 6px 28px rgba(0,0,0,0.45)",whiteSpace:"nowrap",zIndex:9999}}>{toast.msg}</div>}

      {/* Modals */}
      {showEdit && <EditProfile profile={profile} onSave={p=>{setProfile(p);setShowEdit(false);toast_("✅ Profile updated!");}} onClose={()=>setShowEdit(false)} onDelete={delProfile}/>}
      {showSwitch && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
          <div style={{background:"#141820",borderRadius:22,padding:28,width:"100%",maxWidth:440,color:"#f0ede8"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div style={{fontSize:22,fontWeight:900}}>Switch Profile</div>
              <button onClick={()=>setShowSw(false)} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",fontSize:24,cursor:"pointer"}}>✕</button>
            </div>
            {others.map(p=>(
              <button key={p.id} onClick={()=>{setProfile(p);setShowSw(false);setTab("home");toast_(`Welcome back, ${p.name}! ${p.avatar}`);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"14px 18px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:"#f0ede8",textAlign:"left"}}>
                <span style={{fontSize:30}}>{p.avatar}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:15}}>{p.name}</div>
                  <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{p.calorieGoal} kcal goal · {GOALS.find(g=>g.id===p.goal)?.label}</div>
                </div>
                <span style={{color:"#e05c2a",fontSize:20}}>→</span>
              </button>
            ))}
            <button onClick={()=>{setProfile(null);setShowSw(false);}} style={{width:"100%",background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.3)",borderRadius:14,padding:"14px",color:"#e05c2a",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:4}}>+ Create New Profile</button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && <Sidebar/>}

      {/* Mobile header */}
      {isMobile && (
        <div style={{position:"fixed",top:0,left:0,right:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setShowEdit(true)} style={{background:"rgba(224,92,42,0.15)",border:"1px solid rgba(224,92,42,0.3)",borderRadius:12,width:40,height:40,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{profile.avatar}</button>
            <div>
              <div style={{fontSize:10,color:"rgba(240,237,232,0.4)",letterSpacing:2,textTransform:"uppercase",lineHeight:1}}>Welcome back</div>
              <div style={{fontSize:17,fontWeight:900,letterSpacing:-0.5}}>{profile.name}<span style={{color:"#e05c2a"}}>.</span></div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,color:"rgba(240,237,232,0.3)",letterSpacing:2}}>GOAL</div>
              <div style={{fontSize:14,fontWeight:900,color:"#e05c2a"}}>{calGoal} kcal</div>
            </div>
            {others.length>0 && <button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:11,color:"rgba(240,237,232,0.5)"}}>Switch</button>}
          </div>
        </div>
      )}

      {/* Main content area */}
      <main style={{
        flex:1, position:"relative", zIndex:1,
        paddingTop: isMobile ? 72 : 0,
        paddingBottom: isMobile ? 80 : 0,
        overflowY:"auto", minHeight:"100vh"
      }}>
        {/* Desktop top bar */}
        {!isMobile && (
          <div style={{padding:"24px 32px 0",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div>
              <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",letterSpacing:2,textTransform:"uppercase"}}>
                {new Date().toLocaleDateString("en-GH",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
              </div>
              <div style={{fontSize:26,fontWeight:900,marginTop:2}}>
                {tab==="home" ? `Good ${new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"}, ${profile.name} ${profile.avatar}` : tab==="diet" ? "Diet Guide" : tab==="workout" ? "Workouts" : "Stats & Records"}
              </div>
            </div>
            {others.length>0 && (
              <button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 18px",cursor:"pointer",fontSize:13,color:"rgba(240,237,232,0.6)",fontWeight:600}}>
                👥 Switch Profile ({others.length})
              </button>
            )}
          </div>
        )}
        <div style={{padding:contentPad}}>
          {contentMap[tab]}
        </div>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && <BottomNav/>}

      <style>{`
        *{box-sizing:border-box;}
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2);}
        button:hover{opacity:0.88;}
      `}</style>
    </div>
  );
}
