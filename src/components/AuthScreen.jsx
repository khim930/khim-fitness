import React, { useState, useRef } from "react";
import { signUp, signIn } from "../supabase.js";
import JhimFitLogo from "./JhimFitLogo";

// ── Rate limiting constants ────────────────────────────────────────────────
const MAX_ATTEMPTS   = 5;    // max failed attempts before lockout
const LOCKOUT_MS     = 5 * 60 * 1000; // 5 minute lockout
const ATTEMPT_WINDOW = 10 * 60 * 1000; // reset attempt count after 10 mins

function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [name, setName]       = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  const gold = "#C9A84C";
  const inp  = { width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"15px 18px", color:"#f0ede8", outline:"none", fontFamily:"Georgia", boxSizing:"border-box", fontSize:16, marginBottom:14 };

  // ── Input validation ────────────────────────────────────────────────────
  const validateInputs = () => {
    if (!email.trim())                          return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!pass)                                  return "Please enter your password.";
    if (pass.length < 6)                        return "Password must be at least 6 characters.";
    if (mode === "signup" && !name.trim())       return "Please enter your name.";
    if (mode === "signup" && name.trim().length < 2) return "Name must be at least 2 characters.";
    if (pass.length > 128)                      return "Password is too long.";
    if (email.length > 254)                     return "Email address is too long.";
    return null;
  };

  // ── Start lockout countdown ─────────────────────────────────────────────
  const startLockout = (until) => {
    setLockedUntil(until);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      const remaining = Math.ceil((until - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
        setErr("");
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  };

  // ── Main handler ────────────────────────────────────────────────────────
  const handle = async () => {
    // Check lockout
    if (lockedUntil && Date.now() < lockedUntil) {
      setErr(`Too many attempts. Try again in ${countdown} seconds.`);
      return;
    }

    // Validate inputs
    const validationError = validateInputs();
    if (validationError) { setErr(validationError); return; }

    setErr(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await signUp(email.trim().toLowerCase(), pass);
        if (error) { setErr(error.message); setLoading(false); return; }
        if (data.user) onAuth(data.user, name.trim());
      } else {
        const { data, error } = await signIn(email.trim().toLowerCase(), pass);
        if (error) {
          // Increment failed attempt counter
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCKOUT_MS;
            startLockout(until);
            setErr(`Too many failed attempts. Locked for 5 minutes.`);
          } else {
            const remaining = MAX_ATTEMPTS - newAttempts;
            setErr(`Incorrect email or password. ${remaining} attempt${remaining===1?"":"s"} remaining.`);
          }
          setLoading(false);
          return;
        }
        // Success — reset attempts
        setAttempts(0);
        if (data.user) onAuth(data.user, null);
      }
    } catch(e) {
      setErr("Network error — check your connection and try again.");
    }
    setLoading(false);
  };

  const isLocked   = lockedUntil && Date.now() < lockedUntil;
  const canSubmit  = !loading && !isLocked && email && pass;

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

        {err && (
          <div style={{color: isLocked?"#F59E0B":"#EF4444", fontSize:13, marginBottom:14, padding:"10px 14px",
            background: isLocked?"rgba(245,158,11,0.1)":"rgba(239,68,68,0.1)", borderRadius:10,
            display:"flex", alignItems:"center", gap:8}}>
            {isLocked && <span style={{fontSize:16}}>🔒</span>}
            {err}
            {isLocked && countdown > 0 && <span style={{marginLeft:"auto",fontWeight:700,color:"#F59E0B"}}>{countdown}s</span>}
          </div>
        )}

        {/* Attempt indicator dots */}
        {attempts > 0 && !isLocked && (
          <div style={{display:"flex",gap:6,marginBottom:14,justifyContent:"center"}}>
            {Array.from({length:MAX_ATTEMPTS}).map((_,i)=>(
              <div key={i} style={{width:8,height:8,borderRadius:"50%",
                background: i < attempts ? "#EF4444" : "rgba(255,255,255,0.15)",
                transition:"all 0.3s"}}/>
            ))}
          </div>
        )}

        <button onClick={handle} disabled={!canSubmit}
          style={{width:"100%",background:canSubmit?gold:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"16px",
            color:canSubmit?"#0a0f1e":"rgba(255,255,255,0.25)",fontWeight:900,fontSize:17,
            cursor:canSubmit?"pointer":"not-allowed",marginBottom:20,transition:"all 0.2s"}}>
          {isLocked ? `🔒 Locked (${countdown}s)` : loading ? "Please wait..." : mode==="login" ? "Sign In" : "Create Account"}
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
