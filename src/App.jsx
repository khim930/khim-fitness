import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";

const SPORT_FONT = "'Bebas Neue', 'Impact', sans-serif";
const BODY_FONT  = "Georgia, 'Times New Roman', serif";

// Inject Google Fonts + global CSS animations once
const injectStyles = () => {
  if (document.getElementById("jhimfit-styles")) return;
  const el = document.createElement("style");
  el.id = "jhimfit-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;800&display=swap');
    @keyframes dropFill  { from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:1} }
    @keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
    @keyframes slideUp   { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes streakPop { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 100%{transform:scale(1)} }
    @keyframes spin      { to{transform:rotate(360deg)} }

    /* ── Stick figure body parts ── */
    @keyframes ex-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
    @keyframes ex-bounce {
      0%,100%{ transform:translateY(0) }
      30%    { transform:translateY(-18px) }
      60%    { transform:translateY(-8px) }
    }
    @keyframes ex-arms-star {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(60deg) }
    }
    @keyframes ex-legs-star {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(30deg) }
    }
    @keyframes ex-squat {
      0%,100%{ transform:translateY(0) scaleY(1) }
      50%    { transform:translateY(12px) scaleY(0.8) }
    }
    @keyframes ex-pushup {
      0%,100%{ transform:translateY(0) }
      50%    { transform:translateY(8px) }
    }
    @keyframes ex-run {
      0%,100%{ transform:rotate(-15deg) }
      50%    { transform:rotate(15deg) }
    }
    @keyframes ex-lunge {
      0%,100%{ transform:translateX(0) scaleY(1) }
      50%    { transform:translateX(10px) scaleY(0.85) }
    }
    @keyframes ex-plank {
      0%,100%{ transform:scaleX(1) }
      50%    { transform:scaleX(1.04) }
    }
    @keyframes ex-crunch {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(-30deg) }
    }
    @keyframes ex-bridge {
      0%,100%{ transform:translateY(0) }
      50%    { transform:translateY(-12px) }
    }
    @keyframes ex-raise {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(-70deg) }
    }
    @keyframes ex-curl {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(-80deg) }
    }
    @keyframes ex-row {
      0%,100%{ transform:translateX(0) }
      50%    { transform:translateX(-10px) }
    }
    @keyframes ex-press {
      0%,100%{ transform:translateY(0) }
      50%    { transform:translateY(-14px) }
    }
    @keyframes ex-skip {
      0%,100%{ transform:translateY(0) }
      40%    { transform:translateY(-14px) }
    }
    @keyframes ex-twist {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(35deg) }
    }
    @keyframes ex-flutter {
      0%,100%{ transform:rotate(10deg) }
      50%    { transform:rotate(-10deg) }
    }
    @keyframes ex-jog {
      0%,100%{ transform:translateX(0) rotate(0deg) }
      50%    { transform:translateX(4px) rotate(5deg) }
    }
    @keyframes ex-hinge {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(45deg) }
    }
    @keyframes ex-dip {
      0%,100%{ transform:translateY(0) }
      50%    { transform:translateY(12px) }
    }
    @keyframes ex-pullup {
      0%,100%{ transform:translateY(0) }
      50%    { transform:translateY(-14px) }
    }
    @keyframes ex-extend {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(-90deg) }
    }
    @keyframes ex-fly {
      0%,100%{ transform:rotate(60deg) }
      50%    { transform:rotate(10deg) }
    }
    @keyframes ex-walk {
      0%,100%{ transform:translateX(0) }
      50%    { transform:translateX(6px) }
    }
    @keyframes ex-cycle {
      0%    { transform:rotate(0deg) }
      100%  { transform:rotate(360deg) }
    }
    @keyframes ex-arm-fwd  { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(-40deg)} }
    @keyframes ex-arm-back  { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(40deg)} }
    @keyframes ex-knee-up   { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(-35deg)} }
    @keyframes ex-knee-dn   { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(35deg)} }
    @keyframes ex-shin-up   { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(-30deg)} }
    @keyframes ex-shin-dn   { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(30deg)} }
    @keyframes ex-arms-out  { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(-50deg)} }
    @keyframes ex-legs-out  { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(25deg)} }
    @keyframes ex-rope      { 0%,100%{transform:scaleY(0.6) translateY(8px)} 50%{transform:scaleY(1) translateY(0)} }
    @keyframes ex-legrise   { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(-70deg)} }
    @keyframes ex-climb     { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-12px)} }
    @keyframes ex-jumpup    { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-20px)} }
    @keyframes ex-situp {
      0%,100%{ transform:rotate(0deg) }
      50%    { transform:rotate(-50deg) }
    }

    .water-drop { transform-origin:bottom; animation:dropFill 0.35s cubic-bezier(.34,1.56,.64,1) both; }
    .stat-tile:hover { transform:translateY(-2px); transition:transform 0.2s ease; }
    .water-btn:hover { transform:scale(1.06); }
    .water-btn:active{ transform:scale(0.94); }
    .water-btn { transition: all 0.15s cubic-bezier(.34,1.56,.64,1); }
    .bento-card { animation: slideUp 0.4s ease both; }
  `;
  document.head.appendChild(el);
};

/* ─── Meal Data ──────────────────────────────────────────────────────────── */
const GHANAIAN_MEALS = [
  // BREAKFAST
  { id:1,  name:"Oats & Banana",             category:"Breakfast", calories:290, protein:9,  carbs:52, fat:5,  emoji:"🥣", description:"Rolled oats cooked with milk, topped with banana slices and a drizzle of honey", benefits:["Slow release energy","High fibre","Heart healthy"], color:"#a0522d" },
  { id:2,  name:"Boiled Eggs & Bread",        category:"Breakfast", calories:310, protein:18, carbs:32, fat:11, emoji:"🥚", description:"Two boiled eggs served with sliced whole wheat or white bread", benefits:["High protein","Quick to make","Affordable"], color:"#d4a017" },
  { id:3,  name:"Fried Egg & Rice",           category:"Breakfast", calories:380, protein:14, carbs:52, fat:12, emoji:"🍳", description:"Pan-fried egg served over steamed white rice - a simple filling morning meal", benefits:["Protein packed","Energising","Budget friendly"], color:"#b8600a" },
  { id:4,  name:"Bread & Peanut Butter",      category:"Breakfast", calories:340, protein:12, carbs:38, fat:16, emoji:"🍞", description:"Sliced bread spread generously with peanut butter - easy and filling", benefits:["Healthy fats","Plant protein","Quick prep"], color:"#c4860a" },
  { id:5,  name:"Corn Porridge (Koko)",       category:"Breakfast", calories:200, protein:5,  carbs:40, fat:3,  emoji:"🌽", description:"Smooth fermented corn porridge, often sweetened with sugar or honey", benefits:["Easy on stomach","Low fat","Warming"], color:"#e09020" },
  { id:6,  name:"Pancakes & Egg",             category:"Breakfast", calories:350, protein:13, carbs:44, fat:12, emoji:"🥞", description:"Simple flour pancakes cooked in a pan, served with a fried egg on the side", benefits:["Balanced macros","Kid friendly","Filling"], color:"#c4860a" },
  { id:7,  name:"Yam & Egg Stew",             category:"Breakfast", calories:320, protein:14, carbs:44, fat:9,  emoji:"🥔", description:"Boiled yam pieces served with a spiced tomato and egg sauce", benefits:["Complex carbs","High protein","Traditional"], color:"#b5541e" },
  { id:8,  name:"Milk & Cereal",              category:"Breakfast", calories:260, protein:8,  carbs:46, fat:5,  emoji:"🥛", description:"Any cereal of choice served with cold or warm milk - fast and nutritious", benefits:["Fortified vitamins","Quick prep","Good for kids"], color:"#a0522d" },

  // LUNCH
  { id:9,  name:"Rice & Chicken Stew",        category:"Lunch",     calories:480, protein:28, carbs:58, fat:13, emoji:"🍗", description:"Steamed white rice with a rich tomato and chicken stew - a universal favourite", benefits:["High protein","Balanced meal","Widely available"], color:"#C9A84C" },
  { id:10, name:"Jollof Rice",                category:"Lunch",     calories:420, protein:12, carbs:68, fat:11, emoji:"🍚", description:"Smoky one-pot tomato rice cooked with spices - one of West Africa's best dishes", benefits:["High energy","Lycopene rich","Crowd pleaser"], color:"#cc4e1a" },
  { id:11, name:"Rice & Beans",               category:"Lunch",     calories:380, protein:16, carbs:62, fat:7,  emoji:"🫘", description:"White rice cooked or served alongside seasoned black-eyed beans or kidney beans", benefits:["Complete protein","High fibre","Very affordable"], color:"#8b4513" },
  { id:12, name:"Fried Rice & Sausage",       category:"Lunch",     calories:460, protein:18, carbs:56, fat:16, emoji:"🥘", description:"Stir-fried rice with vegetables, eggs and sliced sausage", benefits:["Balanced macros","Tasty","Easy to make"], color:"#b5700a" },
  { id:13, name:"Boiled Yam & Sauce",         category:"Lunch",     calories:340, protein:10, carbs:58, fat:9,  emoji:"🍠", description:"Chunks of boiled yam served with tomato stew or palava sauce", benefits:["Complex carbs","Filling","Affordable"], color:"#c4860a" },
  { id:14, name:"Noodles & Egg",              category:"Lunch",     calories:360, protein:14, carbs:52, fat:10, emoji:"🍜", description:"Instant noodles cooked with egg, vegetables and seasoning - a quick go-to meal", benefits:["Fast prep","Budget friendly","Filling"], color:"#e09020" },
  { id:15, name:"Banku & Tilapia",            category:"Lunch",     calories:510, protein:38, carbs:52, fat:14, emoji:"🐟", description:"Fermented corn and cassava dumpling served with grilled tilapia and pepper", benefits:["High protein","Omega-3","Traditional"], color:"#1a6e5a" },
  { id:16, name:"Waakye",                     category:"Lunch",     calories:380, protein:14, carbs:62, fat:8,  emoji:"🌿", description:"Rice and beans cooked together with sorghum leaves, served with stew and sides", benefits:["Complete protein","High fibre","Street food classic"], color:"#5a7a2a" },
  { id:17, name:"Bread & Sardines",           category:"Lunch",     calories:330, protein:20, carbs:32, fat:12, emoji:"🥫", description:"Sliced bread stuffed with canned sardines, tomato, onion and pepper", benefits:["High protein","Omega-3","Very affordable"], color:"#2d6a7a" },
  { id:18, name:"Kenkey & Fried Fish",        category:"Lunch",     calories:480, protein:32, carbs:58, fat:13, emoji:"🌽", description:"Fermented corn dumpling with crispy fried fish and a spicy pepper sauce", benefits:["High protein","Probiotic","Filling"], color:"#e09020" },

  // DINNER
  { id:19, name:"Fufu & Light Soup",          category:"Dinner",    calories:460, protein:24, carbs:62, fat:12, emoji:"🍲", description:"Pounded cassava and plantain served in a light chicken or fish soup with vegetables", benefits:["High energy","Digestive aid","Traditional"], color:"#2d7a5a" },
  { id:20, name:"Rice & Egg Stew",            category:"Dinner",    calories:390, protein:16, carbs:58, fat:10, emoji:"🍛", description:"White rice with a simple tomato and egg stew - cheap, fast and delicious", benefits:["Balanced","Budget friendly","Easy"], color:"#cc4e1a" },
  { id:21, name:"Spaghetti & Sauce",          category:"Dinner",    calories:420, protein:14, carbs:64, fat:10, emoji:"🍝", description:"Boiled spaghetti in a tomato-based sauce with vegetables and optional meat", benefits:["Energy dense","Affordable","Easy to cook"], color:"#C9A84C" },
  { id:22, name:"Kontomire Stew & Rice",      category:"Dinner",    calories:350, protein:18, carbs:48, fat:14, emoji:"🥬", description:"Cocoyam leaves cooked in palm oil with smoked fish and tomatoes, served over rice", benefits:["High iron","Vitamin A","Antioxidants"], color:"#2d6a2d" },
  { id:23, name:"Grilled Chicken & Veggies",  category:"Dinner",    calories:370, protein:38, carbs:18, fat:14, emoji:"🍗", description:"Seasoned grilled chicken thighs or breast served with boiled or stir-fried vegetables", benefits:["Very high protein","Low carb","Clean eating"], color:"#b5700a" },
  { id:24, name:"Groundnut Soup & Rice Balls",category:"Dinner",    calories:460, protein:22, carbs:58, fat:16, emoji:"🥜", description:"Thick creamy groundnut soup with chicken served with soft rice balls (omotuo)", benefits:["Healthy fats","High protein","Filling"], color:"#b5541e" },
  { id:25, name:"Beans Stew & Plantain",      category:"Dinner",    calories:410, protein:14, carbs:66, fat:10, emoji:"🍌", description:"Spicy black-eyed bean stew served alongside fried or boiled ripe plantain", benefits:["Plant protein","High fibre","Potassium rich"], color:"#3a6a3a" },
  { id:26, name:"Chicken Peanut Stew & Rice", category:"Dinner",    calories:440, protein:34, carbs:32, fat:18, emoji:"🍲", description:"Tender chicken simmered in a thick peanut-based sauce, served with rice", benefits:["High protein","Healthy fats","Vitamin B6"], color:"#b5700a" },
  { id:27, name:"Egg Fried Rice",             category:"Dinner",    calories:400, protein:15, carbs:58, fat:12, emoji:"🍳", description:"Leftover rice stir-fried with eggs, spring onions, vegetables and soy sauce", benefits:["Uses leftovers","Budget friendly","Balanced"], color:"#a06020" },
  { id:28, name:"Boiled Plantain & Beans",    category:"Dinner",    calories:370, protein:12, carbs:64, fat:7,  emoji:"🫘", description:"Soft boiled plantain served alongside seasoned beans - a simple wholesome dinner", benefits:["High fibre","Plant protein","Affordable"], color:"#1a6e5a" },

  // SNACKS
  { id:29, name:"Boiled Groundnuts",          category:"Snack",     calories:160, protein:7,  carbs:12, fat:11, emoji:"🥜", description:"Soft boiled peanuts with a pinch of salt - easy and filling on the go", benefits:["Plant protein","Healthy fats","Affordable"], color:"#a06020" },
  { id:30, name:"Ripe Plantain (Fried)",      category:"Snack",     calories:190, protein:2,  carbs:38, fat:6,  emoji:"🍌", description:"Sweet ripe plantain sliced and fried until golden - a popular everyday snack", benefits:["Quick energy","Potassium","Natural sugars"], color:"#e0a020" },
  { id:31, name:"Boiled Egg",                 category:"Snack",     calories:78,  protein:6,  carbs:1,  fat:5,  emoji:"🥚", description:"A single plain boiled egg - one of the cheapest and best protein snacks available", benefits:["High protein","Very affordable","Low calorie"], color:"#d4a017" },
  { id:32, name:"Bread & Egg",                category:"Snack",     calories:250, protein:10, carbs:30, fat:9,  emoji:"🍞", description:"A slice of bread with a fried or boiled egg - quick protein-rich snack any time of day", benefits:["Protein boost","Cheap","Filling"], color:"#c4860a" },
  { id:33, name:"Banana",                     category:"Snack",     calories:90,  protein:1,  carbs:23, fat:0,  emoji:"🍌", description:"A fresh ripe banana - nature's perfect pre or post workout snack", benefits:["Quick energy","Potassium","Natural"], color:"#e0a020" },
  { id:34, name:"Biscuits & Tea",             category:"Snack",     calories:180, protein:3,  carbs:28, fat:6,  emoji:"🍪", description:"Plain or cream biscuits served with hot tea or Milo - a light afternoon snack", benefits:["Quick energy","Light","Widely available"], color:"#a0522d" },
  { id:35, name:"Roasted Corn",               category:"Snack",     calories:130, protein:4,  carbs:26, fat:2,  emoji:"🌽", description:"Fresh corn roasted over fire - a classic street snack available everywhere", benefits:["Low fat","High fibre","Natural"], color:"#e09020" },
  { id:36, name:"Milo & Milk",                category:"Snack",     calories:200, protein:6,  carbs:34, fat:4,  emoji:"🥛", description:"Hot or cold Milo chocolate malt drink mixed with milk - loved by all ages", benefits:["Fortified vitamins","Energy boost","Tasty"], color:"#5a3a1a" },
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

/* ── Exercise YouTube Drill Videos ────────────────────────────────────────
   Each key matches the exact exercise move name.
   Videos are short form-focused YouTube tutorials / drill clips.
   Using YouTube embed with autoplay + mute + loop for GIF-like experience.
────────────────────────────────────────────────────────────────────────── */
const EXERCISE_VIDEOS = {
  // Cardio / HIIT
  "Star Jumps":           "iSSAk4XCsRA",
  "Burpees":              "dZgVxmf6jkA",
  "High Knees":           "oDdkytliOqE",
  "Mountain Climbers":    "nmwgirgXLYM",
  "Jump Squats":          "Azl5tkCzDcc",
  "Plank Hold":           "ASdvSXg_up8",
  // Full body
  "Squats":               "aclHkVaku9U",
  "Push-ups":             "IODxDxX7oi4",
  "Backward Lunges":      "xrPteyQLGAo",
  "Plank":                "ASdvSXg_up8",
  "Tummy Crunches":       "Xyd_fa5zoEU",
  "Hip Raises":           "wPM8icPu6H8",
  // Skipping & Core
  "Skipping - Slow Pace": "u3zgHI8QnqE",
  "Skipping - Fast Pace": "u3zgHI8QnqE",
  "Sit-ups":              "jDwoBqPH0jk",
  "Straight Leg Raises":  "JB2oyawG9KQ",
  "Flutter Kicks":        "ANVdMDaYRts",
  "Side Plank":           "K2VljzCC16g",
  // Easy cardio
  "Brisk Walk / Jog":     "pHkNHMsVlPE",
  "Slow Jogging":         "pHkNHMsVlPE",
  "Walking Lunges":       "L8fvypPrzzs",
  "Step-ups":             "aP7PzMfmGlQ",
  "Cool-down Stretch":    "qULTwquOuT4",
  // Chest & Triceps
  "Bench Press":          "vcBig73ojpE",
  "Incline Dumbbell Press":"8iPEnn-ltC8",
  "Chest Fly":            "eozdVDA78K0",
  "Dips":                 "2z8JmcrW-As",
  "Tricep Pushdown":      "2-LAMcpzODU",
  "Skull Crushers":       "NIvwLDs0UHQ",
  // Back & Biceps
  "Pull-ups":             "eGo4IYlbE5g",
  "Bent-Over Row":        "FWJR5Ve8bnQ",
  "Seated Cable Row":     "GZbfZ033f74",
  "One-Arm Dumbbell Row": "pYcpY20QaE8",
  "Bicep Curl":           "ykJmrZ5v0Oo",
  "Hammer Curl":          "zC3nLlEvin4",
  // Legs
  "Barbell Squat":        "Dy28eq2PjcM",
  "Stiff-Leg Deadlift":   "1uDiW5--rAE",
  "Leg Press Machine":    "IZxyjW7MPJQ",
  "Leg Curl Machine":     "1Tq3QdYUuHs",
  "Calf Raises":          "gwLzBJYoWlA",
  // Shoulders & Abs
  "Shoulder Press":       "qEwKCR5JCog",
  "Side Raises":          "3VcKaXpzqRo",
  "Front Raises":         "soxrZlIl35U",
  "Rear Delt Raises":     "EA7u4Q_8HQ0",
  "Plank with Weight":    "ASdvSXg_up8",
  "Rotation Crunches":    "lDBPKoFWCRc",
};

/* Exercise Video Drill Modal */
const ExerciseDrillModal = React.memo(({ exercise, onClose }) => {
  const videoId = EXERCISE_VIDEOS[exercise.move];

  // Render into document.body via Portal — completely outside the
  // WorkoutContent tree so timer ticks NEVER cause this to re-render
  return createPortal(
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.88)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:20, backdropFilter:"blur(6px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#0d1320",
        border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:24, overflow:"hidden",
        width:"100%", maxWidth:480,
        boxShadow:"0 24px 80px rgba(0,0,0,0.8)",
      }}>
        {/* Header */}
        <div style={{
          background:"linear-gradient(135deg,#111827,#090d16)",
          borderBottom:"1px solid rgba(255,255,255,0.07)",
          padding:"16px 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:20,letterSpacing:1,color:"#f0ede8",lineHeight:1}}>
              {exercise.emoji} {exercise.move}
            </div>
            <div style={{fontSize:11,color:"rgba(240,237,232,0.4)",marginTop:4,letterSpacing:0.5}}>
              {exercise.sets} sets · {exercise.reps} · Rest {exercise.rest}
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,0.06)", border:"none",
            borderRadius:10, width:34, height:34, cursor:"pointer",
            color:"rgba(240,237,232,0.6)", fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>

        {/* Video — stable src, never remounts */}
        <div style={{position:"relative", paddingBottom:"56.25%", background:"#000"}}>
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1`}
              title={exercise.move}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}
            />
          ) : (
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{fontSize:48}}>{exercise.emoji}</span>
              <div style={{color:"rgba(240,237,232,0.4)",fontSize:13}}>No video available</div>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{padding:"16px 20px"}}>
          <div style={{fontSize:13,color:"rgba(240,237,232,0.65)",lineHeight:1.75,marginBottom:14}}>
            {exercise.desc}
          </div>
          <button onClick={onClose} style={{
            width:"100%", background:"#C9A84C", border:"none",
            borderRadius:12, padding:"12px 0",
            fontFamily:"'Bebas Neue',Impact,sans-serif",
            fontSize:15, letterSpacing:2, color:"white", cursor:"pointer",
          }}>GOT IT — START EXERCISE</button>
        </div>
      </div>
    </div>,
    document.body
  );
});

