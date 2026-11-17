let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  gainValue = 0.06,
  delayMs = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + delayMs / 1000;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

export function triggerHaptic(enabled: boolean, pattern: number | number[] = 12): void {
  if (!enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Ignore on browsers without vibration support
  }
}

export const soundFx = {
  click(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, 8);
    if (!soundEnabled) return;
    playTone(520, 45, 'triangle', 0.035);
  },
  cardSelect(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, 12);
    if (!soundEnabled) return;
    playTone(620, 60, 'sine', 0.05);
  },
  cardPlace(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, 18);
    if (!soundEnabled) return;
    playTone(340, 70, 'triangle', 0.065);
    playTone(480, 75, 'sine', 0.045, 35);
  },
  invalidMove(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, [18, 28, 18]);
    if (!soundEnabled) return;
    playTone(230, 85, 'sawtooth', 0.035, 0);
    playTone(185, 110, 'sawtooth', 0.03, 65);
  },
  cardDraw(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, 14);
    if (!soundEnabled) return;
    playTone(410, 55, 'sine', 0.045);
    playTone(550, 65, 'sine', 0.04, 45);
  },
  turnSwitch(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, [12, 30, 12]);
    if (!soundEnabled) return;
    playTone(440, 90, 'sine', 0.045);
    playTone(660, 110, 'sine', 0.045, 70);
  },
  victory(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, [25, 40, 25, 40, 45]);
    if (!soundEnabled) return;
    playTone(523.25, 130, 'triangle', 0.06, 0);
    playTone(659.25, 130, 'triangle', 0.06, 90);
    playTone(783.99, 160, 'triangle', 0.065, 180);
    playTone(1046.5, 240, 'sine', 0.06, 280);
  },
  defeat(soundEnabled: boolean, hapticsEnabled = false) {
    triggerHaptic(hapticsEnabled, [30, 50, 30]);
    if (!soundEnabled) return;
    playTone(392, 160, 'sine', 0.05, 0);
    playTone(329.63, 220, 'sine', 0.05, 130);
  },
};
