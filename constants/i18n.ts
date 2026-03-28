export type Lang = "en" | "fr";

export type Translations = {
  // Tab labels
  tab_today: string;
  tab_meals: string;
  tab_progress: string;
  tab_settings: string;
  // Today screen
  today_section: string;
  next_meal: string;
  start_session: string;
  rest_day: string;
  recovery_title: string;
  recovery_msg: string;
  // Day names (Sun=0 … Sat=6)
  days: [string, string, string, string, string, string, string];
  // Meals screen
  nutrition: string;
  todays_meals: string;
  weekly_menu: string;
  weekly_menu_sub: string;
  planning: string;
  gym_day: string;
  // Progress screen
  tracking: string;
  progress: string;
  weights_title: string;
  push_day: string;
  pull_day: string;
  leg_day: string;
  save: string;
  weight_placeholder: string;
  weight_current: string;
  weight_today: string;
  weight_max_error: string;
  // Settings screen
  settings: string;
  preferences: string;
  language: string;
  // Macro labels (short)
  kcal: string;
  pro: string;
  carbs_label: string;
  fat_label: string;
  // Macro labels (long)
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  // Misc
  today_badge: string;
  date_locale: string;
  exercises_rest: (n: number, rest: number) => string;
  // Session screen
  session_times_up: string;
  session_rest: string;
  session_seconds: string;
  session_up_next: string;
  session_set_of: (s: number, total: number) => string;
  session_skip_rest: string;
  session_technique: string;
  session_weight_hint: string;
  session_reps: string;
  session_set_done: string;
  session_finish: string;
  session_coming_up: string;
  session_end_title: string;
  session_just_started: string;
  session_exercises_done: (done: number, total: number) => string;
  session_no_save: string;
  session_keep_going: string;
  session_end: string;
  session_rest_day_title: string;
  session_no_session: string;
  session_go_back: string;
  session_complete: string;
  session_crushed: (n: number) => string;
  session_done: string;
};

export const translations: Record<Lang, Translations> = {
  en: {
    tab_today: "TODAY",
    tab_meals: "MEALS",
    tab_progress: "PROGRESS",
    tab_settings: "SETTINGS",

    today_section: "Today's Session",
    next_meal: "Next Meal",
    start_session: "START SESSION",
    rest_day: "Rest Day",
    recovery_title: "Rest & Recover",
    recovery_msg: "Prioritize sleep, hydration, and quality nutrition today.",

    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    nutrition: "Nutrition",
    todays_meals: "Today's Meals",
    weekly_menu: "Weekly Menu",
    weekly_menu_sub: "Browse all 7 days · plan groceries",
    planning: "Planning",
    gym_day: "Gym Day",

    tracking: "Tracking",
    progress: "Progress",
    weights_title: "Weights",
    push_day: "Push Day",
    pull_day: "Pull Day",
    leg_day: "Leg Day",
    save: "OK",
    weight_placeholder: "Weight in kg",
    weight_current: "current",
    weight_today: "today",
    weight_max_error: "250kg max",

    settings: "Settings",
    preferences: "Preferences",
    language: "Language",

    kcal: "KCAL",
    pro: "PRO",
    carbs_label: "CARBS",
    fat_label: "FAT",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",

    today_badge: "TODAY",
    date_locale: "en-GB",
    exercises_rest: (n, rest) => `${n} exercises · ${rest}s rest`,
    session_times_up: "Time's up!",
    session_rest: "Rest",
    session_seconds: "seconds",
    session_up_next: "Up next",
    session_set_of: (s, total) => `Set ${s} of ${total}`,
    session_skip_rest: "Skip Rest",
    session_technique: "Technique",
    session_weight_hint: "Your weight — use as reference",
    session_reps: " reps",
    session_set_done: "SET DONE",
    session_finish: "FINISH SESSION",
    session_coming_up: "Coming Up",
    session_end_title: "End Session?",
    session_just_started: "Session just started.",
    session_exercises_done: (done, total) => `${done} of ${total} exercises done.`,
    session_no_save: "Progress won't be saved.",
    session_keep_going: "Keep Going",
    session_end: "End Session",
    session_rest_day_title: "Rest Day",
    session_no_session: "No session scheduled today.",
    session_go_back: "Go Back",
    session_complete: "Session Complete",
    session_crushed: (n) => `${n} exercises crushed`,
    session_done: "DONE",
  },
  fr: {
    tab_today: "AUJOURD'HUI",
    tab_meals: "REPAS",
    tab_progress: "PROGRÈS",
    tab_settings: "RÉGLAGES",

    today_section: "Séance du Jour",
    next_meal: "Prochain Repas",
    start_session: "DÉMARRER",
    rest_day: "Repos",
    recovery_title: "Repos & Récupération",
    recovery_msg: "Priorisez le sommeil, l'hydratation et une bonne nutrition aujourd'hui.",

    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],

    nutrition: "Nutrition",
    todays_meals: "Repas du Jour",
    weekly_menu: "Menu de la Semaine",
    weekly_menu_sub: "Voir les 7 jours · planifier les courses",
    planning: "Planning",
    gym_day: "Séance Gym",

    tracking: "Suivi",
    progress: "Progrès",
    weights_title: "Poids",
    push_day: "Poussée",
    pull_day: "Tirage",
    leg_day: "Jambes",
    save: "OK",
    weight_placeholder: "Poids en kg",
    weight_current: "actuel",
    weight_today: "auj.",
    weight_max_error: "250kg max",

    settings: "Réglages",
    preferences: "Préférences",
    language: "Langue",

    kcal: "KCAL",
    pro: "PROT",
    carbs_label: "GLUC",
    fat_label: "LIP",
    calories: "Calories",
    protein: "Protéines",
    carbs: "Glucides",
    fat: "Lipides",

    today_badge: "AUJOURD'HUI",
    date_locale: "fr-FR",
    exercises_rest: (n, rest) => `${n} exercices · ${rest}s repos`,
    session_times_up: "Temps écoulé !",
    session_rest: "Repos",
    session_seconds: "secondes",
    session_up_next: "Prochain",
    session_set_of: (s, total) => `Série ${s} sur ${total}`,
    session_skip_rest: "Passer",
    session_technique: "Technique",
    session_weight_hint: "Ton poids — utilise comme référence",
    session_reps: " rép.",
    session_set_done: "SÉRIE TERMINÉE",
    session_finish: "TERMINER",
    session_coming_up: "À Suivre",
    session_end_title: "Arrêter ?",
    session_just_started: "La séance vient de commencer.",
    session_exercises_done: (done, total) => `${done} sur ${total} exercices complétés.`,
    session_no_save: "La progression ne sera pas sauvegardée.",
    session_keep_going: "Continuer",
    session_end: "Arrêter",
    session_rest_day_title: "Repos",
    session_no_session: "Aucune séance aujourd'hui.",
    session_go_back: "Retour",
    session_complete: "Séance Terminée",
    session_crushed: (n) => `${n} exercices complétés`,
    session_done: "OK",
  },
};
