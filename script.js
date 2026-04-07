import { bands, fetchBands } from "./bandItem.js";

// --- GLOBAL STATE ---
let allBands = [];
let currentPage = 1;
const itemsPerPage = 9;

// --- RENDER HEADER ---
function renderHeader() {
    const headerRoot = document.getElementById("header-root");
    if (!headerRoot) return;

    const path = window.location.pathname;
    const isBandsPage = path.includes('bands2.html');

    headerRoot.innerHTML = `
        <header class="header">
            <div class="header-container">
                <div class="header-left">
                    <h1 class="h1"><a href="index.html">Music Bands</a></h1>
                    <p>Explore the world of music bands and their details.</p>
                </div>

                ${isBandsPage ? `
                <div class="search">
                    <input type="text" id="search-input" placeholder="Search bands...">
                </div>
                ` : ""}

                <nav class="menu">
                    <a href="index.html" class="${path.includes('index') || path === '/' ? 'active' : ''}">Home</a>
                    <a href="bands2.html" class="${isBandsPage ? 'active' : ''}">Bands</a>
                    <a href="./add-group/addgroup.html" class="${path.includes('addgroup') ? 'active' : ''}">Add Group</a>
                </nav>
            </div>
        </header>`;


    setupSearch();
}

// --- SEARCH LOGIC ---
function setupSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const text = e.target.value.toLowerCase();
        
        
        const filtered = allBands.filter(b => 
            b.name.toLowerCase().includes(text) || 
            b.genre.toLowerCase().includes(text)
        );

        currentPage = 1;
        renderBands(filtered); 
    });
}

// --- RENDER BANDS ---
function renderBands(listToRender) {
    const bandsGrid = document.getElementById("bands-grid");
    if (!bandsGrid) return;
    
    bandsGrid.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const bandsToShow = listToRender.slice(start, end);

    bandsToShow.forEach(band => {
        const card = document.createElement("div");
        card.classList.add("band-card");
        card.innerHTML = `
            <img src="${band.imageLink || 'images/default.jpg'}" alt="${band.name}">
            <div class="band-info">
                <h3>${band.name}</h3>
                <p>Genre: ${band.genre}</p>
                <p><strong>Established:</strong> ${band.established}</p>
                <p><strong>Albums:</strong> ${band.albums}</p>
                <a href="bands-detail/band-detail.html?id=${band.id}" class="btn">View Details</a>
            </div>
        `;
        bandsGrid.appendChild(card);
    });

    renderPagination(listToRender);
}

// --- RENDER PAGINATION ---
function renderPagination(listToRender) {
    const container = document.getElementById("pagination");
    if (!container) return;

    container.innerHTML = "";
    const totalPages = Math.ceil(listToRender.length / itemsPerPage);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === currentPage) ? "page-btn active" : "page-btn";
        
        btn.onclick = () => {
            currentPage = i;
            renderBands(listToRender);
            window.scrollTo(0, 0);
        };
        container.appendChild(btn);
    }
}

// --- INIT ---
async function init() {

    renderHeader();

    const localBands = JSON.parse(localStorage.getItem("bands")) || bands;
    const apiBands = await fetchBands();

    allBands = [...localBands, ...apiBands];
    allBands.sort((a, b) => a.established - b.established);


    renderBands(allBands);
}

init();