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

translations['en-US'].vrInstructions = 'Enter VR via the button and use left thumbstick to move and fly.';
translations['pt-BR'].vrInstructions = 'Entre no modo VR pelo botão e use o analógico esquerdo para mover e voar.';

function detectLang() {
  const navLang = (navigator.language || navigator.userLanguage || 'en-US').toLowerCase();
  if (navLang.startsWith('pt')) return 'pt-BR';
  return 'en-US';
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations['en-US'];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

applyTranslations(detectLang());

export { applyTranslations, detectLang, translations };