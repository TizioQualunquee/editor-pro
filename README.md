# 📝 Editor Pro

<p align="center">
  <strong>A modern, fast, and feature-rich notepad & Markdown editor with multi-note management, 10 curated color themes, offline local fonts, and a fully responsive mobile/desktop UI.</strong>
</p>

<p align="center">
  <a href="https://github.com/TizioQualunquee/editor-pro"><img src="https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub Repo"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/stargazers"><img src="https://img.shields.io/github/stars/TizioQualunquee/editor-pro?style=for-the-badge&logo=github" alt="GitHub Stars"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/network/members"><img src="https://img.shields.io/github/forks/TizioQualunquee/editor-pro?style=for-the-badge&logo=github" alt="GitHub Forks"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/issues"><img src="https://img.shields.io/github/issues/TizioQualunquee/editor-pro?style=for-the-badge&logo=github" alt="GitHub Issues"></a>
  <a href="https://github.com/TizioQualunquee/editor-pro/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

## 🌟 Overview

[**Editor Pro**](https://github.com/TizioQualunquee/editor-pro) transforms the traditional notepad experience into a professional, distraction-free writing suite right inside your browser. Built entirely client-side (*local-first*), it ensures zero latency, instant autosave to `localStorage`, and complete privacy without requiring server setups or backend accounts.

All Google typography (Inter, JetBrains Mono, Fira Code, Merriweather) is downloaded locally inside the `fonts/` directory, allowing Editor Pro to work completely offline with zero external network requests.

Whether you are capturing quick ideas on mobile, writing documentation and Markdown notes on desktop, tracking interactive checklists, or building Markdown tables, Editor Pro delivers a seamless and delightful writing experience.

---

## ✨ Key Features

### 📑 1. Multi-Note Management & Tabs
* **Notes Sidebar / Drawer**: Easily create, rename, pin, search, duplicate, and delete notes. On mobile devices, it smoothly slides in as an overlay drawer.
* **Pinned Notes**: Pin important notes to keep them at the top of your list.
* **Tab Bar**: Switch quickly between multiple open notes with a clean tab strip.
* **Instant Search**: Real-time filtering across all note titles and content.
* **JSON Backup & Restore**: Export all your notes into a single JSON file or restore them via drag-and-drop.

### 🎨 2. 10 Curated Themes in Dedicated Menu
Select any theme instantly from the top-level **Themes** dropdown menu:

| Category | Theme | Description |
| :--- | :--- | :--- |
| ☀️ **Light** | `Clean Light` | Minimalist, ultra-clean editorial light palette. |
| 📜 **Light** | `Warm Paper` | Warm sepia tones soothing to the eyes (vintage paper feel). |
| 🌿 **Light** | `Nordic Frost` | Crisp, cool arctic white with soft steel-blue accents. |
| 🌙 **Dark** | `Slate Midnight` | Default elegant dark theme with soft blue accents. |
| 🌌 **Dark** | `OLED Pure Black` | Deep `#000000` pitch black for OLED battery efficiency and maximum contrast. |
| 🧛 **Dark** | `Dracula` | The iconic palette with purple, pink, and cyan highlights. |
| ❄️ **Dark** | `Nord Deep` | Calm, arctic dark tones inspired by the Nord palette. |
| 🌆 **Dark** | `Cyberpunk Neon` | Deep violet backdrop with electric cyan and magenta accents. |
| 🍵 **Dark** | `Matcha / Forest` | Calming botanical emerald and sage green tones. |
| 🌅 **Dark** | `Solarized Dark` | Classic low-contrast palette beloved by programmers. |

### 📱 3. Fully Responsive Mobile Experience
* **Touch-friendly Drawer**: Smooth gestures and backdrop dismiss for managing notes on phone screens.
* **Mobile View Switcher**: One-tap toggle between the writing *Editor* and the formatted *Preview*.
* **Scrollable Toolbar**: Fast horizontal access to formatting actions on touch devices.
* **Responsive Modals**: Touch-adapted dialogs for Find & Replace, Table Generator, Statistics, and Shortcuts.

### ⚡ 4. Advanced Editing & Productivity
* **Line Numbers Gutter**: Dynamic, synchronized line numbering with real-time updates.
* **Synchronized Scrolling (*Sync-Scroll*)**: Side-by-side proportional scrolling between editor and preview.
* **Bracket & Quote Auto-Closing**: Automatically closes `()`, `[]`, `{}`, `""`, `''`, and ```` pairs.
* **Smart Tab Indentation**: Indent with `Tab` (4 spaces) and dedent with `Shift+Tab` for single lines or multi-line selections.
* **Smart Enter**: Automatically preserves indentation and continues bulleted, numbered, or task lists.
* **Line Duplication**: Quickly duplicate the current line or selection with `Alt + Shift + ↓`.
* **Fast HTML Comments**: Toggle `<!-- comment -->` with `Ctrl + /`.
* **Date & Time Stamp**: Insert formatted timestamps with `Ctrl + D`.
* **Markdown Table Generator**: Interactive generator with custom rows, columns, alignment, and live preview.
* **Find & Replace**: Regex support, match counter, case-sensitivity toggle, and previous/next navigation.
* **Focus Mode (Distraction-Free)**: Press `F9` to hide all sidebars and chrome to focus strictly on your words.

### 📊 5. Real-Time Document Statistics
The live status bar at the bottom provides instant metrics:
* Cursor position (`Ln, Col`) and selection count (`Sel`)
* Total lines, words, and characters (with/without spaces)
* Estimated reading time
* Automatic save confirmation indicator

### 📥 6. Export & Import
* **Markdown (`.md`)** & **Plain Text (`.txt`)** downloads
* **Standalone HTML (`.html`)** export with embedded styling
* **Print / PDF Export** optimized with clean print stylesheets
* **Copy as Rich Text** for direct pasting into Microsoft Word, Google Docs, or Email
* **Drag & Drop**: Drag `.md`, `.txt`, or `.json` files directly into the window to open them.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | Create New Note |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | Save as Markdown (`.md`) |
| <kbd>Ctrl</kbd> + <kbd>O</kbd> | Open local file |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> | Print / Export to PDF |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> | Toggle Split Live Preview |
| <kbd>Ctrl</kbd> + <kbd>\</kbd> | Toggle Notes Sidebar |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | Open Find & Replace |
| <kbd>Ctrl</kbd> + <kbd>D</kbd> | Insert Current Date & Time |
| <kbd>Ctrl</kbd> + <kbd>/</kbd> | Toggle Comment |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↓</kbd> | Duplicate current line |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Indent / Dedent selected text |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> / <kbd>I</kbd> / <kbd>K</kbd> | Bold / Italic / Insert Link |
| <kbd>F1</kbd> | Open Keyboard Shortcuts Sheet |
| <kbd>F9</kbd> | Toggle Distraction-Free Focus Mode |
| <kbd>F11</kbd> | Toggle Fullscreen |

---

## 🚀 Quick Start

No installation or build steps required.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TizioQualunquee/editor-pro.git
   cd editor-pro
   ```
2. **Open in any modern browser** (Chrome, Firefox, Safari, Edge, Brave):
   ```bash
   # On Linux:
   xdg-open index.html

   # On macOS:
   open index.html

   # On Windows:
   start index.html
   ```

---

## 📁 Project Architecture

```
editor-pro/
├── fonts/            # Local offline Google Fonts (Inter, JetBrains Mono, Fira Code, Merriweather)
│   ├── fonts.css     # Local @font-face rules
│   └── *.woff2       # Font binary assets
├── index.html        # Semantic HTML layout, menus, modals, and workspaces
├── style.css         # Design system, 10 CSS themes, responsive mobile rules, print styles
├── script.js         # Core application engine: NoteManager, Markdown parser, shortcuts, tabs
├── .gitignore        # Standard Git ignore configuration
└── README.md         # Official project documentation
```

---

## 🛡️ Privacy & Security

* **Zero Tracking**: No telemetry, tracking cookies, or external analytics.
* **100% Local-first**: All note data stays exclusively within your browser's `localStorage`.
* **Zero Remote Assets**: Fonts are hosted locally to ensure complete offline independence.
* **HTML Sanitization**: Live Markdown preview uses `DOMPurify` to protect against XSS vulnerabilities.

---

## 👥 Authors & Credits

| Contributor | Role & Contributions |
| :--- | :--- |
| **[@TizioQualunquee](https://github.com/TizioQualunquee)** | 💡 **Original Creator**<br>Created the initial base project and core minimalist editor foundation. |
| **[@Semplicementeio](https://github.com/Semplicementeio)** | 🚀 **Major Overhaul & v2.0 Architecture**<br>Architected and developed the complete v2.0 suite: multi-note management, 10 curated themes palette, offline local typography, touch-responsive mobile UX, advanced Markdown engine, table generator, and productivity toolset. |

> 🌟 *Support the project by starring the repository and exploring more works from [Semplicementeio](https://github.com/Semplicementeio) and [TizioQualunquee](https://github.com/TizioQualunquee) on GitHub!*

---

## 📄 License

Distributed under the **MIT License**. See the repository for details.
