import { renderToString } from 'react-dom/server';
import { App } from '../App';
export { pages, notFoundPage, renderHead, renderSitemap } from './catalog';
export function renderPage(path: string) { return renderToString(<App path={path} />); }
