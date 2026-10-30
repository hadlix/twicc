---
title: "Personnaliser les titres de session"
---

TwiCC nomme automatiquement vos sessions. Dans **Paramètres → Suggestion de titre**, choisissez le fournisseur de chaque session, Claude Haiku ou GPT-6 Luna.

Modifiez l’instruction pour définir une langue, une longueur, un préfixe ou un style.

Utilisez **{text}** comme variable représentant le contenu de la session.

**Titres automatiques** contrôle le premier titre et ses mises à jour. La génération doit aussi être activée. Le backend produit les titres des sessions réelles même sans onglet ouvert ; les changements apparaissent discrètement dans l’en-tête et le panneau latéral.

La première vérification nécessite un message utilisateur pertinent. Les suivantes nécessitent au moins **6 nouveaux messages et 15 minutes** depuis la dernière tentative. Un arrêt manuel ou un archivage déclenche une vérification finale avec **3 nouveaux messages** depuis la dernière réussite, sans contrainte de temps. Une sortie normale de la CLI ne la déclenche pas. Les commandes slash seules ne comptent pas ; celles avec arguments peuvent compter.

TwiCC garde le titre actuel sauf si les principaux sujets méritent d’être mieux représentés. Un échec conserve les messages pour une tentative ultérieure. Les vérifications suivent l’activité : le temps écoulé seul ne les déclenche pas.

Un terminal hybride actif peut recevoir son premier titre. Les mises à jour attendent l’arrêt du terminal ou la poursuite de la session hors du terminal. Une session hybride arrêtée peut être mise à jour normalement.

Les sessions éphémères gardent les suggestions de l’interface, car elles ne sont pas encore enregistrées. Les titres antérieurs à cette fonction restent figés. Les sessions masquées, obsolètes et les sous-agents ne reçoivent pas de titre automatique. Les sessions admissibles créées par des agents peuvent en recevoir si aucun titre n’a été fourni.
