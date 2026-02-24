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
    "Oziq-ovqat": ["Burger", "Pizza", "Lavash", "Osh", "Coca-Cola 1.5L", "Sut", "Non", "Shokolad", "Kofe", "Mevalar", "Salat", "Muzqaymoq", "Pishiriq", "Sharbat", "Choy"],
    "Kiyim-kechak": ["Futbolka", "Jinsi shim", "Krossovka", "Ko'ylak", "Kurtka", "Kostyum-shim", "Paypoq", "Kepka", "Mayka", "Svitshot", "Shortik", "Tufli", "Sandal", "Shlyapa", "Kashmir"],
    "Texnika": ["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air", "Smart Watch", "Televizor", "Muzlatgich", "Fen", "Dazmol", "Konditsioner", "Planshet", "Quloqchin", "Klaviatura", "Sichqoncha", "Monitor", "Kamera"],
    "Xizmatlar": ["Avto yuvish", "Stomatologiya", "O'quv kursi", "Fitnes", "Gid", "Uy tozalash", "Rasmga tushirish", "Massaj", "Sartarosh", "Manikyur", "Taksi", "Kuryer", "Kimyoviy tozalash", "Ta'mirlash", "Sug'urta"]
};

const CATEGORY_KEYWORDS = {
    "Oziq-ovqat": "food,groceries",
    "Kiyim-kechak": "fashion,clothes",
    "Texnika": "tech,electronics",
    "Xizmatlar": "service,business"
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

function generateAksiyalar(totalCount = 1000) {
    const data = [];
    const itemsPerCategory = Math.floor(totalCount / CATEGORIES.length);

    let globalIndex = 0;
    CATEGORIES.forEach(category => {
        const productsList = PRODUCTS[category];
        const keyword = CATEGORY_KEYWORDS[category];

        for (let i = 0; i < itemsPerCategory; i++) {
            const shop = UZBEK_SHOPS[Math.floor(Math.random() * UZBEK_SHOPS.length)];
            const productBase = productsList[Math.floor(Math.random() * productsList.length)];
            const loc = getRandomLocation();

            // Ensure unique name by appending global ID
            const uniqueProduct = `${productBase} #${globalIndex + 1}`;

            data.push({
                id: `gen-${globalIndex}`,
                shop: shop,
                product: uniqueProduct,
                category: category,
                percent: Math.floor(Math.random() * 80) + 10, // 10% to 90%
                lat: loc.lat,
                lng: loc.lng,
                // Using LoremFlickr for real unique images
                img: `https://loremflickr.com/400/300/${keyword.split(',')[0]}?lock=${globalIndex}`,
                verified: Math.random() < 0.3 // 30% verified
            });
            globalIndex++;
        }
    });

    // Shuffle the array to mix categories
    return data.sort(() => Math.random() - 0.5);
}

window.generatedAksiyalar = generateAksiyalar(1000);
console.log("Successfully generated 1,000 unique promotions with real images! 🚀");
