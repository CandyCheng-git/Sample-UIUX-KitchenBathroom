  /*
  ---------------------------------------------
  Hero 16:9 Slider (Top of Main Banner)
  ---------------------------------------------
  */
  (function () {
    const root   = document.querySelector('.ekb-hero');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.ekb-hero__slide'));
    const prev   = root.querySelector('.ekb-hero__nav--prev');
    const next   = root.querySelector('.ekb-hero__nav--next');
    const dotsEl = root.querySelector('.ekb-hero__dots');

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
Bathroom
---------------------------------------------
*/
// Bathroom carousel (16:9, no inner scroll, stable height)
$('#bathroom .owl-men-item').owlCarousel({
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

// ---- Projects grid (Isotope + Lightbox) ----
$(window).on('load', function () {
  var $grid = $('#project-grid').isotope({
    itemSelector: '.proj-item',
    percentPosition: true,
    masonry: { columnWidth: '.proj-sizer', gutter: 0 }
  });

  // filter buttons
  $('.projects-filters').on('click', 'button', function(){
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
    $('.projects-filters button').removeClass('is-checked');
    $(this).addClass('is-checked');
  });

  // re-layout after each image loads (keeps rows tidy)
  $('#project-grid img').each(function(){
    if (this.complete) $grid.isotope('layout');
    else $(this).one('load', function(){ $grid.isotope('layout'); });
  });
});
