import type { ComponentType } from 'react';
import { ContentsContext, ContentsWork } from '../components/contents/Contents';
import { AboutContext, AboutWork } from '../components/about/About';
import { ComingSoonContext, ComingSoonWork } from '../components/comingsoon/ComingSoon';
import type { ChapterDef, ChapterId } from '../content/chapters';
import type { SupportedLang } from '../i18n';

export interface ChapterPanelProps {
  lang: SupportedLang;
  chapter: ChapterDef;
}

type PanelComponent = ComponentType<ChapterPanelProps>;

export const CONTEXT_COMPONENTS: Partial<Record<ChapterId, PanelComponent>> = {
  contents: ContentsContext,
  about: AboutContext,
};

export const WORK_COMPONENTS: Partial<Record<ChapterId, PanelComponent>> = {
  contents: ContentsWork,
  about: AboutWork,
};

export function contextComponentFor(id: ChapterId): PanelComponent {
  return CONTEXT_COMPONENTS[id] ?? ComingSoonContext;
}

export function workComponentFor(id: ChapterId): PanelComponent {
  return WORK_COMPONENTS[id] ?? ComingSoonWork;
}
