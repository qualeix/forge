import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";

const UPDATE_URL = "http://107.189.21.156/forge/version.json";
export const APP_VERSION = "1.8.4";

function isNewer(remote: string, current: string): boolean {
  const r = remote.split(".").map(Number);
  const c = current.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((r[i] ?? 0) > (c[i] ?? 0)) return true;
    if ((r[i] ?? 0) < (c[i] ?? 0)) return false;
  }
  return false;
}

export interface UpdateInfo {
  version: string;
  url: string;
}

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  if (Platform.OS !== "android") return null;
  try {
    const res = await fetch(UPDATE_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.version === "string" && typeof data.url === "string" && isNewer(data.version, APP_VERSION)) {
      return { version: data.version, url: data.url };
    }
    return null;
  } catch {
    return null;
  }
}

export async function downloadAndInstall(
  url: string,
  onProgress: (progress: number) => void
): Promise<void> {
  const dest = FileSystem.cacheDirectory + "forge-update.apk";

  const download = FileSystem.createDownloadResumable(url, dest, {}, (p) => {
    if (p.totalBytesExpectedToWrite > 0) {
      onProgress(p.totalBytesWritten / p.totalBytesExpectedToWrite);
    }
  });

  await download.downloadAsync();

  const contentUri = await FileSystem.getContentUriAsync(dest);

  await IntentLauncher.startActivityAsync("android.intent.action.VIEW" as any, {
    data: contentUri,
    flags: 268435457, // FLAG_ACTIVITY_NEW_TASK | FLAG_GRANT_READ_URI_PERMISSION
    type: "application/vnd.android.package-archive",
  });
}
