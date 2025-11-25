'use client';
import React from 'react';
import { format as formatSQL } from 'sql-formatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CopyQuery from './CopyQuery';

const FormattedQueryViewer = ({ query = '', dbType = 'mysql' }) => {

    const formatQuery = (queryText, type) => {
        if (!queryText) return '';

        const lowerType = type.toLowerCase();

        try {
            // ---------------------------
            // SQL Formatting
            // ---------------------------
            if (['mysql', 'postgres', 'sql'].includes(lowerType)) {
                return formatSQL(queryText, {
                    language: lowerType === 'postgres' ? 'postgresql' : 'mysql',
                });
            }

            // ---------------------------
            // MongoDB Formatting
            // ---------------------------
            if (['mongodb', 'mql', 'mongo'].includes(lowerType)) {
                try {
                    // Attempt JSON prettify
                    const parsed = JSON.parse(queryText);
                    return JSON.stringify(parsed, null, 2);
                } catch {
                    // Fallback if query is not valid JSON object
                    return queryText
                        .replace(/({|\[)/g, '$1\n')
                        .replace(/(}|\])/g, '\n$1')
                        .replace(/,/g, ',\n')
                        .replace(/\n\s*\n/g, '\n');
                }
            }

            // Default fallback
            return queryText;

        } catch (err) {
            console.error('Query formatting failed:', err);
            return queryText;
        }
    };

    const formattedQuery = formatQuery(query, dbType);

    // Determine syntax highlighting language
    const highlightLang = ['mysql', 'postgres', 'sql'].includes(dbType.toLowerCase())
        ? 'sql'
        : 'javascript';

    return (
        <div className='h-auto w-full relative'>
            <SyntaxHighlighter
                language={highlightLang}
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

            {/* copy query component */}
            <CopyQuery query={formattedQuery} />

        </div>
    );
};

export default FormattedQueryViewer;
