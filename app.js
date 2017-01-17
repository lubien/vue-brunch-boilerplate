(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("babel-polyfill/lib/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "babel-polyfill");
  (function() {
    /* eslint max-len: 0 */

"use strict";

require("core-js/shim");

require("babel-regenerator-runtime");

// Should be removed in the next major release:

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
  })();
});

require.register("babel-regenerator-runtime/runtime.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "babel-regenerator-runtime");
  (function() {
    "use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol = typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function (arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument ? Promise.resolve(value.arg).then(invokeNext, invokeThrow) : Promise.resolve(value).then(function (unwrapped) {
        // When a yielded Promise is resolved, its final value becomes
        // the .value of the Promise<{value,done}> result for the
        // current iteration. If the Promise is rejected, however, the
        // result for this iteration will be rejected with the same
        // reason. Note that rejections of yielded Promises are not
        // thrown back into the generator function, as is the case
        // when an awaited Promise is rejected. This difference in
        // behavior between yield and await is important, because it
        // allows the consumer to decide what to do with the yielded
        // rejection (swallow it and continue, manually .throw it back
        // into the generator, abandon iteration, whatever). With
        // await, by contrast, there is no opportunity to examine the
        // rejection reason outside the generator function, so the
        // only option is to throw it from the await expression, and
        // let the generator function handle the exception.
        result.value = unwrapped;
        return result;
      });
    }

    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : new Promise(function (resolve) {
        resolve(callInvokeWithMethodAndArg());
      });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }
        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
}(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined);
  })();
});

require.register("core-js/fn/regexp/escape.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;
  })();
});

require.register("core-js/modules/_a-function.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};
  })();
});

require.register("core-js/modules/_a-number-value.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};
  })();
});

require.register("core-js/modules/_add-to-unscopables.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables'),
    ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};
  })();
});

require.register("core-js/modules/_an-instance.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};
  })();
});

require.register("core-js/modules/_an-object.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};
  })();
});

require.register("core-js/modules/_array-copy-within.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';

var toObject = require('./_to-object'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /*= 0*/, start /*= 0, end = @length*/) {
  var O = toObject(this),
      len = toLength(O.length),
      to = toIndex(target, len),
      from = toIndex(start, len),
      end = arguments.length > 2 ? arguments[2] : undefined,
      count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to),
      inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];else delete O[to];
    to += inc;
    from += inc;
  }return O;
};
  })();
});

require.register("core-js/modules/_array-fill.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';

var toObject = require('./_to-object'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */) {
  var O = toObject(this),
      length = toLength(O.length),
      aLen = arguments.length,
      index = toIndex(aLen > 1 ? arguments[1] : undefined, length),
      end = aLen > 2 ? arguments[2] : undefined,
      endPos = end === undefined ? length : toIndex(end, length);
  while (endPos > index) {
    O[index++] = value;
  }return O;
};
  })();
});

require.register("core-js/modules/_array-from-iterable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};
  })();
});

require.register("core-js/modules/_array-includes.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject'),
    toLength = require('./_to-length'),
    toIndex = require('./_to-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this),
        length = toLength(O.length),
        index = toIndex(fromIndex, length),
        value;
    // Array#includes uses SameValueZero equality algorithm
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
      // Array#toIndex ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};
  })();
});

require.register("core-js/modules/_array-methods.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx'),
    IObject = require('./_iobject'),
    toObject = require('./_to-object'),
    toLength = require('./_to-length'),
    asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1,
      IS_FILTER = TYPE == 2,
      IS_SOME = TYPE == 3,
      IS_EVERY = TYPE == 4,
      IS_FIND_INDEX = TYPE == 6,
      NO_HOLES = TYPE == 5 || IS_FIND_INDEX,
      create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this),
        self = IObject(O),
        f = ctx(callbackfn, that, 3),
        length = toLength(self.length),
        index = 0,
        result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined,
        val,
        res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
  })();
});

require.register("core-js/modules/_array-reduce.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var aFunction = require('./_a-function'),
    toObject = require('./_to-object'),
    IObject = require('./_iobject'),
    toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that),
      self = IObject(O),
      length = toLength(O.length),
      index = isRight ? length - 1 : 0,
      i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (; isRight ? index >= 0 : length > index; index += i) {
    if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
  }return memo;
};
  })();
});

require.register("core-js/modules/_array-species-constructor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var isObject = require('./_is-object'),
    isArray = require('./_is-array'),
    SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};
  })();
});

require.register("core-js/modules/_array-species-create.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};
  })();
});

require.register("core-js/modules/_bind.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var aFunction = require('./_a-function'),
    isObject = require('./_is-object'),
    invoke = require('./_invoke'),
    arraySlice = [].slice,
    factories = {};

var construct = function construct(F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) {
      n[i] = 'a[' + i + ']';
    }factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */) {
  var fn = aFunction(this),
      partArgs = arraySlice.call(arguments, 1);
  var bound = function bound() /* args... */{
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};
  })();
});

require.register("core-js/modules/_classof.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof'),
    TAG = require('./_wks')('toStringTag')
// ES3 wrong here
,
    ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
  })();
});

require.register("core-js/modules/_cof.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};
  })();
});

require.register("core-js/modules/_collection-strong.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var dP = require('./_object-dp').f,
    create = require('./_object-create'),
    redefineAll = require('./_redefine-all'),
    ctx = require('./_ctx'),
    anInstance = require('./_an-instance'),
    defined = require('./_defined'),
    forOf = require('./_for-of'),
    $iterDefine = require('./_iter-define'),
    step = require('./_iter-step'),
    setSpecies = require('./_set-species'),
    DESCRIPTORS = require('./_descriptors'),
    fastKey = require('./_meta').fastKey,
    SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key),
      entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = this,
            entry = getEntry(that, key);
        if (entry) {
          var next = entry.n,
              prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */) {
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
            entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key),
        prev,
        index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = iterated; // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this,
          kind = that._k,
          entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
  })();
});

require.register("core-js/modules/_collection-to-json.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof'),
    from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
  })();
});

require.register("core-js/modules/_collection-weak.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var redefineAll = require('./_redefine-all'),
    getWeak = require('./_meta').getWeak,
    anObject = require('./_an-object'),
    isObject = require('./_is-object'),
    anInstance = require('./_an-instance'),
    forOf = require('./_for-of'),
    createArrayMethod = require('./_array-methods'),
    $has = require('./_has'),
    arrayFind = createArrayMethod(5),
    arrayFindIndex = createArrayMethod(6),
    id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function UncaughtFrozenStore() {
  this.a = [];
};
var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function get(key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function has(key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function set(key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;else this.a.push([key, value]);
  },
  'delete': function _delete(key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._i = id++; // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function _delete(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
  })();
});

require.register("core-js/modules/_collection.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    $export = require('./_export'),
    redefine = require('./_redefine'),
    redefineAll = require('./_redefine-all'),
    meta = require('./_meta'),
    forOf = require('./_for-of'),
    anInstance = require('./_an-instance'),
    isObject = require('./_is-object'),
    fails = require('./_fails'),
    $iterDetect = require('./_iter-detect'),
    setToStringTag = require('./_set-to-string-tag'),
    inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME],
      C = Base,
      ADDER = IS_MAP ? 'set' : 'add',
      proto = C && C.prototype,
      O = {};
  var fixMethod = function fixMethod(KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY, KEY == 'delete' ? function (a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'has' ? function has(a) {
      return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'get' ? function get(a) {
      return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
    } : KEY == 'add' ? function add(a) {
      fn.call(this, a === 0 ? 0 : a);return this;
    } : function set(a, b) {
      fn.call(this, a === 0 ? 0 : a, b);return this;
    });
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C()
    // early implementations not supports chaining
    ,
        HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    ,
        THROWS_ON_PRIMITIVES = fails(function () {
      instance.has(1);
    })
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    ,
        ACCEPT_ITERABLES = $iterDetect(function (iter) {
      new C(iter);
    }) // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    ,
        BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C(),
          index = 5;
      while (index--) {
        $instance[ADDER](index, index);
      }return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};
  })();
});

require.register("core-js/modules/_core.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var core = module.exports = { version: '2.4.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  })();
});

require.register("core-js/modules/_create-property.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $defineProperty = require('./_object-dp'),
    createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};
  })();
});

require.register("core-js/modules/_ctx.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};
  })();
});

require.register("core-js/modules/_date-to-primitive.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var anObject = require('./_an-object'),
    toPrimitive = require('./_to-primitive'),
    NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};
  })();
});

require.register("core-js/modules/_defined.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};
  })();
});

require.register("core-js/modules/_descriptors.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});
  })();
});

require.register("core-js/modules/_dom-create.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var isObject = require('./_is-object'),
    document = require('./_global').document
// in old IE typeof document.createElement is 'object'
,
    is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};
  })();
});

require.register("core-js/modules/_enum-bug-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
  })();
});

require.register("core-js/modules/_enum-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys'),
    gOPS = require('./_object-gops'),
    pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it),
      getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it),
        isEnum = pIE.f,
        i = 0,
        key;
    while (symbols.length > i) {
      if (isEnum.call(it, key = symbols[i++])) result.push(key);
    }
  }return result;
};
  })();
});

require.register("core-js/modules/_export.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    core = require('./_core'),
    hide = require('./_hide'),
    redefine = require('./_redefine'),
    ctx = require('./_ctx'),
    PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F,
      IS_GLOBAL = type & $export.G,
      IS_STATIC = type & $export.S,
      IS_PROTO = type & $export.P,
      IS_BIND = type & $export.B,
      target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE],
      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
      expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}),
      key,
      own,
      out,
      exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
  })();
});

require.register("core-js/modules/_fails-is-regexp.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) {/* empty */}
  }return true;
};
  })();
});

require.register("core-js/modules/_fails.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};
  })();
});

require.register("core-js/modules/_fix-re-wks.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var hide = require('./_hide'),
    redefine = require('./_redefine'),
    fails = require('./_fails'),
    defined = require('./_defined'),
    wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY),
      fns = exec(defined, SYMBOL, ''[KEY]),
      strfn = fns[0],
      rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () {
      return 7;
    };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
    // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
    ? function (string, arg) {
      return rxfn.call(string, this, arg);
    }
    // 21.2.5.6 RegExp.prototype[@@match](string)
    // 21.2.5.9 RegExp.prototype[@@search](string)
    : function (string) {
      return rxfn.call(string, this);
    });
  }
};
  })();
});

require.register("core-js/modules/_flags.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 21.2.5.3 get RegExp.prototype.flags

var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this),
      result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};
  })();
});

require.register("core-js/modules/_for-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var ctx = require('./_ctx'),
    call = require('./_iter-call'),
    isArrayIter = require('./_is-array-iter'),
    anObject = require('./_an-object'),
    toLength = require('./_to-length'),
    getIterFn = require('./core.get-iterator-method'),
    BREAK = {},
    RETURN = {};
var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable),
      f = ctx(fn, that, entries ? 2 : 1),
      index = 0,
      length,
      step,
      iterator,
      result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
_exports.BREAK = BREAK;
_exports.RETURN = RETURN;
  })();
});

require.register("core-js/modules/_global.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  })();
});

require.register("core-js/modules/_has.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};
  })();
});

require.register("core-js/modules/_hide.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var dP = require('./_object-dp'),
    createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};
  })();
});

require.register("core-js/modules/_html.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

module.exports = require('./_global').document && document.documentElement;
  })();
});

require.register("core-js/modules/_ie8-dom-define.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});
  })();
});

require.register("core-js/modules/_inherit-if-required.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var isObject = require('./_is-object'),
    setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var P,
      S = target.constructor;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  }return that;
};
  })();
});

require.register("core-js/modules/_invoke.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};
  })();
});

require.register("core-js/modules/_iobject.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};
  })();
});

require.register("core-js/modules/_is-array-iter.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// check on default Array iterator
var Iterators = require('./_iterators'),
    ITERATOR = require('./_wks')('iterator'),
    ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
  })();
});

require.register("core-js/modules/_is-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};
  })();
});

require.register("core-js/modules/_is-integer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object'),
    floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
  })();
});

require.register("core-js/modules/_is-object.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};
  })();
});

require.register("core-js/modules/_is-regexp.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object'),
    cof = require('./_cof'),
    MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
  })();
});

require.register("core-js/modules/_iter-call.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};
  })();
});

require.register("core-js/modules/_iter-create.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var create = require('./_object-create'),
    descriptor = require('./_property-desc'),
    setToStringTag = require('./_set-to-string-tag'),
    IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};
  })();
});

require.register("core-js/modules/_iter-define.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var LIBRARY = require('./_library'),
    $export = require('./_export'),
    redefine = require('./_redefine'),
    hide = require('./_hide'),
    has = require('./_has'),
    Iterators = require('./_iterators'),
    $iterCreate = require('./_iter-create'),
    setToStringTag = require('./_set-to-string-tag'),
    getPrototypeOf = require('./_object-gpo'),
    ITERATOR = require('./_wks')('iterator'),
    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
,
    FF_ITERATOR = '@@iterator',
    KEYS = 'keys',
    VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator',
      DEF_VALUES = DEFAULT == VALUES,
      VALUES_BUG = false,
      proto = Base.prototype,
      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
      $default = $native || getMethod(DEFAULT),
      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
      methods,
      key,
      IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
  })();
});

require.register("core-js/modules/_iter-detect.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var ITERATOR = require('./_wks')('iterator'),
    SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7],
        iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};
  })();
});

require.register("core-js/modules/_iter-step.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

module.exports = function (done, value) {
  return { value: value, done: !!done };
};
  })();
});

require.register("core-js/modules/_iterators.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

module.exports = {};
  })();
});

require.register("core-js/modules/_keyof.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var getKeys = require('./_object-keys'),
    toIObject = require('./_to-iobject');
module.exports = function (object, el) {
  var O = toIObject(object),
      keys = getKeys(O),
      length = keys.length,
      index = 0,
      key;
  while (length > index) {
    if (O[key = keys[index++]] === el) return key;
  }
};
  })();
});

require.register("core-js/modules/_library.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

module.exports = false;
  })();
});

require.register("core-js/modules/_math-expm1.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = !$expm1
// Old FF bug
|| $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
// Tor Browser bug
|| $expm1(-2e-17) != -2e-17 ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;
  })();
});

require.register("core-js/modules/_math-log1p.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
  })();
});

require.register("core-js/modules/_math-sign.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
  })();
});

require.register("core-js/modules/_meta.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var META = require('./_uid')('meta'),
    isObject = require('./_is-object'),
    has = require('./_has'),
    setDesc = require('./_object-dp').f,
    id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function setMeta(it) {
  setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {} // weak collections IDs
    } });
};
var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
    // return object ID
  }return it[META].i;
};
var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
    // return hash weak collections IDs
  }return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
  })();
});

require.register("core-js/modules/_metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Map = require('./es6.map'),
    $export = require('./_export'),
    shared = require('./_shared')('metadata'),
    store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function getOrCreateMetadataMap(target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  }return keyMetadata;
};
var ordinaryHasOwnMetadata = function ordinaryHasOwnMetadata(MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function ordinaryGetOwnMetadata(MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function ordinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function ordinaryOwnMetadataKeys(target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false),
      keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) {
    keys.push(key);
  });
  return keys;
};
var toMetaKey = function toMetaKey(it) {
  return it === undefined || (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : String(it);
};
var exp = function exp(O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};
  })();
});

require.register("core-js/modules/_microtask.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    macrotask = require('./_task').set,
    Observer = global.MutationObserver || global.WebKitMutationObserver,
    process = global.process,
    Promise = global.Promise,
    isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true,
        node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};
  })();
});

require.register("core-js/modules/_object-assign.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = require('./_object-keys'),
    gOPS = require('./_object-gops'),
    pIE = require('./_object-pie'),
    toObject = require('./_to-object'),
    IObject = require('./_iobject'),
    $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {},
      B = {},
      S = Symbol(),
      K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target),
      aLen = arguments.length,
      index = 1,
      getSymbols = gOPS.f,
      isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]),
        keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
        length = keys.length,
        j = 0,
        key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;
  })();
});

require.register("core-js/modules/_object-create.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object'),
    dPs = require('./_object-dps'),
    enumBugKeys = require('./_enum-bug-keys'),
    IE_PROTO = require('./_shared-key')('IE_PROTO'),
    Empty = function Empty() {/* empty */},
    PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe'),
      i = enumBugKeys.length,
      lt = '<',
      gt = '>',
      iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
  })();
});

require.register("core-js/modules/_object-dp.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var anObject = require('./_an-object'),
    IE8_DOM_DEFINE = require('./_ie8-dom-define'),
    toPrimitive = require('./_to-primitive'),
    dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};
  })();
});

require.register("core-js/modules/_object-dps.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var dP = require('./_object-dp'),
    anObject = require('./_an-object'),
    getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties),
      length = keys.length,
      i = 0,
      P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};
  })();
});

require.register("core-js/modules/_object-forced-pam.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function () {/* empty */});
  delete require('./_global')[K];
});
  })();
});

require.register("core-js/modules/_object-gopd.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var pIE = require('./_object-pie'),
    createDesc = require('./_property-desc'),
    toIObject = require('./_to-iobject'),
    toPrimitive = require('./_to-primitive'),
    has = require('./_has'),
    IE8_DOM_DEFINE = require('./_ie8-dom-define'),
    gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) {/* empty */}
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};
  })();
});

require.register("core-js/modules/_object-gopn-ext.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject'),
    gOPN = require('./_object-gopn').f,
    toString = {}.toString;

var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function getWindowNames(it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};
  })();
});

require.register("core-js/modules/_object-gopn.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal'),
    hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};
  })();
});

require.register("core-js/modules/_object-gops.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

exports.f = Object.getOwnPropertySymbols;
  })();
});

require.register("core-js/modules/_object-gpo.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has'),
    toObject = require('./_to-object'),
    IE_PROTO = require('./_shared-key')('IE_PROTO'),
    ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};
  })();
});

require.register("core-js/modules/_object-keys-internal.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var has = require('./_has'),
    toIObject = require('./_to-iobject'),
    arrayIndexOf = require('./_array-includes')(false),
    IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object),
      i = 0,
      result = [],
      key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};
  })();
});

require.register("core-js/modules/_object-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal'),
    enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};
  })();
});

require.register("core-js/modules/_object-pie.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

exports.f = {}.propertyIsEnumerable;
  })();
});

require.register("core-js/modules/_object-sap.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// most Object methods by ES6 should accept primitives
var $export = require('./_export'),
    core = require('./_core'),
    fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY],
      exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () {
    fn(1);
  }), 'Object', exp);
};
  })();
});

require.register("core-js/modules/_object-to-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var getKeys = require('./_object-keys'),
    toIObject = require('./_to-iobject'),
    isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it),
        keys = getKeys(O),
        length = keys.length,
        i = 0,
        result = [],
        key;
    while (length > i) {
      if (isEnum.call(O, key = keys[i++])) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }return result;
  };
};
  })();
});

require.register("core-js/modules/_own-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn'),
    gOPS = require('./_object-gops'),
    anObject = require('./_an-object'),
    Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it)),
      getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
  })();
});

require.register("core-js/modules/_parse-float.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $parseFloat = require('./_global').parseFloat,
    $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3),
      result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;
  })();
});

require.register("core-js/modules/_parse-int.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $parseInt = require('./_global').parseInt,
    $trim = require('./_string-trim').trim,
    ws = require('./_string-ws'),
    hex = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
} : $parseInt;
  })();
});

require.register("core-js/modules/_partial.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var path = require('./_path'),
    invoke = require('./_invoke'),
    aFunction = require('./_a-function');
module.exports = function () /* ...pargs */{
  var fn = aFunction(this),
      length = arguments.length,
      pargs = Array(length),
      i = 0,
      _ = path._,
      holder = false;
  while (length > i) {
    if ((pargs[i] = arguments[i++]) === _) holder = true;
  }return function () /* ...args */{
    var that = this,
        aLen = arguments.length,
        j = 0,
        k = 0,
        args;
    if (!holder && !aLen) return invoke(fn, pargs, that);
    args = pargs.slice();
    if (holder) for (; length > j; j++) {
      if (args[j] === _) args[j] = arguments[k++];
    }while (aLen > k) {
      args.push(arguments[k++]);
    }return invoke(fn, args, that);
  };
};
  })();
});

require.register("core-js/modules/_path.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

module.exports = require('./_global');
  })();
});

require.register("core-js/modules/_property-desc.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};
  })();
});

require.register("core-js/modules/_redefine-all.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) {
    redefine(target, key, src[key], safe);
  }return target;
};
  })();
});

require.register("core-js/modules/_redefine.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    hide = require('./_hide'),
    has = require('./_has'),
    SRC = require('./_uid')('src'),
    TO_STRING = 'toString',
    $toString = Function[TO_STRING],
    TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else {
    if (!safe) {
      delete O[key];
      hide(O, key, val);
    } else {
      if (O[key]) O[key] = val;else hide(O, key, val);
    }
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
  })();
});

require.register("core-js/modules/_replacer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};
  })();
});

require.register("core-js/modules/_same-value.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
  })();
});

require.register("core-js/modules/_set-proto.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object'),
    anObject = require('./_an-object');
var check = function check(O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};
  })();
});

require.register("core-js/modules/_set-species.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    dP = require('./_object-dp'),
    DESCRIPTORS = require('./_descriptors'),
    SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};
  })();
});

require.register("core-js/modules/_set-to-string-tag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var def = require('./_object-dp').f,
    has = require('./_has'),
    TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};
  })();
});

require.register("core-js/modules/_shared-key.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var shared = require('./_shared')('keys'),
    uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};
  })();
});

require.register("core-js/modules/_shared.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    SHARED = '__core-js_shared__',
    store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};
  })();
});

require.register("core-js/modules/_species-constructor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object'),
    aFunction = require('./_a-function'),
    SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor,
      S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
  })();
});

require.register("core-js/modules/_strict-method.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    arg ? method.call(null, function () {}, 1) : method.call(null);
  });
};
  })();
});

require.register("core-js/modules/_string-at.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var toInteger = require('./_to-integer'),
    defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that)),
        i = toInteger(pos),
        l = s.length,
        a,
        b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
  })();
});

require.register("core-js/modules/_string-context.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp'),
    defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
  })();
});

require.register("core-js/modules/_string-html.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    fails = require('./_fails'),
    defined = require('./_defined'),
    quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function createHTML(string, tag, attribute, value) {
  var S = String(defined(string)),
      p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};
  })();
});

require.register("core-js/modules/_string-pad.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length'),
    repeat = require('./_string-repeat'),
    defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that)),
      stringLength = S.length,
      fillStr = fillString === undefined ? ' ' : String(fillString),
      intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength,
      stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
  })();
});

require.register("core-js/modules/_string-repeat.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var toInteger = require('./_to-integer'),
    defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this)),
      res = '',
      n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (; n > 0; (n >>>= 1) && (str += str)) {
    if (n & 1) res += str;
  }return res;
};
  })();
});

require.register("core-js/modules/_string-trim.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    defined = require('./_defined'),
    fails = require('./_fails'),
    spaces = require('./_string-ws'),
    space = '[' + spaces + ']',
    non = '\u200B\x85',
    ltrim = RegExp('^' + space + space + '*'),
    rtrim = RegExp(space + space + '*$');

var exporter = function exporter(KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
  })();
});

require.register("core-js/modules/_string-ws.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

module.exports = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
  })();
});

require.register("core-js/modules/_task.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var ctx = require('./_ctx'),
    invoke = require('./_invoke'),
    html = require('./_html'),
    cel = require('./_dom-create'),
    global = require('./_global'),
    process = global.process,
    setTask = global.setImmediate,
    clearTask = global.clearImmediate,
    MessageChannel = global.MessageChannel,
    counter = 0,
    queue = {},
    ONREADYSTATECHANGE = 'onreadystatechange',
    defer,
    channel,
    port;
var run = function run() {
  var id = +this;
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [],
        i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue[++counter] = function () {
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};
  })();
});

require.register("core-js/modules/_to-index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var toInteger = require('./_to-integer'),
    max = Math.max,
    min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
  })();
});

require.register("core-js/modules/_to-integer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    "use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil,
    floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
  })();
});

require.register("core-js/modules/_to-iobject.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject'),
    defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};
  })();
});

require.register("core-js/modules/_to-length.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer'),
    min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
  })();
});

require.register("core-js/modules/_to-object.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};
  })();
});

require.register("core-js/modules/_to-primitive.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};
  })();
});

