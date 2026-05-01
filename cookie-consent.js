/* cookie-consent.js — Vers Le Vin
   Handles cookie consent banner, stores choice in localStorage,
   and conditionally loads YouTube embeds and other third-party scripts.
   -------------------------------------------------------------------- */

(function () {
  const CONSENT_KEY = 'cookieConsent';
  const CONSENT_ACCEPTED = 'accepted';
  const CONSENT_REFUSED = 'refused';

  /* ============================================================
     CHECK EXISTING CONSENT
     ============================================================ */
  const existing = localStorage.getItem(CONSENT_KEY);

  if (existing === CONSENT_ACCEPTED) {
    enableThirdParty();
    return;
  }

  if (existing === CONSENT_REFUSED) {
    showRefusedPlaceholders();
    return;
  }

  /* ============================================================
     SHOW BANNER (first visit — no choice yet)
     ============================================================ */
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie toestemming');
  banner.innerHTML = `
    <div class="cookie-inner">
      <p class="cookie-text">
        Deze website gebruikt cookies voor een betere werking en externe diensten.
        Meer info in ons <a href="privacy.html" class="cookie-privacy">privacybeleid</a>.
      </p>
      <div class="cookie-actions">
        <button type="button" id="cookieRefuse">Weigeren</button>
        <button type="button" id="cookieAccept">Accepteren</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  /* Animate in after short delay so it doesn't fight the age gate */
  setTimeout(() => banner.classList.add('cookie-visible'), 800);

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, CONSENT_ACCEPTED);
    banner.classList.remove('cookie-visible');
    setTimeout(() => banner.remove(), 400);
    enableThirdParty();
  });

  document.getElementById('cookieRefuse').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, CONSENT_REFUSED);
    banner.classList.remove('cookie-visible');
    setTimeout(() => banner.remove(), 400);
    showRefusedPlaceholders();
  });

  /* ============================================================
     ENABLE THIRD-PARTY SCRIPTS (on accept)
     ============================================================ */
  function enableThirdParty() {
    loadYouTubeEmbeds();

    /* Future: add Stripe/Mollie/Snipcart script loading here.
       Example:
       const script = document.createElement('script');
       script.src = 'https://js.stripe.com/v3/';
       document.head.appendChild(script);
    */
  }

  /* ============================================================
     LOAD YOUTUBE EMBEDS
     Looks for <div data-youtube-id="..."> placeholders and
     replaces them with actual iframes only after consent.
     ============================================================ */
  function loadYouTubeEmbeds() {
    document.querySelectorAll('[data-youtube-id]').forEach(el => {
      const id = el.getAttribute('data-youtube-id');
      if (!id) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.display = 'block';
      iframe.style.borderRadius = '6px';
      el.innerHTML = '';
      el.appendChild(iframe);
      el.classList.add('youtube-loaded');
    });
  }

  /* ============================================================
     SHOW REFUSED PLACEHOLDERS
     ============================================================ */
  function showRefusedPlaceholders() {
    document.querySelectorAll('[data-youtube-id]').forEach(el => {
      el.innerHTML = `
        <div class="cookie-blocked">
          <p>Video niet geladen</p>
          <p class="cookie-blocked-sub">U heeft externe cookies geweigerd.
             <button type="button" onclick="cookieConsentReset()">Instellingen wijzigen</button>
          </p>
        </div>
      `;
    });
  }

  /* ============================================================
     GLOBAL RESET
     ============================================================ */
  window.cookieConsentReset = function () {
    localStorage.removeItem(CONSENT_KEY);
    location.reload();
  };

})();