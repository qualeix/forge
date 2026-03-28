import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useSettings } from "./SettingsContext";
import { DEFAULT_SCHEDULE } from "./data";

type Schedule = Record<number, string | null>;

export type WorkoutRecord = {
  key: string;
  name: string;
  name_fr: string;
  restSeconds: number;
  sortOrder: number;
};

export type ExerciseRecord = {
  id: string;
  workoutKey: string;
  name: string;
  name_fr: string;
  sets: number;
  reps: string;
  cue: string;
  cue_fr: string;
  technique: string;
  technique_fr: string;
  sortOrder: number;
};

type ProgramCtx = {
  schedule: Schedule;
  workouts: WorkoutRecord[];
  exercises: Record<string, ExerciseRecord[]>;
  loaded: boolean;
  setDayWorkout: (dayIndex: number, workoutKey: string | null) => void;
  getWorkoutDisplayName: (workoutKey: string) => string;
  getWorkoutForDay: (dayIndex: number) => any;
  getTodayWorkout: () => any;
  createWorkout: (name: string, nameFr: string) => Promise<string>;
  deleteWorkout: (workoutKey: string) => Promise<void>;
  updateWorkout: (workoutKey: string, fields: Partial<Pick<WorkoutRecord, "name" | "name_fr" | "restSeconds">>) => void;
  addExercise: (workoutKey: string, ex: Omit<ExerciseRecord, "workoutKey" | "sortOrder">) => Promise<void>;
  removeExercise: (workoutKey: string, exerciseId: string) => Promise<void>;
  updateExercise: (workoutKey: string, exerciseId: string, fields: Partial<Omit<ExerciseRecord, "id" | "workoutKey" | "sortOrder">>) => void;
  reorderExercises: (workoutKey: string, exerciseIds: string[]) => void;
  reload: () => Promise<void>;
};

const ProgramContext = createContext<ProgramCtx>({
  schedule: DEFAULT_SCHEDULE,
  workouts: [],
  exercises: {},
  loaded: false,
  setDayWorkout: () => {},
  getWorkoutDisplayName: () => "",
  getWorkoutForDay: () => null,
  getTodayWorkout: () => null,
  createWorkout: async () => "",
  deleteWorkout: async () => {},
  updateWorkout: () => {},
  addExercise: async () => {},
  removeExercise: async () => {},
  updateExercise: () => {},
  reorderExercises: () => {},
  reload: async () => {},
});

