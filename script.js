document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const editorPane = document.querySelector('.editor-pane');
    const previewPane = document.querySelector('.preview-pane');

    // Menu & Toolbar
    const menuBtns = document.querySelectorAll('.menu-btn');
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const saveIndicator = document.getElementById('save-status');

    // Search
    const searchPanel = document.getElementById('search-panel');
    const closeSearchBtn = document.getElementById('close-search');
    const findInput = document.getElementById('find-input');
    const replaceInput = document.getElementById('replace-input');
    const regexToggle = document.getElementById('regex-toggle');
    const replaceBtn = document.getElementById('replace-btn');
    const replaceAllBtn = document.getElementById('replace-all-btn');

    // Stats
    const linesCount = document.getElementById('lines-count');
    const wordsCount = document.getElementById('words-count');
    const charsCount = document.getElementById('chars-count');
    const charsNoSpaceCount = document.getElementById('chars-no-space-count');
    const paragraphsCount = document.getElementById('paragraphs-count');
    const readingTime = document.getElementById('reading-time');
    const editorMode = document.getElementById('editor-mode');

    // Hidden Input
    const fileInput = document.getElementById('file-input');

    // --- State ---
    let activeMenu = null;
    let isPreviewVisible = false; // Default: Editor Only
    const STORAGE_KEY = 'modern_text_editor_content';

    // --- Initialization ---
    function init() {
        // Load content from LocalStorage
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
            editor.value = savedContent;
        }

        // Apply Theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        updateStats();
        updatePreview();
    }

    // --- Markdown Logic ---
    function updatePreview() {
        if (!isPreviewVisible) return;

        const text = editor.value;
        // Use marked.js to parse and DOMPurify to sanitize
        if (window.marked && window.DOMPurify) {
            const rawHtml = marked.parse(text);
            preview.innerHTML = DOMPurify.sanitize(rawHtml);
        } else if (window.marked) {
            // Fallback if DOMPurify fails (unsafe but renders)
            console.warn('DOMPurify not loaded, rendering unsanitized HTML.');
            preview.innerHTML = marked.parse(text);
        } else {
            preview.innerHTML = '<p style="color:red;">Error: marked.js not loaded.</p>';
        }
    }

    function togglePreview() {
        isPreviewVisible = !isPreviewVisible;
        if (isPreviewVisible) {
            previewPane.style.display = 'block';
            editorMode.textContent = 'Split View';
            updatePreview();
        } else {
            previewPane.style.display = 'none';
            editorMode.textContent = 'Markdown';
        }
    }

    // --- Editor Helpers ---
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
                replacement = `~~${selected || 'Strikethrough'}~~`;
                cursorOffset = selected ? 0 : -2;
                break;
            case 'h1':
                replacement = `# ${selected || 'Heading 1'}`;
                break;
            case 'h2':
                replacement = `## ${selected || 'Heading 2'}`;
                break;
            case 'h3':
                replacement = `### ${selected || 'Heading 3'}`;
                break;
            case 'blockquote':
                replacement = `> ${selected || 'Blockquote'}`;
                break;
            case 'code':
                if (selected.includes('\n')) {
                    replacement = `\`\`\`\n${selected || 'code block'}\n\`\`\``;
                } else {
                    replacement = `\`${selected || 'inline code'}\``;
                }
                break;
            case 'link':
                replacement = `[${selected || 'Link Text'}](url)`;
                cursorOffset = -1; // Position cursor inside (url)
                break;
            case 'image':
                replacement = `![${selected || 'Alt Text'}](image-url)`;
                break;
            case 'list-ul':
                replacement = `- ${selected || 'List item'}`;
                break;
            case 'list-ol':
                replacement = `1. ${selected || 'List item'}`;
                break;
            case 'table':
                replacement = `| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |`;
                break;
            case 'hr':
                replacement = `\n---\n`;
                break;
            default:
                return;
        }

        editor.setRangeText(replacement, start, end, 'select');

        // Adjust cursor if no text was selected (to act as a wrapper)
        if (!selected && cursorOffset !== 0) {
             editor.selectionStart = editor.selectionEnd = start + replacement.length + cursorOffset;
        } else if (!selected) {
             // If simply inserting a block (like table), move cursor to end
             editor.selectionStart = editor.selectionEnd = start + replacement.length;
        }

        updateStats();
        updatePreview();
        saveContent();
        editor.focus();
    }

    // --- File Operations ---
    function handleFileOpen(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            editor.value = e.target.result;
            updateStats();
            updatePreview();
            saveContent();
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    }

    function saveFile() {
        const blob = new Blob([editor.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportHTML() {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Exported Document</title>
<style>
body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
img { max-width: 100%; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 10px; color: #666; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; }
th { background: #f4f4f4; }
</style>
</head>
<body>
${marked.parse(editor.value)}
</body>
</html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Stats & Persistence ---
    function updateStats() {
        const text = editor.value;

        linesCount.textContent = text ? text.split(/\n/).length : 0;
        wordsCount.textContent = text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
        charsCount.textContent = text.length;
        charsNoSpaceCount.textContent = text.replace(/\s/g, '').length;
        paragraphsCount.textContent = text ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;

        // Reading Time (Avg 200 wpm)
        const words = parseInt(wordsCount.textContent);
        const minutes = Math.ceil(words / 200);
        readingTime.textContent = `${minutes} min`;
    }

    function saveContent() {
        localStorage.setItem(STORAGE_KEY, editor.value);
        saveIndicator.classList.add('visible');
        setTimeout(() => saveIndicator.classList.remove('visible'), 2000);
    }

    // --- Event Listeners ---
    editor.addEventListener('input', () => {
        updateStats();
        updatePreview();
        saveContent();
    });

    // Menu Toggle
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
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            activeMenu = isVisible ? null : menuId;
        });
    });

    document.addEventListener('click', () => {
        dropdowns.forEach(d => d.style.display = 'none');
        activeMenu = null;
    });

    // Menu Actions
    document.querySelectorAll('.dropdown-content button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleAction(action);
            dropdowns.forEach(d => d.style.display = 'none');
        });
    });

    // Toolbar Actions
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleAction(action); // Toolbar actions map to same keys
        });
    });

    // Handle File Input
    fileInput.addEventListener('change', handleFileOpen);

    // Main Action Handler
    function handleAction(action) {
        // Transformations
        const text = editor.value;

        switch (action) {
            case 'new':
                if (confirm('Create new document? Unsaved changes are stored in browser, but better safe than sorry.')) {
                    editor.value = '';
                    updateStats();
                    updatePreview();
                    saveContent();
                }
                break;
            case 'open':
                fileInput.click();
                break;
            case 'save':
                saveFile();
                break;
            case 'export-html':
                exportHTML();
                break;
            case 'print':
                window.print();
                break;
            case 'undo': document.execCommand('undo'); break;
            case 'redo': document.execCommand('redo'); break;
            case 'cut': document.execCommand('cut'); break;
            case 'copy': document.execCommand('copy'); break;
            case 'paste':
                navigator.clipboard.readText().then(clipText => {
                    editor.setRangeText(clipText, editor.selectionStart, editor.selectionEnd, 'end');
                    updateStats();
                    updatePreview();
                    saveContent();
                });
                break;
            case 'select-all': editor.select(); break;
            case 'find-replace':
                searchPanel.classList.remove('hidden');
                findInput.focus();
                break;
            case 'toggle-preview':
                togglePreview();
                break;
            case 'toggle-theme':
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                break;
            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                    });
                } else {
                    document.exitFullscreen();
                }
                break;
            case 'zoom-in':
                let sizeIn = parseFloat(window.getComputedStyle(editor).fontSize);
                editor.style.fontSize = (sizeIn + 2) + 'px';
                break;
            case 'zoom-out':
                let sizeOut = parseFloat(window.getComputedStyle(editor).fontSize);
                editor.style.fontSize = (sizeOut - 2) + 'px';
                break;
            case 'reset-zoom':
                editor.style.fontSize = '15px';
                break;
            case 'word-count':
                alert(`Words: ${wordsCount.textContent}\nChars: ${charsCount.textContent}\nReading Time: ${readingTime.textContent}`);
                break;
            case 'sort-asc':
                editor.value = text.split('\n').sort().join('\n');
                break;
            case 'sort-desc':
                editor.value = text.split('\n').sort().reverse().join('\n');
                break;
            case 'trim':
                editor.value = text.split('\n').map(l => l.trim()).join('\n');
                break;
            case 'uppercase':
                editor.value = text.toUpperCase();
                break;
            case 'lowercase':
                editor.value = text.toLowerCase();
                break;
            case 'capitalize':
                editor.value = text.replace(/\b\w/g, l => l.toUpperCase());
                break;
            // Markdown Insertions
            case 'bold': insertMarkdown('bold'); break;
            case 'italic': insertMarkdown('italic'); break;
            case 'strikethrough': insertMarkdown('strikethrough'); break;
            case 'h1': insertMarkdown('h1'); break;
            case 'h2': insertMarkdown('h2'); break;
            case 'h3': insertMarkdown('h3'); break;
            case 'blockquote': insertMarkdown('blockquote'); break;
            case 'code': insertMarkdown('code'); break;
            case 'link': insertMarkdown('link'); break;
            case 'image': insertMarkdown('image'); break;
            case 'list-ul': insertMarkdown('list-ul'); break;
            case 'list-ol': insertMarkdown('list-ol'); break;
            case 'table': insertMarkdown('table'); break;
            case 'hr': insertMarkdown('hr'); break;
            default:
                break;
        }

        updateStats();
        updatePreview();
        saveContent();
    }

    // --- Search Logic ---
    closeSearchBtn.addEventListener('click', () => searchPanel.classList.add('hidden'));

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
                alert('Invalid Regex');
            }
        } else {
            if (all) {
                editor.value = text.split(search).join(replacement);
            } else {
                editor.value = text.replace(search, replacement);
            }
        }
        updateStats();
        updatePreview();
        saveContent();
    }

    replaceBtn.addEventListener('click', () => performReplace(false));
    replaceAllBtn.addEventListener('click', () => performReplace(true));

    // Fullscreen Event Listener
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            document.body.classList.add('fullscreen');
        } else {
            document.body.classList.remove('fullscreen');
        }
    });

    // Keyboard Shortcuts (Ctrl+S, etc.)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            insertMarkdown('bold');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            insertMarkdown('italic');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            insertMarkdown('link');
        }
    });

    // Run Init
    init();
});
