/* =========================================================
   script.js — shared by every page
   ========================================================= */

/* ---------- CONFIG (edit here) ---------- */
const CONFIG = {
  start:       [2025, 11, 1],  // day you got together  [year, month, day]
  anniversary: [2026, 11, 1],  // 1-year anniversary
  pin:         '2541'          // <-- CHANGE: her birth year (the password on the first page)
};

/* ---------- date helpers ---------- */
function dayNum(y, m, d) { return Date.UTC(y, m - 1, d) / 86400000; }
function todayNum() { const n = new Date(); return dayNum(n.getFullYear(), n.getMonth() + 1, n.getDate()); }
function daysTogether() { return Math.max(0, todayNum() - dayNum(...CONFIG.start)); }
function monthsTogether() {
  const n = new Date(), [sy, sm, sd] = CONFIG.start;
  let m = (n.getFullYear() - sy) * 12 + (n.getMonth() + 1 - sm);
  if (n.getDate() < sd) m--;
  return Math.max(0, m);
}
function daysToAnniversary() { return dayNum(...CONFIG.anniversary) - todayNum(); }

/* ---------- floating hearts ---------- */
(function hearts() {
  if (document.body.dataset.hearts === 'off') return;
  let bg = document.getElementById('heartsBg');
  if (!bg) { bg = document.createElement('div'); bg.id = 'heartsBg'; bg.className = 'hearts-bg'; document.body.prepend(bg); }
  const shapes = ['♡', '♡', '♡', '·', '˚'];
  function spawn() {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (8 + Math.random() * 10) + 'px';
    const dur = 8 + Math.random() * 10;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * dur) + 's';
    bg.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000 + dur * 1000);
  }
  for (let i = 0; i < 12; i++) spawn();
  setInterval(spawn, 1500);
})();

function burstHearts(n) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const h = document.createElement('span');
      h.className = 'burst-heart';
      h.textContent = Math.random() > .3 ? '♥' : '♡';
      h.style.left = (5 + Math.random() * 90) + '%';
      h.style.fontSize = (14 + Math.random() * 22) + 'px';
      h.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2800);
    }, i * 70);
  }
}

/* ---------- bottom nav (filled in from one place) ---------- */
(function nav() {
  const el = document.querySelector('nav.nav-bar[data-active]');
  if (!el) return;
  const svg = p => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + p + '</svg>';
  const items = [
    ['home',      'home.html',      'Home',      svg('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>')],
    ['memories',  'memories.html',  'Memories',  svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>')],
    ['milestone', 'milestone.html', 'Milestone', svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>')],
    ['video',     'video.html',     'Videos',    svg('<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>')],
    ['letter',    'letter.html',    'Letter',    svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>')]
  ];
  el.innerHTML = items.map(i =>
    '<a class="nav-item' + (i[0] === el.dataset.active ? ' active' : '') + '" href="' + i[1] + '">' + i[3] + i[2] + '</a>'
  ).join('');
})();

/* ---------- first page: splash -> PIN ---------- */
function goToLock() {
  const s = document.getElementById('splashPage'), l = document.getElementById('lockPage');
  if (s) s.classList.add('hidden');
  if (l) l.classList.add('visible');
}
let pin = '';
function addNum(n) { if (pin.length >= 4) return; pin += n; updateDots(); if (pin.length === 4) setTimeout(checkPass, 180); }
function clearPass() { pin = pin.slice(0, -1); updateDots(); setMsg(''); }
function updateDots() { for (let i = 0; i < 4; i++) { const d = document.getElementById('d' + i); if (d) d.classList.toggle('filled', i < pin.length); } }
function setMsg(m) { const e = document.getElementById('lockMsg'); if (e) e.textContent = m; }
function checkPass() {
  if (pin === CONFIG.pin) { setMsg(''); window.location.href = 'home.html'; }
  else { setMsg('Try again 🥺'); pin = ''; updateDots(); }
}

/* ---------- home: counters + banner ---------- */
(function home() {
  const days = document.getElementById('cntDays');
  if (!days) return;
  days.textContent = daysTogether();
  document.getElementById('cntMonths').textContent = monthsTogether();

  const banner = document.getElementById('annivBanner'), left = daysToAnniversary();
  if (banner) {
    if (left > 1)        banner.textContent = left + ' days until our 1st anniversary 🎀';
    else if (left === 1) banner.textContent = 'Tomorrow is our 1st anniversary 🎀';
    else if (left === 0) banner.textContent = 'Happy 1 year, Bibii 🤍🎉';
    else                 banner.textContent = '1 year together — and counting 🤍';
  }
  if (left === 0) {
    try { if (!sessionStorage.getItem('burst')) { sessionStorage.setItem('burst', '1'); setTimeout(() => burstHearts(40), 600); } }
    catch (e) { setTimeout(() => burstHearts(40), 600); }
  }
})();
