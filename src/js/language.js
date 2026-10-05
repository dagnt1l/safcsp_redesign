const languageToggle = document.getElementById('language-toggle');
const savedLanguage = localStorage.getItem('language') || 'en';

async function setLanguage(language) {
  const translations = window.locales?.[language];
  if (!translations) {
    throw new Error(`Unable to find the ${language} language file.`);
  }

  const textUpdates = [...document.querySelectorAll('[data-i18n]')].map((element) => {
    const key = element.dataset.i18n;
    const text = translations[key];
    if (typeof text !== 'string') {
      throw new Error(`Missing "${key}" translation in ${language} locale.`);
    }

    const textNode = [...element.childNodes].find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '',
    );
    if (!textNode) {
      throw new Error(`No direct text node found for "${key}".`);
    }

    return { textNode, text };
  });

  const placeholderUpdates = [...document.querySelectorAll('[data-i18n-placeholder]')].map((element) => {
    const key = element.dataset.i18nPlaceholder;
    const text = translations[key];
    if (typeof text !== 'string') {
      throw new Error(`Missing "${key}" translation in ${language} locale.`);
    }

    return { element, text };
  });

  textUpdates.forEach(({ textNode, text }) => {
    textNode.textContent = text;
  });
  placeholderUpdates.forEach(({ element, text }) => {
    element.placeholder = text;
  });

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.classList.toggle('font-arabic', language === 'ar');
}

async function changeLanguage(language) {
  languageToggle.disabled = true;

  try {
    await setLanguage(language);
    localStorage.setItem('language', language);
    return true;
  } catch (error) {
    console.error('Failed to change the page language.', error);
    return false;
  } finally {
    languageToggle.disabled = false;
  }
}

languageToggle.addEventListener('click', () => {
  changeLanguage(document.documentElement.lang === 'ar' ? 'en' : 'ar');
});

if (savedLanguage === 'ar') {
  setLanguage(savedLanguage).catch((error) => {
    console.error('Failed to restore the saved page language.', error);
  });
}
