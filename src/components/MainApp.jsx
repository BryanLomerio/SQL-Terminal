import React, { useContext, useState } from "react";
import { DatabaseContext } from "../context/DatabaseContext";
import QueryView from "./query/QueryView";
import SchemaView from "./schema/SchemaView";
import ProblemsView from "../problems/SampleProblems";
import HamburgerMenu from './common/HamburgerMenu';
import BackButton from './common/BackButton';
import { executeDatabaseQuery } from '../services/queryService';

function MainApp() {
    const { db, loading, updateDatabaseStorage } = useContext(DatabaseContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [tableTitle, setTableTitle] = useState('');
    const [message, setMessage] = useState('');
    const [view, setView] = useState('query');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleExecuteQuery = () => {
        const { results, message, tableTitle } = executeDatabaseQuery(db, query, updateDatabaseStorage);
        setResults(results);
        setMessage(message);
        setTableTitle(tableTitle);
    };

    const toggleTablesSchema = () => {
        setView(view === 'schema' ? 'query' : 'schema');
        setMessage('');
    };

    return (
        <div className="container">
            <HamburgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} setView={setView} />
            <BackButton visible={view !== 'query'} onClick={() => setView('query')} />
            <h4>
                THE JOURNEY DOESN’T END, <br />
                KEEP LEVELING UP!
            </h4>
            {loading ? (
                <p>Loading database...</p>
            ) : (
                <>
                    {view === 'query' && (
                        <QueryView
                            query={query}
                            setQuery={setQuery}
                            executeQuery={handleExecuteQuery}
                            toggleTablesSchema={toggleTablesSchema}
                            message={message}
                            results={results}
                            tableTitle={tableTitle}
                        />
                    )}
                    {view === 'schema' && <SchemaView />}
                    {view === 'problems' && <ProblemsView />}
                </>
            )}
        </div>
    );
}

export default MainApp;
