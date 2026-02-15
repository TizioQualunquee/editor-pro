import React, { useState, useEffect, useRef } from 'react';

const MenuBar = ({ onAction }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  const menus = {
    File: ['New', 'Open', 'Save', 'Export', 'Print'],
    Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All', 'Find & Replace'],
    View: ['Zoom In', 'Zoom Out', 'Reset Zoom', 'Toggle Fullscreen'],
    Tools: ['Word Count', 'Sort Lines (Asc)', 'Sort Lines (Desc)', 'Trim Spaces'],
    Text: ['Uppercase', 'Lowercase', 'Capitalize'],
    Format: ['Bold', 'Italic', 'Underline', 'Strikethrough'],
    Help: ['About', 'Shortcuts', 'Documentation']
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleItemClick = (action) => {
    if (onAction) {
      onAction(action);
    }
    setActiveMenu(null);
  };

  return (
    <div className="w-full bg-[#e5e5e4] border-b border-[#d4d4d4] text-[#1c1917] text-sm select-none" ref={menuRef}>
      <div className="flex items-center px-2">
        {Object.keys(menus).map((menuName) => (
          <div key={menuName} className="relative">
            <button
              className={`px-3 py-1.5 hover:bg-[#d4d4d4] focus:outline-none ${activeMenu === menuName ? 'bg-[#d4d4d4]' : ''}`}
              onClick={() => handleMenuClick(menuName)}
            >
              {menuName}
            </button>
            {activeMenu === menuName && (
              <div className="absolute left-0 top-full w-48 bg-white border border-[#d4d4d4] shadow-none z-50 py-1">
                {menus[menuName].map((item) => (
                  <button
                    key={item}
                    className="block w-full text-left px-4 py-1.5 hover:bg-[#f5f5f4] text-xs"
                    onClick={() => handleItemClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;
