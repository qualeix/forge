import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { MenuMeal } from "./MenuContext";
import type { WorkoutRecord } from "./ProgramContext";

export const NOTIF_CHANNEL = "forge";

const DAY_KEY_TO_WEEKDAY: Record<string, number> = {
  sunday: 1, monday: 2, tuesday: 3, wednesday: 4,
  thursday: 5, friday: 6, saturday: 7,
};

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(NOTIF_CHANNEL, {
      name: "Forge",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#F59E0B",
    });
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

async function cancelByType(type: string) {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      all
        .filter((n) => n.content.data?.type === type)
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch {}
}

export async function scheduleMealNotifications(
  menuData: Record<string, MenuMeal[]>,
  offsetMinutes: number = 0
) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;
  await cancelByType("meal");
  for (const [dayKey, meals] of Object.entries(menuData)) {
    const weekday = DAY_KEY_TO_WEEKDAY[dayKey];
    if (!weekday || !meals.length) continue;
    for (const meal of meals) {
      const parts = meal.time.split(":");
      const h = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      if (isNaN(h) || isNaN(m)) continue;
      let totalMin = h * 60 + m - offsetMinutes;
      if (totalMin < 0) totalMin += 24 * 60;
      const hour = Math.floor(totalMin / 60) % 24;
      const minute = totalMin % 60;
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: meal.name,
            body: offsetMinutes > 0 ? `Dans ${offsetMinutes} min` : "C'est l'heure !",
            data: { type: "meal" },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour,
            minute,
            channelId: NOTIF_CHANNEL,
          } as any,
        });
      } catch {}
    }
  }
}

export async function scheduleWorkoutNotifications(
  schedule: (string | null)[],
  workouts: WorkoutRecord[],
  globalTime: string = "08:00",
  globalBody: string = ""
) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;
  await cancelByType("workout");
  const parts = globalTime.split(":");
  const hour = parseInt(parts[0]);
  const minute = parseInt(parts[1]);
  if (isNaN(hour) || isNaN(minute)) return;
  const body = globalBody.trim() || "C'est parti, on s'échauffe !";
  const workoutMap = new Map(workouts.map((w) => [w.key, w]));
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const workoutKey = schedule[dayIndex];
    if (!workoutKey) continue;
    const workout = workoutMap.get(workoutKey);
    if (!workout) continue;
    const displayName = workout.name_fr || workout.name;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Séance ${displayName}`,
          body,
          data: { type: "workout" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: dayIndex + 1,
          hour,
          minute,
          channelId: NOTIF_CHANNEL,
        } as any,
      });
    } catch {}
  }
}

export async function cancelMealNotifications() {
  await cancelByType("meal");
}

export async function cancelWorkoutNotifications() {
  await cancelByType("workout");
}

export async function rescheduleAll(
  db: any,
  menuData: Record<string, MenuMeal[]>,
  schedule: (string | null)[],
  workouts: WorkoutRecord[]
) {
  try {
    const rows = (await db.getAllAsync(
      "SELECT key, value FROM settings WHERE key IN ('notif_meals_on','notif_workouts_on','notif_meals_offset','notif_workouts_time','notif_workouts_body')"
    )) as { key: string; value: string }[];
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });

    const mealsOn = (map["notif_meals_on"] ?? "0") === "1";
    const workoutsOn = (map["notif_workouts_on"] ?? "0") === "1";
    const mealsOffset = parseInt(map["notif_meals_offset"] ?? "0") || 0;
    const workoutsTime = map["notif_workouts_time"] ?? "08:00";
    const workoutsBody = map["notif_workouts_body"] ?? "";

    if (mealsOn) {
      await scheduleMealNotifications(menuData, mealsOffset);
    } else {
      await cancelMealNotifications();
    }

    if (workoutsOn) {
      await scheduleWorkoutNotifications(schedule, workouts, workoutsTime, workoutsBody);
    } else {
      await cancelWorkoutNotifications();
    }
  } catch {}
}
