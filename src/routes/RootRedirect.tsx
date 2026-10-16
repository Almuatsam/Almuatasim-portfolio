import { Navigate } from 'react-router-dom';
import { detectInitialLanguage } from '../i18n/detectLanguage';

export function RootRedirect() {
  return <Navigate to={`/${detectInitialLanguage()}`} replace />;
}
