/** Convertit "HH:MM" en minutes depuis minuit. */
export function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}
