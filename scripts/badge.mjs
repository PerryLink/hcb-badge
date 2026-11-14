#!/usr/bin/env node
const pkg = process.argv[2];
if (!pkg) { console.error('usage: node scripts/badge.mjs <package>'); process.exit(2); }
const urls = ['https://raw.githubusercontent.com/PerryLink/dsh-compat-baseline/main/data/matrix.json','https://perrylink.github.io/dsh-compat-baseline/data/matrix.json'];
let d = null; for (const u of urls) { try { const r = await fetch(u, { signal: AbortSignal.timeout(8000) }); if (r.ok) { d = await r.json(); break; } } catch {} }
if (!d) { console.error('failed to fetch matrix'); process.exit(3); }
const row = d.rows.find(r => r.name === pkg);
const s = row ? (row.hosts[d.latestHost] || 'unknown') : 'not-in-hcb';
const color = s === 'declared-compatible' ? '#0a7a2f' : s === 'declared-incompatible' ? '#b00020' : '#777';
const label = 'HCB ' + d.latestHost;
const msg = s.replace('declared-', '');
const w1 = 8 + label.length * 6.5, w2 = 8 + msg.length * 6.5;
console.log('<svg xmlns="http://www.w3.org/2000/svg" width="' + (w1 + w2) + '" height="20"><rect width="' + w1 + '" height="20" fill="#555"/><rect x="' + w1 + '" width="' + w2 + '" height="20" fill="' + color + '"/><g fill="#fff" font-family="Verdana,sans-serif" font-size="11"><text x="4" y="14">' + label + '</text><text x="' + (w1 + 4) + '" y="14">' + msg + '</text></g></svg>');
