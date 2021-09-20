const manageTranslations = require('react-intl-translations-manager').default;
const { managedLanguages } = require('../src/i18n/i18n-constants');

// TODO does not seem to be writing translation files to target project
manageTranslations({
  messagesDirectory: '../build/managed-messages',
  translationsDirectory: '../src/i18n/locales',
  whitelistsDirectory: '../src/i18n/locales/whitelists',
  languages: managedLanguages,
  detectDuplicateIds: true,
});
