(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Preloader = factory());
}(this, (function () { 'use strict';

function get(file, done) {
  var x = new XMLHttpRequest();
  x.onload = function () {
    return done(x.response);
  };
  x.onprogress = prog.thunk;
  x.open("GET", file);
  x.send();
}

function findProgressBar() {
  if (!prog.bar) {
    prog.bar = document.querySelector("progress");
  }
}

var prog = {
  bar: null,
  files: {},
  loaded: 0,
  total: 0,

  shrink: function shrink(size) {
    findProgressBar();
    if (prog.bar) {
      prog.bar.style.height = size;
    }
  },

  hide: function hide() {
    findProgressBar();
    if (prog.bar) {
      prog.bar.style.display = "none";
    }
  },

  thunk: function thunk(evt) {
    var file = evt.target.responseURL || evt.target.currentSrc;
    if (file) {
      if (!prog.files[file]) {
        prog.files[file] = {};
      }
      var f = prog.files[file];
      if (typeof evt.loaded === "number") {
        f.loaded = evt.loaded;
        f.total = evt.total;
      } else if (evt.srcElement) {
        var bs = evt.srcElement.buffered;
        var min = Number.MAX_VALUE,
            max = Number.MIN_VALUE;
        for (var i = 0; i < bs.length; ++i) {
          min = Math.min(min, bs.start(i));
          max = Math.max(max, bs.end(i));
        }
        f.loaded = 1000 * max;
        f.total = 1000 * evt.srcElement.duration;
      }
    }

    var total = 0,
        loaded = 0;
    for (var key in prog.files) {
      var _f = prog.files[key];
      loaded += _f.loaded;
      total += _f.total;
    }

    prog.loaded = loaded;
    prog.total = total;

    findProgressBar();

    if (prog.bar && total) {
      prog.bar.max = total;
      prog.bar.value = loaded;
    }
  }
};

return prog;

})));