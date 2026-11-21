import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CONFIG, DESTINATIONS, EXPERIENCES, PLACES, ROOMS, ROUTES, UI, VIDEOS, WA_MSG, t, waUrl, type Lang, type Txt } from '../data/site';
import { useBooking } from '../booking';
import { Arrow, ArrowUpRight, Check, Chevron, Plus, Star } from './Icons';

/* ---------- Carrusel con scroll-snap, flechas y puntos ---------- */
export function Carousel({ children, label, lang, className = '', dots = true }: { children: ReactNode[]; label: string; lang: Lang; className?: string; dots?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const el = track.current; if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    let best = 0, bd = Infinity;
    items.forEach((it, i) => { const d = Math.abs(it.offsetLeft - el.offsetLeft - left - (items[0].offsetLeft - el.offsetLeft)); if (d < bd) { bd = d; best = i; } });
    setIdx(best);
    setEdges({ start: left < 8, end: left + el.clientWidth >= el.scrollWidth - 8 });
  }, []);
  useEffect(() => { update(); const el = track.current; el?.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); return () => { el?.removeEventListener('scroll', update); window.removeEventListener('resize', update); }; }, [update]);
  const go = (i: number) => {
    const el = track.current; if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const n = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ left: items[n].offsetLeft - items[0].offsetLeft, behavior: 'smooth' });
  };
  return (
    <div className={`car ${className}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="car__track" ref={track}>{children}</div>
      <div className="car__ui">
        {dots && (
          <div className="car__dots">
            {children.map((_, i) => <button key={i} type="button" className={i === idx ? 'is-on' : ''} aria-label={`${i + 1} / ${children.length}`} aria-current={i === idx} onClick={() => go(i)} />)}
          </div>
        )}
        <div className="car__arrows">
          <button type="button" onClick={() => go(idx - 1)} disabled={edges.start} aria-label={t(UI.prev, lang)}><Chevron dir="left" /></button>
          <button type="button" onClick={() => go(idx + 1)} disabled={edges.end} aria-label={t(UI.next, lang)}><Chevron /></button>
        </div>
      </div>
    </div>
  );
}

export function LinkMore({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return <a className="more" href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>{children} <Arrow /></a>;
}

export function Heading({ kicker, title, text, center, light, children, h1 }: { kicker?: string; title: string; text?: string; center?: boolean; light?: boolean; children?: ReactNode; h1?: boolean }) {
  const H = h1 ? 'h1' : 'h2';
  return (
    <div className={`head up ${center ? 'head--center' : ''} ${light ? 'head--light' : ''}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <H className="title">{title}</H>
      {text && <p className="lead">{text}</p>}
      {children}
    </div>
  );
}

