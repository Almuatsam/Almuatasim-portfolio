import type { TFunction } from 'i18next';
import './stack-list.css';

interface StackListProps {
  t: TFunction;
  stack: string[];
}

export function StackList({ t, stack }: StackListProps) {
  if (stack.length === 0) return null;

  return (
    <div className="stack-list reveal-fade">
      <span className="stack-list__label">{t('projectLabels.stack')}</span>
      <ul className="stack-list__items">
        {stack.map((item) => (
          <li key={item} className="stack-list__item font-mono ltr-fragment">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
