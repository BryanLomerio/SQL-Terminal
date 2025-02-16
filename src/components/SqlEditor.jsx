import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript'; 
import 'prismjs/themes/prism-tomorrow.css';

import React, { useMemo } from 'react';
import Editor from 'react-simple-code-editor';

if (Prism.languages.sql) {
  Prism.languages.insertBefore('sql', 'keyword', {
    'table-name': {
      pattern: /((?:FROM|JOIN|INTO|UPDATE)\s+)(`?\w+`?)/i,
      lookbehind: true,
      alias: 'table-name'
    },
    'column-name': {
      pattern: /(\.)\w+/,
      lookbehind: true,
      alias: 'column-name'
    }
  });
}

const CodeEditor = ({ query, setQuery, language = 'sql' }) => {
  const highlightCode = useMemo(() => (code) => {
    const grammar = Prism.languages[language] || Prism.languages.sql;
    return Prism.highlight(code, grammar, language);
  }, [language]);

  return (
    <Editor
      value={query}
      onValueChange={setQuery}
      highlight={highlightCode}
      padding={10}
      style={{
        fontFamily: '"Fira Code", "Fira Mono", monospace',
        fontSize: 16,
        backgroundColor: '#1e1e1e',
        color: '#eee',
        border: '1px solid #444',
        minHeight: '120px',
      }}
    />
  );
};

export default CodeEditor;
