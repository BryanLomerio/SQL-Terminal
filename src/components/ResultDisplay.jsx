import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ResultsDisplay = ({ results, tableTitle }) => {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
    const timer = setTimeout(() => setAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [results]);

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className={`results-container ${animation ? 'animate-slide-up' : ''}`}>
      {results.map((result, idx) => (
        <div key={idx} className="table-container">
          <div className="table-header">
            <div className="table-title">
              {tableTitle ? (
                <span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Table:</span> {tableTitle}
                </span>
              ) : (
                <span>Query Result</span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
              {result.values.length} {result.values.length === 1 ? 'row' : 'rows'}
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {result.columns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.values.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell === null ? <span style={{ color: 'rgba(255,255,255,0.3)' }}>NULL</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

ResultsDisplay.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      columns: PropTypes.arrayOf(PropTypes.string).isRequired,
      values: PropTypes.arrayOf(PropTypes.array).isRequired,
    })
  ).isRequired,
  tableTitle: PropTypes.string,
};

export default ResultsDisplay;
