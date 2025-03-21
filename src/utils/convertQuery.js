import initSqlJs from 'sql.js';

export const convertMySQLtoSQLite = (query) => {
  query = query.trim();

  if (query.toUpperCase().startsWith("WITH ")) {
    let depth = 0,
      idx = 0;
    for (; idx < query.length; idx++) {
      if (query[idx] === "(") depth++;
      else if (query[idx] === ")") {
        depth--;
        if (depth === 0) break;
      }
    }
    query = query.substring(idx + 1).trim();
  }

  query = query.replace(/JSON_ARRAYAGG\s*\([\s\S]*?\)/gi, "NULL");
  query = query.replace(/JSON_OBJECT\s*\([\s\S]*?\)/gi, "NULL");

  query = query.replace(/COUNT\(e\.id\)\s+OVER\(\)/gi, "COUNT(e.id)");
  query = query.replace(
    /RIGHT\s+JOIN\s+(\w+)\s+(\w+)\s+ON\s+1\s*=\s*1/gi,
    "LEFT JOIN $1 $2 ON 1 = 1"
  );
  query = query.replace(/\s+WITH\s+ROLLUP/gi, "");

  query = query.replace(
    /GROUP_CONCAT\(([^()]+?)\s+ORDER\s+BY\s+[^()]+\s+SEPARATOR\s+(['"])([^'"]+?)\2\s*\)/gi,
    (match, expr, quote, sep) => {
      expr = expr.trim();
      if (expr.toUpperCase().startsWith("DISTINCT")) {
        return `GROUP_CONCAT(${expr})`;
      } else {
        return `GROUP_CONCAT(${expr}, '${sep}')`;
      }
    }
  );

  query = query.replace(/\bNOW\(\)/gi, "datetime('now')");
  query = query.replace(/\bINSERT\s+IGNORE\b/gi, "INSERT OR IGNORE");
  query = query.replace(/\bREPLACE\s+INTO\b/gi, "INSERT OR REPLACE INTO");

  query = query.replace(/\s+ON DUPLICATE KEY UPDATE[\s\S]+/gi, "");

  query = query.replace(
    /\bINT\s+PRIMARY\s+KEY\s+AUTO_INCREMENT\b/gi,
    "INTEGER PRIMARY KEY AUTOINCREMENT"
  );
  query = query.replace(
    /\bINT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY\b/gi,
    "INTEGER PRIMARY KEY AUTOINCREMENT"
  );
  query = query.replace(/\bAUTO_INCREMENT\b/gi, "");

  query = query.replace(/\bTINYINT\(1\)\b/gi, "BOOLEAN");
  query = query.replace(/\bINT\(\d+\)\b/gi, "INTEGER");
  query = query.replace(/\bUNSIGNED\b/gi, "");

  query = query.replace(/\s+ENGINE\s*=\s*\w+/gi, "");
  query = query.replace(/\s+DEFAULT\s+CHARSET\s*=\s*\w+/gi, "");
  query = query.replace(/\s+COLLATE\s*=\s*\w+/gi, "");
  query = query.replace(/\s+ON UPDATE CURRENT_TIMESTAMP/gi, "");
  query = query.replace(/\bCURDATE\(\)/gi, "date('now')");
  query = query.replace(/\bUNIX_TIMESTAMP\(\)/gi, "strftime('%s', 'now')");
  query = query.replace(/\bFROM_UNIXTIME\s*\(([^)]+)\)/gi, "datetime($1, 'unixepoch')");
  query = query.replace(/\bCONCAT\s*\(([^)]+)\)/gi, (match, p1) => {
    return p1.split(/\s*,\s*/).join(" || ");
  });
  query = query.replace(/\bIFNULL\s*\(/gi, "ifnull(");
  query = query.replace(/\bDATEDIFF\s*\(([^,]+),\s*([^)]+)\)/gi, "(julianday($1) - julianday($2))");
  query = query.replace(/\bDATE_FORMAT\s*\(([^,]+),\s*(['"])([^'"]+)\2\s*\)/gi, "strftime('$3', $1)");
  query = query.replace(/\bRAND\(\)/gi, "(abs(random()) / 9223372036854775807.0)");
  query = query.replace(/\bSUBSTRING\s*\(/gi, "substr(");
  query = query.replace(/\bLCASE\s*\(/gi, "lower(");
  query = query.replace(/\bUCASE\s*\(/gi, "upper(");
  query = query.replace(/\bIF\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/gi, "CASE WHEN $1 THEN $2 ELSE $3 END");

  query = query.replace(/CAST\s*\(([^)]+)\s+AS\s+(CHAR|VARCHAR)\)/gi, 'CAST($1 AS TEXT)');
  query = query.replace(/CAST\s*\(([^)]+)\s+AS\s+(\w+)\)/gi, 'CAST($1 AS $2)');

  if (query.toUpperCase().startsWith("DESCRIBE ")) {
    const parts = query.split(/\s+/);
    const tableName = parts[1].replace(/;$/, "");
    return `PRAGMA table_info(${tableName});`;
  }
  if (query.toUpperCase().startsWith("SHOW TABLES")) {
    return `SELECT name FROM sqlite_master WHERE type='table';`;
  }
  if (query.toUpperCase().startsWith("SHOW COLUMNS FROM")) {
    const parts = query.split(/\s+/);
    const tableName = parts[3].replace(/;$/, "");
    return `PRAGMA table_info(${tableName});`;
  }
  if (query.toUpperCase().startsWith("SHOW CREATE TABLE")) {
    const parts = query.split(/\s+/);
    const tableName = parts[3].replace(/;$/, "");
    return `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
  }
  if (query.toUpperCase().startsWith("SHOW DATABASES")) {
    return "SELECT 'main' AS Database;";
  }
  if (query.toUpperCase().startsWith("USE ")) {
    return `-- USE command ignored in SQLite.`;
  }
  if (
    query.toUpperCase().startsWith("CREATE DATABASE") ||
    query.toUpperCase().startsWith("DROP DATABASE")
  ) {
    return `-- DATABASE commands are not supported in SQLite.`;
  }
  if (
    query.toUpperCase().startsWith("ALTER TABLE") &&
    query.toUpperCase().includes("ADD FOREIGN KEY")
  ) {
    return `-- FOREIGN KEY constraints must be added inside CREATE TABLE in SQLite.`;
  }

  return query;
};

(async () => {
  try {
    const SQL = await initSqlJs({
      locateFile: file => `/${file}`
    });

    const db = new SQL.Database();

    db.run("PRAGMA foreign_keys = ON;");

    db.run(`CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            department_id INTEGER,
            position TEXT,
            salary INTEGER
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            location TEXT
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            start_date TEXT,
            end_date TEXT
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS employee_projects (
            employee_id INTEGER,
            project_id INTEGER,
            assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (project_id) REFERENCES projects(id)
        );`);

    console.log("Created sample tables.");

    // MySQL query example
    const mysqlQuery = `
            WITH employee_project_summary AS (
                SELECT
                    ep.employee_id,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'project_name', p.name,
                            'start_date', p.start_date,
                            'end_date', p.end_date
                        )
                    ) AS projects
                FROM employee_projects ep
                JOIN projects p ON ep.project_id = p.id
                GROUP BY ep.employee_id
            )
            SELECT
                e.id AS employee_id,
                e.first_name,
                e.last_name,
                e.position,
                e.salary,
                d.name AS department_name,
                d.location AS department_location,
                eps.projects AS assigned_projects,
                COUNT(e.id) OVER() AS total_employees,
                GROUP_CONCAT(e.first_name ORDER BY e.salary DESC SEPARATOR ', ') AS salary_ranked_names
            FROM employees e
            INNER JOIN departments d ON e.department_id = d.id
            LEFT JOIN employee_project_summary eps ON e.id = eps.employee_id
            RIGHT JOIN projects p ON 1 = 1
            GROUP BY e.id, d.id, eps.projects WITH ROLLUP
            ORDER BY d.name ASC, e.salary DESC
            LIMIT 10 OFFSET 5;
        `;

    console.log("Original MySQL Query:");
    console.log(mysqlQuery);

    const convertedQuery = convertMySQLtoSQLite(mysqlQuery);
    console.log("Converted Query:");
    console.log(convertedQuery);

    try {
      const result = db.exec(convertedQuery);
      console.log("Query Result:", result);
    } catch (error) {
      console.error("Query execution error:", error);
    }
  } catch (error) {
    console.error('Error initializing SQL.js:', error);
  }
})();
