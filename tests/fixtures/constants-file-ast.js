const ast = {
   "comments": null,
   "program": {
     "body": [
       {
         "declarations": [
           {
             "id": {
               "name": "locales",
               "type": "Identifier",
             },
             "init": {
               "properties": [
                 {
                   "computed": false,
                   "decorators": null,
                   "key": {
                     "name": "britishEnglish",
                     "type": "Identifier",
                   },
                   "shorthand": false,
                   "type": "ObjectProperty",
                   "value": {
                     "type": "StringLiteral",
                     "value": "en-GB",
                   },
                 },
                 {
                   "computed": false,
                   "decorators": null,
                   "key": {
                     "name": "germanGermany",
                     "type": "Identifier",
                   },
                   "shorthand": false,
                   "type": "ObjectProperty",
                   "value": {
                     "type": "StringLiteral",
                     "value": "de-DE",
                   },
                 },
                 {
                   "computed": false,
                   "decorators": null,
                   "key": {
                     "name": "frenchFrance",
                     "type": "Identifier",
                   },
                   "shorthand": false,
                   "type": "ObjectProperty",
                   "value": {
                     "type": "StringLiteral",
                     "value": "fr-FR",
                   },
                 },
                 {
                   "computed": false,
                   "decorators": null,
                   "key": {
                     "name": "americanEnglish",
                     "type": "Identifier",
                   },
                   "shorthand": false,
                   "type": "ObjectProperty",
                   "value": {
                     "type": "StringLiteral",
                     "value": "en-US",
                   },
                 },
               ],
               "type": "ObjectExpression",
             },
             "type": "VariableDeclarator",
           },
         ],
         "kind": "const",
         "type": "VariableDeclaration",
       },
       {
         "declarations": [
           {
             "id": {
               "name": "defaultLocale",
               "type": "Identifier",
             },
             "init": {
               "computed": false,
               "object": {
                 "name": "locales",
                 "type": "Identifier",
               },
               "optional": null,
               "property": {
                 "name": "americanEnglish",
                 "type": "Identifier",
               },
               "type": "MemberExpression",
             },
             "type": "VariableDeclarator",
           },
         ],
         "kind": "const",
         "type": "VariableDeclaration",
       },
       {
         "declarations": [
           {
             "id": {
               "name": "releasedLanguages",
               "type": "Identifier",
             },
             "init": {
               "elements": [
                 {
                   "name": "defaultLocale",
                   "type": "Identifier",
                 },
               ],
               "type": "ArrayExpression",
             },
             "type": "VariableDeclarator",
           },
         ],
         "kind": "const",
         "type": "VariableDeclaration",
       },
       {
         "declarations": [
           {
             "id": {
               "name": "managedLanguages",
               "type": "Identifier",
             },
             "init": {
               "elements": [
                 {
                   "computed": false,
                   "object": {
                     "name": "locales",
                     "type": "Identifier",
                   },
                   "optional": null,
                   "property": {
                     "name": "britishEnglish",
                     "type": "Identifier",
                   },
                   "type": "MemberExpression",
                 },
                 {
                   "computed": false,
                   "object": {
                     "name": "locales",
                     "type": "Identifier",
                   },
                   "optional": null,
                   "property": {
                     "name": "germanGermany",
                     "type": "Identifier",
                   },
                   "type": "MemberExpression",
                 },
                 {
                   "computed": false,
                   "object": {
                     "name": "locales",
                     "type": "Identifier",
                   },
                   "optional": null,
                   "property": {
                     "name": "frenchFrance",
                     "type": "Identifier",
                   },
                   "type": "MemberExpression",
                 },
               ],
               "type": "ArrayExpression",
             },
             "type": "VariableDeclarator",
           },
         ],
         "kind": "const",
         "type": "VariableDeclaration",
       },
       {
         "declarations": [
           {
             "id": {
               "name": "allLanguages",
               "type": "Identifier",
             },
             "init": {
               "elements": [
                 {
                   "computed": false,
                   "object": {
                     "name": "locales",
                     "type": "Identifier",
                   },
                   "optional": null,
                   "property": {
                     "name": "americanEnglish",
                     "type": "Identifier",
                   },
                   "type": "MemberExpression",
                 },
                 {
                   "argument": {
                     "name": "managedLanguages",
                     "type": "Identifier",
                   },
                   "type": "SpreadElement",
                 },
               ],
               "type": "ArrayExpression",
             },
             "type": "VariableDeclarator",
           },
         ],
         "kind": "const",
         "type": "VariableDeclaration",
       },
       {
         "expression": {
           "left": {
             "computed": false,
             "object": {
               "name": "module",
               "type": "Identifier",
             },
             "optional": null,
             "property": {
               "name": "exports",
               "type": "Identifier",
             },
             "type": "MemberExpression",
           },
           "operator": "=",
           "right": {
             "properties": [
               {
                 "computed": false,
                 "decorators": null,
                 "key": {
                   "name": "defaultLocale",
                   "type": "Identifier",
                 },
                 "shorthand": true,
                 "type": "ObjectProperty",
                 "value": {
                   "name": "defaultLocale",
                   "type": "Identifier",
                 },
               },
               {
                 "computed": false,
                 "decorators": null,
                 "key": {
                   "name": "releasedLanguages",
                   "type": "Identifier",
                 },
                 "shorthand": true,
                 "type": "ObjectProperty",
                 "value": {
                   "name": "releasedLanguages",
                   "type": "Identifier",
                 },
               },
               {
                 "computed": false,
                 "decorators": null,
                 "key": {
                   "name": "managedLanguages",
                   "type": "Identifier",
                 },
                 "shorthand": true,
                 "type": "ObjectProperty",
                 "value": {
                   "name": "managedLanguages",
                   "type": "Identifier",
                 },
               },
               {
                 "computed": false,
                 "decorators": null,
                 "key": {
                   "name": "allLanguages",
                   "type": "Identifier",
                 },
                 "shorthand": true,
                 "type": "ObjectProperty",
                 "value": {
                   "name": "allLanguages",
                   "type": "Identifier",
                 },
               },
              {
                 "computed": false,
                 "decorators": null,
                 "key": {
                   "name": "locales",
                   "type": "Identifier",
                 },
                 "shorthand": true,
                 "type": "ObjectProperty",
                 "value": {
                   "name": "locales",
                   "type": "Identifier",
                 },
               },
             ],
             "type": "ObjectExpression",
           },
           "type": "AssignmentExpression",
         },
         "type": "ExpressionStatement",
       },
     ],
     "directives": [],
     "interpreter": null,
     "sourceType": "module",
     "type": "Program",
   },
   "tokens": null,
   "type": "File",
};

module.exports = ast;