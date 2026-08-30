# 📝 Editor Pro

<p align="center">
  <strong>A modern, fast, and feature-rich notepad & Markdown editor with multi-note management and a local-first experience.</strong>
</p>


<p align="center">
  Write, organize, preview, and export your notes directly in your browser.
  No account. No backend. No unnecessary complexity.
</p>

<p align="center">
  <a href="https://github.com/TizioQualunquee/editor-pro"><img src="https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub Repository"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/stargazers"><img src="https://img.shields.io/github/stars/TizioQualunquee/editor-pro?style=for-the-badge&logo=github" alt="GitHub Stars"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/network/members"><img src="https://img.shields.io/github/forks/TizioQualunquee/editor-pro?style=for-the-badge&logo=github" alt="GitHub Forks"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/issues"><img src="https://img.shields.io/github/issues/TizioQualunquee/editor-pro?style=for-the-badge&logo=github" alt="GitHub Issues"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

## ✨ Why Editor Pro?

Editor Pro turns your browser into a lightweight writing workspace for Markdown, notes, documentation, checklists, and quick ideas.

|                        |                                                                           |
| ---------------------- | ------------------------------------------------------------------------- |
| 🔒 **Local-first**     | Your notes are stored locally in your browser.                            |
| ⚡ **Instant**          | No server, account, or backend required.                                  |
| 📝 **Markdown-native** | Write Markdown with a synchronized live preview.                          |
| 📚 **Multi-note**      | Manage multiple notes with tabs, search, pinning, and duplication.        |
| 🎨 **10 themes**       | Switch instantly between curated light and dark themes.                   |
| 📱 **Responsive**      | Designed for both desktop and mobile screens.                             |
| 📦 **Portable**        | Import and export Markdown, TXT, JSON, and HTML.                          |
| 📴 **Offline-ready**   | Local fonts and client-side functionality keep the editor usable offline. |

---

## 🚀 Features

### 📑 Multi-Note Workspace

Manage your notes without leaving the editor.

* Create, rename, duplicate, pin, search, and delete notes
* Sidebar on desktop and slide-out drawer on mobile
* Multiple open notes with a tab bar
* Real-time search across note titles and content
* JSON backup and restore
* Drag & drop file import

### 📝 Markdown Editing

A writing experience designed for speed rather than ceremonial clicking.

* Live Markdown preview
* Synchronized editor/preview scrolling
* Dynamic line numbers
* Smart indentation
* Smart list continuation
* Automatic brackets and quotes
* Line duplication
* HTML comment toggle
* Date & time insertion
* Markdown table generator
* Find & Replace with regex support

### 🎨 Themes

Choose from 10 curated themes:

**Light**

* ☀️ Clean Light
* 📜 Warm Paper
* 🌿 Nordic Frost

**Dark**

* 🌙 Slate Midnight
* 🌌 OLED Pure Black
* 🧛 Dracula
* ❄️ Nord Deep
* 🌆 Cyberpunk Neon
* 🍵 Matcha / Forest
* 🌅 Solarized Dark

### 📱 Mobile Experience

Editor Pro is fully responsive and designed to remain usable on smaller screens.

* Touch-friendly note drawer
* Editor / Preview switcher
* Horizontally scrollable formatting toolbar
* Responsive dialogs and modals
* Touch-friendly controls
* Mobile-optimized layouts

### ⚡ Focus & Productivity

When you want to write instead of reorganize your toolbar for the 14th time.

* **Focus Mode** with `F9`
* Keyboard-first workflow
* Fast formatting shortcuts
* Line duplication
* Smart indentation
* Smart list continuation
* Real-time document statistics

---

## 📊 Document Statistics

The status bar provides live information about the current document:

* Cursor position
* Selection count
* Line count
* Word count
* Character count
* Characters with and without spaces
* Estimated reading time
* Save status

---

## 📤 Import & Export

Editor Pro keeps your data portable.

### Import

* `.md`
* `.txt`
* `.json`

Files can be opened using the standard file picker or dragged directly into the editor.

### Export

* Markdown `.md`
* Plain text `.txt`
* Standalone HTML `.html`
* Print / PDF
* Rich Text via clipboard

The HTML exporter generates a standalone document with embedded styling, making exported notes easy to share or archive.

---

## ⌨️ Keyboard Shortcuts

