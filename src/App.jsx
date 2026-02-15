import React, { useState, useMemo } from 'react';
import MenuBar from './components/MenuBar';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import SearchReplace from './components/SearchReplace';
import * as TextStats from './utils/textStats';
import * as TextTransform from './utils/textTransform';

function App() {
  const [text, setText] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const stats = useMemo(() => ({
    words: TextStats.countWords(text),
    chars: TextStats.countChars(text),
    charsNoSpaces: TextStats.countCharsNoSpaces(text),
    lines: TextStats.countLines(text),
    paragraphs: TextStats.countParagraphs(text)
  }), [text]);

  const handleAction = (action) => {
    switch (action) {
      case 'New':
        if (confirm("Are you sure you want to clear the editor?")) {
          setText("");
        }
        break;
      case 'Uppercase':
        setText(TextTransform.toUpperCase(text));
        break;
      case 'Lowercase':
        setText(TextTransform.toLowerCase(text));
        break;
      case 'Capitalize':
        setText(TextTransform.capitalize(text));
        break;
      case 'Trim Spaces':
        setText(TextTransform.trimSpaces(text));
        break;
      case 'Sort Lines (Asc)':
        setText(TextTransform.sortLines(text, 'asc'));
        break;
      case 'Sort Lines (Desc)':
        setText(TextTransform.sortLines(text, 'desc'));
        break;
      case 'Find & Replace':
        setShowSearch(true);
        break;
      default:
        console.log(`Action ${action} not implemented yet.`);
    }
  };

  const handleReplace = (search, replace, useRegex) => {
      if (!search) return;
      if (useRegex) {
          try {
              const regex = new RegExp(search);
              setText(text.replace(regex, replace));
          } catch {
              alert("Invalid Regex");
          }
      } else {
          setText(text.replace(search, replace));
      }
  };

  const handleReplaceAll = (search, replace, useRegex) => {
      setText(TextTransform.replaceText(text, search, replace, useRegex));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f4] text-[#1c1917] font-sans relative overflow-hidden">
      <MenuBar onAction={handleAction} />
      {showSearch && (
        <div className="absolute top-12 right-8 z-50">
             <SearchReplace
                onReplace={handleReplace}
                onReplaceAll={handleReplaceAll}
                onClose={() => setShowSearch(false)}
             />
        </div>
      )}
      <Editor value={text} onChange={setText} />
      <StatusBar stats={stats} />
    </div>
  );
}

export default App;
