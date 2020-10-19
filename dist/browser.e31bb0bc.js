// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../node_modules/@babel/runtime/helpers/esm/typeof.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _typeof;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    exports.default = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    exports.default = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
},{}],"../../../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

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

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
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
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
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

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
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

  exports.keys = function(object) {
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
        var i = -1, next = function next() {
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
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
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

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
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

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../../../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../../../node_modules/regenerator-runtime/runtime.js"}],"../../../node_modules/lodash/noop.js":[function(require,module,exports) {
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],"../../../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _arrayLikeToArray;

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
},{}],"../../../node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _arrayWithoutHoles;

var _arrayLikeToArray = _interopRequireDefault(require("@babel/runtime/helpers/esm/arrayLikeToArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0, _arrayLikeToArray.default)(arr);
}
},{"@babel/runtime/helpers/esm/arrayLikeToArray":"../../../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js"}],"../../../node_modules/@babel/runtime/helpers/esm/iterableToArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _iterableToArray;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
},{}],"../../../node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _unsupportedIterableToArray;

var _arrayLikeToArray = _interopRequireDefault(require("@babel/runtime/helpers/esm/arrayLikeToArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0, _arrayLikeToArray.default)(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, _arrayLikeToArray.default)(o, minLen);
}
},{"@babel/runtime/helpers/esm/arrayLikeToArray":"../../../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js"}],"../../../node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _nonIterableSpread;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
},{}],"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _toConsumableArray;

var _arrayWithoutHoles = _interopRequireDefault(require("@babel/runtime/helpers/esm/arrayWithoutHoles"));

var _iterableToArray = _interopRequireDefault(require("@babel/runtime/helpers/esm/iterableToArray"));

var _unsupportedIterableToArray = _interopRequireDefault(require("@babel/runtime/helpers/esm/unsupportedIterableToArray"));

var _nonIterableSpread = _interopRequireDefault(require("@babel/runtime/helpers/esm/nonIterableSpread"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) {
  return (0, _arrayWithoutHoles.default)(arr) || (0, _iterableToArray.default)(arr) || (0, _unsupportedIterableToArray.default)(arr) || (0, _nonIterableSpread.default)();
}
},{"@babel/runtime/helpers/esm/arrayWithoutHoles":"../../../node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js","@babel/runtime/helpers/esm/iterableToArray":"../../../node_modules/@babel/runtime/helpers/esm/iterableToArray.js","@babel/runtime/helpers/esm/unsupportedIterableToArray":"../../../node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js","@babel/runtime/helpers/esm/nonIterableSpread":"../../../node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js"}],"../../../node_modules/tslib/tslib.es6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__createBinding = __createBinding;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__spreadArrays = __spreadArrays;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
exports.__classPrivateFieldGet = __classPrivateFieldGet;
exports.__classPrivateFieldSet = __classPrivateFieldSet;
exports.__assign = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  exports.__assign = __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__assign = __assign;

function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

function __createBinding(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}

function __exportStar(m, exports) {
  for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

;

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

;

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result.default = mod;
  return result;
}

function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}

function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  privateMap.set(receiver, value);
  return value;
}
},{}],"../../../node_modules/single-spa/lib/esm/single-spa.min.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addErrorHandler = a;
exports.checkActivityFunctions = bt;
exports.ensureJQuerySupport = ft;
exports.getAppNames = yt;
exports.getAppStatus = Ot;
exports.getMountedApps = Et;
exports.mountRootParcel = C;
exports.navigateToUrl = nt;
exports.pathToActiveWhen = _t;
exports.registerApplication = Pt;
exports.removeErrorHandler = c;
exports.setBootstrapMaxTime = F;
exports.setMountMaxTime = J;
exports.setUnloadMaxTime = Q;
exports.setUnmountMaxTime = H;
exports.start = xt;
exports.triggerAppChange = Mt;
exports.unloadApplication = At;
exports.unregisterApplication = Tt;
exports.UPDATING = exports.UNMOUNTING = exports.SKIP_BECAUSE_BROKEN = exports.NOT_MOUNTED = exports.NOT_LOADED = exports.NOT_BOOTSTRAPPED = exports.MOUNTING = exports.MOUNTED = exports.LOAD_ERROR = exports.LOADING_SOURCE_CODE = exports.BOOTSTRAPPING = void 0;

/* single-spa@5.8.0 - ESM - prod */
var t = Object.freeze({
  __proto__: null,

  get start() {
    return xt;
  },

  get ensureJQuerySupport() {
    return ft;
  },

  get setBootstrapMaxTime() {
    return F;
  },

  get setMountMaxTime() {
    return J;
  },

  get setUnmountMaxTime() {
    return H;
  },

  get setUnloadMaxTime() {
    return Q;
  },

  get registerApplication() {
    return Pt;
  },

  get unregisterApplication() {
    return Tt;
  },

  get getMountedApps() {
    return Et;
  },

  get getAppStatus() {
    return Ot;
  },

  get unloadApplication() {
    return At;
  },

  get checkActivityFunctions() {
    return bt;
  },

  get getAppNames() {
    return yt;
  },

  get pathToActiveWhen() {
    return _t;
  },

  get navigateToUrl() {
    return nt;
  },

  get triggerAppChange() {
    return Mt;
  },

  get addErrorHandler() {
    return a;
  },

  get removeErrorHandler() {
    return c;
  },

  get mountRootParcel() {
    return C;
  },

  get NOT_LOADED() {
    return l;
  },

  get LOADING_SOURCE_CODE() {
    return p;
  },

  get NOT_BOOTSTRAPPED() {
    return h;
  },

  get BOOTSTRAPPING() {
    return m;
  },

  get NOT_MOUNTED() {
    return d;
  },

  get MOUNTING() {
    return v;
  },

  get UPDATING() {
    return g;
  },

  get LOAD_ERROR() {
    return y;
  },

  get MOUNTED() {
    return w;
  },

  get UNMOUNTING() {
    return E;
  },

  get SKIP_BECAUSE_BROKEN() {
    return O;
  }

});

function n(t) {
  return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  })(t);
}

function e(t, n, e) {
  return n in t ? Object.defineProperty(t, n, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[n] = e, t;
}

var r = ("undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}).CustomEvent,
    o = function () {
  try {
    var t = new r("cat", {
      detail: {
        foo: "bar"
      }
    });
    return "cat" === t.type && "bar" === t.detail.foo;
  } catch (t) {}

  return !1;
}() ? r : "undefined" != typeof document && "function" == typeof document.createEvent ? function (t, n) {
  var e = document.createEvent("CustomEvent");
  return n ? e.initCustomEvent(t, n.bubbles, n.cancelable, n.detail) : e.initCustomEvent(t, !1, !1, void 0), e;
} : function (t, n) {
  var e = document.createEventObject();
  return e.type = t, n ? (e.bubbles = Boolean(n.bubbles), e.cancelable = Boolean(n.cancelable), e.detail = n.detail) : (e.bubbles = !1, e.cancelable = !1, e.detail = void 0), e;
},
    i = [];

function u(t, n, e) {
  var r = f(t, n, e);
  i.length ? i.forEach(function (t) {
    return t(r);
  }) : setTimeout(function () {
    throw r;
  });
}

function a(t) {
  if ("function" != typeof t) throw Error(s(28, !1));
  i.push(t);
}

function c(t) {
  if ("function" != typeof t) throw Error(s(29, !1));
  var n = !1;
  return i = i.filter(function (e) {
    var r = e === t;
    return n = n || r, !r;
  }), n;
}

function s(t, n) {
  for (var e = arguments.length, r = new Array(e > 2 ? e - 2 : 0), o = 2; o < e; o++) r[o - 2] = arguments[o];

  return "single-spa minified message #".concat(t, ": ").concat(n ? n + " " : "", "See https://single-spa.js.org/error/?code=").concat(t).concat(r.length ? "&arg=".concat(r.join("&arg=")) : "");
}

function f(t, n, e) {
  var r,
      o = "".concat(N(n), " '").concat(T(n), "' died in status ").concat(n.status, ": ");

  if (t instanceof Error) {
    try {
      t.message = o + t.message;
    } catch (t) {}

    r = t;
  } else {
    console.warn(s(30, !1, n.status, T(n)));

    try {
      r = Error(o + JSON.stringify(t));
    } catch (n) {
      r = t;
    }
  }

  return r.appOrParcelName = T(n), n.status = e, r;
}

var l = "NOT_LOADED",
    p = "LOADING_SOURCE_CODE",
    h = "NOT_BOOTSTRAPPED",
    m = "BOOTSTRAPPING",
    d = "NOT_MOUNTED",
    v = "MOUNTING",
    w = "MOUNTED",
    g = "UPDATING",
    E = "UNMOUNTING",
    y = "LOAD_ERROR",
    O = "SKIP_BECAUSE_BROKEN";
exports.SKIP_BECAUSE_BROKEN = O;
exports.LOAD_ERROR = y;
exports.UNMOUNTING = E;
exports.UPDATING = g;
exports.MOUNTED = w;
exports.MOUNTING = v;
exports.NOT_MOUNTED = d;
exports.BOOTSTRAPPING = m;
exports.NOT_BOOTSTRAPPED = h;
exports.LOADING_SOURCE_CODE = p;
exports.NOT_LOADED = l;

function P(t) {
  return t.status === w;
}

function b(t) {
  try {
    return t.activeWhen(window.location);
  } catch (n) {
    return u(n, t, O), !1;
  }
}

function T(t) {
  return t.name;
}

function A(t) {
  return Boolean(t.unmountThisParcel);
}

function N(t) {
  return A(t) ? "parcel" : "application";
}

function S() {
  for (var t = arguments.length - 1; t > 0; t--) for (var n in arguments[t]) "__proto__" !== n && (arguments[t - 1][n] = arguments[t][n]);

  return arguments[0];
}

function _(t, n) {
  for (var e = 0; e < t.length; e++) if (n(t[e])) return t[e];

  return null;
}

function D(t) {
  return t && ("function" == typeof t || (n = t, Array.isArray(n) && !_(n, function (t) {
    return "function" != typeof t;
  })));
  var n;
}

function U(t, n) {
  var e = t[n] || [];
  0 === (e = Array.isArray(e) ? e : [e]).length && (e = [function () {
    return Promise.resolve();
  }]);
  var r = N(t),
      o = T(t);
  return function (t) {
    return e.reduce(function (e, i, u) {
      return e.then(function () {
        var e = i(t);
        return j(e) ? e : Promise.reject(s(15, !1, r, o, n, u));
      });
    }, Promise.resolve());
  };
}

function j(t) {
  return t && "function" == typeof t.then && "function" == typeof t.catch;
}

function M(t, n) {
  return Promise.resolve().then(function () {
    return t.status !== h ? t : (t.status = m, t.bootstrap ? V(t, "bootstrap").then(e).catch(function (e) {
      if (n) throw f(e, t, O);
      return u(e, t, O), t;
    }) : Promise.resolve().then(e));
  });

  function e() {
    return t.status = d, t;
  }
}

function L(t, n) {
  return Promise.resolve().then(function () {
    if (t.status !== w) return t;
    t.status = E;
    var e = Object.keys(t.parcels).map(function (n) {
      return t.parcels[n].unmountThisParcel();
    });
    return Promise.all(e).then(r, function (e) {
      return r().then(function () {
        var r = Error(e.message);
        if (n) throw f(r, t, O);
        u(r, t, O);
      });
    }).then(function () {
      return t;
    });

    function r() {
      return V(t, "unmount").then(function () {
        t.status = d;
      }).catch(function (e) {
        if (n) throw f(e, t, O);
        u(e, t, O);
      });
    }
  });
}

var R = !1,
    I = !1;

function x(t, n) {
  return Promise.resolve().then(function () {
    return t.status !== d ? t : (R || (window.dispatchEvent(new o("single-spa:before-first-mount")), R = !0), V(t, "mount").then(function () {
      return t.status = w, I || (window.dispatchEvent(new o("single-spa:first-mount")), I = !0), t;
    }).catch(function (e) {
      return t.status = w, L(t, !0).then(r, r);

      function r() {
        if (n) throw f(e, t, O);
        return u(e, t, O), t;
      }
    }));
  });
}

var B = 0,
    G = {
  parcels: {}
};

function C() {
  return W.apply(G, arguments);
}

function W(t, e) {
  var r = this;
  if (!t || "object" !== n(t) && "function" != typeof t) throw Error(s(2, !1));
  if (t.name && "string" != typeof t.name) throw Error(s(3, !1, n(t.name)));
  if ("object" !== n(e)) throw Error(s(4, !1, name, n(e)));
  if (!e.domElement) throw Error(s(5, !1, name));
  var o,
      i = B++,
      u = "function" == typeof t,
      a = u ? t : function () {
    return Promise.resolve(t);
  },
      c = {
    id: i,
    parcels: {},
    status: u ? p : h,
    customProps: e,
    parentName: T(r),
    unmountThisParcel: function () {
      if (c.status !== w) throw Error(s(6, !1, name, c.status));
      return L(c, !0).then(function (t) {
        return c.parentName && delete r.parcels[c.id], t;
      }).then(function (t) {
        return m(t), t;
      }).catch(function (t) {
        throw c.status = O, v(t), t;
      });
    }
  };
  r.parcels[i] = c;
  var l = a();
  if (!l || "function" != typeof l.then) throw Error(s(7, !1));
  var m,
      v,
      E = (l = l.then(function (t) {
    if (!t) throw Error(s(8, !1));
    var n = t.name || "parcel-".concat(i);
    if (Object.prototype.hasOwnProperty.call(t, "bootstrap") && !D(t.bootstrap)) throw Error(s(9, !1, n));
    if (!D(t.mount)) throw Error(s(10, !1, n));
    if (!D(t.unmount)) throw Error(s(11, !1, n));
    if (t.update && !D(t.update)) throw Error(s(12, !1, n));
    var e = U(t, "bootstrap"),
        r = U(t, "mount"),
        u = U(t, "unmount");
    c.status = h, c.name = n, c.bootstrap = e, c.mount = r, c.unmount = u, c.timeouts = q(t.timeouts), t.update && (c.update = U(t, "update"), o.update = function (t) {
      return c.customProps = t, $(function (t) {
        return Promise.resolve().then(function () {
          if (t.status !== w) throw Error(s(32, !1, T(t)));
          return t.status = g, V(t, "update").then(function () {
            return t.status = w, t;
          }).catch(function (n) {
            throw f(n, t, O);
          });
        });
      }(c));
    });
  })).then(function () {
    return M(c, !0);
  }),
      y = E.then(function () {
    return x(c, !0);
  }),
      P = new Promise(function (t, n) {
    m = t, v = n;
  });
  return o = {
    mount: function () {
      return $(Promise.resolve().then(function () {
        if (c.status !== d) throw Error(s(13, !1, name, c.status));
        return r.parcels[i] = c, x(c);
      }));
    },
    unmount: function () {
      return $(c.unmountThisParcel());
    },
    getStatus: function () {
      return c.status;
    },
    loadPromise: $(l),
    bootstrapPromise: $(E),
    mountPromise: $(y),
    unmountPromise: $(P)
  };
}

function $(t) {
  return t.then(function () {
    return null;
  });
}

function k(e) {
  var r = T(e),
      o = "function" == typeof e.customProps ? e.customProps(r, window.location) : e.customProps;
  ("object" !== n(o) || null === o || Array.isArray(o)) && (o = {}, console.warn(s(40, !1), r, o));
  var i = S({}, o, {
    name: r,
    mountParcel: W.bind(e),
    singleSpa: t
  });
  return A(e) && (i.unmountSelf = e.unmountThisParcel), i;
}

var K = {
  bootstrap: {
    millis: 4e3,
    dieOnTimeout: !1,
    warningMillis: 1e3
  },
  mount: {
    millis: 3e3,
    dieOnTimeout: !1,
    warningMillis: 1e3
  },
  unmount: {
    millis: 3e3,
    dieOnTimeout: !1,
    warningMillis: 1e3
  },
  unload: {
    millis: 3e3,
    dieOnTimeout: !1,
    warningMillis: 1e3
  },
  update: {
    millis: 3e3,
    dieOnTimeout: !1,
    warningMillis: 1e3
  }
};

function F(t, n, e) {
  if ("number" != typeof t || t <= 0) throw Error(s(16, !1));
  K.bootstrap = {
    millis: t,
    dieOnTimeout: n,
    warningMillis: e || 1e3
  };
}

function J(t, n, e) {
  if ("number" != typeof t || t <= 0) throw Error(s(17, !1));
  K.mount = {
    millis: t,
    dieOnTimeout: n,
    warningMillis: e || 1e3
  };
}

function H(t, n, e) {
  if ("number" != typeof t || t <= 0) throw Error(s(18, !1));
  K.unmount = {
    millis: t,
    dieOnTimeout: n,
    warningMillis: e || 1e3
  };
}

function Q(t, n, e) {
  if ("number" != typeof t || t <= 0) throw Error(s(19, !1));
  K.unload = {
    millis: t,
    dieOnTimeout: n,
    warningMillis: e || 1e3
  };
}

function V(t, n) {
  var e = t.timeouts[n],
      r = e.warningMillis,
      o = N(t);
  return new Promise(function (i, u) {
    var a = !1,
        c = !1;
    t[n](k(t)).then(function (t) {
      a = !0, i(t);
    }).catch(function (t) {
      a = !0, u(t);
    }), setTimeout(function () {
      return l(1);
    }, r), setTimeout(function () {
      return l(!0);
    }, e.millis);
    var f = s(31, !1, n, o, T(t), e.millis);

    function l(t) {
      if (!a) if (!0 === t) c = !0, e.dieOnTimeout ? u(Error(f)) : console.error(f);else if (!c) {
        var n = t,
            o = n * r;
        console.warn(f), o + r < e.millis && setTimeout(function () {
          return l(n + 1);
        }, r);
      }
    }
  });
}

function q(t) {
  var n = {};

  for (var e in K) n[e] = S({}, K[e], t && t[e] || {});

  return n;
}

function z(t) {
  return Promise.resolve().then(function () {
    return t.loadPromise ? t.loadPromise : t.status !== l && t.status !== y ? t : (t.status = p, t.loadPromise = Promise.resolve().then(function () {
      var o = t.loadApp(k(t));
      if (!j(o)) throw r = !0, Error(s(33, !1, T(t)));
      return o.then(function (r) {
        var o;
        t.loadErrorTime = null, "object" !== n(e = r) && (o = 34), Object.prototype.hasOwnProperty.call(e, "bootstrap") && !D(e.bootstrap) && (o = 35), D(e.mount) || (o = 36), D(e.unmount) || (o = 37);
        var i = N(e);

        if (o) {
          var a;

          try {
            a = JSON.stringify(e);
          } catch (t) {}

          return console.error(s(o, !1, i, T(t), a), e), u(void 0, t, O), t;
        }

        return e.devtools && e.devtools.overlays && (t.devtools.overlays = S({}, t.devtools.overlays, e.devtools.overlays)), t.status = h, t.bootstrap = U(e, "bootstrap"), t.mount = U(e, "mount"), t.unmount = U(e, "unmount"), t.unload = U(e, "unload"), t.timeouts = q(e.timeouts), delete t.loadPromise, t;
      });
    }).catch(function (n) {
      var e;
      return delete t.loadPromise, r ? e = O : (e = y, t.loadErrorTime = new Date().getTime()), u(n, t, e), t;
    }));
    var e, r;
  });
}

var X,
    Y = "undefined" != typeof window,
    Z = {
  hashchange: [],
  popstate: []
},
    tt = ["hashchange", "popstate"];

function nt(t) {
  var n;
  if ("string" == typeof t) n = t;else if (this && this.href) n = this.href;else {
    if (!(t && t.currentTarget && t.currentTarget.href && t.preventDefault)) throw Error(s(14, !1));
    n = t.currentTarget.href, t.preventDefault();
  }
  var e = ct(window.location.href),
      r = ct(n);
  0 === n.indexOf("#") ? window.location.hash = r.hash : e.host !== r.host && r.host ? window.location.href = n : r.pathname === e.pathname && r.search === e.search ? window.location.hash = r.hash : window.history.pushState(null, null, n);
}

function et(t) {
  var n = this;

  if (t) {
    var e = t[0].type;
    tt.indexOf(e) >= 0 && Z[e].forEach(function (e) {
      try {
        e.apply(n, t);
      } catch (t) {
        setTimeout(function () {
          throw t;
        });
      }
    });
  }
}

function rt() {
  Lt([], arguments);
}

function ot(t, n) {
  return function () {
    var e = window.location.href,
        r = t.apply(this, arguments),
        o = window.location.href;
    return X && e === o || rt(it(window.history.state, n)), r;
  };
}

function it(t, n) {
  var e;

  try {
    e = new PopStateEvent("popstate", {
      state: t
    });
  } catch (n) {
    (e = document.createEvent("PopStateEvent")).initPopStateEvent("popstate", !1, !1, t);
  }

  return e.singleSpa = !0, e.singleSpaTrigger = n, e;
}

if (Y) {
  window.addEventListener("hashchange", rt), window.addEventListener("popstate", rt);
  var ut = window.addEventListener,
      at = window.removeEventListener;
  window.addEventListener = function (t, n) {
    if (!("function" == typeof n && tt.indexOf(t) >= 0) || _(Z[t], function (t) {
      return t === n;
    })) return ut.apply(this, arguments);
    Z[t].push(n);
  }, window.removeEventListener = function (t, n) {
    if (!("function" == typeof n && tt.indexOf(t) >= 0)) return at.apply(this, arguments);
    Z[t] = Z[t].filter(function (t) {
      return t !== n;
    });
  }, window.history.pushState = ot(window.history.pushState, "pushState"), window.history.replaceState = ot(window.history.replaceState, "replaceState"), window.singleSpaNavigate ? console.warn(s(41, !1)) : window.singleSpaNavigate = nt;
}

function ct(t) {
  var n = document.createElement("a");
  return n.href = t, n;
}

var st = !1;

function ft() {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.jQuery;

  if (t || window.$ && window.$.fn && window.$.fn.jquery && (t = window.$), t && !st) {
    var n = t.fn.on,
        e = t.fn.off;
    t.fn.on = function (t, e) {
      return lt.call(this, n, window.addEventListener, t, e, arguments);
    }, t.fn.off = function (t, n) {
      return lt.call(this, e, window.removeEventListener, t, n, arguments);
    }, st = !0;
  }
}

function lt(t, n, e, r, o) {
  return "string" != typeof e ? t.apply(this, o) : (e.split(/\s+/).forEach(function (t) {
    tt.indexOf(t) >= 0 && (n(t, r), e = e.replace(t, ""));
  }), "" === e.trim() ? this : t.apply(this, o));
}

var pt = {};

function ht(t) {
  return Promise.resolve().then(function () {
    var n = pt[T(t)];
    return n ? t.status === l ? (mt(t, n), t) : "UNLOADING" === t.status ? n.promise.then(function () {
      return t;
    }) : t.status !== d ? t : (t.status = "UNLOADING", V(t, "unload").then(function () {
      return mt(t, n), t;
    }).catch(function (e) {
      return function (t, n, e) {
        delete pt[T(t)], delete t.bootstrap, delete t.mount, delete t.unmount, delete t.unload, u(e, t, O), n.reject(e);
      }(t, n, e), t;
    })) : t;
  });
}

function mt(t, n) {
  delete pt[T(t)], delete t.bootstrap, delete t.mount, delete t.unmount, delete t.unload, t.status = l, n.resolve();
}

function dt(t, n, e, r) {
  pt[T(t)] = {
    app: t,
    resolve: e,
    reject: r
  }, Object.defineProperty(pt[T(t)], "promise", {
    get: n
  });
}

function vt(t) {
  return pt[t];
}

var wt = [];

function gt() {
  var t = [],
      n = [],
      e = [],
      r = [],
      o = new Date().getTime();
  return wt.forEach(function (i) {
    var u = i.status !== O && b(i);

    switch (i.status) {
      case y:
        u && o - i.loadErrorTime >= 200 && e.push(i);
        break;

      case l:
      case p:
        u && e.push(i);
        break;

      case h:
      case d:
        !u && vt(T(i)) ? t.push(i) : u && r.push(i);
        break;

      case w:
        u || n.push(i);
    }
  }), {
    appsToUnload: t,
    appsToUnmount: n,
    appsToLoad: e,
    appsToMount: r
  };
}

function Et() {
  return wt.filter(P).map(T);
}

function yt() {
  return wt.map(T);
}

function Ot(t) {
  var n = _(wt, function (n) {
    return T(n) === t;
  });

  return n ? n.status : null;
}

function Pt(t, e, r, o) {
  var i = function (t, e, r, o) {
    var i,
        u = {
      name: null,
      loadApp: null,
      activeWhen: null,
      customProps: null
    };
    return "object" === n(t) ? (function (t) {
      if (Array.isArray(t) || null === t) throw Error(s(39, !1));
      var e = ["name", "app", "activeWhen", "customProps"],
          r = Object.keys(t).reduce(function (t, n) {
        return e.indexOf(n) >= 0 ? t : t.concat(n);
      }, []);
      if (0 !== r.length) throw Error(s(38, !1, e.join(", "), r.join(", ")));
      if ("string" != typeof t.name || 0 === t.name.length) throw Error(s(20, !1));
      if ("object" !== n(t.app) && "function" != typeof t.app) throw Error(s(20, !1));

      var o = function (t) {
        return "string" == typeof t || "function" == typeof t;
      };

      if (!(o(t.activeWhen) || Array.isArray(t.activeWhen) && t.activeWhen.every(o))) throw Error(s(24, !1));
      if (!St(t.customProps)) throw Error(s(22, !1));
    }(t), u.name = t.name, u.loadApp = t.app, u.activeWhen = t.activeWhen, u.customProps = t.customProps) : (function (t, n, e, r) {
      if ("string" != typeof t || 0 === t.length) throw Error(s(20, !1));
      if (!n) throw Error(s(23, !1));
      if ("function" != typeof e) throw Error(s(24, !1));
      if (!St(r)) throw Error(s(22, !1));
    }(t, e, r, o), u.name = t, u.loadApp = e, u.activeWhen = r, u.customProps = o), u.loadApp = "function" != typeof (i = u.loadApp) ? function () {
      return Promise.resolve(i);
    } : i, u.customProps = function (t) {
      return t || {};
    }(u.customProps), u.activeWhen = function (t) {
      var n = Array.isArray(t) ? t : [t];
      return n = n.map(function (t) {
        return "function" == typeof t ? t : _t(t);
      }), function (t) {
        return n.some(function (n) {
          return n(t);
        });
      };
    }(u.activeWhen), u;
  }(t, e, r, o);

  if (-1 !== yt().indexOf(i.name)) throw Error(s(21, !1, i.name));
  wt.push(S({
    loadErrorTime: null,
    status: l,
    parcels: {},
    devtools: {
      overlays: {
        options: {},
        selectors: []
      }
    }
  }, i)), Y && (ft(), Lt());
}

function bt() {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.location;
  return wt.filter(function (n) {
    return n.activeWhen(t);
  }).map(T);
}

function Tt(t) {
  if (0 === wt.filter(function (n) {
    return T(n) === t;
  }).length) throw Error(s(25, !1, t));
  return At(t).then(function () {
    var n = wt.map(T).indexOf(t);
    wt.splice(n, 1);
  });
}

function At(t) {
  var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
    waitForUnmount: !1
  };
  if ("string" != typeof t) throw Error(s(26, !1));

  var e = _(wt, function (n) {
    return T(n) === t;
  });

  if (!e) throw Error(s(27, !1, t));
  var r,
      o = vt(T(e));

  if (n && n.waitForUnmount) {
    if (o) return o.promise;
    var i = new Promise(function (t, n) {
      dt(e, function () {
        return i;
      }, t, n);
    });
    return i;
  }

  return o ? (r = o.promise, Nt(e, o.resolve, o.reject)) : r = new Promise(function (t, n) {
    dt(e, function () {
      return r;
    }, t, n), Nt(e, t, n);
  }), r;
}

function Nt(t, n, e) {
  L(t).then(ht).then(function () {
    n(), setTimeout(function () {
      Lt();
    });
  }).catch(e);
}

function St(t) {
  return !t || "function" == typeof t || "object" === n(t) && null !== t && !Array.isArray(t);
}

function _t(t) {
  var n = function (t) {
    var n = 0,
        e = !1,
        r = "^";
    "/" !== t[0] && (t = "/" + t);

    for (var o = 0; o < t.length; o++) {
      var i = t[o];
      (!e && ":" === i || e && "/" === i) && u(o);
    }

    return u(t.length), new RegExp(r, "i");

    function u(o) {
      var i = t.slice(n, o).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
      r += e ? "[^/]+/?" : i, o !== t.length || e || (r = "/" === r.charAt(r.length - 1) ? "".concat(r, ".*$") : "".concat(r, "([/#].*)?$")), e = !e, n = o;
    }
  }(t);

  return function (t) {
    var e = t.href.replace(t.origin, "").replace(t.search, "").split("?")[0];
    return n.test(e);
  };
}

var Dt = !1,
    Ut = [],
    jt = Y && window.location.href;

function Mt() {
  return Lt();
}

function Lt() {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      n = arguments.length > 1 ? arguments[1] : void 0;
  if (Dt) return new Promise(function (t, e) {
    Ut.push({
      resolve: t,
      reject: e,
      eventArguments: n
    });
  });
  var r,
      i = gt(),
      u = i.appsToUnload,
      a = i.appsToUnmount,
      c = i.appsToLoad,
      s = i.appsToMount,
      f = !1,
      p = jt,
      h = jt = window.location.href;
  return Bt() ? (Dt = !0, r = u.concat(c, a, s), g()) : (r = c, v());

  function m() {
    f = !0;
  }

  function v() {
    return Promise.resolve().then(function () {
      var t = c.map(z);
      return Promise.all(t).then(y).then(function () {
        return [];
      }).catch(function (t) {
        throw y(), t;
      });
    });
  }

  function g() {
    return Promise.resolve().then(function () {
      if (window.dispatchEvent(new o(0 === r.length ? "single-spa:before-no-app-change" : "single-spa:before-app-change", P(!0))), window.dispatchEvent(new o("single-spa:before-routing-event", P(!0, {
        cancelNavigation: m
      }))), f) return window.dispatchEvent(new o("single-spa:before-mount-routing-event", P(!0))), E(), void nt(p);
      var n = u.map(ht),
          e = a.map(L).map(function (t) {
        return t.then(ht);
      }).concat(n),
          i = Promise.all(e);
      i.then(function () {
        window.dispatchEvent(new o("single-spa:before-mount-routing-event", P(!0)));
      });
      var l = c.map(function (t) {
        return z(t).then(function (t) {
          return Rt(t, i);
        });
      }),
          h = s.filter(function (t) {
        return c.indexOf(t) < 0;
      }).map(function (t) {
        return Rt(t, i);
      });
      return i.catch(function (t) {
        throw y(), t;
      }).then(function () {
        return y(), Promise.all(l.concat(h)).catch(function (n) {
          throw t.forEach(function (t) {
            return t.reject(n);
          }), n;
        }).then(E);
      });
    });
  }

  function E() {
    var n = Et();
    t.forEach(function (t) {
      return t.resolve(n);
    });

    try {
      var e = 0 === r.length ? "single-spa:no-app-change" : "single-spa:app-change";
      window.dispatchEvent(new o(e, P())), window.dispatchEvent(new o("single-spa:routing-event", P()));
    } catch (t) {
      setTimeout(function () {
        throw t;
      });
    }

    if (Dt = !1, Ut.length > 0) {
      var i = Ut;
      Ut = [], Lt(i);
    }

    return n;
  }

  function y() {
    t.forEach(function (t) {
      et(t.eventArguments);
    }), et(n);
  }

  function P() {
    var t,
        o = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
        i = arguments.length > 1 ? arguments[1] : void 0,
        m = {},
        v = (e(t = {}, w, []), e(t, d, []), e(t, l, []), e(t, O, []), t);
    o ? (c.concat(s).forEach(function (t, n) {
      E(t, w);
    }), u.forEach(function (t) {
      E(t, l);
    }), a.forEach(function (t) {
      E(t, d);
    })) : r.forEach(function (t) {
      E(t);
    });
    var g = {
      detail: {
        newAppStatuses: m,
        appsByNewStatus: v,
        totalAppChanges: r.length,
        originalEvent: null == n ? void 0 : n[0],
        oldUrl: p,
        newUrl: h,
        navigationIsCanceled: f
      }
    };
    return i && S(g.detail, i), g;

    function E(t, n) {
      var e = T(t);
      n = n || Ot(e), m[e] = n, (v[n] = v[n] || []).push(e);
    }
  }
}

function Rt(t, n) {
  return b(t) ? M(t).then(function (t) {
    return n.then(function () {
      return b(t) ? x(t) : t;
    });
  }) : n.then(function () {
    return t;
  });
}

var It = !1;

function xt(t) {
  var n;
  It = !0, t && t.urlRerouteOnly && (n = t.urlRerouteOnly, X = n), Y && Lt();
}

function Bt() {
  return It;
}

Y && setTimeout(function () {
  It || console.warn(s(1, !1));
}, 5e3);
var Gt = {
  getRawAppData: function () {
    return [].concat(wt);
  },
  reroute: Lt,
  NOT_LOADED: l,
  toLoadPromise: z,
  toBootstrapPromise: M,
  unregisterApplication: Tt
};
Y && window.__SINGLE_SPA_DEVTOOLS__ && (window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = Gt);
},{}],"../../../node_modules/lodash/_arrayPush.js":[function(require,module,exports) {
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],"../../../node_modules/lodash/_freeGlobal.js":[function(require,module,exports) {
var global = arguments[3];
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

},{}],"../../../node_modules/lodash/_root.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":"../../../node_modules/lodash/_freeGlobal.js"}],"../../../node_modules/lodash/_Symbol.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_getRawTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":"../../../node_modules/lodash/_Symbol.js"}],"../../../node_modules/lodash/_objectToString.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],"../../../node_modules/lodash/_baseGetTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":"../../../node_modules/lodash/_Symbol.js","./_getRawTag":"../../../node_modules/lodash/_getRawTag.js","./_objectToString":"../../../node_modules/lodash/_objectToString.js"}],"../../../node_modules/lodash/isObjectLike.js":[function(require,module,exports) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"../../../node_modules/lodash/_baseIsArguments.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":"../../../node_modules/lodash/_baseGetTag.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/isArguments.js":[function(require,module,exports) {
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":"../../../node_modules/lodash/_baseIsArguments.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/isArray.js":[function(require,module,exports) {
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],"../../../node_modules/lodash/_isFlattenable.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

},{"./_Symbol":"../../../node_modules/lodash/_Symbol.js","./isArguments":"../../../node_modules/lodash/isArguments.js","./isArray":"../../../node_modules/lodash/isArray.js"}],"../../../node_modules/lodash/_baseFlatten.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":"../../../node_modules/lodash/_arrayPush.js","./_isFlattenable":"../../../node_modules/lodash/_isFlattenable.js"}],"../../../node_modules/lodash/_copyArray.js":[function(require,module,exports) {
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],"../../../node_modules/lodash/concat.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    baseFlatten = require('./_baseFlatten'),
    copyArray = require('./_copyArray'),
    isArray = require('./isArray');

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}

