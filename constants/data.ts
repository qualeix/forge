export const WORKOUT_DATA = {
  tuesday: {
    name: "PUSH",
    restSeconds: 90,
    exercises: [
      {
        id: "dips",
        name: "Dips (non lestés)",
        sets: 3,
        reps: "max",
        cue: "Technique avant tout, qualité avant répétitions.",
        technique:
          "Légèrement penché en avant (~15°) pour cibler les pectoraux. Descente jusqu'à 90° aux coudes. Remontée explosive, extension complète en haut.",
      },
      {
        id: "bench_press",
        name: "Développé couché (machine)",
        sets: 4,
        reps: 8,
        cue: "Contrôle > charge — technique d'abord, poids ensuite.",
        technique:
          "Omoplates rétractées et plaquées contre le banc. Trajectoire : barre vers pectoraux inférieurs, légèrement diagonal. 3s descente, 1s pause, poussée explosive.",
      },
      {
        id: "db_military_press",
        name: "Développé militaire (haltères)",
        sets: 3,
        reps: 10,
        cue: "Mouvement contrôlé, pas d'élan.",
        technique:
          "Départ au niveau des oreilles, coudes à ~75° du torse. Poussée verticale, pas de verrouillage en haut. Descente lente (2-3s).",
      },
      {
        id: "lateral_raises",
        name: "Élévations latérales (haltères)",
        sets: 3,
        reps: 12,
        cue: "Lent et contrôlé, l'élan tue cet exercice.",
        technique:
          "Légèrement penché en avant (~10°), montée jusqu'à hauteur d'épaule. Mener avec les coudes, pas les mains. Pause 1s en haut. 3-4s de descente. Charge légère.",
      },
      {
        id: "triceps_pushdown",
        name: "Extension triceps (poulie)",
        sets: 3,
        reps: 12,
        cue: "Extension complète en bas (c'est là que le triceps se contracte pleinement).",
        technique:
          "Coudes collés au corps. Bras supérieurs verticaux et immobiles. Seuls les avant-bras bougent. Excentrique lent (3s remontée), poussée contrôlée vers le bas.",
      },
    ],
  },
  friday: {
    name: "PULL",
    restSeconds: 90,
    exercises: [
      {
        id: "lat_pulldown",
        name: "Tirage vertical",
        sets: 4,
        reps: 8,
        cue: "Dorsaux > biceps, initie avec les omoplates, pas les bras.",
        technique:
          "Prise large, largeur épaules ou légèrement plus. Étirement complet en haut. Tirer la barre vers la clavicule, légère inclinaison arrière (~15°). Coudes vers le bas et l'arrière. 3s remontée, traction explosive.",
      },
      {
        id: "seated_row",
        name: "Rowing assis (machine)",
        sets: 4,
        reps: 10,
        cue: "Contracter les omoplates à la contraction complète.",
        technique:
          "Torse droit et immobile. Tirer vers la poitrine basse. Coudes proches du corps. 3s retour, étirement complet à l'avant. Pas de haussement d'épaules.",
      },
      {
        id: "rear_delt_machine",
        name: "Deltoïdes postérieurs",
        sets: 3,
        reps: 15,
        cue: "À l'extension complète, contracter les deltoïdes postérieurs 1s.",
        technique:
          "Poignées à hauteur des épaules, poitrine légèrement contre le pad. Coudes légèrement fléchis. Pousser vers l'arrière en menant avec les coudes. Retour très lent (3-4s). La charge doit paraître ridiculement légère.",
      },
      {
        id: "hammer_curls",
        name: "Curl marteau",
        sets: 3,
        reps: 10,
        cue: "Prise neutre qui cible le brachial et épaissit les bras.",
        technique:
          "Coudes collés, pas de balancement. Curl jusqu'à hauteur d'épaule, pause 1s, descente en 3s. Alternance ou simultané.",
      },
      {
        id: "wrist_curls",
        name: "Curl poignets",
        sets: 3,
        reps: 15,
        cue: "Avant-bras à plat, paume vers le haut. Seul le poignet bouge.",
        technique:
          "Descendre aussi bas que confortable, remonter complètement. Sensation de chaleur: normale, douleur vive ou craquement: arrêt immédiat.",
      },
    ],
  },
  sunday: {
    name: "LEGS",
    restSeconds: 90,
    exercises: [
      {
        id: "leg_press",
        name: "Presse à jambes",
        sets: 4,
        reps: 8,
        cue: "Ne JAMAIS verrouiller les genoux en haut (risque de blessure).",
        technique:
          "Pieds au centre de la plateforme, largeur épaules. Descente jusqu'à ~90° aux genoux. Genoux dans l'axe des pieds. Contrôle la descente (2-3s), poussée explosive.",
      },
      {
        id: "hip_thrust",
        name: "Hip Thrust machine",
        sets: 4,
        reps: 10,
        cue: "Poussée à travers les talons. Fessiers fortement contractés en extension complète.",
        technique:
          "En haut, torse parallèle au sol, pas d'hyperextension lombaire. Amplitude complète vers le bas pour étirer les fessiers. Pause 1-2s en haut avec contraction des fessiers.",
      },
      {
        id: "calf_raises",
        name: "Extensions mollets (machine)",
        sets: 4,
        reps: 15,
        cue: "Amplitude complète et sous tension",
        technique:
          "Talons ENTIÈREMENT sous le bord de la plateforme. Pause 1s en bas. Montée en flexion plantaire complète, forte contraction, pause 1s en haut. 3s descente.",
      },
      {
        id: "leg_curl",
        name: "Leg Curl",
        sets: 3,
        reps: 12,
        cue: "Contrôle d'excentrique (c'est là que les ischio-jambiers se développent).",
        technique:
          "Flexion jusqu'à contraction complète, pause 1s. Descente en 3s, résister jusqu'au bout. Hanches plaquées contre le pad.",
      },
      {
        id: "leg_extensions",
        name: "Extensions jambes",
        sets: 3,
        reps: 12,
        cue: "Extension complète, pause, retour lent.",
        technique:
          "Étendre complètement le genou, pause 1s. Descente contrôlée en 3s. Hanches bien plaquées contre le pad.",
      },
    ],
  },
};

