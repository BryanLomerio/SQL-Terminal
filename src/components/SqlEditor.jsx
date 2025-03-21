import React, { useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import { Play, Database, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { TbDatabaseEdit } from "react-icons/tb";

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
// copy
  const copyQuery = () => {
    console.log('Copy clicked, query:', query);
    navigator.clipboard.writeText(query)
      .then(() => {
        console.log('Query copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy query:', err);
      });
  };


  return (
    <div className="editor-container" ref={editorRef}>
      <div className="editor-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <TbDatabaseEdit/>
          <span className="editor-title" style={{ marginLeft: '8px' }}>SQL Query Editor</span>
        </div>

        <Copy
          size={18}
          onClick={copyQuery}
          style={{ cursor: 'pointer' }}
          title="Copy query to clipboard"
        />
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