module.exports = concat;

},{"./_arrayPush":"../../../node_modules/lodash/_arrayPush.js","./_baseFlatten":"../../../node_modules/lodash/_baseFlatten.js","./_copyArray":"../../../node_modules/lodash/_copyArray.js","./isArray":"../../../node_modules/lodash/isArray.js"}],"../../../node_modules/lodash/_listCacheClear.js":[function(require,module,exports) {
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],"../../../node_modules/lodash/eq.js":[function(require,module,exports) {
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],"../../../node_modules/lodash/_assocIndexOf.js":[function(require,module,exports) {
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":"../../../node_modules/lodash/eq.js"}],"../../../node_modules/lodash/_listCacheDelete.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":"../../../node_modules/lodash/_assocIndexOf.js"}],"../../../node_modules/lodash/_listCacheGet.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":"../../../node_modules/lodash/_assocIndexOf.js"}],"../../../node_modules/lodash/_listCacheHas.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":"../../../node_modules/lodash/_assocIndexOf.js"}],"../../../node_modules/lodash/_listCacheSet.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":"../../../node_modules/lodash/_assocIndexOf.js"}],"../../../node_modules/lodash/_ListCache.js":[function(require,module,exports) {
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":"../../../node_modules/lodash/_listCacheClear.js","./_listCacheDelete":"../../../node_modules/lodash/_listCacheDelete.js","./_listCacheGet":"../../../node_modules/lodash/_listCacheGet.js","./_listCacheHas":"../../../node_modules/lodash/_listCacheHas.js","./_listCacheSet":"../../../node_modules/lodash/_listCacheSet.js"}],"../../../node_modules/lodash/_stackClear.js":[function(require,module,exports) {
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":"../../../node_modules/lodash/_ListCache.js"}],"../../../node_modules/lodash/_stackDelete.js":[function(require,module,exports) {
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],"../../../node_modules/lodash/_stackGet.js":[function(require,module,exports) {
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],"../../../node_modules/lodash/_stackHas.js":[function(require,module,exports) {
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],"../../../node_modules/lodash/isObject.js":[function(require,module,exports) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],"../../../node_modules/lodash/isFunction.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":"../../../node_modules/lodash/_baseGetTag.js","./isObject":"../../../node_modules/lodash/isObject.js"}],"../../../node_modules/lodash/_coreJsData.js":[function(require,module,exports) {
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_isMasked.js":[function(require,module,exports) {
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":"../../../node_modules/lodash/_coreJsData.js"}],"../../../node_modules/lodash/_toSource.js":[function(require,module,exports) {
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],"../../../node_modules/lodash/_baseIsNative.js":[function(require,module,exports) {
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./isFunction":"../../../node_modules/lodash/isFunction.js","./_isMasked":"../../../node_modules/lodash/_isMasked.js","./isObject":"../../../node_modules/lodash/isObject.js","./_toSource":"../../../node_modules/lodash/_toSource.js"}],"../../../node_modules/lodash/_getValue.js":[function(require,module,exports) {
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],"../../../node_modules/lodash/_getNative.js":[function(require,module,exports) {
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":"../../../node_modules/lodash/_baseIsNative.js","./_getValue":"../../../node_modules/lodash/_getValue.js"}],"../../../node_modules/lodash/_Map.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js","./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_nativeCreate.js":[function(require,module,exports) {
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js"}],"../../../node_modules/lodash/_hashClear.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":"../../../node_modules/lodash/_nativeCreate.js"}],"../../../node_modules/lodash/_hashDelete.js":[function(require,module,exports) {
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],"../../../node_modules/lodash/_hashGet.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":"../../../node_modules/lodash/_nativeCreate.js"}],"../../../node_modules/lodash/_hashHas.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":"../../../node_modules/lodash/_nativeCreate.js"}],"../../../node_modules/lodash/_hashSet.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":"../../../node_modules/lodash/_nativeCreate.js"}],"../../../node_modules/lodash/_Hash.js":[function(require,module,exports) {
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":"../../../node_modules/lodash/_hashClear.js","./_hashDelete":"../../../node_modules/lodash/_hashDelete.js","./_hashGet":"../../../node_modules/lodash/_hashGet.js","./_hashHas":"../../../node_modules/lodash/_hashHas.js","./_hashSet":"../../../node_modules/lodash/_hashSet.js"}],"../../../node_modules/lodash/_mapCacheClear.js":[function(require,module,exports) {
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":"../../../node_modules/lodash/_Hash.js","./_ListCache":"../../../node_modules/lodash/_ListCache.js","./_Map":"../../../node_modules/lodash/_Map.js"}],"../../../node_modules/lodash/_isKeyable.js":[function(require,module,exports) {
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],"../../../node_modules/lodash/_getMapData.js":[function(require,module,exports) {
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":"../../../node_modules/lodash/_isKeyable.js"}],"../../../node_modules/lodash/_mapCacheDelete.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":"../../../node_modules/lodash/_getMapData.js"}],"../../../node_modules/lodash/_mapCacheGet.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":"../../../node_modules/lodash/_getMapData.js"}],"../../../node_modules/lodash/_mapCacheHas.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":"../../../node_modules/lodash/_getMapData.js"}],"../../../node_modules/lodash/_mapCacheSet.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":"../../../node_modules/lodash/_getMapData.js"}],"../../../node_modules/lodash/_MapCache.js":[function(require,module,exports) {
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":"../../../node_modules/lodash/_mapCacheClear.js","./_mapCacheDelete":"../../../node_modules/lodash/_mapCacheDelete.js","./_mapCacheGet":"../../../node_modules/lodash/_mapCacheGet.js","./_mapCacheHas":"../../../node_modules/lodash/_mapCacheHas.js","./_mapCacheSet":"../../../node_modules/lodash/_mapCacheSet.js"}],"../../../node_modules/lodash/_stackSet.js":[function(require,module,exports) {
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":"../../../node_modules/lodash/_ListCache.js","./_Map":"../../../node_modules/lodash/_Map.js","./_MapCache":"../../../node_modules/lodash/_MapCache.js"}],"../../../node_modules/lodash/_Stack.js":[function(require,module,exports) {
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":"../../../node_modules/lodash/_ListCache.js","./_stackClear":"../../../node_modules/lodash/_stackClear.js","./_stackDelete":"../../../node_modules/lodash/_stackDelete.js","./_stackGet":"../../../node_modules/lodash/_stackGet.js","./_stackHas":"../../../node_modules/lodash/_stackHas.js","./_stackSet":"../../../node_modules/lodash/_stackSet.js"}],"../../../node_modules/lodash/_defineProperty.js":[function(require,module,exports) {
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js"}],"../../../node_modules/lodash/_baseAssignValue.js":[function(require,module,exports) {
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":"../../../node_modules/lodash/_defineProperty.js"}],"../../../node_modules/lodash/_assignMergeValue.js":[function(require,module,exports) {
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;

},{"./_baseAssignValue":"../../../node_modules/lodash/_baseAssignValue.js","./eq":"../../../node_modules/lodash/eq.js"}],"../../../node_modules/lodash/_createBaseFor.js":[function(require,module,exports) {
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],"../../../node_modules/lodash/_baseFor.js":[function(require,module,exports) {
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":"../../../node_modules/lodash/_createBaseFor.js"}],"../../../node_modules/lodash/_cloneBuffer.js":[function(require,module,exports) {

var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_Uint8Array.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_cloneArrayBuffer.js":[function(require,module,exports) {
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":"../../../node_modules/lodash/_Uint8Array.js"}],"../../../node_modules/lodash/_cloneTypedArray.js":[function(require,module,exports) {
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":"../../../node_modules/lodash/_cloneArrayBuffer.js"}],"../../../node_modules/lodash/_baseCreate.js":[function(require,module,exports) {
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":"../../../node_modules/lodash/isObject.js"}],"../../../node_modules/lodash/_overArg.js":[function(require,module,exports) {
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],"../../../node_modules/lodash/_getPrototype.js":[function(require,module,exports) {
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":"../../../node_modules/lodash/_overArg.js"}],"../../../node_modules/lodash/_isPrototype.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],"../../../node_modules/lodash/_initCloneObject.js":[function(require,module,exports) {
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":"../../../node_modules/lodash/_baseCreate.js","./_getPrototype":"../../../node_modules/lodash/_getPrototype.js","./_isPrototype":"../../../node_modules/lodash/_isPrototype.js"}],"../../../node_modules/lodash/isLength.js":[function(require,module,exports) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],"../../../node_modules/lodash/isArrayLike.js":[function(require,module,exports) {
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":"../../../node_modules/lodash/isFunction.js","./isLength":"../../../node_modules/lodash/isLength.js"}],"../../../node_modules/lodash/isArrayLikeObject.js":[function(require,module,exports) {
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":"../../../node_modules/lodash/isArrayLike.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/stubFalse.js":[function(require,module,exports) {
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],"../../../node_modules/lodash/isBuffer.js":[function(require,module,exports) {

var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":"../../../node_modules/lodash/_root.js","./stubFalse":"../../../node_modules/lodash/stubFalse.js"}],"../../../node_modules/lodash/isPlainObject.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":"../../../node_modules/lodash/_baseGetTag.js","./_getPrototype":"../../../node_modules/lodash/_getPrototype.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/_baseIsTypedArray.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":"../../../node_modules/lodash/_baseGetTag.js","./isLength":"../../../node_modules/lodash/isLength.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/_baseUnary.js":[function(require,module,exports) {
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],"../../../node_modules/lodash/_nodeUtil.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":"../../../node_modules/lodash/_freeGlobal.js"}],"../../../node_modules/lodash/isTypedArray.js":[function(require,module,exports) {
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":"../../../node_modules/lodash/_baseIsTypedArray.js","./_baseUnary":"../../../node_modules/lodash/_baseUnary.js","./_nodeUtil":"../../../node_modules/lodash/_nodeUtil.js"}],"../../../node_modules/lodash/_safeGet.js":[function(require,module,exports) {
/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

module.exports = safeGet;

},{}],"../../../node_modules/lodash/_assignValue.js":[function(require,module,exports) {
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":"../../../node_modules/lodash/_baseAssignValue.js","./eq":"../../../node_modules/lodash/eq.js"}],"../../../node_modules/lodash/_copyObject.js":[function(require,module,exports) {
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":"../../../node_modules/lodash/_assignValue.js","./_baseAssignValue":"../../../node_modules/lodash/_baseAssignValue.js"}],"../../../node_modules/lodash/_baseTimes.js":[function(require,module,exports) {
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],"../../../node_modules/lodash/_isIndex.js":[function(require,module,exports) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],"../../../node_modules/lodash/_arrayLikeKeys.js":[function(require,module,exports) {
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":"../../../node_modules/lodash/_baseTimes.js","./isArguments":"../../../node_modules/lodash/isArguments.js","./isArray":"../../../node_modules/lodash/isArray.js","./isBuffer":"../../../node_modules/lodash/isBuffer.js","./_isIndex":"../../../node_modules/lodash/_isIndex.js","./isTypedArray":"../../../node_modules/lodash/isTypedArray.js"}],"../../../node_modules/lodash/_nativeKeysIn.js":[function(require,module,exports) {
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],"../../../node_modules/lodash/_baseKeysIn.js":[function(require,module,exports) {
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./isObject":"../../../node_modules/lodash/isObject.js","./_isPrototype":"../../../node_modules/lodash/_isPrototype.js","./_nativeKeysIn":"../../../node_modules/lodash/_nativeKeysIn.js"}],"../../../node_modules/lodash/keysIn.js":[function(require,module,exports) {
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":"../../../node_modules/lodash/_arrayLikeKeys.js","./_baseKeysIn":"../../../node_modules/lodash/_baseKeysIn.js","./isArrayLike":"../../../node_modules/lodash/isArrayLike.js"}],"../../../node_modules/lodash/toPlainObject.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;

},{"./_copyObject":"../../../node_modules/lodash/_copyObject.js","./keysIn":"../../../node_modules/lodash/keysIn.js"}],"../../../node_modules/lodash/_baseMergeDeep.js":[function(require,module,exports) {
var assignMergeValue = require('./_assignMergeValue'),
    cloneBuffer = require('./_cloneBuffer'),
    cloneTypedArray = require('./_cloneTypedArray'),
    copyArray = require('./_copyArray'),
    initCloneObject = require('./_initCloneObject'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    safeGet = require('./_safeGet'),
    toPlainObject = require('./toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;

},{"./_assignMergeValue":"../../../node_modules/lodash/_assignMergeValue.js","./_cloneBuffer":"../../../node_modules/lodash/_cloneBuffer.js","./_cloneTypedArray":"../../../node_modules/lodash/_cloneTypedArray.js","./_copyArray":"../../../node_modules/lodash/_copyArray.js","./_initCloneObject":"../../../node_modules/lodash/_initCloneObject.js","./isArguments":"../../../node_modules/lodash/isArguments.js","./isArray":"../../../node_modules/lodash/isArray.js","./isArrayLikeObject":"../../../node_modules/lodash/isArrayLikeObject.js","./isBuffer":"../../../node_modules/lodash/isBuffer.js","./isFunction":"../../../node_modules/lodash/isFunction.js","./isObject":"../../../node_modules/lodash/isObject.js","./isPlainObject":"../../../node_modules/lodash/isPlainObject.js","./isTypedArray":"../../../node_modules/lodash/isTypedArray.js","./_safeGet":"../../../node_modules/lodash/_safeGet.js","./toPlainObject":"../../../node_modules/lodash/toPlainObject.js"}],"../../../node_modules/lodash/_baseMerge.js":[function(require,module,exports) {
var Stack = require('./_Stack'),
    assignMergeValue = require('./_assignMergeValue'),
    baseFor = require('./_baseFor'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isObject = require('./isObject'),
    keysIn = require('./keysIn'),
    safeGet = require('./_safeGet');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;

},{"./_Stack":"../../../node_modules/lodash/_Stack.js","./_assignMergeValue":"../../../node_modules/lodash/_assignMergeValue.js","./_baseFor":"../../../node_modules/lodash/_baseFor.js","./_baseMergeDeep":"../../../node_modules/lodash/_baseMergeDeep.js","./isObject":"../../../node_modules/lodash/isObject.js","./keysIn":"../../../node_modules/lodash/keysIn.js","./_safeGet":"../../../node_modules/lodash/_safeGet.js"}],"../../../node_modules/lodash/identity.js":[function(require,module,exports) {
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],"../../../node_modules/lodash/_apply.js":[function(require,module,exports) {
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],"../../../node_modules/lodash/_overRest.js":[function(require,module,exports) {
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":"../../../node_modules/lodash/_apply.js"}],"../../../node_modules/lodash/constant.js":[function(require,module,exports) {
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],"../../../node_modules/lodash/_baseSetToString.js":[function(require,module,exports) {
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

},{"./constant":"../../../node_modules/lodash/constant.js","./_defineProperty":"../../../node_modules/lodash/_defineProperty.js","./identity":"../../../node_modules/lodash/identity.js"}],"../../../node_modules/lodash/_shortOut.js":[function(require,module,exports) {
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

},{}],"../../../node_modules/lodash/_setToString.js":[function(require,module,exports) {
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

},{"./_baseSetToString":"../../../node_modules/lodash/_baseSetToString.js","./_shortOut":"../../../node_modules/lodash/_shortOut.js"}],"../../../node_modules/lodash/_baseRest.js":[function(require,module,exports) {
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

},{"./identity":"../../../node_modules/lodash/identity.js","./_overRest":"../../../node_modules/lodash/_overRest.js","./_setToString":"../../../node_modules/lodash/_setToString.js"}],"../../../node_modules/lodash/_isIterateeCall.js":[function(require,module,exports) {
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./eq":"../../../node_modules/lodash/eq.js","./isArrayLike":"../../../node_modules/lodash/isArrayLike.js","./_isIndex":"../../../node_modules/lodash/_isIndex.js","./isObject":"../../../node_modules/lodash/isObject.js"}],"../../../node_modules/lodash/_createAssigner.js":[function(require,module,exports) {
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_baseRest":"../../../node_modules/lodash/_baseRest.js","./_isIterateeCall":"../../../node_modules/lodash/_isIterateeCall.js"}],"../../../node_modules/lodash/mergeWith.js":[function(require,module,exports) {
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

module.exports = mergeWith;

},{"./_baseMerge":"../../../node_modules/lodash/_baseMerge.js","./_createAssigner":"../../../node_modules/lodash/_createAssigner.js"}],"../../../node_modules/lodash/_arrayEach.js":[function(require,module,exports) {
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],"../../../node_modules/lodash/_nativeKeys.js":[function(require,module,exports) {
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":"../../../node_modules/lodash/_overArg.js"}],"../../../node_modules/lodash/_baseKeys.js":[function(require,module,exports) {
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":"../../../node_modules/lodash/_isPrototype.js","./_nativeKeys":"../../../node_modules/lodash/_nativeKeys.js"}],"../../../node_modules/lodash/keys.js":[function(require,module,exports) {
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":"../../../node_modules/lodash/_arrayLikeKeys.js","./_baseKeys":"../../../node_modules/lodash/_baseKeys.js","./isArrayLike":"../../../node_modules/lodash/isArrayLike.js"}],"../../../node_modules/lodash/_baseForOwn.js":[function(require,module,exports) {
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":"../../../node_modules/lodash/_baseFor.js","./keys":"../../../node_modules/lodash/keys.js"}],"../../../node_modules/lodash/_createBaseEach.js":[function(require,module,exports) {
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":"../../../node_modules/lodash/isArrayLike.js"}],"../../../node_modules/lodash/_baseEach.js":[function(require,module,exports) {
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":"../../../node_modules/lodash/_baseForOwn.js","./_createBaseEach":"../../../node_modules/lodash/_createBaseEach.js"}],"../../../node_modules/lodash/_castFunction.js":[function(require,module,exports) {
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

},{"./identity":"../../../node_modules/lodash/identity.js"}],"../../../node_modules/lodash/forEach.js":[function(require,module,exports) {
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

},{"./_arrayEach":"../../../node_modules/lodash/_arrayEach.js","./_baseEach":"../../../node_modules/lodash/_baseEach.js","./_castFunction":"../../../node_modules/lodash/_castFunction.js","./isArray":"../../../node_modules/lodash/isArray.js"}],"../../../node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"../../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"../../../node_modules/@babel/runtime/helpers/arrayLikeToArray.js":[function(require,module,exports) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],"../../../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":"../../../node_modules/@babel/runtime/helpers/arrayLikeToArray.js"}],"../../../node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],"../../../node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"../../../node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"../../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./unsupportedIterableToArray":"../../../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js","./nonIterableRest":"../../../node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"../../../node_modules/@babel/runtime/helpers/typeof.js":[function(require,module,exports) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"../../../node_modules/import-html-entry/esm/utils.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalProp = getGlobalProp;
exports.noteGlobalProps = noteGlobalProps;
exports.getInlineCode = getInlineCode;
exports.defaultGetPublicPath = defaultGetPublicPath;
exports.isModuleScriptSupported = isModuleScriptSupported;
exports.requestIdleCallback = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2019-02-25
 * fork from https://github.com/systemjs/systemjs/blob/master/src/extras/global.js
 */
var isIE11 = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1;

function shouldSkipProperty(global, p) {
  if (!global.hasOwnProperty(p) || !isNaN(p) && p < global.length) return true;

  if (isIE11) {
    // https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
    try {
      return global[p] && global[p].parent === window;
    } catch (err) {
      return true;
    }
  } else {
    return false;
  }
} // safari unpredictably lists some new globals first or second in object order


var firstGlobalProp, secondGlobalProp, lastGlobalProp;

function getGlobalProp(global) {
  var cnt = 0;
  var lastProp;
  var hasIframe = false;

  for (var p in global) {
    if (shouldSkipProperty(global, p)) continue; // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断

    for (var i = 0; i < window.frames.length && !hasIframe; i++) {
      var frame = window.frames[i];

      if (frame === global[p]) {
        hasIframe = true;
        break;
      }
    }

    if (!hasIframe && (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp)) return p;
    cnt++;
    lastProp = p;
  }

  if (lastProp !== lastGlobalProp) return lastProp;
}

function noteGlobalProps(global) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined;

  for (var p in global) {
    if (shouldSkipProperty(global, p)) continue;
    if (!firstGlobalProp) firstGlobalProp = p;else if (!secondGlobalProp) secondGlobalProp = p;
    lastGlobalProp = p;
  }

  return lastGlobalProp;
}

function getInlineCode(match) {
  var start = match.indexOf('>') + 1;
  var end = match.lastIndexOf('<');
  return match.substring(start, end);
}

function defaultGetPublicPath(entry) {
  if ((0, _typeof2.default)(entry) === 'object') {
    return '/';
  }

  try {
    // URL 构造函数不支持使用 // 前缀的 url
    var _URL = new URL(entry.startsWith('//') ? "".concat(location.protocol).concat(entry) : entry, location.href),
        origin = _URL.origin,
        pathname = _URL.pathname;

    var paths = pathname.split('/'); // 移除最后一个元素

    paths.pop();
    return "".concat(origin).concat(paths.join('/'), "/");
  } catch (e) {
    console.warn(e);
    return '';
  }
} // Detect whether browser supports `<script type=module>` or not


function isModuleScriptSupported() {
  var s = document.createElement('script');
  return 'noModule' in s;
} // RIC and shim for browsers setTimeout() without it


var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;
},{"@babel/runtime/helpers/typeof":"../../../node_modules/@babel/runtime/helpers/typeof.js"}],"../../../node_modules/import-html-entry/esm/process-tpl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processTpl;
exports.genModuleScriptReplaceSymbol = exports.genIgnoreAssetReplaceSymbol = exports.inlineScriptReplaceSymbol = exports.genScriptReplaceSymbol = exports.genLinkReplaceSymbol = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-09-03 15:04
 */
var ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+((?!type=('|')text\/ng\x2Dtemplate\3)[\s\S])*?>[\s\S]*?<\/\1>/i;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
var SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
var LINK_TAG_REGEX = /<(link)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]*?>/ig;
var LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
var LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var LINK_IGNORE_REGEX = /<link([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]+[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+)ignore([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]*|=[\s\S]*)>/i;
var STYLE_IGNORE_REGEX = /<style([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]+[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+)ignore([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]*|=[\s\S]*)>/i;
var SCRIPT_IGNORE_REGEX = /<script([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]+[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+)ignore([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[\s\S]*|=[\s\S]*)>/i;

function hasProtocol(url) {
  return url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://');
}

function getEntirePath(path, baseURI) {
  return new URL(path, baseURI).toString();
}

function isValidJavaScriptType(type) {
  var handleTypes = ['text/javascript', 'module', 'application/javascript', 'text/ecmascript', 'application/ecmascript'];
  return !type || handleTypes.indexOf(type) !== -1;
}

var genLinkReplaceSymbol = function genLinkReplaceSymbol(linkHref) {
  var preloadOrPrefetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return "<!-- ".concat(preloadOrPrefetch ? 'prefetch/preload' : '', " link ").concat(linkHref, " replaced by import-html-entry -->");
};

exports.genLinkReplaceSymbol = genLinkReplaceSymbol;

var genScriptReplaceSymbol = function genScriptReplaceSymbol(scriptSrc) {
  var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return "<!-- ".concat(async ? 'async' : '', " script ").concat(scriptSrc, " replaced by import-html-entry -->");
};

exports.genScriptReplaceSymbol = genScriptReplaceSymbol;
var inlineScriptReplaceSymbol = "<!-- inline scripts replaced by import-html-entry -->";
exports.inlineScriptReplaceSymbol = inlineScriptReplaceSymbol;

var genIgnoreAssetReplaceSymbol = function genIgnoreAssetReplaceSymbol(url) {
  return "<!-- ignore asset ".concat(url || 'file', " replaced by import-html-entry -->");
};

exports.genIgnoreAssetReplaceSymbol = genIgnoreAssetReplaceSymbol;

var genModuleScriptReplaceSymbol = function genModuleScriptReplaceSymbol(scriptSrc, moduleSupport) {
  return "<!-- ".concat(moduleSupport ? 'nomodule' : 'module', " script ").concat(scriptSrc, " ignored by import-html-entry -->");
};
/**
 * parse the script link from the template
 * 1. collect stylesheets
 * 2. use global eval to evaluate the inline scripts
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_constructor_and_function_declaration
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param baseURI
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */


exports.genModuleScriptReplaceSymbol = genModuleScriptReplaceSymbol;

function processTpl(tpl, baseURI) {
  var scripts = [];
  var styles = [];
  var entry = null;
  var moduleSupport = (0, _utils.isModuleScriptSupported)();
  var template = tpl
  /*
  remove html comment first
  */
  .replace(HTML_COMMENT_REGEX, '').replace(LINK_TAG_REGEX, function (match) {
    /*
    change the css link
    */
    var styleType = !!match.match(STYLE_TYPE_REGEX);

    if (styleType) {
      var styleHref = match.match(STYLE_HREF_REGEX);
      var styleIgnore = match.match(LINK_IGNORE_REGEX);

      if (styleHref) {
        var href = styleHref && styleHref[2];
        var newHref = href;

        if (href && !hasProtocol(href)) {
          newHref = getEntirePath(href, baseURI);
        }

        if (styleIgnore) {
          return genIgnoreAssetReplaceSymbol(newHref);
        }

        styles.push(newHref);
        return genLinkReplaceSymbol(newHref);
      }
    }

    var preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX) && !match.match(LINK_AS_FONT);

    if (preloadOrPrefetchType) {
      var _match$match = match.match(LINK_HREF_REGEX),
          _match$match2 = (0, _slicedToArray2.default)(_match$match, 3),
          linkHref = _match$match2[2];

      return genLinkReplaceSymbol(linkHref, true);
    }

    return match;
  }).replace(STYLE_TAG_REGEX, function (match) {
    if (STYLE_IGNORE_REGEX.test(match)) {
      return genIgnoreAssetReplaceSymbol('style file');
    }

    return match;
  }).replace(ALL_SCRIPT_REGEX, function (match, scriptTag) {
    var scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
    var moduleScriptIgnore = moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX) || !moduleSupport && !!scriptTag.match(SCRIPT_MODULE_REGEX); // in order to keep the exec order of all javascripts

    var matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
    var matchedScriptType = matchedScriptTypeMatch && matchedScriptTypeMatch[2];

    if (!isValidJavaScriptType(matchedScriptType)) {
      return match;
    } // if it is a external script


    if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
      /*
      collect scripts and replace the ref
      */
      var matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);
      var matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
      var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];

      if (entry && matchedScriptEntry) {
        throw new SyntaxError('You should not set multiply entry script!');
      } else {
        // append the domain while the script not have an protocol prefix
        if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
          matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
        }

        entry = entry || matchedScriptEntry && matchedScriptSrc;
      }

      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
      }

      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol(matchedScriptSrc || 'js file', moduleSupport);
      }

      if (matchedScriptSrc) {
        var asyncScript = !!scriptTag.match(SCRIPT_ASYNC_REGEX);
        scripts.push(asyncScript ? {
          async: true,
          src: matchedScriptSrc
        } : matchedScriptSrc);
        return genScriptReplaceSymbol(matchedScriptSrc, asyncScript);
      }

      return match;
    } else {
      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol('js file');
      }

      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol('js file', moduleSupport);
      } // if it is an inline script


      var code = (0, _utils.getInlineCode)(match); // remove script blocks when all of these lines are comments.

      var isPureCommentBlock = code.split(/[\r\n]+/).every(function (line) {
        return !line.trim() || line.trim().startsWith('//');
      });

      if (!isPureCommentBlock) {
        scripts.push(match);
      }

      return inlineScriptReplaceSymbol;
    }
  });
  scripts = scripts.filter(function (script) {
    // filter empty script
    return !!script;
  });
  return {
    template: template,
    scripts: scripts,
    styles: styles,
    // set the last script as entry if have not set
    entry: entry || scripts[scripts.length - 1]
  };
}
},{"@babel/runtime/helpers/slicedToArray":"../../../node_modules/@babel/runtime/helpers/slicedToArray.js","./utils":"../../../node_modules/import-html-entry/esm/utils.js"}],"../../../node_modules/import-html-entry/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExternalStyleSheets = _getExternalStyleSheets;
exports.getExternalScripts = _getExternalScripts;
exports.execScripts = _execScripts;
exports.default = importHTML;
exports.importEntry = importEntry;

