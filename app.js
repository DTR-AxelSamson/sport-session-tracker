/* Sport Session Tracker — vanilla JS, localStorage, pas de build */
"use strict";

// ---------- Programme par défaut ----------
// Programme en 3 blocs de 4 semaines. Un seul bloc est actif à la fois
// (sélection dans l'onglet Programme) ; chaque bloc répartit ses séances
// sur la semaine : Lun = Force A, Mar = Sortie 1, Mer = Force B,
// Jeu = repos, Ven = Sortie 2, Sam = repos, Dim = Sortie 3.
// Chaque exercice : { id, name, sets, reps, perSide, duration (secondes, => timer), note }
// reps peut être une chaîne ("8–10", "20 m") ; duration affiche un timer.
// Clé de days = getDay() JS : 0 = dimanche … 6 = samedi.

const PAIR_HINT = "Enchaîne par paires pour gagner du temps : A1 + A2 en alternance, puis B1 + B2, puis C1 + C2.";

const DEFAULT_PROGRAM = {
  activeBlock: "1",
  // Affiché chaque jour, quel que soit le bloc actif.
  daily: {
    title: "Chaque jour",
    exercises: [
      { id: "dg1", name: "Gainage 1 min — matin", duration: 60, note: "planche, bassin neutre, tu respires" },
      { id: "dg2", name: "Gainage 1 min — soir", duration: 60, note: "planche, bassin neutre, tu respires" },
    ],
  },
  blocks: {
    "1": {
      name: "Bloc 1 — Fondations (sem. 1–4)",
      gate: "Objectif : réinstaller le réflexe respiration-transverse sous charge légère, et remettre la course en place proprement.",
      days: {
        1: {
          title: "Force A",
          hint: PAIR_HINT,
          exercises: [
            { id: "b1a1", name: "A1 · Pont fessier", sets: 3, reps: 12, note: "Expire en montant. Côtes basses, pas de cambrure." },
            { id: "b1a2", name: "A2 · Rowing élastique", sets: 3, reps: 12, note: "Omoplates vers les poches arrière." },
            { id: "b1a3", name: "B1 · Squat (chaise derrière)", sets: 3, reps: 10, note: "Expire en remontant." },
            { id: "b1a4", name: "B2 · Dead bug, jambes pliées 90°", sets: 2, reps: 8, perSide: "côté", note: "Bas du dos collé au sol. Un seul bras + jambe opposée à la fois." },
            { id: "b1a5", name: "C1 · Planche sur les pieds", sets: 3, duration: 30, note: "Bassin légèrement rétroversé, fessiers serrés, tu respires." },
            { id: "b1a6", name: "C2 · Portés valise (poids d'un seul côté)", sets: 2, reps: "20 m", perSide: "bras", note: "Épaules à niveau, on ne penche pas." },
          ],
        },
        2: {
          title: "Course — Sortie 1",
          exercises: [
            { id: "b1r1", name: "Course facile", duration: 1500, note: "20 à 25 min — test de la conversation : tu dois pouvoir parler en phrases complètes" },
            { id: "b1r2", name: "Cadence : compte tes pas sur 15 s (× 4)", duration: 15, note: "cible 170–180 pas/min, foulées plus courtes" },
          ],
        },
        3: {
          title: "Force B",
          hint: PAIR_HINT,
          exercises: [
            { id: "b1b1", name: "A1 · Charnière de hanche (élastique ou poids)", sets: 3, reps: 10, note: "Dos neutre, fesses vers l'arrière, expire en remontant." },
            { id: "b1b2", name: "A2 · Pallof press à l'élastique", sets: 2, reps: 10, perSide: "côté", note: "Élastique sur le côté, bras tendus devant sans laisser le tronc tourner — l'anti-rotation de référence pour un diastasis." },
            { id: "b1b3", name: "B1 · Fente arrière", sets: 2, reps: 8, perSide: "jambe", note: "Sur place, sans charge." },
            { id: "b1b4", name: "B2 · Gainage latéral sur les genoux", sets: 2, duration: 25, perSide: "côté", note: "Hanche haute, épaules alignées." },
            { id: "b1b5", name: "C1 · Bird-dog", sets: 2, reps: 8, perSide: "côté", note: "Pause 2 s en extension." },
            { id: "b1b6", name: "C2 · Montées de mollets", sets: 3, reps: 15, note: "Amortit les impacts de la course." },
          ],
        },
        4: {
          title: "Repos",
          exercises: [
            { id: "b1x1", name: "Marche tranquille (optionnelle)", duration: 1200 },
          ],
        },
        5: {
          title: "Course — Sortie 2",
          exercises: [
            { id: "b1r3", name: "Course facile", duration: 1500, note: "20 à 25 min, même allure que la sortie 1" },
            { id: "b1r4", name: "Cadence : compte tes pas sur 15 s (× 4)", duration: 15, note: "cible 170–180 pas/min, foulées plus courtes" },
          ],
        },
        6: {
          title: "Repos",
          exercises: [
            { id: "b1x2", name: "Marche tranquille (optionnelle)", duration: 1200 },
          ],
        },
        0: {
          title: "Course — Sortie 3",
          exercises: [
            { id: "b1r5", name: "Course facile", duration: 1800, note: "25 à 30 min, même allure" },
            { id: "b1r6", name: "Cadence : compte tes pas sur 15 s (× 4)", duration: 15, note: "cible 170–180 pas/min, foulées plus courtes" },
          ],
        },
      },
    },
    "2": {
      name: "Bloc 2 — Charge (sem. 5–8)",
      gate: "Feu vert pour ce bloc : planche 45 s propre sans coning, aucune pesanteur après les courses, respiration fluide sur tous les exercices. Sinon, prolonge le bloc 1 d'une ou deux semaines — ce n'est pas un retard, c'est le programme qui fonctionne.",
      days: {
        1: {
          title: "Force A",
          hint: PAIR_HINT,
          exercises: [
            { id: "b2a1", name: "A1 · Pont fessier une jambe", sets: 3, reps: 8, perSide: "jambe", note: "Bassin de niveau, pas de bascule." },
            { id: "b2a2", name: "A2 · Rowing élastique", sets: 3, reps: 15, note: "Plus de tension." },
            { id: "b2a3", name: "B1 · Squat avec poids tenu devant", sets: 3, reps: 10 },
            { id: "b2a4", name: "B2 · Dead bug, jambe qui s'allonge davantage", sets: 2, reps: 10, perSide: "côté", note: "Le talon frôle le sol. Tu recules si le dos décolle." },
            { id: "b2a5", name: "C1 · Planche sur les pieds", sets: 3, duration: 45, note: "45–60 s — c'est la cible de ta kiné." },
            { id: "b2a6", name: "C2 · Portés valise plus lourds", sets: 3, reps: "25 m", perSide: "bras" },
          ],
        },
        2: {
          title: "Course — Sortie 1",
          exercises: [
            { id: "b2r1", name: "Course facile", duration: 1800, note: "25 à 30 min" },
          ],
        },
        3: {
          title: "Force B",
          hint: PAIR_HINT,
          exercises: [
            { id: "b2b1", name: "A1 · Soulevé de terre roumain, poids", sets: 3, reps: 12, note: "Charge en hausse." },
            { id: "b2b2", name: "A2 · Pallof press avec un pas de côté", sets: 3, reps: 10, perSide: "côté" },
            { id: "b2b3", name: "B1 · Split squat (pied arrière sur la chaise)", sets: 3, reps: 8, perSide: "jambe" },
            { id: "b2b4", name: "B2 · Gainage latéral sur les pieds", sets: 2, duration: 25, perSide: "côté", note: "Repasse aux genoux si la hanche tombe." },
            { id: "b2b5", name: "C1 · Bird-dog avec pause 3 s", sets: 3, reps: 8, perSide: "côté" },
            { id: "b2b6", name: "C2 · Montées de mollets une jambe", sets: 3, reps: 12, perSide: "jambe" },
          ],
        },
        4: {
          title: "Repos",
          exercises: [
            { id: "b2x1", name: "Marche tranquille (optionnelle)", duration: 1200 },
          ],
        },
        5: {
          title: "Course — Sortie 2",
          exercises: [
            { id: "b2r2", name: "Course facile", duration: 1500, note: "25 min" },
            { id: "b2r3", name: "Lignes droites en accélération progressive", reps: "4–6", duration: 15, note: "pas de sprint, 1 min de marche entre chaque — premiers impacts plus forts, en très petites doses" },
          ],
        },
        6: {
          title: "Repos",
          exercises: [
            { id: "b2x2", name: "Marche tranquille (optionnelle)", duration: 1200 },
          ],
        },
        0: {
          title: "Course — Sortie 3",
          exercises: [
            { id: "b2r4", name: "Course facile", duration: 2100, note: "30 à 35 min" },
          ],
        },
      },
    },
    "3": {
      name: "Bloc 3 — Consolidation (sem. 9–12)",
      gate: "Feu vert pour ce bloc : planche 60 s propre, gainage latéral sur les pieds tenu 30 s, aucun symptôme après les lignes droites.",
      days: {
        1: {
          title: "Force A",
          hint: PAIR_HINT,
          exercises: [
            { id: "b3a1", name: "A1 · Hip thrust (épaules sur le canapé), avec poids", sets: 3, reps: 12 },
            { id: "b3a2", name: "A2 · Rowing élastique un bras", sets: 3, reps: 12, perSide: "bras", note: "Anti-rotation en prime." },
            { id: "b3a3", name: "B1 · Squat chargé", sets: 4, reps: 8 },
            { id: "b3a4", name: "B2 · Dead bug complet, jambe tendue", sets: 3, reps: 10, perSide: "côté" },
            { id: "b3a5", name: "C1 · Planche avec touche d'épaule alternée", sets: 3, reps: "10 touches", note: "Le bassin ne bouge pas d'un millimètre. Le vrai test." },
            { id: "b3a6", name: "C2 · Portés valise lourds", sets: 3, reps: "30 m", perSide: "bras" },
          ],
        },
        2: {
          title: "Course — Sortie 1",
          exercises: [
            { id: "b3r1", name: "Course facile", duration: 1800, note: "30 min" },
          ],
        },
        3: {
          title: "Force B",
          hint: PAIR_HINT,
          exercises: [
            { id: "b3b1", name: "A1 · Soulevé de terre une jambe", sets: 3, reps: 8, perSide: "jambe" },
            { id: "b3b2", name: "A2 · Pallof press à genoux, en rotation lente", sets: 3, reps: 10, perSide: "côté" },
            { id: "b3b3", name: "B1 · Fente marchée avec poids", sets: 3, reps: 10, perSide: "jambe" },
            { id: "b3b4", name: "B2 · Gainage latéral pieds + levée de jambe", sets: 3, reps: 8, perSide: "côté" },
            { id: "b3b5", name: "C1 · Bear crawl (genoux à 2 cm du sol)", sets: 3, duration: 20 },
            { id: "b3b6", name: "C2 · Sauts légers sur place, réception souple", sets: 3, duration: 20, note: "Prépare aux impacts. Aucune fuite tolérée." },
          ],
        },
        4: {
          title: "Repos",
          exercises: [
            { id: "b3x1", name: "Marche tranquille (optionnelle)", duration: 1200 },
          ],
        },
        5: {
          title: "Course — Sortie 2 (fractionné)",
          exercises: [
            { id: "b3r2", name: "Échauffement course facile", duration: 600, note: "10 min" },
            { id: "b3r3", name: "Fractionné : 1 min soutenu / 1 min marche", sets: 6, duration: 60, note: "6 répétitions — le timer couvre la minute soutenue" },
            { id: "b3r4", name: "Retour au calme", duration: 300, note: "5 min" },
          ],
        },
        6: {
          title: "Repos",
          exercises: [
            { id: "b3x2", name: "Marche tranquille (optionnelle)", duration: 1200 },
          ],
        },
        0: {
          title: "Course — Sortie 3",
          exercises: [
            { id: "b3r5", name: "Course facile, ou côtes douces", duration: 2400, note: "35 à 40 min — les côtes chargent moins l'impact que le plat rapide" },
          ],
        },
      },
    },
  },
};

