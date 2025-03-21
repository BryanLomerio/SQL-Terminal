import React, { useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { Play, Database } from 'lucide-react';
import { Button } from './ui/button';

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
    },
    'function': {
      pattern: /\b\w+(?=\()/i,
      alias: 'function'
    }
  });
}

const SqlEditor = ({ query, setQuery }) => {
  const editorRef = useRef(null);

  const highlightCode = useMemo(() => {
    return (code) => {
      const grammar = Prism.languages.sql || Prism.languages.markup;
      return Prism.highlight(code, grammar, 'sql');
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const editorElement = editorRef.current.querySelector('textarea');
      if (editorElement) {
        setTimeout(() => {
          editorElement.focus();
        }, 100);
      }
    }
  }, []);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('execute-query');
        window.dispatchEvent(event);
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setQuery(query.substring(0, start) + '  ' + query.substring(end));
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="editor-container" ref={editorRef}>
      <div className="editor-header">
        <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 4.5H12.5V3.5C12.5 2.94772 12.0523 2.5 11.5 2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H4.5V13.5C4.5 14.0523 4.94772 14.5 5.5 14.5H13.5C14.0523 14.5 14.5 14.0523 14.5 13.5V5.5C14.5 4.94772 14.0523 4.5 13.5 4.5ZM3.5 11.5V3.5H11.5V4.5H5.5C4.94772 4.5 4.5 4.94772 4.5 5.5V11.5H3.5ZM13.5 13.5H5.5V5.5H13.5V13.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
        <span className="editor-title">SQL Query Editor</span>
      </div>

      <Editor
        value={query}
        onValueChange={setQuery}
        highlight={highlightCode}
        padding={16}
        onKeyDown={handleKeyDown}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '14px',
          minHeight: '150px',
          background: 'transparent',
          cursor: 'text',
        }}
        className="editor-textarea"
        textareaClassName="focus:outline-none"
        placeholder="Enter your SQL query here..."
      />
      <div style={{ padding: '8px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        Press Ctrl+Enter to execute
      </div>
    </div>
  );
};

SqlEditor.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
};

export default SqlEditor;
