'use client';
import React from 'react';
import { format as formatSQL } from 'sql-formatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

/**
 * Component: FormattedQueryViewer
 * Purpose: Formats SQL (MySQL/Postgres) or MongoDB queries for readability.
 */
const FormattedQueryViewer = ({ query = '', dbType = 'mysql' }) => {
    // Format query according to database type
    const formatQuery = (queryText, type) => {
        if (!queryText) return '';

        try {
            const lowerType = type.toLowerCase();

            if (lowerType === 'mysql' || lowerType === 'sql' || lowerType === 'postgres') {
                // Use sql-formatter for SQL-like queries
                return formatSQL(queryText, { language: 'mysql' });
            }

            if (lowerType === 'mongodb' || lowerType === 'mql') {
                // Simple beautifier for MongoDB JSON queries
                return queryText
                    .replace(/,/g, ',\n')
                    .replace(/{/g, '{\n')
                    .replace(/}/g, '\n}');
            }

            return queryText;
        } catch (err) {
            console.error('Error formatting query:', err);
            return queryText; // fallback if formatting fails
        }
    };

    const formattedQuery = formatQuery(query, dbType);

    return (
        <SyntaxHighlighter
            language={dbType === 'mysql' ? 'sql' : 'javascript'}
            style={dracula}
            wrapLines={true}
            customStyle={{
                padding: '16px',
                borderRadius: '24px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            }}
        >
            {formattedQuery}
        </SyntaxHighlighter>
    );
};

export default FormattedQueryViewer;