// ---------- Stockage ----------
// v2 : passage au programme en blocs (l'ancien programme v1 est remplacé).
const LS_PROGRAM = "sst_program_v2";
const LS_SESSIONS = "sst_sessions_v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

// Clone profond du défaut : sans ça, éditer le programme mutait DEFAULT_PROGRAM
// lui-même et « Réinitialiser ce jour » restaurait la version modifiée.
let program = loadJSON(LS_PROGRAM, null) || structuredClone(DEFAULT_PROGRAM);
let sessions = loadJSON(LS_SESSIONS, {});

// Migration : les programmes v2 stockés avant l'ajout de la section
// quotidienne n'ont pas de champ daily.
if (!program.daily) {
  program.daily = structuredClone(DEFAULT_PROGRAM.daily);
  saveProgram();
}

function saveProgram() { localStorage.setItem(LS_PROGRAM, JSON.stringify(program)); }
function saveSessions() { localStorage.setItem(LS_SESSIONS, JSON.stringify(sessions)); }

// ---------- Helpers ----------
const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function getSession(dateKey) {
  if (!sessions[dateKey]) {
    // Snapshot du plan du jour : l'historique reste juste même si le
    // programme est modifié plus tard.
    const d = new Date(dateKey + "T12:00:00");
    const day = exercisesForDay(d.getDay());
    sessions[dateKey] = {
      checked: {},
      names: {},
      title: day.title + " · Bloc " + program.activeBlock,
      planned: [...program.daily.exercises, ...day.exercises].map((e) => ({ id: e.id, name: e.name })),
    };
  }
  return sessions[dateKey];
}

