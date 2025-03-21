import React, { useMemo, useEffect, useRef, useState } from 'react';
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
  const [copied, setCopied] = useState(false);

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

  const copyQuery = () => {
    navigator.clipboard.writeText(query)
      .then(() => {
        console.log('Query copied to clipboard!');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy query:', err);
      });
  };

  return (
    <div className="editor-container" ref={editorRef} style={{ overflow: 'visible' }}>
      <div
        className="editor-header"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TbDatabaseEdit size={20} />
          <span className="editor-title" style={{ marginLeft: '8px' }}>SQL Query Editor</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Copy
            size={18}
            onClick={copyQuery}
            style={{
              cursor: 'pointer',
              color: copied ? '#9825F8' : 'inherit'
            }}
            title="Copy query to clipboard"
          />
          {copied && (
            <div
              style={{
                position: 'absolute',
                top: '-25px',
                right: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              Copied!
            </div>
          )}
        </div>
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
      <div className='flex justify-between border-t border-[rgba(255,255,255,0.05)]'>
      <div
        style={{
          padding: '8px 16px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.5)',

        }}
      >
        Press Ctrl+Enter to execute
      </div>
      <div
        style={{
          padding: '8px 16px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.5)',

        }}
      >
      Created by: AninoDev
      </div>
      </div>

    </div>
  );
};

SqlEditor.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
};

export default SqlEditor;
