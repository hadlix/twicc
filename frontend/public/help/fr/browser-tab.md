---
title: "L’onglet Navigateur"
---

L’onglet Navigateur intègre une page de votre choix, généralement le serveur de développement du projet, à côté de la conversation. La page fonctionne comme dans un onglet normal : réseau direct, rechargement à chaud, service workers. TwiCC ne la relaie pas et ne l’isole pas dans un bac à sable.

**Pour confier la configuration du serveur à un agent**, fournissez-lui cette page : <https://github.com/twidi/twicc/blob/main/frontend/public/help/browser-tab.md>. Elle décrit l’intégration, les cookies et le script compagnon. L’agent doit aussi connaître votre adresse d’accès à TwiCC. **Ajouter les instructions au message** et **Copier les instructions pour un agent** préparent ces informations et l’extrait du compagnon.

### Ouvrir une page

Saisissez une URL dans la barre d’adresse. **Accueil** ouvre l’URL par défaut enregistrée. Le menu des **favoris** enregistre l’URL actuelle pour le projet ou un espace de travail ; l’onglet s’y ouvrira directement. La dernière URL est également mémorisée par session.

### Limites de l’intégration

- Les sites refusant les iframes, comme beaucoup de sites publics, affichent un avertissement. Utilisez **Ouvrir dans un nouvel onglet du navigateur**.
- Si TwiCC utilise `https`, le navigateur bloque les pages `http://` non sécurisées : c’est du contenu mixte.

Cet onglet est surtout adapté à vos serveurs de développement locaux.

### Connexion et stockage

La conservation de la connexion dépend de l’emplacement du serveur par rapport à TwiCC.

**Même hôte** : si les deux utilisent `localhost`, quels que soient leurs ports, aucune configuration n’est nécessaire. La page retrouve ses cookies et son stockage habituels ; une connexion effectuée ailleurs reste valable. `localhost:5173` et `localhost:3000` sont considérés comme le même site.

**Domaines différents** : si TwiCC et l’application utilisent des tunnels distincts, le navigateur isole la page intégrée. Vous démarrez déconnecté et devez configurer le **développement uniquement** :

- **Autoriser l’intégration** : adaptez `X-Frame-Options` / `frame-ancestors`, souvent restrictifs dans Django, Rails et autres frameworks.
- **Cookies** : utilisez `SameSite=None; Secure` pour la session. `Secure` fonctionne sur `https` et `http://localhost`, mais pas sur une adresse IP locale en HTTP simple.
- **Connectez-vous une fois dans l’onglet**. Son espace privé de cookies et de stockage persiste après rechargement. `localStorage` et `IndexedDB` fonctionnent sans configuration supplémentaire dans cette isolation.

Gardez ces réglages derrière une option de développement ; n’ouvrez pas ainsi l’intégration et les cookies en production.

### Script compagnon

Sans compagnon, TwiCC ne voit pas la navigation interne de la page : Précédent et Suivant ne suivent que les URL de la barre d’outils. Le **script compagnon**, ajouté à votre page de développement, active :

- l’historique réel : Précédent, Suivant et Actualiser pilotent la page ; la navigation SPA actualise la barre d’adresse ;
- la **sélection d’éléments** : activez le curseur de la barre d’outils, cliquez sur un élément, puis sur le commentaire. Ajoutez une note et éventuellement une capture avant d’insérer l’ensemble dans votre message. La description inclut les balises, identifiants et classes que l’agent peut retrouver dans le code, pour préciser « agrandis ceci » ou « ce libellé est incorrect » ;
- les **erreurs de page** : exceptions non interceptées et appels `console.error` sont comptés dans la barre d’outils et ajoutables au message en un clic.

Ajoutez une balise vers `/_twicc/browser-companion.js` sur votre hôte TwiCC :

```html
<script src="https://your-twicc-host/_twicc/browser-companion.js" defer></script>
```

Placez-la **le plus tôt possible dans `<head>`**, idéalement avant tout autre script, pour capturer navigation et erreurs dès le début. `defer` évite de bloquer la page. Le compagnon est invisible et inactif hors de TwiCC ; il peut rester dans le modèle de développement.

Si le compagnon manque, la bannière et le bouton **prise** proposent l’extrait prérempli. Depuis une autre machine, configurez l’[adresse externe](help/external-url) afin que cet extrait utilise une adresse accessible par votre navigateur.

La **prise** est colorée quand le compagnon est connecté, rouge s’il manque et atténuée pendant la détection. Cliquez dessus pour ouvrir cette aide.

### Mode adaptatif

Le bouton **téléphone** fixe les dimensions de la page : choisissez un appareil, saisissez largeur × hauteur, inversez-les ou glissez les poignées. La page se réorganise comme dans une fenêtre de cette taille, sans nécessiter le compagnon.

### Autres fonctions

- **Plein écran** agrandit l’onglet avec sa barre d’outils.
- **Ouvrir dans un nouvel onglet du navigateur** ouvre l’URL dans votre navigateur habituel.
- Erreurs, sélections et commentaires sont insérés dans votre brouillon ; rien n’est envoyé à l’agent sans votre action.
