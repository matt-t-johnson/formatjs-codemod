# i18n-tools

The scripts in this folder are intended to make it easier to manage internationalization in your project.

- **manage-i18n.js** uses [@formatjs/cli](https://www.npmjs.com/package/@formatjs/cli) to extract the i18n messages defined in your code, create / update the language file for your project's default locale, and runs the `translation-manager.js` script to maintain the other supported language files.
- **custom-formatter.js** is a custom format definition used in the `manage-i18n.js` script to extract messages into a format that the `translation-manager.js` script can use
- **translation-manager.js** establishes the config used by [react-intl-translations-manager](https://www.npmjs.com/package/react-intl-translations-manager) to create and update language files for each of the locales your project supports (those listed in the `managedLanguages` constant in the `i18n-constants.js` file).
Despite the name, `react-intl-translation-manager` is not react specific, you just have to input i18n message descriptors to it in the format specified by `custom-formatter.js`.