var _processTpl2 = _interopRequireWildcard(require("./process-tpl"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-15 11:37
 */
var styleCache = {};
var scriptCache = {};
var embedHTMLCache = {};

if (!window.fetch) {
  throw new Error('[import-html-entry] Here is no "fetch" on the window env, you need to polyfill it');
}

var defaultFetch = window.fetch.bind(window);

function defaultGetTemplate(tpl) {
  return tpl;
}
/**
 * convert external css link to inline style for performance optimization
 * @param template
 * @param styles
 * @param opts
 * @return embedHTML
 */


function getEmbedHTML(template, styles) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _opts$fetch = opts.fetch,
      fetch = _opts$fetch === void 0 ? defaultFetch : _opts$fetch;
  var embedHTML = template;
  return _getExternalStyleSheets(styles, fetch).then(function (styleSheets) {
    embedHTML = styles.reduce(function (html, styleSrc, i) {
      html = html.replace((0, _processTpl2.genLinkReplaceSymbol)(styleSrc), "<style>/* ".concat(styleSrc, " */").concat(styleSheets[i], "</style>"));
      return html;
    }, embedHTML);
    return embedHTML;
  });
}

var isInlineCode = function isInlineCode(code) {
  return code.startsWith('<');
};

function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
  var sourceUrl = isInlineCode(scriptSrc) ? '' : "//# sourceURL=".concat(scriptSrc, "\n"); // 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
  // 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy

  var globalWindow = (0, eval)('window');
  globalWindow.proxy = proxy; // TODO 通过 strictGlobal 方式切换切换 with 闭包，待 with 方式坑趟平后再合并

  return strictGlobal ? ";(function(window, self){with(window){;".concat(scriptText, "\n").concat(sourceUrl, "}}).bind(window.proxy)(window.proxy, window.proxy);") : ";(function(window, self){;".concat(scriptText, "\n").concat(sourceUrl, "}).bind(window.proxy)(window.proxy, window.proxy);");
} // for prefetch


