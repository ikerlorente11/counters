import assert from "node:assert/strict";
import test from "node:test";
import {
  __resetCounterFeedbackForTests,
  __setCounterFeedbackTestDependencies,
  getCounterFeedbackPreferences,
  normalizeCounterFeedbackLevel,
  playCounterTapFeedback,
  prepareCounterTapFeedback,
  setCounterFeedbackPreferences,
} from "./counterFeedback.js";

test.afterEach(() => {
  __resetCounterFeedbackForTests();
});

test("playCounterTapFeedback vibrates and replays the cached audio player", async () => {
  const calls = [];

  __setCounterFeedbackTestDependencies({
    createAudioPlayer(source, options) {
      const playerIndex = calls.filter(([name]) => name === "createAudioPlayer").length;
      const player = {
        volume: 0,
        pause() {
          calls.push(["pause", playerIndex]);
        },
        async seekTo(seconds) {
          calls.push(["seekTo", playerIndex, seconds]);
        },
        play() {
          calls.push(["play", playerIndex]);
        },
      };

      calls.push(["createAudioPlayer", source, options]);
      return player;
    },
    async preload(source, options) {
      calls.push(["preload", source, options]);
    },
    async setIsAudioActiveAsync(value) {
      calls.push(["setIsAudioActiveAsync", value]);
    },
    async setAudioModeAsync(mode) {
      calls.push(["setAudioModeAsync", mode]);
    },
    cancelVibration() {
      calls.push(["cancelVibration"]);
    },
    vibrate(duration) {
      calls.push(["vibrate", duration]);
    },
    soundSource: "counter-tap-test.wav",
  });

  setCounterFeedbackPreferences({ tapSoundVolume: 0.8, vibrationStrength: 0.5 });

  await playCounterTapFeedback();
  await playCounterTapFeedback();

  assert.equal(calls.filter(([name]) => name === "createAudioPlayer").length, 2);
  assert.equal(calls.filter(([name]) => name === "preload").length, 2);
  assert.equal(calls.filter(([name]) => name === "setIsAudioActiveAsync").length, 1);
  assert.equal(calls.filter(([name]) => name === "setAudioModeAsync").length, 1);
  assert.deepEqual(
    calls.filter(([name]) => name === "cancelVibration"),
    [["cancelVibration"], ["cancelVibration"]],
  );
  assert.deepEqual(
    calls.filter(([name]) => name === "vibrate"),
    [
      ["vibrate", 26],
      ["vibrate", 26],
    ],
  );
  assert.deepEqual(
    calls.filter(([name]) => name === "seekTo"),
    [
      ["seekTo", 0, 0],
      ["seekTo", 1, 0],
    ],
  );
  assert.deepEqual(
    calls.filter(([name]) => name === "pause"),
    [["pause", 0], ["pause", 1]],
  );
  assert.deepEqual(
    calls.filter(([name]) => name === "play"),
    [["play", 0], ["play", 1]],
  );
});

test("playCounterTapFeedback configures the audio mode for short sound effects", async () => {
  const calls = [];

  __setCounterFeedbackTestDependencies({
    createAudioPlayer() {
      return {
        volume: 0,
        async seekTo() {},
        play() {},
      };
    },
    async setAudioModeAsync(mode) {
      calls.push(mode);
    },
    async setIsAudioActiveAsync(value) {
      calls.push({ active: value });
    },
    soundSource: "counter-tap-test.wav",
  });

  await playCounterTapFeedback();

  assert.deepEqual(calls, [
    {
      interruptionMode: "mixWithOthers",
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    },
    { active: true },
  ]);
});

test("prepareCounterTapFeedback initializes the player without vibrating", async () => {
  const calls = [];

  __setCounterFeedbackTestDependencies({
    createAudioPlayer() {
      calls.push("createAudioPlayer");
      return {
        volume: 0,
        async seekTo() {},
        play() {},
      };
    },
    async preload() {
      calls.push("preload");
    },
    async setAudioModeAsync() {
      calls.push("setAudioModeAsync");
    },
    async setIsAudioActiveAsync() {
      calls.push("setIsAudioActiveAsync");
    },
    vibrate() {
      calls.push("vibrate");
    },
    soundSource: "counter-tap-test.wav",
  });

  const prepared = await prepareCounterTapFeedback();

  assert.equal(prepared, true);
  assert.deepEqual(calls, [
    "preload",
    "preload",
    "setAudioModeAsync",
    "setIsAudioActiveAsync",
    "createAudioPlayer",
    "createAudioPlayer",
  ]);
});

test("playCounterTapFeedback still succeeds when only vibration is available", async () => {
  const calls = [];

  __setCounterFeedbackTestDependencies({
    vibrate(duration) {
      calls.push(duration);
    },
  });

  setCounterFeedbackPreferences({ vibrationStrength: 1 });

  const result = await playCounterTapFeedback();

  assert.equal(result, true);
  assert.deepEqual(calls, [42]);
});

test("playCounterTapFeedback swallows audio player errors", async () => {
  const calls = [];

  __setCounterFeedbackTestDependencies({
    createAudioPlayer() {
      return {
        volume: 0,
        pause() {
          calls.push("pause");
        },
        async seekTo() {
          throw new Error("seek failed");
        },
        play() {
          calls.push("play");
          throw new Error("play failed");
        },
      };
    },
    vibrate(duration) {
      calls.push(duration);
    },
    soundSource: "counter-tap-test.wav",
  });

  setCounterFeedbackPreferences({ vibrationStrength: 1 });

  const result = await playCounterTapFeedback();

  assert.equal(result, true);
  assert.deepEqual(calls, [42, "pause", "play"]);
});

test("setCounterFeedbackPreferences supports zero-disable values", async () => {
  const calls = [];

  __setCounterFeedbackTestDependencies({
    createAudioPlayer() {
      return {
        volume: 0,
        pause() {
          calls.push("pause");
        },
        async seekTo() {},
        play() {
          calls.push("play");
        },
      };
    },
    vibrate() {
      calls.push("vibrate");
    },
    soundSource: "counter-tap-test.wav",
  });

  setCounterFeedbackPreferences({ tapSoundVolume: 0, vibrationStrength: 0 });
  const result = await playCounterTapFeedback();

  assert.equal(result, true);
  assert.deepEqual(calls, []);
});

test("normalizeCounterFeedbackLevel clamps out-of-range values", () => {
  assert.equal(normalizeCounterFeedbackLevel(-0.2, 0.5), 0);
  assert.equal(normalizeCounterFeedbackLevel(1.4, 0.5), 1);
  assert.equal(normalizeCounterFeedbackLevel("bad", 0.5), 0.5);
});

test("getCounterFeedbackPreferences returns updated runtime values", () => {
  setCounterFeedbackPreferences({ tapSoundVolume: 0.33, vibrationStrength: 0.44 });

  assert.deepEqual(getCounterFeedbackPreferences(), {
    tapSoundVolume: 0.33,
    vibrationStrength: 0.44,
  });
});