import { Layout } from './components/Layout';
import { CtaBand, Destinations, Experiences, Faq, FullBleed, HeroSlider, Intro, Location, PageHero, Related, Rooms, Story, Testimonials } from './components/Sections';
import { HOME_FAQ, LANDINGS, ROUTES, WA_MSG, resolve, t, waUrl, type Lang, type RouteKey } from './data/site';
import { useBooking } from './booking';
import { Arrow } from './components/Icons';

const STRIP = (l: Lang) => [
  { src: '/assets/img/flamingo-limpia.webp', alt: l === 'es' ? 'Jardín tropical frente al mar en Guanacaste' : 'Tropical garden by the sea in Guanacaste' },
  { src: '/assets/img/mariposa.webp', alt: l === 'es' ? 'Mariposa en el jardín de Tama Lodge' : 'Butterfly in the Tama Lodge garden' },
  { src: '/assets/img/atardecer-limpia.webp', alt: l === 'es' ? 'Atardecer en Playa Tamarindo' : 'Sunset at Playa Tamarindo' },
  { src: '/assets/img/playa-grande-limpia.webp', alt: 'Playa Grande, Costa Rica' },
  { src: '/assets/img/cabalgata.webp', alt: l === 'es' ? 'Cabalgata por la playa' : 'Horseback riding on the beach' },
  { src: '/assets/img/tamarindo-panorama.webp', alt: l === 'es' ? 'Bahía de Tamarindo' : 'Tamarindo bay' },
];

function BookButtons({ lang, wa }: { lang: Lang; wa: string }) {
  const b = useBooking();
  return (
    <div className="btns">
      <a className="btn" href={b.url}>{lang === 'es' ? 'Ver disponibilidad y precios' : 'See availability & rates'} <Arrow /></a>
      <a className="btn btn--line" href={waUrl(t(WA_MSG[wa] ?? WA_MSG.general, lang))} target="_blank" rel="noopener">{lang === 'es' ? 'Escríbenos por WhatsApp' : 'Message us on WhatsApp'}</a>
    </div>
  );
}

function Home({ lang }: { lang: Lang }) {
  const es = lang === 'es';
  return (
    <>
      <HeroSlider lang={lang} kicker={{ es: 'Hotel en Tamarindo · Guanacaste, Costa Rica', en: 'Hotel in Tamarindo · Guanacaste, Costa Rica' }} slides={[
        { img: '/assets/img/tamarindo-hero.webp', pos: 'center 55%', title: { es: 'Vive Tamarindo\na tu ritmo', en: 'Live Tamarindo\nat your own pace' } },
        { img: '/assets/img/cabalgata.webp', pos: 'center 45%', title: { es: 'Pura vida\nen Guanacaste', en: 'Pura vida\nin Guanacaste' } },
        { img: '/assets/img/playa-grande-limpia.webp', pos: 'center 55%', title: { es: 'Olas, sol\ny atardeceres', en: 'Waves, sun\nand sunsets' } },
      ]} />
      <Intro lang={lang} kicker={es ? 'Bienvenido a Tama Lodge' : 'Welcome to Tama Lodge'} title={es ? 'Tu refugio tropical en Tamarindo' : 'Your tropical hideaway in Tamarindo'}
        text={es ? 'Despierta junto a la piscina, llega a la playa en minutos y vive el auténtico pura vida. Habitaciones con aire acondicionado, jardín tropical, Wi‑Fi y parqueo gratis, a 5 minutos de Playa Tamarindo y a 1 km del mercado nocturno.' : 'Wake up by the pool, reach the beach in minutes and live the real pura vida. Air-conditioned rooms, a tropical garden, free Wi‑Fi and parking, 5 minutes from Playa Tamarindo and 1 km from the night market.'}
        more={{ href: ROUTES.hotel[lang], label: es ? 'Conoce el hotel' : 'Discover the hotel' }} images={STRIP(lang)} />
      <Rooms lang={lang} />
      <Destinations lang={lang} />
      <FullBleed img="/assets/img/playa-grande-limpia.webp" pos="center 60%" kicker={es ? 'Surf en Tamarindo' : 'Surf in Tamarindo'} title={es ? 'Olas para aprender, olas para progresar' : 'Waves to learn on, waves to progress on'}
        text={es ? 'Tamarindo es una de las playas más populares de Costa Rica para tomar tu primera clase. Playa Grande, a 20 km, espera a los que buscan más.' : "Tamarindo is one of Costa Rica's most popular beaches for your first lesson. Playa Grande, 20 km away, awaits those who want more."}
        cta={{ href: ROUTES.surf[lang], label: es ? 'Surf en Tamarindo' : 'Surf in Tamarindo' }} />
      <Experiences lang={lang} />
      <Testimonials lang={lang} />
      <Location lang={lang} />
      <Faq lang={lang} title={es ? 'Todo lo que necesitas saber antes de reservar' : 'Everything you need to know before booking'} items={HOME_FAQ.map((f) => ({ q: t(f.q, lang), a: t(f.a, lang) }))} />
      <CtaBand lang={lang} title={es ? 'Tu escapada a Tamarindo empieza aquí' : 'Your Tamarindo getaway starts here'} />
    </>
  );
}

