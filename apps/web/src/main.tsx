import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Tipografías autoalojadas: sin peticiones a Google Fonts, funciona sin conexión.
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';

// El orden importa: primero los tokens, luego lo global que los consume.
import '@real-elegance/shared/tokens.css';
import './styles/global.css';

import { App } from './app/App';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el nodo #root.');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
