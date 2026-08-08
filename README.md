# sport-session-tracker

Petite application pour suivre les séances de sport quotidiennes.

100 % statique : ouvrir `index.html` suffit (aucun build, aucun framework,
aucune dépendance réseau). Pensée mobile-first — téléphone posé au sol pendant
la séance, grandes zones tactiles, saisie en quelques secondes.

## Fonctionnalités

- **Séance du jour** : base quotidienne + exercices du jour de la semaine,
  coche à la carte (toute la carte est tactile), barre de progression.
- **Timers** : bouton ⏱ sur les exercices avec durée — compte à rebours en
  gros chiffres, Démarrer/Pause, ±15 s, vibration + bip à zéro.
- **Programme modifiable jour par jour** : onglet Programme — ajout,
  modification, suppression, réordonnancement des exercices, titre du jour,
  retour au programme d'origine.
- **Historique** : sessions passées avec % de complétion et détail dépliable.
- **Données** : tout est en `localStorage` ; export/import JSON depuis
  l'onglet Programme.
- **PWA installable** : servie en HTTPS (ou localhost), l'app propose
  « Ajouter à l'écran d'accueil » et fonctionne ensuite hors ligne
  (manifest + service worker avec cache versionné).

## Développement

- `index.html` — coquille de l'app
- `app.js` — logique (vanilla JS)
- `style.css` — styles (mobile-first, thème sombre)
- `notes.md` — notes de développement au fil de l'eau
