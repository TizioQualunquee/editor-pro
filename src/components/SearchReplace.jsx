import React, { useState } from 'react';

const SearchReplace = ({ onReplace, onReplaceAll, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [useRegex, setUseRegex] = useState(false);

  return (
    <div className="absolute top-10 right-4 bg-white border border-[#d4d4d4] p-4 shadow-sm z-50 w-80 text-sm text-[#1c1917]">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">Find & Replace</span>
        <button onClick={onClose} className="text-[#78716c] hover:text-[#1c1917] text-lg font-bold">&times;</button>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Find..."
          className="w-full border border-[#d4d4d4] px-2 py-1.5 bg-[#f5f5f4] outline-none focus:border-[#a8a29e]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Replace with..."
          className="w-full border border-[#d4d4d4] px-2 py-1.5 bg-[#f5f5f4] outline-none focus:border-[#a8a29e]"
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
        />
        <div className="flex items-center space-x-2 text-xs">
          <input
            type="checkbox"
            id="regex"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
            className="accent-[#78716c]"
          />
          <label htmlFor="regex">Regular Expression</label>
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => onReplace(searchTerm, replaceTerm, useRegex)}
            className="flex-1 bg-[#e5e5e4] hover:bg-[#d4d4d4] py-1.5 transition-colors"
          >
            Replace
          </button>
          <button
            onClick={() => onReplaceAll(searchTerm, replaceTerm, useRegex)}
            className="flex-1 bg-[#1c1917] text-white hover:bg-[#292524] py-1.5 transition-colors"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchReplace;
