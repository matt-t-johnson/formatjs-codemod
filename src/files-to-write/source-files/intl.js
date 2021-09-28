import { createIntl, createIntlCache } from '@formatjs/intl';
import { getLocale } from './i18n-utils';
import { defaultLocale } from './i18n-constants';
let messages = require(`./locales/${defaultLocale}`);

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();


// TODO: get rid of this file or remove these functions from i18n-utils.js

// creates a new intl object for for a given locale
export function initIntl(locale) {
  messages = require(`./locales/${locale}`);
  window.intl = createIntl(
    {
      defaultLocale,
      locale,
      messages,
    },
    cache
  );
}

export default function getIntl(locale = getLocale()) {
  if (!window.intl || window.intl.locale !== locale) {
    // only want to recreate if locale changes
    initIntl(locale);
  }

  return window.intl;
}
