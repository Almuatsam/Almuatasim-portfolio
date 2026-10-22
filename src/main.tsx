import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LazyMotion } from 'framer-motion';
import { loadMotionFeatures } from './lib/motionFeatures';
import './i18n';
import './styles/tokens.css';
import './styles/global.css';
import './styles/reveal.css';
import './styles/touch.css';
import App from './App.tsx';
import { warmFirstView } from './lib/warmFirstView';

warmFirstView();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={loadMotionFeatures}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LazyMotion>
  </StrictMode>,
);
