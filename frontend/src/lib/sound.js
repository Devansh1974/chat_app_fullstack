// Premium Velvet Glass & Marimba notification chime (Web Audio API)
let audioCtx = null;

export const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Smooth low-pass filter for a velvety, warm acoustic feel
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.connect(audioCtx.destination);

    // Note 1: Warm initial strike (784 Hz / G5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(783.99, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Note 2: Bright harmonic chime (1046.5 Hz / C6 - 60ms delay)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.06);

    gain2.gain.setValueAtTime(0.0001, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.22, now + 0.075);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.38);

    // Note 3: Shimmer overtone (1318.5 Hz / E6 - 70ms delay)
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1318.51, now + 0.07);

    gain3.gain.setValueAtTime(0.0001, now + 0.07);
    gain3.gain.exponentialRampToValueAtTime(0.09, now + 0.085);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc3.connect(gain3);
    gain3.connect(filter);
    osc3.start(now + 0.07);
    osc3.stop(now + 0.3);
  } catch (err) {
    console.debug("Audio notification suppressed:", err);
  }
};
