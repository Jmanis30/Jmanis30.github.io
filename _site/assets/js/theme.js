(() => {
  const storageKey = 'theme-preference';
  const getStored = () => localStorage.getItem(storageKey);
  const setStored = (v) => localStorage.setItem(storageKey, v);

  const getPreferred = () => {
    const stored = getStored();
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  };

  // Initialize
  applyTheme(getPreferred());

  // Listen for system changes only if user hasn't set a preference
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change', () => {
    if (!getStored()) applyTheme(getPreferred());
  });

  // Hook up toggle
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || getPreferred();
      const next = current === 'dark' ? 'light' : 'dark';
      setStored(next);
      applyTheme(next);
    });
  });
})();

