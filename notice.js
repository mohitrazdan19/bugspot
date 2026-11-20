// Small privacy notice shown once at the bottom of every page.
// It explains what the site stores. The legal consent choice for visitors in the EEA, UK and
// Switzerland comes from Google's own consent message (AdSense, Privacy & messaging), which loads
// with the AdSense script once ads are switched on.
(function () {
  var KEY = 'qt.notice';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
  function show() {
    var d = document.createElement('div');
    d.className = 'qt-notice';
    d.setAttribute('role', 'region');
    d.setAttribute('aria-label', 'Privacy notice');
    d.innerHTML = '<p>We save your game progress and a random visitor ID in your browser and count plays anonymously. We may use Google Analytics, and ' +
      'if ads are shown, Google may use cookies to show them. <a href="/privacy.html">Privacy Policy</a></p>' +
      '<button type="button">OK</button>';
    var css = document.createElement('style');
    css.textContent = '.qt-notice{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:25;max-width:640px;margin:0 auto;display:flex;align-items:center;gap:12px;' +
      'padding:12px 14px;border-radius:16px;background:#2d2350;color:#fff;font:500 13px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;box-shadow:0 10px 30px rgba(45,35,80,.3)}' +
      '.qt-notice p{margin:0;flex:1}.qt-notice a{color:#dccfff}' +
      '.qt-notice button{flex:none;font:700 14px/1 inherit;font-family:inherit;padding:10px 18px;border:0;border-radius:999px;background:#fff;color:#2d2350;cursor:pointer;min-height:40px}';
    d.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
      d.remove();
    });
    document.head.appendChild(css);
    document.body.appendChild(d);
    // Leave room at the bottom so the notice never hides the footer links.
    var pad = document.body.style.paddingBottom;
    document.body.style.paddingBottom = (d.offsetHeight + 24) + 'px';
    d.querySelector('button').addEventListener('click', function () { document.body.style.paddingBottom = pad; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
