import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ── Supabase ──────────────────────────────────────────────────────────────────
import { supabase, signOut, saveProfile, loadProfile } from "./supabase.js";

// ── Components ────────────────────────────────────────────────────────────────
import JhimFitLogo from "./components/JhimFitLogo";
import SpiritAvatar from "./components/SpiritAvatar";
import { HydrationSprite, CalorieFlamSprite, StreakBeast } from "./components/ProgressSprites";
import { LevelBadge } from "./components/LevelBadge";
import AuthScreen from "./components/AuthScreen";
import Onboarding from "./components/Onboarding";
import EditProfile from "./components/EditProfile";
import { MealCard, StatCard, DiffBadge } from "./components/Cards";
import HelpContent from "./components/HelpContent";
import ExerciseDrillModal, { EXERCISE_VIDEOS } from "./components/ExerciseDrillModal";

// ── Data ──────────────────────────────────────────────────────────────────────
import { GHANAIAN_MEALS } from "./data/meals";
import { QUICK_WORKOUTS, WORKOUT_PLANS } from "./data/workouts";
import { GOALS, SPIRIT_ANIMALS, AVATARS, DAYS, CATS, SPORT_FONT, BODY_FONT } from "./data/constants";

// ── Utilities & Hooks ─────────────────────────────────────────────────────────
import { fmt, TODAY, fmtTime, calcCalGoal, calcLevel, getProfiles, setProfiles, getUserData, setUserData, getSession, setSession } from "./utils/helpers";
import { useIsMobile, usePWAInstall, useToast } from "./hooks/index";
import { injectGlobalStyles } from "./styles/global";

