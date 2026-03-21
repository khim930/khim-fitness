import React, { useState } from "react";
import { GOALS, SPIRIT_ANIMALS, AVATARS } from "../data/constants";
import { calcCalGoal, getProfiles, setProfiles, TODAY } from "../utils/helpers";
import JhimFitLogo from "./JhimFitLogo";
import SpiritAvatar from "./SpiritAvatar";
import ShaderAnimation from "./ShaderAnimation";

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", avatar:"🦁", age:"", sex:"male", weight:"", height:"", heightFt:"", heightIn:"", weightUnit:"kg", heightUnit:"cm", activity:"moderate", goal:"maintain" });
  const existing = Object.values(getProfiles());
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const finish = () => {
    const p = { ...form, name:form.name.trim(), id:form.name.trim().toLowerCase().replace(/\s+/g,"_")+"_"+Date.now(), calorieGoal:calcCalGoal(form), createdAt:TODAY };
    const all = getProfiles(); all[p.name] = p; setProfiles(all); onComplete(p);
  };
  const inp = { width:"100%", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, padding:"15px 18px", color:"#f0ede8", outline:"none", fontFamily:"Georgia", boxSizing:"border-box" };

  const steps = [
    <div key="w" style={{textAlign:"center"}}>
      {/* Shader animation background — only on welcome screen */}
      <div style={{position:"fixed",inset:0,zIndex:0,opacity:0.18,pointerEvents:"none"}}>
        <ShaderAnimation/>
      </div>
      <div style={{position:"relative",zIndex:1}}>
      <div style={{marginBottom:20,display:"flex",justifyContent:"center"}}>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A84C"/>
              <stop offset="100%" stopColor="#1a6e5a"/>
            </linearGradient>
            <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="46" fill="url(#bgGrad)"/>
          <circle cx="48" cy="48" r="46" fill="url(#shineGrad)"/>
          <circle cx="48" cy="48" r="46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
          <text x="48" y="58" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="46" fill="white" style={{letterSpacing:"-2px"}}>J</text>
        </svg>
      </div>
      <div style={{marginBottom:8}}><JhimFitLogo size="lg" /></div>
      <div style={{fontSize:15,color:"rgba(240,237,232,0.5)",lineHeight:1.8,marginBottom:36}}>Your personal Ghanaian fitness and nutrition tracker</div>
      {existing.length > 0 && <>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:14}}>Existing Profiles</div>
        {existing.map(p=>(
          <button key={p.id} onClick={()=>onComplete(p)} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"none",borderRadius:16,padding:"14px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:16,color:"#f0ede8",textAlign:"left"}}>
            <span style={{fontSize:34}}>{p.avatar}</span>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:17}}>{p.name}</div><div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:2}}>{(GOALS.find(g=>g.id===p.goal)||{label:""}).label} - {p.calorieGoal} kcal/day</div></div>
            <span style={{color:"#C9A84C",fontSize:22}}>&#x2192;</span>
          </button>
        ))}
        <div style={{color:"rgba(240,237,232,0.25)",fontSize:13,margin:"14px 0"}}>or create a new profile</div>
      </>}
      <button onClick={()=>setStep(1)} style={{width:"100%",background:"#C9A84C",border:"none",borderRadius:16,padding:"17px",color:"#fff",fontWeight:900,fontSize:17,cursor:"pointer"}}>{existing.length>0?"+ New Profile":"Get Started"}</button>
      </div>
    </div>,

    <div key="n">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>What is your name?</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:24}}>Personalises your entire experience</div>
      <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name" style={{...inp,fontSize:22,fontWeight:900,marginBottom:26}}/>

      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:14}}>Choose your Spirit Animal</div>
      {[
        { group:"⚡ The Powerhouses", desc:"Strength & muscle", ids:["silverback","bear","wolf"] },
        { group:"🌬️ The Agile",       desc:"Speed & fat loss",  ids:["gazelle","panther"] },
        { group:"🌙 The Wise",         desc:"Balance & vision",  ids:["owl","eagle","dolphin"] },
      ].map(cat=>(
        <div key={cat.group} style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:7}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:2,color:"rgba(201,168,76,0.75)"}}>{cat.group}</div>
            <div style={{fontSize:9,color:"rgba(240,237,232,0.3)"}}>{cat.desc}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {SPIRIT_ANIMALS.filter(a=>cat.ids.includes(a.id)).map(a=>{
              const selected = (form.avatar===a.id)||(form.spiritAnimal===a.id);
              return (
                <button key={a.id} onClick={()=>{ set("avatar",a.id); set("spiritAnimal",a.id); }}
                  style={{
                    position:"relative",
                    background: selected ? a.bg : "rgba(255,255,255,0.03)",
                    border: selected ? `2px solid ${a.color}` : "2px solid rgba(255,255,255,0.07)",
                    borderRadius:14, padding:"10px 6px 7px",
                    cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                    transition:"all 0.25s",
                    boxShadow: selected ? `0 0 18px ${a.color}55, 0 0 6px ${a.color}33` : "none",
                    transform: selected ? "scale(1.05)" : "scale(1)",
                  }}>
                  {selected && <div style={{position:"absolute",inset:-2,borderRadius:15,border:"2px solid #C9A84C",opacity:0.6,pointerEvents:"none"}}/>}
                  {selected && (
                    <div style={{position:"absolute",top:-7,right:-7,width:20,height:20,borderRadius:"50%",background:"#10B981",border:"2px solid #0a0f1e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"white",fontWeight:900,zIndex:2,boxShadow:"0 2px 8px rgba(16,185,129,0.6)"}}>✓</div>
                  )}
                  <SpiritAvatar animalId={a.id} seed={a.id} size={38} ring={false}/>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:selected?a.color:"rgba(240,237,232,0.7)",fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:0.5,lineHeight:1.2}}>{a.name}</div>
                    <div style={{fontSize:8,color:selected?a.color:"rgba(240,237,232,0.3)",marginTop:1}}>{a.trait}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button disabled={!form.name.trim()} onClick={()=>setStep(2)} style={{width:"100%",background:form.name.trim()?"#C9A84C":"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"16px",color:form.name.trim()?"#fff":"rgba(255,255,255,0.25)",fontWeight:800,fontSize:16,cursor:form.name.trim()?"pointer":"default",marginTop:8}}>Continue</button>
    </div>,

    <div key="s">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>Your body stats</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:26}}>We calculate your personalised calorie goal</div>
      {/* Age */}
      <div style={{marginBottom:18}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:8}}>Age</div>
        <div style={{position:"relative"}}>
          <input type="number" value={form.age} onChange={e=>set("age",e.target.value)} placeholder="e.g. 25" style={{...inp,fontSize:17,paddingRight:50}}/>
          <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>yrs</span>
        </div>
      </div>

      {/* Weight with kg/lbs toggle */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase"}}>Weight</div>
          <div style={{display:"flex",gap:4}}>
            {["kg","lbs"].map(u=>(
              <button key={u} onClick={()=>{
                const cur = parseFloat(form.weight)||0;
                if(u==="lbs" && form.weightUnit!=="lbs") set("weight", cur ? Math.round(cur*2.2046*10)/10 : "");
                if(u==="kg"  && form.weightUnit==="lbs") set("weight", cur ? Math.round(cur/2.2046*10)/10 : "");
                set("weightUnit",u);
              }} style={{background:form.weightUnit===u||(!form.weightUnit&&u==="kg")?"#C9A84C":"rgba(255,255,255,0.08)",border:"none",borderRadius:6,padding:"3px 10px",fontSize:11,color:"white",cursor:"pointer",fontWeight:700,letterSpacing:0.5}}>
                {u}
              </button>
            ))}
          </div>
        </div>
        <div style={{position:"relative"}}>
          <input type="number" value={form.weight} onChange={e=>set("weight",e.target.value)}
            placeholder={form.weightUnit==="lbs"?"e.g. 154":"e.g. 70"}
            style={{...inp,fontSize:17,paddingRight:50}}/>
          <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>{form.weightUnit||"kg"}</span>
        </div>
      </div>

      {/* Height with cm/ft+in toggle */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase"}}>Height</div>
          <div style={{display:"flex",gap:4}}>
            {["cm","ft"].map(u=>(
              <button key={u} onClick={()=>{
                const cur = parseFloat(form.height)||0;
                if(u==="ft" && form.heightUnit!=="ft") {
                  const totalIn = cur/2.54;
                  set("heightFt", Math.floor(totalIn/12)||"");
                  set("heightIn", Math.round(totalIn%12)||"");
                  set("height","");
                }
                if(u==="cm" && form.heightUnit==="ft") {
                  const cm = Math.round(((parseFloat(form.heightFt)||0)*12 + (parseFloat(form.heightIn)||0))*2.54);
                  set("height", cm||"");
                }
                set("heightUnit",u);
              }} style={{background:form.heightUnit===u||(!form.heightUnit&&u==="cm")?"#C9A84C":"rgba(255,255,255,0.08)",border:"none",borderRadius:6,padding:"3px 10px",fontSize:11,color:"white",cursor:"pointer",fontWeight:700,letterSpacing:0.5}}>
                {u==="ft"?"ft / in":"cm"}
              </button>
            ))}
          </div>
        </div>
        {form.heightUnit==="ft" ? (
          <div style={{display:"flex",gap:10}}>
            <div style={{position:"relative",flex:1}}>
              <input type="number" value={form.heightFt||""} onChange={e=>{
                set("heightFt",e.target.value);
                const cm=Math.round(((parseFloat(e.target.value)||0)*12+(parseFloat(form.heightIn)||0))*2.54);
                set("height",cm||"");
              }} placeholder="5" style={{...inp,fontSize:17,paddingRight:36}}/>
              <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>ft</span>
            </div>
            <div style={{position:"relative",flex:1}}>
              <input type="number" value={form.heightIn||""} onChange={e=>{
                set("heightIn",e.target.value);
                const cm=Math.round(((parseFloat(form.heightFt)||0)*12+(parseFloat(e.target.value)||0))*2.54);
                set("height",cm||"");
              }} placeholder="9" style={{...inp,fontSize:17,paddingRight:36}}/>
              <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>in</span>
            </div>
          </div>
        ) : (
          <div style={{position:"relative"}}>
            <input type="number" value={form.height} onChange={e=>set("height",e.target.value)} placeholder="e.g. 170"
              style={{...inp,fontSize:17,paddingRight:50}}/>
            <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>cm</span>
          </div>
        )}
        {form.height && form.heightUnit==="ft" && (
          <div style={{fontSize:10,color:"rgba(240,237,232,0.3)",marginTop:5,textAlign:"right"}}>= {form.height} cm (stored internally)</div>
        )}
      </div>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:10}}>Sex</div>
        <div style={{display:"flex",gap:10}}>
          {["male","female"].map(s=><button key={s} onClick={()=>set("sex",s)} style={{flex:1,background:form.sex===s?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.05)",border:"1px solid "+(form.sex===s?"#C9A84C":"rgba(255,255,255,0.1)"),borderRadius:13,padding:"13px",color:form.sex===s?"#C9A84C":"rgba(240,237,232,0.5)",cursor:"pointer",fontSize:15}}>{s==="male"?"Male":"Female"}</button>)}
        </div>
      </div>
      <button onClick={()=>setStep(3)} style={{width:"100%",background:"#C9A84C",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>Continue</button>
    </div>,

    <div key="g">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>Activity and Goal</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:22}}>Fine-tune your daily calorie target</div>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:11}}>Activity Level</div>
      {[{id:"sedentary",l:"Sedentary",d:"Little or no exercise"},{id:"light",l:"Lightly Active",d:"1-3 days/week"},{id:"moderate",l:"Moderately Active",d:"3-5 days/week"},{id:"active",l:"Very Active",d:"6-7 days/week"}].map(a=>(
        <button key={a.id} onClick={()=>set("activity",a.id)} style={{width:"100%",background:form.activity===a.id?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.0)",border:"1px solid "+(form.activity===a.id?"#C9A84C":"rgba(255,255,255,0.08)"),borderRadius:13,padding:"12px 16px",marginBottom:9,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#f0ede8"}}>
          <span style={{fontWeight:700,fontSize:14}}>{a.l}</span><span style={{fontSize:12,color:"rgba(240,237,232,0.4)"}}>{a.d}</span>
        </button>
      ))}
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",margin:"20px 0 12px"}}>Your Goal</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {GOALS.map(g=>{
          const suggested = SPIRIT_ANIMALS.find(a=>a.goal===g.id);
          return (
            <button key={g.id} onClick={()=>{ set("goal",g.id); if(!form.spiritAnimal) set("avatar",(suggested&&suggested.id)||"eagle"); }}
              style={{background:form.goal===g.id?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.0)",border:"1px solid "+(form.goal===g.id?"#C9A84C":"rgba(255,255,255,0.08)"),borderRadius:15,padding:"16px 8px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:6}}>{g.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:form.goal===g.id?"#C9A84C":"#f0ede8"}}>{g.label}</div>
              {suggested&&<div style={{fontSize:9,color:suggested.color,marginTop:4,fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:0.5}}>{suggested.emoji} {suggested.trait}</div>}
            </button>
          );
        })}
      </div>
      <div style={{background:"rgba(201,168,76,0.1)",borderLeft:"3px solid #C9A84C",borderRadius:14,padding:"14px 18px",marginBottom:22,textAlign:"center"}}>
        <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginBottom:4}}>YOUR ESTIMATED DAILY CALORIE GOAL</div>
        <div style={{fontSize:30,fontWeight:900,color:"#C9A84C"}}>{calcCalGoal(form)} <span style={{fontSize:15,fontWeight:400}}>kcal</span></div>
      </div>
      <button onClick={finish} style={{width:"100%",background:"#C9A84C",border:"none",borderRadius:16,padding:"18px",color:"#fff",fontWeight:900,fontSize:18,cursor:"pointer"}}>Start My Journey</button>
    </div>
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"Georgia,serif",color:"#f0ede8"}}>
      <div style={{width:"100%",maxWidth:480}}>
        {step>0 && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:30}}>
            <button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",cursor:"pointer",fontSize:14,padding:0}}>Back</button>
            <div style={{display:"flex",gap:6}}>{[1,2,3].map(i=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i<=step?"#C9A84C":"rgba(255,255,255,0.1)",transition:"all 0.3s"}}/>)}</div>
          </div>
        )}
        {steps[step]}
        <div style={{textAlign:"center",marginTop:32,fontSize:11,color:"rgba(240,237,232,0.2)",letterSpacing:1}}>BUILT BY JOACHIM - JHIMFIT v2.0</div>
      </div>
    </div>
  );
}

export default Onboarding;
