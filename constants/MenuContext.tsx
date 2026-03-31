import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import * as SQLite from "expo-sqlite";
import { useSettings } from "./SettingsContext";
import type { DayKey } from "./data";

export type MenuMeal = {
  id: number;
  day_key: string;
  name: string;
  details: string;
  time: string;
  sort_order: number;
  notif_enabled: number;
  notif_offset: number;
};

type MenuCtx = {
  menuData: Record<string, MenuMeal[]>;
  addMeal: (dayKey: DayKey, meal: { name: string; time: string; details: string; notif_enabled?: number; notif_offset?: number }) => Promise<void>;
  updateMeal: (id: number, fields: { name?: string; time?: string; details?: string; notif_enabled?: number; notif_offset?: number }) => Promise<void>;
  deleteMeal: (id: number, dayKey: string) => Promise<void>;
};

const MenuContext = createContext<MenuCtx>({
  menuData: {},
  addMeal: async () => {},
  updateMeal: async () => {},
  deleteMeal: async () => {},
});

const parseTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

export function MenuProvider({ children }: { children: ReactNode }) {
  // db de SettingsContext = signal que le seeding est terminé, pas utilisé pour les requêtes
  const { db: settingsDb } = useSettings();
  const [ownDb, setOwnDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [menuData, setMenuData] = useState<Record<string, MenuMeal[]>>({});
  const initialized = useRef(false);

  // Ouvrir une connexion indépendante dès que le seeding est confirmé
  useEffect(() => {
    if (!settingsDb || initialized.current) return;
    initialized.current = true;
    SQLite.openDatabaseAsync("forge.db").then(setOwnDb);
  }, [settingsDb]);

  const load = useCallback(async () => {
    if (!ownDb) return;
    const rows = await ownDb.getAllAsync<MenuMeal>(
      "SELECT id, day_key, name, details, time, sort_order, notif_enabled, notif_offset FROM menu_meals"
    );
    const grouped: Record<string, MenuMeal[]> = {};
    for (const row of rows) {
      if (!grouped[row.day_key]) grouped[row.day_key] = [];
      grouped[row.day_key].push(row);
    }
    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => parseTime(a.time) - parseTime(b.time));
    }
    setMenuData(grouped);
  }, [ownDb]);

  useEffect(() => { load(); }, [load]);

  const addMeal = useCallback(async (dayKey: DayKey, meal: { name: string; time: string; details: string; notif_enabled?: number; notif_offset?: number }) => {
    if (!ownDb) return;
    const existing = menuData[dayKey] ?? [];
    await ownDb.runAsync(
      "INSERT INTO menu_meals (day_key, name, details, time, sort_order, notif_enabled, notif_offset) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [dayKey, meal.name, meal.details, meal.time, existing.length, meal.notif_enabled ?? 1, meal.notif_offset ?? 0]
    );
    await load();
  }, [ownDb, menuData, load]);

  const updateMeal = useCallback(async (id: number, fields: { name?: string; time?: string; details?: string; notif_enabled?: number; notif_offset?: number }) => {
    if (!ownDb) return;
    const sets: string[] = [];
    const values: (string | number)[] = [];
    if (fields.name !== undefined) { sets.push("name = ?"); values.push(fields.name); }
    if (fields.time !== undefined) { sets.push("time = ?"); values.push(fields.time); }
    if (fields.details !== undefined) { sets.push("details = ?"); values.push(fields.details); }
    if (fields.notif_enabled !== undefined) { sets.push("notif_enabled = ?"); values.push(fields.notif_enabled); }
    if (fields.notif_offset !== undefined) { sets.push("notif_offset = ?"); values.push(fields.notif_offset); }
    if (sets.length === 0) return;
    values.push(id);
    await ownDb.runAsync(`UPDATE menu_meals SET ${sets.join(", ")} WHERE id = ?`, values);
    await load();
  }, [ownDb, load]);

  const deleteMeal = useCallback(async (id: number, _dayKey: string) => {
    if (!ownDb) return;
    await ownDb.runAsync("DELETE FROM menu_meals WHERE id = ?", [id]);
    await load();
  }, [ownDb, load]);

  return (
    <MenuContext.Provider value={{ menuData, addMeal, updateMeal, deleteMeal }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
