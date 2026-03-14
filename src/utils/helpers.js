import { STORAGE_KEYS, GOALS } from "../data/constants";

export const fmt = (d) => d.toISOString().split("T")[0];
export const TODAY = fmt(new Date());

export function fmtTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function calcCalGoal(profile) {
  const { weight, height, age, sex, activity, goal } = profile;
  if (!weight || !height || !age) return 2000;
  const base =
    sex === "female"
      ? 10 * +weight + 6.25 * +height - 5 * +age - 161
      : 10 * +weight + 6.25 * +height - 5 * +age + 5;
  const actMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const adj = (GOALS.find((g) => g.id === goal) || { calAdj: 0 }).calAdj;
  return Math.round(base * (actMap[activity] || 1.375)) + adj;
}

export function calcLevel(totalCaloriesLogged, streakDays, workoutsTotal) {
  const xp = totalCaloriesLogged * 0.1 + streakDays * 50 + workoutsTotal * 30;
  const level = Math.floor(xp / 500) + 1;
  return {
    level: Math.min(level, 99),
    xp: Math.round(xp),
    xpInLevel: Math.round(xp % 500),
    xpToNext: 500,
  };
}

// ── Local storage helpers ──────────────────────────────────────────────────
export const getProfiles  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || "{}"); } catch { return {}; } };
export const setProfiles  = (v) => localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(v));
export const getUserData  = (uid) => { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA + uid) || "{}"); } catch { return {}; } };
export const setUserData  = (uid, v) => localStorage.setItem(STORAGE_KEYS.USER_DATA + uid, JSON.stringify(v));
export const getSession   = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || "{}"); } catch { return {}; } };
export const setSession   = (v) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(v));

// ── Suggest spirit animal based on goal ──────────────────────────────────
import { SPIRIT_ANIMALS } from "../data/constants";
export const suggestAnimal = (goalId) => {
  const match = SPIRIT_ANIMALS.find((a) => a.goal === goalId);
  return match ? match.id : "eagle";
};

// ── Parse rest duration string e.g. "30s", "60s", "90s" → seconds ────────
export const parseRestSecs = (restStr) => {
  if (!restStr) return 0;
  const n = parseInt(restStr);
  return isNaN(n) ? 0 : n;
};
