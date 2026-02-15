import React, { useRef } from 'react';

const Editor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-8 flex flex-col h-full overflow-hidden">
      <textarea
        ref={textareaRef}
        className="w-full h-full resize-none outline-none border-none bg-transparent text-lg leading-relaxed text-[#1c1917] placeholder:text-[#a8a29e] font-sans"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck="false"
      />
    </div>
  );
};

export default Editor;
