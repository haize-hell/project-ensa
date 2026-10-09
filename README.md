# Emberfield — menu and character setup prototype

A browser-based starting point for a pixelated 2.5D game. It uses plain HTML, CSS, and JavaScript. A small Python server is included, with a Node.js preview runner as a fallback. No packages need to be installed.

## Start the preview on your PC

1. Open this folder in VS Code.
2. In VS Code, open Terminal > New Terminal.
3. Run node server.js and leave that terminal open.
4. Visit http://127.0.0.1:8000.

You can also double-click start-preview.cmd to start the preview server. Press Ctrl+C in its window to stop it. The Python alternative is python server.py when Python is correctly installed.

## Included

- Start menu and settings screen
- Master volume slider with an audio test tone
- Movement sensitivity that changes player speed
- Small, medium, and large pixel render resolutions
- Player name entry and simple outfit, hair-color, and eye-color customization
- Placeholder clearing scene with WASD/arrow-key movement
- Browser-local saving for settings and player appearance

The clearing and menu landscape are placeholders. Replace the landscape when the menu background reference arrives, then add the map, models, and game systems when they are ready.
