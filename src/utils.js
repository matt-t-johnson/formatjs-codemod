// TODO: Add unit tests for utils
function stripWhitespace(message = '') {
  return message.replace(/\s/g, '');
}

// util function to convert the input to string type
function convertToString(input) {
  if(input) {
    if(typeof input === "string") {
        return input;
    }
    return String(input);
  }
  return '';
}

// convert string to words
function toWords(input) {
  input = convertToString(input);
  var regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
  return input.match(regex);
}

// convert the input array to camel case
function toCamelCase(inputArray) {
  let result = "";

  for(let i = 0 , len = inputArray.length; i < len; i++) {
    let currentStr = inputArray[i];
    let tempStr = currentStr.toLowerCase();

    if (i != 0) {
      // convert first letter to upper case (the word is in lowercase)
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
    }
    result +=tempStr;
  }
  return result;
}

// this function call all other functions
function toCamelCaseString(input) {
  let words = toWords(input);
  return toCamelCase(words);
}

function languageNameLookup(locale) {
  // TODO: look into improving display names: (chineseChina and germanGermany aren't ideal)
  const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
  const name = languageNames.of(locale);
  return toCamelCaseString(name);
}

module.exports = {
  stripWhitespace,
  convertToString,
  toWords,
  toCamelCase,
  toCamelCaseString,
  languageNameLookup
}