function _getExternalStyleSheets(styles) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
  return Promise.all(styles.map(function (styleLink) {
    if (isInlineCode(styleLink)) {
      // if it is inline style
      return (0, _utils.getInlineCode)(styleLink);
    } else {
      // external styles
      return styleCache[styleLink] || (styleCache[styleLink] = fetch(styleLink).then(function (response) {
        return response.text();
      }));
    }
  }));
} // for prefetch


function _getExternalScripts(scripts) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
  var errorCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var fetchScript = function fetchScript(scriptUrl) {
    return scriptCache[scriptUrl] || (scriptCache[scriptUrl] = fetch(scriptUrl).then(function (response) {
      // usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
      // https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
      if (response.status >= 400) {
        errorCallback();
        throw new Error("".concat(scriptUrl, " load failed with status ").concat(response.status));
      }

      return response.text();
    }));
  };

  return Promise.all(scripts.map(function (script) {
    if (typeof script === 'string') {
      if (isInlineCode(script)) {
        // if it is inline script
        return (0, _utils.getInlineCode)(script);
      } else {
        // external script
        return fetchScript(script);
      }
    } else {
      // use idle time to load async script
      var src = script.src,
          async = script.async;

      if (async) {
        return {
          src: src,
          async: true,
          content: new Promise(function (resolve, reject) {
            return (0, _utils.requestIdleCallback)(function () {
              return fetchScript(src).then(resolve, reject);
            });
          })
        };
      }

      return fetchScript(src);
    }
  }));
}

function throwNonBlockingError(error, msg) {
  setTimeout(function () {
    console.error(msg);
    throw error;
  });
}

var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
/**
 * FIXME to consistent with browser behavior, we should only provide callback way to invoke success and error event
 * @param entry
 * @param scripts
 * @param proxy
 * @param opts
 * @returns {Promise<unknown>}
 */

function _execScripts(entry, scripts) {
  var proxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _opts$fetch2 = opts.fetch,
      fetch = _opts$fetch2 === void 0 ? defaultFetch : _opts$fetch2,
      _opts$strictGlobal = opts.strictGlobal,
      strictGlobal = _opts$strictGlobal === void 0 ? false : _opts$strictGlobal,
      success = opts.success,
      _opts$error = opts.error,
      error = _opts$error === void 0 ? function () {} : _opts$error,
      _opts$beforeExec = opts.beforeExec,
      beforeExec = _opts$beforeExec === void 0 ? function () {} : _opts$beforeExec;
  return _getExternalScripts(scripts, fetch, error).then(function (scriptsText) {
    var geval = function geval(code) {
      beforeExec();
      (0, eval)(code);
    };

    function exec(scriptSrc, inlineScript, resolve) {
      var markName = "Evaluating script ".concat(scriptSrc);
      var measureName = "Evaluating Time Consuming: ".concat(scriptSrc);

      if ("development" === 'development' && supportsUserTiming) {
        performance.mark(markName);
      }

      if (scriptSrc === entry) {
        (0, _utils.noteGlobalProps)(strictGlobal ? proxy : window);

        try {
          // bind window.proxy to change `this` reference in script
          geval(getExecutableScript(scriptSrc, inlineScript, proxy, strictGlobal));
          var exports = proxy[(0, _utils.getGlobalProp)(strictGlobal ? proxy : window)] || {};
          resolve(exports);
        } catch (e) {
          // entry error must be thrown to make the promise settled
          console.error("[import-html-entry]: error occurs while executing entry script ".concat(scriptSrc));
          throw e;
        }
      } else {
        if (typeof inlineScript === 'string') {
          try {
            // bind window.proxy to change `this` reference in script
            geval(getExecutableScript(scriptSrc, inlineScript, proxy, strictGlobal));
          } catch (e) {
            // consistent with browser behavior, any independent script evaluation error should not block the others
            throwNonBlockingError(e, "[import-html-entry]: error occurs while executing normal script ".concat(scriptSrc));
          }
        } else {
          // external script marked with async
          inlineScript.async && (inlineScript === null || inlineScript === void 0 ? void 0 : inlineScript.content.then(function (downloadedScriptText) {
            return geval(getExecutableScript(inlineScript.src, downloadedScriptText, proxy, strictGlobal));
          })["catch"](function (e) {
            throwNonBlockingError(e, "[import-html-entry]: error occurs while executing async script ".concat(inlineScript.src));
          }));
        }
      }

      if ("development" === 'development' && supportsUserTiming) {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
      }
    }

    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        var scriptSrc = scripts[i];
        var inlineScript = scriptsText[i];
        exec(scriptSrc, inlineScript, resolvePromise); // resolve the promise while the last script executed and entry not provided

        if (!entry && i === scripts.length - 1) {
          resolvePromise();
        } else {
          schedule(i + 1, resolvePromise);
        }
      }
    }

    return new Promise(function (resolve) {
      return schedule(0, success || resolve);
    });
  });
}

function importHTML(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fetch = defaultFetch;
  var getPublicPath = _utils.defaultGetPublicPath;
  var getTemplate = defaultGetTemplate; // compatible with the legacy importHTML api

  if (typeof opts === 'function') {
    fetch = opts;
  } else {
    fetch = opts.fetch || defaultFetch;
    getPublicPath = opts.getPublicPath || opts.getDomain || _utils.defaultGetPublicPath;
    getTemplate = opts.getTemplate || defaultGetTemplate;
  }

  return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url).then(function (response) {
    return response.text();
  }).then(function (html) {
    var assetPublicPath = getPublicPath(url);

    var _processTpl = (0, _processTpl2.default)(getTemplate(html), assetPublicPath),
        template = _processTpl.template,
        scripts = _processTpl.scripts,
        entry = _processTpl.entry,
        styles = _processTpl.styles;

    return getEmbedHTML(template, styles, {
      fetch: fetch
    }).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: assetPublicPath,
        getExternalScripts: function getExternalScripts() {
          return _getExternalScripts(scripts, fetch);
        },
        getExternalStyleSheets: function getExternalStyleSheets() {
          return _getExternalStyleSheets(styles, fetch);
        },
        execScripts: function execScripts(proxy, strictGlobal) {
          if (!scripts.length) {
            return Promise.resolve();
          }

          return _execScripts(entry, scripts, proxy, {
            fetch: fetch,
            strictGlobal: strictGlobal
          });
        }
      };
    });
  }));
}

function importEntry(entry) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$fetch3 = opts.fetch,
      fetch = _opts$fetch3 === void 0 ? defaultFetch : _opts$fetch3,
      _opts$getTemplate = opts.getTemplate,
      getTemplate = _opts$getTemplate === void 0 ? defaultGetTemplate : _opts$getTemplate;
  var getPublicPath = opts.getPublicPath || opts.getDomain || _utils.defaultGetPublicPath;

  if (!entry) {
    throw new SyntaxError('entry should not be empty!');
  } // html entry


  if (typeof entry === 'string') {
    return importHTML(entry, {
      fetch: fetch,
      getPublicPath: getPublicPath,
      getTemplate: getTemplate
    });
  } // config entry


  if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
    var _entry$scripts = entry.scripts,
        scripts = _entry$scripts === void 0 ? [] : _entry$scripts,
        _entry$styles = entry.styles,
        styles = _entry$styles === void 0 ? [] : _entry$styles,
        _entry$html = entry.html,
        html = _entry$html === void 0 ? '' : _entry$html;

    var setStylePlaceholder2HTML = function setStylePlaceholder2HTML(tpl) {
      return styles.reduceRight(function (html, styleSrc) {
        return "".concat((0, _processTpl2.genLinkReplaceSymbol)(styleSrc)).concat(html);
      }, tpl);
    };

    var setScriptPlaceholder2HTML = function setScriptPlaceholder2HTML(tpl) {
      return scripts.reduce(function (html, scriptSrc) {
        return "".concat(html).concat((0, _processTpl2.genScriptReplaceSymbol)(scriptSrc));
      }, tpl);
    };

    return getEmbedHTML(getTemplate(setScriptPlaceholder2HTML(setStylePlaceholder2HTML(html))), styles, {
      fetch: fetch
    }).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: getPublicPath(entry),
        getExternalScripts: function getExternalScripts() {
          return _getExternalScripts(scripts, fetch);
        },
        getExternalStyleSheets: function getExternalStyleSheets() {
          return _getExternalStyleSheets(styles, fetch);
        },
        execScripts: function execScripts(proxy, strictGlobal) {
          if (!scripts.length) {
            return Promise.resolve();
          }

          return _execScripts(scripts[scripts.length - 1], scripts, proxy, {
            fetch: fetch,
            strictGlobal: strictGlobal
          });
        }
      };
    });
  } else {
    throw new SyntaxError('entry scripts or styles should be array!');
  }
}
},{"./process-tpl":"../../../node_modules/import-html-entry/esm/process-tpl.js","./utils":"../../../node_modules/import-html-entry/esm/utils.js"}],"../../../node_modules/qiankun/es/addons/runtimePublicPath.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAddOn;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _tslib = require("tslib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;

function getAddOn(global) {
  var publicPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var hasMountedOnce = false;
  return {
    beforeLoad: function beforeLoad() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // eslint-disable-next-line no-param-reassign
                global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    },
    beforeMount: function beforeMount() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (hasMountedOnce) {
                  // eslint-disable-next-line no-param-reassign
                  global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
                }

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    },
    beforeUnmount: function beforeUnmount() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (rawPublicPath === undefined) {
                  // eslint-disable-next-line no-param-reassign
                  delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
                } else {
                  // eslint-disable-next-line no-param-reassign
                  global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
                }

                hasMountedOnce = true;

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
    }
  };
}
},{"@babel/runtime/regenerator":"../../../node_modules/@babel/runtime/regenerator/index.js","tslib":"../../../node_modules/tslib/tslib.es6.js"}],"../../../node_modules/qiankun/es/addons/engineFlag.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAddOn;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _tslib = require("tslib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @since 2020-05-15
 */
function getAddOn(global) {
  return {
    beforeLoad: function beforeLoad() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // eslint-disable-next-line no-param-reassign
                global.__POWERED_BY_QIANKUN__ = true;

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    },
    beforeMount: function beforeMount() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // eslint-disable-next-line no-param-reassign
                global.__POWERED_BY_QIANKUN__ = true;

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    },
    beforeUnmount: function beforeUnmount() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // eslint-disable-next-line no-param-reassign
                delete global.__POWERED_BY_QIANKUN__;

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
    }
  };
}
},{"@babel/runtime/regenerator":"../../../node_modules/@babel/runtime/regenerator/index.js","tslib":"../../../node_modules/tslib/tslib.es6.js"}],"../../../node_modules/qiankun/es/addons/index.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAddOns;

var _concat2 = _interopRequireDefault(require("lodash/concat"));

var _mergeWith2 = _interopRequireDefault(require("lodash/mergeWith"));

var _runtimePublicPath = _interopRequireDefault(require("./runtimePublicPath"));

var _engineFlag = _interopRequireDefault(require("./engineFlag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAddOns(global, publicPath) {
  return (0, _mergeWith2.default)({}, (0, _engineFlag.default)(global), (0, _runtimePublicPath.default)(global, publicPath), function (v1, v2) {
    return (0, _concat2.default)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
  });
}
},{"lodash/concat":"../../../node_modules/lodash/concat.js","lodash/mergeWith":"../../../node_modules/lodash/mergeWith.js","./runtimePublicPath":"../../../node_modules/qiankun/es/addons/runtimePublicPath.js","./engineFlag":"../../../node_modules/qiankun/es/addons/engineFlag.js"}],"../../../node_modules/@babel/runtime/helpers/esm/defineProperty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _defineProperty;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
},{}],"../../../node_modules/lodash/_baseAssign.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":"../../../node_modules/lodash/_copyObject.js","./keys":"../../../node_modules/lodash/keys.js"}],"../../../node_modules/lodash/_baseAssignIn.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":"../../../node_modules/lodash/_copyObject.js","./keysIn":"../../../node_modules/lodash/keysIn.js"}],"../../../node_modules/lodash/_arrayFilter.js":[function(require,module,exports) {
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],"../../../node_modules/lodash/stubArray.js":[function(require,module,exports) {
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],"../../../node_modules/lodash/_getSymbols.js":[function(require,module,exports) {
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":"../../../node_modules/lodash/_arrayFilter.js","./stubArray":"../../../node_modules/lodash/stubArray.js"}],"../../../node_modules/lodash/_copySymbols.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":"../../../node_modules/lodash/_copyObject.js","./_getSymbols":"../../../node_modules/lodash/_getSymbols.js"}],"../../../node_modules/lodash/_getSymbolsIn.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":"../../../node_modules/lodash/_arrayPush.js","./_getPrototype":"../../../node_modules/lodash/_getPrototype.js","./_getSymbols":"../../../node_modules/lodash/_getSymbols.js","./stubArray":"../../../node_modules/lodash/stubArray.js"}],"../../../node_modules/lodash/_copySymbolsIn.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":"../../../node_modules/lodash/_copyObject.js","./_getSymbolsIn":"../../../node_modules/lodash/_getSymbolsIn.js"}],"../../../node_modules/lodash/_baseGetAllKeys.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":"../../../node_modules/lodash/_arrayPush.js","./isArray":"../../../node_modules/lodash/isArray.js"}],"../../../node_modules/lodash/_getAllKeys.js":[function(require,module,exports) {
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":"../../../node_modules/lodash/_baseGetAllKeys.js","./_getSymbols":"../../../node_modules/lodash/_getSymbols.js","./keys":"../../../node_modules/lodash/keys.js"}],"../../../node_modules/lodash/_getAllKeysIn.js":[function(require,module,exports) {
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":"../../../node_modules/lodash/_baseGetAllKeys.js","./_getSymbolsIn":"../../../node_modules/lodash/_getSymbolsIn.js","./keysIn":"../../../node_modules/lodash/keysIn.js"}],"../../../node_modules/lodash/_DataView.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js","./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_Promise.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js","./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_Set.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js","./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_WeakMap.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":"../../../node_modules/lodash/_getNative.js","./_root":"../../../node_modules/lodash/_root.js"}],"../../../node_modules/lodash/_getTag.js":[function(require,module,exports) {
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":"../../../node_modules/lodash/_DataView.js","./_Map":"../../../node_modules/lodash/_Map.js","./_Promise":"../../../node_modules/lodash/_Promise.js","./_Set":"../../../node_modules/lodash/_Set.js","./_WeakMap":"../../../node_modules/lodash/_WeakMap.js","./_baseGetTag":"../../../node_modules/lodash/_baseGetTag.js","./_toSource":"../../../node_modules/lodash/_toSource.js"}],"../../../node_modules/lodash/_initCloneArray.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],"../../../node_modules/lodash/_cloneDataView.js":[function(require,module,exports) {
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":"../../../node_modules/lodash/_cloneArrayBuffer.js"}],"../../../node_modules/lodash/_cloneRegExp.js":[function(require,module,exports) {
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],"../../../node_modules/lodash/_cloneSymbol.js":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":"../../../node_modules/lodash/_Symbol.js"}],"../../../node_modules/lodash/_initCloneByTag.js":[function(require,module,exports) {
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":"../../../node_modules/lodash/_cloneArrayBuffer.js","./_cloneDataView":"../../../node_modules/lodash/_cloneDataView.js","./_cloneRegExp":"../../../node_modules/lodash/_cloneRegExp.js","./_cloneSymbol":"../../../node_modules/lodash/_cloneSymbol.js","./_cloneTypedArray":"../../../node_modules/lodash/_cloneTypedArray.js"}],"../../../node_modules/lodash/_baseIsMap.js":[function(require,module,exports) {
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;

},{"./_getTag":"../../../node_modules/lodash/_getTag.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/isMap.js":[function(require,module,exports) {
var baseIsMap = require('./_baseIsMap'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;

},{"./_baseIsMap":"../../../node_modules/lodash/_baseIsMap.js","./_baseUnary":"../../../node_modules/lodash/_baseUnary.js","./_nodeUtil":"../../../node_modules/lodash/_nodeUtil.js"}],"../../../node_modules/lodash/_baseIsSet.js":[function(require,module,exports) {
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;

},{"./_getTag":"../../../node_modules/lodash/_getTag.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/isSet.js":[function(require,module,exports) {
var baseIsSet = require('./_baseIsSet'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;

},{"./_baseIsSet":"../../../node_modules/lodash/_baseIsSet.js","./_baseUnary":"../../../node_modules/lodash/_baseUnary.js","./_nodeUtil":"../../../node_modules/lodash/_nodeUtil.js"}],"../../../node_modules/lodash/_baseClone.js":[function(require,module,exports) {
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isMap = require('./isMap'),
    isObject = require('./isObject'),
    isSet = require('./isSet'),
    keys = require('./keys'),
    keysIn = require('./keysIn');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":"../../../node_modules/lodash/_Stack.js","./_arrayEach":"../../../node_modules/lodash/_arrayEach.js","./_assignValue":"../../../node_modules/lodash/_assignValue.js","./_baseAssign":"../../../node_modules/lodash/_baseAssign.js","./_baseAssignIn":"../../../node_modules/lodash/_baseAssignIn.js","./_cloneBuffer":"../../../node_modules/lodash/_cloneBuffer.js","./_copyArray":"../../../node_modules/lodash/_copyArray.js","./_copySymbols":"../../../node_modules/lodash/_copySymbols.js","./_copySymbolsIn":"../../../node_modules/lodash/_copySymbolsIn.js","./_getAllKeys":"../../../node_modules/lodash/_getAllKeys.js","./_getAllKeysIn":"../../../node_modules/lodash/_getAllKeysIn.js","./_getTag":"../../../node_modules/lodash/_getTag.js","./_initCloneArray":"../../../node_modules/lodash/_initCloneArray.js","./_initCloneByTag":"../../../node_modules/lodash/_initCloneByTag.js","./_initCloneObject":"../../../node_modules/lodash/_initCloneObject.js","./isArray":"../../../node_modules/lodash/isArray.js","./isBuffer":"../../../node_modules/lodash/isBuffer.js","./isMap":"../../../node_modules/lodash/isMap.js","./isObject":"../../../node_modules/lodash/isObject.js","./isSet":"../../../node_modules/lodash/isSet.js","./keys":"../../../node_modules/lodash/keys.js","./keysIn":"../../../node_modules/lodash/keysIn.js"}],"../../../node_modules/lodash/cloneDeep.js":[function(require,module,exports) {
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;

},{"./_baseClone":"../../../node_modules/lodash/_baseClone.js"}],"../../../node_modules/qiankun/es/globalState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGlobalState = initGlobalState;
exports.getMicroAppStateActions = getMicroAppStateActions;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/defineProperty"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalState = {};
var deps = {}; // 触发全局监听

function emitGlobal(state, prevState) {
  Object.keys(deps).forEach(function (id) {
    if (deps[id] instanceof Function) {
      deps[id]((0, _cloneDeep2.default)(state), (0, _cloneDeep2.default)(prevState));
    }
  });
}

function initGlobalState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (state === globalState) {
    console.warn('[qiankun] state has not changed！');
  } else {
    var prevGlobalState = (0, _cloneDeep2.default)(globalState);
    globalState = (0, _cloneDeep2.default)(state);
    emitGlobal(globalState, prevGlobalState);
  }

  return getMicroAppStateActions("global-".concat(+new Date()), true);
}

function getMicroAppStateActions(id, isMaster) {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange: function onGlobalStateChange(callback, fireImmediately) {
      if (!(callback instanceof Function)) {
        console.error('[qiankun] callback must be function!');
        return;
      }

      if (deps[id]) {
        console.warn("[qiankun] '".concat(id, "' global listener already exists before this, new listener will overwrite it."));
      }

      deps[id] = callback;
      var cloneState = (0, _cloneDeep2.default)(globalState);

      if (fireImmediately) {
        callback(cloneState, cloneState);
      }
    },

    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState: function setGlobalState() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (state === globalState) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }

      var changeKeys = [];
      var prevGlobalState = (0, _cloneDeep2.default)(globalState);
      globalState = (0, _cloneDeep2.default)(Object.keys(state).reduce(function (_globalState, changeKey) {
        if (isMaster || _globalState.hasOwnProperty(changeKey)) {
          changeKeys.push(changeKey);
          return Object.assign(_globalState, (0, _defineProperty2.default)({}, changeKey, state[changeKey]));
        }

        console.warn("[qiankun] '".concat(changeKey, "' not declared when init state\uFF01"));
        return _globalState;
      }, globalState));

      if (changeKeys.length === 0) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }

      emitGlobal(globalState, prevGlobalState);
      return true;
    },
    // 注销该应用下的依赖
    offGlobalStateChange: function offGlobalStateChange() {
      delete deps[id];
      return true;
    }
  };
}
},{"@babel/runtime/helpers/esm/defineProperty":"../../../node_modules/@babel/runtime/helpers/esm/defineProperty.js","lodash/cloneDeep":"../../../node_modules/lodash/cloneDeep.js"}],"../../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _classCallCheck;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
},{}],"../../../node_modules/@babel/runtime/helpers/esm/createClass.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _createClass;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
},{}],"../../../node_modules/qiankun/es/interfaces.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SandBoxType = void 0;
var SandBoxType;
exports.SandBoxType = SandBoxType;

