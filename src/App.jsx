import { useState, useEffect } from "react";

/* ─── Meal Data ──────────────────────────────────────────────────────────── */
const GHANAIAN_MEALS = [
  { id:1,  name:"Tom Brown Porridge",        category:"Breakfast", calories:180, protein:6,  carbs:35, fat:3,  emoji:"🌾", description:"Roasted corn & groundnut porridge - traditional morning fuel",            benefits:["Slow release energy","Gut friendly","Low fat"],       color:"#a0522d" },
  { id:2,  name:"Koose (Bean Cakes)",         category:"Breakfast", calories:210, protein:9,  carbs:28, fat:8,  emoji:"🫓", description:"Deep-fried black-eyed pea fritters - beloved Ghanaian street snack",    benefits:["Plant protein","Quick energy","Portable"],            color:"#d4a017" },
  { id:3,  name:"Hausa Koko & Koose",         category:"Breakfast", calories:260, protein:8,  carbs:42, fat:7,  emoji:"🍵", description:"Spiced millet porridge paired with crispy bean cakes",                   benefits:["Iron rich","Warming","Balanced carbs"],               color:"#b8600a" },
  { id:4,  name:"Boiled Yam & Egg Stew",      category:"Breakfast", calories:320, protein:14, carbs:44, fat:9,  emoji:"🥚", description:"Hearty boiled yam slices with spiced tomato egg sauce",                 benefits:["High protein","Sustaining","Vitamin B12"],            color:"#c4860a" },
  { id:5,  name:"Jollof Rice",                category:"Lunch",     calories:420, protein:12, carbs:68, fat:11, emoji:"🍚", description:"Smoky tomato-based one-pot rice - Ghana's most celebrated dish",         benefits:["High energy","Lycopene rich","Iron source"],          color:"#e05c2a" },
  { id:6,  name:"Waakye",                     category:"Lunch",     calories:380, protein:14, carbs:62, fat:8,  emoji:"🫘", description:"Rice & beans cooked with sorghum leaves - a street-food classic",       benefits:["Complete protein","High fibre","Low glycaemic"],      color:"#8b4513" },
  { id:7,  name:"Banku & Tilapia",            category:"Lunch",     calories:510, protein:38, carbs:52, fat:14, emoji:"🐟", description:"Fermented corn & cassava dumpling with grilled whole tilapia",          benefits:["High protein","Omega-3","Probiotic"],                 color:"#1a7a4a" },
  { id:8,  name:"Ampesi & Palava Sauce",      category:"Lunch",     calories:340, protein:11, carbs:55, fat:10, emoji:"🍠", description:"Boiled yam & plantain with rich leafy cocoyam sauce",                   benefits:["Complex carbs","Potassium rich","Filling"],           color:"#c4860a" },
  { id:9,  name:"Rice & Stew",                category:"Lunch",     calories:390, protein:15, carbs:60, fat:12, emoji:"🍛", description:"White rice with rich Ghanaian tomato-based chicken stew",               benefits:["Balanced macros","Protein rich","Comforting"],        color:"#cc4e1a" },
  { id:10, name:"Kenkey & Fried Fish",        category:"Lunch",     calories:480, protein:32, carbs:58, fat:13, emoji:"🌽", description:"Fermented corn dumpling with crispy fried fish and pepper sauce",        benefits:["High protein","Probiotic","Omega-3"],                 color:"#e09020" },
  { id:11, name:"Fufu & Light Soup",          category:"Dinner",    calories:460, protein:24, carbs:62, fat:12, emoji:"🍲", description:"Pounded cassava & plantain in a light spiced chicken soup",              benefits:["High energy","Digestive aid","Protein rich"],         color:"#2d7a5a" },
  { id:12, name:"Omotuo & Groundnut Soup",    category:"Dinner",    calories:460, protein:22, carbs:58, fat:16, emoji:"🥜", description:"Soft rice balls in deep rich groundnut soup with chicken",               benefits:["Healthy fats","High protein","Energy dense"],         color:"#b5541e" },
  { id:13, name:"Kontomire Stew & Rice",      category:"Dinner",    calories:350, protein:18, carbs:48, fat:14, emoji:"🥬", description:"Cocoyam leaves stewed with smoked fish & palm oil over rice",            benefits:["Very high iron","Vitamin A","Antioxidants"],          color:"#2d6a2d" },
  { id:14, name:"Egusi Soup & Fufu",          category:"Dinner",    calories:520, protein:28, carbs:54, fat:22, emoji:"🌿", description:"Ground melon-seed soup with leafy greens, fish & beef",                  benefits:["Protein packed","Zinc rich","Filling"],               color:"#5a7a2a" },
  { id:15, name:"Palm Nut Soup & Rice",       category:"Dinner",    calories:490, protein:26, carbs:52, fat:20, emoji:"🫙", description:"Velvety palm nut soup with chicken and crabs - festive favourite",      benefits:["Vitamin E","Beta-carotene","Iron"],                   color:"#c04020" },
  { id:16, name:"Abunabun (Garden Egg Stew)", category:"Dinner",    calories:280, protein:12, carbs:30, fat:14, emoji:"🍆", description:"Roasted garden egg stew with smoked fish and tomatoes",                  benefits:["Low calorie","Antioxidants","Fibre rich"],            color:"#6a3a8a" },
  { id:17, name:"Tuo Zaafi & Ayoyo",          category:"Dinner",    calories:410, protein:16, carbs:66, fat:9,  emoji:"🌾", description:"Northern Ghana staple - thick millet porridge with jute leaf soup",     benefits:["Iron rich","High fibre","Traditional"],               color:"#3a6a3a" },
  { id:18, name:"Chicken Peanut Stew",        category:"Dinner",    calories:440, protein:34, carbs:28, fat:22, emoji:"🍗", description:"Slow-simmered chicken in a thick aromatic groundnut sauce",              benefits:["High protein","Healthy fats","Vitamin B6"],           color:"#b5700a" },
  { id:19, name:"Kelewele",                   category:"Snack",     calories:190, protein:2,  carbs:38, fat:6,  emoji:"🍌", description:"Spiced fried plantain cubes - a sweet and fiery street-food treat",     benefits:["Quick energy","Potassium","Antioxidants"],            color:"#e0a020" },
  { id:20, name:"Roasted Groundnuts",         category:"Snack",     calories:170, protein:8,  carbs:10, fat:12, emoji:"🥜", description:"Salted roasted peanuts - the most popular Ghanaian on-the-go snack",   benefits:["Healthy fats","Plant protein","Satisfying"],          color:"#a06020" },
];

const QUICK_WORKOUTS = [
  { id:1,  name:"Morning Jog",       icon:"🏃", calories:280, duration:30 },
  { id:2,  name:"Strength Training", icon:"💪", calories:350, duration:45 },
  { id:3,  name:"Dance Aerobics",    icon:"💃", calories:320, duration:40 },
  { id:4,  name:"Cycling",           icon:"🚴", calories:400, duration:45 },
  { id:5,  name:"Swimming",          icon:"🏊", calories:450, duration:60 },
  { id:6,  name:"Yoga & Stretch",    icon:"🧘", calories:150, duration:45 },
  { id:7,  name:"Football",          icon:"⚽", calories:500, duration:60 },
  { id:8,  name:"Jump Rope",         icon:"🪢", calories:370, duration:30 },
  { id:9,  name:"HIIT Circuit",      icon:"🔥", calories:480, duration:30 },
  { id:10, name:"Bench Press",       icon:"🏋", calories:220, duration:40 },
  { id:11, name:"Deadlift",          icon:"⚡", calories:250, duration:40 },
  { id:12, name:"Burpees",           icon:"🤸", calories:350, duration:25 },
  { id:13, name:"Walking",           icon:"🚶", calories:160, duration:45 },
  { id:14, name:"Pull-ups",          icon:"💥", calories:200, duration:30 },
];

