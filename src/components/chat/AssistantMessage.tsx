import Markdown from 'react-markdown';
import catalog from '../../../.generated/assistant-links.json';

function approvedLink(href: string) {
  if (href.startsWith('//')) return null;
  let key = href;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin && url.pathname === '/' && !url.search) key = `/${url.hash}`;
  } catch { return null; }
  return Object.prototype.hasOwnProperty.call(catalog, key) ? key : null;
}
export function AssistantMessage({ text, onNavigate }: { text: string; onNavigate: (url: string) => void }) {
  return <div className="assistant-markdown">
    <Markdown skipHtml allowedElements={['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'br']} unwrapDisallowed components={{
      a: ({ href, children }) => {
        const url = href && approvedLink(href);
        if (!url) return <span>{children}</span>;
        return url.startsWith('/#') ? <a href={url} className="text-brand underline underline-offset-2" onClick={(event) => { event.preventDefault(); onNavigate(url); }}>{children}</a> : <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">{children}</a>;
      },
    }}>{text}</Markdown>
  </div>;
}
