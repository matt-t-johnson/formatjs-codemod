const manageTranslations = require('react-intl-translations-manager').default;
const { managedLanguages } = require('../src/i18n/i18n-constants');

manageTranslations({
  // Note: paths are relative to the project's root directory
  messagesDirectory: 'build/managed-messages',
  translationsDirectory: 'src/i18n/locales',
  whitelistsDirectory: 'src/i18n/locales/whitelists',
  languages: managedLanguages,
  detectDuplicateIds: true,
});
