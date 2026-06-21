const { useState, useEffect, useCallback } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const DAILY_VITAMINS = [
  { name: "Garden of Life Men's Once Daily", note: "Whole food multivitamin - baseline" },
  { name: "Zinc (extra, target 15-25mg total)", note: "Multi only gives 3.9mg - top up" },
  { name: "Magnesium glycinate 300-400mg", note: "Before bed" },
  { name: "Vitamin D3 2,000-4,000 IU", note: "Take if sun exposure is low" },
];

const DAILY_AVOID = [
  "Avoid alcohol (blocks testosterone 24-48 hrs)",
  "🚫 No P/M - protect dopamine & refractory cycle",
  "Avoid late-night heavy meals (disrupts sleep/T)",
  "No less than 7-9 hrs sleep - non-negotiable",
];

const DAILY_BEST_PRACTICES = [
  "Cold shower 2-3 min",
  "Kegel exercises (3 sets of 20)",
  "10 min breathwork / meditation",
  "2-3L water throughout the day",
];

const WEEKS = [
  {
    label: "Week 1 - Foundation", theme: "#2D6A4F",
    weekSupplement: "Zinc 15-25mg",
    days: [
      { day: "Mon", exercise: "Squats 4x10 + Hip Thrusts 3x12", focus: "Testosterone trigger", foods: ["Watermelon (incl. white rind, blended)", "Spinach / Arugula"] },
      { day: "Tue", exercise: "Cardio 20 min (brisk walk/jog)", focus: "Blood flow / NO production", foods: ["Beets / Beet juice", "Walnuts"] },
      { day: "Wed", exercise: "Push-ups 4x15 + Deadlifts (light)", focus: "Full body hormone boost", foods: ["Dark chocolate 85%+", "Watermelon (incl. white rind, blended)"] },
      { day: "Thu", exercise: "Rest / Yoga / Stretching", focus: "Cortisol reduction", foods: ["Spinach / Arugula", "Walnuts"] },
      { day: "Fri", exercise: "Squats 4x12 + Lunges 3x10", focus: "Pelvic floor activation", foods: ["Beets / Beet juice", "Dark chocolate 85%+"] },
      { day: "Sat", exercise: "Kegel exercises 3x20 reps", focus: "Erection control", foods: ["Watermelon (incl. white rind, blended)", "Walnuts"] },
      { day: "Sun", exercise: "Active rest (light walk)", focus: "Recovery", foods: ["Spinach / Arugula", "Beets / Beet juice"] },
    ],
  },
  {
    label: "Week 2 - Intensity Up", theme: "#1B4332",
    weekSupplement: "Maca root 1.5-3g + Citrulline malate (optional)",
    days: [
      { day: "Mon", exercise: "Bulgarian split squats 4x8 each leg", focus: "Glute/hip chain", foods: ["Watermelon (incl. white rind, blended)", "Pomegranate juice (30ml)"] },
      { day: "Tue", exercise: "Jump rope 15 min + core work", focus: "Cardiovascular", foods: ["Avocado", "Oats"] },
      { day: "Wed", exercise: "Push-ups + rows (bands/dumbbells)", focus: "Upper body", foods: ["Garlic", "Maca root powder"] },
      { day: "Thu", exercise: "Pelvic floor work + breathwork", focus: "Parasympathetic tone", foods: ["Brazil nuts (2/day)", "Pomegranate juice (30ml)"] },
      { day: "Fri", exercise: "Heavy squats + hip thrusts", focus: "Peak testosterone stimulus", foods: ["Watermelon (incl. white rind, blended)", "Maca root powder"] },
      { day: "Sat", exercise: "Yoga / full body stretching", focus: "Flexibility + cortisol", foods: ["Avocado", "Garlic"] },
      { day: "Sun", exercise: "Rest", focus: "Full recovery", foods: ["Oats", "Brazil nuts (2/day)"] },
    ],
  },
  {
    label: "Week 3 - Hormonal Peak", theme: "#40916C",
    weekSupplement: "Zinc 20-25mg + Citrulline malate (optional)",
    days: [
      { day: "Mon", exercise: "Squats 5x10 + Hip Thrusts 4x12", focus: "Testosterone trigger (+20%)", foods: ["Watermelon (incl. white rind, blended)", "Ginger (fresh/tea)"] },
      { day: "Tue", exercise: "Cardio 25 min + sprints 3x30s", focus: "Enhanced blood flow", foods: ["Hemp seeds", "Cayenne pepper"] },
      { day: "Wed", exercise: "Push-ups 5x15 + Deadlifts", focus: "Full body hormone surge", foods: ["Fenugreek (in smoothie)", "Saffron (pinch in food)"] },
      { day: "Thu", exercise: "Rest / Yoga / Stretching", focus: "Cortisol management", foods: ["Ginger (fresh/tea)", "Hemp seeds"] },
      { day: "Fri", exercise: "Squats 5x12 + Lunges 4x10", focus: "Pelvic activation", foods: ["Watermelon (incl. white rind, blended)", "Saffron (pinch in food)"] },
      { day: "Sat", exercise: "Kegel exercises 4x20 reps", focus: "Erection strength", foods: ["Cayenne pepper", "Fenugreek (in smoothie)"] },
      { day: "Sun", exercise: "Active rest + cold shower", focus: "Dopamine + T reset", foods: ["Hemp seeds", "Ginger (fresh/tea)"] },
    ],
  },
  {
    label: "Week 4 - Recovery & Reset", theme: "#52B788",
    weekSupplement: "Magnesium glycinate 400mg + Zinc 15mg + Vitamin D3 2,000 IU",
    days: [
      { day: "Mon", exercise: "Light walk 20 min + stretching", focus: "Active recovery", foods: ["Watermelon (incl. white rind, blended)", "Lentils + chickpeas"] },
      { day: "Tue", exercise: "Yoga 30 min", focus: "Cortisol reset", foods: ["Sunflower seeds", "Green tea"] },
      { day: "Wed", exercise: "Breathing exercises + Kegels", focus: "Pelvic + nervous system", foods: ["Blueberries + blackberries", "Tofu or tempeh"] },
      { day: "Thu", exercise: "Light walk", focus: "Blood flow maintenance", foods: ["Sweet potato", "Watermelon (incl. white rind, blended)"] },
      { day: "Fri", exercise: "Full body moderate workout", focus: "Hormonal maintenance", foods: ["Lentils + chickpeas", "Sunflower seeds"] },
      { day: "Sat", exercise: "Cold shower + stretching", focus: "Dopamine recovery", foods: ["Green tea", "Blueberries + blackberries"] },
      { day: "Sun", exercise: "Complete rest", focus: "Full reset", foods: ["Tofu or tempeh", "Sweet potato"] },
    ],
  },
];

