// modules/amd/MyLib.js
define(["jquery", "underscore"], function ($, _) {
  "use strict";

  var MyLib = MyLib || {};

  MyLib.namespace = function (ns) {
    var parts = ns.split(".");
    var parent = MyLib;

    if (parts[0] === "MyLib") {
      parts = parts.slice(1);
    }

    for (var i = 0; i < parts.length; i++) {
      if (!parent[parts[i]]) {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }

    return parent;
  };

  MyLib.namespace("utils.array");
  MyLib.namespace("utils.string");
  MyLib.namespace("dom.element");

  MyLib.utils = MyLib.utils || {};
  MyLib.utils.array = MyLib.utils.array || {};
  MyLib.utils.string = MyLib.utils.string || {};
  MyLib.dom = MyLib.dom || {};
  MyLib.dom.element = MyLib.dom.element || {};

  MyLib.utils.array.unique = function (arr) {
    return _.uniq(arr);
  };

  MyLib.utils.array.flatten = function (arr) {
    return _.flatten(arr);
  };

  MyLib.utils.string.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  MyLib.utils.string.trim = function (str) {
    return str.replace(/^\s+|\s+$/g, "");
  };

  MyLib.dom.element.create = function (tag, attrs) {
    var el = document.createElement(tag);

    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        el.setAttribute(key, attrs[key]);
      }
    }

    return el;
  };

  MyLib.dom.element.get = function (id) {
    return document.getElementById(id);
  };

  MyLib.version = "1.0.0";

  return MyLib;
});