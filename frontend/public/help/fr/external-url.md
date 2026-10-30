---
title: "Accéder à TwiCC de partout"
---

L’**adresse externe** est celle de cette instance TwiCC depuis vos appareils. TwiCC l’utilise aussi pour créer des liens vers les sessions, afin qu’une notification externe ouvre la bonne conversation plutôt qu’une adresse `localhost` inaccessible.

### Utilité

- Ouvrir une session depuis votre **téléphone ou un autre ordinateur** pendant que TwiCC continue sur votre machine.
- Fournir des liens directs dans les **notifications externes** Apprise.

Si ce champ reste vide, TwiCC omet simplement ces liens.

### Pourquoi un tunnel ?

TwiCC est un processus local : `http://localhost:…` n’a de sens que sur sa machine. Un **tunnel** fournit une adresse stable et transfère les requêtes vers cette instance. Saisissez cette adresse comme adresse externe. Exemples :

- **Cloudflare Tunnel** (`cloudflared`) : tunnel nommé avec nom d’hôte stable.
- **Tailscale** : VPN maillé privé entre vos appareils, avec exposition publique facultative par Funnel.
- **ngrok** : URL publique rapide vers un port local.

### Protéger le tunnel

Un tunnel peut rendre l’instance accessible sur Internet. Utilisez les protections du fournisseur :

- **Cloudflare Tunnel** : ajoutez **Cloudflare Access** (code par email, SSO Google/GitHub), des règles IP ou un WAF.
- **Tailscale** : conservez l’accès sur votre **réseau privé**, évitez Funnel sauf nécessité et limitez les appareils par ACL.
- **ngrok** : activez l’**authentification Basic**, **OAuth** ou des listes d’IP autorisées.

### D’abord le mot de passe TwiCC

**TwiCC refuse toute connexion non locale sans mot de passe.** L’adresse externe ne fonctionne donc qu’après `twicc password set`.

La protection du tunnel s’ajoute au mot de passe et bloque le trafic indésirable avant même l’écran de connexion.