/* ---------- Portada con carrusel ---------- */
export type Slide = { img: string; pos?: string; title: Txt };
export function HeroSlider({ lang, slides, kicker }: { lang: Lang; slides: Slide[]; kicker: Txt }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % slides.length), 6500);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);
  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Hotel Tama Lodge" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, k) => (
        <div key={k} className={`hero__slide ${k === i ? 'is-on' : ''}`} aria-hidden={k !== i}>
          <img src={s.img} alt="" style={{ objectPosition: s.pos }} fetchPriority={k === 0 ? 'high' : 'low'} loading={k === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
      <div className="hero__shade" />
      <div className="hero__content">
        <p className="hero__kicker">{t(kicker, lang)}</p>
        <h1 className="hero__title" key={i}>{t(slides[i].title, lang).split('\n').map((l, n) => <span key={n}>{l}</span>)}</h1>
        <div className="hero__dots">
          {slides.map((_, k) => <button key={k} type="button" className={k === i ? 'is-on' : ''} onClick={() => setI(k)} aria-label={`${k + 1} / ${slides.length}`} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Portada simple (páginas internas) ---------- */
export function PageHero({ lang, img, pos, crumb, title, sub }: { lang: Lang; img: string; pos?: string; crumb: string; title: string; sub: string }) {
  return (
    <section className="hero hero--page">
      <div className="hero__slide is-on"><img src={img} alt="" style={{ objectPosition: pos }} fetchPriority="high" /></div>
      <div className="hero__shade" />
      <div className="hero__content">
        <p className="hero__kicker"><a href={ROUTES.home[lang]}>{t(UI.home, lang)}</a> · {crumb}</p>
        <h1 className="hero__title">{title.split('\n').map((l, n) => <span key={n}>{l}</span>)}</h1>
        <p className="hero__sub">{sub}</p>
      </div>
    </section>
  );
}

/* ---------- Introducción + tira de fotos ---------- */
export function Intro({ lang, kicker, title, text, more, images }: { lang: Lang; kicker: string; title: string; text: string; more?: { href: string; label: string }; images: { src: string; alt: string }[] }) {
  return (
    <section className="sec sec--cream intro">
      <div className="wrap">
        <Heading kicker={kicker} title={title} text={text} center>{more && <LinkMore href={more.href}>{more.label}</LinkMore>}</Heading>
      </div>
      <Carousel lang={lang} label={title} className="car--strip up">
        {images.map((im, i) => <figure key={i} className="strip__item"><img src={im.src} alt={im.alt} loading="lazy" /></figure>)}
      </Carousel>
    </section>
  );
}

/* ---------- Habitaciones ---------- */
export function Rooms({ lang, title, text, showAll = true }: { lang: Lang; title?: string; text?: string; showAll?: boolean }) {
  const b = useBooking();
  return (
    <section className="sec sec--cream rooms" id="habitaciones">
      <div className="wrap">
        <Heading kicker={lang === 'es' ? 'Habitaciones' : 'Rooms'} title={title ?? (lang === 'es' ? 'Descansa a tu manera' : 'Rest your way')} text={text ?? (lang === 'es' ? 'Cuartos frescos y tranquilos con aire acondicionado, baño privado y Wi‑Fi gratis, a 5 minutos de Playa Tamarindo.' : 'Cool, quiet rooms with air conditioning, private bathroom and free Wi‑Fi, 5 minutes from Playa Tamarindo.')}>
          {showAll && <LinkMore href={ROUTES.rooms[lang]}>{t(UI.seeAll, lang)}</LinkMore>}
        </Heading>
        <div className="rooms__grid">
          {ROOMS.map((r, i) => (
            <article key={i} className="room up">
              <div className="room__media"><img src={r.img} alt={t(r.name, lang)} loading="lazy" /><span className="room__tag">{t(r.tag, lang)}</span></div>
              <p className="room__kicker">{t(UI.room, lang)}</p>
              <h3 className="room__name">{t(r.name, lang)}</h3>
              <p className="room__text">{t(r.text, lang)}</p>
              <ul className="room__feats">{r.feats.map((f, k) => <li key={k}><Check size={14} />{t(f, lang)}</li>)}</ul>
              <div className="room__foot">
                <span className="live">{t(UI.livePrice, lang)}</span>
                <a className="btn" href={b.url}>{t(UI.checkAvail, lang)} <Arrow /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Destinos (fotos cuadradas) ---------- */
export function Destinations({ lang }: { lang: Lang }) {
  return (
    <section className="sec dest">
      <div className="wrap">
        <Heading kicker={lang === 'es' ? 'Descubre Guanacaste' : 'Discover Guanacaste'} title={lang === 'es' ? 'Las playas más lindas de Costa Rica' : "Costa Rica's most beautiful beaches"} text={lang === 'es' ? 'Desde Tamarindo, Guanacaste está a un paseo de distancia. Te ayudamos a planear cada tour.' : 'From Tamarindo, Guanacaste is a short drive away. We help you plan every tour.'} center>
          <LinkMore href={waUrl(t(WA_MSG.tours, lang))} external>{lang === 'es' ? 'Planea tu tour por WhatsApp' : 'Plan your tour on WhatsApp'}</LinkMore>
        </Heading>
      </div>
      <Carousel lang={lang} label="Guanacaste" className="car--cards up">
        {DESTINATIONS.map((d, i) => (
          <a key={i} className="dcard" href={d.url} target="_blank" rel="noopener">
            <div className="dcard__media"><img src={d.img} alt={d.name} loading="lazy" /></div>
            <p className="dcard__kicker">{t(d.kicker, lang)}</p>
            <h3 className="dcard__name">{d.name}</h3>
            <p className="dcard__text">{t(d.text, lang)}</p>
            <span className="dcard__map">{lang === 'es' ? 'Ver en el mapa' : 'View on map'} <ArrowUpRight /></span>
          </a>
        ))}
      </Carousel>
    </section>
  );
}

/* ---------- Bloque a pantalla completa ---------- */
export function FullBleed({ img, pos, kicker, title, text, cta }: { img: string; pos?: string; kicker: string; title: string; text: string; cta: { href: string; label: string } }) {
  return (
    <section className="fb">
      <img className="fb__img" src={img} alt="" loading="lazy" style={{ objectPosition: pos }} />
      <div className="fb__shade" />
      <div className="fb__box up">
        <p className="kicker">{kicker}</p>
        <h2 className="title">{title}</h2>
        <p className="lead">{text}</p>
        <a className="btn btn--light" href={cta.href}>{cta.label} <Arrow /></a>
      </div>
    </section>
  );
}

/* ---------- Experiencias ---------- */
export function Experiences({ lang, exclude }: { lang: Lang; exclude?: string }) {
  const items = EXPERIENCES.filter((e) => e.route !== exclude);
  return (
    <section className="sec sec--cream exp">
      <div className="wrap exp__head">
        <Heading kicker={lang === 'es' ? 'Experiencias' : 'Experiences'} title={lang === 'es' ? 'El paraíso a un paso' : 'Paradise, one step away'} text={lang === 'es' ? 'Surf, piscina, aventura y atardeceres: vive Tamarindo como un local.' : 'Surf, pool, adventure and sunsets: live Tamarindo like a local.'} />
      </div>
      <Carousel lang={lang} label={lang === 'es' ? 'Experiencias' : 'Experiences'} className="car--exp up">
        {items.map((e, i) => (
          <a key={i} className="xcard" href={ROUTES[e.route][lang]}>
            <img src={e.img} alt="" loading="lazy" />
            <div className="xcard__shade" />
            <div className="xcard__body">
              <p className="kicker">{t(e.kicker, lang)}</p>
              <h3>{t(e.title, lang)}</h3>
              <p>{t(e.text, lang)}</p>
              <span className="more">{t(UI.seeMore, lang)} <Arrow /></span>
            </div>
          </a>
        ))}
      </Carousel>
    </section>
  );
}

/* ---------- Testimonios en video ---------- */
export function Testimonials({ lang }: { lang: Lang }) {
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('.tv video'));
    const on = (e: Event) => vids.forEach((v) => { if (v !== e.target) v.pause(); });
    vids.forEach((v) => v.addEventListener('play', on));
    return () => vids.forEach((v) => v.removeEventListener('play', on));
  }, []);
  return (
    <section className="sec sec--dark" id="testimonios">
      <div className="wrap">
        <div className="tv__head">
          <Heading kicker={lang === 'es' ? 'Testimonios' : 'Reviews'} title={lang === 'es' ? 'Huéspedes reales, experiencias reales' : 'Real guests, real stories'} light />
          <a className="rating up" href={CONFIG.googleReviews} target="_blank" rel="noopener">
            <b>{CONFIG.rating}</b><span><span className="stars">{[0, 1, 2, 3, 4].map((k) => <Star key={k} />)}</span>{CONFIG.reviews} {t(UI.reviewsOn, lang)}</span>
          </a>
        </div>
        <div className="tv">
          {VIDEOS.map((v, i) => (
            <figure key={i} className="tv__item up">
              <video src={v.src} poster={v.poster} controls preload="none" playsInline />
              <figcaption><strong>{t(v.title, lang)}</strong><span>{t(v.text, lang)}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Ubicación con mapa ---------- */
export function Location({ lang, kicker, title, text }: { lang: Lang; kicker?: string; title?: string; text?: string }) {
  const [sel, setSel] = useState('hotel');
  const cur = PLACES.find((p) => p.id === sel) ?? PLACES[0];
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(cur.query)}&z=${cur.zoom}&hl=${lang}&output=embed`;
  return (
    <section className="sec loc" id="ubicacion">
      <div className="wrap loc__grid">
        <div className="loc__text">
          <Heading kicker={kicker ?? (lang === 'es' ? 'Ubicación' : 'Location')} title={title ?? 'Tamarindo, Guanacaste'} text={text ?? (lang === 'es' ? 'Arena blanca, olas para surfear y atardeceres de postal. Restaurantes, tiendas y vida nocturna a la vuelta de la esquina.' : 'White sand, surfable waves and postcard sunsets. Restaurants, shops and nightlife just around the corner.')} />
          <ul className="places up" aria-label={lang === 'es' ? 'Lugares cercanos' : 'Nearby places'}>
            {PLACES.map((p) => (
              <li key={p.id}><button type="button" aria-pressed={p.id === sel} onClick={() => setSel(p.id)}><span>{t(p.name, lang)}</span><strong>{t(p.dist, lang)}</strong></button></li>
            ))}
          </ul>
        </div>
        <div className="loc__map up">
          <iframe title={t(cur.name, lang)} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <div className="loc__card">
            <div><strong>{t(cur.name, lang)}</strong><span>{cur.id === 'hotel' ? '75V8+M64 · Tamarindo, Guanacaste' : t(UI.fromHotel, lang) + t(cur.dist, lang)}</span></div>
            <a className="btn" href={cur.url} target="_blank" rel="noopener">{t(UI.openMaps, lang)} <ArrowUpRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Preguntas frecuentes ---------- */
export function Faq({ lang, items, title }: { lang: Lang; items: { q: string; a: string }[]; title: string }) {
  return (
    <section className="sec sec--cream faq" id="preguntas">
      <div className="wrap faq__grid">
        <Heading kicker={t(UI.faq, lang)} title={title} />
        <div className="faq__list up">
          {items.map((f, i) => (
            <details key={i} className="faq__item">
              <summary>{f.q}<Plus /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Texto + dos fotos (páginas internas) ---------- */
export function Story({ kicker, title, paras, list, imgs, children, reverse }: { kicker: string; title: string; paras: string[]; list?: string[]; imgs: { src: string; alt: string }[]; children?: ReactNode; reverse?: boolean }) {
  return (
    <section className="sec sec--cream">
      <div className={`wrap story ${reverse ? 'story--rev' : ''}`}>
        <div className="story__text up">
          <p className="kicker">{kicker}</p>
          <h2 className="title">{title}</h2>
          {paras.map((p, i) => <p key={i} className="lead">{p}</p>)}
          {list && <ul className="ticks">{list.map((l, i) => <li key={i}><Check size={15} />{l}</li>)}</ul>}
          {children}
        </div>
        <div className="story__media up">
          {imgs.map((im, i) => <img key={i} src={im.src} alt={im.alt} loading="lazy" />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Banda final ---------- */
export function CtaBand({ lang, title }: { lang: Lang; title: string }) {
  const b = useBooking();
  return (
    <section className="cta">
      <div className="wrap cta__in up">
        <h2 className="title">{title}</h2>
        <div className="cta__btns">
          <a className="btn btn--sun" href={b.url}>{lang === 'es' ? 'Ver disponibilidad y precios' : 'See availability & rates'} <Arrow /></a>
          <a className="btn btn--ghost" href={waUrl(b.waMessage)} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </section>
  );
}

export function Related({ lang, exclude }: { lang: Lang; exclude: string }) {
  const links: { k: keyof typeof ROUTES; es: string; en: string }[] = [
    { k: 'rooms', es: 'Habitaciones en Tamarindo', en: 'Rooms in Tamarindo' },
    { k: 'pool', es: 'Hotel con piscina', en: 'Hotel with a pool' },
    { k: 'surf', es: 'Surf en Tamarindo', en: 'Surf in Tamarindo' },
    { k: 'guanacaste', es: 'Hotel en Guanacaste', en: 'Hotel in Guanacaste' },
    { k: 'zona', es: 'Playa Tamarindo y la zona', en: 'Playa Tamarindo & the area' },
    { k: 'hotel', es: 'El hotel', en: 'The hotel' },
  ];
  return (
    <nav className="related wrap" aria-label={lang === 'es' ? 'Más para tu viaje' : 'More for your trip'}>
      <p className="kicker">{lang === 'es' ? 'Más para tu viaje' : 'More for your trip'}</p>
      <div>{links.filter((l) => l.k !== exclude).map((l) => <a key={l.k} href={ROUTES[l.k][lang]}>{l[lang]} <Arrow size={14} /></a>)}</div>
    </nav>
  );
}
