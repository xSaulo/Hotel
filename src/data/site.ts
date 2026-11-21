// ============================================================
// Datos del hotel — edita aquí número, correo, rutas y textos.
// ============================================================
import copy from './copy.json';

export type Lang = 'es' | 'en';
export type Txt = { es: string; en: string };
export const t = (x: Txt, l: Lang) => x[l];

export const CONFIG = {
  whatsapp: '50689926888',
  phoneDisplay: '+506 8992 6888',
  email: 'ota@hoteltamalodge.com',
  bookingEngine: 'https://tamalodge.kross.travel',
  hotelMaps: 'https://maps.app.goo.gl/Q6FEESgZPR6FmrrJ9',
  instagram: 'https://www.instagram.com/tamalodge/',
  googleReviews: 'https://www.google.com/search?q=Hotel+Tama+Lodge+Tamarindo',
  site: 'https://www.hoteltamalodge.com',
  address: '75V8+M64, Avenida Central · Tamarindo, Guanacaste, Costa Rica',
  rating: '4.8',
  reviews: 78,
  // Correo que recibe las reseñas (vía FormSubmit, sin servidor propio)
  reviewInbox: 'scalvo2910@gmail.com',
};

export type RouteKey = 'home' | 'zona' | 'hotel' | 'surf' | 'pool' | 'rooms' | 'guanacaste' | 'review';
export const ROUTES: Record<RouteKey, { es: string; en: string; landing?: string }> = {
  home: { es: '/', en: '/en/' },
  zona: { es: '/la-zona/', en: '/en/la-zona/' },
  hotel: { es: '/tama-lodge-hotel/', en: '/en/tama-lodge-hotel/' },
  surf: { es: '/surf-tamarindo/', en: '/en/surf-tamarindo/', landing: 'surf-tamarindo' },
  pool: { es: '/hotel-con-piscina-tamarindo/', en: '/en/hotel-con-piscina-tamarindo/', landing: 'hotel-con-piscina-tamarindo' },
  rooms: { es: '/habitaciones/', en: '/en/habitaciones/', landing: 'habitaciones' },
  guanacaste: { es: '/hotel-guanacaste/', en: '/en/hotel-guanacaste/', landing: 'hotel-guanacaste' },
  review: { es: '/resena/', en: '/en/review/' },
};

export function resolve(path: string): { key: RouteKey; lang: Lang } {
  const p = path.endsWith('/') ? path : path + '/';
  for (const [key, r] of Object.entries(ROUTES) as [RouteKey, { es: string; en: string }][]) {
    if (r.es === p) return { key, lang: 'es' };
    if (r.en === p) return { key, lang: 'en' };
  }
  return { key: 'home', lang: p.startsWith('/en/') ? 'en' : 'es' };
}