function activeBlock() {
  return program.blocks[program.activeBlock] || { name: "", days: {} };
}

function exercisesForDay(dayIdx) {
  const day = activeBlock().days[dayIdx];
  return day || { title: "", exercises: [] };
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
  const day = exercisesForDay(dayIdx);
  const session = getSession(todayKey());

  dayTitle.textContent = DAY_NAMES[dayIdx] + (day.title ? " — " + day.title : "");
  daySubtitle.textContent = now.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
    + (activeBlock().name ? " · " + activeBlock().name : "");

  const daily = program.daily.exercises;
  const all = [...daily, ...day.exercises];
  const doneCount = all.filter((e) => session.checked[e.id]).length;

  let html = `
    <div class="progress-wrap">
      <div class="progress-text">${doneCount} / ${all.length} exercices faits</div>
      <div class="progress-bar"><div style="width:${all.length ? (100 * doneCount) / all.length : 0}%"></div></div>
    </div>`;

  if (daily.length) {
    html += `<div class="section-label">${escapeHtml(program.daily.title || "Chaque jour")}</div>`;
    html += daily.map((e) => exoCard(e, session)).join("");
  }
  if (day.exercises.length) {
    html += `<div class="section-label">${escapeHtml(day.title || "Séance du jour")}</div>`;
    if (day.hint) html += `<p class="day-hint">${escapeHtml(day.hint)}</p>`;
    html += day.exercises.map((e) => exoCard(e, session)).join("");
  }
  if (!all.length) html += `<div class="empty">Rien de prévu aujourd'hui.<br>Tu peux ajouter des exercices dans l'onglet Programme.</div>`;

  app.innerHTML = html;

  app.querySelectorAll(".exo").forEach((el) => {
    el.addEventListener("click", () => toggleExo(el.dataset.id, el.dataset.name));
  });
  bindTimerControls();
}