const WORKOUT_PLANS = [
  {
    id:"lose", title:"Lose Weight", icon:"🔥", color:"#C9A84C",
    bgColor:"rgba(201,168,76,0.08)", borderColor:"rgba(201,168,76,0.3)",
    subtitle:"High-intensity fat-burning programme", duration:"8 Weeks", frequency:"4 days/week",
    about:"This programme is designed to help you burn body fat through a mix of high-intensity cardio and full-body exercises. You do not need a gym - most sessions can be done at home with no equipment. The goal is to keep your heart rate high, burn lots of calories, and build a habit of moving 4 days every week.",
    howItWorks:"Each week you do 4 sessions on Monday, Wednesday, Friday and Saturday. The sessions alternate between intense cardio days and lighter full-body days so your body gets time to recover. Over 8 weeks your fitness will improve and your body will get better at burning fat even at rest.",
    rules:[
      "Do not skip rest days - your body burns fat and repairs itself while resting",
      "Drink water before, during and after every session",
      "If an exercise is too hard, slow down or take a longer rest - do not quit",
      "Pair this programme with a calorie deficit diet for best results",
      "Aim to sleep 7-8 hours every night - poor sleep slows fat loss",
    ],
    schedule:[
      { day:"Monday",    session:"Cardio Blast",   note:"High-intensity cardio - gets your heart rate up fast" },
      { day:"Tuesday",   session:"Rest Day",        note:"Light walking allowed but no structured workout" },
      { day:"Wednesday", session:"Full Body Burn",  note:"Strength-focused session - builds muscle while burning fat" },
      { day:"Thursday",  session:"Rest Day",        note:"Stretch or go for a short walk if you feel restless" },
      { day:"Friday",    session:"Skipping & Core", note:"Jump rope burns calories fast + core work for flat abs" },
      { day:"Saturday",  session:"Easy Cardio Day", note:"Slower pace cardio - trains your body to burn fat as fuel" },
      { day:"Sunday",    session:"Rest Day",        note:"Full rest - prepare your meals and hydrate well" },
    ],
    sessions:[
      { day:"Monday", name:"Cardio Blast", duration:30, calories:450, difficulty:"Intermediate",
        warmup:"5 min light jog in place + arm circles", cooldown:"5 min slow walk + full-body stretch",
        tip:"Keep rest to 20-30s between sets to keep your heart rate elevated for maximum fat burn.",
        exercises:[
          { move:"Star Jumps",          emoji:"⭐", anim:"bounce", sets:3, reps:"40 reps", rest:"20s", desc:"Stand straight. Jump up spreading your arms and legs wide like a star, then jump back to standing. Keep a steady rhythm." },
          { move:"Burpees",             emoji:"💥", anim:"squat",  sets:3, reps:"10 reps", rest:"30s", desc:"Stand, drop hands to floor, kick feet back to a push-up position, do one push-up, jump feet forward, then jump up with hands overhead. Full body move." },
          { move:"High Knees",          emoji:"🦵", anim:"run",    sets:3, reps:"30 seconds", rest:"20s", desc:"Run on the spot lifting your knees as high as your waist with each step. Pump your arms. Move fast - this raises your heart rate quickly." },
          { move:"Mountain Climbers",   emoji:"🧗", anim:"climb",  sets:3, reps:"20 reps", rest:"30s", desc:"Get into a push-up position with arms straight. Drive one knee towards your chest then switch legs fast - like you are running horizontally on the floor." },
          { move:"Jump Squats",         emoji:"🦘", anim:"jump",   sets:3, reps:"15 reps", rest:"30s", desc:"Stand with feet shoulder-width apart. Lower into a squat then explode upward jumping off the ground. Land softly by bending your knees, then go straight into the next squat." },
          { move:"Plank Hold",          emoji:"🪵", anim:"plank",  sets:3, reps:"45 seconds", rest:"20s", desc:"Lie face down, lift your body on your forearms and toes keeping your body in a straight line like a plank of wood. Do not let your hips sag or rise. Hold still and breathe." },
        ]},
      { day:"Wednesday", name:"Full Body Burn", duration:40, calories:380, difficulty:"Beginner",
        warmup:"5 min brisk walk + leg swings", cooldown:"5 min stretch focusing on hips and hamstrings",
        tip:"Focus on perfect form over speed. Deep squats and lunges activate more muscle and burn more calories.",
        exercises:[
          { move:"Squats",              emoji:"🪑", anim:"squat",  sets:4, reps:"20 reps", rest:"30s", desc:"Stand with feet shoulder-width apart. Push your hips back and bend your knees like you are sitting into a chair. Go until thighs are parallel to the floor, then stand back up." },
          { move:"Push-ups",            emoji:"💪", anim:"pushup", sets:4, reps:"12 reps", rest:"30s", desc:"Place hands slightly wider than shoulders on the floor. Lower your chest to the ground keeping your body straight, then push back up. If too hard, rest knees on the floor." },
          { move:"Backward Lunges",     emoji:"🚶", anim:"lunge",  sets:3, reps:"15 each leg", rest:"30s", desc:"Stand tall. Step one foot backward and lower your back knee towards the ground. Front knee should be at 90 degrees. Push through your front foot to return to standing. Alternate legs." },
          { move:"Plank",               emoji:"🪵", anim:"plank",  sets:3, reps:"45 seconds", rest:"30s", desc:"Hold your body in a straight line from head to heels, resting on forearms and toes. Squeeze your stomach muscles tight. Do not hold your breath." },
          { move:"Tummy Crunches",      emoji:"🫁", anim:"crunch", sets:3, reps:"20 reps", rest:"20s", desc:"Lie on your back with knees bent and feet flat. Place hands behind your head. Curl your shoulders and upper back off the floor towards your knees, then slowly lower back down." },
          { move:"Hip Raises",          emoji:"🍑", anim:"bridge", sets:3, reps:"20 reps", rest:"20s", desc:"Lie on your back with knees bent and feet flat on the floor. Push through your heels to lift your hips up until your body forms a straight line from shoulders to knees. Squeeze your bum at the top, then lower." },
        ]},
      { day:"Friday", name:"Skipping & Core", duration:35, calories:420, difficulty:"Intermediate",
        warmup:"3 min slow jump rope + shoulder rolls", cooldown:"5 min core stretches + child pose",
        tip:"10 minutes of skipping burns the same calories as an 8-minute mile run. It is one of the best tools for fat loss.",
        exercises:[
          { move:"Skipping - Slow Pace",   emoji:"🪢", anim:"skip",   sets:5, reps:"2 minutes",  rest:"30s", desc:"Hold one end of the rope in each hand. Swing it over your head and jump over it with both feet each time it reaches the ground. Keep a steady rhythm you can maintain." },
          { move:"Skipping - Fast Pace",   emoji:"🪢", anim:"skipfast",sets:3, reps:"1 minute",   rest:"30s", desc:"Same as slow skipping but speed up the rope and your feet. Try to skip as fast as you can for the full minute without stopping." },
          { move:"Sit-ups",                emoji:"🫁", anim:"situp",  sets:4, reps:"20 reps",    rest:"20s", desc:"Lie on your back with knees bent and feet flat or held down. Cross arms over chest. Use your stomach muscles to pull your upper body all the way up to sitting, then lower back slowly." },
          { move:"Straight Leg Raises",    emoji:"🦵", anim:"raise",  sets:3, reps:"15 reps",    rest:"20s", desc:"Lie flat on your back with legs straight and hands under your lower back. Keeping legs straight, raise them up to 90 degrees then slowly lower back down without letting feet touch the floor." },
          { move:"Side-to-Side Twists",    emoji:"🔄", anim:"twist",  sets:3, reps:"20 reps",    rest:"20s", desc:"Sit on the floor with knees slightly bent and feet raised. Lean back slightly. Rotate your upper body left then right touching the floor beside each hip. Keep feet off the ground throughout." },
          { move:"Flutter Kicks",          emoji:"🏊", anim:"flutter",sets:3, reps:"30 seconds", rest:"20s", desc:"Lie flat on your back with legs straight and hands under your bottom. Lift feet 6 inches off the ground. Kick legs up and down alternately in small fast movements like you are swimming." },
        ]},
      { day:"Saturday", name:"Easy Cardio Day", duration:50, calories:500, difficulty:"Beginner",
        warmup:"5 min slow walk", cooldown:"10 min full-body stretch",
        tip:"Slow and steady cardio trains your body to use fat as fuel. Walk or jog at a pace where you can still hold a conversation.",
        exercises:[
          { move:"Brisk Walk or Light Jog", emoji:"🏃", anim:"jog",   sets:1, reps:"25-30 minutes", rest:"--", desc:"Walk at a fast pace or jog slowly for 25-30 minutes. You should be slightly out of breath but still able to talk. Go outside or on a treadmill." },
          { move:"Cycling or Skipping",     emoji:"🚴", anim:"cycle",  sets:1, reps:"15 minutes",     rest:"--", desc:"Ride a bicycle or skip rope at a comfortable steady pace for 15 minutes. This is not a race - keep it easy and rhythmic." },
          { move:"Cool-down Walk",          emoji:"🚶", anim:"walk",   sets:1, reps:"5 minutes",      rest:"--", desc:"Slow right down and walk at a very gentle pace. This brings your heart rate back to normal and helps your muscles recover." },
        ]},
    ],
  },
  {
    id:"gain", title:"Build Muscle", icon:"💪", color:"#1a6e5a",
    bgColor:"rgba(26,122,74,0.08)", borderColor:"rgba(26,122,74,0.3)",
    subtitle:"Progressive overload strength training", duration:"12 Weeks", frequency:"4 days/week",
    about:"This programme is built around lifting weights and getting stronger every week. Each session targets a specific muscle group so each muscle gets enough rest before being trained again. Over 12 weeks you will see noticeable increases in strength, muscle size and body shape. You will need access to a gym or basic weights.",
    howItWorks:"The plan uses a push-pull-legs split across 4 days. Monday is chest and arms (push). Tuesday is back and biceps (pull). Thursday is legs. Friday is shoulders and abs. This spread ensures no two related muscle groups are trained back to back, allowing maximum recovery and growth.",
    rules:[
      "Progressive overload is the key rule - add 2.5 to 5 kg every week once you complete all reps cleanly",
      "Never rush reps - slow controlled movement builds more muscle than fast sloppy reps",
      "Eat enough protein - aim for at least 1.6g per kg of your body weight every day",
      "Warm up properly before every session to avoid injury",
      "Track your weights each session so you know when to increase the load",
    ],
    schedule:[
      { day:"Monday",    session:"Chest & Arms",    note:"Push movements - bench press, dips, tricep work" },
      { day:"Tuesday",   session:"Back & Biceps",   note:"Pull movements - rows, pull-ups, curls" },
      { day:"Wednesday", session:"Rest Day",        note:"Active rest - light walk or stretching only" },
      { day:"Thursday",  session:"Legs Day",        note:"The most important session - squats, lunges, leg press" },
      { day:"Friday",    session:"Shoulders & Abs", note:"Overhead press, lateral raises and core work" },
      { day:"Saturday",  session:"Rest Day",        note:"Rest or light cardio - 20 min walk is perfect" },
      { day:"Sunday",    session:"Rest Day",        note:"Full rest - meal prep and recovery" },
    ],
    sessions:[
      { day:"Monday", name:"Chest & Arms", duration:55, calories:300, difficulty:"Intermediate",
        warmup:"5 min light cardio + 2x15 bodyweight push-ups", cooldown:"5 min chest and tricep stretch",
        tip:"Progressive overload is the number 1 rule. Add 2.5-5 kg every week once you complete all reps with good form.",
        exercises:[
          { move:"Chest Press",              emoji:"🏋", anim:"press",  sets:4, reps:"8-10 reps", rest:"90s", desc:"Lie on a bench holding a barbell or dumbbells above your chest with arms extended. Slowly lower the weight to your chest, then push it back up. Keep elbows at 45 degrees." },
          { move:"Upper Chest Press",        emoji:"📐", anim:"press",  sets:3, reps:"10 reps",   rest:"90s", desc:"Same as chest press but on an incline bench angled upward. This targets the upper part of your chest. Lower the weight to your upper chest then press back up." },
          { move:"Chest Fly",                emoji:"🦅", anim:"fly",    sets:3, reps:"12 reps",   rest:"60s", desc:"Using cables or dumbbells, extend arms out to the sides like wings then bring them together in front of your chest in a hugging motion. Feel the stretch across your chest." },
          { move:"Tricep Dips",              emoji:"⬇️", anim:"dip",    sets:3, reps:"12 reps",   rest:"60s", desc:"Grip parallel bars with arms straight. Lower your body by bending elbows until arms are at 90 degrees, then push back up. Lean slightly forward to target the chest too." },
          { move:"Lying Tricep Extension",   emoji:"💪", anim:"extend", sets:3, reps:"12 reps",   rest:"60s", desc:"Lie on a bench holding a barbell or dumbbells above your forehead with arms extended. Bend only your elbows to lower the weight towards your forehead, then extend back up." },
          { move:"Tricep Pushdown",          emoji:"⬇️", anim:"push",   sets:3, reps:"15 reps",   rest:"60s", desc:"Stand at a cable machine with a bar or rope attachment at chest height. Keep elbows pinned to your sides and push the bar down until arms are straight, then slowly return up." },
        ]},
      { day:"Tuesday", name:"Back & Biceps", duration:55, calories:290, difficulty:"Intermediate",
        warmup:"5 min light row or band pull-aparts", cooldown:"5 min lat and bicep stretch",
        tip:"Focus on driving your elbows down and back during rows - not pulling with your hands. This activates the lats fully.",
        exercises:[
          { move:"Pull-ups",               emoji:"🧲", anim:"pullup", sets:4, reps:"8 reps",    rest:"90s", desc:"Hang from a bar with palms facing away. Pull your body up until your chin is above the bar by squeezing your back muscles and driving elbows down. Lower slowly." },
          { move:"Bent-Over Row",          emoji:"🏋", anim:"row",    sets:4, reps:"8-10 reps", rest:"90s", desc:"Stand holding a barbell, hinge forward at the hips with a flat back. Pull the bar into your belly button driving elbows back, then lower slowly. Keep your back flat throughout." },
          { move:"Seated Cable Row",       emoji:"🚣", anim:"row",    sets:3, reps:"12 reps",   rest:"60s", desc:"Sit at a cable row machine, feet on the platform. Pull the handle into your stomach keeping your back straight and squeezing your shoulder blades together at the end." },
          { move:"One-Arm Dumbbell Row",   emoji:"💪", anim:"row",    sets:3, reps:"12 each",   rest:"60s", desc:"Place one knee and hand on a bench for support. Hold a dumbbell in the other hand, let it hang, then pull it up towards your hip driving your elbow back. Lower slowly." },
          { move:"Bicep Curl",             emoji:"💪", anim:"curl",   sets:3, reps:"10 reps",   rest:"60s", desc:"Stand holding a barbell or dumbbells with palms facing up. Keep elbows pinned to your sides and curl the weight up to your shoulders, then slowly lower back down." },
          { move:"Hammer Curl",            emoji:"🔨", anim:"curl",   sets:3, reps:"12 reps",   rest:"60s", desc:"Hold dumbbells with palms facing each other like holding a hammer. Curl the weight up keeping that neutral grip. This builds the outer bicep and forearm." },
        ]},
      { day:"Thursday", name:"Legs Day", duration:60, calories:380, difficulty:"Advanced",
        warmup:"5 min walk + dynamic leg swings and hip circles", cooldown:"8 min deep quad, hamstring and hip flexor stretch",
        tip:"Squat to parallel or below for full muscle activation. Depth over weight - always.",
        exercises:[
          { move:"Barbell Squat",      emoji:"🦵", anim:"squat",  sets:4, reps:"8 reps",   rest:"120s", desc:"Stand with a barbell across your upper back. Push hips back and bend knees lowering until thighs are parallel to the floor, then drive through your heels to stand back up. Keep chest up and back straight." },
          { move:"Stiff-Leg Deadlift", emoji:"🏋", anim:"hinge",  sets:4, reps:"10 reps",  rest:"90s",  desc:"Hold a barbell in front of your thighs. Keeping legs mostly straight, hinge at the hips pushing them back and lowering the bar along your legs until you feel a stretch in your hamstrings, then drive hips forward to stand." },
          { move:"Leg Press Machine",  emoji:"🦿", anim:"press",  sets:3, reps:"12 reps",  rest:"90s",  desc:"Sit in the leg press machine with feet shoulder-width on the platform. Bend knees to 90 degrees letting the weight come towards you, then press through your heels to push the platform away." },
          { move:"Walking Lunges",     emoji:"🚶", anim:"lunge",  sets:3, reps:"12 each",  rest:"60s",  desc:"Stand tall holding dumbbells. Step forward with one foot and lower your back knee towards the ground. Push through the front foot to bring yourself forward into the next lunge. Keep walking forward." },
          { move:"Leg Curl Machine",   emoji:"🦵", anim:"curl",   sets:3, reps:"15 reps",  rest:"60s",  desc:"Lie face down on the leg curl machine. Hook your ankles under the pad. Curl your feet up towards your backside squeezing your hamstrings, then slowly lower back down." },
          { move:"Calf Raises",        emoji:"👣", anim:"raise",  sets:4, reps:"20 reps",  rest:"45s",  desc:"Stand with the balls of your feet on a step or flat surface. Rise up onto your tiptoes as high as you can squeezing your calves, then lower your heels below the step for a full stretch. Slow and controlled." },
        ]},
      { day:"Friday", name:"Shoulders & Abs", duration:50, calories:260, difficulty:"Intermediate",
        warmup:"5 min light cardio + band shoulder rotations", cooldown:"5 min shoulder and neck stretch",
        tip:"Hit all 3 parts of the shoulder - front, side, and back - for balanced, full-looking shoulders.",
        exercises:[
          { move:"Shoulder Press",     emoji:"🏋", anim:"press",  sets:4, reps:"8 reps",     rest:"90s", desc:"Sit or stand holding a barbell or dumbbells at shoulder height. Press the weight straight up overhead until arms are fully extended, then lower back slowly to shoulders." },
          { move:"Side Raises",        emoji:"🦅", anim:"raise",  sets:3, reps:"15 reps",    rest:"45s", desc:"Stand holding dumbbells at your sides. With a slight bend in the elbows, raise both arms out to the sides until they are level with your shoulders, then slowly lower back down. Do not swing." },
          { move:"Front Raises",       emoji:"⬆️", anim:"raise",  sets:3, reps:"12 reps",    rest:"45s", desc:"Hold dumbbells in front of your thighs. Keeping arms mostly straight, raise one or both arms directly in front of you up to shoulder height, then slowly lower. This targets the front of the shoulder." },
          { move:"Rear Delt Raises",   emoji:"🔙", anim:"fly",    sets:3, reps:"15 reps",    rest:"45s", desc:"Bend forward at the hips holding dumbbells hanging down. Raise both arms out to the sides with a slight elbow bend, squeezing the back of your shoulders. Lower slowly." },
          { move:"Plank with Weight",  emoji:"🪵", anim:"plank",  sets:3, reps:"60 seconds", rest:"30s", desc:"Get into a standard forearm plank position. Ask someone to place a weight plate on your back, or hold the position with extra focus on squeezing your core. Hold perfectly still." },
          { move:"Rotation Crunches",  emoji:"🔄", anim:"twist",  sets:3, reps:"12 each",    rest:"45s", desc:"Stand holding a cable or band at chest height. Keeping hips square, rotate your upper body away from the cable pulling it across your body like you are chopping wood. Control the return." },
        ]},
    ],
  },
];

