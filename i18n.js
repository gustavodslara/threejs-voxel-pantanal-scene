// Simple i18n detection and application (pt-BR / en-US)
// Extendable: add new language keys to translations object.

const translations = {
  'en-US': {
    heading: 'Three.js Voxel Rio Cuiabá',
    instructions: 'Use mouse to orbit | Scroll to zoom'
  },
  'pt-BR': {
    heading: 'Three.js Voxel Rio Cuiabá',
    instructions: 'Use o mouse para orbitar | Role para aproximar'
  }
};

// Add vr instruction keys with a friendly short text
translations['en-US'].vrInstructions = 'Enter VR via the button and use left thumbstick to move and fly.';
translations['pt-BR'].vrInstructions = 'Entre no modo VR pelo botão e use o polegar esquerdo para mover e voar.';

function detectLang() {
  const navLang = (navigator.language || navigator.userLanguage || 'en-US').toLowerCase();
  if (navLang.startsWith('pt')) return 'pt-BR';
  return 'en-US';
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations['en-US'];
  document.documentElement.lang = lang;
  // Iterate elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// Defer until DOM ready (module executes after parse)
applyTranslations(detectLang());

// Export helpers in case main.js wants to force language later
export { applyTranslations, detectLang, translations };