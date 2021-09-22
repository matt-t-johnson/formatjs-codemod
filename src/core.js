const cp = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const astBuilders = require('./ast-builders');
const utils = require('./utils');

const OS_PLATFORM = os.platform();
const platformShells = {
  'darwin': 'bash',
  'linux': 'bash',
  'freebsd': 'sh',
  'win32': 'powershell',
  'openbsd': 'ksh',
  'sunos': 'sh',
};
const shell = platformShells[OS_PLATFORM];
let processMessages = {};
let currentFilePath;

/* RECURSIVELY READ PROJECT DIRECTORY AND PARSE INCLUDED FILES */
function traverseDirectory(directory, config) {
  fs.readdirSync(directory).forEach(file => {
    // temp rules for whether to include file in process (TODO get lists from config arguments)
    const fileExtensionsToParse = ['js', 'jsx'];
    const canParse = fileExtensionsToParse.includes(file.split('.').pop());
    const exclusionList = ['shared-messages.js'];
    const inclusionList = ['App.js', 'ChildComponent.jsx'];

    let shouldParseFile = canParse;
    if (inclusionList.length > 0 && !inclusionList.includes(file)) shouldParseFile = false;
    if (exclusionList.length > 0 && exclusionList.includes(file)) shouldParseFile = false;

    const fullPath = path.join(directory, file);
    currentFilePath = fullPath;
    if (fs.lstatSync(fullPath).isDirectory()) {
      console.log(fullPath);
      traverseDirectory(fullPath, config);
    } else if (shouldParseFile) {
      console.log('Parsing File into AST', fullPath);
      const buffer = fs.readFileSync(fullPath).toString();
      let ast = astBuilders.parseToAst(buffer);
      console.log('AST Step Complete');
      ast = traverseAst(ast, config);
      console.log('Traverse / Modify Step Complete');
      generateNewCodeAndWrite(ast, buffer, fullPath, config)
      console.log('Generate And Write Step Complete');
      console.log('********************************************************');
      console.log('Process Complete For: ', fullPath);
      console.log('********************************************************');
    }
  });
}

/* STEP 3: TRAVERSE AST AND MODIFY NODES */
// Initialize list of MessageDescriptor objects
function traverseAst(ast, config) {
  const messages = {};
  let messagesImported = false;
  let intlObjectImported = false;
  let intlObjectInitialized = false;

  // TODO: PRIORITY: handle cases where dynamic content needs to be translated.
  //    Ex: intl.formatMessage(returnTileMessages.returnPeriod, { startMonth, endMonth });

  traverse(ast, {
    JSXText: function(nodePath) {
      const nodeValue = nodePath.node.value;
      const isNonEmptyString = typeof nodeValue === 'string' && nodeValue.trim().length > 0;
      if (isNonEmptyString) {
        const trimmedValue = nodeValue.trim();

        // create MessageDescriptor for text
        const camelCaseValue = utils.toCamelCaseString(nodeValue);
        const messageDescriptor = {
          id: camelCaseValue,
          defaultMessage: trimmedValue,
        };

        messages[camelCaseValue] = messageDescriptor;
        processMessages = { ...processMessages, ...messages };

        // wrap original text in formatMessage function
        // assumes sharedMessages has been imported to the file containing the text
        nodePath.node.value = `{intl.formatMessage(sharedMessages.${camelCaseValue})}`;

        // add import for shared message file
        const parentProgramPath = nodePath.findParent((p) => p.isProgram());
        const pathToSharedMessages = path.relative(currentFilePath, path.join(config.projectPath, config.sourceOutputDirectory, './shared-messages'));
        const importSharedMessagesNode = astBuilders.buildImportNode('sharedMessages', pathToSharedMessages);

        if (!messagesImported) {
          // Import required sharedMessages file (only once)
          parentProgramPath.unshiftContainer('body', importSharedMessagesNode);
          messagesImported = true;
        }

        // add imports for intl object
        const pathToIntl = path.relative(currentFilePath, path.join(config.projectPath, config.sourceOutputDirectory, './intl'));
        const parentComponentPath = nodePath.findParent(p => {
          if (p.isFunctionDeclaration() || p.isClassDeclaration()) return true;
          return false;
        });
        const importIntlObjectNode = astBuilders.buildImportNode('getIntl', pathToIntl);
        const initIntlObjectNode = astBuilders.buildVariableFromExpression({
          varType: 'const',
          variableName: 'intl',
          expressionName: 'getIntl',
          expressionArguments: []
        });

        if (!intlObjectImported) {
          parentProgramPath.unshiftContainer('body', importIntlObjectNode);
          intlObjectImported = true;
        }

        if (!intlObjectInitialized) {
          // TODO: Consider moving this node within the function / class definition that needs it.
          parentComponentPath.insertBefore(initIntlObjectNode);
          intlObjectInitialized = true;
        }

      }
    },
    // Literal: function(path) {
    //   // may be used for non React projects
    // },
    // TODO: skip traversing irrelevant nodes with path.skip()
  });

  return ast;
}

