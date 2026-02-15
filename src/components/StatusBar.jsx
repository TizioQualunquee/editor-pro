import React from 'react';

const StatusBar = ({ stats }) => {
  return (
    <div className="w-full bg-[#e5e5e4] border-t border-[#d4d4d4] text-[#1c1917] text-xs py-1 px-4 flex justify-between items-center select-none">
      <div className="flex space-x-6">
        <span>Lines: {stats.lines}</span>
        <span>Words: {stats.words}</span>
        <span>Chars: {stats.chars}</span>
        <span>Chars (no space): {stats.charsNoSpaces}</span>
        <span>Paragraphs: {stats.paragraphs}</span>
      </div>
      <div>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default StatusBar;
