# Mettre à jour Expo SDK

1. Supprimer **node_modules** et **package-lock.json**
2. `npm install expo@^<new_sdk_version>.0.0`
3. `npx expo install --fix -- --legacy-peer-deps`
4. Si un package manque quand on lance l'application : `npx expo install <missing_package> -- --legacy-peer-deps`
