import { bands } from "./bandItem.js";

if (!localStorage.getItem("bands")) {
    localStorage.setItem("bands", JSON.stringify(bands));
}

const storedBands = JSON.parse(localStorage.getItem("bands"));
storedBands.sort((a, b) => a.established - b.established);

const bandsGrid = document.getElementById("bands-grid");
const searchInput = document.getElementById("search-input");
const paginationContainer = document.getElementById("pagination"); 

let currentPage = 1;
const itemsPerPage = 9;

function renderBands(bandsList) {
    bandsGrid.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const bandsToShow = bandsList.slice(startIndex, endIndex);

    for (const band of bandsToShow) {
        const bandCard = document.createElement("div");
        bandCard.classList.add("band-card");
        bandCard.innerHTML = `
            <img src="${band.imageLink}" alt="${band.name}">
            <div class="band-info">
                <h3>${band.name}</h3>
                <p>Genre: ${band.genre}</p>
                <p><strong>Established:</strong> ${band.established}</p>
                <p><strong>Albums:</strong> ${band.albums}</p>
                <a href="bands-detail/band-detail.html?id=${band.id}" class="btn">View Details</a>
                <a href="${band.spotifyLink || '#'}" target="_blank" class="spotify">
                    🎧 Listen on Spotify
                </a>
            </div>
        `;
        bandsGrid.appendChild(bandCard);
    }

    renderPaginationControls(bandsList);
}

function renderPaginationControls(bandsList) {

    paginationContainer.innerHTML = ""; 
    const totalPages = Math.ceil(bandsList.length / itemsPerPage);

   
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++){
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.classList.add("page-btn");
        if (i === currentPage) btn.classList.add("active");

        btn.addEventListener("click", () => {
            currentPage = i;
            renderBands(bandsList);
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(btn);
    }
}

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filteredBands = storedBands.filter(band => {
        return (
            band.name.toLowerCase().includes(value) || 
            band.genre.toLowerCase().includes(value)
        );
    });

    currentPage = 1;
    renderBands(filteredBands);
});

renderBands(storedBands);