export const META: Record<RouteKey, { title: Txt; desc: Txt; image: string }> = {
  review: {
    title: { es: 'Cuéntanos tu estadía | Hotel Tama Lodge', en: 'Tell us about your stay | Hotel Tama Lodge' },
    desc: { es: 'Déjanos tu reseña sobre tu estadía en Hotel Tama Lodge, Tamarindo. Tu opinión nos ayuda a mejorar.', en: 'Leave a review of your stay at Hotel Tama Lodge, Tamarindo. Your feedback helps us improve.' },
    image: '/assets/img/og-image.jpg',
  },
  home: {
    title: { es: 'Hotel en Tamarindo, Guanacaste | Hotel Tama Lodge · Piscina a 5 min de la playa', en: 'Hotel in Tamarindo, Costa Rica | Hotel Tama Lodge · Pool, 5 min from the beach' },
    desc: { es: 'Hotel Tama Lodge en Tamarindo, Guanacaste, Costa Rica: piscina, jardín tropical, Wi‑Fi y parqueo gratis, a 5 minutos de Playa Tamarindo. Reserva directo con nuestra mejor tarifa.', en: 'Hotel Tama Lodge in Tamarindo, Guanacaste, Costa Rica: outdoor pool, tropical garden, free Wi‑Fi and parking, 5 minutes from Playa Tamarindo. Book direct at our best rate.' },
    image: '/assets/img/og-image.jpg',
  },
  zona: {
    title: { es: 'Playa Tamarindo: qué hacer cerca | Hotel Tama Lodge', en: 'Playa Tamarindo: things to do nearby | Hotel Tama Lodge' },
    desc: { es: 'Playa Tamarindo ofrece arena blanca, grandes olas para surfear e increíbles vistas rodeadas de montañas. Hospédate en Hotel Tama Lodge, a solo 5 minutos.', en: 'Playa Tamarindo offers white sand, big surfing waves and incredible views surrounded by mountains. Stay at Hotel Tama Lodge, just 5 minutes away.' },
    image: '/assets/img/og-zona.jpg',
  },
  hotel: {
    title: { es: 'Tama Lodge – Hotel en Tamarindo con piscina | Reserva directa', en: 'Tama Lodge – Hotel in Tamarindo with pool | Book direct' },
    desc: { es: 'Tama Lodge, hotel en Tamarindo, Guanacaste: Habitación Doble y Estudio Equipado con aire acondicionado, piscina y Wi‑Fi gratis, a 5 minutos de Playa Tamarindo.', en: 'Tama Lodge, a hotel in Tamarindo, Guanacaste: Double Room and Equipped Studio with air conditioning, pool and free Wi‑Fi, 5 minutes from Playa Tamarindo.' },
    image: '/assets/img/og-image.jpg',
  },
  surf: { title: { es: '', en: '' }, desc: { es: '', en: '' }, image: '/assets/img/og-image.jpg' },
  pool: { title: { es: '', en: '' }, desc: { es: '', en: '' }, image: '/assets/img/og-image.jpg' },
  rooms: { title: { es: '', en: '' }, desc: { es: '', en: '' }, image: '/assets/img/og-image.jpg' },
  guanacaste: { title: { es: '', en: '' }, desc: { es: '', en: '' }, image: '/assets/img/og-image.jpg' },
};

// --- Landings (contenido para búsquedas específicas) ---
export type LandingCopy = { title: string; desc: string; crumb: string; h1: string; sub: string; k1: string; h2: string; p: string[]; list: string[]; cta: string; wa: string; faq: [string, string][] };
export type Landing = { hero: string; pos: string; img1: string; img2: string; rooms: boolean; dest: boolean; es: LandingCopy; en: LandingCopy };
export const LANDINGS = (copy as unknown as { landings: Record<string, Landing> }).landings;
for (const k of ['surf', 'pool', 'rooms', 'guanacaste'] as RouteKey[]) {
  const L = LANDINGS[ROUTES[k].landing!];
  META[k].title = { es: L.es.title, en: L.en.title };
  META[k].desc = { es: L.es.desc, en: L.en.desc };
}
export const HOME_FAQ = (copy as unknown as { faq: { q: Txt; a: Txt }[] }).faq;

// --- Habitaciones (fotos oficiales de Kross) ---
export const ROOMS = [
  {
    img: '/assets/img/room-doble.webp', tag: { es: 'Más reservada', en: 'Most booked' },
    name: { es: 'Habitación Doble', en: 'Double Room' },
    text: { es: 'Cómoda y fresca, ideal para parejas o viajeros que buscan descansar después de un día de playa.', en: 'Comfortable and cool, ideal for couples or travelers looking to unwind after a day at the beach.' },
    feats: [{ es: 'Aire acondicionado', en: 'Air conditioning' }, { es: 'Baño privado', en: 'Private bathroom' }, { es: 'Wi‑Fi gratis', en: 'Free Wi‑Fi' }, { es: 'Hasta 2 adultos', en: 'Up to 2 adults' }],
  },
  {
    img: '/assets/img/room-estudio.webp', tag: { es: 'Con cocina', en: 'With kitchen' },
    name: { es: 'Estudio Equipado', en: 'Equipped Studio' },
    text: { es: 'Tu propio espacio con cocina equipada: perfecto para estancias largas, familias y nómadas digitales.', en: 'Your own space with a fully equipped kitchen: perfect for long stays and digital nomads.' },
    feats: [{ es: 'Cocina equipada', en: 'Equipped kitchen' }, { es: 'Aire acondicionado', en: 'Air conditioning' }, { es: 'Baño privado', en: 'Private bathroom' }, { es: 'Hasta 2 adultos', en: 'Up to 2 adults' }],
  },
];

