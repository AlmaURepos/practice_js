"use strict";

var MyLib = {
  version: "1.0.0",
  namespace: namespace
};

function namespace(ns) {
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
}

namespace("utils.array");
namespace("utils.string");
namespace("utils.object");
namespace("dom.element");

MyLib.utils = MyLib.utils || {};
MyLib.utils.array = MyLib.utils.array || {};
MyLib.utils.string = MyLib.utils.string || {};
MyLib.utils.object = MyLib.utils.object || {};
MyLib.dom = MyLib.dom || {};
MyLib.dom.element = MyLib.dom.element || {};

MyLib.utils.array.unique = function (arr) {
  return [...new Set(arr)];
};

MyLib.utils.array.groupBy = function (arr, key) {
  return arr.reduce(function (acc, item) {
    var group = typeof key === "function" ? key(item) : item[key];
    (acc[group] = acc[group] || []).push(item);
    return acc;
  }, {});
};

MyLib.utils.array.chunk = function (arr, size) {
  var chunks = [];

  for (var i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }

  return chunks;
};

MyLib.utils.string.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

MyLib.utils.string.slugify = function (str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

MyLib.utils.object.pick = function (obj, keys) {
  return keys.reduce(function (acc, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

MyLib.utils.object.omit = function (obj, keys) {
  var result = {};

  Object.keys(obj).forEach(function (key) {
    if (keys.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });

  return result;
};

MyLib.utils.object.deepClone = function (obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return MyLib.utils.object.deepClone(item);
    });
  }

  var clone = {};

  Object.keys(obj).forEach(function (key) {
    clone[key] = MyLib.utils.object.deepClone(obj[key]);
  });

  return clone;
};

MyLib.dom.element.create = function (tag, attrs, children) {
  var el = document.createElement(tag);

  if (attrs && typeof attrs === "object") {
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

MyLib.dom.element.get = function (selector) {
  return document.querySelector(selector);
};

MyLib.dom.element.getAll = function (selector) {
  return Array.from(document.querySelectorAll(selector));
};

module.exports = MyLib;