const WORKOUT_PLANS = [
  {
    id:"lose", title:"Lose Weight", icon:"🔥", color:"#e05c2a",
    bgColor:"rgba(224,92,42,0.08)", borderColor:"rgba(224,92,42,0.3)",
    subtitle:"High-intensity fat-burning programme", duration:"8 Weeks", frequency:"4 days/week",
    sessions:[
      { day:"Monday", name:"HIIT Cardio Blast", duration:30, calories:450, difficulty:"Intermediate",
        warmup:"5 min light jog in place + arm circles", cooldown:"5 min slow walk + full-body stretch",
        tip:"Keep rest to 20-30s between sets to keep your heart rate elevated for maximum fat burn.",
        exercises:[
          { move:"Jumping Jacks",     sets:3, reps:"40 reps",    rest:"20s" },
          { move:"Burpees",           sets:3, reps:"10 reps",    rest:"30s" },
          { move:"High Knees",        sets:3, reps:"30 seconds", rest:"20s" },
          { move:"Mountain Climbers", sets:3, reps:"20 reps",    rest:"30s" },
          { move:"Jump Squats",       sets:3, reps:"15 reps",    rest:"30s" },
          { move:"Plank Hold",        sets:3, reps:"45 seconds", rest:"20s" },
        ]},
      { day:"Wednesday", name:"Full-Body Fat Burn", duration:40, calories:380, difficulty:"Beginner",
        warmup:"5 min brisk walk + leg swings", cooldown:"5 min stretch focusing on hips and hamstrings",
        tip:"Focus on perfect form over speed. Deep squats and lunges activate more muscle and burn more calories.",
        exercises:[
          { move:"Bodyweight Squats", sets:4, reps:"20 reps",     rest:"30s" },
          { move:"Push-ups",          sets:4, reps:"12 reps",     rest:"30s" },
          { move:"Reverse Lunges",    sets:3, reps:"15 each leg", rest:"30s" },
          { move:"Plank",             sets:3, reps:"45 seconds",  rest:"30s" },
          { move:"Bicycle Crunches",  sets:3, reps:"20 reps",     rest:"20s" },
          { move:"Glute Bridges",     sets:3, reps:"20 reps",     rest:"20s" },
        ]},
      { day:"Friday", name:"Jump Rope & Core", duration:35, calories:420, difficulty:"Intermediate",
        warmup:"3 min slow jump rope + shoulder rolls", cooldown:"5 min core stretches + child pose",
        tip:"10 minutes of jump rope burns the same calories as an 8-min mile run. It is one of the best tools for fat loss.",
        exercises:[
          { move:"Jump Rope Basic",        sets:5, reps:"2 minutes",  rest:"30s" },
          { move:"Jump Rope Double Under", sets:3, reps:"1 minute",   rest:"30s" },
          { move:"Sit-ups",                sets:4, reps:"20 reps",    rest:"20s" },
          { move:"Leg Raises",             sets:3, reps:"15 reps",    rest:"20s" },
          { move:"Russian Twists",         sets:3, reps:"20 reps",    rest:"20s" },
          { move:"Flutter Kicks",          sets:3, reps:"30 seconds", rest:"20s" },
        ]},
      { day:"Saturday", name:"Steady-State Cardio", duration:50, calories:500, difficulty:"Beginner",
        warmup:"5 min slow walk", cooldown:"10 min full-body stretch",
        tip:"Steady cardio trains your body to burn fat as its primary fuel. Stay at a conversational pace for best results.",
        exercises:[
          { move:"5K Run or Brisk Walk", sets:1, reps:"25-30 minutes", rest:"--" },
          { move:"Cycling",              sets:1, reps:"20 minutes",     rest:"--" },
          { move:"Cool-down Walk",       sets:1, reps:"5 minutes",      rest:"--" },
        ]},
    ],
  },
  {
    id:"gain", title:"Build Muscle", icon:"💪", color:"#1a7a4a",
    bgColor:"rgba(26,122,74,0.08)", borderColor:"rgba(26,122,74,0.3)",
    subtitle:"Progressive overload strength training", duration:"12 Weeks", frequency:"4 days/week",
    sessions:[
      { day:"Monday", name:"Chest & Triceps", duration:55, calories:300, difficulty:"Intermediate",
        warmup:"5 min light cardio + 2x15 bodyweight push-ups", cooldown:"5 min chest and tricep stretch",
        tip:"Progressive overload is the number 1 rule. Add 2.5-5 kg every week once you complete all reps with good form.",
        exercises:[
          { move:"Bench Press",              sets:4, reps:"8-10 reps", rest:"90s" },
          { move:"Incline Dumbbell Press",   sets:3, reps:"10 reps",   rest:"90s" },
          { move:"Cable Fly",                sets:3, reps:"12 reps",   rest:"60s" },
          { move:"Tricep Dips",              sets:3, reps:"12 reps",   rest:"60s" },
          { move:"Skull Crushers",           sets:3, reps:"12 reps",   rest:"60s" },
          { move:"Tricep Pushdown",          sets:3, reps:"15 reps",   rest:"60s" },
        ]},
      { day:"Tuesday", name:"Back & Biceps", duration:55, calories:290, difficulty:"Intermediate",
        warmup:"5 min light row or band pull-aparts", cooldown:"5 min lat and bicep stretch",
        tip:"Focus on driving your elbows down and back during rows - not pulling with your hands. This activates the lats fully.",
        exercises:[
          { move:"Pull-ups",               sets:4, reps:"8 reps",    rest:"90s" },
          { move:"Barbell Bent-Over Row",  sets:4, reps:"8-10 reps", rest:"90s" },
          { move:"Seated Cable Row",       sets:3, reps:"12 reps",   rest:"60s" },
          { move:"Single-Arm DB Row",      sets:3, reps:"12 each",   rest:"60s" },
          { move:"Barbell Bicep Curl",     sets:3, reps:"10 reps",   rest:"60s" },
          { move:"Hammer Curls",           sets:3, reps:"12 reps",   rest:"60s" },
        ]},
      { day:"Thursday", name:"Legs & Glutes", duration:60, calories:380, difficulty:"Advanced",
        warmup:"5 min walk + dynamic leg swings and hip circles", cooldown:"8 min deep quad, hamstring and hip flexor stretch",
        tip:"Squat to parallel or below for full muscle activation. Depth over weight - always.",
        exercises:[
          { move:"Barbell Back Squat",   sets:4, reps:"8 reps",   rest:"120s" },
          { move:"Romanian Deadlift",    sets:4, reps:"10 reps",  rest:"90s"  },
          { move:"Leg Press",            sets:3, reps:"12 reps",  rest:"90s"  },
          { move:"Walking Lunges",       sets:3, reps:"12 each",  rest:"60s"  },
          { move:"Leg Curl Machine",     sets:3, reps:"15 reps",  rest:"60s"  },
          { move:"Standing Calf Raises", sets:4, reps:"20 reps",  rest:"45s"  },
        ]},
      { day:"Friday", name:"Shoulders & Core", duration:50, calories:260, difficulty:"Intermediate",
        warmup:"5 min light cardio + band shoulder rotations", cooldown:"5 min shoulder and neck stretch",
        tip:"Hit all 3 shoulder heads - front, lateral, and rear - for balanced, full-looking shoulders.",
        exercises:[
          { move:"Overhead Press",    sets:4, reps:"8 reps",     rest:"90s" },
          { move:"Lateral Raises",    sets:3, reps:"15 reps",    rest:"45s" },
          { move:"Front Raises",      sets:3, reps:"12 reps",    rest:"45s" },
          { move:"Rear Delt Fly",     sets:3, reps:"15 reps",    rest:"45s" },
          { move:"Weighted Plank",    sets:3, reps:"60 seconds", rest:"30s" },
          { move:"Cable Woodchop",    sets:3, reps:"12 each",    rest:"45s" },
        ]},
    ],
  },
];

const GOALS   = [
  { id:"lose",     label:"Lose Weight",  icon:"🔥", desc:"Calorie deficit focus",    calAdj:-300 },
  { id:"maintain", label:"Stay Fit",     icon:"⚖️", desc:"Balanced maintenance",     calAdj:0    },
  { id:"gain",     label:"Build Muscle", icon:"💪", desc:"Calorie surplus + protein", calAdj:300  },
];
const AVATARS = ["🦁","🐯","🦊","🐻","🐼","🦅","🐬","🌟","🔥","⚡","🌿","🏆"];
const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const CATS    = ["All","Breakfast","Lunch","Dinner","Snack"];
const fmt     = (d) => d.toISOString().split("T")[0];
const TODAY   = fmt(new Date());

function calcCalGoal(p) {
  const { weight, height, age, sex, activity, goal } = p;
  if (!weight || !height || !age) return 2000;
  const base = sex === "female"
    ? 10*+weight + 6.25*+height - 5*+age - 161
    : 10*+weight + 6.25*+height - 5*+age + 5;
  const actMap = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 };
  return Math.round(base*(actMap[activity]||1.375)) + (GOALS.find(g=>g.id===goal)?.calAdj||0);
}

const PK    = "khimfit_profiles_v4";
const SK    = "khimfit_session";
const lp    = () => { try { return JSON.parse(localStorage.getItem(PK)||"{}"); } catch { return {}; } };
const sp    = (v) => localStorage.setItem(PK, JSON.stringify(v));
const ld    = (uid) => { try { return JSON.parse(localStorage.getItem("kfd_"+uid)||"{}"); } catch { return {}; } };
const sd    = (uid,v) => localStorage.setItem("kfd_"+uid, JSON.stringify(v));
const lsess = () => { try { return JSON.parse(localStorage.getItem(SK)||"{}"); } catch { return {}; } };
const ssess = (v) => localStorage.setItem(SK, JSON.stringify(v));

