
// --- RENDER HEADER ---
function renderHeader() {
    const headerRoot = document.getElementById("header-root");
    if (!headerRoot) return;
    headerRoot.innerHTML = `
        <header class="header">
            <div class="header-container">
                <div class="header-left">
                    <h1 class="h1"><a href="../index.html">Music Bands</a></h1>
                    <p>Explore the world of music bands and their details.</p>
                </div>
                <nav class="menu">
                    <a href="../index.html">Home</a>
                    <a href="../bands2.html">Bands</a>
                    <a class="active" href="../add-group/addgroup.html">Add Group</a>
                </nav>
            </div>
        </header>
    `;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderHeader);
} else {
    renderHeader();
}

// --- BANDS DATA & API FETCHING ---
import { bands } from "../bandItem.js";
console.log("Script is running");
console.log(bands);

if (!localStorage.getItem("bands")) {
    localStorage.setItem("bands", JSON.stringify(bands));
}

const form = document.getElementById("band-form");

// --- FORM SUBMISSION LOGIC ---
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const established = document.getElementById("established").value;
    const albums = document.getElementById("albums").value;

    if(isNaN(established)){
        alert("Please enter valid numbers for Established Year.");
        return;
    }
    else if(isNaN(albums)){
        alert("Please enter valid numbers for Albums.");
        return;
    }

    const newBand = {
        id: Date.now(),
        name: document.getElementById("band-name").value,
        genre: document.getElementById("genre").value,
        established: Number(established),
        description: document.getElementById("description").value,
        albums: Number(albums),
        members: document.getElementById("members").value,
        spotifyLink: document.getElementById("spotifyLink").value,
        imageLink: document.getElementById("imageLink").value || "images/default.jpg"
    }

    const storedBands = JSON.parse(localStorage.getItem("bands")) || [];

    storedBands.push(newBand);

    localStorage.setItem("bands", JSON.stringify(storedBands));

    form.reset();
    alert("Band added successfully!")
});
