const parser = require("@babel/parser");
const fs = require('fs');
const path = require('path');
const astBuilders = require('../src/ast-builders');

// fixtures
const processMessagesFixture = require('./fixtures/process-messages');
const sharedMessageFileAstFixture = require('./fixtures/shared-message-file-ast');
const mockComponentAst = require('./fixtures/mock-react-component-ast.js');
const mockConstantsAst = require('./fixtures/constants-file-ast.js');

describe('ast-builders', () => {
  // test('parseToAst returns expected result', () => {
  //   const filePath = path.join(__dirname, './fixtures/mock-react-component.jsx');
  //   const buffer = fs.readFileSync(filePath).toString();
  //   expect(astBuilders.parseToAst(buffer)).toEqual(mockComponentAst);
  // });

  test('buildImportNode returns expected result', () => {
    const importNode = astBuilders.buildImportNode('foo', '../path/to/file');
    expect(importNode).toEqual({
      "source": {"type": "StringLiteral", "value": "../path/to/file"}, "specifiers": [{"local": {"name": "foo", "type": "Identifier"}, "type": "ImportDefaultSpecifier"}], "type": "ImportDeclaration"
    });
  });

  test('buildSharedMessageFileAst returns expected result', () => {
    const messagesBuffer = JSON.stringify(processMessagesFixture);
    const messagesAst = parser.parseExpression(messagesBuffer);
    const messageFileAst = astBuilders.buildSharedMessageFileAst(messagesAst);
    expect(messageFileAst).toEqual(sharedMessageFileAstFixture);
  });

  test('buildVariableFromExpression', () => {
    const result = astBuilders.buildVariableFromExpression({
      varType: 'let',
      variableName: 'intl',
      expressionName: 'getIntl',
      // expressionArgs: []
    });

    const expected = {"declarations": [{"id": {"name": "intl", "type": "Identifier"}, "init": {"arguments": [], "callee": {"name": "getIntl", "type": "Identifier"}, "type": "CallExpression"}, "type": "VariableDeclarator"}], "kind": "let", "type": "VariableDeclaration"};
    expect(result).toEqual(expected);
  })

  test('buildConstantsFileAst', () => {
    const locales = ['en-GB', 'de-DE', 'fr-FR'];
    const defaultLocale = 'en-US';
    const result = astBuilders.buildConstantsFileAst(locales, defaultLocale);

    const expected = mockConstantsAst;
    expect(result).toEqual(expected);
  })
});
