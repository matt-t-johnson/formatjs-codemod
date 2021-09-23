#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const core = require('./core');
const { Command } = require('commander');

const program = new Command();

program.version('0.0.1');

function commaSeparatedList(value) {
  return value.split(',');
}

program
  .requiredOption('-s, --src <path>', 'source directory')
  .requiredOption('-o, --output <path>', 'path to directory where i18n source code should be generated')
  .option('-t, --toolsOutput <path>', 'path to directory where i18n tools / scripts should be generated', './i18n-tools')
  .option('-t, --toolsOutput <path>', 'path to directory where i18n tools / scripts should be generated', './i18n-tools')
  .requiredOption('-i, --inclusions <list...>', 'comma separated string specifying which files / folders to parse', commaSeparatedList, ['**/*.js','**/*.jsx','**/*.ts','**/*.tsx'])
  .requiredOption('-e, --exclusions <list...>', 'comma separated string specifying which files / folders to ignore', commaSeparatedList, ['**/*.test.'])
  .option('-d, --defaultLocale <locale>', 'specifies what the default locale will be for the project', 'en-US')
  .requiredOption('-l, --locales <list...>', 'comma separated string specifying which locales the project will support', commaSeparatedList)
  // .addOption(new Option('-z, --shell <name>', 'the shell to use when running the script to install dependencies').choices(['bash', 'sh', 'powershell', 'ksh']))
  .option('--no-install', 'print the required dependencies rather than automatically installing them')
  // .option('--no-inline', 'specifies that message definitions should be created in separate files rather then in the files where they are used')

program.parse(process.argv);

const options = program.opts();

console.log('options :>> ', options);

const SOURCE_DIR_PATH = path.join(__dirname, options.src);

// TODO break into separate commands that can be run independently
async function run() {
  /* RECURSIVELY READ PROJECT DIRECTORY AND PARSE INCLUDED FILES */
  await core.traverseDirectory(SOURCE_DIR_PATH, options)

  /* INSTALL I18N PROJECT DEPENDENCIES */
  if (!options.noInstall) {
    await core.installDependencies();
  } else {
    //TODO: Log out required dependencies
  }

  /* CREATE I18N DIRECTORY IN SOURCE PROJECT */
  await core.buildI18nFolderInProject(options);
  // TODO: run final message after all dependencies have finished installing. It is running too early.
  console.log(`Your project has been updated! See ${options.output}/README.md for instructions on how to manage your localized project.`);
  console.log('********************************************************');
}


/* PROGRAM START */
run();
