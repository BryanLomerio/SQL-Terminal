import React from 'react';
import SqlEditor from './SqlEditor';
import ResultsDisplay from './ResultDisplay';

const QueryView = ({ query, setQuery, executeQuery, toggleTablesSchema, message, results, tableTitle }) => {
    return (
        <>
            <SqlEditor query={query} setQuery={setQuery} />
            <button className="execute-button" onClick={executeQuery}>
                Run Query
            </button>
            <button className="execute-button" onClick={toggleTablesSchema}>
                Show Tables & Schema
            </button>
            {message && <div className="notification">{message}</div>}
            <ResultsDisplay results={results} tableTitle={tableTitle} />
        </>
    );
};

export default QueryView;
