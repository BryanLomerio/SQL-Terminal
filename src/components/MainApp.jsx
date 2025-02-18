import React, { useContext, useState } from "react";
import { DatabaseContext } from "../context/DatabaseContext";
import QueryView from "./QueryView";
import SchemaView from "./SchemaView";
import ProblemsView from "../problems/SampleProblems";

import HamburgerMenu from './HamburgerMenu';
import BackButton from './BackButton';
import { convertMySQLtoSQLite } from '../utils/convertQuery';

function MainApp() {
    const { db, loading } = useContext(DatabaseContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [tableTitle, setTableTitle] = useState('');
    const [message, setMessage] = useState('');
    const [view, setView] = useState('query');
    const [menuOpen, setMenuOpen] = useState(false);

    const executeQuery = () => {
        if (!db) {
            console.error("Database is not loaded");
            setMessage("Database is not loaded yet.");
            return;
        }
        try {
            const convertedQuery = convertMySQLtoSQLite(query);
            const match = convertedQuery.match(/FROM\s+(\w+)/i);
            setTableTitle(match ? match[1] : '');
            const result = db.exec(convertedQuery);
            setResults(result);

            const upperQuery = convertedQuery.trim().toUpperCase();
            if (upperQuery.startsWith("CREATE TABLE")) {
                setMessage("Table created successfully.");
            } else if (
                upperQuery.startsWith("INSERT") ||
                upperQuery.startsWith("UPDATE") ||
                upperQuery.startsWith("DELETE")
            ) {
                setMessage("Operation completed successfully.");
            } else if (result.length === 0) {
                setMessage("No results to display.");
            } else {
                setMessage("");
            }
        } catch (error) {
            console.error("Query execution error:", error);
            setMessage("Error executing query.");
        }
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
                            executeQuery={executeQuery}
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
