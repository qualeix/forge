export const WORKOUT_DATA = {
  tuesday: {
    name: "Push Day",
    name_fr: "Poussée",
    day: "Tuesday",
    restSeconds: 90,
    exercises: [
      {
        id: "dips",
        name: "Dips",
        name_fr: "Dips",
        sets: 3,
        reps: "max",
        cue: "Form & feel over raw reps.",
        cue_fr: "Technique avant tout — qualité avant répétitions.",
        technique:
          "Grip the bars, lean slightly forward (~15°) to hit the chest more than triceps. Lower until elbows reach 90°, no deeper. Drive up explosively, lock out fully at top. When you hit 12-12-12 clean, add a weight belt.",
        technique_fr:
          "Légèrement penché en avant (~15°) pour cibler les pectoraux. Descente jusqu'à 90° aux coudes. Remontée explosive, extension complète en haut. Dès que tu fais 12-12-12 clean, ajoute une ceinture lestée.",
      },
      {
        id: "bench_press",
        name: "Bench Press",
        name_fr: "Développé couché",
        sets: 4,
        reps: 8,
        cue: "Control > load — technique first, weight second.",
        cue_fr: "Contrôle > charge — technique d'abord, poids ensuite.",
        technique:
          "Retract scapulae and press them into the bench. Bar path: lower to lower chest, slight diagonal press toward rack. 3s down, 1s pause, explosive press up. Hit 8-8-8-8 → add 2.5kg.",
        technique_fr:
          "Omoplates rétractées et plaquées contre le banc. Trajectoire : barre vers pectoraux inférieurs, légèrement diagonal. 3s descente, 1s pause, poussée explosive. 8-8-8-8 clean → +2,5kg.",
      },
      {
        id: "pec_deck",
        name: "Pec Deck",
        name_fr: "Pec Deck",
        sets: 3,
        reps: 12,
        cue: "Squeeze the chest hard at full contraction.",
        cue_fr: "Contracte fort les pectoraux en fin de mouvement.",
        technique:
          "Adjust seat so handles are at chest height. Keep slight bend in elbows throughout. Squeeze hard at contraction, pause 1s. Slow return (3s) — the stretch is where pec growth happens.",
        technique_fr:
          "Réglage : poignées à hauteur des pectoraux. Coudes légèrement fléchis en permanence. Contraction maximale, pause 1s. Retour lent (3s) — l'étirement est là où les pectoraux se développent.",
      },
      {
        id: "db_military_press",
        name: "Dumbbell Military Press",
        name_fr: "Développé militaire haltères",
        sets: 3,
        reps: 10,
        cue: "Controlled movement, not momentum.",
        cue_fr: "Mouvement contrôlé, pas d'élan.",
        technique:
          "Start at ear level, elbows at ~75° from torso. Press straight up, don't lock elbows at top. Lower slowly (2-3s down). Hit 10-10-10 clean → move to next weight.",
        technique_fr:
          "Départ au niveau des oreilles, coudes à ~75° du torse. Poussée verticale, pas de verrouillage en haut. Descente lente (2-3s). 10-10-10 clean → montée en charge.",
      },
      {
        id: "lateral_raises",
        name: "Lateral Raises",
        name_fr: "Élévations latérales",
        sets: 3,
        reps: 15,
        cue: "Slow and controlled — momentum kills this exercise.",
        cue_fr: "Lent et contrôlé — l'élan tue cet exercice.",
        technique:
          "Slight forward lean (~10°), raise to shoulder height max. Lead with elbows, not hands. Pause 1s at top. 3-4s lower. These are light — ego-lifting does nothing here.",
        technique_fr:
          "Légèrement penché en avant (~10°), montée jusqu'à hauteur d'épaule. Mène avec les coudes, pas les mains. Pause 1s en haut. 3-4s de descente. Charge légère — le chargement excessif ne sert à rien ici.",
      },
      {
        id: "triceps_pushdown",
        name: "Triceps Pushdown",
        name_fr: "Extension triceps poulie",
        sets: 3,
        reps: 15,
        cue: "Full extension at the bottom — that's where triceps fully contract.",
        cue_fr: "Extension complète en bas — c'est là que le triceps se contracte pleinement.",
        technique:
          "Elbows pinned to sides. Upper arms stay vertical and static. Only forearms move. Slow eccentric (3s up), controlled push down.",
        technique_fr:
          "Coudes collés au corps. Bras supérieurs verticaux et immobiles. Seuls les avant-bras bougent. Excentrique lent (3s remontée), poussée contrôlée vers le bas.",
      },
    ],
  },
  friday: {
    name: "Pull Day",
    name_fr: "Tirage",
    day: "Friday",
    restSeconds: 90,
    exercises: [
      {
        id: "lat_pulldown",
        name: "Lat Pulldown",
        name_fr: "Tirage vertical",
        sets: 4,
        reps: 8,
        cue: "Lats > biceps — initiate with shoulder blades, not your arms.",
        cue_fr: "Dorsaux > biceps — initie avec les omoplates, pas les bras.",
        technique:
          "Full grip, shoulder-width or slightly wider. Stretch fully at top. Pull bar to upper chest, lean back ~15° only. Drive elbows down and back. 3s up, explosive pull down.",
        technique_fr:
          "Prise large, largeur épaules ou légèrement plus. Étirement complet en haut. Tirer la barre vers la clavicule, légère inclinaison arrière (~15°). Coudes vers le bas et l'arrière. 3s remontée, traction explosive.",
      },
      {
        id: "seated_row",
        name: "Seated Row Machine",
        name_fr: "Tirage horizontal assis",
        sets: 4,
        reps: 10,
        cue: "Squeeze shoulder blades together at full contraction — that's the rep.",
        cue_fr: "Contracte les omoplates à la contraction complète — c'est ça, la rep.",
        technique:
          "Keep torso upright and still. Pull to lower chest/upper abdomen. Elbows close to torso. 3s return to start, full stretch at front. Don't shrug.",
        technique_fr:
          "Torse droit et immobile. Tirer vers la poitrine basse. Coudes proches du corps. 3s retour, étirement complet à l'avant. Pas de haussement d'épaules.",
      },
      {
        id: "hammer_curls",
        name: "Hammer Curls",
        name_fr: "Curl marteau",
        sets: 3,
        reps: 10,
        cue: "Neutral grip targets brachialis — adds arm thickness.",
        cue_fr: "Prise neutre cible le brachial — épaissit les bras.",
        technique:
          "Elbows pinned to sides, no swinging. Curl to shoulder height, pause 1s, lower in 3s. Alternate arms or do both.",
        technique_fr:
          "Coudes collés, pas de balancement. Curl jusqu'à hauteur d'épaule, pause 1s, descente en 3s. Alternance ou simultané.",
      },
      {
        id: "rear_delt_machine",
        name: "Rear Delt Machine",
        name_fr: "Machine deltoïdes postérieurs",
        sets: 3,
        reps: 15,
        cue: "At full extension, squeeze the rear delts for 1s.",
        cue_fr: "À l'extension complète, contracte les deltoïdes postérieurs 1s.",
        technique:
          "Handles at shoulder height, chest lightly against pad. Elbows slightly soft. Push handles out and back, lead with elbows. Very slow return (3-4s). Weight should feel embarrassingly light — that's correct.",
        technique_fr:
          "Poignées à hauteur des épaules, poitrine légèrement contre le pad. Coudes légèrement fléchis. Pousser vers l'arrière en menant avec les coudes. Retour très lent (3-4s). La charge doit paraître ridiculement légère — c'est normal.",
      },
      {
        id: "wrist_curls",
        name: "Wrist Curls",
        name_fr: "Curl des poignets",
        sets: 3,
        reps: 15,
        cue: "Forearm flat, palm up. Only the wrist moves.",
        cue_fr: "Avant-bras à plat, paume vers le haut. Seul le poignet bouge.",
        technique:
          "Lower as far as comfortable, curl up fully. Start at 5-8kg max. Feeling warmth is normal. Sharp pain or clicking — stop immediately.",
        technique_fr:
          "Descendre aussi bas que confortable, remonter complètement. Commencer à 5-8kg max. Sensation de chaleur normale. Douleur vive ou craquement — arrêt immédiat.",
      },
      {
        id: "preacher_curls",
        name: "Preacher Curls",
        name_fr: "Curl au pupitre",
        sets: 3,
        reps: 10,
        cue: "Strict isolation — the pad removes all momentum.",
        cue_fr: "Isolation stricte — le pupitre élimine tout élan.",
        technique:
          "Adjust pad so armpits rest on top edge. Arms fully extended at bottom — don't hyperextend elbows. Curl to full contraction, squeeze 1s at top. Lower in 3s — control the negative. Keep wrists neutral, don't curl them.",
        technique_fr:
          "Règle le pupitre pour que les aisselles reposent sur le bord supérieur. Bras en extension complète en bas — pas d'hyperextension des coudes. Curl jusqu'à contraction complète, contracte 1s en haut. Descente en 3s — contrôle la phase négative. Poignets neutres, ne pas les fléchir.",
      },
    ],
  },
  sunday: {
    name: "Leg Day",
    name_fr: "Jambes",
    day: "Sunday",
    restSeconds: 90,
    exercises: [
      {
        id: "leg_press",
        name: "Leg Press",
        name_fr: "Presse à jambes",
        sets: 4,
        reps: 8,
        cue: "Do NOT lock out knees at top.",
        cue_fr: "Ne JAMAIS verrouiller les genoux en haut.",
        technique:
          "Foot placement mid-platform, shoulder-width. Lower until knees reach ~90°. Don't let knees cave inward. Control the descent (2-3s), explosive press up.",
        technique_fr:
          "Pieds au centre de la plateforme, largeur épaules. Descente jusqu'à ~90° aux genoux. Genoux dans l'axe des pieds. Contrôle la descente (2-3s), poussée explosive.",
      },
      {
        id: "hip_thrust",
        name: "Hip Thrust Machine",
        name_fr: "Hip Thrust machine",
        sets: 4,
        reps: 10,
        cue: "Drive through your heels. Squeeze glutes hard at full extension.",
        cue_fr: "Pousse à travers les talons. Contracte les fessiers fort en extension complète.",
        technique:
          "At top, torso parallel to floor — don't hyperextend lower back. Full range down for glute stretch. Pause 1-2s at top with glutes contracted.",
        technique_fr:
          "En haut, torse parallèle au sol — pas d'hyperextension lombaire. Amplitude complète vers le bas pour étirer les fessiers. Pause 1-2s en haut avec contraction des fessiers.",
      },
      {
        id: "rdl",
        name: "Romanian Deadlift",
        name_fr: "Soulevé de terre roumain",
        sets: 3,
        reps: 10,
        cue: "Hip hinge — bar stays close to legs the entire time.",
        cue_fr: "Hip hinge — la barre reste proche des jambes tout le temps.",
        technique:
          "Push hips back, not down. Slight knee bend, back flat, chest up. Lower to mid-shin until deep hamstring stretch. Drive hips forward to return. 3s down, controlled up.",
        technique_fr:
          "Repousse les hanches en arrière, pas vers le bas. Légère flexion des genoux, dos plat, poitrine haute. Descente jusqu'à mi-tibia jusqu'à l'étirement profond des ischio-jambiers. Pousse les hanches en avant pour remonter. 3s descente.",
      },
      {
        id: "calf_raises",
        name: "Seated Calf Raises",
        name_fr: "Extensions mollets assis",
        sets: 4,
        reps: 15,
        cue: "Full range and time under tension — that's the whole point.",
        cue_fr: "Amplitude complète et temps sous tension — c'est tout l'intérêt.",
        technique:
          "Lower heel FULLY below platform edge. Pause 1s at bottom. Rise to full plantar flexion, squeeze hard, pause 1s at top. 3s down. If it burns, you're doing it right.",
        technique_fr:
          "Talons ENTIÈREMENT sous le bord de la plateforme. Pause 1s en bas. Montée en flexion plantaire complète, contracte fort, pause 1s en haut. 3s descente. Si ça brûle, c'est bien.",
      },
      {
        id: "leg_curl",
        name: "Leg Curl",
        name_fr: "Leg Curl",
        sets: 3,
        reps: 12,
        cue: "Control the eccentric — that's where hamstrings grow.",
        cue_fr: "Contrôle l'excentrique — c'est là que les ischio-jambiers se développent.",
        technique:
          "Curl to full contraction, pause 1s. Lower in 3s — resist all the way down. Keep hips pressed into pad.",
        technique_fr:
          "Curl jusqu'à contraction complète, pause 1s. Descente en 3s — résiste jusqu'au bout. Hanches plaquées contre le pad.",
      },
      {
        id: "leg_extensions",
        name: "Leg Extensions",
        name_fr: "Extensions jambes",
        sets: 3,
        reps: 12,
        cue: "Full extension, pause, slow return.",
        cue_fr: "Extension complète, pause, retour lent.",
        technique:
          "Extend to almost straight, pause 1s. Raise in 3s. Keep hips pressed into pad.",
        technique_fr:
          "Étendre presque à fond, pause 1s. Remontée en 3s. Hanches bien plaquées contre le pad.",
      },
    ],
  },
  home: {
    name: "Home Routine",
    name_fr: "Routine Maison",
    subtitle: "After every session",
    exercises: [
      {
        id: "plank",
        name: "Plank",
        name_fr: "Gainage",
        sets: 3,
        reps: "30s",
        cue: "Posterior pelvic tilt — push hips slightly forward.",
        cue_fr: "Rétroversion du bassin — pousse légèrement les hanches en avant.",
        technique:
          "Squeeze glutes and core simultaneously. Eyes down, forearms flat, elbows under shoulders. Add 5-10s per week when it feels comfortable.",
        technique_fr:
          "Contracte fessiers et abdos simultanément. Regard vers le bas, avant-bras à plat, coudes sous les épaules. Ajouter 5-10s par semaine quand c'est confortable.",
      },
      {
        id: "side_abs",
        name: "Side Abs",
        name_fr: "Abdos obliques",
        sets: 3,
        reps: 20,
        cue: "Targets obliques — slow contraction, full range.",
        cue_fr: "Cible les obliques — contraction lente, amplitude complète.",
        technique:
          "Side-lying, lift legs or upper body laterally. 20 reps each side per set.",
        technique_fr:
          "En appui latéral, lever les jambes ou le buste. 20 répétitions de chaque côté par série.",
      },
      {
        id: "starfish_abs",
        name: "Starfish Abs",
        name_fr: "Abdos étoile",
        sets: 3,
        reps: 20,
        cue: "Lower back pressed to floor throughout.",
        cue_fr: "Bas du dos plaqué au sol en permanence.",
        technique:
          "Lie flat, arms and legs extended. Raise opposite arm and leg simultaneously. 2s up, 2s down.",
        technique_fr:
          "Allongé à plat, bras et jambes étirés. Lever le bras et la jambe opposés simultanément. 2s montée, 2s descente.",
      },
    ],
  },
};

