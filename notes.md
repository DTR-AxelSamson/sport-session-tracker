# Notes de développement — Sport Session Tracker

## Objectif
App web statique (pas de build, pas de framework) de suivi des sessions du programme
de rééducation/renforcement hebdomadaire. Mobile-first : téléphone posé au sol,
grandes zones tactiles, saisie < 15 s.

## Architecture
- `index.html` : coquille (header, zone app, tabbar), charge `style.css` + `app.js`.
- `app.js` : tout le JS vanilla — programme par défaut, rendu, stockage.
- `style.css` : mobile-first, thème sombre (lisible au sol / en salle).

## Modèle de données (v2 — programme en blocs)
- `program` (localStorage `sst_program_v2`) :
  - `activeBlock` : "1" | "2" | "3" — le bloc utilisé par l'onglet Séance,
    sélectionnable dans l'onglet Programme.
  - `blocks` : chaque bloc a `name`, `gate` (critères de feu vert affichés dans
    l'éditeur) et `days` (clé = `Date.getDay()`, 0 = dimanche … 6 = samedi),
    chaque jour a `title`, `hint?` (ex. consigne d'enchaînement par paires)
    + `exercises`.
  - Exercice : `{ id, name, sets?, reps?, perSide?, duration? (secondes), note? }`.
    `duration` présent ⇒ timer affiché ; `reps` peut être une chaîne ("8–10",
    "20 m", "10 touches").
- Répartition hebdo des blocs (12 semaines, 3 blocs de 4) :
  Lun = Force A, Mar = Course sortie 1, Mer = Force B, Jeu = repos,
  Ven = Course sortie 2, Sam = repos, Dim = Course sortie 3.
  Les codes A1/A2/B1/B2/C1/C2 des paires sont dans le nom des exercices.
- L'ancien format v1 (`daily` + `days`) reste importable : converti en un bloc
  unique, base quotidienne fusionnée en tête de chaque jour (`normalizeProgram`).
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

- [x] PWA installable : `manifest.json` (standalone, portrait, fr, chemins
      relatifs pour marcher sous un sous-chemin type GitHub Pages), icônes
      192/512 + variante maskable (générées depuis un SVG haltère + coche),
      balises apple-touch, service worker `sw.js` (precache + stale-while-
      revalidate, cache versionné `sst-v1` à incrémenter à chaque déploiement).
      Enregistrement du SW seulement en http(s), pas en file://.
      Testé sur serveur local : SW actif, manifest et icônes servis,
      rechargement hors ligne OK avec coches persistées.

- [x] Nouveau programme par défaut : 12 semaines en 3 blocs (fondations /
      charge / consolidation), séances Force A & B en paires + 3 sorties course
      par semaine. Sélecteur de bloc dans l'onglet Programme (le bloc actif
      pilote l'onglet Séance), critères de « feu vert » affichés par bloc.
      Suppression du concept « base quotidienne » ; clé localStorage passée à
      `sst_program_v2` (repart sur le nouveau défaut) ; cache SW bumpé `sst-v2`.
      L'historique note le bloc (« Force A · Bloc 1 »). Testé : switch de bloc,
      édition d'une durée de planche, export v2, réimport, import d'un ancien
      export v1 converti automatiquement.

- [x] Section quotidienne réintroduite (`program.daily`, commune aux 3 blocs) :
      gainage 1 min matin + 1 min soir avec timer 60 s. Affichée en tête de la
      Séance sous « Chaque jour », éditable via la puce « Quotidien » de
      l'onglet Programme, incluse dans le snapshot d'historique. Migration
      automatique des programmes v2 stockés sans `daily` ; import v1 mappe son
      ancien `daily` sur la nouvelle section. Cache SW bumpé `sst-v3`.
- [x] Bugfix : `program` référençait `DEFAULT_PROGRAM` au premier lancement
      (avant toute sauvegarde) → éditer mutait le programme d'origine et
      « Réinitialiser » restaurait la version modifiée. Corrigé par un
      `structuredClone` du défaut au chargement.

- [x] Onglet Course : plan 10 km sub-50 en 12 semaines (S1→S12), séparé du
      renforcement (onglet renommé « Renfo »). Sélecteur de semaine persistant
      (`sst_course_v1` : { week, checked }), suivi coché par étape indépendant
      des dates (clé `semaine-séance-étape`) pour pouvoir décaler une séance.
      3 séances/semaine (mardi qualité, jeudi EF + lignes droites, dimanche
      sortie longue) + Ven/Sam repos et 10 km objectif en S12. Échauffement /
      retour au calme comme étapes cochables avec timer ; timers sur 30/30,
      blocs seuil, EF. Dépliants « Allures de travail » (5 zones) et
      « Conseils & points de vigilance » (périnée, ferritine, sommeil, marges).
      Chips S1–S12 avec ✓ quand la semaine est complète, badge « aujourd'hui »
      sur la séance du jour, export/import JSON étendu au suivi course
      (version 2, rétrocompatible). Le plan course n'est pas éditable dans
      l'app (statique dans le code), contrairement au programme de renfo.
      Cache SW bumpé `sst-v4`.

- [x] Deux profils : Profil 1 (elle — renfo + course) / Profil 2 (lui — renfo
      poids du corps, genoux sensibles). Bouton de bascule dans le header
      (bleu = P1, vert = P2), persisté (`sst_profile`). Le profil 1 garde les
      clés localStorage historiques (aucune migration des données existantes),
      le profil 2 suffixe `_p2` (programme + sessions). L'onglet Course est
      masqué en profil 2 (bascule depuis Course → retour sur Renfo).
      Programme P2 : 3 blocs de 4 sem. (Reprise / Progression / Renforcement),
      Lun jambes-fessiers, Mer haut du corps + abdos, Ven séance complète,
      autres jours « Repos (course libre) » avec étirements optionnels.
      Contraintes respectées : 100 % poids du corps (mobilier ok : chaise,
      table, marche), aucun saut/pliométrie, genoux protégés (chaise au mur,
      fentes arrière, relevé jambe tendue, step-up lent, règle « aucune douleur
      pendant ni le lendemain » en gate de chaque bloc), pas de cardio.
      Export JSON v3 = les deux profils + suivi course ; import rétrocompatible
      (v1/v2 plat → profil 1). Cache SW `sst-v5`.

- [x] Programme P2 v2 (retours utilisateur) : séances ≤ 10 min (budget temps
      par séance : tempo des reps + récup 20–30 s, estimation « ≈ X min » dans
      le hint du jour), moins de haut du corps (1 séance/sem au lieu de 2, à
      volume réduit — 2 séances jambes/sem), pas d'exercice avec une marche
      (step-ups supprimés), et surtout : le genou est RENFORCÉ, pas évité —
      progression rééducation isométrie (chaise au mur) → tempo lent (squat
      descente 5 s) → unilatéral (squat une jambe assisté, split squat), règle
      des 3/10 de gêne acceptable dans les gates. 3–4 exercices par séance max.
      Cache SW `sst-v6`.

- [x] Section quotidienne P2 « Chaque jour — optionnel » : chaise au mur 45 s,
      squats lents ×10, pompes 10–15, planche 1 min. Migration : si la section
      quotidienne P2 stockée est vide (jamais personnalisée, l'ancien défaut
      était vide), on la remplit avec ces exercices. Cache SW `sst-v7`.

## À garder en tête
- Pas de dépendance réseau : tout doit marcher offline une fois chargé.
- `getDay()` JS : dimanche = 0 (attention au mapping avec le programme).
