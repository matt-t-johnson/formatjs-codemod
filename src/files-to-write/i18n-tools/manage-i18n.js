const formatjsCLI = require('@formatjs/cli');
const cp = require('child_process');
const glob = require('glob-fs')({ gitignore: true });
const fs = require('fs');

const files = glob.readdirSync("src/**/*.{js,jsx,ts,tsx}");
let extractedMessagesFile;

// TODO: make file paths configurable
// TODO: export as a module? Separate FormatJS CLI commands from translation manager

// extract messages
async function extractMessagesForTranslation(files) {
  await formatjsCLI.extractAndWrite(files, {
    outFile: 'build/extracted-messages.json',
    ignore: '**/types'
  });

  extractedMessagesFile = fs.readFileSync('build/extracted-messages.json');
}

// compile extracted messages into default language file
async function compileMessages(files) {
  await formatjsCLI.compileAndWrite(files, {
    outFile: 'src/i18n/locales/en-US.json',
  })
}

// extract array-format messages for default language file
async function extractMessageArray(files) {
  await formatjsCLI.extractAndWrite(files, {
    outFile: 'build/managed-messages/messages-array.json',
    ignore: '**/types',
    format: 'i18n-tools/custom-formatter.js'
  })
}

// run translation manager
async function runTranslationManager() {
  const translationManagerProcess = cp.spawn('node', ['i18n-tools/translation-manager.js']);

  translationManagerProcess.stdout.on('data', (data) => {
    // log output from script
    console.log(data.toString());
  });
  translationManagerProcess.stderr.on('data', (data) => {
    // log output from script
    console.log('Error while running translation manager: ', data.toString());
  });
}

function program() {
  return new Promise((resolve, reject) => {
    extractMessagesForTranslation(files)
      .then(() => {
        compileMessages(['build/extracted-messages.json']);
      })
      .then(() => {
        extractMessageArray(files);
      })
      .then(() => {
        runTranslationManager();
        return resolve();
      })
      .catch(err => {
        console.log('error :>> ', err);
        return reject(err);
      })
  })

}

program();
