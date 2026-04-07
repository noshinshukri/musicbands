
import { bands, fetchBands } from "../bandItem.js";

async function loadDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bandId = urlParams.get('id');
    const localBands = JSON.parse(localStorage.getItem("bands")) || bands;
    const apiBands = await fetchBands();
    const allBands = [...localBands, ...apiBands];
    const band = allBands.find(b => b.id == bandId);


if (band) {
    document.getElementById("name").innerText = band.name;
    document.getElementById("description").innerText = " " + band.description;
    document.getElementById("genre").innerText = " " + band.genre;
    document.getElementById("established").innerText = " " + band.established;
    document.getElementById("members").innerText = " " + (band.members || "No members found");
    document.getElementById("albums").innerText = " " + band.albums;
    document.getElementById("albumNames").innerText = " " + (band.albumNames || "No albums found");
    document.getElementById("spotifyLink").href = band.spotifyLink || "#";
    
    
    // Bildhantering
    const imgElement = document.getElementById("imageLink");
    
    if (band.imageLink?.startsWith("http") || band.imageLink?.startsWith("data:")) {
        imgElement.src = band.imageLink;
    } 
    else {
        imgElement.src = "../" + (band.imageLink || "images/default.jpg");
    }
    imgElement.alt = band.name;


    const spotifyBtn = document.getElementById("spotifyLink");
    if (band.spotifyLink) {
        spotifyBtn.href = band.spotifyLink;
        spotifyBtn.target = "_blank";
    } 
    else {
        spotifyBtn.style.display = "none";
    }


} 
else {
    document.getElementById("band-detail-container").innerHTML = `
        <h2>Bandet hittades inte</h2>
        <a href="../bands2.html" class="btn">Gå tillbaka</a>
    `;
}
}

loadDetailPage();