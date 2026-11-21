import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CONFIG, NAV, ROUTES, UI, WA_MSG, mailUrl, t, waUrl, type Lang, type RouteKey } from '../data/site';
import { BookingProvider, todayIso, useBooking } from '../booking';
import { Calendar, Close, Instagram, Mail, Menu, Pin, Star, Sun, User, WhatsApp } from './Icons';

const other = (l: Lang): Lang => (l === 'es' ? 'en' : 'es');

function Logo({ variant, id }: { variant: 'light' | 'dark'; id: string }) {
  return (
    <span className={`logo logo--${variant}`}>
      <Sun size={30} id={id} />
      <span className="logo__words">
        <span className="logo__small">Hotel</span>
        <span className="logo__big">Tama</span>
        <span className="logo__small">Lodge</span>
      </span>
    </span>
  );
}

function LangSwitch({ lang, route }: { lang: Lang; route: RouteKey }) {
  const go = (l: Lang) => { try { localStorage.setItem('tl-lang', l); } catch { /* sin almacenamiento */ } };
  return (
    <span className="lang" role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as Lang[]).map((l) => (
        <a key={l} href={ROUTES[route][l]} hrefLang={l} lang={l} aria-current={l === lang ? 'true' : undefined} onClick={() => go(l)}>{l.toUpperCase()}</a>
      ))}
    </span>
  );
}

/** Campos de reserva (se usan en la barra inferior, en el header y en el panel móvil) */
export function BookingFields({ lang, compact = false, onDone }: { lang: Lang; compact?: boolean; onDone?: () => void }) {
  const b = useBooking();
  const [err, setErr] = useState(false);
  const [today, setToday] = useState('');
  useEffect(() => setToday(todayIso()), []);
  const inRef = useRef<HTMLInputElement>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b.checkIn) { setErr(true); inRef.current?.focus(); try { inRef.current?.showPicker?.(); } catch { /* */ } return; }
    onDone?.();
    window.location.href = b.url;
  };
  return (
    <form className={`bk ${compact ? 'bk--compact' : ''}`} onSubmit={submit} noValidate>
      <label className={`bk__f ${err ? 'is-err' : ''}`}><span>{t(UI.checkIn, lang)}</span>
        <input ref={inRef} type="date" value={b.checkIn} min={today || undefined} onChange={(e) => { setErr(false); b.setCheckIn(e.target.value); }} aria-label={t(UI.checkIn, lang)} />
      </label>
      <label className="bk__f"><span>{t(UI.checkOut, lang)}</span>
        <input type="date" value={b.checkOut} min={b.checkIn || today || undefined} onChange={(e) => b.setCheckOut(e.target.value)} aria-label={t(UI.checkOut, lang)} />
      </label>
      <label className="bk__f bk__f--sm"><span>{t(UI.guests, lang)}</span>
        <select value={b.adults} onChange={(e) => b.setAdults(e.target.value)}>
          <option value="1">{t(UI.adult1, lang)}</option><option value="2">{t(UI.adult2, lang)}</option>
        </select>
      </label>
      <button className="bk__btn" type="submit">{t(UI.book, lang)}</button>
      {err && <p className="bk__err" role="alert">{t(UI.pickDates, lang)}</p>}
    </form>
  );
}

