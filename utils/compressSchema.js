export function compressSchema(fullSchema) {
  const compressed = {};

  for (const tableName in fullSchema) {
    const columns = fullSchema[tableName];

    // MySQL returns an array of objects
    if (Array.isArray(columns)) {
      compressed[tableName] = columns.map(
        (col) => col.COLUMN_NAME || col.Field || col.name
      );
      continue;
    }

    // MongoDB or NoSQL returns key: type
    if (typeof columns === "object") {
      compressed[tableName] = Object.keys(columns);
      continue;
    }
  }

  return compressed;
}