/* STEP 4: GENERATE NEW CODE FROM MODIFIED AST */
function generateNewCodeAndWrite(ast, buffer, filePath, config) {
  const output = generate(ast, { /* options */ }, buffer);

  // TODO: re-visit output path location / naming
  const outputPath = path.join(__dirname, config.projectPath, config.sourceOutputDirectory);
  fs.writeFileSync(filePath, output.code);

  /* STEP 5: CREATE SHARED MESSAGES FILE */
  const messagesBuffer = JSON.stringify(processMessages);
  const messagesAst = parser.parseExpression(messagesBuffer);
  const sharedMessagesFileAst = astBuilders.buildSharedMessageFileAst(messagesAst);
  // Parses the newly created shared message file to remove the quotes from
  // object properties, otherwise the i18n management script fails.
  // This could probably be improved to avoid traversing it again.
  traverse(sharedMessagesFileAst, {
    ObjectProperty: function(nodePath) {
      if (t.isStringLiteral(nodePath.node.key)) {
        nodePath.node.key = t.Identifier(nodePath.node.key.value);
      }
    }
  })

  const messageFileOutput = generate(sharedMessagesFileAst).code;

  if (!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
  }
  fs.writeFileSync(`${outputPath}/shared-messages.js`, messageFileOutput);
}

/* INSTALL I18N PROJECT DEPENDENCIES */
// TODO: pass shell as arg for testing?
function installDependencies() {
  var installSpawn = cp.spawn(`${shell}`, ['../../src/scripts/install-dependencies.sh'], { shell: shell});
  installSpawn.stdout.on('data', (data) => {
    // log output from script
    console.log(data.toString());
  });
  installSpawn.stderr.on('data', (data) => {
    // log output from script
    console.log('Error installing dependencies: ', data.toString());
  });
}

/* CREATE I18N DIRECTORY IN SOURCE PROJECT */
function buildI18nFolderInProject(config) {
  const toolsOutputPath = path.join(__dirname, config.projectPath, config.toolsOutputDirectory);
  const sourceOutputPath = path.join(__dirname, config.projectPath, config.sourceOutputDirectory);
  const sourceFilesToCopyPath = path.join(__dirname, '/files-to-write');

  var buildI18nSpawn = cp.spawn(
    `${shell}`,
    ['../../src/scripts/build-i18n-folder.sh', `-f ${sourceFilesToCopyPath}`, `-t ${toolsOutputPath}`, `-s ${sourceOutputPath}`],
    { shell: shell}
  );
  buildI18nSpawn.stdout.on('data', (data) => {
    // log output from script
    console.log(data.toString());
  });
  buildI18nSpawn.stderr.on('data', (data) => {
    // log output from script
    console.log('Error creating i18n files: ', data.toString());
  });
}

module.exports = {
  traverseDirectory,
  traverseAst,
  generateNewCodeAndWrite,
  installDependencies,
  buildI18nFolderInProject,
};