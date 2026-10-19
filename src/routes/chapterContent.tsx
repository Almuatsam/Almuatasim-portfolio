import type { ComponentType } from 'react';
import { ContentsContext, ContentsWork } from '../components/contents/Contents';
import { AboutContext, AboutWork } from '../components/about/About';
import { ComingSoonContext, ComingSoonWork } from '../components/comingsoon/ComingSoon';
import { ScreensContext, ScreensWork } from '../components/screens/Screens';
import { EstudioAContext, EstudioAWork } from '../components/projects/estudioa/EstudioA';
import { APOSContext, APOSWork } from '../components/projects/apos/APOS';
import { PadelAuraContext, PadelAuraWork } from '../components/projects/padelaura/PadelAura';
import { PapitooooContext, PapitooooWork } from '../components/projects/papitoooo/Papitoooo';
import { ByHandContext, ByHandWork } from '../components/byhand/ByHand';
import { ArtContext, ArtWork } from '../components/art/Artworks';
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
  screens: ScreensContext,
  estudioa: EstudioAContext,
  apos: APOSContext,
  padelaura: PadelAuraContext,
  papitoooo: PapitooooContext,
  byhand: ByHandContext,
  art: ArtContext,
};

export const WORK_COMPONENTS: Partial<Record<ChapterId, PanelComponent>> = {
  contents: ContentsWork,
  about: AboutWork,
  screens: ScreensWork,
  estudioa: EstudioAWork,
  apos: APOSWork,
  padelaura: PadelAuraWork,
  papitoooo: PapitooooWork,
  byhand: ByHandWork,
  art: ArtWork,
};

export function contextComponentFor(id: ChapterId): PanelComponent {
  return CONTEXT_COMPONENTS[id] ?? ComingSoonContext;
}

export function workComponentFor(id: ChapterId): PanelComponent {
  return WORK_COMPONENTS[id] ?? ComingSoonWork;
}
