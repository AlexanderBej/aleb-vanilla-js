// Constants
const animationDelay = 200;
const availableLocales = ['en', 'ro'];
const defaultLanguage = 'en';
const defaultLanguageIndex = 0;

// DOM Elements
const textElement = document.getElementById('text');
const themeToggler = document.querySelector('#theme-toggler');
const languageButton = document.getElementById('language-btn');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializePage);
if (themeToggler) {
    themeToggler.addEventListener('click', toggleTheme);
    themeToggler.addEventListener('animationend', removeTransitionClass);
}
if (languageButton) {
    languageButton.addEventListener('click', toggleLanguage);
}

// Initialization function
function initializePage() {
    retrieveTheme();
    setCheckbox();
    const preferredLanguage = getStorageLanguage();
    setLanguage(preferredLanguage);
    if (languageButton) {
        languageButton.innerHTML = preferredLanguage;
    }
}

// Language Functions
function getStorageLanguage() {
    return localStorage.getItem('preferredLanguage') || defaultLanguage;
}

function setStorageLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
}

async function setLanguage(lang) {
    setStorageLanguage(lang);
    const elements = document.querySelectorAll('[data-i18n]');
    const jsonFilePath = `./locales/i18n/${lang}.json`;

    try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), data);
            element.innerHTML = text;
        });

        const htmlElement = document.querySelector('html');
        htmlElement.setAttribute('lang', lang);
        pageLanguage = lang;

        setDataContent(lang);
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

function setDataContent(language) {
    const elementTranslations = {
        'nav-about': { en: 'about', ro: 'despre' },
        'nav-experience': { en: 'experience', ro: 'experiență' },
        'nav-projects': { en: 'projects', ro: 'proiecte' }
    };

    Object.entries(elementTranslations).forEach(([elementId, translations]) => {
        const linkElement = document.getElementById(elementId);
        if (linkElement) {
            linkElement.setAttribute('data-content', translations[language]);
        }
    });
}

// Theme Functions
function toggleTheme() {
    themeToggler.classList.add('transition-time');
    document.body.classList.toggle('light_mode');
    const theme = document.body.classList.contains('light_mode') ? 'light_mode' : 'default';
    localStorage.setItem('website_theme', theme);
}

function removeTransitionClass() {
    themeToggler.classList.remove('transition-time');
}

function retrieveTheme() {
    const theme = localStorage.getItem('website_theme');
    if (theme) {
        document.body.classList.remove('default', 'light_mode');
        document.body.classList.add(theme);
    }
}

function setCheckbox() {
    const theme = localStorage.getItem('website_theme');
    if (theme && themeToggler) {
        document.getElementById("theme-toggler").checked = theme === 'light_mode';
    }
}

// Dropdown Functions
function toggleDropdown() {
    const dropdownBox = document.getElementById("dropdown-box");
    const dropdownButton = document.getElementById("dropdown-btn");
    if (dropdownBox && dropdownButton) {
        dropdownBox.classList.toggle("show");
        dropdownButton.classList.toggle("change");
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    const dropdownBox = document.getElementById("dropdown-box");
    const dropdownButton = document.getElementById("dropdown-btn");
    if (dropdownBox && dropdownButton && !event.target.matches('.dropdown-btn') && !event.target.matches('.bar')) {
        if (dropdownBox.classList.contains('show')) {
            dropdownBox.classList.remove('show');
        }
        if (dropdownButton.classList.contains('change')) {
            dropdownButton.classList.remove('change');
        }
    }
};