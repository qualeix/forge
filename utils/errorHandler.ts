/** Logue l'erreur en développement, silencieux en production. */
export function handleError(error: unknown, context: string): void {
  if (__DEV__) {
    console.warn(`[FORGE] ${context}:`, error);
  }
}
