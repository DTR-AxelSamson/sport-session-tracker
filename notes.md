# Notes de développement — Sport Session Tracker

## Objectif
App web statique (pas de build, pas de framework) de suivi des sessions du programme
de rééducation/renforcement hebdomadaire. Mobile-first : téléphone posé au sol,
grandes zones tactiles, saisie < 15 s.

## Architecture
- `index.html` : coquille (header, zone app, tabbar), charge `style.css` + `app.js`.
- `app.js` : tout le JS vanilla — programme par défaut, rendu, stockage.
- `style.css` : mobile-first, thème sombre (lisible au sol / en salle).

## Modèle de données
- `program` (localStorage `sst_program_v1`) :
  - `daily` : exercices "chaque jour" (base quotidienne).
  - `days` : clé = `Date.getDay()` (0 = dimanche … 6 = samedi), chaque jour a
    `title` + `exercises`.
  - Exercice : `{ id, name, sets?, reps?, perSide?, duration? (secondes), note? }`.
    `duration` présent ⇒ timer affiché ; `reps` peut être une chaîne ("8–10").
- `sessions` (localStorage `sst_sessions_v1`) : clé = date `YYYY-MM-DD`,
  valeur `{ checked: {exoId: timestamp}, names: {exoId: nom} }`.
  On snapshotte le nom au moment du check pour que l'historique survive aux
  modifications du programme.

## Décisions
- Coche à la maille exercice (pas par série) — saisie rapide, carte entière cliquable.
- Thème sombre par défaut, texte large, cartes ≥ 72 px de haut.
- IDs d'exercices : chaînes courtes stables pour le programme par défaut,
  générés (uid) pour les exercices ajoutés par l'utilisateur.

## Avancement
- [x] v1 : vue du jour (base quotidienne + séance du jour), coches persistées en
      localStorage, barre de progression, tabbar 3 onglets.
- [x] Timers : bouton ⏱ sur les exercices avec durée, panneau intégré à la carte
      (gros chiffres, Démarrer/Pause, ±15 s, « Encore » à zéro), vibration + triple
      bip (WebAudio) à la fin. Un seul timer actif à la fois.
- [x] Snapshot du plan du jour dans la session (`planned` + `title`) pour que
      l'historique reste correct après modification du programme.
- [x] Édition du programme à la maille jour : chips Quotidien + Lun→Dim, titre du
      jour éditable, formulaire par exercice (nom, séries, répétitions libres,
      timer min/s, par côté/jambe/bras, note), ajout, suppression, réordonnancement
      (↑/↓), réinitialisation d'un jour au programme d'origine.
- [x] Historique : cartes par date (plus récent en haut), titre du jour, x/y
      exercices, % et barre, dépliable pour voir le détail ✓/○ par exercice.
      Basé sur le snapshot `planned` de chaque session ; les sessions vides
      (aucune coche) sont masquées.
- [x] Export / import JSON dans l'onglet Programme : export = fichier
      `sport-tracker-YYYY-MM-DD.json` (programme + sessions + métadonnées),
      import via sélecteur de fichier avec validation, confirmation et
      remplacement des données.

- [x] Correctif : `stopPropagation` sur le fond du panneau timer (un tap sur le
      panneau cochait/décochait la carte par accident).
- [x] README réécrit (fonctionnalités + structure des fichiers).
- [x] Test de bout en bout Playwright (hors repo, dans le scratchpad) : coches +
      persistance après reload, timer (démarrage, décompte, ±15 s), historique
      dépliable, ajout/édition/suppression d'exercice, modification de la durée
      d'un timer, export puis réimport JSON. Tout passe, zéro erreur console.

## À garder en tête
- Pas de dépendance réseau : tout doit marcher offline une fois chargé.
- `getDay()` JS : dimanche = 0 (attention au mapping avec le programme).
