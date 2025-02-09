// src/App.js
import React, { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
// Import the SQL language syntax from Prism
import 'prismjs/components/prism-sql';
// Optionally, if you want to override Prism's theme styles, do so in your CSS.
import './App.css';

function App() {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper functions to convert between Uint8Array and Base64
  const uint8ArrayToBase64 = (u8Arr) => {
    let CHUNK_SIZE = 0x8000;
    let index = 0;
    let result = '';
    while (index < u8Arr.length) {
      result += String.fromCharCode.apply(
        null,
        u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, u8Arr.length))
      );
      index += CHUNK_SIZE;
    }
    return btoa(result);
  };

  const base64ToUint8Array = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Initialize SQL.js and either load the DB from localStorage or create a new one
  useEffect(() => {
    initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` })
      .then(SQL => {
        let database;
        const savedDb = localStorage.getItem('employeeDb');
        if (savedDb) {
          // Load the database from localStorage if it exists
          const uInt8Array = base64ToUint8Array(savedDb);
          database = new SQL.Database(uInt8Array);
          console.log('Database loaded from localStorage.');
        } else {
          // Create a new database and initialize default schema and sample data
          database = new SQL.Database();
          const defaultSchema = `
            -- Create the departments table.
            CREATE TABLE IF NOT EXISTS departments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT
            );
            
            -- Create the employees table.
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                department_id INTEGER,
                position TEXT,
                salary REAL,
                FOREIGN KEY(department_id) REFERENCES departments(id)
            );
            
            -- Create the projects table.
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                start_date TEXT,
                end_date TEXT
            );
            
            -- Create the join table for employees and projects.
            CREATE TABLE IF NOT EXISTS employee_projects (
                employee_id INTEGER,
                project_id INTEGER,
                PRIMARY KEY (employee_id, project_id),
                FOREIGN KEY(employee_id) REFERENCES employees(id),
                FOREIGN KEY(project_id) REFERENCES projects(id)
            );
            
            -- Create the addresses table.
            CREATE TABLE IF NOT EXISTS addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER,
                address_line1 TEXT,
                address_line2 TEXT,
                city TEXT,
                state TEXT,
                zip TEXT,
                FOREIGN KEY(employee_id) REFERENCES employees(id)
            );
            
            -- Insert default data into departments.
            INSERT INTO departments (name, location) VALUES ('Engineering', 'Building A');
            INSERT INTO departments (name, location) VALUES ('Human Resources', 'Building B');
            INSERT INTO departments (name, location) VALUES ('Marketing', 'Building C');
            
            -- Insert default data into employees.
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Alice', 'Smith', 1, 'Software Engineer', 85000);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Bob', 'Johnson', 1, 'DevOps Engineer', 90000);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Charlie', 'Williams', 2, 'HR Manager', 75000);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Diana', 'Brown', 3, 'Marketing Specialist', 70000);
            
            -- Insert default data into projects.
            INSERT INTO projects (name, start_date, end_date)
              VALUES ('Project Apollo', '2024-01-01', '2024-06-30');
            INSERT INTO projects (name, start_date, end_date)
              VALUES ('Project Zephyr', '2024-03-01', '2024-12-31');
            
            -- Associate employees with projects.
            INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 1);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (2, 1);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 2);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (4, 2);
            
            -- Insert default data into addresses.
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (1, '123 Main St', 'Apt 4', 'New York', 'NY', '10001');
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (2, '456 Elm St', '', 'San Francisco', 'CA', '94101');
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (3, '789 Oak St', 'Suite 5', 'Chicago', 'IL', '60601');
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (4, '321 Pine St', '', 'Seattle', 'WA', '98101');
          `;
          database.run(defaultSchema);
          console.log('Created new database with default schema and sample data.');
          // Save the new database to localStorage
          const data = database.export();
          localStorage.setItem('employeeDb', uint8ArrayToBase64(data));
        }
        setDb(database);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error initializing SQL.js:', error);
      });
  }, []);

  // Execute the SQL query entered by the user
  const executeQuery = () => {
    if (!db) {
      alert('Database not loaded yet!');
      return;
    }
    try {
      // Execute the query; db.exec returns an array of result objects.
      const res = db.exec(query);
      setResults(res);
      // Save the updated database state to localStorage
      const data = db.export();
      localStorage.setItem('employeeDb', uint8ArrayToBase64(data));
    } catch (e) {
      setResults([{ error: e.toString() }]);
    }
  };

  // Function: Show all tables and their schema from sqlite_master
  const showTablesSchema = () => {
    if (!db) {
      alert('Database not loaded yet!');
      return;
    }
    try {
      // Query to return table names and their creation SQL.
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
          {/* Syntax-highlighted SQL editor */}
          <Editor
  value={query}
  onValueChange={setQuery}
  highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
  padding={10}
  style={{
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 16,
    backgroundColor: '#1e1e1e',
    color: '#eee',
    border: '1px solid #444',
    minHeight: '120px',
  }}
/>

          <button className="execute-button" onClick={executeQuery}>
            Run Query
          </button>
          <button className="execute-button" onClick={showTablesSchema}>
            Show Tables &amp; Schema
          </button>
          <div className="results">
            {results.length === 0 ? (
              <p>No results to display.</p>
            ) : (
              results.map((result, idx) => {
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
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
