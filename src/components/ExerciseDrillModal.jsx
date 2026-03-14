import React from "react";
import { createPortal } from "react-dom";

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

export { EXERCISE_VIDEOS };
export default ExerciseDrillModal;
