var text = document.getElementById('text');
var newDom = '';
var animationDelay = 200;
const availableLocales = ['en', 'ro'];

// Default locale.
const defaultLanguageIndex = 0;
const defaultLanguage = 'en';
let languageButtonLabel = 'ro';

// Manually detect users' language, strip languages such as `en-GB` to just `en`.
let language = (window.navigator.userLanguage || window.navigator.language).substr(0, 2);

// Set `pageLanguage` only if its available within our locales, otherwise default.
let pageLanguage = defaultLanguage;
if (availableLocales.includes(language)) {
    pageLanguage = language;
}

document.addEventListener('DOMContentLoaded', function () {
    const preferredLanguage = getStorageLanguage();

    // Apply the language to your website based on the preferredLanguage variable
    // You can have a separate function to handle the actual language switching logic
    setLanguage(preferredLanguage);
    setLanguageButtonLabel(preferredLanguage);
});

function getStorageLanguage() {
    return localStorage.getItem('preferredLanguage') || defaultLanguage; // Provide a default language if none is set
}

function setStorageLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
}


async function setLanguage(lang) {
    console.log("SET LANGUAGE", lang)
    setStorageLanguage(lang);
    // Get all page elements to be translated.
    const elements = document.querySelectorAll('[data-i18n]');

    // Specify the path to your JSON file
    const jsonFilePath = `./locales/i18n/${lang}.json`;

    // Use the fetch function to make the request
    fetch(jsonFilePath)
        .then(response => {
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the response as JSON and return the result
            return response.json();
        })
        .then(data => {
            // On each element, found the translation from JSON file & update.
            elements.forEach((element, index) => {
                const key = element.getAttribute('data-i18n');
                let text = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), data);

                // Regular text replacement for given locale.
                element.innerHTML = text;
            });

            // Set <html> tag lang attribute.
            const htmlElement = document.querySelector('html');
            htmlElement.setAttribute('lang', pageLanguage);

            pageLanguage = lang;
            // document.getElementById('nav-about').setAttribute('data-content', (lang == 'en' ? "about" : "despre"));

            setDataContent(lang);
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });

}



function setDataContent(language) {
    var aboutLink = document.getElementById('nav-about');
    var experienceLink = document.getElementById('nav-experience');

    if (aboutLink) {
        aboutLink.setAttribute('data-content', (language == 'en' ? "about" : "despre"));
    }

    if (experienceLink) {
        experienceLink.setAttribute('data-content', (language == 'en' ? "experience" : "experiență"));
    }
}

if (text) {
    for (let i = 0; i < text.innerText.length; i++) {
        newDom += '<span class="char">' + (text.innerText[i] == ' ' ? '&nbsp;' : text.innerText[i]) + '</span>';
    }

    text.innerHTML = newDom;
    var length = text.children.length;

    for (let i = 0; i < length; i++) {
        text.children[i].style['animation-delay'] = animationDelay * i + 'ms';
    }
}

function setDelay(number) {
    document.querySelector('.skill').setAttribute('data-aos-delay', number)
}


function toggleLanguage() {
    const currentIndex = availableLocales.indexOf(pageLanguage);

    // Calculate the index of the next locale
    const nextIndex = (currentIndex + 1) % availableLocales.length;

    // Set the new locale as the specified pageLanguage
    setLanguage(availableLocales[nextIndex]);
    setLanguageButtonLabel(availableLocales[nextIndex]);
}

function setLanguageButtonLabel(currentLanguage) {
    const currentIndex = availableLocales.indexOf(currentLanguage);

    // Calculate the index of the next locale
    const nextIndex = (currentIndex + 1) % availableLocales.length;


    languageButtonLabel = availableLocales[nextIndex];

    document.getElementById('language-btn').innerHTML = languageButtonLabel;
}