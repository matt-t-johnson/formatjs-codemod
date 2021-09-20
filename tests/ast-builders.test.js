const parser = require("@babel/parser");
const astBuilders = require('../src/ast-builders');

// fixtures
const processMessagesFixture = require('./fixtures/process-messages');
const sharedMessageFileAstFixture = require('./fixtures/shared-message-file-ast');


describe('ast-builders', () => {
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
});
