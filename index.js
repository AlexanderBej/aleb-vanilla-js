var text = document.getElementById('text');
var newDom = '';
var animationDelay = 200;
const availableLocales = ['en', 'ro'];
let theme_toggler = document.querySelector('#theme-toggler');

// Default locale.
const defaultLanguageIndex = 0;
const defaultLanguage = 'en';
let languageButtonLabel = 'en';

// Manually detect users' language, strip languages such as `en-GB` to just `en`.
let language = (window.navigator.userLanguage || window.navigator.language).substr(0, 2);

// Set `pageLanguage` only if its available within our locales, otherwise default.
let pageLanguage = defaultLanguage;
if (availableLocales.includes(language)) {
    pageLanguage = language;
}

document.addEventListener('DOMContentLoaded', function () {
    retrieveTheme();
    setCheckbox();

    const preferredLanguage = getStorageLanguage();

    // Apply the language to your website based on the preferredLanguage variable
    // You can have a separate function to handle the actual language switching logic
    setLanguage(preferredLanguage);
    document.getElementById('language-btn').innerHTML = preferredLanguage;
});

function getStorageLanguage() {
    return localStorage.getItem('preferredLanguage') || defaultLanguage; // Provide a default language if none is set
}

function setStorageLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
}


async function setLanguage(lang) {
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

            setDataContent(lang);
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });

}



function setDataContent(language) {
    const elementIds = ['nav-about', 'nav-experience', 'nav-portfolio'];
  
    elementIds.forEach((elementId) => {
      const linkElement = document.getElementById(elementId);
  
      if (linkElement) {
        switch (elementId) {
          case 'nav-about':
            linkElement.setAttribute('data-content', language === 'en' ? 'about' : 'despre');
            break;
          case 'nav-experience':
            linkElement.setAttribute('data-content', language === 'en' ? 'experience' : 'experiență');
            break;
          case 'nav-portfolio':
            linkElement.setAttribute('data-content', language === 'en' ? 'portfolio' : 'portofoliu');
            break;
        }
      }
    });
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


function toggleLanguage() {
    const currentIndex = availableLocales.indexOf(pageLanguage);

    // Calculate the index of the next locale
    const nextIndex = (currentIndex + 1) % availableLocales.length;

    // Set the new locale as the specified pageLanguage
    setLanguage(availableLocales[nextIndex]);
    document.getElementById('language-btn').innerHTML = availableLocales[nextIndex];
}


theme_toggler.addEventListener('click', function () {
    theme_toggler.classList.add('transition-time');
    document.body.classList.toggle('light_mode');
    if (document.body.classList.contains('light_mode')) {
        localStorage.setItem('website_theme', 'light_mode');
    } else {
        localStorage.setItem('website_theme', 'default');
    }
});

theme_toggler.addEventListener("animationend", () => {
    theme_toggler.classList.remove('transition-time');
});

function retrieveTheme() {
    var theme = localStorage.getItem('website_theme');
    if (theme != null) {
        document.body.classList.remove('default', 'light_mode');
        document.body.classList.add(theme);
    }
}

function setCheckbox() {
    var theme = localStorage.getItem('website_theme');
    if (theme != null) {
        if (document.body.classList.contains('light_mode')) {
            document.getElementById("theme-toggler").checked = true;
        } else {
            document.getElementById("theme-toggler").checked = false;
        }
    }
}

/* toggleDropdown toggles between adding and removing the show class, which is used to hide and show the dropdown content */
function toggleDropdown() {
    document.getElementById("dropdown-box").classList.toggle("show");
    document.getElementById("dropdown-btn").classList.toggle("change");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {

    if (!event.target.matches('.dropdown-btn') && !event.target.matches('.bar')) {

        var dropdownBox = document.getElementById("dropdown-box");
        var dropdownButton = document.getElementById("dropdown-btn");

        if (dropdownBox.classList.contains('show')) {
            dropdownBox.classList.remove('show');
        }

        if (dropdownButton.classList.contains('change')) {
            dropdownButton.classList.remove('change');
        }
    }
};