require.register("core-js/modules/_typed-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (require('./_descriptors')) {
  var LIBRARY = require('./_library'),
      global = require('./_global'),
      fails = require('./_fails'),
      $export = require('./_export'),
      $typed = require('./_typed'),
      $buffer = require('./_typed-buffer'),
      ctx = require('./_ctx'),
      anInstance = require('./_an-instance'),
      propertyDesc = require('./_property-desc'),
      hide = require('./_hide'),
      redefineAll = require('./_redefine-all'),
      toInteger = require('./_to-integer'),
      toLength = require('./_to-length'),
      toIndex = require('./_to-index'),
      toPrimitive = require('./_to-primitive'),
      has = require('./_has'),
      same = require('./_same-value'),
      classof = require('./_classof'),
      isObject = require('./_is-object'),
      toObject = require('./_to-object'),
      isArrayIter = require('./_is-array-iter'),
      create = require('./_object-create'),
      getPrototypeOf = require('./_object-gpo'),
      gOPN = require('./_object-gopn').f,
      getIterFn = require('./core.get-iterator-method'),
      uid = require('./_uid'),
      wks = require('./_wks'),
      createArrayMethod = require('./_array-methods'),
      createArrayIncludes = require('./_array-includes'),
      speciesConstructor = require('./_species-constructor'),
      ArrayIterators = require('./es6.array.iterator'),
      Iterators = require('./_iterators'),
      $iterDetect = require('./_iter-detect'),
      setSpecies = require('./_set-species'),
      arrayFill = require('./_array-fill'),
      arrayCopyWithin = require('./_array-copy-within'),
      $DP = require('./_object-dp'),
      $GOPD = require('./_object-gopd'),
      dP = $DP.f,
      gOPD = $GOPD.f,
      RangeError = global.RangeError,
      TypeError = global.TypeError,
      Uint8Array = global.Uint8Array,
      ARRAY_BUFFER = 'ArrayBuffer',
      SHARED_BUFFER = 'Shared' + ARRAY_BUFFER,
      BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT',
      PROTOTYPE = 'prototype',
      ArrayProto = Array[PROTOTYPE],
      $ArrayBuffer = $buffer.ArrayBuffer,
      $DataView = $buffer.DataView,
      arrayForEach = createArrayMethod(0),
      arrayFilter = createArrayMethod(2),
      arraySome = createArrayMethod(3),
      arrayEvery = createArrayMethod(4),
      arrayFind = createArrayMethod(5),
      arrayFindIndex = createArrayMethod(6),
      arrayIncludes = createArrayIncludes(true),
      arrayIndexOf = createArrayIncludes(false),
      arrayValues = ArrayIterators.values,
      arrayKeys = ArrayIterators.keys,
      arrayEntries = ArrayIterators.entries,
      arrayLastIndexOf = ArrayProto.lastIndexOf,
      arrayReduce = ArrayProto.reduce,
      arrayReduceRight = ArrayProto.reduceRight,
      arrayJoin = ArrayProto.join,
      arraySort = ArrayProto.sort,
      arraySlice = ArrayProto.slice,
      arrayToString = ArrayProto.toString,
      arrayToLocaleString = ArrayProto.toLocaleString,
      ITERATOR = wks('iterator'),
      TAG = wks('toStringTag'),
      TYPED_CONSTRUCTOR = uid('typed_constructor'),
      DEF_CONSTRUCTOR = uid('def_constructor'),
      ALL_CONSTRUCTORS = $typed.CONSTR,
      TYPED_ARRAY = $typed.TYPED,
      VIEW = $typed.VIEW,
      WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var strictToLength = function strictToLength(it, SAME) {
    if (it === undefined) throw TypeError(WRONG_LENGTH);
    var number = +it,
        length = toLength(it);
    if (SAME && !same(number, length)) throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function toOffset(it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function validate(it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function allocate(C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    }return new C(length);
  };

  var speciesFromList = function speciesFromList(O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function fromList(C, list) {
    var index = 0,
        length = list.length,
        result = allocate(C, length);
    while (length > index) {
      result[index] = list[index++];
    }return result;
  };

  var addGetter = function addGetter(it, key, internal) {
    dP(it, key, { get: function get() {
        return this._d[internal];
      } });
  };

  var $from = function from(source /*, mapfn, thisArg */) {
    var O = toObject(source),
        aLen = arguments.length,
        mapfn = aLen > 1 ? arguments[1] : undefined,
        mapping = mapfn !== undefined,
        iterFn = getIterFn(O),
        i,
        length,
        values,
        result,
        step,
        iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      }O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of() /*...items*/{
    var index = 0,
        length = arguments.length,
        result = allocate(this, length);
    while (length > index) {
      result[index] = arguments[index++];
    }return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () {
    arrayToLocaleString.call(new Uint8Array(1));
  });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */) {
      // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) {
      // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */) {
      // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */) {
      // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */) {
      // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this,
          length = validate(that).length,
          middle = Math.floor(length / 2),
          index = 0,
          value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      }return that;
    },
    some: function some(callbackfn /*, thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this),
          length = O.length,
          $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toIndex(end, length)) - $begin));
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1),
        length = this.length,
        src = toObject(arrayLike),
        len = toLength(src.length),
        index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) {
      this[offset + index] = src[index++];
    }
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function isTAIndex(target, key) {
    return isObject(target) && target[TYPED_ARRAY] && (typeof key === 'undefined' ? 'undefined' : _typeof(key)) != 'symbol' && key in target && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, 'value') && !has(desc, 'get') && !has(desc, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !desc.configurable && (!has(desc, 'writable') || desc.writable) && (!has(desc, 'enumerable') || desc.enumerable)) {
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () {
    arrayToString.call({});
  })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function constructor() {/* noop */},
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function get() {
      return this[TYPED_ARRAY];
    }
  });

  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array',
        ISNT_UINT8 = NAME != 'Uint8Array',
        GETTER = 'get' + KEY,
        SETTER = 'set' + KEY,
        TypedArray = global[NAME],
        Base = TypedArray || {},
        TAC = TypedArray && getPrototypeOf(TypedArray),
        FORCED = !TypedArray || !$typed.ABV,
        O = {},
        TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function getter(that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function setter(that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function addElement(that, index) {
      dP(that, index, {
        get: function get() {
          return getter(this, index);
        },
        set: function set(value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0,
            offset = 0,
            buffer,
            byteLength,
            length,
            klass;
        if (!isObject(data)) {
          length = strictToLength(data, true);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) {
          addElement(that, index++);
        }
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!$iterDetect(function (iter) {
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(strictToLength(data, ISNT_UINT8));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR],
        CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined),
        $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function get() {
          return NAME;
        }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, { toString: arrayToString });

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () {/* empty */};
  })();
});

require.register("core-js/modules/_typed-buffer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    DESCRIPTORS = require('./_descriptors'),
    LIBRARY = require('./_library'),
    $typed = require('./_typed'),
    hide = require('./_hide'),
    redefineAll = require('./_redefine-all'),
    fails = require('./_fails'),
    anInstance = require('./_an-instance'),
    toInteger = require('./_to-integer'),
    toLength = require('./_to-length'),
    gOPN = require('./_object-gopn').f,
    dP = require('./_object-dp').f,
    arrayFill = require('./_array-fill'),
    setToStringTag = require('./_set-to-string-tag'),
    ARRAY_BUFFER = 'ArrayBuffer',
    DATA_VIEW = 'DataView',
    PROTOTYPE = 'prototype',
    WRONG_LENGTH = 'Wrong length!',
    WRONG_INDEX = 'Wrong index!',
    $ArrayBuffer = global[ARRAY_BUFFER],
    $DataView = global[DATA_VIEW],
    Math = global.Math,
    RangeError = global.RangeError,
    Infinity = global.Infinity,
    BaseBuffer = $ArrayBuffer,
    abs = Math.abs,
    pow = Math.pow,
    floor = Math.floor,
    log = Math.log,
    LN2 = Math.LN2,
    BUFFER = 'buffer',
    BYTE_LENGTH = 'byteLength',
    BYTE_OFFSET = 'byteOffset',
    $BUFFER = DESCRIPTORS ? '_b' : BUFFER,
    $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH,
    $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes),
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0,
      i = 0,
      s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0,
      e,
      m,
      c;
  value = abs(value);
  if (value != value || value === Infinity) {
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) {}
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) {}
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = eLen - 7,
      i = nBytes - 1,
      s = buffer[i--],
      e = s & 127,
      m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) {}
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) {}
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  }return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function packI8(it) {
  return [it & 0xff];
};
var packI16 = function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function packF64(it) {
  return packIEEE754(it, 52, 8);
};
var packF32 = function packF32(it) {
  return packIEEE754(it, 23, 4);
};

var addGetter = function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function get() {
      return this[internal];
    } });
};

var get = function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index,
      intIndex = toInteger(numIndex);
  if (numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b,
      start = intIndex + view[$OFFSET],
      pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index,
      intIndex = toInteger(numIndex);
  if (numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b,
      start = intIndex + view[$OFFSET],
      pack = conversion(+value);
  for (var i = 0; i < bytes; i++) {
    store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
  }
};

var validateArrayBufferArguments = function validateArrayBufferArguments(that, length) {
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length,
      byteLength = toLength(numberLength);
  if (numberLength != byteLength) throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    var byteLength = validateArrayBufferArguments(this, length);
    this._b = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH],
        offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
  }) || !fails(function () {
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2)),
      $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
  })();
});

require.register("core-js/modules/_typed.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    hide = require('./_hide'),
    uid = require('./_uid'),
    TYPED = uid('typed_array'),
    VIEW = uid('view'),
    ABV = !!(global.ArrayBuffer && global.DataView),
    CONSTR = ABV,
    i = 0,
    l = 9,
    Typed;

var TypedArrayConstructors = 'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};
  })();
});

require.register("core-js/modules/_uid.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var id = 0,
    px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
  })();
});

require.register("core-js/modules/_wks-define.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    core = require('./_core'),
    LIBRARY = require('./_library'),
    wksExt = require('./_wks-ext'),
    defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};
  })();
});

require.register("core-js/modules/_wks-ext.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

exports.f = require('./_wks');
  })();
});

require.register("core-js/modules/_wks.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var store = require('./_shared')('wks'),
    uid = require('./_uid'),
    _Symbol = require('./_global').Symbol,
    USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
  })();
});

require.register("core-js/modules/core.get-iterator-method.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var classof = require('./_classof'),
    ITERATOR = require('./_wks')('iterator'),
    Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};
  })();
});

require.register("core-js/modules/core.regexp.escape.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export'),
    $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) {
    return $re(it);
  } });
  })();
});

require.register("core-js/modules/es6.array.copy-within.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');
  })();
});

require.register("core-js/modules/es6.array.every.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});
  })();
});

require.register("core-js/modules/es6.array.fill.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');
  })();
});

require.register("core-js/modules/es6.array.filter.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});
  })();
});

require.register("core-js/modules/es6.array.find-index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $export = require('./_export'),
    $find = require('./_array-methods')(6),
    KEY = 'findIndex',
    forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /*, that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
  })();
});

require.register("core-js/modules/es6.array.find.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $export = require('./_export'),
    $find = require('./_array-methods')(5),
    KEY = 'find',
    forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /*, that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
  })();
});

require.register("core-js/modules/es6.array.for-each.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $forEach = require('./_array-methods')(0),
    STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});
  })();
});

require.register("core-js/modules/es6.array.from.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var ctx = require('./_ctx'),
    $export = require('./_export'),
    toObject = require('./_to-object'),
    call = require('./_iter-call'),
    isArrayIter = require('./_is-array-iter'),
    toLength = require('./_to-length'),
    createProperty = require('./_create-property'),
    getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /*, mapfn = undefined, thisArg = undefined*/) {
    var O = toObject(arrayLike),
        C = typeof this == 'function' ? this : Array,
        aLen = arguments.length,
        mapfn = aLen > 1 ? arguments[1] : undefined,
        mapping = mapfn !== undefined,
        index = 0,
        iterFn = getIterFn(O),
        length,
        result,
        step,
        iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});
  })();
});

require.register("core-js/modules/es6.array.index-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $indexOf = require('./_array-includes')(false),
    $native = [].indexOf,
    NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */) {
    return NEGATIVE_ZERO
    // convert -0 to +0
    ? $native.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments[1]);
  }
});
  })();
});

require.register("core-js/modules/es6.array.is-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });
  })();
});

require.register("core-js/modules/es6.array.iterator.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var addToUnscopables = require('./_add-to-unscopables'),
    step = require('./_iter-step'),
    Iterators = require('./_iterators'),
    toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t,
      kind = this._k,
      index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
  })();
});

require.register("core-js/modules/es6.array.join.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 22.1.3.13 Array.prototype.join(separator)

var $export = require('./_export'),
    toIObject = require('./_to-iobject'),
    arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});
  })();
});

require.register("core-js/modules/es6.array.last-index-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toIObject = require('./_to-iobject'),
    toInteger = require('./_to-integer'),
    toLength = require('./_to-length'),
    $native = [].lastIndexOf,
    NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this),
        length = toLength(O.length),
        index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (; index >= 0; index--) {
      if (index in O) if (O[index] === searchElement) return index || 0;
    }return -1;
  }
});
  })();
});

require.register("core-js/modules/es6.array.map.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});
  })();
});

require.register("core-js/modules/es6.array.of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() {}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of() /* ...args */{
    var index = 0,
        aLen = arguments.length,
        result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) {
      createProperty(result, index, arguments[index++]);
    }result.length = aLen;
    return result;
  }
});
  })();
});

require.register("core-js/modules/es6.array.reduce-right.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});
  })();
});

require.register("core-js/modules/es6.array.reduce.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});
  })();
});

require.register("core-js/modules/es6.array.slice.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    html = require('./_html'),
    cof = require('./_cof'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length'),
    arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length),
        klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toIndex(begin, len),
        upTo = toIndex(end, len),
        size = toLength(upTo - start),
        cloned = Array(size),
        i = 0;
    for (; i < size; i++) {
      cloned[i] = klass == 'String' ? this.charAt(start + i) : this[start + i];
    }return cloned;
  }
});
  })();
});

require.register("core-js/modules/es6.array.some.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});
  })();
});

require.register("core-js/modules/es6.array.sort.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    aFunction = require('./_a-function'),
    toObject = require('./_to-object'),
    fails = require('./_fails'),
    $sort = [].sort,
    test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
  }
});
  })();
});

require.register("core-js/modules/es6.array.species.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_set-species')('Array');
  })();
});

require.register("core-js/modules/es6.date.now.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function now() {
    return new Date().getTime();
  } });
  })();
});

require.register("core-js/modules/es6.date.to-iso-string.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

var $export = require('./_export'),
    fails = require('./_fails'),
    getTime = Date.prototype.getTime;

var lz = function lz(num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function () {
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString() {
    if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
    var d = this,
        y = d.getUTCFullYear(),
        m = d.getUTCMilliseconds(),
        s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
  })();
});

require.register("core-js/modules/es6.date.to-json.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({ toISOString: function toISOString() {
      return 1;
    } }) !== 1;
}), 'Date', {
  toJSON: function toJSON(key) {
    var O = toObject(this),
        pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});
  })();
});

require.register("core-js/modules/es6.date.to-primitive.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var TO_PRIMITIVE = require('./_wks')('toPrimitive'),
    proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
  })();
});

require.register("core-js/modules/es6.date.to-string.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var DateProto = Date.prototype,
    INVALID_DATE = 'Invalid Date',
    TO_STRING = 'toString',
    $toString = DateProto[TO_STRING],
    getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}
  })();
});

require.register("core-js/modules/es6.function.bind.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });
  })();
});

require.register("core-js/modules/es6.function.has-instance.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var isObject = require('./_is-object'),
    getPrototypeOf = require('./_object-gpo'),
    HAS_INSTANCE = require('./_wks')('hasInstance'),
    FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function value(O) {
    if (typeof this != 'function' || !isObject(O)) return false;
    if (!isObject(this.prototype)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = getPrototypeOf(O)) {
      if (this.prototype === O) return true;
    }return false;
  } });
  })();
});

require.register("core-js/modules/es6.function.name.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var dP = require('./_object-dp').f,
    createDesc = require('./_property-desc'),
    has = require('./_has'),
    FProto = Function.prototype,
    nameRE = /^\s*function ([^ (]*)/,
    NAME = 'name';

var isExtensible = Object.isExtensible || function () {
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function get() {
    try {
      var that = this,
          name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch (e) {
      return '';
    }
  }
});
  })();
});

require.register("core-js/modules/es6.map.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
  })();
});

require.register("core-js/modules/es6.math.acosh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.3 Math.acosh(x)
var $export = require('./_export'),
    log1p = require('./_math-log1p'),
    sqrt = Math.sqrt,
    $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
// V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
&& Math.floor($acosh(Number.MAX_VALUE)) == 710
// Tor Browser bug: Math.acosh(Infinity) -> NaN 
&& $acosh(Infinity) == Infinity), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
  })();
});

require.register("core-js/modules/es6.math.asinh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.5 Math.asinh(x)
var $export = require('./_export'),
    $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });
  })();
});

require.register("core-js/modules/es6.math.atanh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.7 Math.atanh(x)
var $export = require('./_export'),
    $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
  })();
});

require.register("core-js/modules/es6.math.cbrt.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export'),
    sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
  })();
});

require.register("core-js/modules/es6.math.clz32.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
  })();
});

require.register("core-js/modules/es6.math.cosh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.12 Math.cosh(x)
var $export = require('./_export'),
    exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
  })();
});

require.register("core-js/modules/es6.math.expm1.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.14 Math.expm1(x)
var $export = require('./_export'),
    $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });
  })();
});

require.register("core-js/modules/es6.math.fround.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.16 Math.fround(x)
var $export = require('./_export'),
    sign = require('./_math-sign'),
    pow = Math.pow,
    EPSILON = pow(2, -52),
    EPSILON32 = pow(2, -23),
    MAX32 = pow(2, 127) * (2 - EPSILON32),
    MIN32 = pow(2, -126);

var roundTiesToEven = function roundTiesToEven(n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

$export($export.S, 'Math', {
  fround: function fround(x) {
    var $abs = Math.abs(x),
        $sign = sign(x),
        a,
        result;
    if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if (result > MAX32 || result != result) return $sign * Infinity;
    return $sign * result;
  }
});
  })();
});

require.register("core-js/modules/es6.math.hypot.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export'),
    abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) {
    // eslint-disable-line no-unused-vars
    var sum = 0,
        i = 0,
        aLen = arguments.length,
        larg = 0,
        arg,
        div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
  })();
});

require.register("core-js/modules/es6.math.imul.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export'),
    $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff,
        xn = +x,
        yn = +y,
        xl = UINT16 & xn,
        yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
  })();
});

require.register("core-js/modules/es6.math.log10.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) / Math.LN10;
  }
});
  })();
});

require.register("core-js/modules/es6.math.log1p.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });
  })();
});

require.register("core-js/modules/es6.math.log2.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});
  })();
});

require.register("core-js/modules/es6.math.sign.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });
  })();
});

require.register("core-js/modules/es6.math.sinh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.30 Math.sinh(x)
var $export = require('./_export'),
    expm1 = require('./_math-expm1'),
    exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
  })();
});

require.register("core-js/modules/es6.math.tanh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.33 Math.tanh(x)
var $export = require('./_export'),
    expm1 = require('./_math-expm1'),
    exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x),
        b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
  })();
});

require.register("core-js/modules/es6.math.trunc.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
  })();
});

require.register("core-js/modules/es6.number.constructor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    has = require('./_has'),
    cof = require('./_cof'),
    inheritIfRequired = require('./_inherit-if-required'),
    toPrimitive = require('./_to-primitive'),
    fails = require('./_fails'),
    gOPN = require('./_object-gopn').f,
    gOPD = require('./_object-gopd').f,
    dP = require('./_object-dp').f,
    $trim = require('./_string-trim').trim,
    NUMBER = 'Number',
    $Number = global[NUMBER],
    Base = $Number,
    proto = $Number.prototype
// Opera ~12 has broken Object#toString
,
    BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER,
    TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function toNumber(argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0),
        third,
        radix,
        maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66:case 98:
          radix = 2;maxCode = 49;break; // fast equal /^0b[01]+$/i
        case 79:case 111:
          radix = 8;maxCode = 55;break; // fast equal /^0o[0-7]+$/i
        default:
          return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      }return parseInt(digits, radix);
    }
  }return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value,
        that = this;
    return that instanceof $Number
    // check on 1..constructor(foo) case
    && (BROKEN_COF ? fails(function () {
      proto.valueOf.call(that);
    }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
  // ES3:
  'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
  // ES6 (in case, if modules with ES6 Number statics required before):
  'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}
  })();
});

require.register("core-js/modules/es6.number.epsilon.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });
  })();
});

require.register("core-js/modules/es6.number.is-finite.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export'),
    _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});
  })();
});

require.register("core-js/modules/es6.number.is-integer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });
  })();
});

require.register("core-js/modules/es6.number.is-nan.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    return number != number;
  }
});
  })();
});

require.register("core-js/modules/es6.number.is-safe-integer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export'),
    isInteger = require('./_is-integer'),
    abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
  })();
});

require.register("core-js/modules/es6.number.max-safe-integer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });
  })();
});

require.register("core-js/modules/es6.number.min-safe-integer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });
  })();
});

require.register("core-js/modules/es6.number.parse-float.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });
  })();
});

require.register("core-js/modules/es6.number.parse-int.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });
  })();
});

require.register("core-js/modules/es6.number.to-fixed.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toInteger = require('./_to-integer'),
    aNumberValue = require('./_a-number-value'),
    repeat = require('./_string-repeat'),
    $toFixed = 1..toFixed,
    floor = Math.floor,
    data = [0, 0, 0, 0, 0, 0],
    ERROR = 'Number.toFixed: incorrect invocation!',
    ZERO = '0';

var multiply = function multiply(n, c) {
  var i = -1,
      c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function divide(n) {
  var i = 6,
      c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = c % n * 1e7;
  }
};
var numToString = function numToString() {
  var i = 6,
      s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  }return s;
};
var pow = function pow(x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function log(x) {
  var n = 0,
      x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  }return n;
};

$export($export.P + $export.F * (!!$toFixed && (0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) !== '1' || 1.255.toFixed(2) !== '1.25' || 1000000000000000128..toFixed(0) !== '1000000000000000128') || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR),
        f = toInteger(fractionDigits),
        s = '',
        m = ZERO,
        e,
        z,
        j,
        k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    }return m;
  }
});
  })();
});

require.register("core-js/modules/es6.number.to-precision.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $fails = require('./_fails'),
    aNumberValue = require('./_a-number-value'),
    $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});
  })();
});

require.register("core-js/modules/es6.object.assign.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });
  })();
});

require.register("core-js/modules/es6.object.create.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });
  })();
});

require.register("core-js/modules/es6.object.define-properties.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });
  })();
});

require.register("core-js/modules/es6.object.define-property.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });
  })();
});

require.register("core-js/modules/es6.object.freeze.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object'),
    meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
  })();
});

require.register("core-js/modules/es6.object.get-own-property-descriptor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject'),
    $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
  })();
});

require.register("core-js/modules/es6.object.get-own-property-names.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});
  })();
});

require.register("core-js/modules/es6.object.get-prototype-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object'),
    $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});
  })();
});

require.register("core-js/modules/es6.object.is-extensible.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
  })();
});

require.register("core-js/modules/es6.object.is-frozen.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
  })();
});

require.register("core-js/modules/es6.object.is-sealed.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
  })();
});

require.register("core-js/modules/es6.object.is.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });
  })();
});

require.register("core-js/modules/es6.object.keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object'),
    $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});
  })();
});

require.register("core-js/modules/es6.object.prevent-extensions.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object'),
    meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
  })();
});

require.register("core-js/modules/es6.object.seal.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object'),
    meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});
  })();
});

require.register("core-js/modules/es6.object.set-prototype-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });
  })();
});

require.register("core-js/modules/es6.object.to-string.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 19.1.3.6 Object.prototype.toString()

var classof = require('./_classof'),
    test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}
  })();
});

require.register("core-js/modules/es6.parse-float.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });
  })();
});

require.register("core-js/modules/es6.parse-int.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });
  })();
});

require.register("core-js/modules/es6.promise.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var LIBRARY = require('./_library'),
    global = require('./_global'),
    ctx = require('./_ctx'),
    classof = require('./_classof'),
    $export = require('./_export'),
    isObject = require('./_is-object'),
    aFunction = require('./_a-function'),
    anInstance = require('./_an-instance'),
    forOf = require('./_for-of'),
    speciesConstructor = require('./_species-constructor'),
    task = require('./_task').set,
    microtask = require('./_microtask')(),
    PROMISE = 'Promise',
    TypeError = global.TypeError,
    process = global.process,
    $Promise = global[PROMISE],
    process = global.process,
    isNode = classof(process) == 'process',
    empty = function empty() {/* empty */},
    Internal,
    GenericPromiseCapability,
    Wrapper;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1),
        FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var sameConstructor = function sameConstructor(a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function newPromiseCapability(C) {
  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};
var perform = function perform(exec) {
  try {
    exec();
  } catch (e) {
    return { error: e };
  }
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v,
        ok = promise._s == 1,
        i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail,
          resolve = reaction.resolve,
          reject = reaction.reject,
          domain = reaction.domain,
          result,
          then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v,
        abrupt,
        handler,
        console;
    if (isUnhandled(promise)) {
      abrupt = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (abrupt) throw abrupt.error;
  });
};
var isUnhandled = function isUnhandled(promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c,
      i = 0,
      reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  }return true;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this,
      then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function PromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this),
        $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    var capability = newPromiseCapability(this),
        $$resolve = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        resolve = capability.resolve,
        reject = capability.reject;
    var abrupt = perform(function () {
      var values = [],
          index = 0,
          remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++,
            alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        reject = capability.reject;
    var abrupt = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.apply.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export'),
    aFunction = require('./_a-function'),
    anObject = require('./_an-object'),
    rApply = (require('./_global').Reflect || {}).apply,
    fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () {});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target),
        L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.construct.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export'),
    create = require('./_object-create'),
    aFunction = require('./_a-function'),
    anObject = require('./_an-object'),
    isObject = require('./_is-object'),
    fails = require('./_fails'),
    bind = require('./_bind'),
    rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() {}
  return !(rConstruct(function () {}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () {});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0:
          return new Target();
        case 1:
          return new Target(args[0]);
        case 2:
          return new Target(args[0], args[1]);
        case 3:
          return new Target(args[0], args[1], args[2]);
        case 4:
          return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype,
        instance = create(isObject(proto) ? proto : Object.prototype),
        result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.define-property.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp'),
    $export = require('./_export'),
    anObject = require('./_an-object'),
    toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.delete-property.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export'),
    gOPD = require('./_object-gopd').f,
    anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.enumerate.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 26.1.5 Reflect.enumerate(target)

var $export = require('./_export'),
    anObject = require('./_an-object');
var Enumerate = function Enumerate(iterated) {
  this._t = anObject(iterated); // target
  this._i = 0; // next index
  var keys = this._k = [] // keys
  ,
      key;
  for (key in iterated) {
    keys.push(key);
  }
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this,
      keys = that._k,
      key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.get-own-property-descriptor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd'),
    $export = require('./_export'),
    anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.get-prototype-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export'),
    getProto = require('./_object-gpo'),
    anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.get.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd'),
    getPrototypeOf = require('./_object-gpo'),
    has = require('./_has'),
    $export = require('./_export'),
    isObject = require('./_is-object'),
    anObject = require('./_an-object');

function get(target, propertyKey /*, receiver*/) {
  var receiver = arguments.length < 3 ? target : arguments[2],
      desc,
      proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });
  })();
});

require.register("core-js/modules/es6.reflect.has.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.is-extensible.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export'),
    anObject = require('./_an-object'),
    $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.own-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });
  })();
});

require.register("core-js/modules/es6.reflect.prevent-extensions.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export'),
    anObject = require('./_an-object'),
    $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.set-prototype-of.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export'),
    setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});
  })();
});

require.register("core-js/modules/es6.reflect.set.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp'),
    gOPD = require('./_object-gopd'),
    getPrototypeOf = require('./_object-gpo'),
    has = require('./_has'),
    $export = require('./_export'),
    createDesc = require('./_property-desc'),
    anObject = require('./_an-object'),
    isObject = require('./_is-object');

function set(target, propertyKey, V /*, receiver*/) {
  var receiver = arguments.length < 4 ? target : arguments[3],
      ownDesc = gOPD.f(anObject(target), propertyKey),
      existingDescriptor,
      proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });
  })();
});

require.register("core-js/modules/es6.regexp.constructor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var global = require('./_global'),
    inheritIfRequired = require('./_inherit-if-required'),
    dP = require('./_object-dp').f,
    gOPN = require('./_object-gopn').f,
    isRegExp = require('./_is-regexp'),
    $flags = require('./_flags'),
    $RegExp = global.RegExp,
    Base = $RegExp,
    proto = $RegExp.prototype,
    re1 = /a/g,
    re2 = /a/g
// "new" creates a new object, old webkit buggy here
,
    CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp,
        piRE = isRegExp(p),
        fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
  };
  var proxy = function proxy(key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function get() {
        return Base[key];
      },
      set: function set(it) {
        Base[key] = it;
      }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) {
    proxy(keys[i++]);
  }proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');
  })();
});

require.register("core-js/modules/es6.regexp.flags.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
  })();
});

