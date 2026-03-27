export const WORKOUT_DATA = {
  tuesday: {
    name: "Push Day",
    day: "Tuesday",
    restSeconds: 90,
    exercises: [
      {
        id: "dips",
        name: "Dips",
        sets: 3,
        reps: "max",
        cue: "Form & feel over raw reps.",
        technique:
          "Grip the bars, lean slightly forward (~15°) to hit the chest more than triceps. Lower until elbows reach 90°, no deeper. Drive up explosively, lock out fully at top. When you hit 12-12-12 clean, add a weight belt.",
      },
      {
        id: "bench_press",
        name: "Bench Press",
        sets: 4,
        reps: 8,
        cue: "Control > load — technique first, weight second.",
        technique:
          "Retract scapulae and press them into the bench. Bar path: lower to lower chest, slight diagonal press toward rack. 3s down, 1s pause, explosive press up. Hit 8-8-8-8 → add 2.5kg.",
      },
      {
        id: "pec_deck",
        name: "Pec Deck",
        sets: 3,
        reps: 12,
        cue: "Squeeze the chest hard at full contraction.",
        technique:
          "Adjust seat so handles are at chest height. Keep slight bend in elbows throughout. Squeeze hard at contraction, pause 1s. Slow return (3s) — the stretch is where pec growth happens.",
      },
      {
        id: "db_military_press",
        name: "DB Military Press",
        sets: 3,
        reps: 10,
        cue: "Controlled movement, not momentum.",
        technique:
          "Start at ear level, elbows at ~75° from torso. Press straight up, don't lock elbows at top. Lower slowly (2-3s down). Hit 10-10-10 clean → move to next weight.",
      },
      {
        id: "lateral_raises",
        name: "Lateral Raises",
        sets: 3,
        reps: 15,
        cue: "Slow and controlled — momentum kills this exercise.",
        technique:
          "Slight forward lean (~10°), raise to shoulder height max. Lead with elbows, not hands. Pause 1s at top. 3-4s lower. These are light — ego-lifting does nothing here.",
      },
      {
        id: "triceps_pushdown",
        name: "Triceps Pushdown",
        sets: 3,
        reps: 15,
        cue: "Full extension at the bottom — that's where triceps fully contract.",
        technique:
          "Elbows pinned to sides. Upper arms stay vertical and static. Only forearms move. Slow eccentric (3s up), controlled push down.",
      },
    ],
  },
  friday: {
    name: "Pull Day",
    day: "Friday",
    restSeconds: 90,
    exercises: [
      {
        id: "lat_pulldown",
        name: "Lat Pulldown",
        sets: 4,
        reps: 8,
        cue: "Lats > biceps — initiate with shoulder blades, not your arms.",
        technique:
          "Full grip, shoulder-width or slightly wider. Stretch fully at top. Pull bar to upper chest, lean back ~15° only. Drive elbows down and back. 3s up, explosive pull down.",
      },
      {
        id: "seated_row",
        name: "Seated Row Machine",
        sets: 4,
        reps: 10,
        cue: "Squeeze shoulder blades together at full contraction — that's the rep.",
        technique:
          "Keep torso upright and still. Pull to lower chest/upper abdomen. Elbows close to torso. 3s return to start, full stretch at front. Don't shrug.",
      },
      {
        id: "hammer_curls",
        name: "Hammer Curls",
        sets: 3,
        reps: 10,
        cue: "Neutral grip targets brachialis — adds arm thickness.",
        technique:
          "Elbows pinned to sides, no swinging. Curl to shoulder height, pause 1s, lower in 3s. Alternate arms or do both.",
      },
      {
        id: "rear_delt_machine",
        name: "Rear Delt Machine",
        sets: 3,
        reps: 15,
        cue: "At full extension, squeeze the rear delts for 1s.",
        technique:
          "Handles at shoulder height, chest lightly against pad. Elbows slightly soft. Push handles out and back, lead with elbows. Very slow return (3-4s). Weight should feel embarrassingly light — that's correct.",
      },
      {
        id: "wrist_curls",
        name: "Wrist Curls",
        sets: 3,
        reps: 15,
        cue: "Forearm flat, palm up. Only the wrist moves.",
        technique:
          "Lower as far as comfortable, curl up fully. Start at 5-8kg max. Feeling warmth is normal. Sharp pain or clicking — stop immediately.",
      },
      {
        id: "reverse_wrist_curls",
        name: "Reverse Wrist Curls",
        sets: 3,
        reps: 15,
        cue: "Same as wrist curls but palms facing down.",
        technique:
          "Even lighter than wrist curls. Full range: lower wrist fully, raise fully. Slow and deliberate. Balances forearm development.",
      },
    ],
  },
  sunday: {
    name: "Leg Day",
    day: "Sunday",
    restSeconds: 90,
    exercises: [
      {
        id: "leg_press",
        name: "Leg Press",
        sets: 4,
        reps: 8,
        cue: "Do NOT lock out knees at top.",
        technique:
          "Foot placement mid-platform, shoulder-width. Lower until knees reach ~90°. Don't let knees cave inward. Control the descent (2-3s), explosive press up.",
      },
      {
        id: "hip_thrust",
        name: "Hip Thrust Machine",
        sets: 4,
        reps: 10,
        cue: "Drive through your heels. Squeeze glutes hard at full extension.",
        technique:
          "At top, torso parallel to floor — don't hyperextend lower back. Full range down for glute stretch. Pause 1-2s at top with glutes contracted.",
      },
      {
        id: "rdl",
        name: "Romanian Deadlift",
        sets: 3,
        reps: 10,
        cue: "Hip hinge — bar stays close to legs the entire time.",
        technique:
          "Push hips back, not down. Slight knee bend, back flat, chest up. Lower to mid-shin until deep hamstring stretch. Drive hips forward to return. 3s down, controlled up.",
      },
      {
        id: "calf_raises",
        name: "Seated Calf Raises",
        sets: 4,
        reps: 15,
        cue: "Full range and time under tension — that's the whole point.",
        technique:
          "Lower heel FULLY below platform edge. Pause 1s at bottom. Rise to full plantar flexion, squeeze hard, pause 1s at top. 3s down. If it burns, you're doing it right.",
      },
      {
        id: "leg_curl",
        name: "Leg Curl",
        sets: 3,
        reps: 12,
        cue: "Control the eccentric — that's where hamstrings grow.",
        technique:
          "Curl to full contraction, pause 1s. Lower in 3s — resist all the way down. Keep hips pressed into pad.",
      },
      {
        id: "leg_extensions",
        name: "Leg Extensions",
        sets: 3,
        reps: 12,
        cue: "Full extension, pause, slow return.",
        technique:
          "Extend to almost straight, pause 1s. Raise in 3s. Keep hips pressed into pad.",
      },
    ],
  },
  home: {
    name: "Home Routine",
    subtitle: "After every session",
    exercises: [
      {
        id: "plank",
        name: "Plank",
        sets: 3,
        reps: "30s",
        cue: "Posterior pelvic tilt — push hips slightly forward.",
        technique:
          "Squeeze glutes and core simultaneously. Eyes down, forearms flat, elbows under shoulders. Add 5-10s per week when it feels comfortable.",
      },
      {
        id: "side_abs",
        name: "Side Abs",
        sets: 3,
        reps: 20,
        cue: "Targets obliques — slow contraction, full range.",
        technique:
          "Side-lying, lift legs or upper body laterally. 20 reps each side per set.",
      },
      {
        id: "starfish_abs",
        name: "Starfish Abs",
        sets: 3,
        reps: 20,
        cue: "Lower back pressed to floor throughout.",
        technique:
          "Lie flat, arms and legs extended. Raise opposite arm and leg simultaneously. 2s up, 2s down.",
      },
    ],
  },
};

