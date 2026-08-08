/* Sport Session Tracker — vanilla JS, localStorage, pas de build */
"use strict";

// ---------- Programme par défaut ----------
// Chaque exercice : { id, name, sets, reps, perSide, duration (secondes, => timer) }
// reps peut être une chaîne ("8–10") ; duration affiche un timer.

const DEFAULT_PROGRAM = {
  daily: {
    title: "Chaque jour",
    subtitle: "5 à 8 min",
    exercises: [
      { id: "d1", name: "Respiration diaphragmatique", duration: 120 },
      { id: "d2", name: "Expiration lente en rentrant doucement le bas-ventre", reps: "8–10" },
      { id: "d3", name: "Contraction douce du périnée sur l'expiration", reps: "8–10" },
      { id: "d4", name: "Marche légère", duration: 900, note: "idéalement 10 à 20 min" },
    ],
  },
  // Clé = getDay() JS : 0 = dimanche … 6 = samedi
  days: {
    1: {
      title: "Sangle abdominale",
      exercises: [
        { id: "mo1", name: "Respiration + engagement abdominal", sets: 2, reps: 8 },
        { id: "mo2", name: "Bascule du bassin au sol", sets: 2, reps: 10 },
        { id: "mo3", name: "Heel slides (glisser un talon)", sets: 2, reps: 8, perSide: "jambe" },
        { id: "mo4", name: "Pont fessier", sets: 3, reps: 10 },
        { id: "mo5", name: "Bird-dog très léger", sets: 2, reps: 6, perSide: "côté" },
      ],
    },
    2: {
      title: "Cardio doux",
      exercises: [
        { id: "tu1", name: "Marche active", duration: 2100, note: "30 à 40 min" },
        { id: "tu2", name: "Respiration / activation abdominale", duration: 300 },
      ],
    },
    3: {
      title: "Renforcement",
      exercises: [
        { id: "we1", name: "Pont fessier", sets: 3, reps: 12 },
        { id: "we2", name: "Squat sur chaise", sets: 3, reps: 10 },
        { id: "we3", name: "Rowing avec élastique", sets: 3, reps: 12 },
        { id: "we4", name: "Bird-dog", sets: 2, reps: 8, perSide: "côté" },
        { id: "we5", name: "Heel slides", sets: 2, reps: 10 },
      ],
    },
    4: {
      title: "Récupération",
      exercises: [
        { id: "th1", name: "Marche tranquille", duration: 1500, note: "20 à 30 min" },
        { id: "th2", name: "Respiration + périnée", duration: 360, note: "5 à 8 min" },
      ],
    },
    5: {
      title: "Sangle abdominale",
      exercises: [
        { id: "fr1", name: "Respiration avec expiration active", sets: 2, reps: 10 },
        { id: "fr2", name: "Dead bug version très facile", sets: 2, reps: 6, perSide: "côté" },
        { id: "fr3", name: "Pont fessier", sets: 3, reps: 12 },
        { id: "fr4", name: "Gainage latéral sur les genoux", sets: 2, duration: 20, perSide: "côté", note: "15–20 s" },
        { id: "fr5", name: "Squat", sets: 3, reps: 10 },
      ],
    },
    6: {
      title: "Activité plaisir",
      exercises: [
        { id: "sa1", name: "Marche, vélo, natation ou autre activité modérée", duration: 2400, note: "30 à 45 min" },
      ],
    },
    0: {
      title: "Repos",
      exercises: [
        { id: "su1", name: "Petite promenade si tu en as envie" },
        { id: "su2", name: "Quelques respirations profondes" },
      ],
    },
  },
};

// ---------- Stockage ----------
const LS_PROGRAM = "sst_program_v1";
const LS_SESSIONS = "sst_sessions_v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

let program = loadJSON(LS_PROGRAM, DEFAULT_PROGRAM);
let sessions = loadJSON(LS_SESSIONS, {});

function saveProgram() { localStorage.setItem(LS_PROGRAM, JSON.stringify(program)); }
function saveSessions() { localStorage.setItem(LS_SESSIONS, JSON.stringify(sessions)); }