function exoCard(exo, session) {
  const done = !!session.checked[exo.id];
  const meta = metaText(exo);
  const hasTimer = !!exo.duration;
  const isOpen = timer && timer.exoId === exo.id;
  return `
    <div class="exo ${done ? "done" : ""}" data-id="${exo.id}" data-name="${escapeAttr(exo.name)}">
      <div class="row">
        <div class="check">✓</div>
        <div class="info">
          <div class="name">${escapeHtml(exo.name)}</div>
          ${meta ? `<div class="meta">${meta}</div>` : ""}
        </div>
        ${hasTimer ? `<button class="timer-chip ${isOpen ? "open" : ""}" data-timer="${exo.id}" data-duration="${exo.duration}">⏱</button>` : ""}
      </div>
      ${isOpen ? timerPanel() : ""}
    </div>`;
}

// ---------- Timer ----------
let timer = null; // { exoId, remaining, total, running }
let timerInterval = null;

function timerPanel() {
  return `
    <div class="timer-panel">
      <div class="timer-digits ${timer.remaining === 0 ? "finished" : ""}">${fmtClock(timer.remaining)}</div>
      <div class="timer-controls">
        <button class="tbtn small" data-taction="minus">−15 s</button>
        <button class="tbtn main" data-taction="startpause">${timer.running ? "Pause" : (timer.remaining === 0 ? "Encore" : "Démarrer")}</button>
        <button class="tbtn small" data-taction="plus">+15 s</button>
      </div>
      <button class="tbtn ghost" data-taction="close">Fermer</button>
    </div>`;
}