| Shortcut                                           | Action                |
| -------------------------------------------------- | --------------------- |
| <kbd>Ctrl</kbd> + <kbd>N</kbd>                     | Create new note       |
| <kbd>Ctrl</kbd> + <kbd>S</kbd>                     | Export as Markdown    |
| <kbd>Ctrl</kbd> + <kbd>O</kbd>                     | Open local file       |
| <kbd>Ctrl</kbd> + <kbd>P</kbd>                     | Print / Export to PDF |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>  | Toggle split preview  |
| <kbd>Ctrl</kbd> + <kbd>\</kbd>                     | Toggle notes sidebar  |
| <kbd>Ctrl</kbd> + <kbd>F</kbd>                     | Find & Replace        |
| <kbd>Ctrl</kbd> + <kbd>D</kbd>                     | Insert date & time    |
| <kbd>Ctrl</kbd> + <kbd>/</kbd>                     | Toggle HTML comment   |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↓</kbd>   | Duplicate line        |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Indent / Dedent       |
| <kbd>Ctrl</kbd> + <kbd>B</kbd>                     | Bold                  |
| <kbd>Ctrl</kbd> + <kbd>I</kbd>                     | Italic                |
| <kbd>Ctrl</kbd> + <kbd>K</kbd>                     | Insert link           |
| <kbd>F1</kbd>                                      | Keyboard shortcuts    |
| <kbd>F9</kbd>                                      | Focus Mode            |
| <kbd>F11</kbd>                                     | Fullscreen            |

---

## 🛠️ Technology

Editor Pro intentionally keeps the stack lightweight:

* **HTML5** for structure
* **CSS3** for layout, themes, responsive design, and print styles
* **Vanilla JavaScript** for application logic
* **localStorage** for local note persistence
* **Markdown** for document authoring
* **DOMPurify** for sanitizing rendered HTML
* **Local WOFF2 fonts** for offline typography

No frontend framework or backend is required.

---

## 🚀 Getting Started

Editor Pro requires no installation, package manager, or build process.

### 1. Clone the repository

```bash
git clone https://github.com/TizioQualunquee/editor-pro.git
cd editor-pro
```

### 2. Open `index.html`

You can open the file directly in a modern browser:

```bash
# Linux
xdg-open index.html

# macOS
open index.html

# Windows
start index.html
```

Supported browsers include modern versions of:

* Chrome
* Firefox
* Safari
* Edge
* Brave

For the best experience, use a current browser with JavaScript and `localStorage` enabled.

---

## 📁 Project Structure

```text
editor-pro/
├── fonts/
│   ├── fonts.css
│   └── *.woff2
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

### Main files

| File         | Purpose                                                          |
| ------------ | ---------------------------------------------------------------- |
| `index.html` | Application structure, menus, modals, editor and preview         |
| `style.css`  | Design system, themes, responsive rules and print styles         |
| `script.js`  | Note management, editor logic, Markdown processing and shortcuts |
| `fonts/`     | Locally hosted font assets                                       |

---

## 🔒 Privacy & Security

Editor Pro follows a **local-first** architecture.

* 📴 No account required
* 🔒 Notes are stored in browser `localStorage`
* 🚫 No telemetry
* 🚫 No tracking cookies
* 🚫 No external analytics
* 📦 Fonts are bundled locally
* 🛡️ Rendered Markdown is sanitized with DOMPurify

### Important

Because notes are stored in `localStorage`, clearing browser data can also remove your notes.

**Use JSON export regularly if your notes are important.**

Your browser is not a backup strategy. Humanity has learned this lesson repeatedly and then immediately forgotten it.

---

## 🗺️ Roadmap

Potential future improvements:

* [ ] Note folders / collections
* [ ] Custom theme creation
* [ ] More Markdown extensions
* [ ] Better accessibility support
* [ ] Improved file-system integration
* [ ] Optional encrypted local storage
* [ ] PWA installation support
* [ ] Additional export formats

---

## 👥 Authors & Credits

| Contributor                                                | Role                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| **[@TizioQualunquee](https://github.com/TizioQualunquee)** | Original creator and author of the initial editor foundation |
| **[@Semplicementeio](https://github.com/Semplicementeio)** | Major overhaul and v2.0 architecture                         |

The v2.0 overhaul introduced the multi-note workspace, themes, offline typography, responsive mobile UX, advanced Markdown tooling, table generation, and productivity features.

---

## 📄 License

Editor Pro is distributed under the **MIT License**.

See [`LICENSE`](https://github.com/TizioQualunquee/editor-pro/blob/main/LICENSE) for the full license text.

---

<p align="center">
  Made with ☕ and an unreasonable amount of JavaScript.
</p>
