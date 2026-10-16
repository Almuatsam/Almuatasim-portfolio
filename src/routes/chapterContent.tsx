import type { ComponentType } from 'react';
import { ContentsContext, ContentsWork } from '../components/contents/Contents';
import { AboutContext, AboutWork } from '../components/about/About';
import { ComingSoonContext, ComingSoonWork } from '../components/comingsoon/ComingSoon';
import type { ChapterId } from '../content/chapters';

export const CONTEXT_COMPONENTS: Partial<Record<ChapterId, ComponentType>> = {
  contents: ContentsContext,
  about: AboutContext,
};

export const WORK_COMPONENTS: Partial<Record<ChapterId, ComponentType>> = {
  contents: ContentsWork,
  about: AboutWork,
};

export function contextComponentFor(id: ChapterId): ComponentType {
  return CONTEXT_COMPONENTS[id] ?? ComingSoonContext;
}

export function workComponentFor(id: ChapterId): ComponentType {
  return WORK_COMPONENTS[id] ?? ComingSoonWork;
}
