/**
 * Synthesizes a crisp, pleasant task completion chime using Web Audio API.
 * Requires no external audio files, 0ms latency, works offline and across all platforms.
 */
export function playCompletionSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Pleasant 2-tone melodic success chime: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5

    osc2.frequency.setValueAtTime(659.25, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.1);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  } catch (e) {
    // Gracefully ignore audio context restriction if user hasn't interacted with page yet
  }
}

/**
 * Synthesizes a high-energy celebratory "Woo-Hoo!" fanfare using Web Audio API.
 */
export function playWooHooSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Woo-Hoo Fanfare: C5 -> E5 -> G5 -> C6 high triumph pitch!
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.35, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.3);
    });
  } catch (e) {
    // Ignore audio context restriction
  }
}
