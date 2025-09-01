(() => {
  const byId = (id) => document.getElementById(id);
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

  function initRibbon() {
    const viewport = byId('ribbon-viewport');
    const track = byId('ribbon-track');
    const prev = byId('ribbon-prev');
    const next = byId('ribbon-next');
    if (!viewport || !track || !prev || !next) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slides = Array.from(track.children);
    let index = 0;
    let timer = null;

    const len = slides.length;
    const wrap = (i) => (i % len + len) % len;

    const scrollToSlide = (i) => {
      const target = slides[i];
      if (!target) return;
      const x = target.offsetLeft; // robust against paddings/margins
      viewport.scrollTo({ left: x, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    const goTo = (i) => {
      index = wrap(i);
      scrollToSlide(index);
    };

    const updateFromScroll = () => {
      const w = Math.max(1, viewport.clientWidth);
      const approx = viewport.scrollLeft / w;
      index = wrap(Math.round(approx));
    };

    const restartTimer = () => {
      if (reduceMotion) return; // respect user preference
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 5000);
    };

    on(prev, 'click', () => { goTo(index - 1); restartTimer(); });
    on(next, 'click', () => { goTo(index + 1); restartTimer(); });
    on(viewport, 'scroll', () => { window.requestAnimationFrame(updateFromScroll); });
    on(window, 'resize', () => { goTo(index); });

    // Pause on hover/focus within the ribbon region
    const region = viewport.closest('.ribbon');
    if (region) {
      region.setAttribute('tabindex', '0');
      on(region, 'keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); restartTimer(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); restartTimer(); }
      });
      on(region, 'mouseenter', () => { clearInterval(timer); });
      on(region, 'mouseleave', restartTimer);
      on(region, 'focusin', () => { clearInterval(timer); });
      on(region, 'focusout', restartTimer);
    }

    // Kick things off
    goTo(0);
    restartTimer();
  }

  window.addEventListener('DOMContentLoaded', initRibbon);
})();
