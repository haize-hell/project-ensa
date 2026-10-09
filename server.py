"""Tiny local server for the Emberfield menu prototype."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
PORT = 8000

if __name__ == "__main__":
    os.chdir(ROOT)
    print("Emberfield is available at http://127.0.0.1:8000")
    print("Press Ctrl+C to stop the server.")
    ThreadingHTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler).serve_forever()
