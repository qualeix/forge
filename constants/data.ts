export const WORKOUT_DATA = {
  tuesday: {
    name: "Poussée",
    restSeconds: 90,
    exercises: [
      {
        id: "dips",
        name: "Dips",
        sets: 3,
        reps: "max",
        cue: "Technique avant tout — qualité avant répétitions.",
        technique:
          "Légèrement penché en avant (~15°) pour cibler les pectoraux. Descente jusqu'à 90° aux coudes. Remontée explosive, extension complète en haut. Dès que tu fais 12-12-12 clean, ajoute une ceinture lestée.",
      },
      {
        id: "bench_press",
        name: "Développé couché",
        sets: 4,
        reps: 8,
        cue: "Contrôle > charge — technique d'abord, poids ensuite.",
        technique:
          "Omoplates rétractées et plaquées contre le banc. Trajectoire : barre vers pectoraux inférieurs, légèrement diagonal. 3s descente, 1s pause, poussée explosive. 8-8-8-8 clean → +2,5kg.",
      },
      {
        id: "pec_deck",
        name: "Pec Deck",
        sets: 3,
        reps: 12,
        cue: "Contracte fort les pectoraux en fin de mouvement.",
        technique:
          "Réglage : poignées à hauteur des pectoraux. Coudes légèrement fléchis en permanence. Contraction maximale, pause 1s. Retour lent (3s) — l'étirement est là où les pectoraux se développent.",
      },
      {
        id: "db_military_press",
        name: "Développé militaire haltères",
        sets: 3,
        reps: 10,
        cue: "Mouvement contrôlé, pas d'élan.",
        technique:
          "Départ au niveau des oreilles, coudes à ~75° du torse. Poussée verticale, pas de verrouillage en haut. Descente lente (2-3s). 10-10-10 clean → montée en charge.",
      },
      {
        id: "lateral_raises",
        name: "Élévations latérales",
        sets: 3,
        reps: 15,
        cue: "Lent et contrôlé — l'élan tue cet exercice.",
        technique:
          "Légèrement penché en avant (~10°), montée jusqu'à hauteur d'épaule. Mène avec les coudes, pas les mains. Pause 1s en haut. 3-4s de descente. Charge légère — le chargement excessif ne sert à rien ici.",
      },
      {
        id: "triceps_pushdown",
        name: "Extension triceps poulie",
        sets: 3,
        reps: 15,
        cue: "Extension complète en bas — c'est là que le triceps se contracte pleinement.",
        technique:
          "Coudes collés au corps. Bras supérieurs verticaux et immobiles. Seuls les avant-bras bougent. Excentrique lent (3s remontée), poussée contrôlée vers le bas.",
      },
    ],
  },
  friday: {
    name: "Tirage",
    restSeconds: 90,
    exercises: [
      {
        id: "lat_pulldown",
        name: "Tirage vertical",
        sets: 4,
        reps: 8,
        cue: "Dorsaux > biceps — initie avec les omoplates, pas les bras.",
        technique:
          "Prise large, largeur épaules ou légèrement plus. Étirement complet en haut. Tirer la barre vers la clavicule, légère inclinaison arrière (~15°). Coudes vers le bas et l'arrière. 3s remontée, traction explosive.",
      },
      {
        id: "seated_row",
        name: "Tirage horizontal assis",
        sets: 4,
        reps: 10,
        cue: "Contracte les omoplates à la contraction complète — c'est ça, la rep.",
        technique:
          "Torse droit et immobile. Tirer vers la poitrine basse. Coudes proches du corps. 3s retour, étirement complet à l'avant. Pas de haussement d'épaules.",
      },
      {
        id: "hammer_curls",
        name: "Curl marteau",
        sets: 3,
        reps: 10,
        cue: "Prise neutre cible le brachial — épaissit les bras.",
        technique:
          "Coudes collés, pas de balancement. Curl jusqu'à hauteur d'épaule, pause 1s, descente en 3s. Alternance ou simultané.",
      },
      {
        id: "rear_delt_machine",
        name: "Machine deltoïdes postérieurs",
        sets: 3,
        reps: 15,
        cue: "À l'extension complète, contracte les deltoïdes postérieurs 1s.",
        technique:
          "Poignées à hauteur des épaules, poitrine légèrement contre le pad. Coudes légèrement fléchis. Pousser vers l'arrière en menant avec les coudes. Retour très lent (3-4s). La charge doit paraître ridiculement légère — c'est normal.",
      },
      {
        id: "wrist_curls",
        name: "Curl des poignets",
        sets: 3,
        reps: 15,
        cue: "Avant-bras à plat, paume vers le haut. Seul le poignet bouge.",
        technique:
          "Descendre aussi bas que confortable, remonter complètement. Commencer à 5-8kg max. Sensation de chaleur normale. Douleur vive ou craquement — arrêt immédiat.",
      },
      {
        id: "preacher_curls",
        name: "Curl au pupitre",
        sets: 3,
        reps: 10,
        cue: "Isolation stricte — le pupitre élimine tout élan.",
        technique:
          "Règle le pupitre pour que les aisselles reposent sur le bord supérieur. Bras en extension complète en bas — pas d'hyperextension des coudes. Curl jusqu'à contraction complète, contracte 1s en haut. Descente en 3s — contrôle la phase négative. Poignets neutres, ne pas les fléchir.",
      },
    ],
  },
  sunday: {
    name: "Jambes",
    restSeconds: 90,
    exercises: [
      {
        id: "leg_press",
        name: "Presse à jambes",
        sets: 4,
        reps: 8,
        cue: "Ne JAMAIS verrouiller les genoux en haut.",
        technique:
          "Pieds au centre de la plateforme, largeur épaules. Descente jusqu'à ~90° aux genoux. Genoux dans l'axe des pieds. Contrôle la descente (2-3s), poussée explosive.",
      },
      {
        id: "hip_thrust",
        name: "Hip Thrust machine",
        sets: 4,
        reps: 10,
        cue: "Pousse à travers les talons. Contracte les fessiers fort en extension complète.",
        technique:
          "En haut, torse parallèle au sol — pas d'hyperextension lombaire. Amplitude complète vers le bas pour étirer les fessiers. Pause 1-2s en haut avec contraction des fessiers.",
      },
      {
        id: "rdl",
        name: "Soulevé de terre roumain",
        sets: 3,
        reps: 10,
        cue: "Hip hinge — la barre reste proche des jambes tout le temps.",
        technique:
          "Repousse les hanches en arrière, pas vers le bas. Légère flexion des genoux, dos plat, poitrine haute. Descente jusqu'à mi-tibia jusqu'à l'étirement profond des ischio-jambiers. Pousse les hanches en avant pour remonter. 3s descente.",
      },
      {
        id: "calf_raises",
        name: "Extensions mollets assis",
        sets: 4,
        reps: 15,
        cue: "Amplitude complète et temps sous tension — c'est tout l'intérêt.",
        technique:
          "Talons ENTIÈREMENT sous le bord de la plateforme. Pause 1s en bas. Montée en flexion plantaire complète, contracte fort, pause 1s en haut. 3s descente. Si ça brûle, c'est bien.",
      },
      {
        id: "leg_curl",
        name: "Leg Curl",
        sets: 3,
        reps: 12,
        cue: "Contrôle l'excentrique — c'est là que les ischio-jambiers se développent.",
        technique:
          "Curl jusqu'à contraction complète, pause 1s. Descente en 3s — résiste jusqu'au bout. Hanches plaquées contre le pad.",
      },
      {
        id: "leg_extensions",
        name: "Extensions jambes",
        sets: 3,
        reps: 12,
        cue: "Extension complète, pause, retour lent.",
        technique:
          "Étendre presque à fond, pause 1s. Remontée en 3s. Hanches bien plaquées contre le pad.",
      },
    ],
  },
  home: {
    name: "Routine Maison",
    exercises: [
      {
        id: "plank",
        name: "Gainage",
        sets: 3,
        reps: "30s",
        cue: "Rétroversion du bassin — pousse légèrement les hanches en avant.",
        technique:
          "Contracte fessiers et abdos simultanément. Regard vers le bas, avant-bras à plat, coudes sous les épaules. Ajouter 5-10s par semaine quand c'est confortable.",
      },
      {
        id: "side_abs",
        name: "Abdos obliques",
        sets: 3,
        reps: 20,
        cue: "Cible les obliques — contraction lente, amplitude complète.",
        technique:
          "En appui latéral, lever les jambes ou le buste. 20 répétitions de chaque côté par série.",
      },
      {
        id: "starfish_abs",
        name: "Abdos étoile",
        sets: 3,
        reps: 20,
        cue: "Bas du dos plaqué au sol en permanence.",
        technique:
          "Allongé à plat, bras et jambes étirés. Lever le bras et la jambe opposés simultanément. 2s montée, 2s descente.",
      },
    ],
  },
};