const GOALS = [
  { id:"lose",     label:"Lose Weight",  icon:"🔥", desc:"Calorie deficit focus",    calAdj:-300 },
  { id:"maintain", label:"Stay Fit",     icon:"⚖️", desc:"Balanced maintenance",     calAdj:0    },
  { id:"gain",     label:"Build Muscle", icon:"💪", desc:"Calorie surplus + protein", calAdj:300  },
];

/* ── Spirit Animal System ──────────────────────────────────────────────────
   Each goal maps to a primary spirit animal. Users can also choose freely.
   DiceBear "bottts" style used for programmatic SVG avatars.
────────────────────────────────────────────────────────────────────────── */
const SPIRIT_ANIMALS = [
  { id:"silverback", name:"Silverback",  emoji:"🦍", element:"🌋", trait:"Strength",   color:"#8B5CF6", bg:"rgba(139,92,246,0.15)", goal:"gain",     desc:"Raw power & muscle. Built to dominate the iron." },
  { id:"gazelle",    name:"Gazelle",     emoji:"🦌", element:"🌬️", trait:"Endurance",  color:"#10B981", bg:"rgba(16,185,129,0.15)", goal:"lose",     desc:"Lean, fast & unstoppable. Born to outlast all." },
  { id:"owl",        name:"Wise Owl",    emoji:"🦉", element:"🌙", trait:"Wellness",   color:"#4A9EFF", bg:"rgba(74,158,255,0.15)", goal:"maintain", desc:"Balance, recovery & longevity. The long game." },
  { id:"panther",    name:"Panther",     emoji:"🐆", element:"⚡", trait:"Agility",    color:"#F59E0B", bg:"rgba(245,158,11,0.15)", goal:"lose",     desc:"Explosive speed & precision. Always hunting." },
  { id:"bear",       name:"Bear",        emoji:"🐻", element:"🌲", trait:"Resilience", color:"#EF4444", bg:"rgba(239,68,68,0.15)",  goal:"gain",     desc:"Endure anything. Come back stronger every time." },
  { id:"eagle",      name:"Eagle",       emoji:"🦅", element:"☀️", trait:"Vision",     color:"#E05C2A", bg:"rgba(201,168,76,0.15)", goal:"maintain", desc:"See the bigger picture. Discipline above all." },
  { id:"wolf",       name:"Wolf",        emoji:"🐺", element:"🌕", trait:"Pack",       color:"#6366F1", bg:"rgba(99,102,241,0.15)", goal:"gain",     desc:"Strength through consistency. Run with purpose." },
  { id:"dolphin",    name:"Dolphin",     emoji:"🐬", element:"🌊", trait:"Flow",       color:"#06B6D4", bg:"rgba(6,182,212,0.15)",  goal:"maintain", desc:"Effortless movement & mental clarity." },
];

