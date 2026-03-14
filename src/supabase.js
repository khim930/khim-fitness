import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || "https://dpyyivxehgpjecmckjeu.supabase.co";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweXlpdnhlaGdwamVjbWNramV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NjM4MTcsImV4cCI6MjA4OTAzOTgxN30.aFCsR5HxDBaD4h3qTT0f_gMsdAQ_u_b4OCPRqNCJitU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const signUp = (email, password) =>
  supabase.auth.signUp({ email, password });

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const getUser = () => supabase.auth.getUser();

// ── Profile helpers ───────────────────────────────────────────────────────────
export const saveProfile = async (userId, profileData) => {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    name:         profileData.name,
    avatar:       profileData.avatar,
    age:          parseInt(profileData.age) || null,
    sex:          profileData.sex,
    weight_kg:    parseFloat(profileData.weight) || null,
    height_cm:    parseFloat(profileData.height) || null,
    activity:     profileData.activity,
    goal:         profileData.goal,
    spirit_animal: profileData.spiritAnimal || profileData.avatar,
  });
  return error;
};

export const loadProfile = async (userId) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return { data, error };
};

// ── Food log helpers ──────────────────────────────────────────────────────────
export const logFood = async (userId, date, meal) => {
  const { error } = await supabase.from("food_logs").insert({
    user_id:   userId,
    date,
    meal_name: meal.name,
    kcal:      meal.kcal,
    protein:   meal.protein || 0,
    carbs:     meal.carbs   || 0,
    fat:       meal.fat     || 0,
  });
  return error;
};

export const loadFoodLogs = async (userId, date) => {
  const { data, error } = await supabase.from("food_logs")
    .select("*").eq("user_id", userId).eq("date", date).order("logged_at");
  return { data: data || [], error };
};

export const deleteFoodLog = async (id) => {
  const { error } = await supabase.from("food_logs").delete().eq("id", id);
  return error;
};

// ── Workout log helpers ───────────────────────────────────────────────────────
export const logWorkout = async (userId, date, workout) => {
  const { error } = await supabase.from("workout_logs").insert({
    user_id:      userId,
    date,
    plan:         workout.plan,
    duration_secs: workout.durationSecs || 0,
    kcal_burned:  workout.kcalBurned || 0,
    exercises:    workout.exercises || [],
  });
  return error;
};

export const loadWorkoutLogs = async (userId, date) => {
  const { data, error } = await supabase.from("workout_logs")
    .select("*").eq("user_id", userId).eq("date", date);
  return { data: data || [], error };
};

// ── Weight log helpers ────────────────────────────────────────────────────────
export const logWeight = async (userId, date, weightKg) => {
  const { error } = await supabase.from("weight_logs").upsert({
    user_id:   userId,
    date,
    weight_kg: weightKg,
  }, { onConflict: "user_id,date" });
  return error;
};

export const loadWeightLogs = async (userId) => {
  const { data, error } = await supabase.from("weight_logs")
    .select("*").eq("user_id", userId).order("date");
  return { data: data || [], error };
};

// ── Water log helpers ─────────────────────────────────────────────────────────
export const logWater = async (userId, date, glasses) => {
  const { error } = await supabase.from("water_logs").upsert({
    user_id: userId,
    date,
    glasses,
  }, { onConflict: "user_id,date" });
  return error;
};

export const loadWaterLog = async (userId, date) => {
  const { data, error } = await supabase.from("water_logs")
    .select("*").eq("user_id", userId).eq("date", date).single();
  return { data, error };
};
