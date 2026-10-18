import { useState } from 'react';
import type { ProjectImage } from '../../content/projects';
import './bilingual-crossfade.css';

interface BilingualCrossfadeProps {
  enImage: ProjectImage;
  arImage: ProjectImage;
  altEn: string;
  altAr: string;
  onOpen: (key: 'en' | 'ar') => void;
}

/** Reset section 5 — the real bilingual product: the EN | ع switch
 * cross-fades between the two real screenshots (300ms), so visitors see
 * the true RTL layout. No 3D flip, no mirrored duplicate. */
export function BilingualCrossfade({ enImage, arImage, altEn, altAr, onOpen }: BilingualCrossfadeProps) {
  const [showAr, setShowAr] = useState(false);

  return (
    <div className="bilingual-crossfade">
      <button
        type="button"
        className="bilingual-crossfade__toggle"
        onClick={() => setShowAr((value) => !value)}
        aria-pressed={showAr}
      >
        <span className={showAr ? '' : 'bilingual-crossfade__active'}>EN</span>
        <span className="bilingual-crossfade__divider">|</span>
        <span className={showAr ? 'bilingual-crossfade__active' : ''}>ع</span>
      </button>

      <button type="button" className="bilingual-crossfade__stage" onClick={() => onOpen(showAr ? 'ar' : 'en')}>
        <img src={enImage.src} srcSet={enImage.srcSet} alt={altEn} className="bilingual-crossfade__img" style={{ opacity: showAr ? 0 : 1 }} />
        <img src={arImage.src} srcSet={arImage.srcSet} alt={altAr} className="bilingual-crossfade__img" style={{ opacity: showAr ? 1 : 0 }} />
      </button>
    </div>
  );
}
