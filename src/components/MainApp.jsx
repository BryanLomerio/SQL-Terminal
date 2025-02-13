import React, { useContext, useState } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import SqlEditor from './SqlEditor';
import SchemaDiagram from './SchemaDiagram';
import ResultsDisplay from './ResultDisplay';
import SampleProblems from '../problems/SampleProblems';

function MainApp() {
    const { db, loading } = useContext(DatabaseContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [tableTitle, setTableTitle] = useState('');
    const [message, setMessage] = useState('');
    const [view, setView] = useState('query');
    const [menuOpen, setMenuOpen] = useState(false);

    const convertMySQLtoSQLite = (query) => {
        query = query.replace(/\bNOW\(\)/gi, "datetime('now')");
        query = query.replace(/\bINSERT\s+IGNORE\b/gi, "INSERT OR IGNORE");
        query = query.replace(/\bREPLACE\s+INTO\b/gi, "INSERT OR REPLACE");

        if (/^DESCRIBE\s+/i.test(query)) {
            const parts = query.trim().split(/\s+/);
            const tableName = parts[1].replace(/;$/, "");
            return `PRAGMA table_info(${tableName});`;
        }

        if (/^SHOW\s+TABLES\s*;?$/i.test(query)) {
            return `SELECT name FROM sqlite_master WHERE type='table';`;
        }

        if (/^SHOW\s+COLUMNS\s+FROM\s+(\w+)/i.test(query)) {
            const match = query.match(/^SHOW\s+COLUMNS\s+FROM\s+(\w+)/i);
            if (match) {
                const tableName = match[1];
                return `PRAGMA table_info(${tableName});`;
            }
        }

        if (/^SHOW\s+CREATE\s+TABLE\s+(\w+)/i.test(query)) {
            const match = query.match(/^SHOW\s+CREATE\s+TABLE\s+(\w+)/i);
            if (match) {
                const tableName = match[1];
                return `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
            }
        }

        if (/^USE\s+/i.test(query)) {
            return `-- USE command ignored in SQLite.`;
        }

        if (/^(CREATE|DROP)\s+DATABASE/i.test(query)) {
            return `-- DATABASE commands are not supported in SQLite.`;
        }

        return query;
    };

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
            {/* Hamburger Menu */}
            <div
                style={{
                    position: 'fixed',
                    marginTop: '10px',
                    top: '10px',
                    right: '10px',
                    zIndex: 1100,
                    textAlign: 'right'
                }}
            >
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="hamburger-menu"
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: 'white'
                    }}
                >
                    ☰
                </button>
                {menuOpen && (
                    <div
                        className="hamburger-menu-links"
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            marginTop: '5px'
                        }}
                    >
                        <a
                            href="https://sql-learning-journey-tracker.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'white',
                                display: 'block',
                                margin: '5px 0'
                            }}
                        >
                            SQL Topics
                        </a>
                        <a
                            href="http://devhints.io/mysql"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'white',
                                display: 'block',
                                margin: '5px 0'
                            }}
                        >
                            Check Syntax
                        </a>
                        <a
                            href="https://github.com/BryanLomerio"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'white',
                                display: 'block',
                                margin: '5px 0'
                            }}
                        >
                            GitHub
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setView("problems");
                                setMenuOpen(false);
                            }}
                            style={{
                                color: 'white',
                                textDecoration: 'underline',
                                display: 'block',
                                margin: '5px 0'
                            }}
                        >
                            Problems
                        </a>
                    </div>
                )}
            </div>

            <h1>
                THE JOURNEY DOESN’T END, <br />
                KEEP LEVELING UP!
            </h1>

            {loading ? (
                <p>Loading database...</p>
            ) : (
                <>
                    {view === 'query' && (
                        <>
                            <SqlEditor query={query} setQuery={setQuery} />
                            <button className="execute-button" onClick={executeQuery}>
                                Run Query
                            </button>
                            <button className="execute-button" onClick={toggleTablesSchema}>
                                {view === 'schema' ? 'Hide Schema' : 'Show Tables & Schema'}
                            </button>
                            {message && <div className="notification">{message}</div>}
                            <ResultsDisplay results={results} tableTitle={tableTitle} />
                        </>
                    )}
                    {view === 'schema' && (
                        <>
                            <SchemaDiagram />
                            <button className="execute-button" onClick={() => setView('query')}>
                                Back to Query
                            </button>
                        </>
                    )}
                    {view === 'problems' && (
                        <>
                            <SampleProblems />
                            <button className="execute-button" onClick={() => setView('query')}>
                                Back to Query
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default MainApp;
