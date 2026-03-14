import React from "react";

function MealCard({ meal, isSelected, onSelect, onLog }) {
  return (
    <div onClick={onSelect} style={{background:isSelected?"linear-gradient(135deg,"+meal.color+"1a,"+meal.color+"0d)":"rgba(255,255,255,0.0)",border:"1px solid "+(isSelected?meal.color+"88":"rgba(255,255,255,0.07)"),borderRadius:16,marginBottom:10,cursor:"pointer",overflow:"hidden",transition:"all 0.22s"}}>
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
      <div style={{display:"flex",borderTop:"none"}}>
        {[{l:"Protein",v:meal.protein,c:"#4db89a"},{l:"Carbs",v:meal.carbs,c:"#f0a500"},{l:"Fat",v:meal.fat,c:"#C9A84C"}].map((m,i)=>(
          <div key={m.l} style={{flex:1,padding:"9px 0",textAlign:"center",borderRight:i<2?"1px solid transparent":undefined}}>
            <div style={{fontSize:14,fontWeight:800,color:m.c}}>{m.v}g</div>
            <div style={{fontSize:9,color:"rgba(240,237,232,0.35)",letterSpacing:1,textTransform:"uppercase"}}>{m.l}</div>
          </div>
        ))}
      </div>
      {isSelected && (
        <div style={{padding:"14px 16px",borderTop:"none"}}>
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
  <div style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid #4db89a",borderRadius:16,padding:"16px 18px"}}>
    <div style={{fontSize:26,fontWeight:900,color}}>{val}</div>
    <div style={{fontSize:10,color,opacity:0.7,marginTop:1}}>{unit}</div>
    <div style={{fontSize:12,color:"rgba(240,237,232,0.4)",marginTop:5}}>{label}</div>
  </div>
);

const DiffBadge = ({level}) => {
  const c = level==="Beginner"?"#1a6e5a":level==="Intermediate"?"#f0a500":"#C9A84C";
  return <span style={{background:c+"22",border:"1px solid "+c+"55",color:c,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{level}</span>;
};

export { MealCard, StatCard, DiffBadge };
