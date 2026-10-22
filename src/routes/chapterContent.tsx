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
import { PaintingContext, PaintingWork } from '../components/art/PaintingSpread';
import { SewingContext, SewingWork } from '../components/sewing/Sewing';
import { SketchesContext, SketchesWork } from '../components/sewing/SketchesSpread';
import { FashionWeekContext, FashionWeekWork } from '../components/sewing/FashionWeekSpread';
import { TieContext, TieWork } from '../components/sewing/TieSpread';
import { RuffleContext, RuffleWork } from '../components/sewing/RuffleSpread';
import { OnSetContext, OnSetWork } from '../components/onset/OnSet';
import { QalbContext, QalbWork } from '../components/onset/QalbMahmood';
import { FollowContext, FollowWork } from '../components/onset/FollowThePiece';
import { ShowMadeContext, ShowMadeWork } from '../components/onset/ShowWhatIMade';
import { PressContext, PressWork } from '../components/onset/Press';
import { AmouageContext, AmouageWork } from '../components/onset/Amouage';
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
};

export function contextComponentFor(id: ChapterId): PanelComponent {
  return CONTEXT_COMPONENTS[id] ?? ComingSoonContext;
}

export function workComponentFor(id: ChapterId): PanelComponent {
  return WORK_COMPONENTS[id] ?? ComingSoonWork;
}
