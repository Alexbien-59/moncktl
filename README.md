# 🍸 MonCocktail

> **Votre bar à la maison** — 130 recettes de cocktails classiques et créatifs, accessibles partout, même hors ligne.

🔗 **[Ouvrir l'application](https://a-rech.github.io/moncktl/)**

---

## ✨ Fonctionnalités

- 🔍 **Recherche par ingrédients** — sélectionnez vos ingrédients préférés, l'app trouve des cocktails possibles
- 📖 **Catalogue complet** — 130 recettes filtrables par type ou alcool de base
- 🎲 **Cocktail aléatoire** — laissez le hasard remplir votre verre
- ❤️ **Favoris** — sauvegardez vos cocktails préférés
- ⭐ **Notation** — notez chaque recette de 1 à 5 étoiles
- 📝 **Notes personnelles** — ajoutez vos astuces et variantes sur chaque fiche
- 🍸 **Profil gustatif** — barres de sucrosité, amertume et degré d'alcool sur chaque recette
- 💡 **Lexique** — techniques de bar, alcools et matériel expliqués
- 📱 **PWA** — installable sur mobile, fonctionne hors ligne

---

## 📱 Installer sur votre téléphone

### Android (Chrome)
1. Ouvrez l'URL dans **Chrome**
2. Appuyez sur le menu **⋮**
3. Sélectionnez **"Ajouter à l'écran d'accueil"**
4. Confirmez l'installation

### iPhone / iPad (Safari)
1. Ouvrez [https://a-rech.github.io/moncktl/](https://a-rech.github.io/moncktl/) dans **Safari**
2. Appuyez sur le bouton **Partager** ↑
3. Sélectionnez **"Sur l'écran d'accueil"**
4. Confirmez → l'icône 🍸 apparaît sur votre écran

---

## 🗂 Structure du projet

```
moncktl/
├── index.html      ← Application complète (HTML/CSS/JS)
├── manifest.json   ← Configuration PWA (nom, icônes, thème)
├── sw.js           ← Service Worker (cache hors ligne)
├── icon-192.png    ← Icône 192×192 (Android / Chrome)
└── icon-512.png    ← Icône 512×512 (splash screen)
```

---

## 🛠 Technologies

- HTML / CSS / JavaScript vanilla — aucune dépendance externe
- PWA (Progressive Web App) — Service Worker + Web App Manifest
- localStorage pour la persistance des favoris, notes et évaluations
- Google Fonts (Playfair Display + DM Sans)

---

## 🍹 Catégories de cocktails

Rhum · Vodka · Gin · Whisky · Tequila & Mezcal · Cognac & Brandy · Champagne & Vins · Amaretto · Apéritifs · Shortdrinks · Longdrinks · Tiki

---

*Fait avec 🍸 et beaucoup de passion pour la mixologie.*
