const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User.model');
const Package = require('../models/Package.model');
const { Hotel } = require('../models/index.models');

const packages = [
  {
    title: 'Serengeti Luxury Safari',
    subtitle: "Tanzania's Crown Jewel",
    description: 'Experience the raw magnificence of the Serengeti in unmatched luxury. Witness the Great Migration, the most spectacular wildlife event on Earth, from the comfort of your exclusive tented suite with expert guides who know every corner of the savannah.',
    shortDescription: 'Luxury safari experience in the heart of the Serengeti with private game drives and the Great Migration.',
    category: 'safari',
    tags: ['luxury', 'safari', 'wildlife', 'migration', 'tanzania'],
    location: { country: 'Tanzania', region: 'Serengeti', coordinates: { lat: -2.3333, lng: 34.8333 } },
    destinations: ['Arusha', 'Serengeti National Park', 'Ngorongoro Crater'],
    duration: { days: 7, nights: 6 },
    price: { adult: 4850, child: 2425, infant: 0, currency: 'USD' },
    originalPrice: 5800,
    depositRequired: 30,
    groupSize: { min: 2, max: 8 },
    coverImage: { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
    highlights: ['Great Migration Viewing', 'Private Game Drives', 'Luxury Tented Camp', 'Expert Naturalist Guide', 'All Meals Included', 'Hot Air Balloon Option'],
    included: ['First Class Safari Vehicle', 'Professional Tracker & Guide', 'All National Park Fees', 'Full Board Accommodation', 'Airport Transfers', 'Pre-Departure Consultation'],
    excluded: ['International Flights', 'Travel Insurance', 'Gratuities', 'Personal Expenses'],
    difficulty: 'easy',
    isFeatured: true,
    isBestSeller: true,
    badge: 'Best Seller',
    badgeColor: '#D4AF37',
    availableMonths: [1, 2, 6, 7, 8, 9, 10, 12],
    itinerary: [
      { day: 1, title: 'Arrival in Arusha', description: 'Meet and greet at Kilimanjaro International Airport. Transfer to your boutique lodge in Arusha for an orientation dinner and pre-safari briefing.', activities: ['Airport Transfer', 'Welcome Dinner', 'Safari Briefing'], meals: { breakfast: false, lunch: false, dinner: true }, accommodation: 'Arusha Serena Hotel' },
      { day: 2, title: 'Ngorongoro Crater', description: 'Descend into the world\'s largest intact caldera — a natural enclosure hosting lions, elephants, rhinos, and flamingos.', activities: ['Full Day Crater Tour', 'Picnic Lunch', 'Sundowner Cocktails'], meals: { breakfast: true, lunch: true, dinner: true }, accommodation: 'Ngorongoro Serena Lodge' },
    ],
    languages: ['English', 'Swahili', 'French'],
    startLocation: 'Kilimanjaro International Airport, Arusha',
  },
  {
    title: 'Victoria Falls & Zambezi',
    subtitle: 'The Smoke That Thunders',
    description: 'Stand at the edge of one of the world\'s greatest natural wonders. Feel the thunder of Victoria Falls and immerse yourself in the raw power of the Zambezi River with world-class adventure activities and luxury riverside accommodation.',
    shortDescription: 'Adventure and luxury at Victoria Falls with white water rafting, Devil\'s Pool swim, and sunset cruises.',
    category: 'adventure',
    tags: ['adventure', 'waterfall', 'rafting', 'zimbabwe', 'zambia'],
    location: { country: 'Zimbabwe', region: 'Matabeleland North', coordinates: { lat: -17.9243, lng: 25.8572 } },
    destinations: ['Victoria Falls Town', 'Zambezi River', 'Batoka Gorge'],
    duration: { days: 5, nights: 4 },
    price: { adult: 2950, child: 1475, infant: 0, currency: 'USD' },
    originalPrice: 3400,
    depositRequired: 30,
    groupSize: { min: 2, max: 12 },
    coverImage: { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80' },
    highlights: ["Devil's Pool Swim", 'White Water Rafting', 'Sunset Zambezi Cruise', 'Elephant Encounter', 'Bungee Jump Option', 'Luxury Riverside Lodge'],
    included: ['Luxury Lodge Accommodation', 'All Activities Listed', 'Experienced Local Guides', 'Return Airport Transfers', 'Daily Breakfast & Dinner', 'Visa on Arrival Assistance'],
    excluded: ['International Flights', 'Travel Insurance', 'Alcoholic Beverages', 'Bungee Jump (optional)'],
    difficulty: 'moderate',
    isFeatured: true,
    badge: 'Popular',
    badgeColor: '#C0392B',
    availableMonths: [5, 6, 7, 8, 9, 10],
    languages: ['English'],
    startLocation: 'Victoria Falls Airport, Zimbabwe',
  },
  {
    title: 'Cape Town & Winelands',
    subtitle: 'Where Two Oceans Meet',
    description: 'Discover the crown jewel of Africa. From the iconic Table Mountain to world-class vineyards, Cape Town offers an unmatched blend of natural wonder, cosmopolitan luxury, and world-class gastronomy.',
    shortDescription: 'Luxury Cape Town experience with Table Mountain, wine farms, Cape Peninsula, and 5-star accommodation.',
    category: 'luxury',
    tags: ['luxury', 'wine', 'city', 'beach', 'south africa'],
    location: { country: 'South Africa', region: 'Western Cape', coordinates: { lat: -33.9249, lng: 18.4241 } },
    destinations: ['Cape Town', 'Stellenbosch', 'Franschhoek', 'Cape Point'],
    duration: { days: 6, nights: 5 },
    price: { adult: 3600, child: 1800, infant: 0, currency: 'USD' },
    originalPrice: 4200,
    depositRequired: 30,
    groupSize: { min: 2, max: 6 },
    coverImage: { url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80' },
    highlights: ['Table Mountain Aerial Cableway', 'Cape Peninsula Private Tour', 'Stellenbosch Wine Tasting', 'Franschhoek Gourmet Lunch', 'Cape Point Reserve', '5-Star Hotel Suite'],
    included: ['5-Star Hotel Accommodation', 'Private Guide & Vehicle', 'Wine Farm Tours & Tastings', 'Gourmet Restaurant Reservations', 'City & Peninsula Tours', 'Daily Breakfast'],
    excluded: ['International Flights', 'Travel Insurance', 'Lunches (except Day 4)', 'Personal Expenses'],
    difficulty: 'easy',
    isFeatured: true,
    badge: 'Luxury',
    badgeColor: '#8E44AD',
    availableMonths: [1, 2, 3, 10, 11, 12],
    languages: ['English', 'Afrikaans'],
    startLocation: 'Cape Town International Airport',
  },
  {
    title: 'Rwanda Gorilla Trek',
    subtitle: 'Face to Face with Giants',
    description: 'One of Africa\'s most profound wildlife encounters. Trek through mist-covered volcanic rainforests to spend an unforgettable hour with a family of wild mountain gorillas — an experience that will stay with you forever.',
    shortDescription: 'Rare mountain gorilla trekking experience in Rwanda\'s Volcanoes National Park with luxury lodge stays.',
    category: 'wildlife',
    tags: ['gorilla', 'wildlife', 'trekking', 'rwanda', 'conservation'],
    location: { country: 'Rwanda', region: 'Northern Province', coordinates: { lat: -1.4964, lng: 29.5347 } },
    destinations: ['Kigali', 'Volcanoes National Park', 'Musanze'],
    duration: { days: 5, nights: 4 },
    price: { adult: 4100, child: 0, infant: 0, currency: 'USD' },
    originalPrice: 4800,
    depositRequired: 40,
    groupSize: { min: 2, max: 8 },
    coverImage: { url: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800&q=80' },
    highlights: ['Mountain Gorilla Encounter', 'Volcanoes National Park', 'Golden Monkey Trekking', 'Kigali City Tour', 'Community Village Visit', 'Luxury Lodge'],
    included: ['Gorilla Trekking Permit ($1,500)', 'Expert Ranger & Guide', 'Luxury Lodge Stays', 'Airport Transfers', 'All Park Fees', 'Pre-Trek Briefing'],
    excluded: ['International Flights', 'Travel Insurance', 'Kigali Hotel Night', 'Personal Expenses'],
    difficulty: 'moderate',
    isFeatured: false,
    badge: 'Unique',
    badgeColor: '#27AE60',
    minAge: 15,
    availableMonths: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12],
    languages: ['English', 'French', 'Kinyarwanda'],
    startLocation: 'Kigali International Airport',
  },
];

const hotels = [
  { name: 'Serengeti Serena Lodge', category: 'lodge', stars: 5, location: { country: 'Tanzania', region: 'Serengeti', city: 'Serengeti National Park', address: 'Inside Serengeti NP' }, amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Game Drives', 'Wi-Fi'], coverImage: { url: 'https://images.unsplash.com/photo-1504173010664-32509107de1c?w=800&q=80' }, priceRange: { min: 650, max: 1200, currency: 'USD' }, isFeatured: true, isActive: true, averageRating: 4.9 },
  { name: 'The Oyster Box', category: 'hotel', stars: 5, location: { country: 'South Africa', region: 'KwaZulu-Natal', city: 'Umhlanga' }, amenities: ['Ocean Pool', 'Spa', 'Fine Dining', 'Beach Access', 'Butler Service'], coverImage: { url: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f3a?w=800&q=80' }, priceRange: { min: 450, max: 900, currency: 'USD' }, isFeatured: true, isActive: true, averageRating: 4.8 },
  { name: 'Singita Pamushana Lodge', category: 'lodge', stars: 5, location: { country: 'Zimbabwe', region: 'Lowveld', city: 'Malilangwe Wildlife Reserve' }, amenities: ['Private Pool', 'Game Drives', 'Spa', 'Infinity Pool', 'Gourmet Dining'], coverImage: { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80' }, priceRange: { min: 1800, max: 3500, currency: 'USD' }, isFeatured: true, isActive: true, averageRating: 5.0 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Package.deleteMany(), Hotel.deleteMany()]);
    console.log('🗑 Cleared existing data');

    // Create admin
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Zeno Admin',
      email: process.env.ADMIN_EMAIL || 'admin@zenoafrica.com',
      password: adminPassword,
      role: 'super_admin',
      isEmailVerified: true,
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create sample user
    const sampleUser = await User.create({
      name: 'Jane Explorer',
      email: 'jane@example.com',
      password: await bcrypt.hash('Password123!', 12),
      role: 'user',
      nationality: 'American',
      phone: '+1 555 0100',
      isEmailVerified: true,
    });
    console.log(`👤 Sample user created: ${sampleUser.email}`);

    // Create packages
    const createdPackages = await Package.insertMany(packages.map(p => ({ ...p, createdBy: admin._id })));
    console.log(`📦 ${createdPackages.length} packages created`);

    // Create hotels
    const createdHotels = await Hotel.insertMany(hotels.map(h => ({ ...h, createdBy: admin._id })));
    console.log(`🏨 ${createdHotels.length} hotels created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log(`Admin Email:     ${admin.email}`);
    console.log(`Admin Password:  ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log(`Sample User:     ${sampleUser.email} / Password123!`);
    console.log('─────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
