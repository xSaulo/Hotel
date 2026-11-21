import { useState, type FormEvent, type ReactNode } from 'react';
import { CONFIG, type Lang } from '../data/site';
import { PageHero } from './Sections';
import { Arrow, Star } from './Icons';

type Txt = { es: string; en: string };
const tx = (o: Txt, l: Lang) => o[l];

// Aspectos que se califican de 1 a 5
const ASPECTS: { id: string; label: Txt }[] = [
  { id: 'limpieza', label: { es: 'Limpieza', en: 'Cleanliness' } },
  { id: 'atencion', label: { es: 'Atención del personal', en: 'Staff & service' } },
  { id: 'habitacion', label: { es: 'Comodidad de la habitación', en: 'Room comfort' } },
  { id: 'piscina', label: { es: 'Piscina y áreas comunes', en: 'Pool & common areas' } },
  { id: 'ubicacion', label: { es: 'Ubicación', en: 'Location' } },
  { id: 'wifi', label: { es: 'Wi‑Fi', en: 'Wi‑Fi' } },
  { id: 'precio', label: { es: 'Relación calidad‑precio', en: 'Value for money' } },
];

const TRIP: Txt[] = [
  { es: 'En pareja', en: 'Couple' }, { es: 'Solo/a', en: 'Solo' }, { es: 'Con amigos', en: 'Friends' },
  { es: 'En familia', en: 'Family' }, { es: 'Trabajo / nómada digital', en: 'Work / digital nomad' },
];
const SOURCE: Txt[] = [
  { es: 'Google', en: 'Google' }, { es: 'Booking / Expedia / Airbnb', en: 'Booking / Expedia / Airbnb' },
  { es: 'Instagram / redes', en: 'Instagram / social media' }, { es: 'Recomendación', en: 'Recommendation' },
  { es: 'Ya me había hospedado', en: 'Stayed before' }, { es: 'Otro', en: 'Other' },
];
const STAR_WORD: Txt[] = [
  { es: 'Malo', en: 'Poor' }, { es: 'Regular', en: 'Fair' }, { es: 'Bueno', en: 'Good' },
  { es: 'Muy bueno', en: 'Very good' }, { es: 'Excelente', en: 'Excellent' },
];

