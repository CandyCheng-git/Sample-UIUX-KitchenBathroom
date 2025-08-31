  /*
  ---------------------------------------------
  Home 16:9 Slider (Top of Main Banner)
  ---------------------------------------------
  */
  (function () {
    const root   = document.querySelector('.ekb-home');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.ekb-home__slide'));
    const prev   = root.querySelector('.ekb-home__nav--prev');
    const next   = root.querySelector('.ekb-home__nav--next');
    const dotsEl = root.querySelector('.ekb-home__dots');

    let index = 0;
    let timer = null;
    const INTERVAL = 10000; // ms

    // Build dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => goTo(i, true));
      dotsEl.appendChild(b);
    });

    function updateUI() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dotsEl.querySelectorAll('button').forEach((b, i) => {
        b.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    function goTo(i, user = false) {
      index = (i + slides.length) % slides.length;
      updateUI();
      restart(user);
    }

    function nextSlide() { goTo(index + 1); }
    function prevSlide() { goTo(index - 1); }

    prev.addEventListener('click', prevSlide);
    next.addEventListener('click', nextSlide);

    // Auto-rotate
    function start() { timer = setInterval(nextSlide, INTERVAL); }
    function stop()  { if (timer) clearInterval(timer); timer = null; }
    function restart(user = false) {
      stop();
      // If user interacted, give them a longer pause before resuming
      setTimeout(start, user ? 7000 : 1000);
    }

    // Pause on hover/focus for accessibility
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Basic touch-swipe
    let startX = 0, dx = 0;
    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; dx = 0; stop();
    }, { passive: true });
    root.addEventListener('touchmove', (e) => {
      dx = e.touches[0].clientX - startX;
    }, { passive: true });
    root.addEventListener('touchend', () => {
      if (Math.abs(dx) > 40) (dx < 0 ? nextSlide : prevSlide)();
      start();
    });

    // Init
    updateUI();
    start();
  })();

  /*
  ---------------------------------------------
  Client Comments
  ---------------------------------------------
  */
  // Client Comments Carousel
  $('.section#comment .owl-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 20,
      autoplay: true,
      autoplayTimeout: 10000,
      smartSpeed: 600,
      dots: true
  });


/*
---------------------------------------------
Service
---------------------------------------------
*/
// service carousel (16:9, no inner scroll, stable height)
$('#service .owl-men-item').owlCarousel({
  items: 1,
  loop: true,
  margin: 20,
  autoplay: true,
  autoplayTimeout: 5000,
  smartSpeed: 600,
  dots: true,
  nav: false,
  autoHeight: true, // adapts to caption without creating inner scroll
  responsive: {
    768: { items: 2 },   // optional: 2 across on tablets+
    1200:{ items: 3 }    // optional: 3 across on desktops
  }
});

/*
---------------------------------------------
Gallery
---------------------------------------------
*/

  document.addEventListener("DOMContentLoaded", () => {
    new Swiper(".gallery-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });
  });

/*
---------------------------------------------
Video
---------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
  const wrap   = document.querySelector('#video .video-scroll');
  const btnPrev = document.querySelector('#video .video-btn.prev');
  const btnNext = document.querySelector('#video .video-btn.next');
  if (!wrap || !btnPrev || !btnNext) return;

  // -------- Drag-to-scroll (pointer events)
  let isDown = false, startX = 0, startLeft = 0, moved = 0;

  const stopDrag = (e) => {
    if (!isDown) return;
    isDown = false;
    wrap.classList.remove('dragging');
    try { e.pointerId && wrap.releasePointerCapture(e.pointerId); } catch {}
    // Snap gently to the nearest card edge after drag
    snapToCard();
  };

  wrap.addEventListener('pointerdown', e => {
    isDown = true; moved = 0;
    startX = e.clientX; startLeft = wrap.scrollLeft;
    wrap.classList.add('dragging');
    try { wrap.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  });

  wrap.addEventListener('pointermove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX; moved += Math.abs(dx);
    wrap.scrollLeft = startLeft - dx;
    updateButtons();
  });

  wrap.addEventListener('pointerup', stopDrag);
  wrap.addEventListener('pointercancel', stopDrag);
  wrap.addEventListener('pointerleave', stopDrag);

  // Prevent clicks after a drag
  wrap.addEventListener('click', e => {
    if (moved > 5) e.preventDefault();
    moved = 0;
  }, true);

  // -------- Arrow buttons
  function getGapPx() {
    const gap = getComputedStyle(wrap).gap || '0px';
    return parseFloat(gap) || 0;
  }
  function getCardWidth() {
    const card = wrap.querySelector('.video-card');
    if (!card) return 300;
    return card.getBoundingClientRect().width + getGapPx();
  }
  function scrollByCards(n = 1) {
    const step = getCardWidth() * n;
    wrap.scrollBy({ left: step, behavior: 'smooth' });
    // defer button update slightly to let smooth scroll begin
    setTimeout(updateButtons, 50);
  }
  btnPrev.addEventListener('click', () => scrollByCards(-1));
  btnNext.addEventListener('click', () => scrollByCards(+1));

  // Snap to nearest card (for a clean stop after drag)
  let snapTimer;
  function snapToCard() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const step = getCardWidth();
      const pos  = wrap.scrollLeft;
      const idx  = Math.round(pos / step);
      const target = idx * step;
      wrap.scrollTo({ left: target, behavior: 'smooth' });
      updateButtons();
    }, 10);
  }

  // -------- Enable/disable buttons at edges
  function updateButtons() {
    const max = wrap.scrollWidth - wrap.clientWidth - 1; // tolerance
    btnPrev.disabled = wrap.scrollLeft <= 1;
    btnNext.disabled = wrap.scrollLeft >= max;
  }

  // Update on scroll/resize/content changes
  wrap.addEventListener('scroll', () => { requestAnimationFrame(updateButtons); });
  window.addEventListener('resize', () => { requestAnimationFrame(updateButtons); });

  // In case embeds change sizes after load
  setTimeout(updateButtons, 400);
  updateButtons();
});

/*
---------------------------------------------
FAQ
---------------------------------------------
*/
document.addEventListener("DOMContentLoaded", function() {
  const faqs = document.querySelectorAll(".faq-item");

  faqs.forEach(item => {
    const question = item.querySelector(".faq-question");
    const toggle = item.querySelector(".faq-toggle");

    question.addEventListener("click", () => {
      // Close all others
      faqs.forEach(f => {
        if (f !== item) {
          f.classList.remove("active");
          f.querySelector(".faq-toggle").textContent = "+";
        }
      });

      // Toggle current
      item.classList.toggle("active");
      toggle.textContent = item.classList.contains("active") ? "×" : "+";
    });
  });
});

/*
---------------------------------------------
Fade-in base
---------------------------------------------
*/

  (function () {
    // Mark all sections for animation
    document.querySelectorAll('.section').forEach(s => s.setAttribute('data-animate',''));

    const opts = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 };
    const onIntersect = (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(onIntersect, opts);
      document.querySelectorAll('.section[data-animate], .reveal').forEach(el => io.observe(el));
    } else {
      // Fallback: show everything
      document.querySelectorAll('.section, .reveal').forEach(el => el.classList.add('is-visible'));
    }
  })();