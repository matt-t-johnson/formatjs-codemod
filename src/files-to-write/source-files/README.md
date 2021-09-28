# i18n

## locales
This folder houses two types of files:

1. Language files
2. Whitelist files

### Language files
- These files contain all of the messages [defined](https://formatjs.io/docs/intl#definemessagesdefinemessage) via FormatJS and that will be imported by the app and exposed through the [intl object](https://formatjs.io/docs/intl#the-intl-object).
- Each file is named after the locale they represent: `[locale].json`
- The language files are in a flat JSON format where the keys represent the unique message descriptor ID and the values represent the translated value of the message in the given locale.
- The language file for your default locale does not ever need to be updated manually. It is kept up to date by the i18n scripts.
- Non-default language files need to have their translations updated manually, but if any messages are added / removed from the project they will also be added to / removed from the other language files by the i18n scripts. New messages will have the default message value when they are first added.

### Whitelist files
- Each locale has a whitelist file created by the i18n scripts
- These files allow you to specify a list of message IDs for which the translated value is identical to the default value. This is so the i18n scripts know whether or not to print a warning about messages still needing to be translated for each language file.

## i18n-constants.js
This file establishes the locales supported by your project and how they should be treated.

- `locales` maps the actual locale values used in the project to a constant
- `defaultLocale` specifies which language file should be used in the app by default
- `releasedLanguages` specifies which locales should be available in production / testing environments.
- `managedLanguages` specifies which locales should have a language file created / maintained by the i18n scripts. Typically this includes all locales the project intends to support *except* for the default locale.
- `allLanguages` combines the `managedLanguages` with the default locale. This is typically the list of languages you would support in development environments.

## i18n-utils.js
This file exports utility functions related to project internationalization such as getting the current locale.

## intl.js
This file exposes the [intl object](https://formatjs.io/docs/intl#the-intl-object) which stores the default locale, current locale, and currently loaded messages as well as the FormatJS functions used to format messages for various locales.

The `getIntl` functions is exported by default which will get the current `intl` context or create one if it does not exist.

To access the `intl` object, simply import it and invoke the `getIntl` function.

```
import getIntl from "./i18n/intl";
import sharedMessages from "./i18n/shared-messages";
const intl = getIntl();

function App() {
  return (
    <div className="App">
      <p>
        {intl.formatMessage(sharedMessages.helloWorld)}
      </p>
    </div>
  );
}
```

## shared-messages.js
This is the default file created by `reformatjs` to store the message definitions for text found in your project. You can use this to define common strings used in multiple places in your app or replace this with your own system.