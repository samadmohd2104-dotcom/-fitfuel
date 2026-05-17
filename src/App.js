import React, { useState, useEffect, useRef } from 'react';

// ─── INITIAL DATA ────────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { username: "Samad", password: "Samadmohd21" };

const FOOD_DATABASE = [
  // Proteins
  { id: 1, name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein", emoji: "🍗" },
  { id: 2, name: "Eggs (2 whole)", calories: 143, protein: 13, carbs: 1, fat: 10, category: "protein", emoji: "🥚" },
  { id: 3, name: "Tuna Can (150g)", calories: 159, protein: 35, carbs: 0, fat: 1.5, category: "protein", emoji: "🐟" },
  { id: 4, name: "Paneer (100g)", calories: 265, protein: 18, carbs: 3, fat: 20, category: "protein", emoji: "🧀" },
  { id: 5, name: "Whey Protein Shake", calories: 120, protein: 24, carbs: 3, fat: 2, category: "protein", emoji: "🥛" },
  { id: 6, name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13, category: "protein", emoji: "🐠" },
  { id: 7, name: "Greek Yogurt (200g)", calories: 130, protein: 17, carbs: 6, fat: 4, category: "protein", emoji: "🥣" },
  { id: 8, name: "Tofu (100g)", calories: 76, protein: 8, carbs: 2, fat: 4, category: "protein", emoji: "⬜" },
  // Carbs
  { id: 9, name: "Brown Rice (1 cup)", calories: 215, protein: 5, carbs: 45, fat: 1.8, category: "carbs", emoji: "🍚" },
  { id: 10, name: "Oats (100g)", calories: 389, protein: 17, carbs: 66, fat: 7, category: "carbs", emoji: "🌾" },
  { id: 11, name: "Sweet Potato (150g)", calories: 129, protein: 3, carbs: 30, fat: 0.1, category: "carbs", emoji: "🍠" },
  { id: 12, name: "Banana (1 medium)", calories: 89, protein: 1, carbs: 23, fat: 0.3, category: "carbs", emoji: "🍌" },
  { id: 13, name: "Whole Wheat Bread (2 slices)", calories: 180, protein: 8, carbs: 36, fat: 2, category: "carbs", emoji: "🍞" },
  { id: 14, name: "Quinoa (100g cooked)", calories: 120, protein: 4, carbs: 21, fat: 2, category: "carbs", emoji: "🌿" },
  // Fats
  { id: 15, name: "Almonds (30g)", calories: 173, protein: 6, carbs: 6, fat: 15, category: "fat", emoji: "🌰" },
  { id: 16, name: "Peanut Butter (2 tbsp)", calories: 188, protein: 8, carbs: 6, fat: 16, category: "fat", emoji: "🥜" },
  { id: 17, name: "Avocado (half)", calories: 120, protein: 1.5, carbs: 6, fat: 11, category: "fat", emoji: "🥑" },
  { id: 18, name: "Olive Oil (1 tbsp)", calories: 119, protein: 0, carbs: 0, fat: 13.5, category: "fat", emoji: "🫒" },
  // Veggies
  { id: 19, name: "Broccoli (100g)", calories: 35, protein: 2.8, carbs: 7, fat: 0.4, category: "veggies", emoji: "🥦" },
  { id: 20, name: "Spinach (100g)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: "veggies", emoji: "🥬" },
  { id: 21, name: "Mixed Salad (150g)", calories: 25, protein: 2, carbs: 4, fat: 0.3, category: "veggies", emoji: "🥗" },
];

const MEAL_PLANS = {
  "Weight Gain": {
    "Breakfast": [1, 2, 10, 12, 5],
    "Lunch": [1, 9, 19, 17, 15],
    "Snack": [16, 7, 14],
    "Dinner": [6, 11, 20, 18],
  },
  "Weight Loss": {
    "Breakfast": [2, 20, 7, 12],
    "Lunch": [3, 21, 11, 19],
    "Snack": [15, 7],
    "Dinner": [8, 9, 20, 19],
  },
};

const DEMO_USERS = [
  {
    id: "u1", name: "Rahul Sharma", email: "rahul@example.com", password: "user123",
    height: 175, weight: 72, goalWeight: 85, goal: "Weight Gain", age: 24,
    joined: "2026-05-01", active: true,
    log: [
      { date: "2026-05-15", foods: [1, 2, 9], totalCal: 523, totalProt: 47, totalCarbs: 45, totalFat: 14 },
      { date: "2026-05-16", foods: [2, 10, 6, 19], totalCal: 655, totalProt: 40, totalCarbs: 73, totalFat: 21 },
    ],
    adminMessage: "Great progress Rahul! Keep hitting those protein targets 💪",
  },
  {
    id: "u2", name: "Priya Patel", email: "priya@example.com", password: "user456",
    height: 162, weight: 68, goalWeight: 58, goal: "Weight Loss", age: 28,
    joined: "2026-05-05", active: true,
    log: [
      { date: "2026-05-16", foods: [2, 21, 7, 19], totalCal: 301, totalProt: 33, totalCarbs: 21, totalFat: 18 },
    ],
    adminMessage: "",
  },
];

// ─── HELPER ──────────────────────────────────────────────────────────────────
function calcMacros(foodIds) {
  return foodIds.reduce((acc, id) => {
    const f = FOOD_DATABASE.find(x => x.id === id);
    if (!f) return acc;
    return { cal: acc.cal + f.calories, prot: acc.prot + f.protein, carbs: acc.carbs + f.carbs, fat: acc.fat + f.fat };
  }, { cal: 0, prot: 0, carbs: 0, fat: 0 });
}

function todayStr() { return new Date().toISOString().split("T")[0]; }

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --neon: #00FFB2;
    --neon2: #FF3CAC;
    --neon3: #7B2FFF;
    --dark: #080C14;
    --dark2: #0D1421;
    --dark3: #131B2C;
    --card: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --text: #E8F4FF;
    --muted: rgba(232,244,255,0.45);
    --radius: 18px;
    --glow: 0 0 40px rgba(0,255,178,0.15);
  }

  body { font-family: 'Outfit', sans-serif; background: var(--dark); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  .app { min-height: 100vh; position: relative; }

  /* BG */
  .bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,255,178,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,178,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .bg-orb1 {
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(123,47,255,0.12), transparent 70%);
    top: -200px; right: -200px; pointer-events: none; z-index: 0;
    animation: drift 8s ease-in-out infinite alternate;
  }
  .bg-orb2 {
    position: fixed; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,178,0.08), transparent 70%);
    bottom: -100px; left: -150px; pointer-events: none; z-index: 0;
    animation: drift 10s ease-in-out infinite alternate-reverse;
  }
  @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,20px) scale(1.05); } }

  .content { position: relative; z-index: 1; }

  /* NAV */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px; background: rgba(8,12,20,0.85);
    backdrop-filter: blur(20px); border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px;
    background: linear-gradient(135deg, var(--neon), var(--neon3)); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text; }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-user { font-size: 13px; color: var(--muted); }
  .nav-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .badge-admin { background: linear-gradient(135deg, var(--neon2), var(--neon3)); color: white; }
  .badge-user { background: linear-gradient(135deg, var(--neon), #00B8FF); color: #000; }

  /* BACK BTN */
  .back-btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;
    background: var(--card); border: 1px solid var(--border); border-radius: 30px;
    color: var(--muted); font-size: 13px; cursor: pointer; transition: all 0.2s;
    font-family: 'Outfit', sans-serif; margin: 20px 24px 0;
  }
  .back-btn:hover { background: rgba(0,255,178,0.1); border-color: var(--neon); color: var(--neon); }

  /* BUTTONS */
  .btn {
    padding: 12px 28px; border-radius: 12px; font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    border: none; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--neon), #00B8FF);
    color: #000; box-shadow: 0 4px 24px rgba(0,255,178,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,255,178,0.45); }
  .btn-danger { background: linear-gradient(135deg, #FF3CAC, #FF6B35); color: white; }
  .btn-danger:hover { transform: translateY(-2px); }
  .btn-ghost { background: var(--card); border: 1px solid var(--border); color: var(--text); }
  .btn-ghost:hover { border-color: var(--neon); color: var(--neon); background: rgba(0,255,178,0.05); }
  .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 8px; }
  .btn-full { width: 100%; justify-content: center; }

  /* CARD */
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 24px; backdrop-filter: blur(10px);
    transition: all 0.3s;
  }
  .card:hover { border-color: rgba(0,255,178,0.2); box-shadow: var(--glow); }
  .card-glow { border-color: rgba(0,255,178,0.3); box-shadow: var(--glow); }

  /* INPUT */
  .input-group { display: flex; flex-direction: column; gap: 6px; }
  .input-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
  .input {
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px; color: var(--text);
    font-family: 'Outfit', sans-serif; font-size: 15px; outline: none;
    transition: all 0.2s; width: 100%;
  }
  .input:focus { border-color: var(--neon); box-shadow: 0 0 0 3px rgba(0,255,178,0.1); }
  .input option { background: var(--dark2); }
  select.input { cursor: pointer; }

  /* MACRO RING */
  .macro-ring-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .macro-ring { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
  .macro-ring svg { transform: rotate(-90deg); }
  .macro-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .macro-ring-val { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--neon); line-height: 1; }
  .macro-ring-label { font-size: 10px; color: var(--muted); font-weight: 600; letter-spacing: 0.5px; }

  /* MACRO BARS */
  .macro-bars { flex: 1; display: flex; flex-direction: column; gap: 12px; }
  .macro-bar-row { display: flex; flex-direction: column; gap: 4px; }
  .macro-bar-info { display: flex; justify-content: space-between; align-items: center; }
  .macro-bar-name { font-size: 12px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .macro-bar-val { font-size: 14px; font-weight: 700; }
  .macro-bar-track { height: 8px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
  .macro-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1); }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

  /* STAT CARD */
  .stat-card { display: flex; flex-direction: column; gap: 4px; }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
  .stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 36px; line-height: 1; }
  .stat-unit { font-size: 13px; color: var(--muted); font-weight: 500; }

  /* FOOD ITEM */
  .food-item {
    display: flex; align-items: center; gap: 12px; padding: 12px 16px;
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    border-radius: 12px; cursor: pointer; transition: all 0.2s;
  }
  .food-item:hover { background: rgba(0,255,178,0.06); border-color: rgba(0,255,178,0.3); transform: translateX(4px); }
  .food-item.selected { background: rgba(0,255,178,0.1); border-color: var(--neon); }
  .food-emoji { font-size: 24px; flex-shrink: 0; }
  .food-info { flex: 1; }
  .food-name { font-size: 14px; font-weight: 600; }
  .food-macros { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .food-cal { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: var(--neon); }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; }
  .tab { flex: 1; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; color: var(--muted); background: transparent; border: none; font-family: 'Outfit', sans-serif;
    text-align: center; }
  .tab.active { background: linear-gradient(135deg, var(--neon), #00B8FF); color: #000; }

  /* PROGRESS BAR */
  .progress-wrap { height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--neon), #00B8FF); }

  /* LOGIN */
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .login-box { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 24px; }
  .login-title { font-family: 'Bebas Neue', sans-serif; font-size: 60px; letter-spacing: 4px; line-height: 1;
    background: linear-gradient(135deg, var(--neon), var(--neon3)); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text; }
  .login-sub { color: var(--muted); font-size: 15px; }

  /* ONBOARD */
  .onboard-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .onboard-box { width: 100%; max-width: 480px; }
  .step-indicator { display: flex; gap: 8px; justify-content: center; margin-bottom: 32px; }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.3s; }
  .step-dot.active { background: var(--neon); box-shadow: 0 0 12px rgba(0,255,178,0.5); width: 24px; border-radius: 4px; }
  .onboard-title { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 2px;
    background: linear-gradient(135deg, var(--neon), #00B8FF); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
  .onboard-sub { color: var(--muted); font-size: 14px; margin-bottom: 28px; }

  /* MESSAGE BUBBLE */
  .admin-msg { background: linear-gradient(135deg, rgba(123,47,255,0.2), rgba(255,60,172,0.15));
    border: 1px solid rgba(123,47,255,0.3); border-radius: 16px; padding: 16px 20px; }
  .admin-msg-label { font-size: 11px; color: var(--neon2); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .admin-msg-text { font-size: 15px; line-height: 1.5; }

  /* USER LIST */
  .user-row {
    display: flex; align-items: center; gap: 16px; padding: 16px 20px;
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    border-radius: 14px; transition: all 0.2s;
  }
  .user-row:hover { border-color: rgba(0,255,178,0.2); background: rgba(0,255,178,0.04); }
  .user-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif; font-size: 18px; font-weight: 700; flex-shrink: 0; }
  .user-info { flex: 1; }
  .user-name { font-size: 15px; font-weight: 600; }
  .user-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .user-actions { display: flex; gap: 8px; }

  /* MEAL SECTION */
  .meal-section { margin-bottom: 24px; }
  .meal-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px; }
  .meal-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ALERT */
  .alert { padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; }
  .alert-error { background: rgba(255,60,172,0.1); border: 1px solid rgba(255,60,172,0.3); color: #FF3CAC; }
  .alert-success { background: rgba(0,255,178,0.1); border: 1px solid rgba(0,255,178,0.3); color: var(--neon); }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: gap; gap: 12px; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 1px; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,178,0.3); border-radius: 99px; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .fade-up-d1 { animation: fadeUp 0.4s 0.1s ease both; }
  .fade-up-d2 { animation: fadeUp 0.4s 0.2s ease both; }
  .fade-up-d3 { animation: fadeUp 0.4s 0.3s ease both; }
  .pulse { animation: pulse 2s ease infinite; }

  /* 3D CARD EFFECT */
  .card-3d { transform-style: preserve-3d; transition: transform 0.3s; }
  .card-3d:hover { transform: perspective(800px) rotateX(-2deg) rotateY(2deg) translateY(-4px); }

  /* GOAL BADGE */
  .goal-gain { background: linear-gradient(135deg, rgba(0,255,178,0.2), rgba(0,184,255,0.15)); border: 1px solid rgba(0,255,178,0.3); color: var(--neon); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .goal-loss { background: linear-gradient(135deg, rgba(255,60,172,0.2), rgba(255,107,53,0.15)); border: 1px solid rgba(255,60,172,0.3); color: var(--neon2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }

  .page { padding: 24px; max-width: 900px; margin: 0 auto; }
  .spacer { height: 24px; }

  textarea.input { resize: vertical; min-height: 90px; }
  .text-neon { color: var(--neon); }
  .text-pink { color: var(--neon2); }
  .text-muted { color: var(--muted); }
  .text-center { text-align: center; }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .gap-16 { gap: 16px; }
  .gap-20 { gap: 20px; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .mt-12 { margin-top: 12px; }
  .mt-16 { margin-top: 16px; }
  .mt-24 { margin-top: 24px; }
  .fw-700 { font-weight: 700; }
  .font-bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; }

  @media (max-width: 600px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .macro-ring-wrap { flex-direction: column; }
    .page { padding: 16px; }
    .nav { padding: 12px 16px; }
  }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function MacroRing({ calories, target = 2500 }) {
  const pct = Math.min(calories / target, 1);
  const r = 48, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  return (
    <div className="macro-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#grad)" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFB2" />
            <stop offset="100%" stopColor="#00B8FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="macro-ring-center">
        <div className="macro-ring-val">{calories}</div>
        <div className="macro-ring-label">KCAL</div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="macro-bar-row">
      <div className="macro-bar-info">
        <span className="macro-bar-name">{label}</span>
        <span className="macro-bar-val" style={{ color }}>{value}g</span>
      </div>
      <div className="macro-bar-track">
        <div className="macro-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, registeredUsers, onRegister }) {
  const [tab, setTab] = useState("login"); // login | register | admin
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [adminU, setAdminU] = useState("");
  const [adminP, setAdminP] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Register form
  const [reg, setReg] = useState({ name: "", email: "", password: "", confirm: "" });
  const [regErr, setRegErr] = useState("");

  const allUsers = [...DEMO_USERS, ...registeredUsers];

  function handleUserLogin() {
    const u = allUsers.find(x => x.email === email && x.password === pass);
    if (u) onLogin({ type: "user", data: u });
    else setErr("Invalid email or password. Please register first.");
  }

  function handleAdminLogin() {
    if (adminU === ADMIN_CREDENTIALS.username && adminP === ADMIN_CREDENTIALS.password)
      onLogin({ type: "admin" });
    else setErr("Invalid admin credentials");
  }

  function handleRegister() {
    if (!reg.name.trim()) { setRegErr("Enter your name"); return; }
    if (!reg.email.includes("@")) { setRegErr("Enter a valid email"); return; }
    if (reg.password.length < 6) { setRegErr("Password must be at least 6 characters"); return; }
    if (reg.password !== reg.confirm) { setRegErr("Passwords do not match"); return; }
    if (allUsers.find(u => u.email === reg.email)) { setRegErr("Email already registered. Please login."); return; }
    const newUser = {
      id: "u" + Date.now(), name: reg.name, email: reg.email, password: reg.password,
      height: 170, weight: 70, goalWeight: 70, goal: "Weight Gain", age: 25,
      joined: new Date().toISOString().split("T")[0], active: true, log: [], adminMessage: "",
    };
    onRegister(newUser);
    setRegErr("");
    setOk("Account created! Please login with your credentials.");
    setTab("login");
    setEmail(reg.email);
    setPass("");
    setReg({ name: "", email: "", password: "", confirm: "" });
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="fade-up">
          <div className="login-title">FITFUEL</div>
          <div className="login-sub">Track. Fuel. Transform. 🔥</div>
        </div>
        <div className="card fade-up-d1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="tabs">
            <button className={`tab${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setErr(""); setOk(""); }}>🔑 Login</button>
            <button className={`tab${tab === "register" ? " active" : ""}`} onClick={() => { setTab("register"); setErr(""); setOk(""); }}>✨ Register</button>
            <button className={`tab${tab === "admin" ? " active" : ""}`} onClick={() => { setTab("admin"); setErr(""); setOk(""); }}>⚡ Admin</button>
          </div>

          {tab === "login" && (
            <>
              {ok && <div className="alert alert-success">{ok}</div>}
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleUserLogin()} />
              </div>
              {err && <div className="alert alert-error">{err}</div>}
              <button className="btn btn-primary btn-full" onClick={handleUserLogin}>Login →</button>
              <div className="text-muted" style={{ fontSize: 12, textAlign: "center" }}>
                New here? Switch to <strong style={{ color: "var(--neon)" }}>Register</strong> to create an account
              </div>
            </>
          )}

          {tab === "register" && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="input" type="text" placeholder="Your full name" value={reg.name} onChange={e => setReg({ ...reg, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={reg.email} onChange={e => setReg({ ...reg, email: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input className="input" type="password" placeholder="Min. 6 characters" value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input className="input" type="password" placeholder="Repeat password" value={reg.confirm} onChange={e => setReg({ ...reg, confirm: e.target.value })} onKeyDown={e => e.key === "Enter" && handleRegister()} />
              </div>
              {regErr && <div className="alert alert-error">{regErr}</div>}
              <button className="btn btn-primary btn-full" onClick={handleRegister}>Create Account 🚀</button>
              <div className="text-muted" style={{ fontSize: 12, textAlign: "center" }}>
                After registering you'll set up your full profile
              </div>
            </>
          )}

          {tab === "admin" && (
            <>
              <div className="input-group">
                <label className="input-label">Admin Username</label>
                <input className="input" placeholder="Username" value={adminU} onChange={e => setAdminU(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Admin Password</label>
                <input className="input" type="password" placeholder="••••••••" value={adminP} onChange={e => setAdminP(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} />
              </div>
              {err && <div className="alert alert-error">{err}</div>}
              <button className="btn btn-primary btn-full" onClick={handleAdminLogin}>Admin Access →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
function OnboardPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", age: "", height: "", weight: "", goalWeight: "", goal: "Weight Gain", activity: "Moderate" });
  const [err, setErr] = useState("");

  const steps = [
    { title: "What's your name?", sub: "Let's personalise your journey", field: "name", type: "text", placeholder: "Your full name" },
    { title: "Your Age & Height", sub: "We'll calculate your needs", fields: ["age", "height"], labels: ["Age (years)", "Height (cm)"], types: ["number", "number"] },
    { title: "Current Weight", sub: "No judgement — just data 💪", field: "weight", type: "number", placeholder: "kg", label: "Weight (kg)" },
    { title: "Your Goal Weight", sub: "Where do you want to be?", field: "goalWeight", type: "number", placeholder: "kg", label: "Goal Weight (kg)" },
    { title: "What's Your Goal?", sub: "We'll build your plan", field: "goal", type: "select", options: ["Weight Gain", "Weight Loss"] },
    { title: "Activity Level", sub: "How active are you?", field: "activity", type: "select", options: ["Sedentary", "Light", "Moderate", "Active", "Very Active"] },
  ];

  const s = steps[step];

  function next() {
    if (step === 0 && !form.name.trim()) { setErr("Please enter your name"); return; }
    if (step === 1 && (!form.age || !form.height)) { setErr("Fill both fields"); return; }
    if (step === 2 && !form.weight) { setErr("Enter your weight"); return; }
    if (step === 3 && !form.goalWeight) { setErr("Enter your goal weight"); return; }
    setErr("");
    if (step < steps.length - 1) setStep(step + 1);
    else {
      const tdee = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Active: 1.725, "Very Active": 1.9 }[form.activity] * (10 * +form.weight + 6.25 * +form.height - 5 * +form.age + 5);
      const target = form.goal === "Weight Gain" ? Math.round(tdee + 400) : Math.round(tdee - 400);
      onComplete({ ...form, weight: +form.weight, goalWeight: +form.goalWeight, height: +form.height, age: +form.age, caloricTarget: target });
    }
  }

  return (
    <div className="onboard-page">
      <div className="onboard-box">
        <div className="step-indicator">
          {steps.map((_, i) => <div key={i} className={`step-dot${i === step ? " active" : ""}`} />)}
        </div>
        <div className="card" key={step} style={{ animation: "fadeUp 0.35s ease" }}>
          <div className="onboard-title">{s.title}</div>
          <div className="onboard-sub">{s.sub}</div>
          {s.fields ? (
            <div className="grid-2">
              {s.fields.map((f, i) => (
                <div className="input-group" key={f}>
                  <label className="input-label">{s.labels[i]}</label>
                  <input className="input" type={s.types[i]} placeholder={s.labels[i]} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
                </div>
              ))}
            </div>
          ) : s.type === "select" ? (
            <div className="input-group">
              <label className="input-label">{s.field}</label>
              <select className="input" value={form[s.field]} onChange={e => setForm({ ...form, [s.field]: e.target.value })}>
                {s.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ) : (
            <div className="input-group">
              <label className="input-label">{s.label || s.field}</label>
              <input className="input" type={s.type} placeholder={s.placeholder} value={form[s.field]} onChange={e => setForm({ ...form, [s.field]: e.target.value })} onKeyDown={e => e.key === "Enter" && next()} />
            </div>
          )}
          {err && <div className="alert alert-error mt-12">{err}</div>}
          <div className="mt-16 flex gap-12">
            {step > 0 && <button className="btn btn-ghost" onClick={() => { setStep(step - 1); setErr(""); }}>← Back</button>}
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={next}>
              {step === steps.length - 1 ? "Start My Journey 🚀" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ──────────────────────────────────────────────────────────
function UserDashboard({ user, setUser, onLogout }) {
  const [screen, setScreen] = useState("home"); // home | log | meals | profile
  const [todayFoods, setTodayFoods] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");

  const macros = calcMacros(todayFoods);
  const target = user.caloricTarget || 2200;
  const planFoods = MEAL_PLANS[user.goal] || {};

  const cats = ["all", "protein", "carbs", "fat", "veggies"];

  function toggleFood(id) {
    setTodayFoods(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const avatarColors = ["linear-gradient(135deg,#00FFB2,#00B8FF)", "linear-gradient(135deg,#FF3CAC,#7B2FFF)"];
  const avatarColor = avatarColors[0];

  return (
    <div className="app">
      <style>{css}</style>
      <div className="bg-grid" /><div className="bg-orb1" /><div className="bg-orb2" />
      <div className="content">
        <nav className="nav">
          <div className="nav-logo">FITFUEL</div>
          <div className="nav-right">
            <span className="nav-user">{user.name}</span>
            <span className="nav-badge badge-user">USER</span>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>Exit</button>
          </div>
        </nav>

        {/* BOTTOM TAB BAR (top nav for screens) */}
        <div style={{ padding: "12px 24px 0", maxWidth: 900, margin: "0 auto" }}>
          <div className="tabs">
            {[["home","🏠 Home"],["log","📋 Log Meal"],["meals","🍽 Meal Plan"],["profile","👤 Profile"]].map(([k,v]) => (
              <button key={k} className={`tab${screen === k ? " active" : ""}`} onClick={() => setScreen(k)}>{v}</button>
            ))}
          </div>
        </div>

        {/* ── HOME ── */}
        {screen === "home" && (
          <div className="page">
            {/* Admin message */}
            {user.adminMessage && (
              <div className="admin-msg fade-up" style={{ marginBottom: 20 }}>
                <div className="admin-msg-label">⚡ Message from Coach</div>
                <div className="admin-msg-text">{user.adminMessage}</div>
              </div>
            )}

            <div className="section-header">
              <div>
                <div className="text-muted" style={{ fontSize: 13 }}>Good day,</div>
                <div className="section-title">{user.name.split(" ")[0]} 👋</div>
              </div>
              <div className={user.goal === "Weight Gain" ? "goal-gain" : "goal-loss"}>{user.goal}</div>
            </div>

            {/* Calorie ring + macros */}
            <div className="card card-3d fade-up" style={{ marginBottom: 16 }}>
              <div className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Today's Nutrition</div>
              <div className="macro-ring-wrap">
                <MacroRing calories={macros.cal} target={target} />
                <div className="macro-bars">
                  <MacroBar label="Protein" value={Math.round(macros.prot)} max={180} color="#00FFB2" />
                  <MacroBar label="Carbs" value={Math.round(macros.carbs)} max={300} color="#00B8FF" />
                  <MacroBar label="Fat" value={Math.round(macros.fat)} max={80} color="#FF3CAC" />
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "space-between" }}>
                {[["Target", `${target} kcal`], ["Remaining", `${Math.max(0, target - macros.cal)} kcal`], ["Burned", "—"]].map(([l, v]) => (
                  <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
                    <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 20, color: "var(--neon)", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid-3 fade-up-d1" style={{ marginBottom: 16 }}>
              {[["Weight", `${user.weight}kg`, "var(--neon)"], ["Goal", `${user.goalWeight}kg`, "var(--neon2)"], ["To Go", `${Math.abs(user.goalWeight - user.weight)}kg`, "#00B8FF"]].map(([l, v, c]) => (
                <div key={l} className="card card-3d">
                  <div className="stat-label">{l}</div>
                  <div className="stat-val" style={{ color: c }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Quick log */}
            <div className="card fade-up-d2">
              <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700 }}>Quick Add Today</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setScreen("log")}>View All →</button>
              </div>
              <div className="flex flex-col gap-8">
                {todayFoods.length === 0 && <div className="text-muted" style={{ fontSize: 13, textAlign: "center", padding: 16 }}>No foods logged today. Tap Log Meal!</div>}
                {todayFoods.map(id => {
                  const f = FOOD_DATABASE.find(x => x.id === id);
                  return f ? (
                    <div key={id} className="food-item selected">
                      <span className="food-emoji">{f.emoji}</span>
                      <div className="food-info"><div className="food-name">{f.name}</div></div>
                      <span className="food-cal">{f.calories}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── LOG MEAL ── */}
        {screen === "log" && (
          <div className="page">
            <div className="section-header">
              <div className="section-title">Log Meal 📋</div>
              <div style={{ fontSize: 13, color: "var(--neon)" }}>{todayFoods.length} selected · {macros.cal} kcal</div>
            </div>
            <div className="tabs" style={{ marginBottom: 16 }}>
              {cats.map(c => <button key={c} className={`tab${selectedCat === c ? " active" : ""}`} onClick={() => setSelectedCat(c)} style={{ textTransform: "capitalize" }}>{c}</button>)}
            </div>
            <div className="flex flex-col gap-8">
              {FOOD_DATABASE.filter(f => selectedCat === "all" || f.category === selectedCat).map(f => (
                <div key={f.id} className={`food-item${todayFoods.includes(f.id) ? " selected" : ""}`} onClick={() => toggleFood(f.id)}>
                  <span className="food-emoji">{f.emoji}</span>
                  <div className="food-info">
                    <div className="food-name">{f.name}</div>
                    <div className="food-macros">P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="food-cal">{f.calories}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MEAL PLAN ── */}
        {screen === "meals" && (
          <div className="page">
            <div className="section-header">
              <div className="section-title">Meal Plan 🍽</div>
              <div className={user.goal === "Weight Gain" ? "goal-gain" : "goal-loss"}>{user.goal}</div>
            </div>
            {Object.entries(planFoods).map(([meal, ids]) => {
              const m = calcMacros(ids);
              return (
                <div key={meal} className="meal-section">
                  <div className="meal-title">{meal} · {m.cal} kcal</div>
                  <div className="flex flex-col gap-8">
                    {ids.map(id => {
                      const f = FOOD_DATABASE.find(x => x.id === id);
                      return f ? (
                        <div key={id} className="food-item">
                          <span className="food-emoji">{f.emoji}</span>
                          <div className="food-info">
                            <div className="food-name">{f.name}</div>
                            <div className="food-macros">P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g</div>
                          </div>
                          <div className="food-cal">{f.calories}</div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROFILE ── */}
        {screen === "profile" && (
          <div className="page">
            <div className="section-title" style={{ marginBottom: 20 }}>My Profile 👤</div>
            <div className="card fade-up" style={{ marginBottom: 16, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontFamily: "Bebas Neue", fontSize: 32, color: "#000" }}>
                {user.name[0]}
              </div>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 28 }}>{user.name}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>{user.email}</div>
              <div style={{ marginTop: 8 }}><span className={user.goal === "Weight Gain" ? "goal-gain" : "goal-loss"}>{user.goal}</span></div>
            </div>
            <div className="grid-2 fade-up-d1" style={{ marginBottom: 16 }}>
              {[["Age", `${user.age} yrs`], ["Height", `${user.height} cm`], ["Weight", `${user.weight} kg`], ["Goal Weight", `${user.goalWeight} kg`], ["Daily Target", `${user.caloricTarget || "—"} kcal`], ["Activity", user.activity || "Moderate"]].map(([l, v]) => (
                <div key={l} className="card">
                  <div className="stat-label">{l}</div>
                  <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 24, color: "var(--neon)", marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-danger btn-full" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ onLogout, allUsers: initialUsers, registeredUsers, setRegisteredUsers }) {
  const [screen, setScreen] = useState("overview");
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [msgDraft, setMsgDraft] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", goal: "Weight Gain", weight: "", goalWeight: "", height: "", age: "" });
  const [addErr, setAddErr] = useState("");
  const [addOk, setAddOk] = useState(false);

  function removeUser(id) { setUsers(u => u.filter(x => x.id !== id)); if (selectedUser?.id === id) { setSelectedUser(null); setScreen("overview"); } }

  function sendMessage() {
    setUsers(u => u.map(x => x.id === selectedUser.id ? { ...x, adminMessage: msgDraft } : x));
    setSelectedUser(u => ({ ...u, adminMessage: msgDraft }));
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 2500);
  }

  function addUser() {
    if (!newUser.name || !newUser.email || !newUser.password) { setAddErr("Name, email and password required"); return; }
    const u = { ...newUser, id: "u" + Date.now(), weight: +newUser.weight || 70, goalWeight: +newUser.goalWeight || 70, height: +newUser.height || 170, age: +newUser.age || 25, joined: todayStr(), active: true, log: [], adminMessage: "" };
    setUsers(prev => [...prev, u]);
    setNewUser({ name: "", email: "", password: "", goal: "Weight Gain", weight: "", goalWeight: "", height: "", age: "" });
    setAddErr(""); setAddOk(true);
    setTimeout(() => setAddOk(false), 2500);
  }

  const totalCal = users.reduce((a, u) => a + (u.log[0]?.totalCal || 0), 0);

  return (
    <div className="app">
      <style>{css}</style>
      <div className="bg-grid" /><div className="bg-orb1" /><div className="bg-orb2" />
      <div className="content">
        <nav className="nav">
          <div className="nav-logo">FITFUEL ⚡</div>
          <div className="nav-right">
            <span className="nav-user">Administrator</span>
            <span className="nav-badge badge-admin">ADMIN</span>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>Exit</button>
          </div>
        </nav>

        <div style={{ padding: "12px 24px 0", maxWidth: 900, margin: "0 auto" }}>
          <div className="tabs">
            {[["overview","📊 Overview"],["users","👥 Users"],["add","➕ Add User"],["foods","🥗 Foods"]].map(([k,v]) => (
              <button key={k} className={`tab${screen === k ? " active" : ""}`} onClick={() => { setScreen(k); setSelectedUser(null); }}>{v}</button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {screen === "overview" && (
          <div className="page">
            <div className="section-title fade-up" style={{ marginBottom: 20 }}>Dashboard Overview 📊</div>
            <div className="grid-3 fade-up" style={{ marginBottom: 16 }}>
              {[["Total Users", users.length, "var(--neon)"], ["Active Today", users.filter(u => u.log.length > 0).length, "#00B8FF"], ["Avg Calories", Math.round(totalCal / (users.length || 1)), "var(--neon2)"]].map(([l, v, c]) => (
                <div key={l} className="card card-3d">
                  <div className="stat-label">{l}</div>
                  <div className="stat-val" style={{ color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="card fade-up-d1" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>All Members</div>
              <div className="flex flex-col gap-8">
                {users.map(u => (
                  <div key={u.id} className="user-row" style={{ cursor: "pointer" }} onClick={() => { setSelectedUser(u); setMsgDraft(u.adminMessage || ""); setScreen("users"); }}>
                    <div className="user-avatar" style={{ background: u.goal === "Weight Gain" ? "linear-gradient(135deg,#00FFB2,#00B8FF)" : "linear-gradient(135deg,#FF3CAC,#7B2FFF)", color: "#000" }}>{u.name[0]}</div>
                    <div className="user-info">
                      <div className="user-name">{u.name}</div>
                      <div className="user-meta">{u.email} · {u.goal}</div>
                    </div>
                    <span className={u.goal === "Weight Gain" ? "goal-gain" : "goal-loss"}>{u.goal === "Weight Gain" ? "⬆ Gain" : "⬇ Loss"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {screen === "users" && !selectedUser && (
          <div className="page">
            <div className="section-title fade-up" style={{ marginBottom: 20 }}>Manage Users 👥</div>
            <div className="flex flex-col gap-12">
              {users.map(u => (
                <div key={u.id} className="card card-3d">
                  <div className="flex items-center gap-16">
                    <div className="user-avatar" style={{ background: u.goal === "Weight Gain" ? "linear-gradient(135deg,#00FFB2,#00B8FF)" : "linear-gradient(135deg,#FF3CAC,#7B2FFF)", color: "#000" }}>{u.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div className="user-name">{u.name}</div>
                      <div className="user-meta">{u.email} · Joined {u.joined}</div>
                    </div>
                    <div className="user-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedUser(u); setMsgDraft(u.adminMessage || ""); }}>View →</button>
                      <button className="btn btn-danger btn-sm" onClick={() => removeUser(u.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === "users" && selectedUser && (
          <div className="page">
            <button className="back-btn" style={{ margin: "0 0 20px" }} onClick={() => setSelectedUser(null)}>← Back to Users</button>
            <div className="section-title" style={{ marginBottom: 20 }}>{selectedUser.name}</div>

            <div className="grid-2 fade-up" style={{ marginBottom: 16 }}>
              {[["Email", selectedUser.email], ["Goal", selectedUser.goal], ["Weight", `${selectedUser.weight}kg`], ["Goal Weight", `${selectedUser.goalWeight}kg`], ["Height", `${selectedUser.height}cm`], ["Age", `${selectedUser.age}yrs`], ["Joined", selectedUser.joined]].map(([l, v]) => (
                <div key={l} className="card"><div className="stat-label">{l}</div><div style={{ fontWeight: 700, marginTop: 4 }}>{v}</div></div>
              ))}
            </div>

            {/* Diet log */}
            <div className="card fade-up-d1" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>🗓 Diet Log</div>
              {selectedUser.log.length === 0 && <div className="text-muted" style={{ fontSize: 13 }}>No logs yet</div>}
              {selectedUser.log.map((l, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{l.date}</div>
                  <div className="flex gap-12" style={{ flexWrap: "wrap" }}>
                    {[["Calories", l.totalCal, "var(--neon)"], ["Protein", `${l.totalProt}g`, "#00B8FF"], ["Carbs", `${l.totalCarbs}g`, "var(--neon2)"], ["Fat", `${l.totalFat}g`, "#FF6B35"]].map(([n, v, c]) => (
                      <div key={n} style={{ fontSize: 13 }}><span style={{ color: "var(--muted)" }}>{n}: </span><span style={{ color: c, fontWeight: 700 }}>{v}</span></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Send message */}
            <div className="card fade-up-d2">
              <div style={{ fontWeight: 700, marginBottom: 12 }}>💬 Send Personal Message</div>
              <textarea className="input" placeholder="Write diet tips, motivation, or instructions..." value={msgDraft} onChange={e => setMsgDraft(e.target.value)} />
              <div className="flex gap-12 mt-12">
                <button className="btn btn-primary" onClick={sendMessage}>Send to {selectedUser.name.split(" ")[0]} →</button>
                {msgSent && <div className="alert alert-success" style={{ flex: 1 }}>✓ Message sent!</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── ADD USER ── */}
        {screen === "add" && (
          <div className="page">
            <div className="section-title fade-up" style={{ marginBottom: 20 }}>Add New User ➕</div>
            <div className="card fade-up-d1">
              <div className="grid-2" style={{ gap: 16 }}>
                {[["name","Name","text"], ["email","Email","email"], ["password","Password","password"], ["age","Age","number"], ["height","Height (cm)","number"], ["weight","Weight (kg)","number"], ["goalWeight","Goal Weight (kg)","number"]].map(([f, l, t]) => (
                  <div className="input-group" key={f}>
                    <label className="input-label">{l}</label>
                    <input className="input" type={t} placeholder={l} value={newUser[f]} onChange={e => setNewUser({ ...newUser, [f]: e.target.value })} />
                  </div>
                ))}
                <div className="input-group">
                  <label className="input-label">Goal</label>
                  <select className="input" value={newUser.goal} onChange={e => setNewUser({ ...newUser, goal: e.target.value })}>
                    <option>Weight Gain</option><option>Weight Loss</option>
                  </select>
                </div>
              </div>
              {addErr && <div className="alert alert-error mt-16">{addErr}</div>}
              {addOk && <div className="alert alert-success mt-16">✓ User added successfully!</div>}
              <button className="btn btn-primary btn-full mt-16" onClick={addUser}>Add User →</button>
            </div>
          </div>
        )}

        {/* ── FOODS ── */}
        {screen === "foods" && (
          <div className="page">
            <div className="section-title fade-up" style={{ marginBottom: 20 }}>Food Database 🥗</div>
            <div className="flex flex-col gap-8">
              {FOOD_DATABASE.map(f => (
                <div key={f.id} className="food-item">
                  <span className="food-emoji">{f.emoji}</span>
                  <div className="food-info">
                    <div className="food-name">{f.name}</div>
                    <div className="food-macros">Protein: {f.protein}g · Carbs: {f.carbs}g · Fat: {f.fat}g · Category: {f.category}</div>
                  </div>
                  <div className="food-cal">{f.calories}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function FitFuelApp() {
  const [auth, setAuth] = useState(null);
  const [userData, setUserData] = useState(null);
  const [needsOnboard, setNeedsOnboard] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]); // users who signed up in-session

  function handleRegister(newUser) {
    setRegisteredUsers(prev => [...prev, newUser]);
  }

  function handleLogin(res) {
    if (res.type === "admin") { setAuth({ type: "admin" }); return; }
    const u = res.data;
    if (!u.caloricTarget) { setAuth({ type: "user", data: u }); setNeedsOnboard(true); }
    else { setAuth({ type: "user", data: u }); setUserData(u); }
  }

  function handleOnboard(form) {
    const u = { ...auth.data, ...form };
    // Update registered users list so admin can see updated info
    setRegisteredUsers(prev => prev.map(x => x.id === u.id ? u : x));
    setAuth({ type: "user", data: u });
    setUserData(u);
    setNeedsOnboard(false);
  }

  function handleLogout() { setAuth(null); setUserData(null); setNeedsOnboard(false); }

  const allUsers = [...DEMO_USERS, ...registeredUsers];

  if (!auth) return (
    <div className="app">
      <style>{css}</style>
      <div className="bg-grid" /><div className="bg-orb1" /><div className="bg-orb2" />
      <div className="content">
        <LoginPage onLogin={handleLogin} registeredUsers={registeredUsers} onRegister={handleRegister} />
      </div>
    </div>
  );

  if (auth.type === "admin") return <AdminDashboard onLogout={handleLogout} allUsers={allUsers} registeredUsers={registeredUsers} setRegisteredUsers={setRegisteredUsers} />;

  if (needsOnboard) return (
    <div className="app">
      <style>{css}</style>
      <div className="bg-grid" /><div className="bg-orb1" /><div className="bg-orb2" />
      <div className="content">
        <OnboardPage onComplete={handleOnboard} />
      </div>
    </div>
  );

  return <UserDashboard user={userData || auth.data} setUser={setUserData} onLogout={handleLogout} />;
}