function useIsMobile() {
  const [mob, setMob] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", avatar:"🦁", age:"", sex:"male", weight:"", height:"", activity:"moderate", goal:"maintain" });
  const existing = Object.values(lp());
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const finish = () => {
    const p = { ...form, name:form.name.trim(), id:form.name.trim().toLowerCase().replace(/\s+/g,"_")+"_"+Date.now(), calorieGoal:calcCalGoal(form), createdAt:TODAY };
    const all = lp(); all[p.name] = p; sp(all); onComplete(p);
  };
  const inp = { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid transparent", borderRadius:14, padding:"15px 18px", color:"#f0ede8", outline:"none", fontFamily:"Georgia", boxSizing:"border-box" };

  const steps = [
    <div key="w" style={{textAlign:"center"}}>
      <div style={{marginBottom:20,display:"flex",justifyContent:"center"}}>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e05c2a"/>
              <stop offset="100%" stopColor="#1a7a4a"/>
            </linearGradient>
            <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="46" fill="url(#bgGrad)"/>
          <circle cx="48" cy="48" r="46" fill="url(#shineGrad)"/>
          <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
          <text x="48" y="58" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="46" fill="white" style={{letterSpacing:"-2px"}}>K</text>
          <text x="72" y="30" textAnchor="middle" fontSize="18">🔥</text>
        </svg>
      </div>
      <div style={{fontSize:36,fontWeight:900,letterSpacing:-1.5,marginBottom:8}}>Khim<span style={{color:"#e05c2a"}}>Fit</span></div>
      <div style={{fontSize:15,color:"rgba(240,237,232,0.5)",lineHeight:1.8,marginBottom:36}}>Your personal Ghanaian fitness and nutrition tracker</div>
      {existing.length > 0 && <>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:14}}>Existing Profiles</div>
        {existing.map(p=>(
          <button key={p.id} onClick={()=>onComplete(p)} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid transparent",borderRadius:16,padding:"14px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:16,color:"#f0ede8",textAlign:"left"}}>
            <span style={{fontSize:34}}>{p.avatar}</span>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:17}}>{p.name}</div><div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2}}>{GOALS.find(g=>g.id===p.goal)?.label} - {p.calorieGoal} kcal/day</div></div>
            <span style={{color:"#e05c2a",fontSize:22}}>&#x2192;</span>
          </button>
        ))}
        <div style={{color:"rgba(240,237,232,0.25)",fontSize:13,margin:"14px 0"}}>or create a new profile</div>
      </>}
      <button onClick={()=>setStep(1)} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:16,padding:"17px",color:"#fff",fontWeight:900,fontSize:17,cursor:"pointer"}}>{existing.length>0?"+ New Profile":"Get Started"}</button>
    </div>,

    <div key="n">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>What is your name?</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:24}}>Personalises your entire experience</div>
      <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name" style={{...inp,fontSize:22,fontWeight:900,marginBottom:26}}/>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Choose your avatar</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9,marginBottom:30}}>
        {AVATARS.map(a=><button key={a} onClick={()=>set("avatar",a)} style={{background:form.avatar===a?"rgba(224,92,42,0.3)":"rgba(255,255,255,0.05)",border:"2px solid "+(form.avatar===a?"#e05c2a":"transparent"),borderRadius:13,padding:"11px 0",fontSize:28,cursor:"pointer"}}>{a}</button>)}
      </div>
      <button disabled={!form.name.trim()} onClick={()=>setStep(2)} style={{width:"100%",background:form.name.trim()?"#e05c2a":"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"16px",color:form.name.trim()?"#fff":"rgba(255,255,255,0.25)",fontWeight:800,fontSize:16,cursor:form.name.trim()?"pointer":"default"}}>Continue</button>
    </div>,

    <div key="s">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>Your body stats</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:26}}>We calculate your personalised calorie goal</div>
      {[{l:"Age",k:"age",u:"yrs",p:"e.g. 25"},{l:"Weight",k:"weight",u:"kg",p:"e.g. 70"},{l:"Height",k:"height",u:"cm",p:"e.g. 170"}].map(f=>(
        <div key={f.k} style={{marginBottom:18}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:8}}>{f.l}</div>
          <div style={{position:"relative"}}>
            <input type="number" value={form[f.k]} onChange={e=>set(f.k,e.target.value)} placeholder={f.p} style={{...inp,fontSize:17,paddingRight:50}}/>
            <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>{f.u}</span>
          </div>
        </div>
      ))}
      <div style={{marginBottom:22}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:10}}>Sex</div>
        <div style={{display:"flex",gap:10}}>
          {["male","female"].map(s=><button key={s} onClick={()=>set("sex",s)} style={{flex:1,background:form.sex===s?"rgba(224,92,42,0.2)":"rgba(255,255,255,0.05)",border:"1px solid "+(form.sex===s?"#e05c2a":"rgba(255,255,255,0.1)"),borderRadius:13,padding:"13px",color:form.sex===s?"#e05c2a":"rgba(240,237,232,0.5)",cursor:"pointer",fontSize:15}}>{s==="male"?"Male":"Female"}</button>)}
        </div>
      </div>
      <button onClick={()=>setStep(3)} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>Continue</button>
    </div>,

    <div key="g">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>Activity and Goal</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:22}}>Fine-tune your daily calorie target</div>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:11}}>Activity Level</div>
      {[{id:"sedentary",l:"Sedentary",d:"Little or no exercise"},{id:"light",l:"Lightly Active",d:"1-3 days/week"},{id:"moderate",l:"Moderately Active",d:"3-5 days/week"},{id:"active",l:"Very Active",d:"6-7 days/week"}].map(a=>(
        <button key={a.id} onClick={()=>set("activity",a.id)} style={{width:"100%",background:form.activity===a.id?"rgba(224,92,42,0.15)":"rgba(255,255,255,0.04)",border:"1px solid "+(form.activity===a.id?"#e05c2a":"rgba(255,255,255,0.08)"),borderRadius:13,padding:"12px 16px",marginBottom:9,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#f0ede8"}}>
          <span style={{fontWeight:700,fontSize:14}}>{a.l}</span><span style={{fontSize:12,color:"rgba(240,237,232,0.4)"}}>{a.d}</span>
        </button>
      ))}
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",margin:"20px 0 12px"}}>Your Goal</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {GOALS.map(g=><button key={g.id} onClick={()=>set("goal",g.id)} style={{background:form.goal===g.id?"rgba(224,92,42,0.2)":"rgba(255,255,255,0.04)",border:"1px solid "+(form.goal===g.id?"#e05c2a":"rgba(255,255,255,0.08)"),borderRadius:15,padding:"16px 8px",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:6}}>{g.icon}</div><div style={{fontSize:12,fontWeight:700,color:form.goal===g.id?"#e05c2a":"#f0ede8"}}>{g.label}</div>
        </button>)}
      </div>
      <div style={{background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.25)",borderRadius:14,padding:"14px 18px",marginBottom:22,textAlign:"center"}}>
        <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginBottom:4}}>YOUR ESTIMATED DAILY CALORIE GOAL</div>
        <div style={{fontSize:30,fontWeight:900,color:"#e05c2a"}}>{calcCalGoal(form)} <span style={{fontSize:15,fontWeight:400}}>kcal</span></div>
      </div>
      <button onClick={finish} style={{width:"100%",background:"#e05c2a",border:"none",borderRadius:16,padding:"18px",color:"#fff",fontWeight:900,fontSize:18,cursor:"pointer"}}>Start My Journey</button>
    </div>
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"Georgia,serif",color:"#f0ede8"}}>
      <div style={{width:"100%",maxWidth:480}}>
        {step>0 && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:30}}>
            <button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",cursor:"pointer",fontSize:14,padding:0}}>Back</button>
            <div style={{display:"flex",gap:6}}>{[1,2,3].map(i=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i<=step?"#e05c2a":"rgba(255,255,255,0.1)",transition:"all 0.3s"}}/>)}</div>
          </div>
        )}
        {steps[step]}
        <div style={{textAlign:"center",marginTop:32,fontSize:11,color:"rgba(240,237,232,0.2)",letterSpacing:1}}>BUILT BY JOACHIM - KHIMFIT v2.0</div>
      </div>
    </div>
  );
}