// --- Destinos (fotos cuadradas del equipo) ---
const gm = (q: string) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
export const DESTINATIONS = [
  { img: '/assets/img/conchal.webp', name: 'Playa Conchal', kicker: { es: 'Playa', en: 'Beach' }, text: { es: 'Arena de conchitas y agua turquesa, perfecta para snorkel.', en: 'Shell sand and turquoise water, perfect for snorkeling.' }, url: gm('Playa Conchal, Guanacaste, Costa Rica') },
  { img: '/assets/img/las-minas.webp', name: 'Playa Las Minas', kicker: { es: 'Playa', en: 'Beach' }, text: { es: 'Una bahía escondida rodeada de bosque seco tropical.', en: 'A hidden bay surrounded by tropical dry forest.' }, url: gm('Playa Las Minas, Guanacaste, Costa Rica') },
  { img: '/assets/img/guachipelin.webp', name: 'Hacienda Guachipelín', kicker: { es: 'Aventura', en: 'Adventure' }, text: { es: 'Puentes colgantes y cataratas en Rincón de la Vieja.', en: 'Hanging bridges and waterfalls at Rincón de la Vieja.' }, url: gm('Hacienda Guachipelín, Rincón de la Vieja, Costa Rica') },
  { img: '/assets/img/flamingo.webp', name: 'Playa Flamingo', kicker: { es: 'Playa', en: 'Beach' }, text: { es: 'Arena blanca, palmeras y atardeceres de postal.', en: 'White sand, palm trees and postcard sunsets.' }, url: gm('Playa Flamingo, Guanacaste, Costa Rica') },
];

// --- Experiencias (enlazan a las páginas para búsquedas) ---
export const EXPERIENCES: { img: string; kicker: Txt; title: Txt; text: Txt; route: RouteKey }[] = [
  { img: '/assets/img/playa-grande-limpia.webp', kicker: { es: 'Surf', en: 'Surf' }, title: { es: 'Olas para todos los niveles', en: 'Waves for every level' }, text: { es: 'Tamarindo es ideal para aprender; Playa Grande, para los que buscan más.', en: 'Tamarindo is ideal for learning; Playa Grande for those who want more.' }, route: 'surf' },
  { img: '/assets/img/flamingo-limpia.webp', kicker: { es: 'Piscina y jardín', en: 'Pool & garden' }, title: { es: 'Del mar a la piscina', en: 'From the ocean to the pool' }, text: { es: 'Piscina al aire libre rodeada de jardín tropical.', en: 'An outdoor pool surrounded by a tropical garden.' }, route: 'pool' },
  { img: '/assets/img/cabalgata.webp', kicker: { es: 'Aventura', en: 'Adventure' }, title: { es: 'Cabalgatas por la playa', en: 'Horseback rides on the beach' }, text: { es: 'Te ayudamos a reservar tours con guías locales.', en: 'We help you book tours with local guides.' }, route: 'guanacaste' },
  { img: '/assets/img/atardecer-limpia.webp', kicker: { es: 'Tamarindo', en: 'Tamarindo' }, title: { es: 'Atardeceres de postal', en: 'Postcard sunsets' }, text: { es: 'Termina cada día con los pies en la arena.', en: 'End every day with your toes in the sand.' }, route: 'zona' },
  { img: '/assets/img/mariposa.webp', kicker: { es: 'Naturaleza', en: 'Nature' }, title: { es: 'Vida silvestre en el jardín', en: 'Wildlife in the garden' }, text: { es: 'Mariposas, aves y flores tropicales a tu alrededor.', en: 'Butterflies, birds and tropical flowers all around you.' }, route: 'hotel' },
];

