import { EBBINGHAUS_DEFAULT } from "./constants.js";
import { addDaysMs, startOfDayMs } from "./util.js";

/**
 * SM-2 grade: again | hard | good | easy
 * Returns updated card fields + next due.
 */
export function scheduleSm2(card, grade, now = Date.now()) {
  let ease = card.ease ?? 2.5;
  let reps = card.reps ?? 0;
  let lapses = card.lapses ?? 0;
  let interval = card.interval_days ?? 0;
  let state = card.state || "new";

  if (grade === "again") {
    lapses += 1;
    reps = 0;
    interval = 0;
    state = "relearning";
    ease = Math.max(1.3, ease - 0.2);
  } else if (grade === "hard") {
    if (reps === 0) {
      interval = 1;
    } else {
      interval = Math.max(1, interval * 1.2);
    }
    reps += 1;
    ease = Math.max(1.3, ease - 0.15);
    state = "review";
  } else if (grade === "good") {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else interval = Math.max(1, Math.round(interval * ease));
    reps += 1;
    state = "review";
  } else if (grade === "easy") {
    if (reps === 0) interval = 3;
    else if (reps === 1) interval = 7;
    else interval = Math.max(1, Math.round(interval * ease * 1.3));
    reps += 1;
    ease = ease + 0.15;
    state = "review";
  }

  const due_at =
    grade === "again" ? now : addDaysMs(startOfDayMs(now), interval);

  return {
    ease,
    reps,
    lapses,
    interval_days: interval,
    state,
    due_at,
    last_grade: grade,
    last_reviewed_at: now,
  };
}

/** Classic fixed ladder: again→today, hard→1d, good→next step, easy→skip a step */
export function scheduleEbbinghaus(card, grade, steps, now = Date.now()) {
  const ladder = steps && steps.length ? steps : EBBINGHAUS_DEFAULT;
  let idx = card.reps ?? 0;
  let lapses = card.lapses ?? 0;
  let interval = 0;
  let state = "review";

  if (grade === "again") {
    lapses += 1;
    idx = 0;
    interval = 0;
    state = "relearning";
  } else if (grade === "hard") {
    interval = 1;
    idx = Math.max(0, idx);
  } else if (grade === "good") {
    interval = ladder[Math.min(idx, ladder.length - 1)];
    idx = Math.min(idx + 1, ladder.length);
  } else if (grade === "easy") {
    idx = Math.min(idx + 2, ladder.length);
    interval = ladder[Math.min(idx - 1, ladder.length - 1)];
  }

  const due_at =
    grade === "again" ? now : addDaysMs(startOfDayMs(now), interval);

  return {
    ease: card.ease ?? 2.5,
    reps: grade === "again" ? 0 : idx,
    lapses,
    interval_days: interval,
    state,
    due_at,
    last_grade: grade,
    last_reviewed_at: now,
  };
}

export function scheduleCard(card, grade, settings, now = Date.now()) {
  if (settings.scheduler === "ebbinghaus") {
    return scheduleEbbinghaus(card, grade, settings.ebbinghausSteps, now);
  }
  return scheduleSm2(card, grade, now);
}

/** Schedule directly from 0–100 score */
export function scheduleFromScore(card, score, settings, now = Date.now()) {
  const thresholds = {
    again: settings.scoreThresholdAgain ?? 50,
    hard: settings.scoreThresholdHard ?? 70,
    good: settings.scoreThresholdGood ?? 90,
  };
  let grade = "again";
  if (score >= thresholds.good) grade = "easy";
  else if (score >= thresholds.hard) grade = "good";
  else if (score >= thresholds.again) grade = "hard";

  const next = scheduleCard(card, grade, settings, now);
  next.last_grade = `${grade}:${score}`;
  next.last_score = score;
  return { ...next, grade, score };
}
