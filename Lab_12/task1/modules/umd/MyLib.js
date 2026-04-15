// modules/umd/MyLib.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "underscore"], function ($, _) {
      return factory($, _);
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("jquery"), require("underscore"));
  } else {
    root.MyLib = factory(root.jQuery, root._);
  }
})(typeof self !== "undefined" ? self : this, function ($, _) {
  "use strict";

  var MyLib = {};

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
  MyLib.namespace("utils.object");
  MyLib.namespace("dom.element");
  MyLib.namespace("events");

  MyLib.version = "1.0.0";

  MyLib.utils = MyLib.utils || {};
  MyLib.utils.array = MyLib.utils.array || {};
  MyLib.utils.string = MyLib.utils.string || {};
  MyLib.utils.object = MyLib.utils.object || {};
  MyLib.dom = MyLib.dom || {};
  MyLib.dom.element = MyLib.dom.element || {};
  MyLib.events = MyLib.events || {};

  MyLib.utils.array.unique = function (arr) {
    if ($ && $.uniq) return $.uniq(arr);
    if (_ && _.uniq) return _.uniq(arr);
    return [...new Set(arr)];
  };

  MyLib.utils.array.flatten = function (arr) {
    if (_ && _.flatten) return _.flatten(arr);

    return arr.reduce(function (acc, val) {
      return acc.concat(Array.isArray(val) ? MyLib.utils.array.flatten(val) : val);
    }, []);
  };

  MyLib.utils.string.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  MyLib.utils.string.template = function (str, data) {
    return str.replace(/\{\{(\w+)\}\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : match;
    });
  };

  MyLib.utils.object.merge = function (target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    sources.forEach(function (source) {
      if (source) {
        Object.keys(source).forEach(function (key) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        });
      }
    });

    return target;
  };

  MyLib.dom.element.create = function (tag, attrs, children) {
    var el = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
      });
    }

    if (children) {
      if (typeof children === "string") {
        el.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(function (child) {
          if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            el.appendChild(child);
          }
        });
      }
    }

    return el;
  };

  MyLib.events.EventEmitter = function () {
    this.events = {};
  };

  MyLib.events.EventEmitter.prototype.on = function (event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(handler);
    return this;
  };

  MyLib.events.EventEmitter.prototype.off = function (event, handler) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(function (h) {
        return h !== handler;
      });
    }

    return this;
  };

  MyLib.events.EventEmitter.prototype.emit = function (event) {
    var args = Array.prototype.slice.call(arguments, 1);

    if (this.events[event]) {
      this.events[event].forEach(function (handler) {
        handler.apply(this, args);
      }, this);
    }

    return this;
  };

  return MyLib;
});