function fmtClock(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function bindTimerControls() {
  app.querySelectorAll(".timer-chip").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = btn.dataset.timer;
      if (timer && timer.exoId === id) closeTimer();
      else openTimer(id, parseInt(btn.dataset.duration, 10));
    });
  });
  app.querySelectorAll("[data-taction]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      timerAction(btn.dataset.taction);
    });
  });
  // Un tap sur le fond du panneau ne doit pas cocher/décocher la carte
  app.querySelectorAll(".timer-panel").forEach((panel) => {
    panel.addEventListener("click", (ev) => ev.stopPropagation());
  });
}

function openTimer(exoId, duration) {
  stopTicking();
  timer = { exoId, remaining: duration, total: duration, running: false };
  render();
}

function closeTimer() {
  stopTicking();
  timer = null;
  render();
}

function timerAction(action) {
  if (!timer) return;
  if (action === "close") return closeTimer();
  if (action === "minus") timer.remaining = Math.max(0, timer.remaining - 15);
  if (action === "plus") timer.remaining += 15;
  if (action === "startpause") {
    if (timer.running) {
      stopTicking();
      timer.running = false;
    } else {
      if (timer.remaining === 0) timer.remaining = timer.total; // "Encore"
      timer.running = true;
      startTicking();
    }
  }
  updateTimerDisplay();
}

function startTicking() {
  stopTicking();
  timerInterval = setInterval(() => {
    if (!timer || !timer.running) return;
    timer.remaining -= 1;
    if (timer.remaining <= 0) {
      timer.remaining = 0;
      timer.running = false;
      stopTicking();
      ringBell();
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTicking() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateTimerDisplay() {
  const digits = app.querySelector(".timer-digits");
  if (!digits) return;
  digits.textContent = fmtClock(timer.remaining);
  digits.classList.toggle("finished", timer.remaining === 0);
  const main = app.querySelector('[data-taction="startpause"]');
  if (main) main.textContent = timer.running ? "Pause" : (timer.remaining === 0 ? "Encore" : "Démarrer");
}

function ringBell() {
  if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 500]);
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch (e) { /* audio indisponible : la vibration suffit */ }
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

// ---------- Historique ----------
let expandedDates = new Set();

function renderHistory() {
  dayTitle.textContent = "Historique";
  daySubtitle.textContent = "";

  const tKey = todayKey();
  const dates = Object.keys(sessions)
    .filter((k) => Object.keys(sessions[k].checked || {}).length > 0)
    .sort()
    .reverse();

  if (!dates.length) {
    app.innerHTML = `<div class="empty">Aucune session enregistrée pour l'instant.<br>Coche des exercices dans l'onglet Séance !</div>`;
    return;
  }

  app.innerHTML = dates.map((key) => {
    const s = sessions[key];
    const doneCount = Object.keys(s.checked).length;
    const planned = s.planned || Object.keys(s.names || {}).map((id) => ({ id, name: s.names[id] }));
    const total = Math.max(planned.length, doneCount);
    const d = new Date(key + "T12:00:00");
    const label = key === tKey
      ? "Aujourd'hui"
      : d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    const pct = total ? Math.round((100 * doneCount) / total) : 0;
    const open = expandedDates.has(key);

    let detail = "";
    if (open) {
      detail = `<div class="hist-detail">` + planned.map((p) => {
        const done = !!s.checked[p.id];
        return `<div class="hist-exo ${done ? "done" : ""}">${done ? "✓" : "○"} ${escapeHtml(p.name)}</div>`;
      }).join("") + `</div>`;
    }

    return `
      <div class="hist-card ${pct === 100 ? "complete" : ""}" data-date="${key}">
        <div class="hist-head">
          <div class="hist-main">
            <div class="name">${label}${s.title ? ` — ${escapeHtml(s.title)}` : ""}</div>
            <div class="meta">${doneCount} / ${total} exercices</div>
          </div>
          <div class="hist-pct">${pct === 100 ? "✓" : pct + "%"}</div>
        </div>
        <div class="progress-bar"><div style="width:${pct}%"></div></div>
        ${detail}
      </div>`;
  }).join("");

  app.querySelectorAll(".hist-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.date;
      if (expandedDates.has(key)) expandedDates.delete(key);
      else expandedDates.add(key);
      render();
    });
  });
}

