---
title: "Messagerie entre instances"
---

La messagerie relie deux instances TwiCC indépendantes, principalement celles de deux personnes travaillant chacune sur leur machine. Vous pouvez aussi relier deux de vos propres instances.

Un message reçu n’entre **jamais automatiquement dans une session**. Le destinataire doit d’abord le lire, puis le refuser ou le placer dans la zone de saisie d’une session. Même alors, TwiCC ne l’envoie pas à l’agent : l’utilisateur le relit, le modifie et décide de l’envoyer.

### Utilité

Un agent peut transmettre du travail de manière contrôlée : résumé, contrat d’API, question technique, capture, document ou réponse à un précédent message. Vous pouvez aussi écrire vous-même un message. Il doit être autonome : l’instance destinataire ne partage ni la mémoire ni la conversation de la session expéditrice.

### Informations partagées

La connexion n’ouvre aucun accès aux projets, sessions, fichiers, terminaux, paramètres ou agents de l’autre instance. Seuls le titre, le texte, les pièces jointes, l’heure et la relation de réponse sont transmis. Les détails locaux restent locaux.

### Préparation

Dans **Paramètres → Instances partenaires**, définissez votre nom et une adresse accessible depuis l’autre machine. Un champ d’adresse vide désactive la messagerie. Utilisez HTTPS si possible.

Les appels sont effectués entre machines. Un tunnel imposant une connexion interactive par email ou SSO ne convient pas : créez une seconde adresse sans ce contrôle et gardez le mot de passe TwiCC activé.

Si l’adresse partenaire diffère de l’adresse externe, elle ne dessert que les échanges entre instances, sans page ni connexion en direct ; aucun filtre de chemin du tunnel n’est nécessaire. Si les adresses sont identiques, l’application et les échanges utilisent cette même adresse. Toute autre adresse, y compris `localhost`, ne dessert jamais les échanges entre instances.

Le proxy ou tunnel doit accepter des corps de requête de **72 Mio** ; l’ancienne limite de 48 Mio refuse les gros messages.

L’adresse dédiée au partage ne peut pas être utilisée : TwiCC la réserve aux routes de partage et refuse ce réglage. Consultez [Accéder à TwiCC de partout](help/external-url).

### Relier deux instances

Depuis **Gérer les instances partenaires**, un utilisateur envoie une demande. Le destinataire voit un code à six chiffres qu’il communique au demandeur par un canal de confiance, comme un appel ou une discussion privée. Le demandeur saisit ce code sur son instance pour confirmer que la demande a atteint la bonne personne.

La vérification débloque seulement l’approbation : le destinataire choisit encore d’accepter ou de refuser. Chacun définit son propre nom local pour l’autre instance.

Seuls les humains gèrent ces relations. Les agents ne peuvent ni les créer, ni les approuver, refuser, renommer, révoquer ou reconnecter.

### Envoyer un message

Un agent peut lister les instances actives et envoyer un message titré avec du texte et tout type de fichier, en conservant les noms. Les pièces jointes sont limitées à **50 Mio au total par message**. Pour un fichier plus gros, l’agent le place sur un service de stockage et transmet son URL dans le texte. Après approbation de la relation, aucune confirmation supplémentaire n’est exigée côté expéditeur.

Une ancienne version de TwiCC refuse les messages avec fichiers et doit être mise à jour ; le texte seul reste accepté.

Vous pouvez écrire vous-même depuis le gestionnaire, la boîte de réception ou en réponse lors de l’examen d’un message. Le formulaire prend seulement titre et texte, sans pièce jointe ni brouillon : sa fermeture abandonne la saisie. Demandez à un agent de rédiger ou de joindre des fichiers si nécessaire.

Le titre doit préciser le sujet et le texte fournir tout le contexte utile au destinataire et à son agent. Une réussite d’envoi signifie que l’autre instance a enregistré le message, pas qu’il a été transmis à une session.

### Boîte de réception

Ouvrez-la dans **Paramètres → Instances partenaires** ou avec le bouton près des **Paramètres**, visible dès la configuration du système, même si la boîte est vide. Un badge indique les demandes ou messages nécessitant une action.