function Header({ lang, route, scrolled, onMenu }: { lang: Lang; route: RouteKey; scrolled: boolean; onMenu: () => void }) {
  return (
    <header className={`hd ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="hd__top">
        <span className="hd__official">{t(UI.official, lang)}</span>
        <div className="hd__topright">
          <a href={waUrl(t(WA_MSG.general, lang))} target="_blank" rel="noopener"><WhatsApp size={14} /> {CONFIG.phoneDisplay}</a>
          <span className="hd__sep" />
          <LangSwitch lang={lang} route={route} />
        </div>
      </div>
      <div className="hd__main">
        <a className="hd__logo" href={ROUTES.home[lang]} aria-label="Hotel Tama Lodge"><Logo variant={scrolled ? 'dark' : 'light'} id={scrolled ? 'sunH2' : 'sunH'} /></a>
        <div className="hd__booking"><BookingFields lang={lang} compact /></div>
        <button className="hd__menu" type="button" onClick={onMenu} aria-label={t(UI.menu, lang)} aria-haspopup="dialog"><Menu /></button>
      </div>
    </header>
  );
}

function MenuOverlay({ lang, route, open, onClose }: { lang: Lang; route: RouteKey; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  return (
    <div className={`mn ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label={t(UI.menu, lang)} aria-hidden={!open}>
      <div className="mn__panel">
        <div className="mn__top">
          <Logo variant="light" id="sunM" />
          <button ref={closeRef} className="mn__close" type="button" onClick={onClose} aria-label={t(UI.close, lang)} tabIndex={open ? 0 : -1}><Close /></button>
        </div>
        <nav className="mn__nav" aria-label={t(UI.menu, lang)}>
          {NAV.map((n, i) => (
            <a key={n.key} href={ROUTES[n.key][lang]} aria-current={n.key === route ? 'page' : undefined} style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }} tabIndex={open ? 0 : -1}>
              <span className="mn__num">0{i + 1}</span>{t(n.label, lang)}
            </a>
          ))}
        </nav>
        <div className="mn__foot">
          <a href={waUrl(t(WA_MSG.general, lang))} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}><WhatsApp size={16} /> {CONFIG.phoneDisplay}</a>
          <a href={mailUrl(lang)} tabIndex={open ? 0 : -1}><Mail /> {CONFIG.email}</a>
          <LangSwitch lang={lang} route={route} />
        </div>
      </div>
      <div className="mn__media" aria-hidden="true"><img src="/assets/img/tamarindo-panorama.webp" alt="" loading="lazy" /></div>
    </div>
  );
}

function BottomBar({ lang, scrolled, nearFooter, onMobileBook }: { lang: Lang; scrolled: boolean; nearFooter: boolean; onMobileBook: () => void }) {
  return (
    <div className={`bb ${scrolled ? 'is-scrolled' : ''} ${nearFooter ? 'is-hidden' : ''}`}>
      <a className="bb__rating" href={CONFIG.googleReviews} target="_blank" rel="noopener">
        <b>{CONFIG.rating}<small>/5</small></b>
        <span><strong>{t(UI.excellent, lang)}</strong><br />{CONFIG.reviews} {t(UI.reviewsOn, lang)}</span>
      </a>
      <div className="bb__form"><BookingFields lang={lang} /></div>
      <button className="bb__mobile" type="button" onClick={onMobileBook}><Calendar /> {t(UI.bookNow, lang)}</button>
    </div>
  );
}

