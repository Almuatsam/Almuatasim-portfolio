import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Trans } from "react-i18next";
import { useFixedT } from "../../hooks/useFixedT";
import type { ChapterPanelProps } from "../../routes/chapterContent";
import "./contact.css";
import { Picture } from '../ui/Picture';

const COPIED_NOTE_MS = 2600;

/** Copies with the Clipboard API, falling back to a hidden textarea on
 * insecure origins or older browsers. Resolves to whether it worked. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const isCopied = document.execCommand("copy");
    field.remove();
    return isCopied;
  }
}

function useCopiedNote() {
  const [isShown, setIsShown] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  function show(): void {
    setIsShown(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setIsShown(false),
      COPIED_NOTE_MS,
    );
  }

  return { isShown, show };
}

/** Phase 3 Kickoff.md section 7, the left page: one closing line in the
 * display face, then email, LinkedIn and GitHub as large links. */
export function ContactContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const email = t("contact.email");
  const copied = useCopiedNote();

  async function handleCopy(): Promise<void> {
    if (await copyText(email)) copied.show();
  }

  return (
    <div className="contact__context">
      <h1 className="contact__heading font-mono reveal-fade">
        {t("chapters.contact.title")}
      </h1>
      <p className="contact__closing font-display reveal-fade-slow">
        {t("contact.closingLine")}
      </p>

      <ul className="contact__links">
        <li className="contact__row reveal-fade">
          <a className="contact__link" href={`mailto:${email}`}>
            <bdi className="ltr-fragment">{email}</bdi>
          </a>
          <div className="contact__copy">
            <button
              type="button"
              className="contact__copy-button"
              onClick={handleCopy}
            >
              {t("contact.copyLabel")}
            </button>
            <p
              className={`contact__note font-hand${copied.isShown ? " contact__note--shown" : ""}`}
              role="status"
            >
              {copied.isShown ? t("contact.copiedNote") : ""}
            </p>
          </div>
        </li>
        <li className="contact__row reveal-fade">
          <a
            className="contact__link"
            href={t("contact.linkedin")}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li className="contact__row reveal-fade">
          <a
            className="contact__link"
            href={t("contact.github")}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}

/** The right page: an envelope with a loose thread, the signature, and
 * the colophon at the foot of the page. */
export function ContactWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="contact__work">
      <div className="contact__envelope-frame">
        <div className="contact__envelope-art">
          <svg
            viewBox="0 0 240 150"
            className="contact__envelope"
            aria-hidden="true"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="14"
              y="22"
              width="170"
              height="108"
              rx="3"
              fill="var(--color-paper)"
              className="reveal-fade"
            />
            <path
              d="M14 26 99 86 184 26"
              className="reveal-sketch"
              style={{ "--draw-length": 220 } as CSSProperties}
            />
            <path
              d="M14 128 74 70M184 128 124 70"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d="M184 96c14 2 22 14 14 24s-24 4-20 24 24 20 40 6"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="5 5"
              className="reveal-fade"
            />
          </svg>
          <Picture loading="lazy" decoding="async"
            src="/stickers/sticker-1.png"
            alt={(t("cover.stickers", { returnObjects: true }) as string[])[0]}
            className="contact__stamp" sizes="60px"
          />
        </div>
        <p className="contact__signature font-hand">
          {t(lang === "ar" ? "cover.nameArabic" : "cover.nameLatin")}
        </p>
      </div>

      <footer className="contact__colophon">
        <p>
          {/* Soria's CC BY-ND 4.0 licence asks for attribution to the
              designer and the licence itself, so both are real links. */}
          <Trans
            i18nKey="plain.colophon"
            t={t}
            components={{
              designer: (
                <a
                  href="https://www.behance.net/danibydani"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              license: (
                <a
                  href="https://creativecommons.org/licenses/by-nd/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </p>
        <p>{t("contact.colophon.stack")}</p>
        <p>
          {t("contact.colophon.photos", { names: t("onset.credits.both") })}
        </p>
      </footer>
    </div>
  );
}
