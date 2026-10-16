import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stage } from '../components/layout/Stage';
import { UtilityBar } from '../components/book/UtilityBar';
import { useDocumentLanguage } from '../i18n/useDocumentLanguage';
import { isSupportedLang } from '../i18n';
import { detectInitialLanguage } from '../i18n/detectLanguage';

export function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>();

  if (!isSupportedLang(lang)) {
    const fallback = detectInitialLanguage();
    return <Navigate to={`/${fallback}`} replace />;
  }

  return <LanguageLayoutContent lang={lang} />;
}

function LanguageLayoutContent({ lang }: { lang: 'en' | 'ar' }) {
  useDocumentLanguage(lang);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('meta.siteTitle');
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('meta.description'));
  }, [lang, t]);

  return (
    <Stage>
      <UtilityBar />
      <Outlet />
    </Stage>
  );
}
