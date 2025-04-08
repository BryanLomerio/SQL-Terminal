import React from 'react';
import { Button } from '../components/ui/button';

const ProblemCard = ({ problem }) => {
  const { title, description, hint, solution } = problem;

  return (
    <div className="schema-table problem-card">
      <h3 className="problem-title">{title}</h3>
      <div className="problem-content">
        <p className="problem-description">{description}</p>

        <details className="problem-details">
          <summary className="problem-summary">Show Hint</summary>
          <p className="problem-hint">{hint}</p>
        </details>

        <details className="problem-details">
          <summary className="problem-summary">Show Solution</summary>
          <pre className="problem-solution">{solution}</pre>
          <Button
            variant="outline"
            size="sm"
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(solution);
            }}
          >
            Copy
          </Button>
        </details>
      </div>
    </div>
  );
};

export default ProblemCard;