// --- Lugares del mapa ---
export const PLACES = [
  { id: 'hotel', name: { es: 'Hotel Tama Lodge', en: 'Hotel Tama Lodge' }, dist: { es: 'Tu base', en: 'Your base' }, query: 'Hotel Tama Lodge, Tamarindo, Guanacaste, Costa Rica', zoom: 16, url: CONFIG.hotelMaps },
  { id: 'pt', name: { es: 'Playa Tamarindo', en: 'Playa Tamarindo' }, dist: { es: '5 min en auto', en: '5 min by car' }, query: 'Playa Tamarindo, Guanacaste, Costa Rica', zoom: 14, url: 'https://maps.app.goo.gl/UFrMjB3kJPFNm9Qg8' },
  { id: 'mn', name: { es: 'Mercado nocturno', en: 'Night market' }, dist: { es: '1 km', en: '1 km' }, query: 'Mercado nocturno Tamarindo, Guanacaste', zoom: 15, url: gm('Mercado nocturno Tamarindo') },
  { id: 'pg', name: { es: 'Playa Grande', en: 'Playa Grande' }, dist: { es: '20 km · 43 min', en: '20 km · 43 min' }, query: 'Playa Grande, Guanacaste, Costa Rica', zoom: 13, url: 'https://maps.app.goo.gl/vXR78ZyGZFPEPc7w6' },
  { id: 'lir', name: { es: 'Aeropuerto de Liberia (LIR)', en: 'Liberia Airport (LIR)' }, dist: { es: '68 km · 1 h 45 min', en: '68 km · 1 hr 45 min' }, query: 'Aeropuerto Internacional Daniel Oduber Quirós, Liberia, Costa Rica', zoom: 13, url: 'https://maps.app.goo.gl/n1ceke4MUmnTsA9x8' },
];

export const VIDEOS = [
  { src: '/assets/video/testimonio-1.mp4', poster: '/assets/img/poster-1.jpg', title: { es: 'Huésped desde junio', en: 'Our guest since June' }, text: { es: '“Nos encanta tenerla con nosotros.”', en: '“We love having her with us.”' } },
  { src: '/assets/video/testimonio-2.mp4', poster: '/assets/img/poster-2.jpg', title: { es: '15 días en Tama Lodge', en: '15 days at Tama Lodge' }, text: { es: 'Su experiencia, en sus propias palabras.', en: 'Her stay, in her own words.' } },
  { src: '/assets/video/testimonio-3.mp4', poster: '/assets/img/poster-3.jpg', title: { es: 'Un recorrido por el lodge', en: 'A tour of the lodge' }, text: { es: 'Piscina, jardín y rincones favoritos.', en: 'Pool, garden and favorite spots.' } },
];

// --- Mensajes de WhatsApp ---
const W = '👋';
export const WA_MSG: Record<string, Txt> = {
  general: { es: `Hola, Tama Lodge ${W}\n\nQuisiera más información, por favor.`, en: `Hi Tama Lodge ${W}\n\nI would like more information, please.` },
  rooms: { es: `Hola, Tama Lodge ${W}\n\nMe gustaría recibir información sobre las habitaciones disponibles y sus tarifas.\n\n¡Gracias!`, en: `Hi Tama Lodge ${W}\n\nCould you send me information about your available rooms and rates?\n\nThank you!` },
  longstay: { es: `Hola, Tama Lodge ${W}\n\nMe interesa una estancia larga. ¿Qué tarifas semanales o mensuales tienen?\n\n¡Gracias!`, en: `Hi Tama Lodge ${W}\n\nI am interested in a long stay. What are your weekly or monthly rates?\n\nThank you!` },
  tours: { es: `Hola, Tama Lodge ${W}\n\nMe gustaría información sobre tours a playas cercanas (Conchal, Las Minas, Flamingo, Guachipelín).\n\n¡Gracias!`, en: `Hi Tama Lodge ${W}\n\nI would like information about tours to nearby beaches (Conchal, Las Minas, Flamingo, Guachipelín).\n\nThank you!` },
  surf: { es: `Hola, Tama Lodge ${W}\n\nMe interesa surfear en Tamarindo. ¿Me pueden recomendar clases o alquiler de tablas?\n\n¡Gracias!`, en: `Hi Tama Lodge ${W}\n\nI would like to surf in Tamarindo. Can you recommend surf lessons or board rentals?\n\nThank you!` },
  directions: { es: `Hola, Tama Lodge ${W}\n\n¿Me podrían indicar cómo llegar al hotel?`, en: `Hi Tama Lodge ${W}\n\nCould you tell me how to get to the hotel?` },
};
export const waUrl = (text: string) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
export const mailUrl = (l: Lang) =>
  `mailto:${CONFIG.email}?subject=${encodeURIComponent(l === 'es' ? 'Consulta de reserva - Hotel Tama Lodge' : 'Booking inquiry - Hotel Tama Lodge')}&body=${encodeURIComponent(l === 'es' ? 'Hola, Tama Lodge:\n\nMe gustaría consultar disponibilidad para las siguientes fechas:\n\nLlegada:\nSalida:\nHuéspedes:\n\n¡Gracias!' : 'Hi Tama Lodge,\n\nI would like to check availability for the following dates:\n\nCheck-in:\nCheck-out:\nGuests:\n\nThank you!')}`;

