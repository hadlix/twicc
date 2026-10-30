---
title: "MCP externe"
---

Le MCP externe permet à un agent extérieur à TwiCC d’interagir avec votre instance : consulter les projets, créer des sessions ou envoyer des messages avec des images.

TwiCC reste une application mono-utilisateur. Vous approuvez chaque connexion, sans créer de compte supplémentaire pour le client.

### MCP interne et externe

Les agents exécutés dans TwiCC ont déjà une connexion MCP interne et n’ont besoin ni de cette configuration ni d’une approbation OAuth. Désactiver le MCP externe ne coupe pas leur accès. Les clients externes utilisent une adresse publique dédiée et obtiennent l’accès par OAuth après votre approbation.

### Pouvoirs d’une connexion

Une connexion approuvée a un accès complet aux outils MCP externes : lecture et modification des données TwiCC, gestion des projets et sessions, envoi de messages et gestion des partages. Aucune permission par connexion n’est proposée.

L’approbation porte sur la connexion, pas sur chaque appel. Le client peut agir sans nouvelle approbation TwiCC pour chaque message ou session.

Un client externe n’est pas une session TwiCC. Il ne peut pas utiliser `whoami`, `self` ou `parent` pour identifier une session appelante. Il doit fournir explicitement les identifiants de session requis. Les opérations relatives à une session ne peuvent pas déduire ce contexte de la connexion externe.

### Pièces jointes

Le client joint un fichier de sa machine avec une URI de données base64 dans `attach` : `data:<mime>;name=<percent-encoded file name>;base64,<data>`. `name=` conserve le nom. Les données intégrées sont limitées à **50 Mio par commande**. Pour un fichier plus gros, utilisez une URL de stockage dans le message ou un chemin absolu déjà présent sur l’hôte TwiCC. Les messages entre instances transmettent tous les fichiers en ligne : seule l’URL convient alors aux gros fichiers.

### Préparation

Démarrez TwiCC avec un mot de passe, obligatoire pour activer le MCP externe. Un redémarrage sans mot de passe désactive le MCP externe tout en conservant les autorisations et l’URL. Après rétablissement du mot de passe, réactivez-le ; les clients peuvent réutiliser leurs identifiants non expirés. Les autorisations révoquées restent révoquées.

Pour définir le mot de passe :

```
<twicc> password set
```

Remplacez `<twicc>` par votre commande habituelle de lancement, puis redémarrez TwiCC.

Dans **Paramètres → MCP externe**, saisissez l’**URL MCP dédiée**, puis **Appliquer**. Indiquez uniquement l’origine HTTPS, par exemple `https://mcp.example.com`, sans `/mcp`. Activez ensuite l’**accès MCP externe**.

Utilisez un nom d’hôte distinct des adresses externe, de partage et d’instances partenaires. Cet hôte dessert seulement MCP et OAuth, jamais l’interface, les fichiers ou les autres routes de l’application.

Le client doit pouvoir joindre directement l’adresse. Un tunnel avec connexion interactive par email ou SSO ne convient pas aux appels entre machines. Créez une adresse distincte sans ce contrôle vers le même serveur, conservez la protection sur votre accès habituel ; TwiCC protège l’adresse MCP par OAuth et votre approbation.

Consultez [Accéder à TwiCC de partout](help/external-url).

### Connecter un client

Copiez l’**URL MCP** des paramètres dans la configuration MCP distante du client. Cette URL inclut `/mcp`, par exemple `https://mcp.example.com/mcp`.

Le client doit prendre en charge le MCP distant avec OAuth. Ses réglages dépendent du logiciel ; TwiCC fournit les informations d’autorisation par les points de découverte MCP standards.

Un client de bureau peut recevoir le retour navigateur sur `http://127.0.0.1` ou `http://[::1]`, avec un port disponible différent à chaque connexion. Adresse, chemin et paramètres enregistrés doivent toujours correspondre. Cette exception de port ne s’applique ni aux retours HTTPS distants ni au nom `localhost`.

Démarrez la connexion depuis le client. Une page d’autorisation affiche un code de vérification : gardez-la ouverte jusqu’à la fin. Sur vos appareils connectés, TwiCC affiche une notification persistante. Choisissez **Examiner** et saisissez ce code pour relier votre approbation à la demande initiée.

Vous pouvez approuver depuis un autre appareil ; le navigateur d’origine termine toujours OAuth. La notification disparaît des autres appareils une fois la demande résolue.

Examinez les détails avant **Autoriser** ; choisissez **Refuser** si vous n’êtes pas à l’origine de la demande. Une demande expire après dix minutes : recommencez alors depuis le client.

### Noms et en-têtes de messages

Attribuez facultativement un nom à la connexion, par exemple **ChatGPT** ou **Assistant de bureau**, modifiable ensuite dans les détails. Le formulaire propose le nom déclaré par le client ; confirmez-le, modifiez-le ou effacez-le. Seul le nom approuvé est utilisé : un client ne peut pas s’attribuer un nom dans vos conversations.

Les messages portent par exemple **Message via ChatGPT**, ou **Message via MCP externe** sans nom. L’en-tête identifie la connexion, pas une autre session.

L’**identifiant du client** est technique, distinct du jeton d’accès et du code de vérification. Vous n’avez pas besoin de le copier pour approuver.

### Gérer les connexions

Dans **Paramètres → MCP externe → Gérer les connexions**, trois sections apparaissent si elles contiennent des éléments :

- **Demandes à examiner** : en attente de votre décision ;
- **Actives** : approuvées, y compris celles terminant OAuth ;
- **Révoquées** : sans accès.