(function (SandBoxType) {
  SandBoxType["Proxy"] = "Proxy";
  SandBoxType["Snapshot"] = "Snapshot"; // for legacy sandbox
  // https://github.com/umijs/qiankun/blob/0d1d3f0c5ed1642f01854f96c3fabf0a2148bd26/src/sandbox/legacy/sandbox.ts#L22...L25

  SandBoxType["LegacyProxy"] = "LegacyProxy";
})(SandBoxType || (exports.SandBoxType = SandBoxType = {}));
},{}],"../../../node_modules/lodash/_arrayReduce.js":[function(require,module,exports) {
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],"../../../node_modules/lodash/_basePropertyOf.js":[function(require,module,exports) {
/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

module.exports = basePropertyOf;

},{}],"../../../node_modules/lodash/_deburrLetter.js":[function(require,module,exports) {
var basePropertyOf = require('./_basePropertyOf');

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

module.exports = deburrLetter;

},{"./_basePropertyOf":"../../../node_modules/lodash/_basePropertyOf.js"}],"../../../node_modules/lodash/_arrayMap.js":[function(require,module,exports) {
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],"../../../node_modules/lodash/isSymbol.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":"../../../node_modules/lodash/_baseGetTag.js","./isObjectLike":"../../../node_modules/lodash/isObjectLike.js"}],"../../../node_modules/lodash/_baseToString.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":"../../../node_modules/lodash/_Symbol.js","./_arrayMap":"../../../node_modules/lodash/_arrayMap.js","./isArray":"../../../node_modules/lodash/isArray.js","./isSymbol":"../../../node_modules/lodash/isSymbol.js"}],"../../../node_modules/lodash/toString.js":[function(require,module,exports) {
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":"../../../node_modules/lodash/_baseToString.js"}],"../../../node_modules/lodash/deburr.js":[function(require,module,exports) {
var deburrLetter = require('./_deburrLetter'),
    toString = require('./toString');

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;

},{"./_deburrLetter":"../../../node_modules/lodash/_deburrLetter.js","./toString":"../../../node_modules/lodash/toString.js"}],"../../../node_modules/lodash/_asciiWords.js":[function(require,module,exports) {
/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

module.exports = asciiWords;

},{}],"../../../node_modules/lodash/_hasUnicodeWord.js":[function(require,module,exports) {
/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

module.exports = hasUnicodeWord;

},{}],"../../../node_modules/lodash/_unicodeWords.js":[function(require,module,exports) {
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

module.exports = unicodeWords;

},{}],"../../../node_modules/lodash/words.js":[function(require,module,exports) {
var asciiWords = require('./_asciiWords'),
    hasUnicodeWord = require('./_hasUnicodeWord'),
    toString = require('./toString'),
    unicodeWords = require('./_unicodeWords');

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = words;

},{"./_asciiWords":"../../../node_modules/lodash/_asciiWords.js","./_hasUnicodeWord":"../../../node_modules/lodash/_hasUnicodeWord.js","./toString":"../../../node_modules/lodash/toString.js","./_unicodeWords":"../../../node_modules/lodash/_unicodeWords.js"}],"../../../node_modules/lodash/_createCompounder.js":[function(require,module,exports) {
var arrayReduce = require('./_arrayReduce'),
    deburr = require('./deburr'),
    words = require('./words');

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

module.exports = createCompounder;

},{"./_arrayReduce":"../../../node_modules/lodash/_arrayReduce.js","./deburr":"../../../node_modules/lodash/deburr.js","./words":"../../../node_modules/lodash/words.js"}],"../../../node_modules/lodash/snakeCase.js":[function(require,module,exports) {
var createCompounder = require('./_createCompounder');

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = createCompounder(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

module.exports = snakeCase;

},{"./_createCompounder":"../../../node_modules/lodash/_createCompounder.js"}],"../../../node_modules/qiankun/es/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.sleep = sleep;
exports.nextTick = nextTick;
exports.isConstructable = isConstructable;
exports.isBoundedFunction = isBoundedFunction;
exports.getDefaultTplWrapper = getDefaultTplWrapper;
exports.getWrapperId = getWrapperId;
exports.validateExportLifecycle = validateExportLifecycle;
exports.performanceMark = performanceMark;
exports.performanceMeasure = performanceMeasure;
exports.isEnableScopedCSS = isEnableScopedCSS;
exports.getXPathForElement = getXPathForElement;
exports.getContainer = getContainer;
exports.Deferred = exports.isCallable = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _snakeCase2 = _interopRequireDefault(require("lodash/snakeCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
/**
 * run a callback after next tick
 * @param cb
 */


function nextTick(cb) {
  Promise.resolve().then(cb);
}

var constructableMap = new WeakMap();

function isConstructable(fn) {
  if (constructableMap.has(fn)) {
    return constructableMap.get(fn);
  }

  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  var constructable = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1 || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
  constructableMap.set(fn, constructable);
  return constructable;
}
/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */


var naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
var isCallable = naughtySafari ? function (fn) {
  return typeof fn === 'function' && typeof fn !== 'undefined';
} : function (fn) {
  return typeof fn === 'function';
};
exports.isCallable = isCallable;
var boundedMap = new WeakMap();

function isBoundedFunction(fn) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */


  var bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}

function getDefaultTplWrapper(id, name) {
  return function (tpl) {
    return "<div id=\"".concat(getWrapperId(id), "\" data-name=\"").concat(name, "\">").concat(tpl, "</div>");
  };
}

function getWrapperId(id) {
  return "__qiankun_microapp_wrapper_for_".concat((0, _snakeCase2.default)(id), "__");
}
/** 校验子应用导出的 生命周期 对象是否正确 */


function validateExportLifecycle(exports) {
  var _ref = exports !== null && exports !== void 0 ? exports : {},
      bootstrap = _ref.bootstrap,
      mount = _ref.mount,
      unmount = _ref.unmount;

  return (0, _isFunction2.default)(bootstrap) && (0, _isFunction2.default)(mount) && (0, _isFunction2.default)(unmount);
}

var Deferred = function Deferred() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Deferred);
  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
};

exports.Deferred = Deferred;
var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

function performanceMark(markName) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}

function performanceMeasure(measureName, markName) {
  if (supportsUserTiming && performance.getEntriesByName(markName, 'mark').length) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}

function isEnableScopedCSS(sandbox) {
  if ((0, _typeof2.default)(sandbox) !== 'object') {
    return false;
  }

  if (sandbox.strictStyleIsolation) {
    return false;
  }

  return !!sandbox.experimentalStyleIsolation;
}
/**
 * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
 * @param el
 * @param document
 */


function getXPathForElement(el, document) {
  // not support that if el not existed in document yet(such as it not append to document before it mounted)
  if (!document.contains(el)) {
    return undefined;
  }

  var xpath = '';
  var pos;
  var tmpEle;
  var element = el;

  while (element !== document.documentElement) {
    pos = 0;
    tmpEle = element;

    while (tmpEle) {
      if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
        // If it is ELEMENT_NODE of the same name
        pos += 1;
      }

      tmpEle = tmpEle.previousSibling;
    }

    xpath = "*[name()='".concat(element.nodeName, "' and namespace-uri()='").concat(element.namespaceURI === null ? '' : element.namespaceURI, "'][").concat(pos, "]/").concat(xpath);
    element = element.parentNode;
  }

  xpath = "/*[name()='".concat(document.documentElement.nodeName, "' and namespace-uri()='").concat(element.namespaceURI === null ? '' : element.namespaceURI, "']/").concat(xpath);
  xpath = xpath.replace(/\/$/, '');
  return xpath;
}

function getContainer(container) {
  return typeof container === 'string' ? document.querySelector(container) : container;
}
},{"@babel/runtime/helpers/esm/typeof":"../../../node_modules/@babel/runtime/helpers/esm/typeof.js","@babel/runtime/helpers/esm/classCallCheck":"../../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js","lodash/isFunction":"../../../node_modules/lodash/isFunction.js","lodash/snakeCase":"../../../node_modules/lodash/snakeCase.js"}],"../../../node_modules/qiankun/es/sandbox/common.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTargetValue = getTargetValue;
exports.getProxyPropertyValue = getProxyPropertyValue;
exports.documentAttachProxyMap = void 0;

var _utils = require("../utils");

/**
 * @author Kuitos
 * @since 2020-04-13
 */
var documentAttachProxyMap = new WeakMap();
exports.documentAttachProxyMap = documentAttachProxyMap;
var functionBoundedValueMap = new WeakMap();

function getTargetValue(target, value) {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if ((0, _utils.isCallable)(value) && !(0, _utils.isBoundedFunction)(value) && !(0, _utils.isConstructable)(value)) {
    var cachedBoundValue = functionBoundedValueMap.get(value);

    if (cachedBoundValue) {
      return cachedBoundValue;
    }

    var boundValue = value.bind(target); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
    // use for..in rather than Object.keys.forEach for performance reason
    // eslint-disable-next-line guard-for-in,no-restricted-syntax

    for (var key in value) {
      boundValue[key] = value[key];
    } // copy prototype, for performance reason, we use in operator to check rather than hasOwnProperty


    if ('prototype' in value) boundValue.prototype = value.prototype;
    functionBoundedValueMap.set(value, boundValue);
    return boundValue;
  }

  return value;
}

var getterInvocationResultMap = new WeakMap();

function getProxyPropertyValue(getter) {
  var getterResult = getterInvocationResultMap.get(getter);

  if (!getterResult) {
    var result = getter();
    getterInvocationResultMap.set(getter, result);
    return result;
  }

  return getterResult;
}
},{"../utils":"../../../node_modules/qiankun/es/utils.js"}],"../../../node_modules/qiankun/es/sandbox/legacy/sandbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/typeof"));

var _interfaces = require("../../interfaces");