// --- Textos de interfaz ---
export const UI = {
  official: { es: 'Web oficial · Reserva directa', en: 'Official site · Book direct' },
  menu: { es: 'Menú', en: 'Menu' }, close: { es: 'Cerrar', en: 'Close' },
  checkIn: { es: 'Entrada', en: 'Check-in' }, checkOut: { es: 'Salida', en: 'Check-out' },
  guests: { es: 'Huéspedes', en: 'Guests' }, adult1: { es: '1 adulto', en: '1 adult' }, adult2: { es: '2 adultos', en: '2 adults' },
  book: { es: 'Reservar', en: 'Book' }, bookNow: { es: 'Reservar ahora', en: 'Book now' },
  pickDates: { es: 'Elige tu fecha de entrada', en: 'Choose your check-in date' },
  bestPrice: { es: '¡El mejor precio aquí!', en: 'Best price here!' }, bestPriceSub: { es: 'Reserva directa · Sin comisiones', en: 'Direct booking · No fees' },
  excellent: { es: 'Excelente', en: 'Excellent' }, reviewsOn: { es: 'opiniones en Google', en: 'reviews on Google' },
  seeMore: { es: 'Ver más', en: 'See more' }, seeAll: { es: 'Ver todas las habitaciones', en: 'See all rooms' },
  room: { es: 'Habitación', en: 'Room' }, checkAvail: { es: 'Ver disponibilidad', en: 'Check availability' },
  livePrice: { es: 'Precio en tiempo real', en: 'Live pricing' },
  prev: { es: 'Anterior', en: 'Previous' }, next: { es: 'Siguiente', en: 'Next' },
  waUs: { es: 'Escríbenos por WhatsApp', en: 'Message us on WhatsApp' }, sendEmail: { es: 'Enviar un correo', en: 'Send an email' },
  openMaps: { es: 'Abrir en Google Maps', en: 'Open in Google Maps' }, fromHotel: { es: 'Desde Hotel Tama Lodge · ', en: 'From Hotel Tama Lodge · ' },
  faq: { es: 'Preguntas frecuentes', en: 'FAQ' }, home: { es: 'Inicio', en: 'Home' },
  langHint: { es: 'This page is also available in English.', en: 'This page is also available in English.' },
  viewEn: { es: 'View in English', en: 'View in English' },
  footerContact: { es: 'Contacto', en: 'Contact' }, footerExplore: { es: 'Explora', en: 'Explore' }, footerFollow: { es: 'Síguenos', en: 'Follow us' },
  footerAbout: { es: 'Hotel en Tamarindo, Guanacaste, Costa Rica. Pura vida desde el primer día.', en: 'Hotel in Tamarindo, Guanacaste, Costa Rica. Pura vida from day one.' },
  rights: { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
  skip: { es: 'Saltar al contenido', en: 'Skip to content' },
};

export const NAV: { key: RouteKey; label: Txt }[] = [
  { key: 'home', label: { es: 'Inicio', en: 'Home' } },
  { key: 'hotel', label: { es: 'El hotel', en: 'The hotel' } },
  { key: 'rooms', label: { es: 'Habitaciones', en: 'Rooms' } },
  { key: 'pool', label: { es: 'Piscina', en: 'Pool' } },
  { key: 'surf', label: { es: 'Surf en Tamarindo', en: 'Surf in Tamarindo' } },
  { key: 'zona', label: { es: 'Playa Tamarindo y la zona', en: 'Playa Tamarindo & the area' } },
  { key: 'guanacaste', label: { es: 'Descubre Guanacaste', en: 'Discover Guanacaste' } },
];
