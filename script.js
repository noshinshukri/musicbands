import musicService from "./musicService.js";

const service = new musicService("https://music.api.public.seido.se/api");

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
            b.name.toLowerCase().includes(text)
        );

        const countElement = document.getElementById("results-count");
        if (countElement) {
            if (text.length > 0) {
                countElement.innerHTML = `Hittade <strong>${filtered.length}</strong> band som matchar "<em>${text}</em>"`;
            } else {
                countElement.innerHTML = `Visar alla <strong>${allBands.length}</strong> band`;
            }
        }

        currentPage = 1;
        renderBands(filtered);
    });
}

// --- RENDER BANDS ---
function renderBands(listToRender) {
    const bandsGrid = document.getElementById("bands-grid");
    if (!bandsGrid) return;

    bandsGrid.innerHTML = "";

    if (!listToRender || listToRender.length === 0) {
        bandsGrid.innerHTML = "<p>Inga band att visa</p>";
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const bandsToShow = listToRender.slice(start, end);

    bandsToShow.forEach(band => {
        const card = document.createElement("div");
        card.classList.add("band-card");
        
        const musicGroupId = band.musicGroupId || "Unknown ID";
        const imageLink = band.imageLink || 'images/default.jpg';
        const name = band.name || 'Unknown';
        const strGenre = band.strGenre || 'Unknown';
        const establishedYear = band.establishedYear || 'N/A';
        const albumCount = Array.isArray(band.albums) ? band.albums.length : (band.albums || 0);
        
        card.innerHTML = `
            <img src="${imageLink}" alt="${name}">
            <div class="band-info">
                <h3>${name}</h3>
                <p><strong>Genre:</strong> ${strGenre}</p>
                <p><strong>Established:</strong> ${establishedYear}</p>
                <p><strong>Albums:</strong> ${albumCount}</p>
                <a href="bands-detail/band-detail.html?id=${musicGroupId}" class="btn">View Details</a>
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

    const countElement = document.getElementById("results-count");
    
    try {
        const apiBandsResponse = await service.readMusicGroupsAsync(1, false, null, 100);
        let apiBands = apiBandsResponse.pageItems || [];

        
        const localBands = JSON.parse(sessionStorage.getItem("localBands")) || [];

        
        allBands = [...localBands, ...apiBands];

        allBands.sort((a, b) => a.establishedYear - b.establishedYear);

        if (countElement) {
            countElement.innerHTML = `Visar alla <strong>${allBands.length}</strong> band`;
        }

        console.log("Totalt antal band:", allBands.length);
        console.log("Varav lokala:", localBands.length);

        renderBands(allBands);
    } catch (error) {
        allBands = [];
        if (countElement) {
            countElement.innerHTML = `Visar alla <strong>${allBands.length}</strong> band`;
        }
        renderBands(allBands);
    }
}


if (document.getElementById("bands-grid")) {
    init();
} else {
    renderHeader();
}