export default function JhimFitness() {
  const isMobile = useIsMobile();
  useEffect(()=>injectGlobalStyles(),[]);

  // Hide splash screen once app mounts
  useEffect(() => {
    if (window.__hideSplash) window.__hideSplash();
  }, []);

  // ── Supabase auth state ──────────────────────────────────────────────────
  const [authUser, setAuthUser]   = useState(null);   // Supabase user object
  const [authReady, setAuthReady] = useState(false);  // finished checking session
  const [showAuth, setShowAuth]   = useState(false);  // show auth screen

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null);
      setAuthReady(true);
    });
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Session restore logic ────────────────────────────────────────────────
  // sessionStorage clears when app is fully closed/swiped away from background
  // localStorage persists across full closes
  // Rules:
  //   • App killed & reopened   → always go to "home"
  //   • App still in background → React state is alive, tab stays where it was
  //   • First ever open         → go to "home" (onboarding if no profile)
  const _sess     = getSession();
  const _profiles = getProfiles();
  const _restoredProfile = _sess.profileName ? (_profiles[_sess.profileName]||null) : null;

  // Use sessionStorage to detect if this is a fresh app launch vs background resume
  const _isFreshLaunch = !sessionStorage.getItem("jhimfit_active");
  if (!sessionStorage.getItem("jhimfit_active")) {
    sessionStorage.setItem("jhimfit_active", "1");
  }

  // Fresh launch always starts on home; background resume keeps React state (no re-init needed)
  const [profile, setProfile]   = useState(_restoredProfile);
  const [tab, setTab]           = useState("home");  // always start on home
  const [data, setData]         = useState({ log:{}, workoutLog:{}, water:{}, weightLog:{} });
  const [weightInput, setWI]    = useState("");
  const [selectedMeal, setSM]   = useState(null);
  const [filterCat, setFC]      = useState("All");
  const [toast, setToast]       = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSwitch, setShowSw] = useState(false);
  const [wTab, setWTab]         = useState("log");
  const [openSession, setOpenSess] = useState(null);
  const [drillEx, setDrillEx]       = useState(null);
  const closeDrill = useCallback(() => {
    setDrillEx(null);
    setTimerRun(true); // resume timer when modal closes
  }, []);

  const openDrill = useCallback((ex) => {
    setDrillEx(ex);
    setTimerRun(false); // pause timer while watching drill
  }, []);
  const [timerSecs, setTimerSecs]   = useState(0);
  const [timerRunning, setTimerRun] = useState(false);
  const [restSecs, setRestSecs]     = useState(0);
  const [restRunning, setRestRun]   = useState(false);
  const [completedSets, setCS]  = useState({});
  const [workoutRecords, setWRec] = useState({});
  const { showBanner: showInstallBanner, isInstalled, triggerInstall } = usePWAInstall();
  const handleInstall = async () => {
    const accepted = await triggerInstall();
    if (accepted) toast_("JhimFit installed! 🎉", "#1a6e5a");
  };

  // ── Back button / swipe-back navigation ──────────────────────────────────
  // Push a history state for each tab so the browser back button navigates
  // within the app instead of closing it or going to a previous URL.
  const tabHistory = React.useRef(["home"]);

  const navigateTo = useCallback((newTab) => {
    if (newTab === tab) return;
    tabHistory.current = [...tabHistory.current, newTab];
    window.history.pushState({ tab: newTab }, "", "");
    setTab(newTab);
    // Close any open modals
    setShowEdit(false);
    setShowSw(false);
  }, [tab]);

  useEffect(() => {
    // Push initial state so the first back press doesn't exit
    window.history.replaceState({ tab: "home" }, "", "");

    const handlePopState = (e) => {
      const hist = tabHistory.current;
      if (hist.length > 1) {
        // Go back to previous tab
        const prev = hist[hist.length - 2];
        tabHistory.current = hist.slice(0, -1);
        setTab(prev);
        // Push a new state so next back still works
        window.history.pushState({ tab: prev }, "", "");
      } else {
        // Already at home — push state again to prevent app exit
        setTab("home");
        window.history.pushState({ tab: "home" }, "", "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Keep tab history in sync when tab changes via navigateTo
  // (direct setTab calls from other parts of the app also update history)
  const prevTabRef = React.useRef(tab);
  useEffect(() => {
    if (tab !== prevTabRef.current) {
      prevTabRef.current = tab;
    }
  }, [tab]);

  // Save active profile + tab to localStorage whenever they change
  useEffect(() => {
    if (profile) setSession({ profileName: profile.name, tab });
  }, [profile&&profile.name, tab]);

  useEffect(() => {
    if (!profile) return;
    const s = getUserData(profile.id);
    setData({ log:s.log||{}, workoutLog:s.workoutLog||{}, water:s.water||{}, weightLog:s.weightLog||{} });
    setWRec(s.workoutRecords||{});
    setCS(s.completedSets||{});
    // If logged in, try to load profile from Supabase
    if (authUser) {
      loadProfile(authUser.id).then(({ data: sbProfile }) => {
        if (sbProfile && sbProfile.name) {
          // Merge Supabase profile data into local profile
          const merged = { ...profile, ...{
            name: sbProfile.name, avatar: sbProfile.spirit_animal || sbProfile.avatar || profile.avatar,
            age: sbProfile.age, sex: sbProfile.sex, weight: sbProfile.weight_kg,
            height: sbProfile.height_cm, activity: sbProfile.activity, goal: sbProfile.goal,
            spiritAnimal: sbProfile.spirit_animal,
          }};
          setProfile(merged);
          const all = getProfiles(); all[merged.name] = merged; setProfiles(all);
        }
      });
    }
  }, [profile&&profile.id]);

  useEffect(() => {
    if (!profile) return;
    setUserData(profile.id, {...getUserData(profile.id), ...data, workoutRecords, completedSets});
    // Sync profile to Supabase if logged in
    if (authUser) saveProfile(authUser.id, profile).catch(()=>{});
  }, [data, workoutRecords, completedSets, profile&&profile.id]);

  // ── Session stopwatch ──────────────────────────────────────────────────
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimerSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // ── Rest countdown ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!restRunning) return;
    if (restSecs <= 0) { setRestRun(false); return; }
    const id = setInterval(() => setRestSecs(s => {
      if (s <= 1) { setRestRun(false); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [restRunning, restSecs]);

  // Reset timer when session closes
  useEffect(() => {
    if (!openSession) { setTimerSecs(0); setTimerRun(false); setRestSecs(0); setRestRun(false); }
    else { setTimerSecs(0); setTimerRun(true); } // auto-start on session open
  }, [openSession]);

  const fmtTime = (s) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return h > 0
      ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
      : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const startRest = (restStr) => {
    const secs = restStr==="--" ? 0 : parseInt(restStr)*( restStr.includes("min") ? 60 : 1 );
    if (secs > 0) { setRestSecs(secs); setRestRun(true); }
  };

  const toast_ = (msg, color="#1a6e5a") => { setToast({msg,color}); setTimeout(()=>setToast(null),2500); };

  // ── Auth gate: show auth screen if requested ──
  if (showAuth) return (
    <AuthScreen onAuth={(user, nameHint) => {
      setShowAuth(false);
      if (user) {
        setAuthUser(user);
        // Try to load existing Supabase profile
        loadProfile(user.id).then(({ data: sbProfile }) => {
          if (sbProfile && sbProfile.name) {
            const p = {
              id: user.id, name: sbProfile.name,
              avatar: sbProfile.spirit_animal || "eagle",
              spiritAnimal: sbProfile.spirit_animal || "eagle",
              age: sbProfile.age, sex: sbProfile.sex,
              weight: sbProfile.weight_kg, height: sbProfile.height_cm,
              activity: sbProfile.activity, goal: sbProfile.goal,
              calorieGoal: calcCalGoal({ weight:sbProfile.weight_kg, height:sbProfile.height_cm, age:sbProfile.age, sex:sbProfile.sex, activity:sbProfile.activity, goal:sbProfile.goal }),
            };
            const all = getProfiles(); all[p.name] = p; setProfiles(all);
            setProfile(p); setTab("home");
            toast_("Welcome back, " + p.name + "! ☁️ Data synced", "#C9A84C");
          }
        });
      }
    }}/>
  );

  if (!profile) return <Onboarding onComplete={p=>{
    setProfile(p); setTab("home");
    // Save to Supabase if logged in
    if (authUser) saveProfile(authUser.id, p).then(()=>toast_("Profile saved to cloud ☁️","#C9A84C"));
  }}/>;


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
  const addQW  = w  => { upd("workoutLog",{...workoutLog,[TODAY]:[...(workoutLog[TODAY]||[]),{...w,logId:Date.now()}]}); toast_(w.icon+" "+w.name+" logged!","#C9A84C"); };
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

  const toggleSet = (key, restStr) => {
    setCS(prev => {
      const nowDone = !prev[key];
      if (nowDone && restStr && restStr !== "--") startRest(restStr);
      return {...prev, [key]: nowDone};
    });
  };

  const weekStats = DAYS.map((d,i)=>{ const dt=new Date(); dt.setDate(dt.getDate()-(6-i)); const k=fmt(dt); const ms=log[k]||[]; const ws=workoutLog[k]||[]; return {day:d,cals:ms.reduce((s,m)=>s+m.calories,0),burned:ws.reduce((s,w)=>s+w.calories,0),w:weightLog[k]||null}; });
  const maxCals   = Math.max(...weekStats.map(s=>s.cals),calGoal,1);
  const filtered  = filterCat==="All"?GHANAIAN_MEALS:GHANAIAN_MEALS.filter(m=>m.category===filterCat);
  const others    = Object.values(getProfiles()).filter(p=>p.id!==profile.id);
  const delProfile = () => { const a=getProfiles(); delete a[profile.name]; setProfiles(a); localStorage.removeItem("kfd_"+profile.id); setProfile(null); setShowEdit(false); localStorage.removeItem("jhimfit_session"); };
  const goToWelcome = () => { localStorage.removeItem("jhimfit_session"); setProfile(null); };

  const cPad     = isMobile ? "16px" : "28px 32px";
  const navItems = [
    {id:"home",    icon:"⌂",  label:"Home"},
    {id:"diet",    icon:"🍽", label:"Diet"},
    {id:"workout", icon:"🏋", label:"Workout"},
    {id:"stats",   icon:"📊", label:"Stats"},
    {id:"contact", icon:"📞", label:"Contact"},
    {id:"help",    icon:"❓",  label:"Help"},
  ];

  // ── Context-aware quick actions per tab ──────────────────────────────────
  const CTX_ACTIONS = {
    home: [
      { label:"Log Water",      icon:"💧", action:()=>{ addWater(); toast_("💧 Water logged!","#4a9eff"); } },
      { label:"Today's Stats",  icon:"📈", action:()=>navigateTo("stats") },
      { label:"Quick Workout",  icon:"⚡", action:()=>navigateTo("workout") },
    ],
    diet: [
      { label:"Log a Meal",     icon:"➕", action:()=>{ navigateTo("diet"); } },
      { label:"Nutrition Summary", icon:"🥗", action:()=>navigateTo("stats") },
      { label:"Add Water",      icon:"💧", action:()=>{ addWater(); toast_("💧 Water logged!","#4a9eff"); } },
    ],
    workout: openSession ? [
      { label: timerRunning ? "Pause Timer" : "Resume Timer", icon: timerRunning ? "⏸" : "▶", action:()=>setTimerRun(r=>!r) },
      { label:"Reset Timer",    icon:"↺",  action:()=>{ setTimerSecs(0); setTimerRun(false); } },
      { label:"Back to Plan",   icon:"◀",  action:()=>setOpenSess(null) },
    ] : [
      { label:"Lose Weight Plan", icon:"🔥", action:()=>{ setWTab("lose"); navigateTo("workout"); } },
      { label:"Build Muscle Plan",icon:"💪", action:()=>{ setWTab("gain"); navigateTo("workout"); } },
      { label:"Quick Log",        icon:"⚡", action:()=>{ setWTab("log");  navigateTo("workout"); } },
    ],
    stats: [
      { label:"This Week",      icon:"📅", action:()=>navigateTo("stats") },
      { label:"Log Weight",     icon:"⚖️", action:()=>navigateTo("home") },
      { label:"View Diet",      icon:"🍽", action:()=>navigateTo("diet") },
    ],
    contact: [
      { label:"Call Now",       icon:"📞", action:()=>window.open("tel:+233531113498") },
      { label:"Send Email",     icon:"✉️", action:()=>window.open("mailto:joachimnaakureh07@gmail.com") },
      { label:"WhatsApp",       icon:"💬", action:()=>window.open("https://wa.me/233531113498") },
    ],
    help: [
      { label:"How to Log Meals",  icon:"🍽", action:()=>navigateTo("diet") },
      { label:"Start a Workout",   icon:"🏋", action:()=>navigateTo("workout") },
      { label:"View Progress",     icon:"📊", action:()=>navigateTo("stats") },
    ],
  };
  const ctxActions = CTX_ACTIONS[tab] || [];

  const Sidebar = () => (
    <div style={{width:260,flexShrink:0,background:"#0a0f1e",borderRight:"none",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:"28px 24px 20px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:4}}>Fitness and Nutrition</div>
        <JhimFitLogo size="md" />
      </div>
      <button onClick={()=>setShowEdit(true)} style={{margin:"0 14px",background:"rgba(201,168,76,0.1)",borderLeft:"3px solid #C9A84C",borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,color:"#f0ede8",marginBottom:10}}>
        <SpiritAvatar animalId={profile.spiritAnimal||profile.avatar||"eagle"} seed={profile.name} size={40} ring={true}/>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.name}</div><div style={{fontSize:11,color:"#C9A84C",marginTop:2}}>{calGoal} kcal goal</div></div>
        <span style={{fontSize:12,color:"rgba(240,237,232,0.3)"}}>edit</span>
      </button>
      {others.length>0 && <button onClick={()=>setShowSw(true)} style={{margin:"0 14px 8px",background:"rgba(255,255,255,0.0)",border:"none",borderRadius:12,padding:"9px 14px",cursor:"pointer",color:"rgba(240,237,232,0.5)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:8}}>Switch Profile ({others.length})</button>}
      {/* Cloud sync / auth button */}
      {authUser ? (
        <button onClick={()=>{ signOut(); setAuthUser(null); toast_("Signed out","#666"); }}
          style={{margin:"0 14px 16px",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:12,padding:"8px 14px",cursor:"pointer",color:"#10B981",fontSize:11,textAlign:"left",display:"flex",alignItems:"center",gap:8,width:"calc(100% - 28px)"}}>
          <span>☁️</span><span style={{flex:1}}>Synced to cloud</span><span style={{opacity:0.5}}>Sign out</span>
        </button>
      ) : (
        <button onClick={()=>setShowAuth(true)}
          style={{margin:"0 14px 16px",background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:12,padding:"8px 14px",cursor:"pointer",color:"#C9A84C",fontSize:11,textAlign:"left",display:"flex",alignItems:"center",gap:8,width:"calc(100% - 28px)"}}>
          <span>☁️</span><span>Sign in to sync data across devices</span>
        </button>
      )}
      <nav style={{flex:1,padding:"0 14px",overflowY:"auto",scrollbarWidth:"none"}}>
        {navItems.map(t=>(
          <div key={t.id}>
            <button onClick={()=>navigateTo(t.id)} style={{width:"100%",background:tab===t.id?"rgba(201,168,76,0.15)":"transparent",border:"1px solid "+(tab===t.id?"rgba(201,168,76,0.4)":"transparent"),borderRadius:13,padding:"13px 16px",marginBottom:tab===t.id?4:6,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:tab===t.id?"#C9A84C":"rgba(240,237,232,0.55)",fontSize:15,textAlign:"left",fontWeight:tab===t.id?700:400,transition:"all 0.2s"}}>
              <span style={{fontSize:20}}>{t.icon}</span>{t.label}
            </button>
            {/* Context actions — only shown under active tab */}
            {tab===t.id && ctxActions.length>0 && (
              <div style={{marginBottom:8,marginLeft:8,padding:"8px 0 4px",borderLeft:"2px solid rgba(201,168,76,0.2)",paddingLeft:12}}>
                <div style={{fontSize:9,letterSpacing:2,color:"rgba(201,168,76,0.5)",textTransform:"uppercase",marginBottom:6}}>Quick Actions</div>
                {ctxActions.map((a,i)=>(
                  <button key={i} onClick={a.action} style={{width:"100%",background:"transparent",border:"none",borderRadius:9,padding:"7px 10px",marginBottom:2,cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:"rgba(240,237,232,0.65)",fontSize:13,textAlign:"left",transition:"all 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:14,width:20,textAlign:"center"}}>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div style={{padding:"12px 14px 0",borderTop:"none"}}>

        <div style={{padding:"0 10px 16px",fontSize:10,color:"rgba(240,237,232,0.2)",letterSpacing:1,lineHeight:1.9}}>
          JHIMFIT v2.0<br/>BUILT BY JOACHIM<br/>ACCRA, GHANA
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100}}>
      {/* Context action strip above bottom nav */}
      {ctxActions.length>0 && (
        <div style={{
          background:"rgba(10,15,30,0.97)",backdropFilter:"blur(20px)",
          borderTop:"1px solid rgba(201,168,76,0.15)",
          display:"flex", overflowX:"auto", gap:8,
          padding:"8px 12px", scrollbarWidth:"none",
        }}>
          <div style={{fontSize:9,letterSpacing:2,color:"rgba(201,168,76,0.6)",textTransform:"uppercase",alignSelf:"center",flexShrink:0,marginRight:4}}>Quick:</div>
          {ctxActions.map((a,i)=>(
            <button key={i} onClick={a.action} style={{
              flexShrink:0, background:"rgba(201,168,76,0.08)",
              border:"1px solid rgba(201,168,76,0.2)",
              borderRadius:20, padding:"6px 14px",
              color:"#f0ede8", fontSize:12, cursor:"pointer",
              display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
              fontFamily:BODY_FONT,
            }}>
              <span style={{fontSize:13}}>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      )}
      {/* Main tab bar */}
      <div style={{background:"rgba(10,15,30,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"grid",gridTemplateColumns:"repeat(6,1fr)"}}>
        {navItems.map(t=>(
          <button key={t.id} onClick={()=>navigateTo(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:18,filter:tab===t.id?"none":"grayscale(1) opacity(0.38)"}}>{t.icon}</span>
            <span style={{fontSize:7,letterSpacing:0.3,textTransform:"uppercase",color:tab===t.id?"#C9A84C":"rgba(240,237,232,0.3)"}}>{t.label}</span>
            {tab===t.id&&<div style={{width:16,height:2,background:"#C9A84C",borderRadius:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );


  // ── Daily tip + streak ────────────────────────────────────────────────────
  const TIPS = [
    "Drink a full glass of water before every meal - it reduces appetite naturally.",
    "Your body burns more fat during sleep than during light exercise. Protect your rest.",
    "Protein takes more energy to digest than carbs or fat - eat it with every meal.",
    "A 10-minute walk after eating lowers blood sugar and aids digestion.",
    "Muscle burns 3x more calories at rest than fat does. Strength training pays off.",
    "Eating slowly and chewing well can reduce calorie intake by up to 10%.",
    "Skipping breakfast often leads to bigger meals later. Eat within 2 hours of waking.",
    "Consistency beats perfection. 80% effort 7 days beats 100% effort 3 days.",
    "Dehydration feels identical to hunger. Drink water first before reaching for food.",
    "Progress photos every 2 weeks reveal changes the scale cannot show.",
  ];
  const todayTip = TIPS[new Date().getDate() % TIPS.length];
  const streakDays = (() => {
    let s=0; const d=new Date();
    while(s<30){ const k=fmt(d); if(!log[k]&&!workoutLog[k]) break; s++; d.setDate(d.getDate()-1); }
    return s;
  })();

  const HomeContent = (() => (
    <div style={{fontFamily:BODY_FONT}}>
      {/* Date + Streak row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontSize:11,color:"rgba(240,237,232,0.35)",letterSpacing:1,textTransform:"uppercase"}}>{new Date().toLocaleDateString("en-GH",{weekday:"long",day:"numeric",month:"long"})}</div>
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:16,padding:"6px 12px"}}>
          <StreakBeast days={streakDays}/>
        </div>
      </div>

      {/* Spirit Animal + Level Banner */}
      <div className="bento-card" style={{background:"rgba(255,255,255,0.02)",borderRadius:18,padding:"12px 16px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,animationDelay:"0.02s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <SpiritAvatar animalId={profile.spiritAnimal||"eagle"} seed={profile.name} size={52} ring={true}/>
          {(() => { const animal = SPIRIT_ANIMALS.find(a=>a.id===(profile.spiritAnimal||"eagle")); return animal ? (
            <div>
              <div style={{fontFamily:SPORT_FONT,fontSize:16,letterSpacing:1,color:animal.color,lineHeight:1}}>{animal.emoji} {animal.name}</div>
              <div style={{fontSize:10,color:"rgba(240,237,232,0.4)",marginTop:3,fontStyle:"italic"}}>{animal.desc}</div>
            </div>
          ) : null; })()}
        </div>
        {(() => {
          const totalLogged = Object.values(log).flat().reduce((s,m)=>s+m.calories,0);
          const totalWorkouts = Object.values(workoutLog).flat().length;
          const lvl = calcLevel(totalLogged, streakDays, totalWorkouts);
          const animal = SPIRIT_ANIMALS.find(a=>a.id===(profile.spiritAnimal||"eagle"));
          return <LevelBadge level={lvl.level} xpInLevel={lvl.xpInLevel} xpToNext={lvl.xpToNext} color={(animal&&animal.color)||"#C9A84C"}/>;
        })()}
      </div>

      {/* HERO — calorie ring + big stats */}
      <div className="bento-card" style={{background:"linear-gradient(135deg,#111827,#090d16)",borderLeft:"4px solid #C9A84C",borderRadius:22,padding:"20px 22px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <svg width={110} height={110}>
              <circle cx={55} cy={55} r={46} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10}/>
              <circle cx={55} cy={55} r={46} fill="none" stroke={calPct>=100?"#e03030":"#C9A84C"} strokeWidth={10}
                strokeDasharray={String(2*Math.PI*46)} strokeDashoffset={String(2*Math.PI*46*(1-Math.min(calPct,100)/100))}
                strokeLinecap="round" transform="rotate(-90 55 55)" style={{transition:"stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)"}}/>
              <text x={55} y={50} textAnchor="middle" fill="#f0ede8" fontSize={20} fontWeight="900" fontFamily={SPORT_FONT}>{totCal}</text>
              <text x={55} y={65} textAnchor="middle" fill="rgba(240,237,232,0.35)" fontSize={9} fontFamily={BODY_FONT}>kcal eaten</text>
              <text x={55} y={78} textAnchor="middle" fill={calPct>=100?"#e03030":"rgba(201,168,76,0.7)"} fontSize={9} fontFamily={BODY_FONT}>{Math.round(calPct)}% of goal</text>
            </svg>
          </div>
          <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,minWidth:160}}>
            {[{l:"Goal",v:calGoal,u:"kcal",c:"#C9A84C"},{l:"Burned",v:burned,u:"kcal",c:"#1a6e5a"},{l:"Net",v:netCal,u:"kcal",c:netCal>calGoal?"#e03030":"#4db89a"},{l:"Protein",v:totPro,u:"g",c:"#f0a500"}].map(s=>(
              <div key={s.l} className="stat-tile" style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 12px",cursor:"default"}}>
                <div style={{fontFamily:SPORT_FONT,fontSize:22,color:s.c,letterSpacing:1,lineHeight:1}}>{s.v}<span style={{fontSize:11,fontFamily:BODY_FONT,fontWeight:400,opacity:0.7}}> {s.u}</span></div>
                <div style={{fontSize:10,color:"rgba(240,237,232,0.4)",marginTop:4,letterSpacing:0.5}}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENTO ROW 1 — Goal mode (wide) + Streak tile (narrow) */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginBottom:10}}>
        <div className="bento-card" style={{background:"rgba(201,168,76,0.08)",borderLeft:"3px solid #C9A84C",borderRadius:16,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,animationDelay:"0.05s"}}>
          <CalorieFlamSprite net={netCal} goal={calGoal}/>
          <div>
            <div style={{fontFamily:SPORT_FONT,fontSize:18,letterSpacing:1,color:"#C9A84C"}}>{(GOALS.find(g=>g.id===profile.goal)||{label:""}).label} Mode</div>
            <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:1}}>{calGoal} kcal/day target</div>
          </div>
        </div>
        <div className="bento-card" style={{background:"rgba(26,122,74,0.1)",borderLeft:"3px solid #1a6e5a",borderRadius:16,padding:"12px 16px",textAlign:"center",animationDelay:"0.08s",minWidth:72}}>
          <div style={{fontFamily:SPORT_FONT,fontSize:28,color:"#4db89a",letterSpacing:1,lineHeight:1}}>{tMeals.length}</div>
          <div style={{fontSize:9,color:"rgba(240,237,232,0.4)",marginTop:4,letterSpacing:0.5}}>MEALS</div>
        </div>
      </div>

      {/* BENTO ROW 2 — Macros (tall) + Water (square) side by side */}
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:10,marginBottom:10}}>
        {/* Macros tile */}
        <div className="bento-card" style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid #f0a500",borderRadius:16,padding:"14px 16px",animationDelay:"0.1s"}}>
          <div style={{fontFamily:SPORT_FONT,fontSize:13,letterSpacing:2,color:"#f0a500",marginBottom:12}}>MACROS</div>
          {[{l:"Carbs",v:totCarb,max:250,c:"#C9A84C"},{l:"Protein",v:totPro,max:profile.goal==="gain"?120:80,c:"#1a6e5a"},{l:"Fat",v:totFat,max:65,c:"#f0a500"}].map(m=>(
            <div key={m.l} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                <span style={{color:"rgba(240,237,232,0.5)"}}>{m.l}</span>
                <span style={{color:m.c,fontWeight:700,fontFamily:SPORT_FONT,fontSize:13}}>{m.v}g</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:10}}>
                <div style={{height:"100%",borderRadius:10,background:m.c,width:Math.min((m.v/m.max)*100,100)+"%",transition:"width 0.8s cubic-bezier(.4,0,.2,1)"}}/>
              </div>
            </div>
          ))}
        </div>
        {/* Water tile */}
        <div className="bento-card" style={{background:"rgba(30,144,255,0.08)",borderLeft:"3px solid #4a9eff",borderRadius:16,padding:"14px 14px",animationDelay:"0.12s",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontFamily:SPORT_FONT,fontSize:13,letterSpacing:2,color:"#4a9eff"}}>WATER</div>
            <HydrationSprite current={tWater} goal={waterGoal}/>
          </div>
          <div style={{fontFamily:SPORT_FONT,fontSize:32,color:"#7ab8ff",letterSpacing:1,lineHeight:1,marginBottom:2}}>{tWater}<span style={{fontSize:14,opacity:0.5}}>/{waterGoal}</span></div>
          <div style={{fontSize:10,color:"rgba(240,237,232,0.35)",marginBottom:10}}>glasses today</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:10,flex:1}}>
            {Array.from({length:waterGoal}).map((_,i)=>(
              <div key={i} className={i<tWater?"water-drop":""} style={{aspectRatio:"1",borderRadius:8,background:i<tWater?"rgba(30,144,255,0.55)":"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,animationDelay:i<tWater?`${i*0.06}s`:"0s"}}>
                {i<tWater&&"💧"}
              </div>
            ))}
          </div>
          <button className="water-btn" onClick={addWater} style={{background:"rgba(30,144,255,0.25)",border:"none",borderRadius:10,padding:"8px 0",color:"#7ab8ff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:SPORT_FONT,letterSpacing:1,width:"100%"}}>+ 250ML</button>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bento-card" style={{background:"rgba(240,160,0,0.06)",borderLeft:"3px solid #f0a500",borderRadius:16,padding:"14px 18px",marginBottom:10,animationDelay:"0.15s"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:20,flexShrink:0}}>💡</span>
          <div>
            <div style={{fontFamily:SPORT_FONT,fontSize:12,letterSpacing:2,color:"#f0a500",marginBottom:5}}>TODAY'S TIP</div>
            <div style={{fontSize:13,color:"rgba(240,237,232,0.65)",lineHeight:1.75}}>{todayTip}</div>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bento-card" style={{marginBottom:10,animationDelay:"0.18s"}}>
        <div style={{fontFamily:SPORT_FONT,fontSize:13,letterSpacing:2,color:"rgba(240,237,232,0.4)",marginBottom:10}}>TODAY'S MEALS</div>
        {tMeals.length===0
          ? <div style={{borderRadius:14,padding:"20px 0",textAlign:"center",color:"rgba(240,237,232,0.25)",fontSize:13}}>Nothing logged yet — head to the Diet tab</div>
          : tMeals.map(m=>(
            <div key={m.logId} style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid #C9A84C",borderRadius:13,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:38,height:38,borderRadius:10,background:(m.color||"#C9A84C")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.emoji}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700}}>{m.name}</div>
                  <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:1}}>{m.calories} kcal · {m.protein}g protein</div>
                </div>
              </div>
              <button onClick={()=>rmM(m.logId)} style={{background:"rgba(201,168,76,0.1)",color:"#C9A84C",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12,flexShrink:0,border:"none",fontWeight:700}}>✕</button>
            </div>
          ))}
      </div>

      {/* Weight logger */}
      <div className="bento-card" style={{background:"rgba(79,195,161,0.06)",borderLeft:"3px solid #4db89a",borderRadius:16,padding:"14px 18px",animationDelay:"0.2s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:SPORT_FONT,fontSize:13,letterSpacing:2,color:"#4db89a"}}>LOG WEIGHT</div>
          <span style={{fontSize:10,color:"rgba(240,237,232,0.3)",letterSpacing:1}}>stored in kg</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{position:"relative",flex:1}}>
            <input type="number" placeholder={"e.g. "+(profile.weight||"70")} value={weightInput} onChange={e=>setWI(e.target.value)}
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"none",borderRadius:10,padding:"10px 44px 10px 14px",color:"#f0ede8",fontSize:14,outline:"none",fontFamily:BODY_FONT}}/>
            <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.35)",fontSize:12}}>kg</span>
          </div>
          <button onClick={saveWt} style={{background:"#C9A84C",border:"none",borderRadius:10,padding:"10px 18px",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:13,flexShrink:0,fontFamily:SPORT_FONT,letterSpacing:1}}>SAVE</button>
        </div>
        {weightLog[TODAY]&&<div style={{marginTop:8,fontSize:12,color:"#4db89a",fontWeight:600}}>Logged today: {weightLog[TODAY]} kg ✓</div>}
      </div>
    </div>
  ))();

  const DietContent = () => (
    <div>
      <div style={{marginBottom:20}}><div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Ghanaian Diet Guide</div><div style={{fontSize:13,color:"rgba(240,237,232,0.45)"}}>Tap any meal to expand details and log it</div></div>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {CATS.map(c=><button key={c} onClick={()=>setFC(c)} style={{background:filterCat===c?"#C9A84C":"rgba(255,255,255,0.06)",border:filterCat===c?"none":"1px solid transparent",color:filterCat===c?"#fff":"rgba(240,237,232,0.6)",borderRadius:22,padding:"7px 18px",cursor:"pointer",fontSize:13,whiteSpace:"nowrap",fontWeight:filterCat===c?700:400,transition:"all 0.2s"}}>{c}</button>)}
      </div>
      <div style={{fontSize:11,color:"rgba(240,237,232,0.3)",marginBottom:14,letterSpacing:1}}>{filtered.length} MEALS</div>
      {filtered.map(meal=><MealCard key={meal.id} meal={meal} isSelected={selectedMeal&&selectedMeal.id===meal.id} onSelect={()=>setSM(selectedMeal&&selectedMeal.id===meal.id?null:meal)} onLog={()=>addM(meal)}/>)}
    </div>
  );

  const WorkoutContent = () => {
    const activePlan = WORKOUT_PLANS.find(p=>p.id===wTab);

    if (openSession) {
      const plan = WORKOUT_PLANS.find(p=>p.id===openSession.planId);
      const sess = plan&&plan.sessions[openSession.idx];
      if (!plan||!sess) return null;
      const alreadyLogged = (workoutRecords[TODAY]||[]).some(r=>r.planId===plan.id&&r.sessionName===sess.name);
      // ── Gaming-style workout session ─────────────────────────────────────
      const PURPLE = "#8E7CFF";
      const TEAL   = "#45EBA5";
      const BG     = "#1E1E2E";

      return (
        <div style={{minHeight:"100vh", background:BG, margin:"-28px -32px", padding:"0 0 120px 0"}}>
          {drillEx && <ExerciseDrillModal exercise={drillEx} onClose={closeDrill}/>}

          {/* ── Sticky Header ── */}
          <div style={{position:"sticky",top:0,zIndex:200,background:"rgba(30,30,46,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(142,124,255,0.15)",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button onClick={()=>setOpenSess(null)} style={{background:"rgba(142,124,255,0.12)",border:"1px solid rgba(142,124,255,0.25)",borderRadius:12,padding:"8px 14px",cursor:"pointer",color:PURPLE,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
              ← Back
            </button>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase"}}>{plan.title}</div>
              <div style={{fontSize:15,fontWeight:900,color:"#fff"}}>{sess.name}</div>
            </div>
            <div style={{background:"rgba(69,235,165,0.1)",border:"1px solid rgba(69,235,165,0.2)",borderRadius:12,padding:"8px 12px",textAlign:"center",minWidth:64}}>
              <div style={{fontFamily:SPORT_FONT,fontSize:18,color:TEAL,letterSpacing:1,lineHeight:1}}>{fmtTime(timerSecs)}</div>
              <div style={{fontSize:8,color:TEAL,letterSpacing:1,opacity:0.7}}>ELAPSED</div>
            </div>
          </div>

          {/* ── Exercise Cards ── */}
          <div style={{padding:"20px 16px 0"}}>
            {sess.exercises.map((ex,ei)=>{
              const allDone = Array.from({length:ex.sets}).every((_,si)=>completedSets[plan.id+"-"+openSession.idx+"-"+ei+"-"+si]);
              const isActive = !allDone;
              const completedCount = Array.from({length:ex.sets}).filter((_,si)=>completedSets[plan.id+"-"+openSession.idx+"-"+ei+"-"+si]).length;

              return (
                <div key={ei} style={{
                  background: allDone ? "rgba(69,235,165,0.05)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${allDone ? "rgba(69,235,165,0.3)" : "rgba(142,124,255,0.2)"}`,
                  borderRadius:20, marginBottom:16, overflow:"hidden",
                  transition:"all 0.3s",
                  boxShadow: allDone ? "0 0 20px rgba(69,235,165,0.08)" : "0 4px 24px rgba(0,0,0,0.3)",
                }}>

                  {/* Animated exercise visual */}
                  <div style={{
                    background:`linear-gradient(135deg, rgba(142,124,255,0.15), rgba(69,235,165,0.08))`,
                    padding:"24px 20px 16px",
                    display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                  }}>
                    {/* Stick figure animation */}
                    <div style={{width:80,height:80,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <svg width="70" height="70" viewBox="0 0 70 70">
                        {/* Head */}
                        <circle cx="35" cy="10" r="7" fill={allDone?TEAL:PURPLE} opacity="0.9"/>
                        {/* Body */}
                        <line x1="35" y1="17" x2="35" y2="42" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round"/>
                        {/* Arms - animated based on exercise type */}
                        {(ex.anim==="curl"||ex.anim==="press"||ex.anim==="fly") ? <>
                          <line x1="35" y1="24" x2="18" y2="30" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round" style={{transformOrigin:"35px 24px",animation:allDone?"none":"ex-curl 1.2s ease-in-out infinite"}}/>
                          <line x1="35" y1="24" x2="52" y2="30" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round" style={{transformOrigin:"35px 24px",animation:allDone?"none":"ex-curl 1.2s ease-in-out infinite reverse"}}/>
                        </> : (ex.anim==="squat"||ex.anim==="lunge") ? <>
                          <line x1="35" y1="24" x2="18" y2="34" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round"/>
                          <line x1="35" y1="24" x2="52" y2="34" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round"/>
                        </> : <>
                          <line x1="35" y1="24" x2="18" y2="36" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round" style={{animation:allDone?"none":"ex-arms-star 1.2s ease-in-out infinite"}}/>
                          <line x1="35" y1="24" x2="52" y2="36" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round" style={{animation:allDone?"none":"ex-arms-star 1.2s ease-in-out infinite reverse"}}/>
                        </>}
                        {/* Legs */}
                        <line x1="35" y1="42" x2="24" y2="60" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round"
                          style={{transformOrigin:"35px 42px",animation:allDone?"none":`ex-${ex.anim||"bounce"} 1.2s ease-in-out infinite`}}/>
                        <line x1="35" y1="42" x2="46" y2="60" stroke={allDone?TEAL:PURPLE} strokeWidth="3" strokeLinecap="round"
                          style={{transformOrigin:"35px 42px",animation:allDone?"none":`ex-${ex.anim||"bounce"} 1.2s ease-in-out infinite reverse`}}/>
                        {/* Done checkmark overlay */}
                        {allDone && <text x="35" y="38" textAnchor="middle" fontSize="22" fill={TEAL}>✓</text>}
                      </svg>
                    </div>

                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:18,fontWeight:900,color:allDone?"rgba(255,255,255,0.4)":"#fff",marginBottom:4,textDecoration:allDone?"line-through":"none"}}>{ex.move}</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <span style={{background:`rgba(142,124,255,0.15)`,border:`1px solid rgba(142,124,255,0.3)`,borderRadius:20,padding:"3px 10px",fontSize:11,color:PURPLE,fontWeight:700}}>{ex.sets} sets × {ex.reps}</span>
                        {ex.rest!=="--"&&<span style={{background:"rgba(255,255,255,0.06)",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,0.5)"}}>⏱ {ex.rest}</span>}
                      </div>
                    </div>
                    {/* Progress ring */}
                    <div style={{position:"relative",width:48,height:48,flexShrink:0}}>
                      <svg width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                        <circle cx="24" cy="24" r="20" fill="none" stroke={allDone?TEAL:PURPLE} strokeWidth="4"
                          strokeDasharray={`${(completedCount/ex.sets)*125.6} 125.6`}
                          strokeLinecap="round" transform="rotate(-90 24 24)"
                          style={{transition:"stroke-dasharray 0.4s ease"}}/>
                      </svg>
                      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:11,fontWeight:900,color:allDone?TEAL:PURPLE}}>{completedCount}/{ex.sets}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes + desc */}
                  <div style={{padding:"12px 20px 0",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:10}}>{ex.desc||""}</div>
                    <button onClick={()=>openDrill(ex)} style={{
                      display:"flex",alignItems:"center",gap:7,marginBottom:14,
                      background:"rgba(142,124,255,0.1)",border:"1px solid rgba(142,124,255,0.2)",
                      borderRadius:10,padding:"7px 14px",cursor:"pointer",
                    }}>
                      <span style={{fontSize:14}}>▶️</span>
                      <span style={{fontSize:12,fontWeight:700,color:PURPLE,letterSpacing:1}}>WATCH DRILL</span>
                      {!EXERCISE_VIDEOS[ex.move]&&<span style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>· coming soon</span>}
                    </button>
                  </div>

                  {/* Set rows — gaming style */}
                  <div style={{padding:"0 20px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingBottom:6,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                      <span style={{fontSize:9,letterSpacing:2,color:"rgba(255,255,255,0.25)",flex:"0 0 28px"}}>SET</span>
                      <span style={{fontSize:9,letterSpacing:2,color:"rgba(255,255,255,0.25)",flex:1}}>WEIGHT (KG)</span>
                      <span style={{fontSize:9,letterSpacing:2,color:"rgba(255,255,255,0.25)",flex:1}}>REPS</span>
                      <span style={{fontSize:9,letterSpacing:2,color:"rgba(255,255,255,0.25)",width:32}}></span>
                    </div>
                    {Array.from({length:ex.sets}).map((_,si)=>{
                      const key = plan.id+"-"+openSession.idx+"-"+ei+"-"+si;
                      const done = !!completedSets[key];
                      const repsNum = parseInt(ex.reps)||0;
                      const wKey = `w_${key}`;
                      const rKey = `r_${key}`;
                      const wVal = completedSets[wKey] ?? (profile.weight||70);
                      const rVal = completedSets[rKey] ?? repsNum;
                      return (
                        <div key={si} style={{
                          display:"flex",alignItems:"center",gap:8,marginBottom:8,
                          background: done ? "rgba(69,235,165,0.06)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${done ? "rgba(69,235,165,0.2)" : "rgba(255,255,255,0.06)"}`,
                          borderRadius:12,padding:"10px 12px",transition:"all 0.2s",
                        }}>
                          <span style={{fontSize:13,fontWeight:700,color:done?TEAL:"rgba(255,255,255,0.4)",flex:"0 0 28px"}}>{si+1}</span>
                          <div style={{flex:1,display:"flex",alignItems:"center",gap:4}}>
                            <button onClick={()=>setCS(p=>({...p,[wKey]:Math.max(0,+(p[wKey]??wVal)-2.5)}))} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:6,width:22,height:22,cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                            <span style={{fontSize:13,fontWeight:700,color:done?TEAL:"#fff",minWidth:36,textAlign:"center"}}>{wVal}</span>
                            <button onClick={()=>setCS(p=>({...p,[wKey]:+(p[wKey]??wVal)+2.5}))} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:6,width:22,height:22,cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          </div>
                          <div style={{flex:1,display:"flex",alignItems:"center",gap:4}}>
                            <button onClick={()=>setCS(p=>({...p,[rKey]:Math.max(1,+(p[rKey]??rVal)-1)}))} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:6,width:22,height:22,cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                            <span style={{fontSize:13,fontWeight:700,color:done?TEAL:"#fff",minWidth:28,textAlign:"center"}}>{rVal}</span>
                            <button onClick={()=>setCS(p=>({...p,[rKey]:+(p[rKey]??rVal)+1}))} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:6,width:22,height:22,cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          </div>
                          <button onClick={()=>toggleSet(key,ex.rest)} style={{
                            width:32,height:32,borderRadius:"50%",flexShrink:0,
                            background: done ? TEAL : "rgba(255,255,255,0.08)",
                            border: `2px solid ${done ? TEAL : "rgba(255,255,255,0.15)"}`,
                            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                            transition:"all 0.25s cubic-bezier(.34,1.56,.64,1)",
                            transform: done ? "scale(1.1)" : "scale(1)",
                            boxShadow: done ? `0 0 12px ${TEAL}66` : "none",
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7l4 4 6-6" stroke={done?"#1E1E2E":"rgba(255,255,255,0.3)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                    {allDone && (
                      <div style={{textAlign:"center",padding:"8px 0",fontSize:13,color:TEAL,fontWeight:700}}>
                        ✦ Exercise Complete ✦
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Cool down + log */}
            <div style={{background:"rgba(142,124,255,0.06)",border:"1px solid rgba(142,124,255,0.15)",borderRadius:16,padding:"16px 20px",marginBottom:16}}>
              <div style={{fontSize:10,letterSpacing:2,color:PURPLE,textTransform:"uppercase",marginBottom:4}}>Cool-down</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>{sess.cooldown}</div>
            </div>

            {!alreadyLogged && timerSecs>0 && (
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:14,padding:"14px 18px",marginBottom:12,display:"flex",justifyContent:"space-around"}}>
                {[{v:fmtTime(timerSecs),l:"TIME",c:TEAL},{v:"~"+sess.calories,l:"KCAL",c:PURPLE},{v:sess.exercises.length,l:"EXERCISES",c:"#fff"}].map(s=>(
                  <div key={s.l} style={{textAlign:"center"}}>
                    <div style={{fontFamily:SPORT_FONT,fontSize:20,color:s.c,letterSpacing:1}}>{s.v}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={()=>{if(!alreadyLogged){setTimerRun(false);logPlanSession(plan,sess);}}} disabled={alreadyLogged}
              style={{width:"100%",background:alreadyLogged?"rgba(255,255,255,0.05)":`linear-gradient(135deg,${PURPLE},#6c5ce7)`,
                border:"none",borderRadius:16,padding:"17px",color:alreadyLogged?"rgba(255,255,255,0.25)":"#fff",
                fontWeight:900,fontSize:16,cursor:alreadyLogged?"default":"pointer",marginBottom:8,
                boxShadow:alreadyLogged?"none":"0 8px 24px rgba(142,124,255,0.4)"}}>
              {alreadyLogged ? "✅ Session Logged" : "LOG SESSION  +" + sess.calories + " kcal"}
            </button>
          </div>

          {/* ── Floating Rest Timer Bar ── */}
          {restRunning && (
            <div style={{position:"fixed",bottom:isMobile?85:24,left:"50%",transform:"translateX(-50%)",zIndex:300,
              background:"rgba(30,30,46,0.97)",backdropFilter:"blur(20px)",
              border:`1px solid ${TEAL}44`,borderRadius:24,padding:"14px 24px",
              display:"flex",alignItems:"center",gap:16,
              boxShadow:`0 8px 32px rgba(69,235,165,0.25)`,
              minWidth:240}}>
              {/* Circular progress ring */}
              <div style={{position:"relative",width:52,height:52,flexShrink:0}}>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                  <circle cx="26" cy="26" r="22" fill="none" stroke={TEAL} strokeWidth="4"
                    strokeDasharray={`${(restSecs/60)*138.2} 138.2`}
                    strokeLinecap="round" transform="rotate(-90 26 26)"
                    style={{transition:"stroke-dasharray 1s linear"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:SPORT_FONT,fontSize:14,color:TEAL,letterSpacing:1}}>{restSecs}</span>
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>Rest Timer</div>
                <div style={{fontFamily:SPORT_FONT,fontSize:26,color:TEAL,letterSpacing:2,lineHeight:1}}>{fmtTime(restSecs)}</div>
              </div>
              <button onClick={()=>{setRestRun(false);setRestSecs(0);}} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:12,padding:"8px 14px",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:12}}>Skip</button>
            </div>
          )}
        </div>
      );

    return (
      <div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Workouts</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:20}}>Log activities, follow guided plans, and track records</div>
        <div style={{display:"flex",gap:8,marginBottom:24,background:"rgba(255,255,255,0.0)",borderRadius:16,padding:5}}>
          {[{id:"log",label:"Quick Log",icon:"⚡"},{id:"lose",label:"Lose Weight",icon:"🔥"},{id:"gain",label:"Build Muscle",icon:"💪"}].map(t=>(
            <button key={t.id} onClick={()=>setWTab(t.id)} style={{flex:1,background:wTab===t.id?"#C9A84C":"transparent",border:"none",borderRadius:12,padding:"10px 6px",cursor:"pointer",color:wTab===t.id?"#fff":"rgba(240,237,232,0.5)",fontSize:12,fontWeight:wTab===t.id?800:400,transition:"all 0.2s"}}>
              {t.icon+" "+t.label}
            </button>
          ))}
        </div>
        {tWorkouts.length>0 && (
          <div style={{background:"rgba(26,122,74,0.1)",borderLeft:"3px solid #1a6e5a",borderRadius:16,padding:"16px 18px",marginBottom:20}}>
            <div style={{fontSize:11,letterSpacing:2,color:"#1a6e5a",textTransform:"uppercase",marginBottom:12}}>Logged Today</div>
            {tWorkouts.map(w=>(
              <div key={w.logId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,fontSize:14}}>
                <span>{(w.icon||"🏋")+" "+w.name}</span>
                <span style={{color:"#4db89a",fontWeight:700}}>-{w.calories} kcal - {w.duration}min</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid rgba(26,122,74,0.2)",marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>Total burned today</span>
              <span style={{fontSize:17,color:"#4db89a",fontWeight:900}}>{burned} kcal</span>
            </div>
          </div>
        )}
        {wTab==="log" && (
          <>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:14}}>Quick Log Activity</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:11}}>
              {QUICK_WORKOUTS.map(w=>(
                <div key={w.id} onClick={()=>addQW(w)} style={{background:"rgba(255,255,255,0.0)",border:"none",borderRadius:16,padding:"18px 12px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <div style={{fontSize:36,marginBottom:8}}>{w.icon}</div>
                  <div style={{fontWeight:800,fontSize:13,marginBottom:4}}>{w.name}</div>
                  <div style={{fontSize:12,color:"#C9A84C",fontWeight:600}}>{w.calories} kcal</div>
                  <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginBottom:10}}>{w.duration} min</div>
                  <div style={{background:"rgba(26,122,74,0.15)",borderLeft:"3px solid #1a6e5a",borderRadius:8,padding:"5px 0",fontSize:12,color:"#4db89a",fontWeight:600}}>+ Log</div>
                </div>
              ))}
            </div>
          </>
        )}
        {(wTab==="lose"||wTab==="gain") && activePlan && (
          <div>
            {/* ── Plan Header ── */}
            <div style={{background:activePlan.bgColor,borderLeft:"4px solid "+activePlan.color,borderRadius:20,padding:"22px 24px",marginBottom:16}}>
              <div style={{fontSize:26,fontWeight:900,marginBottom:4}}>{activePlan.icon} {activePlan.title} Programme</div>
              <div style={{fontSize:13,color:"rgba(240,237,232,0.5)",marginBottom:18}}>{activePlan.subtitle}</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
                {[{l:"Duration",v:activePlan.duration},{l:"Frequency",v:activePlan.frequency},{l:"Sessions",v:activePlan.sessions.length+" per week"}].map(s=>(
                  <div key={s.l} style={{background:"rgba(0,0,0,0.25)",borderRadius:10,padding:"8px 14px"}}>
                    <div style={{fontSize:10,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase"}}>{s.l}</div>
                    <div style={{fontSize:13,fontWeight:800,color:activePlan.color,marginTop:2}}>{s.v}</div>
                  </div>
                ))}
              </div>
              {/* About */}
              <div style={{fontSize:14,color:"rgba(240,237,232,0.75)",lineHeight:1.85,marginBottom:20}}>{activePlan.about}</div>
              {/* How it works */}
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:activePlan.color,textTransform:"uppercase",marginBottom:8}}>How It Works</div>
                <div style={{fontSize:13,color:"rgba(240,237,232,0.65)",lineHeight:1.85}}>{activePlan.howItWorks}</div>
              </div>
              {/* Rules */}
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:2,color:activePlan.color,textTransform:"uppercase",marginBottom:10}}>Key Rules</div>
                {activePlan.rules.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                    <span style={{color:activePlan.color,fontWeight:900,fontSize:14,flexShrink:0,marginTop:1}}>{i+1}.</span>
                    <span style={{fontSize:13,color:"rgba(240,237,232,0.65)",lineHeight:1.7}}>{r}</span>
                  </div>
                ))}
              </div>
              {/* Weekly Schedule */}
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,letterSpacing:2,color:activePlan.color,textTransform:"uppercase",marginBottom:10}}>Weekly Schedule</div>
                {activePlan.schedule.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 0",borderBottom:i<activePlan.schedule.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                    <div style={{width:76,flexShrink:0}}>
                      <div style={{fontSize:11,fontWeight:800,color:activePlan.color}}>{s.day}</div>
                    </div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:s.session==="Rest Day"?"rgba(240,237,232,0.3)":"#f0ede8",marginBottom:2}}>{s.session}</div>
                      <div style={{fontSize:11,color:"rgba(240,237,232,0.35)",lineHeight:1.5}}>{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:14,marginTop:6}}>Weekly Sessions</div>
            {activePlan.sessions.map((sess,idx)=>{
              const alreadyLogged = (workoutRecords[TODAY]||[]).some(r=>r.planId===activePlan.id&&r.sessionName===sess.name);
              const totalSets = sess.exercises.reduce((s,e)=>s+e.sets,0);
              const doneSets  = sess.exercises.reduce((s,e,ei)=>s+Array.from({length:e.sets}).filter((_,si)=>completedSets[activePlan.id+"-"+idx+"-"+ei+"-"+si]).length,0);
              const pct = totalSets>0?Math.round((doneSets/totalSets)*100):0;
              return (
                <div key={idx} style={{background:"rgba(255,255,255,0.0)",border:"1px solid "+(alreadyLogged?"rgba(26,122,74,0.4)":"rgba(255,255,255,0.07)"),borderRadius:18,marginBottom:12,overflow:"hidden"}}>
                  <div style={{padding:"16px 18px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8,flexWrap:"wrap"}}>
                      <div><div style={{fontSize:11,letterSpacing:2,color:activePlan.color,textTransform:"uppercase",marginBottom:3}}>{sess.day}</div><div style={{fontSize:17,fontWeight:900}}>{sess.name}</div></div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                        <DiffBadge level={sess.difficulty}/>
                        {alreadyLogged&&<span style={{background:"rgba(26,122,74,0.2)",color:"#4db89a",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>Logged</span>}
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
                      {sess.exercises.slice(0,4).map((ex,ei)=><span key={ei} style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(240,237,232,0.6)"}}>{ex.move}</span>)}
                      {sess.exercises.length>4&&<span style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(240,237,232,0.4)"}}>+{sess.exercises.length-4} more</span>}
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
                <div style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid "+activePlan.color,borderRadius:18,overflow:"hidden"}}>
                  {Object.entries(workoutRecords).reverse().slice(0,10).flatMap(([date,recs])=>
                    recs.filter(r=>r.planId===activePlan.id).map((r,i)=>(
                      <div key={date+"-"+i} style={{padding:"12px 18px",borderBottom:"none",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
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
      <div style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid #C9A84C",borderRadius:18,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Calories vs Goal ({calGoal} kcal)</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-end",height:110}}>
          {weekStats.map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div style={{width:"100%",height:90,display:"flex",flexDirection:"column",justifyContent:"flex-end",gap:2}}>
                {s.burned>0&&<div style={{width:"100%",background:"rgba(26,122,74,0.55)",height:(s.burned/maxCals)*90+"px",borderRadius:"5px 5px 0 0",minHeight:4}}/>}
                <div style={{width:"100%",background:s.cals>0?(s.cals>calGoal?"#e03030":"#C9A84C99"):"rgba(255,255,255,0.06)",height:(s.cals/maxCals)*90+"px",borderRadius:"5px 5px 0 0",minHeight:s.cals>0?5:2}}/>
              </div>
              <div style={{fontSize:9,color:"rgba(240,237,232,0.4)"}}>{s.day}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,marginTop:12}}>
          {[{c:"#C9A84C99",l:"Eaten"},{c:"rgba(26,122,74,0.55)",l:"Burned"},{c:"#e03030",l:"Over goal"}].map(x=>(
            <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:11,height:11,background:x.c,borderRadius:3}}/><span style={{fontSize:11,color:"rgba(240,237,232,0.4)"}}>{x.l}</span></div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        <StatCard label="Avg Daily Cals" val={Math.round(weekStats.reduce((s,d)=>s+d.cals,0)/7)} unit="kcal" color="#C9A84C"/>
        <StatCard label="Total Burned"   val={weekStats.reduce((s,d)=>s+d.burned,0)} unit="kcal" color="#4db89a"/>
        <StatCard label="Active Days"    val={weekStats.filter(d=>d.burned>0).length} unit="/ 7 days" color="#1a6e5a"/>
        <StatCard label="Meals Logged"   val={Object.values(log).flat().length} unit="total" color="#f0a500"/>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid #C9A84C",borderRadius:18,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Weight History</div>
        {weekStats.every(d=>d.w===null)
          ? <div style={{textAlign:"center",color:"rgba(240,237,232,0.3)",fontSize:14,padding:"16px 0"}}>Log your weight on the Home tab</div>
          : weekStats.filter(d=>d.w!==null).map((d,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"none"}}>
              <span style={{fontSize:14,color:"rgba(240,237,232,0.6)"}}>{d.day}</span>
              <span style={{fontSize:14,fontWeight:800,color:"#4db89a"}}>{d.w} kg</span>
            </div>
          ))}
      </div>
      <div style={{background:"rgba(201,168,76,0.06)",borderLeft:"3px solid #C9A84C",borderRadius:18,padding:"18px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <SpiritAvatar animalId={profile.spiritAnimal||"eagle"} seed={profile.name} size={64} ring={true}/>
          <div><div style={{fontWeight:900,fontSize:20}}>{profile.name}</div><div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2}}>Member since {profile.createdAt||TODAY}</div></div>
        </div>
        {[{l:"Age",v:profile.age+" years"},{l:"Weight",v:profile.weight+" kg"},{l:"Height",v:profile.height+" cm"},{l:"Activity",v:profile.activity},{l:"Goal",v:(GOALS.find(g=>g.id===profile.goal)||{label:""}).label},{l:"Calorie Target",v:calGoal+" kcal/day"}].map(r=>(
          <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"none"}}>
            <span style={{fontSize:13,color:"rgba(240,237,232,0.4)"}}>{r.l}</span><span style={{fontSize:13,fontWeight:700,textTransform:"capitalize"}}>{r.v}</span>
          </div>
        ))}
        <button onClick={()=>setShowEdit(true)} style={{width:"100%",background:"rgba(201,168,76,0.15)",borderLeft:"3px solid #C9A84C",borderRadius:13,padding:"12px",color:"#C9A84C",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:16}}>Edit Profile</button>
      </div>
    </div>
  );

  const ContactContent = () => (
    <div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Contact Us</div>
      <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:28}}>Questions, feedback, or partnerships - we would love to hear from you</div>
      <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.18),rgba(26,122,74,0.12))",borderRadius:22,padding:"28px 26px",marginBottom:24,textAlign:"center"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"center"}}>
          <svg width="72" height="72" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgG2" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C9A84C"/>
                <stop offset="100%" stopColor="#1a6e5a"/>
              </linearGradient>
              <linearGradient id="shG2" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
            </defs>
            <circle cx="48" cy="48" r="46" fill="url(#bgG2)"/>
            <circle cx="48" cy="48" r="46" fill="url(#shG2)"/>
            <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <text x="48" y="58" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="46" fill="white">J</text>
          </svg>
        </div>
        <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>Joachim Naakureh</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.5)",marginBottom:4}}>Developer and Founder - JhimFit</div>
        <div style={{fontSize:12,color:"rgba(240,237,232,0.35)"}}>Based in Accra, Ghana</div>
      </div>
      {[
        { icon:"📞", label:"Call",      value:"+233 53 111 3498", href:"tel:+233531113498",                              color:"#1a6e5a" },
        { icon:"💬", label:"WhatsApp",  value:"+233 53 111 3498", href:"https://wa.me/233531113498?text=Hi%20Joachim%2C%20I%20am%20reaching%20out%20from%20JhimFit!", color:"#25D366" },
        { icon:"📞", label:"Call",      value:"+233 55 198 5225", href:"tel:+233551985225",                              color:"#1a6e5a" },
        { icon:"💬", label:"WhatsApp",  value:"+233 55 198 5225", href:"https://wa.me/233551985225?text=Hi%20Joachim%2C%20I%20am%20reaching%20out%20from%20JhimFit!", color:"#25D366" },
        { icon:"✉️", label:"Email",     value:"joachimnaakureh07@gmail.com", href:"mailto:joachimnaakureh07@gmail.com",   color:"#C9A84C" },
      ].map((c,i)=>(
        <a key={i} href={c.href} target={c.label==="WhatsApp"?"_blank":"_self"} rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:18,background:"rgba(255,255,255,0.0)",border:"1px solid "+c.color+"22",borderRadius:18,padding:"18px 20px",marginBottom:12,textDecoration:"none",color:"#f0ede8",transition:"all 0.2s"}}>
          <div style={{width:52,height:52,borderRadius:15,background:c.color+"22",border:"1px solid "+c.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{c.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:4}}>{c.label}</div>
            <div style={{fontSize:15,fontWeight:800,color:c.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.value}</div>
          </div>
          <span style={{color:c.color,fontSize:20,flexShrink:0}}>&#x2192;</span>
        </a>
      ))}
      <div style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid #4db89a",borderRadius:18,padding:"20px 22px",marginBottom:16,marginTop:8}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:16}}>Availability</div>
        {[{d:"Monday - Friday",t:"8:00 AM - 6:00 PM"},{d:"Saturday",t:"9:00 AM - 2:00 PM"},{d:"Sunday",t:"Closed"}].map(r=>(
          <div key={r.d} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"none"}}>
            <span style={{fontSize:13,color:"rgba(240,237,232,0.6)"}}>{r.d}</span>
            <span style={{fontSize:13,fontWeight:700,color:r.t==="Closed"?"rgba(240,237,232,0.3)":"#4db89a"}}>{r.t}</span>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(30,144,255,0.07)",borderLeft:"3px solid #4a9eff",borderRadius:16,padding:"16px 20px"}}>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.6)",lineHeight:1.8}}>
          Want a feature added? Spotted a bug? Have a meal or workout suggestion? Reach out - we reply within 24 hours.
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (tab==="home")     return HomeContent;
    if (tab==="diet")     return <DietContent/>;
    if (tab==="workout")  return <WorkoutContent/>;
    if (tab==="stats")    return <StatsContent/>;
    if (tab==="contact")  return <ContactContent/>;
    if (tab==="help")     return <HelpContent/>;
    return null;
  };
  const pageTitle  = { home:"Good "+(new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening")+", "+profile.name+" "+profile.avatar, diet:"Diet Guide", workout:"Workouts", stats:"Stats and Records", contact:"Contact Us", help:"Help and User Guide" };

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",color:"#f0ede8",fontFamily:"Georgia,'Times New Roman',serif",display:"flex",position:"relative"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse at 15% 10%,rgba(201,168,76,0.1),transparent 55%),radial-gradient(ellipse at 85% 85%,rgba(26,122,74,0.08),transparent 55%)"}}/>
      {/* PWA Install Banner */}
      {showInstallBanner && !isInstalled && (
        <div style={{position:"fixed",bottom:isMobile?80:24,left:"50%",transform:"translateX(-50%)",zIndex:9998,
          background:"linear-gradient(135deg,#111827,#0d1320)",border:"1px solid rgba(201,168,76,0.35)",
          borderRadius:20,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,
          boxShadow:"0 12px 40px rgba(0,0,0,0.7)",maxWidth:380,width:"calc(100vw - 32px)"}}>
          <div style={{width:46,height:46,borderRadius:13,background:"rgba(201,168,76,0.2)",border:"1px solid rgba(201,168,76,0.4)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>💪</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:SPORT_FONT,fontSize:13,color:"#f0ede8",letterSpacing:1,lineHeight:1}}>INSTALL JHIMFIT</div>
            <div style={{fontSize:10,color:"rgba(240,237,232,0.45)",marginTop:4,lineHeight:1.4}}>Add to home screen for the full app experience</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
            <button onClick={handleInstall} style={{background:"#C9A84C",border:"none",borderRadius:10,
              padding:"8px 14px",color:"white",fontSize:12,fontWeight:800,cursor:"pointer",
              fontFamily:SPORT_FONT,letterSpacing:1}}>INSTALL</button>
            <button onClick={()=>setShowInstallBanner(false)} style={{background:"transparent",border:"none",
              color:"rgba(240,237,232,0.35)",fontSize:10,cursor:"pointer",padding:"2px 0",textAlign:"center"}}>Not now</button>
          </div>
        </div>
      )}
      {toast && <div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"11px 24px",borderRadius:32,zIndex:9999,fontSize:14,fontWeight:700,boxShadow:"0 6px 28px rgba(0,0,0,0.45)",whiteSpace:"nowrap"}}>{toast.msg}</div>}
      {showEdit && <EditProfile profile={profile} onSave={p=>{setProfile(p);setShowEdit(false);toast_("Profile updated!");}} onClose={()=>setShowEdit(false)} onDelete={delProfile}/>}
      {showSwitch && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
          <div style={{background:"#0d1320",borderRadius:22,padding:28,width:"100%",maxWidth:440,color:"#f0ede8"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div style={{fontSize:22,fontWeight:900}}>Switch Profile</div>
              <button onClick={()=>setShowSw(false)} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",fontSize:24,cursor:"pointer"}}>X</button>
            </div>
            {others.map(p=>(
              <button key={p.id} onClick={()=>{setProfile(p);setShowSw(false);navigateTo("home");toast_("Welcome back, "+p.name+"! "+p.avatar);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"none",borderRadius:14,padding:"14px 18px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:"#f0ede8",textAlign:"left"}}>
                <SpiritAvatar animalId={p.spiritAnimal||p.avatar||"eagle"} seed={p.name} size={36} ring={true}/>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15}}>{p.name}</div><div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:2}}>{p.calorieGoal} kcal goal - {(GOALS.find(g=>g.id===p.goal)||{label:""}).label}</div></div>
                <span style={{color:"#C9A84C",fontSize:20}}>&#x2192;</span>
              </button>
            ))}
            <button onClick={()=>{setProfile(null);setShowSw(false);}} style={{width:"100%",background:"rgba(201,168,76,0.1)",borderRadius:14,padding:"14px",color:"#C9A84C",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:4}}>+ Create New Profile</button>
          </div>
        </div>
      )}
      {!isMobile && <Sidebar/>}
      {isMobile && (
        <div style={{position:"fixed",top:0,left:0,right:0,background:"rgba(10,15,30,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(201,168,76,0.1)",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setShowEdit(true)} style={{background:"transparent",border:"none",borderRadius:12,width:40,height:40,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:2}}>
              <SpiritAvatar animalId={profile.spiritAnimal||"eagle"} seed={profile.name} size={36} ring={true}/></button>
            <JhimFitLogo size="sm" />
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"rgba(240,237,232,0.3)",letterSpacing:2}}>GOAL</div><div style={{fontSize:14,fontWeight:900,color:"#C9A84C"}}>{calGoal} kcal</div></div>
            {others.length>0&&<button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:11,color:"rgba(240,237,232,0.5)"}}>Switch</button>}
            {/* Cloud sync button — mobile */}
            {authUser ? (
              <button onClick={()=>{ signOut(); setAuthUser(null); toast_("Signed out","#666"); }}
                style={{background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:10,padding:"5px 9px",cursor:"pointer",fontSize:11,color:"#10B981",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                ☁️
              </button>
            ) : (
              <button onClick={()=>setShowAuth(true)}
                style={{background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:10,padding:"5px 9px",cursor:"pointer",fontSize:11,color:"#C9A84C",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                ☁️
              </button>
            )}
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
            {others.length>0&&<button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:12,padding:"10px 18px",cursor:"pointer",fontSize:13,color:"rgba(240,237,232,0.6)",fontWeight:600}}>Switch Profile ({others.length})</button>}
          </div>
        )}
        <div style={{padding:cPad}}>{renderContent()}</div>
      </main>
      {isMobile && <BottomNav/>}
      <style>{`*{box-sizing:border-box;}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;}input[type=number]{-moz-appearance:textfield;}::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}a:hover{opacity:0.85;}button:hover{opacity:0.88;}`}</style>
    </div>
  );
}
