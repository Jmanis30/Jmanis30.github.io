(() => {
  const byId = (id) => document.getElementById(id);
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

  function initRibbon() {
    const viewport = byId('ribbon-viewport');
    const track = byId('ribbon-track');
    const prev = byId('ribbon-prev');
    const next = byId('ribbon-next');
    if (!viewport || !track || !prev || !next) return;

    const slides = Array.from(track.children);
    let index = 0;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const goTo = (i) => {
      index = clamp(i, 0, slides.length - 1);
      const x = index * viewport.clientWidth;
      viewport.scrollTo({ left: x, behavior: 'smooth' });
      updateButtons();
    };

    const updateFromScroll = () => {
      const approx = viewport.scrollLeft / Math.max(1, viewport.clientWidth);
      index = clamp(Math.round(approx), 0, slides.length - 1);
      updateButtons();
    };

    const updateButtons = () => {
      prev.disabled = index <= 0;
      next.disabled = index >= slides.length - 1;
    };

    on(prev, 'click', () => goTo(index - 1));
    on(next, 'click', () => goTo(index + 1));
    on(viewport, 'scroll', () => { window.requestAnimationFrame(updateFromScroll); });
    on(window, 'resize', () => { goTo(index); });

    // Keyboard support when focusing the region
    const region = viewport.closest('.ribbon');
    if (region) {
      region.setAttribute('tabindex', '0');
      on(region, 'keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
      });
    }

    updateButtons();
  }

  window.addEventListener('DOMContentLoaded', initRibbon);
})();

