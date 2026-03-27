import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as SQLite from "expo-sqlite";
import { translations, type Lang, type Translations } from "../constants/i18n";

type SettingsCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
};

const SettingsContext = createContext<SettingsCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  notificationsEnabled: true,
  setNotificationsEnabled: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [notificationsEnabled, setNotifState] = useState(true);
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
      const notifRow = await database.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'notifications'"
      );
      if (langRow) setLangState(langRow.value as Lang);
      if (notifRow) setNotifState(notifRow.value === "1");
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

  const setNotificationsEnabled = (v: boolean) => {
    setNotifState(v);
    if (db) {
      db.runAsync(
        "INSERT OR REPLACE INTO settings (key, value) VALUES ('notifications', ?)",
        [v ? "1" : "0"]
      ).catch(() => {});
    }
  };

  return (
    <SettingsContext.Provider
      value={{ lang, setLang, t: translations[lang], notificationsEnabled, setNotificationsEnabled }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
