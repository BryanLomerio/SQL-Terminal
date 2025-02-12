import React from 'react';

const ResultsDisplay = ({ results, tableTitle }) => {
  if (!results || results.length === 0) {
    return <p></p>;
  }

  return (
    <div>
      {tableTitle && <h3>{tableTitle}</h3>}
      {results.map((result, idx) => (
        <table key={idx} border="1" cellPadding="5" style={{ marginBottom: '20px' }}>
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
      ))}
    </div>
  );
};

export default ResultsDisplay;
