(function (g, f) {
  (typeof module === "object" && module.exports) ? module.exports = f() :
    (typeof define === "function" && define.amd) ? define(f) : g.Utils = f();
}(typeof self != "undefined" ? self : this, function () {
  "use strict";

  var Utils = {};

  function uid() {
    var s = "", l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 9; i++) {
      s += l[Math.random() * 52 | 0];
    }
    return s;
  }

  function uuid() {
    var s = "", l = "0123456789abcdef";
    for (var i = 0; i < 16; i++) {
      var b = Math.random()*256|0;
      if (i == 6) b = (b & 15) | 64;  // 0100xxxx
      if (i == 8) b = (b & 63) | 128; // 10xxxxxx
      s += l[b >> 4] + l[b & 15];
      if (i == 3 || i == 5 || i == 7 || i == 9) s += "-";
    }
    return s;
  }

  // function hash(str) {
  //   var h = 0;
  //   for (var i = 0; i < str.length; i++) {
  //     h = (h << 5) - h + str.charCodeAt(i) | 0;
  //   }
  //   return h >>> 0;
  // }
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0, l = str.length; i < l; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24) | 0;
    }
    return h >>> 0;
  }
  Utils.hash = hash;
  
  function addScript(doc, src, onload, onerror) {
    var id = hash(src).toString(36);
    if (document.getElementById(id)) { console.log ("script already exists", src); return; }
    var script = doc.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", src);
    script.setAttribute("id", id);
    if (typeof onload == "function") script.onload = onload;
    if (typeof onerror == "function") script.onerror = onerror;
    doc.getElementsByTagName("head")[0].appendChild(script);
  }
  Utils.addScript = addScript;


  return Utils;
}));