const COUNTER_TAP_VIBRATION_MS = 24;
const COUNTER_TAP_VOLUME = 1;
const COUNTER_TAP_PLAYER_POOL_SIZE = 2;
const COUNTER_TAP_AUDIO_MODE = Object.freeze({
  interruptionMode: "mixWithOthers",
  playsInSilentMode: true,
  shouldPlayInBackground: false,
});

let testDependencies = null;
let audioModePromise = null;
let audioActivationPromise = null;
let playerPromises = [];
let nextPlayerIndex = 0;

/**
 * Warms up the shared counter feedback resources to reduce first-tap latency.
 * @returns {Promise<boolean>}
 */
export async function prepareCounterTapFeedback() {
  const dependencies = getRuntimeDependencies();

  if (!dependencies?.createAudioPlayer) {
    return false;
  }

  const players = await ensureCounterTapPlayers(dependencies);
  return players.length > 0;
}

/**
 * Plays the counter tap sound and triggers a subtle vibration when available.
 * @returns {Promise<boolean>}
 */
export async function playCounterTapFeedback() {
  const dependencies = getRuntimeDependencies();

  if (!dependencies) {
    return false;
  }

  triggerLightVibration(dependencies.vibrate, dependencies.cancelVibration);

  if (!dependencies.createAudioPlayer) {
    return true;
  }

  const player = await getNextCounterTapPlayer(dependencies);

  if (!player) {
    return true;
  }

  await restartCounterTapPlayer(player);

  return true;
}

/**
 * Injects test doubles for Node-based unit tests.
 * @param {{createAudioPlayer?: Function | null, preload?: Function | null, setAudioModeAsync?: Function | null, soundSource?: string | number | null, vibrate?: Function | null} | null} dependencies
 */
export function __setCounterFeedbackTestDependencies(dependencies) {
  testDependencies = dependencies;
  resetCounterFeedbackState();
}

/**
 * Resets cached state used by counter feedback tests.
 */
export function __resetCounterFeedbackForTests() {
  testDependencies = null;
  resetCounterFeedbackState();
}

async function ensureCounterTapPlayers(dependencies) {
  if (playerPromises.length === 0) {
    playerPromises = Array.from(
      { length: COUNTER_TAP_PLAYER_POOL_SIZE },
      () => createCounterTapPlayer(dependencies),
    );
  }

  const settledPlayers = await Promise.all(playerPromises);
  return settledPlayers.filter(Boolean);
}

async function getNextCounterTapPlayer(dependencies) {
  const players = await ensureCounterTapPlayers(dependencies);

  if (players.length === 0) {
    return null;
  }

  const player = players[nextPlayerIndex % players.length];
  nextPlayerIndex += 1;

  return player;
}

async function createCounterTapPlayer(dependencies) {
  const soundSource = getCounterTapSoundSource();

  if (!soundSource) {
    return null;
  }

  if (typeof dependencies.preload === "function") {
    try {
      await dependencies.preload(soundSource, {
        preferredForwardBufferDuration: 0.25,
      });
    } catch {
      // Preloading is best-effort only.
    }
  }

  await ensureAudioSystemReady(
    dependencies.setAudioModeAsync,
    dependencies.setIsAudioActiveAsync,
  );

  try {
    const player = dependencies.createAudioPlayer(soundSource, {
      keepAudioSessionActive: true,
    });

    if (player && "volume" in player) {
      player.volume = COUNTER_TAP_VOLUME;
    }

    return player;
  } catch {
    return null;
  }
}

async function ensureAudioSystemReady(setAudioModeAsync, setIsAudioActiveAsync) {
  if (!audioModePromise) {
    audioModePromise = Promise.resolve(
      typeof setAudioModeAsync === "function"
        ? setAudioModeAsync(COUNTER_TAP_AUDIO_MODE)
        : undefined,
    ).catch(() => undefined);
  }

  await audioModePromise;

  if (!audioActivationPromise) {
    audioActivationPromise = Promise.resolve(
      typeof setIsAudioActiveAsync === "function"
        ? setIsAudioActiveAsync(true)
        : undefined,
    ).catch(() => undefined);
  }

  await audioActivationPromise;
}

function getRuntimeDependencies() {
  if (testDependencies) {
    return {
      cancelVibration: testDependencies.cancelVibration ?? null,
      createAudioPlayer: testDependencies.createAudioPlayer ?? null,
      preload: testDependencies.preload ?? null,
      setIsAudioActiveAsync: testDependencies.setIsAudioActiveAsync ?? null,
      setAudioModeAsync: testDependencies.setAudioModeAsync ?? null,
      soundSource: testDependencies.soundSource ?? null,
      vibrate: testDependencies.vibrate ?? null,
    };
  }

  if (typeof require !== "function") {
    return null;
  }

  let audioModule = null;
  let reactNativeModule = null;

  try {
    audioModule = require("expo-audio");
  } catch {
    audioModule = null;
  }

  try {
    reactNativeModule = require("react-native");
  } catch {
    reactNativeModule = null;
  }

  if (!audioModule && !reactNativeModule) {
    return null;
  }

  return {
    cancelVibration: reactNativeModule?.Vibration?.cancel ?? null,
    createAudioPlayer: audioModule?.createAudioPlayer ?? null,
    preload: audioModule?.preload ?? null,
    setIsAudioActiveAsync: audioModule?.setIsAudioActiveAsync ?? null,
    setAudioModeAsync: audioModule?.setAudioModeAsync ?? null,
    soundSource: null,
    vibrate: reactNativeModule?.Vibration?.vibrate ?? null,
  };
}

function getCounterTapSoundSource() {
  if (testDependencies?.soundSource) {
    return testDependencies.soundSource;
  }

  if (typeof require !== "function") {
    return null;
  }

  try {
    return require("../assets/sounds/counter-tap.wav");
  } catch {
    return null;
  }
}

async function restartCounterTapPlayer(player) {
  try {
    if (typeof player.pause === "function") {
      player.pause();
    }
  } catch {
    // Pausing before seek avoids repeated-tap overlap issues on some platforms.
  }

  try {
    if (typeof player.seekTo === "function") {
      await player.seekTo(0);
    }
  } catch {
    // Resetting playback position is optional for repeated taps.
  }

  try {
    if (typeof player.play === "function") {
      player.play();
    }
  } catch {
    // Audio feedback must never block the counter action.
  }
}

function triggerLightVibration(vibrate, cancelVibration) {
  if (typeof cancelVibration === "function") {
    try {
      cancelVibration();
    } catch {
      // Cancellation is best-effort.
    }
  }

  if (typeof vibrate !== "function") {
    return;
  }

  try {
    vibrate(COUNTER_TAP_VIBRATION_MS);
  } catch {
    // Vibration is optional feedback.
  }
}

function resetCounterFeedbackState() {
  audioModePromise = null;
  audioActivationPromise = null;
  playerPromises = [];
  nextPlayerIndex = 0;
}