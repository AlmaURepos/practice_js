// namespace/utils.js
(function () {
  "use strict";

  if (typeof MyApp === "undefined") {
    throw new Error("MyApp namespace must be defined first");
  }

  MyApp.namespace("utils.array");
  MyApp.namespace("utils.string");
  MyApp.namespace("utils.date");
  MyApp.namespace("utils.number");

  MyApp.utils.array = MyApp.utils.array || {};
  MyApp.utils.string = MyApp.utils.string || {};
  MyApp.utils.date = MyApp.utils.date || {};
  MyApp.utils.number = MyApp.utils.number || {};

  MyApp.utils.array.unique = function (arr) {
    return [...new Set(arr)];
  };

  MyApp.utils.array.compact = function (arr) {
    return arr.filter(Boolean);
  };

  MyApp.utils.array.difference = function (arr1, arr2) {
    var set2 = new Set(arr2);
    return arr1.filter(function (item) {
      return !set2.has(item);
    });
  };

  MyApp.utils.array.chunk = function (arr, size) {
    var chunks = [];
    for (var i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  MyApp.utils.array.shuffle = function (arr) {
    var result = arr.slice();

    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  };

  MyApp.utils.string.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  MyApp.utils.string.titleize = function (str) {
    return str
      .split(" ")
      .map(function (word) {
        return MyApp.utils.string.capitalize(word);
      })
      .join(" ");
  };

  MyApp.utils.string.slugify = function (str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  MyApp.utils.string.truncate = function (str, length, suffix) {
    suffix = suffix || "...";
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  };

  MyApp.utils.string.template = function (str, data) {
    return str.replace(/\{\{(\w+)\}\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : match;
    });
  };

  MyApp.utils.date.format = function (date, format) {
    var d = new Date(date);
    var map = {
      YYYY: d.getFullYear(),
      MM: ("0" + (d.getMonth() + 1)).slice(-2),
      DD: ("0" + d.getDate()).slice(-2),
      HH: ("0" + d.getHours()).slice(-2),
      mm: ("0" + d.getMinutes()).slice(-2),
      ss: ("0" + d.getSeconds()).slice(-2)
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function (match) {
      return map[match];
    });
  };

  MyApp.utils.date.isToday = function (date) {
    var d = new Date(date);
    var today = new Date();
    return d.toDateString() === today.toDateString();
  };

  MyApp.utils.date.daysDiff = function (date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    var diff = Math.abs(d2 - d1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  MyApp.utils.number.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  MyApp.utils.number.clamp = function (num, min, max) {
    return Math.min(Math.max(num, min), max);
  };

  MyApp.utils.number.format = function (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
})();