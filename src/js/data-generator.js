/**
 * Data Generator for Aksiya Top
 * Generates 10,000 mock promotions within Uzbekistan bounds
 */

const UZBEK_SHOPS = [
    "Korzinka", "Havas", "Makro", "Ishonch", "MediaPark", "Elmakon", "Texnomart",
    "Anjir", "Bellstore", "Panda", "Sello", "Uztelecom", "Artel", "RedTag", "Flo",
    "Terra Pro", "Selfie", "Vicco", "Basconi", "LC Waikiki", "Defacto"
];

const PRODUCTS = {
    "Oziq-ovqat": ["Burger", "Pizza", "Lavash", "Osh", "Coca-Cola 1.5L", "Sut", "Non", "Shokolad", "Kofe", "Mevalar"],
    "Kiyim-kechak": ["Futbolka", "Jinsi shim", "Krossovka", "Ko'ylak", "Kurtka", "Kostyum-shim", "Paypoq", "Kepka"],
    "Texnika": ["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air", "Smart Watch", "Televizor", "Muzlatgich", "Fen", "Dazmol"],
    "Xizmatlar": ["Avto yuvish", "Stomatologiya", "O'quv kursi", "Fitnes", "Gid", "Uy tozalash", "Rasmga tushirish"]
};

const CATEGORIES = Object.keys(PRODUCTS);

// Uzbekistan Bounding Box (Approximate)
const UZ_BOUNDS = {
    minLat: 38.0,
    maxLat: 42.0,
    minLng: 60.0,
    maxLng: 71.0
};

// Major Cities for higher density
const CITIES = [
    { name: "Toshkent", lat: 41.311081, lng: 69.240562 },
    { name: "Samarqand", lat: 39.654170, lng: 66.959720 },
    { name: "Buxoro", lat: 39.774720, lng: 64.428610 },
    { name: "Namangan", lat: 41.000147, lng: 71.672579 },
    { name: "Andijon", lat: 40.782060, lng: 72.344170 },
    { name: "Farg'ona", lat: 40.386400, lng: 71.786400 },
    { name: "Xiva", lat: 41.378330, lng: 60.363890 },
    { name: "Nukus", lat: 42.453060, lng: 59.610280 }
];

function getRandomLocation() {
    // 70% chance to be near a major city
    if (Math.random() < 0.7) {
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const spread = 0.15; // Roughly 15km
        return {
            lat: city.lat + (Math.random() - 0.5) * spread,
            lng: city.lng + (Math.random() - 0.5) * spread
        };
    }
    // 30% chance to be anywhere in UZ
    return {
        lat: UZ_BOUNDS.minLat + Math.random() * (UZ_BOUNDS.maxLat - UZ_BOUNDS.minLat),
        lng: UZ_BOUNDS.minLng + Math.random() * (UZ_BOUNDS.maxLng - UZ_BOUNDS.minLng)
    };
}

function generateAksiyalar(count = 10000) {
    const data = [];
    const emojis = ["🍔", "🍕", "👔", "📱", "💻", "🛒", "🛍️", "👟", "🍦", "🎂"];

    for (let i = 0; i < count; i++) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const productsList = PRODUCTS[category];
        const product = productsList[Math.floor(Math.random() * productsList.length)];
        const loc = getRandomLocation();

        data.push({
            id: `gen-${i}`,
            shop: UZBEK_SHOPS[Math.floor(Math.random() * UZBEK_SHOPS.length)],
            product: product,
            category: category,
            percent: Math.floor(Math.random() * 80) + 10, // 10% to 90%
            lat: loc.lat,
            lng: loc.lng,
            img: emojis[Math.floor(Math.random() * emojis.length)],
            verified: Math.random() < 0.3 // 30% verified
        });
    }
    return data;
}

window.generatedAksiyalar = generateAksiyalar(10000);
console.log("Successfully generated 10,000 promotions! 🚀");
