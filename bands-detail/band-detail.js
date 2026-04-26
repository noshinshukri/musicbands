
import musicService from "../musicService.js";

const service = new musicService("https://music.api.public.seido.se/api");

async function loadDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bandId = urlParams.get('id');

    if (!bandId) {
        document.getElementById("band-detail-container").innerHTML = `
            <h2>Inget band valt</h2>
            <a href="../bands2.html" class="btn">Gå tillbaka</a>
        `;
        return;
    }

    try {

        let band = null;

        const localBands = JSON.parse(sessionStorage.getItem("localBands")) || [];

        band = localBands.find(b => b.musicGroupId.toString() === bandId.toString());

        if (!band) {
            console.log("Hittades inte lokalt, hämtar från API...");
            const response = await service.readMusicGroupAsync(bandId, false);
            band = response.item;
        } else {
            console.log("Hittade bandet i sessionStorage!");
        }

        if (band) {
            document.getElementById("name").innerText = " " + (band.name || "Unknown");
            document.getElementById("description").innerText = " " + (band.description || "");
            document.getElementById("genre").innerText = " " + (band.strGenre || "Unknown");
            document.getElementById("established").innerText = " " + (band.establishedYear || "N/A");
            document.getElementById("members").innerText = " " + (band.artists?.length > 0
                ? band.artists.map(a => `${a.firstName} ${a.lastName}`).join(", ")
                : "No artists found");
            document.getElementById("albums").innerText = " " + (band.albums?.length || 0);
            document.getElementById("albumNames").innerText = " " + (band.albums?.length > 0 ? band.albums.map(a => a.name || a).join(", ") : "No albums found");

            const imgElement = document.getElementById("imageLink");
            if (band.imageLink?.startsWith("http") || band.imageLink?.startsWith("data:")) {
                imgElement.src = band.imageLink;
            } else {
                imgElement.src = "../" + (band.imageLink || "images/default.jpg");
            }
            imgElement.alt = band.name;
        } else {
            throw new Error("Band not found");
        }
    } catch (err) {
        document.getElementById("band-detail-container").innerHTML = `
            <h2>Bandet hittades inte</h2>
            <a href="../bands2.html" class="btn">Gå tillbaka</a>
        `;
    }
}

loadDetailPage();