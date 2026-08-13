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
            { id: "b1a2", name: "A2 · Bird-dog", sets: 3, reps: 12, note: "En alternance, bras + jambe opposés, dos stable." },
            { id: "b1a3", name: "B1 · Squat (chaise derrière)", sets: 3, reps: 10, note: "Expire en remontant." },
            { id: "b1a4", name: "B2 · Dead bug, jambes pliées 90°", sets: 2, reps: 8, perSide: "côté", note: "Bas du dos collé au sol. Un seul bras + jambe opposée à la fois." },
            { id: "b1a5", name: "C1 · Planche sur les pieds", sets: 3, duration: 30, note: "Bassin légèrement rétroversé, fessiers serrés, tu respires." },
            { id: "b1a6", name: "C2 · Marche sur place avec gainage doux", sets: 2, duration: 30, note: "Abdos engagés, épaules basses, sans pencher." },
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
            { id: "b1b1", name: "A1 · Charnière de hanche au mur", sets: 3, reps: 10, note: "Dos neutre, les fesses reculent jusqu'à toucher le mur, expire en remontant." },
            { id: "b1b2", name: "A2 · Dead bug avec expiration", sets: 2, reps: 10, perSide: "côté", note: "Expire longuement en descendant bras + jambe opposés, bas du dos collé au sol." },
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
            { id: "b2a2", name: "A2 · Bird-dog", sets: 3, reps: 15, note: "En alternance, plus lent qu'au bloc 1." },
            { id: "b2a3", name: "B1 · Squat avec poids tenu devant", sets: 3, reps: 10 },
            { id: "b2a4", name: "B2 · Dead bug, jambe qui s'allonge davantage", sets: 2, reps: 10, perSide: "côté", note: "Le talon frôle le sol. Tu recules si le dos décolle." },
            { id: "b2a5", name: "C1 · Planche sur les pieds", sets: 3, duration: 45, note: "45–60 s — c'est la cible de ta kiné." },
            { id: "b2a6", name: "C2 · Marche sur place avec gainage doux", sets: 3, duration: 40, note: "Abdos engagés, épaules basses." },
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
            { id: "b2b1", name: "A1 · Good morning au poids du corps", sets: 3, reps: 12, note: "Mains derrière la tête, dos neutre, fesses vers l'arrière." },
            { id: "b2b2", name: "A2 · Bird-dog avec déplacement contrôlé", sets: 3, reps: 10, perSide: "côté", note: "Avance légèrement main et genou opposés, bassin immobile." },
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
            { id: "b3a1", name: "A1 · Pont fessier au sol", sets: 3, reps: 12, note: "Expire en montant, pause 2 s en haut." },
            { id: "b3a2", name: "A2 · Bird-dog avec tirage du coude", sets: 3, reps: 12, perSide: "bras", note: "En position bird-dog, ramène le coude vers la hanche puis tends le bras — anti-rotation en prime." },
            { id: "b3a3", name: "B1 · Squat chargé", sets: 4, reps: 8 },
            { id: "b3a4", name: "B2 · Dead bug complet, jambe tendue", sets: 3, reps: 10, perSide: "côté" },
            { id: "b3a5", name: "C1 · Planche avec touche d'épaule alternée", sets: 3, reps: "10 touches", note: "Le bassin ne bouge pas d'un millimètre. Le vrai test." },
            { id: "b3a6", name: "C2 · Marche sur place avec gainage doux", sets: 3, duration: 50, note: "Abdos engagés, rythme régulier." },
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
            { id: "b3b1", name: "A1 · Équilibre sur une jambe + charnière de hanche", sets: 3, reps: 8, perSide: "jambe", note: "Penche-toi lentement, dos neutre, reviens à la verticale." },
            { id: "b3b2", name: "A2 · Dead bug à genoux fléchis", sets: 3, reps: 10, perSide: "côté", note: "Genoux à 90°, bas du dos plaqué, mouvement lent." },
            { id: "b3b3", name: "B1 · Fente arrière au poids du corps", sets: 3, reps: 10, perSide: "jambe" },
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

// ---------- Programme par défaut — Profil 2 ----------
// Renfo poids du corps + haltères de 5 kg (mobilier : chaise ok, pas de
// marche d'escalier), aucun saut ni pliométrie, pas de cardio (course gérée
// à côté). Genou douloureux : on le RENFORCE progressivement (isométrie →
// tempo lent → unilatéral), on ne l'évite pas.
// Séances calibrées ≤ 10 min (tempo des répétitions + récup 20–30 s comptés) :
// Lun = jambes, Mer = haut du corps + abdos (volume réduit), Ven = jambes + tronc.

