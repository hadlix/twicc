---
title: "Choisir le dossier par défaut des arbres de travail"
---

Indiquez à TwiCC où créer les arbres de travail Git à l’aide d’un **modèle**. Les variables sont résolues pour chaque projet : `{git_root}` (racine Git), `{project_name}` (nom du projet, ou de son dossier sans nom défini) et `{project_basedir}` (nom du dossier). Par exemple, `{git_root}/.worktrees` les conserve dans le dépôt, tandis que `/home/me/worktrees/{project_name}` les regroupe au même endroit. Le chemin est prérempli à la création et reste modifiable.

Configurez-le dans **Paramètres → Général → Modèle du dossier des arbres de travail**. Un projet peut remplacer ce réglage par un chemin absolu dans sa fenêtre de modification.

Consultez [Travailler avec les arbres de travail](help/worktrees).