export const MENU_DATA = {
  monday: {
    label: "Lundi",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Œufs brouillés sur toast",
        details: "2 œufs brouillés au beurre, 2 tranches de pain complet, 1 verre de jus d'orange naturel",
        kcal: 430, protein: 24, carbs: 52, fat: 14,
      },
      {
        time: "12:00",
        name: "Bowl thon riz",
        details: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Shake whey + banane",
        details: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Cuisses de poulet + pâtes",
        details: "250g de cuisses de poulet désossées, marinade : huile d'olive, citron, ail, paprika, cumin. 200g de pâtes",
        kcal: 620, protein: 52, carbs: 42, fat: 22,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2105, protein: 172, carbs: 212, fat: 54 },
  },
  tuesday: {
    label: "Mardi",
    type: "gym",
    meals: [
      {
        time: "8:00",
        name: "Œufs sur toast",
        details: "3 œufs au plat, 2 tranches de pain complet, 1 banane, 1 verre de jus d'orange naturel",
        kcal: 660, protein: 37, carbs: 72, fat: 20,
      },
      {
        time: "12:00",
        name: "Blanc de poulet + riz",
        details: "200g de blanc de poulet aux herbes, 125g de riz blanc, 100g de petits pois surgelés, sauce soja + citron",
        kcal: 620, protein: 58, carbs: 72, fat: 7,
      },
      {
        time: "16:30",
        name: "Pré-séance : banane + whey",
        details: "1 banane, 1 shake Gold Standard Whey (lait demi-écrémé)",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Blanc de poulet + pâtes",
        details: "300g de blanc de poulet, 125g de pâtes, sauce tomate (ail, basilic, huile d'olive), 30g de grana padano",
        kcal: 810, protein: 78, carbs: 82, fat: 15,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
  wednesday: {
    label: "Mercredi",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Bowl yaourt",
        details: "200g de yaourt nature, 1 banane tranchée, 1 c. à soupe de miel, 1 verre de jus d'orange naturel",
        kcal: 420, protein: 21, carbs: 72, fat: 3,
      },
      {
        time: "12:00",
        name: "Bowl thon riz",
        details: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Shake whey + banane",
        details: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Saumon + pâtes",
        details: "150g de filet de saumon au citron et aneth, 200g de pâtes",
        kcal: 580, protein: 40, carbs: 42, fat: 18,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2055, protein: 157, carbs: 232, fat: 39 },
  },
  thursday: {
    label: "Jeudi",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Toast fromage blanc",
        details: "2 tranches de pain complet, 150g de fromage blanc, tomates cerises, sel et poivre, 1 verre de jus d'orange",
        kcal: 430, protein: 28, carbs: 52, fat: 8,
      },
      {
        time: "12:00",
        name: "Bowl thon riz",
        details: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Shake whey + banane",
        details: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Cuisses de poulet + pâtes",
        details: "250g de cuisses de poulet désossées, marinade : huile d'olive, citron, ail, paprika, cumin. 200g de pâtes",
        kcal: 620, protein: 52, carbs: 42, fat: 22,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2105, protein: 176, carbs: 212, fat: 48 },
  },
  friday: {
    label: "Vendredi",
    type: "gym",
    meals: [
      {
        time: "8:00",
        name: "Œufs pochés sur toast",
        details: "3 œufs pochés, 2 tranches de pain complet, 1 banane, 1 verre de jus d'orange naturel",
        kcal: 660, protein: 37, carbs: 72, fat: 20,
      },
      {
        time: "12:00",
        name: "Blanc de poulet + riz",
        details: "200g de blanc de poulet aux herbes, 125g de riz blanc, 100g de petits pois surgelés, sauce soja + citron",
        kcal: 620, protein: 58, carbs: 72, fat: 7,
      },
      {
        time: "16:30",
        name: "Pré-séance : banane + whey",
        details: "1 banane, 1 shake Gold Standard Whey (lait demi-écrémé)",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Blanc de poulet + pâtes",
        details: "300g de blanc de poulet, 125g de pâtes, sauce tomate (ail, basilic, huile d'olive), 30g de grana padano",
        kcal: 810, protein: 78, carbs: 82, fat: 15,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
  saturday: {
    label: "Samedi",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Œufs sur toast",
        details: "3 œufs brouillés avec tomates cerises, 2 tranches de pain complet, 1 verre de jus d'orange",
        kcal: 490, protein: 30, carbs: 52, fat: 17,
      },
      {
        time: "12:00",
        name: "Bowl thon riz",
        details: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Shake whey + banane",
        details: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Saumon + pâtes",
        details: "150g de filet de saumon au citron et aneth, 200g de pâtes",
        kcal: 580, protein: 40, carbs: 42, fat: 18,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2125, protein: 166, carbs: 212, fat: 53 },
  },
  sunday: {
    label: "Dimanche",
    type: "gym",
    meals: [
      {
        time: "8:00",
        name: "Œufs sur toast",
        details: "3 œufs au plat, 2 tranches de pain complet, 1 banane, 1 verre de jus d'orange naturel",
        kcal: 660, protein: 37, carbs: 72, fat: 20,
      },
      {
        time: "12:00",
        name: "Blanc de poulet + riz",
        details: "200g de blanc de poulet aux herbes, 125g de riz blanc, 100g de petits pois surgelés, sauce soja + citron",
        kcal: 620, protein: 58, carbs: 72, fat: 7,
      },
      {
        time: "16:30",
        name: "Pré-séance : banane + whey",
        details: "1 banane, 1 shake Gold Standard Whey (lait demi-écrémé)",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Blanc de poulet + pâtes",
        details: "300g de blanc de poulet, 125g de pâtes, sauce tomate (ail, basilic, huile d'olive), 30g de grana padano",
        kcal: 810, protein: 78, carbs: 82, fat: 15,
      },
      {
        time: "20:00",
        name: "Yaourt grec",
        details: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
};

export type DayKey = keyof typeof MENU_DATA;
export type WorkoutKey = keyof typeof WORKOUT_DATA;

// Planning par défaut : index du jour (0=Dim..6=Sam) → clé séance ou null (repos)
export const DEFAULT_SCHEDULE: Record<number, string | null> = {
  0: "sunday",   // Dimanche → Jambes
  1: null,       // Lundi → Repos
  2: "tuesday",  // Mardi → Poussée
  3: null,       // Mercredi → Repos
  4: null,       // Jeudi → Repos
  5: "friday",   // Vendredi → Tirage
  6: null,       // Samedi → Repos
};

// Ordre d'affichage : lundi en premier
export const WEEK_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function getTodayKey(): DayKey {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
  return days[new Date().getDay()];
}

export function getTodayMenu() {
  return MENU_DATA[getTodayKey()];
}
