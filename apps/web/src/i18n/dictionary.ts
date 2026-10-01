/**
 * Diccionario de textos de interfaz (ES/EN).
 *
 * Cubre solo lo que hoy es visible con `SHOP_ENABLED = false` (ver
 * config/features.ts): Header, Footer, Home, Telas, Accesorios, El taller,
 * 404 y la pantalla de sin conexión. El resto del sitio (carrito, cuenta,
 * back-office…) sigue oculto, así que traducirlo ahora sería trabajo
 * perdido — se hace cuando esa fase se reactive.
 *
 * Tampoco traduce el CONTENIDO (nombres y descripciones de telas/trajes/
 * accesorios: viene de `src/mocks/data.ts`, son datos, no texto de interfaz).
 *
 * `Dictionary` es una interfaz explícita (no `typeof es`) a propósito: así
 * TypeScript exige que `en` tenga exactamente las mismas claves que `es` — si
 * falta traducir algo nuevo, no compila.
 */

interface Dictionary {
  header: {
    navFabrics: string;
    navAccessories: string;
    navAbout: string;
    bookAppointment: string;
    themeToLight: string;
    themeToDark: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    pitch: string;
    hours: string;
    bookAppointment: string;
    whatsapp: string;
    columnStore: string;
    columnFabrics: string;
    columnAccessories: string;
    columnHouse: string;
    columnAbout: string;
    legalRights: (year: number) => string;
    legalCraft: string;
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroTitleAccent: string;
    heroText: string;
    inPersonAppointment: string;
    virtualAppointment: string;
    features: Array<{ title: string; text: string }>;
    statsYearsLabel: string;
    statsSuitsLabel: string;
    statsFabricsLabel: string;
    journeyEyebrow: string;
    journeyTitle: string;
    journeyDescription: string;
    journeyAriaLabel: string;
    journeySteps: Array<{ label: string; description: string; detail: string }>;
    craftEyebrow: string;
    craftTitle: string;
    craftItems: Array<{ title: string; text: string }>;
    igEyebrow: string;
    igTitle: string;
    igDescription: string;
    igAlts: string[];
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
  };
  fabrics: {
    eyebrow: string;
    title: string;
    description: string;
    viewInPerson: string;
    tabAll: string;
    categoriesAriaLabel: string;
    errorTitle: string;
    errorDescription: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  accessories: {
    eyebrow: string;
    title: string;
    description: string;
    tabAll: string;
    categoriesAriaLabel: string;
    errorTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    addedToastTitle: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    tailorTitle: string;
    tailorText: string;
    tailorImgMainAlt: string;
    tailorImgSmallAlt1: string;
    tailorImgSmallAlt2: string;
    stageLabel: (index: number) => string;
    steps: Array<{ title: string; text: string }>;
    visitTitle: string;
    visitText: string;
    visitButton: string;
  };
  notFound: {
    title: string;
    description: string;
    button: string;
    illustrationAlt: string;
  };
  offline: {
    title: string;
    text: string;
    hint: string;
  };
  pageLoader: {
    text: string;
    label: string;
  };
  language: {
    switchToEnglish: string;
    switchToSpanish: string;
  };
}

const es: Dictionary = {
  header: {
    navFabrics: 'Telas',
    navAccessories: 'Accesorios',
    navAbout: 'El taller',
    bookAppointment: 'Agendar una cita',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  footer: {
    pitch: 'Trajes cortados a mano, uno cada vez. Desde 1998 en la Ciudad de Guatemala.',
    hours: 'Lun a sáb · 9:00 – 18:00',
    bookAppointment: 'Agendar una cita',
    whatsapp: 'Escríbenos por WhatsApp',
    columnStore: 'Tienda',
    columnFabrics: 'Muestrario de telas',
    columnAccessories: 'Accesorios',
    columnHouse: 'La casa',
    columnAbout: 'El taller',
    legalRights: (year) => `© ${year} Real Elegance. Todos los derechos reservados.`,
    legalCraft: 'Cosido a mano, también el código.',
  },
  home: {
    heroEyebrow: 'Sastrería artesanal · Guatemala',
    heroTitle: 'Un traje que no se parece a ningún otro',
    heroTitleAccent: 'porque no lo es.',
    heroText:
      'Elegimos juntos el modelo, la tela y cada detalle, y lo cortamos a mano sobre tus medidas. Agenda tu cita, presencial o por videollamada.',
    inPersonAppointment: 'Cita presencial',
    virtualAppointment: 'Cita virtual',
    features: [
      { title: 'Hecho a medida', text: 'Ajuste perfecto para ti' },
      { title: '100% artesanal', text: 'Hecho a mano, puntada a puntada' },
      { title: 'Telas premium', text: 'Selección de las mejores telas' },
      { title: 'Garantía de calidad', text: 'Satisfacción garantizada' },
    ],
    statsYearsLabel: 'Años cosiendo',
    statsSuitsLabel: 'Trajes entregados',
    statsFabricsLabel: 'Telas en muestrario',
    journeyEyebrow: 'Cómo funciona',
    journeyTitle: 'De la idea al armario, en ocho pasos',
    journeyDescription: 'Sabes en todo momento dónde está tu traje y qué falta para tenerlo.',
    journeyAriaLabel: 'Proceso de encargo de un traje',
    journeySteps: [
      {
        label: 'Explorar',
        description: 'Elige el modelo que te representa',
        detail:
          'Navega el catálogo o escríbenos directamente — te ayudamos a encontrar el corte, la tela y el estilo que va contigo antes de agendar nada.',
      },
      {
        label: 'Personalizar',
        description: 'Tela, solapa, forro y botones',
        detail:
          'Elige la tela, la solapa, el forro y los botones. Cada elección cambia el precio en el momento, sin sorpresas al final.',
      },
      {
        label: 'Cotizar',
        description: 'Precio cerrado, sin sorpresas',
        detail:
          'Con el modelo definido te damos un precio cerrado por escrito, antes de pedirte ningún anticipo.',
      },
      {
        label: 'Agendar',
        description: 'Reservas tu cita en el taller',
        detail:
          'Reservas tu cita — presencial en el taller o por videollamada — para la toma de medidas.',
      },
      {
        label: 'Medidas',
        description: 'Te tomamos medidas y dejas el anticipo',
        detail:
          'Tomamos las medidas y dejamos anotadas las particularidades de tu cuerpo. Ahí también dejas el 50% de anticipo.',
      },
      {
        label: 'Confirmado',
        description: 'Tu pedido entra al taller',
        detail:
          'Tu pedido entra oficialmente a la cola del taller — podrás seguir su avance desde tu cuenta en cuanto esa parte esté activa.',
      },
      {
        label: 'Confección',
        description: 'Corte, costura y pruebas',
        detail:
          'Corte a mano sobre tu patrón, costura y dos pruebas para afinar el ajuste antes de rematar.',
      },
      {
        label: 'Entrega',
        description: 'Pagas el saldo y te lo llevas',
        detail:
          'Pagas el saldo restante y te llevas el traje terminado — o coordinamos el envío si lo prefieres.',
      },
    ],
    craftEyebrow: 'Por qué a medida',
    craftTitle: 'Lo que cambia cuando algo se hace despacio',
    craftItems: [
      {
        title: 'Cortado a mano',
        text: 'Cada patrón se traza sobre tus medidas. Nada de tallas estándar retocadas.',
      },
      {
        title: 'Telas con nombre',
        text: 'Lanas Súper 110 a 130, linos irlandeses y tweeds Donegal. Sabemos de dónde viene cada metro.',
      },
      {
        title: 'Pruebas incluidas',
        text: 'Ajustamos hasta que la chaqueta caiga como debe. Sin coste adicional.',
      },
      {
        title: 'Seguimiento en línea',
        text: 'Mira en qué etapa está tu traje —corte, confección, prueba— desde tu cuenta.',
      },
    ],
    igEyebrow: '@realelegance',
    igTitle: 'Síguenos en Instagram',
    igDescription: 'Consejos de sastrería y un vistazo al taller, publicados cada semana.',
    igAlts: [
      'El color: por qué el azul marino es la elección más segura',
      'El entalle: los hombros limpios y la silueta que sigue el cuerpo',
      'La tela: lana al 100% o mezclas de alta calidad',
      'Tu primer traje bien confeccionado',
    ],
    ctaTitle: '¿Listo para tu próximo traje?',
    ctaText: 'Elige día y hora para tu cita en el taller — virtual o presencial, sin trámites, sin cuenta.',
    ctaButton: 'Agendar una cita',
  },
  fabrics: {
    eyebrow: 'Muestrario',
    title: 'Telas de la casa',
    description:
      'Lanas frías para el trópico, linos irlandeses y tweeds tejidos en telar. Todas se pueden ver y tocar en el taller antes de decidir.',
    viewInPerson: 'Ver el muestrario en persona',
    tabAll: 'Todas',
    categoriesAriaLabel: 'Categorías de tela',
    errorTitle: 'No pudimos cargar el muestrario',
    errorDescription: 'Vuelve a intentarlo en un momento.',
    emptyTitle: 'No hay telas en esta categoría',
    emptyDescription: 'Prueba con otra o escríbenos: solemos conseguir piezas por encargo.',
  },
  accessories: {
    eyebrow: 'Listo para llevar',
    title: 'Accesorios',
    description: 'Corbatas, pañuelos y camisas que rematan un traje. Se pagan completos y se envían de inmediato.',
    tabAll: 'Todos',
    categoriesAriaLabel: 'Categorías de accesorios',
    errorTitle: 'No pudimos cargar los accesorios',
    emptyTitle: 'Nada por aquí todavía',
    emptyDescription: 'Prueba con otra categoría.',
    addedToastTitle: 'Añadido al carrito',
  },
  about: {
    eyebrow: 'Desde 1998',
    title: 'El taller',
    description:
      'Real Elegance es una sastrería pequeña y deliberadamente lenta. Tres personas, un cuarto lleno de telas y la convicción de que un traje se hace una vez y se lleva veinte años.',
    tailorTitle: 'El sastre',
    tailorText:
      'Cada traje que sale del taller pasa por las mismas manos que lo empezaron hace más de veinticinco años. No delegamos el corte ni las pruebas: es la única forma que conocemos de sostener la calidad.',
    tailorImgMainAlt: 'El sastre de Real Elegance en el taller',
    tailorImgSmallAlt1: 'El sastre con un saco a medida, apoyado en un pasillo del taller',
    tailorImgSmallAlt2: 'Detalle de los botones de manga de un saco a medida',
    stageLabel: (index) => `Etapa ${index}`,
    steps: [
      {
        title: 'Medidas',
        text: 'Veintidós medidas y las observaciones que no caben en un número: un hombro más bajo, la costumbre de llevar el reloj a la derecha.',
      },
      {
        title: 'Corte',
        text: 'El patrón se traza y se corta a mano sobre la tela. Es el paso que no admite prisa ni segunda oportunidad.',
      },
      {
        title: 'Confección',
        text: 'Entretela cosida, hombros montados uno a uno y ojales rematados a mano.',
      },
      {
        title: 'Prueba y entrega',
        text: 'Dos pruebas para afinar el ajuste. Y si algo no cae bien seis meses después, se corrige.',
      },
    ],
    visitTitle: 'Ven a vernos',
    visitText:
      'Estamos en la zona 10 de la Ciudad de Guatemala, de lunes a sábado de 9:00 a 18:00. Puedes pasar sin cita para ver telas, pero para tomar medidas conviene reservar.',
    visitButton: 'Agendar una visita',
  },
  notFound: {
    title: 'Esta página se descosió',
    description: 'La dirección que buscas no existe o cambió de sitio.',
    button: 'Ir a inicio',
    illustrationAlt: 'Carrete de hilo con el hilo roto formando «404»',
  },
  offline: {
    title: 'Sin conexión a internet',
    text: 'No se puede llegar a Real Elegance ahora mismo. Revisa tu wifi o tus datos móviles.',
    hint: 'Esto se cierra solo en cuanto vuelva la señal.',
  },
  pageLoader: {
    text: 'Un momento…',
    label: 'Cargando la página',
  },
  language: {
    switchToEnglish: 'Ver en inglés',
    switchToSpanish: 'Ver en español',
  },
};

const en: Dictionary = {
  header: {
    navFabrics: 'Fabrics',
    navAccessories: 'Accessories',
    navAbout: 'The workshop',
    bookAppointment: 'Book an appointment',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  footer: {
    pitch: 'Suits cut by hand, one at a time. In Guatemala City since 1998.',
    hours: 'Mon–Sat · 9:00 AM – 6:00 PM',
    bookAppointment: 'Book an appointment',
    whatsapp: 'Message us on WhatsApp',
    columnStore: 'Shop',
    columnFabrics: 'Fabric swatches',
    columnAccessories: 'Accessories',
    columnHouse: 'The house',
    columnAbout: 'The workshop',
    legalRights: (year) => `© ${year} Real Elegance. All rights reserved.`,
    legalCraft: 'Hand-stitched — the code too.',
  },
  home: {
    heroEyebrow: 'Artisan tailoring · Guatemala',
    heroTitle: "A suit that doesn't look like any other,",
    heroTitleAccent: "because it isn't.",
    heroText:
      "We choose the model, the fabric, and every detail together, then cut it by hand to your measurements. Book your appointment, in person or by video call.",
    inPersonAppointment: 'In-person visit',
    virtualAppointment: 'Video call',
    features: [
      { title: 'Made to measure', text: 'A perfect fit for you' },
      { title: '100% handcrafted', text: 'Hand-sewn, stitch by stitch' },
      { title: 'Premium fabrics', text: 'A selection of the finest cloth' },
      { title: 'Quality guarantee', text: 'Satisfaction guaranteed' },
    ],
    statsYearsLabel: 'Years sewing',
    statsSuitsLabel: 'Suits delivered',
    statsFabricsLabel: 'Fabrics in stock',
    journeyEyebrow: 'How it works',
    journeyTitle: 'From idea to wardrobe, in eight steps',
    journeyDescription: 'You always know exactly where your suit is and what it still needs.',
    journeyAriaLabel: 'Suit-ordering process',
    journeySteps: [
      {
        label: 'Explore',
        description: 'Choose the model that represents you',
        detail:
          "Browse the catalog or just message us — we'll help you find the cut, fabric and style that suits you before you even book anything.",
      },
      {
        label: 'Customize',
        description: 'Fabric, lapel, lining and buttons',
        detail:
          'Choose the fabric, lapel, lining and buttons. Each choice updates the price right away — no surprises at the end.',
      },
      {
        label: 'Quote',
        description: 'A closed price, no surprises',
        detail:
          'Once the model is set, we give you a closed price in writing, before asking for any deposit.',
      },
      {
        label: 'Book',
        description: 'Reserve your visit to the workshop',
        detail:
          'You book your visit — in person at the workshop or by video call — for the measurements.',
      },
      {
        label: 'Measurements',
        description: 'We take your measurements and you leave a deposit',
        detail:
          "We take your measurements and note down the particulars of your build. That's also when you leave the 50% deposit.",
      },
      {
        label: 'Confirmed',
        description: 'Your order enters the workshop',
        detail:
          "Your order officially enters the workshop queue — you'll be able to follow its progress from your account once that part goes live.",
      },
      {
        label: 'Tailoring',
        description: 'Cutting, sewing and fittings',
        detail:
          'Hand-cut from your own pattern, sewn, and two fittings to fine-tune the fit before finishing.',
      },
      {
        label: 'Delivery',
        description: 'You pay the balance and take it home',
        detail:
          "You pay the remaining balance and take the finished suit home — or we arrange delivery if you'd rather.",
      },
    ],
    craftEyebrow: 'Why made to measure',
    craftTitle: 'What changes when something is made slowly',
    craftItems: [
      {
        title: 'Hand-cut',
        text: 'Every pattern is drafted to your own measurements. No retouched standard sizes.',
      },
      {
        title: 'Fabrics with a name',
        text: "Super 110s to 130s wool, Irish linen and Donegal tweed. We know where every meter comes from.",
      },
      {
        title: 'Fittings included',
        text: 'We adjust it until the jacket falls exactly right. No extra cost.',
      },
      {
        title: 'Online tracking',
        text: 'See what stage your suit is at —cutting, sewing, fitting— right from your account.',
      },
    ],
    igEyebrow: '@realelegance',
    igTitle: 'Follow us on Instagram',
    igDescription: 'Tailoring tips and a look inside the workshop, posted every week.',
    igAlts: [
      'Color: why navy is the safest choice',
      'Fit: clean shoulders and a silhouette that follows the body',
      'Fabric: 100% wool or premium blends',
      'Your first well-made suit',
    ],
    ctaTitle: 'Ready for your next suit?',
    ctaText: 'Pick a day and time for your visit to the workshop — video call or in person, no paperwork, no account.',
    ctaButton: 'Book an appointment',
  },
  fabrics: {
    eyebrow: 'Swatches',
    title: 'Fabrics of the house',
    description:
      'Cool wools for the tropics, Irish linens and loom-woven tweeds. All of them can be seen and touched at the workshop before you decide.',
    viewInPerson: 'See the swatches in person',
    tabAll: 'All',
    categoriesAriaLabel: 'Fabric categories',
    errorTitle: "We couldn't load the swatches",
    errorDescription: 'Please try again in a moment.',
    emptyTitle: 'No fabrics in this category',
    emptyDescription: 'Try another one, or write to us — we often source pieces on request.',
  },
  accessories: {
    eyebrow: 'Ready to wear',
    title: 'Accessories',
    description: 'Ties, pocket squares and shirts that finish off a suit. Paid in full and shipped right away.',
    tabAll: 'All',
    categoriesAriaLabel: 'Accessory categories',
    errorTitle: "We couldn't load the accessories",
    emptyTitle: 'Nothing here yet',
    emptyDescription: 'Try another category.',
    addedToastTitle: 'Added to cart',
  },
  about: {
    eyebrow: 'Since 1998',
    title: 'The workshop',
    description:
      'Real Elegance is a small, deliberately slow tailor shop. Three people, a room full of fabric, and the conviction that a suit is made once and worn for twenty years.',
    tailorTitle: 'The tailor',
    tailorText:
      'Every suit that leaves the workshop passes through the same hands that started it more than twenty-five years ago. We never outsource the cutting or the fittings — it is the only way we know to keep the quality up.',
    tailorImgMainAlt: 'The Real Elegance tailor at the workshop',
    tailorImgSmallAlt1: 'The tailor wearing a made-to-measure jacket, in a workshop hallway',
    tailorImgSmallAlt2: 'Detail of the sleeve buttons on a made-to-measure jacket',
    stageLabel: (index) => `Stage ${index}`,
    steps: [
      {
        title: 'Measurements',
        text: "Twenty-two measurements, plus the notes that don't fit in a number: one shoulder lower than the other, a habit of wearing the watch on the right wrist.",
      },
      {
        title: 'Cutting',
        text: 'The pattern is drafted and cut by hand straight onto the fabric. The one step that allows no rush and no second try.',
      },
      {
        title: 'Sewing',
        text: 'Canvas hand-stitched in, shoulders set one at a time, buttonholes finished by hand.',
      },
      {
        title: 'Fitting & delivery',
        text: "Two fittings to fine-tune the fit. And if something feels off six months later, we fix it.",
      },
    ],
    visitTitle: 'Come see us',
    visitText:
      'We are in zone 10 of Guatemala City, Monday to Saturday from 9:00 AM to 6:00 PM. Drop by anytime to see fabric — but for measurements, it is best to book ahead.',
    visitButton: 'Book a visit',
  },
  notFound: {
    title: 'This page came unstitched',
    description: "The address you're looking for doesn't exist or has moved.",
    button: 'Go home',
    illustrationAlt: 'A spool of thread with the broken thread spelling out "404"',
  },
  offline: {
    title: 'No internet connection',
    text: "Real Elegance can't be reached right now. Check your wifi or mobile data.",
    hint: 'This closes on its own as soon as the connection is back.',
  },
  pageLoader: {
    text: 'One moment…',
    label: 'Loading the page',
  },
  language: {
    switchToEnglish: 'View in English',
    switchToSpanish: 'View in Spanish',
  },
};

export type Language = 'es' | 'en';
export const dictionaries: Record<Language, Dictionary> = { es, en };
