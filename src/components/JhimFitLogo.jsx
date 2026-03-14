import React from "react";

const JhimFitLogo = ({ size = "md" }) => {
  const scales = { sm: 0.55, md: 0.85, lg: 1.2 };
  const s = scales[size] || scales.md;
  const gold = "#C9A84C";
  const white = "#F0EDE8";
  const boxSize = 38 * s;
  return (
    <div style={{ display:"flex", alignItems:"center", gap: 7*s, lineHeight:1 }}>
      <svg width={boxSize} height={boxSize} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dark bg */}
        <rect width="38" height="38" rx="7" fill="#0d1320"/>
        {/* Gold top bar — same as K logo orange bar */}
        <rect width="38" height="7" rx="3" fill={gold}/>
        <rect y="4" width="38" height="3" fill={gold}/>
        {/* Bold J — thick filled stem */}
        <rect x="19" y="6" width="10" height="19" fill={white}/>
        {/* Bold J — bottom hook as thick filled path */}
        <path d="M19 25 L29 25 Q29 35 19 35 Q9 35 9 26 L9 23 L15 23 L15 26 Q15 29 19 29 Q23 29 23 25 Z" fill={white}/>
        {/* Gold diagonal cut at top right — like K's sharp diagonal */}
        <polygon points="29,6 38,6 38,11 29,6" fill={gold}/>
      </svg>
      <div style={{ display:"flex", alignItems:"baseline" }}>
        <span style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:26*s, letterSpacing:1.5, color:white, lineHeight:1 }}>him</span>
        <span style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:26*s, letterSpacing:1.5, color:gold, lineHeight:1 }}>Fit</span>
      </div>
    </div>
  );
};

export default JhimFitLogo;
