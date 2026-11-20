// Google Tag Manager (with Google Analytics 4 set up inside GTM) and Google consent mode.
// OFF until a container ID is filled in below. To switch on: put the ID from tagmanager.google.com,
// for example 'GTM-AB12CD3', between the quotes and publish the site.
var QT_GTM_ID = '';

// The game pushes its events (puzzle_start, puzzle_found, puzzle_fail, share, track_pick) to this list.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
// The game removes ?src= and ?utm_ tags from the address bar soon after loading, so keep the full
// landing address here. The GTM setup sends it to Google Analytics as page_location, so campaigns still count.
window.dataLayer.push({ original_location: location.href });

// Consent mode v2. Visitors in the EEA, UK and Switzerland start with everything denied until they
// answer Google's consent message (AdSense > Privacy & messaging), which updates these settings itself.
// Everyone else starts with consent granted, as allowed outside those regions.
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
  region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
  wait_for_update: 500,
});
gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
gtag('set', 'ads_data_redaction', true);

(function () {
  if (!QT_GTM_ID) return;
  // Only the real site loads GTM: local copies, previews and bots send nothing (same rule as the game's own stats).
  var hosts = ['quizzifytech.com', 'www.quizzifytech.com'];
  if (hosts.indexOf(location.hostname) < 0) return;
  try { if (navigator.webdriver || /bot|crawl|spider|headless|lighthouse|pagespeed|preview/i.test(navigator.userAgent || '')) return; } catch (e) { /* ignore */ }
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(QT_GTM_ID);
  document.head.appendChild(s);
})();
