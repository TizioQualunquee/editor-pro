document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const editor = document.getElementById('editor');
    const menuBtns = document.querySelectorAll('.menu-btn');
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const searchPanel = document.getElementById('search-panel');
    const closeSearchBtn = document.getElementById('close-search');

    // Stats Elements
    const linesCount = document.getElementById('lines-count');
    const wordsCount = document.getElementById('words-count');
    const charsCount = document.getElementById('chars-count');
    const charsNoSpaceCount = document.getElementById('chars-nospace-count');
    const paragraphsCount = document.getElementById('paragraphs-count');

    // State
    let activeMenu = null;

    // --- Stats Logic ---
    function updateStats() {
        const text = editor.value;

        // Lines
        const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
        linesCount.textContent = lines;

        // Words
        const words = text ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
        wordsCount.textContent = words;

        // Chars
        const chars = text ? text.length : 0;
        charsCount.textContent = chars;

        // Chars (No Spaces)
        const charsNoSpace = text ? text.replace(/\s/g, '').length : 0;
        charsNoSpaceCount.textContent = charsNoSpace;

        // Paragraphs
        const paragraphs = text ? text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length : 0;
        paragraphsCount.textContent = paragraphs;
    }

    editor.addEventListener('input', updateStats);

    // --- Menu Logic ---
    // Toggle dropdowns
    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menuId = btn.getAttribute('data-menu');
            const dropdown = document.getElementById(`menu-${menuId}`);

            // Close others
            dropdowns.forEach(d => {
                if (d !== dropdown) d.style.display = 'none';
            });

            // Toggle current
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                activeMenu = null;
            } else {
                dropdown.style.display = 'block';
                activeMenu = menuId;
            }
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(d => d.style.display = 'none');
        activeMenu = null;
    });

    // Handle Menu Actions
    document.querySelectorAll('.dropdown-content button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action');
            handleAction(action);
            // Close menu
            dropdowns.forEach(d => d.style.display = 'none');
            activeMenu = null;
        });
    });

    function handleAction(action) {
        const text = editor.value;

        switch (action) {
            case 'new':
                if (confirm('Clear editor? Unsaved changes will be lost.')) {
                    editor.value = '';
                    updateStats();
                }
                break;
            case 'open':
                alert('Open functionality requires backend or file API implementation.');
                break;
            case 'save':
                alert('Save functionality requires backend or file API implementation.');
                break;
            case 'undo':
                document.execCommand('undo');
                break;
            case 'redo':
                document.execCommand('redo');
                break;
            case 'cut':
                document.execCommand('cut'); // May require permission
                break;
            case 'copy':
                document.execCommand('copy');
                break;
            case 'paste':
                navigator.clipboard.readText().then(clipText => {
                    // Simple append for now, real editor would insert at cursor
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    editor.value = text.substring(0, start) + clipText + text.substring(end);
                    updateStats();
                });
                break;
            case 'select-all':
                editor.select();
                break;
            case 'find-replace':
                searchPanel.classList.remove('hidden');
                break;
            case 'zoom-in':
                // Simple font size zoom
                let currentSize = parseFloat(window.getComputedStyle(editor).fontSize);
                editor.style.fontSize = (currentSize + 2) + 'px';
                break;
            case 'zoom-out':
                let currentSizeOut = parseFloat(window.getComputedStyle(editor).fontSize);
                editor.style.fontSize = (currentSizeOut - 2) + 'px';
                break;
            case 'reset-zoom':
                editor.style.fontSize = '18px';
                break;
            case 'word-count':
                alert(`Words: ${wordsCount.textContent}\nChars: ${charsCount.textContent}`);
                break;
            case 'sort-asc':
                editor.value = text.split('\n').sort().join('\n');
                updateStats();
                break;
            case 'sort-desc':
                editor.value = text.split('\n').sort().reverse().join('\n');
                updateStats();
                break;
            case 'trim':
                editor.value = text.split('\n').map(l => l.trim()).join('\n');
                updateStats();
                break;
            case 'uppercase':
                editor.value = text.toUpperCase();
                updateStats();
                break;
            case 'lowercase':
                editor.value = text.toLowerCase();
                updateStats();
                break;
            case 'capitalize':
                editor.value = text.replace(/\b\w/g, l => l.toUpperCase());
                updateStats();
                break;
            default:
                console.log('Action not implemented:', action);
        }
    }

    // --- Search & Replace Logic ---
    closeSearchBtn.addEventListener('click', () => {
        searchPanel.classList.add('hidden');
    });

    const findInput = document.getElementById('find-input');
    const replaceInput = document.getElementById('replace-input');
    const regexToggle = document.getElementById('regex-toggle');
    const replaceBtn = document.getElementById('replace-btn');
    const replaceAllBtn = document.getElementById('replace-all-btn');

    function performReplace(all = false) {
        const search = findInput.value;
        const replacement = replaceInput.value;
        const useRegex = regexToggle.checked;
        let text = editor.value;

        if (!search) return;

        if (useRegex) {
            try {
                const regex = new RegExp(search, all ? 'g' : '');
                editor.value = text.replace(regex, replacement);
            } catch (e) {
                alert('Invalid Regular Expression');
            }
        } else {
            if (all) {
                editor.value = text.split(search).join(replacement);
            } else {
                editor.value = text.replace(search, replacement);
            }
        }
        updateStats();
    }

    replaceBtn.addEventListener('click', () => performReplace(false));
    replaceAllBtn.addEventListener('click', () => performReplace(true));
});
