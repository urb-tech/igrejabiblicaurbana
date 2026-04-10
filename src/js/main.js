/* main.js v3 — Igreja Bíblica Urbana
   Nav pill scroll, carrossel, reveal animations, copiar, dar */

const BASE = 'src/assets/components/';

async function carregarComponente(sel, ficheiro) {
  const el = document.querySelector(sel);
  if (!el) return;
  try {
    const res = await fetch(BASE + ficheiro);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    el.innerHTML = await res.text();
  } catch (err) { console.warn('Componente:', ficheiro, err); }
}

async function iniciarNav() {
  await carregarComponente('#nav-placeholder', 'nav.html');
  const paginaActual = document.body.dataset.page;
  if (paginaActual) {
    const link = document.querySelector(`.nav-links a[data-page="${paginaActual}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const exp = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', exp ? 'false' : 'true');
      nav.classList.toggle('nav-mobile-open', !exp);
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav-mobile-open');
      });
    });
  }
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

function iniciarCarrossel() {
  const BANNER = [
    { src: 'src/assets/imagens/banner/banner-01.jpg', alt: 'Comunidade IBU reunida' },
    { src: 'src/assets/imagens/banner/banner-02.jpg', alt: 'Culto dominical IBU' },
    { src: 'src/assets/imagens/banner/banner-03.jpg', alt: 'Ministério de crianças IBU' },
  ];
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const placeholder = carousel.querySelector('.carousel-placeholder');
  let dotsEl = carousel.querySelector('.carousel-dots');
  if (!dotsEl) { dotsEl = document.createElement('div'); dotsEl.className = 'carousel-dots'; dotsEl.setAttribute('aria-hidden', 'true'); carousel.appendChild(dotsEl); }
  const slides = [], dots = [];
  BANNER.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide' + (i === 0 ? ' activo' : '');
    slide.style.backgroundImage = `url(${img.src})`;
    slide.setAttribute('role', 'img'); slide.setAttribute('aria-label', img.alt);
    carousel.insertBefore(slide, dotsEl); slides.push(slide);
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' activo' : '');
    dot.setAttribute('aria-label', `Ver imagem ${i + 1}`);
    dotsEl.appendChild(dot); dots.push(dot);
  });
  if (placeholder) placeholder.remove();
  let atual = 0, timer;
  function ir(n) {
    slides[atual].classList.remove('activo'); dots[atual].classList.remove('activo');
    atual = (n + BANNER.length) % BANNER.length;
    slides[atual].classList.add('activo'); dots[atual].classList.add('activo');
  }
  function reiniciarTimer() { clearInterval(timer); timer = setInterval(() => ir(atual + 1), 5000); }
  dots.forEach((dot, i) => dot.addEventListener('click', () => { ir(i); reiniciarTimer(); }));
  let touchX = null;
  carousel.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { ir(atual + (dx < 0 ? 1 : -1)); reiniciarTimer(); }
    touchX = null;
  }, { passive: true });
  reiniciarTimer();
}

function iniciarReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.classList.add('visible'); observer.unobserve(entry.target); }),
    { threshold: 0, rootMargin: '0px 0px 80px 0px' }
  );
  els.forEach(el => observer.observe(el));
}

function iniciarCopiar() {
  document.querySelectorAll('.btn-copiar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.payment-card');
      const val = card ? card.querySelector('.payment-card-val') : null;
      const texto = val ? val.textContent.trim() : '';
      if (!texto) return;
      try {
        await navigator.clipboard.writeText(texto);
        const orig = btn.textContent;
        btn.textContent = '✓ Copiado'; btn.classList.add('copiado');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('copiado'); }, 2000);
      } catch { btn.textContent = 'Erro'; }
    });
  });
}

function iniciarDar() {
  document.querySelectorAll('.dar-valor[data-valor]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dar-valor').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      const custom = document.querySelector('.dar-valor-custom');
      if (custom) custom.value = '';
    });
  });
  document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
    });
  });
  const btnStripe = document.querySelector('.btn-stripe');
  if (btnStripe) btnStripe.addEventListener('click', () => { alert('Integração Stripe em breve. Use o IBAN ou MB Way.'); });
}

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([iniciarNav(), carregarComponente('#footer-placeholder', 'footer.html')]);
  iniciarCarrossel();
  iniciarReveal();
  iniciarCopiar();
  iniciarDar();
});