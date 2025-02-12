import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';

const SchemaDiagram = () => {
  const { db } = useContext(DatabaseContext);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    if (db) {
      const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table'");

      if (tablesResult.length > 0) {

        const tableNames = tablesResult[0].values.map(row => row[0]);

        const tableData = tableNames.map(name => {
          const infoResult = db.exec(`PRAGMA table_info(${name})`);
          const columns = infoResult.length > 0 ? infoResult[0].values : [];
          return { name, columns };
        });

        setTables(tableData);
      }
    }
  }, [db]);

  return (
    <div>
      {tables.map(table => (
        <div key={table.name} style={{ marginBottom: '20px' }}>
          <h3>{table.name}</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Not Null</th>
                <th>Default Value</th>
                <th>Primary Key</th>
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col, index) => (
                <tr key={index}>
                  <td>{col[1]}</td><td>{col[2]}</td><td>{col[3] ? 'Yes' : 'No'}</td><td>{col[4] || ''}</td><td>{col[5] ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default SchemaDiagram;
