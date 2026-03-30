import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import * as SQLite from "expo-sqlite";
import { strings, type AppStrings } from "./strings";
import { WORKOUT_DATA, MENU_DATA, DEFAULT_SCHEDULE, type WorkoutKey, type DayKey } from "./data";

type SettingsCtx = {
  t: AppStrings;
  db: SQLite.SQLiteDatabase | null;
};

const SettingsContext = createContext<SettingsCtx>({
  t: strings,
  db: null,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      const database = await SQLite.openDatabaseAsync("forge.db");
      await database.runAsync("PRAGMA foreign_keys = ON");
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"
      );
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS pr_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_id TEXT NOT NULL, weight REAL NOT NULL, date TEXT NOT NULL)"
      );
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS schedule (day_index INTEGER PRIMARY KEY, workout_key TEXT)"
      );
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS workouts (key TEXT PRIMARY KEY, name TEXT NOT NULL, name_fr TEXT NOT NULL, rest_seconds INTEGER NOT NULL DEFAULT 90, sort_order INTEGER NOT NULL DEFAULT 0)"
      );
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS exercises (id TEXT NOT NULL, workout_key TEXT NOT NULL, name TEXT NOT NULL, name_fr TEXT NOT NULL, sets INTEGER NOT NULL, reps TEXT NOT NULL, cue TEXT NOT NULL DEFAULT '', cue_fr TEXT NOT NULL DEFAULT '', technique TEXT NOT NULL DEFAULT '', technique_fr TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (id, workout_key), FOREIGN KEY (workout_key) REFERENCES workouts(key) ON DELETE CASCADE)"
      );
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS menu_meals (id INTEGER PRIMARY KEY AUTOINCREMENT, day_key TEXT NOT NULL, name TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', time TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0)"
      );

      // Seed workouts + exercises au premier lancement
      const seeded = await database.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'data_seeded'"
      );
      if (!seeded) {
        const keys = Object.keys(WORKOUT_DATA) as WorkoutKey[];
        for (let si = 0; si < keys.length; si++) {
          const wk = keys[si];
          const w = WORKOUT_DATA[wk];
          await database.runAsync(
            "INSERT OR IGNORE INTO workouts (key, name, name_fr, rest_seconds, sort_order) VALUES (?, ?, ?, ?, ?)",
            [wk, w.name, (w as any).name_fr ?? w.name, (w as any).restSeconds ?? 90, si]
          );
          for (let ei = 0; ei < w.exercises.length; ei++) {
            const ex = w.exercises[ei];
            await database.runAsync(
              "INSERT OR IGNORE INTO exercises (id, workout_key, name, name_fr, sets, reps, cue, cue_fr, technique, technique_fr, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [ex.id, wk, ex.name, (ex as any).name_fr ?? ex.name, ex.sets, String(ex.reps), (ex as any).cue ?? "", (ex as any).cue_fr ?? "", (ex as any).technique ?? "", (ex as any).technique_fr ?? "", ei]
            );
          }
        }
        // Seed planning par défaut
        for (const [dayStr, wKey] of Object.entries(DEFAULT_SCHEDULE)) {
          await database.runAsync(
            "INSERT OR IGNORE INTO schedule (day_index, workout_key) VALUES (?, ?)",
            [Number(dayStr), wKey]
          );
        }

        // Migration depuis l'ancien schéma
        try {
          const oldNames = await database.getAllAsync<{ workout_key: string; custom_name: string }>(
            "SELECT workout_key, custom_name FROM workout_names"
          );
          for (const r of oldNames) {
            await database.runAsync(
              "UPDATE workouts SET name = ?, name_fr = ? WHERE key = ?",
              [r.custom_name, r.custom_name, r.workout_key]
            );
          }
        } catch {}
        try {
          const oldOrders = await database.getAllAsync<{ workout_key: string; exercise_ids: string }>(
            "SELECT workout_key, exercise_ids FROM exercise_order"
          );
          for (const r of oldOrders) {
            try {
              const ids: string[] = JSON.parse(r.exercise_ids);
              for (let i = 0; i < ids.length; i++) {
                await database.runAsync(
                  "UPDATE exercises SET sort_order = ? WHERE id = ? AND workout_key = ?",
                  [i, ids[i], r.workout_key]
                );
              }
            } catch {}
          }
        } catch {}

        try { await database.runAsync("DROP TABLE IF EXISTS workout_names"); } catch {}
        try { await database.runAsync("DROP TABLE IF EXISTS exercise_order"); } catch {}

        await database.runAsync(
          "INSERT OR REPLACE INTO settings (key, value) VALUES ('data_seeded', '1')"
        );
      }

      // Seed menu_meals séparément (utilisateurs existants inclus)
      const menuSeeded = await database.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'menu_seeded'"
      );
      if (!menuSeeded) {
        const dayKeys = Object.keys(MENU_DATA) as DayKey[];
        for (const dayKey of dayKeys) {
          const day = MENU_DATA[dayKey];
          for (let mi = 0; mi < day.meals.length; mi++) {
            const meal = day.meals[mi];
            await database.runAsync(
              "INSERT INTO menu_meals (day_key, name, details, time, sort_order) VALUES (?, ?, ?, ?, ?)",
              [dayKey, (meal as any).name_fr ?? meal.name, (meal as any).details_fr ?? meal.details, meal.time, mi]
            );
          }
        }
        await database.runAsync(
          "INSERT OR REPLACE INTO settings (key, value) VALUES ('menu_seeded', '1')"
        );
      }

      setDb(database);
    }
    init();
  }, []);

  return (
    <SettingsContext.Provider value={{ t: strings, db }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
