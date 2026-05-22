// Cozy 8-bit retro synthesizer using the Web Audio API
// Absolutely no external asset dependencies so it runs perfectly online/offline.

let audioCtx: AudioContext | null = null;
let ambientInterval: any = null;
let humOscillator: OscillatorNode | null = null;
let humGain: GainNode | null = null;
let isAmbientPlaying = false;
let chordIndex = 0;

// Soft nostalgic pentatonic chiptune chords
const MELANCHOLIC_CHORDS = [
  [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
  [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
  [110.00, 164.81, 220.00, 246.94], // Am9 (A2, E3, A3, B3)
  [116.54, 146.83, 174.61, 220.00], // Bbmaj7 (Bb2, D3, F3, A3)
];

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a short synth note
export function playNote(
  frequency: number,
  duration: number,
  type: OscillatorType = "square",
  gainStartValue = 0.15,
  pitchBendDest?: number,
  pitchBendDuration?: number
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    if (pitchBendDest && pitchBendDuration) {
      osc.frequency.exponentialRampToValueAtTime(
        pitchBendDest,
        ctx.currentTime + pitchBendDuration
      );
    }

    gainNode.gain.setValueAtTime(gainStartValue, ctx.currentTime);
    // Linear decay to zero to avoid popping sounds
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration
    );

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked by browser:", e);
  }
}

// Play a physical machine click / button tick
export function playPixelClick() {
  // A soft snap simulated by starting with noise or very fast descending pitch
  playNote(400, 0.04, "triangle", 0.12, 100, 0.04);
}

// Play continuous mechanical suspense warning clicks
export function playClawSuspenseTick() {
  // Ultra-short muted click simulating internal relay switches
  playNote(180, 0.015, "square", 0.04);
  setTimeout(() => {
    playNote(140, 0.015, "square", 0.03);
  }, 90);
}

// Play a nostalgic coin sound (upward arpeggio)
export function playCoinSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // Note 1: E5 (659.25 Hz)
  playNote(659.25, 0.08, "square", 0.1);
  
  // Note 2: B5 (987.77 Hz) slightly delayed
  setTimeout(() => {
    playNote(987.77, 0.25, "square", 0.1);
  }, 80);
}

// Play a subtle short click tick for moving
export function playMoveTick() {
  playNote(120, 0.03, "triangle", 0.08);
}

// Play a descending mechanical sweep during claw drop
export function playClawDropSweep() {
  playNote(300, 0.8, "sawtooth", 0.08, 100, 0.8);
}

// Play an ascending tension sweep during claw lift
export function playClawRaiseSweep() {
  playNote(120, 1.2, "sawtooth", 0.05, 350, 1.2);
}

// Play lights flickering pops
export function playLightFlickerSound() {
  const steps = [0, 80, 150];
  steps.forEach((delay) => {
    setTimeout(() => {
      playNote(Math.random() * 80 + 40, 0.02, "triangle", 0.1);
    }, delay);
  });
}

// Play a soft capsule falling whoosh
export function playCapsuleFallSound() {
  playNote(400, 0.6, "square", 0.1, 80, 0.6);
}

// Play nostalgic success fanfare (bouncy chord arpeggio)
export function playSuccessFanfare() {
  const notes = [
    { freq: 261.63, delay: 0, dur: 0.12 }, // C4
    { freq: 329.63, delay: 100, dur: 0.12 }, // E4
    { freq: 392.00, delay: 200, dur: 0.12 }, // G4
    { freq: 523.25, delay: 300, dur: 0.15 }, // C5
    { freq: 659.25, delay: 400, dur: 0.15 }, // E5
    { freq: 783.99, delay: 500, dur: 0.2 }, // G5
    { freq: 1046.50, delay: 650, dur: 0.5 }, // C6
  ];

  notes.forEach((note) => {
    setTimeout(() => {
      playNote(note.freq, note.dur, "square", 0.12);
    }, note.delay);
  });
}

// Play nostalgic sad slipping / failure sound
export function playFailureSound() {
  const notes = [
    { freq: 196.00, delay: 0, dur: 0.18 }, // G3
    { freq: 174.61, delay: 150, dur: 0.18 }, // F3
    { freq: 146.83, delay: 300, dur: 0.4 }, // D3 (with detuned slide)
  ];

  notes.forEach((note, idx) => {
    setTimeout(() => {
      if (idx === 2) {
        // Bend D3 downwards to C#3
        playNote(note.freq, note.dur, "sawtooth", 0.12, 110, 0.4);
      } else {
        playNote(note.freq, note.dur, "sawtooth", 0.12);
      }
    }, note.delay);
  });
}

// START AMBIENT BACKGROUND HUM AND MELODY
export function startAmbientBg() {
  if (isAmbientPlaying) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    isAmbientPlaying = true;

    // A low-frequency hum representing retro cabinet transformer and CRT monitor
    humOscillator = ctx.createOscillator();
    const humFilter = ctx.createBiquadFilter();
    humGain = ctx.createGain();

    humOscillator.type = "sawtooth";
    humOscillator.frequency.setValueAtTime(55, ctx.currentTime);

    humFilter.type = "lowpass";
    humFilter.frequency.setValueAtTime(100, ctx.currentTime);

    // Warm, background level hum
    humGain.gain.setValueAtTime(0.012, ctx.currentTime);

    humOscillator.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(ctx.destination);

    humOscillator.start();

    const playNextChord = () => {
      if (!isAmbientPlaying) return;

      const chord = MELANCHOLIC_CHORDS[chordIndex];
      chordIndex = (chordIndex + 1) % MELANCHOLIC_CHORDS.length;

      chord.forEach((freq, idx) => {
        const stagger = idx * 0.15;
        const startTime = ctx.currentTime + stagger;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filterNode = ctx.createBiquadFilter();

        osc.type = Math.random() > 0.4 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(650, startTime);

        // Slow attack, warm sustain, long cozy release
        gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.015, startTime + 1.6);
        gainNode.gain.setValueAtTime(0.015, startTime + 3.0);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 5.5);

        osc.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 6.0);
      });
    };

    playNextChord();
    ambientInterval = setInterval(playNextChord, 6200);

  } catch (e) {
    console.warn("Could not start ambient routine:", e);
  }
}

// STOP AMBIENT BACKGROUND HUM AND MELODY
export function stopAmbientBg() {
  isAmbientPlaying = false;
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  try {
    if (humOscillator) {
      humOscillator.stop();
      humOscillator.disconnect();
      humOscillator = null;
    }
    if (humGain) {
      humGain.disconnect();
      humGain = null;
    }
  } catch (e) {
    console.warn("Could not stop ambient routines:", e);
  }
}

// Checks if hum is currently active
export function isAmbientHumRunning() {
  return isAmbientPlaying;
}

