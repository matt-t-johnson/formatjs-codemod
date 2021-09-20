# formatjs-codemod

A codemod designed to refactor an existing project to be able to support internationalization (i18n) and localization (l10n) with the FormatJS set of libraries.

## Running on example projects
1. Navigate to the example project you want to test the tool against. E.g: `cd example-projects/react-app`
2. Run the main program `node ../../src/index.js`


## Files written to source project
This tool copies a few files over to the target project codebase.

`src/files-to-write/i18n-tools` includes scripts used to manage the process of extracting i18n messages from the codebase and compiling them into a format consumable by translation services such as Crowdin as well as the react-intl-translation-manager tool used to keep translation files up to date.
You can think of these as dev dependencies.

`src/files-to-write/source-files` contains files that will be used in the actual client code.
Some project bootstrappers (such as create-react-app) may require that these files to be in a specific directory (such as `/src`).