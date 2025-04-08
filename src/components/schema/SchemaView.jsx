import React, { useContext, useEffect, useState } from 'react';
import { DatabaseContext } from '../../context/DatabaseContext';

const SchemaView = () => {
  const { db } = useContext(DatabaseContext);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      setLoading(true);
      try {
        // Get all tables
        const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

        if (tablesResult.length > 0) {
          const tableNames = tablesResult[0].values.map(row => row[0]);

          // Get schema information for each table
          const tableData = tableNames.map(name => {
            // Get column information
            const columnsResult = db.exec(`PRAGMA table_info(${name})`);
            const columns = columnsResult.length > 0
              ? columnsResult[0].values.map(col => ({
                  name: col[1],
                  type: col[2],
                  notNull: col[3] === 1,
                  defaultValue: col[4],
                  primaryKey: col[5] === 1
                }))
              : [];

            // Get foreign key information
            const fkResult = db.exec(`PRAGMA foreign_key_list(${name})`);
            const foreignKeys = fkResult.length > 0
              ? fkResult[0].values.map(fk => ({
                  id: fk[0],
                  columnName: fk[3],
                  refTable: fk[2],
                  refColumn: fk[4]
                }))
              : [];

            return {
              name,
              columns,
              foreignKeys
            };
          });

          setTables(tableData);
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [db]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading schema information...</p>
      </div>
    );
  }

  return (
    <div className="schema-container">
      {tables.map((table, index) => (
        <div key={table.name} className="schema-table" style={{ animationDelay: `${index * 0.1}s` }}>
          <h3>{table.name}</h3>
          <div>
            {table.columns.map(col => {
              const isForeignKey = table.foreignKeys.some(fk => fk.columnName === col.name);

              return (
                <div key={col.name} className="schema-column">
                  <div className={`column-name ${col.primaryKey ? 'primary-key' : ''} ${isForeignKey ? 'foreign-key' : ''}`}>
                    {col.name}
                    {col.notNull && !col.primaryKey && <span style={{ color: 'rgba(255, 87, 87, 0.7)', marginLeft: '4px' }}>*</span>}
                  </div>
                  <div className="column-type">
                    {col.type}
                    {col.defaultValue && <span style={{ marginLeft: '4px', fontSize: '0.7rem' }}>(default: {col.defaultValue})</span>}
                  </div>
                </div>
              );
            })}

            {table.foreignKeys.length > 0 && (
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.5rem' }}>Foreign Keys:</div>
                {table.foreignKeys.map((fk, idx) => (
                  <div key={idx} style={{ fontSize: '0.8125rem', marginBottom: '0.25rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <span style={{ color: '#90caf9' }}>{fk.columnName}</span> → <span style={{ color: '#ffcb6b' }}>{fk.refTable}</span>.<span style={{ color: '#f78c6c' }}>{fk.refColumn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchemaView;