La boîte contient les demandes de connexion, les messages à examiner et l’historique. Filtrez par instance, titre ou texte intégral. Une notification peut ouvrir la boîte, mais jamais transmettre un message ni démarrer un agent.

Pour recevoir un son, une notification du navigateur ou une alerte sur appareil à l’arrivée d’un message ou d’une demande, utilisez **Paramètres → Notifications → Une instance partenaire vous sollicite**. Les autres événements attendent votre prochaine visite.

### Examiner un message

L’examen affiche l’expéditeur, le titre, le texte, les pièces jointes et les liens de réponse. Il précise si le message a été écrit par l’humain ou son agent. Les textes et fichiers volumineux nécessitent une action de chargement supplémentaire.

Choisissez ensuite :

- placer le message dans la zone de saisie d’une session existante ;
- créer un nouveau brouillon avec ce message ;
- le marquer comme traité sans agent ;
- répondre manuellement ;
- le refuser.

Le placement marque le message comme transmis, mais ne l’envoie pas et ne démarre aucun agent. Vous pouvez ajouter une note facultative, séparée du texte partenaire et clairement attribuée à vous.

Un refus n’inclut aucun texte. Pour l’expliquer, choisissez **Répondre manuellement** et refusez dans la même étape.

L’expéditeur connaît uniquement votre première décision. Les actions de traitement et de refus ne sont donc proposées qu’en attente. Un message déjà résolu peut toujours être retransmis depuis l’historique.

### Réponses et suggestions de session

La boîte et l’examen affichent le message auquel une réponse se rapporte et permettent de l’ouvrir. Un message ayant reçu des réponses indique leur auteur : partenaire, agent partenaire, vous ou votre agent.

**Répondre manuellement** propose le titre d’origine préfixé de `Re:`. Tant que le message attend une décision, le formulaire permet de le laisser ouvert, de le marquer comme traité ou de le refuser. Ce choix ne s’applique qu’après réception de la réponse par l’autre instance.

TwiCC suggère, si possible, la session locale du message précédent ; vous pouvez en choisir une autre ou un nouveau brouillon. Chaque réponse passe par la même validation humaine et ne la contourne jamais.

### États des messages

- **en attente** : le destinataire n’a pas décidé ;
- **transmis** : placé dans une zone de saisie, une suite par son agent est possible ;
- **traité** : géré par l’utilisateur sans agent ; une éventuelle information complémentaire arrive en réponse ;
- **refusé** : décliné par l’utilisateur ;
- **échec** : l’expéditeur n’a pas reçu la confirmation de prise en charge.

L’état communiqué correspond à la première décision. Des changements ultérieurs ne sont pas signalés à l’expéditeur. Un agent peut vérifier l’état de son envoi. Un échec peut être incertain : le message a peut-être été enregistré avant la coupure.

### Historique et retransmission

Un message résolu reste dans l’historique et peut être placé à nouveau dans une zone de saisie, quelle que soit la décision initiale, par exemple après une mauvaise sélection ou un brouillon effacé.

Les fichiers joints sont supprimés **sept jours après la dernière décision**. Une nouvelle décision relance ce délai tant qu’ils existent. Les messages en attente gardent leurs fichiers. Titre, texte, métadonnées des pièces jointes et liens de réponse restent toujours conservés. Une retransmission tardive peut donc ne contenir que le texte.

### Révocation et reconnexion

Chacun contrôle sa relation et peut la révoquer à tout moment. La messagerie cesse et les identifiants sont supprimés, mais le nom local et l’historique complet sont conservés.

La révocation est silencieuse. L’autre instance l’apprend au rejet d’une requête ultérieure et marque la relation comme **rompue**. Modifier ou désactiver votre propre adresse peut aussi rompre les relations. Rétablissez une adresse accessible, puis reconnectez chaque instance manuellement.

La reconnexion exige un nouveau code et l’approbation de l’autre humain, comme à l’origine. Elle restaure la relation existante en conservant nom et historique.

La relecture humaine est la principale frontière de sécurité ; elle ne rend pas fiable un contenu non approuvé. Lisez chaque message avant de le placer dans une zone de saisie.
