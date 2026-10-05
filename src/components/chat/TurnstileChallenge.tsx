import { useEffect, useRef, useState } from 'react';
interface Turnstile {
  render(element: HTMLElement, options: { sitekey: string; action: string; size: string; callback(token: string): void; 'expired-callback'(): void; 'error-callback'(): void }): string;
  remove(id: string): void;
}
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<void> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!loading) loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const timer = window.setTimeout(() => fail(), 15000);
    const fail = () => { clearTimeout(timer); script.remove(); loading = undefined; reject(new Error('Verification could not load.')); };
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true;
    script.onload = () => { clearTimeout(timer); resolve(); }; script.onerror = fail; document.head.append(script);
  });
  return loading;
}
export function TurnstileChallenge({ siteKey, revision, onToken }: { siteKey: string; revision: number; onToken: (token: string) => void }) {
  const element = useRef<HTMLDivElement>(null);
  const callbacks = useRef(onToken); callbacks.current = onToken;
  const [failed, setFailed] = useState(false); const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false; let id: string | undefined;
    setFailed(false); callbacks.current('');
    void loadScript().then(() => {
      if (cancelled || !element.current || !window.turnstile) return;
      id = window.turnstile.render(element.current, { sitekey: siteKey, action: 'chat', size: 'flexible', callback: (token) => { if (!cancelled) callbacks.current(token); }, 'expired-callback': () => { if (!cancelled) { callbacks.current(''); setAttempt((v) => v + 1); } }, 'error-callback': () => { if (!cancelled) { callbacks.current(''); setFailed(true); } } });
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; if (id) window.turnstile?.remove(id); };
  }, [siteKey, revision, attempt]);
  return <div><div ref={element} className="min-h-0" />{failed && <button type="button" onClick={() => setAttempt((v) => v + 1)} className="mt-1 text-xs text-brand underline">Reload verification</button>}</div>;
}