export const MENU_DATA = {
  monday: {
    label: "Monday",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Scrambled eggs on toast",
        name_fr: "Œufs brouillés sur toast",
        details: "2 eggs scrambled in butter, 2 slices whole grain toast, 1 glass natural OJ",
        details_fr: "2 œufs brouillés au beurre, 2 tranches de pain complet, 1 verre de jus d'orange naturel",
        kcal: 430, protein: 24, carbs: 52, fat: 14,
      },
      {
        time: "12:00",
        name: "Tuna rice bowl",
        name_fr: "Bowl thon riz",
        details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing",
        details_fr: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Whey shake + banana",
        name_fr: "Shake whey + banane",
        details: "1 Gold Standard Whey shake",
        details_fr: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Chicken thighs + pasta",
        name_fr: "Cuisses de poulet + pâtes",
        details: "250g boneless chicken thighs, marinade: olive oil, lemon, garlic, paprika, cumin. 200g pasta",
        details_fr: "250g de cuisses de poulet désossées, marinade : huile d'olive, citron, ail, paprika, cumin. 200g de pâtes",
        kcal: 620, protein: 52, carbs: 42, fat: 22,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2105, protein: 172, carbs: 212, fat: 54 },
  },
  tuesday: {
    label: "Tuesday",
    type: "gym",
    meals: [
      {
        time: "8:00",
        name: "Eggs on toast",
        name_fr: "Œufs sur toast",
        details: "3 fried eggs, 2 slices whole grain toast, 1 banana, 1 glass natural OJ",
        details_fr: "3 œufs au plat, 2 tranches de pain complet, 1 banane, 1 verre de jus d'orange naturel",
        kcal: 660, protein: 37, carbs: 72, fat: 20,
      },
      {
        time: "12:00",
        name: "Chicken breast + rice",
        name_fr: "Blanc de poulet + riz",
        details: "200g chicken breast with herbs, 125g white rice, 100g frozen peas, soy sauce + lemon",
        details_fr: "200g de blanc de poulet aux herbes, 125g de riz blanc, 100g de petits pois surgelés, sauce soja + citron",
        kcal: 620, protein: 58, carbs: 72, fat: 7,
      },
      {
        time: "16:30",
        name: "Pre-workout: banana + whey",
        name_fr: "Pré-séance : banane + whey",
        details: "1 banana, 1 Gold Standard Whey shake (low-fat milk)",
        details_fr: "1 banane, 1 shake Gold Standard Whey (lait demi-écrémé)",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Chicken breast + pasta",
        name_fr: "Blanc de poulet + pâtes",
        details: "300g chicken breast, 125g pasta, passata sauce (garlic, basil, olive oil), 30g grana padano",
        details_fr: "300g de blanc de poulet, 125g de pâtes, sauce tomate (ail, basilic, huile d'olive), 30g de grana padano",
        kcal: 810, protein: 78, carbs: 82, fat: 15,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
  wednesday: {
    label: "Wednesday",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Yogurt bowl",
        name_fr: "Bowl yaourt",
        details: "200g plain yogurt, 1 banana sliced, 1 tbsp honey, 1 glass natural OJ",
        details_fr: "200g de yaourt nature, 1 banane tranchée, 1 c. à soupe de miel, 1 verre de jus d'orange naturel",
        kcal: 420, protein: 21, carbs: 72, fat: 3,
      },
      {
        time: "12:00",
        name: "Tuna rice bowl",
        name_fr: "Bowl thon riz",
        details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing",
        details_fr: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Whey shake + banana",
        name_fr: "Shake whey + banane",
        details: "1 Gold Standard Whey shake",
        details_fr: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Salmon + pasta",
        name_fr: "Saumon + pâtes",
        details: "150g salmon fillet with lemon and dill, 200g pasta",
        details_fr: "150g de filet de saumon au citron et aneth, 200g de pâtes",
        kcal: 580, protein: 40, carbs: 42, fat: 18,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2055, protein: 157, carbs: 232, fat: 39 },
  },
  thursday: {
    label: "Thursday",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Cottage cheese toast",
        name_fr: "Toast fromage blanc",
        details: "2 slices whole grain toast, 150g cottage cheese, cherry tomatoes, salt and pepper, 1 glass OJ",
        details_fr: "2 tranches de pain complet, 150g de fromage blanc, tomates cerises, sel et poivre, 1 verre de jus d'orange",
        kcal: 430, protein: 28, carbs: 52, fat: 8,
      },
      {
        time: "12:00",
        name: "Tuna rice bowl",
        name_fr: "Bowl thon riz",
        details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing",
        details_fr: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Whey shake + banana",
        name_fr: "Shake whey + banane",
        details: "1 Gold Standard Whey shake",
        details_fr: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Chicken thighs + pasta",
        name_fr: "Cuisses de poulet + pâtes",
        details: "250g boneless chicken thighs, marinade: olive oil, lemon, garlic, paprika, cumin. 200g pasta",
        details_fr: "250g de cuisses de poulet désossées, marinade : huile d'olive, citron, ail, paprika, cumin. 200g de pâtes",
        kcal: 620, protein: 52, carbs: 42, fat: 22,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2105, protein: 176, carbs: 212, fat: 48 },
  },
  friday: {
    label: "Friday",
    type: "gym",
    meals: [
      {
        time: "8:00",
        name: "Poached eggs on toast",
        name_fr: "Œufs pochés sur toast",
        details: "3 poached eggs, 2 slices whole grain toast, 1 banana, 1 glass natural OJ",
        details_fr: "3 œufs pochés, 2 tranches de pain complet, 1 banane, 1 verre de jus d'orange naturel",
        kcal: 660, protein: 37, carbs: 72, fat: 20,
      },
      {
        time: "12:00",
        name: "Chicken breast + rice",
        name_fr: "Blanc de poulet + riz",
        details: "200g chicken breast with herbs, 125g white rice, 100g frozen peas, soy sauce + lemon",
        details_fr: "200g de blanc de poulet aux herbes, 125g de riz blanc, 100g de petits pois surgelés, sauce soja + citron",
        kcal: 620, protein: 58, carbs: 72, fat: 7,
      },
      {
        time: "16:30",
        name: "Pre-workout: banana + whey",
        name_fr: "Pré-séance : banane + whey",
        details: "1 banana, 1 Gold Standard Whey shake (low-fat milk)",
        details_fr: "1 banane, 1 shake Gold Standard Whey (lait demi-écrémé)",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Chicken breast + pasta",
        name_fr: "Blanc de poulet + pâtes",
        details: "300g chicken breast, 125g pasta, passata sauce (garlic, basil, olive oil), 30g grana padano",
        details_fr: "300g de blanc de poulet, 125g de pâtes, sauce tomate (ail, basilic, huile d'olive), 30g de grana padano",
        kcal: 810, protein: 78, carbs: 82, fat: 15,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
  saturday: {
    label: "Saturday",
    type: "rest",
    meals: [
      {
        time: "8:00",
        name: "Eggs on toast",
        name_fr: "Œufs sur toast",
        details: "3 scrambled eggs with cherry tomatoes, 2 slices whole grain toast, 1 glass OJ",
        details_fr: "3 œufs brouillés avec tomates cerises, 2 tranches de pain complet, 1 verre de jus d'orange",
        kcal: 490, protein: 30, carbs: 52, fat: 17,
      },
      {
        time: "12:00",
        name: "Tuna rice bowl",
        name_fr: "Bowl thon riz",
        details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing",
        details_fr: "1 boîte de thon (160g égoutté), 125g de riz blanc, vinaigrette huile d'olive + vinaigre de riz + citron",
        kcal: 560, protein: 52, carbs: 58, fat: 10,
      },
      {
        time: "16:30",
        name: "Whey shake + banana",
        name_fr: "Shake whey + banane",
        details: "1 Gold Standard Whey shake",
        details_fr: "1 shake Gold Standard Whey",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Salmon + pasta",
        name_fr: "Saumon + pâtes",
        details: "150g salmon fillet with lemon and dill, 200g pasta",
        details_fr: "150g de filet de saumon au citron et aneth, 200g de pâtes",
        kcal: 580, protein: 40, carbs: 42, fat: 18,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2125, protein: 166, carbs: 212, fat: 53 },
  },
  sunday: {
    label: "Sunday",
    type: "gym",
    meals: [
      {
        time: "8:00",
        name: "Eggs on toast",
        name_fr: "Œufs sur toast",
        details: "3 fried eggs, 2 slices whole grain toast, 1 banana, 1 glass natural OJ",
        details_fr: "3 œufs au plat, 2 tranches de pain complet, 1 banane, 1 verre de jus d'orange naturel",
        kcal: 660, protein: 37, carbs: 72, fat: 20,
      },
      {
        time: "12:00",
        name: "Chicken breast + rice",
        name_fr: "Blanc de poulet + riz",
        details: "200g chicken breast with herbs, 125g white rice, 100g frozen peas, soy sauce + lemon",
        details_fr: "200g de blanc de poulet aux herbes, 125g de riz blanc, 100g de petits pois surgelés, sauce soja + citron",
        kcal: 620, protein: 58, carbs: 72, fat: 7,
      },
      {
        time: "16:30",
        name: "Pre-workout: banana + whey",
        name_fr: "Pré-séance : banane + whey",
        details: "1 banana, 1 Gold Standard Whey shake (low-fat milk)",
        details_fr: "1 banane, 1 shake Gold Standard Whey (lait demi-écrémé)",
        kcal: 310, protein: 30, carbs: 38, fat: 4,
      },
      {
        time: "18:30",
        name: "Chicken breast + pasta",
        name_fr: "Blanc de poulet + pâtes",
        details: "300g chicken breast, 125g pasta, passata sauce (garlic, basil, olive oil), 30g grana padano",
        details_fr: "300g de blanc de poulet, 125g de pâtes, sauce tomate (ail, basilic, huile d'olive), 30g de grana padano",
        kcal: 810, protein: 78, carbs: 82, fat: 15,
      },
      {
        time: "20:00",
        name: "Greek Yogurt",
        name_fr: "Yaourt grec",
        details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey",
        details_fr: "200g de yaourt grec, 50g de myrtilles surgelées, 1 c. à café de miel",
        kcal: 185, protein: 14, carbs: 22, fat: 4,
      },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
};

export type DayKey = keyof typeof MENU_DATA;
export type WorkoutKey = keyof typeof WORKOUT_DATA;

export function getTodayKey(): DayKey {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
  return days[new Date().getDay()];
}

export function getTodayWorkout() {
  const key = getTodayKey();
  return WORKOUT_DATA[key as WorkoutKey] ?? null;
}

export function getTodayMenu() {
  return MENU_DATA[getTodayKey()];
}
