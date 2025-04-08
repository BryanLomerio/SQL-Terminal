import React, { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import { uint8ArrayToBase64, base64ToUint8Array } from '../utils/base64Converters';
import { defaultSchema, initDatabaseInstance } from '../services/databaseInitializer';

export const DatabaseContext = createContext({
  db: null,
  loading: true,
});

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableCreated, setTableCreated] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = await initDatabaseInstance(initSqlJs, base64ToUint8Array);
        // If no saved database was found
        if (!localStorage.getItem('employeeDb')) {
          setTableCreated(true);
        }
        setDb(database);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing SQL.js:', error);
      }
    };

    initDatabase();
  }, []);

  const updateDatabaseStorage = () => {
    if (db) {
      const data = db.export();
      const base64Data = uint8ArrayToBase64(data);
      try {
        localStorage.setItem('employeeDb', base64Data);
        // Log storage
        const usage = new Blob([base64Data]).size;
        console.log(`Storage usage: ${(usage / 1024 / 1024).toFixed(2)}MB`);
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded');

        }
        throw e;
      }
    }
  };

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

  const updateEmployeeSalary = (employeeId, newSalary) => {
    if (db) {
      const stmt = db.prepare("UPDATE employees SET salary = ? WHERE id = ?");
      stmt.run([newSalary, employeeId]);
      stmt.free();
      updateDatabaseStorage();
      console.log(`Updated employee ID ${employeeId} with new salary ${newSalary}`);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        db,
        loading,
        tableCreated,
        updateDatabaseStorage,
        addEmployee,
        updateEmployeeSalary,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
