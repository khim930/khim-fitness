export const injectGlobalStyles = () => {
  if (document.getElementById("jhimfit-styles")) return;

  const el = document.createElement("style");
  el.id = "jhimfit-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button { -webkit-appearance: none; }
    input[type=number] { -moz-appearance: textfield; }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

    a:hover { opacity: 0.85; }
    button:hover { opacity: 0.88; }

    @keyframes dropFill  { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
    @keyframes pulse     { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes slideUp   { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes streakPop { 0% { transform: scale(1); } 40% { transform: scale(1.3); } 100% { transform: scale(1); } }
    @keyframes spin      { to { transform: rotate(360deg); } }

    @keyframes ex-pulse  { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
    @keyframes ex-bounce { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-18px); } 60% { transform: translateY(-8px); } }
    @keyframes ex-arms-star { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(60deg); } }
    @keyframes ex-legs-star { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(30deg); } }
    @keyframes ex-squat  { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(12px) scaleY(0.8); } }
    @keyframes ex-pushup { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
    @keyframes ex-run    { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
    @keyframes ex-lunge  { 0%, 100% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(10px) scaleY(0.85); } }
    @keyframes ex-plank  { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.04); } }
    @keyframes ex-crunch { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
    @keyframes ex-bridge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes ex-raise  { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-70deg); } }
    @keyframes ex-curl   { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-80deg); } }
    @keyframes ex-press  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
    @keyframes ex-fly    { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(40deg); } }
    @keyframes ex-row    { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-10px); } }
    @keyframes ex-swing  { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
    @keyframes ex-dip    { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(12px); } }
    @keyframes splashLoad { 0% { width: 0%; } 60% { width: 70%; } 100% { width: 100%; } }
  `;
  document.head.appendChild(el);
};

// Shared input style used across forms
export const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  border: "none",
  borderRadius: 14,
  padding: "15px 18px",
  color: "#f0ede8",
  outline: "none",
  fontFamily: "Georgia",
  boxSizing: "border-box",
};