const ASSESS_METRICS = [
  { key: "erection", label: "Erection Quality", icon: "💪" },
  { key: "libido", label: "Libido / Desire", icon: "🔥" },
  { key: "energy", label: "Energy Levels", icon: "⚡" },
  { key: "refractory", label: "Recovery Speed", icon: "⏱️" },
  { key: "morning", label: "Morning Wood", icon: "🌅" },
];

const DEFAULT_HABITS = [
  { id: "h1", name: "No screens 30 min before bed", category: "Sleep", icon: "📵", cue: "Alarm at 9:30pm", atomic: "2-min rule: put phone face-down when alarm fires" },
  { id: "h2", name: "Read 10 pages before sleep", category: "Longevity", icon: "📚", cue: "Book on nightstand", atomic: "Habit stack: after phone down → pick up book" },
  { id: "h3", name: "5 min gratitude / intention journal", category: "Self-Control", icon: "✍️", cue: "Journal next to coffee maker", atomic: "Write 3 things grateful for - nothing more required" },
  { id: "h4", name: "No alcohol today", category: "Self-Control", icon: "🧃", cue: "Replace with sparkling water + lime", atomic: "Identity: 'I protect my testosterone'" },
  { id: "h5", name: "Walk outside 10 min (sunlight)", category: "Longevity", icon: "☀️", cue: "Right after first meal", atomic: "Habit stack: finish eating → shoes on → door" },
  { id: "h6", name: "One healthy meal prepped ahead", category: "Longevity", icon: "🥘", cue: "Sunday prep session", atomic: "Just prep ONE thing - lowers friction all week" },
  { id: "h7", name: "Cap social media at 15 min", category: "Self-Control", icon: "📱", cue: "Set phone screen time limit", atomic: "Friction: log out of apps after each use" },
  { id: "h8", name: "Meaningful connection with wife", category: "Relationship", icon: "❤️", cue: "Dinner - no phones at table", atomic: "One genuine compliment or question, no agenda" },
  { id: "h9", name: "5 min visualization (intimacy goals)", category: "Self-Control", icon: "🧠", cue: "Morning, right after cold shower", atomic: "Close eyes - see the outcome you want clearly" },
  { id: "h10", name: "Stretch / mobility 5 min", category: "Longevity", icon: "🤸", cue: "Right after waking up", atomic: "Just hit the floor - 5 min counts" },
];

