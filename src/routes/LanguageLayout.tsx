import type { MouseEvent } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useFixedT } from '../hooks/useFixedT';
import { useRouteMeta } from '../hooks/useRouteMeta';
import { getChapter, getChapterBySlug } from '../content/chapters';
import { Stage } from '../components/layout/Stage';
import { UtilityBar } from '../components/book/UtilityBar';
import { RotateHint } from '../components/book/RotateHint';
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
  const t = useFixedT(lang);
  const { pathname } = useLocation();
  const [, , rawSlug = ''] = pathname.split('/');
  const isPlain = rawSlug === 'plain';
  const chapter = isPlain ? undefined : (getChapterBySlug(rawSlug) ?? (rawSlug ? getChapter('contents') : getChapter('cover')));

  useRouteMeta({
    lang,
    chapterTitle: isPlain ? t('plain.title') : t(`chapters.${chapter?.id}.title`),
    slug: isPlain ? 'plain' : (chapter?.slug ?? ''),
    isCover: chapter?.id === 'cover',
    t,
  });

  // Skip link: moves focus to the page the reader is on (its scroll region),
  // past the language toggle, the tab bar and the page arrows.
  function skipToContent(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    const regions = document.querySelectorAll<HTMLElement>('.flip-page [role="region"][aria-label], .plain');
    const visible = [...regions].find((region) => region.getBoundingClientRect().width > 0);
    (visible ?? document.getElementById('main'))?.focus();
  }

  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToContent}>
        {t('common.skipToContent')}
      </a>
      <Stage>
        <UtilityBar />
        <RotateHint />
        <Outlet />
      </Stage>
    </>
  );
}
