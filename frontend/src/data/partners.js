const partners = [
    {
    slug: 'air-tanzania',
    name: 'Air Tanzania',
    logo: '/images/partners/air-tanzania.png',
    tagline: 'The Wings of Kilimanjaro',
    description:
      'Air Tanzania is the national carrier of Tanzania, offering flights to key destinations across Africa and beyond. As the gateway to Tanzania\'s legendary safari circuits — Serengeti, Ngorongoro, and Zanzibar — Air Tanzania is an essential partner for travellers seeking authentic Tanzanian experiences.',
    highlights: ['Tanzania Gateway', 'Serengeti Access', 'Zanzibar Flights', 'National Carrier'],
    website: 'https://www.airtanzania.co.tz',
    category: 'Airline',
  },
    {
    slug: 'flightlink',
    name: 'Flightlink',
    logo: '/images/partners/flightlink.png',
    tagline: 'Dreams Delivered',
    description:
      'Flightlink is a Tanzania-based airline founded in 2004, providing domestic and regional scheduled flights, air charters, and medevac services across Tanzania and Kenya. With a focus on connecting safari destinations and the Zanzibar archipelago, Flightlink is a key partner for reaching Tanzania\'s most remote and breathtaking locations.',
    highlights: ['Tanzania Domestic Flights', 'Safari Connections', 'Zanzibar Routes', 'Air Charters'],
    website: 'https://flightlink.co.tz',
    category: 'Airline',
  },
  {
    slug: 'auric-air',
    name: 'Auric Air',
    logo: '/images/partners/auric-air.png',
    tagline: 'Tanzania\'s Premier Safari Carrier',
    description:
      'Auric Air Services Limited is a privately owned Tanzanian airline founded in 2001, recognized as Tanzania\'s Premier Safari Carrier. Having won the World Travel Awards as Tanzania\'s Leading Domestic Safari Carrier for nearly a decade, Auric Air operates scheduled flights to 42+ destinations within East Africa using Cessna Caravans, Dash 8s, and Pilatus PC-12s.',
    highlights: ['World Travel Awards Winner', '42+ Destinations', 'Safari Specialist', 'Charter Services'],
    website: 'https://www.auricair.com',
    category: 'Airline',
  },
    {
    slug: 'kenya-airways',
    name: 'Kenya Airways',
    logo: '/images/partners/kenya-airways.png',
    tagline: 'The Pride of Africa',
    description:
      'Kenya Airways, Africa\'s premier airline, offers direct flights connecting Nairobi to the world. As the flag carrier of Kenya, it provides unmatched access to East Africa\'s safari destinations, coastal retreats, and business hubs — making it an ideal partner for seamless African travel.',
    highlights: ['Direct Safari Connections', 'Nairobi Hub', 'East Africa Network', 'SkyTeam Alliance'],
    website: 'https://www.kenya-airways.com',
    category: 'Airline',
  },
    {
    slug: 'south-african-airways',
    name: 'South African Airways',
    logo: '/images/partners/south-african-airways.png',
    tagline: 'The Wings of Africa',
    description:
      'South African Airways is the continent\'s oldest airline, with a rich heritage of connecting Africa to the world. Operating from OR Tambo International in Johannesburg, SAA provides essential links to Southern Africa\'s most iconic destinations — from Cape Town to the Kruger National Park.',
    highlights: ['Heritage Carrier', 'Johannesburg Hub', 'Southern Africa Routes', 'African Excellence'],
    website: 'https://www.flysaa.com',
    category: 'Airline',
  },
  {
    slug: 'emirates',
    name: 'Emirates',
    logo: '/images/partners/emirates.png',
    tagline: 'Fly Better',
    description:
      'Emirates connects travellers from over 140 destinations to Africa via its world-class hub in Dubai. With premium cabins, award-winning in-flight service, and extensive connectivity across East and Southern Africa, Emirates is a cornerstone of Zeno Africa Adventures\' luxury travel experience.',
    highlights: ['First Class Suites', 'Global Network', 'Award-Winning Service', 'Dubai Hub Connectivity'],
    website: 'https://www.emirates.com',
    category: 'Airline',
  },

  {
    slug: 'ethiopian-airlines',
    name: 'Ethiopian Airlines',
    logo: '/images/partners/ethiopian-airlines.png',
    tagline: 'The New Spirit of Africa',
    description:
      'Ethiopian Airlines is Africa\'s largest and most profitable carrier, serving over 130 destinations worldwide. With its Addis Ababa hub, it provides vital connections across the continent, making it the backbone of intra-Africa travel for safari-goers, business travellers, and explorers alike.',
    highlights: ['Africa\'s Largest Carrier', 'Addis Ababa Hub', 'Pan-African Network', 'Star Alliance Member'],
    website: 'https://www.ethiopianairlines.com',
    category: 'Airline',
  },
  {
    slug: 'qatar-airways',
    name: 'Qatar Airways',
    logo: '/images/partners/qatar-airways.png',
    tagline: 'Going Places Together',
    description:
      'Qatar Airways consistently ranks among the world\'s best airlines, offering luxurious travel through its Doha hub. With extensive routes into Africa and a commitment to 5-star service, Qatar Airways ensures that the journey to your African adventure is as extraordinary as the destination itself.',
    highlights: ['5-Star Airline', 'Doha Hub', 'QSuite Business Class', 'Africa Route Expansion'],
    website: 'https://www.qatarairways.com',
    category: 'Airline',
  },

];

export default partners;

export function getPartnerBySlug(slug) {
  return partners.find((p) => p.slug === slug) || null;
}
