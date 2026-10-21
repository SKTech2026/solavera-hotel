# MinSUcanNGo Galera

Standalone HTML, CSS, and vanilla JavaScript tourism site.

## Run locally

From this folder, run `python -m http.server 8000` and open `http://localhost:8000`. The map, icons, and web fonts need an internet connection; site photos are local.

## Assets and contact

All 47 Pexels photos are in `assets/images/`; `assets/images/sources.txt` records the original URLs. The four supplied logos are in `assets/logos/`.

The contact form validates fields and opens a drafted email to the address shown on the site. Sending happens in the visitor's email app. No inquiries are stored by this static project.

Run `python validate.py` for the desktop and mobile browser checks (requires Playwright for Python and its Chromium browser).