// ---------- Éditeur de programme ----------
let editDay = null; // 0…6 ; null = jour courant au premier affichage
let editingExoId = null; // id de l'exercice en cours d'édition, ou "new"

const DAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function editedDay() {
  if (editDay === "daily") {
    if (!program.daily) program.daily = { title: "Chaque jour", exercises: [] };
    return program.daily;
  }
  const days = activeBlock().days;
  if (!days[editDay]) days[editDay] = { title: "", exercises: [] };
  return days[editDay];
}

function editedList() {
  return editedDay().exercises;
}

function renderProgramEditor() {
  if (editDay === null) editDay = new Date().getDay();
  const block = activeBlock();
  dayTitle.textContent = "Programme";
  daySubtitle.textContent = "Le bloc actif est celui affiché dans l'onglet Séance";

  const dayObj = editedDay();
  const list = editedList();

  // Sélecteur de bloc
  let html = `<div class="day-chips">`;
  for (const key of Object.keys(program.blocks)) {
    html += `<button class="chip ${program.activeBlock === key ? "active" : ""}" data-block="${escapeAttr(key)}">Bloc ${escapeHtml(key)}</button>`;
  }
  html += `</div>`;
  if (block.name) html += `<p class="block-name">${escapeHtml(block.name)}</p>`;
  if (block.gate) html += `<p class="data-hint">${escapeHtml(block.gate)}</p>`;

  html += `<div class="day-chips">`;
  html += `<button class="chip ${editDay === "daily" ? "active" : ""}" data-day="daily">Quotidien</button>`;
  for (const i of [1, 2, 3, 4, 5, 6, 0]) {
    html += `<button class="chip ${editDay === i ? "active" : ""}" data-day="${i}">${DAY_SHORT[i]}</button>`;
  }
  html += `</div>`;

  if (editDay === "daily") html += `<p class="data-hint">Ces exercices s'affichent chaque jour, quel que soit le bloc.</p>`;

  html += `<input class="day-title-input" id="day-title-input" value="${escapeAttr(dayObj.title)}"
             placeholder="Titre du jour">`;

  html += list.map((exo, idx) => {
    if (editingExoId === exo.id) return exoEditForm(exo, false);
    return `
      <div class="edit-row" data-edit="${exo.id}">
        <div class="edit-row-main">
          <div class="name">${escapeHtml(exo.name)}</div>
          <div class="meta">${metaText(exo) || "—"}</div>
        </div>
        <div class="edit-row-actions">
          <button class="mini" data-move="up" data-idx="${idx}" ${idx === 0 ? "disabled" : ""}>↑</button>
          <button class="mini" data-move="down" data-idx="${idx}" ${idx === list.length - 1 ? "disabled" : ""}>↓</button>
        </div>
      </div>`;
  }).join("");

  if (editingExoId === "new") html += exoEditForm({ id: "new", name: "" }, true);
  else html += `<button class="big-action" id="add-exo">+ Ajouter un exercice</button>`;

  html += `<button class="big-action danger-ghost" id="reset-day">Réinitialiser ce jour (programme d'origine)</button>`;

  html += `
    <div class="section-label">Données</div>
    <button class="big-action" id="export-json">⬇ Exporter les données (JSON)</button>
    <button class="big-action" id="import-json">⬆ Importer des données (JSON)</button>
    <input type="file" id="import-file" accept=".json,application/json" hidden>
    <p class="data-hint">L'export contient le programme et tout l'historique.
    L'import remplace les données actuelles.</p>`;

  app.innerHTML = html;
  bindEditorEvents();
  bindDataEvents();
}

