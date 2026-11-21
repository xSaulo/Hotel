import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONFIG, type Lang } from './data/site';

type Booking = {
  checkIn: string; checkOut: string; adults: string;
  setCheckIn: (v: string) => void; setCheckOut: (v: string) => void; setAdults: (v: string) => void;
  url: string; nights: number; waMessage: string;
};

const Ctx = createContext<Booking | null>(null);
const pad = (n: number) => String(n).padStart(2, '0');
const localIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return localIso(d); };

export function todayIso() { return localIso(new Date()); }

/** Enlace al motor de reservas (Kross) con fechas y huéspedes ya cargados. */
export function krossUrl(lang: Lang, checkIn: string, checkOut: string, adults: number) {
  const from = checkIn || addDays(localIso(new Date()), 1);
  const to = checkOut && checkOut > from ? checkOut : addDays(from, checkIn ? 1 : 2);
  const a = Math.min(Math.max(adults, 1), 2);
  return `${CONFIG.bookingEngine}/book/step1?adults=${a}&children=0&rooms=1&guests=${a}&n_guests=${a}&guests_rooms=${a},0;&kross_lang=${lang}&from=${from}&to=${to}`;
}

function fmt(v: string, lang: Lang) {
  if (!v) return lang === 'es' ? 'por definir' : 'to be confirmed';
  return new Date(v + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function BookingProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [checkIn, setIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  // Las fechas por defecto dependen del día de hoy: se calculan solo en el navegador.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const setCheckIn = (v: string) => { setIn(v); if (checkOut && checkOut <= v) setCheckOut(''); };
  const value = useMemo<Booking>(() => {
    const nights = checkIn && checkOut ? Math.round((+new Date(checkOut + 'T12:00:00') - +new Date(checkIn + 'T12:00:00')) / 86400000) : 0;
    const a = Number(adults);
    const es = lang === 'es';
    const guests = es ? `${a} ${a === 1 ? 'adulto' : 'adultos'}` : `${a} ${a === 1 ? 'adult' : 'adults'}`;
    const lines = [
      (es ? 'Hola, Tama Lodge ' : 'Hi Tama Lodge ') + '👋', '',
      es ? 'Me gustaría consultar disponibilidad:' : 'I would like to check availability:', '',
      `📅 *${es ? 'Llegada' : 'Check-in'}:* ${fmt(checkIn, lang)}`,
      `📅 *${es ? 'Salida' : 'Check-out'}:* ${fmt(checkOut, lang)}`,
      ...(nights > 0 ? [`🌙 *${es ? 'Noches' : 'Nights'}:* ${nights}`] : []),
      `👥 *${es ? 'Huéspedes' : 'Guests'}:* ${guests}`, '',
      es ? '¿Tienen habitaciones disponibles? ¿Cuál sería la tarifa?' : 'Do you have rooms available, and what would the rate be?', '',
      es ? '¡Muchas gracias!' : 'Thank you!',
    ];
    return { checkIn, checkOut, adults, setCheckIn, setCheckOut, setAdults, url: mounted ? krossUrl(lang, checkIn, checkOut, a) : CONFIG.bookingEngine, nights, waMessage: lines.join('\n') };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, adults, lang, mounted]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBooking outside provider');
  return v;
}

export { addDays, localIso };
