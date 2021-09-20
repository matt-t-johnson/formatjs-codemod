var config = {
  projectPath: '../example-projects/react-app',
  // projectPath: '../example-projects/react-typescript-app',
  // projectPath: '../example-projects/angular-app',
  sourceDirectory: './src', // directory within project to be parsed (could default to projectPath or ./src)
  sourceOutputDirectory: './src/i18n', //path to directory where i18n source code should be generated
  toolsOutputDirectory: './i18n-tools', //path to directory where i18n tooling code should be generated
  messageDefinitions: 'inline', //specify whether to define messages in the files where they are used or in separate files
  inclusions: '*.js,*.jsx', // comma delimited string: specify which files/folders to parse
  exclusions: '*.test.', // comma delimited string: specify which files/folders not to parse
  defaultLocale: 'en-GB',
  supportedLocales: []
};

module.exports = config;