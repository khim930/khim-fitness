import React, { useState } from "react";
import { signUp, signIn } from "../supabase.js";
import JhimFitLogo from "./JhimFitLogo";

function AuthScreen({ onAuth }) {
  const [mode, setMode]   = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [name, setName]   = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const gold = "#C9A84C";
  const inp  = { width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"15px 18px", color:"#f0ede8", outline:"none", fontFamily:"Georgia", boxSizing:"border-box", fontSize:16, marginBottom:14 };

  const handle = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await signUp(email, pass);
        if (error) { setErr(error.message); setLoading(false); return; }
        if (data.user) onAuth(data.user, name);
      } else {
        const { data, error } = await signIn(email, pass);
        if (error) { setErr(error.message); setLoading(false); return; }
        if (data.user) onAuth(data.user, null);
      }
    } catch(e) { setErr("Network error — check your connection"); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{width:"100%",maxWidth:420,color:"#f0ede8"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <JhimFitLogo size="lg"/>
          <div style={{fontSize:13,color:"rgba(240,237,232,0.4)",marginTop:12,letterSpacing:1}}>GHANA FITNESS TRACKER</div>
        </div>

        {/* Toggle */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:14,padding:4,marginBottom:28}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}}
              style={{flex:1,background:mode===m?gold:"transparent",border:"none",borderRadius:11,padding:"11px",color:mode===m?"#0a0f1e":"rgba(240,237,232,0.5)",fontWeight:800,fontSize:15,cursor:"pointer",transition:"all 0.2s"}}>
              {m==="login"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>

        {mode==="signup" && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp}/>
        )}
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={inp}/>
        {/* Password with show/hide toggle */}
        <div style={{position:"relative",marginBottom:6}}>
          <input type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)}
            placeholder="Password"
            style={{...inp, marginBottom:0, paddingRight:52}}
            onKeyDown={e=>e.key==="Enter"&&handle()}/>
          <button onClick={()=>setShowPass(v=>!v)}
            style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(240,237,232,0.4)",fontSize:13,fontWeight:700,padding:4}}>
            {showPass ? "HIDE" : "SHOW"}
          </button>
        </div>

        {err && <div style={{color:"#EF4444",fontSize:13,marginBottom:14,padding:"10px 14px",background:"rgba(239,68,68,0.1)",borderRadius:10}}>{err}</div>}

        <button onClick={handle} disabled={loading||!email||!pass}
          style={{width:"100%",background:(!loading&&email&&pass)?gold:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"16px",color:(!loading&&email&&pass)?"#0a0f1e":"rgba(255,255,255,0.25)",fontWeight:900,fontSize:17,cursor:"pointer",marginBottom:20}}>
          {loading ? "Please wait..." : mode==="login" ? "Sign In" : "Create Account"}
        </button>

        {/* Skip / use offline */}
        <button onClick={()=>onAuth(null,"offline")}
          style={{width:"100%",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"13px",color:"rgba(240,237,232,0.35)",fontSize:14,cursor:"pointer"}}>
          Continue without account (offline)
        </button>
        <div style={{textAlign:"center",fontSize:11,color:"rgba(240,237,232,0.2)",marginTop:12}}>
          Your data syncs across all your devices when signed in
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