// ---------- Export / import JSON ----------
function bindDataEvents() {
  document.getElementById("export-json").addEventListener("click", exportJSON);
  const fileInput = document.getElementById("import-file");
  document.getElementById("import-json").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) importJSON(file);
    fileInput.value = "";
  });
}

function exportJSON() {
  const data = {
    app: "sport-session-tracker",
    version: 1,
    exportedAt: new Date().toISOString(),
    program: program,
    sessions: sessions,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sport-tracker-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

// Accepte le format courant (blocs + daily) et l'ancien format v1
// (daily + days), converti en un bloc unique.
function normalizeProgram(p) {
  if (!p || typeof p !== "object") return null;
  if (p.blocks && p.activeBlock && p.blocks[p.activeBlock]) {
    if (!p.daily) p.daily = structuredClone(DEFAULT_PROGRAM.daily);
    return p;
  }
  if (p.daily && p.days) {
    return {
      activeBlock: "1",
      daily: p.daily,
      blocks: { "1": { name: "Programme importé (ancien format)", days: p.days } },
    };
  }
  return null;
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch (e) {
      alert("Fichier illisible : ce n'est pas du JSON valide.");
      return;
    }
    const normalized = normalizeProgram(data.program);
    const hasSessions = data.sessions && typeof data.sessions === "object";
    if (!normalized && !hasSessions) {
      alert("Ce fichier ne contient ni programme ni sessions reconnus.");
      return;
    }
    const parts = [normalized ? "le programme" : null, hasSessions ? "l'historique" : null].filter(Boolean).join(" et ");
    if (!confirm(`Importer ${parts} ? Les données actuelles seront remplacées.`)) return;
    if (normalized) { program = normalized; saveProgram(); }
    if (hasSessions) { sessions = data.sessions; saveSessions(); }
    editingExoId = null;
    render();
    alert("Import réussi ✓");
  };
  reader.onerror = () => alert("Impossible de lire le fichier.");
  reader.readAsText(file);
}

function exoEditForm(exo, isNew) {
  const durMin = exo.duration ? Math.floor(exo.duration / 60) : "";
  const durSec = exo.duration ? exo.duration % 60 : "";
  return `
    <div class="edit-form" data-form="${exo.id}">
      <label>Nom
        <input type="text" id="f-name" value="${escapeAttr(exo.name || "")}" placeholder="Nom de l'exercice">
      </label>
      <div class="form-grid">
        <label>Séries
          <input type="number" id="f-sets" inputmode="numeric" min="0" value="${exo.sets || ""}">
        </label>
        <label>Répétitions
          <input type="text" id="f-reps" inputmode="numeric" value="${escapeAttr(exo.reps != null ? String(exo.reps) : "")}" placeholder="10 ou 8–10">
        </label>
      </div>
      <div class="form-grid">
        <label>Timer — min
          <input type="number" id="f-min" inputmode="numeric" min="0" value="${durMin}">
        </label>
        <label>Timer — s
          <input type="number" id="f-sec" inputmode="numeric" min="0" max="59" value="${durSec}">
        </label>
      </div>
      <div class="form-grid">
        <label>Par côté / jambe
          <select id="f-perside">
            <option value="" ${!exo.perSide ? "selected" : ""}>Non</option>
            <option value="côté" ${exo.perSide === "côté" ? "selected" : ""}>Par côté</option>
            <option value="jambe" ${exo.perSide === "jambe" ? "selected" : ""}>Par jambe</option>
            <option value="bras" ${exo.perSide === "bras" ? "selected" : ""}>Par bras</option>
          </select>
        </label>
        <label>Note
          <input type="text" id="f-note" value="${escapeAttr(exo.note || "")}" placeholder="ex. 20 à 30 min">
        </label>
      </div>
      <div class="form-actions">
        <button class="tbtn main" id="f-save">Enregistrer</button>
        <button class="tbtn small" id="f-cancel">Annuler</button>
      </div>
      ${isNew ? "" : `<button class="big-action danger-ghost" id="f-delete">Supprimer cet exercice</button>`}
    </div>`;
}

function bindEditorEvents() {
  app.querySelectorAll(".chip[data-block]").forEach((c) => {
    c.addEventListener("click", () => {
      program.activeBlock = c.dataset.block;
      editingExoId = null;
      saveProgram();
      render();
    });
  });

  app.querySelectorAll(".chip[data-day]").forEach((c) => {
    c.addEventListener("click", () => {
      editDay = c.dataset.day === "daily" ? "daily" : parseInt(c.dataset.day, 10);
      editingExoId = null;
      render();
    });
  });

  const titleInput = document.getElementById("day-title-input");
  if (titleInput) {
    titleInput.addEventListener("change", () => {
      editedDay().title = titleInput.value.trim();
      saveProgram();
    });
  }

  app.querySelectorAll(".edit-row").forEach((row) => {
    row.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-move]")) return;
      editingExoId = row.dataset.edit;
      render();
    });
  });

  app.querySelectorAll("[data-move]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const list = editedList();
      const idx = parseInt(btn.dataset.idx, 10);
      const to = btn.dataset.move === "up" ? idx - 1 : idx + 1;
      if (to < 0 || to >= list.length) return;
      [list[idx], list[to]] = [list[to], list[idx]];
      saveProgram();
      render();
    });
  });

  const addBtn = document.getElementById("add-exo");
  if (addBtn) addBtn.addEventListener("click", () => { editingExoId = "new"; render(); });

  const resetBtn = document.getElementById("reset-day");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (editDay === "daily") {
      if (!confirm("Réinitialiser la section quotidienne avec le programme d'origine ?")) return;
      program.daily = structuredClone(DEFAULT_PROGRAM.daily);
    } else {
      const defBlock = DEFAULT_PROGRAM.blocks[program.activeBlock];
      if (!defBlock || !defBlock.days[editDay]) {
        alert("Pas de version d'origine pour ce jour dans ce bloc.");
        return;
      }
      if (!confirm(`Réinitialiser ${DAY_NAMES[editDay]} (bloc ${program.activeBlock}) avec le programme d'origine ?`)) return;
      activeBlock().days[editDay] = structuredClone(defBlock.days[editDay]);
    }
    editingExoId = null;
    saveProgram();
    render();
  });

  const saveBtn = document.getElementById("f-save");
  if (saveBtn) saveBtn.addEventListener("click", saveExoForm);
  const cancelBtn = document.getElementById("f-cancel");
  if (cancelBtn) cancelBtn.addEventListener("click", () => { editingExoId = null; render(); });
  const deleteBtn = document.getElementById("f-delete");
  if (deleteBtn) deleteBtn.addEventListener("click", () => {
    if (!confirm("Supprimer cet exercice ?")) return;
    const list = editedList();
    const idx = list.findIndex((e) => e.id === editingExoId);
    if (idx >= 0) list.splice(idx, 1);
    editingExoId = null;
    saveProgram();
    render();
  });
}

