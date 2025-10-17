# Mettre à jour Expo SDK

1. Installer la nouvelle version d'expo : `npm install expo@^<new_sdk_version>.0.0`
2. Mettre à jour les dépendances selon ce que la version d'expo nécessite : `npx expo install --fix`
3. Si ça ne marche pas et que c'est la dernière version d'expo qui a été installée,  mettre à jour les dépendances : `npm update`

### Conflits

1. Supprimer **node_modules** et **package-lock.json**
2. Supprimer toutes les dépendances du **package.json**
3. Réinstaller expo : `npm install expo@^<new_sdk_version>.0.0`
4. Réinstaller toutes les dépendances une par une en utilisant Expo CLI : `npx expo install <dep>`
5. Faire de même pour les dépendances de développement : `npx expo install <dep> -- --save-dev`

**Remarque :  Si une erreur est levée au moment de l'installation d'une dépendance, ignorer la dépendance et ne pas l'installer.**

### Notes

- Même si l'application fonctionne alors qu'il y a des conflits de dépendances, il faut les résoudre pour le build, donc ça ne sert à rien d'utiliser `--legacy-peer-deps` ou `--force`.