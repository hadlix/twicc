---
title: "Scores modèle × effort"
---

Le sélecteur de modèle est une **matrice** : une ligne par modèle, une colonne par effort de raisonnement. Chaque cellule sélectionnable affiche un **score de 0 à 100**, indiquant l’adéquation du couple à la tâche définie sous la matrice. Un score élevé est préférable. **?** signifie qu’aucune donnée exploitable n’est disponible.

Repères visuels :

- le **fond** est plus coloré quand le score augmente ;
- une **coche** indique la sélection et un **point** la valeur par défaut ;
- un **anneau** indique le meilleur score de chaque fournisseur : continu pour votre fournisseur par défaut, pointillé pour les autres.

## Origine des données

Les scores reposent sur les évaluations d’**[Artificial Analysis](https://artificialanalysis.ai/)**, organisme indépendant mesurant les modèles à différents efforts, avec le **coût** et le **temps** par tâche.

TwiCC intègre un instantané du **9 octobre 2026**, sans actualisation automatique.

## Réglages

- **Type de tâche** : nature du travail. *Général* utilise l’indice global Intelligence Index.
- **Difficulté de la tâche** : niveau attendu du modèle ; augmentez pour une tâche difficile.
- **Privilégier** : **Coût** pour les couples moins chers ou **Vitesse** pour les plus rapides.
- **Sélection automatique du meilleur** : sélectionne la meilleure cellule à chaque changement, comme un clic. **Fournisseur par défaut uniquement** limite ce choix à votre fournisseur par défaut si plusieurs sont affichés.
- **Sélection automatique du meilleur** et **Afficher les anciens modèles** se désactivent à chaque ouverture ou fermeture du sélecteur, des paramètres ou d’un formulaire de préréglage.

## Sens du score

La difficulté définit un **niveau cible**. Un couple qui l’atteint ou le dépasse peut accomplir la tâche : le moins cher ou le plus rapide l’emporte. Un couple un peu sous la cible perd quelques points ; un couple très inférieur est lourdement pénalisé malgré son prix bas.

- **100** : meilleur couple pour cette tâche.
- **50** : dégradation équivalente à un doublement du coût ou du temps, ou à un écart de capacité comparable.
- Les couples plus éloignés gardent des scores **faibles mais non nuls**. Plusieurs peuvent afficher le même nombre ; l’anneau distingue toujours le meilleur de chaque fournisseur.
- Les scores comparent **tous les fournisseurs activés**. Les fournisseurs désactivés, modèles retirés ou désactivés et efforts non compatibles sont exclus.
- Les anciens modèles comptent uniquement lorsque **Afficher les anciens modèles** est activé. Sinon les modèles récents sont comparés et le score 100 reste visible. Un ancien modèle déjà sélectionné reste visible, avec un score plafonné à 100, mais sans anneau ni sélection automatique.

## Types de tâches

| Type | Évaluations utilisées |
|---|---|
| Général | Intelligence Index ; coût et temps de Terminal-Bench 4.0 |
| Programmation et terminal | Terminal-Bench 4.0 (programmation avec agent dans un terminal), SciCode (programmation scientifique) |
| Bureautique et travail intellectuel | AA-Briefcase (livrables), GDPval-AA (travail réel), GDP.pdf (raisonnement sur documents) |
| Automatisation et outils | AutomationBench-AA (workflows SaaS avec outils) |
| Sciences et raisonnement | Humanity’s Last Exam (raisonnement difficile), CritPt (physique), SciCode |
| Connaissances factuelles | AA-Omniscience (connaissances et hallucinations) |
| Documents longs | AA-LCR (raisonnement en contexte long) |

Pour plusieurs évaluations, capacité, coût et temps sont leurs moyennes, avec les capacités sur une échelle 0–100.

## Détails du calcul

- Le curseur associe **0** au couple le plus faible et **100** au plus fort du type choisi, sur une courbe rapide au départ : sa position médiane exige déjà un modèle capable.
- **Aucune pénalité au-dessus de la cible** : seuls le coût ou le temps comptent.
- Un déficit de **2 points d’Intelligence Index** équivaut à doubler le coût ; les autres catégories adaptent ce rapport à leur échelle. La pénalité croît à la **puissance 4** de l’écart : 4 points de déficit équivalent à payer 2¹⁶ fois plus.
- Le score passe de 100 à 50 au premier doublement, puis baisse de plus en plus lentement sans atteindre 0.
- Coût et temps sont comparés sur une échelle **logarithmique** : passer de 1 à 2 dollars équivaut à passer de 10 à 20.
- Le temps est le temps de génération mesuré par Artificial Analysis, sans délai de démarrage.
