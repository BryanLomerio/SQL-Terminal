import { uint8ArrayToBase64 } from '../utils/base64Converters';

export const defaultSchema = `
  -- Departments table
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1 -- 1 active, 0 inactive
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
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  -- Projects table
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1 -- 1 active, 0 inactive
  );

  -- Employee_Projects join table
  CREATE TABLE IF NOT EXISTS employee_projects (
    employee_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
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
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );

  -- Regions table
  CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1 -- 1 active, 0 inactive
  );

  -- Provinces table
  CREATE TABLE IF NOT EXISTS provinces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    capital VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
    FOREIGN KEY(region_id) REFERENCES regions(id)
  );

  -- Municipalities table
  CREATE TABLE IF NOT EXISTS municipalities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    province_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
    FOREIGN KEY(province_id) REFERENCES provinces(id)
  );

  -- Barangays table
  CREATE TABLE IF NOT EXISTS barangays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    municipality_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
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
    remark TINYINT(1) DEFAULT 1, -- 1 active, 0 inactive
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  -- Existing sample data...
  INSERT INTO departments (name, location) VALUES ('IT', 'Makati');
  INSERT INTO departments (name, location) VALUES ('Human Resources', 'Mandaluyong');
  INSERT INTO departments (name, location) VALUES ('Sales', 'Quezon City');

  INSERT INTO employees (first_name, last_name, department_id, position, salary)
    VALUES ('Juan', 'Dela Cruz', 1, 'Software Engineer', 85000.00);
  INSERT INTO employees (first_name, last_name, department_id, position, salary)
    VALUES ('Maria', 'Santos', 1, 'DevOps Engineer', 90000.00);
  INSERT INTO employees (first_name, last_name, department_id, position, salary)
    VALUES ('Jose', 'Reyes', 2, 'HR Manager', 75000.00);
  INSERT INTO employees (first_name, last_name, department_id, position, salary)
    VALUES ('Ana', 'Garcia', 3, 'Sales Specialist', 70000.00);
  INSERT INTO employees (first_name, last_name, department_id, position, salary)
    VALUES ('Bryan', 'Lomerio', 1, 'Frontend Developer', 78000.00);
  INSERT INTO employees (first_name, last_name, department_id, position, salary)
    VALUES ('Ella', 'Domingo', 3, 'Sales Associate', 68000.00);

  INSERT INTO projects (name, start_date, end_date)
    VALUES ('Project Bayanihan', '2024-01-01', '2024-06-30');
  INSERT INTO projects (name, start_date, end_date)
    VALUES ('Project Kapit', '2024-03-01', '2024-12-31');
  INSERT INTO projects (name, start_date, end_date)
    VALUES ('Project Alon', '2024-04-01', '2024-10-31');
    INSERT INTO projects (name, start_date, end_date)
  VALUES ('Project Lakbay', '2024-05-01', '2024-11-30');

INSERT INTO projects (name, start_date, end_date)
  VALUES ('Project Luntian', '2024-06-01', '2025-01-31');

INSERT INTO projects (name, start_date, end_date)
  VALUES ('Project Liwanag', '2024-07-15', '2025-03-15');


INSERT INTO employee_projects (employee_id, project_id) VALUES (3, 2); -- Jose -> Project Lakbay
INSERT INTO employee_projects (employee_id, project_id) VALUES (5, 4); -- Bryan -> Project Lakbay
INSERT INTO employee_projects (employee_id, project_id) VALUES (2, 5); -- Maria -> Project Luntian
INSERT INTO employee_projects (employee_id, project_id) VALUES (6, 5); -- Ella -> Project Luntian
INSERT INTO employee_projects (employee_id, project_id) VALUES (1, 6); -- Juan -> Project Liwanag
INSERT INTO employee_projects (employee_id, project_id) VALUES (4, 6); -- Ana -> Project Liwanag

  INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
    VALUES (1, '123 Mabini St', 'Apt 4', 'Manila', 'Metro Manila', '1001');
  INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
    VALUES (2, '456 Rizal St', '', 'Quezon City', 'Metro Manila', '1002');
  INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
    VALUES (3, '789 Bonifacio St', 'Suite 5', 'Cebu City', 'Cebu', '6000');
  INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
    VALUES (4, '321 EDSA', '', 'Davao City', 'Davao', '8000');
  INSERT INTO addresses (employee_id, address_line1, address_line2, city, state, zip)
    VALUES (5, '122 Katipunan', 'Unit 9', 'Pasig', 'Metro Manila', '1600');

  INSERT INTO regions (name, description) VALUES ('Luzon', 'Main island group of the Philippines.');
  INSERT INTO regions (name, description) VALUES ('Visayas', 'Central islands of the Philippines.');
  INSERT INTO regions (name, description) VALUES ('Mindanao', 'Southern island group of the Philippines.');

  INSERT INTO provinces (region_id, name, capital) VALUES (1, 'Pampanga', 'San Fernando');
  INSERT INTO provinces (region_id, name, capital) VALUES (1, 'Bulacan', 'Malolos');
  INSERT INTO provinces (region_id, name, capital) VALUES (2, 'Cebu', 'Cebu City');
  INSERT INTO provinces (region_id, name, capital) VALUES (3, 'Davao del Sur', 'Digos');

  INSERT INTO municipalities (province_id, name) VALUES (1, 'Angeles City');
  INSERT INTO municipalities (province_id, name) VALUES (2, 'Meycauayan');
  INSERT INTO municipalities (province_id, name) VALUES (3, 'Lapu-Lapu City');
  INSERT INTO municipalities (province_id, name) VALUES (4, 'Bansalan');
  INSERT INTO municipalities (province_id, name) VALUES (3, 'Toledo');

  INSERT INTO barangays (municipality_id, name) VALUES (1, 'Balibago');
  INSERT INTO barangays (municipality_id, name) VALUES (2, 'Sto. Niño');
  INSERT INTO barangays (municipality_id, name) VALUES (3, 'Maribago');
  INSERT INTO barangays (municipality_id, name) VALUES (4, 'Poblacion');
  INSERT INTO barangays (municipality_id, name) VALUES (5, 'Ibo');

  INSERT INTO offices (name, location, department_id) VALUES ('Main Office', 'Makati', 1);
  INSERT INTO offices (name, location, department_id) VALUES ('Regional Office', 'Quezon City', 2);
  INSERT INTO offices (name, location, department_id) VALUES ('Sales HQ', 'Pasay', 3);
`;

export const initDatabaseInstance = async (initSqlJs, base64ToUint8Array) => {
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
    database = new SQL.Database();
    database.run(defaultSchema);
    console.log('Created new database with default schema and sample data.');
    const data = database.export();
    localStorage.setItem('employeeDb', uint8ArrayToBase64(data));
  }
  return database;
};
