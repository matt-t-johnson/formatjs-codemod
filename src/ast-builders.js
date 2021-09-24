const parser = require("@babel/parser");
const t = require("@babel/types");
const { languageNameLookup } = require("./utils");

// AST modifier functions
/* STEP 2: PARSE CODE INTO AN AST */
function parseToAst(buffer) {
  const ast = parser.parse(buffer, {
    sourceType: "module",
    // TODO: make plugins dynamic depending on included file types
    plugins: [
      "jsx",
      "typescript",
    ]
  });

  return ast;
}

// create node for import statement
function buildImportNode(moduleName, modulePath) {
  const identifier = t.identifier(moduleName);
  const importDefaultSpecifier = t.importDefaultSpecifier(identifier);
  const importDeclaration = t.importDeclaration([importDefaultSpecifier], t.stringLiteral(modulePath))

  return importDeclaration;
}

function buildSharedMessageFileAst(messagesAst) {
  const importFormatJsDeclaration = buildImportNode('{ defineMessages }', '@formatjs/intl');

  // variable declaration
  const sharedMessagesIdentifier = t.identifier('sharedMessages');
  const callee = t.identifier('defineMessages');
  const callExpression = t.callExpression(callee, [messagesAst]);
  const variableDeclarator = t.variableDeclarator(sharedMessagesIdentifier, callExpression);
  const variableDeclaration = t.variableDeclaration('const', [variableDeclarator]);

  // export declaration
  const exportDeclaration = t.exportDefaultDeclaration(sharedMessagesIdentifier);

  const body = [
    importFormatJsDeclaration,
    variableDeclaration,
    exportDeclaration
  ];

  return t.file(t.program(body, [], 'module', null));
}

// creates a VariableDeclaration node initialized by a function call
// e.g. const intl = getIntl();
function buildVariableFromExpression({ varType = 'const', variableName, expressionName, expressionArgs = [] }) {
  const variableIdentifier = t.identifier(variableName);
  const callee = t.identifier(expressionName);
  const callExpression = t.callExpression(callee, expressionArgs);
  const variableDeclarator = t.variableDeclarator(variableIdentifier, callExpression);
  return t.variableDeclaration(varType, [variableDeclarator]);
}

// creates an i18n constants file based on the locale options specified through CLI
function buildConstantsFileAst(locales, defaultLocale) {
  // TODO: extract common var names to constants

  // variable declaration
  // build a map of language name to each specified locale e.g. chineseSimplified: 'zh-CN'
  function buildLocaleConstant(locale) {
    const languageKey = languageNameLookup(locale);
    return t.objectProperty(t.identifier(languageKey), t.stringLiteral(locale));
  }

  // add constants for each supported language
  const localeProperties = locales.map(x => buildLocaleConstant(x));
  // TODO: add constant for default locale
  localeProperties.push(buildLocaleConstant(defaultLocale));
  const localesVar = t.variableDeclaration(
    'const',
    [t.variableDeclarator(
      t.identifier('locales'),
      t.objectExpression(localeProperties)
    )]
  );

  const defaultLocaleVar = t.variableDeclaration(
    'const',
    [t.variableDeclarator(
      t.identifier('defaultLocale'),
      t.memberExpression(
        t.identifier('locales'),
        t.identifier(languageNameLookup(defaultLocale))
      )
    )]
  );

  const releasedLanguagesVar = t.variableDeclaration(
    'const',
    [t.variableDeclarator(
      t.identifier('releasedLanguages'),
      t.arrayExpression([t.identifier('defaultLocale')])
    )]
  );


  const languageNames = locales.map(x => languageNameLookup(x));
  const managedLanguageMemberExpressions = languageNames.map(lang => {
    return t.memberExpression(t.identifier('locales'), t.identifier(lang))
  });
  const managedLanguagesVar = t.variableDeclaration(
    'const',
    [t.variableDeclarator(
      t.identifier('managedLanguages'),
      t.arrayExpression(managedLanguageMemberExpressions)
    )]
  );

  const allLanguagesVar = t.variableDeclaration(
    'const',
    [t.variableDeclarator(
      t.identifier('allLanguages'),
      t.arrayExpression([
        t.memberExpression(t.identifier('locales'), t.identifier(languageNameLookup(defaultLocale))),
        t.spreadElement(t.identifier('managedLanguages'))
      ])
    )]
  )

  // export declaration
  const objectProperties = [
    t.objectProperty(t.identifier('defaultLocale'), t.identifier('defaultLocale'), false, true),
    t.objectProperty(t.identifier('releasedLanguages'), t.identifier('releasedLanguages'), false, true),
    t.objectProperty(t.identifier('managedLanguages'), t.identifier('managedLanguages'), false, true),
    t.objectProperty(t.identifier('allLanguages'), t.identifier('allLanguages'), false, true),
    t.objectProperty(t.identifier('locales'), t.identifier('locales'), false, true),
  ];
  const assignmentExpression = t.assignmentExpression(
    '=',
    t.memberExpression(t.identifier('module'), t.identifier('exports'), false),
    t.objectExpression(objectProperties)
  );
  const exportStatement = t.expressionStatement(assignmentExpression);

  const body = [
    localesVar,
    defaultLocaleVar,
    releasedLanguagesVar,
    managedLanguagesVar,
    allLanguagesVar,
    exportStatement,
  ];

  return t.file(t.program(body, [], 'module', null));
}

module.exports = {
  buildImportNode,
  buildSharedMessageFileAst,
  buildVariableFromExpression,
  parseToAst,
  buildConstantsFileAst,
};