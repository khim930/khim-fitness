import React, { useState } from "react";
import { GOALS, SPIRIT_ANIMALS } from "../data/constants";
import { calcCalGoal } from "../utils/helpers";
import SpiritAvatar from "./SpiritAvatar";

function EditProfile({ profile, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({...profile});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => {
    // Normalise weight to kg before saving
    let saveForm = {...form};
    if(saveForm.weightUnit==="lbs" && saveForm.weight) {
      saveForm.weight = Math.round(parseFloat(saveForm.weight)/2.2046*10)/10;
      saveForm.weightUnit = "kg";
    }
    const u={...saveForm,calorieGoal:calcCalGoal(saveForm)};
    const a=lp(); if(form.name!==profile.name) delete a[profile.name]; a[u.name]=u; sp(a); onSave(u);
  };
  const inp = { width:"100%", background:"rgba(255,255,255,0.07)", border:"none", borderRadius:11, padding:"12px 15px", color:"#f0ede8", fontSize:15, outline:"none", fontFamily:"Georgia", boxSizing:"border-box" };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#0d1320",borderRadius:22,padding:28,width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",color:"#f0ede8"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:900}}>Edit Profile</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(240,237,232,0.4)",fontSize:24,cursor:"pointer"}}>X</button>
        </div>
        {/* ── Spirit Animal Picker — grouped by vibe ── */}
        {[
          { group:"⚡ The Powerhouses", desc:"Built for strength & muscle", ids:["silverback","bear","wolf"] },
          { group:"🌬️ The Agile",       desc:"Speed, fat loss & precision",  ids:["gazelle","panther"] },
          { group:"🌙 The Wise",         desc:"Balance, vision & longevity",  ids:["owl","eagle","dolphin"] },
        ].map(cat => (
          <div key={cat.group} style={{marginBottom:18}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:2,color:"rgba(201,168,76,0.8)"}}>{cat.group}</div>
              <div style={{fontSize:10,color:"rgba(240,237,232,0.3)"}}>{cat.desc}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
              {SPIRIT_ANIMALS.filter(a=>cat.ids.includes(a.id)).map(a=>{
                const selected = form.avatar===a.id;
                return (
                  <button key={a.id} onClick={()=>{ set("avatar",a.id); set("spiritAnimal",a.id); }}
                    style={{
                      position:"relative",
                      background: selected ? a.bg : "rgba(255,255,255,0.03)",
                      border: selected ? `2px solid ${a.color}` : "2px solid rgba(255,255,255,0.07)",
                      borderRadius:14, padding:"12px 8px 8px",
                      cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                      transition:"all 0.25s",
                      boxShadow: selected ? `0 0 18px ${a.color}55, 0 0 6px ${a.color}33` : "none",
                      transform: selected ? "scale(1.04)" : "scale(1)",
                    }}>
                    {/* Gold border highlight on selected */}
                    {selected && <div style={{position:"absolute",inset:-2,borderRadius:15,border:"2px solid #C9A84C",opacity:0.6,pointerEvents:"none"}}/>}
                    {/* Green checkmark badge */}
                    {selected && (
                      <div style={{
                        position:"absolute", top:-7, right:-7,
                        width:20, height:20, borderRadius:"50%",
                        background:"#10B981", border:"2px solid #0d1320",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, color:"white", fontWeight:900, zIndex:2,
                        boxShadow:"0 2px 8px rgba(16,185,129,0.6)",
                      }}>✓</div>
                    )}
                    <SpiritAvatar animalId={a.id} seed={a.id} size={42} ring={false}/>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:11,color:selected?a.color:"rgba(240,237,232,0.7)",fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:0.5,lineHeight:1.2}}>{a.name}</div>
                      <div style={{fontSize:9,color:selected?a.color:"rgba(240,237,232,0.3)",marginTop:2,letterSpacing:0.3}}>{a.trait}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {/* Edit profile — Name and Age */}
        {[{l:"Name",k:"name",t:"text"},{l:"Age",k:"age",t:"number"}].map(f=>(
          <div key={f.k} style={{marginBottom:16}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:7}}>{f.l}</div>
            <input type={f.t} value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={inp}/>
          </div>
        ))}

        {/* Weight with kg/lbs toggle */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase"}}>Weight</div>
            <div style={{display:"flex",gap:4}}>
              {["kg","lbs"].map(u=>(
                <button key={u} onClick={()=>{
                  const cur = parseFloat(form.weight)||0;
                  if(u==="lbs" && form.weightUnit!=="lbs") set("weight", cur ? Math.round(cur*2.2046*10)/10 : "");
                  if(u==="kg"  && form.weightUnit==="lbs") set("weight", cur ? Math.round(cur/2.2046*10)/10 : "");
                  set("weightUnit",u);
                }} style={{background:(form.weightUnit||"kg")===u?"#C9A84C":"rgba(255,255,255,0.08)",border:"none",borderRadius:6,padding:"3px 10px",fontSize:11,color:"white",cursor:"pointer",fontWeight:700}}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div style={{position:"relative"}}>
            <input type="number" value={form.weight} onChange={e=>set("weight",e.target.value)}
              placeholder={(form.weightUnit||"kg")==="lbs"?"e.g. 154":"e.g. 70"}
              style={{...inp,paddingRight:50}}/>
            <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>{form.weightUnit||"kg"}</span>
          </div>
        </div>

        {/* Height with cm/ft toggle */}
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase"}}>Height</div>
            <div style={{display:"flex",gap:4}}>
              {["cm","ft"].map(u=>(
                <button key={u} onClick={()=>{
                  const cur = parseFloat(form.height)||0;
                  if(u==="ft" && (form.heightUnit||"cm")!=="ft") {
                    const totalIn=cur/2.54;
                    set("heightFt",Math.floor(totalIn/12)||"");
                    set("heightIn",Math.round(totalIn%12)||"");
                    set("height","");
                  }
                  if(u==="cm" && (form.heightUnit||"cm")==="ft") {
                    const cm=Math.round(((parseFloat(form.heightFt)||0)*12+(parseFloat(form.heightIn)||0))*2.54);
                    set("height",cm||"");
                  }
                  set("heightUnit",u);
                }} style={{background:(form.heightUnit||"cm")===u?"#C9A84C":"rgba(255,255,255,0.08)",border:"none",borderRadius:6,padding:"3px 10px",fontSize:11,color:"white",cursor:"pointer",fontWeight:700}}>
                  {u==="ft"?"ft / in":"cm"}
                </button>
              ))}
            </div>
          </div>
          {(form.heightUnit||"cm")==="ft" ? (
            <div style={{display:"flex",gap:10}}>
              <div style={{position:"relative",flex:1}}>
                <input type="number" value={form.heightFt||""} onChange={e=>{
                  set("heightFt",e.target.value);
                  const cm=Math.round(((parseFloat(e.target.value)||0)*12+(parseFloat(form.heightIn)||0))*2.54);
                  set("height",cm||"");
                }} placeholder="5" style={{...inp,paddingRight:36}}/>
                <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>ft</span>
              </div>
              <div style={{position:"relative",flex:1}}>
                <input type="number" value={form.heightIn||""} onChange={e=>{
                  set("heightIn",e.target.value);
                  const cm=Math.round(((parseFloat(form.heightFt)||0)*12+(parseFloat(e.target.value)||0))*2.54);
                  set("height",cm||"");
                }} placeholder="9" style={{...inp,paddingRight:36}}/>
                <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>in</span>
              </div>
            </div>
          ) : (
            <div style={{position:"relative"}}>
              <input type="number" value={form.height} onChange={e=>set("height",e.target.value)}
                placeholder="e.g. 170" style={{...inp,paddingRight:50}}/>
              <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:"rgba(240,237,232,0.3)",fontSize:13}}>cm</span>
            </div>
          )}
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:10}}>Goal</div>
          <div style={{display:"flex",gap:9}}>
            {GOALS.map(g=><button key={g.id} onClick={()=>set("goal",g.id)} style={{flex:1,background:form.goal===g.id?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.05)",border:"1px solid "+(form.goal===g.id?"#C9A84C":"rgba(255,255,255,0.08)"),borderRadius:11,padding:"10px 4px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22}}>{g.icon}</div><div style={{fontSize:10,color:form.goal===g.id?"#C9A84C":"rgba(240,237,232,0.5)",marginTop:3}}>{g.label}</div>
            </button>)}
          </div>
        </div>
        <div style={{background:"rgba(201,168,76,0.09)",borderLeft:"3px solid #C9A84C",borderRadius:12,padding:"11px 16px",marginBottom:18,textAlign:"center"}}>
          <span style={{fontSize:12,color:"rgba(240,237,232,0.4)"}}>New calorie goal: </span>
          <span style={{fontSize:18,fontWeight:900,color:"#C9A84C"}}>{calcCalGoal(form)} kcal/day</span>
        </div>
        <button onClick={save} style={{width:"100%",background:"#C9A84C",border:"none",borderRadius:14,padding:"15px",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",marginBottom:10}}>Save Changes</button>
        <button onClick={onDelete} style={{width:"100%",background:"rgba(255,50,50,0.08)",borderRadius:14,padding:"12px",color:"rgba(255,110,110,0.75)",cursor:"pointer",fontSize:13}}>Delete This Profile</button>
      </div>
    </div>
  );
}


/* ── Stick Figure Exercise Animations ──────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════
   AI-POWERED EXERCISE VISUALS
   • Calls Anthropic API to generate a real instructional fitness image
   • Shows animated human SVG figure while loading / as fallback
   • Caches per session so each exercise only generates once
═══════════════════════════════════════════════════════════════════════════ */

export default EditProfile;
