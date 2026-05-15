#!/usr/bin/env node
// Render prod (saleh.sh) and the local preview, dump the rendered DOM
// plus key computed styles for the header bar, write both to /tmp so
// a diff tool can compare them.
//
// Usage: node scripts/dom-diff.mjs <route> [theme] [lang]
//   route: /, /about, /30, /nycmarathon24, /nycmarathon25, /bday25
//   theme: light | dark (default: light)
//   lang:  en | ar     (default: en)

import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';

const route = process.argv[2] || '/';
const theme = process.argv[3] || 'light';
const langCode = process.argv[4] || 'en';
const PERSIST_KEY = '~~saleh~~-1.6';

const langs = {
    en: {code: 'en', name: 'English', direction: 'ltr', title: 'Saleh Alghusson', fonts: ['font-rubik', 'font-ibm']},
    ar: {code: 'ar', name: 'عربي',     direction: 'rtl', title: 'صالح الغصون',     fonts: ['font-amiri', 'font-aref-ruqaa']},
};

async function capture(base, label) {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({viewport: {width: 1280, height: 800}});
    const page = await ctx.newPage();
    await page.addInitScript(({theme, lang, key}) => {
        localStorage.setItem(key, JSON.stringify({theme, flipDirection: true, funFont: false, currentLang: lang}));
    }, {theme, lang: langs[langCode], key: PERSIST_KEY});
    await page.goto(base + route, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => document.querySelectorAll('[data-netlify-deploy-id]').forEach((e) => e.remove()));

    const html = await page.evaluate(() => document.body.outerHTML);
    // Computed-style snapshot for header bar candidates + body.
    const styles = await page.evaluate(() => {
        const pick = (el) => {
            if (!el) return null;
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
                tag: el.tagName.toLowerCase(),
                cls: el.className || '',
                rect: {x: r.x, y: r.y, w: r.width, h: r.height},
                color: cs.color, bg: cs.backgroundColor, font: cs.font,
                display: cs.display, flex: `${cs.flexDirection} ${cs.justifyContent} ${cs.alignItems}`,
                padding: cs.padding, margin: cs.margin,
                ws: cs.whiteSpace, lh: cs.lineHeight,
            };
        };
        const selectors = [
            'body', '#app', '#cuerpo',
            'header', 'nav',
            '[class*="header"]', '[class*="nav"]', '[class*="social"]', '[class*="lang"]', '[class*="theme"]',
            'a[href*="github"]', 'a[href*="linkedin"]',
        ];
        const out = {};
        for (const sel of selectors) {
            const els = [...document.querySelectorAll(sel)].slice(0, 3);
            out[sel] = els.map(pick);
        }
        return out;
    });

    writeFileSync(`/tmp/dom-${label}.html`, html);
    writeFileSync(`/tmp/dom-${label}-styles.json`, JSON.stringify(styles, null, 2));
    console.log(`wrote /tmp/dom-${label}.html  /tmp/dom-${label}-styles.json`);
    await browser.close();
}

await capture('https://saleh.sh', 'prod');
await capture('http://127.0.0.1:8080', 'preview');
