/* ═══════════════════════════════════════════
   NINA FISIOTERAPIA — interações
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── ano no rodapé ── */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── header fixo + barra de progresso ── */
  var header = document.getElementById('header');
  var bar = document.getElementById('progressBar');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('stuck', y > 12);
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── menu mobile ── */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var backdrop = document.getElementById('navBackdrop');

  function closeMenu() {
    nav.classList.remove('open');
    burger.classList.remove('open');
    backdrop.classList.remove('on');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    backdrop.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open && window.innerWidth <= 1024 ? 'hidden' : '';
  });

  backdrop.addEventListener('click', closeMenu);
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && nav.classList.contains('open')) closeMenu();
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── animações de entrada ── */
  var revealables = document.querySelectorAll('.reveal, .step, h1');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { io.observe(el); });

    /* rede de segurança: se o observer não disparar, mostra tudo mesmo assim */
    window.addEventListener('load', function () {
      setTimeout(function () {
        revealables.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
      }, 1200);
    });
  }

  /* ── contadores animados ── */
  function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = null;

    if (reduced) {
      el.textContent = prefix + formatNumber(target) + suffix;
      return;
    }

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + formatNumber(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ── carrossel de depoimentos em vídeo ── */
  var reels = document.getElementById('reels');
  if (reels) {
    var rPrev = document.getElementById('reelPrev');
    var rNext = document.getElementById('reelNext');

    function step() {
      var card = reels.querySelector('.reel');
      if (!card) return 260;
      return card.getBoundingClientRect().width + 18;
    }

    function syncNav() {
      var max = reels.scrollWidth - reels.clientWidth - 4;
      rPrev.disabled = reels.scrollLeft <= 4;
      rNext.disabled = reels.scrollLeft >= max;
    }

    rPrev.addEventListener('click', function () { reels.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
    rNext.addEventListener('click', function () { reels.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
    reels.addEventListener('scroll', syncNav, { passive: true });
    window.addEventListener('resize', syncNav);
    syncNav();

    /* ── player em modal ── */
    var vmodal = document.getElementById('vmodal');
    var vmVideo = document.getElementById('vmVideo');
    var vmCap = document.getElementById('vmCap');
    var vmLastFocus = null;

    function openVideo(btn) {
      vmLastFocus = btn;
      vmVideo.src = btn.getAttribute('data-video');
      vmCap.innerHTML = '<b>' + btn.getAttribute('data-titulo') + '</b> · ' + btn.getAttribute('data-sub');
      vmodal.hidden = false;
      document.body.style.overflow = 'hidden';
      document.getElementById('vmClose').focus();
      var p = vmVideo.play();
      if (p && p.catch) p.catch(function () { /* navegador pediu gesto extra: os controles resolvem */ });
    }

    function closeVideo() {
      vmVideo.pause();
      vmVideo.removeAttribute('src');
      vmVideo.load();
      vmodal.hidden = true;
      document.body.style.overflow = '';
      if (vmLastFocus) vmLastFocus.focus({ preventScroll: true });
    }

    reels.querySelectorAll('.reel').forEach(function (btn) {
      btn.addEventListener('click', function () { openVideo(btn); });
    });

    document.getElementById('vmClose').addEventListener('click', closeVideo);
    vmodal.addEventListener('click', function (e) { if (e.target === vmodal) closeVideo(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !vmodal.hidden) closeVideo();
    });
  }

  /* ── tratamentos no celular: card compacto que abre ao tocar ── */
  var compacto = window.matchMedia('(max-width: 620px)');
  var cards = Array.prototype.slice.call(
    document.querySelectorAll('.tratamentos .card:not(.card-cta)')
  );

  function abreCard(card) {
    if (!compacto.matches) return;
    var aberto = card.classList.toggle('open');
    card.setAttribute('aria-expanded', String(aberto));
  }

  function sincronizaCards() {
    var on = compacto.matches;
    cards.forEach(function (card) {
      if (on) {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');
      } else {
        card.removeAttribute('role');
        card.removeAttribute('tabindex');
        card.removeAttribute('aria-expanded');
        card.classList.remove('open');
      }
    });
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      abreCard(card);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        abreCard(card);
      }
    });
  });

  sincronizaCards();
  if (compacto.addEventListener) compacto.addEventListener('change', sincronizaCards);
  else if (compacto.addListener) compacto.addListener(sincronizaCards);

  /* ── accordion: abre um por vez ── */
  var accs = document.querySelectorAll('.acc');
  accs.forEach(function (acc) {
    acc.addEventListener('toggle', function () {
      if (!acc.open) return;
      accs.forEach(function (other) {
        if (other !== acc) other.open = false;
      });
    });
  });

  /* ── lightbox da galeria ── */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lastFocus = null;

  function openLb(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }

  function closeLb() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  document.querySelectorAll('.gal-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      openLb(item.getAttribute('data-src'), img ? img.alt : '');
    });
  });

  document.getElementById('lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lb.hidden) closeLb();
  });
})();
