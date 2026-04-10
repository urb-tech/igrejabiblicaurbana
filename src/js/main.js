/* main.js — Igreja Bíblica Urbana
   Fetch de nav/footer, carrossel, menu móvel */

const BASE = 'src/assets/components/';

async function carregarComponente(selectorPlaceholder, ficheiro) {
  const el = document.querySelector(selectorPlaceholder);
  if (!el) return;
  try {
    const res = await fetch(BASE + ficheiro);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    el.innerHTML = await res.text();
  } catch (err) {
    console.warn('Erro ao carregar componente:', ficheiro, err);
  }
}

async function iniciarNav() {
  await carregarComponente('#nav-placeholder', 'nav.html');

  const paginaActual = document.body.dataset.page;
  if (paginaActual) {
    const link = document.querySelector(`.nav-links a[data-page="${paginaActual}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expandido = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expandido ? 'false' : 'true');
      nav.classList.toggle('nav-mobile-open', !expandido);
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav-mobile-open');
      });
    });
  }
}

function iniciarCarrossel() {
  const BANNER = [
    { src: 'src/assets/imagens/banner/banner-01.jpg', alt: 'Comunidade da Igreja Bíblica Urbana reunida' },
    { src: 'src/assets/imagens/banner/banner-02.jpg', alt: 'Culto dominical da Igreja Bíblica Urbana' },
    { src: 'src/assets/imagens/banner/banner-03.jpg', alt: 'Ministério de crianças — Miúdos IBU' },
  ];
  const INTERVALO_MS = 4500;

  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const placeholder = carousel.querySelector('.carousel-placeholder');

  // Garantir contentor de dots
  let dotsEl = carousel.querySelector('.carousel-dots');
  if (!dotsEl) {
    dotsEl = document.createElement('div');
    dotsEl.className = 'carousel-dots';
    dotsEl.setAttribute('aria-hidden', 'true');
    carousel.appendChild(dotsEl);
  }

  // Uma só passagem: criar slide + dot por imagem
  const slides = [];
  const dots   = [];
  BANNER.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide' + (i === 0 ? ' activo' : '');
    slide.style.backgroundImage = `url(${img.src})`;
    slide.setAttribute('role', 'img');
    slide.setAttribute('aria-label', img.alt);
    carousel.insertBefore(slide, dotsEl);
    slides.push(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' activo' : '');
    dot.setAttribute('aria-label', 'Ver imagem ' + (i + 1) + ': ' + img.alt);
    dotsEl.appendChild(dot);
    dots.push(dot);
  });

  if (placeholder) placeholder.remove();

  let atual = 0;
  let timer;

  function ir(n) {
    slides[atual].classList.remove('activo');
    dots[atual].classList.remove('activo');
    atual = (n + BANNER.length) % BANNER.length;
    slides[atual].classList.add('activo');
    dots[atual].classList.add('activo');
  }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => ir(atual + 1), INTERVALO_MS);
  }

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

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    iniciarNav(),
    carregarComponente('#footer-placeholder', 'footer.html'),
  ]);
  iniciarCarrossel();
});
