// TODO: these configs should be generated from locales specified in CLI options
const locales = {
  ENGLISH: 'en-US',
  GERMAN: 'de-DE',
  CHINESE_SIMPLIFIED: 'zh-CN',
};

// default settings
const defaultLocale = locales.ENGLISH;
const releasedLanguages = [
  defaultLocale,
];

/* Languages managed by the translation manager tool.
 * Default English language file is compiled separately. */
const managedLanguages = [
  locales.GERMAN,
  locales.CHINESE_SIMPLIFIED,
];

/* The full list of languages we aim to support but which may not be
 * released to users yet. */
const allLanguages = [
  locales.ENGLISH,
  ...managedLanguages,
];

module.exports = {
  defaultLocale,
  releasedLanguages,
  managedLanguages,
  allLanguages,
  locales,
};