function MobileSheet({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  return (
    <div className={`sh ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label={t(UI.bookNow, lang)} aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sh__panel">
        <div className="sh__top"><strong>{t(UI.bookNow, lang)}</strong><button type="button" onClick={onClose} aria-label={t(UI.close, lang)}><Close size={24} /></button></div>
        <BookingFields lang={lang} onDone={onClose} />
        <WaBookingLink lang={lang} />
      </div>
    </div>
  );
}

function WaBookingLink({ lang }: { lang: Lang }) {
  const b = useBooking();
  return <a className="wa-alt" href={waUrl(b.waMessage)} target="_blank" rel="noopener"><WhatsApp size={16} /> {lang === 'es' ? '¿Prefieres WhatsApp? Escríbenos' : 'Prefer WhatsApp? Message us'}</a>;
}

function FloatingWa({ lang }: { lang: Lang }) {
  const [closed, setClosed] = useState(false);
  return (
    <div className="fw">
      {!closed && (
        <div className="fw__card">
          <button className="fw__x" type="button" onClick={() => setClosed(true)} aria-label={t(UI.close, lang)}>×</button>
          <strong>{t(UI.bestPrice, lang)}</strong>
          <span>{t(UI.bestPriceSub, lang)}</span>
          <a href={waUrl(t(WA_MSG.general, lang))} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      )}
      <a className="fw__btn" href={waUrl(t(WA_MSG.general, lang))} target="_blank" rel="noopener" aria-label={t(UI.waUs, lang)}><WhatsApp size={28} /></a>
    </div>
  );
}

function LangHint({ lang, route }: { lang: Lang; route: RouteKey }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('tl-lang'); } catch { /* */ }
    // Si la persona ya eligió un idioma, la llevamos a esa versión (Google no guarda preferencias).
    if (saved && saved !== lang) { window.location.replace(ROUTES[route][saved as Lang] + window.location.hash); return; }
    const first = String((navigator.languages && navigator.languages[0]) || navigator.language || 'es').toLowerCase();
    if (lang === 'es' && !saved && !first.startsWith('es')) setShow(true);
  }, [lang, route]);
  if (!show) return null;
  const pick = (l: Lang) => { try { localStorage.setItem('tl-lang', l); } catch { /* */ } };
  return (
    <div className="lh" role="region" aria-label="Language">
      <span>{t(UI.langHint, lang)}</span>
      <a href={ROUTES[route].en} onClick={() => pick('en')}>{t(UI.viewEn, lang)}</a>
      <button type="button" onClick={() => { pick('es'); setShow(false); }}>Español</button>
    </div>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="ft">
      <div className="ft__in">
        <div className="ft__brand">
          <Logo variant="light" id="sunF" />
          <p>{t(UI.footerAbout, lang)}</p>
          <a className="ft__addr" href={CONFIG.hotelMaps} target="_blank" rel="noopener"><Pin /> {CONFIG.address}</a>
        </div>
        <div>
          <p className="ft__title">{t(UI.footerContact, lang)}</p>
          <a href={waUrl(t(WA_MSG.general, lang))} target="_blank" rel="noopener"><WhatsApp size={15} /> {CONFIG.phoneDisplay}</a>
          <a href={mailUrl(lang)}><Mail /> {CONFIG.email}</a>
          <a href={CONFIG.bookingEngine} target="_blank" rel="noopener"><Calendar size={16} /> {lang === 'es' ? 'Gestiona tu reserva' : 'Manage your booking'}</a>
        </div>
        <div>
          <p className="ft__title">{t(UI.footerExplore, lang)}</p>
          {NAV.slice(1).map((n) => <a key={n.key} href={ROUTES[n.key][lang]}>{t(n.label, lang)}</a>)}
        </div>
        <div>
          <p className="ft__title">{t(UI.footerFollow, lang)}</p>
          <a href={CONFIG.instagram} target="_blank" rel="noopener"><Instagram /> @tamalodge</a>
          <a href={CONFIG.googleReviews} target="_blank" rel="noopener"><Star /> {CONFIG.rating} · {CONFIG.reviews} {t(UI.reviewsOn, lang)}</a>
        </div>
      </div>
      <div className="ft__bottom">
        <span>© {new Date().getFullYear()} Hotel Tama Lodge · Tamarindo, Costa Rica. {t(UI.rights, lang)}</span>
        <span className="ft__langs"><User size={14} /> <a href={ROUTES.home.es} hrefLang="es">Español</a> · <a href={ROUTES.home.en} hrefLang="en">English</a></span>
      </div>
    </footer>
  );
}

export function Layout({ lang, route, children }: { lang: Lang; route: RouteKey; children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 80);
      const doc = document.documentElement;
      setNearFooter(window.innerHeight + window.scrollY > doc.scrollHeight - 520);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  // Animación de aparición al hacer scroll
  useEffect(() => {
    const els = document.querySelectorAll('.up');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <BookingProvider lang={lang}>
      <a className="skip" href="#contenido">{t(UI.skip, lang)}</a>
      <Header lang={lang} route={route} scrolled={scrolled} onMenu={() => setMenu(true)} />
      <MenuOverlay lang={lang} route={route} open={menu} onClose={() => setMenu(false)} />
      <main id="contenido">{children}</main>
      <Footer lang={lang} />
      <BottomBar lang={lang} scrolled={scrolled} nearFooter={nearFooter} onMobileBook={() => setSheet(true)} />
      <MobileSheet lang={lang} open={sheet} onClose={() => setSheet(false)} />
      <FloatingWa lang={lang} />
      <LangHint lang={lang} route={route} />
    </BookingProvider>
  );
}

export { other, WaBookingLink };
