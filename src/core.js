const cp = require('child_process');
const os = require('os');
const fs = require('fs');
const { cwd } = require('process');
const path = require('path');
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const minimatch = require("minimatch");
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
async function traverseDirectory(directory, options) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    currentFilePath = fullPath;

    // TODO: Add support for other file extensions
    const fileExtensionsToParse = ['js', 'jsx'];
    const canParse = fileExtensionsToParse.includes(file.split('.').pop());

    let shouldParseFile = canParse;
    const include = options.inclusions.some(glob => minimatch(fullPath, glob));
    const exclude = options.exclusions.forEach(glob => minimatch(fullPath, glob));

    if (!include) shouldParseFile = false;
    if (exclude) shouldParseFile = false;

    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath, options);
    } else if (shouldParseFile) {
      console.log('Parsing File into AST', fullPath);
      const buffer = fs.readFileSync(fullPath).toString();
      let ast = astBuilders.parseToAst(buffer);
      console.log('AST Step Complete');
      ast = traverseAst(ast, options);
      console.log('Traverse / Modify Step Complete');
      generateNewCodeAndWrite(ast, buffer, fullPath, options)
      console.log('Generate And Write Step Complete');
      console.log('********************************************************');
      console.log('Process Complete For: ', fullPath);
      console.log('********************************************************');
    }
  });
}

/* STEP 3: TRAVERSE AST AND MODIFY NODES */
// Initialize list of MessageDescriptor objects
function traverseAst(ast, options) {
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
        const pathToSharedMessages = path.relative(currentFilePath, path.join(options.output, './shared-messages'));
        const importSharedMessagesNode = astBuilders.buildImportNode('sharedMessages', pathToSharedMessages);

        if (!messagesImported) {
          // Import required sharedMessages file (only once)
          parentProgramPath.unshiftContainer('body', importSharedMessagesNode);
          messagesImported = true;
        }

        // add imports for intl object
        const pathToIntl = path.relative(currentFilePath, path.join(options.output, './intl'));
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
function generateNewCodeAndWrite(ast, buffer, filePath, options) {
  const output = generate(ast, { /* options */ }, buffer);

  const outputPath = path.join(cwd(), options.output);
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

  generateConstantsFile(options);
}

function generateConstantsFile(options) {
  const constantsOutput = generate(astBuilders.buildConstantsFileAst(options.locales, options.defaultLocale)).code;
  const outputPath = path.join(cwd(), options.output);

  if (!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
  }
  fs.writeFileSync(`${outputPath}/i18n-constants-dynamic.js`, constantsOutput);
}

/* INSTALL I18N PROJECT DEPENDENCIES */
// TODO: pass shell as arg for testing?
async function installDependencies() {
  var installSpawn = cp.spawn(`${shell}`, ['../../src/scripts/install-dependencies.sh'], { shell: shell});

  for await (const data of installSpawn.stdout) {
    console.log(data.toString());
  }
  for await (const data of installSpawn.stderr) {
    console.log('Error installing dependencies: ', data.toString());
  }
}

/* CREATE I18N DIRECTORY IN SOURCE PROJECT */
async function buildI18nFolderInProject(options) {
  const toolsOutputPath = path.join(cwd(), options.toolsOutput);
  const sourceOutputPath = path.join(cwd(), options.output);
  const sourceFilesToCopyPath = path.join(__dirname, '/files-to-write');

  var buildI18nSpawn = cp.spawn(
    `${shell}`,
    ['../../src/scripts/build-i18n-folder.sh', `-f ${sourceFilesToCopyPath}`, `-t ${toolsOutputPath}`, `-s ${sourceOutputPath}`],
    { shell: shell}
  );

  for await (const data of buildI18nSpawn.stdout) {
    console.log(data.toString());
  }
  for await (const data of buildI18nSpawn.stderr) {
    console.log('Error creating i18n files: ', data.toString());
  }
}

module.exports = {
  traverseDirectory,
  traverseAst,
  generateNewCodeAndWrite,
  installDependencies,
  buildI18nFolderInProject,
};