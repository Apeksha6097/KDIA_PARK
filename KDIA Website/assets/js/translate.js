// Cookie helper functions
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    
    // Also try setting for current hostname
    var host = window.location.hostname;
    document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + host;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Check current language preference
var currentLang = 'en';
var googtrans = getCookie('googtrans');
if (googtrans) {
    if (googtrans.includes('/hi')) {
        currentLang = 'hi';
    }
} else if (localStorage.getItem('preferredLanguage') === 'hi') {
    currentLang = 'hi';
}

// Redirect/Reload to match localStorage and cookie
if (currentLang === 'hi' && (!googtrans || !googtrans.includes('/hi'))) {
    setCookie('googtrans', '/en/hi', 1);
    location.reload();
} else if (currentLang === 'en' && googtrans && googtrans.includes('/hi')) {
    setCookie('googtrans', '/en/en', 1);
    setCookie('googtrans', '', -1); // Clear it
    location.reload();
}

// Toggle language function
window.toggleLanguage = function() {
    if (currentLang === 'en') {
        localStorage.setItem('preferredLanguage', 'hi');
        setCookie('googtrans', '/en/hi', 1);
    } else {
        localStorage.setItem('preferredLanguage', 'en');
        setCookie('googtrans', '/en/en', 1);
        setCookie('googtrans', '', -1); // Clear it
    }
    location.reload();
};

// Initialize Google Translate Element
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

// Insert necessary elements on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // 1. Create hidden element for Google Translate
    if (!document.getElementById('google_translate_element')) {
        var gDiv = document.createElement('div');
        gDiv.id = 'google_translate_element';
        gDiv.style.display = 'none';
        document.body.appendChild(gDiv);
    }

    // 2. Inject Google Translate script dynamically if not present
    if (!document.querySelector('script[src*="element.js"]')) {
        var gScript = document.createElement('script');
        gScript.type = 'text/javascript';
        gScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(gScript);
    }

    // 3. Inject CSS to hide google translate UI wrapper
    var style = document.createElement('style');
    style.innerHTML = `
        iframe.goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; }
        .goog-tooltip, .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        #google_translate_element { display: none !important; }
        .goog-te-spinner-pos { display: none !important; }
    `;
    document.head.appendChild(style);

    // 4. Update all language toggle buttons
    var toggleButtons = document.querySelectorAll('.lang-toggle-btn');
    toggleButtons.forEach(function(btn) {
        var btnText = btn.querySelector('.lang-btn-text');
        if (btnText) {
            btnText.textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
        }
    });
});