function Stars({ name, value, onChange, lang, big }: { name: string; value: number; onChange: (n: number) => void; lang: Lang; big?: boolean }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className={`rv-stars ${big ? 'rv-stars--big' : ''}`} role="radiogroup" aria-label={name} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} – ${tx(STAR_WORD[n - 1], lang)}`}
          className={n <= shown ? 'on' : ''} onMouseEnter={() => setHover(n)} onClick={() => onChange(n)}>
          <Star size={big ? 34 : 22} />
        </button>
      ))}
      <span className="rv-stars__word">{shown ? tx(STAR_WORD[shown - 1], lang) : ''}</span>
    </div>
  );
}

function Field({ label, hint, children, wide }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`rv-field ${wide ? 'rv-field--wide' : ''}`}>
      <span className="rv-label">{label}{hint && <em> {hint}</em>}</span>
      {children}
    </label>
  );
}

function Chips({ options, value, onChange, lang, label }: { options: Txt[]; value: string; onChange: (v: string) => void; lang: Lang; label: string }) {
  return (
    <div className="rv-chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.es} type="button" role="radio" aria-checked={value === o.es} className={value === o.es ? 'on' : ''} onClick={() => onChange(value === o.es ? '' : o.es)}>{tx(o, lang)}</button>
      ))}
    </div>
  );
}

const fmt = (iso: string) => (iso ? iso.split('-').reverse().join('/') : '');

export function ReviewPage({ lang }: { lang: Lang }) {
  const es = lang === 'es';
  const [f, setF] = useState({ name: '', email: '', country: '', checkIn: '', checkOut: '', trip: '', source: '', liked: '', improve: '', publish: true, website: '' });
  const [overall, setOverall] = useState(0);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [nps, setNps] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    if (f.website) return; // trampa anti‑spam
    const today = new Date().toISOString().slice(0, 10);
    if (!f.name.trim() || !f.checkIn || !f.checkOut) return setErr(es ? 'Completa tu nombre y las fechas de tu estadía.' : 'Please fill in your name and the dates of your stay.');
    if (f.checkOut <= f.checkIn) return setErr(es ? 'La fecha de salida debe ser posterior a la de llegada.' : 'Check-out must be after check-in.');
    if (f.checkIn > today) return setErr(es ? 'La fecha de llegada no puede ser futura.' : 'Check-in date cannot be in the future.');
    if (!overall) return setErr(es ? 'Elige una calificación general (estrellas).' : 'Please choose an overall rating (stars).');

    const nights = Math.round((Date.parse(f.checkOut) - Date.parse(f.checkIn)) / 864e5);
    const starTxt = (n?: number) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) + ` (${n}/5)` : '—');
    const data: Record<string, string> = {
      _subject: `⭐ Nueva reseña: ${f.name.trim()} · ${overall}/5 · ${fmt(f.checkIn)}–${fmt(f.checkOut)}`,
      _template: 'table',
      _captcha: 'false',
      'Nombre completo': f.name.trim(),
      'Correo del huésped': f.email || '—',
      'País': f.country || '—',
      'Fecha de llegada': fmt(f.checkIn),
      'Fecha de salida': fmt(f.checkOut),
      'Noches': String(nights),
      'Tipo de viaje': f.trip || '—',
      'Calificación general': starTxt(overall),
      ...Object.fromEntries(ASPECTS.map((a) => [a.label.es, starTxt(aspects[a.id])])),
      '¿Nos recomendaría? (0‑10)': nps === null ? '—' : String(nps),
      'Lo que más le gustó': f.liked || '—',
      'Qué podemos mejorar': f.improve || '—',
      '¿Cómo nos encontró?': f.source || '—',
      '¿Podemos publicar su comentario?': f.publish ? 'Sí' : 'No',
      'Idioma del formulario': es ? 'Español' : 'English',
    };
    if (f.email) data._replyto = f.email;

    setStatus('sending');
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONFIG.reviewInbox}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) === 'false') throw new Error(j.message || r.statusText);
      setStatus('done');
      window.scrollTo({ top: (document.getElementById('resena')?.offsetTop ?? 0) - 90, behavior: 'smooth' });
    } catch {
      setStatus('error');
      setErr(es ? 'No pudimos enviar tu reseña. Revisa tu conexión e inténtalo de nuevo.' : "We couldn't send your review. Check your connection and try again.");
    }
  }

  return (
    <>
      <PageHero lang={lang} img="/assets/img/atardecer-limpia.webp" pos="center 55%" crumb={es ? 'Tu reseña' : 'Your review'}
        title={es ? 'Cuéntanos\ntu estadía' : 'Tell us about\nyour stay'}
        sub={es ? 'Gracias por hospedarte en Tama Lodge. Toma menos de 2 minutos y nos ayuda muchísimo a mejorar.' : 'Thank you for staying at Tama Lodge. It takes less than 2 minutes and helps us improve a lot.'} />

      <section className="sec sec--cream rv" id="resena">
        <div className="wrap rv__wrap">
          {status === 'done' ? (
            <div className="rv-done">
              <p className="kicker">{es ? '¡Pura vida!' : 'Pura vida!'}</p>
              <h2 className="title">{es ? `Gracias, ${f.name.trim().split(' ')[0]}` : `Thank you, ${f.name.trim().split(' ')[0]}`}</h2>
              <p className="lead">{es ? 'Recibimos tu reseña. La leemos todo el equipo y la usamos para mejorar cada estadía.' : 'We received your review. Our whole team reads it and uses it to make every stay better.'}</p>
              {overall >= 4 && (
                <>
                  <p className="lead">{es ? '¿Nos ayudarías también con una reseña en Google? Así más viajeros nos encuentran.' : 'Would you also leave us a Google review? It helps more travelers find us.'}</p>
                  <a className="btn btn--sun" href={CONFIG.googleReviews} target="_blank" rel="noopener">{es ? 'Reseñar en Google' : 'Review us on Google'} <Arrow /></a>
                </>
              )}
            </div>
          ) : (
            <form className="rv-form" onSubmit={submit} noValidate>
              <fieldset>
                <legend><span>01</span>{es ? 'Tus datos' : 'About you'}</legend>
                <div className="rv-grid">
                  <Field label={es ? 'Nombre completo *' : 'Full name *'} wide>
                    <input required autoComplete="name" value={f.name} onChange={set('name')} placeholder={es ? 'Ej. María Rodríguez Solano' : 'e.g. Jane Smith'} />
                  </Field>
                  <Field label={es ? 'Fecha de llegada *' : 'Check-in date *'}>
                    <input type="date" required value={f.checkIn} onChange={set('checkIn')} />
                  </Field>
                  <Field label={es ? 'Fecha de salida *' : 'Check-out date *'}>
                    <input type="date" required min={f.checkIn || undefined} value={f.checkOut} onChange={set('checkOut')} />
                  </Field>
                  <Field label={es ? 'Correo' : 'Email'} hint={es ? '(opcional, para responderte)' : '(optional, so we can reply)'}>
                    <input type="email" autoComplete="email" value={f.email} onChange={set('email')} />
                  </Field>
                  <Field label={es ? 'País' : 'Country'} hint={es ? '(opcional)' : '(optional)'}>
                    <input autoComplete="country-name" value={f.country} onChange={set('country')} />
                  </Field>
                </div>
                <div className="rv-q">
                  <span className="rv-label">{es ? '¿Con quién viajaste?' : 'Who did you travel with?'}</span>
                  <Chips options={TRIP} value={f.trip} onChange={(v) => setF({ ...f, trip: v })} lang={lang} label={es ? 'Tipo de viaje' : 'Trip type'} />
                </div>
              </fieldset>

              <fieldset>
                <legend><span>02</span>{es ? 'Tu calificación' : 'Your rating'}</legend>
                <div className="rv-q rv-q--overall">
                  <span className="rv-label">{es ? 'En general, ¿cómo fue tu estadía? *' : 'Overall, how was your stay? *'}</span>
                  <Stars big name={es ? 'Calificación general' : 'Overall rating'} value={overall} onChange={setOverall} lang={lang} />
                </div>
                <div className="rv-aspects">
                  {ASPECTS.map((a) => (
                    <div key={a.id} className="rv-aspect">
                      <span>{tx(a.label, lang)}</span>
                      <Stars name={tx(a.label, lang)} value={aspects[a.id] ?? 0} onChange={(n) => setAspects({ ...aspects, [a.id]: n })} lang={lang} />
                    </div>
                  ))}
                </div>
                <div className="rv-q">
                  <span className="rv-label">{es ? '¿Qué tan probable es que nos recomiendes a un amigo?' : 'How likely are you to recommend us to a friend?'}</span>
                  <div className="rv-nps" role="radiogroup" aria-label="0-10">
                    {Array.from({ length: 11 }, (_, n) => (
                      <button key={n} type="button" role="radio" aria-checked={nps === n} className={nps === n ? 'on' : ''} onClick={() => setNps(n)}>{n}</button>
                    ))}
                  </div>
                  <div className="rv-nps__ends"><span>{es ? 'Nada probable' : 'Not likely'}</span><span>{es ? 'Muy probable' : 'Very likely'}</span></div>
                </div>
              </fieldset>

              <fieldset>
                <legend><span>03</span>{es ? 'Tus comentarios' : 'Your comments'}</legend>
                <div className="rv-grid">
                  <Field label={es ? '¿Qué fue lo que más te gustó?' : 'What did you like most?'} wide>
                    <textarea rows={4} value={f.liked} onChange={set('liked')} maxLength={2000} />
                  </Field>
                  <Field label={es ? '¿Qué podríamos mejorar?' : 'What could we improve?'} wide>
                    <textarea rows={4} value={f.improve} onChange={set('improve')} maxLength={2000} />
                  </Field>
                </div>
                <div className="rv-q">
                  <span className="rv-label">{es ? '¿Cómo nos encontraste?' : 'How did you find us?'}</span>
                  <Chips options={SOURCE} value={f.source} onChange={(v) => setF({ ...f, source: v })} lang={lang} label={es ? 'Cómo nos encontraste' : 'How you found us'} />
                </div>
                <label className="rv-check">
                  <input type="checkbox" checked={f.publish} onChange={(e) => setF({ ...f, publish: e.target.checked })} />
                  <span>{es ? 'Acepto que Tama Lodge publique mi comentario con mi nombre de pila en su web o redes.' : 'I agree that Tama Lodge may publish my comment with my first name on its website or social media.'}</span>
                </label>
                {/* trampa anti‑spam: invisible para personas */}
                <input className="rv-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} name="website" />
              </fieldset>

              {err && <p className="rv-err" role="alert">{err}</p>}
              <button className="btn rv-send" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar reseña' : 'Send review')} <Arrow />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