function EditProfile({ profile, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({...profile});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => { const u={...form,calorieGoal:calcCalGoal(form)}; const a=lp(); if(form.name!==profile.name) delete a[profile.name]; a[u.name]=u; sp(a); onSave(u); };
  const inp = { width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid transparent", borderRadius:11, padding:"12px 15px", color:"#f0ede8", fontSize:15, outline:"none", fontFamily:"Georgia", boxSizing:"border-box" };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#141820",borderRadius:22,padding:28,width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",color:"#f0ede8"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:900}}>Edit Profile</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",fontSize:24,cursor:"pointer"}}>X</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7,marginBottom:20}}>
          {AVATARS.map(a=><button key={a} onClick={()=>set("avatar",a)} style={{background:form.avatar===a?"rgba(224,92,42,0.3)":"rgba(255,255,255,0.05)",border:"2px solid "+(form.avatar===a?"#e05c2a":"transparent"),borderRadius:11,padding:"9px 0",fontSize:24,cursor:"pointer"}}>{a}</button>)}
        </div>
        {[{l:"Name",k:"name",t:"text"},{l:"Age",k:"age",t:"number"},{l:"Weight (kg)",k:"weight",t:"number"},{l:"Height (cm)",k:"height",t:"number"}].map(f=>(
          <div key={f.k} style={{marginBottom:16}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:7}}>{f.l}</div>
            <input type={f.t} value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={inp}/>
          </div>
        ))}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:10}}>Goal</div>
          <div style={{display:"flex",gap:9}}>
            {GOALS.map(g=><button key={g.id} onClick={()=>set("goal",g.id)} style={{flex:1,background:form.goal===g.id?"rgba(224,92,42,0.2)":"rgba(255,255,255,0.05)",border:"1px solid "+(form.goal===g.id?"#e05c2a":"rgba(255,255,255,0.08)"),borderRadius:11,padding:"10px 4px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22}}>{g.icon}</div><div style={{fontSize:10,color:form.goal===g.id?"#e05c2a":"rgba(240,237,232,0.5)",marginTop:3}}>{g.label}</div>
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

function MealCard({ meal, isSelected, onSelect, onLog }) {
  return (
    <div onClick={onSelect} style={{background:isSelected?"linear-gradient(135deg,"+meal.color+"1a,"+meal.color+"0d)":"rgba(255,255,255,0.025)",border:"1px solid "+(isSelected?meal.color+"88":"rgba(255,255,255,0.07)"),borderRadius:16,marginBottom:10,cursor:"pointer",overflow:"hidden",transition:"all 0.22s"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px"}}>
        <div style={{width:48,height:48,borderRadius:13,background:meal.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{meal.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div><div style={{fontWeight:800,fontSize:15}}>{meal.name}</div><div style={{fontSize:10,color:meal.color,letterSpacing:2,marginTop:3,textTransform:"uppercase"}}>{meal.category}</div></div>
            <div style={{background:meal.color+"22",border:"1px solid "+meal.color+"44",borderRadius:20,padding:"4px 12px",fontSize:13,fontWeight:800,color:meal.color,flexShrink:0}}>{meal.calories} kcal</div>
          </div>
          <div style={{fontSize:12,color:"rgba(240,237,232,0.45)",marginTop:5,lineHeight:1.5}}>{meal.description}</div>
        </div>
      </div>
      <div style={{display:"flex",borderTop:"1px solid transparent"}}>
        {[{l:"Protein",v:meal.protein,c:"#4fc3a1"},{l:"Carbs",v:meal.carbs,c:"#f0a500"},{l:"Fat",v:meal.fat,c:"#e05c2a"}].map((m,i)=>(
          <div key={m.l} style={{flex:1,padding:"9px 0",textAlign:"center",borderRight:i<2?"1px solid transparent":undefined}}>
            <div style={{fontSize:14,fontWeight:800,color:m.c}}>{m.v}g</div>
            <div style={{fontSize:9,color:"rgba(240,237,232,0.35)",letterSpacing:1,textTransform:"uppercase"}}>{m.l}</div>
          </div>
        ))}
      </div>
      {isSelected && (
        <div style={{padding:"14px 16px",borderTop:"1px solid transparent"}}>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
            {meal.benefits.map(b=><span key={b} style={{background:meal.color+"1a",border:"1px solid "+meal.color+"44",color:meal.color,borderRadius:20,padding:"4px 12px",fontSize:11}}>{"+ "+b}</span>)}
          </div>
          <button onClick={e=>{e.stopPropagation();onLog();}} style={{width:"100%",background:meal.color,border:"none",borderRadius:12,padding:"14px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>+ Log {meal.name}</button>
        </div>
      )}
    </div>
  );
}

const StatCard = ({label,val,unit,color}) => (
  <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:16,padding:"16px 18px"}}>
    <div style={{fontSize:26,fontWeight:900,color}}>{val}</div>
    <div style={{fontSize:10,color,opacity:0.7,marginTop:1}}>{unit}</div>
    <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:5}}>{label}</div>
  </div>
);

const DiffBadge = ({level}) => {
  const c = level==="Beginner"?"#1a7a4a":level==="Intermediate"?"#f0a500":"#e05c2a";
  return <span style={{background:c+"22",border:"1px solid "+c+"55",color:c,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{level}</span>;
};

export default function KhimFitness() {
  const isMobile = useIsMobile();

  // ── Restore session from localStorage on first load ──
  const _sess = lsess();
  const _profiles = lp();
  const _restoredProfile = _sess.profileName ? (_profiles[_sess.profileName]||null) : null;

  const [profile, setProfile]   = useState(_restoredProfile);
  const [tab, setTab]           = useState(_restoredProfile ? (_sess.tab||"home") : "home");
  const [data, setData]         = useState({ log:{}, workoutLog:{}, water:{}, weightLog:{} });
  const [weightInput, setWI]    = useState("");
  const [selectedMeal, setSM]   = useState(null);
  const [filterCat, setFC]      = useState("All");
  const [toast, setToast]       = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSwitch, setShowSw] = useState(false);
  const [wTab, setWTab]         = useState("log");
  const [openSession, setOpenSess] = useState(null);
  const [completedSets, setCS]  = useState({});
  const [workoutRecords, setWRec] = useState({});

  // Save active profile + tab to localStorage whenever they change
  useEffect(() => {
    if (profile) ssess({ profileName: profile.name, tab });
  }, [profile?.name, tab]);

  useEffect(() => {
    if (!profile) return;
    const s = ld(profile.id);
    setData({ log:s.log||{}, workoutLog:s.workoutLog||{}, water:s.water||{}, weightLog:s.weightLog||{} });
    setWRec(s.workoutRecords||{});
    setCS(s.completedSets||{});
  }, [profile?.id]);

  useEffect(() => {
    if (!profile) return;
    sd(profile.id, {...ld(profile.id), ...data, workoutRecords, completedSets});
  }, [data, workoutRecords, completedSets, profile?.id]);

  const toast_ = (msg, color="#1a7a4a") => { setToast({msg,color}); setTimeout(()=>setToast(null),2500); };
  if (!profile) return <Onboarding onComplete={p=>{ setProfile(p); setTab("home"); }}/>;


  const { log, workoutLog, water, weightLog } = data;
  const calGoal   = profile.calorieGoal||2000;
  const tMeals    = log[TODAY]||[];
  const tWorkouts = workoutLog[TODAY]||[];
  const tWater    = water[TODAY]||0;
  const totCal    = tMeals.reduce((s,m)=>s+m.calories,0);
  const totPro    = tMeals.reduce((s,m)=>s+m.protein,0);
  const totCarb   = tMeals.reduce((s,m)=>s+m.carbs,0);
  const totFat    = tMeals.reduce((s,m)=>s+m.fat,0);
  const burned    = tWorkouts.reduce((s,w)=>s+w.calories,0);
  const netCal    = totCal - burned;
  const calPct    = Math.min((totCal/calGoal)*100,100);
  const waterGoal = 8;

  const upd    = (k,v) => setData(d=>({...d,[k]:v}));
  const addM   = m  => { upd("log",{...log,[TODAY]:[...(log[TODAY]||[]),{...m,logId:Date.now()}]}); toast_(m.emoji+" "+m.name+" added!"); setSM(null); };
  const rmM    = id => upd("log",{...log,[TODAY]:(log[TODAY]||[]).filter(m=>m.logId!==id)});
  const addQW  = w  => { upd("workoutLog",{...workoutLog,[TODAY]:[...(workoutLog[TODAY]||[]),{...w,logId:Date.now()}]}); toast_(w.icon+" "+w.name+" logged!","#e05c2a"); };
  const addWater = () => { upd("water",{...water,[TODAY]:(water[TODAY]||0)+1}); toast_("Water +250ml logged!","#1e90ff"); };
  const saveWt   = () => { if(!weightInput) return; upd("weightLog",{...weightLog,[TODAY]:parseFloat(weightInput)}); toast_("Weight "+weightInput+"kg saved!"); setWI(""); };

  const logPlanSession = (plan, sess) => {
    const entry = { logId:Date.now(), name:sess.name, planId:plan.id, icon:plan.icon, calories:sess.calories, duration:sess.duration };
    upd("workoutLog",{...workoutLog,[TODAY]:[...(workoutLog[TODAY]||[]),entry]});
    const recs = {...workoutRecords};
    recs[TODAY] = [...(recs[TODAY]||[]), { planId:plan.id, planTitle:plan.title, sessionName:sess.name, duration:sess.duration, calories:sess.calories, day:sess.day }];
    setWRec(recs);
    toast_(plan.icon+" "+sess.name+" logged!", plan.color);
  };

  const toggleSet = (key) => setCS(prev=>({...prev,[key]:!prev[key]}));

  const weekStats = DAYS.map((d,i)=>{ const dt=new Date(); dt.setDate(dt.getDate()-(6-i)); const k=fmt(dt); const ms=log[k]||[]; const ws=workoutLog[k]||[]; return {day:d,cals:ms.reduce((s,m)=>s+m.calories,0),burned:ws.reduce((s,w)=>s+w.calories,0),w:weightLog[k]||null}; });
  const maxCals   = Math.max(...weekStats.map(s=>s.cals),calGoal,1);
  const filtered  = filterCat==="All"?GHANAIAN_MEALS:GHANAIAN_MEALS.filter(m=>m.category===filterCat);
  const others    = Object.values(lp()).filter(p=>p.id!==profile.id);
  const delProfile = () => { const a=lp(); delete a[profile.name]; sp(a); localStorage.removeItem("kfd_"+profile.id); setProfile(null); setShowEdit(false); localStorage.removeItem(SK); };
  const goToWelcome = () => { localStorage.removeItem(SK); setProfile(null); };

  const cPad     = isMobile ? "16px" : "28px 32px";
  const navItems = [
    {id:"home",    icon:"⌂",  label:"Home"},
    {id:"diet",    icon:"🍽", label:"Diet"},
    {id:"workout", icon:"🏋", label:"Workout"},
    {id:"stats",   icon:"📊", label:"Stats"},
    {id:"contact", icon:"📞", label:"Contact"},
    {id:"help",    icon:"❓",  label:"Help"},
  ];

  const Sidebar = () => (
    <div style={{width:260,flexShrink:0,background:"#0e1218",borderRight:"1px solid transparent",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:"28px 24px 20px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:4}}>Fitness and Nutrition</div>
        <div style={{fontSize:28,fontWeight:900,letterSpacing:-1}}>Khim<span style={{color:"#e05c2a"}}>Fit</span></div>
      </div>
      <button onClick={()=>setShowEdit(true)} style={{margin:"0 14px",background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.25)",borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,color:"#f0ede8",marginBottom:10}}>
        <span style={{fontSize:30}}>{profile.avatar}</span>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.name}</div><div style={{fontSize:11,color:"#e05c2a",marginTop:2}}>{calGoal} kcal goal</div></div>
        <span style={{fontSize:12,color:"rgba(240,237,232,0.3)"}}>edit</span>
      </button>
      {others.length>0 && <button onClick={()=>setShowSw(true)} style={{margin:"0 14px 20px",background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:12,padding:"9px 14px",cursor:"pointer",color:"rgba(240,237,232,0.5)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:8}}>Switch Profile ({others.length})</button>}
      <nav style={{flex:1,padding:"0 14px"}}>
        {navItems.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{width:"100%",background:tab===t.id?"rgba(224,92,42,0.15)":"transparent",border:"1px solid "+(tab===t.id?"rgba(224,92,42,0.4)":"transparent"),borderRadius:13,padding:"13px 16px",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:tab===t.id?"#e05c2a":"rgba(240,237,232,0.55)",fontSize:15,textAlign:"left",fontWeight:tab===t.id?700:400,transition:"all 0.2s"}}>
            <span style={{fontSize:20}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
      <div style={{padding:"12px 14px 0",borderTop:"1px solid transparent"}}>
        <button onClick={goToWelcome} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:11,padding:"10px 14px",cursor:"pointer",color:"rgba(240,237,232,0.4)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span>🏠</span> Welcome Screen
        </button>
        <div style={{padding:"0 10px 16px",fontSize:10,color:"rgba(240,237,232,0.2)",letterSpacing:1,lineHeight:1.9}}>
          KHIMFIT v2.0<br/>BUILT BY JOACHIM<br/>ACCRA, GHANA
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid transparent",display:"grid",gridTemplateColumns:"repeat(5,1fr)",zIndex:100}}>
      {navItems.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:18,filter:tab===t.id?"none":"grayscale(1) opacity(0.38)"}}>{t.icon}</span>
          <span style={{fontSize:7,letterSpacing:0.3,textTransform:"uppercase",color:tab===t.id?"#e05c2a":"rgba(240,237,232,0.3)"}}>{t.label}</span>
          {tab===t.id&&<div style={{width:16,height:2,background:"#e05c2a",borderRadius:2}}/>}
        </button>
      ))}
    </div>
  );

  const HomeContent = () => (
    <div>
      <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginBottom:20}}>{new Date().toLocaleDateString("en-GH",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      <div style={{background:"linear-gradient(135deg,#1a1f2e,#141820)",border:"1px solid transparent",borderRadius:20,padding:"22px 24px",marginBottom:16,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
        <svg width={96} height={96} style={{flexShrink:0}}>
          <circle cx={48} cy={48} r={38} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9}/>
          <circle cx={48} cy={48} r={38} fill="none" stroke={calPct>=100?"#e03030":"#e05c2a"} strokeWidth={9}
            strokeDasharray={String(2*Math.PI*38)} strokeDashoffset={String(2*Math.PI*38*(1-calPct/100))}
            strokeLinecap="round" transform="rotate(-90 48 48)" style={{transition:"stroke-dashoffset 0.7s"}}/>
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
      <div style={{background:"rgba(224,92,42,0.08)",border:"1px solid rgba(224,92,42,0.2)",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:24}}>{GOALS.find(g=>g.id===profile.goal)?.icon}</span>
        <div><div style={{fontWeight:700,fontSize:13}}>{GOALS.find(g=>g.id===profile.goal)?.label} Mode</div><div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{GOALS.find(g=>g.id===profile.goal)?.desc} - {calGoal} kcal/day target</div></div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:16,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",marginBottom:14,textTransform:"uppercase"}}>Macros Today</div>
        {[{l:"Carbohydrates",v:totCarb,max:250,c:"#e05c2a"},{l:"Protein",v:totPro,max:profile.goal==="gain"?120:80,c:"#1a7a4a"},{l:"Fat",v:totFat,max:65,c:"#f0a500"}].map(m=>(
          <div key={m.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}><span style={{color:"rgba(240,237,232,0.6)"}}>{m.l}</span><span style={{color:m.c,fontWeight:700}}>{m.v}g / {m.max}g</span></div>
            <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:10}}><div style={{height:"100%",borderRadius:10,background:m.c,width:Math.min((m.v/m.max)*100,100)+"%",transition:"width 0.6s"}}/></div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(30,144,255,0.08)",border:"1px solid rgba(30,144,255,0.2)",borderRadius:16,padding:"16px 18px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:11,letterSpacing:2,color:"rgba(30,144,255,0.75)",textTransform:"uppercase"}}>Water Intake</div><div style={{fontSize:20,fontWeight:800,marginTop:3}}>{tWater} <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>/ {waterGoal} glasses</span></div></div>
          <button onClick={addWater} style={{background:"rgba(30,144,255,0.2)",border:"1px solid rgba(30,144,255,0.4)",color:"#7ab8ff",borderRadius:13,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:600}}>+ 250ml</button>
        </div>
        <div style={{display:"flex",gap:6}}>{Array.from({length:waterGoal}).map((_,i)=><div key={i} style={{flex:1,height:26,borderRadius:7,background:i<tWater?"rgba(30,144,255,0.6)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"background 0.3s"}}>{i<tWater&&"💧"}</div>)}</div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Today's Meals</div>
        {tMeals.length===0
          ? <div style={{background:"rgba(255,255,255,0.03)",border:"1px dashed rgba(255,255,255,0.06)",borderRadius:14,padding:24,textAlign:"center",color:"rgba(240,237,232,0.3)",fontSize:14}}>No meals logged yet - go to the Diet tab</div>
          : tMeals.map(m=>(
            <div key={m.logId} style={{background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:13,padding:"11px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:(m.color||"#e05c2a")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{m.emoji}</div>
                <div><div style={{fontSize:14,fontWeight:700}}>{m.name}</div><div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{m.calories} kcal - {m.protein}g protein</div></div>
              </div>
              <button onClick={()=>rmM(m.logId)} style={{background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.2)",color:"#e05c2a",borderRadius:9,padding:"4px 12px",cursor:"pointer",fontSize:13,flexShrink:0}}>X</button>
            </div>
          ))}
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:16,padding:"16px 18px"}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Log Today's Weight</div>
        <div style={{display:"flex",gap:10}}>
          <input type="number" placeholder={"e.g. "+(profile.weight||"70")} value={weightInput} onChange={e=>setWI(e.target.value)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid transparent",borderRadius:11,padding:"11px 15px",color:"#f0ede8",fontSize:15,outline:"none",fontFamily:"Georgia"}}/>
          <button onClick={saveWt} style={{background:"#e05c2a",border:"none",borderRadius:11,padding:"11px 20px",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:14,flexShrink:0}}>Save kg</button>
        </div>
        {weightLog[TODAY]&&<div style={{marginTop:10,fontSize:13,color:"#4fc3a1"}}>Today: {weightLog[TODAY]}kg recorded</div>}
      </div>
    </div>
  );

  const DietContent = () => (
    <div>
      <div style={{marginBottom:20}}><div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Ghanaian Diet Guide</div><div style={{fontSize:13,color:"rgba(240,237,232,0.45)"}}>Tap any meal to expand details and log it</div></div>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {CATS.map(c=><button key={c} onClick={()=>setFC(c)} style={{background:filterCat===c?"#e05c2a":"rgba(255,255,255,0.06)",border:filterCat===c?"none":"1px solid transparent",color:filterCat===c?"#fff":"rgba(240,237,232,0.6)",borderRadius:22,padding:"7px 18px",cursor:"pointer",fontSize:13,whiteSpace:"nowrap",fontWeight:filterCat===c?700:400,transition:"all 0.2s"}}>{c}</button>)}
      </div>
      <div style={{fontSize:11,color:"rgba(240,237,232,0.3)",marginBottom:14,letterSpacing:1}}>{filtered.length} MEALS</div>
      {filtered.map(meal=><MealCard key={meal.id} meal={meal} isSelected={selectedMeal?.id===meal.id} onSelect={()=>setSM(selectedMeal?.id===meal.id?null:meal)} onLog={()=>addM(meal)}/>)}
    </div>
  );

  const WorkoutContent = () => {
    const activePlan = WORKOUT_PLANS.find(p=>p.id===wTab);

    if (openSession) {
      const plan = WORKOUT_PLANS.find(p=>p.id===openSession.planId);
      const sess = plan?.sessions[openSession.idx];
      if (!plan||!sess) return null;
      const alreadyLogged = (workoutRecords[TODAY]||[]).some(r=>r.planId===plan.id&&r.sessionName===sess.name);
      return (
        <div>
          <button onClick={()=>setOpenSess(null)} style={{background:"none",border:"none",color:"#e05c2a",cursor:"pointer",fontSize:14,padding:"0 0 18px",display:"flex",alignItems:"center",gap:6}}>Back to {plan.title}</button>
          <div style={{background:plan.bgColor,border:"1px solid "+plan.borderColor,borderRadius:20,padding:"20px 22px",marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:10}}>
              <div><div style={{fontSize:11,letterSpacing:2,color:plan.color,textTransform:"uppercase",marginBottom:4}}>{plan.icon+" "+plan.title+" - "+sess.day}</div><div style={{fontSize:22,fontWeight:900}}>{sess.name}</div></div>
              <DiffBadge level={sess.difficulty}/>
            </div>
            <div style={{display:"flex",gap:20,marginBottom:16,flexWrap:"wrap"}}>
              {[{l:"Duration",v:sess.duration+" min"},{l:"Calories Burned",v:"~"+sess.calories+" kcal"}].map(s=>(
                <div key={s.l}><div style={{fontSize:11,color:"rgba(240,237,232,0.4)",letterSpacing:1}}>{s.l.toUpperCase()}</div><div style={{fontSize:16,fontWeight:800,color:plan.color,marginTop:2}}>{s.v}</div></div>
              ))}
            </div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 16px"}}>
              <div style={{fontSize:10,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:5}}>Warm-up</div>
              <div style={{fontSize:13,color:"rgba(240,237,232,0.75)"}}>{sess.warmup}</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:18,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid transparent",display:"grid",gridTemplateColumns:"1fr 110px 70px 70px",gap:8}}>
              {["Exercise","Sets x Reps","Rest","Done"].map(h=><div key={h} style={{fontSize:10,letterSpacing:2,color:"rgba(240,237,232,0.35)",textTransform:"uppercase"}}>{h}</div>)}
            </div>
            {sess.exercises.map((ex,ei)=>{
              const allDone = Array.from({length:ex.sets}).every((_,si)=>completedSets[plan.id+"-"+openSession.idx+"-"+ei+"-"+si]);
              return (
                <div key={ei} style={{padding:"13px 18px",borderBottom:"1px solid transparent",display:"grid",gridTemplateColumns:"1fr 110px 70px 70px",gap:8,alignItems:"center",background:allDone?"rgba(26,122,74,0.08)":"transparent"}}>
                  <div style={{fontWeight:allDone?400:700,color:allDone?"rgba(240,237,232,0.4)":"#f0ede8",fontSize:14,textDecoration:allDone?"line-through":"none"}}>{ex.move}</div>
                  <div style={{fontSize:13,color:"rgba(240,237,232,0.6)"}}>{ex.sets}x {ex.reps}</div>
                  <div style={{fontSize:12,color:"rgba(240,237,232,0.4)"}}>{ex.rest}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {Array.from({length:ex.sets}).map((_,si)=>{
                      const key=plan.id+"-"+openSession.idx+"-"+ei+"-"+si;
                      return <button key={si} onClick={()=>toggleSet(key)} style={{width:24,height:24,borderRadius:6,background:completedSets[key]?"#1a7a4a":"rgba(255,255,255,0.08)",border:"1px solid "+(completedSets[key]?"#1a7a4a":"rgba(255,255,255,0.15)"),cursor:"pointer",fontSize:11,color:"#fff",transition:"all 0.2s"}}>{completedSets[key]?"v":si+1}</button>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:14,padding:"14px 18px",marginBottom:16}}>
            <div style={{fontSize:10,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:5}}>Cool-down</div>
            <div style={{fontSize:13,color:"rgba(240,237,232,0.75)",marginBottom:12}}>{sess.cooldown}</div>
            <div style={{background:plan.color+"15",border:"1px solid "+plan.color+"33",borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontSize:10,letterSpacing:2,color:plan.color,textTransform:"uppercase",marginBottom:4}}>Pro Tip</div>
              <div style={{fontSize:13,color:"rgba(240,237,232,0.7)",lineHeight:1.6}}>{sess.tip}</div>
            </div>
          </div>
          <button onClick={()=>{ if(!alreadyLogged) logPlanSession(plan,sess); }} disabled={alreadyLogged}
            style={{width:"100%",background:alreadyLogged?"rgba(255,255,255,0.06)":plan.color,border:"none",borderRadius:16,padding:"16px",color:alreadyLogged?"rgba(240,237,232,0.3)":"#fff",fontWeight:900,fontSize:16,cursor:alreadyLogged?"default":"pointer",marginBottom:16}}>
            {alreadyLogged?"Session Already Logged Today":plan.icon+" Log This Session (+"+sess.calories+" kcal burned)"}
          </button>
        </div>
      );
    }

    return (
      <div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Workouts</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:20}}>Log activities, follow guided plans, and track records</div>
        <div style={{display:"flex",gap:8,marginBottom:24,background:"rgba(255,255,255,0.04)",borderRadius:16,padding:5}}>
          {[{id:"log",label:"Quick Log",icon:"⚡"},{id:"lose",label:"Lose Weight",icon:"🔥"},{id:"gain",label:"Build Muscle",icon:"💪"}].map(t=>(
            <button key={t.id} onClick={()=>setWTab(t.id)} style={{flex:1,background:wTab===t.id?"#e05c2a":"transparent",border:"none",borderRadius:12,padding:"10px 6px",cursor:"pointer",color:wTab===t.id?"#fff":"rgba(240,237,232,0.5)",fontSize:12,fontWeight:wTab===t.id?800:400,transition:"all 0.2s"}}>
              {t.icon+" "+t.label}
            </button>
          ))}
        </div>
        {tWorkouts.length>0 && (
          <div style={{background:"rgba(26,122,74,0.1)",border:"1px solid rgba(26,122,74,0.3)",borderRadius:16,padding:"16px 18px",marginBottom:20}}>
            <div style={{fontSize:11,letterSpacing:2,color:"#1a7a4a",textTransform:"uppercase",marginBottom:12}}>Logged Today</div>
            {tWorkouts.map(w=>(
              <div key={w.logId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,fontSize:14}}>
                <span>{(w.icon||"🏋")+" "+w.name}</span>
                <span style={{color:"#4fc3a1",fontWeight:700}}>-{w.calories} kcal - {w.duration}min</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid rgba(26,122,74,0.2)",marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>Total burned today</span>
              <span style={{fontSize:17,color:"#4fc3a1",fontWeight:900}}>{burned} kcal</span>
            </div>
          </div>
        )}
        {wTab==="log" && (
          <>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:14}}>Quick Log Activity</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:11}}>
              {QUICK_WORKOUTS.map(w=>(
                <div key={w.id} onClick={()=>addQW(w)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:16,padding:"18px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <div style={{fontSize:36,marginBottom:8}}>{w.icon}</div>
                  <div style={{fontWeight:800,fontSize:13,marginBottom:4}}>{w.name}</div>
                  <div style={{fontSize:12,color:"#e05c2a",fontWeight:600}}>{w.calories} kcal</div>
                  <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginBottom:10}}>{w.duration} min</div>
                  <div style={{background:"rgba(26,122,74,0.15)",border:"1px solid rgba(26,122,74,0.3)",borderRadius:8,padding:"5px 0",fontSize:12,color:"#4fc3a1",fontWeight:600}}>+ Log</div>
                </div>
              ))}
            </div>
          </>
        )}
        {(wTab==="lose"||wTab==="gain") && activePlan && (
          <div>
            <div style={{background:activePlan.bgColor,border:"1px solid "+activePlan.borderColor,borderRadius:20,padding:"20px 22px",marginBottom:22}}>
              <div style={{fontSize:28,fontWeight:900,marginBottom:6}}>{activePlan.icon+" "+activePlan.title+" Programme"}</div>
              <div style={{fontSize:14,color:"rgba(240,237,232,0.6)",marginBottom:16}}>{activePlan.subtitle}</div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                {[{l:"Duration",v:activePlan.duration},{l:"Frequency",v:activePlan.frequency},{l:"Sessions",v:activePlan.sessions.length+" per week"}].map(s=>(
                  <div key={s.l} style={{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"8px 14px"}}>
                    <div style={{fontSize:10,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase"}}>{s.l}</div>
                    <div style={{fontSize:14,fontWeight:800,color:activePlan.color,marginTop:2}}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:14}}>Weekly Sessions</div>
            {activePlan.sessions.map((sess,idx)=>{
              const alreadyLogged = (workoutRecords[TODAY]||[]).some(r=>r.planId===activePlan.id&&r.sessionName===sess.name);
              const totalSets = sess.exercises.reduce((s,e)=>s+e.sets,0);
              const doneSets  = sess.exercises.reduce((s,e,ei)=>s+Array.from({length:e.sets}).filter((_,si)=>completedSets[activePlan.id+"-"+idx+"-"+ei+"-"+si]).length,0);
              const pct = totalSets>0?Math.round((doneSets/totalSets)*100):0;
              return (
                <div key={idx} style={{background:"rgba(255,255,255,0.03)",border:"1px solid "+(alreadyLogged?"rgba(26,122,74,0.4)":"rgba(255,255,255,0.07)"),borderRadius:18,marginBottom:12,overflow:"hidden"}}>
                  <div style={{padding:"16px 18px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8,flexWrap:"wrap"}}>
                      <div><div style={{fontSize:11,letterSpacing:2,color:activePlan.color,textTransform:"uppercase",marginBottom:3}}>{sess.day}</div><div style={{fontSize:17,fontWeight:900}}>{sess.name}</div></div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                        <DiffBadge level={sess.difficulty}/>
                        {alreadyLogged&&<span style={{background:"rgba(26,122,74,0.2)",border:"1px solid rgba(26,122,74,0.4)",color:"#4fc3a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>Logged</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:16,marginBottom:12,flexWrap:"wrap"}}>
                      {[{l:"Duration",v:sess.duration+" min"},{l:"Calories",v:sess.calories+" kcal"},{l:"Exercises",v:sess.exercises.length+""}].map(s=>(
                        <div key={s.l} style={{fontSize:12}}><span style={{color:"rgba(240,237,232,0.4)"}}>{s.l+": "}</span><span style={{fontWeight:700,color:activePlan.color}}>{s.v}</span></div>
                      ))}
                    </div>
                    {pct>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(240,237,232,0.4)",marginBottom:4}}><span>Sets completed</span><span style={{color:activePlan.color,fontWeight:700}}>{doneSets+"/"+totalSets+" ("+pct+"%)"}</span></div>
                        <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:10}}><div style={{height:"100%",borderRadius:10,background:activePlan.color,width:pct+"%",transition:"width 0.4s"}}/></div>
                      </div>
                    )}
                    <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
                      {sess.exercises.slice(0,4).map((ex,ei)=><span key={ei} style={{background:"rgba(255,255,255,0.06)",border:"1px solid transparent",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(240,237,232,0.6)"}}>{ex.move}</span>)}
                      {sess.exercises.length>4&&<span style={{background:"rgba(255,255,255,0.06)",border:"1px solid transparent",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(240,237,232,0.4)"}}>+{sess.exercises.length-4} more</span>}
                    </div>
                    <button onClick={()=>setOpenSess({planId:activePlan.id,idx})} style={{width:"100%",background:activePlan.color,border:"none",borderRadius:13,padding:"13px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                      {pct>0?"Continue Session":"Start Session"}
                    </button>
                  </div>
                </div>
              );
            })}
            {Object.keys(workoutRecords).length>0 && (
              <div style={{marginTop:24}}>
                <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:14}}>Your Records</div>
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:18,overflow:"hidden"}}>
                  {Object.entries(workoutRecords).reverse().slice(0,10).flatMap(([date,recs])=>
                    recs.filter(r=>r.planId===activePlan.id).map((r,i)=>(
                      <div key={date+"-"+i} style={{padding:"12px 18px",borderBottom:"1px solid transparent",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                        <div><div style={{fontSize:13,fontWeight:700}}>{r.sessionName}</div><div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{new Date(date).toLocaleDateString("en-GH",{weekday:"short",day:"numeric",month:"short"})}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:13,color:activePlan.color,fontWeight:700}}>-{r.calories} kcal</div><div style={{fontSize:11,color:"rgba(240,237,232,0.4)"}}>{r.duration} min</div></div>
                      </div>
                    ))
                  )}
                  {Object.values(workoutRecords).flat().filter(r=>r.planId===activePlan.id).length===0&&(
                    <div style={{padding:24,textAlign:"center",color:"rgba(240,237,232,0.3)",fontSize:13}}>No {activePlan.title.toLowerCase()} sessions logged yet. Start your first one above!</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const StatsContent = () => (
    <div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Weekly Stats</div>
      <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:22}}>7-day overview for {profile.name}</div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:18,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Calories vs Goal ({calGoal} kcal)</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
          {weekStats.map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div style={{width:"100%",height:90,display:"flex",flexDirection:"column",justifyContent:"flex-end",gap:2}}>
                {s.burned>0&&<div style={{width:"100%",background:"rgba(26,122,74,0.55)",height:(s.burned/maxCals)*90+"px",borderRadius:"5px 5px 0 0",minHeight:4}}/>}
                <div style={{width:"100%",background:s.cals>0?(s.cals>calGoal?"#e03030":"#e05c2a99"):"rgba(255,255,255,0.06)",height:(s.cals/maxCals)*90+"px",borderRadius:"5px 5px 0 0",minHeight:s.cals>0?5:2}}/>
              </div>
              <div style={{fontSize:9,color:"rgba(240,237,232,0.4)"}}>{s.day}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,marginTop:12}}>
          {[{c:"#e05c2a99",l:"Eaten"},{c:"rgba(26,122,74,0.55)",l:"Burned"},{c:"#e03030",l:"Over goal"}].map(x=>(
            <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:11,height:11,background:x.c,borderRadius:3}}/><span style={{fontSize:11,color:"rgba(240,237,232,0.4)"}}>{x.l}</span></div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        <StatCard label="Avg Daily Cals" val={Math.round(weekStats.reduce((s,d)=>s+d.cals,0)/7)} unit="kcal" color="#e05c2a"/>
        <StatCard label="Total Burned"   val={weekStats.reduce((s,d)=>s+d.burned,0)} unit="kcal" color="#4fc3a1"/>
        <StatCard label="Active Days"    val={weekStats.filter(d=>d.burned>0).length} unit="/ 7 days" color="#1a7a4a"/>
        <StatCard label="Meals Logged"   val={Object.values(log).flat().length} unit="total" color="#f0a500"/>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:18,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Weight History</div>
        {weekStats.every(d=>d.w===null)
          ? <div style={{textAlign:"center",color:"rgba(240,237,232,0.3)",fontSize:14,padding:"16px 0"}}>Log your weight on the Home tab</div>
          : weekStats.filter(d=>d.w!==null).map((d,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid transparent"}}>
              <span style={{fontSize:14,color:"rgba(240,237,232,0.6)"}}>{d.day}</span>
              <span style={{fontSize:14,fontWeight:800,color:"#4fc3a1"}}>{d.w} kg</span>
            </div>
          ))}
      </div>
      <div style={{background:"rgba(224,92,42,0.06)",border:"1px solid rgba(224,92,42,0.2)",borderRadius:18,padding:"18px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <span style={{fontSize:40}}>{profile.avatar}</span>
          <div><div style={{fontWeight:900,fontSize:20}}>{profile.name}</div><div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2}}>Member since {profile.createdAt||TODAY}</div></div>
        </div>
        {[{l:"Age",v:profile.age+" years"},{l:"Weight",v:profile.weight+" kg"},{l:"Height",v:profile.height+" cm"},{l:"Activity",v:profile.activity},{l:"Goal",v:GOALS.find(g=>g.id===profile.goal)?.label},{l:"Calorie Target",v:calGoal+" kcal/day"}].map(r=>(
          <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid transparent"}}>
            <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>{r.l}</span><span style={{fontSize:13,fontWeight:700,textTransform:"capitalize"}}>{r.v}</span>
          </div>
        ))}
        <button onClick={()=>setShowEdit(true)} style={{width:"100%",background:"rgba(224,92,42,0.15)",border:"1px solid rgba(224,92,42,0.3)",borderRadius:13,padding:"12px",color:"#e05c2a",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:16}}>Edit Profile</button>
      </div>
    </div>
  );

  const ContactContent = () => (
    <div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Contact Us</div>
      <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:28}}>Questions, feedback, or partnerships - we would love to hear from you</div>
      <div style={{background:"linear-gradient(135deg,rgba(224,92,42,0.18),rgba(26,122,74,0.12))",border:"1px solid rgba(224,92,42,0.3)",borderRadius:22,padding:"28px 26px",marginBottom:24,textAlign:"center"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"center"}}>
          <svg width="72" height="72" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgG2" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e05c2a"/>
                <stop offset="100%" stopColor="#1a7a4a"/>
              </linearGradient>
              <linearGradient id="shG2" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
            </defs>
            <circle cx="48" cy="48" r="46" fill="url(#bgG2)"/>
            <circle cx="48" cy="48" r="46" fill="url(#shG2)"/>
            <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <text x="48" y="58" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="46" fill="white">K</text>
            <text x="72" y="30" textAnchor="middle" fontSize="18">🔥</text>
          </svg>
        </div>
        <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>Joachim Naakureh</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.5)",marginBottom:4}}>Developer and Founder - KhimFit</div>
        <div style={{fontSize:12,color:"rgba(240,237,232,0.35)"}}>Based in Accra, Ghana</div>
      </div>
      {[
        { icon:"📱", label:"Phone / WhatsApp", value:"+233 53 111 3498",  href:"tel:+233531113498",                        color:"#1a7a4a" },
        { icon:"📱", label:"Phone / WhatsApp", value:"+233 55 198 5225",  href:"tel:+233551985225",                        color:"#1a7a4a" },
        { icon:"✉️", label:"Email",            value:"joachimnaakureh07@gmail.com", href:"mailto:joachimnaakureh07@gmail.com", color:"#e05c2a" },
      ].map((c,i)=>(
        <a key={i} href={c.href} style={{display:"flex",alignItems:"center",gap:18,background:"rgba(255,255,255,0.04)",border:"1px solid transparent",borderRadius:18,padding:"18px 20px",marginBottom:12,textDecoration:"none",color:"#f0ede8",transition:"all 0.2s"}}>
          <div style={{width:52,height:52,borderRadius:15,background:c.color+"22",border:"1px solid "+c.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{c.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:4}}>{c.label}</div>
            <div style={{fontSize:15,fontWeight:800,color:c.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.value}</div>
          </div>
          <span style={{color:c.color,fontSize:20,flexShrink:0}}>&#x2192;</span>
        </a>
      ))}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:18,padding:"20px 22px",marginBottom:16,marginTop:8}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Availability</div>
        {[{d:"Monday - Friday",t:"8:00 AM - 6:00 PM"},{d:"Saturday",t:"9:00 AM - 2:00 PM"},{d:"Sunday",t:"Closed"}].map(r=>(
          <div key={r.d} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid transparent"}}>
            <span style={{fontSize:13,color:"rgba(240,237,232,0.6)"}}>{r.d}</span>
            <span style={{fontSize:13,fontWeight:700,color:r.t==="Closed"?"rgba(240,237,232,0.3)":"#4fc3a1"}}>{r.t}</span>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(30,144,255,0.07)",border:"1px solid rgba(30,144,255,0.2)",borderRadius:16,padding:"16px 20px"}}>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.6)",lineHeight:1.8}}>
          Want a feature added? Spotted a bug? Have a meal or workout suggestion? Reach out - we reply within 24 hours.
        </div>
      </div>
    </div>
  );


  const HelpContent = () => {
    const [openSection, setOpenSec] = useState(null);
    const sections = [
      {
        id:"start", icon:"🚀", title:"Getting Started",color:"#e05c2a",
        steps:[
          { num:1, title:"Create your profile", body:"When you first open KhimFit, tap Get Started. Enter your name, pick an avatar, then fill in your age, weight, height and sex. This lets us calculate your personal daily calorie goal using the BMR formula." },
          { num:2, title:"Pick your activity level", body:"Choose how active you are: Sedentary (desk job, no exercise), Lightly Active (1-3 days/week), Moderately Active (3-5 days/week), or Very Active (6-7 days/week). Be honest - this directly affects your calorie target." },
          { num:3, title:"Set your goal", body:"Choose Lose Weight (we subtract 300 kcal from your target), Stay Fit (maintenance), or Build Muscle (we add 300 kcal). You can always change this later from Edit Profile." },
          { num:4, title:"Your dashboard is ready", body:"You will land on the Home tab showing your calorie ring, macros, water tracker and today's meals. All your data is saved automatically on this device." },
        ]
      },
      {
        id:"diet", icon:"🍽", title:"Logging Meals",color:"#f0a500",
        steps:[
          { num:1, title:"Go to the Diet tab", body:"Tap Diet in the bottom bar (mobile) or left sidebar (desktop). You will see 20 traditional Ghanaian meals organised by category: Breakfast, Lunch, Dinner and Snack." },
          { num:2, title:"Filter by meal type", body:"Use the category pills at the top (All, Breakfast, Lunch, Dinner, Snack) to quickly find the right meal for the time of day." },
          { num:3, title:"Tap a meal to expand it", body:"Tapping any meal card opens its full details - calories, protein, carbs, fat, a description, and health benefits. Tap again to collapse it." },
          { num:4, title:"Log the meal", body:'Once expanded, tap the orange "Log [Meal Name]" button. The meal is added instantly to today's diary and your calorie ring updates on the Home tab.' },
          { num:5, title:"Remove a meal", body:"On the Home tab, find the meal under Today's Meals and tap the X button on the right to remove it from today's log." },
        ]
      },
      {
        id:"workout", icon:"🏋", title:"Tracking Workouts",color:"#1a7a4a",
        steps:[
          { num:1, title:"Quick Log - fast activity logging", body:"Go to Workout and make sure the Quick Log tab is selected. You will see 14 activity cards (Jog, HIIT, Football, etc). Simply tap any card to instantly log it - the calories burned are added to your daily total." },
          { num:2, title:"Lose Weight programme", body:"Tap the Lose Weight tab. This is an 8-week, 4-days-per-week fat-burning programme. You will see 4 weekly sessions: HIIT Cardio, Full-Body Fat Burn, Jump Rope and Core, and Steady-State Cardio." },
          { num:3, title:"Build Muscle programme", body:"Tap the Build Muscle tab. This is a 12-week strength programme with 4 sessions per week targeting different muscle groups: Chest & Triceps, Back & Biceps, Legs & Glutes, and Shoulders & Core." },
          { num:4, title:"Start a guided session", body:'Tap "Start Session" on any session card. You will see the full exercise table with sets, reps, and rest times. Tick off each set as you complete it - a progress bar tracks how far through the session you are.' },
          { num:5, title:"Log a completed session", body:'Once done, tap the big coloured "Log This Session" button at the bottom. This saves the session to your records and adds the calories burned to your daily total. The session will show as Logged with a green badge.' },
          { num:6, title:"View your records", body:"Scroll down on the Lose Weight or Build Muscle tab to see Your Records - a history of every session you have completed with dates, duration and calories burned." },
        ]
      },
      {
        id:"home", icon:"⌂", title:"Home Tab Features",color:"#4fc3a1",
        steps:[
          { num:1, title:"Calorie ring", body:"The circle on the left fills up as you eat. Orange means within goal, red means you have exceeded your calorie target for the day. The number in the centre is total kcal eaten today." },
          { num:2, title:"Stats grid", body:"The 4 boxes show: Goal (your daily calorie target), Burned (calories from workouts), Net (eaten minus burned), and Protein (grams eaten today)." },
          { num:3, title:"Macro bars", body:"The Carbohydrates, Protein and Fat bars show your progress towards the recommended daily targets for each macro. If your goal is Build Muscle, the protein target is set higher automatically." },
          { num:4, title:"Water tracker", body:'Tap "+ 250ml" each time you drink a glass of water. The 8 squares fill up with droplets as you go. Try to fill all 8 every day.' },
          { num:5, title:"Weight logger", body:"Type your current weight in kg at the bottom of the Home tab and tap Save kg. Your weight is stored by date and shown in the Stats tab weight history table." },
        ]
      },
      {
        id:"stats", icon:"📊", title:"Stats and Records",color:"#e05c2a",
        steps:[
          { num:1, title:"7-day calorie chart", body:"The bar chart shows your calorie intake (orange) and calories burned (green) for each day of the past week. Red bars mean you went over your goal that day." },
          { num:2, title:"Summary cards", body:"Below the chart you will see: Average Daily Calories, Total Burned this week, Active Days (days you logged a workout), and Total Meals logged across all time." },
          { num:3, title:"Weight history", body:"If you have logged your weight on the Home tab, it appears here as a table by day. Use this to track your progress week by week." },
          { num:4, title:"Profile card", body:"Your full profile summary is at the bottom - age, weight, height, activity level, goal and calorie target. Tap Edit Profile to update any of these values." },
        ]
      },
      {
        id:"profiles", icon:"👤", title:"Managing Profiles",color:"#f0a500",
        steps:[
          { num:1, title:"Multiple profiles", body:"KhimFit supports multiple user profiles on the same device - perfect for families. Each profile has completely separate data, goals and history." },
          { num:2, title:"Switch profiles", body:'On desktop, click "Switch Profile" at the top right. On mobile, tap Switch in the header. Select any existing profile to switch to it instantly.' },
          { num:3, title:"Edit your profile", body:"Click your avatar/name in the sidebar (desktop) or tap your avatar in the mobile header. Change your name, avatar, stats or goal. Your new calorie target is recalculated automatically." },
          { num:4, title:"Delete a profile", body:"Open Edit Profile, scroll to the bottom and tap Delete This Profile. This permanently removes all data for that profile." },
          { num:5, title:"Your data is stored locally", body:"All data is saved in your browser's localStorage on your device. This means data does not sync across devices, and clearing your browser data will erase it." },
        ]
      },
      {
        id:"tips", icon:"💡", title:"Tips for Best Results",color:"#1a7a4a",
        steps:[
          { num:1, title:"Log meals before or right after eating", body:"The sooner you log, the more accurate your daily totals will be. Use the Diet tab filter to quickly find the meal category you are eating from." },
          { num:2, title:"Be consistent with weight logging", body:"Log your weight at the same time each day - ideally in the morning before eating. This gives the most accurate trend in your Stats history." },
          { num:3, title:"Use the guided programmes consistently", body:"The Lose Weight and Build Muscle programmes are designed as multi-week plans. Follow the schedule (Monday, Wednesday, Friday, Saturday) as closely as possible for real results." },
          { num:4, title:"Hit your water goal daily", body:"Drinking 8 glasses of water per day supports metabolism, reduces hunger and improves workout performance. Tap the water tracker every time you finish a glass." },
          { num:5, title:"Adjust your goal as you progress", body:"If you are losing or gaining weight faster or slower than expected, go to Edit Profile and update your weight. Your calorie target will recalculate automatically to match your new stats." },
        ]
      },
    ];

    return (
      <div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Help and User Guide</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:28}}>Everything you need to know to get the most out of KhimFit</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:28}}>
          {sections.map(s=>(
            <button key={s.id} onClick={()=>setOpenSec(openSection===s.id?null:s.id)}
              style={{background:openSection===s.id?s.color+"22":"rgba(255,255,255,0.04)",border:"1px solid "+(openSection===s.id?s.color+"66":"rgba(255,255,255,0.08)"),borderRadius:16,padding:"16px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:28,marginBottom:7}}>{s.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:openSection===s.id?s.color:"#f0ede8",lineHeight:1.3}}>{s.title}</div>
            </button>
          ))}
        </div>
        {sections.map(s=>(
          openSection===s.id && (
            <div key={s.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid transparent",borderRadius:20,overflow:"hidden",marginBottom:20}}>
              <div style={{background:s.color+"18",borderBottom:"1px solid "+s.color+"33",padding:"18px 22px",display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:32}}>{s.icon}</span>
                <div>
                  <div style={{fontSize:18,fontWeight:900}}>{s.title}</div>
                  <div style={{fontSize:12,color:"rgba(240,237,232,0.45)",marginTop:2}}>{s.steps.length} steps</div>
                </div>
              </div>
              {s.steps.map((step,i)=>(
                <div key={i} style={{padding:"18px 22px",borderBottom:i<s.steps.length-1?"1px solid transparent":undefined,display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:s.color+"22",border:"1px solid "+s.color+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:s.color,flexShrink:0,marginTop:2}}>{step.num}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>{step.title}</div>
                    <div style={{fontSize:13,color:"rgba(240,237,232,0.6)",lineHeight:1.75}}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        ))}
        <div style={{background:"rgba(224,92,42,0.07)",border:"1px solid rgba(224,92,42,0.2)",borderRadius:16,padding:"16px 20px",marginTop:8}}>
          <div style={{fontSize:13,color:"rgba(240,237,232,0.6)",lineHeight:1.8}}>
            Still have questions? Tap <strong style={{color:"#e05c2a"}}>Contact</strong> in the menu to reach Joachim directly - we reply within 24 hours.
          </div>
        </div>
      </div>
    );
  };

  const contentMap = { home:<HomeContent/>, diet:<DietContent/>, workout:<WorkoutContent/>, stats:<StatsContent/>, contact:<ContactContent/>, help:<HelpContent/> };
  const pageTitle  = { home:"Good "+(new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening")+", "+profile.name+" "+profile.avatar, diet:"Diet Guide", workout:"Workouts", stats:"Stats and Records", contact:"Contact Us", help:"Help and User Guide" };

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",color:"#f0ede8",fontFamily:"Georgia,'Times New Roman',serif",display:"flex",position:"relative"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse at 15% 10%,rgba(224,92,42,0.1),transparent 55%),radial-gradient(ellipse at 85% 85%,rgba(26,122,74,0.08),transparent 55%)"}}/>
      {toast && <div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"11px 24px",borderRadius:32,zIndex:9999,fontSize:14,fontWeight:700,boxShadow:"0 6px 28px rgba(0,0,0,0.45)",whiteSpace:"nowrap"}}>{toast.msg}</div>}
      {showEdit && <EditProfile profile={profile} onSave={p=>{setProfile(p);setShowEdit(false);toast_("Profile updated!");}} onClose={()=>setShowEdit(false)} onDelete={delProfile}/>}
      {showSwitch && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
          <div style={{background:"#141820",borderRadius:22,padding:28,width:"100%",maxWidth:440,color:"#f0ede8"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div style={{fontSize:22,fontWeight:900}}>Switch Profile</div>
              <button onClick={()=>setShowSw(false)} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",fontSize:24,cursor:"pointer"}}>X</button>
            </div>
            {others.map(p=>(
              <button key={p.id} onClick={()=>{setProfile(p);setShowSw(false);setTab("home");toast_("Welcome back, "+p.name+"! "+p.avatar);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid transparent",borderRadius:14,padding:"14px 18px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:"#f0ede8",textAlign:"left"}}>
                <span style={{fontSize:30}}>{p.avatar}</span>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15}}>{p.name}</div><div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{p.calorieGoal} kcal goal - {GOALS.find(g=>g.id===p.goal)?.label}</div></div>
                <span style={{color:"#e05c2a",fontSize:20}}>&#x2192;</span>
              </button>
            ))}
            <button onClick={()=>{setProfile(null);setShowSw(false);}} style={{width:"100%",background:"rgba(224,92,42,0.1)",border:"1px solid rgba(224,92,42,0.3)",borderRadius:14,padding:"14px",color:"#e05c2a",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:4}}>+ Create New Profile</button>
          </div>
        </div>
      )}
      {!isMobile && <Sidebar/>}
      {isMobile && (
        <div style={{position:"fixed",top:0,left:0,right:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid transparent",padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setShowEdit(true)} style={{background:"rgba(224,92,42,0.15)",border:"1px solid rgba(224,92,42,0.3)",borderRadius:12,width:40,height:40,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{profile.avatar}</button>
            <div><div style={{fontSize:10,color:"rgba(240,237,232,0.4)",letterSpacing:2,textTransform:"uppercase",lineHeight:1}}>Welcome back</div><div style={{fontSize:17,fontWeight:900,letterSpacing:-0.5}}>{profile.name}</div></div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"rgba(240,237,232,0.3)",letterSpacing:2}}>GOAL</div><div style={{fontSize:14,fontWeight:900,color:"#e05c2a"}}>{calGoal} kcal</div></div>
            {others.length>0&&<button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid transparent",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:11,color:"rgba(240,237,232,0.5)"}}>Switch</button>}
          </div>
        </div>
      )}
      <main style={{flex:1,position:"relative",zIndex:1,paddingTop:isMobile?70:0,paddingBottom:isMobile?85:0,overflowY:"auto",minHeight:"100vh"}}>
        {!isMobile && (
          <div style={{padding:"24px 32px 0",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div>
              <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",letterSpacing:2,textTransform:"uppercase"}}>{new Date().toLocaleDateString("en-GH",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
              <div style={{fontSize:26,fontWeight:900,marginTop:2}}>{pageTitle[tab]}</div>
            </div>
            {others.length>0&&<button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid transparent",borderRadius:12,padding:"10px 18px",cursor:"pointer",fontSize:13,color:"rgba(240,237,232,0.6)",fontWeight:600}}>Switch Profile ({others.length})</button>}
          </div>
        )}
        <div style={{padding:cPad}}>{contentMap[tab]}</div>
      </main>
      {isMobile && <BottomNav/>}
      <style>{`*{box-sizing:border-box;}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;}input[type=number]{-moz-appearance:textfield;}::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}a:hover{opacity:0.85;}button:hover{opacity:0.88;}`}</style>
    </div>
  );
}
