import { renderToString } from 'react-dom/server';
import App from './App';
import { CONFIG, HOME_FAQ, LANDINGS, META, ROUTES, t, type Lang, type RouteKey } from './data/site';

export const routes = (Object.keys(ROUTES) as RouteKey[]).flatMap((k) => (['es', 'en'] as Lang[]).map((l) => ({ key: k, lang: l, path: ROUTES[k][l] })));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function head(key: RouteKey, lang: Lang) {
  const m = META[key];
  const url = CONFIG.site + ROUTES[key][lang];
  const faq = key === 'home' || key === 'hotel'
    ? HOME_FAQ.map((f) => [t(f.q, lang), t(f.a, lang)])
    : ROUTES[key].landing ? LANDINGS[ROUTES[key].landing!][lang].faq : [];
  const hotel = {
    '@context': 'https://schema.org', '@type': 'Hotel', name: 'Hotel Tama Lodge', url: CONFIG.site + '/',
    image: CONFIG.site + '/assets/img/og-image.jpg', logo: CONFIG.site + '/icon-512.png',
    telephone: CONFIG.phoneDisplay, email: CONFIG.email,
    address: { '@type': 'PostalAddress', streetAddress: '75V8+M64, Avenida Central', addressLocality: 'Tamarindo', addressRegion: 'Guanacaste', addressCountry: 'CR' },
    hasMap: CONFIG.hotelMaps, sameAs: [CONFIG.instagram],
    amenityFeature: [['Outdoor pool', 'Piscina al aire libre'], ['Free Wi-Fi', 'Wi-Fi gratis'], ['Free parking', 'Estacionamiento gratis'], ['Air conditioning', 'Aire acondicionado']]
      .map(([en, es]) => ({ '@type': 'LocationFeatureSpecification', name: lang === 'es' ? es : en, value: true })),
  };
  const ld: object[] = [hotel];
  if (faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  if (key !== 'home') ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Hotel Tama Lodge', item: CONFIG.site + ROUTES.home[lang] },
    { '@type': 'ListItem', position: 2, name: t(m.title, lang).split('|')[0].trim(), item: url }] });
  return [
    `<title>${esc(t(m.title, lang))}</title>`,
    ...(key === 'review' ? ['<meta name="robots" content="noindex, follow">'] : []),
    `<meta name="description" content="${esc(t(m.desc, lang))}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="es" href="${CONFIG.site}${ROUTES[key].es}">`,
    `<link rel="alternate" hreflang="en" href="${CONFIG.site}${ROUTES[key].en}">`,
    `<link rel="alternate" hreflang="x-default" href="${CONFIG.site}${ROUTES[key].es}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Hotel Tama Lodge">`,
    `<meta property="og:title" content="${esc(t(m.title, lang))}">`,
    `<meta property="og:description" content="${esc(t(m.desc, lang))}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${CONFIG.site}${m.image}">`,
    `<meta property="og:locale" content="${lang === 'es' ? 'es_CR' : 'en_US'}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    ...ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ].join('\n  ');
}

export function render(path: string) {
  return renderToString(<App path={path} />);
}
