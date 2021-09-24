const utils = require('../src/utils');

describe('utils', () => {
  it.each([
    ['string', 'string'],
    [123, '123'],
    [null, '']
  ])('convertToString returns expected result', (input, expected) => {
    expect(utils.convertToString(input)).toEqual(expected);
  });

  describe('toCamelCaseString', () => {
    it('works', () => {
      expect(utils.toCamelCaseString('Some kind of string')).toBe('someKindOfString');
    });
  });

  it.each([
    ['de-DE', 'germanGermany'],
    ['de', 'german'],
    ['en', 'english'],
    ['ara', 'arabic'],
    ['zh-cn', 'chineseChina'],
    ['az-Cyrl-AZ', 'azerbaijaniCyrillicAzerbaijan']
  ])('languageNameLookup works as expected', (locale, languageName) => {
    expect(utils.languageNameLookup(locale)).toBe(languageName);
  });

  it('commaSeparatedList works as expected', () => {
    expect(utils.commaSeparatedList('**/*.js,**/*.jsx,**/*.ts,**/*.tsx')).toStrictEqual(['**/*.js','**/*.jsx','**/*.ts','**/*.tsx']);
  });

});
