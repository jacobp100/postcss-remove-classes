'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeClasses = undefined;

var _fp = require('lodash/fp');

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssSelectorParser = require('postcss-selector-parser');

var _postcssSelectorParser2 = _interopRequireDefault(_postcssSelectorParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isPseudoNot = (0, _fp.matches)({ type: 'pseudo', value: ':not' }); /* eslint no-use-before-define: [0], no-case-declarations: [0], no-param-reassign: [0] */

var nodesAreEmpty = function nodesAreEmpty(node) {
  return node.nodes.length === 0;
};
var isEmptyPseudoNot = (0, _fp.overEvery)([isPseudoNot, nodesAreEmpty]);

var removeClasses = exports.removeClasses = function removeClasses(classes, selector) {
  var parseNode = function parseNode(node) {
    switch (node.type) {
      case 'root':
      case 'selector':
        var didRemoveNodes = (0, _fp.some)(parseNode, node.nodes);
        if (didRemoveNodes) {
          node.empty();
        }
        // Fix for bug
        node.nodes = (0, _fp.reject)(isEmptyPseudoNot, node.nodes);
        return didRemoveNodes;
      case 'class':
        var shouldRemoveNode = (0, _fp.includes)(node.value, classes);
        return shouldRemoveNode;
      case 'pseudo':
        node.nodes = (0, _fp.reject)(parseNode, node.nodes);

        var argumentsIsEmpty = node.nodes.length === 0;
        if (node.value === ':matches' || node.value === ':has') {
          return argumentsIsEmpty;
        } else if (node.value === ':not' && argumentsIsEmpty) {
          // Bug --- this crashes
          // node.remove();
          return false;
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

  var ast = (0, _postcssSelectorParser2.default)(parseNode).process(selector).result;

  return String(ast);
};

exports.default = _postcss2.default.plugin('remove-classes', function (classes) {
  return function (root) {
    root.walkRules(function (rule) {
      var newSelector = removeClasses((0, _fp.castArray)(classes), rule.selector);
      if (!newSelector) {
        rule.remove();
      } else if (newSelector !== rule.selector) {
        rule.selector = newSelector;
      }
    });
  };
});