require.register("core-js/modules/es6.regexp.match.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';

    var O = defined(this),
        fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
  })();
});

require.register("core-js/modules/es6.regexp.replace.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';

    var O = defined(this),
        fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
  })();
});

require.register("core-js/modules/es6.regexp.search.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';

    var O = defined(this),
        fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
  })();
});

require.register("core-js/modules/es6.regexp.split.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';

  var isRegExp = require('./_is-regexp'),
      _split = $split,
      $push = [].push,
      $SPLIT = 'split',
      LENGTH = 'length',
      LAST_INDEX = 'lastIndex';
  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function $split(separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
    // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function $split(separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this),
        fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
  })();
});

require.register("core-js/modules/es6.regexp.to-string.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./es6.regexp.flags');
var anObject = require('./_an-object'),
    $flags = require('./_flags'),
    DESCRIPTORS = require('./_descriptors'),
    TO_STRING = 'toString',
    $toString = /./[TO_STRING];

var define = function define(fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () {
  return $toString.call({ source: 'a', flags: 'b' }) != '/a/b';
})) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
  // FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}
  })();
});

require.register("core-js/modules/es6.set.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function (get) {
  return function Set() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
  })();
});

require.register("core-js/modules/es6.string.anchor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.2 String.prototype.anchor(name)

require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});
  })();
});

require.register("core-js/modules/es6.string.big.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.3 String.prototype.big()

require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.blink.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.4 String.prototype.blink()

require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.bold.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.5 String.prototype.bold()

require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.code-point-at.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});
  })();
});

require.register("core-js/modules/es6.string.ends-with.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';

var $export = require('./_export'),
    toLength = require('./_to-length'),
    context = require('./_string-context'),
    ENDS_WITH = 'endsWith',
    $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH),
        endPosition = arguments.length > 1 ? arguments[1] : undefined,
        len = toLength(that.length),
        end = endPosition === undefined ? len : Math.min(toLength(endPosition), len),
        search = String(searchString);
    return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
  }
});
  })();
});

require.register("core-js/modules/es6.string.fixed.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.6 String.prototype.fixed()

require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.fontcolor.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.7 String.prototype.fontcolor(color)

require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});
  })();
});

require.register("core-js/modules/es6.string.fontsize.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.8 String.prototype.fontsize(size)

require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});
  })();
});

require.register("core-js/modules/es6.string.from-code-point.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toIndex = require('./_to-index'),
    fromCharCode = String.fromCharCode,
    $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) {
    // eslint-disable-line no-unused-vars
    var res = [],
        aLen = arguments.length,
        i = 0,
        code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
    }return res.join('');
  }
});
  })();
});

require.register("core-js/modules/es6.string.includes.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    // 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';

var $export = require('./_export'),
    context = require('./_string-context'),
    INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */) {
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
  })();
});

require.register("core-js/modules/es6.string.italics.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.9 String.prototype.italics()

require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.iterator.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t,
      index = this._i,
      point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});
  })();
});

require.register("core-js/modules/es6.string.link.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.10 String.prototype.link(url)

require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});
  })();
});

require.register("core-js/modules/es6.string.raw.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toIObject = require('./_to-iobject'),
    toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw),
        len = toLength(tpl.length),
        aLen = arguments.length,
        res = [],
        i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    }return res.join('');
  }
});
  })();
});

require.register("core-js/modules/es6.string.repeat.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
  })();
});

require.register("core-js/modules/es6.string.small.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.11 String.prototype.small()

require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.starts-with.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';

var $export = require('./_export'),
    toLength = require('./_to-length'),
    context = require('./_string-context'),
    STARTS_WITH = 'startsWith',
    $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */) {
    var that = context(this, searchString, STARTS_WITH),
        index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length)),
        search = String(searchString);
    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
  }
});
  })();
});

require.register("core-js/modules/es6.string.strike.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.12 String.prototype.strike()

require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.sub.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.13 String.prototype.sub()

require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.sup.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// B.2.3.14 String.prototype.sup()

require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});
  })();
});

require.register("core-js/modules/es6.string.trim.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// 21.1.3.25 String.prototype.trim()

require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});
  })();
});

require.register("core-js/modules/es6.symbol.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// ECMAScript 6 symbols shim

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var global = require('./_global'),
    has = require('./_has'),
    DESCRIPTORS = require('./_descriptors'),
    $export = require('./_export'),
    redefine = require('./_redefine'),
    META = require('./_meta').KEY,
    $fails = require('./_fails'),
    shared = require('./_shared'),
    setToStringTag = require('./_set-to-string-tag'),
    uid = require('./_uid'),
    wks = require('./_wks'),
    wksExt = require('./_wks-ext'),
    wksDefine = require('./_wks-define'),
    keyOf = require('./_keyof'),
    enumKeys = require('./_enum-keys'),
    isArray = require('./_is-array'),
    anObject = require('./_an-object'),
    toIObject = require('./_to-iobject'),
    toPrimitive = require('./_to-primitive'),
    createDesc = require('./_property-desc'),
    _create = require('./_object-create'),
    gOPNExt = require('./_object-gopn-ext'),
    $GOPD = require('./_object-gopd'),
    $DP = require('./_object-dp'),
    $keys = require('./_object-keys'),
    gOPD = $GOPD.f,
    dP = $DP.f,
    gOPN = gOPNExt.f,
    $Symbol = global.Symbol,
    $JSON = global.JSON,
    _stringify = $JSON && $JSON.stringify,
    PROTOTYPE = 'prototype',
    HIDDEN = wks('_hidden'),
    TO_PRIMITIVE = wks('toPrimitive'),
    isEnum = {}.propertyIsEnumerable,
    SymbolRegistry = shared('symbol-registry'),
    AllSymbols = shared('symbols'),
    OPSymbols = shared('op-symbols'),
    ObjectProto = Object[PROTOTYPE],
    USE_NATIVE = typeof $Symbol == 'function',
    QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function get() {
      return dP(this, 'a', { value: 7 }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    }return setSymbolDesc(it, key, D);
  }return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P)),
      i = 0,
      l = keys.length,
      key;
  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it)),
      result = [],
      i = 0,
      key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto,
      names = gOPN(IS_OP ? OPSymbols : toIObject(it)),
      result = [],
      i = 0,
      key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var symbols =
// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), i = 0; symbols.length > i;) {
  wks(symbols[i++]);
}for (var symbols = $keys(wks.store), i = 0; symbols.length > i;) {
  wksDefine(symbols[i++]);
}$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key) {
    if (isSymbol(key)) return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it],
        i = 1,
        replacer,
        $replacer;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
  })();
});

require.register("core-js/modules/es6.typed.array-buffer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $typed = require('./_typed'),
    buffer = require('./_typed-buffer'),
    anObject = require('./_an-object'),
    toIndex = require('./_to-index'),
    toLength = require('./_to-length'),
    isObject = require('./_is-object'),
    ArrayBuffer = require('./_global').ArrayBuffer,
    speciesConstructor = require('./_species-constructor'),
    $ArrayBuffer = buffer.ArrayBuffer,
    $DataView = buffer.DataView,
    $isView = $typed.ABV && ArrayBuffer.isView,
    $slice = $ArrayBuffer.prototype.slice,
    VIEW = $typed.VIEW,
    ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength,
        first = toIndex(start, len),
        final = toIndex(end === undefined ? len : end, len),
        result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first)),
        viewS = new $DataView(this),
        viewT = new $DataView(result),
        index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    }return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
  })();
});

require.register("core-js/modules/es6.typed.data-view.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});
  })();
});

require.register("core-js/modules/es6.typed.float32-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.float64-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.int16-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.int32-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.int8-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.uint16-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.uint32-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.uint8-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});
  })();
});

require.register("core-js/modules/es6.typed.uint8-clamped-array.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);
  })();
});

require.register("core-js/modules/es6.weak-map.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var each = require('./_array-methods')(0),
    redefine = require('./_redefine'),
    meta = require('./_meta'),
    assign = require('./_object-assign'),
    weak = require('./_collection-weak'),
    isObject = require('./_is-object'),
    getWeak = meta.getWeak,
    isExtensible = Object.isExtensible,
    uncaughtFrozenStore = weak.ufstore,
    tmp = {},
    InternalMap;

var wrapper = function wrapper(get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7) {
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype,
        method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
        // store all the rest on native weakmap
      }return method.call(this, a, b);
    });
  });
}
  })();
});

require.register("core-js/modules/es6.weak-set.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function (get) {
  return function WeakSet() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(this, value, true);
  }
}, weak, false, true);
  })();
});

require.register("core-js/modules/es7.array.includes.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/tc39/Array.prototype.includes

var $export = require('./_export'),
    $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
  })();
});

require.register("core-js/modules/es7.asap.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export'),
    microtask = require('./_microtask')(),
    process = require('./_global').process,
    isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});
  })();
});

require.register("core-js/modules/es7.error.is-error.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/ljharb/proposal-is-error
var $export = require('./_export'),
    cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});
  })();
});

require.register("core-js/modules/es7.map.to-json.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });
  })();
});

require.register("core-js/modules/es7.math.iaddh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0,
        $x1 = x1 >>> 0,
        $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});
  })();
});

require.register("core-js/modules/es7.math.imulh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff,
        $u = +u,
        $v = +v,
        u0 = $u & UINT16,
        v0 = $v & UINT16,
        u1 = $u >> 16,
        v1 = $v >> 16,
        t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});
  })();
});

require.register("core-js/modules/es7.math.isubh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0,
        $x1 = x1 >>> 0,
        $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});
  })();
});

require.register("core-js/modules/es7.math.umulh.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff,
        $u = +u,
        $v = +v,
        u0 = $u & UINT16,
        v0 = $v & UINT16,
        u1 = $u >>> 16,
        v1 = $v >>> 16,
        t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});
  })();
});

require.register("core-js/modules/es7.object.define-getter.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    aFunction = require('./_a-function'),
    $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});
  })();
});

require.register("core-js/modules/es7.object.define-setter.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    aFunction = require('./_a-function'),
    $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});
  })();
});

require.register("core-js/modules/es7.object.entries.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export'),
    $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});
  })();
});

require.register("core-js/modules/es7.object.get-own-property-descriptors.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export'),
    ownKeys = require('./_own-keys'),
    toIObject = require('./_to-iobject'),
    gOPD = require('./_object-gopd'),
    createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object),
        getDesc = gOPD.f,
        keys = ownKeys(O),
        result = {},
        i = 0,
        key;
    while (keys.length > i) {
      createProperty(result, key = keys[i++], getDesc(O, key));
    }return result;
  }
});
  })();
});

require.register("core-js/modules/es7.object.lookup-getter.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    toPrimitive = require('./_to-primitive'),
    getPrototypeOf = require('./_object-gpo'),
    getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this),
        K = toPrimitive(P, true),
        D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});
  })();
});

require.register("core-js/modules/es7.object.lookup-setter.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    toObject = require('./_to-object'),
    toPrimitive = require('./_to-primitive'),
    getPrototypeOf = require('./_object-gpo'),
    getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this),
        K = toPrimitive(P, true),
        D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});
  })();
});

require.register("core-js/modules/es7.object.values.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export'),
    $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});
  })();
});

require.register("core-js/modules/es7.observable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/zenparsing/es-observable

var $export = require('./_export'),
    global = require('./_global'),
    core = require('./_core'),
    microtask = require('./_microtask')(),
    OBSERVABLE = require('./_wks')('observable'),
    aFunction = require('./_a-function'),
    anObject = require('./_an-object'),
    anInstance = require('./_an-instance'),
    redefineAll = require('./_redefine-all'),
    hide = require('./_hide'),
    forOf = require('./_for-of'),
    RETURN = forOf.RETURN;

var getMethod = function getMethod(fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function cleanupSubscription(subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function subscriptionClosed(subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function closeSubscription(subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function Subscription(observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer),
        subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function cleanup() {
        subscription.unsubscribe();
      };else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  }if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() {
    closeSubscription(this);
  }
});

var SubscriptionObserver = function SubscriptionObserver(subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    }cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      }cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function next(value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          }observer.complete();
        }
      });
      return function () {
        done = true;
      };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = Array(l); i < l;) {
      items[i] = arguments[i++];
    }return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var i = 0; i < items.length; ++i) {
            observer.next(items[i]);
            if (done) return;
          }observer.complete();
        }
      });
      return function () {
        done = true;
      };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () {
  return this;
});

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');
  })();
});

require.register("core-js/modules/es7.reflect.define-metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    toMetaKey = metadata.key,
    ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
    ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.delete-metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    toMetaKey = metadata.key,
    getOrCreateMetadataMap = metadata.map,
    store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]),
        metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
    if (metadataMap.size) return true;
    var targetMetadata = store.get(target);
    targetMetadata['delete'](targetKey);
    return !!targetMetadata.size || store['delete'](target);
  } });
  })();
});

require.register("core-js/modules/es7.reflect.get-metadata-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var Set = require('./es6.set'),
    from = require('./_array-from-iterable'),
    metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    getPrototypeOf = require('./_object-gpo'),
    ordinaryOwnMetadataKeys = metadata.keys,
    toMetaKey = metadata.key;

var ordinaryMetadataKeys = function ordinaryMetadataKeys(O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P),
      parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /*, targetKey */) {
    return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.get-metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    getPrototypeOf = require('./_object-gpo'),
    ordinaryHasOwnMetadata = metadata.has,
    ordinaryGetOwnMetadata = metadata.get,
    toMetaKey = metadata.key;

var ordinaryGetMetadata = function ordinaryGetMetadata(MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.get-own-metadata-keys.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    ordinaryOwnMetadataKeys = metadata.keys,
    toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */) {
    return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.get-own-metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    ordinaryGetOwnMetadata = metadata.get,
    toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryGetOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.has-metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    getPrototypeOf = require('./_object-gpo'),
    ordinaryHasOwnMetadata = metadata.has,
    toMetaKey = metadata.key;

var ordinaryHasMetadata = function ordinaryHasMetadata(MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.has-own-metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    ordinaryHasOwnMetadata = metadata.has,
    toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */) {
    return ordinaryHasOwnMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
  } });
  })();
});

require.register("core-js/modules/es7.reflect.metadata.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var metadata = require('./_metadata'),
    anObject = require('./_an-object'),
    aFunction = require('./_a-function'),
    toMetaKey = metadata.key,
    ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
    return function decorator(target, targetKey) {
      ordinaryDefineOwnMetadata(metadataKey, metadataValue, (targetKey !== undefined ? anObject : aFunction)(target), toMetaKey(targetKey));
    };
  } });
  })();
});

require.register("core-js/modules/es7.set.to-json.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });
  })();
});

require.register("core-js/modules/es7.string.at.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/mathiasbynens/String.prototype.at

var $export = require('./_export'),
    $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});
  })();
});

require.register("core-js/modules/es7.string.match-all.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://tc39.github.io/String.prototype.matchAll/

var $export = require('./_export'),
    defined = require('./_defined'),
    toLength = require('./_to-length'),
    isRegExp = require('./_is-regexp'),
    getFlags = require('./_flags'),
    RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function $RegExpStringIterator(regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this),
        flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp),
        rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});
  })();
});

require.register("core-js/modules/es7.string.pad-end.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/tc39/proposal-string-pad-start-end

var $export = require('./_export'),
    $pad = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
  })();
});

require.register("core-js/modules/es7.string.pad-start.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/tc39/proposal-string-pad-start-end

var $export = require('./_export'),
    $pad = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
  })();
});

require.register("core-js/modules/es7.string.trim-left.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');
  })();
});

require.register("core-js/modules/es7.string.trim-right.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim

require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');
  })();
});

require.register("core-js/modules/es7.symbol.async-iterator.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_wks-define')('asyncIterator');
  })();
});

require.register("core-js/modules/es7.symbol.observable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./_wks-define')('observable');
  })();
});

require.register("core-js/modules/es7.system.global.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });
  })();
});

require.register("core-js/modules/web.dom.iterable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $iterators = require('./es6.array.iterator'),
    redefine = require('./_redefine'),
    global = require('./_global'),
    hide = require('./_hide'),
    Iterators = require('./_iterators'),
    wks = require('./_wks'),
    ITERATOR = wks('iterator'),
    TO_STRING_TAG = wks('toStringTag'),
    ArrayValues = Iterators.Array;

for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
  var NAME = collections[i],
      Collection = global[NAME],
      proto = Collection && Collection.prototype,
      key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for (key in $iterators) {
      if (!proto[key]) redefine(proto, key, $iterators[key], true);
    }
  }
}
  })();
});

require.register("core-js/modules/web.immediate.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

var $export = require('./_export'),
    $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});
  })();
});

require.register("core-js/modules/web.timers.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global'),
    $export = require('./_export'),
    invoke = require('./_invoke'),
    partial = require('./_partial'),
    navigator = global.navigator,
    MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function wrap(set) {
  return MSIE ? function (fn, time /*, ...args */) {
    return set(invoke(partial, [].slice.call(arguments, 2), typeof fn == 'function' ? fn : Function(fn)), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
  })();
});

require.register("core-js/shim.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "core-js");
  (function() {
    'use strict';

require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');
  })();
});

require.register("process/browser.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "process");
  (function() {
    'use strict';

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};
  })();
});

require.register("vue-resource/dist/vue-resource.common.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "vue-resource");
  (function() {
    /*!
 * vue-resource v1.0.3
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

'use strict';

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$1.reject = function (r) {
    return new Promise$1(function (resolve, reject) {
        reject(r);
    });
};

Promise$1.resolve = function (x) {
    return new Promise$1(function (resolve, reject) {
        resolve(x);
    });
};

Promise$1.all = function all(iterable) {
    return new Promise$1(function (resolve, reject) {
        var count = 0,
            result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$1.race = function race(iterable) {
    return new Promise$1(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p$1 = Promise$1.prototype;

p$1.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;
                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p$1.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p$1.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p$1.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$1(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p$1.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
    window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

    if (executor instanceof Promise) {
        this.promise = executor;
    } else {
        this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
}

PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
};

var p = PromiseObj.prototype;

p.bind = function (context) {
    this.context = context;
    return this;
};

p.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
};

p.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return Promise.reject(reason);
    });
};

/**
 * Utility functions.
 */

var debug = false;var util = {};var slice = [].slice;

function Util(Vue) {
    util = Vue.util;
    debug = Vue.config.debug || !Vue.config.silent;
}

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return util.nextTick(cb, ctx);
}

function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

function toLower(str) {
    return str ? str.toLowerCase() : '';
}

function toUpper(str) {
    return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isBoolean(val) {
    return val === true || val === false;
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

function each(obj, iterator) {

    var i, key;

    if (obj && typeof obj.length == 'number') {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    });

    return target;
}

function _assign(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Root Prefix Transform.
 */

function root(options, next) {

    var url = next(options);

    if (isString(options.root) && !url.match(/^(https?:)?\//)) {
        url = options.root + '/' + url;
    }

    return url;
}

/**
 * Query Parameter Transform.
 */

function query(options, next) {

    var urlParams = Object.keys(Url.options.params),
        query = {},
        url = next(options);

    each(options.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
}

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];

    return {
        vars: variables,
        expand: function expand(context) {
            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null,
                        values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }
                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

function template(options) {

    var variables = [],
        url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
}

/**
 * Service for URL templating.
 */

var ie = document.documentMode;
var el = document.createElement('a');

function Url(url, params) {

    var self = this || {},
        options = url,
        transform;

    if (isString(url)) {
        options = { url: url, params: params };
    }

    options = merge({}, Url.options, self.$options, options);

    Url.transforms.forEach(function (handler) {
        transform = factory(handler, transform, self.$vm);
    });

    return transform(options);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transforms = [template, query, root];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [],
        escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    if (ie) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options) {
        return handler.call(vm, options, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj),
        plain = isPlainObject(obj),
        hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * XDomain client (Internet Explorer).
 */

function xdrClient(request) {
    return new PromiseObj(function (resolve) {

        var xdr = new XDomainRequest(),
            handler = function handler(_ref) {
            var type = _ref.type;

            var status = 0;

            if (type === 'load') {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(xdr.responseText, { status: status }));
        };

        request.abort = function () {
            return xdr.abort();
        };

        xdr.open(request.method, request.getUrl());
        xdr.timeout = 0;
        xdr.onload = handler;
        xdr.onerror = handler;
        xdr.ontimeout = handler;
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
}

/**
 * CORS Interceptor.
 */

var ORIGIN_URL = Url.parse(location.href);
var SUPPORTS_CORS = 'withCredentials' in new XMLHttpRequest();

function cors(request, next) {

    if (!isBoolean(request.crossOrigin) && crossOrigin(request)) {
        request.crossOrigin = true;
    }

    if (request.crossOrigin) {

        if (!SUPPORTS_CORS) {
            request.client = xdrClient;
        }

        delete request.emulateHTTP;
    }

    next();
}

function crossOrigin(request) {

    var requestUrl = Url.parse(Url(request));

    return requestUrl.protocol !== ORIGIN_URL.protocol || requestUrl.host !== ORIGIN_URL.host;
}

/**
 * Body Interceptor.
 */

function body(request, next) {

    if (isFormData(request.body)) {

        request.headers.delete('Content-Type');
    } else if (isObject(request.body) || isArray(request.body)) {

        if (request.emulateJSON) {
            request.body = Url.params(request.body);
            request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        } else {
            request.body = JSON.stringify(request.body);
        }
    }

    next(function (response) {

        Object.defineProperty(response, 'data', {
            get: function get() {
                return this.body;
            },
            set: function set(body) {
                this.body = body;
            }
        });

        return response.bodyText ? when(response.text(), function (text) {

            var type = response.headers.get('Content-Type');

            if (isString(type) && type.indexOf('application/json') === 0) {

                try {
                    response.body = JSON.parse(text);
                } catch (e) {
                    response.body = null;
                }
            } else {
                response.body = text;
            }

            return response;
        }) : response;
    });
}

/**
 * JSONP client.
 */

function jsonpClient(request) {
    return new PromiseObj(function (resolve) {

        var name = request.jsonp || 'callback',
            callback = '_jsonp' + Math.random().toString(36).substr(2),
            body = null,
            handler,
            script;

        handler = function handler(_ref) {
            var type = _ref.type;

            var status = 0;

            if (type === 'load' && body !== null) {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(body, { status: status }));

            delete window[callback];
            document.body.removeChild(script);
        };

        request.params[name] = callback;

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
}

/**
 * JSONP Interceptor.
 */

function jsonp(request, next) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

    next(function (response) {

        if (request.method == 'JSONP') {

            return when(response.json(), function (json) {

                response.body = json;

                return response;
            });
        }
    });
}

/**
 * Before Interceptor.
 */

function before(request, next) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

    next();
}

/**
 * HTTP method override Interceptor.
 */

function method(request, next) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }

    next();
}

/**
 * Header Interceptor.
 */

function header(request, next) {

    var headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[toLower(request.method)]);

    each(headers, function (value, name) {
        if (!request.headers.has(name)) {
            request.headers.set(name, value);
        }
    });

    next();
}

/**
 * Timeout Interceptor.
 */

function timeout(request, next) {

    var timeout;

    if (request.timeout) {
        timeout = setTimeout(function () {
            request.abort();
        }, request.timeout);
    }

    next(function (response) {

        clearTimeout(timeout);
    });
}

/**
 * XMLHttp client.
 */

function xhrClient(request) {
    return new PromiseObj(function (resolve) {

        var xhr = new XMLHttpRequest(),
            handler = function handler(event) {

            var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
            });

            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
            });

            resolve(response);
        };

        request.abort = function () {
            return xhr.abort();
        };

        if (request.progress) {
            if (request.method === 'GET') {
                xhr.addEventListener('progress', request.progress);
            } else if (/^(POST|PUT)$/i.test(request.method)) {
                xhr.upload.addEventListener('progress', request.progress);
            }
        }

        xhr.open(request.method, request.getUrl(), true);

        if ('responseType' in xhr) {
            xhr.responseType = 'blob';
        }

        if (request.credentials === true) {
            xhr.withCredentials = true;
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value);
        });

        xhr.timeout = 0;
        xhr.onload = handler;
        xhr.onerror = handler;
        xhr.send(request.getBody());
    });
}

/**
 * Base client.
 */

function Client(context) {

    var reqHandlers = [sendRequest],
        resHandlers = [],
        handler;

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        return new PromiseObj(function (resolve) {

            function exec() {

                handler = reqHandlers.pop();

                if (isFunction(handler)) {
                    handler.call(context, request, next);
                } else {
                    warn('Invalid interceptor of type ' + (typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) + ', must be a function');
                    next();
                }
            }

            function next(response) {

                if (isFunction(response)) {

                    resHandlers.unshift(response);
                } else if (isObject(response)) {

                    resHandlers.forEach(function (handler) {
                        response = when(response, function (response) {
                            return handler.call(context, response) || response;
                        });
                    });

                    when(response, resolve);

                    return;
                }

                exec();
            }

            exec();
        }, context);
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
}

function sendRequest(request, resolve) {

    var client = request.client || xhrClient;

    resolve(client(request));
}

var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
};

/**
 * HTTP Headers.
 */

var Headers = function () {
    function Headers(headers) {
        var _this = this;

        classCallCheck(this, Headers);

        this.map = {};

        each(headers, function (value, name) {
            return _this.append(name, value);
        });
    }

    Headers.prototype.has = function has(name) {
        return getName(this.map, name) !== null;
    };

    Headers.prototype.get = function get(name) {

        var list = this.map[getName(this.map, name)];

        return list ? list[0] : null;
    };

    Headers.prototype.getAll = function getAll(name) {
        return this.map[getName(this.map, name)] || [];
    };

    Headers.prototype.set = function set(name, value) {
        this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
    };

    Headers.prototype.append = function append(name, value) {

        var list = this.getAll(name);

        if (list.length) {
            list.push(trim(value));
        } else {
            this.set(name, value);
        }
    };

    Headers.prototype.delete = function _delete(name) {
        delete this.map[getName(this.map, name)];
    };

    Headers.prototype.forEach = function forEach(callback, thisArg) {
        var _this2 = this;

        each(this.map, function (list, name) {
            each(list, function (value) {
                return callback.call(thisArg, value, name, _this2);
            });
        });
    };

    return Headers;
}();

function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
        return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
}

