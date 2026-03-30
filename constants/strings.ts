export type AppStrings = {
  // Onglets
  tab_today: string;
  tab_meals: string;
  tab_progress: string;
  tab_settings: string;
  // Écran Aujourd'hui
  today_section: string;
  next_meal: string;
  start_session: string;
  rest_day: string;
  recovery_title: string;
  recovery_msg: string;
  session_already_done: string;
  // Jours (Dim=0 … Sam=6)
  days: [string, string, string, string, string, string, string];
  // Écran Repas
  nutrition: string;
  todays_meals: string;
  weekly_menu: string;
  weekly_menu_sub: string;
  planning: string;
  gym_day: string;
  // Écran Progrès
  tracking: string;
  progress: string;
  weights_title: string;
  save: string;
  weight_placeholder: string;
  weight_current: string;
  weight_today: string;
  weight_max_error: string;
  // Écran Réglages
  settings: string;
  preferences: string;
  // Divers
  today_badge: string;
  date_locale: string;
  exercises_rest: (n: number, rest: number) => string;
  // Écran Séance
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
  // Onglet Programme
  tab_program: string;
  program_title: string;
  program_week: string;
  program_workouts: string;
  program_rest: string;
  program_assign_title: string;
  program_set_rest: string;
  program_exercises: (n: number) => string;
  program_rename: string;
  program_name_placeholder: string;
  program_rename_save: string;
  program_new_workout: string;
  program_create: string;
  program_no_exercises: string;
  program_delete_title: string;
  program_delete_confirm: string;
  program_delete: string;
  program_cancel: string;
  program_add_exercise: string;
  program_exercise_name: string;
  program_sets: string;
  program_reps: string;
  program_cue: string;
  program_technique_label: string;
  program_add: string;
  program_edit_exercise: string;
  program_save: string;
  program_remove_exercise: string;
  program_rest_seconds: string;
};

export const strings: AppStrings = {
  tab_today: "ACCUEIL",
  tab_meals: "REPAS",
  tab_progress: "PROGRÈS",
  tab_settings: "RÉGLAGES",

  today_section: "Séance du Jour",
  next_meal: "Prochain Repas",
  start_session: "DÉMARRER",
  rest_day: "Repos",
  recovery_title: "Repos & Récupération",
  recovery_msg: "Priorisez le sommeil, l'hydratation et une bonne nutrition aujourd'hui.",
  session_already_done: "Séance déjà complétée",

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
  save: "OK",
  weight_placeholder: "Poids en kg",
  weight_current: "actuel",
  weight_today: "auj.",
  weight_max_error: "250kg max",

  settings: "Réglages",
  preferences: "Préférences",

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

  tab_program: "SÉANCES",
  program_title: "Mon Programme",
  program_week: "Planning Semaine",
  program_workouts: "Séances",
  program_rest: "Repos",
  program_assign_title: "Choisir une séance",
  program_set_rest: "Jour de repos",
  program_exercises: (n) => `${n} exercices`,
  program_rename: "Renommer la séance",
  program_name_placeholder: "Nom de la séance",
  program_rename_save: "OK",
  program_new_workout: "Nouvelle Séance",
  program_create: "Créer",
  program_no_exercises: "Aucun exercice",
  program_delete_title: "Supprimer la séance ?",
  program_delete_confirm: "Tous les exercices seront supprimés et cette séance sera retirée du planning.",
  program_delete: "Supprimer",
  program_cancel: "Annuler",
  program_add_exercise: "Ajouter un exercice",
  program_exercise_name: "Nom de l'exercice",
  program_sets: "Séries",
  program_reps: "Répétitions",
  program_cue: "Conseil",
  program_technique_label: "Détails technique",
  program_add: "Ajouter",
  program_edit_exercise: "Modifier l'exercice",
  program_save: "OK",
  program_remove_exercise: "Retirer",
  program_rest_seconds: "Repos (secondes)",
};