var _common = require("../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @since 2019-04-11
 */
function isPropConfigurable(target, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

function setWindowProp(prop, value, toDelete) {
  if (value === undefined && toDelete) {
    delete window[prop];
  } else if (isPropConfigurable(window, prop) && (0, _typeof2.default)(prop) !== 'symbol') {
    Object.defineProperty(window, prop, {
      writable: true,
      configurable: true
    });
    window[prop] = value;
  }
}
/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */


var SingularProxySandbox = /*#__PURE__*/function () {
  function SingularProxySandbox(name) {
    (0, _classCallCheck2.default)(this, SingularProxySandbox);
    /** 沙箱期间新增的全局变量 */

    this.addedPropsMapInSandbox = new Map();
    /** 沙箱期间更新的全局变量 */

    this.modifiedPropsOriginalValueMapInSandbox = new Map();
    /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */

    this.currentUpdatedPropsValueMap = new Map();
    this.sandboxRunning = true;
    this.name = name;
    this.type = _interfaces.SandBoxType.LegacyProxy;
    var addedPropsMapInSandbox = this.addedPropsMapInSandbox,
        modifiedPropsOriginalValueMapInSandbox = this.modifiedPropsOriginalValueMapInSandbox,
        currentUpdatedPropsValueMap = this.currentUpdatedPropsValueMap;
    var self = this;
    var rawWindow = window;
    var fakeWindow = Object.create(null);
    var proxy = new Proxy(fakeWindow, {
      set: function set(_, p, value) {
        if (self.sandboxRunning) {
          if (!rawWindow.hasOwnProperty(p)) {
            addedPropsMapInSandbox.set(p, value);
          } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
            // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
            var originalValue = rawWindow[p];
            modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          }

          currentUpdatedPropsValueMap.set(p, value); // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          // eslint-disable-next-line no-param-reassign

          rawWindow[p] = value;
          return true;
        }

        if ("development" === 'development') {
          console.warn("[qiankun] Set window.".concat(p.toString(), " while sandbox destroyed or inactive in ").concat(name, "!"));
        } // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function get(_, p) {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          return proxy;
        }

        var value = rawWindow[p];
        return (0, _common.getTargetValue)(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(_, p) {
        return p in rawWindow;
      }
    });
    this.proxy = proxy;
  }

  (0, _createClass2.default)(SingularProxySandbox, [{
    key: "active",
    value: function active() {
      if (!this.sandboxRunning) {
        this.currentUpdatedPropsValueMap.forEach(function (v, p) {
          return setWindowProp(p, v);
        });
      }

      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      if ("development" === 'development') {
        console.info("[qiankun:sandbox] ".concat(this.name, " modified global properties restore..."), [].concat((0, _toConsumableArray2.default)(this.addedPropsMapInSandbox.keys()), (0, _toConsumableArray2.default)(this.modifiedPropsOriginalValueMapInSandbox.keys())));
      } // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
      // restore global props to initial snapshot


      this.modifiedPropsOriginalValueMapInSandbox.forEach(function (v, p) {
        return setWindowProp(p, v);
      });
      this.addedPropsMapInSandbox.forEach(function (_, p) {
        return setWindowProp(p, undefined, true);
      });
      this.sandboxRunning = false;
    }
  }]);
  return SingularProxySandbox;
}();

exports.default = SingularProxySandbox;
},{"@babel/runtime/helpers/esm/toConsumableArray":"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js","@babel/runtime/helpers/esm/classCallCheck":"../../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js","@babel/runtime/helpers/esm/createClass":"../../../node_modules/@babel/runtime/helpers/esm/createClass.js","@babel/runtime/helpers/esm/typeof":"../../../node_modules/@babel/runtime/helpers/esm/typeof.js","../../interfaces":"../../../node_modules/qiankun/es/interfaces.js","../common":"../../../node_modules/qiankun/es/sandbox/common.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/css.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = exports.QiankunCSSRewriteAttr = exports.ScopedCSS = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Saviio
 * @since 2020-4-19
 */
// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
var RuleType;

(function (RuleType) {
  // type: rule will be rewrote
  RuleType[RuleType["STYLE"] = 1] = "STYLE";
  RuleType[RuleType["MEDIA"] = 4] = "MEDIA";
  RuleType[RuleType["SUPPORTS"] = 12] = "SUPPORTS"; // type: value will be kept

  RuleType[RuleType["IMPORT"] = 3] = "IMPORT";
  RuleType[RuleType["FONT_FACE"] = 5] = "FONT_FACE";
  RuleType[RuleType["PAGE"] = 6] = "PAGE";
  RuleType[RuleType["KEYFRAMES"] = 7] = "KEYFRAMES";
  RuleType[RuleType["KEYFRAME"] = 8] = "KEYFRAME";
})(RuleType || (RuleType = {}));

var arrayify = function arrayify(list) {
  return [].slice.call(list, 0);
};

var ScopedCSS = /*#__PURE__*/function () {
  function ScopedCSS() {
    (0, _classCallCheck2.default)(this, ScopedCSS);
    var styleNode = document.createElement('style');
    document.body.appendChild(styleNode);
    this.swapNode = styleNode;
    this.sheet = styleNode.sheet;
    this.sheet.disabled = true;
  }

  (0, _createClass2.default)(ScopedCSS, [{
    key: "process",
    value: function process(styleNode) {
      var _this = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var _a;

      if (styleNode.textContent !== '') {
        var textNode = document.createTextNode(styleNode.textContent || '');
        this.swapNode.appendChild(textNode);
        var sheet = this.swapNode.sheet; // type is missing

        var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);
        var css = this.rewrite(rules, prefix); // eslint-disable-next-line no-param-reassign

        styleNode.textContent = css; // cleanup

        this.swapNode.removeChild(textNode);
        return;
      }

      var mutator = new MutationObserver(function (mutations) {
        var _a;

        for (var i = 0; i < mutations.length; i += 1) {
          var mutation = mutations[i];

          if (ScopedCSS.ModifiedTag in styleNode) {
            return;
          }

          if (mutation.type === 'childList') {
            var _sheet = styleNode.sheet;

            var _rules = arrayify((_a = _sheet === null || _sheet === void 0 ? void 0 : _sheet.cssRules) !== null && _a !== void 0 ? _a : []);

            var _css = _this.rewrite(_rules, prefix); // eslint-disable-next-line no-param-reassign


            styleNode.textContent = _css; // eslint-disable-next-line no-param-reassign

            styleNode[ScopedCSS.ModifiedTag] = true;
          }
        }
      }); // since observer will be deleted when node be removed
      // we dont need create a cleanup function manually
      // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect

      mutator.observe(styleNode, {
        childList: true
      });
    }
  }, {
    key: "rewrite",
    value: function rewrite(rules) {
      var _this2 = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var css = '';
      rules.forEach(function (rule) {
        switch (rule.type) {
          case RuleType.STYLE:
            css += _this2.ruleStyle(rule, prefix);
            break;

          case RuleType.MEDIA:
            css += _this2.ruleMedia(rule, prefix);
            break;

          case RuleType.SUPPORTS:
            css += _this2.ruleSupport(rule, prefix);
            break;

          default:
            css += "".concat(rule.cssText);
            break;
        }
      });
      return css;
    } // handle case:
    // .app-main {}
    // html, body {}
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "ruleStyle",
    value: function ruleStyle(rule, prefix) {
      var rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
      var rootCombinationRE = /(html[^\w{[]+)/gm;
      var selector = rule.selectorText.trim();
      var cssText = rule.cssText; // handle html { ... }
      // handle body { ... }
      // handle :root { ... }

      if (selector === 'html' || selector === 'body' || selector === ':root') {
        return cssText.replace(rootSelectorRE, prefix);
      } // handle html body { ... }
      // handle html > body { ... }


      if (rootCombinationRE.test(rule.selectorText)) {
        var siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm; // since html + body is a non-standard rule for html
        // transformer will ignore it

        if (!siblingSelectorRE.test(rule.selectorText)) {
          cssText = cssText.replace(rootCombinationRE, '');
        }
      } // handle grouping selector, a,span,p,div { ... }


      cssText = cssText.replace(/^[\s\S]+{/, function (selectors) {
        return selectors.replace(/(^|,\n?)([^,]+)/g, function (item, p, s) {
          // handle div,body,span { ... }
          if (rootSelectorRE.test(item)) {
            return item.replace(rootSelectorRE, function (m) {
              // do not discard valid previous character, such as body,html or *:not(:root)
              var whitePrevChars = [',', '('];

              if (m && whitePrevChars.includes(m[0])) {
                return "".concat(m[0]).concat(prefix);
              } // replace root selector with prefix


              return prefix;
            });
          }

          return "".concat(p).concat(prefix, " ").concat(s.replace(/^ */, ''));
        });
      });
      return cssText;
    } // handle case:
    // @media screen and (max-width: 300px) {}

  }, {
    key: "ruleMedia",
    value: function ruleMedia(rule, prefix) {
      var css = this.rewrite(arrayify(rule.cssRules), prefix);
      return "@media ".concat(rule.conditionText, " {").concat(css, "}");
    } // handle case:
    // @supports (display: grid) {}

  }, {
    key: "ruleSupport",
    value: function ruleSupport(rule, prefix) {
      var css = this.rewrite(arrayify(rule.cssRules), prefix);
      return "@supports ".concat(rule.conditionText, " {").concat(css, "}");
    }
  }]);
  return ScopedCSS;
}();

exports.ScopedCSS = ScopedCSS;
ScopedCSS.ModifiedTag = 'Symbol(style-modified-qiankun)';
var processor;
var QiankunCSSRewriteAttr = 'data-qiankun';
exports.QiankunCSSRewriteAttr = QiankunCSSRewriteAttr;

var process = function process(appWrapper, stylesheetElement, appName) {
  // lazy singleton pattern
  if (!processor) {
    processor = new ScopedCSS();
  }

  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  var mountDOM = appWrapper;

  if (!mountDOM) {
    return;
  }

  var tag = (mountDOM.tagName || '').toLowerCase();

  if (tag && stylesheetElement.tagName === 'STYLE') {
    var prefix = "".concat(tag, "[").concat(QiankunCSSRewriteAttr, "=\"").concat(appName, "\"]");
    processor.process(stylesheetElement, prefix);
  }
};

exports.process = process;
},{"@babel/runtime/helpers/esm/classCallCheck":"../../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js","@babel/runtime/helpers/esm/createClass":"../../../node_modules/@babel/runtime/helpers/esm/createClass.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/common.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHijackingTag = isHijackingTag;
exports.isStyledComponentsLike = isStyledComponentsLike;
exports.recordStyledComponentsCSSRules = recordStyledComponentsCSSRules;
exports.getStyledElementCSSRules = getStyledElementCSSRules;
exports.patchHTMLDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions;
exports.rebuildCSSRules = rebuildCSSRules;
exports.rawHeadAppendChild = void 0;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _importHtmlEntry = require("import-html-entry");

var _apis = require("../../../apis");

var css = _interopRequireWildcard(require("../css"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @since 2019-10-21
 */
var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
exports.rawHeadAppendChild = rawHeadAppendChild;
var rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
var rawBodyAppendChild = HTMLBodyElement.prototype.appendChild;
var rawBodyRemoveChild = HTMLBodyElement.prototype.removeChild;
var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
var rawRemoveChild = HTMLElement.prototype.removeChild;
var SCRIPT_TAG_NAME = 'SCRIPT';
var LINK_TAG_NAME = 'LINK';
var STYLE_TAG_NAME = 'STYLE';

function isHijackingTag(tagName) {
  return (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === LINK_TAG_NAME || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === STYLE_TAG_NAME || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === SCRIPT_TAG_NAME;
}
/**
 * Check if a style element is a styled-component liked.
 * A styled-components liked element is which not have textContext but keep the rules in its styleSheet.cssRules.
 * Such as the style element generated by styled-components and emotion.
 * @param element
 */


function isStyledComponentsLike(element) {
  var _a, _b;

  return !element.textContent && (((_a = element.sheet) === null || _a === void 0 ? void 0 : _a.cssRules.length) || ((_b = getStyledElementCSSRules(element)) === null || _b === void 0 ? void 0 : _b.length));
}

var styledComponentCSSRulesMap = new WeakMap();
var dynamicScriptAttachedCommentMap = new WeakMap();

function recordStyledComponentsCSSRules(styleElements) {
  styleElements.forEach(function (styleElement) {
    /*
     With a styled-components generated style element, we need to record its cssRules for restore next re-mounting time.
     We're doing this because the sheet of style element is going to be cleaned automatically by browser after the style element dom removed from document.
     see https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
     */
    if (styleElement instanceof HTMLStyleElement && isStyledComponentsLike(styleElement)) {
      if (styleElement.sheet) {
        // record the original css rules of the style element for restore
        styledComponentCSSRulesMap.set(styleElement, styleElement.sheet.cssRules);
      }
    }
  });
}

function getStyledElementCSSRules(styledElement) {
  return styledComponentCSSRulesMap.get(styledElement);
}

function patchCustomEvent(e, elementGetter) {
  Object.defineProperties(e, {
    srcElement: {
      get: elementGetter
    },
    target: {
      get: elementGetter
    }
  });
  return e;
}

function getOverwrittenAppendChildOrInsertBefore(opts) {
  return function appendChildOrInsertBefore(newChild, refChild) {
    var element = newChild;
    var rawDOMAppendOrInsertBefore = opts.rawDOMAppendOrInsertBefore,
        isInvokedByMicroApp = opts.isInvokedByMicroApp,
        containerConfigGetter = opts.containerConfigGetter;

    if (!isInvokedByMicroApp(element)) {
      return rawDOMAppendOrInsertBefore.call(this, element, refChild);
    }

    if (element.tagName) {
      var containerConfig = containerConfigGetter(element);
      var appName = containerConfig.appName,
          appWrapperGetter = containerConfig.appWrapperGetter,
          proxy = containerConfig.proxy,
          strictGlobal = containerConfig.strictGlobal,
          dynamicStyleSheetElements = containerConfig.dynamicStyleSheetElements,
          scopedCSS = containerConfig.scopedCSS,
          excludeAssetFilter = containerConfig.excludeAssetFilter;

      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME:
          {
            var stylesheetElement = newChild;
            var href = stylesheetElement.href;

            if (excludeAssetFilter && href && excludeAssetFilter(href)) {
              return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }

            var mountDOM = appWrapperGetter();

            if (scopedCSS) {
              css.process(mountDOM, stylesheetElement, appName);
            } // eslint-disable-next-line no-shadow


            dynamicStyleSheetElements.push(stylesheetElement);
            var referenceNode = mountDOM.contains(refChild) ? refChild : null;
            return rawDOMAppendOrInsertBefore.call(mountDOM, stylesheetElement, referenceNode);
          }

        case SCRIPT_TAG_NAME:
          {
            var _element = element,
                src = _element.src,
                text = _element.text; // some script like jsonp maybe not support cors which should't use execScripts

            if (excludeAssetFilter && src && excludeAssetFilter(src)) {
              return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }

            var _mountDOM = appWrapperGetter();

            var fetch = _apis.frameworkConfiguration.fetch;

            var _referenceNode = _mountDOM.contains(refChild) ? refChild : null;

            if (src) {
              (0, _importHtmlEntry.execScripts)(null, [src], proxy, {
                fetch: fetch,
                strictGlobal: strictGlobal,
                beforeExec: function beforeExec() {
                  Object.defineProperty(document, 'currentScript', {
                    get: function get() {
                      return element;
                    },
                    configurable: true
                  });
                },
                success: function success() {
                  // we need to invoke the onload event manually to notify the event listener that the script was completed
                  // here are the two typical ways of dynamic script loading
                  // 1. element.onload callback way, which webpack and loadjs used, see https://github.com/muicss/loadjs/blob/master/src/loadjs.js#L138
                  // 2. addEventListener way, which toast-loader used, see https://github.com/pyrsmk/toast/blob/master/src/Toast.ts#L64
                  var loadEvent = new CustomEvent('load');

                  if ((0, _isFunction2.default)(element.onload)) {
                    element.onload(patchCustomEvent(loadEvent, function () {
                      return element;
                    }));
                  } else {
                    element.dispatchEvent(loadEvent);
                  }

                  element = null;
                },
                error: function error() {
                  var errorEvent = new CustomEvent('error');

                  if ((0, _isFunction2.default)(element.onerror)) {
                    element.onerror(patchCustomEvent(errorEvent, function () {
                      return element;
                    }));
                  } else {
                    element.dispatchEvent(errorEvent);
                  }

                  element = null;
                }
              });
              var dynamicScriptCommentElement = document.createComment("dynamic script ".concat(src, " replaced by qiankun"));
              dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
              return rawDOMAppendOrInsertBefore.call(_mountDOM, dynamicScriptCommentElement, _referenceNode);
            }

            (0, _importHtmlEntry.execScripts)(null, ["<script>".concat(text, "</script>")], proxy, {
              strictGlobal: strictGlobal,
              success: element.onload,
              error: element.onerror
            });
            var dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by qiankun');
            dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
            return rawDOMAppendOrInsertBefore.call(_mountDOM, dynamicInlineScriptCommentElement, _referenceNode);
          }

        default:
          break;
      }
    }

    return rawDOMAppendOrInsertBefore.call(this, element, refChild);
  };
}

function getNewRemoveChild(headOrBodyRemoveChild, appWrapperGetterGetter) {
  return function removeChild(child) {
    try {
      var tagName = child.tagName;

      if (isHijackingTag(tagName)) {
        var appWrapperGetter = appWrapperGetterGetter(child); // container may had been removed while app unmounting if the removeChild action was async

        var container = appWrapperGetter();
        var attachedElement = dynamicScriptAttachedCommentMap.get(child) || child;

        if (container.contains(attachedElement)) {
          return rawRemoveChild.call(container, attachedElement);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    return headOrBodyRemoveChild.call(this, child);
  };
}

function patchHTMLDynamicAppendPrototypeFunctions(isInvokedByMicroApp, containerConfigGetter) {
  // Just overwrite it while it have not been overwrite
  if (HTMLHeadElement.prototype.appendChild === rawHeadAppendChild && HTMLBodyElement.prototype.appendChild === rawBodyAppendChild && HTMLHeadElement.prototype.insertBefore === rawHeadInsertBefore) {
    HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadAppendChild,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp
    });
    HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawBodyAppendChild,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp
    });
    HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadInsertBefore,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp
    });
  } // Just overwrite it while it have not been overwrite


  if (HTMLHeadElement.prototype.removeChild === rawHeadRemoveChild && HTMLBodyElement.prototype.removeChild === rawBodyRemoveChild) {
    HTMLHeadElement.prototype.removeChild = getNewRemoveChild(rawHeadRemoveChild, function (element) {
      return containerConfigGetter(element).appWrapperGetter;
    });
    HTMLBodyElement.prototype.removeChild = getNewRemoveChild(rawBodyRemoveChild, function (element) {
      return containerConfigGetter(element).appWrapperGetter;
    });
  }

  return function unpatch() {
    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
    HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
    HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;
    HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore;
  };
}

function rebuildCSSRules(styleSheetElements, reAppendElement) {
  styleSheetElements.forEach(function (stylesheetElement) {
    // re-append the dynamic stylesheet to sub-app container
    // Using document.head.appendChild ensures that appendChild invocation can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase
    reAppendElement(stylesheetElement);
    /*
    get the stored css rules from styled-components generated element, and the re-insert rules for them.
    note that we must do this after style element had been added to document, which stylesheet would be associated to the document automatically.
    check the spec https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
     */

    if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
      var cssRules = getStyledElementCSSRules(stylesheetElement);

      if (cssRules) {
        // eslint-disable-next-line no-plusplus
        for (var i = 0; i < cssRules.length; i++) {
          var cssRule = cssRules[i];
          stylesheetElement.sheet.insertRule(cssRule.cssText);
        }
      }
    }
  });
}
},{"lodash/isFunction":"../../../node_modules/lodash/isFunction.js","import-html-entry":"../../../node_modules/import-html-entry/esm/index.js","../../../apis":"../../../node_modules/qiankun/es/apis.js","../css":"../../../node_modules/qiankun/es/sandbox/patchers/css.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/forLooseSandbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchLooseSandbox = patchLooseSandbox;

var _singleSpa = require("single-spa");

var _common = require("./common");

/**
 * @author Kuitos
 * @since 2020-10-13
 */
var bootstrappingPatchCount = 0;
var mountingPatchCount = 0;
/**
 * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
 * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
 * this could made we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
 * @param appName
 * @param appWrapperGetter
 * @param proxy
 * @param mounting
 * @param scopedCSS
 * @param excludeAssetFilter
 */

function patchLooseSandbox(appName, appWrapperGetter, proxy) {
  var mounting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var scopedCSS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var excludeAssetFilter = arguments.length > 5 ? arguments[5] : undefined;
  var dynamicStyleSheetElements = [];
  var unpatchDynamicAppendPrototypeFunctions = (0, _common.patchHTMLDynamicAppendPrototypeFunctions)(
  /*
    check if the currently specified application is active
    While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
    but the url change listener must to wait until the current call stack is flushed.
    This scenario may cause we record the stylesheet from react routing page dynamic injection,
    and remove them after the url change triggered and qiankun app is unmouting
    see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
   */
  function () {
    return (0, _singleSpa.checkActivityFunctions)(window.location).some(function (name) {
      return name === appName;
    });
  }, function () {
    return {
      appName: appName,
      appWrapperGetter: appWrapperGetter,
      proxy: proxy,
      strictGlobal: false,
      scopedCSS: scopedCSS,
      dynamicStyleSheetElements: dynamicStyleSheetElements,
      excludeAssetFilter: excludeAssetFilter
    };
  });
  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;
    var allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0; // release the overwrite prototype after all the micro apps unmounted

    if (allMicroAppUnmounted) unpatchDynamicAppendPrototypeFunctions();
    (0, _common.recordStyledComponentsCSSRules)(dynamicStyleSheetElements); // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      (0, _common.rebuildCSSRules)(dynamicStyleSheetElements, function (stylesheetElement) {
        return (// Using document.head.appendChild ensures that appendChild invocation can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase
          document.head.appendChild.call(appWrapperGetter(), stylesheetElement)
        );
      }); // As the patcher will be invoked every mounting phase, we could release the cache for gc after rebuilding

      if (mounting) {
        dynamicStyleSheetElements = [];
      }
    };
  };
}
},{"single-spa":"../../../node_modules/single-spa/lib/esm/single-spa.min.js","./common":"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/common.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/forStrictSandbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchStrictSandbox = patchStrictSandbox;

var _common = require("../../common");

var _common2 = require("./common");

/**
 * @author Kuitos
 * @since 2020-10-13
 */
var rawDocumentCreateElement = Document.prototype.createElement;
var proxyAttachContainerConfigMap = new WeakMap();
var elementAttachContainerConfigMap = new WeakMap();

function patchDocumentCreateElement() {
  if (Document.prototype.createElement === rawDocumentCreateElement) {
    Document.prototype.createElement = function createElement(tagName, options) {
      var element = rawDocumentCreateElement.call(this, tagName, options);

      if ((0, _common2.isHijackingTag)(tagName)) {
        var attachProxy = _common.documentAttachProxyMap.get(this);

        if (attachProxy) {
          var proxyContainerConfig = proxyAttachContainerConfigMap.get(attachProxy);

          if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
          }
        }
      }

      return element;
    };
  }

  return function unpatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
  };
}

var bootstrappingPatchCount = 0;
var mountingPatchCount = 0;

function patchStrictSandbox(appName, appWrapperGetter, proxy) {
  var mounting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var scopedCSS = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var excludeAssetFilter = arguments.length > 5 ? arguments[5] : undefined;
  var containerConfig = proxyAttachContainerConfigMap.get(proxy);

  if (!containerConfig) {
    containerConfig = {
      appName: appName,
      proxy: proxy,
      appWrapperGetter: appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      excludeAssetFilter: excludeAssetFilter,
      scopedCSS: scopedCSS
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  } // all dynamic style sheets are stored in proxy container


  var _containerConfig = containerConfig,
      dynamicStyleSheetElements = _containerConfig.dynamicStyleSheetElements;
  var unpatchDocumentCreate = patchDocumentCreateElement();
  var unpatchDynamicAppendPrototypeFunctions = (0, _common2.patchHTMLDynamicAppendPrototypeFunctions)(function (element) {
    return elementAttachContainerConfigMap.has(element);
  }, function (element) {
    return elementAttachContainerConfigMap.get(element);
  });
  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;
    var allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0; // release the overwrite prototype after all the micro apps unmounted

    if (allMicroAppUnmounted) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }

    proxyAttachContainerConfigMap.delete(proxy);
    (0, _common2.recordStyledComponentsCSSRules)(dynamicStyleSheetElements); // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      (0, _common2.rebuildCSSRules)(dynamicStyleSheetElements, function (stylesheetElement) {
        return _common2.rawHeadAppendChild.call(appWrapperGetter(), stylesheetElement);
      });
    };
  };
}
},{"../../common":"../../../node_modules/qiankun/es/sandbox/common.js","./common":"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/common.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "patchLooseSandbox", {
  enumerable: true,
  get: function () {
    return _forLooseSandbox.patchLooseSandbox;
  }
});
Object.defineProperty(exports, "patchStrictSandbox", {
  enumerable: true,
  get: function () {
    return _forStrictSandbox.patchStrictSandbox;
  }
});

var _forLooseSandbox = require("./forLooseSandbox");

var _forStrictSandbox = require("./forStrictSandbox");
},{"./forLooseSandbox":"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/forLooseSandbox.js","./forStrictSandbox":"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/forStrictSandbox.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/historyListener.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _noop2 = _interopRequireDefault(require("lodash/noop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patch() {
  // FIXME umi unmount feature request
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var rawHistoryListen = function rawHistoryListen(_) {
    return _noop2.default;
  };

  var historyListeners = [];
  var historyUnListens = [];

  if (window.g_history && (0, _isFunction2.default)(window.g_history.listen)) {
    rawHistoryListen = window.g_history.listen.bind(window.g_history);

    window.g_history.listen = function (listener) {
      historyListeners.push(listener);
      var unListen = rawHistoryListen(listener);
      historyUnListens.push(unListen);
      return function () {
        unListen();
        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
        historyListeners.splice(historyListeners.indexOf(listener), 1);
      };
    };
  }

  return function free() {
    var rebuild = _noop2.default;
    /*
     还存在余量 listener 表明未被卸载，存在两种情况
     1. 应用在 unmout 时未正确卸载 listener
     2. listener 是应用 mount 之前绑定的，
     第二种情况下应用在下次 mount 之前需重新绑定该 listener
     */

    if (historyListeners.length) {
      rebuild = function rebuild() {
        // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
        historyListeners.forEach(function (listener) {
          return window.g_history.listen(listener);
        });
      };
    } // 卸载余下的 listener


    historyUnListens.forEach(function (unListen) {
      return unListen();
    }); // restore

    if (window.g_history && (0, _isFunction2.default)(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }

    return rebuild;
  };
}
},{"lodash/isFunction":"../../../node_modules/lodash/isFunction.js","lodash/noop":"../../../node_modules/lodash/noop.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/interval.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rawWindowInterval = window.setInterval;
var rawWindowClearInterval = window.clearInterval;

function patch(global) {
  var intervals = [];

  global.clearInterval = function (intervalId) {
    intervals = intervals.filter(function (id) {
      return id !== intervalId;
    });
    return rawWindowClearInterval(intervalId);
  };

  global.setInterval = function (handler, timeout) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var intervalId = rawWindowInterval.apply(void 0, [handler, timeout].concat(args));
    intervals = [].concat((0, _toConsumableArray2.default)(intervals), [intervalId]);
    return intervalId;
  };

  return function free() {
    intervals.forEach(function (id) {
      return global.clearInterval(id);
    });
    global.setInterval = rawWindowInterval;
    global.clearInterval = rawWindowClearInterval;
    return _noop2.default;
  };
}
},{"lodash/noop":"../../../node_modules/lodash/noop.js","@babel/runtime/helpers/esm/toConsumableArray":"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/windowListener.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;

function patch(global) {
  var listenerMap = new Map();

  global.addEventListener = function (type, listener, options) {
    var listeners = listenerMap.get(type) || [];
    listenerMap.set(type, [].concat((0, _toConsumableArray2.default)(listeners), [listener]));
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = function (type, listener, options) {
    var storedTypeListeners = listenerMap.get(type);

    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }

    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach(function (listeners, type) {
      return (0, _toConsumableArray2.default)(listeners).forEach(function (listener) {
        return global.removeEventListener(type, listener);
      });
    });
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return _noop2.default;
  };
}
},{"lodash/noop":"../../../node_modules/lodash/noop.js","@babel/runtime/helpers/esm/toConsumableArray":"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"}],"../../../node_modules/qiankun/es/sandbox/patchers/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchAtMounting = patchAtMounting;
exports.patchAtBootstrapping = patchAtBootstrapping;
exports.css = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/defineProperty"));

var _interfaces = require("../../interfaces");

var css = _interopRequireWildcard(require("./css"));

exports.css = css;

var _dynamicAppend = require("./dynamicAppend");

var _historyListener = _interopRequireDefault(require("./historyListener"));

var _interval = _interopRequireDefault(require("./interval"));

