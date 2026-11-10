/* ==========================================================================
   Syntropy Earth 1.1 -- added 10 November 2026.
   Three jobs: (1) the scroll walkthrough on the programme pages,
   (2) the register preview on /heat/, (3) click and form events pushed to
   the GTM dataLayer. GTM itself is injected by Netlify Snippet Injection;
   gtag() is not used anywhere on this site.
   ========================================================================== */
(function () {
  'use strict';
  window.dataLayer = window.dataLayer || [];
  function push(o) { try { o.page_path = window.location.pathname; window.dataLayer.push(o); } catch (e) {} }

  /* ---------- 1. EVENTS ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-ev]') : null;
    if (!a) return;
    push({ event: 'se_cta_click', cta_id: a.getAttribute('data-ev'), cta_text: (a.textContent || '').trim().slice(0, 60) });
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute('data-netlify')) {
      push({ event: 'se_form_submit', form_name: f.getAttribute('name') });
    }
  });

  /* ---------- 2. SCROLL STORY ----------
     A full-screen stage stays put while the step cards travel over it. Each
     step switches the drawing's layers, the sky, the sun and the readout.
     Readout values are illustrative and are labelled so on the page. */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BANDNAME = { none: 'Not measured', green: 'Green band', yellow: 'Yellow band', orange: 'Orange band', red: 'Red band' };
  function tween(node, to, ms) {
    var from = parseFloat(node.textContent); if (isNaN(from) || reduce) { node.textContent = to.toFixed(1); return; }
    var t0 = null; if (node._raf) cancelAnimationFrame(node._raf);
    function f(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / ms); k = 1 - Math.pow(1 - k, 3); node.textContent = (from + (to - from) * k).toFixed(1); if (k < 1) node._raf = requestAnimationFrame(f); }
    node._raf = requestAnimationFrame(f);
  }
  var walks = document.querySelectorAll('[data-walk]');
  Array.prototype.forEach.call(walks, function (walk) {
    var steps = Array.prototype.slice.call(walk.querySelectorAll('.v-step'));
    var layers = Array.prototype.slice.call(walk.querySelectorAll('.ly'));
    var dots = Array.prototype.slice.call(walk.querySelectorAll('.v-walk-dots i'));
    var hudV = walk.querySelector('[data-hud-v]'), hudB = walk.querySelector('[data-hud-band]'), hudT = walk.querySelector('[data-hud-t]');
    var seen = {}, current = 0;
    function show(n) {
      if (n === current) return; current = n;
      layers.forEach(function (l) {
        var from = parseInt(l.getAttribute('data-from') || '1', 10);
        var to = parseInt(l.getAttribute('data-to') || '99', 10);
        l.classList.toggle('on', n >= from && n <= to);
      });
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i + 1 === n); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i < n); });
      var st = steps[n - 1];
      if (st) {
        var band = st.getAttribute('data-band') || 'none', val = st.getAttribute('data-val');
        walk.setAttribute('data-sky', st.getAttribute('data-sky') || 'still');
        walk.setAttribute('data-band', band);
        if (hudB) hudB.textContent = BANDNAME[band] || '';
        if (hudT) hudT.innerHTML = st.getAttribute('data-when') || '';
        if (hudV) { if (val) tween(hudV, parseFloat(val), 900); else { if (hudV._raf) cancelAnimationFrame(hudV._raf); hudV.textContent = '--.-'; } }
      }
      if (!seen[n]) { seen[n] = 1; push({ event: 'se_walk_step', walk_id: walk.getAttribute('data-walk'), walk_step: n }); }
    }
    if (!('IntersectionObserver' in window)) { layers.forEach(function (l) { l.classList.add('on'); }); steps.forEach(function (s) { s.classList.add('is-active'); }); walk.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) show(steps.indexOf(en.target) + 1); });
    }, { rootMargin: '-50% 0px -49% 0px', threshold: 0 });
    steps.forEach(function (s) { io.observe(s); });
    new IntersectionObserver(function (es, o) { es.forEach(function (en) { if (en.isIntersecting) { walk.classList.add('is-in'); o.disconnect(); } }); }, { threshold: .15 }).observe(walk.querySelector('.w-stage') || walk);
    seen = { 1: 1 }; show(1);
  });

  /* ---------- 2b. HOME READOUT: one illustrative day, reading to band to action ---------- */
  var live = document.querySelector('[data-live]');
  if (live && !reduce) {
    var DAY = [
      ['06:30', 24.1, 'green', 'Normal work. Water at every zone.', 30, 58],
      ['09:15', 26.8, 'yellow', 'Water prompted every 20 minutes. Shade break each hour.', 80, 40],
      ['11:30', 29.4, 'orange', 'Heavy work limited. Fifteen minutes of rest in every hour.', 125, 19],
      ['14:15', 31.6, 'red', 'Heavy outdoor work stops from 12 to 3. Cooling station staffed.', 165, 10],
      ['16:30', 30.1, 'orange', 'Slab work resumes in short shifts. Buddy checks continue.', 232, 25],
      ['18:45', 26.2, 'yellow', 'Day closes. Hours in each band go into the register.', 292, 47]
    ];
    var li = 3, lv = live.querySelector('[data-live-v]'), lt = live.querySelector('[data-live-t]'), lb = live.querySelector('[data-live-band]'),
        ln = live.querySelector('[data-live-name]'), la = live.querySelector('[data-live-act]'), ld = live.querySelector('[data-live-dot]');
    setInterval(function () {
      if (document.hidden) return;
      li = (li + 1) % DAY.length; var d = DAY[li];
      lt.textContent = d[0]; tween(lv, d[1], 800); lb.setAttribute('data-band', d[2]); ln.textContent = BANDNAME[d[2]]; la.textContent = d[3];
      ld.setAttribute('cx', d[4]); ld.setAttribute('cy', d[5]);
    }, 2800);
  }

  /* ---------- 2c. REVEAL ON SCROLL AND COUNT-UP ---------- */
  if ('IntersectionObserver' in window && !reduce && document.body.classList.contains('v11')) {
    var targets = document.querySelectorAll('.v-sec .v-wrap > *, .w-intro > *, .h-three > div, .h-panel, .h-card, .h-line > div, .h-stats > div, .v-grid2 > *, .v-grid3 > *, .v-get > li, .v-bands > div, .v-time > div');
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    Array.prototype.forEach.call(targets, function (n) {
      if (n.closest('.v-walk2') || n.closest('[data-dash]')) return;
      var sibs = n.parentNode.children, idx = Array.prototype.indexOf.call(sibs, n);
      n.style.setProperty('--d', Math.min(idx, 5) * 0.08 + 's');
      n.classList.add('rv'); rio.observe(n);
    });
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; cio.unobserve(en.target);
        var n = en.target, to = parseFloat(n.getAttribute('data-count')), t0 = null;
        (function f(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1400); k = 1 - Math.pow(1 - k, 3); n.textContent = Math.round(to * k); if (k < 1) requestAnimationFrame(f); })(performance.now());
      });
    }, { threshold: .6 });
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (n) { cio.observe(n); });
  }

  /* ---------- 3. REGISTER PREVIEW (illustrative data only) ---------- */
  var dash = document.querySelector('[data-dash]');
  if (!dash) return;
  var NS = 'http://www.w3.org/2000/svg';
  var main = dash.querySelector('.v-dash-main');
  var side = dash.querySelector('.v-dash-side');
  var tip = document.createElement('div'); tip.className = 'v-tip'; main.appendChild(tip);
  function el(tag, attrs, text) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; }
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.classList.add('on');
    var w = main.clientWidth, tw = tip.offsetWidth;
    tip.style.left = Math.max(0, Math.min(w - tw, x + 12)) + 'px'; tip.style.top = Math.max(0, y - tip.offsetHeight - 10) + 'px';
  }
  function hideTip() { tip.classList.remove('on'); }
  var BAND = [
    { k: 'Green', max: 26, c: '#4E8A5F' }, { k: 'Yellow', max: 28, c: '#C99A1B' },
    { k: 'Orange', max: 31, c: '#D4741F' }, { k: 'Red', max: 99, c: '#B3331F' }
  ];
  function bandOf(v) { for (var i = 0; i < BAND.length; i++) if (v < BAND[i].max) return BAND[i]; return BAND[3]; }

  /* Illustrative season: a fixed, seeded curve. Not a measured site. */
  function season() {
    var s = 7, out = [], d0 = new Date(2027, 2, 1);
    function rnd() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }
    for (var i = 0; i < 137; i++) {
      var t = i / 136;
      var base = 24.2 + 7.2 * Math.sin(Math.PI * Math.min(1, t * 1.55)) - (t > 0.72 ? (t - 0.72) * 9 : 0);
      var v = Math.round((base + (rnd() - 0.5) * 2.6) * 10) / 10;
      var d = new Date(d0.getTime() + i * 86400000);
      out.push({ d: d, v: v });
    }
    return out;
  }
  var DATA = season();
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()]; }

  var VIEWS = {
    state: {
      title: 'Where measured seasons exist',
      body: 'Each square is a state or union territory, placed roughly where it sits on the map. Today one is marked: Karnataka, where the first measured season is planned for March to July 2027. As sites sign, squares fill with the count of measured site-seasons.',
      act: 'A CSR committee, a funder or a state body sees where measured sites exist and where none do, and asks for its own state.'
    },
    district: {
      title: 'How one district compares with the next',
      body: 'Once three or more sites in a district have a season on record, the district gets a benchmark: hours above the alert band and days lost per 1,000 worker-days, across those sites. The bars here use invented values for six unnamed districts to show how it will read.',
      act: 'An EHS head with sites in several districts sees which one to measure first, and which protocol is working.'
    },
    site: {
      title: 'One site, one season',
      body: 'The record a site owner receives: the daily peak wet-bulb globe temperature through the season, set against the four alert bands, with the actions logged and the outcomes counted. Move across the chart to read any day.',
      act: 'A site head sees their own number against the bands, knows which weeks cost the most, and books the season that measures it for real.'
    }
  };

  function drawState() {
    var T = [['JK',3,0,'Jammu and Kashmir'],['LA',4,0,'Ladakh'],['PB',3,1,'Punjab'],['HP',4,1,'Himachal Pradesh'],['RJ',2,2,'Rajasthan'],['HR',3,2,'Haryana'],['CH',4,2,'Chandigarh'],['UK',5,2,'Uttarakhand'],['GJ',1,3,'Gujarat'],['DL',3,3,'Delhi'],['UP',4,3,'Uttar Pradesh'],['SK',6,3,'Sikkim'],['AR',8,3,'Arunachal Pradesh'],['MP',3,4,'Madhya Pradesh'],['BR',5,4,'Bihar'],['AS',7,4,'Assam'],['NL',8,4,'Nagaland'],['DN',1,4,'Dadra and Nagar Haveli and Daman and Diu'],['MH',2,5,'Maharashtra'],['CG',4,5,'Chhattisgarh'],['JH',5,5,'Jharkhand'],['WB',6,5,'West Bengal'],['ML',7,5,'Meghalaya'],['MN',8,5,'Manipur'],['GA',2,6,'Goa'],['TS',3,6,'Telangana'],['OD',5,6,'Odisha'],['TR',7,6,'Tripura'],['MZ',8,6,'Mizoram'],['KA',2,7,'Karnataka'],['AP',3,7,'Andhra Pradesh'],['KL',2,8,'Kerala'],['TN',3,8,'Tamil Nadu'],['PY',4,8,'Puducherry'],['LD',0,8,'Lakshadweep'],['AN',7,8,'Andaman and Nicobar Islands']];
    var c = 58, svg = el('svg', { viewBox: '0 0 540 540', role: 'img', 'aria-label': 'Tile map of Indian states and union territories. Karnataka is marked as the first planned measured season.' });
    svg.appendChild(el('text', { x: 536, y: 16, 'text-anchor': 'end', class: 'wm' }, 'PREVIEW'));
    T.forEach(function (t) {
      var x = 8 + t[1] * c, y = 8 + t[2] * c;
      var r = el('rect', { x: x, y: y, width: c - 2, height: c - 2, rx: 4, class: 'tile' + (t[0] === 'KA' ? ' first' : ''), tabindex: 0 });
      function on(ev) {
        var msg = t[0] === 'KA' ? 'First measured season planned: March to July 2027. Site walks available.' : 'No measured site yet. Open for 2027 sites: starts with a 20-minute call.';
        var b = main.getBoundingClientRect(), rb = r.getBoundingClientRect();
        showTip('<b>' + t[3] + '</b>' + msg, rb.left - b.left + rb.width / 2, rb.top - b.top);
      }
      r.addEventListener('mouseenter', on); r.addEventListener('focus', on); r.addEventListener('click', on);
      r.addEventListener('mouseleave', hideTip); r.addEventListener('blur', hideTip);
      svg.appendChild(r);
      svg.appendChild(el('text', { x: x + (c - 2) / 2, y: y + (c - 2) / 2 + 4, 'text-anchor': 'middle', class: 'tl' }, t[0]));
    });
    main.appendChild(svg);
    var lg = document.createElement('div'); lg.className = 'v-legend';
    lg.innerHTML = '<span><i style="background:#D4551F"></i>First measured season planned, 2027</span><span><i style="background:#22292D;border:1px solid #5B6468"></i>Open for 2027 sites</span>';
    main.appendChild(lg);
  }

  function drawDistrict() {
    var M = {
      hours: { label: 'Hours above the alert band, per site-season', unit: ' hours', v: [212, 186, 149, 131, 98, 77] },
      days: { label: 'Days lost per 1,000 worker-days', unit: '', v: [14.2, 11.8, 12.9, 8.4, 6.1, 5.3] }
    };
    var names = ['District A', 'District B', 'District C', 'District D', 'District E', 'District F'];
    var seg = document.createElement('div'); seg.className = 'v-seg';
    seg.innerHTML = '<button type="button" data-m="hours" aria-pressed="true">Hours above the alert band</button><button type="button" data-m="days" aria-pressed="false">Days lost per 1,000 worker-days</button>';
    main.appendChild(seg);
    var holder = document.createElement('div'); main.appendChild(holder);
    function render(k) {
      holder.innerHTML = '';
      var m = M[k], max = Math.max.apply(null, m.v), W = 640, rowH = 44, H = names.length * rowH + 34;
      var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': m.label + ', six unnamed districts, invented values for illustration.' });
      svg.appendChild(el('text', { x: W / 2 + 60, y: H / 2, 'text-anchor': 'middle', class: 'wm' }, 'ILLUSTRATIVE, NOT MEASURED'));
      names.forEach(function (n, i) {
        var y = 8 + i * rowH, w = (m.v[i] / max) * (W - 190);
        svg.appendChild(el('text', { x: 0, y: y + 19 }, n));
        var r = el('rect', { x: 96, y: y, width: Math.max(2, w), height: 28, rx: 4, fill: '#8FB3C4' });
        var hit = el('rect', { x: 0, y: y - 6, width: W, height: rowH - 2, fill: 'transparent' });
        function on() { var b = main.getBoundingClientRect(), rb = r.getBoundingClientRect(); r.setAttribute('fill', '#F5F2EB'); showTip('<b>' + n + ' · illustrative</b>' + m.v[i] + m.unit + '<br>' + m.label, rb.right - b.left - 60, rb.top - b.top); }
        hit.addEventListener('mouseenter', on); hit.addEventListener('click', on);
        hit.addEventListener('mouseleave', function () { r.setAttribute('fill', '#8FB3C4'); hideTip(); });
        svg.appendChild(r);
        svg.appendChild(el('text', { x: 96 + w + 8, y: y + 19, class: 'tl' }, String(m.v[i])));
        svg.appendChild(hit);
      });
      svg.appendChild(el('text', { x: 96, y: H - 6 }, m.label + ' (invented values)'));
      holder.appendChild(svg);
    }
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      Array.prototype.forEach.call(seg.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      render(b.getAttribute('data-m'));
    });
    render('hours');
  }

  function drawSite() {
    var W = 720, H = 360, L = 40, R = 14, T = 18, B = 34, lo = 20, hi = 34;
    function X(i) { return L + (i / (DATA.length - 1)) * (W - L - R); }
    function Y(v) { return T + (1 - (v - lo) / (hi - lo)) * (H - T - B); }
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Illustrative season chart: daily peak wet-bulb globe temperature from 1 March to 15 July against the green, yellow, orange and red alert bands. Invented data, not a measured site.' });
    [[26, 'Yellow from 26'], [28, 'Orange from 28'], [31, 'Red above 31']].forEach(function (b) {
      svg.appendChild(el('line', { x1: L, x2: W - R, y1: Y(b[0]), y2: Y(b[0]), stroke: 'rgba(245,242,235,.28)', 'stroke-dasharray': '3 5' }));
      svg.appendChild(el('text', { x: W - R, y: Y(b[0]) - 5, 'text-anchor': 'end' }, b[1] + ' °C'));
    });
    [20, 24, 28, 32].forEach(function (v) { svg.appendChild(el('text', { x: L - 8, y: Y(v) + 3, 'text-anchor': 'end' }, String(v))); });
    [0, 31, 61, 92, 122].forEach(function (i) { svg.appendChild(el('text', { x: X(i), y: H - 10 }, '1 ' + MONTHS[DATA[i].d.getMonth()])); });
    svg.appendChild(el('text', { x: W / 2, y: H / 2 + 60, 'text-anchor': 'middle', class: 'wm' }, 'ILLUSTRATIVE, NOT MEASURED'));
    var dPath = DATA.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
    svg.appendChild(el('path', { d: dPath + ' L' + X(DATA.length - 1) + ' ' + (H - B) + ' L' + L + ' ' + (H - B) + ' Z', fill: 'rgba(232,112,58,.14)' }));
    svg.appendChild(el('path', { d: dPath, fill: 'none', stroke: '#E8703A', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    var cross = el('line', { y1: T, y2: H - B, stroke: 'rgba(245,242,235,.6)', 'stroke-width': 1, visibility: 'hidden' });
    var dot = el('circle', { r: 5, fill: '#E8703A', stroke: '#151B1E', 'stroke-width': 2, visibility: 'hidden' });
    svg.appendChild(cross); svg.appendChild(dot);
    var hit = el('rect', { x: L, y: T, width: W - L - R, height: H - T - B, fill: 'transparent', style: 'cursor:crosshair' });
    function move(ev) {
      var b = svg.getBoundingClientRect(), cx = (ev.touches ? ev.touches[0].clientX : ev.clientX);
      var px = (cx - b.left) / b.width * W;
      var i = Math.round((px - L) / (W - L - R) * (DATA.length - 1)); i = Math.max(0, Math.min(DATA.length - 1, i));
      var p = DATA[i], bd = bandOf(p.v);
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', X(i)); dot.setAttribute('cy', Y(p.v)); dot.setAttribute('visibility', 'visible');
      var mb = main.getBoundingClientRect();
      showTip('<b>' + fmt(p.d) + ' · illustrative</b>Peak WBGT ' + p.v.toFixed(1) + ' °C<br><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:' + bd.c + ';margin-right:5px"></i>' + bd.k + ' band', b.left - mb.left + X(i) / W * b.width, b.top - mb.top + Y(p.v) / H * b.height);
    }
    hit.addEventListener('mousemove', move); hit.addEventListener('touchstart', move, { passive: true }); hit.addEventListener('touchmove', move, { passive: true });
    hit.addEventListener('mouseleave', function () { hideTip(); cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); });
    svg.appendChild(hit);
    main.appendChild(svg);
    /* days by band */
    var counts = [0, 0, 0, 0];
    DATA.forEach(function (p) { counts[BAND.indexOf(bandOf(p.v))]++; });
    var bar = el('svg', { viewBox: '0 0 720 44', role: 'img', 'aria-label': 'Days of the illustrative season in each band: green ' + counts[0] + ', yellow ' + counts[1] + ', orange ' + counts[2] + ', red ' + counts[3] + '.' });
    var x = 0;
    counts.forEach(function (c, i) {
      var w = c / DATA.length * 720;
      bar.appendChild(el('rect', { x: x + 1, y: 10, width: Math.max(0, w - 2), height: 22, rx: 4, fill: BAND[i].c }));
      x += w;
    });
    main.appendChild(bar);
    var lg = document.createElement('div'); lg.className = 'v-legend';
    lg.innerHTML = counts.map(function (c, i) { return '<span><i style="background:' + BAND[i].c + '"></i>' + BAND[i].k + ': ' + c + ' days</span>'; }).join('');
    main.appendChild(lg);
    var st = document.createElement('div'); st.className = 'v-dash-stats';
    st.innerHTML = '<div><span class="n">' + (counts[2] + counts[3]) + '</span><span class="l">days in the orange or red band (illustrative)</span></div>' +
      '<div><span class="n">' + Math.max.apply(null, DATA.map(function (p) { return p.v; })).toFixed(1) + '</span><span class="l">highest daily peak, °C WBGT (illustrative)</span></div>';
    side.appendChild(st);
  }

  function view(k) {
    main.innerHTML = ''; main.appendChild(tip); hideTip();
    var v = VIEWS[k];
    side.innerHTML = '<h3>' + v.title + '</h3><p>' + v.body + '</p><div class="act"><b>What it pushes the reader to do</b><p>' + v.act + '</p></div>';
    if (k === 'state') drawState(); else if (k === 'district') drawDistrict(); else drawSite();
    Array.prototype.forEach.call(dash.querySelectorAll('.v-tabs button'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-view') === k ? 'true' : 'false'); });
  }
  dash.querySelector('.v-tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    view(b.getAttribute('data-view'));
    push({ event: 'se_dash_view', dash_view: b.getAttribute('data-view') });
  });
  view('site');
})();
