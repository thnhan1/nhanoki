(function () {
  const stored = localStorage.getItem('theme');
  let current = stored || 'light';

  function apply(theme) {
    current = theme;
    if (!document.body) return;
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme !== 'dark');
  }

  apply(current);

  document.addEventListener('DOMContentLoaded', function () {
    apply(current);
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      const next = current === 'dark' ? 'light' : 'dark';
      apply(next);
      localStorage.setItem('theme', next);
    });

    var subscribeBtn = document.getElementById('newsletter-subscribe');
    var dialog = document.getElementById('newsletter-dialog');
    var closeBtn = document.getElementById('newsletter-dialog-close');
    if (subscribeBtn && dialog && closeBtn) {
      subscribeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        dialog.hidden = false;
      });
      closeBtn.addEventListener('click', function () {
        dialog.hidden = true;
      });
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.hidden = true;
      });
    }

    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const raw = btn.getAttribute('data-clipboard-text');
        if (!raw) return;
        navigator.clipboard.writeText(raw).then(function () {
          btn.classList.add('copied');
          setTimeout(function () { btn.classList.remove('copied'); }, 1500);
        });
      });
    });
  });
})();
