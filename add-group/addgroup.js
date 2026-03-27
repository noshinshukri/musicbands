import { bands } from "../bandItem.js";
console.log("Script is running");
console.log(bands);

if (!localStorage.getItem("bands")) {
    localStorage.setItem("bands", JSON.stringify(bands));
}

const form = document.getElementById("band-form");


form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newBand = {
        id: Date.now(),
        name: document.getElementById("band-name").value,
        genre: document.getElementById("genre").value,
        established: Number(document.getElementById("established").value),
        description: document.getElementById("description").value,
        albums: Number(document.getElementById("albums").value),
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
