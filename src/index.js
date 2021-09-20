const fs = require('fs');
const path = require('path');
const core = require('./core');

// TODO: update all paths to be run from config.projectPath
// TODO: update i18n files that get copied over to source project

// TODO: get config from command line argument parser like:
  // - https://www.npmjs.com/package/command-line-args ?
  // - https://www.npmjs.com/package/minimist
let configPath = '';
let CONFIG_PATH = '';
configPath = process.argv[3];

if(configPath) {
  CONFIG_PATH = path.join(__dirname, configPath);

  fs.access(CONFIG_PATH, fs.F_OK, (err) => {
    if (err) {
      console.log('Config file provided does not exist', CONFIG_PATH);
      console.error(err);
      return;
    }
    //file exists
  })
} else {
  CONFIG_PATH = './config';
}

const config = require(CONFIG_PATH);
const SOURCE_DIR_PATH = path.join(__dirname, config.projectPath, config.sourceDirectory);

function program() {
  /* RECURSIVELY READ PROJECT DIRECTORY AND PARSE INCLUDED FILES */
  core.traverseDirectory(SOURCE_DIR_PATH, config);

  /* INSTALL I18N PROJECT DEPENDENCIES */
  core.installDependencies();

  /* CREATE I18N DIRECTORY IN SOURCE PROJECT */
  core.buildI18nFolderInProject(config);

  // TODO: run final message after all dependencies have finished installing. It is running too early.
  console.log(`Your project has been updated! See ${config.sourceOutputDirectory}/README.md for instructions on how to manage your localized project.`);
  console.log('********************************************************');
}


/* PROGRAM START */
program();