/* Suggested animal based on goal */
const suggestAnimal = (goalId) => {
  const match = SPIRIT_ANIMALS.find(a => a.goal === goalId);
  return match ? match.id : "eagle";
};

/* DiceBear avatar URL — bottts style, seeded by animal id + user name */
const getDiceBearUrl = (animalId, seed) => {
  const colors = {
    silverback:"8B5CF6", gazelle:"10B981", owl:"4A9EFF",
    panther:"F59E0B",    bear:"EF4444",    eagle:"E05C2A",
    wolf:"6366F1",       dolphin:"06B6D4",
  };
  const color = colors[animalId] || "E05C2A";
  const s = encodeURIComponent((seed||animalId).toLowerCase().replace(/\s+/g,"_"));
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${s}&backgroundColor=${color}&radius=50`;
};

/* Spirit animal avatar component */
const SpiritAvatar = ({ animalId, seed, size=48, ring=true }) => {
  const animal = SPIRIT_ANIMALS.find(a=>a.id===animalId) || SPIRIT_ANIMALS[5];
  const url = getDiceBearUrl(animalId, seed);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0, overflow:"hidden",
      border: ring ? `2px solid ${animal.color}88` : "none",
      boxShadow: ring ? `0 0 12px ${animal.color}44` : "none",
      background: animal.bg,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <img src={url} alt={animal.name} width={size} height={size}
        style={{width:"100%",height:"100%",objectFit:"cover"}}
        onError={e=>{ e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
      />
      <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:size*0.48}}>
        {animal.emoji}
      </div>
    </div>
  );
};

/* ── Adaptive Progress Sprites ─────────────────────────────────────────────
   Small animated icons that change state based on daily progress
────────────────────────────────────────────────────────────────────────── */

/* Hydration Sprite — changes based on water intake */
const HydrationSprite = ({ current, goal }) => {
  const pct = Math.min(current / goal, 1);
  const level = pct === 0 ? "empty" : pct < 0.4 ? "low" : pct < 0.75 ? "mid" : "full";
  const states = {
    empty: { emoji:"💀", color:"#666",    label:"Dehydrated!", pulse:false },
    low:   { emoji:"😰", color:"#F59E0B", label:"Drink up!",   pulse:true  },
    mid:   { emoji:"💧", color:"#4A9EFF", label:"Hydrating",   pulse:false },
    full:  { emoji:"⚡", color:"#10B981", label:"Hydrated!",   pulse:true  },
  };
  const s = states[level];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <span style={{
        fontSize:22, lineHeight:1,
        display:"block",
        animation: s.pulse ? "pulse 1.2s ease-in-out infinite" : "none",
        filter: `drop-shadow(0 0 6px ${s.color}88)`,
      }}>{s.emoji}</span>
      <span style={{fontSize:8,color:s.color,fontWeight:700,letterSpacing:0.5,fontFamily:"'Bebas Neue',sans-serif"}}>{s.label}</span>
    </div>
  );
};

/* Calorie Flame — changes intensity based on net calorie balance */
const CalorieFlamSprite = ({ net, goal }) => {
  const pct = net / goal;
  const level = pct <= 0 ? "crushed" : pct < 0.6 ? "burning" : pct < 0.9 ? "steady" : pct < 1.1 ? "balanced" : "over";
  const states = {
    crushed:  { emoji:"🌟", color:"#10B981", label:"Crushed it!", pulse:true  },
    burning:  { emoji:"🔥", color:"#E05C2A", label:"On fire!",    pulse:true  },
    steady:   { emoji:"✨", color:"#F59E0B", label:"Steady",      pulse:false },
    balanced: { emoji:"⚖️",  color:"#4A9EFF", label:"Balanced",   pulse:false },
    over:     { emoji:"⚠️",  color:"#EF4444", label:"Over goal",  pulse:true  },
  };
  const s = states[level];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <span style={{
        fontSize:22, lineHeight:1,
        animation: s.pulse ? "pulse 1s ease-in-out infinite" : "none",
        filter: `drop-shadow(0 0 6px ${s.color}88)`,
      }}>{s.emoji}</span>
      <span style={{fontSize:8,color:s.color,fontWeight:700,letterSpacing:0.5,fontFamily:"'Bebas Neue',sans-serif"}}>{s.label}</span>
    </div>
  );
};

/* Streak Beast — the streak counter becomes a living creature */
const StreakBeast = ({ days }) => {
  const tier = days === 0 ? 0 : days < 3 ? 1 : days < 7 ? 2 : days < 14 ? 3 : days < 30 ? 4 : 5;
  const beasts = [
    { emoji:"😴", label:"Sleeping",   color:"#666",    title:"Start your streak!" },
    { emoji:"🐣", label:"Hatching",   color:"#F59E0B", title:"Just woke up" },
    { emoji:"🦊", label:"Awakening",  color:"#E05C2A", title:"Getting warmed up" },
    { emoji:"🐺", label:"Unleashed",  color:"#8B5CF6", title:"Week streak unlocked" },
    { emoji:"🦁", label:"Dominant",   color:"#10B981", title:"2-week warrior" },
    { emoji:"🐉", label:"LEGENDARY",  color:"#F59E0B", title:"30-day BEAST MODE" },
  ];
  const b = beasts[tier];
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{
        fontSize:26,
        animation: days > 0 ? "pulse 1.4s ease-in-out infinite" : "none",
        filter: `drop-shadow(0 0 8px ${b.color}99)`,
        display:"block",
      }}>{b.emoji}</span>
      <div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:b.color,letterSpacing:1,lineHeight:1}}>{days} DAY{days!==1?"S":""}</div>
        <div style={{fontSize:9,color:b.color,opacity:0.8,letterSpacing:1,fontWeight:700}}>{b.label.toUpperCase()}</div>
      </div>
    </div>
  );
};

/* XP / Level system */
const calcLevel = (totalCaloriesLogged, streakDays, workoutsTotal) => {
  const xp = totalCaloriesLogged * 0.1 + streakDays * 50 + workoutsTotal * 30;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  return { level: Math.min(level, 99), xp: Math.round(xp), xpInLevel: Math.round(xpInLevel), xpToNext: 500 };
};

const LevelBadge = ({ level, xpInLevel, xpToNext, color }) => (
  <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"6px 10px"}}>
    <div style={{
      width:32, height:32, borderRadius:"50%",
      background:`conic-gradient(${color} ${(xpInLevel/xpToNext)*360}deg, rgba(255,255,255,0.08) 0deg)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative",
    }}>
      <div style={{width:24,height:24,borderRadius:"50%",background:"#0d1320",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color,lineHeight:1}}>{level}</span>
      </div>
    </div>
    <div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color,letterSpacing:1}}>LEVEL {level}</div>
      <div style={{fontSize:8,color:"rgba(240,237,232,0.35)",letterSpacing:0.5}}>{xpInLevel}/{xpToNext} XP</div>
    </div>
  </div>
);

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
  return Math.round(base*(actMap[activity]||1.375)) + ((GOALS.find(g=>g.id===goal)||{calAdj:0}).calAdj||0);
}

