/*!
 * Edge Kitchens & Bathrooms – Unified Frontend JS
 * Vanilla + jQuery (noConflict-safe)
 * Guards for optional libs (Owl, Swiper, Parallax)
 * Single-source smooth-scroll with sticky-header offset
 */
(function () {
  'use strict';

  /* ---------------------------
     Helpers
  --------------------------- */
  const $qs  = (sel, ctx=document) => ctx.querySelector(sel);
  const $qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const debounce = (fn, wait=120) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; };
  const getGapPx = (el) => parseFloat(getComputedStyle(el).gap || '0') || 0;
  const getHeaderOffset = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--header-offset');
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 90;
  };
  const smoothScrollTo = (el) => {
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  /* ====================================================
     Home 16:9 Slider
  ==================================================== */
  (function () {
    const root = $qs('.ekb-home');
    if (!root) return;

    const slides = $qsa('.ekb-home__slide', root);
    const prev   = $qs('.ekb-home__nav--prev', root);
    const next   = $qs('.ekb-home__nav--next', root);
    const dotsEl = $qs('.ekb-home__dots', root);
    if (!slides.length || !prev || !next || !dotsEl) return;

    let index = 0, timer = null;
    const INTERVAL = 10000;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ekb-home__dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.setAttribute('aria-controls', `ekb-slide-${i}`);
      b.addEventListener('click', () => goTo(i, true));
      dotsEl.appendChild(b);
    });
    slides.forEach((s, i) => s.id = s.id || `ekb-slide-${i}`);

    function updateUI() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      $qsa('button', dotsEl).forEach((b, i) => {
        const active = i === index;
        b.setAttribute('aria-selected', active ? 'true' : 'false');
        b.classList.toggle('is-active', active);
      });
    }
    function goTo(i, user=false){ index=(i+slides.length)%slides.length; updateUI(); restart(user); }
    function nextSlide(){ goTo(index+1); }
    function prevSlide(){ goTo(index-1); }
    prev.addEventListener('click', prevSlide);
    next.addEventListener('click', nextSlide);

    function start(){ if (!timer) timer=setInterval(nextSlide, INTERVAL); }
    function stop(){ if (timer) clearInterval(timer); timer=null; }
    function restart(user=false){ stop(); setTimeout(start, user?7000:1000); }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    let startX=0, dx=0;
    root.addEventListener('touchstart', e => { startX=e.touches[0].clientX; dx=0; stop(); }, { passive:true });
    root.addEventListener('touchmove', e => { dx=e.touches[0].clientX - startX; }, { passive:true });
    root.addEventListener('touchend', () => { if (Math.abs(dx)>40) (dx<0?nextSlide():prevSlide()); start(); });

    updateUI(); start();
  })();

  /* ====================================================
     Client Comments (Owl)
  ==================================================== */
  (function(){
    const jq = window.jQuery || window.$; if (!jq) return; const $ = jq;
    if (typeof $.fn.owlCarousel !== 'function') return;
    const $carousel = $('.section#comment .owl-carousel'); if (!$carousel.length) return;
    $carousel.owlCarousel({ items:1, loop:true, margin:20, autoplay:true, autoplayTimeout:10000, smartSpeed:600, dots:true });
  })();

  /* ====================================================
     Service Carousel (Owl)
  ==================================================== */
  (function(){
    const jq = window.jQuery || window.$; if (!jq) return; const $ = jq;
    if (typeof $.fn.owlCarousel !== 'function') return;
    const $owl = $('#service .owl-men-item'); if (!$owl.length) return;
    $owl.owlCarousel({
      items:1, loop:true, margin:20, autoplay:true, autoplayTimeout:5000, smartSpeed:600, dots:true, nav:false, autoHeight:true,
      responsive:{ 768:{items:2}, 1200:{items:3} }
    });
  })();

  /* ====================================================
     Gallery (Swiper)
  ==================================================== */
  (function(){
    if (typeof window.Swiper !== 'function') return;
    const el = $qs('.gallery-swiper'); if (!el) return;
    // eslint-disable-next-line no-new
    new Swiper(el, {
      slidesPerView:1, spaceBetween:20,
      pagination:{ el:".swiper-pagination", clickable:true },
      navigation:{ nextEl:".swiper-button-next", prevEl:".swiper-button-prev" },
      breakpoints:{ 768:{slidesPerView:2}, 992:{slidesPerView:3} }
    });
  })();

  /* ====================================================
     Video scroller
  ==================================================== */
  (function(){
    const wrap=$qs('#video .video-scroll'), prev=$qs('#video .video-btn.prev'), next=$qs('#video .video-btn.next');
    if (!wrap || !prev || !next) return;

    let isDown=false, startX=0, startLeft=0, moved=0;
    const stopDrag=(e)=>{ if(!isDown) return; isDown=false; wrap.classList.remove('dragging'); try{ e&&e.pointerId&&wrap.releasePointerCapture(e.pointerId);}catch{} snapToCard(); };
    wrap.addEventListener('pointerdown', e=>{ isDown=true; moved=0; startX=e.clientX; startLeft=wrap.scrollLeft; wrap.classList.add('dragging'); try{ wrap.setPointerCapture(e.pointerId);}catch{} e.preventDefault(); });
    wrap.addEventListener('pointermove', e=>{ if(!isDown) return; const dx=e.clientX-startX; moved+=Math.abs(dx); wrap.scrollLeft=startLeft - dx; updateButtons(); });
    ['pointerup','pointercancel','pointerleave'].forEach(ev=>wrap.addEventListener(ev, stopDrag));
    wrap.addEventListener('click', e=>{ if(moved>5) e.preventDefault(); moved=0; }, true);

    const getCardWidth=()=>{ const card=$qs('.video-card', wrap); return card ? card.getBoundingClientRect().width + getGapPx(wrap) : 300; };
    const scrollByCards=(n=1)=>{ wrap.scrollBy({ left:getCardWidth()*n, behavior:'smooth' }); setTimeout(updateButtons,50); };
    prev.addEventListener('click', ()=>scrollByCards(-1));
    next.addEventListener('click', ()=>scrollByCards(+1));

    let snapTimer;
    const snapToCard=()=>{ clearTimeout(snapTimer); snapTimer=setTimeout(()=>{ const step=getCardWidth(); const idx=Math.round(wrap.scrollLeft/step); wrap.scrollTo({ left: idx*step, behavior:'smooth' }); updateButtons(); },10); };
    const updateButtons=()=>{ const max=wrap.scrollWidth - wrap.clientWidth - 1; prev.disabled = wrap.scrollLeft<=1; next.disabled = wrap.scrollLeft>=max; };

    wrap.addEventListener('scroll', ()=>{ requestAnimationFrame(updateButtons); });
    window.addEventListener('resize', debounce(()=>{ updateButtons(); snapToCard(); },120));
    setTimeout(updateButtons,400); updateButtons();
  })();

  /* ====================================================
     FAQ accordion
  ==================================================== */
  (function(){
    const faqs=$qsa('.faq-item'); if(!faqs.length) return;
    faqs.forEach(item=>{
      const q=$qs('.faq-question', item), t=$qs('.faq-toggle', item); if(!q||!t) return;
      q.addEventListener('click', ()=>{
        faqs.forEach(f=>{ if(f!==item){ f.classList.remove('active'); const tt=$qs('.faq-toggle', f); if(tt) tt.textContent='+'; }});
        item.classList.toggle('active'); t.textContent = item.classList.contains('active') ? '×' : '+';
      });
    });
  })();

  /* ====================================================
     Fade-in observer
  ==================================================== */
  (function(){
    $qsa('.section').forEach(s=>s.setAttribute('data-animate',''));
    const opts={ root:null, rootMargin:'0px 0px -10% 0px', threshold:0.15 };
    const onInt=(entries,obs)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); obs.unobserve(e.target); } }); };
    if ('IntersectionObserver' in window){
      const io=new IntersectionObserver(onInt, opts);
      $qsa('.section[data-animate], .reveal').forEach(el=>io.observe(el));
    } else {
      $qsa('.section, .reveal').forEach(el=>el.classList.add('is-visible'));
    }
  })();

  /* ====================================================
     Theme / Nav (jQuery, guarded)
  ==================================================== */
  (function(){
    const jq = window.jQuery || window.$; if (!jq) return; const $ = jq;

    if (typeof $.fn.owlCarousel === 'function') {
      ['.owl-men-item','.owl-women-item','.owl-kid-item'].forEach(sel=>{
        const $el=$(sel); if($el.length){ $el.owlCarousel({ items:5, loop:true, dots:true, nav:true, margin:30, responsive:{0:{items:1},600:{items:2},1000:{items:3}} }); }
      });
    }

    const onScrollHeader = debounce(function(){
      const scroll=$(window).scrollTop()||0, box=$('#top').height()||0, header=$('header').height()||0;
      if (scroll >= (box - header)) $('header').addClass('background-header'); else $('header').removeClass('background-header');
    },50);
    $(window).on('scroll', onScrollHeader);
    $(window).on('load', onScrollHeader);

    function mobileNavBinding(){
      const width=$(window).width();
      $('.submenu').off('click.__submenu').on('click.__submenu', function(){
        if (width < 767) { $('.submenu ul').removeClass('active'); $(this).find('ul').toggleClass('active'); }
      });
    }
    if ($('.menu-trigger').length){
      $('.menu-trigger').on('click', function(){ $(this).toggleClass('active'); $('.header-area .nav').slideToggle(200); });
    }
    $(document).on('scroll', debounce(function onScrollActive(){
      const scrollPos=$(document).scrollTop()||0;
      $('.nav a[href*="#"]').each(function(){
        const curr=$(this), href=curr.attr('href'); if(!href) return;
        const hash = href.includes('#') ? href.slice(href.lastIndexOf('#')) : '';
        if (!hash || hash==='#') return;
        const $ref=$(hash); if(!$ref.length) return;
        const top=$ref.position().top, bottom=top + $ref.outerHeight();
        if (top <= scrollPos && bottom > scrollPos) { $('.nav ul li a').removeClass('active'); curr.addClass('active'); }
        else { curr.removeClass('active'); }
      });
    },30));
    $(window).on('resize', debounce(mobileNavBinding,120));
    mobileNavBinding();

    $(window).on('load', function(){
      if ($('.cover').length && typeof $('.cover').parallax === 'function') {
        $('.cover').parallax({ imageSrc: $('.cover').data('image'), zIndex:'1' });
      }
      const $pre=$("#preloader"); if ($pre.length){ $pre.animate({opacity:0},600,function(){ setTimeout(()=>{ $pre.css('visibility','hidden').fadeOut(); },300); }); }
    });
  })();

  /* ====================================================
     GLOBAL: Anchor smooth-scroll with CAPTURE + robust target
  ==================================================== */
  (function(){
    const resolveTarget = (href) => {
      try {
        // get hash from any href (absolute/relative)
        const u = new URL(href, window.location.href);
        if (!u.hash || u.hash === '#') return null;
        const id = decodeURIComponent(u.hash.slice(1));
        let el = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        if (!el && window.CSS && typeof CSS.escape === 'function') {
          try { el = document.querySelector('#' + CSS.escape(id)); } catch {}
        }
        return el;
      } catch {
        // fallback: if it's literally "#foo"
        if (href && href.startsWith('#')) {
          const id = decodeURIComponent(href.slice(1));
          return document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        }
        return null;
      }
    };

    // capture phase to beat other preventDefault()s
    document.addEventListener('click', function onDocClick(e){
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;

      const target = resolveTarget(a.getAttribute('href'));
      if (!target) return; // allow browser default if not resolvable

      e.preventDefault();
      // close mobile menu if open
      const menuTrigger = document.querySelector('.menu-trigger.active');
      const nav = document.querySelector('.header-area .nav');
      if (menuTrigger && nav) { menuTrigger.classList.remove('active'); nav.style.display='none'; }

      smoothScrollTo(target);
    }, { capture: true, passive: false });

    // initial hash (after load)
    window.addEventListener('load', ()=> {
      if (location.hash) {
        const t = resolveTarget(location.href);
        if (t) setTimeout(()=>smoothScrollTo(t), 0);
      }
    });

    // reacting to hashchange (e.g., scripts update hash)
    window.addEventListener('hashchange', ()=> {
      const t = resolveTarget(location.href);
      if (t) smoothScrollTo(t);
    });
  })();

})();
