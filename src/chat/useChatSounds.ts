import { useCallback, useEffect, useRef, useState } from 'react';
import type { Message } from './history';

const preferenceKey = 'portfolio-chat-sounds';
export function useChatSounds(messages: Message[]) {
  const [soundsEnabled, setSoundsEnabled] = useState(() => {
    try { return localStorage.getItem(preferenceKey) !== 'off'; } catch { return true; }
  });
  const enabled = useRef(soundsEnabled);
  const context = useRef<AudioContext | null>(null);
  const playing = useRef(new Set<OscillatorNode>());
  const seen = useRef(new Set(messages.filter(m => m.status === 'complete').map(m => m.id)));

  const silence = useCallback(() => {
    for (const node of playing.current) { try { node.stop(); } catch { /* Already finished. */ } }
    playing.current.clear();
  }, []);
  const play = useCallback((kind: 'send' | 'receive') => {
    const audio = context.current;
    if (!enabled.current || document.hidden || !audio || audio.state !== 'running') return;
    try {
      const notes = kind === 'send' ? [660] : [740, 988];
      notes.forEach((frequency, index) => {
        const tone = audio.createOscillator(); const gain = audio.createGain();
        const start = audio.currentTime + index * 0.09;
        tone.type = 'sine';
        tone.frequency.setValueAtTime(frequency, start);
        tone.frequency.exponentialRampToValueAtTime(frequency * (kind === 'send' ? 0.75 : 1.02), start + 0.1);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.035, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
        tone.connect(gain); gain.connect(audio.destination);
        playing.current.add(tone);
        tone.onended = () => { tone.disconnect(); gain.disconnect(); playing.current.delete(tone); };
        tone.start(start); tone.stop(start + 0.16);
      });
    } catch { /* Sound is optional; chat still works without audio. */ }
  }, []);
  const prepare = useCallback((sendSound = false) => {
    if (!enabled.current || document.hidden) return;
    try {
      const audio = context.current ?? (context.current = new AudioContext());
      const ready = () => { if (context.current === audio && sendSound) play('send'); };
      if (audio.state === 'suspended') void audio.resume().then(ready).catch(() => undefined);
      else ready();
    } catch { /* The browser may block or not support audio. */ }
  }, [play]);
  useEffect(() => {
    const arrived = messages.some(m => m.role === 'assistant' && m.status === 'complete' && !seen.current.has(m.id));
    seen.current = new Set(messages.filter(m => m.status === 'complete').map(m => m.id));
    if (arrived) play('receive');
  }, [messages, play]);
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) silence(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      silence();
      const audio = context.current; context.current = null;
      if (audio) void audio.close().catch(() => undefined);
    };
  }, [silence]);
  return {
    soundsEnabled,
    playSend: () => prepare(true),
    prepare,
    toggleSounds: () => {
      enabled.current = !enabled.current; setSoundsEnabled(enabled.current);
      try { localStorage.setItem(preferenceKey, enabled.current ? 'on' : 'off'); } catch { /* Keep this session's preference. */ }
      if (enabled.current) prepare(); else silence();
    },
  };
}