function normalizeName(name) {

    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function () {
    function Response(body, _ref) {
        var url = _ref.url;
        var headers = _ref.headers;
        var status = _ref.status;
        var statusText = _ref.statusText;
        classCallCheck(this, Response);

        this.url = url;
        this.ok = status >= 200 && status < 300;
        this.status = status || 0;
        this.statusText = statusText || '';
        this.headers = new Headers(headers);
        this.body = body;

        if (isString(body)) {

            this.bodyText = body;
        } else if (isBlob(body)) {

            this.bodyBlob = body;

            if (isBlobText(body)) {
                this.bodyText = blobText(body);
            }
        }
    }

    Response.prototype.blob = function blob() {
        return when(this.bodyBlob);
    };

    Response.prototype.text = function text() {
        return when(this.bodyText);
    };

    Response.prototype.json = function json() {
        return when(this.text(), function (text) {
            return JSON.parse(text);
        });
    };

    return Response;
}();

function blobText(body) {
    return new PromiseObj(function (resolve) {

        var reader = new FileReader();

        reader.readAsText(body);
        reader.onload = function () {
            resolve(reader.result);
        };
    });
}

function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function () {
    function Request(options) {
        classCallCheck(this, Request);

        this.body = null;
        this.params = {};

        assign(this, options, {
            method: toUpper(options.method || 'GET')
        });

        if (!(this.headers instanceof Headers)) {
            this.headers = new Headers(this.headers);
        }
    }

    Request.prototype.getUrl = function getUrl() {
        return Url(this);
    };

    Request.prototype.getBody = function getBody() {
        return this.body;
    };

    Request.prototype.respondWith = function respondWith(body, options) {
        return new Response(body, assign(options || {}, { url: this.getUrl() }));
    };

    return Request;
}();

/**
 * Service for sending network requests.
 */

var CUSTOM_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };
var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

function Http(options) {

    var self = this || {},
        client = Client(self.$vm);

    defaults(options || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {
        client.use(handler);
    });

    return client(new Request(options)).then(function (response) {

        return response.ok ? response : PromiseObj.reject(response);
    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return PromiseObj.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    custom: CUSTOM_HEADERS,
    common: COMMON_HEADERS
};

Http.interceptors = [before, timeout, method, body, jsonp, header, cors];

['get', 'delete', 'head', 'jsonp'].forEach(function (method) {

    Http[method] = function (url, options) {
        return this(assign(options || {}, { url: url, method: method }));
    };
});

['post', 'put', 'patch'].forEach(function (method) {

    Http[method] = function (url, body, options) {
        return this(assign(options || {}, { url: url, method: method, body: body }));
    };
});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options) {

    var self = this || {},
        resource = {};

    actions = assign({}, Resource.actions, actions);

    each(actions, function (action, name) {

        action = merge({ url: url, params: assign({}, params) }, options, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options = assign({}, action),
        params = {},
        body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 4 arguments [params, body], got ' + args.length + ' arguments';
    }

    options.body = body;
    options.params = assign({}, options.params, params);

    return options;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = PromiseObj;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function get() {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function get() {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function get() {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function get() {
                var _this = this;

                return function (executor) {
                    return new Vue.Promise(executor, _this);
                };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

module.exports = plugin;
  })();
});

require.register("vue-router/dist/vue-router.common.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "vue-router");
  (function() {
    /**
  * vue-router v2.1.1
  * (c) 2016 Evan You
  * @license MIT
  */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render(h, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});
    var depth = 0;
    var inactive = false;

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }

    data.routerViewDepth = depth;
    var matched = route.matched[depth];
    if (!matched) {
      return h();
    }

    var name = props.name;
    var component = inactive ? cache[name] : cache[name] = matched.components[name];

    if (!inactive) {
      var hooks = data.hook || (data.hook = {});
      hooks.init = function (vnode) {
        matched.instances[name] = vnode.child;
      };
      hooks.prepatch = function (oldVnode, vnode) {
        matched.instances[name] = vnode.child;
      };
      hooks.destroy = function (vnode) {
        if (matched.instances[name] === vnode.child) {
          matched.instances[name] = undefined;
        }
      };
    }

    return h(component, data, children);
  }
};

/*  */

function assert(condition, message) {
  if (!condition) {
    throw new Error("[vue-router] " + message);
  }
}

function warn(condition, message) {
  if (!condition) {
    typeof console !== 'undefined' && console.warn("[vue-router] " + message);
  }
}

/*  */

var encode = encodeURIComponent;
var decode = decodeURIComponent;

function resolveQuery(query, extraQuery) {
  if (extraQuery === void 0) extraQuery = {};

  if (query) {
    var parsedQuery;
    try {
      parsedQuery = parseQuery(query);
    } catch (e) {
      'production' !== 'production' && warn(false, e.message);
      parsedQuery = {};
    }
    for (var key in extraQuery) {
      parsedQuery[key] = extraQuery[key];
    }
    return parsedQuery;
  } else {
    return extraQuery;
  }
}

function parseQuery(query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0 ? decode(parts.join('=')) : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res;
}

function stringifyQuery(obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return '';
    }

    if (val === null) {
      return encode(key);
    }

    if (Array.isArray(val)) {
      var result = [];
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&');
    }

    return encode(key) + '=' + encode(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?" + res : '';
}

/*  */

function createRoute(record, location, redirectedFrom) {
  var route = {
    name: location.name || record && record.name,
    meta: record && record.meta || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom);
  }
  return Object.freeze(route);
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch(record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}

function getFullPath(ref) {
  var path = ref.path;
  var query = ref.query;if (query === void 0) query = {};
  var hash = ref.hash;if (hash === void 0) hash = '';

  return (path || '/') + stringifyQuery(query) + hash;
}

var trailingSlashRE = /\/$/;
function isSameRoute(a, b) {
  if (b === START) {
    return a === b;
  } else if (!b) {
    return false;
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && a.hash === b.hash && isObjectEqual(a.query, b.query);
  } else if (a.name && b.name) {
    return a.name === b.name && a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params);
  } else {
    return false;
  }
}

function isObjectEqual(a, b) {
  if (a === void 0) a = {};
  if (b === void 0) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(function (key) {
    return String(a[key]) === String(b[key]);
  });
}

function isIncludedRoute(current, target) {
  return current.path.indexOf(target.path.replace(/\/$/, '')) === 0 && (!target.hash || current.hash === target.hash) && queryIncludes(current.query, target.query);
}

function queryIncludes(current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false;
    }
  }
  return true;
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    event: {
      type: [String, Array],
      default: 'click'
    }
  },
  render: function render(h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var normalizedTo = ref.normalizedTo;
    var resolved = ref.resolved;
    var href = ref.href;
    var classes = {};
    var activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active';
    var compareTarget = normalizedTo.path ? createRoute(null, normalizedTo) : resolved;
    classes[activeClass] = this.exact ? isSameRoute(current, compareTarget) : isIncludedRoute(current, compareTarget);

    var handler = function handler(e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(normalizedTo);
        } else {
          router.push(normalizedTo);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default);
  }
};

function guardEvent(e) {
  // don't redirect with control keys
  /* istanbul ignore if */
  if (e.metaKey || e.ctrlKey || e.shiftKey) {
    return;
  }
  // don't redirect when preventDefault called
  /* istanbul ignore if */
  if (e.defaultPrevented) {
    return;
  }
  // don't redirect on right click
  /* istanbul ignore if */
  if (e.button !== 0) {
    return;
  }
  // don't redirect if `target="_blank"`
  /* istanbul ignore if */
  var target = e.target.getAttribute('target');
  if (/\b_blank\b/i.test(target)) {
    return;
  }

  e.preventDefault();
  return true;
}

function findAnchor(children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child;
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child;
      }
    }
  }
}

var _Vue;

function install(Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get() {
      return this.$root._router;
    }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get$1() {
      return this.$root._route;
    }
  });

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (this.$options.router) {
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.created;
}

/*  */

function resolvePath(relative, base, append) {
  if (relative.charAt(0) === '/') {
    return relative;
  }

  if (relative.charAt(0) === '?' || relative.charAt(0) === '#') {
    return base + relative;
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '.') {
      continue;
    } else if (segment === '..') {
      stack.pop();
    } else {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

function parsePath(path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  };
}

function cleanPath(path) {
  return path.replace(/\/\//g, '/');
}

/*  */

function createRouteMap(routes) {
  var pathMap = Object.create(null);
  var nameMap = Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathMap, nameMap, route);
  });

  return {
    pathMap: pathMap,
    nameMap: nameMap
  };
}

function addRouteRecord(pathMap, nameMap, route, parent, matchAs) {
  var path = route.path;
  var name = route.name;
  if ('production' !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(typeof route.component !== 'string', "route config \"component\" for path: " + String(path || name) + " cannot be a " + "string id. Use an actual component instead.");
  }

  var record = {
    path: normalizePath(path, parent),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {}
  };

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if ('production' !== 'production') {
      if (route.name && route.children.some(function (child) {
        return (/^\/?$/.test(child.path)
        );
      })) {
        warn(false, "Named Route '" + route.name + "' has a default child route.\n          When navigating to this named route (:to=\"{name: '" + route.name + "'\"), the default child route will not be rendered.\n          Remove the name from this route and use the name of the default child route for named links instead.");
      }
    }
    route.children.forEach(function (child) {
      addRouteRecord(pathMap, nameMap, child, record);
    });
  }

  if (route.alias !== undefined) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        addRouteRecord(pathMap, nameMap, { path: alias }, parent, record.path);
      });
    } else {
      addRouteRecord(pathMap, nameMap, { path: route.alias }, parent, record.path);
    }
  }

  if (!pathMap[record.path]) {
    pathMap[record.path] = record;
  }
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ('production' !== 'production') {
      warn(false, "Duplicate named routes definition: { name: \"" + name + "\", path: \"" + record.path + "\" }");
    }
  }
}

function normalizePath(path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') {
    return path;
  }
  if (parent == null) {
    return path;
  }
  return cleanPath(parent.path + "/" + path);
}

var __moduleExports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var isarray = __moduleExports;

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)',
// Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options));
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (_typeof(tokens[i]) === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys);
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */keys);
  }

  if (isarray(path)) {
    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
  }

  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCache = Object.create(null);

function getRouteRegex(path) {
  var hit = regexpCache[path];
  var keys, regexp;

  if (hit) {
    keys = hit.keys;
    regexp = hit.regexp;
  } else {
    keys = [];
    regexp = index(path, keys);
    regexpCache[path] = { keys: keys, regexp: regexp };
  }

  return { keys: keys, regexp: regexp };
}

var regexpCompileCache = Object.create(null);

function fillParams(path, params, routeMsg) {
  try {
    var filler = regexpCompileCache[path] || (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true });
  } catch (e) {
    if ('production' !== 'production') {
      warn(false, "missing param for " + routeMsg + ": " + e.message);
    }
    return '';
  }
}

/*  */

function normalizeLocation(raw, current, append) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next;
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, "path " + current.path);
    } else if ('production' !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next;
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = current && current.path || '/';
  var path = parsedPath.path ? resolvePath(parsedPath.path, basePath, append || next.append) : current && current.path || '/';
  var query = resolveQuery(parsedPath.query, next.query);
  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  };
}

function assign(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
}

/*  */

function createMatcher(routes) {
  var ref = createRouteMap(routes);
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function match(raw, currentRoute, redirectedFrom) {
    var location = normalizeLocation(raw, currentRoute);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      var paramNames = getRouteRegex(record.path).keys.filter(function (key) {
        return !key.optional;
      }).map(function (key) {
        return key.name;
      });

      if (_typeof(location.params) !== 'object') {
        location.params = {};
      }

      if (currentRoute && _typeof(currentRoute.params) === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, "named route \"" + name + "\"");
        return _createRoute(record, location, redirectedFrom);
      }
    } else if (location.path) {
      location.params = {};
      for (var path in pathMap) {
        if (matchRoute(path, location.params, location.path)) {
          return _createRoute(pathMap[path], location, redirectedFrom);
        }
      }
    }
    // no match
    return _createRoute(null, location);
  }

  function redirect(record, location) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function' ? originalRedirect(createRoute(record, location)) : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || (typeof redirect === 'undefined' ? 'undefined' : _typeof(redirect)) !== 'object') {
      'production' !== 'production' && warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      return _createRoute(null, location);
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if ('production' !== 'production') {
        assert(targetRecord, "redirect failed: named route \"" + name + "\" not found.");
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location);
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, "redirect route with path \"" + rawPath + "\"");
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location);
    } else {
      warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      return _createRoute(null, location);
    }
  }

  function alias(record, location, matchAs) {
    var aliasedPath = fillParams(matchAs, location.params, "aliased route with path \"" + matchAs + "\"");
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location);
    }
    return _createRoute(null, location);
  }

  function _createRoute(record, location, redirectedFrom) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location);
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs);
    }
    return createRoute(record, location, redirectedFrom);
  }

  return match;
}

function matchRoute(path, params, pathname) {
  var ref = getRouteRegex(path);
  var regexp = ref.regexp;
  var keys = ref.keys;
  var m = pathname.match(regexp);

  if (!m) {
    return false;
  } else if (!params) {
    return true;
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true;
}

function resolveRecordPath(path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true);
}

/*  */

var inBrowser = typeof window !== 'undefined';

var supportsHistory = inBrowser && function () {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }

  return window.history && 'pushState' in window.history;
}();

/*  */

function runQueue(queue, fn, cb) {
  var step = function step(index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

var History = function History(router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
};

History.prototype.listen = function listen(cb) {
  this.cb = cb;
};

History.prototype.transitionTo = function transitionTo(location, onComplete, onAbort) {
  var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();
  }, onAbort);
};

History.prototype.confirmTransition = function confirmTransition(route, onComplete, onAbort) {
  var this$1 = this;

  var current = this.current;
  var abort = function abort() {
    onAbort && onAbort();
  };
  if (isSameRoute(route, current)) {
    this.ensureURL();
    return abort();
  }

  var ref = resolveQueue(this.current.matched, route.matched);
  var deactivated = ref.deactivated;
  var activated = ref.activated;

  var queue = [].concat(
  // in-component leave guards
  extractLeaveGuards(deactivated),
  // global before hooks
  this.router.beforeHooks,
  // enter guards
  activated.map(function (m) {
    return m.beforeEnter;
  }),
  // async components
  resolveAsyncComponents(activated));

  this.pending = route;
  var iterator = function iterator(hook, next) {
    if (this$1.pending !== route) {
      return abort();
    }
    hook(route, current, function (to) {
      if (to === false) {
        // next(false) -> abort navigation, ensure current URL
        this$1.ensureURL(true);
        abort();
      } else if (typeof to === 'string' || (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object') {
        // next('/') or next({ path: '/' }) -> redirect
        (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object' && to.replace ? this$1.replace(to) : this$1.push(to);
        abort();
      } else {
        // confirm transition and pass on the value
        next(to);
      }
    });
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var enterGuards = extractEnterGuards(activated, postEnterCbs, function () {
      return this$1.current === route;
    });
    // wait until async components are resolved before
    // extracting in-component enter guards
    runQueue(enterGuards, iterator, function () {
      if (this$1.pending !== route) {
        return abort();
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) {
            return cb();
          });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute(route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase(base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = baseEl ? baseEl.getAttribute('href') : '/';
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '');
}

function resolveQueue(current, next) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break;
    }
  }
  return {
    activated: next.slice(i),
    deactivated: current.slice(i)
  };
}

function extractGuard(def, key) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key];
}

function extractLeaveGuards(matched) {
  return flatten(flatMapComponents(matched, function (def, instance) {
    var guard = extractGuard(def, 'beforeRouteLeave');
    if (guard) {
      return Array.isArray(guard) ? guard.map(function (guard) {
        return wrapLeaveGuard(guard, instance);
      }) : wrapLeaveGuard(guard, instance);
    }
  }).reverse());
}

function wrapLeaveGuard(guard, instance) {
  return function routeLeaveGuard() {
    return guard.apply(instance, arguments);
  };
}

function extractEnterGuards(matched, cbs, isValid) {
  return flatten(flatMapComponents(matched, function (def, _, match, key) {
    var guard = extractGuard(def, 'beforeRouteEnter');
    if (guard) {
      return Array.isArray(guard) ? guard.map(function (guard) {
        return wrapEnterGuard(guard, cbs, match, key, isValid);
      }) : wrapEnterGuard(guard, cbs, match, key, isValid);
    }
  }));
}

function wrapEnterGuard(guard, cbs, match, key, isValid) {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    });
  };
}

function poll(cb, // somehow flow cannot infer this is a function
instances, key, isValid) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function resolveAsyncComponents(matched) {
  return flatMapComponents(matched, function (def, _, match, key) {
    // if it's a function and doesn't have Vue options attached,
    // assume it's an async component resolve function.
    // we are not using Vue's default async resolving mechanism because
    // we want to halt the navigation until the incoming component has been
    // resolved.
    if (typeof def === 'function' && !def.options) {
      return function (to, from, next) {
        var resolve = function resolve(resolvedDef) {
          match.components[key] = resolvedDef;
          next();
        };

        var reject = function reject(reason) {
          warn(false, "Failed to resolve async component " + key + ": " + reason);
          next(false);
        };

        var res = def(resolve, reject);
        if (res && typeof res.then === 'function') {
          res.then(resolve, reject);
        }
      };
    }
  });
}

function flatMapComponents(matched, fn) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m.instances[key], m, key);
    });
  }));
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

/*  */

var positionStore = Object.create(null);

function saveScrollPosition(key) {
  if (!key) {
    return;
  }
  positionStore[key] = {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}

function getScrollPosition(key) {
  if (!key) {
    return;
  }
  return positionStore[key];
}

function getElementPosition(el) {
  var docRect = document.documentElement.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  };
}

function isValidPosition(obj) {
  return isNumber(obj.x) || isNumber(obj.y);
}

function normalizePosition(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  };
}

function isNumber(v) {
  return typeof v === 'number';
}

/*  */

var genKey = function genKey() {
  return String(Date.now());
};
var _key = genKey();

var HTML5History = function (History) {
  function HTML5History(router, base) {
    var this$1 = this;

    History.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;
    window.addEventListener('popstate', function (e) {
      _key = e.state && e.state.key;
      var current = this$1.current;
      this$1.transitionTo(getLocation(this$1.base), function (next) {
        if (expectScroll) {
          this$1.handleScroll(next, current, true);
        }
      });
    });

    if (expectScroll) {
      window.addEventListener('scroll', function () {
        saveScrollPosition(_key);
      });
    }
  }

  if (History) HTML5History.__proto__ = History;
  HTML5History.prototype = Object.create(History && History.prototype);
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go(n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push(location) {
    var this$1 = this;

    var current = this.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      this$1.handleScroll(route, current, false);
    });
  };

  HTML5History.prototype.replace = function replace(location) {
    var this$1 = this;

    var current = this.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      this$1.handleScroll(route, current, false);
    });
  };

  HTML5History.prototype.ensureURL = function ensureURL(push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.handleScroll = function handleScroll(to, from, isPop) {
    var router = this.router;
    if (!router.app) {
      return;
    }

    var behavior = router.options.scrollBehavior;
    if (!behavior) {
      return;
    }
    if ('production' !== 'production') {
      assert(typeof behavior === 'function', "scrollBehavior must be a function");
    }

    // wait until re-render finishes before scrolling
    router.app.$nextTick(function () {
      var position = getScrollPosition(_key);
      var shouldScroll = behavior(to, from, isPop ? position : null);
      if (!shouldScroll) {
        return;
      }
      var isObject = (typeof shouldScroll === 'undefined' ? 'undefined' : _typeof(shouldScroll)) === 'object';
      if (isObject && typeof shouldScroll.selector === 'string') {
        var el = document.querySelector(shouldScroll.selector);
        if (el) {
          position = getElementPosition(el);
        } else if (isValidPosition(shouldScroll)) {
          position = normalizePosition(shouldScroll);
        }
      } else if (isObject && isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }

      if (position) {
        window.scrollTo(position.x, position.y);
      }
    });
  };

  return HTML5History;
}(History);

function getLocation(base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash;
}

function pushState(url, replace) {
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
    saveScrollPosition(_key);
  } catch (e) {
    window.location[replace ? 'assign' : 'replace'](url);
  }
}

function replaceState(url) {
  pushState(url, true);
}

/*  */

var HashHistory = function (History) {
  function HashHistory(router, base, fallback) {
    History.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && this.checkFallback()) {
      return;
    }
    ensureSlash();
  }

  if (History) HashHistory.__proto__ = History;
  HashHistory.prototype = Object.create(History && History.prototype);
  HashHistory.prototype.constructor = HashHistory;

  HashHistory.prototype.checkFallback = function checkFallback() {
    var location = getLocation(this.base);
    if (!/^\/#/.test(location)) {
      window.location.replace(cleanPath(this.base + '/#' + location));
      return true;
    }
  };

  HashHistory.prototype.onHashChange = function onHashChange() {
    if (!ensureSlash()) {
      return;
    }
    this.transitionTo(getHash(), function (route) {
      replaceHash(route.fullPath);
    });
  };

  HashHistory.prototype.push = function push(location) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
    });
  };

  HashHistory.prototype.replace = function replace(location) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
    });
  };

  HashHistory.prototype.go = function go(n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL(push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  return HashHistory;
}(History);

function ensureSlash() {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true;
  }
  replaceHash('/' + path);
  return false;
}

function getHash() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1);
}

function pushHash(path) {
  window.location.hash = path;
}

function replaceHash(path) {
  var i = window.location.href.indexOf('#');
  window.location.replace(window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path);
}

/*  */

var AbstractHistory = function (History) {
  function AbstractHistory(router) {
    History.call(this, router);
    this.stack = [];
    this.index = -1;
  }

  if (History) AbstractHistory.__proto__ = History;
  AbstractHistory.prototype = Object.create(History && History.prototype);
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push(location) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
    });
  };

  AbstractHistory.prototype.replace = function replace(location) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
    });
  };

  AbstractHistory.prototype.go = function go(n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return;
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.ensureURL = function ensureURL() {
    // noop
  };

  return AbstractHistory;
}(History);

/*  */

var VueRouter = function VueRouter(options) {
  if (options === void 0) options = {};

  this.app = null;
  this.options = options;
  this.beforeHooks = [];
  this.afterHooks = [];
  this.match = createMatcher(options.routes || []);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsHistory;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break;
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break;
    case 'abstract':
      this.history = new AbstractHistory(this);
      break;
    default:
      'production' !== 'production' && assert(false, "invalid mode: " + mode);
  }
};

var prototypeAccessors = { currentRoute: {} };

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current;
};