function Hotel({ lang }: { lang: Lang }) {
  const es = lang === 'es';
  return (
    <>
      <PageHero lang={lang} img="/assets/img/cabalgata.webp" pos="center 45%" crumb={es ? 'El hotel' : 'The hotel'} title="Hotel Tama Lodge"
        sub={es ? 'Tu hotel en Tamarindo, Guanacaste: piscina, jardín tropical, habitaciones con aire acondicionado y la playa a 5 minutos.' : 'Your hotel in Tamarindo, Guanacaste: pool, tropical garden, air-conditioned rooms and the beach 5 minutes away.'} />
      <Story kicker={es ? '01 · El lodge' : '01 · The lodge'} title={es ? 'Madera, color y brisa del Pacífico' : 'Wood, color and a Pacific breeze'}
        paras={[es ? 'Habitaciones con aire acondicionado, baño privado y vista a la piscina, rodeadas de un jardín lleno de plantas tropicales. Wi‑Fi gratis, estacionamiento y servicio de lavandería para que solo pienses en disfrutar.' : 'Air-conditioned rooms with private bathrooms and pool views, surrounded by a garden full of tropical plants. Free Wi‑Fi, parking and laundry service, so all you have to think about is enjoying yourself.']}
        imgs={[{ src: '/assets/img/flamingo-limpia.webp', alt: es ? 'Jardín tropical' : 'Tropical garden' }, { src: '/assets/img/mariposa.webp', alt: es ? 'Mariposa en el jardín' : 'Butterfly in the garden' }]}>
        <BookButtons lang={lang} wa="rooms" />
      </Story>
      <Story reverse kicker={es ? '02 · Comunidad' : '02 · Community'} title={es ? 'Llegas como huésped, te vas como amigo' : 'Arrive as a guest, leave as a friend'}
        paras={[es ? 'Torneos de ping pong, clases de natación y viajeros de todo el mundo. Ideal para nómadas digitales y estancias largas: trabaja de día, mira el atardecer en la playa de noche.' : 'Ping pong tournaments, swimming lessons and travelers from all over the world. Ideal for digital nomads and long stays: work by day, catch the sunset on the beach by night.']}
        imgs={[{ src: '/assets/img/atardecer-limpia.webp', alt: es ? 'Atardecer en Tamarindo' : 'Sunset in Tamarindo' }, { src: '/assets/img/cabalgata.webp', alt: es ? 'Cabalgata por la playa' : 'Horseback riding on the beach' }]}>
        <BookButtons lang={lang} wa="longstay" />
      </Story>
      <Rooms lang={lang} />
      <Experiences lang={lang} exclude="hotel" />
      <Testimonials lang={lang} />
      <Faq lang={lang} title={es ? 'Todo lo que necesitas saber' : 'Everything you need to know'} items={HOME_FAQ.map((f) => ({ q: t(f.q, lang), a: t(f.a, lang) }))} />
      <CtaBand lang={lang} title={es ? 'Tu escapada a Tamarindo empieza aquí' : 'Your Tamarindo getaway starts here'} />
      <Related lang={lang} exclude="hotel" />
    </>
  );
}

