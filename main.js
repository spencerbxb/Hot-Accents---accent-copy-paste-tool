import { letters } from "./tables/letters.js";
import { languages } from "./tables/theme.js";

const langButton = document.getElementById("langButton");
const langOverlay = document.getElementById("langOverlay");
const langGrid = document.getElementById("langGrid");
const letterList = document.getElementById("list");
const langFlag = document.getElementById("currentFlag");
const capsButton = document.getElementById("capsButton");

const STORAGE_LANG = "accent_lang";
const STORAGE_CAPS = "accent_caps";

// populateLetters(language) adds letters to the letterList at the bottom of
// the ui
// O(n), where n represents the amount of letters
function populateLetters(language) {
    letterList.innerHTML = "";

    for (const char of letters[language]) {
        const displayChar = capitals ? char.toUpperCase() : char;

        const btn = document.createElement("button");
        btn.textContent = displayChar;

        btn.onclick = () => {
            navigator.clipboard.writeText(displayChar);
        };

        letterList.appendChild(btn);
    }
}

// colorActiveLanguage(nextLanguage) recolors the next selected language, uncoloring
// the old one
// O(n), where n represents the amount of languages
function colorNewLanguage(newLanguage) {
    const items = document.querySelectorAll(".language-item");

    items.forEach(item => {
        const lang = item.dataset.language;

        if (lang === newLanguage) {
            item.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
        } else {
            item.style.backgroundColor = "rgba(0, 0, 0, 0)";
        }
    });
}

// update flag
function applyFlag(language) {
    langFlag.src = `flags/${language}.png`;
    langFlag.alt = language;
}

function applyTheme(language) {
    document.body.style.backgroundColor = languages[language]?.color ?? "#e8f0ff";
}

// buildLanguageGrid() builds the overlay grid of languages, allowing the user to change
// to a different language's accents
// O(n), where n represents the number of available languages
function buildLanguageGrid() {
    function createFlag(language) {
        const img = document.createElement("img");
        img.className = "flag-images";
        img.src = `flags/${language}.png`;
        img.alt = language;
        img.draggable = false;

        return img;
    }

    langGrid.innerHTML = "";

    const orderedLanguages = Object.keys(letters).sort((a, b) => languages[a].pos - languages[b].pos);

    for (const language of orderedLanguages) {
        const item = document.createElement("div");
        item.className = "lang-item";

        const img = createFlag(language)

        item.appendChild(img);

        item.onclick = () => {
            colorNewLanguage(language)

            currentLanguage = language;
            console.log("current language has been set to: ", currentLanguage);

            localStorage.setItem(STORAGE_LANG, language);

            populateLetters(language);
            applyFlag(language);
            applyTheme(language);

            langOverlay.classList.add("hidden");
        };

        langGrid.appendChild(item);
    }
}

// open overlay
langButton.onclick = (e) => {
    e.stopPropagation();
    langOverlay.classList.remove("hidden");
};

// close overlay when clicking background only
langOverlay.onclick = (e) => {
    if (e.target === langOverlay) {
        langOverlay.classList.add("hidden");
    }
};

capsButton.onclick = () => {
    capitals = !capitals;

    localStorage.setItem(STORAGE_CAPS, JSON.stringify(capitals));

    populateLetters(currentLanguage);

    capsButton.textContent = capitals ? "A" : "a";
};

// init
let capitals = JSON.parse(localStorage.getItem(STORAGE_CAPS)) ?? false;
let currentLanguage = localStorage.getItem(STORAGE_LANG);

const isFirstRun = !currentLanguage;
if (isFirstRun) {
    langOverlay.classList.remove("hidden");
    document.body.style.height = "350px";
}

buildLanguageGrid();
applyFlag(currentLanguage);
populateLetters(currentLanguage);

applyTheme(currentLanguage);

capsButton.textContent = capitals ? "A" : "a";

document.body.style.height = "0px";