export const MENU_DATA = {
  monday: {
    label: "Monday",
    type: "rest",
    meals: [
      { time: "8:00", name: "Scrambled eggs on toast", details: "2 eggs scrambled in butter, 2 slices whole grain toast, 1 glass natural OJ", kcal: 430, protein: 24, carbs: 52, fat: 14 },
      { time: "12:00", name: "Tuna rice bowl", details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing", kcal: 560, protein: 52, carbs: 58, fat: 10 },
      { time: "16:30", name: "Whey shake + banana", details: "1 Gold Standard Whey shake", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Chicken thighs + pasta", details: "250g boneless chicken thighs, marinade: olive oil, lemon, garlic, paprika, cumin. 200g pasta", kcal: 620, protein: 52, carbs: 42, fat: 22 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
    ],
    totals: { kcal: 2105, protein: 172, carbs: 212, fat: 54 },
  },
  tuesday: {
    label: "Tuesday",
    type: "gym",
    meals: [
      { time: "8:00", name: "Eggs on toast", details: "3 fried eggs, 2 slices whole grain toast, 1 banana, 1 glass natural OJ", kcal: 660, protein: 37, carbs: 72, fat: 20 },
      { time: "12:00", name: "Chicken breast + rice", details: "200g chicken breast with herbs, 125g white rice, 100g frozen peas, soy sauce + lemon", kcal: 620, protein: 58, carbs: 72, fat: 7 },
      { time: "16:30", name: "Pre-workout: banana + whey", details: "1 banana, 1 Gold Standard Whey shake (low-fat milk)", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Chicken breast + pasta", details: "300g chicken breast, 125g pasta, passata sauce (garlic, basil, olive oil), 30g grana padano", kcal: 810, protein: 78, carbs: 82, fat: 15 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
  wednesday: {
    label: "Wednesday",
    type: "rest",
    meals: [
      { time: "8:00", name: "Yogurt bowl", details: "200g plain yogurt, 1 banana sliced, 1 tbsp honey, 1 glass natural OJ", kcal: 420, protein: 21, carbs: 72, fat: 3 },
      { time: "12:00", name: "Tuna rice bowl", details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing", kcal: 560, protein: 52, carbs: 58, fat: 10 },
      { time: "16:30", name: "Whey shake + banana", details: "1 Gold Standard Whey shake", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Salmon + pasta", details: "150g salmon fillet with lemon and dill, 200g pasta", kcal: 580, protein: 40, carbs: 42, fat: 18 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
    ],
    totals: { kcal: 2055, protein: 157, carbs: 232, fat: 39 },
  },
  thursday: {
    label: "Thursday",
    type: "rest",
    meals: [
      { time: "8:00", name: "Cottage cheese toast", details: "2 slices whole grain toast, 150g cottage cheese, cherry tomatoes, salt and pepper, 1 glass OJ", kcal: 430, protein: 28, carbs: 52, fat: 8 },
      { time: "12:00", name: "Tuna rice bowl", details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing", kcal: 560, protein: 52, carbs: 58, fat: 10 },
      { time: "16:30", name: "Whey shake + banana", details: "1 Gold Standard Whey shake", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Chicken thighs + pasta", details: "250g boneless chicken thighs, marinade: olive oil, lemon, garlic, paprika, cumin. 200g pasta", kcal: 620, protein: 52, carbs: 42, fat: 22 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
    ],
    totals: { kcal: 2105, protein: 176, carbs: 212, fat: 48 },
  },
  friday: {
    label: "Friday",
    type: "gym",
    meals: [
      { time: "8:00", name: "Poached eggs on toast", details: "3 poached eggs, 2 slices whole grain toast, 1 banana, 1 glass natural OJ", kcal: 660, protein: 37, carbs: 72, fat: 20 },
      { time: "12:00", name: "Chicken breast + rice", details: "200g chicken breast with herbs, 125g white rice, 100g frozen peas, soy sauce + lemon", kcal: 620, protein: 58, carbs: 72, fat: 7 },
      { time: "16:30", name: "Pre-workout: banana + whey", details: "1 banana, 1 Gold Standard Whey shake (low-fat milk)", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Chicken breast + pasta", details: "300g chicken breast, 125g pasta, passata sauce (garlic, basil, olive oil), 30g grana padano", kcal: 810, protein: 78, carbs: 82, fat: 15 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
    ],
    totals: { kcal: 2585, protein: 217, carbs: 286, fat: 50 },
  },
  saturday: {
    label: "Saturday",
    type: "rest",
    meals: [
      { time: "8:00", name: "Eggs on toast", details: "3 scrambled eggs with cherry tomatoes, 2 slices whole grain toast, 1 glass OJ", kcal: 490, protein: 30, carbs: 52, fat: 17 },
      { time: "12:00", name: "Tuna rice bowl", details: "1 can tuna (160g drained), 125g white rice, olive oil + rice vinegar + lemon dressing", kcal: 560, protein: 52, carbs: 58, fat: 10 },
      { time: "16:30", name: "Whey shake + banana", details: "1 Gold Standard Whey shake", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Salmon + pasta", details: "150g salmon fillet with lemon and dill, 200g pasta", kcal: 580, protein: 40, carbs: 42, fat: 18 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
    ],
    totals: { kcal: 2125, protein: 166, carbs: 212, fat: 53 },
  },
  sunday: {
    label: "Sunday",
    type: "gym",
    meals: [
      { time: "8:00", name: "Eggs on toast", details: "3 fried eggs, 2 slices whole grain toast, 1 banana, 1 glass natural OJ", kcal: 660, protein: 37, carbs: 72, fat: 20 },
      { time: "12:00", name: "Chicken breast + rice", details: "200g chicken breast with herbs, 125g white rice, 100g frozen peas, soy sauce + lemon", kcal: 620, protein: 58, carbs: 72, fat: 7 },
      { time: "16:30", name: "Pre-workout: banana + whey", details: "1 banana, 1 Gold Standard Whey shake (low-fat milk)", kcal: 310, protein: 30, carbs: 38, fat: 4 },
      { time: "18:30", name: "Chicken breast + pasta", details: "300g chicken breast, 125g pasta, passata sauce (garlic, basil, olive oil), 30g grana padano", kcal: 810, protein: 78, carbs: 82, fat: 15 },
      { time: "20:00", name: "Greek Yogurt", details: "200g Greek yogurt, 50g frozen blueberries, 1 tsp honey", kcal: 185, protein: 14, carbs: 22, fat: 4 },
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
