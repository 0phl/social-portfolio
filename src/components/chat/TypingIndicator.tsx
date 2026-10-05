import { useEffect, useState } from 'react';
import './typing.css';

export function TypingIndicator() {
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return <span role="img" aria-label="Ronan's assistant is typing" className="inline-flex h-6 items-center gap-1.5 px-1">
    {[0, 1, 2].map(index => <span key={index} aria-hidden="true" className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" style={{ animationDelay: `${index * 140}ms`, animationPlayState: hidden ? 'paused' : 'running' }} />)}
  </span>;
}
