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

var nodesAreEmpty = function nodesAreEmpty(node) {
  return node.nodes.length === 0;
}; /* eslint no-use-before-define: [0], no-case-declarations: [0], no-param-reassign: [0] */

var removeClasses = exports.removeClasses = function removeClasses(classes, selector) {
  var parseNode = function parseNode(node) {
    switch (node.type) {
      case 'root':
        node.nodes = (0, _fp.reject)(parseNode, node.nodes);
        return null;
      case 'selector':
        var didRemoveNodes = (0, _fp.some)(parseNode, node.nodes);
        if (didRemoveNodes) {
          node.empty();
        }
        return didRemoveNodes;
      case 'class':
        var shouldRemoveNode = (0, _fp.includes)(node.value, classes);
        return shouldRemoveNode;
      case 'pseudo':
        node.nodes = (0, _fp.reject)(parseNode, node.nodes);

        var argumentsIsEmpty = nodesAreEmpty(node);
        if (node.value === ':matches' || node.value === ':has') {
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

  var ast = (0, _postcssSelectorParser2.default)(parseNode).process(selector).result;

  return (0, _fp.trim)(String(ast));
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
