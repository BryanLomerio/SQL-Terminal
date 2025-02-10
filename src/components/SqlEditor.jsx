import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';

const SqlEditor = ({ query, setQuery }) => {
  return (
    <Editor
      value={query}
      onValueChange={setQuery}
      highlight={(code) => Prism.highlight(code, Prism.languages.sql, 'sql')}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 16,
        backgroundColor: '#1e1e1e',
        color: '#eee',
        border: '1px solid #444',
        minHeight: '120px',
      }}
    />
  );
};

export default SqlEditor;