const HABIT_CATEGORIES = ["All", "Self-Control", "Longevity", "Sleep", "Relationship"];

// ─────────────────────────────────────────────
// FIREBASE HELPERS
// ─────────────────────────────────────────────

async function fbSet(userId, docName, data) {
  try {
    const { doc, setDoc } = window.__firestore;
    const db = window.__db;
    await setDoc(doc(db, "users", userId, "data", docName), { value: JSON.stringify(data) });
  } catch (e) { console.warn("Firebase save error:", e); }
}

async function fbGet(userId, docName, fallback) {
  try {
    const { doc, getDoc } = window.__firestore;
    const db = window.__db;
    const snap = await getDoc(doc(db, "users", userId, "data", docName));
    if (snap.exists()) return JSON.parse(snap.data().value);
    return fallback;
  } catch (e) { return fallback; }
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

function App() {
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [weekIndex, setWeekIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [checks, setChecks] = useState({});
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState({ erection: 5, libido: 5, energy: 5, refractory: 5, morning: 5 });
  const [view, setView] = useState("checklist");
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [habitChecks, setHabitChecks] = useState({});
  const [habitFilter, setHabitFilter] = useState("All");
  const [expandedHabit, setExpandedHabit] = useState(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Auth + load ──
  useEffect(() => {
    const init = () => {
      window.__onAuthStateChanged(window.__auth, async (user) => {
        let uid = user?.uid;
        if (!uid) {
          const result = await window.__signInAnonymously(window.__auth);
          uid = result.user.uid;
        }
        setUserId(uid);
        setAuthReady(true);

        const [savedChecks, savedAssessments, savedHabitChecks, savedHabits, savedWeek, savedDay] = await Promise.all([
          fbGet(uid, "checks", {}),
          fbGet(uid, "assessments", []),
          fbGet(uid, "habitChecks", {}),
          fbGet(uid, "habits", DEFAULT_HABITS),
          fbGet(uid, "weekIndex", 0),
          fbGet(uid, "dayIndex", 0),
        ]);

        setChecks(savedChecks);
        setAssessments(savedAssessments);
        setHabitChecks(savedHabitChecks);
        setHabits(savedHabits);
        setWeekIndex(savedWeek);
        setDayIndex(savedDay);
        setLoaded(true);
      });
    };

    if (window.__firebaseReady) init();
    else window.addEventListener("firebaseReady", init);
    return () => window.removeEventListener("firebaseReady", init);
  }, []);

  const week = WEEKS[weekIndex];
  const day = week.days[dayIndex];
  const todayKey = `${weekIndex}-${dayIndex}`;
  const dateKey = new Date().toISOString().slice(0, 10);

  const toggleCheck = async (key) => {
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next);
    await fbSet(userId, "checks", next);
  };

  const toggleHabit = async (hid) => {
    const key = `${hid}-${dateKey}`;
    const next = { ...habitChecks, [key]: !habitChecks[key] };
    setHabitChecks(next);
    await fbSet(userId, "habitChecks", next);
  };

  const changeWeek = async (i) => {
    setWeekIndex(i); setDayIndex(0);
    await fbSet(userId, "weekIndex", i);
    await fbSet(userId, "dayIndex", 0);
  };

  const changeDay = async (i) => {
    setDayIndex(i);
    await fbSet(userId, "dayIndex", i);
  };

  const saveAssessment = async () => {
    setSaving(true);
    const entry = { week: weekIndex + 1, day: dayIndex + 1, ...currentAssessment, date: new Date().toLocaleDateString() };
    const next = [...assessments, entry];
    setAssessments(next);
    await fbSet(userId, "assessments", next);
    setSaving(false);
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    const next = [...habits, { id: `h${Date.now()}`, name: newHabitName.trim(), category: "Self-Control", icon: "⭐", cue: "", atomic: "" }];
    setHabits(next);
    setNewHabitName("");
    await fbSet(userId, "habits", next);
  };

  const removeHabit = async (id) => {
    const next = habits.filter(h => h.id !== id);
    setHabits(next);
    await fbSet(userId, "habits", next);
  };

  const getStreak = (hid) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      if (habitChecks[`${hid}-${d.toISOString().slice(0, 10)}`]) streak++;
      else break;
    }
    return streak;
  };

  const items = [
    { section: "Exercise", icon: "🏋️", list: [{ name: day.exercise, note: day.focus }] },
    { section: "Vitamins / Supplements", icon: "💊", list: [...DAILY_VITAMINS, { name: week.weekSupplement, note: `Week ${weekIndex + 1} focus supplement` }] },
    { section: "Performance Foods", icon: "🥗", list: day.foods.map(f => ({ name: f, note: "" })) },
    { section: "Best Practices", icon: "✅", list: DAILY_BEST_PRACTICES.map(t => ({ name: t, note: "" })) },
    { section: "Things to Avoid", icon: "🚫", list: DAILY_AVOID.map(t => ({ name: t, note: "" })) },
  ];

  let totalItems = 0, doneItems = 0;
  items.forEach((sec, si) => sec.list.forEach((_, ii) => {
    totalItems++;
    if (checks[`${todayKey}-${si}-${ii}`]) doneItems++;
  }));
  const dayProgress = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  const avgScore = (a) => Math.round((a.erection + a.libido + a.energy + a.refractory + a.morning) / 5 * 10) / 10;
  const chartData = assessments.map(a => ({
    label: `W${a.week}D${a.day}`, Erection: a.erection, Libido: a.libido,
    Energy: a.energy, Recovery: a.refractory, "AM Wood": a.morning, Avg: avgScore(a),
  }));

  const filteredHabits = habits.filter(h => habitFilter === "All" || h.category === habitFilter);
  const habitsDoneToday = habits.filter(h => habitChecks[`${h.id}-${dateKey}`]).length;

  // ── Loading screens ──
  if (!authReady || !loaded) return (
    <div style={{ background: "#0D1117", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 32 }}>💪</div>
      <div style={{ color: "#52B788", fontSize: 14, fontWeight: 600 }}>Performance Optimizer</div>
      <div style={{ color: "#8B949E", fontSize: 12 }}>{!authReady ? "Connecting to cloud..." : "Loading your data..."}</div>
    </div>
  );

  const tabs = [
    { id: "checklist", label: "Daily", icon: "📋" },
    { id: "habits", label: "Habits", icon: "🔁" },
    { id: "stats", label: "Stats", icon: "📊" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, Inter, sans-serif", background: "#0D1117", minHeight: "100vh", color: "#E6EDF3", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${week.theme}33, #0D1117)`, borderBottom: "1px solid #21262D", padding: "20px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#8B949E", textTransform: "uppercase", marginBottom: 2 }}>Performance Optimizer</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#E6EDF3" }}>{week.label}</div>
            <div style={{ fontSize: 12, color: "#8B949E", marginTop: 2 }}>{day.day} · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
          </div>
          <div style={{ fontSize: 10, color: "#52B788", background: "#52B78818", padding: "4px 8px", borderRadius: 6, border: "1px solid #52B78844" }}>☁️ Synced</div>
        </div>

        {view === "checklist" && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8B949E", marginBottom: 5 }}>
              <span>Today {doneItems}/{totalItems}</span>
              <span style={{ color: week.theme, fontWeight: 700 }}>{dayProgress}%</span>
            </div>
            <div style={{ background: "#21262D", borderRadius: 4, height: 5 }}>
              <div style={{ background: week.theme, width: `${dayProgress}%`, height: 5, borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
        )}

        {view === "habits" && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8B949E", marginBottom: 5 }}>
              <span>Habits today {habitsDoneToday}/{habits.length}</span>
              <span style={{ color: week.theme, fontWeight: 700 }}>{habits.length ? Math.round(habitsDoneToday / habits.length * 100) : 0}%</span>
            </div>
            <div style={{ background: "#21262D", borderRadius: 4, height: 5 }}>
              <div style={{ background: week.theme, width: `${habits.length ? Math.round(habitsDoneToday / habits.length * 100) : 0}%`, height: 5, borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
        )}

        {/* Week selector */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {WEEKS.map((w, i) => (
            <button key={i} onClick={() => changeWeek(i)} style={{
              flex: 1, padding: "7px 2px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
              background: i === weekIndex ? week.theme : "#21262D", color: i === weekIndex ? "#fff" : "#8B949E",
            }}>W{i + 1}</button>
          ))}
        </div>

        {/* Day selector */}
        <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
          {week.days.map((d, i) => (
            <button key={i} onClick={() => changeDay(i)} style={{
              flex: 1, padding: "7px 2px", borderRadius: 7, cursor: "pointer", fontSize: 10, fontWeight: 600,
              background: i === dayIndex ? `${week.theme}55` : "#161B22", color: i === dayIndex ? "#fff" : "#8B949E",
              border: i === dayIndex ? `1px solid ${week.theme}` : "1px solid #21262D",
            }}>{d.day}</button>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262D", background: "#161B22" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flex: 1, padding: "11px 4px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: "transparent", color: view === t.id ? week.theme : "#8B949E",
            borderBottom: view === t.id ? `2px solid ${week.theme}` : "2px solid transparent",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ padding: "16px 14px" }}>

        {/* ── DAILY CHECKLIST ── */}
        {view === "checklist" && items.map((sec, si) => (
          <div key={si} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: week.theme, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {sec.icon} {sec.section}
            </div>
            {sec.list.map((item, ii) => {
              const key = `${todayKey}-${si}-${ii}`;
              const done = !!checks[key];
              return (
                <div key={ii} onClick={() => toggleCheck(key)} style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 10,
                  background: done ? `${week.theme}22` : "#161B22",
                  border: `1px solid ${done ? week.theme : "#21262D"}`,
                  marginBottom: 7, cursor: "pointer", transition: "all 0.2s"
                }}>
                  <div style={{
                    width: 21, height: 21, borderRadius: 5, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${done ? week.theme : "#30363D"}`,
                    background: done ? week.theme : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#8B949E" : "#E6EDF3", textDecoration: done ? "line-through" : "none" }}>{item.name}</div>
                    {item.note && <div style={{ fontSize: 11, color: "#8B949E", marginTop: 2 }}>{item.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* ── HABITS TAB ── */}
        {view === "habits" && (
          <div>
            <div style={{ padding: 14, borderRadius: 10, background: `${week.theme}18`, border: `1px solid ${week.theme}44`, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: week.theme, marginBottom: 4 }}>🔁 Atomic Habits System</div>
              <div style={{ fontSize: 12, color: "#C9D1D9", lineHeight: 1.6 }}>
                Small habits compound. Each uses a <b style={{ color: "#E6EDF3" }}>cue → routine → reward</b> loop.
                Tap any habit for the 2-min starter. Build streaks - identity follows action.
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {HABIT_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setHabitFilter(cat)} style={{
                  padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                  background: habitFilter === cat ? week.theme : "#21262D",
                  color: habitFilter === cat ? "#fff" : "#8B949E",
                }}>{cat}</button>
              ))}
            </div>

            {filteredHabits.map(h => {
              const hKey = `${h.id}-${dateKey}`;
              const done = !!habitChecks[hKey];
              const streak = getStreak(h.id);
              const expanded = expandedHabit === h.id;
              return (
                <div key={h.id} style={{ borderRadius: 10, background: done ? `${week.theme}18` : "#161B22", border: `1px solid ${done ? week.theme : "#21262D"}`, marginBottom: 8, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", cursor: "pointer" }}
                    onClick={() => setExpandedHabit(expanded ? null : h.id)}>
                    <div onClick={e => { e.stopPropagation(); toggleHabit(h.id); }} style={{
                      width: 21, height: 21, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${done ? week.theme : "#30363D"}`,
                      background: done ? week.theme : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#8B949E" : "#E6EDF3", textDecoration: done ? "line-through" : "none" }}>{h.name}</div>
                      <div style={{ fontSize: 10, color: week.theme, marginTop: 2 }}>{h.category}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                      {streak > 0 && <div style={{ fontSize: 11, color: "#F4A261", fontWeight: 700 }}>🔥 {streak}d</div>}
                      <div style={{ fontSize: 11, color: "#8B949E" }}>{expanded ? "▲" : "▼"}</div>
                    </div>
                  </div>
                  {expanded && (
                    <div style={{ padding: "0 14px 14px", borderTop: "1px solid #21262D" }}>
                      {h.cue && <div style={{ marginTop: 10 }}>
                        <span style={{ fontSize: 11, color: week.theme, fontWeight: 700, textTransform: "uppercase" }}>🎯 Cue: </span>
                        <span style={{ fontSize: 12, color: "#C9D1D9" }}>{h.cue}</span>
                      </div>}
                      {h.atomic && <div style={{ marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "#F4A261", fontWeight: 700, textTransform: "uppercase" }}>⚡ 2-min rule: </span>
                        <span style={{ fontSize: 12, color: "#C9D1D9" }}>{h.atomic}</span>
                      </div>}
                      <button onClick={() => removeHabit(h.id)} style={{
                        marginTop: 12, padding: "6px 12px", borderRadius: 6,
                        border: "1px solid #30363D", background: "transparent", color: "#8B949E", fontSize: 11, cursor: "pointer",
                      }}>Remove habit</button>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "#161B22", border: "1px solid #21262D" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8B949E", marginBottom: 10 }}>+ Add your own habit</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={newHabitName} onChange={e => setNewHabitName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addHabit()}
                  placeholder="e.g. No sugar after 8pm"
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #30363D", background: "#0D1117", color: "#E6EDF3", fontSize: 13, outline: "none" }} />
                <button onClick={addHabit} style={{
                  padding: "10px 16px", borderRadius: 8, border: "none", background: week.theme, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STATS / GRAPH ── */}
        {view === "stats" && (
          <div>
            <div style={{ fontSize: 12, color: "#8B949E", marginBottom: 14 }}>Log an entry at end of day or week. Graph builds over time - saved to cloud.</div>

            <div style={{ padding: 14, borderRadius: 10, background: "#161B22", border: "1px solid #21262D", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: week.theme, marginBottom: 14 }}>Week {weekIndex + 1}, {day.day} - Self-Assessment</div>
              {ASSESS_METRICS.map(({ key, label, icon }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#C9D1D9" }}>{icon} {label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: week.theme }}>{currentAssessment[key]}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={currentAssessment[key]}
                    onChange={e => setCurrentAssessment({ ...currentAssessment, [key]: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: week.theme }} />
                </div>
              ))}
              <button onClick={saveAssessment} disabled={saving} style={{
                width: "100%", padding: "11px", borderRadius: 9, border: "none", cursor: saving ? "not-allowed" : "pointer",
                background: saving ? "#30363D" : week.theme, color: "#fff", fontWeight: 700, fontSize: 13,
              }}>{saving ? "Saving..." : "Save Entry ☁️"}</button>
            </div>

            {assessments.length > 1 && (
              <div style={{ padding: 14, borderRadius: 10, background: "#161B22", border: "1px solid #21262D", marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Progress Over Time</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                    <XAxis dataKey="label" stroke="#8B949E" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} stroke="#8B949E" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 8, fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="Erection" stroke="#52B788" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Libido" stroke="#F4A261" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Energy" stroke="#E76F51" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Recovery" stroke="#2A9D8F" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="AM Wood" stroke="#A78BFA" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Avg" stroke="#E6EDF3" strokeWidth={3} strokeDasharray="4 2" dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {assessments.length > 0 ? (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8B949E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Entry History</div>
                {assessments.slice().reverse().map((a, i) => (
                  <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "#161B22", border: "1px solid #21262D", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: WEEKS[a.week - 1]?.theme || week.theme }}>Week {a.week}, Day {a.day}</span>
                      <span style={{ fontSize: 11, color: "#8B949E" }}>{a.date}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {ASSESS_METRICS.map(({ key, label }) => (
                        <div key={key} style={{ background: "#21262D", borderRadius: 5, padding: "3px 7px", fontSize: 10 }}>
                          <span style={{ color: "#8B949E" }}>{label}: </span>
                          <span style={{ color: "#E6EDF3", fontWeight: 700 }}>{a[key]}</span>
                        </div>
                      ))}
                      <div style={{ background: `${WEEKS[a.week - 1]?.theme || week.theme}33`, borderRadius: 5, padding: "3px 7px", fontSize: 10 }}>
                        <span style={{ color: "#8B949E" }}>Avg: </span>
                        <span style={{ color: WEEKS[a.week - 1]?.theme || week.theme, fontWeight: 700 }}>{avgScore(a)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "28px 16px", color: "#8B949E", fontSize: 12 }}>
                Save your first entry above. Graph appears after 2 entries.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
