const fs = require("fs");
const path = require("path");

const language = 'en';

// Chemin du dossier contenant tes fichiers Markdown
const inputDir = path.join(__dirname, "assets/docs/" + language);
const outputDir = path.join(__dirname, "assets/docs/" + language);

// Nom du fichier Markdown
const mdFile = path.join(inputDir, "doc.md");

// Nom du fichier JSON à générer
const jsonFile = path.join(outputDir, "doc.json");

// Lire le Markdown
const markdownContent = fs.readFileSync(mdFile, "utf-8");

// Créer l'objet JSON
const jsonData = { content: markdownContent };

// Écrire le JSON dans le fichier
fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));

console.log(`Fichier JSON généré : ${jsonFile}`);
