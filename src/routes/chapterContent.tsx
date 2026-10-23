import { lazy, type ComponentType } from 'react';
import { ContentsContext, ContentsWork } from '../components/contents/Contents';
import { AboutContext, AboutWork } from '../components/about/About';
import type { ChapterDef, ChapterId } from '../content/chapters';
import type { SupportedLang } from '../i18n';

export interface ChapterPanelProps {
  lang: SupportedLang;
  chapter: ChapterDef;
}


type PanelComponent = ComponentType<ChapterPanelProps>;

/** Chapters load as their own chunks, the first time the reader is near
 * them, so the first paint does not carry every chapter's code. */
const LOADERS = new Map<PanelComponent, () => Promise<unknown>>();

function lazyPanel(load: () => Promise<{ default: PanelComponent }>): PanelComponent {
  const component = lazy(load);
  LOADERS.set(component, load);
  return component;
}

/** Starts downloading a chapter's code without rendering it. */
export function preloadChapter(id: ChapterId): void {
  if (id === 'cover') return;
  for (const component of [CONTEXT_COMPONENTS[id], WORK_COMPONENTS[id]]) {
    void LOADERS.get(component)?.();
  }
}

const ScreensContext = lazyPanel(() => import('../components/screens/Screens').then((m) => ({ default: m.ScreensContext })));
const ScreensWork = lazyPanel(() => import('../components/screens/Screens').then((m) => ({ default: m.ScreensWork })));
const EstudioAContext = lazyPanel(() => import('../components/projects/estudioa/EstudioA').then((m) => ({ default: m.EstudioAContext })));
const EstudioAWork = lazyPanel(() => import('../components/projects/estudioa/EstudioA').then((m) => ({ default: m.EstudioAWork })));
const APOSContext = lazyPanel(() => import('../components/projects/apos/APOS').then((m) => ({ default: m.APOSContext })));
const APOSWork = lazyPanel(() => import('../components/projects/apos/APOS').then((m) => ({ default: m.APOSWork })));
const PadelAuraContext = lazyPanel(() => import('../components/projects/padelaura/PadelAura').then((m) => ({ default: m.PadelAuraContext })));
const PadelAuraWork = lazyPanel(() => import('../components/projects/padelaura/PadelAura').then((m) => ({ default: m.PadelAuraWork })));
const PapitooooContext = lazyPanel(() => import('../components/projects/papitoooo/Papitoooo').then((m) => ({ default: m.PapitooooContext })));
const PapitooooWork = lazyPanel(() => import('../components/projects/papitoooo/Papitoooo').then((m) => ({ default: m.PapitooooWork })));
const ByHandContext = lazyPanel(() => import('../components/byhand/ByHand').then((m) => ({ default: m.ByHandContext })));
const ByHandWork = lazyPanel(() => import('../components/byhand/ByHand').then((m) => ({ default: m.ByHandWork })));
const ArtContext = lazyPanel(() => import('../components/art/Artworks').then((m) => ({ default: m.ArtContext })));
const ArtWork = lazyPanel(() => import('../components/art/Artworks').then((m) => ({ default: m.ArtWork })));
const PaintingContext = lazyPanel(() => import('../components/art/PaintingSpread').then((m) => ({ default: m.PaintingContext })));
const PaintingWork = lazyPanel(() => import('../components/art/PaintingSpread').then((m) => ({ default: m.PaintingWork })));
const SewingContext = lazyPanel(() => import('../components/sewing/Sewing').then((m) => ({ default: m.SewingContext })));
const SewingWork = lazyPanel(() => import('../components/sewing/Sewing').then((m) => ({ default: m.SewingWork })));
const SketchesContext = lazyPanel(() => import('../components/sewing/SketchesSpread').then((m) => ({ default: m.SketchesContext })));
const SketchesWork = lazyPanel(() => import('../components/sewing/SketchesSpread').then((m) => ({ default: m.SketchesWork })));
const FashionWeekContext = lazyPanel(() => import('../components/sewing/FashionWeekSpread').then((m) => ({ default: m.FashionWeekContext })));
const FashionWeekWork = lazyPanel(() => import('../components/sewing/FashionWeekSpread').then((m) => ({ default: m.FashionWeekWork })));
const TieContext = lazyPanel(() => import('../components/sewing/TieSpread').then((m) => ({ default: m.TieContext })));
const TieWork = lazyPanel(() => import('../components/sewing/TieSpread').then((m) => ({ default: m.TieWork })));
const RuffleContext = lazyPanel(() => import('../components/sewing/RuffleSpread').then((m) => ({ default: m.RuffleContext })));
const RuffleWork = lazyPanel(() => import('../components/sewing/RuffleSpread').then((m) => ({ default: m.RuffleWork })));
const OnSetContext = lazyPanel(() => import('../components/onset/OnSet').then((m) => ({ default: m.OnSetContext })));
const OnSetWork = lazyPanel(() => import('../components/onset/OnSet').then((m) => ({ default: m.OnSetWork })));
const QalbContext = lazyPanel(() => import('../components/onset/QalbMahmood').then((m) => ({ default: m.QalbContext })));
const QalbWork = lazyPanel(() => import('../components/onset/QalbMahmood').then((m) => ({ default: m.QalbWork })));
const FollowContext = lazyPanel(() => import('../components/onset/FollowThePiece').then((m) => ({ default: m.FollowContext })));
const FollowWork = lazyPanel(() => import('../components/onset/FollowThePiece').then((m) => ({ default: m.FollowWork })));
const ShowMadeContext = lazyPanel(() => import('../components/onset/ShowWhatIMade').then((m) => ({ default: m.ShowMadeContext })));
const ShowMadeWork = lazyPanel(() => import('../components/onset/ShowWhatIMade').then((m) => ({ default: m.ShowMadeWork })));
const PressContext = lazyPanel(() => import('../components/onset/Press').then((m) => ({ default: m.PressContext })));
const PressWork = lazyPanel(() => import('../components/onset/Press').then((m) => ({ default: m.PressWork })));
const AmouageContext = lazyPanel(() => import('../components/onset/Amouage').then((m) => ({ default: m.AmouageContext })));
const AmouageWork = lazyPanel(() => import('../components/onset/Amouage').then((m) => ({ default: m.AmouageWork })));
const FollowOnePage = lazyPanel(() => import('../components/onset/FollowThePiece').then((m) => ({ default: m.FollowOnePage })));
const ShowMadeOnePage = lazyPanel(() => import('../components/onset/ShowWhatIMade').then((m) => ({ default: m.ShowMadeOnePage })));
const ProcessOnePage = lazyPanel(() => import('../components/process/Process').then((m) => ({ default: m.ProcessOnePage })));
const ProcessContext = lazyPanel(() => import('../components/process/Process').then((m) => ({ default: m.ProcessContext })));
const ProcessWork = lazyPanel(() => import('../components/process/Process').then((m) => ({ default: m.ProcessWork })));
const SkillsContext = lazyPanel(() => import('../components/skills/Skills').then((m) => ({ default: m.SkillsContext })));
const SkillsWork = lazyPanel(() => import('../components/skills/Skills').then((m) => ({ default: m.SkillsWork })));
const ContactContext = lazyPanel(() => import('../components/contact/Contact').then((m) => ({ default: m.ContactContext })));
const ContactWork = lazyPanel(() => import('../components/contact/Contact').then((m) => ({ default: m.ContactWork })));

