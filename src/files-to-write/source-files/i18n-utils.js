// i18n utils
import { createIntl, createIntlCache } from '@formatjs/intl';
import Cookie from 'js-cookie'; //TODO replace with AI locale value

const { defaultLocale, releasedLanguages } = require('./i18n-constants');

/* Safely sets the supported language list with a default.
 *
 * Replace releasedLanguages with your own environment specific list of
 * supported languages. */
const supportedLangs = releasedLanguages || [defaultLocale];

/* Gets the user locale, first checking to see if a locale cookie has been set
 * by the user changing the language in the UI. If no cookie exists, the locale
 * is taken from the auiUser object where it is set in server/index.js */
export function getLocale() {
  // It is possible for userLocale to be undefined if the server rendered /404 route is hit (without /orr)
  const userLocale = window.auiUser && window.auiUser.locale;
  const cookieLocale = Cookie.get('locale');
  const cookieIsValid = supportedLangs.includes(cookieLocale);

  if (cookieLocale && cookieIsValid) return cookieLocale;
  if (userLocale) return userLocale;
  return defaultLocale;
}

// This is optional but highly recommended since it prevents memory leak
const cache = createIntlCache();

// creates a new intl object for for a given locale
export function initIntl(locale) {
  const intl = createIntl(
    {
      defaultLocale,
      locale,
      messages: require(`./locales/${locale}`),
    },
    cache
  );
  console.log('intl :>> ', intl);
  window.intl = intl;
}

export function getIntl(locale = getLocale()) {
  if (!window.intl || window.intl.locale !== locale) {
    // only want to recreate if locale changes
    initIntl(locale);
  }

  return window.intl;
}
