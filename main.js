/* ══════════════════════════════════════════
   AMANE NATURAL — main.js
   Compartido por todas las páginas
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV: scroll transparency ── */
  const nav = document.querySelector('.site-nav');
  if (nav && nav.classList.contains('site-nav--transparent')) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── FADE UP on scroll ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── FILTER BAR (productos) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    const cards = document.querySelectorAll('.product-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach(card => {
          card.style.display = (f === 'all' || card.dataset.filter === f) ? '' : 'none';
        });
      });
    });
  }

  /* ── PRODUCT MODAL (productos) ── */
  const modal        = document.getElementById('modal');
  const modalImg     = document.getElementById('modalImg');
  const modalTitle   = document.getElementById('modalTitle');
  const modalCat     = document.getElementById('modalCategory');
  const modalDesc    = document.getElementById('modalDesc');
  const modalBenef   = document.getElementById('modalBenefits');
  const modalClose   = document.getElementById('modalClose');

  if (modal) {
    const openModal = (card) => {
      modalImg.src          = card.dataset.img;
      modalImg.alt          = card.dataset.name;
      modalTitle.textContent = card.dataset.name;
      modalCat.textContent   = card.dataset.category;
      modalDesc.textContent  = card.dataset.desc;
      modalBenef.innerHTML   = card.dataset.benefits
        .split('|')
        .map(b => `<div class="benefit-item"><span class="benefit-dot"></span>${b}</div>`)
        .join('');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.product-card__quick-view').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.closest('.product-card')); });
    });
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

    // Hamburger
    const burger = document.getElementById('navBurger');
    const navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
      });
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          burger.classList.remove('open');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
});

/* ── MODAL DE PRODUCTOS CON CARRITO ── */
(function () {
  const WA_NUMBER = '5493536561455';
  const WA_BASE   = `https://wa.me/${WA_NUMBER}?text=`;
 
  const modal       = document.getElementById('modal');
  const modalClose  = document.getElementById('modalClose');
  const modalImg    = document.getElementById('modalImg');
  const modalCat    = document.getElementById('modalCategory');
  const modalTitle  = document.getElementById('modalTitle');
  const modalDesc   = document.getElementById('modalDesc');
  const modalBenef  = document.getElementById('modalBenefits');
  const modalWaBtn  = document.getElementById('modalWaBtn');
  const qtyMinus    = document.getElementById('qtyMinus');
  const qtyPlus     = document.getElementById('qtyPlus');
  const qtyValue    = document.getElementById('qtyValue');
 
  let currentProduct = '';
  let qty = 1;
 
  /* Construye el link de WA con el mensaje dinámico */
  function buildWaLink(productName, quantity) {
    const msg = `Hola Amane, Quiero comprar ${productName}, necesito ${quantity}.`;
    return WA_BASE + encodeURIComponent(msg);
  }
 
  /* Actualiza el link cada vez que cambia cantidad o producto */
  function refreshWaLink() {
    modalWaBtn.href = buildWaLink(currentProduct, qty);
  }
 
  /* Controles de cantidad */
  qtyMinus.addEventListener('click', () => {
    if (qty > 1) { qty--; qtyValue.textContent = qty; refreshWaLink(); }
  });
  qtyPlus.addEventListener('click', () => {
    if (qty < 99) { qty++; qtyValue.textContent = qty; refreshWaLink(); }
  });
 
  /* Abrir modal */
  document.querySelectorAll('.product-card__quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;
 
      currentProduct = card.dataset.name  || '';
      qty = 1;
      qtyValue.textContent = qty;
 
      modalImg.src           = card.dataset.img      || '';
      modalImg.alt           = currentProduct;
      modalCat.textContent   = card.dataset.category || '';
      modalTitle.textContent = currentProduct;
      modalDesc.textContent  = card.dataset.desc     || '';
 
      /* Beneficios */
      modalBenef.innerHTML = '';
      (card.dataset.benefits || '').split('|').forEach(b => {
        if (!b.trim()) return;
        const el = document.createElement('div');
        el.className = 'benefit-item';
        el.innerHTML = `<span class="benefit-check">✓</span> ${b.trim()}`;
        modalBenef.appendChild(el);
      });
 
      refreshWaLink();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
 
  /* Cerrar modal */
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
