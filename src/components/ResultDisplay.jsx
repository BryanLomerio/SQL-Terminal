import React, { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';

const ResultsDisplay = ({ results }) => {
  const { tableCreated } = useContext(DatabaseContext);

  if (tableCreated) {
    return <p>Table created successfully!</p>;
  }

  if (results.length === 0) {
    return <p>No results to display.</p>;
  }

  return (
    <div className="results">
      {results.map((result, idx) => {
        if (result.error) {
          return (
            <div key={idx} className="error">
              {result.error}
            </div>
          );
        }
        return (
          <div key={idx} className="result">
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
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsDisplay;
