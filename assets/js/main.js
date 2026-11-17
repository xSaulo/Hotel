/* =========================================================
   Hotel Tama Lodge — JavaScript del sitio
   - Idioma ES/EN (detección automática + selector)
   - Reserva por WhatsApp con mensaje formateado
   - Mapa de Google por lugar seleccionado
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN: cambia aquí los datos de contacto ---------- */
  var CONFIG = {
    whatsapp: '50689926888',              // número con código de país, solo dígitos
    phoneDisplay: '+506 8992 6888',
    email: 'ota@hoteltamalodge.com',
    hotelMaps: 'https://maps.app.goo.gl/Q6FEESgZPR6FmrrJ9',
    bookingEngine: 'https://tamalodge.kross.travel'   // motor de reservas (Kross Booking)
  };

  /* ---------- Lugares del mapa ---------- */
  var PLACES = [
    { id: 'hotel', name: { es: 'Hotel Tama Lodge', en: 'Hotel Tama Lodge' }, dist: { es: 'Tu base', en: 'Your base' },
      query: 'Hotel Tama Lodge, Tamarindo, Guanacaste, Costa Rica', zoom: 16, url: CONFIG.hotelMaps },
    { id: 'pt', name: { es: 'Playa Tamarindo', en: 'Playa Tamarindo' }, dist: { es: '5 min en auto', en: '5 min by car' },
      query: 'Playa Tamarindo, Guanacaste, Costa Rica', zoom: 14, url: 'https://maps.app.goo.gl/UFrMjB3kJPFNm9Qg8' },
    { id: 'mn', name: { es: 'Mercado nocturno', en: 'Night market' }, dist: { es: '1 km', en: '1 km' },
      query: 'Mercado nocturno Tamarindo, Guanacaste', zoom: 15, url: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Mercado nocturno Tamarindo') },
    { id: 'pg', name: { es: 'Playa Grande', en: 'Playa Grande' }, dist: { es: '20 km · 43 min', en: '20 km · 43 min' },
      query: 'Playa Grande, Guanacaste, Costa Rica', zoom: 13, url: 'https://maps.app.goo.gl/vXR78ZyGZFPEPc7w6' },
    { id: 'lir', name: { es: 'Aeropuerto de Liberia (LIR)', en: 'Liberia Airport (LIR)' }, dist: { es: '68 km · 1 h 45 min', en: '68 km · 1 hr 45 min' },
      query: 'Aeropuerto Internacional Daniel Oduber Quirós, Liberia, Costa Rica', zoom: 13, url: 'https://maps.app.goo.gl/n1ceke4MUmnTsA9x8' }
  ];

  /* ---------- Traducciones al inglés (el español está en el HTML) ---------- */
  var EN = {
    skip: 'Skip to content', navLabel: 'Main', navRooms: 'Rooms', navReviews: 'Reviews', navArea: 'The area',
    navGallery: 'Gallery', navContact: 'Contact', bookNow: 'Book now', openMenu: 'Open menu', closeMenu: 'Close menu',
    bookWa: 'Book on WhatsApp', home: 'Home',
    heroTitle1: 'Live Tamarindo', heroTitle2: 'at your own pace.',
    heroSub: 'Wake up by the pool, reach the beach in minutes and live the real pura vida. Book direct and get our best rate.',
    checkAvail: 'Check availability', checkIn: 'Check-in', checkOut: 'Check-out', adults: 'Adults', children: 'Children',
    whyUs: 'Why book with us', tr1: '4.8 on Google · 78 reviews', tr2: '5 min from the beach', tr3: 'Pool',
    tr4: 'Free Wi‑Fi & parking', tr5: 'No booking fees',
    chipsLabel: 'What awaits you', chipPool: 'Outdoor pool', chipNomads: 'Digital nomads', chipDive: 'Diving & snorkeling',
    chipFish: 'Fishing tours', chipSwim: 'Swimming lessons',
    welcomeKicker: 'Welcome to Tama Lodge', welcomeTitle: 'Your tropical hideaway, minutes from the best of Tamarindo.',
    altFacade: 'Yellow façade of Tama Lodge with its sign and garden',
    s1Kicker: '01 · The lodge', s1Title: 'Wood, color and a Pacific breeze.',
    s1Text: 'Air-conditioned rooms with private bathrooms and pool views, surrounded by a garden full of tropical plants. Free Wi‑Fi, parking and laundry service, so all you have to think about is enjoying yourself.',
    seeRooms: 'See rooms', s2Kicker: '02 · Community', s2Title: 'Arrive as a guest, leave as a friend.',
    s2Text: 'Ping pong tournaments, swimming lessons and travelers from all over the world. Ideal for digital nomads and long stays: work by day, catch the sunset on the beach by night.',
    longStay: 'Get your long-stay rate', altTerrace: 'Wooden terrace with table and hammock', altPool: 'Hotel pool with sun loungers',
    bandLabel: 'Benefits of booking direct', bandKicker: 'Book direct', bandTitle: 'Book direct, get more.',
    perk1: 'Our best rate, no third-party fees', perk2: 'Personal, direct replies on WhatsApp',
    perk3: 'We set up your tours, fishing trips and transfers', waUs: 'Message us on WhatsApp', sendEmail: 'Send an email',
    roomsTitle: 'Your room in Tamarindo is waiting.',
    roomsText: "Perfect for couples, families, groups of friends and digital nomads. Send us your dates and we'll share the available rooms at our best rate, with no commissions.",
    amenities: 'Amenities', amAC: 'Air conditioning', amBath: 'Private bathroom', amWifi: 'Free Wi‑Fi', amPool: 'Pool view',
    amKitchen: 'Kitchen', amParking: 'Free parking', seeAvailRooms: 'See available rooms', chooseDates: 'Choose dates',
    altRoom: 'Tama Lodge room with a double bed',
    reviewsTitle: 'Real guests, real stories.', reviewsCount: '78 reviews on Google',
    v1Title: 'Our guest since June', v1Text: '“We love having her with us.”', v2Title: '15 days at Tama Lodge',
    v2Text: 'Her stay, in her own words.', v3Title: 'A tour of the lodge', v3Text: 'Pool, garden and favorite spots.',
    statsLabel: 'Tama Lodge in numbers', stat1: 'Google rating · 78 reviews', stat2: 'By car to Playa Tamarindo',
    stat3: 'From the night market', stat4: 'Travelers already follow us on Instagram',
    zoneText: 'White sand, surfable waves and postcard sunsets. Restaurants, shops and nightlife just around the corner.',
    placesLabel: 'Nearby places', exploreArea: 'Explore the area', mapTitle: 'Map', openMaps: 'Open in Google Maps',
    followIg: 'Follow us on Instagram', g1: 'Pool seen from the balcony', g2: 'Hotel garden', g3: 'Deep-sea fishing',
    g4: 'Dolphin in the Pacific', g5: 'Egret on the dock', g6: 'Wooden hotel walkway',
    footerTitle: 'Your Tamarindo getaway starts here.',
    footerAbout: 'Hotel in Tamarindo, Guanacaste, Costa Rica. Pura vida from day one.',
    explore: 'Explore', followUs: 'Follow us', call: 'Call',
    // La zona
    zHeroSub: 'Just 5 minutes from Hotel Tama Lodge, in Guanacaste, Costa Rica.', zBeach: 'The beach',
    zTitle: 'White sand, waves and mountains.',
    zP1: 'Playa Tamarindo offers white sand, big surfing waves and incredible views surrounded by mountains. Here you can sit and relax under the trees, take a walk or enjoy one of the most beautiful sunsets on the Pacific.',
    zP2: "It's the perfect place for surf lessons, fishing trips, snorkeling or simply ending the day with your feet in the sand. Restaurants, shops and the night market are just minutes away.",
    distLabel: 'Distances from the hotel', fromLodge: 'From Tama Lodge', askDirections: 'Ask for directions',
    todo: 'Things to do nearby', c1: 'A wide, quiet beach, perfect for a day in the hammock.',
    c2: 'A boat trip around the Gulf of Nicoya, with birds, dolphins and fishing villages.', c3Title: 'Fishing day',
    c3: 'Fishing trips in Tamarindo with local captains.', c4: 'Learn to dive and discover Pacific marine life.',
    cAlt1: 'Beachfront hammock at Playa Grande', cAlt2: 'Boat on the shore of Isla Venado',
    cAlt3: 'Fisherman on a boat at sea', cAlt4: 'Divers among corals',
    zFooter: 'Stay just 5 minutes from Playa Tamarindo.',
    seeRates: 'See availability & rates', preferWa: 'Prefer WhatsApp? Message us', bookOnline: 'Book online',
    perk2b: 'Secure online booking or via WhatsApp', tr5b: 'Secure online booking',
    roomsText2: 'Pick your room, see live prices and book online in under 2 minutes. No third-party fees.',
    tagPopular: 'Most booked', tagKitchen: 'With kitchen', roomDoble: 'Double Room',
    roomDobleText: 'Comfortable and cool, ideal for couples or travelers looking to unwind after a day at the beach.',
    roomEstudio: 'Equipped Studio',
    roomEstudioText: 'Your own space with a fully equipped kitchen: perfect for long stays, families and digital nomads.',
    liveRates: 'Live pricing', bookThisRoom: 'Check availability', amLaundry: 'Laundry', amGarden: 'Tropical garden',
    altDoble: 'Tama Lodge Double Room with bed, private bathroom and air conditioning',
    guestsMax: 'Guests', g1: '1 adult', g2: '2 adults',
    altEstudio: 'Tama Lodge Equipped Studio with kitchen, fridge and microwave'
  };

  /* ---------- Textos generados por JS ---------- */
  var TXT = {
    es: {
      tbd: 'por definir', night: 'noche', nights: 'noches', adult: 'adulto', adultsW: 'adultos', child: 'niño', childrenW: 'niños',
      hintIdle: 'Precios y disponibilidad en tiempo real · Reserva segura · Sin comisiones',
      hintReady: ' · precios en tiempo real',
      pickDates: 'Elige tu fecha de llegada para ver precios.',
      fromHotel: 'Desde Hotel Tama Lodge · ', hotelSub: '75V8+M64 · Tamarindo, Guanacaste',
      title: { index: 'Hotel Tama Lodge · Hotel en Tamarindo, Guanacaste, Costa Rica', zona: 'Playa Tamarindo · La zona · Hotel Tama Lodge' },
      mailSubject: 'Consulta de reserva - Hotel Tama Lodge',
      mailBody: 'Hola, Tama Lodge:\n\nMe gustaría consultar disponibilidad para las siguientes fechas:\n\nLlegada:\nSalida:\nHuéspedes:\n\n¡Gracias!'
    },
    en: {
      tbd: 'to be confirmed', night: 'night', nights: 'nights', adult: 'adult', adultsW: 'adults', child: 'child', childrenW: 'children',
      hintIdle: 'Live prices and availability · Secure booking · No fees',
      hintReady: ' · live pricing',
      pickDates: 'Pick your check-in date to see prices.',
      fromHotel: 'From Hotel Tama Lodge · ', hotelSub: '75V8+M64 · Tamarindo, Guanacaste',
      title: { index: 'Hotel Tama Lodge · Hotel in Tamarindo, Guanacaste, Costa Rica', zona: 'Playa Tamarindo · The area · Hotel Tama Lodge' },
      mailSubject: 'Booking inquiry - Hotel Tama Lodge',
      mailBody: 'Hi Tama Lodge,\n\nI would like to check availability for the following dates:\n\nCheck-in:\nCheck-out:\nGuests:\n\nThank you!'
    }
  };

  var WAVE = '👋', CAL = '📅', MOON = '🌙', PEOPLE = '👥';
  var WA_MSG = {
    general: { es: 'Hola, Tama Lodge ' + WAVE + '\n\nQuisiera más información, por favor.', en: 'Hi Tama Lodge ' + WAVE + '\n\nI would like more information, please.' },
    rooms: { es: 'Hola, Tama Lodge ' + WAVE + '\n\nMe gustaría recibir información sobre las habitaciones disponibles y sus tarifas.\n\n¡Gracias!', en: 'Hi Tama Lodge ' + WAVE + '\n\nCould you send me information about your available rooms and rates?\n\nThank you!' },
    longstay: { es: 'Hola, Tama Lodge ' + WAVE + '\n\nMe interesa una estancia larga. ¿Qué tarifas semanales o mensuales tienen?\n\n¡Gracias!', en: 'Hi Tama Lodge ' + WAVE + '\n\nI am interested in a long stay. What are your weekly or monthly rates?\n\nThank you!' },
    directions: { es: 'Hola, Tama Lodge ' + WAVE + '\n\n¿Me podrían indicar cómo llegar al hotel?', en: 'Hi Tama Lodge ' + WAVE + '\n\nCould you tell me how to get to the hotel?' }
  };

  var page = /la-zona/.test(location.pathname) ? 'zona' : 'index';
  var lang = detectLang();
  var selectedPlace = 'hotel';

  /* ---------- Idioma ---------- */
  function detectLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'es' || q === 'en') return q;
      var saved = localStorage.getItem('tl-lang');
      if (saved === 'es' || saved === 'en') return saved;
    } catch (e) {}
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'es'];
    return String(list[0]).toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.title = TXT[l].title[page];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!el.hasAttribute('data-es')) el.setAttribute('data-es', el.textContent);
      el.textContent = l === 'en' && EN[k] ? EN[k] : el.getAttribute('data-es');
    });
    [['data-i18n-alt', 'alt'], ['data-i18n-aria', 'aria-label'], ['data-i18n-title', 'title']].forEach(function (pair) {
      document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
        var k = el.getAttribute(pair[0]);
        var store = 'data-es-' + pair[1];
        if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(pair[1]) || '');
        el.setAttribute(pair[1], l === 'en' && EN[k] ? EN[k] : el.getAttribute(store));
      });
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false');
    });

    updateContactLinks();
    renderPlaces();
    updateBooking();
  }

  /* ---------- Enlaces de WhatsApp, teléfono y correo ---------- */
  function waUrl(text) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function localIso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function bookingUrl() {
    var f = document.getElementById('check-in'), t = document.getElementById('check-out');
    var a = document.getElementById('adults'), k = document.getElementById('kids');
    var from = f && f.value ? f.value : localIso(addDays(new Date(), 1));
    var to = t && t.value && t.value > from ? t.value : localIso(addDays(new Date(from + 'T12:00:00'), f && f.value ? 1 : 2));
    var ad = a ? Math.min(Number(a.value), 2) : 2, ch = k ? Number(k.value) : 0;
    return CONFIG.bookingEngine + '/book/step1?adults=' + ad + '&children=' + ch + '&rooms=1&guests=' + (ad + ch) +
      '&n_guests=' + (ad + ch) + '&guests_rooms=' + ad + ',' + ch + ';&kross_lang=' + lang + '&from=' + from + '&to=' + to;
  }
  function updateBookLinks() {
    var u = bookingUrl();
    document.querySelectorAll('[data-book]').forEach(function (a) { a.href = u; });
  }
  function updateContactLinks() {
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      var type = a.getAttribute('data-wa');
      if (type === 'booking') { a.href = waUrl(form ? bookingMessage() : WA_MSG.general[lang]); return; }
      var m = WA_MSG[type] || WA_MSG.general;
      a.href = waUrl(m[lang]);
    });
    updateBookLinks();
    document.querySelectorAll('[data-phone-text]').forEach(function (a) { a.textContent = CONFIG.phoneDisplay; });
    document.querySelectorAll('[data-tel]').forEach(function (a) { a.href = 'tel:+' + CONFIG.whatsapp; });
    document.querySelectorAll('[data-mail]').forEach(function (a) {
      a.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(TXT[lang].mailSubject) + '&body=' + encodeURIComponent(TXT[lang].mailBody);
    });
  }

  /* ---------- Reserva ---------- */
  var form = document.getElementById('booking-form');
  var inEl = document.getElementById('check-in');
  var outEl = document.getElementById('check-out');
  var adultsEl = document.getElementById('adults');
  var kidsEl = document.getElementById('kids');
  var hintEl = document.getElementById('booking-hint');

  function iso(d) { return d.toISOString().slice(0, 10); }
  function fmtDate(v) {
    if (!v) return TXT[lang].tbd;
    var d = new Date(v + 'T12:00:00');
    return d.toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function nightsBetween() {
    if (!inEl.value || !outEl.value) return 0;
    return Math.round((new Date(outEl.value + 'T12:00:00') - new Date(inEl.value + 'T12:00:00')) / 86400000);
  }
  function guestsText() {
    var t = TXT[lang], a = Number(adultsEl.value), k = kidsEl ? Number(kidsEl.value) : 0;
    return a + ' ' + (a === 1 ? t.adult : t.adultsW) + (k ? ', ' + k + ' ' + (k === 1 ? t.child : t.childrenW) : '');
  }
  function bookingMessage() {
    var n = nightsBetween(), es = lang === 'es';
    var lines = es
      ? ['Hola, Tama Lodge ' + WAVE, '', 'Me gustaría consultar disponibilidad:', '',
         CAL + ' *Llegada:* ' + fmtDate(inEl.value), CAL + ' *Salida:* ' + fmtDate(outEl.value)]
      : ['Hi Tama Lodge ' + WAVE, '', 'I would like to check availability:', '',
         CAL + ' *Check-in:* ' + fmtDate(inEl.value), CAL + ' *Check-out:* ' + fmtDate(outEl.value)];
    if (n > 0) lines.push(MOON + (es ? ' *Noches:* ' : ' *Nights:* ') + n);
    lines.push(PEOPLE + (es ? ' *Huéspedes:* ' : ' *Guests:* ') + guestsText());
    lines.push('');
    lines.push(es ? '¿Tienen habitaciones disponibles? ¿Cuál sería la tarifa?' : 'Do you have rooms available, and what would the rate be?');
    lines.push('');
    lines.push(es ? '¡Muchas gracias!' : 'Thank you!');
    return lines.join('\n');
  }
  function updateBooking() {
    if (!form) return;
    var today = localIso(new Date());
    inEl.min = today;
    outEl.min = inEl.value || today;
    if (outEl.value && inEl.value && outEl.value <= inEl.value) outEl.value = '';
    var n = nightsBetween(), t = TXT[lang];
    hintEl.textContent = n > 0
      ? n + ' ' + (n === 1 ? t.night : t.nights) + ' · ' + guestsText() + t.hintReady
      : t.hintIdle;
    inEl.closest('.field').classList.remove('is-error');
    updateContactLinks();
  }
  if (form) {
    [inEl, outEl, adultsEl, kidsEl].forEach(function (el) { if (el) el.addEventListener('change', updateBooking); });
    inEl.addEventListener('change', function () {
      if (inEl.value && !outEl.value && outEl.showPicker) { try { outEl.showPicker(); } catch (e) {} }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!inEl.value) {
        inEl.closest('.field').classList.add('is-error');
        hintEl.textContent = TXT[lang].pickDates;
        inEl.focus();
        if (inEl.showPicker) { try { inEl.showPicker(); } catch (err) {} }
        return;
      }
      location.href = bookingUrl();
    });
  }

  /* ---------- Lugares + mapa ---------- */
  function embedUrl(p) {
    return 'https://maps.google.com/maps?q=' + encodeURIComponent(p.query) + '&z=' + p.zoom + '&hl=' + lang + '&output=embed';
  }
  function renderPlaces() {
    var cur = PLACES.filter(function (p) { return p.id === selectedPlace; })[0] || PLACES[0];
    document.querySelectorAll('[data-places]').forEach(function (ul) {
      ul.innerHTML = '';
      PLACES.forEach(function (p) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'place';
        b.setAttribute('aria-pressed', p.id === cur.id ? 'true' : 'false');
        var s = document.createElement('span'); s.textContent = p.name[lang];
        var d = document.createElement('strong'); d.textContent = p.dist[lang];
        b.appendChild(s); b.appendChild(d);
        b.addEventListener('click', function () {
          selectedPlace = p.id;
          renderPlaces();
          var map = document.querySelector('[data-map]');
          if (map && window.matchMedia('(max-width: 760px)').matches) map.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        li.appendChild(b);
        ul.appendChild(li);
      });
    });
    document.querySelectorAll('[data-map]').forEach(function (map) {
      var iframe = map.querySelector('iframe');
      var src = embedUrl(cur);
      if (iframe.getAttribute('src') !== src) iframe.setAttribute('src', src);
      map.querySelector('[data-map-name]').textContent = cur.name[lang];
      map.querySelector('[data-map-sub]').textContent = cur.id === 'hotel' ? TXT[lang].hotelSub : TXT[lang].fromHotel + cur.dist[lang];
      map.querySelector('[data-map-link]').href = cur.url;
    });
  }

  /* ---------- Selector de idioma ---------- */
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      try { localStorage.setItem('tl-lang', l); } catch (e) {}
      applyLang(l);
    });
  });

  /* ---------- Header sólido al hacer scroll ---------- */
  var header = document.getElementById('header');
  var mobileBar = document.querySelector('.mobile-bar');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
    if (mobileBar) mobileBar.classList.toggle('is-visible', window.scrollY > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var menu = document.getElementById('mobile-menu');
  var openBtn = document.getElementById('menu-open');
  var closeBtn = document.getElementById('menu-close');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus(); else openBtn.focus();
  }
  if (menu) {
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- Solo un video a la vez ---------- */
  var videos = document.querySelectorAll('video');
  videos.forEach(function (v) {
    v.addEventListener('play', function () { videos.forEach(function (o) { if (o !== v) o.pause(); }); });
  });

  /* ---------- Animación de aparición ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Año del footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  applyLang(lang);
})();
