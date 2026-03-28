import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as SQLite from "expo-sqlite";
import { translations, type Lang, type Translations } from "./i18n";

type SettingsCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  db: SQLite.SQLiteDatabase | null;
};

const SettingsContext = createContext<SettingsCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  db: null,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    async function init() {
      const database = await SQLite.openDatabaseAsync("forge.db");
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"
      );
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS pr_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_id TEXT NOT NULL, weight REAL NOT NULL, date TEXT NOT NULL)"
      );
      const langRow = await database.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'language'"
      );
      if (langRow) setLangState(langRow.value as Lang);
      setDb(database);
    }
    init();
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (db) {
      db.runAsync(
        "INSERT OR REPLACE INTO settings (key, value) VALUES ('language', ?)",
        [l]
      ).catch(() => {});
    }
  };

  return (
    <SettingsContext.Provider
      value={{ lang, setLang, t: translations[lang], db }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
