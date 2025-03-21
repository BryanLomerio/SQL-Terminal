import React, { useContext, useState } from "react";
import { DatabaseContext } from "../context/DatabaseContext";
import QueryView from "./QueryView";
import SchemaView from "./SchemaView";
import ProblemsView from "../problems/SampleProblems";

import HamburgerMenu from './HamburgerMenu';
import BackButton from './BackButton';
import { convertMySQLtoSQLite } from '../utils/convertQuery';

function MainApp() {
    const { db, loading, updateDatabaseStorage } = useContext(DatabaseContext);
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

            let columns = [];
            if (convertedQuery.trim().toUpperCase().startsWith('SELECT')) {
                const tableMatch = convertedQuery.match(/FROM\s+(\w+)/i);
                if (tableMatch) {
                    const tableName = tableMatch[1];
                    const tableExists = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`);

                    if (tableExists.length > 0) {
                        const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
                        if (tableInfo.length > 0) {
                            columns = tableInfo[0].values.map(col => col[1]);
                        }
                    }
                }
            }

            const result = db.exec(convertedQuery);
            const upperQuery = convertedQuery.trim().toUpperCase();

            if (
                upperQuery.startsWith("CREATE TABLE") ||
                upperQuery.startsWith("DROP TABLE") ||
                upperQuery.startsWith("ALTER TABLE") ||
                upperQuery.startsWith("INSERT") ||
                upperQuery.startsWith("UPDATE") ||
                upperQuery.startsWith("DELETE") ||
                upperQuery.startsWith("TRUNCATE")
            ) {
                updateDatabaseStorage();
            }


            if (upperQuery.startsWith("CREATE TABLE")) {
                setMessage("Table created successfully.");
                setResults([]);
            } else if (upperQuery.startsWith("DROP TABLE")) {
                setMessage("Table dropped successfully.");
                setResults([]);
            } else if (upperQuery.startsWith("ALTER TABLE")) {
                setMessage("Table altered successfully.");
                setResults([]);
            } else if (upperQuery.startsWith("DELETE FROM")) {
                setMessage("Records deleted successfully.");
                if (columns.length > 0) {
                    setResults([{
                        columns: columns,
                        values: []
                    }]);
                }
            } else if (upperQuery.startsWith("TRUNCATE TABLE")) {
                setMessage("Table truncated successfully.");
                if (columns.length > 0) {
                    setResults([{
                        columns: columns,
                        values: []
                    }]);
                }
            } else if (
                upperQuery.startsWith("INSERT") ||
                upperQuery.startsWith("UPDATE")
            ) {
                setMessage("Operation completed successfully.");
                setResults(result.length > 0 ? result : []);
            } else {
              
                if (result.length === 0 && columns.length > 0) {
                    setResults([{
                        columns: columns,
                        values: []
                    }]);
                    setMessage("");
                } else if (result.length === 0) {
                    setResults([]);
                    if (!upperQuery.startsWith("CREATE TABLE")) {
                        setMessage("Table does not exist.");
                    }
                } else {
                    setResults(result);
                    setMessage("");
                }
            }

        } catch (error) {
            console.error("Query execution error:", error);
            setMessage("Error executing query: " + error.message);
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
