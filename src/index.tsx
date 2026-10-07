import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { installNavigation } from './routing/navigation';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

installNavigation();
const app = (
  <StrictMode>
    <App path={root.dataset.route ?? location.pathname} />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
