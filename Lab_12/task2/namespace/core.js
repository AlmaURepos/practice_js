
(function (global) {
  "use strict";

  var MyApp = typeof global.MyApp === "undefined" ? {} : global.MyApp;

  MyApp.namespace = function (ns) {
    var parts = ns.split(".");
    var current = MyApp;

    for (var i = 0; i < parts.length; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    return current;
  };

  MyApp.namespace("core");
  MyApp.namespace("utils");
  MyApp.namespace("utils.array");
  MyApp.namespace("utils.string");
  MyApp.namespace("utils.date");
  MyApp.namespace("dom");
  MyApp.namespace("dom.query");
  MyApp.namespace("dom.style");
  MyApp.namespace("events");
  MyApp.namespace("plugins");

  MyApp.core = {
    version: "2.0.0",
    name: "MyApp Library"
  };

  global.MyApp = MyApp;
})(typeof window !== "undefined" ? window : globalThis);