/* ============================================================
   SYNTROPY EARTH — Motion Engine
   Restrained, performant, accessible.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV: solid on scroll ---------- */
  var nav = document.querySelector('.nav');
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('nav--solid');
    else nav.classList.remove('nav--solid');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- SCROLL REVEALS ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- COUNT-UP STATS ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var dur = 1600, start = null;
    if (reduceMotion) { el.textContent = format(target, decimals); return; }
    function format(v, d) {
      return v.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target, decimals);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }

  /* ---------- SYNTROPY FIELD (hero canvas) ---------- */
  /* Particles drift then organise toward connection — entropy becoming order. */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, particles = [], raf = null, visible = true;
    var COUNT, LINK_DIST;

    function size() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var area = w * h;
      COUNT = Math.max(18, Math.min(64, Math.round(area / 22000)));
      LINK_DIST = w < 700 ? 90 : 130;
    }

    function makeParticles() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(138,174,152,0.62)';
        ctx.fill();
      }
      /* links — the "organising" effect */
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            var op = (1 - dist / LINK_DIST) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(196,217,204,' + op + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      if (visible) raf = requestAnimationFrame(frame);
    }

    function startField() { if (!raf) { raf = requestAnimationFrame(frame); } }
    function stopField() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size(); makeParticles(); startField();

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { size(); makeParticles(); }, 200);
    }, { passive: true });

    /* pause when hero scrolled out of view */
    var hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) startField(); else stopField();
      }, { threshold: 0 }).observe(hero);
    }
    /* pause when tab hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopField();
      else if (visible) startField();
    });
  }

  /* ---------- WHY: entropy → syntropy coalesce ---------- */
  var coSvg = document.getElementById('why-mark');
  if (coSvg) {
    var NS = 'http://www.w3.org/2000/svg';
    var rings = [{ r: 21, n: 11 }, { r: 15, n: 8 }, { r: 9, n: 6 }];
    var targets = [];
    rings.forEach(function (ring) {
      for (var i = 0; i < ring.n; i++) {
        var a = (i / ring.n) * Math.PI * 2 - Math.PI / 2;
        targets.push({ x: 24 + Math.cos(a) * ring.r, y: 24 + Math.sin(a) * ring.r });
      }
    });
    var dots = targets.map(function (t) {
      var d = document.createElementNS(NS, 'circle');
      d.setAttribute('r', '1');
      d.setAttribute('class', 'coalesce-dot');
      var sx = Math.random() * 48, sy = Math.random() * 48;
      d.setAttribute('cx', sx); d.setAttribute('cy', sy);
      coSvg.insertBefore(d, coSvg.firstChild);
      return { el: d, sx: sx, sy: sy, tx: t.x, ty: t.y };
    });
    var settleCoalesce = function (immediate) {
      if (immediate) {
        dots.forEach(function (o) { o.el.setAttribute('cx', o.tx); o.el.setAttribute('cy', o.ty); o.el.style.opacity = '0'; });
        coSvg.classList.add('settled');
        return;
      }
      var dur = 3400, start = null;
      dots.forEach(function (o) { o.el.style.opacity = '0.85'; });
      var stepC = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        dots.forEach(function (o) {
          o.el.setAttribute('cx', o.sx + (o.tx - o.sx) * e);
          o.el.setAttribute('cy', o.sy + (o.ty - o.sy) * e);
          o.el.style.opacity = String(0.85 * (1 - p));
        });
        if (p < 1) requestAnimationFrame(stepC);
        else { dots.forEach(function (o) { o.el.style.opacity = '0'; }); coSvg.classList.add('settled'); }
      };
      requestAnimationFrame(stepC);
    };
    if (reduceMotion) { settleCoalesce(true); }
    else if ('IntersectionObserver' in window) {
      var obC = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { settleCoalesce(false); obC.unobserve(e.target); } });
      }, { threshold: 0.4 });
      obC.observe(coSvg);
    } else { settleCoalesce(true); }
  }

  /* ---------- CURRENT YEAR in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