export const CONTEXT_COMPONENTS: Record<Exclude<ChapterId, 'cover'>, PanelComponent> = {
  contents: ContentsContext,
  about: AboutContext,
  screens: ScreensContext,
  estudioa: EstudioAContext,
  apos: APOSContext,
  padelaura: PadelAuraContext,
  papitoooo: PapitooooContext,
  byhand: ByHandContext,
  art: ArtContext,
  painfulexperience: PaintingContext,
  choice: PaintingContext,
  guidance: PaintingContext,
  sewing: SewingContext,
  sketches: SketchesContext,
  fashionweek: FashionWeekContext,
  tie: TieContext,
  ruffle: RuffleContext,
  onset: OnSetContext,
  qalb: QalbContext,
  follow: FollowContext,
  showmade: ShowMadeContext,
  press: PressContext,
  amouage: AmouageContext,
  process: ProcessContext,
  skills: SkillsContext,
  contact: ContactContext,
};

export const WORK_COMPONENTS: Record<Exclude<ChapterId, 'cover'>, PanelComponent> = {
  contents: ContentsWork,
  about: AboutWork,
  screens: ScreensWork,
  estudioa: EstudioAWork,
  apos: APOSWork,
  padelaura: PadelAuraWork,
  papitoooo: PapitooooWork,
  byhand: ByHandWork,
  art: ArtWork,
  painfulexperience: PaintingWork,
  choice: PaintingWork,
  guidance: PaintingWork,
  sewing: SewingWork,
  sketches: SketchesWork,
  fashionweek: FashionWeekWork,
  tie: TieWork,
  ruffle: RuffleWork,
  onset: OnSetWork,
  qalb: QalbWork,
  follow: FollowWork,
  showmade: ShowMadeWork,
  press: PressWork,
  amouage: AmouageWork,
  process: ProcessWork,
  skills: SkillsWork,
  contact: ContactWork,
};

export function contextComponentFor(id: ChapterId): PanelComponent {
  return CONTEXT_COMPONENTS[id as Exclude<ChapterId, 'cover'>];
}

export function workComponentFor(id: ChapterId): PanelComponent {
  return WORK_COMPONENTS[id as Exclude<ChapterId, 'cover'>];
}

/** The phone layout of a chapter whose control and result sit on facing
 * pages on desktop: both on one page (see ONE_PAGE_ON_PHONES). */
const ONE_PAGE_COMPONENTS: Partial<Record<ChapterId, PanelComponent>> = {
  follow: FollowOnePage,
  showmade: ShowMadeOnePage,
  process: ProcessOnePage,
};

export function onePageComponentFor(id: ChapterId): PanelComponent {
  return ONE_PAGE_COMPONENTS[id] ?? CONTEXT_COMPONENTS[id as Exclude<ChapterId, 'cover'>];
}
