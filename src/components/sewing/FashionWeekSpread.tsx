import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { useScreenViewer } from '../../hooks/useScreenViewer';
import { chapterPath } from '../../content/chapters';
import { OUTFIT_IMAGES } from '../../content/sewing';
import { Marked } from '../motion/Marked';
import { FullscreenViewer } from '../projects/FullscreenViewer';
import type { ProjectImage } from '../../content/projects';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';
import './fashion-week.css';

const OUTFIT_VIEWER_IMAGES: ProjectImage[] = [
  { key: 'outfit', src: OUTFIT_IMAGES.full.src },
  { key: 'atShow', src: OUTFIT_IMAGES.atShow.src },
];

/** B4 Sewing #2, the Muscat Fashion Week outfit (context page): title,
 * month label, the owner's story kept in their words and only
 * line-broken (the highlighter bar on "three days"), and what they made.
 * The tie is "hand-set with silver stars and rhinestones", never
 * "made from scratch". The outfit did not come from either fashion
 * sketch, so nothing here links to them. */
export function FashionWeekContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const story = t('sewing.fashionWeek.story', { returnObjects: true }) as string[];
  const made = t('sewing.fashionWeek.made', { returnObjects: true }) as string[];

  return (
    <div className="fashion-week__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.fashionweek.title')}</h1>
      <p className="fashion-week__label reveal-fade">{t('sewing.fashionWeek.label')}</p>
      <div className="fashion-week__story">
        {story.map((line) => (
          <p key={line} className="fashion-week__line reveal-fade">
            <Marked text={line} />
          </p>
        ))}
      </div>
      <h2 className="fashion-week__made-heading reveal-fade">{t('sewing.fashionWeek.madeHeading')}</h2>
      <ul className="fashion-week__made">
        {made.map((item) => (
          <li key={item} className="fashion-week__made-item reveal-fade">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The two photos side by side, each 520px tall at the 1160px book (the
 * height scales with the book, so both always fit the page width), flat,
 * with a label-style caption under each. Both open the full-screen
 * viewer. */
export function FashionWeekWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(OUTFIT_VIEWER_IMAGES.length);
  const photos = [
    { key: 'outfit' as const, image: OUTFIT_IMAGES.full },
    { key: 'atShow' as const, image: OUTFIT_IMAGES.atShow },
  ];

  return (
    <div className="fashion-week__work">
      <div className="fashion-week__photos">
        {photos.map(({ key, image }, index) => (
          <figure key={key} className="fashion-week__figure reveal-fade">
            <button type="button" className="fashion-week__button" onClick={() => viewer.open(index)}>
              <img loading="lazy" decoding="async"
                src={image.src}
                alt={t(`sewing.fashionWeek.${key}.alt`)}
                width={image.width}
                height={image.height}
                className="fashion-week__img"
              />
            </button>
            <figcaption className="sewing__photo-label">{t(`sewing.fashionWeek.${key}.caption`)}</figcaption>
          </figure>
        ))}
      </div>
      <FullscreenViewer
        images={OUTFIT_VIEWER_IMAGES}
        altFor={(key) => t(`sewing.fashionWeek.${key === 'outfit' ? 'outfit' : 'atShow'}.alt`)}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.fashionweek.title')}
      />
    </div>
  );
}
