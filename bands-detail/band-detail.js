// 1. Hämta ID från URL
const urlParams = new URLSearchParams(window.location.search);
const bandId = urlParams.get('id');

// 2. Hämta listan från LocalStorage
const storedBands = JSON.parse(localStorage.getItem("bands")) || [];

// 3. Hitta rätt band
const band = storedBands.find(b => b.id == bandId);

// 4. Koppla ihop JS med din HTML
if (band) {
    document.getElementById("name").innerText = band.name;
    document.getElementById("description").innerText = " " + band.description;
    document.getElementById("genre").innerText = " " + band.genre;
    document.getElementById("established").innerText = " " + band.established;
    document.getElementById("members").innerText = " " + (band.members || "N/A");
    document.getElementById("albums").innerText = " " + band.albums;
    
    // SMART BILD-HANTERING
    const imgElement = document.getElementById("imageLink");
    
    // Om bilden är en extern länk (börjar på http) eller en uppladdad sträng (data:), använd den direkt.
    // Annars (om det är en lokal fil som "images/beatles.jpg"), lägg till ../
    if (band.imageLink.startsWith("http") || band.imageLink.startsWith("data:")) {
        imgElement.src = band.imageLink;
    } else {
        imgElement.src = "../" + band.imageLink; 
    }
    imgElement.alt = band.name;

    // Spotify-länk
    const spotifyBtn = document.getElementById("spotifyLink");
    if (band.spotifyLink) {
        spotifyBtn.href = band.spotifyLink;
        spotifyBtn.target = "_blank";
    } else {
        spotifyBtn.style.display = "none";
    }

    // BONUS: Lägg till en rad här om du vill ha en Delete-knapp (se nedan)

} else {
    document.getElementById("band-detail-container").innerHTML = `
        <h2>Bandet hittades inte</h2>
        <a href="../bands2.html" class="btn">Gå tillbaka</a>
    `;
}