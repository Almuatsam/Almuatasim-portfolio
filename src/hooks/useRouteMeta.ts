import { useEffect } from 'react';
import type { TFunction } from 'i18next';
import { SHARE_IMAGE_PATH, SITE_URL } from '../config/site';
import type { SupportedLang } from '../i18n';

interface RouteMeta {
  lang: SupportedLang;
  /** The route's own name, in the current language. */
  chapterTitle: string;
  /** The path without the language, e.g. "contact" or "" for the cover. */
  slug: string;
  isCover: boolean;
  t: TFunction;
}

function setHead(selector: string, create: () => HTMLElement, attribute: string, value: string): void {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

const metaByName = (name: string, content: string): void =>
  setHead(`meta[name="${name}"]`, () => Object.assign(document.createElement('meta'), { name }), 'content', content);

const metaByProperty = (property: string, content: string): void =>
  setHead(`meta[property="${property}"]`, () => {
    const element = document.createElement('meta');
    element.setAttribute('property', property);
    return element;
  }, 'content', content);

function linkRel(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  setHead(selector, () => {
    const element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    return element;
  }, 'href', href);
}

/** Per-route head tags, in the current language: title, description,
 * canonical, hreflang alternates, Open Graph and Twitter card. */
export function useRouteMeta({ lang, chapterTitle, slug, isCover, t }: RouteMeta): void {
  useEffect(() => {
    const title = isCover ? t('meta.siteTitle') : t('meta.routeTitle', { chapter: chapterTitle });
    const description = isCover ? t('meta.description') : t('meta.routeDescription', { chapter: chapterTitle });
    const pathFor = (language: SupportedLang) => (slug ? `/${language}/${slug}` : `/${language}`);
    const url = `${SITE_URL}${pathFor(lang)}`;
    const image = `${SITE_URL}${SHARE_IMAGE_PATH}`;
    const otherLang: SupportedLang = lang === 'en' ? 'ar' : 'en';

    document.title = title;
    metaByName('description', description);
    linkRel('canonical', url);
    linkRel('alternate', `${SITE_URL}${pathFor('en')}`, 'en');
    linkRel('alternate', `${SITE_URL}${pathFor('ar')}`, 'ar');
    linkRel('alternate', `${SITE_URL}${pathFor('en')}`, 'x-default');
    metaByProperty('og:type', 'website');
    metaByProperty('og:site_name', t('meta.siteTitle'));
    metaByProperty('og:title', title);
    metaByProperty('og:description', description);
    metaByProperty('og:url', url);
    metaByProperty('og:image', image);
    metaByProperty('og:image:width', '1200');
    metaByProperty('og:image:height', '630');
    metaByProperty('og:locale', lang === 'ar' ? 'ar_AR' : 'en_US');
    metaByProperty('og:locale:alternate', otherLang === 'ar' ? 'ar_AR' : 'en_US');
    metaByName('twitter:card', 'summary_large_image');
    metaByName('twitter:title', title);
    metaByName('twitter:description', description);
    metaByName('twitter:image', image);
  }, [lang, chapterTitle, slug, isCover, t]);
}
