import { useState, type KeyboardEvent } from 'react';
import type { TFunction } from 'i18next';
import { fuzzySearch } from '../../lib/fuzzyMatch';
import './fuzzy-search-demo.css';

interface FuzzySearchDemoProps {
  t: TFunction;
  defaultQuery: string;
}

/** B5 #1 mini demo — a handwritten-style search field pre-filled with a
 * typo query. On Enter, a tiny client-side fuzzy match runs over ~10
 * hard-coded sample patterns, no backend. */
export function FuzzySearchDemo({ t, defaultQuery }: FuzzySearchDemoProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<string[] | null>(null);

  function runSearch() {
    setResults(fuzzySearch(query));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') runSearch();
  }

  return (
    <div className="fuzzy-demo">
      <label className="fuzzy-demo__label font-hand" htmlFor="estudioa-demo-search">
        {t('projects.estudioa.demo.label')}
      </label>
      <input
        id="estudioa-demo-search"
        type="text"
        className="fuzzy-demo__input font-hand ltr-fragment"
        dir="ltr"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" className="fuzzy-demo__submit" onClick={runSearch}>
        {t('projects.estudioa.demo.hint')}
      </button>

      {results && (
        <ul className="fuzzy-demo__results reveal-fade">
          {results.length === 0 && <li className="fuzzy-demo__empty">—</li>}
          {results.map((item) => (
            <li key={item} className="fuzzy-demo__result ltr-fragment" dir="ltr">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