**Examiner** ouvre une demande et **Détails** une connexion. Fermer les détails revient à la liste si vous en venez. Depuis une notification, ils s’ouvrent directement et leur fermeture n’ouvre pas la liste.

Les clients sont indépendants : révoquer l’un ne révoque pas les autres.

### Révoquer l’accès

**Révoquer** bloque les prochains appels MCP et invalide les identifiants de la connexion, sans annuler le travail effectué ni arrêter les sessions déjà lancées. L’entrée reste listée. Une nouvelle connexion doit être initiée depuis le client puis approuvée.

Modifier l’URL dédiée ou désactiver l’accès externe révoque les connexions existantes. Configurez la nouvelle adresse dans les clients et reconnectez-les.

### Protection contre les abus OAuth

TwiCC limite les nouvelles demandes par client et source réseau : trois demandes en attente par client, dix par source ; une source peut conserver vingt clients enregistrés sans autorisation reçue.

Des refus répétés ou un trafic inhabituellement élevé déclenchent une pause de **dix minutes** sur les inscriptions et autorisations. Une notification **Abus OAuth suspecté** apparaît ; paramètres et gestionnaire indiquent motif, compteurs récents et durée restante.

Connexions existantes, renouvellements, révocations et demandes déjà en cours restent disponibles. La pause expire automatiquement ; l’alerte reste jusqu’à sa fermeture. Un trafic élevé est un soupçon, pas une preuve : plusieurs clients peuvent partager une source réseau.

**Suspendre tous les accès externes** bloque les nouvelles requêtes MCP externes et OAuth sans révoquer les autorisations existantes. Les opérations déjà lancées peuvent terminer. Réactivez l’accès dans les paramètres pour reprendre. Cette suspension manuelle persiste aux redémarrages.

Compteurs, alertes et pauses automatiques sont réinitialisés au redémarrage. Les quotas d’inscription et de demandes en attente restent enregistrés. Les expirations normales continuent pendant une suspension.

Les limites utilisent l’adresse client fournie par le serveur ASGI. Un proxy doit transmettre l’adresse réelle et être approuvé par ce serveur ; TwiCC ne fait pas confiance aux en-têtes de transfert arbitraires. Les IPv6 du même /64 partagent un quota. Seule une empreinte de source avec clé est enregistrée, jamais l’adresse IP.

### Si la connexion ne se termine pas

Vérifiez que le MCP externe est actif, que le client utilise l’URL copiée avec `/mcp`, que le nom dédié atteint cette instance et qu’aucune page de connexion du tunnel ne s’interpose.

Gardez le navigateur d’origine ouvert pendant l’approbation. L’état **connexion en cours** signifie que l’approbation a réussi mais qu’OAuth n’est pas terminé. Si la demande expire, recommencez depuis le client.

### Commandes groupées

`batch_read` regroupe des lectures indépendantes dans un seul appel et en exécute jusqu’à quatre simultanément par défaut. `mode: sequential` impose l’ordre. `batch` exécute toujours séquentiellement des commandes ordonnées, y compris des modifications. Ces outils existent aussi pour les agents internes.

Découvrez d’abord le schéma de chaque commande, puis fournissez son nom MCP et ses arguments :

```json
{
  "calls": [
    {"id": "recent", "name": "sessions", "arguments": {"limit": 5}},
    {"id": "projects", "name": "projects", "arguments": {}}
  ]
}
```

Chaque appel exige un `id` unique, un `name` et un objet `arguments`. Tout le groupe est validé avant exécution ; un appel invalide rejette l’ensemble. Les contrôles d’autorisation s’appliquent à chacun et les clients externes doivent toujours fournir les identifiants de session.

Les résultats arrivent ensemble dans l’ordre d’entrée, avec identifiant, état d’exécution et réponse habituelle `{exit_code, result, error}`. Vérifiez le champ global `ok` et chaque résultat : un groupe terminé peut contenir des échecs ou des commandes ignorées. Une commande peut réussir avec réponse volumineuse omise (`response_omitted: true`) ; le `ok` global est alors faux.

`batch` s’arrête par défaut à la première erreur d’exécution ; `on_error: continue` tente la suite. `batch_read` utilise `continue` par défaut. Le parallèle exige `continue` ; pour `stop`, utilisez le mode séquentiel. Une réponse omise n’arrête pas la suite. Les modifications terminées restent appliquées : aucun retour arrière, nouvel essai automatique ou transfert de résultat dans les arguments suivants. Les groupes imbriqués ne sont pas pris en charge.

Un groupe accepte **20 commandes** au maximum. Les connexions MCP partagent une limite de quatre groupes actifs et huit commandes groupées actives pour l’instance. Au-delà, réponse `server_busy`. Les outils individuels ne sont pas soumis à cette limite d’admission. La requête complète est limitée à **72 Mio**, pièces jointes comprises ; chaque commande accepte au plus **50 Mio** de pièces jointes intégrées. Les réponses de plus de **384 Kio** sont explicitement omises ; le résultat combiné, texte et données structurées, reste sous **16 Mio**. Un client peut avoir des limites inférieures.

Gardez les groupes courts et séparez les longues attentes. Les délais habituels de chaque commande s’appliquent sans délai global supplémentaire. Une attente longue peut occuper toute la capacité même après annulation du client. Une annulation ou un délai dépassé ne prouve pas l’arrêt des écritures : inspectez les ressources avant de réessayer une écriture incertaine. Les identifiants servent au diagnostic et n’empêchent pas un double traitement.

TwiCC vérifie l’autorisation externe avant chaque commande. Expiration, révocation, désactivation ou impossibilité de vérifier arrêtent la suite. Les commandes déjà démarrées peuvent terminer et leurs résultats collectés sont conservés.
