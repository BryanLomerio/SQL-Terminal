import React, { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';

export const DatabaseContext = createContext({
  db: null,
  loading: true,
});

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
    const initDatabase = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });

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
            -- Departments table
            CREATE TABLE IF NOT EXISTS departments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(255) NOT NULL,
              location VARCHAR(255) DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Employees table
            CREATE TABLE IF NOT EXISTS employees (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              first_name VARCHAR(255) NOT NULL,
              last_name VARCHAR(255) NOT NULL,
              department_id INT DEFAULT NULL,
              position VARCHAR(255) DEFAULT NULL,
              salary DECIMAL(10,2) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(department_id) REFERENCES departments(id)
            );

            -- Projects table
            CREATE TABLE IF NOT EXISTS projects (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(255) NOT NULL,
              start_date DATE DEFAULT NULL,
              end_date DATE DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Employee_Projects join table
            CREATE TABLE IF NOT EXISTS employee_projects (
              employee_id INT NOT NULL,
              project_id INT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (employee_id, project_id),
              FOREIGN KEY(employee_id) REFERENCES employees(id),
              FOREIGN KEY(project_id) REFERENCES projects(id)
            );

            -- Addresses
            CREATE TABLE IF NOT EXISTS addresses (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              employee_id INT NOT NULL,
              address_line1 VARCHAR(255) NOT NULL,
              address_line2 VARCHAR(255) DEFAULT NULL,
              city VARCHAR(100) NOT NULL,
              state VARCHAR(100) NOT NULL,
              zip VARCHAR(20) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(employee_id) REFERENCES employees(id)
            );

            -- Regions table
            CREATE TABLE IF NOT EXISTS regions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(255) NOT NULL,
              description TEXT DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Provinces table
            CREATE TABLE IF NOT EXISTS provinces (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              region_id INT NOT NULL,
              name VARCHAR(255) NOT NULL,
              capital VARCHAR(255) DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(region_id) REFERENCES regions(id)
            );

            -- Municipalities table
            CREATE TABLE IF NOT EXISTS municipalities (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              province_id INT NOT NULL,
              name VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(province_id) REFERENCES provinces(id)
            );

            -- Barangays table
            CREATE TABLE IF NOT EXISTS barangays (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              municipality_id INT NOT NULL,
              name VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(municipality_id) REFERENCES municipalities(id)
            );

            -- Offices table
            CREATE TABLE IF NOT EXISTS offices (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(255) NOT NULL,
              location VARCHAR(255) DEFAULT NULL,
              department_id INT DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(department_id) REFERENCES departments(id)
            );


            -- Departments
            INSERT INTO departments (name, location) VALUES ('IT', 'Makati');
            INSERT INTO departments (name, location) VALUES ('Human Resources', 'Mandaluyong');
            INSERT INTO departments (name, location) VALUES ('Sales', 'Quezon City');

            -- Employees
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Juan', 'Dela Cruz', 1, 'Software Engineer', 85000.00);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Maria', 'Santos', 1, 'DevOps Engineer', 90000.00);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Jose', 'Reyes', 2, 'HR Manager', 75000.00);
            INSERT INTO employees (first_name, last_name, department_id, position, salary)
              VALUES ('Ana', 'Garcia', 3, 'Sales Specialist', 70000.00);

            -- Projects
            INSERT INTO projects (name, start_date, end_date)
              VALUES ('Project Bayanihan', '2024-01-01', '2024-06-30');
            INSERT INTO projects (name, start_date, end_date)
              VALUES ('Project Kapit', '2024-03-01', '2024-12-31');

            -- Employee_Projects
            INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 1);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (2, 1);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 2);
            INSERT INTO employee_projects (employee_id, project_id) VALUES (4, 2);

            -- Addresses
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (1, '123 Mabini St', 'Apt 4', 'Manila', 'Metro Manila', '1001');
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (2, '456 Rizal St', '', 'Quezon City', 'Metro Manila', '1002');
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (3, '789 Bonifacio St', 'Suite 5', 'Cebu City', 'Cebu', '6000');
            INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
              VALUES (4, '321 EDSA', '', 'Davao City', 'Davao', '8000');

            -- Regions
            INSERT INTO regions (name, description) VALUES ('Luzon', 'Main island group of the Philippines.');
            INSERT INTO regions (name, description) VALUES ('Visayas', 'Central islands of the Philippines.');
            INSERT INTO regions (name, description) VALUES ('Mindanao', 'Southern island group of the Philippines.');

            -- Provinces
            INSERT INTO provinces (region_id, name, capital) VALUES (1, 'Pampanga', 'San Fernando');
            INSERT INTO provinces (region_id, name, capital) VALUES (1, 'Bulacan', 'Malolos');
            INSERT INTO provinces (region_id, name, capital) VALUES (2, 'Cebu', 'Cebu City');
            INSERT INTO provinces (region_id, name, capital) VALUES (3, 'Davao del Sur', 'Digos');

            -- Municipalities
            INSERT INTO municipalities (province_id, name) VALUES (1, 'Angeles City');
            INSERT INTO municipalities (province_id, name) VALUES (2, 'Meycauayan');
            INSERT INTO municipalities (province_id, name) VALUES (3, 'Lapu-Lapu City');
            INSERT INTO municipalities (province_id, name) VALUES (4, 'Bansalan');

            -- Barangays
            INSERT INTO barangays (municipality_id, name) VALUES (1, 'Balibago');
            INSERT INTO barangays (municipality_id, name) VALUES (2, 'Sto. Niño');
            INSERT INTO barangays (municipality_id, name) VALUES (3, 'Maribago');
            INSERT INTO barangays (municipality_id, name) VALUES (4, 'Poblacion');

            -- Offices
            INSERT INTO offices (name, location, department_id) VALUES ('Main Office', 'Makati', 1);
            INSERT INTO offices (name, location, department_id) VALUES ('Regional Office', 'Quezon City', 2);
          `;

          database.run(defaultSchema);
          console.log('Created new database with default schema and sample data.');

          setTableCreated(true);
          const data = database.export();
          localStorage.setItem('employeeDb', uint8ArrayToBase64(data));
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
      localStorage.setItem('employeeDb', uint8ArrayToBase64(data));
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
