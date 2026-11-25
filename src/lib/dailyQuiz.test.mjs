// Run: node --test src/lib/dailyQuiz.test.mjs  (Node 22.18+ strips the TypeScript types itself)
import test from "node:test";
import assert from "node:assert/strict";
import { applyResult, currentStreak, dayNumber, questionFor, DAILY_QUESTIONS, EMPTY_STREAK } from "./dailyQuiz.ts";

test("every question's answer is one of its options", () => {
  for (const q of DAILY_QUESTIONS) assert.ok(q.options.includes(q.answer), q.q);
});

test("day numbers start at 1 and questions cycle", () => {
  assert.equal(dayNumber("2026-01-01"), 1);
  assert.equal(dayNumber("2026-03-01"), 60); // Jan 31 + Feb 28 + 1
  assert.equal(questionFor("2026-01-01"), questionFor("2026-02-10")); // 40 days later
  assert.ok(questionFor("2025-12-31")); // before the epoch still resolves
});

test("streak grows on consecutive wins, resets on a loss or a gap", () => {
  let s = applyResult(EMPTY_STREAK, "2026-02-27", true);
  s = applyResult(s, "2026-02-28", true);
  s = applyResult(s, "2026-03-01", true); // crosses a month boundary
  assert.equal(s.streak, 3);
  assert.equal(applyResult(s, "2026-03-01", false), s, "a second answer the same day is ignored");
  const lost = applyResult(s, "2026-03-02", false);
  assert.deepEqual([lost.streak, lost.best], [0, 3]);
  assert.equal(applyResult(s, "2026-03-05", true).streak, 1, "a missed day restarts at 1");
  assert.equal(currentStreak(s, "2026-03-02"), 3, "still alive the next morning");
  assert.equal(currentStreak(s, "2026-03-03"), 0, "lapsed after a missed day");
});
