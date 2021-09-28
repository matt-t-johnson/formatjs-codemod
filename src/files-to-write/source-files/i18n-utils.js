// i18n utils
import Cookie from 'js-cookie';

const { defaultLocale, releasedLanguages } = require('./i18n-constants');

/* Safely sets the supported language list with a default.
 * Replace releasedLanguages with your own environment specific list of
 * supported languages. */
const supportedLangs = releasedLanguages || [defaultLocale];

/* Gets the user locale, first checking to see if a locale cookie has been
 * set by the user changing the language in the UI. If no cookie exists, the * default locale is used. */
export function getLocale() {
  const cookieLocale = Cookie.get('locale');
  const cookieIsValid = supportedLangs.includes(cookieLocale);

  if (cookieLocale && cookieIsValid) return cookieLocale;
  return defaultLocale;
}