VueRouter.prototype.init = function init(app /* Vue component instance */) {
  var this$1 = this;

  'production' !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueRouter)` " + "before creating root instance.");

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(getLocation(history.base));
  } else if (history instanceof HashHistory) {
    var setupHashListener = function setupHashListener() {
      window.addEventListener('hashchange', function () {
        history.onHashChange();
      });
    };
    history.transitionTo(getHash(), setupHashListener, setupHashListener);
  }

  history.listen(function (route) {
    this$1.app._route = route;
  });
};

VueRouter.prototype.beforeEach = function beforeEach(fn) {
  this.beforeHooks.push(fn);
};

VueRouter.prototype.afterEach = function afterEach(fn) {
  this.afterHooks.push(fn);
};

VueRouter.prototype.push = function push(location) {
  this.history.push(location);
};

VueRouter.prototype.replace = function replace(location) {
  this.history.replace(location);
};

VueRouter.prototype.go = function go(n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back() {
  this.go(-1);
};

VueRouter.prototype.forward = function forward() {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents(to) {
  var route = to ? this.resolve(to).resolved : this.currentRoute;
  if (!route) {
    return [];
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key];
    });
  }));
};

VueRouter.prototype.resolve = function resolve(to, current, append) {
  var normalizedTo = normalizeLocation(to, current || this.history.current, append);
  var resolved = this.match(normalizedTo, current);
  var fullPath = resolved.redirectedFrom || resolved.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    normalizedTo: normalizedTo,
    resolved: resolved,
    href: href
  };
};

Object.defineProperties(VueRouter.prototype, prototypeAccessors);

function createHref(base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path;
}

VueRouter.install = install;

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

module.exports = VueRouter;
  })();
});

require.register("vue-validator/dist/vue-validator.common.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "vue-validator");
  (function() {
    /*!
 * vue-validator v3.0.0-alpha.2 
 * (c) 2016 kazuya kawaguchi
 * Released under the MIT License.
 */
'use strict';

/*  */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function warn(msg, err) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

/*  */

// validator configrations
var validator = {
  classes: {}
};

var Config = function Config(Vue) {
  // define Vue.config.validator configration
  // $FlowFixMe: https://github.com/facebook/flow/issues/285
  Object.defineProperty(Vue.config, 'validator', {
    enumerable: true,
    configurable: true,
    get: function get() {
      return validator;
    },
    set: function set(val) {
      validator = val;
    }
  });
};

/*  */
/**
 * build-in validators
 */

/**
 * required
 * This function validate whether the value has been filled out.
 */
function required(val, arg) {
  var isRequired = arg === undefined ? true : arg;
  if (Array.isArray(val)) {
    if (val.length !== 0) {
      var valid = true;
      for (var i = 0, l = val.length; i < l; i++) {
        valid = required(val[i], isRequired);
        if (isRequired && !valid || !isRequired && valid) {
          break;
        }
      }
      return valid;
    } else {
      return !isRequired;
    }
  } else if (typeof val === 'number' || typeof val === 'function') {
    return isRequired;
  } else if (typeof val === 'boolean') {
    return val === isRequired;
  } else if (typeof val === 'string') {
    return isRequired ? val.length > 0 : val.length <= 0;
  } else if (val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    return isRequired ? Object.keys(val).length > 0 : Object.keys(val).length <= 0;
  } else if (val === null || val === undefined) {
    return !isRequired;
  } else {
    return !isRequired;
  }
}

/**
 * pattern
 * This function validate whether the value matches the regex pattern
 */
function pattern(val, pat) {
  if (typeof pat !== 'string') {
    return false;
  }

  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'));
  if (!match) {
    return false;
  }

  return new RegExp(match[1], match[2]).test(val);
}

/**
 * minlength
 * This function validate whether the minimum length.
 */
function minlength(val, min) {
  if (typeof val === 'string') {
    return isInteger(min, 10) && val.length >= parseInt(min, 10);
  } else if (Array.isArray(val)) {
    return val.length >= parseInt(min, 10);
  } else {
    return false;
  }
}

/**
 * maxlength
 * This function validate whether the maximum length.
 */
function maxlength(val, max) {
  if (typeof val === 'string') {
    return isInteger(max, 10) && val.length <= parseInt(max, 10);
  } else if (Array.isArray(val)) {
    return val.length <= parseInt(max, 10);
  } else {
    return false;
  }
}

/**
 * min
 * This function validate whether the minimum value of the numberable value.
 */
function min(val, arg) {
  return !isNaN(+val) && !isNaN(+arg) && +val >= +arg;
}

/**
 * max
 * This function validate whether the maximum value of the numberable value.
 */
function max(val, arg) {
  return !isNaN(+val) && !isNaN(+arg) && +val <= +arg;
}

/**
 * isInteger
 * This function check whether the value of the string is integer.
 */
function isInteger(val) {
  return (/^(-?[1-9]\d*|0)$/.test(val)
  );
}

var validators = Object.freeze({
  required: required,
  pattern: pattern,
  minlength: minlength,
  maxlength: maxlength,
  min: min,
  max: max
});

/*  */
var Asset = function Asset(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  // set global validators asset
  var assets = Object.create(null);
  extend(assets, validators);
  Vue.options.validators = assets;

  // set option merge strategy
  var strats = Vue.config.optionMergeStrategies;
  if (strats) {
    strats.validators = function (parent, child) {
      if (!child) {
        return parent;
      }
      if (!parent) {
        return child;
      }
      var ret = Object.create(null);
      extend(ret, parent);
      var key;
      for (key in child) {
        ret[key] = child[key];
      }
      return ret;
    };
  }

  /**
   * Register or retrieve a global validator definition.
   */
  function validator(id, def) {
    if (def === undefined) {
      return Vue.options['validators'][id];
    } else {
      Vue.options['validators'][id] = def;
      if (def === null) {
        delete Vue.options['validators']['id'];
      }
    }
  }
  Vue['validator'] = validator;
};

/*  */

var Group = function Group(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  return {
    data: function data() {
      return {
        valid: true,
        dirty: false,
        touched: false,
        modified: false,
        results: {}
      };
    },
    computed: {
      invalid: function invalid() {
        return !this.valid;
      },
      pristine: function pristine() {
        return !this.dirty;
      },
      untouched: function untouched() {
        return !this.touched;
      },
      result: function result() {
        var ret = {
          valid: this.valid,
          invalid: this.invalid,
          dirty: this.dirty,
          pristine: this.pristine,
          touched: this.touched,
          untouched: this.untouched,
          modified: this.modified
        };
        var results = this.results;
        this._validityKeys.forEach(function (key) {
          ret[key] = results[key];
          if (ret[key].errors) {
            var errors = ret.errors || [];
            ret[key].errors.forEach(function (error) {
              errors.push(error);
            });
            ret.errors = errors;
          }
        });
        return ret;
      }
    },
    watch: {
      results: function results(val, old) {
        var keys = this._validityKeys;
        var results = this.results;
        this.valid = this.checkResults(keys, results, 'valid', true);
        this.dirty = this.checkResults(keys, results, 'dirty', false);
        this.touched = this.checkResults(keys, results, 'touched', false);
        this.modified = this.checkResults(keys, results, 'modified', false);
      }
    },
    created: function created() {
      this._validities = Object.create(null);
      this._validityWatchers = Object.create(null);
      this._validityKeys = [];
      this._committing = false;
    },
    destroyed: function destroyed() {
      var this$1 = this;

      this._validityKeys.forEach(function (key) {
        this$1._validityWatchers[key]();
        delete this$1._validityWatchers[key];
        delete this$1._validities[key];
      });
      delete this._validityWatchers;
      delete this._validities;
      delete this._validityKeys;
    },
    methods: {
      register: function register(name, validity) {
        var this$1 = this;

        this._validities[name] = validity;
        this._validityKeys = Object.keys(this._validities);
        this.setResults(name, {});
        this.withCommit(function () {
          this$1._validityWatchers[name] = validity.$watch('result', function (val, old) {
            this$1.setResults(name, val);
          }, { deep: true, immediate: true });
        });
      },
      unregister: function unregister(name) {
        var this$1 = this;

        this._validityWatchers[name]();
        delete this._validityWatchers[name];
        delete this._validities[name];
        this._validityKeys = Object.keys(this._validities);
        this.withCommit(function () {
          this$1.resetResults(name);
        });
      },
      validityCount: function validityCount() {
        return this._validityKeys.length;
      },
      isRegistered: function isRegistered(name) {
        return name in this._validities;
      },
      getValidityKeys: function getValidityKeys() {
        return this._validityKeys;
      },
      checkResults: function checkResults(keys, results, prop, checking) {
        var ret = checking;
        for (var i = 0; i < keys.length; i++) {
          var result = results[keys[i]];
          if (result[prop] !== checking) {
            ret = !checking;
            break;
          }
        }
        return ret;
      },
      setResults: function setResults(name, val) {
        var this$1 = this;

        var newVal = {};
        this._validityKeys.forEach(function (key) {
          newVal[key] = extend({}, this$1.results[key]);
        });
        newVal[name] = extend({}, val);
        this.results = newVal;
      },
      resetResults: function resetResults(ignore) {
        var this$1 = this;

        var newVal = {};
        this._validityKeys.forEach(function (key) {
          if (ignore && ignore !== key) {
            newVal[key] = extend({}, this$1.results[key]);
          }
        });
        this.results = newVal;
      },
      withCommit: function withCommit(fn) {
        var committing = this._committing;
        this._committing = true;
        fn();
        this._committing = committing;
      }
    }
  };
};

/*  */
var ValidationClass = function ValidationClass(Vue) {
  var ValidityGroup = Group(Vue);

  var Validation = function Validation(options) {
    if (options === void 0) options = {};

    this._result = {};
    this._host = options.host;
    this._named = Object.create(null);
    this._group = Object.create(null);
    this._validities = Object.create(null);
    this._beginDestroy = false;
    Vue.util.defineReactive(this._host, '$validation', this._result);
  };

  Validation.prototype.register = function register(field, validity, options) {
    if (options === void 0) options = {};

    // NOTE: lazy setup (in constructor, occured callstack recursive errors ...)
    if (!this._validityManager) {
      this._validityManager = new Vue(ValidityGroup);
      this._watchValidityResult();
    }

    if (this._validities[field]) {
      // TODO: should be output console.error
      return;
    }
    this._validities[field] = validity;

    var named = options.named;
    var group = options.group;
    var groupValidity = group ? this._getValidityGroup('group', group) || this._registerValidityGroup('group', group) : null;
    var namedValidity = named ? this._getValidityGroup('named', named) || this._registerValidityGroup('named', named) : null;
    if (named && group && namedValidity && groupValidity) {
      groupValidity.register(field, validity);
      !namedValidity.isRegistered(group) && namedValidity.register(group, groupValidity);
      !this._validityManager.isRegistered(named) && this._validityManager.register(named, namedValidity);
    } else if (namedValidity) {
      namedValidity.register(field, validity);
      !this._validityManager.isRegistered(named) && this._validityManager.register(named, namedValidity);
    } else if (groupValidity) {
      groupValidity.register(field, validity);
      !this._validityManager.isRegistered(group) && this._validityManager.register(group, groupValidity);
    } else {
      this._validityManager.register(field, validity);
    }
  };

  Validation.prototype.unregister = function unregister(field, options) {
    if (options === void 0) options = {};

    if (!this._validityManager) {
      // TODO: should be output error
      return;
    }

    if (!this._validities[field]) {
      // TODO: should be output error
      return;
    }
    delete this._validities[field];

    var named = options.named;
    var group = options.group;
    var groupValidity = group ? this._getValidityGroup('group', group) : null;
    var namedValidity = named ? this._getValidityGroup('named', named) : null;
    if (named && group && namedValidity && groupValidity) {
      groupValidity.unregister(field);
      if (groupValidity.validityCount() === 0) {
        namedValidity.isRegistered(group) && namedValidity.unregister(group);
        this._unregisterValidityGroup('group', group);
      }
      if (namedValidity.validityCount() === 0) {
        this._validityManager.isRegistered(named) && this._validityManager.unregister(named);
        this._unregisterValidityGroup('named', named);
      }
    } else if (named && namedValidity) {
      namedValidity.unregister(field);
      if (namedValidity.validityCount() === 0) {
        this._validityManager.isRegistered(named) && this._validityManager.unregister(named);
        this._unregisterValidityGroup('named', named);
      }
    } else if (group && groupValidity) {
      groupValidity.unregister(field);
      if (groupValidity.validityCount() === 0) {
        this._validityManager.isRegistered(group) && this._validityManager.unregister(group);
        this._unregisterValidityGroup('group', group);
      }
    } else {
      this._validityManager.unregister(field);
    }
  };

  Validation.prototype.destroy = function destroy() {
    var this$1 = this;

    var validityKeys = Object.keys(this._validities);
    var namedKeys = Object.keys(this._named);
    var groupKeys = Object.keys(this._group);

    // unregister validity
    validityKeys.forEach(function (validityKey) {
      groupKeys.forEach(function (groupKey) {
        var group = this$1._getValidityGroup('group', groupKey);
        if (group && group.isRegistered(groupKey)) {
          group.unregister(validityKey);
        }
      });
      namedKeys.forEach(function (namedKey) {
        var named = this$1._getValidityGroup('named', namedKey);
        if (named && named.isRegistered(validityKey)) {
          named.unregister(validityKey);
        }
      });
      if (this$1._validityManager.isRegistered(validityKey)) {
        this$1._validityManager.unregister(validityKey);
      }
      delete this$1._validities[validityKey];
    });

    // unregister grouped validity
    groupKeys.forEach(function (groupKey) {
      namedKeys.forEach(function (namedKey) {
        var named = this$1._getValidityGroup('named', namedKey);
        if (named && named.isRegistered(groupKey)) {
          named.unregister(groupKey);
        }
      });
      if (this$1._validityManager.isRegistered(groupKey)) {
        this$1._validityManager.unregister(groupKey);
      }
      this$1._unregisterValidityGroup('group', groupKey);
    });

    // unregister named validity
    namedKeys.forEach(function (namedKey) {
      if (this$1._validityManager.isRegistered(namedKey)) {
        this$1._validityManager.unregister(namedKey);
      }
      this$1._unregisterValidityGroup('named', namedKey);
    });

    this._beginDestroy = true;
  };

  Validation.prototype._getValidityGroup = function _getValidityGroup(type, name) {
    return type === 'named' ? this._named[name] : this._group[name];
  };

  Validation.prototype._registerValidityGroup = function _registerValidityGroup(type, name) {
    var groups = type === 'named' ? this._named : this._group;
    groups[name] = new Vue(ValidityGroup);
    return groups[name];
  };

  Validation.prototype._unregisterValidityGroup = function _unregisterValidityGroup(type, name) {
    var groups = type === 'named' ? this._named : this._group;
    if (!groups[name]) {
      // TODO: should be warn
      return;
    }

    groups[name].$destroy();
    delete groups[name];
  };

  Validation.prototype._watchValidityResult = function _watchValidityResult() {
    var this$1 = this;

    this._watcher = this._validityManager.$watch('results', function (val, old) {
      Vue.set(this$1._host, '$validation', val);
      if (this$1._beginDestroy) {
        this$1._destroyValidityMananger();
      }
    }, { deep: true });
  };

  Validation.prototype._unwatchValidityResult = function _unwatchValidityResult() {
    this._watcher();
    delete this._watcher;
  };

  Validation.prototype._destroyValidityMananger = function _destroyValidityMananger() {
    this._unwatchValidityResult();
    this._validityManager.$destroy();
    this._validityManager = null;
  };

  return Validation;
};

/*  */

var Mixin = function Mixin(Vue) {
  var Validation = ValidationClass(Vue);

  return {
    beforeCreate: function beforeCreate() {
      this._validation = new Validation({ host: this });
    }
  };
};

/*  */

var baseProps = {
  field: {
    type: String,
    required: true
  },
  validators: {
    type: [String, Array, Object],
    required: true
  },
  group: {
    type: String
  },
  multiple: {
    type: Boolean
  },
  autotouch: {
    type: String,
    default: function _default() {
      return 'on';
    }
  },
  classes: {
    type: Object,
    default: function _default() {
      return {};
    }
  }
};

var DEFAULT_CLASSES = {
  valid: 'valid',
  invalid: 'invalid',
  touched: 'touched',
  untouched: 'untouched',
  pristine: 'pristine',
  dirty: 'dirty',
  modified: 'modified'
};

/*  */
var States = function States(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;
  var isPlainObject = ref.isPlainObject;

  function initialStates(states, validators, init) {
    if (init === void 0) init = undefined;

    if (Array.isArray(validators)) {
      validators.forEach(function (validator) {
        states[validator] = init;
      });
    } else {
      Object.keys(validators).forEach(function (validator) {
        var props = validators[validator] && validators[validator]['props'] && isPlainObject(validators[validator]['props']) ? validators[validator]['props'] : null;
        if (props) {
          Object.keys(props).forEach(function (prop) {
            states[validator] = {};
            states[validator][prop] = init;
          });
        } else {
          states[validator] = init;
        }
      });
    }
  }

  function getInitialResults(validators) {
    var results = {};
    initialStates(results, validators, undefined);
    return results;
  }

  function getInitialProgresses(validators) {
    var progresses = {};
    initialStates(progresses, validators, '');
    return progresses;
  }

  var props = extend({
    child: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    }
  }, baseProps);

  function data() {
    var validators = nomalizeValidators(this.validators);
    return {
      results: getInitialResults(validators),
      valid: true,
      dirty: false,
      touched: false,
      modified: false,
      progresses: getInitialProgresses(validators)
    };
  }

  return {
    props: props,
    data: data
  };
};

function nomalizeValidators(target) {
  return typeof target === 'string' ? [target] : target;
}

/*  */

var Computed = function Computed(Vue) {
  var ref = Vue.util;
  var isPlainObject = ref.isPlainObject;

  function setError(result, field, validator, message, prop) {
    var error = { field: field, validator: validator };
    if (message) {
      error.message = message;
    }
    if (prop) {
      error.prop = prop;
    }
    result.errors = result.errors || [];
    result.errors.push(error);
  }

  function walkProgresses(keys, target) {
    var progress = '';
    for (var i = 0; i < keys.length; i++) {
      var result = target[keys[i]];
      if (typeof result === 'string' && result) {
        progress = result;
        break;
      }
      if (isPlainObject(result)) {
        var nestedKeys = Object.keys(result);
        progress = walkProgresses(nestedKeys, result);
        if (!progress) {
          break;
        }
      }
    }
    return progress;
  }

  function invalid() {
    return !this.valid;
  }

  function pristine() {
    return !this.dirty;
  }

  function untouched() {
    return !this.touched;
  }

  function result() {
    var this$1 = this;

    var ret = {
      valid: this.valid,
      invalid: this.invalid,
      dirty: this.dirty,
      pristine: this.pristine,
      touched: this.touched,
      untouched: this.untouched,
      modified: this.modified
    };

    var keys = this._keysCached(this._uid.toString(), this.results);
    keys.forEach(function (validator) {
      var result = this$1.results[validator];
      if (typeof result === 'boolean') {
        if (result) {
          ret[validator] = false;
        } else {
          setError(ret, this$1.field, validator);
          ret[validator] = !result;
        }
      } else if (typeof result === 'string') {
        setError(ret, this$1.field, validator, result);
        ret[validator] = result;
      } else if (isPlainObject(result)) {
        // object
        var props = Object.keys(result);
        props.forEach(function (prop) {
          var propRet = result[prop];
          ret[prop] = ret[prop] || {};
          if (typeof propRet === 'boolean') {
            if (propRet) {
              ret[prop][validator] = false;
            } else {
              setError(ret, this$1.field, validator, undefined, prop);
              ret[prop][validator] = !propRet;
            }
          } else if (typeof propRet === 'string') {
            setError(ret, this$1.field, validator, propRet, prop);
            ret[prop][validator] = propRet;
          } else {
            ret[prop][validator] = false;
          }
        });
      } else {
        ret[validator] = false;
      }
    });

    return ret;
  }

  function progress() {
    var ret = '';
    ret = walkProgresses(this._keysCached(this._uid.toString(), this.results), this.progresses);
    return ret;
  }

  return {
    invalid: invalid,
    pristine: pristine,
    untouched: untouched,
    result: result,
    progress: progress
  };
};

/*  */

var Render = function Render(Vue) {
  return {
    render: function render(h) {
      return this.child;
    }
  };
};

/*  */

var SingleElementClass = function SingleElementClass(Vue) {
  var ref = Vue.util;
  var looseEqual = ref.looseEqual;

  var SingleElement = function SingleElement(vm) {
    this._vm = vm;
    this.initValue = this.getValue();
    this.attachValidity();
  };

  SingleElement.prototype.attachValidity = function attachValidity() {
    this._vm.$el.$validity = this._vm;
  };

  SingleElement.prototype.getValue = function getValue() {
    var el = this._vm.$el;
    if (el.tagName === 'SELECT') {
      return getSelectValue(el);
    } else {
      if (el.type === 'checkbox') {
        return el.checked;
      } else {
        return el.value;
      }
    }
  };

  SingleElement.prototype.checkModified = function checkModified() {
    var el = this._vm.$el;
    if (el.tagName === 'SELECT') {
      return !looseEqual(this.initValue, getSelectValue(el));
    } else {
      if (el.type === 'checkbox') {
        return !looseEqual(this.initValue, el.checked);
      } else {
        return !looseEqual(this.initValue, el.value);
      }
    }
  };

  SingleElement.prototype.listenToucheableEvent = function listenToucheableEvent() {
    this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched);
  };

  SingleElement.prototype.unlistenToucheableEvent = function unlistenToucheableEvent() {
    this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched);
  };

  SingleElement.prototype.listenInputableEvent = function listenInputableEvent() {
    var vm = this._vm;
    var el = vm.$el;
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', vm.handleInputable);
    } else {
      if (el.type === 'checkbox') {
        el.addEventListener('change', vm.handleInputable);
      } else {
        el.addEventListener('input', vm.handleInputable);
      }
    }
  };

  SingleElement.prototype.unlistenInputableEvent = function unlistenInputableEvent() {
    var vm = this._vm;
    var el = vm.$el;
    if (el.tagName === 'SELECT') {
      el.removeEventListener('change', vm.handleInputable);
    } else {
      if (el.type === 'checkbox') {
        el.removeEventListener('change', vm.handleInputable);
      } else {
        el.removeEventListener('input', vm.handleInputable);
      }
    }
  };

  return SingleElement;
};

function getSelectValue(el) {
  var value = [];
  for (var i = 0, l = el.options.length; i < l; i++) {
    var option = el.options[i];
    if (!option.disabled && option.selected) {
      value.push(option.value);
    }
  }
  return value;
}

/*  */

var MultiElementClass = function MultiElementClass(Vue) {
  var ref = Vue.util;
  var looseEqual = ref.looseEqual;

  var MultiElement = function MultiElement(vm) {
    // TODO: should be checked whether included radio or checkbox
    this._vm = vm;
    this.initValue = this.getValue();
    this.attachValidity();
  };

  MultiElement.prototype.attachValidity = function attachValidity() {
    var this$1 = this;

    this._vm.$el.$validity = this._vm;
    this._eachItems(function (item) {
      item.$validity = this$1._vm;
    });
  };

  MultiElement.prototype.getValue = function getValue() {
    return this._getCheckedValue();
  };

  MultiElement.prototype.checkModified = function checkModified() {
    return !looseEqual(this.initValue, this._getCheckedValue());
  };

  MultiElement.prototype.listenToucheableEvent = function listenToucheableEvent() {
    var this$1 = this;

    this._eachItems(function (item) {
      item.addEventListener('focusout', this$1._vm.willUpdateTouched);
    });
  };

  MultiElement.prototype.unlistenToucheableEvent = function unlistenToucheableEvent() {
    var this$1 = this;

    this._eachItems(function (item) {
      item.removeEventListener('focusout', this$1._vm.willUpdateTouched);
    });
  };

  MultiElement.prototype.listenInputableEvent = function listenInputableEvent() {
    var this$1 = this;

    this._eachItems(function (item) {
      item.addEventListener('change', this$1._vm.handleInputable);
    });
  };

  MultiElement.prototype.unlistenInputableEvent = function unlistenInputableEvent() {
    var this$1 = this;

    this._eachItems(function (item) {
      item.removeEventListener('change', this$1._vm.handleInputable);
    });
  };

  MultiElement.prototype._getCheckedValue = function _getCheckedValue() {
    var value = [];
    this._eachItems(function (item) {
      if (!item.disabled && item.checked) {
        value.push(item.value);
      }
    });
    return value;
  };

  MultiElement.prototype._getItems = function _getItems() {
    return this._vm.$el.querySelectorAll('input[type="checkbox"], input[type="radio"]');
  };

  MultiElement.prototype._eachItems = function _eachItems(cb) {
    var items = this._getItems();
    for (var i = 0; i < items.length; i++) {
      cb(items[i]);
    }
  };

  return MultiElement;
};

/*  */

var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;

function getClass(el) {
  var classname = el.className;
  if ((typeof classname === 'undefined' ? 'undefined' : _typeof(classname)) === 'object') {
    classname = classname.baseVal || '';
  }
  return classname;
}

function setClass(el, cls) {
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls;
  } else {
    el.setAttribute('class', cls);
  }
}

function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim());
    }
  }
}

function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    setClass(el, cur.trim());
  }
  if (!el.className) {
    el.removeAttribute('class');
  }
}

function toggleClasses(el, key, fn) {
  if (!el) {
    return;
  }

  key = key.trim();
  if (key.indexOf(' ') === -1) {
    fn(el, key);
    return;
  }

  var keys = key.split(/\s+/);
  for (var i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i]);
  }
}

function memoize(fn) {
  var cache = Object.create(null);
  return function memoizeFn(id) {
    var args = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      args[len] = arguments[len + 1];
    }var hit = cache[id];
    return hit || (cache[id] = fn.apply(void 0, args));
  };
}

/*  */
var ComponentElementClass = function ComponentElementClass(Vue) {
  var ref = Vue.util;
  var looseEqual = ref.looseEqual;
  var isPlainObject = ref.isPlainObject;

  function getValidatorProps(validators) {
    var normalized = typeof validators === 'string' ? [validators] : validators;
    var targets = [];
    if (isPlainObject(normalized)) {
      Object.keys(normalized).forEach(function (validator) {
        var props = normalized[validator] && normalized[validator]['props'] && isPlainObject(normalized[validator]['props']) ? normalized[validator]['props'] : null;
        if (props) {
          Object.keys(props).forEach(function (prop) {
            if (!~targets.indexOf(prop)) {
              targets.push(prop);
            }
          });
        }
      });
    }
    return targets;
  }

  var ComponentElement = function ComponentElement(vm, vnode, validatorProps) {
    this._vm = vm;
    this._vnode = vnode;
    this._validatorProps = validatorProps || memoize(getValidatorProps);
    this.initValue = this.getValue();
    this._watchers = [];
    this.attachValidity();
  };

  ComponentElement.prototype.attachValidity = function attachValidity() {
    this._vm.$el.$validity = this._vm;
  };

  ComponentElement.prototype.getValidatorProps = function getValidatorProps$1() {
    var vm = this._vm;
    return this._validatorProps(vm._uid.toString(), vm.validators);
  };

  ComponentElement.prototype.getValue = function getValue() {
    var this$1 = this;

    var value = {};
    this.getValidatorProps().forEach(function (prop) {
      value[prop] = this$1._vnode.child[prop];
    });
    return value;
  };

  ComponentElement.prototype.checkModified = function checkModified() {
    return !looseEqual(this.initValue, this.getValue());
  };

  ComponentElement.prototype.listenToucheableEvent = function listenToucheableEvent() {
    this._vm.$el.addEventListener('focusout', this._vm.willUpdateTouched);
  };

  ComponentElement.prototype.unlistenToucheableEvent = function unlistenToucheableEvent() {
    this._vm.$el.removeEventListener('focusout', this._vm.willUpdateTouched);
  };

  ComponentElement.prototype.listenInputableEvent = function listenInputableEvent() {
    var this$1 = this;

    this.getValidatorProps().forEach(function (prop) {
      this$1._watchers.push(this$1._vnode.child.$watch(prop, this$1._vm.watchInputable));
    });
  };

  ComponentElement.prototype.unlistenInputableEvent = function unlistenInputableEvent() {
    this._watchers.forEach(function (watcher) {
      watcher();
    });
    this._watchers = [];
  };

  return ComponentElement;
};

/*  */
var Elements = function Elements(Vue) {
  var SingleElement = SingleElementClass(Vue);
  var MultiElement = MultiElementClass(Vue);
  var ComponentElement = ComponentElementClass(Vue);

  return {
    SingleElement: SingleElement,
    MultiElement: MultiElement,
    ComponentElement: ComponentElement
  };
};

/*  */
var Lifecycles = function Lifecycles(Vue) {
  var ref = Elements(Vue);
  var SingleElement = ref.SingleElement;
  var MultiElement = ref.MultiElement;
  var ComponentElement = ref.ComponentElement;

  function createValidityElement(vm, vnode) {
    return vm.multiple ? new MultiElement(vm) : checkBuiltInElement(vnode) ? new SingleElement(vm) : checkComponentElement(vnode) ? new ComponentElement(vm, vnode) : null;
  }

  function watchModelable(val) {
    this.$emit('input', {
      result: this.result,
      progress: this.progress,
      progresses: this.progresses
    });
  }

  function created() {
    this._elementable = null;

    this._keysCached = memoize(function (results) {
      return Object.keys(results);
    });

    // for event control flags
    this._modified = false;

    // watch validation raw results
    this._watchValidationRawResults();

    var validation = this.$options.propsData ? this.$options.propsData.validation : null;
    if (validation) {
      var instance = validation.instance;
      var name = validation.name;
      var group = this.group;
      instance.register(this.field, this, { named: name, group: group });
    }
  }

  function destroyed() {
    var validation = this.$options.propsData ? this.$options.propsData.validation : null;
    if (validation) {
      var instance = validation.instance;
      var name = validation.name;
      var group = this.group;
      instance.unregister(this.field, { named: name, group: group });
    }

    if (this._unwatchResultProp) {
      this._unwatchResultProp();
      this._unwatchResultProp = null;
    }

    if (this._unwatchProgressProp) {
      this._unwatchProgressProp();
      this._unwatchProgressProp = null;
    }

    this._unwatchValidationRawResults();

    this._elementable.unlistenInputableEvent();
    if (this.autotouch === 'on') {
      this._elementable.unlistenToucheableEvent();
    }
    this._elementable = null;
  }

  function mounted() {
    this._elementable = createValidityElement(this, this._vnode);
    if (this._elementable) {
      if (this.autotouch === 'on') {
        this._elementable.listenToucheableEvent();
      }
      this._elementable.listenInputableEvent();
    } else {
      // TODO: should be warn
    }

    if (hasModelDirective(this.$vnode)) {
      this._unwatchResultProp = this.$watch('result', watchModelable);
      this._unwatchProgressProp = this.$watch('progress', watchModelable);
    }

    toggleClasses(this.$el, this.classes.untouched, addClass);
    toggleClasses(this.$el, this.classes.pristine, addClass);
  }

  return {
    created: created,
    destroyed: destroyed,
    mounted: mounted
  };
};

function checkComponentElement(vnode) {
  return vnode.child && vnode.componentOptions && vnode.tag && vnode.tag.match(/vue-component/);
}

function checkBuiltInElement(vnode) {
  return !vnode.child && !vnode.componentOptions && vnode.tag;
}

function hasModelDirective(vnode) {
  return (vnode && vnode.data && vnode.data.directives || []).find(function (dir) {
    return dir.name === 'model';
  });
}

/*  */

var Event = function Event(Vue) {
  function _fireEvent(type) {
    var args = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      args[len] = arguments[len + 1];
    }(ref = this).$emit.apply(ref, [type].concat(args));
    var ref;
  }

  return {
    _fireEvent: _fireEvent
  };
};

/*  */
var State = function State(Vue) {
  var ref = Vue.util;
  var isPlainObject = ref.isPlainObject;

  function getValue(options) {
    return this._elementable.getValue();
  }

  function checkModified() {
    return this._elementable.checkModified();
  }

  function willUpdateTouched(options) {
    if (!this.touched) {
      this.touched = true;
      toggleClasses(this.$el, this.classes.touched, addClass);
      toggleClasses(this.$el, this.classes.untouched, removeClass);
      this._fireEvent('touched');
    }
  }

  function willUpdateDirty() {
    if (!this.dirty && this.checkModified()) {
      this.dirty = true;
      toggleClasses(this.$el, this.classes.dirty, addClass);
      toggleClasses(this.$el, this.classes.pristine, removeClass);
      this._fireEvent('dirty');
    }
  }

  function willUpdateModified() {
    var modified = this.modified = this.checkModified();
    if (this._modified !== modified) {
      this._modified = modified;
      toggleClasses(this.$el, this.classes.modified, modified ? addClass : removeClass);
      this._fireEvent('modified', modified);
    }
  }

  function handleInputable(e) {
    this.willUpdateDirty();
    this.willUpdateModified();
  }

  function watchInputable(val) {
    this.willUpdateDirty();
    this.willUpdateModified();
  }

  function _initStates(keys, target, init) {
    if (init === void 0) init = undefined;

    for (var i = 0; i < keys.length; i++) {
      var result = target[keys[i]];
      if (isPlainObject(result)) {
        var nestedKeys = Object.keys(result);
        _initStates(nestedKeys, result, init);
      } else {
        target[keys[i]] = init;
      }
    }
  }

  function reset() {
    this._unwatchValidationRawResults();
    var keys = this._keysCached(this._uid.toString(), this.results);
    _initStates(keys, this.results, undefined);
    _initStates(keys, this.progresses, '');
    toggleClasses(this.$el, this.classes.valid, removeClass);
    toggleClasses(this.$el, this.classes.invalid, removeClass);
    toggleClasses(this.$el, this.classes.touched, removeClass);
    toggleClasses(this.$el, this.classes.untouched, addClass);
    toggleClasses(this.$el, this.classes.dirty, removeClass);
    toggleClasses(this.$el, this.classes.pristine, addClass);
    toggleClasses(this.$el, this.classes.modified, removeClass);
    this.valid = true;
    this.dirty = false;
    this.touched = false;
    this.modified = false;
    this._modified = false;
    this._watchValidationRawResults();
  }

  function _walkValid(keys, target) {
    var valid = true;
    for (var i = 0; i < keys.length; i++) {
      var result = target[keys[i]];
      if (typeof result === 'boolean' && !result) {
        valid = false;
        break;
      }
      if (typeof result === 'string' && result) {
        valid = false;
        break;
      }
      if (isPlainObject(result)) {
        var nestedKeys = Object.keys(result);
        valid = _walkValid(nestedKeys, result);
        if (!valid) {
          break;
        }
      }
    }
    return valid;
  }

  function _watchValidationRawResults() {
    var this$1 = this;

    this._unwatchResults = this.$watch('results', function (val) {
      this$1.valid = _walkValid(this$1._keysCached(this$1._uid.toString(), this$1.results), this$1.results);
      if (this$1.valid) {
        toggleClasses(this$1.$el, this$1.classes.valid, addClass);
        toggleClasses(this$1.$el, this$1.classes.invalid, removeClass);
      } else {
        toggleClasses(this$1.$el, this$1.classes.valid, removeClass);
        toggleClasses(this$1.$el, this$1.classes.invalid, addClass);
      }

      this$1._fireEvent(this$1.valid ? 'valid' : 'invalid');
    }, { deep: true });
  }

  function _unwatchValidationRawResults() {
    this._unwatchResults();
    this._unwatchResults = undefined;
    delete this._unwatchResults;
  }

  function touch() {
    this.willUpdateTouched();
  }

  return {
    getValue: getValue,
    checkModified: checkModified,
    willUpdateTouched: willUpdateTouched,
    willUpdateDirty: willUpdateDirty,
    willUpdateModified: willUpdateModified,
    handleInputable: handleInputable,
    watchInputable: watchInputable,
    reset: reset,
    _walkValid: _walkValid,
    _watchValidationRawResults: _watchValidationRawResults,
    _unwatchValidationRawResults: _unwatchValidationRawResults,
    touch: touch
  };
};

/*  */

/**
 * Forgiving check for a promise
 */
function isPromise(p) {
  return p && typeof p.then === 'function';
}

var Validate = function Validate(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;
  var isPlainObject = ref.isPlainObject;
  var resolveAsset = ref.resolveAsset;

  function _resolveValidator(name) {
    var options = this.child && this.child.context ? this.child.context.$options : this.$options;
    return resolveAsset(options, 'validators', name);
  }

  function _getValidateRawDescriptor(validator, field, value) {
    var asset = this._resolveValidator(validator);
    if (!asset) {
      // TODO: should be warned
      return null;
    }

    var fn = null;
    var rule = null;
    var msg = null;
    if (isPlainObject(asset)) {
      if (asset.check && typeof asset.check === 'function') {
        fn = asset.check;
      }
      if (asset.message) {
        msg = asset.message;
      }
    } else if (typeof asset === 'function') {
      fn = asset;
    } else {
      // TODO: should be warned
      return null;
    }

    if (!fn) {
      // TODO: should be warned
      return null;
    }

    var props = null;
    var validators = this.validators;
    if (isPlainObject(validators)) {
      if (isPlainObject(validators[validator])) {
        if (validators[validator].props && isPlainObject(validators[validator].props)) {
          props = validators[validator].props;
        } else {
          if (validators[validator].rule) {
            rule = validators[validator].rule;
          }
          if (validators[validator].message) {
            msg = validators[validator].message;
          }
        }
      } else {
        rule = validators[validator];
      }
    }

    var descriptor = { fn: fn, value: value, field: field };
    if (rule) {
      descriptor.rule = rule;
    }
    if (msg) {
      descriptor.msg = msg;
    }
    if (props) {
      descriptor.props = props;
    }

    return descriptor;
  }

  function _resolveMessage(field, msg, override) {
    if (override) {
      return override;
    }
    return msg ? typeof msg === 'function' ? msg(field) : msg : undefined;
  }

  function _invokeValidator(ref, value, cb) {
    var this$1 = this;
    var fn = ref.fn;
    var field = ref.field;
    var rule = ref.rule;
    var msg = ref.msg;

    var future = fn.call(this.child.context, value, rule);
    if (typeof future === 'function') {
      // function
      future(function () {
        // resolve
        cb(true);
      }, function (err) {
        // reject
        cb(false, this$1._resolveMessage(field, msg, err));
      });
    } else if (isPromise(future)) {
      // promise
      future.then(function () {
        // resolve
        cb(true);
      }, function (err) {
        // reject
        cb(false, this$1._resolveMessage(field, msg, err));
      }).catch(function (err) {
        cb(false, this$1._resolveMessage(field, msg, err.message));
      });
    } else {
      // sync
      cb(future, future === false ? this._resolveMessage(field, msg) : undefined);
    }
  }

  function _getValidateDescriptors(validator, field, value) {
    var descriptors = [];

    var rawDescriptor = this._getValidateRawDescriptor(validator, this.field, value);
    if (!rawDescriptor) {
      return descriptors;
    }

    if (!rawDescriptor.props) {
      var descriptor = { name: validator };
      extend(descriptor, rawDescriptor);
      descriptors.push(descriptor);
    } else {
      var propsKeys = Object.keys(!rawDescriptor.props);
      propsKeys.forEach(function (prop) {
        var descriptor = {
          fn: rawDescriptor.fn,
          name: validator,
          value: rawDescriptor.value[prop],
          field: rawDescriptor.field,
          prop: prop
        };
        if (rawDescriptor.props[prop].rule) {
          descriptor.rule = rawDescriptor.props[prop].rule;
        }
        if (rawDescriptor.props[prop].message) {
          descriptor.msg = rawDescriptor.props[prop].message;
        }
        descriptors.push(descriptor);
      });
    }

    return descriptors;
  }

  function _syncValidates(field, cb) {
    var this$1 = this;

    var validators = this._keysCached(this._uid.toString(), this.results);
    var value = this.getValue();
    var descriptors = [];
    validators.forEach(function (validator) {
      this$1._getValidateDescriptors(validator, field, value).forEach(function (desc) {
        descriptors.push(desc);
      });
    });

    var count = 0;
    var len = descriptors.length;
    descriptors.forEach(function (desc) {
      var validator = desc.name;
      var prop = desc.prop;
      if (!prop && this$1.progresses[validator] || prop && this$1.progresses[validator][prop]) {
        count++;
        if (count === len) {
          cb(this$1._walkValid(this$1._keysCached(this$1._uid.toString(), this$1.results), this$1.results));
        }
        return;
      }

      if (!prop) {
        this$1.progresses[validator] = 'running';
      } else {
        this$1.progresses[validator][prop] = 'running';
      }

      this$1.$nextTick(function () {
        this$1._invokeValidator(desc, desc.value, function (ret, msg) {
          if (!prop) {
            this$1.progresses[validator] = '';
            this$1.results[validator] = msg || ret;
          } else {
            this$1.progresses[validator][prop] = '';
            this$1.results[validator][prop] = msg || ret;
          }

          count++;
          if (count === len) {
            cb(this$1._walkValid(this$1._keysCached(this$1._uid.toString(), this$1.results), this$1.results));
          }
        });
      });
    });
  }

  // TODO:should be refactor!!
  function _validate(validator, value, cb) {
    var this$1 = this;

    var descriptor = this._getValidateRawDescriptor(validator, this.field, value);
    if (descriptor && !descriptor.props) {
      if (this.progresses[validator]) {
        return false;
      }
      this.progresses[validator] = 'running';
      this.$nextTick(function () {
        this$1._invokeValidator(descriptor, descriptor.value, function (ret, msg) {
          this$1.progresses[validator] = '';
          this$1.results[validator] = msg || ret;
          if (cb) {
            this$1.$nextTick(function () {
              cb.call(this$1, null, ret, msg);
            });
          } else {
            var e = { result: ret };
            if (msg) {
              e['msg'] = msg;
            }
            this$1._fireEvent('validate', validator, e);
          }
        });
      });
    } else if (descriptor && descriptor.props) {
      var propsKeys = Object.keys(descriptor.props);
      propsKeys.forEach(function (prop) {
        if (this$1.progresses[validator][prop]) {
          return;
        }
        this$1.progresses[validator][prop] = 'running';
        var values = descriptor.value;
        var propDescriptor = {
          fn: descriptor.fn,
          value: values[prop],
          field: descriptor.field
        };
        if (descriptor.props[prop].rule) {
          propDescriptor.rule = descriptor.props[prop].rule;
        }
        if (descriptor.props[prop].message) {
          propDescriptor.msg = descriptor.props[prop].message;
        }
        this$1.$nextTick(function () {
          this$1._invokeValidator(propDescriptor, propDescriptor.value, function (result, msg) {
            this$1.progresses[validator][prop] = '';
            this$1.results[validator][prop] = msg || result;
            var e = { prop: prop, result: result };
            if (msg) {
              e['msg'] = msg;
            }
            this$1._fireEvent('validate', validator, e);
          });
        });
      });
    } else {
      // TODO:
      var err = new Error();
      cb ? cb.call(this, err) : this._fireEvent('validate', validator, err);
    }
    return true;
  }

  // TODO: should be re-design of API
  function validate() {
    var this$1 = this;
    var args = [],
        len = arguments.length;
    while (len--) {
      args[len] = arguments[len];
    }var validators;
    var value;
    var cb;
    var ret = true;

    if (args.length === 3) {
      validators = [args[0]];
      value = args[1];
      cb = args[2];
    } else if (args.length === 2) {
      if (isPlainObject(args[0])) {
        validators = [args[0].validator];
        value = args[0].value || this.getValue();
        cb = args[1];
      } else {
        validators = this._keysCached(this._uid.toString(), this.results);
        value = args[0];
        cb = args[1];
      }
    } else if (args.length === 1) {
      validators = this._keysCached(this._uid.toString(), this.results);
      value = this.getValue();
      cb = args[0];
    } else {
      validators = this._keysCached(this._uid.toString(), this.results);
      value = this.getValue();
      cb = null;
    }

    if (args.length === 3 || args.length === 2 && isPlainObject(args[0])) {
      ret = this._validate(validators[0], value, cb);
    } else {
      validators.forEach(function (validator) {
        ret = this$1._validate(validator, value, cb);
      });
    }

    return ret;
  }

  return {
    _resolveValidator: _resolveValidator,
    _getValidateRawDescriptor: _getValidateRawDescriptor,
    _getValidateDescriptors: _getValidateDescriptors,
    _resolveMessage: _resolveMessage,
    _invokeValidator: _invokeValidator,
    _validate: _validate,
    _syncValidates: _syncValidates,
    validate: validate
  };
};

/*  */

var Methods = function Methods(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  var methods = {};
  extend(methods, Event(Vue));
  extend(methods, State(Vue));
  extend(methods, Validate(Vue));

  return methods;
};

/*  */

var ValidityControl = function ValidityControl(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  var ref$1 = States(Vue);
  var props = ref$1.props;
  var data = ref$1.data;
  var computed = Computed(Vue);
  var lifecycles = Lifecycles(Vue);
  var ref$2 = Render(Vue);
  var render = ref$2.render;
  var methods = Methods(Vue);

  var validity = {
    props: props,
    data: data,
    render: render,
    computed: computed,
    methods: methods
  };
  extend(validity, lifecycles);

  return validity;
};

/*  */
var Validity = function Validity(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  return {
    functional: true,
    props: baseProps,
    render: function render(h, ref) {
      var props = ref.props;
      var data = ref.data;
      var children = ref.children;

      return children.map(function (child) {
        if (!child.tag) {
          return child;
        }
        var newData = extend({}, data);
        newData.props = extend({}, props);
        // TODO: should be refactored
        newData.props.classes = extend(extend(extend({}, DEFAULT_CLASSES), Vue.config.validator.classes), newData.props.classes);
        newData.props.child = child;
        return h('validity-control', newData);
      });
    }
  };
};

/*  */
var ValidityGroup = function ValidityGroup(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  var props = extend({
    tag: {
      type: String,
      default: 'fieldset'
    }
  }, baseProps);

  return {
    functional: true,
    props: props,
    render: function render(h, ref) {
      var props = ref.props;
      var data = ref.data;
      var children = ref.children;

      var child = h(props.tag, children);
      var newData = extend({}, data);
      newData.props = extend({}, props);
      // TODO: should be refactored
      newData.props.classes = extend(extend(extend({}, DEFAULT_CLASSES), Vue.config.validator.classes), newData.props.classes);
      newData.props.child = child;
      newData.props.multiple = true;
      return h('validity-control', newData);
    }
  };
};

/*  */

var Validation = function Validation(Vue) {
  var ref = Vue.util;
  var extend = ref.extend;

  return {
    functional: true,
    props: {
      name: {
        type: String
      },
      tag: {
        type: String,
        default: 'form'
      }
    },
    render: function render(h, ref) {
      var props = ref.props;
      var data = ref.data;
      var parent = ref.parent;
      var children = ref.children;
      var slots = ref.slots;

      if (!parent._validation) {
        // TODO: should be warned
        return children;
      }
      var tag = props.tag || 'form';
      walkChildren(parent._validation, props.name, children);
      var newData = extend({ attrs: {} }, data);
      if (tag === 'form') {
        newData.attrs.novalidate = true;
      }
      return h(tag, newData, children);
    }
  };
};

function walkChildren(validation, name, children) {
  children.forEach(function (child) {
    if (child && child.componentOptions && child.componentOptions.propsData && child.componentOptions.tag === 'validity-control') {
      child.componentOptions.propsData.validation = {
        instance: validation,
        name: name
      };
    }
    child.children && walkChildren(validation, name, child.children);
  });
}

/*  */
var Component = function Component(Vue) {
  return {
    'validity-control': ValidityControl(Vue),
    'validity': Validity(Vue),
    'validity-group': ValidityGroup(Vue),
    'validation': Validation(Vue)
  };
};

/*  */
// TODO: should be defined strict type
function mapValidation(results) {
  var res = {};

  normalizeMap(results).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedValidation() {
      var validation = this.$validation;
      if (!this._isMounted) {
        return null;
      }
      var paths = val.split('.');
      var first = paths.shift();
      if (first !== '$validation') {
        warn("unknown validation result path: " + val);
        return null;
      }
      var path;
      var value = validation;
      do {
        path = paths.shift();
        value = value[path];
      } while (paths.length > 0 && value !== undefined);
      return value;
    };
  });

  return res;
}

// TODO: should be defined strict type
function normalizeMap(map) {
  return Array.isArray(map) ? map.map(function (key) {
    return { key: key, val: key };
  }) : Object.keys(map).map(function (key) {
    return { key: key, val: map[key] };
  });
}

/*  */
var installed = false;

function plugin(Vue, options) {
  if (options === void 0) options = {};

  if (installed) {
    warn('already installed.');
    return;
  }

  Config(Vue);
  Asset(Vue);
  installMixin(Vue);
  installComponent(Vue);
  installed = true;
}

function installMixin(Vue) {
  Vue.mixin(Mixin(Vue));
}

function installComponent(Vue) {
  var components = Component(Vue);
  Object.keys(components).forEach(function (id) {
    Vue.component(id, components[id]);
  });
}

plugin.mapValidation = mapValidation; // for standalone
plugin.version = '__VERSION__';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

var index = {
  install: plugin,
  mapValidation: mapValidation
};

module.exports = index;
  })();
});

require.register("vue/dist/vue.runtime.common.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "vue");
  (function() {
    /*!
 * Vue.js v2.1.8
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toString(val) {
  return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber(val) {
  var n = parseFloat(val, 10);
  return n || n === 0 ? n : val;
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove$1(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Check if value is primitive
 */
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number';
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delmited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
});

/**
 * Simple bind, faster than native
 */
function bind$1(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn;
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING;
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

/**
 * Perform no operation.
 */
function noop() {}

/**
 * Always return false.
 */
var no = function no() {
  return false;
};

/**
 * Return same value
 */
var identity = function identity(_) {
  return _;
};

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys(modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || []);
  }, []).join(',');
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual(a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: 'production' !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: ['component', 'directive', 'filter'],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated'],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}

/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  } else {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) {
          return;
        }
        obj = obj[segments[i]];
      }
      return obj;
    };
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function isServerRendering() {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer;
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative(Ctor) {
  return (/native code/.test(Ctor.toString())
  );
}

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function logError(err) {
      console.error(err);
    };
    timerFunc = function timerFunc() {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) {
        setTimeout(noop);
      }
    };
  } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]')) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function timerFunc() {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        cb.call(ctx);
      }
      if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      });
    }
  };
}();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = function () {
    function Set() {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };
    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}

var warn = noop;
var formatComponentName;

if ('production' !== 'production') {
  var hasConsole = typeof console !== 'undefined';

  warn = function warn(msg, vm) {
    if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + " " + (vm ? formatLocation(formatComponentName(vm)) : ''));
    }
  };

  formatComponentName = function formatComponentName(vm) {
    if (vm.$root === vm) {
      return 'root instance';
    }
    var name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
    return (name ? "component <" + name + ">" : "anonymous component") + (vm._isVue && vm.$options.__file ? " at " + vm.$options.__file : '');
  };

  var formatLocation = function formatLocation(str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return "\n(found in " + str + ")";
  };
}

/*  */

var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep() {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove$1(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stablize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }
  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // notify change
    ob.dep.notify();
    return result;
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto ? protoAugment : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, asRootData) {
  if (!isObject(value)) {
    return;
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (observerState.shouldConvert && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1(obj, key, val, customSetter) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */
      if ('production' !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set$1(obj, key, val) {
  if (Array.isArray(obj)) {
    obj.length = Math.max(obj.length, key);
    obj.splice(key, 1, val);
    return val;
  }
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return;
  }
  var ob = obj.__ob__;
  if (obj._isVue || ob && ob.vmCount) {
    'production' !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return;
  }
  if (!ob) {
    obj[key] = val;
    return;
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}

/**
 * Delete a property and trigger change if necessary.
 */
function del(obj, key) {
  var ob = obj.__ob__;
  if (obj._isVue || ob && ob.vmCount) {
    'production' !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
    return;
  }
  if (!hasOwn(obj, key)) {
    return;
  }
  delete obj[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if ('production' !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }
    return defaultStrat(parent, child);
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
  if (!from) {
    return to;
  }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set$1(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

/**
 * Data
 */
strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (typeof childVal !== 'function') {
      'production' !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(childVal.call(this), parentVal.call(this));
    };
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
};

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook(parentVal, childVal) {
  return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal ? extend(res, childVal) : res;
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) {
    return parentVal;
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent ? parent.concat(child) : [child];
  }
  return ret;
};

/**
 * Other object hashes.
 */
strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
  if (!childVal) {
    return parentVal;
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret;
};

/**
 * Default strategy.
 */
var defaultStrat = function defaultStrat(parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Validate component names
 */
function checkComponents(options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options) {
  var props = options.props;
  if (!props) {
    return;
  }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if ('production' !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
  if ('production' !== 'production') {
    checkComponents(child);
  }
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function' ? mergeOptions(parent, extendsFrom.options, vm) : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$2) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) {
    return assets[id];
  }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ('production' !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }
  return res;
}

/*  */

function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if ('production' !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value;
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    'production' !== 'production' && warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm[key] !== undefined) {
    return vm[key];
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function ? def.call(vm) : def;
}

/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn('Invalid prop: type check failed for prop "' + name + '".' + ' Expected ' + expectedTypes.map(capitalize).join(', ') + ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.', vm);
    return;
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType(value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  };
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1];
}

function isType(type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type);
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true;
    }
  }
  /* istanbul ignore next */
  return false;
}

var util = Object.freeze({
  defineReactive: defineReactive$$1,
  _toString: _toString,
  toNumber: toNumber,
  makeMap: makeMap,
  isBuiltInTag: isBuiltInTag,
  remove: remove$1,
  hasOwn: hasOwn,
  isPrimitive: isPrimitive,
  cached: cached,
  camelize: camelize,
  capitalize: capitalize,
  hyphenate: hyphenate,
  bind: bind$1,
  toArray: toArray,
  extend: extend,
  isObject: isObject,
  isPlainObject: isPlainObject,
  toObject: toObject,
  noop: noop,
  no: no,
  identity: identity,
  genStaticKeys: genStaticKeys,
  looseEqual: looseEqual,
  looseIndexOf: looseIndexOf,
  isReserved: isReserved,
  def: def,
  parsePath: parsePath,
  hasProto: hasProto,
  inBrowser: inBrowser,
  UA: UA,
  isIE: isIE,
  isIE9: isIE9,
  isEdge: isEdge,
  isAndroid: isAndroid,
  isIOS: isIOS,
  isServerRendering: isServerRendering,
  devtools: devtools,
  nextTick: nextTick,
  get _Set() {
    return _Set;
  },
  mergeOptions: mergeOptions,
  resolveAsset: resolveAsset,
  get warn() {
    return warn;
  },
  get formatComponentName() {
    return formatComponentName;
  },
  validateProp: validateProp
});

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if ('production' !== 'production') {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var warnNonPresent = function warnNonPresent(target, key) {
    warn("Property or method \"" + key + "\" is not defined on the instance but " + "referenced during render. Make sure to declare reactive data " + "properties in the data option.", target);
  };

  var hasProxy = typeof Proxy !== 'undefined' && Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }

  var hasHandler = {
    has: function has(target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed;
    }
  };

  var getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key];
    }
  };

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var queue = [];
var has$1 = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  queue.length = 0;
  has$1 = {};
  if ('production' !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  flushing = true;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) {
    return a.id - b.id;
  });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index];
    var id = watcher.id;
    has$1[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ('production' !== 'production' && has$1[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
        break;
      }
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
  var id = watcher.id;
  if (has$1[id] == null) {
    has$1[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher(vm, expOrFn, cb, options) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = 'production' !== 'production' ? expOrFn.toString() : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      'production' !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
    }
  }
  this.value = this.lazy ? undefined : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get() {
  pushTarget(this);
  var value = this.getter.call(this.vm, this.vm);
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value;
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get();
    if (value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) || this.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm);
          } else {
            'production' !== 'production' && warn("Error in watcher \"" + this.expression + "\"", this.vm);
            throw e;
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend() {
  var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown() {
  var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove$1(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse(val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if (!isA && !isObject(val) || !Object.isExtensible(val)) {
    return;
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

/*  */

function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  if (opts.watch) {
    initWatch(vm, opts.watch);
  }
}

var isReservedProp = { key: 1, ref: 1, slot: 1 };

function initProps(vm, props) {
  var propsData = vm.$options.propsData || {};
  var keys = vm.$options._propKeys = Object.keys(props);
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function loop(i) {
    var key = keys[i];
    /* istanbul ignore else */
    if ('production' !== 'production') {
      if (isReservedProp[key]) {
        warn("\"" + key + "\" is a reserved attribute and cannot be used as component prop.", vm);
      }
      defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
        if (vm.$parent && !observerState.isSettingProps) {
          warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
        }
      });
    } else {
      defineReactive$$1(vm, key, validateProp(key, props, propsData, vm));
    }
  };

  for (var i = 0; i < keys.length; i++) {
    loop(i);
  }observerState.shouldConvert = true;
}

function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    'production' !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      'production' !== 'production' && warn("The data property \"" + keys[i] + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
    } else {
      proxy(vm, keys[i]);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function initComputed(vm, computed) {
  for (var key in computed) {
    /* istanbul ignore if */
    if ('production' !== 'production' && key in vm) {
      warn("existing instance property \"" + key + "\" will be " + "overwritten by a computed property with the same name.", vm);
    }
    var userDef = computed[key];
    if (typeof userDef === 'function') {
      computedSharedDefinition.get = makeComputedGetter(userDef, vm);
      computedSharedDefinition.set = noop;
    } else {
      computedSharedDefinition.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, vm) : bind$1(userDef.get, vm) : noop;
      computedSharedDefinition.set = userDef.set ? bind$1(userDef.set, vm) : noop;
    }
    Object.defineProperty(vm, key, computedSharedDefinition);
  }
}

function makeComputedGetter(getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  });
  return function computedGetter() {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}

function initMethods(vm, methods) {
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
    if ('production' !== 'production' && methods[key] == null) {
      warn("method \"" + key + "\" has an undefined value in the component definition. " + "Did you reference the function correctly?", vm);
    }
  }
}

function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data;
  };
  if ('production' !== 'production') {
    dataDef.set = function (newData) {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);

  Vue.prototype.$set = set$1;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}

function proxy(vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return vm._data[key];
      },
      set: function proxySetter(val) {
        vm._data[key] = val;
      }
    });
  }
}

/*  */

var VNode = function VNode(tag, data, children, text, elm, context, componentOptions) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.child = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var createEmptyVNode = function createEmptyVNode() {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned;
}

function cloneVNodes(vnodes) {
  var res = new Array(vnodes.length);
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res;
}

/*  */

function mergeVNodeHook(def, hookKey, hook, key) {
  key = key + hookKey;
  var injectedHash = def.__injected || (def.__injected = {});
  if (!injectedHash[key]) {
    injectedHash[key] = true;
    var oldHook = def[hookKey];
    if (oldHook) {
      def[hookKey] = function () {
        oldHook.apply(this, arguments);
        hook.apply(this, arguments);
      };
    } else {
      def[hookKey] = hook;
    }
  }
}

/*  */

function updateListeners(on, oldOn, add, remove$$1, vm) {
  var name, cur, old, fn, event, capture, once;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (!cur) {
      'production' !== 'production' && warn("Invalid handler for event \"" + name + "\": got " + String(cur), vm);
    } else if (!old) {
      once = name.charAt(0) === '~'; // Prefixed last, checked first
      event = once ? name.slice(1) : name;
      capture = event.charAt(0) === '!';
      event = capture ? event.slice(1) : event;
      if (Array.isArray(cur)) {
        add(event, cur.invoker = arrInvoker(cur), once, capture);
      } else {
        if (!cur.invoker) {
          fn = cur;
          cur = on[name] = {};
          cur.fn = fn;
          cur.invoker = fnInvoker(cur);
        }
        add(event, cur.invoker, once, capture);
      }
    } else if (cur !== old) {
      if (Array.isArray(old)) {
        old.length = cur.length;
        for (var i = 0; i < old.length; i++) {
          old[i] = cur[i];
        }
        on[name] = old;
      } else {
        old.fn = cur;
        on[name] = old;
      }
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      once = name.charAt(0) === '~'; // Prefixed last, checked first
      event = once ? name.slice(1) : name;
      capture = event.charAt(0) === '!';
      event = capture ? event.slice(1) : event;
      remove$$1(event, oldOn[name].invoker, capture);
    }
  }
}

function arrInvoker(arr) {
  return function (ev) {
    var arguments$1 = arguments;

    var single = arguments.length === 1;
    for (var i = 0; i < arr.length; i++) {
      single ? arr[i](ev) : arr[i].apply(null, arguments$1);
    }
  };
}

function fnInvoker(o) {
  return function (ev) {
    var single = arguments.length === 1;
    single ? o.fn(ev) : o.fn.apply(null, arguments);
  };
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// nomralization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}

// 2. When the children contains constrcuts that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (c == null || typeof c === 'boolean') {
      continue;
    }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || '') + "_" + i));
    } else if (isPrimitive(c)) {
      if (last && last.text) {
        last.text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (c.text && last && last.text) {
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (c.tag && c.key == null && nestedIndex != null) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res;
}

/*  */

function getFirstComponentChild(children) {
  return children && children.filter(function (c) {
    return c && c.componentOptions;
  })[0];
}

/*  */

function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add$1(event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$2(event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add$1, remove$2, vm);
}

function eventsMixin(Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      vm._hasHookEvent = true;
    }
    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm;
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm;
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return vm;
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm;
  };
}

/*  */

var activeInstance = null;

function initLifecycle(vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin(Vue) {
  Vue.prototype._mount = function (el, hydrating) {
    var vm = this;
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      if ('production' !== 'production') {
        /* istanbul ignore if */
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#') {
          warn('You are using the runtime-only build of Vue where the template ' + 'option is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
        } else {
          warn('Failed to mount component: template or render function not defined.', vm);
        }
      }
    }
    callHook(vm, 'beforeMount');
    vm._watcher = new Watcher(vm, function () {
      vm._update(vm._render(), hydrating);
    }, noop);
    hydrating = false;
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm;
  };

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */
      , vm.$options._parentElm, vm.$options._refElm);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    if (vm._isMounted) {
      callHook(vm, 'updated');
    }
  };

  Vue.prototype._updateFromParent = function (propsData, listeners, parentVnode, renderChildren) {
    var vm = this;
    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render
    if (vm._vnode) {
      // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      if ('production' !== 'production') {
        observerState.isSettingProps = true;
      }
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      if ('production' !== 'production') {
        observerState.isSettingProps = false;
      }
      vm.$options.propsData = propsData;
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return;
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove$1(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function callHook(vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
var hooksToMerge = Object.keys(hooks);

function createComponent(Ctor, data, context, children, tag) {
  if (!Ctor) {
    return;
  }

  var baseCtor = context.$options._base;
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    if ('production' !== 'production') {
      warn("Invalid Component definition: " + String(Ctor), context);
    }
    return;
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, baseCtor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return;
      }
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // extract props
  var propsData = extractProps(data, Ctor);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children });
  return vnode;
}

function createFunctionalComponent(Ctor, propsData, data, context, children) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function h(a, b, c, d) {
    return createElement(_context, a, b, c, d, true);
  };
  var vnode = Ctor.options.render.call(null, h, {
    props: props,
    data: data,
    parent: context,
    children: children,
    slots: function slots() {
      return resolveSlots(children, context);
    }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent, // activeInstance in lifecycle state
parentElm, refElm) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options);
}

function init(vnode, hydrating, parentElm, refElm) {
  if (!vnode.child || vnode.child._isDestroyed) {
    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance, parentElm, refElm);
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  } else if (vnode.data.keepAlive) {
    // kept-alive components, treat as a patch
    var mountedNode = vnode; // work around flow
    prepatch(mountedNode, mountedNode);
  }
}

function prepatch(oldVnode, vnode) {
  var options = vnode.componentOptions;
  var child = vnode.child = oldVnode.child;
  child._updateFromParent(options.propsData, // updated props
  options.listeners, // updated listeners
  vnode, // new parent vnode
  options.children // new children
  );
}

function insert(vnode) {
  if (!vnode.child._isMounted) {
    vnode.child._isMounted = true;
    callHook(vnode.child, 'mounted');
  }
  if (vnode.data.keepAlive) {
    vnode.child._inactive = false;
    callHook(vnode.child, 'activated');
  }
}

function destroy$1(vnode) {
  if (!vnode.child._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.child.$destroy();
    } else {
      vnode.child._inactive = true;
      callHook(vnode.child, 'deactivated');
    }
  }
}

function resolveAsyncComponent(factory, baseCtor, cb) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function resolve(res) {
      if (isObject(res)) {
        res = baseCtor.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function reject(reason) {
      'production' !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved;
  }
}

function extractProps(data, Ctor) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return;
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey) || checkProp(res, domProps, key, altKey);
    }
  }
  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true;
    }
  }
  return false;
}

function mergeHooks(data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = hooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1(one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  };
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (alwaysNormalize) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (data && data.__ob__) {
    'production' !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
    } else if (Ctor = resolveAsset(context.$options, 'components', tag)) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (vnode) {
    if (ns) {
      applyNS(vnode, ns);
    }
    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return;
  }
  if (vnode.children) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (child.tag && !child.ns) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

function initRender(vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$options._parentVnode;
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = {};
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  };
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

function renderMixin(Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    if (_parentVnode && _parentVnode.data.scopedSlots) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots;
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm);
      } else {
        if ('production' !== 'production') {
          warn("Error when rendering " + formatComponentName(vm) + ":");
        }
        throw e;
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode;
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ('production' !== 'production' && Array.isArray(vnode)) {
        warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };

  // toString for mustaches
  Vue.prototype._s = _toString;
  // convert text to vnode
  Vue.prototype._v = createTextVNode;
  // number conversion
  Vue.prototype._n = toNumber;
  // empty vnode
  Vue.prototype._e = createEmptyVNode;
  // loose equal
  Vue.prototype._q = looseEqual;
  // loose indexOf
  Vue.prototype._i = looseIndexOf;

  // render static tree by index
  Vue.prototype._m = function renderStatic(index, isInFor) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree);
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    markStatic(tree, "__static__" + index, false);
    return tree;
  };

  // mark node as static (v-once)
  Vue.prototype._o = function markOnce(tree, index, key) {
    markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
    return tree;
  };

  function markStatic(tree, key, isOnce) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], key + "_" + i, isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  // filter resolution helper
  Vue.prototype._f = function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
  };

  // render v-for
  Vue.prototype._l = function renderList(val, render) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret;
  };

  // renderSlot
  Vue.prototype._t = function (name, fallback, props, bindObject) {
    var scopedSlotFn = this.$scopedSlots[name];
    if (scopedSlotFn) {
      // scoped slot
      props = props || {};
      if (bindObject) {
        extend(props, bindObject);
      }
      return scopedSlotFn(props) || fallback;
    } else {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes && 'production' !== 'production') {
        slotNodes._rendered && warn("Duplicate presence of slot \"" + name + "\" found in the same render tree " + "- this will likely cause render errors.", this);
        slotNodes._rendered = true;
      }
      return slotNodes || fallback;
    }
  };

  // apply v-bind object
  Vue.prototype._b = function bindProps(data, tag, value, asProp) {
    if (value) {
      if (!isObject(value)) {
        'production' !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var hash = asProp || config.mustUseProp(tag, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data;
  };

  // check v-on keyCodes
  Vue.prototype._k = function checkKeyCodes(eventKeyCode, key, builtInAlias) {
    var keyCodes = config.keyCodes[key] || builtInAlias;
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1;
    } else {
      return keyCodes !== eventKeyCode;
    }
  };
}

function resolveSlots(children, context) {
  var slots = {};
  if (!children) {
    return slots;
  }
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) && child.data && (name = child.data.slot)) {
      var slot = slots[name] || (slots[name] = []);
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(defaultSlot.length === 1 && (defaultSlot[0].text === ' ' || defaultSlot[0].isComment))) {
    slots.default = defaultSlot;
  }
  return slots;
}

/*  */

var uid = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    }
    /* istanbul ignore else */
    if ('production' !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    initRender(vm);
  };
}

function initInternalComponent(vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = Ctor.super.options;
    var cachedSuperOptions = Ctor.superOptions;
    var extendOptions = Ctor.extendOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed
      Ctor.superOptions = superOptions;
      extendOptions.render = options.render;
      extendOptions.staticRenderFns = options.staticRenderFns;
      extendOptions._scopeId = options._scopeId;
      options = Ctor.options = mergeOptions(superOptions, extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function Vue$2(options) {
  if ('production' !== 'production' && !(this instanceof Vue$2)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$2);
stateMixin(Vue$2);
eventsMixin(Vue$2);
lifecycleMixin(Vue$2);
renderMixin(Vue$2);

/*  */

function initUse(Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return;
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this;
  };
}

/*  */

function initMixin$1(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}

/*  */

function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }
    var name = extendOptions.name || Super.options.name;
    if ('production' !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
      }
    }
    var Sub = function VueComponent(options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super;
    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

/*  */

function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if ('production' !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp];

function matches(pattern, name) {
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else {
    return pattern.test(name);
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes,
    exclude: patternTypes
  },
  created: function created() {
    this.cache = Object.create(null);
  },
  render: function render() {
    var vnode = getFirstComponentChild(this.$slots.default);
    if (vnode && vnode.componentOptions) {
      var opts = vnode.componentOptions;
      // check pattern
      var name = opts.Ctor.options.name || opts.tag;
      if (name && (this.include && !matches(this.include, name) || this.exclude && matches(this.exclude, name))) {
        return vnode;
      }
      var key = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? opts.Ctor.cid + (opts.tag ? "::" + opts.tag : '') : vnode.key;
      if (this.cache[key]) {
        vnode.child = this.cache[key].child;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode;
  },
  destroyed: function destroyed() {
    var this$1 = this;

    for (var key in this.cache) {
      var vnode = this$1.cache[key];
      callHook(vnode.child, 'deactivated');
      vnode.child.$destroy();
    }
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI(Vue) {
  // config
  var configDef = {};
  configDef.get = function () {
    return config;
  };
  if ('production' !== 'production') {
    configDef.set = function () {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }
  Object.defineProperty(Vue, 'config', configDef);
  Vue.util = util;
  Vue.set = set$1;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$2);

Object.defineProperty(Vue$2.prototype, '$isServer', {
  get: isServerRendering
});

Vue$2.version = '2.1.8';

/*  */

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function mustUseProp(tag, attr) {
  return attr === 'value' && acceptValue(tag) || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function isXlink(name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};

var getXlinkProp = function getXlinkProp(name) {
  return isXlink(name) ? name.slice(6, name.length) : '';
};

var isFalsyAttrValue = function isFalsyAttrValue(val) {
  return val == null || val === false;
};

/*  */

function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.child) {
    childNode = childNode.child._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (parentNode = parentNode.parent) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class ? [child.class, parent.class] : parent.class
  };
}

function genClassFromData(data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */
  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  var res = '';
  if (!value) {
    return res;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if (stringified = stringifyClass(value[i])) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1);
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) {
        res += key + ' ';
      }
    }
    return res.slice(0, -1);
  }
  /* istanbul ignore next */
  return res;
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template');

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,' + 'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isReservedTag = function isReservedTag(tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math';
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement(tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true;
  }
  if (isReservedTag(tag)) {
    return false;
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag];
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
  } else {
    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query(el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      'production' !== 'production' && warn('Cannot find element: ' + selector);
      return document.createElement('div');
    }
  }
  return el;
}

/*  */

function createElement$1(tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm;
  }
  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm;
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function createComment(text) {
  return document.createComment(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentNode;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

function setAttribute(node, key, val) {
  node.setAttribute(key, val);
}

var nodeOps = Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  }
};

function registerRef(vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) {
    return;
  }

  var vm = vnode.context;
  var ref = vnode.child || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove$1(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks$1 = ['create', 'activate', 'update', 'remove', 'destroy'];

function isUndef(s) {
  return s == null;
}

function isDef(s) {
  return s != null;
}

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.tag === vnode2.tag && vnode1.isComment === vnode2.isComment && !vnode1.data === !vnode2.data;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) {
      map[key] = i;
    }
  }
  return map;
}

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) {
        cbs[hooks$1[i]].push(modules[j][hooks$1[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    function remove$$1() {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1;
  }

  function removeNode(el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (parent) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if ('production' !== 'production') {
        if (data && data.pre) {
          inPre++;
        }
        if (!inPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) && config.isUnknownElement(tag)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
        }
      }
      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ('production' !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.child) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.child)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isReactivated) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true;
      }
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.child) {
      innerNode = innerNode.child._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break;
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref) {
    if (parent) {
      if (ref) {
        nodeOps.insertBefore(parent, elm, ref);
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable(vnode) {
    while (vnode.child) {
      vnode = vnode.child._vnode;
    }
    return isDef(vnode.tag);
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (i.create) {
        i.create(emptyNode, vnode);
      }
      if (i.insert) {
        insertedVnodeQueue.push(vnode);
      }
    }
  }

  function initComponent(vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.child.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope(vnode) {
    var i;
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
    if (isDef(i = activeInstance) && i !== vnode.context && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) {
        i(vnode);
      }
      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode);
      }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) {
          // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ('production' !== 'production' && !elmToMove) {
            warn('It seems there are duplicate keys that is causing an update error. ' + 'Make sure each v-for item has a unique key.');
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return;
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key && (vnode.isCloned || vnode.isOnce)) {
      vnode.elm = oldVnode.elm;
      vnode.child = oldVnode.child;
      return;
    }
    var i;
    var data = vnode.data;
    var hasData = isDef(data);
    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }
      if (isDef(i = data.hook) && isDef(i = i.update)) {
        i(oldVnode, vnode);
      }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (hasData) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
        i(oldVnode, vnode);
      }
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate(elm, vnode, insertedVnodeQueue) {
    if ('production' !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false;
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode, true /* hydrating */);
      }
      if (isDef(i = vnode.child)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break;
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ('production' !== 'production' && typeof console !== 'undefined' && !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false;
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true;
  }

  function assertNodeMatch(node, vnode) {
    if (vnode.tag) {
      return vnode.tag.indexOf('vue-component') === 0 || vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (!vnode) {
      if (oldVnode) {
        invokeDestroyHook(oldVnode);
      }
      return;
    }

    var elm, parent;
    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (!oldVnode) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if ('production' !== 'production') {
              warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        elm = oldVnode.elm;
        parent = nodeOps.parentNode(elm);
        createElm(vnode, insertedVnodeQueue, parent, nodeOps.nextSibling(elm));

        if (vnode.parent) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (parent !== null) {
          removeVnodes(parent, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives(oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update(oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function callInsert() {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    }, 'dir-postpatch');
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1(dirs, vm) {
  var res = Object.create(null);
  if (!dirs) {
    return res;
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res;
}

function getRawDirName(dir) {
  return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
}

function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
  }
}

var baseModules = [ref, directives];

/*  */

function updateAttrs(oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return;
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class && (!oldData || !oldData.staticClass && !oldData.class)) {
    return;
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var target$1;

function add$2(event, _handler, once, capture) {
  if (once) {
    var oldHandler = _handler;
    _handler = function handler(ev) {
      remove$3(event, _handler, capture);
      arguments.length === 1 ? oldHandler(ev) : oldHandler.apply(null, arguments);
    };
  }
  target$1.addEventListener(event, _handler, capture);
}

function remove$3(event, handler, capture) {
  target$1.removeEventListener(event, handler, capture);
}

function updateDOMListeners(oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return;
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  updateListeners(on, oldOn, add$2, remove$3, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps(oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return;
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) {
        vnode.children.length = 0;
      }
      if (cur === oldProps[key]) {
        continue;
      }
    }
    // #4521: if a click event triggers update before the change event is
    // dispatched on a checkbox/radio input, the input's checked state will
    // be reset and fail to trigger another update.
    /* istanbul ignore next */
    if (key === 'checked' && !isDirty(elm, cur)) {
      continue;
    }
    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue(elm, vnode, checkVal) {
  if (!elm.composing && (vnode.tag === 'option' || isDirty(elm, checkVal) || isInputChanged(vnode, checkVal))) {
    return true;
  }
  return false;
}

function isDirty(elm, checkVal) {
  return document.activeElement !== elm && elm.value !== checkVal;
}

function isInputChanged(vnode, newVal) {
  var value = vnode.elm.value;
  var modifiers = vnode.elm._vModifiers; // injected by v-model runtime
  if (modifiers && modifiers.number || vnode.elm.type === 'number') {
    return toNumber(value) !== toNumber(newVal);
  }
  if (modifiers && modifiers.trim) {
    return value.trim() !== newVal.trim();
  }
  return value !== newVal;
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle ? extend(data.staticStyle, style) : style;
}

// normalize possible array / string values into Object
function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }
  return bindingStyle;
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.child) {
      childNode = childNode.child._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res;
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function setProp(el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    el.style[normalize(name)] = val;
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && prop in testEl.style) {
    return prop;
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed;
    }
  }
});

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (!data.staticStyle && !data.style && !oldData.staticStyle && !oldData.style) {
    return;
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldVnode.data.staticStyle;
  var oldStyleBinding = oldVnode.data.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  vnode.data.style = style.__ob__ ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (newStyle[name] == null) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return;
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return;
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

var raf = inBrowser && window.requestAnimationFrame || setTimeout;
function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass(el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass(el, cls) {
  if (el._transitionClasses) {
    remove$1(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds(el, expectedType, cb) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) {
    return cb();
  }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function end() {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function onEnd(e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
}

function toMs(s) {
  return Number(s.slice(0, -1)) * 1000;
}

/*  */

function enter(vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return;
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return;
  }

  var startClass = isAppear ? appearClass : enterClass;
  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
  var toClass = isAppear ? appearToClass : enterToClass;
  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = enterHook &&
  // enterHook may be a bound method which exposes
  // the length of original fn as _length
  (enterHook._length || enterHook.length) > 1;

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.context === vnode.context && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    }, 'transition-insert');
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb);
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm();
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = leave &&
  // leave hook may be a bound method which exposes
  // the length of original fn as _length
  (leave._length || leave.length) > 1;

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return;
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function resolveTransition(def$$1) {
  if (!def$$1) {
    return;
  }
  /* istanbul ignore else */
  if ((typeof def$$1 === 'undefined' ? 'undefined' : _typeof(def$$1)) === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res;
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1);
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + "-enter",
    leaveClass: name + "-leave",
    appearClass: name + "-enter",
    enterToClass: name + "-enter-to",
    leaveToClass: name + "-leave-to",
    appearToClass: name + "-enter-to",
    enterActiveClass: name + "-enter-active",
    leaveActiveClass: name + "-leave-active",
    appearActiveClass: name + "-enter-active"
  };
});

function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  };
}

function _enter(_, vnode) {
  if (!vnode.data.show) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove(vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [attrs, klass, events, domProps, style, transition];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_-]*)?$/;

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model = {
  inserted: function inserted(el, binding, vnode) {
    if ('production' !== 'production') {
      if (!modelableTagRE.test(vnode.tag)) {
        warn("v-model is not supported on element type: <" + vnode.tag + ">. " + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.', vnode.context);
      }
    }
    if (vnode.tag === 'select') {
      var cb = function cb() {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || el.type === 'text') {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple ? binding.value.some(function (v) {
        return hasNoMatchingOption(v, el.options);
      }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected(el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    'production' !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
    return;
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return;
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption(value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false;
    }
  }
  return true;
}

function getValue(option) {
  return '_value' in option ? option._value : option.value;
}

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode(vnode) {
  return vnode.child && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.child._vnode) : vnode;
}

var show = {
  bind: function bind(el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
    if (value && transition && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update(el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) {
      return;
    }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild(vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children));
  } else {
    return vnode;
  }
}

function extractTransitionData(comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn;
  }
  return data;
}

function placeholder(h, rawChild) {
  return (/\d-keep-alive$/.test(rawChild.tag) ? h('keep-alive') : null
  );
}

function hasParentTransition(vnode) {
  while (vnode = vnode.parent) {
    if (vnode.data.transition) {
      return true;
    }
  }
}

function isSameChild(child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag;
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render(h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return;
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) {
      return c.tag;
    });
    /* istanbul ignore if */
    if (!children.length) {
      return;
    }

    // warn multiple elements
    if ('production' !== 'production' && children.length > 1) {
      warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
    }

    var mode = this.mode;

    // warn invalid mode
    if ('production' !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
      warn('invalid <transition> mode: ' + mode, this.$parent);
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild;
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild;
    }

    if (this._leaving) {
      return placeholder(h, rawChild);
    }

    var key = child.key = child.key == null || child.isStatic ? "__v" + (child.tag + this._uid) + "__" : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) {
      return d.name === 'show';
    })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        }, key);
        return placeholder(h, rawChild);
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function performLeave() {
          delayedLeave();
        };
        mergeVNodeHook(data, 'afterEnter', performLeave, key);
        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        }, key);
      }
    }

    return rawChild;
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render(h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c;(c.data || (c.data = {})).transition = transitionData;
        } else if ('production' !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? opts.Ctor.options.name || opts.tag : c.tag;
          warn("<transition-group> children must be keyed: <" + name + ">");
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children);
  },

  beforeUpdate: function beforeUpdate() {
    // force removing pass
    this.__patch__(this._vnode, this.kept, false, // hydrating
    true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated() {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name || 'v') + '-move';
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return;
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var f = document.body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove(el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false;
      }
      if (this._hasMove != null) {
        return this._hasMove;
      }
      addTransitionClass(el, moveClass);
      var info = getTransitionInfo(el);
      removeTransitionClass(el, moveClass);
      return this._hasMove = info.hasTransform;
    }
  }
};

function callPendingCbs(c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition(c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation(c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$2.config.isUnknownElement = isUnknownElement;
Vue$2.config.isReservedTag = isReservedTag;
Vue$2.config.getTagNamespace = getTagNamespace;
Vue$2.config.mustUseProp = mustUseProp;

// install platform runtime directives & components
extend(Vue$2.options.directives, platformDirectives);
extend(Vue$2.options.components, platformComponents);

// install platform patch function
Vue$2.prototype.__patch__ = inBrowser ? patch$1 : noop;

// wrap mount
Vue$2.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return this._mount(el, hydrating);
};

if ('production' !== 'production' && inBrowser && typeof console !== 'undefined') {
  console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
}

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$2);
    } else if ('production' !== 'production' && inBrowser && !isEdge && /Chrome\/\d+/.test(window.navigator.userAgent)) {
      console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
    }
  }
}, 0);

module.exports = Vue$2;
  })();
});

require.register("vuex/dist/logger.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "vuex");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.createVuexLogger = factory();
})(undefined, function () {
  'use strict';

  /**
   * Get the first item that pass the test
   * by second argument function
   *
   * @param {Array} list
   * @param {Function} f
   * @return {*}
   */

  function find(list, f) {
    return list.filter(f)[0];
  }

  /**
   * Deep copy the given object considering circular structure.
   * This function caches all nested objects and its copies.
   * If it detects circular structure, use cached copy to avoid infinite loop.
   *
   * @param {*} obj
   * @param {Array<Object>} cache
   * @return {*}
   */
  function deepCopy(obj, cache) {
    if (cache === void 0) cache = [];

    // just return if obj is immutable value
    if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
      return obj;
    }

    // if obj is hit, it is in circular structure
    var hit = find(cache, function (c) {
      return c.original === obj;
    });
    if (hit) {
      return hit.copy;
    }

    var copy = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
      original: obj,
      copy: copy
    });

    Object.keys(obj).forEach(function (key) {
      copy[key] = deepCopy(obj[key], cache);
    });

    return copy;
  }

  // Credits: borrowed code from fcomb/redux-logger

  function createLogger(ref) {
    if (ref === void 0) ref = {};
    var collapsed = ref.collapsed;if (collapsed === void 0) collapsed = true;
    var transformer = ref.transformer;if (transformer === void 0) transformer = function transformer(state) {
      return state;
    };
    var mutationTransformer = ref.mutationTransformer;if (mutationTransformer === void 0) mutationTransformer = function mutationTransformer(mut) {
      return mut;
    };

    return function (store) {
      var prevState = deepCopy(store.state);

      store.subscribe(function (mutation, state) {
        if (typeof console === 'undefined') {
          return;
        }
        var nextState = deepCopy(state);
        var time = new Date();
        var formattedTime = " @ " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
        var formattedMutation = mutationTransformer(mutation);
        var message = "mutation " + mutation.type + formattedTime;
        var startMessage = collapsed ? console.groupCollapsed : console.group;

        // render
        try {
          startMessage.call(console, message);
        } catch (e) {
          console.log(message);
        }

        console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState));
        console.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation);
        console.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState));

        try {
          console.groupEnd();
        } catch (e) {
          console.log('—— log end ——');
        }

        prevState = nextState;
      });
    };
  }

  function repeat(str, times) {
    return new Array(times + 1).join(str);
  }

  function pad(num, maxLength) {
    return repeat('0', maxLength - num.toString().length) + num;
  }

  return createLogger;
});
  })();
});

require.register("vuex/dist/vuex.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "vuex");
  (function() {
    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * vuex v2.1.1
 * (c) 2016 Evan You
 * @license MIT
 */
(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Vuex = factory();
})(undefined, function () {
  'use strict';

  var devtoolHook = typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  function devtoolPlugin(store) {
    if (!devtoolHook) {
      return;
    }

    store._devtoolHook = devtoolHook;

    devtoolHook.emit('vuex:init', store);

    devtoolHook.on('vuex:travel-to-state', function (targetState) {
      store.replaceState(targetState);
    });

    store.subscribe(function (mutation, state) {
      devtoolHook.emit('vuex:mutation', mutation, state);
    });
  }

  function applyMixin(Vue) {
    var version = Number(Vue.version.split('.')[0]);

    if (version >= 2) {
      var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
      Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
    } else {
      // override init and inject vuex init procedure
      // for 1.x backwards compatibility.
      var _init = Vue.prototype._init;
      Vue.prototype._init = function (options) {
        if (options === void 0) options = {};

        options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
        _init.call(this, options);
      };
    }

    /**
     * Vuex init hook, injected into each instances init hooks list.
     */

    function vuexInit() {
      var options = this.$options;
      // store injection
      if (options.store) {
        this.$store = options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
    }
  }

  var mapState = normalizeNamespace(function (namespace, states) {
    var res = {};
    normalizeMap(states).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      res[key] = function mappedState() {
        var state = this.$store.state;
        var getters = this.$store.getters;
        if (namespace) {
          var module = this.$store._modulesNamespaceMap[namespace];
          if (!module) {
            warnNamespace('mapState', namespace);
            return;
          }
          state = module.state;
          getters = module.context.getters;
        }
        return typeof val === 'function' ? val.call(this, state, getters) : state[val];
      };
    });
    return res;
  });

  var mapMutations = normalizeNamespace(function (namespace, mutations) {
    var res = {};
    normalizeMap(mutations).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      val = namespace + val;
      res[key] = function mappedMutation() {
        var args = [],
            len = arguments.length;
        while (len--) {
          args[len] = arguments[len];
        }return this.$store.commit.apply(this.$store, [val].concat(args));
      };
    });
    return res;
  });

  var mapGetters = normalizeNamespace(function (namespace, getters) {
    var res = {};
    normalizeMap(getters).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      val = namespace + val;
      res[key] = function mappedGetter() {
        if (!(val in this.$store.getters)) {
          console.error("[vuex] unknown getter: " + val);
        }
        return this.$store.getters[val];
      };
    });
    return res;
  });

  var mapActions = normalizeNamespace(function (namespace, actions) {
    var res = {};
    normalizeMap(actions).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      val = namespace + val;
      res[key] = function mappedAction() {
        var args = [],
            len = arguments.length;
        while (len--) {
          args[len] = arguments[len];
        }return this.$store.dispatch.apply(this.$store, [val].concat(args));
      };
    });
    return res;
  });

  function normalizeMap(map) {
    return Array.isArray(map) ? map.map(function (key) {
      return { key: key, val: key };
    }) : Object.keys(map).map(function (key) {
      return { key: key, val: map[key] };
    });
  }

  function normalizeNamespace(fn) {
    return function (namespace, map) {
      if (typeof namespace !== 'string') {
        map = namespace;
        namespace = '';
      } else if (namespace.charAt(namespace.length - 1) !== '/') {
        namespace += '/';
      }
      return fn(namespace, map);
    };
  }

  function warnNamespace(helper, namespace) {
    console.error("[vuex] module namespace not found in " + helper + "(): " + namespace);
  }

  /**
   * forEach for object
   */
  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function (key) {
      return fn(obj[key], key);
    });
  }

  function isObject(obj) {
    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  }

  function isPromise(val) {
    return val && typeof val.then === 'function';
  }

  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }

  var Module = function Module(rawModule, runtime) {
    this.runtime = runtime;
    this._children = Object.create(null);
    this._rawModule = rawModule;
  };

  var prototypeAccessors$1 = { state: {}, namespaced: {} };

  prototypeAccessors$1.state.get = function () {
    return this._rawModule.state || {};
  };

  prototypeAccessors$1.namespaced.get = function () {
    return !!this._rawModule.namespaced;
  };

  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };

  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };

  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };

  Module.prototype.update = function update(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };

  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };

  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };

  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };

  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };

  Object.defineProperties(Module.prototype, prototypeAccessors$1);

  var ModuleCollection = function ModuleCollection(rawRootModule) {
    var this$1 = this;

    // register root module (Vuex.Store options)
    this.root = new Module(rawRootModule, false);

    // register all nested modules
    if (rawRootModule.modules) {
      forEachValue(rawRootModule.modules, function (rawModule, key) {
        this$1.register([key], rawModule, false);
      });
    }
  };

  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function (module, key) {
      return module.getChild(key);
    }, this.root);
  };

  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function (namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '');
    }, '');
  };

  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update(this.root, rawRootModule);
  };

  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1 = this;
    if (runtime === void 0) runtime = true;

    var parent = this.get(path.slice(0, -1));
    var newModule = new Module(rawModule, runtime);
    parent.addChild(path[path.length - 1], newModule);

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function (rawChildModule, key) {
        this$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };

  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    if (!parent.getChild(key).runtime) {
      return;
    }

    parent.removeChild(key);
  };

  function update(targetModule, newModule) {
    // update target module
    targetModule.update(newModule);

    // update nested modules
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          console.warn("[vuex] trying to add a new module '" + key + "' on hot reloading, " + 'manual reload is needed');
          return;
        }
        update(targetModule.getChild(key), newModule.modules[key]);
      }
    }
  }

  var Vue; // bind on install

  var Store = function Store(options) {
    var this$1 = this;
    if (options === void 0) options = {};

    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");

    var state = options.state;if (state === void 0) state = {};
    var plugins = options.plugins;if (plugins === void 0) plugins = [];
    var strict = options.strict;if (strict === void 0) strict = false;

    // store internal state
    this._committing = false;
    this._actions = Object.create(null);
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._watcherVM = new Vue();

    // bind commit and dispatch to self
    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    };

    // strict mode
    this.strict = strict;

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root);

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state);

    // apply plugins
    plugins.concat(devtoolPlugin).forEach(function (plugin) {
      return plugin(this$1);
    });
  };

  var prototypeAccessors = { state: {} };

  prototypeAccessors.state.get = function () {
    return this._vm.$data.state;
  };

  prototypeAccessors.state.set = function (v) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  };

  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1 = this;

    // check object-style commit
    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

    var mutation = { type: type, payload: payload };
    var entry = this._mutations[type];
    if (!entry) {
      console.error("[vuex] unknown mutation type: " + type);
      return;
    }
    this._withCommit(function () {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
    this._subscribers.forEach(function (sub) {
      return sub(mutation, this$1.state);
    });

    if (options && options.silent) {
      console.warn("[vuex] mutation type: " + type + ". Silent option has been removed. " + 'Use the filter functionality in the vue-devtools');
    }
  };

  Store.prototype.dispatch = function dispatch(_type, _payload) {
    // check object-style dispatch
    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

    var entry = this._actions[type];
    if (!entry) {
      console.error("[vuex] unknown action type: " + type);
      return;
    }
    return entry.length > 1 ? Promise.all(entry.map(function (handler) {
      return handler(payload);
    })) : entry[0](payload);
  };

  Store.prototype.subscribe = function subscribe(fn) {
    var subs = this._subscribers;
    if (subs.indexOf(fn) < 0) {
      subs.push(fn);
    }
    return function () {
      var i = subs.indexOf(fn);
      if (i > -1) {
        subs.splice(i, 1);
      }
    };
  };

  Store.prototype.watch = function watch(getter, cb, options) {
    var this$1 = this;

    assert(typeof getter === 'function', "store.watch only accepts a function.");
    return this._watcherVM.$watch(function () {
      return getter(this$1.state, this$1.getters);
    }, cb, options);
  };

  Store.prototype.replaceState = function replaceState(state) {
    var this$1 = this;

    this._withCommit(function () {
      this$1._vm.state = state;
    });
  };

  Store.prototype.registerModule = function registerModule(path, rawModule) {
    if (typeof path === 'string') {
      path = [path];
    }
    assert(Array.isArray(path), "module path must be a string or an Array.");
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path));
    // reset store to update getters...
    resetStoreVM(this, this.state);
  };

  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1 = this;

    if (typeof path === 'string') {
      path = [path];
    }
    assert(Array.isArray(path), "module path must be a string or an Array.");
    this._modules.unregister(path);
    this._withCommit(function () {
      var parentState = getNestedState(this$1.state, path.slice(0, -1));
      Vue.delete(parentState, path[path.length - 1]);
    });
    resetStore(this);
  };

  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);
    resetStore(this);
  };

  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };

  Object.defineProperties(Store.prototype, prototypeAccessors);

  function resetStore(store) {
    store._actions = Object.create(null);
    store._mutations = Object.create(null);
    store._wrappedGetters = Object.create(null);
    store._modulesNamespaceMap = Object.create(null);
    var state = store.state;
    // init all modules
    installModule(store, state, [], store._modules.root, true);
    // reset vm
    resetStoreVM(store, state);
  }

  function resetStoreVM(store, state) {
    var oldVm = store._vm;

    // bind store public getters
    store.getters = {};
    var wrappedGetters = store._wrappedGetters;
    var computed = {};
    forEachValue(wrappedGetters, function (fn, key) {
      // use computed to leverage its lazy-caching mechanism
      computed[key] = function () {
        return fn(store);
      };
      Object.defineProperty(store.getters, key, {
        get: function get() {
          return store._vm[key];
        },
        enumerable: true // for local getters
      });
    });

    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    var silent = Vue.config.silent;
    Vue.config.silent = true;
    store._vm = new Vue({
      data: { state: state },
      computed: computed
    });
    Vue.config.silent = silent;

    // enable strict mode for new vm
    if (store.strict) {
      enableStrictMode(store);
    }

    if (oldVm) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation.
      store._withCommit(function () {
        oldVm.state = null;
      });
      Vue.nextTick(function () {
        return oldVm.$destroy();
      });
    }
  }

  function installModule(store, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store._modules.getNamespace(path);

    // register in namespace map
    if (namespace) {
      store._modulesNamespaceMap[namespace] = module;
    }

    // set state
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store._withCommit(function () {
        Vue.set(parentState, moduleName, module.state);
      });
    }

    var local = module.context = makeLocalContext(store, namespace);

    module.forEachMutation(function (mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store, namespacedType, mutation, path);
    });

    module.forEachAction(function (action, key) {
      var namespacedType = namespace + key;
      registerAction(store, namespacedType, action, local, path);
    });

    module.forEachGetter(function (getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store, namespacedType, getter, local, path);
    });

    module.forEachChild(function (child, key) {
      installModule(store, rootState, path.concat(key), child, hot);
    });
  }

  /**
   * make localized dispatch, commit and getters
   * if there is no namespace, just use root ones
   */
  function makeLocalContext(store, namespace) {
    var noNamespace = namespace === '';

    var local = {
      dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
          if (!store._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }

        return store.dispatch(type, payload);
      },

      commit: noNamespace ? store.commit : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
          if (!store._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }

        store.commit(type, payload, options);
      }
    };

    // getters object must be gotten lazily
    // because store.getters will be changed by vm update
    Object.defineProperty(local, 'getters', {
      get: noNamespace ? function () {
        return store.getters;
      } : function () {
        return makeLocalGetters(store, namespace);
      }
    });

    return local;
  }

  function makeLocalGetters(store, namespace) {
    var gettersProxy = {};

    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function (type) {
      // skip if the target getter is not match this namespace
      if (type.slice(0, splitPos) !== namespace) {
        return;
      }

      // extract local getter type
      var localType = type.slice(splitPos);

      // Add a port to the getters proxy.
      // Define as getter property because
      // we do not want to evaluate the getters in this time.
      Object.defineProperty(gettersProxy, localType, {
        get: function get() {
          return store.getters[type];
        },
        enumerable: true
      });
    });

    return gettersProxy;
  }

  function registerMutation(store, type, handler, path) {
    var entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler(getNestedState(store.state, path), payload);
    });
  }

  function registerAction(store, type, handler, local, path) {
    var entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler(payload, cb) {
      var res = handler({
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: getNestedState(store.state, path),
        rootGetters: store.getters,
        rootState: store.state
      }, payload, cb);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store._devtoolHook) {
        return res.catch(function (err) {
          store._devtoolHook.emit('vuex:error', err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }

  function registerGetter(store, type, rawGetter, local, path) {
    if (store._wrappedGetters[type]) {
      console.error("[vuex] duplicate getter key: " + type);
      return;
    }
    store._wrappedGetters[type] = function wrappedGetter(store) {
      return rawGetter(getNestedState(store.state, path), // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
      );
    };
  }

  function enableStrictMode(store) {
    store._vm.$watch('state', function () {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }, { deep: true, sync: true });
  }

  function getNestedState(state, path) {
    return path.length ? path.reduce(function (state, key) {
      return state[key];
    }, state) : state;
  }

  function unifyObjectStyle(type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    return { type: type, payload: payload, options: options };
  }

  function install(_Vue) {
    if (Vue) {
      console.error('[vuex] already installed. Vue.use(Vuex) should be called only once.');
      return;
    }
    Vue = _Vue;
    applyMixin(Vue);
  }

  // auto install in dist mode
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  var index = {
    Store: Store,
    install: install,
    version: '2.1.1',
    mapState: mapState,
    mapMutations: mapMutations,
    mapGetters: mapGetters,
    mapActions: mapActions
  };

  return index;
});
  })();
});
require.register("api/auth.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _store = require('../state/store');

var _store2 = _interopRequireDefault(_store);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _mutations = require('../state/mutations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);

exports.default = {

    signin: function signin(username, password) {
        _store2.default.commit(_mutations.AUTH_TOKEN, 'Q6SnSk2N5wGbXsEllqG6hSx7vRmxcz');
    },

    signout: function signout() {
        _store2.default.commit(_mutations.AUTH_TOKEN, null);
    }
};

});

require.register("api/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('./auth');

Object.defineProperty(exports, 'Auth', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_auth).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("components/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routerBase = require('./router-base');

Object.defineProperty(exports, 'RouterBase', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_routerBase).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("components/router-base.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: 'RouterBase'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('router-view')}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a9bd5fd0", __vue__options__)
  } else {
    hotAPI.reload("data-v-a9bd5fd0", __vue__options__)
  }
})()}
});

;require.register("config/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _layouts = require('../layouts');

var _views = require('../views');

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pages = _views2.default.Pages,
    ErrorViews = _views2.default.ErrorViews;
exports.default = [{
  path: '/',
  component: _layouts.Base,
  children: [{ name: 'home', path: '/', component: Pages.Home }, { name: 'about', path: 'about', component: Pages.About }]
}, {
  path: '/forbidden',
  name: 'error401',
  component: ErrorViews.Error401
}, {
  path: '*',
  name: 'error404',
  component: ErrorViews.Error404
}];

});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

require('babel-polyfill');

var _store = require('./state/store.js');

var _store2 = _interopRequireDefault(_store);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _routes = require('./config/routes');

var _routes2 = _interopRequireDefault(_routes);

var _components = require('./components');

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

var _vueValidator = require('vue-validator');

var _vueValidator2 = _interopRequireDefault(_vueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);
_vue2.default.use(_vueResource2.default);
_vue2.default.use(_vueValidator2.default);

var environment = 'production';

_vue2.default.config.debug = environment === 'development';
_vue2.default.config.devtools = environment === 'development';

_vue2.default.http.interceptors.push(function (request, next) {
  request.headers.set('Authorization', _store2.default.state.auth.token);
  next();
});

var router = new _vueRouter2.default({
  history: true,
  routes: _routes2.default
});

var app = new _vue2.default({
  el: '#content',
  render: function render(r) {
    return r(_components.RouterBase);
  },
  router: router,
  store: _store2.default
});

if (window && environment === 'development') {
  window.App = app;
}

});

;require.register("layouts/base.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'BaseLayout',

  data: function data() {
    return {
      navOpen: false
    };
  },


  methods: {
    toggleNav: function toggleNav() {
      this.navOpen = !this.navOpen;
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('nav',{staticClass:"nav"},[_vm._m(0),_vm._v(" "),_vm._m(1),_vm._v(" "),_c('span',{staticClass:"nav-toggle",on:{"click":_vm.toggleNav}},[_c('span'),_vm._v(" "),_c('span'),_vm._v(" "),_c('span')]),_vm._v(" "),_c('div',{staticClass:"nav-right nav-menu",class:{'is-active': _vm.navOpen}},[_c('router-link',{staticClass:"nav-item",attrs:{"to":{name: "home"}}},[_vm._v("\n        Home\n      ")]),_vm._v(" "),_c('router-link',{staticClass:"nav-item",attrs:{"to":{name: "about"}}},[_vm._v("\n        About\n      ")]),_vm._v(" "),_c('router-link',{staticClass:"nav-item",attrs:{"to":{path: "foo"}}},[_vm._v("\n        Error 404\n      ")]),_vm._v(" "),_c('router-link',{staticClass:"nav-item",attrs:{"to":{name: "error401"}}},[_vm._v("\n        Error 401\n      ")])],1)]),_vm._v(" "),_c('div',[_c('router-view')],1),_vm._v(" "),_vm._m(2)])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"nav-left"},[_c('a',{staticClass:"nav-item"},[_vm._v("\n        Vue Brunch Boilerplate\n      ")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"nav-center"},[_c('a',{staticClass:"nav-item",attrs:{"href":"https://github.com/lubien/vue-brunch-boilerplate","target":"_blank"}},[_c('span',{staticClass:"icon"},[_c('i',{staticClass:"fa fa-github"})])]),_vm._v(" "),_c('a',{staticClass:"nav-item",attrs:{"href":"https://twitter.com/@joao_lubien","target":"_blank"}},[_c('span',{staticClass:"icon"},[_c('i',{staticClass:"fa fa-twitter"})])])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('footer',{staticClass:"footer"},[_c('div',{staticClass:"container"},[_c('div',{staticClass:"content has-text-centered"},[_c('p',[_c('strong',[_vm._v("Vue Brunch Boilerplate")]),_vm._v(" by "),_c('a',{attrs:{"href":"http://lubien.me"}},[_vm._v("Lubien")]),_vm._v(".\n          The source code is licensed "),_c('a',{attrs:{"href":"http://opensource.org/licenses/mit-license.php"}},[_vm._v("MIT")]),_vm._v(".\n        ")]),_vm._v(" "),_c('p',[_c('a',{staticClass:"icon",attrs:{"href":"https://gitub.com/lubien/vue-brunch-boilerplate","target":"_blank"}},[_c('i',{staticClass:"fa fa-github"})])])])])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0fd24cd3", __vue__options__)
  } else {
    hotAPI.reload("data-v-0fd24cd3", __vue__options__)
  }
})()}
});

;require.register("layouts/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

Object.defineProperty(exports, 'Base', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_base).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("state/modules/auth.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mutations2 = require('../mutations');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var state = {
    token: null
};

var mutations = _defineProperty({}, _mutations2.AUTH_TOKEN, function (state, token) {
    state.token = token;
});

exports.default = {
    state: state,
    mutations: mutations
};

});

require.register("state/mutations.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AUTH_TOKEN = exports.AUTH_TOKEN = 'AUTH_TOKEN';

});

require.register("state/store.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _logger = require('vuex/dist/logger');

var _logger2 = _interopRequireDefault(_logger);

var _auth = require('./modules/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);
_vue2.default.config.debug = true;

exports.default = new _vuex2.default.Store({

    strict: true,

    modules: {
        auth: _auth2.default
    },

    middlewares: [(0, _logger2.default)()]

});

});

require.register("views/error/401.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'Error401View'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"hero is-warning is-fullheight"},[_c('div',{staticClass:"hero-body"},[_c('div',{staticClass:"container"},[_c('h1',{staticClass:"title"},[_vm._v("\n        Error 401\n      ")]),_vm._v(" "),_c('h2',{staticClass:"subtitle"},[_vm._v("\n        Unauthorized\n      ")])])])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-68d880c1", __vue__options__)
  } else {
    hotAPI.reload("data-v-68d880c1", __vue__options__)
  }
})()}
});

;require.register("views/error/404.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'Error404View'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"hero is-danger is-fullheight"},[_c('div',{staticClass:"hero-body"},[_c('div',{staticClass:"container"},[_c('h1',{staticClass:"title"},[_vm._v("\n        Error 404\n      ")]),_vm._v(" "),_c('h2',{staticClass:"subtitle"},[_vm._v("\n        Not found\n      ")])])])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6902c744", __vue__options__)
  } else {
    hotAPI.reload("data-v-6902c744", __vue__options__)
  }
})()}
});

;require.register("views/error/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./404');

Object.defineProperty(exports, 'Error404', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_).default;
  }
});

var _2 = require('./401');

Object.defineProperty(exports, 'Error401', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_2).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.register("views/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pages = require('./pages');

var Pages = _interopRequireWildcard(_pages);

var _error = require('./error');

var ErrorViews = _interopRequireWildcard(_error);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  Pages: Pages,
  ErrorViews: ErrorViews
};

});

require.register("views/pages/about.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'AboutView'
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('section',{staticClass:"hero is-primary"},[_c('div',{staticClass:"hero-body"},[_c('div',{staticClass:"container is-fluid"},[_c('h1',{staticClass:"title"},[_vm._v("\n          About\n        ")])])])]),_vm._v(" "),_c('div',{staticClass:"container"},[_c('p',[_vm._v("\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod lorem eget rutrum lacinia. Donec ultrices nisl mi, sollicitudin ullamcorper arcu hendrerit quis. Pellentesque laoreet sagittis neque. Pellentesque placerat ullamcorper accumsan. Nullam pellentesque scelerisque lacus, quis porttitor quam tincidunt eget. Nulla elit felis, dapibus id blandit a, suscipit non lacus. Quisque ut velit commodo risus scelerisque commodo vel eu nisi. Pellentesque pellentesque nunc a enim viverra venenatis. Cras augue felis, dignissim quis urna placerat, volutpat gravida risus. Duis iaculis sem vel libero vestibulum, sit amet egestas lacus eleifend. Donec vestibulum orci felis, at feugiat magna aliquam vel.\n    ")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('p',[_vm._v("\n      Nullam laoreet nec nibh id rutrum. Etiam eu suscipit nisi, ut hendrerit enim. Morbi accumsan justo quis blandit semper. Sed pulvinar vehicula commodo. Nullam sed nibh nec ante pharetra volutpat. Sed nec sem lectus. Phasellus arcu ipsum, bibendum in cursus non, viverra eget ante. Cras porta est ante, et posuere nisi imperdiet non. Proin congue erat quis tincidunt auctor. Donec lectus nisi, tempus ac mi ac, consequat vehicula ipsum. Ut non augue gravida, placerat nisi et, pretium tellus. Nullam vitae mauris viverra, dapibus metus ac, rhoncus diam. Sed fringilla lacinia massa et pharetra. Cras in accumsan urna. Mauris ac nibh vel turpis scelerisque pellentesque. Morbi accumsan non mi id pulvinar.\n    ")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('p',[_vm._v("\n      Ut id nibh viverra, lobortis magna at, laoreet nisl. Sed eleifend felis purus, in aliquet ipsum faucibus id. Suspendisse et lacus sollicitudin, lacinia sem placerat, tempor sem. Nulla tristique, sapien vitae elementum maximus, lectus elit auctor ante, eget molestie elit libero ac massa. Nunc mollis lorem metus, vitae rhoncus magna venenatis in. Aliquam at suscipit ex. Sed id mauris dui. Proin congue, dui id efficitur varius, ante justo porttitor diam, vel aliquam diam sem quis odio. In vestibulum justo vel accumsan molestie. Ut in justo ultricies, efficitur lectus ut, convallis magna.\n    ")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('p',[_vm._v("\n      Proin orci elit, imperdiet ac placerat nec, commodo gravida dolor. Curabitur vitae neque interdum, vestibulum augue efficitur, rhoncus tortor. Integer sit amet pellentesque est, at euismod orci. Aenean erat lacus, accumsan cursus nibh a, luctus tristique sapien. Integer nec nulla pulvinar, efficitur eros sit amet, blandit lorem. Integer ultricies leo ut dui aliquam feugiat. Sed egestas nisl quis nisi hendrerit, ut pharetra libero tincidunt.\n    ")]),_vm._v(" "),_c('br'),_vm._v(" "),_c('p',[_vm._v("\n      Suspendisse pretium ullamcorper ante sit amet efficitur. Maecenas tincidunt, nibh sit amet suscipit viverra, ligula lacus aliquet mauris, eget finibus ante orci id lorem. Mauris sagittis felis libero, ac sodales sapien suscipit tempor. Sed accumsan et orci in egestas. Duis ut suscipit eros. Suspendisse mauris tortor, faucibus nec tincidunt id, auctor non nisi. Quisque porttitor, eros vel suscipit viverra, enim diam porta erat, vitae tincidunt dolor nisl eget tortor. Maecenas viverra mauris in facilisis rutrum. Nulla ut pellentesque mi. Morbi ac blandit sem.\n    ")])])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1c7204d5", __vue__options__)
  } else {
    hotAPI.reload("data-v-1c7204d5", __vue__options__)
  }
})()}
});

;require.register("views/pages/home.vue", function(exports, require, module) {
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vuex = require('vuex');

var _api = require('../../api');

exports.default = {
  name: 'HomeView',

  computed: (0, _vuex.mapState)({
    token: function token(state) {
      return state.auth.token;
    }
  }),

  created: function created() {
    _api.Auth.signin('username', 'password');
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"container"},[_c('br'),_vm._v(" "),(_vm.token)?_c('p'):_vm._e(),_c('article',{staticClass:"message"},[_vm._m(1),_vm._v(" "),_c('div',{staticClass:"message-body"},[_vm._v("\n          You are authenticated with the following token "),_c('strong',[_vm._v(_vm._s(_vm.token))]),_c('p')])]),_vm._v(" "),_c('p')])])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"hero is-primary"},[_c('div',{staticClass:"hero-body"},[_c('div',{staticClass:"container is-fluid"},[_c('h1',{staticClass:"title"},[_vm._v("\n          HomePage\n        ")])])])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"message-header"},[_c('p',[_vm._v("Auth")]),_vm._v(" "),_c('button',{staticClass:"delete"})])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-331a0672", __vue__options__)
  } else {
    hotAPI.reload("data-v-331a0672", __vue__options__)
  }
})()}
});

;require.register("views/pages/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _home = require('./home');

Object.defineProperty(exports, 'Home', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_home).default;
  }
});

var _about = require('./about');

Object.defineProperty(exports, 'About', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_about).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

;require.alias("babel-polyfill/lib/index.js", "babel-polyfill");
require.alias("vue-router/dist/vue-router.common.js", "vue-router");
require.alias("vue/dist/vue.runtime.common.js", "vue");
require.alias("vue-resource/dist/vue-resource.common.js", "vue-resource");
require.alias("vue-validator/dist/vue-validator.common.js", "vue-validator");
require.alias("process/browser.js", "process");
require.alias("vuex/dist/vuex.js", "vuex");
require.alias("babel-regenerator-runtime/runtime.js", "babel-regenerator-runtime");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

