(function () {
  "use strict";

  if (typeof MyApp === "undefined") {
    throw new Error("MyApp namespace must be defined first");
  }

  MyApp.namespace("plugins");
  MyApp.namespace("plugins.storage");
  MyApp.namespace("plugins.validation");
  MyApp.namespace("plugins.router");

  MyApp.plugins = MyApp.plugins || {};
  MyApp.plugins.storage = MyApp.plugins.storage || {};
  MyApp.plugins.validation = MyApp.plugins.validation || {};
  MyApp.plugins.router = MyApp.plugins.router || {};

  MyApp.plugins.storage.local = {
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn("LocalStorage not available:", e);
        return false;
      }
    },

    get: function (key) {
      try {
        var item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn("LocalStorage not available:", e);
        return null;
      }
    },

    remove: function (key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    },

    clear: function () {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  MyApp.plugins.validation.rules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/[^\s]+$/,
    phone: /^\+?[\d\s-]{10,}$/,
    zip: /^\d{5}(-\d{4})?$/
  };

  MyApp.plugins.validation.validate = function (data, rules) {
    var errors = [];

    Object.keys(rules).forEach(function (field) {
      var value = data[field];
      var rule = rules[field];

      if (rule.required && (!value || value.trim() === "")) {
        errors.push({
          field: field,
          message: rule.message || field + " is required"
        });
        return;
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: field,
          message: rule.message || field + " is invalid"
        });
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: field,
          message: rule.message || field + " is too short"
        });
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: field,
          message: rule.message || field + " is too long"
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  };

  MyApp.plugins.router = (function () {
    var routes = [];
    var current = "";

    function addRoute(pattern, handler) {
      var paramNames = [];

      var regexPattern = pattern.replace(/:(\w+)/g, function (match, name) {
        paramNames.push(name);
        return "([^/]+)";
      });

      routes.push({
        pattern: new RegExp("^" + regexPattern + "$"),
        paramNames: paramNames,
        handler: handler
      });
    }

    function match(path) {
      for (var i = 0; i < routes.length; i++) {
        var matched = path.match(routes[i].pattern);

        if (matched) {
          var params = {};
          routes[i].paramNames.forEach(function (name, index) {
            params[name] = matched[index + 1];
          });

          return {
            handler: routes[i].handler,
            params: params
          };
        }
      }

      return null;
    }

    function navigate(path) {
      var result = match(path);

      if (result) {
        current = path;
        result.handler(result.params);
      }
    }

    return {
      addRoute: addRoute,
      navigate: navigate,
      getCurrent: function () {
        return current;
      }
    };
  })();

  MyApp.plugins.register = function (namespace, plugin) {
    var parts = namespace.split(".");
    var current = MyApp;

    for (var i = 0; i < parts.length; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    Object.keys(plugin).forEach(function (key) {
      current[key] = plugin[key];
    });
  };
})();