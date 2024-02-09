let currentPage = null;
let pageSize = 0;
let totalPages = 0;
const charactersContainer = document.getElementById("characters");
const characterInfoContainer = document.getElementById("character-info");
const planetInfoContainer = document.getElementById("planet-info");
const pageElem = document.getElementById("page");
const nextElem = document.getElementById("next");
const prevElem = document.getElementById("prev");

async function fetchPage(next) {
    charactersContainer.innerHTML = '<div class="loader"></div>';

    let url;
    if (!currentPage) {
        url = "https://swapi.dev/api/people";
    } else if (next) {
        url = currentPage.next;
    } else {
        url = currentPage.previous;
    }
    if (!url) return;

    const response = await fetch(url);
    currentPage = await response.json();
    console.log(currentPage);

    let htmlResult = "";
    currentPage.results.forEach(c => (htmlResult += `<p url="${c.url}" class="character">${c.name}</p>`));

    charactersContainer.innerHTML = htmlResult;
    pageElem.innerText = `${getCurrentPageNr()} / ${getTotalPages()}`;
}

function getCurrentPageNr() {
    let pageNr = 0;
    if (currentPage) {
        if (currentPage.next) {
            pageNr = Number(currentPage.next.charAt(currentPage.next.length - 1)) - 1;
            console.log(currentPage.next);
        } else if (currentPage.previous) {
            pageNr = Number(currentPage.previous.charAt(currentPage.previous.length - 1)) + 1;
            console.log(currentPage.previous);
        }
        console.log("pageNr:", pageNr);
    }
    return pageNr;
}
function getTotalPages() {
    if (currentPage && totalPages === 0) {
        let total = currentPage.count;
        if (pageSize === 0) {
            pageSize = currentPage.results.length;
        }
        if (pageSize > 0) {
            totalPages = Math.ceil(total / pageSize);
        }
    }
    return totalPages;
}

// function addCharacterClickListner() {
//     const characters = document.querySelectorAll(".character");
//     characters.forEach(c => c.addEventListener("click", () => loadDetails(c.getAttribute("url"))));
// }
//Add character click listner:
//(() => {
charactersContainer.addEventListener("click", e => {
    const url = e.target.getAttribute("url");
    if (url) loadDetails(url);
});
//})();
nextElem.addEventListener("click", () => fetchPage(true));
prevElem.addEventListener("click", () => fetchPage(false));

async function loadCharacter(url) {
    //console.log("loadCharacter", url);
    const response = await fetch(url);
    const info = await response.json();
    characterInfoContainer.innerHTML = `
        <p id="character-name">${info.name}</p>
        <p class="info">Heigt: ${info.height}cm</p>
        <p class="info">Mass: ${info.mass}kg</p>
        <p class="info">Hair color: ${info.hair_color}</p>
        <p class="info">Skin color: ${info.skin_color}</p>
        <p class="info">Eye color: ${info.eye_color}</p>
        <p class="info">Year of birth: ${info.birth_year}</p>
        <p class="info">Gender: ${info.gender}</p>`;
    return info;
}
async function loadPlanet(url) {
    console.log("loadPlanet", url);
    const response = await fetch(url);
    const info = await response.json();
    planetInfoContainer.innerHTML = `
        <p id="character-name">${info.name}</p>
        <p class="info">Rotation period: ${info.rotation_period}h</p>
        <p class="info">Orbital period: ${info.orbital_period} days</p>
        <p class="info">Diameter: ${info.diameter}km</p>
        <p class="info">Climate: ${info.climate}</p>
        <p class="info">Gravity: ${info.gravity}</p>
        <p class="info">Terrain: ${info.terrain}</p>`;
}
async function loadDetails(url) {
    console.log(url);
    characterInfoContainer.innerHTML = '<div class="loader"></div>';
    planetInfoContainer.innerHTML = '<div class="loader"></div>';
    const characterDetails = await loadCharacter(url);
    await loadPlanet(characterDetails.homeworld);
}

fetchPage(undefined);
