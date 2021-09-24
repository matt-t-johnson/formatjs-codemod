#!/usr/bin/env node
const { cwd } = require('process');
const path = require('path');
const core = require('./core');
const { Command } = require('commander');
const logger = require('./logger');
const utils = require('./utils');

const program = new Command();

program.version('0.0.1');

// TODO: Refine option descriptions
program
  .requiredOption('-s, --src <path>', 'source directory')
  .requiredOption('-o, --output <path>', 'path to directory where i18n source code should be generated')
  .option('-t, --tools-output <path>', 'path to directory where i18n tools / scripts should be generated', './i18n-tools')
  .requiredOption('-i, --inclusions <list...>', 'comma separated string specifying which files / folders to parse', utils.commaSeparatedList, ['**/*.js','**/*.jsx','**/*.ts','**/*.tsx'])
  .requiredOption('-e, --exclusions <list...>', 'comma separated string specifying which files / folders to ignore', utils.commaSeparatedList, ['**/*.test.'])
  .option('-d, --defaultLocale <locale>', 'specifies what the default locale will be for the project', 'en-US')
  .requiredOption('-l, --locales <list...>', 'comma separated string specifying which locales the project will support', utils.commaSeparatedList)
  // TODO: add option
  // .addOption(new Option('--shell <name>', 'the shell to use when running the script to install dependencies').choices(['bash', 'sh', 'powershell', 'ksh']))
  .option('--no-install', 'print the required dependencies rather than automatically installing them')
  .option('--no-utils', 'skips creating the files designed to help manage i18n in your project')
  // TODO: add option
  // .option('--no-inline', 'specifies that message definitions should be created in separate files rather then in the files where they are used')

program.parse(process.argv);

const options = program.opts();
const SOURCE_DIR_PATH = path.join(cwd(), options.src);

// TODO: move dependency values to a single source of truth or documentation page
const requiredDependencies = ['@formatjs/intl'];
const recommendedDependencies = ['js-cookie'];
const requiredDevDependencies = ['@formatjs/cli', 'eslint-plugin-formatjs'];
const recommendedDevDependencies = ['react-intl-translations-manager', 'glob-fs'];

async function run() {
  logger.line();
  logger.header('reformatjs');
  logger.info('Options: ', options);

  /* RECURSIVELY READ PROJECT DIRECTORY AND PARSE INCLUDED FILES */
  // logger.line();
  logger.section(`Traversing source directory ${options.src} and parsing included files`)
  await core.traverseDirectory(SOURCE_DIR_PATH, options);

  await core.generateSharedMessageFile(options);
  await core.generateConstantsFile(options);

  /* INSTALL I18N PROJECT DEPENDENCIES */
  if (!options.noInstall) {
    await core.installDependencies();
  } else {
    logger.line();
    logger.info('Skipping dependency installation');
    // TODO: replace the following logs with a link to documentation about the various dependencies needed
    logger.info(`The following dependencies are required for using FormatJS: ${JSON.stringify(...requiredDependencies)}`);
    logger.info(`The following dev dependencies are required for using FormatJS: ${JSON.stringify(...requiredDevDependencies)}`);
    logger.info(`The following dependencies are required for using reformatjs helper files: ${JSON.stringify(...recommendedDependencies)}`);
    logger.info(`The following dev dependencies are recommended for managing i18n files and required for using reformatjs helper files: ${JSON.stringify(...recommendedDevDependencies)}`);
  }

  if (!options.noUtils) {
    /* CREATE I18N DIRECTORY IN SOURCE PROJECT */
    await core.buildI18nFolderInProject(options);
  } else {
    logger.line();
    logger.info('Skipping i18n helper file creation. You will need to create your own way of managing language files, user locale, etc. in your project.');
    // TODO: log a link to documentation showing what helper files are available
  }

  logger.line();
  // TODO: update success message for cases where users don't install helper files
  logger.success(`Your project has been updated! See ${options.toolsOutput}/README.md for instructions on how to manage your localized project.`);
  logger.line();
}
logger.info(`The following packages are required for using FormatJS: ${JSON.stringify(requiredDependencies)}`);


/* PROGRAM START */
run();
