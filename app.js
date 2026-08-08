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
  if (!sessions[dateKey]) {
    // Snapshot du plan du jour : l'historique reste juste même si le
    // programme est modifié plus tard.
    const d = new Date(dateKey + "T12:00:00");
    const { daily, specific, title } = exercisesForDay(d.getDay());
    sessions[dateKey] = {
      checked: {},
      names: {},
      title: title,
      planned: [...daily, ...specific].map((e) => ({ id: e.id, name: e.name })),
    };
  }
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
let editDay = null; // "daily" ou 0…6 ; null = jour courant au premier affichage
let editingExoId = null; // id de l'exercice en cours d'édition, ou "new"

const DAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function editedList() {
  return editDay === "daily" ? program.daily.exercises : program.days[editDay].exercises;
}

function renderProgramEditor() {
  if (editDay === null) editDay = new Date().getDay();
  dayTitle.textContent = "Programme";
  daySubtitle.textContent = "Modifie les exercices jour par jour";

  const dayObj = editDay === "daily" ? program.daily : program.days[editDay];
  const list = editedList();

  let html = `<div class="day-chips">`;
  html += `<button class="chip ${editDay === "daily" ? "active" : ""}" data-day="daily">Quotidien</button>`;
  for (const i of [1, 2, 3, 4, 5, 6, 0]) {
    html += `<button class="chip ${editDay === i ? "active" : ""}" data-day="${i}">${DAY_SHORT[i]}</button>`;
  }
  html += `</div>`;

  html += `<input class="day-title-input" id="day-title-input" value="${escapeAttr(dayObj.title)}"
             placeholder="Titre du jour" ${editDay === "daily" ? "disabled" : ""}>`;

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
    const hasProgram = data.program && data.program.daily && data.program.days;
    const hasSessions = data.sessions && typeof data.sessions === "object";
    if (!hasProgram && !hasSessions) {
      alert("Ce fichier ne contient ni programme ni sessions reconnus.");
      return;
    }
    const parts = [hasProgram ? "le programme" : null, hasSessions ? "l'historique" : null].filter(Boolean).join(" et ");
    if (!confirm(`Importer ${parts} ? Les données actuelles seront remplacées.`)) return;
    if (hasProgram) { program = data.program; saveProgram(); }
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
  app.querySelectorAll(".chip").forEach((c) => {
    c.addEventListener("click", () => {
      editDay = c.dataset.day === "daily" ? "daily" : parseInt(c.dataset.day, 10);
      editingExoId = null;
      render();
    });
  });

  const titleInput = document.getElementById("day-title-input");
  if (titleInput && editDay !== "daily") {
    titleInput.addEventListener("change", () => {
      program.days[editDay].title = titleInput.value.trim();
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
    const label = editDay === "daily" ? "la base quotidienne" : DAY_NAMES[editDay];
    if (!confirm(`Réinitialiser ${label} avec le programme d'origine ?`)) return;
    if (editDay === "daily") program.daily = structuredClone(DEFAULT_PROGRAM.daily);
    else program.days[editDay] = structuredClone(DEFAULT_PROGRAM.days[editDay]);
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
