/* ============================================================
   MAIN.JS — Igreja Bíblica Urbana · igrejabiblicaurbana.pt
   Responsabilidades:
     1. Carregar nav e footer via fetch
     2. Marcar link activo na navegação
     3. Menu móvel (hambúrguer)
     4. Carrossel com as 3 imagens do banner
   ============================================================ */

/* ------------------------------------------------------------
   1. COMPONENTES VIA FETCH
   ------------------------------------------------------------ */
const BASE = '../assets/components/';

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

  /* Marcar página activa */
  const paginaActual = document.body.dataset.page;
  if (paginaActual) {
    const link = document.querySelector(`.nav-links a[data-page="${paginaActual}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }

  /* Menu hambúrguer */
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expandido = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expandido));
      nav.classList.toggle('nav-mobile-open', !expandido);
    });

    /* Fechar ao clicar num link */
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav-mobile-open');
      });
    });
  }
}

/* ------------------------------------------------------------
   2. CARROSSEL
   ------------------------------------------------------------ */
const BANNER = [
  { src: '../assets/imagens/banner/banner-01.jpg', alt: 'Comunidade da Igreja Bíblica Urbana reunida' },
  { src: '../assets/imagens/banner/banner-02.jpg', alt: 'Culto dominical da Igreja Bíblica Urbana' },
  { src: '../assets/imagens/banner/banner-03.jpg', alt: 'Ministério de crianças — Miúdos IBU' },
];

const INTERVALO_MS = 4500;

function iniciarCarrossel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const placeholder = carousel.querySelector('.carousel-placeholder');
  const dotsEl      = carousel.querySelector('.carousel-dots') || criarDots(carousel);

  /* Criar slides */
  BANNER.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide' + (i === 0 ? ' activo' : '');
    slide.style.backgroundImage = `url(${img.src})`;
    slide.setAttribute('role', 'img');
    slide.setAttribute('aria-label', img.alt);
    carousel.insertBefore(slide, dotsEl);
  });

  if (placeholder) placeholder.remove();

  /* Criar dots */
  BANNER.forEach((img, i) => {
    const dot = document.createElement('button');
    dot.className  = 'carousel-dot' + (i === 0 ? ' activo' : '');
    dot.setAttribute('aria-label', 'Ver imagem ' + (i + 1) + ': ' + img.alt);
    dotsEl.appendChild(dot);
  });

  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots   = carousel.querySelectorAll('.carousel-dot');
  let atual    = 0;
  let timer;

  function ir(n) {
    slides[atual].classList.remove('activo');
    dots[atual].classList.remove('activo');
    atual = ((n % BANNER.length) + BANNER.length) % BANNER.length;
    slides[atual].classList.add('activo');
    dots[atual].classList.add('activo');
  }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => ir(atual + 1), INTERVALO_MS);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { ir(i); reiniciarTimer(); });
  });

  /* Swipe em toque */
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

function criarDots(carousel) {
  const d = document.createElement('div');
  d.className = 'carousel-dots';
  d.setAttribute('aria-hidden', 'true');
  carousel.appendChild(d);
  return d;
}

/* ------------------------------------------------------------
   3. INIT
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  iniciarNav();
  carregarComponente('#footer-placeholder', 'footer.html');
  iniciarCarrossel();
});