var _windowListener = _interopRequireDefault(require("./windowListener"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @since 2019-04-11
 */
function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox;

  var _a;

  var basePatchers = [function () {
    return (0, _interval.default)(sandbox.proxy);
  }, function () {
    return (0, _windowListener.default)(sandbox.proxy);
  }, function () {
    return (0, _historyListener.default)();
  }];
  var patchersInSandbox = (_patchersInSandbox = {}, (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Snapshot, [].concat(basePatchers, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), _patchersInSandbox);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}

function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox2;

  var _a;

  var patchersInSandbox = (_patchersInSandbox2 = {}, (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.LegacyProxy, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Proxy, [function () {
    return (0, _dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Snapshot, [function () {
    return (0, _dynamicAppend.patchLooseSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), _patchersInSandbox2);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}
},{"@babel/runtime/helpers/esm/defineProperty":"../../../node_modules/@babel/runtime/helpers/esm/defineProperty.js","../../interfaces":"../../../node_modules/qiankun/es/interfaces.js","./css":"../../../node_modules/qiankun/es/sandbox/patchers/css.js","./dynamicAppend":"../../../node_modules/qiankun/es/sandbox/patchers/dynamicAppend/index.js","./historyListener":"../../../node_modules/qiankun/es/sandbox/patchers/historyListener.js","./interval":"../../../node_modules/qiankun/es/sandbox/patchers/interval.js","./windowListener":"../../../node_modules/qiankun/es/sandbox/patchers/windowListener.js"}],"../../../node_modules/qiankun/es/sandbox/proxySandbox.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

var _interfaces = require("../interfaces");

var _utils = require("../utils");

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */

/**
 * @author Kuitos
 * @since 2020-3-31
 */

/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
function uniq(array) {
  return array.filter(function filter(element) {
    return element in this ? false : this[element] = true;
  }, {});
} // zone.js will overwrite Object.defineProperty


var rawObjectDefineProperty = Object.defineProperty;
var variableWhiteListInDev = "development" === 'development' ? [// for react hot reload
// see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
'__REACT_ERROR_OVERLAY_GLOBAL_HOOK__'] : []; // who could escape the sandbox

var variableWhiteList = [// FIXME System.js used a indirect call with eval, which would make it scope escape to global
// To make System.js works well, we write it back to global window temporary
// see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
'System', // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
'__cjsWrapper'].concat(variableWhiteListInDev);
/*
 variables who are impossible to be overwrite need to be escaped from proxy sandbox for performance reasons
 */

var unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  eval: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true
};

function createFakeWindow(global) {
  // map always has the fastest performance in has check scenario
  // see https://jsperf.com/array-indexof-vs-set-has/23
  var propertiesWithGetter = new Map();
  var fakeWindow = {};
  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   */

  Object.getOwnPropertyNames(global).filter(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);
    return !(descriptor === null || descriptor === void 0 ? void 0 : descriptor.configurable);
  }).forEach(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);

    if (descriptor) {
      var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
      /*
       make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
       see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
       > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
       */

      if (p === 'top' || p === 'parent' || p === 'self' || p === 'window' || "development" === 'test' && (p === 'mockTop' || p === 'mockSafariTop')) {
        descriptor.configurable = true;
        /*
         The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
         Example:
          Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
          Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
         */

        if (!hasGetter) {
          descriptor.writable = true;
        }
      }

      if (hasGetter) propertiesWithGetter.set(p, true); // freeze the descriptor to avoid being modified by zone.js
      // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71

      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  });
  return {
    fakeWindow: fakeWindow,
    propertiesWithGetter: propertiesWithGetter
  };
}

var activeSandboxCount = 0;
/**
 * 基于 Proxy 实现的沙箱
 */

var ProxySandbox = /*#__PURE__*/function () {
  function ProxySandbox(name) {
    (0, _classCallCheck2.default)(this, ProxySandbox);
    /** window 值变更记录 */

    this.updatedValueSet = new Set();
    this.sandboxRunning = true;
    this.name = name;
    this.type = _interfaces.SandBoxType.Proxy;
    var updatedValueSet = this.updatedValueSet;
    var self = this;
    var rawWindow = window;

    var _createFakeWindow = createFakeWindow(rawWindow),
        fakeWindow = _createFakeWindow.fakeWindow,
        propertiesWithGetter = _createFakeWindow.propertiesWithGetter;

    var descriptorTargetMap = new Map();

    var hasOwnProperty = function hasOwnProperty(key) {
      return fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
    };

    var proxy = new Proxy(fakeWindow, {
      set: function set(target, p, value) {
        if (self.sandboxRunning) {
          // @ts-ignore
          target[p] = value;
          updatedValueSet.add(p);

          if (variableWhiteList.indexOf(p) !== -1) {
            // @ts-ignore
            rawWindow[p] = value;
          }

          return true;
        }

        if ("development" === 'development') {
          console.warn("[qiankun] Set window.".concat(p.toString(), " while sandbox destroyed or inactive in ").concat(name, "!"));
        } // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function get(target, p) {
        if (p === Symbol.unscopables) return unscopables; // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13

        if (p === 'window' || p === 'self') {
          return proxy;
        }

        if (p === 'top' || p === 'parent' || "development" === 'test' && (p === 'mockTop' || p === 'mockSafariTop')) {
          // if your master app in an iframe context, allow these props escape the sandbox
          if (rawWindow === rawWindow.parent) {
            return proxy;
          }

          return rawWindow[p];
        } // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty


        if (p === 'hasOwnProperty') {
          return hasOwnProperty;
        } // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher


        if (p === 'document') {
          _common.documentAttachProxyMap.set(document, proxy); // remove the mark in next tick, thus we can identify whether it in micro app or not
          // this approach is just a workaround, it could not cover all the complex scenarios, such as the micro app runs in the same task context with master in som case
          // fixme if you have any other good ideas


          (0, _utils.nextTick)(function () {
            return _common.documentAttachProxyMap.delete(document);
          });
          return document;
        } // eslint-disable-next-line no-bitwise


        var value = propertiesWithGetter.has(p) ? rawWindow[p] : target[p] || rawWindow[p];
        return (0, _common.getTargetValue)(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(target, p) {
        return p in unscopables || p in target || p in rawWindow;
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, p) {
        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        if (target.hasOwnProperty(p)) {
          var descriptor = Object.getOwnPropertyDescriptor(target, p);
          descriptorTargetMap.set(p, 'target');
          return descriptor;
        }

        if (rawWindow.hasOwnProperty(p)) {
          var _descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);

          descriptorTargetMap.set(p, 'rawWindow'); // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object

          if (_descriptor && !_descriptor.configurable) {
            _descriptor.configurable = true;
          }

          return _descriptor;
        }

        return undefined;
      },
      // trap to support iterator with sandbox
      ownKeys: function ownKeys(target) {
        return uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
      },
      defineProperty: function defineProperty(target, p, attributes) {
        var from = descriptorTargetMap.get(p);
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */

        switch (from) {
          case 'rawWindow':
            return Reflect.defineProperty(rawWindow, p, attributes);

          default:
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      deleteProperty: function deleteProperty(target, p) {
        if (target.hasOwnProperty(p)) {
          // @ts-ignore
          delete target[p];
          updatedValueSet.delete(p);
          return true;
        }

        return true;
      }
    });
    this.proxy = proxy;
  }

  (0, _createClass2.default)(ProxySandbox, [{
    key: "active",
    value: function active() {
      if (!this.sandboxRunning) activeSandboxCount++;
      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var _this = this;

      if ("development" === 'development') {
        console.info("[qiankun:sandbox] ".concat(this.name, " modified global properties restore..."), (0, _toConsumableArray2.default)(this.updatedValueSet.keys()));
      }

      if (--activeSandboxCount === 0) {
        variableWhiteList.forEach(function (p) {
          if (_this.proxy.hasOwnProperty(p)) {
            // @ts-ignore
            delete window[p];
          }
        });
      }

      this.sandboxRunning = false;
    }
  }]);
  return ProxySandbox;
}();

exports.default = ProxySandbox;
},{"@babel/runtime/helpers/esm/toConsumableArray":"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js","@babel/runtime/helpers/esm/classCallCheck":"../../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js","@babel/runtime/helpers/esm/createClass":"../../../node_modules/@babel/runtime/helpers/esm/createClass.js","../interfaces":"../../../node_modules/qiankun/es/interfaces.js","../utils":"../../../node_modules/qiankun/es/utils.js","./common":"../../../node_modules/qiankun/es/sandbox/common.js"}],"../../../node_modules/qiankun/es/sandbox/snapshotSandbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

var _interfaces = require("../interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Hydrogen
 * @since 2020-3-8
 */
function iter(obj, callbackFn) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      callbackFn(prop);
    }
  }
}
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */


var SnapshotSandbox = /*#__PURE__*/function () {
  function SnapshotSandbox(name) {
    (0, _classCallCheck2.default)(this, SnapshotSandbox);
    this.sandboxRunning = true;
    this.modifyPropsMap = {};
    this.name = name;
    this.proxy = window;
    this.type = _interfaces.SandBoxType.Snapshot;
  }

  (0, _createClass2.default)(SnapshotSandbox, [{
    key: "active",
    value: function active() {
      var _this = this; // 记录当前快照


      this.windowSnapshot = {};
      iter(window, function (prop) {
        _this.windowSnapshot[prop] = window[prop];
      }); // 恢复之前的变更

      Object.keys(this.modifyPropsMap).forEach(function (p) {
        window[p] = _this.modifyPropsMap[p];
      });
      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var _this2 = this;

      this.modifyPropsMap = {};
      iter(window, function (prop) {
        if (window[prop] !== _this2.windowSnapshot[prop]) {
          // 记录变更，恢复环境
          _this2.modifyPropsMap[prop] = window[prop];
          window[prop] = _this2.windowSnapshot[prop];
        }
      });

      if ("development" === 'development') {
        console.info("[qiankun:sandbox] ".concat(this.name, " origin window restore..."), Object.keys(this.modifyPropsMap));
      }

      this.sandboxRunning = false;
    }
  }]);
  return SnapshotSandbox;
}();

exports.default = SnapshotSandbox;
},{"@babel/runtime/helpers/esm/classCallCheck":"../../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js","@babel/runtime/helpers/esm/createClass":"../../../node_modules/@babel/runtime/helpers/esm/createClass.js","../interfaces":"../../../node_modules/qiankun/es/interfaces.js"}],"../../../node_modules/qiankun/es/sandbox/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSandbox = createSandbox;
Object.defineProperty(exports, "css", {
  enumerable: true,
  get: function () {
    return _patchers.css;
  }
});

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _tslib = require("tslib");

var _sandbox = _interopRequireDefault(require("./legacy/sandbox"));

var _patchers = require("./patchers");

var _proxySandbox = _interopRequireDefault(require("./proxySandbox"));

var _snapshotSandbox = _interopRequireDefault(require("./snapshotSandbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 * @param elementGetter
 * @param scopedCSS
 * @param useLooseSandbox
 * @param excludeAssetFilter
 */
function createSandbox(appName, elementGetter, scopedCSS, useLooseSandbox, excludeAssetFilter) {
  var sandbox;

  if (window.Proxy) {
    sandbox = useLooseSandbox ? new _sandbox.default(appName) : new _proxySandbox.default(appName);
  } else {
    sandbox = new _snapshotSandbox.default(appName);
  } // some side effect could be be invoked while bootstrapping, such as dynamic stylesheet injection with style-loader, especially during the development phase


  var bootstrappingFreers = (0, _patchers.patchAtBootstrapping)(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter); // mounting freers are one-off and should be re-init at every mounting time

  var mountingFreers = [];
  var sideEffectsRebuilders = [];
  return {
    proxy: sandbox.proxy,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount: function mount() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var sideEffectsRebuildersAtBootstrapping, sideEffectsRebuildersAtMounting;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

                /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
                sandbox.active();
                sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
                sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length); // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state

                if (sideEffectsRebuildersAtBootstrapping.length) {
                  sideEffectsRebuildersAtBootstrapping.forEach(function (rebuild) {
                    return rebuild();
                  });
                }
                /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
                // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用


                mountingFreers = (0, _patchers.patchAtMounting)(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
                /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
                // 存在 rebuilder 则表明有些副作用需要重建

                if (sideEffectsRebuildersAtMounting.length) {
                  sideEffectsRebuildersAtMounting.forEach(function (rebuild) {
                    return rebuild();
                  });
                } // clean up rebuilders


                sideEffectsRebuilders = [];

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    },

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount: function unmount() {
      return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // record the rebuilders of window side effects (event listeners or timers)
                // note that the frees of mounting phase are one-off as it will be re-init at next mounting
                sideEffectsRebuilders = [].concat((0, _toConsumableArray2.default)(bootstrappingFreers), (0, _toConsumableArray2.default)(mountingFreers)).map(function (free) {
                  return free();
                });
                sandbox.inactive();

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    }
  };
}
},{"@babel/runtime/helpers/esm/toConsumableArray":"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js","@babel/runtime/regenerator":"../../../node_modules/@babel/runtime/regenerator/index.js","tslib":"../../../node_modules/tslib/tslib.es6.js","./legacy/sandbox":"../../../node_modules/qiankun/es/sandbox/legacy/sandbox.js","./patchers":"../../../node_modules/qiankun/es/sandbox/patchers/index.js","./proxySandbox":"../../../node_modules/qiankun/es/sandbox/proxySandbox.js","./snapshotSandbox":"../../../node_modules/qiankun/es/sandbox/snapshotSandbox.js"}],"../../../node_modules/qiankun/es/loader.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadApp = loadApp;

var _concat2 = _interopRequireDefault(require("lodash/concat"));

var _mergeWith3 = _interopRequireDefault(require("lodash/mergeWith"));

var _forEach2 = _interopRequireDefault(require("lodash/forEach"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _tslib = require("tslib");

var _importHtmlEntry = require("import-html-entry");

var _addons = _interopRequireDefault(require("./addons"));

var _globalState = require("./globalState");

var _sandbox = require("./sandbox");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @since 2020-04-01
 */
function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error('[qiankun] element not existed!');
  }
}

function execHooksChain(hooks, app) {
  var global = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;

  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app, global);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(validate, app) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", typeof validate === 'function' ? validate(app) : !!validate);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
} // @ts-ignore


var supportShadowDOM = document.head.attachShadow || document.head.createShadowRoot;

function createElement(appContent, strictStyleIsolation) {
  var containerElement = document.createElement('div');
  containerElement.innerHTML = appContent; // appContent always wrapped with a singular div

  var appElement = containerElement.firstChild;

  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn('[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
    } else {
      var innerHTML = appElement.innerHTML;
      appElement.innerHTML = '';
      var shadow;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({
          mode: 'open'
        });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = appElement.createShadowRoot();
      }

      shadow.innerHTML = innerHTML;
    }
  }

  return appElement;
}
/** generate app wrapper dom getter */


function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, enableScopedCSS, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new Error('[qiankun]: strictStyleIsolation can not be used with legacy render!');
      if (enableScopedCSS) throw new Error('[qiankun]: experimentalStyleIsolation can not be used with legacy render!');
      var appWrapper = document.getElementById((0, _utils.getWrapperId)(appInstanceId));
      assertElementExist(appWrapper, "[qiankun] Wrapper element for ".concat(appName, " with instance ").concat(appInstanceId, " is not existed!"));
      return appWrapper;
    }

    var element = elementGetter();
    assertElementExist(element, "[qiankun] Wrapper element for ".concat(appName, " with instance ").concat(appInstanceId, " is not existed!"));

    if (enableScopedCSS) {
      var attr = element.getAttribute(_sandbox.css.QiankunCSSRewriteAttr);

      if (!attr) {
        element.setAttribute(_sandbox.css.QiankunCSSRewriteAttr, appName);
      }
    }

    if (strictStyleIsolation) {
      return element.shadowRoot;
    }

    return element;
  };
}

var rawAppendChild = HTMLElement.prototype.appendChild;
var rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appName
 * @param appContent
 * @param container
 * @param legacyRender
 */

function getRender(appName, appContent, container, legacyRender) {
  var render = function render(_ref, phase) {
    var element = _ref.element,
        loading = _ref.loading,
        remountContainer = _ref.remountContainer;

    if (legacyRender) {
      if ("development" === 'development') {
        console.warn('[qiankun] Custom rendering function is deprecated, you can use the container element setting instead!');
      }

      return legacyRender({
        loading: loading,
        appContent: element ? appContent : ''
      });
    }

    var containerElement = (0, _utils.getContainer)(remountContainer || container); // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed

    if (phase !== 'unmounted') {
      var errorMsg = function () {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return "[qiankun] Target container with ".concat(container, " not existed while ").concat(appName, " ").concat(phase, "!");

          case 'mounted':
            return "[qiankun] Target container with ".concat(container, " not existed after ").concat(appName, " ").concat(phase, "!");

          default:
            return "[qiankun] Target container with ".concat(container, " not existed while ").concat(appName, " rendering!");
        }
      }();

      assertElementExist(containerElement, errorMsg);
    }

    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      } // append the element to container if it exist


      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

function getLifecyclesFromExports(scriptExports, appName, global) {
  if ((0, _utils.validateExportLifecycle)(scriptExports)) {
    return scriptExports;
  }

  if ("development" === 'development') {
    console.warn("[qiankun] lifecycle not found from ".concat(appName, " entry exports, fallback to get from window['").concat(appName, "']"));
  } // fallback to global variable who named with ${appName} while module exports not found


  var globalVariableExports = global[appName];

  if ((0, _utils.validateExportLifecycle)(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error("[qiankun] You need to export lifecycle functions in ".concat(appName, " entry"));
}

var prevAppUnmountedDeferred;

function loadApp(app) {
  var configuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var lifeCycles = arguments.length > 2 ? arguments[2] : undefined;
  return (0, _tslib.__awaiter)(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee16() {
    var _this = this;

    var entry, appName, appInstanceId, markName, _configuration$singul, singular, _configuration$sandbo, sandbox, excludeAssetFilter, importEntryOpts, _yield$importEntry, template, execScripts, assetPublicPath, appContent, strictStyleIsolation, appWrapperElement, enableScopedCSS, styleNodes, container, legacyRender, render, appWrapperGetter, global, mountSandbox, unmountSandbox, useLooseSandbox, sandboxInstance, _mergeWith, _mergeWith$beforeUnmo, beforeUnmount, _mergeWith$afterUnmou, afterUnmount, _mergeWith$afterMount, afterMount, _mergeWith$beforeMoun, beforeMount, _mergeWith$beforeLoad, beforeLoad, scriptExports, _getLifecyclesFromExp, bootstrap, mount, unmount, update, _getMicroAppStateActi, onGlobalStateChange, setGlobalState, offGlobalStateChange, parcelConfigGetter;

    return _regenerator.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            entry = app.entry, appName = app.name;
            appInstanceId = "".concat(appName, "_").concat(+new Date(), "_").concat(Math.floor(Math.random() * 1000));
            markName = "[qiankun] App ".concat(appInstanceId, " Loading");

            if ("development" === 'development') {
              (0, _utils.performanceMark)(markName);
            }

            _configuration$singul = configuration.singular, singular = _configuration$singul === void 0 ? false : _configuration$singul, _configuration$sandbo = configuration.sandbox, sandbox = _configuration$sandbo === void 0 ? true : _configuration$sandbo, excludeAssetFilter = configuration.excludeAssetFilter, importEntryOpts = (0, _tslib.__rest)(configuration, ["singular", "sandbox", "excludeAssetFilter"]); // get the entry html content and script executor

            _context16.next = 7;
            return (0, _importHtmlEntry.importEntry)(entry, importEntryOpts);

          case 7:
            _yield$importEntry = _context16.sent;
            template = _yield$importEntry.template;
            execScripts = _yield$importEntry.execScripts;
            assetPublicPath = _yield$importEntry.assetPublicPath;
            _context16.next = 13;
            return validateSingularMode(singular, app);

          case 13:
            if (!_context16.sent) {
              _context16.next = 16;
              break;
            }

            _context16.next = 16;
            return prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise;

          case 16:
            appContent = (0, _utils.getDefaultTplWrapper)(appInstanceId, appName)(template);
            strictStyleIsolation = (0, _typeof2.default)(sandbox) === 'object' && !!sandbox.strictStyleIsolation;
            appWrapperElement = createElement(appContent, strictStyleIsolation);
            enableScopedCSS = (0, _utils.isEnableScopedCSS)(sandbox);

            if (appWrapperElement && enableScopedCSS) {
              styleNodes = appWrapperElement.querySelectorAll('style') || [];
              (0, _forEach2.default)(styleNodes, function (stylesheetElement) {
                _sandbox.css.process(appWrapperElement, stylesheetElement, appName);
              });
            }

            container = 'container' in app ? app.container : undefined;
            legacyRender = 'render' in app ? app.render : undefined;
            render = getRender(appName, appContent, container, legacyRender); // 第一次加载设置应用可见区域 dom 结构
            // 确保每次应用加载前容器 dom 结构已经设置完毕

            render({
              element: appWrapperElement,
              loading: true
            }, 'loading');
            appWrapperGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, enableScopedCSS, function () {
              return appWrapperElement;
            });
            global = window;

            mountSandbox = function mountSandbox() {
              return Promise.resolve();
            };

            unmountSandbox = function unmountSandbox() {
              return Promise.resolve();
            };

            useLooseSandbox = (0, _typeof2.default)(sandbox) === 'object' && !!sandbox.loose;

            if (sandbox) {
              sandboxInstance = (0, _sandbox.createSandbox)(appName, appWrapperGetter, enableScopedCSS, useLooseSandbox, excludeAssetFilter); // 用沙箱的代理对象作为接下来使用的全局对象

              global = sandboxInstance.proxy;
              mountSandbox = sandboxInstance.mount;
              unmountSandbox = sandboxInstance.unmount;
            }

            _mergeWith = (0, _mergeWith3.default)({}, (0, _addons.default)(global, assetPublicPath), lifeCycles, function (v1, v2) {
              return (0, _concat2.default)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
            }), _mergeWith$beforeUnmo = _mergeWith.beforeUnmount, beforeUnmount = _mergeWith$beforeUnmo === void 0 ? [] : _mergeWith$beforeUnmo, _mergeWith$afterUnmou = _mergeWith.afterUnmount, afterUnmount = _mergeWith$afterUnmou === void 0 ? [] : _mergeWith$afterUnmou, _mergeWith$afterMount = _mergeWith.afterMount, afterMount = _mergeWith$afterMount === void 0 ? [] : _mergeWith$afterMount, _mergeWith$beforeMoun = _mergeWith.beforeMount, beforeMount = _mergeWith$beforeMoun === void 0 ? [] : _mergeWith$beforeMoun, _mergeWith$beforeLoad = _mergeWith.beforeLoad, beforeLoad = _mergeWith$beforeLoad === void 0 ? [] : _mergeWith$beforeLoad;
            _context16.next = 34;
            return execHooksChain((0, _utils.toArray)(beforeLoad), app, global);

          case 34:
            _context16.next = 36;
            return execScripts(global, !useLooseSandbox);

          case 36:
            scriptExports = _context16.sent;
            _getLifecyclesFromExp = getLifecyclesFromExports(scriptExports, appName, global), bootstrap = _getLifecyclesFromExp.bootstrap, mount = _getLifecyclesFromExp.mount, unmount = _getLifecyclesFromExp.unmount, update = _getLifecyclesFromExp.update;
            _getMicroAppStateActi = (0, _globalState.getMicroAppStateActions)(appInstanceId), onGlobalStateChange = _getMicroAppStateActi.onGlobalStateChange, setGlobalState = _getMicroAppStateActi.setGlobalState, offGlobalStateChange = _getMicroAppStateActi.offGlobalStateChange;

            parcelConfigGetter = function parcelConfigGetter(remountContainer) {
              var parcelConfig = {
                name: appInstanceId,
                bootstrap: bootstrap,
                mount: [function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
                    var marks;
                    return _regenerator.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if ("development" === 'development') {
                              marks = performance.getEntriesByName(markName, 'mark'); // mark length is zero means the app is remounting

                              if (!marks.length) {
                                (0, _utils.performanceMark)(markName);
                              }
                            }

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
                    return _regenerator.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return validateSingularMode(singular, app);

                          case 2:
                            _context3.t0 = _context3.sent;

                            if (!_context3.t0) {
                              _context3.next = 5;
                              break;
                            }

                            _context3.t0 = prevAppUnmountedDeferred;

                          case 5:
                            if (!_context3.t0) {
                              _context3.next = 7;
                              break;
                            }

                            return _context3.abrupt("return", prevAppUnmountedDeferred.promise);

                          case 7:
                            return _context3.abrupt("return", undefined);

                          case 8:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));
                }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee4() {
                    return _regenerator.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            // element would be destroyed after unmounted, we need to recreate it if it not exist
                            appWrapperElement = appWrapperElement || createElement(appContent, strictStyleIsolation);
                            render({
                              element: appWrapperElement,
                              loading: true,
                              remountContainer: remountContainer
                            }, 'mounting');

                          case 2:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));
                }, mountSandbox, // exec the chain after rendering to keep the behavior with beforeLoad
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee5() {
                    return _regenerator.default.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            return _context5.abrupt("return", execHooksChain((0, _utils.toArray)(beforeMount), app, global));

                          case 1:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));
                }, function (props) {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee6() {
                    return _regenerator.default.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            return _context6.abrupt("return", mount(Object.assign(Object.assign({}, props), {
                              container: appWrapperGetter(),
                              setGlobalState: setGlobalState,
                              onGlobalStateChange: onGlobalStateChange
                            })));

                          case 1:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));
                }, // finish loading after app mounted
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee7() {
                    return _regenerator.default.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            return _context7.abrupt("return", render({
                              element: appWrapperElement,
                              loading: false,
                              remountContainer: remountContainer
                            }, 'mounted'));

                          case 1:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee8() {
                    return _regenerator.default.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            return _context8.abrupt("return", execHooksChain((0, _utils.toArray)(afterMount), app, global));

                          case 1:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }));
                }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee9() {
                    return _regenerator.default.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.next = 2;
                            return validateSingularMode(singular, app);

                          case 2:
                            if (!_context9.sent) {
                              _context9.next = 4;
                              break;
                            }

                            prevAppUnmountedDeferred = new _utils.Deferred();

                          case 4:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee10() {
                    var measureName;
                    return _regenerator.default.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            if ("development" === 'development') {
                              measureName = "[qiankun] App ".concat(appInstanceId, " Loading Consuming");
                              (0, _utils.performanceMeasure)(measureName, markName);
                            }

                          case 1:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));
                }],
                unmount: [function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee11() {
                    return _regenerator.default.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            return _context11.abrupt("return", execHooksChain((0, _utils.toArray)(beforeUnmount), app, global));

                          case 1:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }));
                }, function (props) {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee12() {
                    return _regenerator.default.wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            return _context12.abrupt("return", unmount(Object.assign(Object.assign({}, props), {
                              container: appWrapperGetter()
                            })));

                          case 1:
                          case "end":
                            return _context12.stop();
                        }
                      }
                    }, _callee12);
                  }));
                }, unmountSandbox, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee13() {
                    return _regenerator.default.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            return _context13.abrupt("return", execHooksChain((0, _utils.toArray)(afterUnmount), app, global));

                          case 1:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee14() {
                    return _regenerator.default.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            render({
                              element: null,
                              loading: false,
                              remountContainer: remountContainer
                            }, 'unmounted');
                            offGlobalStateChange(appInstanceId); // for gc

                            appWrapperElement = null;

                          case 3:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee15() {
                    return _regenerator.default.wrap(function _callee15$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            _context15.next = 2;
                            return validateSingularMode(singular, app);

                          case 2:
                            _context15.t0 = _context15.sent;

                            if (!_context15.t0) {
                              _context15.next = 5;
                              break;
                            }

                            _context15.t0 = prevAppUnmountedDeferred;

                          case 5:
                            if (!_context15.t0) {
                              _context15.next = 7;
                              break;
                            }

                            prevAppUnmountedDeferred.resolve();

                          case 7:
                          case "end":
                            return _context15.stop();
                        }
                      }
                    }, _callee15);
                  }));
                }]
              };

              if (typeof update === 'function') {
                parcelConfig.update = update;
              }

              return parcelConfig;
            };

            return _context16.abrupt("return", parcelConfigGetter);

          case 41:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
}
},{"lodash/concat":"../../../node_modules/lodash/concat.js","lodash/mergeWith":"../../../node_modules/lodash/mergeWith.js","lodash/forEach":"../../../node_modules/lodash/forEach.js","@babel/runtime/helpers/esm/typeof":"../../../node_modules/@babel/runtime/helpers/esm/typeof.js","@babel/runtime/regenerator":"../../../node_modules/@babel/runtime/regenerator/index.js","tslib":"../../../node_modules/tslib/tslib.es6.js","import-html-entry":"../../../node_modules/import-html-entry/esm/index.js","./addons":"../../../node_modules/qiankun/es/addons/index.js","./globalState":"../../../node_modules/qiankun/es/globalState.js","./sandbox":"../../../node_modules/qiankun/es/sandbox/index.js","./utils":"../../../node_modules/qiankun/es/utils.js"}],"../../../node_modules/qiankun/es/prefetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prefetchImmediately = prefetchImmediately;
exports.doPrefetchStrategy = doPrefetchStrategy;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _tslib = require("tslib");