function Zona({ lang }: { lang: Lang }) {
  const es = lang === 'es';
  return (
    <>
      <PageHero lang={lang} img="/assets/img/tamarindo-hero.webp" pos="center 40%" crumb={es ? 'La zona' : 'The area'} title="Playa Tamarindo"
        sub={es ? 'A solo 5 minutos de Hotel Tama Lodge, en Guanacaste, Costa Rica.' : 'Just 5 minutes from Hotel Tama Lodge, in Guanacaste, Costa Rica.'} />
      <Story kicker={es ? 'La playa' : 'The beach'} title={es ? 'Arena blanca, olas y montañas' : 'White sand, waves and mountains'}
        paras={es ? ['Playa Tamarindo ofrece arena blanca, grandes olas para surfear e increíbles vistas rodeadas de montañas. Aquí podrá sentarse y relajarse bajo los árboles, caminar o disfrutar de uno de los atardeceres más bonitos del Pacífico.', 'Es el lugar ideal para tomar clases de surf, salir a pescar, hacer snorkel o simplemente terminar el día con los pies en la arena. Restaurantes, tiendas y el mercado nocturno quedan a pocos minutos.']
          : ['Playa Tamarindo offers white sand, big surfing waves and incredible views surrounded by mountains. Here you can sit and relax under the trees, take a walk or enjoy one of the most beautiful sunsets on the Pacific.', "It's the perfect place for surf lessons, fishing trips, snorkeling or simply ending the day with your feet in the sand. Restaurants, shops and the night market are just minutes away."]}
        imgs={[{ src: '/assets/img/playa-grande-limpia.webp', alt: 'Playa Grande' }, { src: '/assets/img/atardecer-limpia.webp', alt: es ? 'Atardecer en Playa Tamarindo' : 'Sunset at Playa Tamarindo' }]}>
        <BookButtons lang={lang} wa="directions" />
      </Story>
      <Location lang={lang} kicker={es ? 'Cómo llegar' : 'Getting here'} title={es ? 'Distancias desde el hotel' : 'Distances from the hotel'} />
      <Destinations lang={lang} />
      <Experiences lang={lang} exclude="zona" />
      <CtaBand lang={lang} title={es ? 'Hospédate a solo 5 minutos de Playa Tamarindo' : 'Stay just 5 minutes from Playa Tamarindo'} />
      <Related lang={lang} exclude="zona" />
    </>
  );
}

function LandingPage({ lang, route }: { lang: Lang; route: RouteKey }) {
  const L = LANDINGS[ROUTES[route].landing!];
  const c = L[lang];
  return (
    <>
      <PageHero lang={lang} img={`/assets/img/${L.hero}`} pos={L.pos} crumb={c.crumb} title={c.h1} sub={c.sub} />
      <Story kicker={c.k1} title={c.h2} paras={c.p} list={c.list}
        imgs={[{ src: `/assets/img/${L.img1}`, alt: c.h1 }, { src: `/assets/img/${L.img2}`, alt: 'Hotel Tama Lodge, Tamarindo' }]}>
        <BookButtons lang={lang} wa={c.wa} />
      </Story>
      {L.rooms && <Rooms lang={lang} showAll={false} title={c.h2} text={c.p[0]} />}
      {L.dest && <Destinations lang={lang} />}
      <Experiences lang={lang} exclude={route} />
      <Faq lang={lang} title={c.h1} items={c.faq.map(([q, a]) => ({ q, a }))} />
      <CtaBand lang={lang} title={lang === 'es' ? 'Tu escapada a Tamarindo empieza aquí' : 'Your Tamarindo getaway starts here'} />
      <Related lang={lang} exclude={route} />
    </>
  );
}

export default function App({ path }: { path: string }) {
  const { key, lang } = resolve(path);
  let page;
  if (key === 'home') page = <Home lang={lang} />;
  else if (key === 'hotel') page = <Hotel lang={lang} />;
  else if (key === 'zona') page = <Zona lang={lang} />;
  else page = <LandingPage lang={lang} route={key} />;
  return <Layout lang={lang} route={key}>{page}</Layout>;
}
