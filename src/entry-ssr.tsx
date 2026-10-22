import { renderToString } from 'react-dom/server';
import { Route, Routes, StaticRouter } from 'react-router-dom';
import i18next, { type SupportedLang } from './i18n';
import { LanguageLayout } from './routes/LanguageLayout';
import { PlainVersion } from './components/plain/PlainVersion';

/** Server render of the Plain Version, used only by scripts/prerender.mjs so
 * that /en/plain and /ar/plain ship real HTML (for search engines and link
 * previews). The book itself stays client-rendered. */
export async function renderPlain(lang: SupportedLang): Promise<{ html: string; title: string; description: string }> {
  await i18next.changeLanguage(lang);
  const t = i18next.getFixedT(lang);
  const html = renderToString(
    <StaticRouter location={`/${lang}/plain`}>
      <Routes>
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route path="plain" element={<PlainVersion />} />
        </Route>
      </Routes>
    </StaticRouter>,
  );
  return {
    html,
    title: t('meta.routeTitle', { chapter: t('plain.title') }),
    description: t('meta.routeDescription', { chapter: t('plain.title') }),
  };
}