export const MENU_DATA = {
  monday: {
    meals: [
      {
        time: "07:45",
        name: "Œufs brouillés sur toast",
        details: "2 œufs brouillés au beurre, 2 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné",
        details: "Lait demi-écremé, whey et fruits rouges surgelés",
      },
      {
        time: "18:30",
        name: "Pâtes et cuisse de poulet",
        details: " 125g de pâtes et 250g de cuisses de poulet avec marinade: huile d'olive, citron, épices pour poulet",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
  tuesday: {
    meals: [
      {
        time: "07:45",
        name: "Œufs sur toast",
        details: "3 œufs au plat, 3 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné pré-séance",
        details: "Lait demi-écremé, whey et banane",
      },
      {
        time: "18:30",
        name: "Pâtes et poulet crème tomate",
        details: "125g de pâtes, 300g de blanc de poulet, passata de tomate, 1 cuillière à café de sucre, basilic et un peu de crème",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
  wednesday: {
    meals: [
      {
        time: "07:45",
        name: "Cottage cheese et toasts",
        details: "Cottage cheese, tomates cerises et 2 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné",
        details: "Lait demi-écremé, whey et fruits rouges surgelés",
      },
      {
        time: "18:30",
        name: "Pâtes et cuisse de poulet",
        details: " 125g de pâtes et 250g de cuisses de poulet avec marinade: huile d'olive, citron, épices pour poulet",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
  thursday: {
    meals: [
      {
        time: "07:45",
        name: "Cottage cheese et toasts",
        details: "Cottage cheese, tomates cerises et 2 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné",
        details: "Lait demi-écremé, whey et fruits rouges surgelés",
      },
      {
        time: "18:30",
        name: "Pâtes et cuisse de poulet",
        details: " 125g de pâtes et 250g de cuisses de poulet avec marinade: huile d'olive, citron, épices pour poulet",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
  friday: {
    meals: [
      {
        time: "07:45",
        name: "Œufs sur toast",
        details: "3 œufs au plat, 3 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné pré-séance",
        details: "Lait demi-écremé, whey et banane",
      },
      {
        time: "18:30",
        name: "Pâtes et poulet crème tomate",
        details: "125g de pâtes, 300g de blanc de poulet, passata de tomate, 1 cuillière à café de sucre, basilic et un peu de crème",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
  saturday: {
    meals: [
      {
        time: "07:45",
        name: "Cottage cheese et toasts",
        details: "Cottage cheese, tomates cerises et 2 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné",
        details: "Lait demi-écremé, whey et fruits rouges surgelés",
      },
      {
        time: "18:30",
        name: "Pâtes et cuisse de poulet",
        details: " 125g de pâtes et 250g de cuisses de poulet avec marinade: huile d'olive, citron, épices pour poulet",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
  sunday: {
    meals: [
      {
        time: "07:45",
        name: "Œufs sur toast",
        details: "3 œufs au plat, 3 tranches de pain complet, 1 verre de jus d'orange naturel",
      },
      {
        time: "12:00",
        name: "Riz et poulet teriyaki",
        details: "125g de riz blanc, 250g de blanc de poulet estragon, 60g de petits pois/haricots verts et sauce teriyaki",
      },
      {
        time: "16:30",
        name: "Shake protéiné pré-séance",
        details: "Lait demi-écremé, whey et banane",
      },
      {
        time: "18:30",
        name: "Pâtes et poulet crème tomate",
        details: "125g de pâtes, 300g de blanc de poulet, passata de tomate, 1 cuillière à café de sucre, basilic et un peu de crème",
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de fruits rouges surgelées, 1 cuillère à café de miel",
      },
    ],
  },
};

export type DayKey = keyof typeof MENU_DATA;
export type WorkoutKey = keyof typeof WORKOUT_DATA;

// Planning par défaut : index du jour (0=Dim..6=Sam) → clé séance ou null (repos)
export const DEFAULT_SCHEDULE: Record<number, string | null> = {
  0: "sunday",   // Dimanche → LEGS
  1: null,       // Lundi → Repos
  2: "tuesday",  // Mardi → PUSH
  3: null,       // Mercredi → Repos
  4: null,       // Jeudi → Repos
  5: "friday",   // Vendredi → PULL
  6: null,       // Samedi → Repos
};

// Ordre d'affichage (lundi en premier)
export const WEEK_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function getTodayKey(): DayKey {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
  return days[new Date().getDay()];
}
