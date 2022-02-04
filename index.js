'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeClasses = exports.classNameMatches = undefined;

var _fp = require('lodash/fp');

var _postcssSelectorParser = require('postcss-selector-parser');

var _postcssSelectorParser2 = _interopRequireDefault(_postcssSelectorParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-use-before-define: [0], no-case-declarations: [0], no-param-reassign: [0] */

var classNameMatches = exports.classNameMatches = (0, _fp.curry)(function (matchArg, className) {
  if (Array.isArray(matchArg)) {
    return (0, _fp.includes)(className, matchArg);
  } else if (matchArg instanceof RegExp) {
    return matchArg.test(className);
  }
  return matchArg === className;
});

var nodesAreEmpty = function nodesAreEmpty(node) {
  return node.nodes.length === 0;
};

var removeClasses = exports.removeClasses = function removeClasses(matchesClassName, selector) {
  var parseNode = function parseNode(node) {
    switch (node.type) {
      case 'root':
        node.nodes = (0, _fp.reject)(parseNode, node.nodes);
        return false;
      case 'selector':
        var didRemoveNodes = node.nodes.some(parseNode);
        if (didRemoveNodes) {
          node.empty();
        }
        return didRemoveNodes;
      case 'class':
        var shouldRemoveNode = matchesClassName(node.value);
        return shouldRemoveNode;
      case 'pseudo':
        node.nodes = (0, _fp.reject)(parseNode, node.nodes);

        var argumentsIsEmpty = nodesAreEmpty(node);
        if (node.value === ':matches' || node.value === ':has' || node.value === ':global') {
          return argumentsIsEmpty;
        } else if (node.value === ':not' && argumentsIsEmpty) {
          node.remove();
        }
        return false;
      case 'attribute':
      case 'combinator':
      case 'comment':
      case 'id':
      case 'nesting':
      case 'string':
      case 'tag':
      case 'universal':
        return false;
      default:
        throw new Error('Unhandled type: ' + node.type);
    }
  };

  var ast = (0, _postcssSelectorParser2.default)(parseNode).processSync(selector);

  return (0, _fp.trim)(String(ast));
};

exports.default = function (matchArg) {
  return {
    postcssPlugin: 'remove-classes',
    prepare: function prepare() {
      var matches = classNameMatches(matchArg);

      return {
        Rule: function Rule(rule) {
          var newSelector = removeClasses(matches, rule.selector);
          if (!newSelector) {
            rule.remove();
          } else if (newSelector !== rule.selector) {
            rule.selector = newSelector;
          }
        }
      };
    }
  };
};
