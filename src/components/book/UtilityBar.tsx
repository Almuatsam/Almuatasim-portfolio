import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { chapterPath } from '../../content/chapters';
import './utility-bar.css';

export function UtilityBar() {
  const { t } = useTranslation();
  const { lang, chapter } = useCurrentChapter();

  const otherLang = lang === 'en' ? 'ar' : 'en';
  const otherLangPath = chapterPath(otherLang, chapter.id);
  const plainPath = `/${lang}/plain`;

  return (
    <div className="utility-bar">
      <Link
        to={otherLangPath}
        className="utility-bar__button utility-bar__button--lang"
        aria-label={t('common.languageToggle.ariaLabel')}
        lang={otherLang}
      >
        {t(`common.languageToggle.label`, { lng: otherLang })}
      </Link>
      <Link
        to={plainPath}
        className="utility-bar__button utility-bar__button--plain"
        aria-label={t('common.plainVersion.ariaLabel')}
      >
        {t('common.plainVersion.label')}
      </Link>
    </div>
  );
}