const P2_REST = (id) => ({
  title: "Repos (course libre)",
  exercises: [
    { id, name: "Étirements / mobilité (optionnel)", duration: 300, note: "quadriceps, ischios, mollets, hanches" },
  ],
});

const P2_PACE_HINT = "Enchaîne les exercices, récup 20–30 s max entre les séries.";

const DEFAULT_PROGRAM_P2 = {
  activeBlock: "1",
  // Tout est optionnel : un peu de tout, à caser quand ça arrange.
  daily: {
    title: "Chaque jour — optionnel",
    exercises: [
      { id: "hd1", name: "Chaise au mur", duration: 45, note: "renfo genou en douceur, n'importe quand dans la journée" },
      { id: "hd2", name: "Squats lents", reps: 10, note: "descente 3–5 s, amplitude confortable — renfo genou" },
      { id: "hd3", name: "Pompes", reps: "10–15", note: "une seule série propre" },
      { id: "hd4", name: "Planche", duration: 60, note: "abdos — bassin neutre, tu respires" },
    ],
  },
  blocks: {
    "1": {
      name: "Bloc 1 — Reprise (sem. 1–4)",
      gate: "On renforce le genou, on ne l'évite pas : l'isométrie (chaise au mur) et les descentes lentes chargent le tendon en douceur. Une gêne ≤ 3/10 qui disparaît le lendemain est normale et utile ; au-delà, réduis l'amplitude — pas l'exercice. Poids du corps + haltères de 5 kg, sans saut.",
      days: {
        1: {
          title: "Jambes — force",
          hint: "≈ 9 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h1l1", name: "Chaise au mur", sets: 3, duration: 30, note: "dos plaqué, cuisses vers la parallèle — l'isométrie renforce le tendon sans l'irriter" },
            { id: "h1l2", name: "Squat sur chaise, descente 5 s", sets: 2, reps: 8, note: "toucher-repartir ; c'est la descente contrôlée qui fait le travail" },
            { id: "h1l3", name: "Pont fessier", sets: 2, reps: 12, note: "expire en montant" },
            { id: "h1l4", name: "Montées de mollets lentes", sets: 2, reps: 12, note: "2 s de montée, 2 s de descente" },
          ],
        },
        2: P2_REST("h1s1"),
        3: {
          title: "Haut du corps & abdos",
          hint: "≈ 8 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h1u1", name: "Pompes (sur les genoux si besoin)", sets: 3, reps: 8, note: "corps gainé, coudes à ~45°" },
            { id: "h1u2", name: "Rowing haltères, buste penché", sets: 2, reps: 12, note: "5 kg, buste penché à ~45°, dos neutre — tire vers les poches arrière" },
            { id: "h1u3", name: "Planche", sets: 2, duration: 30 },
            { id: "h1u4", name: "Dead bug", sets: 2, reps: 8, perSide: "côté", note: "bas du dos collé au sol" },
          ],
        },
        4: P2_REST("h1s2"),
        5: {
          title: "Jambes + tronc",
          hint: "≈ 9 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h1f1", name: "Fente arrière statique", sets: 2, reps: 8, perSide: "jambe", note: "contrôlée ; le genou travaille, c'est le but — reste sous 3/10 de gêne" },
            { id: "h1f2", name: "Chaise au mur", sets: 2, duration: 40 },
            { id: "h1f3", name: "Gainage latéral sur les genoux", sets: 2, duration: 20, perSide: "côté" },
            { id: "h1f4", name: "Superman", sets: 2, reps: 12, note: "pause 2 s en haut" },
          ],
        },
        6: P2_REST("h1s3"),
        0: P2_REST("h1s4"),
      },
    },
    "2": {
      name: "Bloc 2 — Progression (sem. 5–8)",
      gate: "Feu vert : chaise au mur 3 × 45 s et squats lents sans aggravation le lendemain. On ajoute amplitude et volume — un genou se renforce en étant chargé progressivement.",
      days: {
        1: {
          title: "Jambes — force",
          hint: "≈ 9 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h2l1", name: "Squat libre, descente 5 s", sets: 3, reps: 8, note: "la plus grande amplitude possible en restant sous 3/10 de gêne" },
            { id: "h2l2", name: "Fentes arrière alternées", sets: 2, reps: 8, perSide: "jambe", note: "contrôlées, sans impact" },
            { id: "h2l3", name: "Chaise au mur", sets: 2, duration: 45 },
          ],
        },
        2: P2_REST("h2s1"),
        3: {
          title: "Haut du corps & abdos",
          hint: "≈ 9 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h2u1", name: "Pompes", sets: 3, reps: 10 },
            { id: "h2u2", name: "Rowing haltères, tempo lent", sets: 3, reps: 12, note: "5 kg, 2 s de montée, 3 s de descente" },
            { id: "h2u3", name: "Planche", sets: 2, duration: 45 },
            { id: "h2u4", name: "Hollow hold, genoux fléchis", sets: 2, duration: 15, note: "bas du dos plaqué au sol" },
          ],
        },
        4: P2_REST("h2s2"),
        5: {
          title: "Jambes + tronc",
          hint: "≈ 9–10 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h2f1", name: "Pont fessier une jambe", sets: 2, reps: 8, perSide: "jambe", note: "bassin de niveau" },
            { id: "h2f2", name: "Fente arrière, descente lente", sets: 2, reps: 8, perSide: "jambe" },
            { id: "h2f3", name: "Montées de mollets une jambe", sets: 2, reps: 10, perSide: "jambe" },
            { id: "h2f4", name: "Gainage latéral sur les pieds", sets: 2, duration: 20, perSide: "côté", note: "repasse aux genoux si la hanche tombe" },
          ],
        },
        6: P2_REST("h2s3"),
        0: P2_REST("h2s4"),
      },
    },
    "3": {
      name: "Bloc 3 — Renforcement (sem. 9–12)",
      gate: "Feu vert : bloc 2 complet sans douleur qui s'installe. Place au travail sur une jambe : c'est lui qui blinde vraiment le genou et corrige les déséquilibres gauche/droite.",
      days: {
        1: {
          title: "Jambes — force",
          hint: "≈ 9 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h3l1", name: "Squat une jambe assisté, sur chaise", sets: 3, reps: 5, perSide: "jambe", note: "toucher-repartir, aide-toi des mains au besoin" },
            { id: "h3l2", name: "Fentes arrière", sets: 2, reps: 10, perSide: "jambe" },
            { id: "h3l3", name: "Chaise au mur, poids sur une jambe", sets: 2, duration: 15, perSide: "jambe", note: "l'autre pied en léger appui" },
          ],
        },
        2: P2_REST("h3s1"),
        3: {
          title: "Haut du corps & abdos",
          hint: "≈ 8 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h3u1", name: "Pompes déclinées (pieds sur une chaise)", sets: 3, reps: 8 },
            { id: "h3u2", name: "Rowing haltère un bras", sets: 3, reps: 10, perSide: "bras", note: "5 kg, main libre en appui sur une chaise, pause 1 s en haut" },
            { id: "h3u3", name: "Planche avec touche d'épaule alternée", sets: 2, reps: "10 touches", note: "le bassin ne bouge pas" },
            { id: "h3u4", name: "Hollow hold", sets: 2, duration: 20 },
          ],
        },
        4: P2_REST("h3s2"),
        5: {
          title: "Jambes + tronc",
          hint: "≈ 9–10 min. " + P2_PACE_HINT,
          exercises: [
            { id: "h3f1", name: "Split squat, pied arrière sur une chaise", sets: 2, reps: 8, perSide: "jambe", note: "descente contrôlée — le plus exigeant pour le genou, garde la règle des 3/10" },
            { id: "h3f2", name: "Pont fessier une jambe, tempo lent", sets: 2, reps: 10, perSide: "jambe" },
            { id: "h3f3", name: "Montées de mollets une jambe", sets: 2, reps: 12, perSide: "jambe" },
            { id: "h3f4", name: "Gainage latéral + levée de jambe", sets: 2, reps: 6, perSide: "côté" },
          ],
        },
        6: P2_REST("h3s3"),
        0: P2_REST("h3s4"),
      },
    },
  },
};

