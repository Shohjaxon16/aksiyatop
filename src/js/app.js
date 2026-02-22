// Auth State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Combined Data: Local Storage + 10,000 Generated Items
let localAksiyalar = JSON.parse(localStorage.getItem('aksiyalar')) || [];
let mockDiscounts = [...localAksiyalar, ...(window.generatedAksiyalar || [])];

// Pagination State
let currentPage = 1;
const itemsPerPage = 20;
let currentFilteredData = [...mockDiscounts];

// Load Discounts with Pagination
function loadDiscounts(data, append = false) {
    const grid = document.getElementById('discountsGrid');
    if (!grid) return;

    if (!append) {
        grid.innerHTML = '';
        currentPage = 1;
        currentFilteredData = data;
    }

    if (data.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Hozircha aksiyalar yo\'q. Birinchilardan bo\'lib qo\'shing!</div>';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagedData = data.slice(start, end);

    pagedData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'discount-card';
        const imgHtml = (typeof item.img === 'string' && item.img.startsWith('data:image'))
            ? `<img src="${item.img}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<span style="font-size: 50px">${item.img}</span>`;

        card.innerHTML = `
            <div class="card-img">
                ${imgHtml}
                <div class="badge">-${item.percent}%</div>
            </div>
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 5px;">
                    <span class="shop-name">${item.shop}</span>
                    <div style="display: flex; gap: 5px;">
                        ${item.verified ? '<div class="verified-badge">✓ Tasdiqlangan</div>' : ''}
                    </div>
                </div>
                <h3>${item.product}</h3>
                <button class="btn btn-primary" style="width: 100%; margin-top: 15px;" onclick="focusOnMap(${item.lat}, ${item.lng})">Xaritada ko'rish</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Handle "Load More" button
    updateLoadMoreButton(data.length > end);
}

function updateLoadMoreButton(show) {
    let btn = document.getElementById('loadMoreBtn');
    if (!btn) {
        const container = document.querySelector('.discounts.container');
        if (!container) return;
        btn = document.createElement('button');
        btn.id = 'loadMoreBtn';
        btn.className = 'btn btn-outline';
        btn.style.margin = '30px auto';
        btn.style.display = 'block';
        btn.innerText = "Yana ko'proq yuklash";
        btn.onclick = () => {
            currentPage++;
            loadDiscounts(currentFilteredData, true);
        };
        container.appendChild(btn);
    }
    btn.style.display = show ? 'block' : 'none';
}

function focusOnMap(lat, lng) {
    if (window.mainMap) {
        window.mainMap.setCenter([lat, lng], 16, { checkZoomRange: true });
        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    }
}

// Search Logic
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.btn-search');

function handleSearch() {
    if (!searchInput) return;
    const term = searchInput.value.toLowerCase().trim();
    if (!term) {
        loadDiscounts(mockDiscounts);
        return;
    }
    const filtered = mockDiscounts.filter(item =>
        (item.shop && item.shop.toLowerCase().includes(term)) ||
        (item.product && item.product.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term))
    );
    loadDiscounts(filtered);
}

if (searchBtn) searchBtn.onclick = handleSearch;
if (searchInput) searchInput.oninput = handleSearch; // Reactive search while typing

// Auth & UI State Update
function updateUI() {
    const addAksiyaBtn = document.getElementById('addAksiyaBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const landingLoginBtn = document.getElementById('landingLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (currentUser) {
        if (addAksiyaBtn) addAksiyaBtn.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (landingLoginBtn) landingLoginBtn.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            if (userNameDisplay) userNameDisplay.innerText = currentUser.name;
        }
        if (logoutBtn) logoutBtn.onclick = handleLogout;
    } else {
        if (addAksiyaBtn) addAksiyaBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (landingLoginBtn) landingLoginBtn.style.display = 'inline-block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
}

// Modal Logic
const modal = document.getElementById("aksiyaModal");
const authModal = document.getElementById("authModal");
const btn = document.getElementById("addAksiyaBtn");
const loginBtnEl = document.getElementById("loginBtn");
const landingLoginBtn = document.getElementById('landingLoginBtn');
const closeAksiya = modal ? modal.querySelector(".close") : null;
const closeAuth = document.querySelector(".close-auth");

if (btn) btn.onclick = () => modal.style.display = "block";
if (loginBtnEl) loginBtnEl.onclick = () => authModal.style.display = "block";
if (landingLoginBtn) landingLoginBtn.onclick = () => authModal.style.display = "block";
if (closeAksiya) closeAksiya.onclick = () => modal.style.display = "none";
if (closeAuth) closeAuth.onclick = () => authModal.style.display = "none";

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
    if (event.target == authModal) authModal.style.display = "none";
}

// Image Preview Logic
const imgInput = document.getElementById('productImage');
const imgPreview = document.getElementById('imagePreview');
let currentImageBase64 = "";

// Real-Time AI Vision (ml5.js)
let classifier;
if (window.ml5) {
    classifier = ml5.imageClassifier('MobileNet', () => {
        console.log('AI Model Loaded! 🚀');
    });
}

if (imgInput) {
    imgInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentImageBase64 = event.target.result;
                imgPreview.style.backgroundImage = `url(${currentImageBase64})`;
                imgPreview.style.display = "block";

                // AI Hints
                const aiHint = document.getElementById('aiNameHint');
                const suggestSpan = document.getElementById('suggestedName');
                const nameInput = document.getElementById('productName');
                const categorySelect = document.getElementById('productCategory');

                const fileName = file.name.toLowerCase();
                let recognizedCat = "";
                let recognizedName = "";
                const aiDict = [
                    { keys: ['burger', 'food', 'pizza', 'osh', 'lavash', 'fastfud', 'shashlik', 'somsa'], cat: 'Oziq-ovqat', prefix: 'Mazali ' },
                    { keys: ['shirt', 'kiyim', 'dress', 'futbolka', 'ko\'ylak', 'jeans', 'shim', 'krasovka'], cat: 'Kiyim-kechak', prefix: 'Sifatli ' },
                    { keys: ['phone', 'laptop', 'tv', 'telefon', 'planshet', 'monitor', 'smart'], cat: 'Texnika', prefix: 'Zamonaviy ' }
                ];

                for (const g of aiDict) {
                    const match = g.keys.find(k => fileName.includes(k));
                    if (match) {
                        recognizedCat = g.cat;
                        recognizedName = g.prefix + match.charAt(0).toUpperCase() + match.slice(1);
                        break;
                    }
                }

                if (aiHint && recognizedName) {
                    aiHint.style.display = 'flex';
                    suggestSpan.innerText = `${recognizedName} ✨ (Bosing!)`;
                    aiHint.onclick = () => {
                        nameInput.value = recognizedName;
                        categorySelect.value = recognizedCat;
                        aiHint.style.display = 'none';
                    };
                }
            };
            reader.readAsDataURL(file);
        }
    };
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('discountsGrid')) {
        loadDiscounts(mockDiscounts);

        // Category Filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.onclick = () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.innerText;
                const filtered = category === 'Hammasi' ? mockDiscounts : mockDiscounts.filter(item => item.category === category);
                loadDiscounts(filtered);
            };
        });
    }
    updateUI();

    // Map Markers Initial Load
    if (document.getElementById('googleMap')) {
        setTimeout(() => {
            if (typeof updateMapMarkers === 'function') {
                updateMapMarkers(mockDiscounts);
            }
        }, 1000);
    }

    // Form Submission
    const form = document.getElementById('aksiyaForm');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const newAksiya = {
                id: Date.now(),
                shop: document.getElementById('shopName').value,
                product: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                percent: document.getElementById('discountPercent').value,
                lat: parseFloat(document.getElementById('latitude').value),
                lng: parseFloat(document.getElementById('longitude').value),
                img: currentImageBase64 || "🆕",
                verified: currentUser && currentUser.role === 'admin'
            };
            mockDiscounts.unshift(newAksiya);
            localAksiyalar.unshift(newAksiya);
            localStorage.setItem('aksiyalar', JSON.stringify(localAksiyalar));
            loadDiscounts(mockDiscounts);
            if (typeof updateMapMarkers === 'function') updateMapMarkers(mockDiscounts);
            modal.style.display = "none";
            form.reset();
            alert("Aksiya muvaffaqiyatli qo'shildi!");
        };
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const user = document.getElementById('loginUser').value;
            const pass = document.getElementById('loginPass').value;
            if (user === 'admin' && pass === '123') {
                currentUser = { name: "Admin ✨", role: "admin" };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUI();
                authModal.style.display = "none";
            } else {
                alert("Xato!");
            }
        };
    }

    const logoutBtnEl = document.getElementById('logoutBtn');
    if (logoutBtnEl) logoutBtnEl.onclick = handleLogout;

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.onclick = () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        };

        // Close menu when clicking links
        navMenu.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            };
        });
    }

    window.clearAllAksiyalar = () => {
        if (confirm("Tozalash?")) {
            localStorage.removeItem('aksiyalar');
            localAksiyalar = [];
            mockDiscounts = [...(window.generatedAksiyalar || [])];
            loadDiscounts(mockDiscounts);
            if (typeof updateMapMarkers === 'function') updateMapMarkers(mockDiscounts);
        }
    };
});
