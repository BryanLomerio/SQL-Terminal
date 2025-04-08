import { convertMySQLtoSQLite } from '../utils/convertQuery';

export function executeDatabaseQuery(db, query, updateDatabaseStorage) {
    let resultData = { results: [], message: "", tableTitle: "" };

    if (!db) {
        console.error("Database is not loaded");
        resultData.message = "Database is not loaded yet.";
        return resultData;
    }

    try {
        const convertedQuery = convertMySQLtoSQLite(query);
        const match = convertedQuery.match(/FROM\s+(\w+)/i);
        resultData.tableTitle = match ? match[1] : '';

        let columns = [];
        const upperQuery = convertedQuery.trim().toUpperCase();

        if (upperQuery.startsWith('SELECT')) {
            const tableMatch = convertedQuery.match(/FROM\s+(\w+)/i);
            if (tableMatch) {
                const tableName = tableMatch[1];
                const tableExists = db.exec(
                    `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
                );

                if (tableExists.length > 0) {
                    const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
                    if (tableInfo.length > 0) {
                        columns = tableInfo[0].values.map(col => col[1]);
                    }
                }
            }
        }
        const queryResult = db.exec(convertedQuery);

        // Update database
        if (
            upperQuery.startsWith("CREATE TABLE") ||
            upperQuery.startsWith("DROP TABLE") ||
            upperQuery.startsWith("ALTER TABLE") ||
            upperQuery.startsWith("INSERT") ||
            upperQuery.startsWith("UPDATE") ||
            upperQuery.startsWith("DELETE") ||
            upperQuery.startsWith("TRUNCATE")
        ) {
            updateDatabaseStorage();
        }

        //  messages and results
        if (upperQuery.startsWith("CREATE TABLE")) {
            resultData.message = "Table created successfully.";
        } else if (upperQuery.startsWith("DROP TABLE")) {
            resultData.message = "Table dropped successfully.";
        } else if (upperQuery.startsWith("ALTER TABLE")) {
            resultData.message = "Table altered successfully.";
        } else if (upperQuery.startsWith("DELETE FROM")) {
            resultData.message = "Records deleted successfully.";
            if (columns.length > 0) {
                resultData.results = [{ columns, values: [] }];
            }
        } else if (upperQuery.startsWith("TRUNCATE TABLE")) {
            resultData.message = "Table truncated successfully.";
            if (columns.length > 0) {
                resultData.results = [{ columns, values: [] }];
            }
        } else if (upperQuery.startsWith("INSERT") || upperQuery.startsWith("UPDATE")) {
            resultData.message = "Operation completed successfully.";
            resultData.results = queryResult.length > 0 ? queryResult : [];
        } else {
            if (queryResult.length === 0 && columns.length > 0) {
                resultData.results = [{ columns, values: [] }];
            } else if (queryResult.length === 0) {
                if (!upperQuery.startsWith("CREATE TABLE")) {
                    resultData.message = "Table does not exist.";
                }
            } else {
                resultData.results = queryResult;
            }
        }

    } catch (error) {
        console.error("Query execution error:", error);
        resultData.message = "Error executing query: " + error.message;
    }

    return resultData;
}
