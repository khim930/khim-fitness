import React, { useState } from "react";

function HelpContent() {
  const [openSection, setOpenSec] = useState(null);
  const sections = [
    {
      id:"start", icon:"🚀", title:"Getting Started",color:"#C9A84C",
      steps:[
        { num:1, title:"Create your profile", body:"When you first open JhimFit, tap Get Started. Enter your name, pick an avatar, then fill in your age, weight, height and sex. This lets us calculate your personal daily calorie goal using the BMR formula." },
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
        { num:4, title:"Log the meal", body:"Once expanded, tap the orange Log button. The meal is added instantly to your diary and your calorie ring updates on the Home tab." },
        { num:5, title:"Remove a meal", body:"On the Home tab, find the meal under Today's Meals and tap the X button on the right to remove it from today's log." },
      ]
    },
    {
      id:"workout", icon:"🏋", title:"Tracking Workouts",color:"#1a6e5a",
      steps:[
        { num:1, title:"Quick Log - fast activity logging", body:"Go to Workout and make sure the Quick Log tab is selected. You will see 14 activity cards (Jog, HIIT, Football, etc). Simply tap any card to instantly log it - the calories burned are added to your daily total." },
        { num:2, title:"Lose Weight programme", body:"Tap the Lose Weight tab. This is an 8-week, 4-days-per-week fat-burning programme. You will see 4 weekly sessions: HIIT Cardio, Full-Body Fat Burn, Jump Rope and Core, and Steady-State Cardio." },
        { num:3, title:"Build Muscle programme", body:"Tap the Build Muscle tab. This is a 12-week strength programme with 4 sessions per week targeting different muscle groups: Chest & Triceps, Back & Biceps, Legs & Glutes, and Shoulders & Core." },
        { num:4, title:"Start a guided session", body:"Tap Start Session on any session card. You will see the full exercise table with sets, reps, and rest times. Tick off each set as you complete it - a progress bar tracks how far through the session you are." },
        { num:5, title:"Log a completed session", body:"Once done, tap the Log This Session button at the bottom. This saves the session to your records and adds the calories burned to your daily total. The session will show as Logged with a green badge." },
        { num:6, title:"View your records", body:"Scroll down on the Lose Weight or Build Muscle tab to see Your Records - a history of every session you have completed with dates, duration and calories burned." },
      ]
    },
    {
      id:"home", icon:"⌂", title:"Home Tab Features",color:"#4db89a",
      steps:[
        { num:1, title:"Calorie ring", body:"The circle on the left fills up as you eat. Orange means within goal, red means you have exceeded your calorie target for the day. The number in the centre is total kcal eaten today." },
        { num:2, title:"Stats grid", body:"The 4 boxes show: Goal (your daily calorie target), Burned (calories from workouts), Net (eaten minus burned), and Protein (grams eaten today)." },
        { num:3, title:"Macro bars", body:"The Carbohydrates, Protein and Fat bars show your progress towards the recommended daily targets for each macro. If your goal is Build Muscle, the protein target is set higher automatically." },
        { num:4, title:"Water tracker", body:"Tap the +250ml button each time you drink a glass of water. The 8 squares fill up with droplets as you go. Try to fill all 8 every day." },
        { num:5, title:"Weight logger", body:"Type your current weight in kg at the bottom of the Home tab and tap Save kg. Your weight is stored by date and shown in the Stats tab weight history table." },
      ]
    },
    {
      id:"stats", icon:"📊", title:"Stats and Records",color:"#C9A84C",
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
        { num:1, title:"Multiple profiles", body:"JhimFit supports multiple user profiles on the same device - perfect for families. Each profile has completely separate data, goals and history." },
        { num:2, title:"Switch profiles", body:"On desktop, click Switch Profile at the top right. On mobile, tap Switch in the header. Select any existing profile to switch to it instantly." },
        { num:3, title:"Edit your profile", body:"Click your avatar/name in the sidebar (desktop) or tap your avatar in the mobile header. Change your name, avatar, stats or goal. Your new calorie target is recalculated automatically." },
        { num:4, title:"Delete a profile", body:"Open Edit Profile, scroll to the bottom and tap Delete This Profile. This permanently removes all data for that profile." },
        { num:5, title:"Your data is stored locally", body:"All data is saved in your browser's localStorage on your device. This means data does not sync across devices, and clearing your browser data will erase it." },
      ]
    },
    {
      id:"tips", icon:"💡", title:"Tips for Best Results",color:"#1a6e5a",
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
      <div style={{fontSize:13,color:"rgba(240,237,232,0.45)",marginBottom:28}}>Everything you need to know to get the most out of JhimFit</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:28}}>
        {sections.map(s=>(
          <button key={s.id} onClick={()=>setOpenSec(openSection===s.id?null:s.id)}
            style={{background:openSection===s.id?s.color+"22":"rgba(255,255,255,0.0)",border:"1px solid "+(openSection===s.id?s.color+"66":"rgba(255,255,255,0.08)"),borderRadius:16,padding:"16px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
            <div style={{fontSize:28,marginBottom:7}}>{s.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:openSection===s.id?s.color:"#f0ede8",lineHeight:1.3}}>{s.title}</div>
          </button>
        ))}
      </div>
      {sections.map(s=>(
        openSection===s.id && (
          <div key={s.id} style={{background:"rgba(255,255,255,0.03)",borderLeft:"3px solid "+s.color,borderRadius:20,overflow:"hidden",marginBottom:20}}>
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
      <div style={{background:"rgba(201,168,76,0.07)",borderLeft:"3px solid #C9A84C",borderRadius:16,padding:"16px 20px",marginTop:8}}>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.6)",lineHeight:1.8}}>
          Still have questions? Tap <strong style={{color:"#C9A84C"}}>Contact</strong> in the menu to reach Joachim directly - we reply within 24 hours.
        </div>
      </div>
    </div>
  );
};

export default HelpContent;