var _importHtmlEntry = require("import-html-entry");

var _singleSpa = require("single-spa");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Kuitos
 * @since 2019-02-26
 */
// RIC and shim for browsers setTimeout() without it
var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

var isSlowNetwork = navigator.connection ? navigator.connection.saveData || navigator.connection.type !== 'wifi' && navigator.connection.type !== 'ethernet' && /(2|3)g/.test(navigator.connection.effectiveType) : false;
/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */

function prefetch(entry, opts) {
  var _this = this;

  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  requestIdleCallback(function () {
    return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _yield$importEntry, getExternalScripts, getExternalStyleSheets;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _importHtmlEntry.importEntry)(entry, opts);

            case 2:
              _yield$importEntry = _context.sent;
              getExternalScripts = _yield$importEntry.getExternalScripts;
              getExternalStyleSheets = _yield$importEntry.getExternalStyleSheets;
              requestIdleCallback(getExternalStyleSheets);
              requestIdleCallback(getExternalScripts);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  });
}

function prefetchAfterFirstMounted(apps, opts) {
  window.addEventListener('single-spa:first-mount', function listener() {
    var notLoadedApps = apps.filter(function (app) {
      return (0, _singleSpa.getAppStatus)(app.name) === _singleSpa.NOT_LOADED;
    });

    if ("development" === 'development') {
      var mountedApps = (0, _singleSpa.getMountedApps)();
      console.log("[qiankun] prefetch starting after ".concat(mountedApps, " mounted..."), notLoadedApps);
    }

    notLoadedApps.forEach(function (_ref) {
      var entry = _ref.entry;
      return prefetch(entry, opts);
    });
    window.removeEventListener('single-spa:first-mount', listener);
  });
}

function prefetchImmediately(apps, opts) {
  if ("development" === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }

  apps.forEach(function (_ref2) {
    var entry = _ref2.entry;
    return prefetch(entry, opts);
  });
}

function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
  var _this2 = this;

  var appsName2Apps = function appsName2Apps(names) {
    return apps.filter(function (app) {
      return names.includes(app.name);
    });
  };

  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
  } else if ((0, _isFunction2.default)(prefetchStrategy)) {
    (function () {
      return (0, _tslib.__awaiter)(_this2, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var _yield$prefetchStrate, _yield$prefetchStrate2, criticalAppNames, _yield$prefetchStrate3, minorAppsName;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return prefetchStrategy(apps);

              case 2:
                _yield$prefetchStrate = _context2.sent;
                _yield$prefetchStrate2 = _yield$prefetchStrate.criticalAppNames;
                criticalAppNames = _yield$prefetchStrate2 === void 0 ? [] : _yield$prefetchStrate2;
                _yield$prefetchStrate3 = _yield$prefetchStrate.minorAppsName;
                minorAppsName = _yield$prefetchStrate3 === void 0 ? [] : _yield$prefetchStrate3;
                prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
                prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    })();
  } else {
    switch (prefetchStrategy) {
      case true:
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;

      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}
},{"lodash/isFunction":"../../../node_modules/lodash/isFunction.js","@babel/runtime/regenerator":"../../../node_modules/@babel/runtime/regenerator/index.js","tslib":"../../../node_modules/tslib/tslib.es6.js","import-html-entry":"../../../node_modules/import-html-entry/esm/index.js","single-spa":"../../../node_modules/single-spa/lib/esm/single-spa.min.js"}],"../../../node_modules/qiankun/es/apis.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMicroApps = registerMicroApps;
exports.loadMicroApp = loadMicroApp;
exports.start = start;
exports.frameworkConfiguration = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

var _tslib = require("tslib");

var _singleSpa = require("single-spa");

var _loader = require("./loader");

var _prefetch = require("./prefetch");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var microApps = []; // eslint-disable-next-line import/no-mutable-exports

var frameworkConfiguration = {};
exports.frameworkConfiguration = frameworkConfiguration;
var frameworkStartedDefer = new _utils.Deferred();

function registerMicroApps(apps, lifeCycles) {
  var _this = this; // Each app only needs to be registered once


  var unregisteredApps = apps.filter(function (app) {
    return !microApps.some(function (registeredApp) {
      return registeredApp.name === app.name;
    });
  });
  microApps = [].concat((0, _toConsumableArray2.default)(microApps), (0, _toConsumableArray2.default)(unregisteredApps));
  unregisteredApps.forEach(function (app) {
    var name = app.name,
        activeRule = app.activeRule,
        _app$loader = app.loader,
        loader = _app$loader === void 0 ? _noop2.default : _app$loader,
        props = app.props,
        appConfig = (0, _tslib.__rest)(app, ["name", "activeRule", "loader", "props"]);
    (0, _singleSpa.registerApplication)({
      name: name,
      app: function app() {
        return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
          var _this2 = this;

          var _a, mount, otherMicroAppConfigs;

          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  loader(true);
                  _context3.next = 3;
                  return frameworkStartedDefer.promise;

                case 3:
                  _context3.next = 5;
                  return (0, _loader.loadApp)(Object.assign({
                    name: name,
                    props: props
                  }, appConfig), frameworkConfiguration, lifeCycles);

                case 5:
                  _context3.t0 = _context3.sent;
                  _a = (0, _context3.t0)();
                  mount = _a.mount;
                  otherMicroAppConfigs = (0, _tslib.__rest)(_a, ["mount"]);
                  return _context3.abrupt("return", Object.assign({
                    mount: [function () {
                      return (0, _tslib.__awaiter)(_this2, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
                        return _regenerator.default.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                return _context.abrupt("return", loader(true));

                              case 1:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee);
                      }));
                    }].concat((0, _toConsumableArray2.default)((0, _utils.toArray)(mount)), [function () {
                      return (0, _tslib.__awaiter)(_this2, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
                        return _regenerator.default.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                return _context2.abrupt("return", loader(false));

                              case 1:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _callee2);
                      }));
                    }])
                  }, otherMicroAppConfigs));

                case 10:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));
      },
      activeWhen: activeRule,
      customProps: props
    });
  });
}

var appConfigPormiseGetterMap = new Map();

function loadMicroApp(app, configuration, lifeCycles) {
  var _this3 = this;

  var props = app.props,
      name = app.name;

  var getContainerXpath = function getContainerXpath(container) {
    var containerElement = (0, _utils.getContainer)(container);

    if (containerElement) {
      return (0, _utils.getXPathForElement)(containerElement, document);
    }

    return undefined;
  };
  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */


  var memorizedLoadingFn = function memorizedLoadingFn() {
    return (0, _tslib.__awaiter)(_this3, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee4() {
      var container, xpath, parcelConfigGetterPromise, parcelConfig, parcelConfigObjectGetterPromise, _xpath;

      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              container = 'container' in app ? app.container : undefined;

              if (!container) {
                _context4.next = 11;
                break;
              }

              xpath = getContainerXpath(container);

              if (!xpath) {
                _context4.next = 11;
                break;
              }

              parcelConfigGetterPromise = appConfigPormiseGetterMap.get("".concat(name, "-").concat(xpath));

              if (!parcelConfigGetterPromise) {
                _context4.next = 11;
                break;
              }

              _context4.next = 8;
              return parcelConfigGetterPromise;

            case 8:
              _context4.t0 = _context4.sent;
              parcelConfig = (0, _context4.t0)(container);
              return _context4.abrupt("return", Object.assign(Object.assign({}, parcelConfig), {
                // empty bootstrap hook which should not run twice while it calling from cached micro app
                bootstrap: function bootstrap() {
                  return Promise.resolve();
                }
              }));

            case 11:
              parcelConfigObjectGetterPromise = (0, _loader.loadApp)(app, configuration !== null && configuration !== void 0 ? configuration : frameworkConfiguration, lifeCycles);

              if (container) {
                _xpath = getContainerXpath(container);
                if (_xpath) appConfigPormiseGetterMap.set("".concat(name, "-").concat(_xpath), parcelConfigObjectGetterPromise);
              }

              _context4.next = 15;
              return parcelConfigObjectGetterPromise;

            case 15:
              _context4.t1 = _context4.sent;
              return _context4.abrupt("return", (0, _context4.t1)(container));

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
  };

  return (0, _singleSpa.mountRootParcel)(memorizedLoadingFn, Object.assign({
    domElement: document.createElement('div')
  }, props));
}

function start() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  exports.frameworkConfiguration = frameworkConfiguration = Object.assign({
    prefetch: true,
    singular: true,
    sandbox: true
  }, opts);
  var _frameworkConfigurati = frameworkConfiguration,
      prefetch = _frameworkConfigurati.prefetch,
      sandbox = _frameworkConfigurati.sandbox,
      singular = _frameworkConfigurati.singular,
      urlRerouteOnly = _frameworkConfigurati.urlRerouteOnly,
      importEntryOpts = (0, _tslib.__rest)(frameworkConfiguration, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);

  if (prefetch) {
    (0, _prefetch.doPrefetchStrategy)(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      frameworkConfiguration.sandbox = (0, _typeof2.default)(sandbox) === 'object' ? Object.assign(Object.assign({}, sandbox), {
        loose: true
      }) : {
        loose: true
      };

      if (!singular) {
        console.warn('[qiankun] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy');
      }
    }
  }

  (0, _singleSpa.start)({
    urlRerouteOnly: urlRerouteOnly
  });
  frameworkStartedDefer.resolve();
}
},{"@babel/runtime/helpers/esm/typeof":"../../../node_modules/@babel/runtime/helpers/esm/typeof.js","@babel/runtime/regenerator":"../../../node_modules/@babel/runtime/regenerator/index.js","lodash/noop":"../../../node_modules/lodash/noop.js","@babel/runtime/helpers/esm/toConsumableArray":"../../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js","tslib":"../../../node_modules/tslib/tslib.es6.js","single-spa":"../../../node_modules/single-spa/lib/esm/single-spa.min.js","./loader":"../../../node_modules/qiankun/es/loader.js","./prefetch":"../../../node_modules/qiankun/es/prefetch.js","./utils":"../../../node_modules/qiankun/es/utils.js"}],"../../../node_modules/qiankun/es/errorHandler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addGlobalUncaughtErrorHandler = addGlobalUncaughtErrorHandler;
exports.removeGlobalUncaughtErrorHandler = removeGlobalUncaughtErrorHandler;
Object.defineProperty(exports, "addErrorHandler", {
  enumerable: true,
  get: function () {
    return _singleSpa.addErrorHandler;
  }
});
Object.defineProperty(exports, "removeErrorHandler", {
  enumerable: true,
  get: function () {
    return _singleSpa.removeErrorHandler;
  }
});

var _singleSpa = require("single-spa");

/**
 * @author Kuitos
 * @since 2020-02-21
 */
function addGlobalUncaughtErrorHandler(errorHandler) {
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);
}

function removeGlobalUncaughtErrorHandler(errorHandler) {
  window.removeEventListener('error', errorHandler);
  window.removeEventListener('unhandledrejection', errorHandler);
}
},{"single-spa":"../../../node_modules/single-spa/lib/esm/single-spa.min.js"}],"../../../node_modules/qiankun/es/effects.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaultMountApp = setDefaultMountApp;
exports.runDefaultMountEffects = runDefaultMountEffects;
exports.runAfterFirstMounted = runAfterFirstMounted;

var _singleSpa = require("single-spa");

/**
 * @author Kuitos
 * @since 2019-02-19
 */
var firstMountLogLabel = '[qiankun] first app mounted';

if ("development" === 'development') {
  console.time(firstMountLogLabel);
}

function setDefaultMountApp(defaultAppLink) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:no-app-change', function listener() {
    var mountedApps = (0, _singleSpa.getMountedApps)();

    if (!mountedApps.length) {
      (0, _singleSpa.navigateToUrl)(defaultAppLink);
    }

    window.removeEventListener('single-spa:no-app-change', listener);
  });
}

function runDefaultMountEffects(defaultAppLink) {
  console.warn('[qiankun] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead');
  setDefaultMountApp(defaultAppLink);
}

function runAfterFirstMounted(effect) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount', function listener() {
    if ("development" === 'development') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();
    window.removeEventListener('single-spa:first-mount', listener);
  });
}
},{"single-spa":"../../../node_modules/single-spa/lib/esm/single-spa.min.js"}],"../../../node_modules/qiankun/es/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  loadMicroApp: true,
  registerMicroApps: true,
  start: true,
  initGlobalState: true,
  prefetchApps: true
};
Object.defineProperty(exports, "loadMicroApp", {
  enumerable: true,
  get: function () {
    return _apis.loadMicroApp;
  }
});
Object.defineProperty(exports, "registerMicroApps", {
  enumerable: true,
  get: function () {
    return _apis.registerMicroApps;
  }
});
Object.defineProperty(exports, "start", {
  enumerable: true,
  get: function () {
    return _apis.start;
  }
});
Object.defineProperty(exports, "initGlobalState", {
  enumerable: true,
  get: function () {
    return _globalState.initGlobalState;
  }
});
Object.defineProperty(exports, "prefetchApps", {
  enumerable: true,
  get: function () {
    return _prefetch.prefetchImmediately;
  }
});

var _apis = require("./apis");

var _globalState = require("./globalState");

var _errorHandler = require("./errorHandler");

Object.keys(_errorHandler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _errorHandler[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errorHandler[key];
    }
  });
});

var _effects = require("./effects");

Object.keys(_effects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _effects[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _effects[key];
    }
  });
});

var _interfaces = require("./interfaces");

Object.keys(_interfaces).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interfaces[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interfaces[key];
    }
  });
});

var _prefetch = require("./prefetch");
},{"./apis":"../../../node_modules/qiankun/es/apis.js","./globalState":"../../../node_modules/qiankun/es/globalState.js","./errorHandler":"../../../node_modules/qiankun/es/errorHandler.js","./effects":"../../../node_modules/qiankun/es/effects.js","./interfaces":"../../../node_modules/qiankun/es/interfaces.js","./prefetch":"../../../node_modules/qiankun/es/prefetch.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _qiankun = require("qiankun");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Store ref objects of the main app.
var main = {
  apps: []
}; // Bare bones HostApp to load and mount
// the other apps.

var HostApp = /*#__PURE__*/function () {
  function HostApp() {
    _classCallCheck(this, HostApp);
  }

  _createClass(HostApp, null, [{
    key: "getConfig",
    value: function () {
      var _getConfig = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", fetch('https://pokeapi.co/api/v2/ability/4').then(function (res) {
                  return res.json();
                }).then(function (json) {
                  // NOTE: Return temporary data...
                  return {
                    main: {
                      name: '@ronbravo/pkd-base-ang8',
                      entry: '//localhost:5001',
                      container: '#host-main-app-mount',
                      props: {
                        slogan: 'Hello Qiankun'
                      }
                    },
                    apps: [{
                      name: '@ronbravo/pkd-my-account-ang8',
                      entry: '//localhost:5002',
                      menu: {
                        icon: 'account_circle',
                        label: 'ABC My Account',
                        url: '/account'
                      } // entry: { scripts: ['//localhost:7100/main.js'] },
                      // container: '#ronbravo-pkd-my-account-ang8',
                      // activeRule: '/account',

                    } // {
                    //   name: '@ronbravo/pkd-pokemon-inspector-ang8',
                    //   entry: '//localhost:5003',
                    //   menu: { icon: 'pets', label: 'Pokemon', url: '/pokemon' },
                    //   // entry: { scripts: ['//localhost:7100/main.js'] },
                    //   // container: '#ronbravo-pkd-my-account-ang8',
                    //   // activeRule: '/pokemon',
                    // },
                    ]
                  };
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getConfig() {
        return _getConfig.apply(this, arguments);
      }

      return getConfig;
    }()
  }, {
    key: "setMainAppAsReady",
    value: function setMainAppAsReady(_ref) {
      var app = _ref.app,
          listener = _ref.listener;
      main.app = app;
      main.listener = listener;
      console.log('Main app has been set');
      return main;
    }
  }, {
    key: "getMainAppListener",
    value: function getMainAppListener() {
      return main.listener;
    }
  }, {
    key: "start",
    value: function () {
      var _start2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var config, parent;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return HostApp.getConfig();

              case 2:
                config = _context2.sent;
                // Load the main app.
                (0, _qiankun.loadMicroApp)(config.main); // Go through each micro app and create a pre
                // mount point for it in the ui.

                parent = document.querySelector('#host-micro-app-pre-mount');
                config.apps.forEach(function (item) {
                  // Create mount point.
                  var div = document.createElement('div');
                  var id = item.name.replace('@', '').replace('/', '-');
                  div.id = id;
                  parent.appendChild(div); // Register the app.

                  item.container = "#".concat(id); // pre mount dom.

                  item.activeRule = item.menu.url; // Set when the app shows.

                  main.apps.push(item);
                }); // Register the micro apps.

                (0, _qiankun.registerMicroApps)(main.apps); // Start Single SPA.

                (0, _qiankun.start)();

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function start() {
        return _start2.apply(this, arguments);
      }

      return start;
    }()
  }]);

  return HostApp;
}();

window.__hostapp__ = HostApp;
HostApp.start();
},{"qiankun":"../../../node_modules/qiankun/es/index.js"}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55276" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/browser.e31bb0bc.js.map