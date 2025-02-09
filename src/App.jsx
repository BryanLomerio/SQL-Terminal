// src/App.js
import React, { useContext, useState } from 'react';
import { DatabaseProvider, DatabaseContext } from './context/DatabaseContext';
import SqlEditor from './components/SqlEditor';
import ResultsDisplay from './components/ResultDisplay';


function MainApp() {
  const { db, loading, updateDatabaseStorage } = useContext(DatabaseContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const executeQuery = () => {
    if (!db) {
      alert('Database not loaded yet!');
      return;
    }
    // db.exec returns arr
    try {
      const res = db.exec(query);  
      setResults(res);
      updateDatabaseStorage();
    } catch (e) {
      setResults([{ error: e.toString() }]);
    }
  };

  // all tables
  const showTablesSchema = () => {
    if (!db) {
      alert('Database not loaded yet!');
      return;
    }
    try {
      const res = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table';");
      setResults(res);
    } catch (e) {
      setResults([{ error: e.toString() }]);
    }
  };

  return (
    <div className="container">
      <h1>THE JOURNEY DOESN’T END, KEEP LEVELING UP!</h1>
      {loading ? (
        <p>Loading database...</p>
      ) : (
        <>
          <SqlEditor query={query} setQuery={setQuery} />
          <button className="execute-button" onClick={executeQuery}>
            Run Query
          </button>
          <button className="execute-button" onClick={showTablesSchema}>
            Show Tables &amp; Schema
          </button>
          <ResultsDisplay results={results} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <MainApp />
    </DatabaseProvider>
  );
}

export default App;