// ---------- Plan course : 10 km sub-50 en 12 semaines ----------
// Chaque semaine : 3 séances (mardi qualité, jeudi EF, dimanche sortie longue).
// Étape : { name, duration? (=> timer), sets?, reps?, note? }.
// Le suivi des coches est indépendant des dates (clé semaine-séance-étape),
// pour pouvoir décaler une séance sans perdre le fil.

const WARMUP = { name: "Échauffement 15′ EF + 3–4 lignes droites", duration: 900 };
const COOLDOWN = { name: "Retour au calme 10′", duration: 600 };
const STRIDES = { name: "6 lignes droites de 80 m" };

const COURSE_PLAN = {
  goal: "Objectif : 49:50 · 4:59/km de moyenne",
  paces: [
    { zone: "EF — endurance fondamentale", pace: "6:15 – 6:35 /km", feel: "conversation facile, 140–152 bpm" },
    { zone: "Seuil — allure semi", pace: "5:15 – 5:25 /km", feel: "soutenu mais contrôlé, ~172–178 bpm" },
    { zone: "Allure 10 km cible", pace: "4:55 – 5:00 /km", feel: "dur, phrases courtes seulement" },
    { zone: "VMA longue — 800 à 1200 m", pace: "4:35 – 4:45 /km", feel: "très dur" },
    { zone: "VMA courte — 30/30, 200 à 400 m", pace: "4:10 – 4:25 /km", feel: "quasi maximal" },
  ],
  pacesNote: "Ces allures sont calées sur ton objectif, pas sur ta forme du jour. Aux semaines 1–3 il est normal qu'elles semblent ambitieuses : vise le bas de la fourchette et laisse le corps s'adapter.",
  tips: [
    "Périnée : si tu ressens des fuites, une pesanteur ou une gêne pendant les séances rapides ou les sorties longues, consulte un kiné spécialisé en périnéologie avant de poursuivre le bloc 3. Ce n'est ni un échec ni un arrêt du plan.",
    "Ferritine : fatigue qui ne passe pas malgré les semaines allégées → prise de sang (ferritine, hémoglobine). Cause très fréquente de plafonnement chez les coureuses.",
    "Sommeil : après une nuit vraiment mauvaise, transforme la séance qualité en footing EF. Une séance sautée ne coûte rien, une blessure coûte six semaines.",
    "4e sortie possible ? Un footing EF de 40′, pas une séance de plus. C'est le levier n°1 pour le sub-50.",
    "Vélo / natation : 45–60 min en remplacement d'un footing si tu as des tensions, sans culpabilité.",
    "Semaine partie en vrac : reprends-la telle quelle plutôt que d'enchaîner deux séances qualité rapprochées.",
  ],
  weeks: [
    {
      km: "~26 km", bloc: "Bloc 1 — Fondations",
      sessions: [
        { day: 2, title: "Qualité — 30/30", steps: [WARMUP,
          { name: "2 × (8 × 30″/30″)", duration: 30, note: "30″ à 4:15/km, 30″ en trottinant · récup 3′ entre les blocs" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 45′", duration: 2700 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h05 EF", duration: 3900 }] },
      ],
    },
    {
      km: "~28 km", bloc: "Bloc 1 — Fondations",
      sessions: [
        { day: 2, title: "Qualité — VMA courte", steps: [WARMUP,
          { name: "8 × 400 m à 4:25/km", note: "récup 1′15 en trottinant" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 45′", duration: 2700 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h10 EF", duration: 4200 }] },
      ],
    },
    {
      km: "~30 km", bloc: "Bloc 1 — Fondations",
      sessions: [
        { day: 2, title: "Qualité — seuil", steps: [WARMUP,
          { name: "2 × 10′ au seuil", sets: 2, duration: 600, note: "5:25/km · récup 3′" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 50′", duration: 3000 }] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h15 EF", duration: 4500 }] },
      ],
    },
    {
      km: "~24 km", note: "semaine allégée", bloc: "Bloc 1 — Fondations",
      sessions: [
        { day: 2, title: "Qualité — 30/30", steps: [WARMUP,
          { name: "12 × 30″/30″", duration: 30, note: "30″ à 4:15/km, 30″ en trottinant" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 40′", duration: 2400 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h00 EF", duration: 3600 }] },
      ],
    },
    {
      km: "~31 km", bloc: "Bloc 2 — Développement du seuil",
      sessions: [
        { day: 2, title: "Qualité — VMA longue", steps: [WARMUP,
          { name: "6 × 800 m à 4:40/km", note: "récup 1′30" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 50′", duration: 3000 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [
          { name: "Sortie longue 1h15", duration: 4500, note: "les 15 dernières minutes progressives, finir vers 5:30/km" },
          { name: "Final progressif 15′", duration: 900, note: "finir vers 5:30/km" }] },
      ],
    },
    {
      km: "~33 km", bloc: "Bloc 2 — Développement du seuil",
      sessions: [
        { day: 2, title: "Qualité — seuil", steps: [WARMUP,
          { name: "3 × 10′ au seuil", sets: 3, duration: 600, note: "5:20/km · récup 2′30" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 50′", duration: 3000 }] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h20 EF", duration: 4800 }] },
      ],
    },
    {
      km: "~34 km", bloc: "Bloc 2 — Développement du seuil",
      sessions: [
        { day: 2, title: "Qualité — VMA longue", steps: [WARMUP,
          { name: "5 × 1000 m à 4:50/km", note: "récup 2′" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 50′", duration: 3000 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [
          { name: "Sortie longue 1h20", duration: 4800, note: "avec 2 × 10′ à 5:30/km" },
          { name: "2 × 10′ à 5:30/km", sets: 2, duration: 600 }] },
      ],
    },
    {
      km: "~27 km", note: "semaine allégée + test", bloc: "Bloc 2 — Développement du seuil",
      sessions: [
        { day: 2, title: "TEST — 5 km chrono", steps: [
          { name: "Échauffement complet 15–20′ + lignes droites", duration: 1080 },
          { name: "5 km chronométrés à fond", note: "plat, sans vent · 23:30 ≈ sur les rails pour 49′ · 24:15 ≈ 50–51′ · au-dessus de 25:00 → vise 50:30 le jour J et garde le sub-50 pour la course suivante" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 40′", duration: 2400 }] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h05 EF", duration: 3900 }] },
      ],
    },
    {
      km: "~35 km", bloc: "Bloc 3 — Spécifique 10 km",
      sessions: [
        { day: 2, title: "Qualité — allure 10 km", steps: [WARMUP,
          { name: "4 × 1500 m à 4:55/km", note: "récup 2′30" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 50′", duration: 3000 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [{ name: "Sortie longue 1h25 EF", duration: 5100 }] },
      ],
    },
    {
      km: "~36 km", note: "la semaine la plus dure", bloc: "Bloc 3 — Spécifique 10 km",
      sessions: [
        { day: 2, title: "Qualité — allure 10 km", steps: [WARMUP,
          { name: "2 × (3 × 1000 m à 4:50/km)", note: "récup 1′30 entre les répétitions, 3′ entre les blocs" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 50′", duration: 3000 }] },
        { day: 0, title: "Sortie longue", steps: [
          { name: "Sortie longue 1h20", duration: 4800, note: "avec 20′ à 5:20/km" },
          { name: "20′ à 5:20/km", duration: 1200 }] },
      ],
    },
    {
      km: "~33 km", bloc: "Bloc 3 — Spécifique 10 km",
      sessions: [
        { day: 2, title: "Qualité — allure 10 km", steps: [WARMUP,
          { name: "3 × 2000 m à 4:55–5:00/km", note: "récup 3′" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [{ name: "Footing EF 45′", duration: 2700 }, STRIDES] },
        { day: 0, title: "Sortie longue", steps: [
          { name: "Sortie longue 1h10", duration: 4200, note: "avec 3 × 5′ à allure 10 km, récup 3′" },
          { name: "3 × 5′ à allure 10 km", sets: 3, duration: 300, note: "récup 3′" }] },
      ],
    },
    {
      km: "~23 km, course incluse", note: "semaine de course !", bloc: "Affûtage",
      sessions: [
        { day: 2, title: "Affûtage", steps: [WARMUP,
          { name: "6 × 400 m à 4:40/km", note: "récup 1′30 · ~7 km au total" },
          COOLDOWN] },
        { day: 4, title: "Footing EF", steps: [
          { name: "Footing EF 35′", duration: 2100 },
          { name: "5 lignes droites de 80 m" }] },
        { day: 5, title: "Repos", steps: [{ name: "Repos complet vendredi et samedi", note: "on ne gagne plus rien, on encaisse" }] },
        { day: 0, title: "10 KM — OBJECTIF", steps: [
          { name: "10 km — objectif 49:50", note: "km 1 : 5:05, laisse partir les autres · km 2–7 : 4:55–4:58, le plus régulier possible · km 8–10 : 4:50 ou ce qu'il reste · passage 5 km visé : 24:50" }] },
      ],
    },
  ],
};

// ---------- Stockage ----------
// v2 : passage au programme en blocs (l'ancien programme v1 est remplacé).
// Deux profils : le profil 1 garde les clés historiques (données existantes
// conservées), le profil 2 suffixe "_p2". Le plan course est propre au profil 1.
const LS_PROGRAM = "sst_program_v2";
const LS_SESSIONS = "sst_sessions_v1";
const LS_COURSE = "sst_course_v1";
const LS_PROFILE = "sst_profile";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

let currentProfile = localStorage.getItem(LS_PROFILE) === "2" ? "2" : "1";

function profKeyFor(base, p) { return p === "1" ? base : base + "_p2"; }
function profKey(base) { return profKeyFor(base, currentProfile); }
function defaultProgram() { return currentProfile === "1" ? DEFAULT_PROGRAM : DEFAULT_PROGRAM_P2; }

let program, sessions;

// Clone profond du défaut : sans ça, éditer le programme mutait DEFAULT_PROGRAM
// lui-même et « Réinitialiser ce jour » restaurait la version modifiée.
// Anciens noms par défaut des exercices remplacés, par id. Un exercice stocké
// n'est migré que si son nom correspond EXACTEMENT à l'ancien défaut : tout
// renommage utilisateur le protège de la migration.
const SWAPPED_OLD_NAMES = {
  "1": {
    b1a2: "A2 · Rowing élastique",
    b1a6: "C2 · Portés valise (poids d'un seul côté)",
    b1b1: "A1 · Charnière de hanche (élastique ou poids)",
    b1b2: "A2 · Pallof press à l'élastique",
    b2a2: "A2 · Rowing élastique",
    b2a6: "C2 · Portés valise plus lourds",
    b2b1: "A1 · Soulevé de terre roumain, poids",
    b2b2: "A2 · Pallof press avec un pas de côté",
    b3a1: "A1 · Hip thrust (épaules sur le canapé), avec poids",
    b3a2: "A2 · Rowing élastique un bras",
    b3a6: "C2 · Portés valise lourds",
    b3b1: "A1 · Soulevé de terre une jambe",
    b3b2: "A2 · Pallof press à genoux, en rotation lente",
    b3b3: "B1 · Fente marchée avec poids",
  },
  "2": {
    h1u2: "Rowing inversé sous une table solide",
    h2u2: "Rowing inversé sous une table",
    h3u2: "Rowing inversé, corps plus horizontal",
  },
};

function migrateSwappedExercises(prog, defaults, oldNames) {
  const repl = {};
  for (const block of Object.values(defaults.blocks)) {
    for (const day of Object.values(block.days)) {
      for (const exo of day.exercises) repl[exo.id] = exo;
    }
  }
  let changed = false;
  for (const block of Object.values(prog.blocks || {})) {
    for (const day of Object.values(block.days || {})) {
      day.exercises = (day.exercises || []).map((exo) => {
        if (repl[exo.id] && oldNames[exo.id] === exo.name) {
          changed = true;
          return structuredClone(repl[exo.id]);
        }
        return exo;
      });
    }
  }
  return changed;
}

function loadProfileData() {
  program = loadJSON(profKey(LS_PROGRAM), null) || structuredClone(defaultProgram());
  // Migration : les programmes v2 stockés avant l'ajout de la section
  // quotidienne n'ont pas de champ daily.
  if (!program.daily) {
    program.daily = structuredClone(defaultProgram().daily);
    saveProgram();
  }
  // Migration P2 : la section quotidienne était vide par défaut avant l'ajout
  // des exercices optionnels — si elle n'a jamais été personnalisée, on la remplit.
  if (currentProfile === "2" && program.daily.exercises.length === 0) {
    program.daily = structuredClone(DEFAULT_PROGRAM_P2.daily);
    saveProgram();
  }
  // Migration : certains exercices par défaut ont été remplacés (P1 : exercices
  // à élastique/poids remplacés par du poids du corps ; P2 : rowing inversé
  // remplacé par du rowing haltères).
  if (migrateSwappedExercises(program, defaultProgram(), SWAPPED_OLD_NAMES[currentProfile])) saveProgram();
  sessions = loadJSON(profKey(LS_SESSIONS), {});
}
loadProfileData();

// Suivi course : { week: index 0–11 de la semaine affichée, checked: { "w-s-e": ts } }
let courseState = loadJSON(LS_COURSE, { week: 0, checked: {} });

function saveProgram() { localStorage.setItem(profKey(LS_PROGRAM), JSON.stringify(program)); }
function saveSessions() { localStorage.setItem(profKey(LS_SESSIONS), JSON.stringify(sessions)); }
function saveCourse() { localStorage.setItem(LS_COURSE, JSON.stringify(courseState)); }

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
  else if (currentTab === "course") renderCourse();
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

// ---------- Onglet Course : plan 10 km sub-50 ----------
const COURSE_DAY_LABEL = { 2: "Mardi", 4: "Jeudi", 5: "Vendredi & samedi", 0: "Dimanche" };

function courseKey(wIdx, sIdx, eIdx) { return `${wIdx}-${sIdx}-${eIdx}`; }

function weekDone(wIdx) {
  const week = COURSE_PLAN.weeks[wIdx];
  return week.sessions.every((s, sIdx) =>
    s.steps.every((_, eIdx) => courseState.checked[courseKey(wIdx, sIdx, eIdx)]));
}

function renderCourse() {
  const wIdx = Math.min(Math.max(courseState.week || 0, 0), COURSE_PLAN.weeks.length - 1);
  courseState.week = wIdx;
  const week = COURSE_PLAN.weeks[wIdx];
  const todayDow = new Date().getDay();

  dayTitle.textContent = `Course — S${wIdx + 1}`;
  daySubtitle.textContent = COURSE_PLAN.goal;

  // Sélecteur de semaine
  let html = `<div class="day-chips">`;
  COURSE_PLAN.weeks.forEach((w, i) => {
    html += `<button class="chip ${i === wIdx ? "active" : ""} ${weekDone(i) ? "done-week" : ""}" data-week="${i}">S${i + 1}${weekDone(i) ? " ✓" : ""}</button>`;
  });
  html += `</div>`;

  html += `<p class="block-name">${escapeHtml(week.bloc)} · ${escapeHtml(week.km)}${week.note ? ` · ${escapeHtml(week.note)}` : ""}</p>`;

  // Progression de la semaine
  const total = week.sessions.reduce((n, s) => n + s.steps.length, 0);
  const done = week.sessions.reduce((n, s, sIdx) =>
    n + s.steps.filter((_, eIdx) => courseState.checked[courseKey(wIdx, sIdx, eIdx)]).length, 0);
  html += `
    <div class="progress-wrap">
      <div class="progress-text">${done} / ${total} étapes cette semaine</div>
      <div class="progress-bar"><div style="width:${total ? (100 * done) / total : 0}%"></div></div>
    </div>`;

  // Allures de travail
  html += `<details class="fold"><summary>Allures de travail</summary>`;
  html += COURSE_PLAN.paces.map((p) => `
    <div class="pace-row">
      <div class="pace-zone">${escapeHtml(p.zone)}</div>
      <div class="pace-val">${escapeHtml(p.pace)}</div>
      <div class="pace-feel">${escapeHtml(p.feel)}</div>
    </div>`).join("");
  html += `<p class="data-hint">${escapeHtml(COURSE_PLAN.pacesNote)}</p></details>`;

  // Séances de la semaine
  week.sessions.forEach((s, sIdx) => {
    const isToday = s.day === todayDow;
    html += `<div class="section-label">${COURSE_DAY_LABEL[s.day] || ""} — ${escapeHtml(s.title)}${isToday ? ` <span class="today-badge">aujourd'hui</span>` : ""}</div>`;
    html += s.steps.map((step, eIdx) => {
      const key = courseKey(wIdx, sIdx, eIdx);
      return courseStepCard(step, key);
    }).join("");
  });

  // Conseils
  html += `<details class="fold"><summary>Conseils & points de vigilance</summary>`;
  html += COURSE_PLAN.tips.map((t) => `<p class="data-hint">${escapeHtml(t)}</p>`).join("");
  html += `</details>`;

  app.innerHTML = html;

  const activeChip = app.querySelector(".chip[data-week].active");
  if (activeChip) activeChip.scrollIntoView({ block: "nearest", inline: "center" });

  app.querySelectorAll(".chip[data-week]").forEach((c) => {
    c.addEventListener("click", () => {
      courseState.week = parseInt(c.dataset.week, 10);
      if (timer) closeTimer();
      saveCourse();
      render();
    });
  });

  app.querySelectorAll(".exo[data-ckey]").forEach((el) => {
    el.addEventListener("click", () => {
      const key = el.dataset.ckey;
      if (courseState.checked[key]) delete courseState.checked[key];
      else courseState.checked[key] = Date.now();
      saveCourse();
      render();
    });
  });

  bindTimerControls();
}

function courseStepCard(step, key) {
  const done = !!courseState.checked[key];
  const meta = metaText(step);
  const hasTimer = !!step.duration;
  const isOpen = timer && timer.exoId === key;
  return `
    <div class="exo ${done ? "done" : ""}" data-ckey="${key}">
      <div class="row">
        <div class="check">✓</div>
        <div class="info">
          <div class="name">${escapeHtml(step.name)}</div>
          ${meta ? `<div class="meta">${meta}</div>` : ""}
        </div>
        ${hasTimer ? `<button class="timer-chip ${isOpen ? "open" : ""}" data-timer="${key}" data-duration="${step.duration}">⏱</button>` : ""}
      </div>
      ${isOpen ? timerPanel() : ""}
    </div>`;
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
    <p class="data-hint">L'export contient les deux profils (programmes + historiques)
    et le suivi course. L'import remplace les données actuelles.</p>`;

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
  const profiles = {};
  for (const p of ["1", "2"]) {
    profiles[p] = p === currentProfile
      ? { program, sessions }
      : {
          // Profil jamais modifié : rien en localStorage, on exporte son défaut
          program: loadJSON(profKeyFor(LS_PROGRAM, p), null)
            || structuredClone(p === "1" ? DEFAULT_PROGRAM : DEFAULT_PROGRAM_P2),
          sessions: loadJSON(profKeyFor(LS_SESSIONS, p), {}),
        };
  }
  const data = {
    app: "sport-session-tracker",
    version: 3,
    exportedAt: new Date().toISOString(),
    activeProfile: currentProfile,
    profiles: profiles,
    course: courseState,
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
    const hasProfiles = data.profiles && typeof data.profiles === "object";
    const hasCourse = data.course && typeof data.course.checked === "object";
    // Anciens formats (v1/v2) : programme + sessions à plat → profil 1.
    const flat = !hasProfiles ? {
      program: normalizeProgram(data.program),
      sessions: data.sessions && typeof data.sessions === "object" ? data.sessions : null,
    } : null;

    if (!hasProfiles && !hasCourse && !(flat && (flat.program || flat.sessions))) {
      alert("Ce fichier ne contient ni profils, ni programme, ni suivi course reconnus.");
      return;
    }
    const what = hasProfiles ? "les données des deux profils" : "les données (vers le profil 1)";
    if (!confirm(`Importer ${what}${hasCourse ? " et le suivi course" : ""} ? Les données actuelles seront remplacées.`)) return;

    if (hasProfiles) {
      for (const p of ["1", "2"]) {
        const prof = data.profiles[p];
        if (!prof) continue;
        const prog = normalizeProgram(prof.program);
        if (prog) localStorage.setItem(profKeyFor(LS_PROGRAM, p), JSON.stringify(prog));
        if (prof.sessions && typeof prof.sessions === "object") {
          localStorage.setItem(profKeyFor(LS_SESSIONS, p), JSON.stringify(prof.sessions));
        }
      }
      loadProfileData();
    } else if (flat) {
      if (flat.program) localStorage.setItem(profKeyFor(LS_PROGRAM, "1"), JSON.stringify(flat.program));
      if (flat.sessions) localStorage.setItem(profKeyFor(LS_SESSIONS, "1"), JSON.stringify(flat.sessions));
      loadProfileData();
    }
    if (hasCourse) { courseState = data.course; saveCourse(); }
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
      program.daily = structuredClone(defaultProgram().daily);
    } else {
      const defBlock = defaultProgram().blocks[program.activeBlock];
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

// ---------- Profils ----------
const profileBtn = document.getElementById("profile-btn");

function updateProfileUI() {
  profileBtn.textContent = "Profil " + currentProfile;
  profileBtn.classList.toggle("p2", currentProfile === "2");
  // Le plan course appartient au profil 1
  document.querySelector('[data-tab="course"]').style.display = currentProfile === "2" ? "none" : "";
}

function setProfile(p) {
  currentProfile = p;
  localStorage.setItem(LS_PROFILE, p);
  stopTicking();
  timer = null;
  editingExoId = null;
  editDay = null;
  loadProfileData();
  if (currentProfile === "2" && currentTab === "course") {
    currentTab = "today";
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === "today"));
  }
  updateProfileUI();
  render();
}

profileBtn.addEventListener("click", () => setProfile(currentProfile === "1" ? "2" : "1"));
updateProfileUI();

render();

// ---------- PWA ----------
// Enregistré seulement en contexte http(s) : en ouverture directe du fichier
// (file://) les service workers ne sont pas disponibles.
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* hors ligne au 1er chargement */ });
}
