import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SqlEditor from './SqlEditor';
import ResultsDisplay from './ResultDisplay';
import { Play, Database } from 'lucide-react';
import { Button } from './ui/button';

const QueryView = ({
  query,
  setQuery,
  executeQuery,
  toggleTablesSchema,
  message,
  results,
  tableTitle
}) => {
  const [hasExecuted, setHasExecuted] = useState(false);

  useEffect(() => {
    const handleExecuteShortcut = () => {
      setHasExecuted(true);
      executeQuery();
    };

    window.addEventListener('execute-query', handleExecuteShortcut);
    return () => {
      window.removeEventListener('execute-query', handleExecuteShortcut);
    };
  }, [executeQuery]);

  const runQuery = () => {
    setHasExecuted(true);
    executeQuery();
  };

  const trimmedQuery = query.trim().toUpperCase();
  const isCreateTable = trimmedQuery.startsWith("CREATE TABLE");

  const displayMessage = hasExecuted && isCreateTable && (!message || message === "")
    ? "Table created successfully."
    : message;

  return (
    <>
      <SqlEditor query={query} setQuery={setQuery} />

      <div className="button-group">
        <Button
          variant="primary"
          className="button bg-[#8315DB]"
          onClick={runQuery}
          style={{ cursor: 'pointer' }}
        >
          <Play size={16} />
          Run Query
        </Button>
        <Button
          variant="secondary"
          className="button button-secondary"
          onClick={toggleTablesSchema}
          style={{ cursor: 'pointer' }}
        >
          <Database size={16} />
          View Schema
        </Button>
      </div>

      {displayMessage && (
        <div className={`notification ${displayMessage.includes('Error') ? 'error' : displayMessage.includes('successfully') ? 'success' : ''}`}>
          <span className="notification-icon">
            {displayMessage.includes('Error') ? (
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48619C6.81221 4.10587 7.11783 3.78443 7.49814 3.76974C7.87845 3.75505 8.19989 4.06067 8.21458 4.44098L8.29852 6.73179C8.31523 7.16222 7.97724 7.5311 7.54594 7.5483C7.10534 7.56615 6.73397 7.21774 6.75305 6.77691L6.8269 4.48619ZM7.49744 8.25C7.0391 8.25 6.66659 8.62251 6.66659 9.08085C6.66659 9.53919 7.0391 9.9117 7.49744 9.9117C7.95578 9.9117 8.32829 9.53919 8.32829 9.08085C8.32829 8.62251 7.95578 8.25 7.49744 8.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            ) : displayMessage.includes('successfully') ? (
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82708 7.49972C1.82708 4.3667 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.3667 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82708 10.6327 1.82708 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49991 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49991 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            )}
          </span>
          {displayMessage}
        </div>
      )}

      <ResultsDisplay results={results} tableTitle={tableTitle} />
    </>
  );
};

QueryView.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  executeQuery: PropTypes.func.isRequired,
  toggleTablesSchema: PropTypes.func.isRequired,
  message: PropTypes.string,
  results: PropTypes.array,
  tableTitle: PropTypes.string,
};

export default QueryView;
