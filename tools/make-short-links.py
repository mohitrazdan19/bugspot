#!/usr/bin/env python3
"""Make the short share links: quizzifytech.com/wa, /f, /li ...

Each one is a tiny page that notes where the visitor came from (in this tab only),
then opens the home page at the clean address quizzifytech.com/. The home page
reads the note and records it as the visit's source. Link previews (WhatsApp,
LinkedIn, X...) read the same title, text and picture as the home page.

Run from the repo root after changing the list or the home page's preview tags:
    python3 tools/make-short-links.py
"""
import os, re

LINKS = {  # path: source name the admin page groups by
    'wa': 'whatsapp', 'f': 'friends', 'li': 'linkedin', 'x': 'x', 'tg': 'telegram',
    'r': 'reddit', 'fb': 'facebook', 'ig': 'instagram', 's': 'share',
}

head = open('index.html', encoding='utf-8').read()[:6000]
og = re.search(r'<meta property="og:title".*?<meta name="twitter:image" content="[^"]*">', head).group(0)
title = re.search(r'<title>(.*?)</title>', head).group(1)

PAGE = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>{title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
{og}
<link rel="canonical" href="https://quizzifytech.com/">
<script>
try {{ sessionStorage.setItem('qt.src', '{src}'); sessionStorage.setItem('qt.ref', document.referrer || ''); }} catch (e) {{}}
location.replace('/' + location.search + location.hash);
</script>
<noscript><meta http-equiv="refresh" content="0; url=/"></noscript>
<style>body{{margin:0;font:16px system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;background:#fbf8ff;color:#2d2350}}a{{color:#5b3fe0}}</style>
</head><body><p>Opening <a href="/">QuizzifyTech</a>…</p></body></html>
'''
for path, src in LINKS.items():
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(PAGE.format(title=title, og=og, src=src))
    print('/' + path, '->', src)
