---
title: "Partage"
---

Un **lien de partage** est une URL publique en lecture seule vers une session ou un artefact. Toute personne disposant du lien peut l’ouvrir dans un navigateur sans compte TwiCC. Elle peut uniquement **consulter** : le lien ne permet jamais d’envoyer un message, d’exécuter un outil ou de modifier vos données.

## Contenus partageables

- **Un artefact** : fichier favori de l’onglet Artefacts, affiché seul (page HTML, graphique, document…).
- **Une session** : conversation en lecture seule, avec les appels d’outils et les différences tels que vous les voyez.

> **La session est partagée telle quelle**, sans masquage ni nettoyage. Vérifiez l’absence de secrets et de données privées et partagez uniquement avec des personnes de confiance. Un artefact étant un seul fichier choisi, le contrôle est plus limité.

## Préparation

Le partage nécessite un **hôte dédié** : un nom d’hôte distinct de votre accès TwiCC, pointant vers la même instance. Configurez-le dans **Paramètres → Partage**. Les boutons restent désactivés jusque-là.

**Chaque visite est servie par la machine qui exécute TwiCC**, à travers votre tunnel. Il n’existe aucune copie hébergée : évitez une diffusion massive, car tout le trafic arrive directement sur votre machine.

## Gestion des liens

Chaque lien peut avoir un **libellé**, un **mot de passe** et une **expiration**. Plusieurs liens peuvent cibler la même session ou le même artefact, chacun avec sa protection et son historique de vues. Un lien par personne facilite la révocation individuelle.

Gérez-les depuis le bouton de partage ou **Paramètres → Partage → Liens partagés** :

- **Révoquer** désactive temporairement le lien (erreur 404 pour les visiteurs), conserve les journaux et permet une réactivation.
- **Supprimer** retire définitivement le lien et ses journaux.

## Agents et liens de partage

Par défaut, seuls les humains peuvent créer et gérer les partages. Deux options de **Paramètres → Partage**, initialement **désactivées**, autorisent séparément les partages de sessions et d’artefacts par les agents.

**Partages de sessions** autorise un agent à partager sa propre session ou celles de son arborescence d’agents. **Partages d’artefacts** autorise les favoris appartenant à ces mêmes sessions.

Pour la catégorie activée, les agents peuvent aussi :

- **gérer** les liens créés par eux-mêmes ou leurs descendants (modifier, supprimer, republier) ;
- **révoquer** tout lien de cette catégorie, y compris les vôtres, car retirer une publication est considéré comme sûr ;
- **lire l’URL** de tous les liens de cette catégorie, y compris les vôtres.

Un agent ne peut jamais effacer le mot de passe d’un lien ni partager en mode `debug`. Ses nouveaux liens de session sont des instantanés figés sauf demande explicite de partage en direct.

## Artefacts et accès réseau

Un artefact partagé ne présente **aucune demande de consentement** au visiteur. Seuls les hôtes réseau **que vous avez autorisés** sont accessibles. Les autres sont bloqués avec une note indiquant le refus du propriétaire. Gérez les autorisations dans les paramètres du **favori** ; les tentatives des visiteurs y apparaissent pour pouvoir les autoriser ensuite.

Après modification des fichiers d’un artefact, utilisez **Publier la mise à jour** sur le lien pour actualiser le contenu visible.
