import './facts-list.css';

interface FactsListProps {
  facts: string[];
}

/** A short list of plain facts on the context page (PadelAura: 4 days,
 * 2nd place, no-signup booking, smart allocation, Thawani, EN/AR). */
export function FactsList({ facts }: FactsListProps) {
  return (
    <ul className="facts-list reveal-fade">
      {facts.map((fact) => (
        <li key={fact} className="facts-list__item">
          {fact}
        </li>
      ))}
    </ul>
  );
}
