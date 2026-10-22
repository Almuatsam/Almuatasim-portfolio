export type PressId = 'itsNiceThat' | 'sandyTimes' | 'cpMagazine';

export interface PressCard {
  id: PressId;
  /** Names and headlines are kept in English in both languages. */
  publication: string;
  headline: string;
  url: string;
}

/** B4 On Set, "The series in the press". Headlines are quoted verbatim;
 * nothing else from the articles is copied, and the articles do not name
 * the owner, so nothing here says or implies that they do. */
export const PRESS_CARDS: PressCard[] = [
  {
    id: 'itsNiceThat',
    publication: "It's Nice That",
    headline: '"I create to know myself better": Abdulaziz Al-hosni\'s recent series explores the self through colour',
    url: 'https://www.itsnicethat.com/articles/abdulaziz-al-hosni-qalb-mahmood-photography-project-210125',
  },
  {
    id: 'sandyTimes',
    publication: 'The Sandy Times',
    headline: 'Love, Hope, Struggle: Hidden Emotions In the Work Of Abdulaziz Al-Hosni',
    url: 'https://sandytimes.ae/articles/2370/love-hope-struggle-hidden-emotions-in-the-work-of-abdulaziz-al-hosni',
  },
  {
    id: 'cpMagazine',
    publication: 'CP Magazine',
    headline: 'Abdulaziz Al-Hosni: Cultural Threads and Creative Vision',
    url: 'https://cpmagazine.online/abdulaziz-al-hosni/',
  },
];

/** The one pull quote, shown in English on both language pages. */
export const PULL_QUOTE = 'every single prop you see having been designed for purpose';