function saveExoForm() {
  const name = document.getElementById("f-name").value.trim();
  if (!name) { alert("Le nom est obligatoire."); return; }
  const sets = parseInt(document.getElementById("f-sets").value, 10);
  const repsRaw = document.getElementById("f-reps").value.trim();
  const min = parseInt(document.getElementById("f-min").value, 10) || 0;
  const sec = parseInt(document.getElementById("f-sec").value, 10) || 0;
  const perSide = document.getElementById("f-perside").value;
  const note = document.getElementById("f-note").value.trim();

  const exo = { id: editingExoId === "new" ? "u" + Date.now().toString(36) : editingExoId, name };
  if (sets > 0) exo.sets = sets;
  if (repsRaw) exo.reps = /^\d+$/.test(repsRaw) ? parseInt(repsRaw, 10) : repsRaw;
  const duration = min * 60 + sec;
  if (duration > 0) exo.duration = duration;
  if (perSide) exo.perSide = perSide;
  if (note) exo.note = note;

  const list = editedList();
  if (editingExoId === "new") {
    list.push(exo);
  } else {
    const idx = list.findIndex((e) => e.id === editingExoId);
    if (idx >= 0) list[idx] = exo;
  }
  editingExoId = null;
  saveProgram();
  render();
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

// ---------- PWA ----------
// Enregistré seulement en contexte http(s) : en ouverture directe du fichier
// (file://) les service workers ne sont pas disponibles.
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* hors ligne au 1er chargement */ });
}
