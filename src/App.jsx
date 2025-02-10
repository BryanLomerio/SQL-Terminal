import React, { useContext, useState } from 'react';
import { DatabaseProvider, DatabaseContext } from './context/DatabaseContext';
import SqlEditor from './components/SqlEditor';
import SchemaDiagram from './components/SchemaDiagram';
import ResultsDisplay from './components/ResultDisplay';

function MainApp() {
  const { db, loading, updateDatabaseStorage } = useContext(DatabaseContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [view, setView] = useState('query');

  const executeQuery = () => {
    if (!db) {
      alert('Database not loaded yet!');
      return;
    }
    try {
      const res = db.exec(query);
      setResults(res);
      updateDatabaseStorage();
      setView('query');
    } catch (e) {
      setResults([{ error: e.toString() }]);
      setView('query');
    }
  };

  const toggleTablesSchema = () => {
    setView(prevView => (prevView === 'schema' ? 'query' : 'schema'));
  };

  return (
    <div className="container">
         <h1>THE JOURNEY DOESN’T END, <br></br>KEEP LEVELING UP!</h1>
      {loading ? (
        <p>Loading database...</p>
      ) : (
        <>
          <SqlEditor query={query} setQuery={setQuery} />
          <button className="execute-button" onClick={executeQuery}>
            Run Query
          </button>
          <button className="execute-button" onClick={toggleTablesSchema}>
            {view === 'schema' ? 'Hide Schema' : 'Show Tables & Schema'}
          </button>
          {view === 'query' ? (
            <ResultsDisplay results={results} />
          ) : (
            <SchemaDiagram />
          )}
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
