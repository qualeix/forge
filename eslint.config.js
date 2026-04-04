const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    rules: {
      // Pas d'interdiction globale de `any` - le projet l'utilise intentionnellement
      "@typescript-eslint/no-explicit-any": "off",
      // Warn sur les variables non utilisées, mais tolérer le prefixe _
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Apostrophes françaises dans le JSX - pas besoin d'échappement HTML
      "react/no-unescaped-entities": "off",
      // Pas de console.log en prod idéalement, mais warn seulement
      "no-console": "warn",
    },
  },
  {
    ignores: ["node_modules/", "android/", "assets/", ".expo/"],
  },
]);
