---
title: "Travailler avec les arbres de travail"
---

Un arbre de travail Git est une seconde copie de travail du même dépôt, sur une **autre branche** et dans **son propre dossier**, avec un historique partagé. Vous ou votre agent pouvez ainsi travailler sur une fonctionnalité sans modifier la copie principale.

Dans TwiCC, il apparaît comme un [projet](help/projects) distinct, associé automatiquement au dépôt principal. Ses sessions, coûts et activités sont **agrégés dans la vue du projet parent**.

### Emplacement de création

Le réglage **Dossier des arbres de travail** définit où créer les nouveaux arbres et préremplit leur chemin. Le réglage global est un **modèle** avec des variables propres au projet : `{git_root}` (racine Git), `{project_name}` (nom du projet, ou de son dossier si aucun nom n’est défini) et `{project_basedir}` (nom du dossier). `{git_root}/.worktrees` les garde dans chaque dépôt ; `/home/me/worktrees/{project_name}` les regroupe ailleurs. Chaque projet peut définir un chemin absolu différent. Configurez le modèle global dans les paramètres et le chemin du projet dans sa fenêtre de modification.

### Création

Un arbre de travail se crée au démarrage d’une nouvelle session. Dans **Nouvelle session**, le bouton à droite du projet représente une branche avec un **+**. Il apparaît uniquement pour les dépôts Git.

Dans la fenêtre :

- **Nouvelle branche** : TwiCC crée l’arbre de travail et sa branche à l’emplacement choisi.
- **Arbre de travail existant** : utiliser un arbre déjà présent sur le disque, encore inconnu de TwiCC, depuis l’onglet correspondant.

Vous pouvez immédiatement y démarrer un brouillon de session.

### Nettoyage

L’arbre reste dans les sélecteurs jusqu’à son **archivage**, depuis sa fenêtre de modification ou son menu **⋮**. L’archivage masque seulement le projet dans TwiCC et ne supprime rien. La fusion de la branche et la suppression physique de l’arbre restent à votre charge ou à celle de votre agent ; TwiCC ne les effectue pas.
