import React, { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';

export const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableCreated, setTableCreated] = useState(false);  

  const uint8ArrayToBase64 = (u8Arr) => {
    const CHUNK_SIZE = 0x8000;
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

  useEffect(() => {
    initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` })
      .then(SQL => {
        let database;
        const savedDb = localStorage.getItem('employeeDb');
        if (savedDb) {
          const uInt8Array = base64ToUint8Array(savedDb);
          database = new SQL.Database(uInt8Array);
          console.log('Database loaded from localStorage.');
        } else {
          // Create data
          database = new SQL.Database();
          const defaultSchema = `
            -- departments table.
            CREATE TABLE IF NOT EXISTS departments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT
            );
            
            -- employees table (salary column added).
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                department_id INTEGER,
                position TEXT,
                salary REAL,
                FOREIGN KEY(department_id) REFERENCES departments(id)
            );
            
            -- projects table.
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                start_date TEXT,
                end_date TEXT
            );
            
            -- join table for employees and projects.
            CREATE TABLE IF NOT EXISTS employee_projects (
                employee_id INTEGER,
                project_id INTEGER,
                PRIMARY KEY (employee_id, project_id),
                FOREIGN KEY(employee_id) REFERENCES employees(id),
                FOREIGN KEY(project_id) REFERENCES projects(id)
            );
            
            -- addresses table.
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
            
            -- default data for departments.
            INSERT INTO departments (name, location) VALUES ('Engineering', 'Building A');
            INSERT INTO departments (name, location) VALUES ('Human Resources', 'Building B');
            INSERT INTO departments (name, location) VALUES ('Marketing', 'Building C');
            
            -- default data for employees (including salary).
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Alice', 'Smith', 1, 'Software Engineer', 85000);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Bob', 'Johnson', 1, 'DevOps Engineer', 90000);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Charlie', 'Williams', 2, 'HR Manager', 75000);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Diana', 'Brown', 3, 'Marketing Specialist', 70000);
            
            -- default data for projects.
            INSERT INTO projects (name, start_date, end_date)
              VALUES ('Project Apollo', '2024-01-01', '2024-06-30');
            INSERT INTO projects (name, start_date, end_date)
              VALUES ('Project Zephyr', '2024-03-01', '2024-12-31');
            
            -- Associate employees with projects.
            INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 1);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (2, 1);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 2);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (4, 2);
            
            -- default data for addresses.
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

          // Mark table as created and save to localStorage
          setTableCreated(true);
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

  const updateDatabaseStorage = () => {
    if (db) {
      const data = db.export();
      localStorage.setItem('employeeDb', uint8ArrayToBase64(data));
    }
  };

  // Add a new employee
  const addEmployee = (firstName, lastName, departmentId, position, salary) => {
    if (db) {
      const stmt = db.prepare(
        `INSERT INTO employees (first_name, last_name, department_id, position, salary)
         VALUES (?, ?, ?, ?, ?)`
      );
      stmt.run([firstName, lastName, departmentId, position, salary]);
      stmt.free();
      updateDatabaseStorage();
      console.log(`Added employee ${firstName} ${lastName} with salary ${salary}`);
    }
  };

  // Update employee salary
  const updateEmployeeSalary = (employeeId, newSalary) => {
    if (db) {
      const stmt = db.prepare(
        "UPDATE employees SET salary = ? WHERE id = ?"
      );
      stmt.run([newSalary, employeeId]);
      stmt.free();
      updateDatabaseStorage();
      console.log(`Updated employee ID ${employeeId} with new salary ${newSalary}`);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{ db, loading, tableCreated, updateDatabaseStorage, addEmployee, updateEmployeeSalary }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