const PK    = "jhimfit_profiles_v4";
const SK    = "jhimfit_session";
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
  const [form, setForm] = useState({ name:"", avatar:"🦁", age:"", sex:"male", weight:"", height:"", heightFt:"", heightIn:"", weightUnit:"kg", heightUnit:"cm", activity:"moderate", goal:"maintain" });
  const existing = Object.values(lp());
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const finish = () => {
    const p = { ...form, name:form.name.trim(), id:form.name.trim().toLowerCase().replace(/\s+/g,"_")+"_"+Date.now(), calorieGoal:calcCalGoal(form), createdAt:TODAY };
    const all = lp(); all[p.name] = p; sp(all); onComplete(p);
  };
  const inp = { width:"100%", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, padding:"15px 18px", color:"#f0ede8", outline:"none", fontFamily:"Georgia", boxSizing:"border-box" };

  const steps = [
    <div key="w" style={{textAlign:"center"}}>
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
          <text x="48" y="58" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="46" fill="white" style={{letterSpacing:"-2px"}}>K</text>
          <text x="72" y="30" textAnchor="middle" fontSize="18">🔥</text>
        </svg>
      </div>
      <div style={{fontSize:36,fontWeight:900,letterSpacing:-1.5,marginBottom:8}}>Khim<span style={{color:"#C9A84C"}}>Fit</span></div>
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
    </div>,

    <div key="n">
      <div style={{fontSize:26,fontWeight:900,marginBottom:6}}>What is your name?</div>
      <div style={{fontSize:14,color:"rgba(240,237,232,0.45)",marginBottom:24}}>Personalises your entire experience</div>
      <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name" style={{...inp,fontSize:22,fontWeight:900,marginBottom:26}}/>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:12}}>Choose your avatar</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9,marginBottom:30}}>
        {AVATARS.map(a=><button key={a} onClick={()=>set("avatar",a)} style={{background:form.avatar===a?"rgba(201,168,76,0.3)":"rgba(255,255,255,0.05)",border:"2px solid "+(form.avatar===a?"#C9A84C":"transparent"),borderRadius:13,padding:"11px 0",fontSize:28,cursor:"pointer"}}>{a}</button>)}
      </div>
      <button disabled={!form.name.trim()} onClick={()=>setStep(2)} style={{width:"100%",background:form.name.trim()?"#C9A84C":"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"16px",color:form.name.trim()?"#fff":"rgba(255,255,255,0.25)",fontWeight:800,fontSize:16,cursor:form.name.trim()?"pointer":"default"}}>Continue</button>
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
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7,marginBottom:20}}>
          {SPIRIT_ANIMALS.map(a=>(
            <button key={a.id} onClick={()=>{ set("avatar",a.id); set("spiritAnimal",a.id); }}
              style={{background:form.avatar===a.id?a.bg:"rgba(255,255,255,0.04)",border:"2px solid "+(form.avatar===a.id?a.color:"rgba(255,255,255,0.08)"),borderRadius:11,padding:"8px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.2s"}}>
              <SpiritAvatar animalId={a.id} seed={a.id} size={34} ring={false}/>
              <span style={{fontSize:8,color:form.avatar===a.id?a.color:"rgba(240,237,232,0.4)",fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:0.3}}>{a.name}</span>
            </button>
          ))}
        </div>
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

export default function JhimFitness() {
  const isMobile = useIsMobile();
  useEffect(()=>injectStyles(),[]);

  // Hide splash screen once app mounts
  useEffect(() => {
    if (window.__hideSplash) window.__hideSplash();
  }, []);

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
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // PWA install prompt
  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    window.addEventListener("appinstalled", () => { setIsInstalled(true); setShowInstallBanner(false); });
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") { setIsInstalled(true); setShowInstallBanner(false); toast_("JhimFit installed! Ready to go","#1a6e5a"); }
    setInstallPrompt(null);
  };


  // Save active profile + tab to localStorage whenever they change
  useEffect(() => {
    if (profile) ssess({ profileName: profile.name, tab });
  }, [profile&&profile.name, tab]);

  useEffect(() => {
    if (!profile) return;
    const s = ld(profile.id);
    setData({ log:s.log||{}, workoutLog:s.workoutLog||{}, water:s.water||{}, weightLog:s.weightLog||{} });
    setWRec(s.workoutRecords||{});
    setCS(s.completedSets||{});
  }, [profile&&profile.id]);

  useEffect(() => {
    if (!profile) return;
    sd(profile.id, {...ld(profile.id), ...data, workoutRecords, completedSets});
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

  // ── Context-aware quick actions per tab ──────────────────────────────────
  const CTX_ACTIONS = {
    home: [
      { label:"Log Water",      icon:"💧", action:()=>{ addWater(); toast_("💧 Water logged!","#4a9eff"); } },
      { label:"Today's Stats",  icon:"📈", action:()=>setTab("stats") },
      { label:"Quick Workout",  icon:"⚡", action:()=>setTab("workout") },
    ],
    diet: [
      { label:"Log a Meal",     icon:"➕", action:()=>{ setTab("diet"); } },
      { label:"Nutrition Summary", icon:"🥗", action:()=>setTab("stats") },
      { label:"Add Water",      icon:"💧", action:()=>{ addWater(); toast_("💧 Water logged!","#4a9eff"); } },
    ],
    workout: openSession ? [
      { label: timerRunning ? "Pause Timer" : "Resume Timer", icon: timerRunning ? "⏸" : "▶", action:()=>setTimerRun(r=>!r) },
      { label:"Reset Timer",    icon:"↺",  action:()=>{ setTimerSecs(0); setTimerRun(false); } },
      { label:"Back to Plan",   icon:"◀",  action:()=>setOpenSess(null) },
    ] : [
      { label:"Lose Weight Plan", icon:"🔥", action:()=>{ setWTab("lose"); setTab("workout"); } },
      { label:"Build Muscle Plan",icon:"💪", action:()=>{ setWTab("gain"); setTab("workout"); } },
      { label:"Quick Log",        icon:"⚡", action:()=>{ setWTab("log"); setTab("workout"); } },
    ],
    stats: [
      { label:"This Week",      icon:"📅", action:()=>setTab("stats") },
      { label:"Log Weight",     icon:"⚖️", action:()=>setTab("home") },
      { label:"View Diet",      icon:"🍽", action:()=>setTab("diet") },
    ],
    contact: [
      { label:"Call Now",       icon:"📞", action:()=>window.open("tel:+233531113498") },
      { label:"Send Email",     icon:"✉️", action:()=>window.open("mailto:joachimnaakureh07@gmail.com") },
      { label:"WhatsApp",       icon:"💬", action:()=>window.open("https://wa.me/233531113498") },
    ],
    help: [
      { label:"How to Log Meals",  icon:"🍽", action:()=>setTab("diet") },
      { label:"Start a Workout",   icon:"🏋", action:()=>setTab("workout") },
      { label:"View Progress",     icon:"📊", action:()=>setTab("stats") },
    ],
  };
  const ctxActions = CTX_ACTIONS[tab] || [];

  const Sidebar = () => (
    <div style={{width:260,flexShrink:0,background:"#0a0f1e",borderRight:"none",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:"28px 24px 20px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(240,237,232,0.35)",textTransform:"uppercase",marginBottom:4}}>Fitness and Nutrition</div>
        <div style={{fontSize:28,fontWeight:900,letterSpacing:-1}}>Jhim<span style={{color:"#C9A84C"}}>Fit</span></div>
      </div>
      <button onClick={()=>setShowEdit(true)} style={{margin:"0 14px",background:"rgba(201,168,76,0.1)",borderLeft:"3px solid #C9A84C",borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,color:"#f0ede8",marginBottom:10}}>
        <SpiritAvatar animalId={profile.spiritAnimal||profile.avatar||"eagle"} seed={profile.name} size={40} ring={true}/>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.name}</div><div style={{fontSize:11,color:"#C9A84C",marginTop:2}}>{calGoal} kcal goal</div></div>
        <span style={{fontSize:12,color:"rgba(240,237,232,0.3)"}}>edit</span>
      </button>
      {others.length>0 && <button onClick={()=>setShowSw(true)} style={{margin:"0 14px 20px",background:"rgba(255,255,255,0.0)",border:"none",borderRadius:12,padding:"9px 14px",cursor:"pointer",color:"rgba(240,237,232,0.5)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:8}}>Switch Profile ({others.length})</button>}
      <nav style={{flex:1,padding:"0 14px"}}>
        {navItems.map(t=>(
          <div key={t.id}>
            <button onClick={()=>setTab(t.id)} style={{width:"100%",background:tab===t.id?"rgba(201,168,76,0.15)":"transparent",border:"1px solid "+(tab===t.id?"rgba(201,168,76,0.4)":"transparent"),borderRadius:13,padding:"13px 16px",marginBottom:tab===t.id?4:6,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:tab===t.id?"#C9A84C":"rgba(240,237,232,0.55)",fontSize:15,textAlign:"left",fontWeight:tab===t.id?700:400,transition:"all 0.2s"}}>
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
        <button onClick={goToWelcome} style={{width:"100%",background:"rgba(255,255,255,0.0)",border:"none",borderRadius:11,padding:"10px 14px",cursor:"pointer",color:"rgba(240,237,232,0.4)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span>🏠</span> Welcome Screen
        </button>
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
      <div style={{background:"rgba(10,15,30,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"grid",gridTemplateColumns:"repeat(5,1fr)"}}>
        {navItems.filter(t=>t.id!=="help").map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
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
      return (
        <div>
          {drillEx && <ExerciseDrillModal exercise={drillEx} onClose={closeDrill}/>}

          {/* ── Sticky Live Timer Bar ── */}
          <div style={{
            position:"sticky", top:0, zIndex:100,
            background:"linear-gradient(135deg,#0d1320,#090d16)",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:16, padding:"12px 18px", marginBottom:16,
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
            boxShadow:"0 4px 24px rgba(0,0,0,0.5)",
          }}>
            {/* Elapsed time */}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{
                width:40, height:40, borderRadius:12,
                background: timerRunning ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)",
                border:`1px solid ${timerRunning ? "#C9A84C88" : "rgba(255,255,255,0.1)"}`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
                animation: timerRunning ? "pulse 2s ease-in-out infinite" : "none",
              }}>⏱</div>
              <div>
                <div style={{fontFamily:SPORT_FONT,fontSize:26,letterSpacing:2,color:timerRunning?"#C9A84C":"rgba(240,237,232,0.5)",lineHeight:1}}>
                  {fmtTime(timerSecs)}
                </div>
                <div style={{fontSize:9,color:"rgba(240,237,232,0.3)",letterSpacing:1,marginTop:2}}>
                  {timerRunning ? "SESSION RUNNING" : "PAUSED"}
                </div>
              </div>
            </div>

            {/* Rest countdown (shown when active) */}
            {restRunning && (
              <div style={{
                background:"rgba(74,158,255,0.15)", border:"1px solid rgba(74,158,255,0.4)",
                borderRadius:12, padding:"8px 14px", textAlign:"center", animation:"pulse 1s ease-in-out infinite",
              }}>
                <div style={{fontFamily:SPORT_FONT,fontSize:22,color:"#4a9eff",letterSpacing:1,lineHeight:1}}>{fmtTime(restSecs)}</div>
                <div style={{fontSize:9,color:"#4a9eff",letterSpacing:1,marginTop:2}}>REST</div>
              </div>
            )}

            {/* Controls */}
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={()=>setTimerRun(r=>!r)} style={{
                background: timerRunning ? "rgba(201,168,76,0.2)" : "rgba(16,185,129,0.2)",
                border:`1px solid ${timerRunning ? "#C9A84C66" : "#10B98166"}`,
                borderRadius:10, padding:"8px 14px", cursor:"pointer",
                fontFamily:SPORT_FONT, fontSize:12, letterSpacing:1,
                color: timerRunning ? "#C9A84C" : "#10B981",
              }}>
                {timerRunning ? "⏸ PAUSE" : "▶ START"}
              </button>
              <button onClick={()=>{setTimerSecs(0); setTimerRun(false); setRestSecs(0); setRestRun(false);}} style={{
                background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:10, padding:"8px 10px", cursor:"pointer", fontSize:13, color:"rgba(240,237,232,0.4)",
              }}>↺</button>
            </div>
          </div>
          <button onClick={()=>setOpenSess(null)} style={{background:"rgba(201,168,76,0.1)",border:"none",borderLeft:"3px solid #C9A84C",borderRadius:10,color:"#C9A84C",cursor:"pointer",fontSize:14,padding:"10px 18px",marginBottom:18,display:"inline-flex",alignItems:"center",gap:8,fontWeight:700,fontFamily:"Georgia"}}>&#8592; Back to {plan.title}</button>
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
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:SPORT_FONT,fontSize:13,letterSpacing:2,color:"rgba(240,237,232,0.35)",marginBottom:12}}>EXERCISES — WATCH & FOLLOW</div>
            {sess.exercises.map((ex,ei)=>{
              const allDone = Array.from({length:ex.sets}).every((_,si)=>completedSets[plan.id+"-"+openSession.idx+"-"+ei+"-"+si]);
              const ac = allDone ? "#1a6e5a" : plan.color;
              return (
                <div key={ei} style={{background:allDone?"rgba(26,122,74,0.07)":"rgba(255,255,255,0.03)",borderLeft:"3px solid "+ac,borderRadius:18,marginBottom:16,overflow:"hidden",opacity:allDone?0.5:1,transition:"all 0.4s"}}>

                  {/* ── Exercise header row ── */}
                  <div style={{padding:"14px 16px 0 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                      <div style={{fontFamily:SPORT_FONT,fontSize:20,letterSpacing:1,color:allDone?"rgba(240,237,232,0.4)":"#f0ede8",textDecoration:allDone?"line-through":"none",lineHeight:1.2}}>{ex.move}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center"}}>
                      <span style={{background:ac+"33",border:"1px solid "+ac+"55",borderRadius:20,padding:"3px 10px",fontSize:11,color:ac,fontWeight:700,fontFamily:SPORT_FONT,letterSpacing:0.5}}>{ex.sets}×{ex.reps}</span>
                      {ex.rest!=="--"&&<span style={{background:"rgba(255,255,255,0.06)",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(240,237,232,0.5)"}}>⏱ {ex.rest}</span>}
                      {allDone&&<span style={{fontSize:18}}>✅</span>}
                    </div>
                  </div>

                  {/* ── Description + Watch Drill + tick buttons ── */}
                  <div style={{padding:"10px 16px 14px"}}>
                    <div style={{fontSize:12,color:"rgba(240,237,232,0.5)",lineHeight:1.75,marginBottom:10}}>{ex.desc||""}</div>
                    {/* Watch Drill button */}
                    <button onClick={()=>openDrill(ex)} style={{
                      display:"flex", alignItems:"center", gap:7,
                      background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10, padding:"7px 14px", cursor:"pointer",
                      marginBottom:12, transition:"all 0.2s",
                    }}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.18)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.5)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}>
                      <span style={{fontSize:15}}>▶️</span>
                      <span style={{fontFamily:SPORT_FONT,fontSize:12,letterSpacing:1,color:"#f0ede8"}}>WATCH DRILL</span>
                      {!EXERCISE_VIDEOS[ex.move] && <span style={{fontSize:9,color:"rgba(240,237,232,0.3)"}}>· coming soon</span>}
                    </button>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      <span style={{fontSize:11,color:"rgba(240,237,232,0.3)",letterSpacing:0.5,marginRight:2}}>SETS DONE:</span>
                      {Array.from({length:ex.sets}).map((_,si)=>{
                        const key=plan.id+"-"+openSession.idx+"-"+ei+"-"+si;
                        return (
                          <button key={si} onClick={()=>toggleSet(key, ex.rest)}
                            style={{width:36,height:36,borderRadius:10,
                              background:completedSets[key]?ac:"rgba(255,255,255,0.07)",
                              border:"none",
                              cursor:"pointer",fontSize:completedSets[key]?16:14,color:"#fff",fontWeight:900,
                              transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)",
                              transform:completedSets[key]?"scale(1.1)":"scale(1)",
                              fontFamily:SPORT_FONT}}>
                            {completedSets[key]?"✓":si+1}
                          </button>
                        );
                      })}
                      {allDone&&<span style={{fontSize:12,color:"#4db89a",fontWeight:700,marginLeft:4}}>Complete! 🎯</span>}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
          <div style={{background:"rgba(255,255,255,0.0)",border:"none",borderRadius:14,padding:"14px 18px",marginBottom:16}}>
            <div style={{fontSize:10,letterSpacing:2,color:"rgba(240,237,232,0.4)",textTransform:"uppercase",marginBottom:5}}>Cool-down</div>
            <div style={{fontSize:13,color:"rgba(240,237,232,0.75)",marginBottom:12}}>{sess.cooldown}</div>
            <div style={{background:plan.color+"15",border:"1px solid "+plan.color+"33",borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontSize:10,letterSpacing:2,color:plan.color,textTransform:"uppercase",marginBottom:4}}>Pro Tip</div>
              <div style={{fontSize:13,color:"rgba(240,237,232,0.7)",lineHeight:1.6}}>{sess.tip}</div>
            </div>
          </div>
          {/* Session summary before log */}
          {!alreadyLogged && timerSecs > 0 && (
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"12px 18px",marginBottom:12,display:"flex",justifyContent:"space-around"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:SPORT_FONT,fontSize:20,color:"#C9A84C",letterSpacing:1}}>{fmtTime(timerSecs)}</div>
                <div style={{fontSize:9,color:"rgba(240,237,232,0.35)",letterSpacing:1,marginTop:2}}>TIME ELAPSED</div>
              </div>
              <div style={{width:1,background:"rgba(255,255,255,0.07)"}}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:SPORT_FONT,fontSize:20,color:"#10B981",letterSpacing:1}}>~{sess.calories}</div>
                <div style={{fontSize:9,color:"rgba(240,237,232,0.35)",letterSpacing:1,marginTop:2}}>KCAL BURNED</div>
              </div>
              <div style={{width:1,background:"rgba(255,255,255,0.07)"}}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:SPORT_FONT,fontSize:20,color:"#4a9eff",letterSpacing:1}}>{sess.exercises.length}</div>
                <div style={{fontSize:9,color:"rgba(240,237,232,0.35)",letterSpacing:1,marginTop:2}}>EXERCISES</div>
              </div>
            </div>
          )}
          <button onClick={()=>{ if(!alreadyLogged){ setTimerRun(false); logPlanSession(plan,sess); }}} disabled={alreadyLogged}
            style={{width:"100%",background:alreadyLogged?"rgba(255,255,255,0.06)":plan.color,border:"none",borderRadius:16,padding:"16px",color:alreadyLogged?"rgba(240,237,232,0.3)":"#fff",fontWeight:900,fontSize:16,cursor:alreadyLogged?"default":"pointer",marginBottom:16}}>
            {alreadyLogged?"✅ Session Already Logged Today":plan.icon+" Log This Session (+"+sess.calories+" kcal burned)"}
          </button>
        </div>
      );
    }

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
            <text x="48" y="58" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="46" fill="white">K</text>
            <text x="72" y="30" textAnchor="middle" fontSize="18">🔥</text>
          </svg>
        </div>
        <div style={{fontSize:20,fontWeight:900,marginBottom:6}}>Joachim Naakureh</div>
        <div style={{fontSize:13,color:"rgba(240,237,232,0.5)",marginBottom:4}}>Developer and Founder - JhimFit</div>
        <div style={{fontSize:12,color:"rgba(240,237,232,0.35)"}}>Based in Accra, Ghana</div>
      </div>
      {[
        { icon:"📱", label:"Phone / WhatsApp", value:"+233 53 111 3498",  href:"tel:+233531113498",                        color:"#1a6e5a" },
        { icon:"📱", label:"Phone / WhatsApp", value:"+233 55 198 5225",  href:"tel:+233551985225",                        color:"#1a6e5a" },
        { icon:"✉️", label:"Email",            value:"joachimnaakureh07@gmail.com", href:"mailto:joachimnaakureh07@gmail.com", color:"#C9A84C" },
      ].map((c,i)=>(
        <a key={i} href={c.href} style={{display:"flex",alignItems:"center",gap:18,background:"rgba(255,255,255,0.0)",border:"none",borderRadius:18,padding:"18px 20px",marginBottom:12,textDecoration:"none",color:"#f0ede8",transition:"all 0.2s"}}>
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
              <button key={p.id} onClick={()=>{setProfile(p);setShowSw(false);setTab("home");toast_("Welcome back, "+p.name+"! "+p.avatar);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"none",borderRadius:14,padding:"14px 18px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:"#f0ede8",textAlign:"left"}}>
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
        <div style={{position:"fixed",top:0,left:0,right:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(20px)",borderBottom:"none",padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setShowEdit(true)} style={{background:"transparent",border:"none",borderRadius:12,width:44,height:44,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:2}}>
              <SpiritAvatar animalId={profile.spiritAnimal||"eagle"} seed={profile.name} size={40} ring={true}/></button>
            <div><div style={{fontSize:10,color:"rgba(240,237,232,0.4)",letterSpacing:2,textTransform:"uppercase",lineHeight:1}}>Welcome back</div><div style={{fontSize:17,fontWeight:900,letterSpacing:-0.5}}>{profile.name}</div></div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"rgba(240,237,232,0.3)",letterSpacing:2}}>GOAL</div><div style={{fontSize:14,fontWeight:900,color:"#C9A84C"}}>{calGoal} kcal</div></div>
            {others.length>0&&<button onClick={()=>setShowSw(true)} style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:11,color:"rgba(240,237,232,0.5)"}}>Switch</button>}
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
