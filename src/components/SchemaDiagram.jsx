import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';

const SchemaDiagram = () => {
  const { db } = useContext(DatabaseContext);
  const [schema, setSchema] = useState([]);

  useEffect(() => {
    if (!db) return;

    const query = `
      SELECT 
        m.name as table_name, 
        p.name as column_name,
        p.type,
        p.pk as is_primary_key,
        fkl."table" as foreign_table,
        fkl."to" as foreign_column
      FROM sqlite_master AS m
      JOIN pragma_table_info(m.name) AS p
      LEFT JOIN pragma_foreign_key_list(m.name) AS fkl
        ON p.cid = fkl."from"
      WHERE m.type = 'table'
      ORDER BY m.name, p.cid
    `;

    try {
      const results = db.exec(query);
      if (results.length > 0) {
        const columns = results[0].columns;
        const values = results[0].values;

        // schema
        const schemaData = values.reduce((acc, row) => {
          const tableName = row[columns.indexOf('table_name')];
          const column = {
            name: row[columns.indexOf('column_name')],
            type: row[columns.indexOf('type')],
            isPrimary: !!row[columns.indexOf('is_primary_key')],
            foreignTable: row[columns.indexOf('foreign_table')],
            foreignColumn: row[columns.indexOf('foreign_column')]
          };

          const tableIndex = acc.findIndex(t => t.tableName === tableName);
          if (tableIndex === -1) {
            acc.push({
              tableName,
              columns: [column]
            });
          } else {
            acc[tableIndex].columns.push(column);
          }
          return acc;
        }, []);
        setSchema(schemaData);
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  }, [db]);

  return (
    <div className="schema-diagram">
      {schema.map((table, idx) => (
        <div key={idx} className="schema-table">
          <h3>{table.tableName}</h3>
          <ul>
            {table.columns.map((col, i) => (
              <li
                key={i}
                className={`schema-column ${col.isPrimary ? 'primary' : ''}`}
              >
                {col.name} <span className="column-type">({col.type})</span>
                {col.foreignTable && (
                  <span className="foreign-key">
                    {' '}
                    → {col.foreignTable}.{col.foreignColumn}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SchemaDiagram;
