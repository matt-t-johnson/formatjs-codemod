const parser = require("@babel/parser");
const t = require("@babel/types");

// AST modifier functions
/* STEP 2: PARSE CODE INTO AN AST */
function parseToAst(buffer) {
  const ast = parser.parse(buffer, {
    sourceType: "module",
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

module.exports = {
  buildImportNode,
  buildSharedMessageFileAst,
  buildVariableFromExpression,
  parseToAst,
};