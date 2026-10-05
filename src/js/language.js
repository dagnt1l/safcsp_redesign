const languageToggle = document.getElementById('language-toggle');
const savedLanguage = localStorage.getItem('language') || 'en';

async function setLanguage(language) {
  if (location.protocol === 'file:') {
    throw new Error('JSON translations cannot be loaded from file://. Serve the site over http (e.g. "npm start" or XAMPP).');
  }

  const response = await fetch(`./src/locales/${language}.json`);
  if (!response.ok) {
    throw new Error(`Unable to load the ${language} language file (${response.status}).`);
  }

  const translations = await response.json();
  const textUpdates = [...document.querySelectorAll('[data-i18n]')].map((element) => {
    const key = element.dataset.i18n;
    const text = translations[key];
    if (typeof text !== 'string') {
      throw new Error(`Missing "${key}" translation in ${language}.json.`);
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
      throw new Error(`Missing "${key}" translation in ${language}.json.`);
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

languageToggle.addEventListener('click', async () => {
  const nextLanguage = document.documentElement.lang === 'ar' ? 'en' : 'ar';
  languageToggle.disabled = true;

  try {
    await setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  } catch (error) {
    console.error('Failed to change the page language.', error);
  } finally {
    languageToggle.disabled = false;
  }
});

if (savedLanguage === 'ar') {
  setLanguage(savedLanguage).catch((error) => {
    console.error('Failed to restore the saved page language.', error);
  });
}
