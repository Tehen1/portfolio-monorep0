# GUIDE : CRÉATION DU REPOSITORY GITHUB
**Étapes pour pousser portfolio-monorep0 sur GitHub**

---

## 📋 ÉTAPE 1 : Créer le Repository sur GitHub

1. **Allez sur** : https://github.com/new
2. **Remplissez** :
   - Repository name: `portfolio-monorepo`
   - Description: `Production-ready monorepo with DeFi agents, RhymeChain investor pack, and multi-domain portfolio`
   - Visibility: **Private** (recommandé pour commencer)
   - ❌ **NE PAS** cocher "Initialize with README" (nous avons déjà du code)
3. **Cliquez** sur "Create repository"

---

## 📋 ÉTAPE 2 : Connecter et Pousser le Code

Copiez-collez ces commandes dans votre terminal :

```bash
cd /Users/devtehen/Desktop/Dev/portfolio-monorep0

# Configurer le remote (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/portfolio-monorepo.git

# Vérifier que le remote est bien configuré
git remote -v

# Pousser le code
git branch -M main
git push -u origin main
```

---

## 📋 ÉTAPE 3 : Vérification

Une fois le push terminé, vous devriez voir :
- ✅ Tous vos fichiers sur GitHub
- ✅ Le README.md visible
- ✅ Les dossiers `apps/`, `packages/`, `docs/` visibles

**URL de votre repo** : `https://github.com/USERNAME/portfolio-monorepo`

---

## ⚠️ EN CAS D'ERREUR

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/portfolio-monorepo.git
```

### Erreur : "Authentication failed"
Utilisez un Personal Access Token :
1. Allez sur https://github.com/settings/tokens
2. Créez un token avec scope `repo`
3. Utilisez le token comme mot de passe lors du push

---

## ✅ CONFIRMATION

Une fois le push réussi, copiez le lien de votre repo ici pour confirmation.
