import { useEffect, useRef, useState } from 'react';
interface Turnstile {
  render(element: HTMLElement, options: {
    sitekey: string; action: string; size: string; appearance: 'interaction-only';
    callback(token: string): void;
    'expired-callback'(): void;
    'error-callback'(): void;
    'timeout-callback'(): void;
    'before-interactive-callback'(): void;
  }): string;
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
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    let cancelled = false; let id: string | undefined;
    const clearVerification = () => { setVerified(false); callbacks.current(''); };
    const fail = () => {
      if (cancelled) return;
      clearVerification(); setFailed(true);
    };
    setFailed(false); clearVerification();
    void loadScript().then(() => {
      if (cancelled || !element.current || !window.turnstile) return;
      id = window.turnstile.render(element.current, {
        sitekey: siteKey, action: 'chat', size: 'flexible', appearance: 'interaction-only',
        callback: (token) => {
          if (cancelled) return;
          setFailed(false); setVerified(Boolean(token)); callbacks.current(token);
        },
        'before-interactive-callback': () => {
          if (cancelled) return;
          setFailed(false); clearVerification();
        },
        'expired-callback': () => {
          if (cancelled) return;
          clearVerification(); setAttempt((v) => v + 1);
        },
        'error-callback': fail,
        'timeout-callback': fail,
      });
    }).catch(fail);
    return () => { cancelled = true; if (id) window.turnstile?.remove(id); };
  }, [siteKey, revision, attempt]);
  // Keep the widget mounted so token expiry and renewed challenges still work.
  return <div hidden={verified}><div ref={element} className="min-h-0" />{failed && <button type="button" onClick={() => setAttempt((v) => v + 1)} className="mt-1 text-xs text-brand underline">Reload verification</button>}</div>;
}