// ---------- Helpers ----------
const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function getSession(dateKey) {
  if (!sessions[dateKey]) sessions[dateKey] = { checked: {}, names: {} };
  return sessions[dateKey];
}

function exercisesForDay(dayIdx) {
  const day = program.days[dayIdx] || { title: "", exercises: [] };
  return {
    daily: program.daily.exercises,
    specific: day.exercises,
    title: day.title,
  };
}

function metaText(exo) {
  const parts = [];
  if (exo.sets && exo.reps) parts.push(`<strong>${exo.sets} × ${exo.reps}</strong>`);
  else if (exo.reps) parts.push(`<strong>${exo.reps} répétitions</strong>`);
  else if (exo.sets && exo.duration) parts.push(`<strong>${exo.sets} × ${fmtDuration(exo.duration)}</strong>`);
  else if (exo.duration) parts.push(`<strong>${fmtDuration(exo.duration)}</strong>`);
  if (exo.perSide) parts.push(`par ${exo.perSide}`);
  if (exo.note) parts.push(exo.note);
  return parts.join(" · ");
}

function fmtDuration(sec) {
  if (sec >= 60) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return s ? `${m} min ${s} s` : `${m} min`;
  }
  return `${sec} s`;
}

// ---------- Rendu ----------
const app = document.getElementById("app");
const dayTitle = document.getElementById("day-title");
const daySubtitle = document.getElementById("day-subtitle");

let currentTab = "today";

function render() {
  if (currentTab === "today") renderToday();
  else if (currentTab === "history") renderHistory();
  else renderProgramEditor();
}

function renderToday() {
  const now = new Date();
  const dayIdx = now.getDay();
  const { daily, specific, title } = exercisesForDay(dayIdx);
  const session = getSession(todayKey());

  dayTitle.textContent = DAY_NAMES[dayIdx] + (title ? " — " + title : "");
  daySubtitle.textContent = now.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  const all = [...daily, ...specific];
  const doneCount = all.filter((e) => session.checked[e.id]).length;

  let html = `
    <div class="progress-wrap">
      <div class="progress-text">${doneCount} / ${all.length} exercices faits</div>
      <div class="progress-bar"><div style="width:${all.length ? (100 * doneCount) / all.length : 0}%"></div></div>
    </div>`;

  html += `<div class="section-label">Base quotidienne</div>`;
  html += daily.map((e) => exoCard(e, session)).join("");
  if (specific.length) {
    html += `<div class="section-label">${title || "Séance du jour"}</div>`;
    html += specific.map((e) => exoCard(e, session)).join("");
  }

  app.innerHTML = html;

  app.querySelectorAll(".exo").forEach((el) => {
    el.addEventListener("click", () => toggleExo(el.dataset.id, el.dataset.name));
  });
}

function exoCard(exo, session) {
  const done = !!session.checked[exo.id];
  const meta = metaText(exo);
  return `
    <div class="exo ${done ? "done" : ""}" data-id="${exo.id}" data-name="${escapeAttr(exo.name)}">
      <div class="check">✓</div>
      <div class="info">
        <div class="name">${escapeHtml(exo.name)}</div>
        ${meta ? `<div class="meta">${meta}</div>` : ""}
      </div>
    </div>`;
}

function toggleExo(id, name) {
  const session = getSession(todayKey());
  if (session.checked[id]) {
    delete session.checked[id];
    delete session.names[id];
  } else {
    session.checked[id] = Date.now();
    session.names[id] = name;
  }
  saveSessions();
  render();
}

function renderHistory() {
  dayTitle.textContent = "Historique";
  daySubtitle.textContent = "";
  app.innerHTML = `<div class="empty">Bientôt : la liste de tes précédentes sessions.</div>`;
}

function renderProgramEditor() {
  dayTitle.textContent = "Programme";
  daySubtitle.textContent = "";
  app.innerHTML = `<div class="empty">Bientôt : modification du programme jour par jour, export et import JSON.</div>`;
}

// ---------- Échappement ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

// ---------- Tabs ----------
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

render();
