import * as Notifications from "expo-notifications";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform, NativeModules } from "react-native";
import type { MenuMeal } from "./MenuContext";
import type { WorkoutRecord } from "./ProgramContext";

export const NOTIF_CHANNEL = "forge";

const DAY_KEY_TO_JS: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

// Calcule le prochain timestamp pour un jour/heure donné (dans les 7 prochains jours)
function nextOccurrence(jsDayOfWeek: number, hour: number, minute: number): Date {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  const diff = (jsDayOfWeek - now.getDay() + 7) % 7;
  target.setDate(target.getDate() + diff);
  // Si c'est aujourd'hui mais l'heure est passée, décaler d'une semaine
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync(NOTIF_CHANNEL, {
        name: "Forge",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#F59E0B",
      });
    } catch (e) {
      console.warn("[Forge notif] setupNotificationChannel failed:", e);
    }
  }
}

export async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function getPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as "granted" | "denied" | "undetermined";
}

export async function checkBatteryOptimizationIgnored(): Promise<boolean> {
  if (Platform.OS !== "android") return true;
  try {
    return await NativeModules.BatteryModule.isIgnoringBatteryOptimizations();
  } catch {
    return false;
  }
}

// Lance le dialog d'exemption batterie.
export async function requestIgnoreBatteryOptimizations(): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    await IntentLauncher.startActivityAsync(
      "android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" as any,
      { data: "package:com.forge.app" }
    );
  } catch (e) {
    console.warn("[Forge notif] requestIgnoreBatteryOptimizations failed:", e);
  }
}

async function cancelByType(type: string) {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      all
        .filter((n) => n.content.data?.type === type)
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch (e) {
    console.warn(`[Forge notif] cancelByType(${type}) failed:`, e);
  }
}

export async function scheduleMealNotifications(
  menuData: Record<string, MenuMeal[]>,
  offsetMinutes: number = 0
) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    console.warn("[Forge notif] scheduleMealNotifications skipped: permission =", status);
    return;
  }
  await cancelByType("meal");
  let count = 0;
  for (const [dayKey, meals] of Object.entries(menuData)) {
    const jsDay = DAY_KEY_TO_JS[dayKey];
    if (jsDay === undefined || !meals.length) continue;
    for (const meal of meals) {
      const parts = meal.time.split(":");
      const h = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      if (isNaN(h) || isNaN(m)) continue;
      let totalMin = h * 60 + m - offsetMinutes;
      if (totalMin < 0) totalMin += 24 * 60;
      const hour = Math.floor(totalMin / 60) % 24;
      const minute = totalMin % 60;
      const date = nextOccurrence(jsDay, hour, minute);
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: meal.name,
            body: offsetMinutes > 0 ? `Dans ${offsetMinutes} min` : "C'est l'heure !",
            data: { type: "meal" },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
            channelId: NOTIF_CHANNEL,
          } as any,
        });
        count++;
      } catch (e) {
        console.warn(`[Forge notif] scheduleMeal failed (${dayKey} ${hour}:${minute}):`, e);
      }
    }
  }
  console.log(`[Forge notif] ${count} meal notification(s) scheduled`);
}

export async function scheduleWorkoutNotifications(
  schedule: (string | null)[],
  workouts: WorkoutRecord[],
  globalTime: string = "08:00",
  globalBody: string = ""
) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    console.warn("[Forge notif] scheduleWorkoutNotifications skipped: permission =", status);
    return;
  }
  await cancelByType("workout");
  const parts = globalTime.split(":");
  const hour = parseInt(parts[0]);
  const minute = parseInt(parts[1]);
  if (isNaN(hour) || isNaN(minute)) return;
  const body = globalBody.trim() || "C'est parti, on s'échauffe !";
  const workoutMap = new Map(workouts.map((w) => [w.key, w]));
  let count = 0;
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const workoutKey = schedule[dayIndex];
    if (!workoutKey) continue;
    const workout = workoutMap.get(workoutKey);
    if (!workout) continue;
    const displayName = workout.name_fr || workout.name;
    const date = nextOccurrence(dayIndex, hour, minute);
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Séance ${displayName}`,
          body,
          data: { type: "workout" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: NOTIF_CHANNEL,
        } as any,
      });
      count++;
    } catch (e) {
      console.warn(`[Forge notif] scheduleWorkout failed (day ${dayIndex}):`, e);
    }
  }
  console.log(`[Forge notif] ${count} workout notification(s) scheduled`);
}

export async function cancelMealNotifications() {
  await cancelByType("meal");
}

export async function cancelWorkoutNotifications() {
  await cancelByType("workout");
}

export async function getScheduledNotificationsSummary(): Promise<{ total: number; meals: number; workouts: number; other: number }> {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    let meals = 0, workouts = 0, other = 0;
    for (const n of all) {
      const type = n.content.data?.type;
      if (type === "meal") meals++;
      else if (type === "workout") workouts++;
      else other++;
    }
    return { total: all.length, meals, workouts, other };
  } catch (e) {
    console.warn("[Forge notif] getScheduledNotificationsSummary failed:", e);
    return { total: -1, meals: 0, workouts: 0, other: 0 };
  }
}
