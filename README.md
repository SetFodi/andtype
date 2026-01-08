<div align="center">
  <img src="andtype.png" alt="AndType Logo" width="120" height="120" />

  # AndType
  
  **The Premium Minimalist Typing Experience**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Platform](https://img.shields.io/badge/platform-win32-blue.svg)](https://www.electronjs.org/)
  [![Built with Electron](https://img.shields.io/badge/built%20with-Electron-A277FF.svg)](https://www.electronjs.org/)
  
  <p align="center">
    A beautiful, distraction-free typing application designed for speed, focus, and aesthetics.<br>
    Featuring smooth animations, detailed statistics, and a highly customizable interface.
  </p>
</div>

---

## ✨ Features

- **🎨 8+ Premium Themes**:  
  Switch instantly between carefully curated themes like **Aura** (Default), *Andromeda*, *Dracula*, *Nord*, *Monokai*, and more.

- **⚡ Cinematic Interactions**:  
  Enjoy a **"Blur-In" loading screen**, valid key animations, and a smooth carefree typing experience with zero latency.

- **📊 Advanced Statistics**:  
  Track your progress with **Live WPM**, **Accuracy**, and a history of your top runs.  
  *Smart Weak Key Detection* analyzes your typing patterns to highlight keys you struggle with.

- **⌨️ 3D Virtual Keyboard**:  
  A visually stunning on-screen keyboard that reacts to your keystrokes in real-time.

- **🛡️ Custom UI**:  
  Fully custom **Window Controls** (Minimize, Maximize, Close) and a sleek, borderless designs.  
  **Danger Zone**: Reset your stats securely with a custom "Danger" confirmation modal.

- **🚀 Performance Focused**:  
  Built with lightweight Vanilla JS and CSS for maximum performance and instant startups.

---

## 🛠️ Installation & Setup

Clone the repository and install dependencies to get started.

```bash
# Clone the repository
git clone https://github.com/SetFodi/andtype.git

# Navigate into the folder
cd andtype

# Install dependencies
npm install

# Run the application
npm start
```

## 📦 Building for Windows

To create a standalone executable (`.exe`):

```bash
# Uses electron-packager
npx electron-packager . AndType --platform=win32 --arch=x64 --out=dist
```

## 🎮 Shortcuts

| Key | Action |
| :--- | :--- |
| `Tab` | **Restart Test** (Instant Reset) |
| `Esc` | Blur Input |
| `Ctrl` + `W` | Close Window |

---

<div align="center">
  <sub>Built with ❤️ by SetFodi</sub>
</div>
