'use client';
import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from "@codemirror/view";
import { sql } from '@codemirror/lang-sql';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { format as formatSQL } from "sql-formatter";

/**
 * Format MongoDB / JSON input with indentation
 */
const formatMongo = (str) => {
    try {
        return JSON.stringify(JSON.parse(str), null, 4);
    } catch {
        return str; // If invalid JSON → return unchanged
    }
};

/**
 * Returns formatted query based on DB type
 * SQL → sql-formatter
 * MongoDB → pretty JSON
 */
const getFormattedQuery = (query, dbType) => {
    if (!query) return "";

    try {
        const type = dbType.toLowerCase();

        // SQL Formatting
        if (["sql", "mysql", "postgres", "postgresql"].includes(type)) {
            return formatSQL(query);
        }

        // MongoDB / JSON formatting
        if (["mongo", "mongodb"].includes(type)) {
            return formatMongo(query);
        }

        // Fallback (no formatting)
        return query;

    } catch {
        return query;
    }
};

/**
 * Component: QueryEditor
 * ----------------------
 * A fully featured code editor with:
 * - CodeMirror editor
 * - SQL / MongoDB syntax
 * - Auto formatting on load
 * - Dracula theme
 * - Padding styling
 * - Save & Cancel actions
 */
const QueryEditor = ({ value, onChange, onSave, onCancel, dbType = "sql" }) => {

    /**
     * Memoized formatted query
     * • Runs only when query or DB type changes
     * • Prevents unnecessary reformatting
     */
    const formattedValue = useMemo(
        () => getFormattedQuery(value, dbType),
        [value, dbType]
    );

    /**
     * Select correct language mode (SQL or JS/JSON)
     */
    const extensions =
        ["mysql", "postgres", "sql"].includes(dbType.toLowerCase())
            ? [sql()]          // SQL mode
            : [javascript()];  // MongoDB mode (JS/JSON syntax)

    return (
        <div className="h-fit mt-2 flex flex-col gap-2 w-full">

            {/* CodeMirror Editor */}
            <CodeMirror
                value={formattedValue}      // Auto-formatted query
                theme={dracula}             // Dracula theme
                extensions={[
                    ...extensions,

                    // Add padding inside editor using theme override
                    EditorView.theme({
                        ".cm-content": {
                            padding: "16px !important",
                        },
                        ".cm-scroller": {
                            padding: "0 !important",
                        }
                    })
                ]}
                onChange={(val) => onChange(val)}  // Send edited text up
                style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    fontSize: "14px",
                }}
            />

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">

                {/* cancel edit */}
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-zinc-100 rounded-3xl text-sm font-semibold hover:bg-zinc-50 cursor-pointer transition-all duration-300"
                >
                    Cancel
                </button>

                {/* save edited query */}
                <button
                    onClick={onSave}
                    className="px-4 py-2 bg-violet-600 text-white rounded-3xl text-sm font-semibold hover:bg-violet-700 cursor-pointer transition-all duration-300"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default QueryEditor;
