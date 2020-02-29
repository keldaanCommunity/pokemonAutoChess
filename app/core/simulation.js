(function (g, f) {
  (typeof module === "object" && module.exports) ? module.exports = f() :
    (typeof define === "function" && define.amd) ? define(f) : g.Simulation = f();
}(typeof self != "undefined" ? self : this, function () {
  "use strict";

  /**
  *
  * js-simulator: https://github.com/chen0040/js-simulator/blob/master/src/jssim.js
  * Event-Driven Simulation C++: https://stdcxx.apache.org/doc/stdlibug/11-3.html
  * AgentSimJS Paper: http://ceur-ws.org/Vol-1664/w20.pdf
  *
  * Chain of Command for MAS: https://link.springer.com/article/10.1007/s40692-018-0119-8
  * 
  * Boardgame.io API: https://boardgame.io/documentation/#/
  */

  // Utilities

  function Heap(compare) {
    this.compare = typeof compare == "function" ? compare : function (a, b) { return a < b ? -1 : a > b ? 1 : 0 };
    this._data = [];
    this.length = 0;
  }
  Heap.prototype = {
    push: function (e) {
      this._data.push(e);
      this.length++;
      this._u(this.length - 1);
    },
    pop: function () {
      if (this.length == 0) return null;
      var a = this._data[0];
      var b = this._data.pop();
      this.length--;
      if (this.length > 0) {
        this._data[0] = b;
        this._d(0);
      }
      return a;
    },
    peek: function () {
      return this.length > 0 ? this._data[0] : null;
    },
    _r: function (i) {
      var a = this._data.pop();
      this.length--;
      if (this.length > 0) {
        this._data[i] = a;
        this._d(i);
      }
    },
    _u: function (i) {
      var a = this._data[i];
      while (i > 0) {
        var j = (i - 1) >> 1;
        var b = this._data[j];
        if (this.compare(a, b) >= 0) break;
        this._data[i] = b;
        i = j;
      }
      this._data[i] = a;
    },
    _d: function (i) {
      var a = this._data[i];
      var half = this.length >> 1;
      while (i < half) {
        var j = (i << 1) + 1;
        var b = this._data[j];
        if (j + 1 < this.length && this.compare(this._data[j + 1], b) < 0) {
          j++;
          b = this._data[j];
        }
        if (this.compare(a, b) < 0) break;
        this._data[i] = b;
        i = j;
      }
      this._data[i] = a;
    }
  };

  // fnv1a
  function hash(e) {
    try { var s = e.toString(); } catch (e) { s = [+new Date()] + Math.random(); }
    var h = 2166136261;
    for (var i = 0, a, b; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      a = (h & 65535) * 403;
      b = (h & 65535) * 256 + (h >>> 16) * 403 + (a >>> 16);
      h = (a & 65535) + (b & 65535) * 65536;
    }
    var f = function () {
      h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
      return h >>> 0;
    }
    return f;
  }

  // sfc32
  function rng(s1, s2, s3) {
    var a = s1 | 0, b = s2 | 0, c = s3 | 0, d = 1;
    var f = function () {
      var t = (a + b + d++) | 0;
      a = b ^ (b >>> 9) | 0; b = c + (c << 3) | 0;
      c = ((c << 21) | (c >> 11)) + t | 0;
      return (t >>> 0) / 4294967296;
    }
    for (var i = 0; i < 12; i++) f();
    return f;
  }

  function Random(e) {
    var h = hash(e);
    var s1 = h(), s2 = h(), s3 = h();
    this._rng = rng(s1, s2, s3);
  }
  Random.prototype =
  {
    value: function () {
      return this._rng();
    },
    range: function (a, b) {
      if (typeof b == "undefined") {
        return Math.floor(this._rng() * a);
      }
      else {
        return a + Math.floor(this._rng() * (b - a));
      }
    },
    shuffle: function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
    pick: function (array) {
      return array[Math.floor(this._rng() * array.length)];
    },
    uuid: function () {
      var l = "0123456789abcdef";
      var s = "", b = 0;
      for (var i = 0; i < 16; i++) {
        b = Math.random() * 256 | 0;
        if (i == 6) b = (b & 15) | 64;  // 0100xxxx
        if (i == 8) b = (b & 63) | 128; // 10xxxxxx
        s += l[b >> 4] + l[b & 15];
        if (i == 3 || i == 5 || i == 7 || i == 9) s += "-";
      }
      return s;
    },
    id: function () {
      var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for (var s = "", i = 0; i < 15; i++) s += a[Math.random() * 52 | 0];
      return s;
    }
  };

  // var _ = function(a){return function(b){if(!a[b])a[b]={};return a[b];}}({});

  function Simulation(params) {
    // private
    this._events = new Heap(function (a, b) { return a.time - b.time; });
    this._init = function () { return {}; }
    this._stop = function () { return false; }
    // public
    this.ctx = { random: null, time: 0 };
    this.state = {};
    // parameters
    var p = typeof params == "object" ? params : {};
    this.setSeed(p.seed);
    this.setInitializer(p.initializer);
    this.setEndIf(p.endIf);
  }

  Simulation.prototype.setSeed = function (seed) {
    this.ctx.random = new Random(seed);
  };

  Simulation.prototype.setInitializer = function (func) {
    if (typeof func == "function") {
      this._init = function () { return func(this.ctx); }
    }
  };

  Simulation.prototype.setEndIf = function (func) {
    if (typeof func == "function") {
      this._stop = function () { return func(this); };
    }
  };

  Simulation.prototype.run = function () {
    this.ctx.time = 0;
    this.state = this._init();
    while (this._events.length) {
      if (this._stop()) {
        break;
      }
      var event = this._events.pop();
      this.ctx.time = event.time;
      event.exec();
      if (event.interval > 0 && event.timeout > this.ctx.time) {
        event.time += event.interval;
        this._events.push(event);
      }
    }
  };

  Simulation.prototype.step = function (timeStep) {
    var timeLimit = timeStep + this.ctx.time;
    while (this._events.length) {
      if (this._stop() || this._events._data[this._events.length - 1].time > timeLimit) {
        break;
      }
      var event = this._events.pop();
      this.ctx.time = event.time;
      event.exec();
      if (event.interval > 0 && event.timeout > this.ctx.time) {
        event.time += event.interval;
        this._events.push(event);
      }
    }
  }

  Simulation.prototype.addEvent = function (params, callback) {
    if (typeof params == "object" && typeof callback == "function") {
      var event = {};
      event.id = this.ctx.random.id();
      event.args = [this];
      for (var i = 2; i < arguments.length; i++) {
        event.args.push(arguments[i]);
      }
      event.exec = function () { callback.apply(null, event.args); }
      if (!!params.time) {
        event.time = parseInt(params.time);
      }
      else if (!!params.delay) {
        event.time = this.ctx.time + parseInt(params.delay);
      }
      else {
        event.time = this.ctx.time;
      }
      if (!!params.interval) {
        event.interval = parseInt(params.interval);
        if (!!params.timeout) {
          event.timeout = parseInt(params.timeout);
        }
        else if (!!params.duration) {
          event.timeout = event.time + parseInt(params.duration);
        }
        else if (!!params.repetition) {
          event.timeout = event.time + parseInt(params.repetition) * event.interval;
        }
        else {
          event.timeout = Number.MAX_SAFE_INTEGER;
        }
      }
      else {
        event.interval = 0;
      }
      this._events.push(event);
      return event.id;
    }
    else {
      throw new Error("Invalid input arguments");
    }
  };


  Simulation.prototype.cancelEvent = function (id) {
    console.log(this._events._data.slice(0));
    for (var i = 0; i < this._events._data.length; i++) {
      if (this._events._data[i].id == id) {
        this._events._r(i);
        break;
      }
    }
  };

  return Simulation;
}));
