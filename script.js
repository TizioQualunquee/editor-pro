/**
 * EDITOR PRO - Advanced Web Notepad & Markdown Editor
 * Pure JavaScript, Client-side & Local-first
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // CONSTANTS & STATE
    // =========================================================================
    const STORAGE_KEY_NOTES = 'editor_pro_notes_v2';
    const STORAGE_KEY_ACTIVE_NOTE = 'editor_pro_active_note_id';
    const STORAGE_KEY_OPEN_TABS = 'editor_pro_open_tabs';
    const STORAGE_KEY_THEME = 'editor_pro_theme';
    const STORAGE_KEY_FONT = 'editor_pro_font';
    const STORAGE_KEY_CONFIG = 'editor_pro_config';

    const THEME_NAMES = {
        'clean-light': 'Clean Light',
        'sepia-paper': 'Warm Paper (Sepia)',
        'nordic-frost': 'Nordic Frost',
        'slate-dark': 'Slate Midnight',
        'pure-oled': 'OLED Pure Black',
        'dracula': 'Dracula',
        'nord-dark': 'Nord Deep',
        'cyberpunk': 'Cyberpunk Neon',
        'matcha-forest': 'Matcha / Forest',
        'solarized-dark': 'Solarized Dark'
    };

    const FONT_MAP = {
        'jetbrains': "'JetBrains Mono', monospace",
        'fira': "'Fira Code', monospace",
        'inter': "'Inter', sans-serif",
        'merriweather': "'Merriweather', serif",
        'system-mono': "Consolas, Monaco, 'Courier New', monospace"
    };

    const isMobile = () => window.innerWidth <= 768;

    // App State
    let notes = [];
    let activeNoteId = null;
    let openTabIds = [];
    let config = {
        showSidebar: !isMobile(),
        showPreview: false,
        showLineNumbers: true,
        wordWrap: true,
        spellcheck: false,
        theme: 'slate-dark',
        font: 'jetbrains',
        fontSize: 15
    };

    // DOM Elements
    const editor = document.getElementById('editor');
    const gutter = document.getElementById('line-numbers-gutter');
    const previewPane = document.getElementById('preview-pane');
    const previewContent = document.getElementById('preview-content');
    const editorWorkspace = document.getElementById('editor-workspace');
    const notesSidebar = document.getElementById('notes-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const notesList = document.getElementById('notes-list');
    const tabsList = document.getElementById('tabs-list');
    const notesSearchInput = document.getElementById('notes-search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const notesCountLabel = document.getElementById('notes-count-label');
    const saveIndicator = document.getElementById('save-status');

    // Mobile View Toggle
    const btnMobileEditor = document.getElementById('btn-mobile-show-editor');
    const btnMobilePreview = document.getElementById('btn-mobile-show-preview');

    // Search Panel
    const searchPanel = document.getElementById('search-panel');
    const findInput = document.getElementById('find-input');
    const replaceInput = document.getElementById('replace-input');
    const matchCaseToggle = document.getElementById('match-case-toggle');
    const regexToggle = document.getElementById('regex-toggle');
    const searchMatchCount = document.getElementById('search-match-count');
    const findNextBtn = document.getElementById('find-next-btn');
    const findPrevBtn = document.getElementById('find-prev-btn');
    const replaceBtn = document.getElementById('replace-btn');
    const replaceAllBtn = document.getElementById('replace-all-btn');
    const closeSearchBtn = document.getElementById('close-search');

    // Modals
    const tableModal = document.getElementById('table-modal');
    const statsModal = document.getElementById('stats-modal');
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const aboutModal = document.getElementById('about-modal');

    // Status Bar Elements
    const cursorPosLabel = document.getElementById('cursor-position-label');
    const selectionLabel = document.getElementById('selection-label');
    const linesCount = document.getElementById('lines-count');
    const wordsCount = document.getElementById('words-count');
    const charsCount = document.getElementById('chars-count');
    const readingTime = document.getElementById('reading-time');
    const statusThemeLabel = document.getElementById('status-theme-label');
    const currentThemeName = document.getElementById('current-theme-name');
    const fileInput = document.getElementById('file-input');

    // =========================================================================
    // INITIALIZATION & STORAGE
    // =========================================================================
    function init() {
        loadConfig();
        if (isMobile()) {
            config.showSidebar = false;
        }
        loadNotes();
        setupMarked();
        applyConfig();
        bindEvents();
        updateStats();
        updateLineNumbers();
        updatePreview();
    }

    function loadConfig() {
        const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (savedConfig) {
            try {
                config = { ...config, ...JSON.parse(savedConfig) };
            } catch (e) {
                console.error('Failed to parse saved config:', e);
            }
        }
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    }

    function loadNotes() {
        const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
        if (savedNotes) {
            try {
                notes = JSON.parse(savedNotes);
            } catch (e) {
                notes = [];
            }
        }

        const legacyContent = localStorage.getItem('modern_text_editor_content');
        if ((!notes || notes.length === 0) && legacyContent) {
            const initialNote = createNoteObject('First Note', legacyContent);
            notes = [initialNote];
        }

        if (!notes || notes.length === 0) {
            const defaultNote = createNoteObject(
                'Welcome to Editor Pro',
                `# 📝 Welcome to Editor Pro!\n\nA **powerful notepad** and **Markdown editor** that is fast, offline, and packed with features.\n\n## ✨ Key Features\n- 📑 **Multiple Notes & Tabs**: Manage all your documents in the sidebar.\n- 🎨 **10 Curated Themes**: Choose your favorite theme directly from the **Themes** dropdown.\n- 📱 **Mobile Ready**: Optimized for smartphones and tablets.\n- ⚡ **Synchronized Scrolling**: Write and view formatted preview side-by-side.\n- 🔢 **Line Numbers & Shortcuts**: Full support for \`Tab\`, auto-closing brackets, and line duplication (\`Alt+Shift+↓\`).\n- 🔒 **100% Local & Offline**: All fonts and notes are stored locally on your device.\n\n## ✅ To-Do Checklist Example\n- [x] Try changing theme from the **Themes** menu\n- [x] Toggle the Markdown live preview\n- [ ] Create a new note with the \`+\` button\n- [ ] Try the table generator from \`Tools -> Table Generator\`\n\n\`\`\`javascript\n// Code block syntax highlighting example\nfunction greet(name) {\n    console.log(\`Hello, \${name}! Welcome to Editor Pro.\`);\n}\ngreet("Writer");\n\`\`\`\n\n> "Simplicity is the soul of efficiency." Start writing now!\n`
            );
            notes = [defaultNote];
        }

        const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_NOTE);
        if (savedActiveId && notes.some(n => n.id === savedActiveId)) {
            activeNoteId = savedActiveId;
        } else {
            activeNoteId = notes[0].id;
        }

        const savedTabs = localStorage.getItem(STORAGE_KEY_OPEN_TABS);
        if (savedTabs) {
            try {
                openTabIds = JSON.parse(savedTabs).filter(id => notes.some(n => n.id === id));
            } catch (e) {
                openTabIds = [];
            }
        }
        if (!openTabIds.includes(activeNoteId)) {
            openTabIds.push(activeNoteId);
        }

        renderNotesList();
        renderTabs();
        loadActiveNoteIntoEditor();
    }

    function saveNotesToStorage() {
        localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
        localStorage.setItem(STORAGE_KEY_ACTIVE_NOTE, activeNoteId);
        localStorage.setItem(STORAGE_KEY_OPEN_TABS, JSON.stringify(openTabIds));
        flashSaveIndicator();
    }

    function flashSaveIndicator() {
        if (!saveIndicator) return;
        saveIndicator.classList.add('visible');
        clearTimeout(saveIndicator._timer);
        saveIndicator._timer = setTimeout(() => {
            saveIndicator.classList.remove('visible');
        }, 1500);
    }

    function createNoteObject(title, content = '') {
        const now = new Date().toISOString();
        return {
            id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            title: title || 'New Note',
            content: content,
            pinned: false,
            createdAt: now,
            updatedAt: now
        };
    }

    function getActiveNote() {
        return notes.find(n => n.id === activeNoteId);
    }

    function extractTitleFromContent(content) {
        if (!content || !content.trim()) return 'Untitled Note';
        const firstLine = content.trim().split('\n')[0].replace(/^[#\s\-*>]+/, '').trim();
        return firstLine.substring(0, 30) || 'New Note';
    }

    // =========================================================================
    // MARKED.JS & PREVIEW SETUP
    // =========================================================================
    function setupMarked() {
        if (window.marked) {
            marked.setOptions({
                gfm: true,
                breaks: true,
                highlight: function(code, lang) {
                    if (window.hljs && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {}
                    }
                    if (window.hljs) {
                        return hljs.highlightAuto(code).value;
                    }
                    return code;
                }
            });
        }
    }

    function updatePreview() {
        if (!config.showPreview && !isMobile()) return;
        const text = editor.value;

        if (window.marked && window.DOMPurify) {
            const rawHtml = marked.parse(text);
            previewContent.innerHTML = DOMPurify.sanitize(rawHtml, {
                ADD_TAGS: ['input'],
                ADD_ATTR: ['type', 'checked', 'disabled', 'data-task-index']
            });
        } else if (window.marked) {
            previewContent.innerHTML = marked.parse(text);
        } else {
            previewContent.innerHTML = '<p>Loading parser...</p>';
        }

        attachTaskCheckboxes();
    }

    function attachTaskCheckboxes() {
        const checkboxes = previewContent.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            cb.removeAttribute('disabled');
            cb.addEventListener('change', () => {
                toggleTaskInEditor(index, cb.checked);
            });
        });
    }

    function toggleTaskInEditor(taskIndex, isChecked) {
        const text = editor.value;
        let count = 0;
        const updated = text.replace(/(\[[ xX]\])/g, (match) => {
            if (count === taskIndex) {
                count++;
                return isChecked ? '[x]' : '[ ]';
            }
            count++;
            return match;
        });

        if (text !== updated) {
            editor.value = updated;
            onEditorInput();
        }
    }

    // =========================================================================
    // NOTE MANAGEMENT & RENDERING
    // =========================================================================
    function renderNotesList(filterQuery = '') {
        notesList.innerHTML = '';
        const query = filterQuery.toLowerCase().trim();

        const sortedNotes = [...notes].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        const filtered = query
            ? sortedNotes.filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query))
            : sortedNotes;

        notesCountLabel.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;

        if (filtered.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'note-item-snippet';
            emptyMsg.style.padding = '16px';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.textContent = query ? 'No notes found.' : 'No notes created yet.';
            notesList.appendChild(emptyMsg);
            return;
        }

        filtered.forEach(note => {
            const item = document.createElement('div');
            item.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
            item.dataset.id = note.id;

            const snippet = note.content ? note.content.replace(/[#*`_~>\-]/g, '').trim().substring(0, 60) : 'No content';
            const dateStr = new Date(note.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

            item.innerHTML = `
                <div class="note-item-header">
                    <span class="note-item-title">
                        ${note.pinned ? '<i class="ph ph-push-pin-simple note-pin-icon" title="Pinned"></i>' : ''}
                        ${escapeHtml(note.title)}
                    </span>
                    <div class="note-item-actions">
                        <button class="note-action-btn pin-btn" title="${note.pinned ? 'Unpin note' : 'Pin to top'}">
                            <i class="ph ${note.pinned ? 'ph-push-pin-slash' : 'ph-push-pin'}"></i>
                        </button>
                        <button class="note-action-btn delete-btn" title="Delete note">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="note-item-snippet">${escapeHtml(snippet)}</div>
                <div class="note-item-meta">
                    <span>${dateStr}</span>
                    <span>${countWords(note.content)} words</span>
                </div>
            `;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.note-item-actions')) return;
                selectNote(note.id);
                if (isMobile()) {
                    setSidebarOpen(false);
                }
            });

            item.querySelector('.pin-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                togglePinNote(note.id);
            });

            item.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNote(note.id);
            });

            notesList.appendChild(item);
        });
    }

    function renderTabs() {
        tabsList.innerHTML = '';
        openTabIds.forEach(id => {
            const note = notes.find(n => n.id === id);
            if (!note) return;

            const tab = document.createElement('div');
            tab.className = `tab-item ${note.id === activeNoteId ? 'active' : ''}`;
            tab.dataset.id = note.id;
            tab.title = note.title;

            tab.innerHTML = `
                <i class="ph ph-file-text"></i>
                <span class="tab-title">${escapeHtml(note.title)}</span>
                ${openTabIds.length > 1 ? '<button class="tab-close-btn" title="Close"><i class="ph ph-x"></i></button>' : ''}
            `;

            tab.addEventListener('click', (e) => {
                if (e.target.closest('.tab-close-btn')) return;
                selectNote(note.id);
            });

            const closeBtn = tab.querySelector('.tab-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeTab(note.id);
                });
            }

            tabsList.appendChild(tab);
        });
    }

    function selectNote(noteId) {
        if (!notes.some(n => n.id === noteId)) return;
        activeNoteId = noteId;

        if (!openTabIds.includes(noteId)) {
            openTabIds.push(noteId);
        }

        renderNotesList(notesSearchInput.value);
        renderTabs();
        loadActiveNoteIntoEditor();
        saveNotesToStorage();
    }

    function createNewNote(title = 'New Note', content = '') {
        const newNote = createNoteObject(title, content);
        notes.unshift(newNote);
        openTabIds.push(newNote.id);
        activeNoteId = newNote.id;

        renderNotesList();
        renderTabs();
        loadActiveNoteIntoEditor();
        saveNotesToStorage();
        if (isMobile()) {
            setSidebarOpen(false);
        }
        editor.focus();
    }

    function deleteNote(noteId) {
        const noteToDelete = notes.find(n => n.id === noteId);
        if (!noteToDelete) return;

        if (confirm(`Delete note "${noteToDelete.title}"?`)) {
            notes = notes.filter(n => n.id !== noteId);
            openTabIds = openTabIds.filter(id => id !== noteId);

            if (notes.length === 0) {
                const freshNote = createNoteObject('New Note', '');
                notes = [freshNote];
                openTabIds = [freshNote.id];
                activeNoteId = freshNote.id;
            } else if (activeNoteId === noteId) {
                activeNoteId = openTabIds.length > 0 ? openTabIds[0] : notes[0].id;
                if (!openTabIds.includes(activeNoteId)) openTabIds.push(activeNoteId);
            }

            renderNotesList(notesSearchInput.value);
            renderTabs();
            loadActiveNoteIntoEditor();
            saveNotesToStorage();
        }
    }

    function togglePinNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            note.pinned = !note.pinned;
            renderNotesList(notesSearchInput.value);
            saveNotesToStorage();
        }
    }

    function duplicateActiveNote() {
        const active = getActiveNote();
        if (!active) return;
        createNewNote(active.title + ' (Copy)', active.content);
    }

    function closeTab(tabId) {
        openTabIds = openTabIds.filter(id => id !== tabId);
        if (activeNoteId === tabId) {
            activeNoteId = openTabIds[openTabIds.length - 1] || notes[0].id;
            if (!openTabIds.includes(activeNoteId)) openTabIds.push(activeNoteId);
        }
        renderTabs();
        loadActiveNoteIntoEditor();
        saveNotesToStorage();
    }

    function loadActiveNoteIntoEditor() {
        const current = getActiveNote();
        if (current) {
            editor.value = current.content;
            document.title = `${current.title} - Editor Pro`;
        } else {
            editor.value = '';
        }
        updateStats();
        updateLineNumbers();
        updatePreview();
    }

    function onEditorInput() {
        const current = getActiveNote();
        if (current) {
            current.content = editor.value;
            current.updatedAt = new Date().toISOString();

            if (current.title.startsWith('New Note') || current.title.startsWith('Untitled Note') || current.title === 'Welcome to Editor Pro') {
                const autoTitle = extractTitleFromContent(current.content);
                if (autoTitle) {
                    current.title = autoTitle;
                    document.title = `${current.title} - Editor Pro`;
                }
            }

            saveNotesToStorage();
            renderNotesList(notesSearchInput.value);
            renderTabs();
        }

        updateStats();
        updateLineNumbers();
        updatePreview();
    }

    // =========================================================================
    // LINE NUMBERS & SYNC SCROLLING
    // =========================================================================
    function updateLineNumbers() {
        if (!config.showLineNumbers) {
            gutter.classList.add('hidden');
            return;
        }
        gutter.classList.remove('hidden');

        const lineCount = editor.value.split('\n').length;
        let numbersHtml = '';
        for (let i = 1; i <= lineCount; i++) {
            numbersHtml += `<div>${i}</div>`;
        }
        gutter.innerHTML = numbersHtml;
    }

    editor.addEventListener('scroll', () => {
        gutter.scrollTop = editor.scrollTop;

        if (config.showPreview && !isMobile()) {
            const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
            previewContent.scrollTop = scrollPercentage * (previewContent.scrollHeight - previewContent.clientHeight);
        }
    });

    // =========================================================================
    // THEMES & CONFIG APPLICATION
    // =========================================================================
    function applyConfig() {
        applyTheme(config.theme || 'slate-dark');
        applyFont(config.font || 'jetbrains');

        editor.style.fontSize = `${config.fontSize || 15}px`;
        gutter.style.fontSize = `${config.fontSize || 15}px`;

        updateLineNumbers();

        if (config.wordWrap) {
            editor.classList.remove('nowrap');
        } else {
            editor.classList.add('nowrap');
        }

        editor.setAttribute('spellcheck', config.spellcheck ? 'true' : 'false');
        setSidebarOpen(config.showSidebar);

        if (config.showPreview) {
            previewPane.classList.add('active');
            updatePreview();
        } else {
            previewPane.classList.remove('active');
        }
    }

    function setSidebarOpen(open) {
        config.showSidebar = open;
        if (open) {
            notesSidebar.classList.remove('collapsed');
            if (isMobile()) {
                sidebarBackdrop.classList.add('visible');
            }
        } else {
            notesSidebar.classList.add('collapsed');
            sidebarBackdrop.classList.remove('visible');
        }
    }

    function applyTheme(themeKey) {
        if (!THEME_NAMES[themeKey]) themeKey = 'slate-dark';
        document.documentElement.setAttribute('data-theme', themeKey);
        config.theme = themeKey;
        saveConfig();

        const themeName = THEME_NAMES[themeKey];
        if (currentThemeName) currentThemeName.textContent = themeName;
        if (statusThemeLabel) statusThemeLabel.textContent = themeName;
    }

    function applyFont(fontKey) {
        if (!FONT_MAP[fontKey]) fontKey = 'jetbrains';
        document.documentElement.style.setProperty('--editor-font', FONT_MAP[fontKey]);
        config.font = fontKey;
        saveConfig();

        document.querySelectorAll('[data-font]').forEach(btn => {
            if (btn.getAttribute('data-font') === fontKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function cycleTheme() {
        const themeKeys = Object.keys(THEME_NAMES);
        const currentIndex = themeKeys.indexOf(config.theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        applyTheme(themeKeys[nextIndex]);
    }

    // =========================================================================
    // STATS & CURSOR TRACKING
    // =========================================================================
    function updateStats() {
        const text = editor.value;
        const totalLines = text ? text.split('\n').length : 1;
        const totalWords = countWords(text);
        const totalChars = text.length;
        const totalCharsNoSpace = text.replace(/\s/g, '').length;
        const totalParagraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
        const readMinutes = Math.ceil(totalWords / 200);

        linesCount.textContent = totalLines;
        wordsCount.textContent = totalWords;
        charsCount.textContent = totalChars;
        readingTime.textContent = `${readMinutes} min`;

        const modalWords = document.getElementById('stat-modal-words');
        if (modalWords) {
            modalWords.textContent = totalWords;
            document.getElementById('stat-modal-chars').textContent = totalChars;
            document.getElementById('stat-modal-chars-nospace').textContent = totalCharsNoSpace;
            document.getElementById('stat-modal-lines').textContent = totalLines;
            document.getElementById('stat-modal-paragraphs').textContent = totalParagraphs;
            document.getElementById('stat-modal-read-time').textContent = `${readMinutes} min`;
        }
    }

    function updateCursorInfo() {
        const pos = editor.selectionStart;
        const text = editor.value.substring(0, pos);
        const line = text.split('\n').length;
        const col = text.length - text.lastIndexOf('\n');
        cursorPosLabel.textContent = `Ln ${line}, Col ${col}`;

        const selLength = editor.selectionEnd - editor.selectionStart;
        if (selLength > 0) {
            selectionLabel.textContent = `Sel: ${selLength}`;
        } else {
            selectionLabel.textContent = 'Sel: 0';
        }
    }

    function countWords(str) {
        if (!str) return 0;
        return str.trim().split(/\s+/).filter(w => w.length > 0).length;
    }

    // =========================================================================
    // SMART EDITING & FORMATTING HELPERS
    // =========================================================================
    function insertMarkdown(type) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;
        const selected = text.substring(start, end);

        let replacement = '';
        let cursorOffset = 0;

        switch (type) {
            case 'bold':
                replacement = `**${selected || 'Bold Text'}**`;
                cursorOffset = selected ? 0 : -2;
                break;
            case 'italic':
                replacement = `*${selected || 'Italic Text'}*`;
                cursorOffset = selected ? 0 : -1;
                break;
            case 'strikethrough':
                replacement = `~~${selected || 'Strikethrough Text'}~~`;
                cursorOffset = selected ? 0 : -2;
                break;
            case 'highlight':
                replacement = `==${selected || 'Highlighted Text'}==`;
                cursorOffset = selected ? 0 : -2;
                break;
            case 'h1': replacement = `# ${selected || 'Heading 1'}`; break;
            case 'h2': replacement = `## ${selected || 'Heading 2'}`; break;
            case 'h3': replacement = `### ${selected || 'Heading 3'}`; break;
            case 'blockquote': replacement = `> ${selected || 'Quote'}`; break;
            case 'code':
                if (selected.includes('\n')) {
                    replacement = `\`\`\`javascript\n${selected || '// Write code here'}\n\`\`\``;
                } else {
                    replacement = `\`${selected || 'inline code'}\``;
                }
                break;
            case 'link':
                replacement = `[${selected || 'Link Text'}](https://)`;
                cursorOffset = -1;
                break;
            case 'image':
                replacement = `![${selected || 'Image description'}](https://image-url.png)`;
                break;
            case 'list-ul': replacement = `- ${selected || 'Item'}`; break;
            case 'list-ol': replacement = `1. ${selected || 'Item'}`; break;
            case 'list-task': replacement = `- [ ] ${selected || 'New task'}`; break;
            case 'hr': replacement = `\n---\n`; break;
            case 'datetime':
                const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
                replacement = `📅 **${now}**`;
                break;
            default:
                return;
        }

        editor.setRangeText(replacement, start, end, 'select');
        if (!selected && cursorOffset !== 0) {
            editor.selectionStart = editor.selectionEnd = start + replacement.length + cursorOffset;
        } else if (!selected) {
            editor.selectionStart = editor.selectionEnd = start + replacement.length;
        }

        onEditorInput();
        editor.focus();
    }

    function duplicateCurrentLine() {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;

        if (start === end) {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            let lineEnd = text.indexOf('\n', end);
            if (lineEnd === -1) lineEnd = text.length;

            const line = text.substring(lineStart, lineEnd);
            const replacement = '\n' + line;
            editor.setRangeText(replacement, lineEnd, lineEnd, 'end');
        } else {
            const selected = text.substring(start, end);
            editor.setRangeText(selected + selected, start, end, 'end');
        }
        onEditorInput();
    }

    function toggleComment() {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;

        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = text.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = text.length;

        const line = text.substring(lineStart, lineEnd);
        let modifiedLine = '';
        if (line.trim().startsWith('<!--') && line.trim().endsWith('-->')) {
            modifiedLine = line.replace('<!--', '').replace('-->', '');
        } else {
            modifiedLine = `<!-- ${line} -->`;
        }

        editor.setRangeText(modifiedLine, lineStart, lineEnd, 'select');
        onEditorInput();
    }

    function transformSelectedText(transformType) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;
        const isSelection = start !== end;
        const target = isSelection ? text.substring(start, end) : text;

        let result = '';
        switch (transformType) {
            case 'uppercase': result = target.toUpperCase(); break;
            case 'lowercase': result = target.toLowerCase(); break;
            case 'capitalize': result = target.replace(/\b\w/g, l => l.toUpperCase()); break;
            case 'slugify': result = target.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'); break;
            case 'sort-asc': result = target.split('\n').sort().join('\n'); break;
            case 'sort-desc': result = target.split('\n').sort().reverse().join('\n'); break;
            case 'remove-duplicate-lines': result = [...new Set(target.split('\n'))].join('\n'); break;
            case 'remove-empty-lines': result = target.split('\n').filter(l => l.trim().length > 0).join('\n'); break;
            case 'trim-lines': result = target.split('\n').map(l => l.trim()).join('\n'); break;
            default: return;
        }

        if (isSelection) {
            editor.setRangeText(result, start, end, 'select');
        } else {
            editor.value = result;
        }
        onEditorInput();
    }

    function handleSmartKeys(e) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;

        // Auto-close pairs
        const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
        if (pairs[e.key]) {
            e.preventDefault();
            const openChar = e.key;
            const closeChar = pairs[openChar];
            const selected = text.substring(start, end);
            editor.setRangeText(`${openChar}${selected}${closeChar}`, start, end, 'end');
            editor.selectionStart = editor.selectionEnd = start + openChar.length + selected.length;
            onEditorInput();
            return;
        }

        // Tab indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const indent = '    ';
            if (start === end) {
                editor.setRangeText(indent, start, end, 'end');
            } else {
                const lineStart = text.lastIndexOf('\n', start - 1) + 1;
                let lineEnd = text.indexOf('\n', end);
                if (lineEnd === -1) lineEnd = text.length;
                const lines = text.substring(lineStart, lineEnd).split('\n');
                let newLines;
                if (e.shiftKey) {
                    newLines = lines.map(l => l.startsWith('    ') ? l.substring(4) : l.startsWith('\t') ? l.substring(1) : l);
                } else {
                    newLines = lines.map(l => indent + l);
                }
                editor.setRangeText(newLines.join('\n'), lineStart, lineEnd, 'select');
            }
            onEditorInput();
            return;
        }

        // Smart Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            const currentLine = text.substring(lineStart, start);
            const matchBullet = currentLine.match(/^(\s*)([-*+]|\d+\.|- \[[ xX]\])\s+/);
            const matchIndent = currentLine.match(/^(\s+)/);

            if (matchBullet) {
                e.preventDefault();
                const prefix = matchBullet[0];
                if (currentLine.trim() === matchBullet[0].trim()) {
                    editor.setRangeText('', lineStart, start, 'end');
                } else {
                    let nextPrefix = prefix;
                    const numMatch = prefix.match(/^(\s*)(\d+)\.\s+/);
                    if (numMatch) {
                        const nextNum = parseInt(numMatch[2], 10) + 1;
                        nextPrefix = `${numMatch[1]}${nextNum}. `;
                    } else if (prefix.includes('[- [x]]') || prefix.includes('- [ ]')) {
                        nextPrefix = '- [ ] ';
                    }
                    editor.setRangeText('\n' + nextPrefix, start, end, 'end');
                }
                onEditorInput();
                return;
            } else if (matchIndent) {
                e.preventDefault();
                editor.setRangeText('\n' + matchIndent[1], start, end, 'end');
                onEditorInput();
                return;
            }
        }
    }

    // =========================================================================
    // EXPORT & IMPORT OPERATIONS
    // =========================================================================
    function saveFileMD() {
        const active = getActiveNote();
        const filename = (active ? active.title : 'document').replace(/[^a-z0-9_\-\s]/gi, '_') + '.md';
        downloadBlob(editor.value, filename, 'text/markdown');
    }

    function saveFileTXT() {
        const active = getActiveNote();
        const filename = (active ? active.title : 'document').replace(/[^a-z0-9_\-\s]/gi, '_') + '.txt';
        downloadBlob(editor.value, filename, 'text/plain');
    }

    function exportHTML() {
        const active = getActiveNote();
        const title = active ? active.title : 'Document';
        const parsedBody = window.marked ? marked.parse(editor.value) : editor.value;

        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; max-width: 860px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #ffffff; }
    h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
    h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
    code { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0f172a; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: transparent; color: inherit; padding: 0; }
    blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; margin: 1em 0; padding: 12px 18px; border-radius: 0 4px 4px 0; }
    table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background: #f8fafc; }
    img { max-width: 100%; border-radius: 6px; }
</style>
</head>
<body>
${parsedBody}
</body>
</html>`;
        downloadBlob(fullHTML, `${title.replace(/[^a-z0-9_\-\s]/gi, '_')}.html`, 'text/html');
    }

    function exportAllNotesJSON() {
        const dataStr = JSON.stringify({
            app: 'Editor Pro',
            version: '2.0',
            exportedAt: new Date().toISOString(),
            notes: notes
        }, null, 2);
        downloadBlob(dataStr, `backup_notes_editor_pro_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    }

    function copyRichText() {
        if (!window.marked) return;
        const html = marked.parse(editor.value);
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobPlain = new Blob([editor.value], { type: 'text/plain' });

        if (navigator.clipboard && window.ClipboardItem) {
            navigator.clipboard.write([
                new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobPlain })
            ]).then(() => {
                alert('Formatted text copied to clipboard!');
            }).catch(() => {
                navigator.clipboard.writeText(editor.value);
                alert('Text copied to clipboard.');
            });
        } else {
            navigator.clipboard.writeText(editor.value);
            alert('Text copied to clipboard.');
        }
    }

    function downloadBlob(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleFileInput(e) {
        const file = e.target.files[0];
        if (!file) return;
        readFile(file);
        e.target.value = '';
    }

    function readFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            if (file.name.endsWith('.json')) {
                try {
                    const parsed = JSON.parse(content);
                    if (parsed && Array.isArray(parsed.notes)) {
                        notes = parsed.notes;
                        openTabIds = notes.map(n => n.id);
                        activeNoteId = notes[0].id;
                        renderNotesList();
                        renderTabs();
                        loadActiveNoteIntoEditor();
                        saveNotesToStorage();
                        alert(`Backup restored (${notes.length} notes loaded).`);
                        return;
                    }
                } catch (e) {}
            }

            const title = file.name.replace(/\.[^/.]+$/, '');
            createNewNote(title, content);
        };
        reader.readAsText(file);
    }

    // Drag & Drop
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                readFile(e.dataTransfer.files[i]);
            }
        }
    });

    // =========================================================================
    // SEARCH & REPLACE
    // =========================================================================
    function openSearchPanel() {
        searchPanel.classList.remove('hidden');
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (selected) findInput.value = selected;
        findInput.focus();
        findInput.select();
        updateSearchMatches();
    }

    function closeSearchPanel() {
        searchPanel.classList.add('hidden');
        editor.focus();
    }

    function updateSearchMatches() {
        const query = findInput.value;
        if (!query) {
            searchMatchCount.textContent = '0 matches';
            return;
        }

        const useRegex = regexToggle.checked;
        const matchCase = matchCaseToggle.checked;
        const text = editor.value;

        try {
            const flags = (matchCase ? '' : 'i') + 'g';
            const regex = useRegex ? new RegExp(query, flags) : new RegExp(escapeRegex(query), flags);
            const matches = text.match(regex);
            const count = matches ? matches.length : 0;
            searchMatchCount.textContent = `${count} match${count === 1 ? '' : 'es'}`;
        } catch (e) {
            searchMatchCount.textContent = 'Invalid regex';
        }
    }

    function findNext(forward = true) {
        const query = findInput.value;
        if (!query) return;

        const useRegex = regexToggle.checked;
        const matchCase = matchCaseToggle.checked;
        const text = editor.value;
        const currentPos = forward ? editor.selectionEnd : editor.selectionStart;

        try {
            const flags = (matchCase ? '' : 'i') + 'g';
            const regex = useRegex ? new RegExp(query, flags) : new RegExp(escapeRegex(query), flags);

            let match;
            let firstMatch = null;
            let targetMatch = null;
            let prevMatch = null;

            while ((match = regex.exec(text)) !== null) {
                if (!firstMatch) firstMatch = match;
                if (forward) {
                    if (match.index >= currentPos) { targetMatch = match; break; }
                } else {
                    if (match.index < currentPos) prevMatch = match;
                }
            }

            if (!forward && prevMatch) targetMatch = prevMatch;
            if (!targetMatch && firstMatch) targetMatch = firstMatch;

            if (targetMatch) {
                editor.focus();
                editor.setSelectionRange(targetMatch.index, targetMatch.index + targetMatch[0].length);
                updateCursorInfo();
            }
        } catch (e) {}
    }

    function performReplace(all = false) {
        const query = findInput.value;
        const replacement = replaceInput.value;
        if (!query) return;

        const useRegex = regexToggle.checked;
        const matchCase = matchCaseToggle.checked;
        const text = editor.value;

        try {
            const flags = (matchCase ? '' : 'i') + (all ? 'g' : '');
            const regex = useRegex ? new RegExp(query, flags) : new RegExp(escapeRegex(query), flags);
            editor.value = text.replace(regex, replacement);
            onEditorInput();
            updateSearchMatches();
        } catch (e) {
            alert('Invalid regular expression.');
        }
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // =========================================================================
    // TABLE GENERATOR
    // =========================================================================
    function openTableModal() {
        tableModal.classList.remove('hidden');
        updateTableModalPreview();
    }

    function updateTableModalPreview() {
        const rows = parseInt(document.getElementById('table-rows').value, 10) || 3;
        const cols = parseInt(document.getElementById('table-cols').value, 10) || 3;
        const align = document.getElementById('table-align').value;
        document.getElementById('table-sample-code').textContent = generateMarkdownTable(rows, cols, align);
    }

    function generateMarkdownTable(rows, cols, align) {
        let alignStr = ':---';
        if (align === 'center') alignStr = ':---:';
        if (align === 'right') alignStr = '---:';

        let headerRow = '|';
        let dividerRow = '|';

        for (let c = 1; c <= cols; c++) {
            headerRow += ` Header ${c} |`;
            dividerRow += ` ${alignStr} |`;
        }

        let bodyRows = '';
        for (let r = 1; r <= rows; r++) {
            let row = '|';
            for (let c = 1; c <= cols; c++) {
                row += ` Cell ${r},${c} |`;
            }
            bodyRows += '\n' + row;
        }

        return `${headerRow}\n${dividerRow}${bodyRows}`;
    }

    function insertGeneratedTable() {
        const rows = parseInt(document.getElementById('table-rows').value, 10) || 3;
        const cols = parseInt(document.getElementById('table-cols').value, 10) || 3;
        const align = document.getElementById('table-align').value;

        const tableMd = '\n' + generateMarkdownTable(rows, cols, align) + '\n';
        editor.setRangeText(tableMd, editor.selectionStart, editor.selectionEnd, 'end');
        tableModal.classList.add('hidden');
        onEditorInput();
        editor.focus();
    }

    // =========================================================================
    // EVENT BINDINGS
    // =========================================================================
    function bindEvents() {
        editor.addEventListener('input', onEditorInput);
        editor.addEventListener('keydown', handleSmartKeys);
        editor.addEventListener('keyup', updateCursorInfo);
        editor.addEventListener('click', updateCursorInfo);

        // Sidebar toggle
        document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
            setSidebarOpen(notesSidebar.classList.contains('collapsed'));
        });

        // Sidebar close on mobile
        document.getElementById('btn-sidebar-close').addEventListener('click', () => {
            setSidebarOpen(false);
        });
        sidebarBackdrop.addEventListener('click', () => {
            setSidebarOpen(false);
        });

        // Mobile View Toggle (Editor vs Preview)
        btnMobileEditor.addEventListener('click', () => {
            btnMobileEditor.classList.add('active');
            btnMobilePreview.classList.remove('active');
            editorWorkspace.classList.remove('mobile-preview-mode');
        });

        btnMobilePreview.addEventListener('click', () => {
            btnMobilePreview.classList.add('active');
            btnMobileEditor.classList.remove('active');
            editorWorkspace.classList.add('mobile-preview-mode');
            updatePreview();
        });

        // Quick Preview button
        document.getElementById('btn-quick-preview').addEventListener('click', () => {
            if (isMobile()) {
                const inPreview = editorWorkspace.classList.contains('mobile-preview-mode');
                if (inPreview) {
                    btnMobileEditor.click();
                } else {
                    btnMobilePreview.click();
                }
            } else {
                config.showPreview = !config.showPreview;
                applyConfig();
                saveConfig();
            }
        });

        // Quick Theme button
        document.getElementById('btn-quick-theme').addEventListener('click', cycleTheme);

        // Copy HTML from preview
        document.getElementById('btn-copy-preview-html').addEventListener('click', () => {
            if (window.marked) {
                const html = marked.parse(editor.value);
                navigator.clipboard.writeText(html).then(() => alert('Rendered HTML copied to clipboard!'));
            }
        });

        // New Note buttons
        document.getElementById('btn-sidebar-new-note').addEventListener('click', () => createNewNote());
        document.getElementById('btn-tab-new').addEventListener('click', () => createNewNote());

        // Sidebar Search
        notesSearchInput.addEventListener('input', () => {
            const query = notesSearchInput.value;
            btnClearSearch.classList.toggle('visible', !!query);
            renderNotesList(query);
        });

        btnClearSearch.addEventListener('click', () => {
            notesSearchInput.value = '';
            btnClearSearch.classList.remove('visible');
            renderNotesList();
            notesSearchInput.focus();
        });

        document.getElementById('btn-export-all-notes').addEventListener('click', exportAllNotesJSON);
        fileInput.addEventListener('change', handleFileInput);

        // =====================================================================
        // ROBUST DROPDOWN MENU TOGGLES
        // =====================================================================
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const menuId = btn.getAttribute('data-menu');
                const dropdown = document.getElementById(`menu-${menuId}`);
                if (!dropdown) return;

                const isOpen = dropdown.classList.contains('show');

                // Close all dropdowns
                document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));

                // If wasn't open, open it
                if (!isOpen) {
                    dropdown.classList.add('show');
                    btn.classList.add('active');
                }
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-content') && !e.target.closest('.menu-btn')) {
                document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            }
        });

        // Action Buttons inside dropdowns & toolbar
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                handleGlobalAction(action);
                // Close dropdowns
                document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            });
        });

        // Themes dropdown options
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeKey = btn.getAttribute('data-theme');
                applyTheme(themeKey);
                document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            });
        });

        // Fonts options
        document.querySelectorAll('[data-font]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const fontKey = btn.getAttribute('data-font');
                applyFont(fontKey);
                document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            });
        });

        statusThemeLabel.parentElement.addEventListener('click', cycleTheme);

        // Search Panel
        closeSearchBtn.addEventListener('click', closeSearchPanel);
        findInput.addEventListener('input', updateSearchMatches);
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                findNext(!e.shiftKey);
            } else if (e.key === 'Escape') {
                closeSearchPanel();
            }
        });
        findNextBtn.addEventListener('click', () => findNext(true));
        findPrevBtn.addEventListener('click', () => findNext(false));
        replaceBtn.addEventListener('click', () => performReplace(false));
        replaceAllBtn.addEventListener('click', () => performReplace(true));
        matchCaseToggle.addEventListener('change', updateSearchMatches);
        regexToggle.addEventListener('change', updateSearchMatches);

        // Table Modal
        document.getElementById('table-rows').addEventListener('input', updateTableModalPreview);
        document.getElementById('table-cols').addEventListener('input', updateTableModalPreview);
        document.getElementById('table-align').addEventListener('change', updateTableModalPreview);
        document.getElementById('btn-insert-generated-table').addEventListener('click', insertGeneratedTable);

        // Modal Close
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-close-modal');
                document.getElementById(modalId).classList.add('hidden');
                editor.focus();
            });
        });

        // Global Shortcuts
        document.addEventListener('keydown', handleGlobalKeyShortcuts);
    }

    function handleGlobalAction(action) {
        switch (action) {
            case 'new-note': createNewNote(); break;
            case 'open': fileInput.click(); break;
            case 'save-md': saveFileMD(); break;
            case 'save-txt': saveFileTXT(); break;
            case 'export-html': exportHTML(); break;
            case 'export-pdf': window.print(); break;
            case 'copy-rich': copyRichText(); break;
            case 'duplicate-note': duplicateActiveNote(); break;
            case 'delete-note': deleteNote(activeNoteId); break;

            case 'undo': document.execCommand('undo'); break;
            case 'redo': document.execCommand('redo'); break;
            case 'cut': document.execCommand('cut'); break;
            case 'copy': document.execCommand('copy'); break;
            case 'paste':
                if (navigator.clipboard) {
                    navigator.clipboard.readText().then(clip => {
                        editor.setRangeText(clip, editor.selectionStart, editor.selectionEnd, 'end');
                        onEditorInput();
                    });
                }
                break;
            case 'select-all': editor.select(); break;
            case 'duplicate-line': duplicateCurrentLine(); break;
            case 'toggle-comment': toggleComment(); break;
            case 'insert-datetime': insertMarkdown('datetime'); break;
            case 'insert-table-dialog':
            case 'table-generator':
                openTableModal();
                break;
            case 'find-replace': openSearchPanel(); break;

            case 'toggle-sidebar':
                setSidebarOpen(notesSidebar.classList.contains('collapsed'));
                break;
            case 'toggle-preview':
                if (isMobile()) {
                    const inPreview = editorWorkspace.classList.contains('mobile-preview-mode');
                    if (inPreview) btnMobileEditor.click();
                    else btnMobilePreview.click();
                } else {
                    config.showPreview = !config.showPreview;
                    applyConfig();
                    saveConfig();
                }
                break;
            case 'focus-mode':
                document.body.classList.toggle('focus-mode');
                break;
            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen();
                }
                break;
            case 'toggle-line-numbers':
                config.showLineNumbers = !config.showLineNumbers;
                applyConfig();
                saveConfig();
                break;
            case 'toggle-word-wrap':
                config.wordWrap = !config.wordWrap;
                applyConfig();
                saveConfig();
                break;
            case 'toggle-spellcheck':
                config.spellcheck = !config.spellcheck;
                applyConfig();
                saveConfig();
                break;
            case 'zoom-in':
                config.fontSize = Math.min((config.fontSize || 15) + 2, 32);
                applyConfig();
                saveConfig();
                break;
            case 'zoom-out':
                config.fontSize = Math.max((config.fontSize || 15) - 2, 10);
                applyConfig();
                saveConfig();
                break;
            case 'reset-zoom':
                config.fontSize = 15;
                applyConfig();
                saveConfig();
                break;

            case 'bold': insertMarkdown('bold'); break;
            case 'italic': insertMarkdown('italic'); break;
            case 'strikethrough': insertMarkdown('strikethrough'); break;
            case 'highlight': insertMarkdown('highlight'); break;
            case 'h1': insertMarkdown('h1'); break;
            case 'h2': insertMarkdown('h2'); break;
            case 'h3': insertMarkdown('h3'); break;
            case 'blockquote': insertMarkdown('blockquote'); break;
            case 'code': insertMarkdown('code'); break;
            case 'link': insertMarkdown('link'); break;
            case 'image': insertMarkdown('image'); break;
            case 'list-task': insertMarkdown('list-task'); break;
            case 'list-ul': insertMarkdown('list-ul'); break;
            case 'list-ol': insertMarkdown('list-ol'); break;
            case 'hr': insertMarkdown('hr'); break;

            case 'stats-dialog':
                updateStats();
                statsModal.classList.remove('hidden');
                break;
            case 'sort-asc':
            case 'sort-desc':
            case 'remove-duplicate-lines':
            case 'remove-empty-lines':
            case 'trim-lines':
            case 'uppercase':
            case 'lowercase':
            case 'capitalize':
            case 'slugify':
                transformSelectedText(action);
                break;

            case 'shortcuts-dialog': shortcutsModal.classList.remove('hidden'); break;
            case 'markdown-cheatsheet': window.open('https://www.markdownguide.org/cheat-sheet/', '_blank'); break;
            case 'github-repo': window.open('https://github.com/TizioQualunquee/editor-pro', '_blank'); break;
            case 'report-issue': window.open('https://github.com/TizioQualunquee/editor-pro/issues', '_blank'); break;
            case 'about-dialog': aboutModal.classList.remove('hidden'); break;
        }
    }

    function handleGlobalKeyShortcuts(e) {
        const isCtrl = e.ctrlKey || e.metaKey;

        if (isCtrl && e.key === 's') { e.preventDefault(); saveFileMD(); return; }
        if (isCtrl && e.key === 'n') { e.preventDefault(); createNewNote(); return; }
        if (isCtrl && e.key === 'o') { e.preventDefault(); fileInput.click(); return; }
        if (isCtrl && !e.shiftKey && e.key === 'p') { e.preventDefault(); window.print(); return; }
        if (isCtrl && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
            e.preventDefault();
            config.showPreview = !config.showPreview;
            applyConfig();
            saveConfig();
            return;
        }
        if (isCtrl && e.key === '\\') {
            e.preventDefault();
            setSidebarOpen(notesSidebar.classList.contains('collapsed'));
            return;
        }
        if (isCtrl && e.key === 'f') { e.preventDefault(); openSearchPanel(); return; }
        if (isCtrl && e.key === 'd') { e.preventDefault(); insertMarkdown('datetime'); return; }
        if (isCtrl && e.key === '/') { e.preventDefault(); toggleComment(); return; }
        if (e.altKey && e.shiftKey && e.key === 'ArrowDown') { e.preventDefault(); duplicateCurrentLine(); return; }
        if (isCtrl && e.key === '1') { e.preventDefault(); insertMarkdown('h1'); return; }
        if (isCtrl && e.key === '2') { e.preventDefault(); insertMarkdown('h2'); return; }
        if (isCtrl && e.key === '3') { e.preventDefault(); insertMarkdown('h3'); return; }
        if (e.key === 'F1') { e.preventDefault(); shortcutsModal.classList.remove('hidden'); return; }
        if (e.key === 'F9') { e.preventDefault(); document.body.classList.toggle('focus-mode'); return; }
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
            closeSearchPanel();
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Run Init
    init();
});