export function ProgramProvider({ children }: { children: ReactNode }) {
  const { db, lang } = useSettings();
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE);
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [exercises, setExercises] = useState<Record<string, ExerciseRecord[]>>({});
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!db) return;

    // Schedule
    const scheduleRows = await db.getAllAsync<{ day_index: number; workout_key: string | null }>(
      "SELECT day_index, workout_key FROM schedule"
    );
    if (scheduleRows.length > 0) {
      const sched: Schedule = {};
      for (let i = 0; i < 7; i++) sched[i] = null;
      scheduleRows.forEach((r) => { sched[r.day_index] = r.workout_key; });
      setSchedule(sched);
    }

    // Workouts (exclude "home" from assignable list display — it's still in DB)
    const wRows = await db.getAllAsync<{
      key: string; name: string; name_fr: string; rest_seconds: number; sort_order: number;
    }>("SELECT key, name, name_fr, rest_seconds, sort_order FROM workouts ORDER BY sort_order");
    setWorkouts(wRows.map((r) => ({
      key: r.key,
      name: r.name,
      name_fr: r.name_fr,
      restSeconds: r.rest_seconds,
      sortOrder: r.sort_order,
    })));

    // Exercises grouped by workout_key
    const eRows = await db.getAllAsync<{
      id: string; workout_key: string; name: string; name_fr: string;
      sets: number; reps: string; cue: string; cue_fr: string;
      technique: string; technique_fr: string; sort_order: number;
    }>("SELECT id, workout_key, name, name_fr, sets, reps, cue, cue_fr, technique, technique_fr, sort_order FROM exercises ORDER BY sort_order");
    const grouped: Record<string, ExerciseRecord[]> = {};
    eRows.forEach((r) => {
      if (!grouped[r.workout_key]) grouped[r.workout_key] = [];
      grouped[r.workout_key].push({
        id: r.id,
        workoutKey: r.workout_key,
        name: r.name,
        name_fr: r.name_fr,
        sets: r.sets,
        reps: r.reps,
        cue: r.cue,
        cue_fr: r.cue_fr,
        technique: r.technique,
        technique_fr: r.technique_fr,
        sortOrder: r.sort_order,
      });
    });
    setExercises(grouped);
    setLoaded(true);
  }, [db]);

  useEffect(() => { load(); }, [load]);

  const setDayWorkout = (dayIndex: number, workoutKey: string | null) => {
    setSchedule((prev) => ({ ...prev, [dayIndex]: workoutKey }));
    if (db) {
      db.runAsync(
        "INSERT OR REPLACE INTO schedule (day_index, workout_key) VALUES (?, ?)",
        [dayIndex, workoutKey]
      ).catch(() => {});
    }
  };

  const getWorkoutDisplayName = (workoutKey: string) => {
    const w = workouts.find((x) => x.key === workoutKey);
    if (!w) return workoutKey;
    return lang === "fr" ? w.name_fr : w.name;
  };

  const assembleWorkout = (workoutKey: string) => {
    const w = workouts.find((x) => x.key === workoutKey);
    if (!w) return null;
    const exs = (exercises[workoutKey] ?? []).map((e) => ({
      id: e.id,
      name: e.name,
      name_fr: e.name_fr,
      sets: e.sets,
      reps: isNaN(Number(e.reps)) ? e.reps : Number(e.reps),
      cue: e.cue,
      cue_fr: e.cue_fr,
      technique: e.technique,
      technique_fr: e.technique_fr,
    }));
    return {
      name: w.name,
      name_fr: w.name_fr,
      restSeconds: w.restSeconds,
      exercises: exs,
    };
  };

  const getWorkoutForDay = (dayIndex: number) => {
    const key = schedule[dayIndex];
    if (!key) return null;
    return assembleWorkout(key);
  };

  const getTodayWorkout = () => getWorkoutForDay(new Date().getDay());

  const createWorkout = async (name: string, nameFr: string): Promise<string> => {
    const key = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const maxSort = workouts.length > 0 ? Math.max(...workouts.map((w) => w.sortOrder)) + 1 : 0;
    if (db) {
      await db.runAsync(
        "INSERT INTO workouts (key, name, name_fr, rest_seconds, sort_order) VALUES (?, ?, ?, 90, ?)",
        [key, name, nameFr || name, maxSort]
      );
    }
    await load();
    return key;
  };

  const deleteWorkout = async (workoutKey: string) => {
    if (db) {
      await db.runAsync("DELETE FROM workouts WHERE key = ?", [workoutKey]);
      // Clear schedule entries pointing to deleted workout
      await db.runAsync("UPDATE schedule SET workout_key = NULL WHERE workout_key = ?", [workoutKey]);
    }
    setSchedule((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[Number(k)] === workoutKey) next[Number(k)] = null;
      });
      return next;
    });
    await load();
  };

  const updateWorkout = (workoutKey: string, fields: Partial<Pick<WorkoutRecord, "name" | "name_fr" | "restSeconds">>) => {
    setWorkouts((prev) => prev.map((w) => w.key === workoutKey ? { ...w, ...fields } : w));
    if (db) {
      if (fields.name !== undefined) db.runAsync("UPDATE workouts SET name = ? WHERE key = ?", [fields.name, workoutKey]).catch(() => {});
      if (fields.name_fr !== undefined) db.runAsync("UPDATE workouts SET name_fr = ? WHERE key = ?", [fields.name_fr, workoutKey]).catch(() => {});
      if (fields.restSeconds !== undefined) db.runAsync("UPDATE workouts SET rest_seconds = ? WHERE key = ?", [fields.restSeconds, workoutKey]).catch(() => {});
    }
  };

  const addExercise = async (workoutKey: string, ex: Omit<ExerciseRecord, "workoutKey" | "sortOrder">) => {
    const existing = exercises[workoutKey] ?? [];
    const maxSort = existing.length > 0 ? Math.max(...existing.map((e) => e.sortOrder)) + 1 : 0;
    if (db) {
      await db.runAsync(
        "INSERT INTO exercises (id, workout_key, name, name_fr, sets, reps, cue, cue_fr, technique, technique_fr, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [ex.id, workoutKey, ex.name, ex.name_fr, ex.sets, ex.reps, ex.cue, ex.cue_fr, ex.technique, ex.technique_fr, maxSort]
      );
    }
    await load();
  };

  const removeExercise = async (workoutKey: string, exerciseId: string) => {
    if (db) {
      await db.runAsync("DELETE FROM exercises WHERE id = ? AND workout_key = ?", [exerciseId, workoutKey]);
    }
    await load();
  };

  const updateExercise = (workoutKey: string, exerciseId: string, fields: Partial<Omit<ExerciseRecord, "id" | "workoutKey" | "sortOrder">>) => {
    setExercises((prev) => ({
      ...prev,
      [workoutKey]: (prev[workoutKey] ?? []).map((e) =>
        e.id === exerciseId ? { ...e, ...fields } : e
      ),
    }));
    if (db) {
      const colMap: Record<string, string> = {
        name: "name", name_fr: "name_fr", sets: "sets", reps: "reps",
        cue: "cue", cue_fr: "cue_fr", technique: "technique", technique_fr: "technique_fr",
      };
      Object.entries(fields).forEach(([k, v]) => {
        const col = colMap[k];
        if (col && v !== undefined) {
          db.runAsync(`UPDATE exercises SET ${col} = ? WHERE id = ? AND workout_key = ?`, [v, exerciseId, workoutKey]).catch(() => {});
        }
      });
    }
  };

  const reorderExercises = (workoutKey: string, exerciseIds: string[]) => {
    setExercises((prev) => {
      const exs = prev[workoutKey] ?? [];
      const map = new Map(exs.map((e) => [e.id, e]));
      const reordered = exerciseIds
        .filter((id) => map.has(id))
        .map((id, i) => ({ ...map.get(id)!, sortOrder: i }));
      // append any missing
      const used = new Set(exerciseIds);
      exs.forEach((e) => { if (!used.has(e.id)) reordered.push({ ...e, sortOrder: reordered.length }); });
      return { ...prev, [workoutKey]: reordered };
    });
    if (db) {
      exerciseIds.forEach((id, i) => {
        db.runAsync("UPDATE exercises SET sort_order = ? WHERE id = ? AND workout_key = ?", [i, id, workoutKey]).catch(() => {});
      });
    }
  };

  return (
    <ProgramContext.Provider
      value={{
        schedule, workouts, exercises, loaded,
        setDayWorkout, getWorkoutDisplayName, getWorkoutForDay, getTodayWorkout,
        createWorkout, deleteWorkout, updateWorkout,
        addExercise, removeExercise, updateExercise, reorderExercises,
        reload: load,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export const useProgram = () => useContext(ProgramContext);
