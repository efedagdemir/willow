(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("geometric"));
	else if(typeof define === 'function' && define.amd)
		define(["geometric"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeViewUtilities"] = factory(require("geometric"));
	else
		root["cytoscapeViewUtilities"] = factory(root["geometric"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;

(function () {
  'use strict'; // registers the extension on a cytoscape lib ref

  var register = function register(cytoscape) {
    if (!cytoscape) {
      return;
    } // can't register if cytoscape unspecified


    var options = {
      highlightStyles: [],
      selectStyles: {},
      setVisibilityOnHide: false,
      // whether to set visibility on hide/show
      setDisplayOnHide: true,
      // whether to set display on hide/show
      zoomAnimationDuration: 1500,
      //default duration for zoom animation speed
      neighbor: function neighbor(ele) {
        // return desired neighbors of tapheld node
        return false;
      },
      neighborSelectTime: 500,
      //ms, time to taphold to select desired neighbors
      lassoStyle: {
        lineColor: "#d67614",
        lineWidth: 3
      },
      htmlElem4marqueeZoom: '',
      // should be string like `#cy` or `.cy`. `#cy` means get element with the ID 'cy'. `.cy` means the element with class 'cy' 
      marqueeZoomCursor: 'se-resize',
      // the cursor that should be used when marquee zoom is enabled. It can also be an image if a URL to an image is given 
      isShowEdgesBetweenVisibleNodes: true // When showing elements, show edges if both source and target nodes become visible

    };

    var undoRedo = __webpack_require__(1);

    var viewUtilities = __webpack_require__(2);

    cytoscape('core', 'viewUtilities', function (opts) {
      var cy = this;

      function getScratch(eleOrCy) {
        if (!eleOrCy.scratch("_viewUtilities")) {
          eleOrCy.scratch("_viewUtilities", {});
        }

        return eleOrCy.scratch("_viewUtilities");
      } // If 'get' is given as the param then return the extension instance


      if (opts === 'get') {
        return getScratch(cy).instance;
      }
      /**
      * Deep copy or merge objects - replacement for jQuery deep extend
      * Taken from http://youmightnotneedjquery.com/#deep_extend
      * and bug related to deep copy of Arrays is fixed.
      * Usage:Object.extend({}, objA, objB)
      */


      function extendOptions(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
          var obj = arguments[i];
          if (!obj) continue;

          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (Array.isArray(obj[key])) {
                out[key] = obj[key].slice();
              } else if (_typeof(obj[key]) === 'object') {
                out[key] = extendOptions(out[key], obj[key]);
              } else {
                out[key] = obj[key];
              }
            }
          }
        }

        return out;
      }

      ;
      options = extendOptions({}, options, opts); // create a view utilities instance

      var instance = viewUtilities(cy, options);

      if (cy.undoRedo) {
        var ur = cy.undoRedo(null, true);
        undoRedo(cy, ur, instance);
      } // set the instance on the scratch pad


      getScratch(cy).instance = instance;

      if (!getScratch(cy).initialized) {
        getScratch(cy).initialized = true;
        var shiftKeyDown = false;
        document.addEventListener('keydown', function (event) {
          if (event.key == "Shift") {
            shiftKeyDown = true;
          }
        });
        document.addEventListener('keyup', function (event) {
          if (event.key == "Shift") {
            shiftKeyDown = false;
          }
        }); //Select the desired neighbors after taphold-and-free

        cy.on('taphold', 'node, edge', function (event) {
          var target = event.target || event.cyTarget;
          var tapheld = false;
          var neighborhood;
          var timeout = setTimeout(function () {
            if (shiftKeyDown) {
              cy.elements().unselect();
              neighborhood = options.neighbor(target);
              if (neighborhood) neighborhood.select();
              target.lock(); // this call is necessary to make sure
              // the tapheld node or edge stays selected
              // after releasing taphold

              target.unselectify(); // tracks whether the taphold event happened
              // necessary if we want to keep 'neighborSelectTime'
              // property, otherwise unnecessary 

              tapheld = true;
            }
          }, options.neighborSelectTime - 500); // this listener prevents the original tapheld node or edge
          // from being unselected after releasing from taphold
          // together with the 'unselectify' call above
          // called as one time event since it's defined inside another event,
          // shouldn't be defined over and over with 'on'

          cy.one('tapend', function () {
            if (tapheld) {
              setTimeout(function () {
                target.selectify();
                target.unlock();
                tapheld = false;
              }, 100);
            } else {
              clearTimeout(timeout);
            }
          });
          cy.one('drag', 'node', function (e) {
            var targetDragged = e.target || e.cyTarget;

            if (target == targetDragged && tapheld === false) {
              clearTimeout(timeout);
            }
          });
        });
      } // return the instance of extension


      return getScratch(cy).instance;
    });
  };

  if ( true && module.exports) {
    // expose as a commonjs module
    module.exports = register;
  }

  if (true) {
    // expose as an amd/requirejs module
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return register;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }

  if (typeof cytoscape !== 'undefined') {
    // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape);
  }
})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Registers ur actions related to highlight
function highlightUR(cy, ur, viewUtilities) {
  function getStatus(eles) {
    eles = eles ? eles : cy.elements();
    var classes = viewUtilities.getAllHighlightClasses();
    var r = [];

    for (var i = 0; i < classes.length; i++) {
      r.push(eles.filter(".".concat(classes[i], ":visible")));
    }

    var selector = classes.map(function (x) {
      return '.' + x;
    }).join(','); // last element of array is elements which are not highlighted by any style

    r.push(eles.filter(":visible").not(selector));
    return r;
  }

  function generalUndo(args) {
    var current = args.current;
    var r = [];

    for (var i = 0; i < args.length - 1; i++) {
      r.push(viewUtilities.highlight(args[i], i));
    } // last element is for not highlighted by any style


    r.push(viewUtilities.removeHighlights(args[args.length - 1]));
    r['current'] = current;
    return r;
  }

  function generalRedo(args) {
    var current = args.current;
    var r = [];

    for (var i = 0; i < current.length - 1; i++) {
      r.push(viewUtilities.highlight(current[i], i));
    } // last element is for not highlighted by any style


    r.push(viewUtilities.removeHighlights(current[current.length - 1]));
    r['current'] = current;
    return r;
  }

  function generateDoFunc(func) {
    return function (args) {
      var res = getStatus();
      if (args.firstTime) viewUtilities[func](args.eles, args.idx);else generalRedo(args);
      res.current = getStatus();
      return res;
    };
  }

  ur.action("highlightNeighbors", generateDoFunc("highlightNeighbors"), generalUndo);
  ur.action("highlight", generateDoFunc("highlight"), generalUndo);
  ur.action("removeHighlights", generateDoFunc("removeHighlights"), generalUndo);
} // Registers ur actions related to hide/show


function hideShowUR(cy, ur, viewUtilities) {
  function urShow(eles) {
    return viewUtilities.show(eles);
  }

  function urHide(eles) {
    return viewUtilities.hide(eles);
  }

  function urShowHiddenNeighbors(eles) {
    return viewUtilities.showHiddenNeighbors(eles);
  }

  ur.action("show", urShow, urHide);
  ur.action("hide", urHide, urShow);
  ur.action("showHiddenNeighbors", urShowHiddenNeighbors, urHide);
}

module.exports = function (cy, ur, viewUtilities) {
  highlightUR(cy, ur, viewUtilities);
  hideShowUR(cy, ur, viewUtilities);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var viewUtilities = function viewUtilities(cy, options) {
  var classNames4Styles = []; // give a unique name for each unique style EVER added

  var totStyleCnt = 0;
  var marqueeZoomEnabled = false;
  var shiftKeyDown = false;
  var ctrlKeyDown = false;
  var timer4KeyUp = false;
  var isDownedKeyUp = false;
  var prevCursor = null;
  init();

  function init() {
    // add provided styles
    for (var i = 0; i < options.highlightStyles.length; i++) {
      var s = '__highligtighted__' + totStyleCnt;
      classNames4Styles.push(s);
      totStyleCnt++;
      updateCyStyle(i);
    } // add styles for selected


    addSelectionStyles();
    document.addEventListener("keydown", function (event) {
      if (event.key != "Control" && event.key != "Shift" && event.key != "Meta") {
        return;
      }

      if (event.key == "Control" || event.key == "Meta") {
        ctrlKeyDown = true;
      } else if (event.key == "Shift") {
        shiftKeyDown = true;
      }

      isDownedKeyUp = false;
      clearTimeout(timer4KeyUp);
      timer4KeyUp = setTimeout(callKeyUpManually, 750);

      if (ctrlKeyDown && shiftKeyDown && !marqueeZoomEnabled) {
        instance.enableMarqueeZoom();
        marqueeZoomEnabled = true;
      }
    });
    document.addEventListener("keyup", function (event) {
      if (event.key != "Control" && event.key != "Shift" && event.key != "Meta") {
        return;
      }

      isDownedKeyUp = true;

      if (event.key == "Shift") {
        shiftKeyDown = false;
      } else if (event.key == "Control" || event.key == "Meta") {
        ctrlKeyDown = false;
      }

      if (marqueeZoomEnabled && (!shiftKeyDown || !ctrlKeyDown)) {
        instance.disableMarqueeZoom();
        marqueeZoomEnabled = false;
      }
    });
  } // ctrl + shift + tab does not call keyup after keydown


  function callKeyUpManually() {
    timer4KeyUp = null;

    if (isDownedKeyUp) {
      return;
    }

    setCursor(true);
    isDownedKeyUp = true;
    shiftKeyDown = false;
    ctrlKeyDown = false;

    if (marqueeZoomEnabled) {
      instance.disableMarqueeZoom();
      marqueeZoomEnabled = false;
    }
  }

  function setCursor() {
    var isReturnBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!options.htmlElem4marqueeZoom) {
      return;
    }

    var el = null;

    if (options.htmlElem4marqueeZoom.startsWith('.')) {
      el = document.getElementsByClassName(options.htmlElem4marqueeZoom.substr(1))[0];
    }

    if (options.htmlElem4marqueeZoom.startsWith('#')) {
      el = document.getElementById(options.htmlElem4marqueeZoom.substr(1));
    }

    if (!el) {
      console.log('element not found!');
      return;
    }

    if (isReturnBack) {
      el.style.cursor = prevCursor;
    } else {
      prevCursor = el.style.cursor;

      if (options.marqueeZoomCursor.includes('.')) {
        el.style.cursor = "url('".concat(options.marqueeZoomCursor, "'), pointer");
      } else {
        el.style.cursor = options.marqueeZoomCursor;
      }
    }
  }

  function addSelectionStyles() {
    if (options.selectStyles.node) {
      cy.style().selector('node:selected').css(options.selectStyles.node).update();
    }

    if (options.selectStyles.edge) {
      cy.style().selector('edge:selected').css(options.selectStyles.edge).update();
    }
  }

  function updateCyStyle(classIdx) {
    //alert("here");
    var className = classNames4Styles[classIdx];
    var cssNode = options.highlightStyles[classIdx].node;
    var cssEdge = options.highlightStyles[classIdx].edge;
    console.log("cy", cy.size());
    cy.style().selector('node.' + className).css(cssNode).update();
    cy.style().selector('edge.' + className).css(cssEdge).update();
  } // Helper functions for internal usage (not to be exposed)


  function highlight( cyto,eles, idx) {
    cyto.startBatch();

    console.log("lenght", eles.size());
    for (var i = 0; i < options.highlightStyles.length; i++) {
      eles.removeClass(classNames4Styles[i]);
    }

    eles.addClass(classNames4Styles[idx]);
    console.log("classes", eles.classes());
    cyto.endBatch();
  }

  function getWithNeighbors(eles) {
    return eles.add(eles.descendants()).closedNeighborhood();
  } // the instance to be returned


  var instance = {}; // Section hide-show
  // hide given eles

  instance.hide = function (eles) {
    //eles = eles.filter("node")
    eles = eles.filter(":visible");
    eles = eles.union(eles.connectedEdges());
    eles.unselect();

    if (options.setVisibilityOnHide) {
      eles.css('visibility', 'hidden');
    }

    if (options.setDisplayOnHide) {
      eles.css('display', 'none');

    }

    return eles;
  }; // unhide given eles


  instance.show = function (eles) {
    eles = eles.not(":visible");

    if (options.isShowEdgesBetweenVisibleNodes) {
      var connectedEdges = eles.connectedEdges(function (edge) {
        if ((edge.source().visible() || eles.contains(edge.source())) && (edge.target().visible() || eles.contains(edge.target()))) {
          return true;
        }

        return false;
      });
      eles = eles.union(connectedEdges);
    }

    eles.unselect();

    if (options.setVisibilityOnHide) {
      eles.css('visibility', 'visible');
    }

    if (options.setDisplayOnHide) {
      eles.css('display', 'element');
    }

    return eles;
  }; // Section highlight


  instance.showHiddenNeighbors = function (eles) {
    return this.show(getWithNeighbors(eles));
  }; // Highlights eles


  instance.highlight = function (eles) {
    var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    highlight(eles, idx); // Use the helper here

    return eles;
  };

  instance.getHighlightStyles = function () {
    return options.highlightStyles;
  }; // Highlights eles' neighborhood


  instance.highlightNeighbors = function (eles) {
    var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return this.highlight(getWithNeighbors(eles), idx);
  }; // Remove highlights from eles.
  // If eles is not defined considers cy.elements()


  instance.removeHighlights = function (eles) {
    cy.startBatch();

    if (eles == null || eles.length == null) {
      eles = cy.elements();
    }

    for (var i = 0; i < options.highlightStyles.length; i++) {
      eles.removeClass(classNames4Styles[i]);
    }

    cy.endBatch();
    return eles;
  }; // Indicates if the ele is highlighted


  instance.isHighlighted = function (ele) {
    var isHigh = false;

    for (var i = 0; i < options.highlightStyles.length; i++) {
      if (ele.is('.' + classNames4Styles[i] + ':visible')) {
        isHigh = true;
      }
    }

    return isHigh;
  };

  instance.changeHighlightStyle = function (idx, nodeStyle, edgeStyle) {
    options.highlightStyles[idx].node = nodeStyle;
    options.highlightStyles[idx].edge = edgeStyle;
    updateCyStyle(idx);
    addSelectionStyles();
  };

  instance.addHighlightStyle = function (nodeStyle, edgeStyle) {
    var o = {
      node: nodeStyle,
      edge: edgeStyle
    };
    options.highlightStyles.push(o);
    var s = '__highligtighted__' + totStyleCnt;
    classNames4Styles.push(s);
    totStyleCnt++;
    updateCyStyle(options.highlightStyles.length - 1);
    addSelectionStyles();
  };

  instance.removeHighlightStyle = function (styleIdx) {
    if (styleIdx < 0 || styleIdx > options.highlightStyles.length - 1) {
      return;
    }

    cy.elements().removeClass(classNames4Styles[styleIdx]);
    options.highlightStyles.splice(styleIdx, 1);
    classNames4Styles.splice(styleIdx, 1);
  };

  instance.getAllHighlightClasses = function () {
    var a = [];

    for (var i = 0; i < options.highlightStyles.length; i++) {
      a.push(classNames4Styles[i]);
    }

    return classNames4Styles;
  }; //Zoom selected Nodes


  instance.zoomToSelected = function (eles) {
    var boundingBox = eles.boundingBox();
    var diff_x = Math.abs(boundingBox.x1 - boundingBox.x2);
    var diff_y = Math.abs(boundingBox.y1 - boundingBox.y2);
    var padding;

    if (diff_x >= 200 || diff_y >= 200) {
      padding = 50;
    } else {
      padding = cy.width() < cy.height() ? (200 - diff_x) / 2 * cy.width() / 200 : (200 - diff_y) / 2 * cy.height() / 200;
    }

    cy.animate({
      fit: {
        eles: eles,
        padding: padding
      }
    }, {
      duration: options.zoomAnimationDuration
    });
    return eles;
  }; //Marquee Zoom


  var tabStartHandler;
  var tabEndHandler;

  instance.enableMarqueeZoom = function (callback) {
    setCursor(false);
    marqueeZoomEnabled = true;
    var rect_start_pos_x, rect_start_pos_y, rect_end_pos_x, rect_end_pos_y; //Make the cy unselectable

    cy.autounselectify(true);
    cy.one('tapstart', tabStartHandler = function tabStartHandler(event) {
      if (shiftKeyDown == true) {
        rect_start_pos_x = event.position.x;
        rect_start_pos_y = event.position.y;
        rect_end_pos_x = undefined;
      }
    });
    cy.one('tapend', tabEndHandler = function tabEndHandler(event) {
      rect_end_pos_x = event.position.x;
      rect_end_pos_y = event.position.y; //check whether corners of rectangle is undefined
      //abort marquee zoom if one corner is undefined

      if (rect_start_pos_x == undefined || rect_end_pos_x == undefined) {
        cy.autounselectify(false);

        if (callback) {
          callback();
        }

        return;
      } //Reoder rectangle positions
      //Top left of the rectangle (rect_start_pos_x, rect_start_pos_y)
      //right bottom of the rectangle (rect_end_pos_x, rect_end_pos_y)


      if (rect_start_pos_x > rect_end_pos_x) {
        var temp = rect_start_pos_x;
        rect_start_pos_x = rect_end_pos_x;
        rect_end_pos_x = temp;
      }

      if (rect_start_pos_y > rect_end_pos_y) {
        var temp = rect_start_pos_y;
        rect_start_pos_y = rect_end_pos_y;
        rect_end_pos_y = temp;
      } //Extend sides of selected rectangle to 200px if less than 100px


      if (rect_end_pos_x - rect_start_pos_x < 200) {
        var extendPx = (200 - (rect_end_pos_x - rect_start_pos_x)) / 2;
        rect_start_pos_x -= extendPx;
        rect_end_pos_x += extendPx;
      }

      if (rect_end_pos_y - rect_start_pos_y < 200) {
        var extendPx = (200 - (rect_end_pos_y - rect_start_pos_y)) / 2;
        rect_start_pos_y -= extendPx;
        rect_end_pos_y += extendPx;
      } //Check whether rectangle intersects with bounding box of the graph
      //if not abort marquee zoom


      if (rect_start_pos_x > cy.elements().boundingBox().x2 || rect_end_pos_x < cy.elements().boundingBox().x1 || rect_start_pos_y > cy.elements().boundingBox().y2 || rect_end_pos_y < cy.elements().boundingBox().y1) {
        cy.autounselectify(false);

        if (callback) {
          callback();
        }

        return;
      } //Calculate zoom level


      var zoomLevel = Math.min(cy.width() / Math.abs(rect_end_pos_x - rect_start_pos_x), cy.height() / Math.abs(rect_end_pos_y - rect_start_pos_y));
      var diff_x = cy.width() / 2 - (cy.pan().x + zoomLevel * (rect_start_pos_x + rect_end_pos_x) / 2);
      var diff_y = cy.height() / 2 - (cy.pan().y + zoomLevel * (rect_start_pos_y + rect_end_pos_y) / 2);
      cy.animate({
        panBy: {
          x: diff_x,
          y: diff_y
        },
        zoom: zoomLevel,
        duration: options.zoomAnimationDuration,
        complete: function complete() {
          if (callback) {
            callback();
          }

          cy.autounselectify(false);
        }
      });
    });
  };

  instance.disableMarqueeZoom = function () {
    setCursor(true);
    cy.off('tapstart', tabStartHandler);
    cy.off('tapend', tabEndHandler);
    cy.autounselectify(false);
    marqueeZoomEnabled = false;
  }; //Lasso Mode


  var geometric = __webpack_require__(3);

  instance.changeLassoStyle = function (styleObj) {
    if (styleObj.lineWidth) options.lassoStyle.lineWidth = styleObj.lineWidth;
    if (styleObj.lineColor) options.lassoStyle.lineColor = styleObj.lineColor;
  };

  instance.enableLassoMode = function (callback) {
    var isClicked = false;
    var tempCanv = document.createElement('canvas');
    tempCanv.id = 'lasso-canvas';
    var container = cy.container();
    container.appendChild(tempCanv);
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    tempCanv.width = width;
    tempCanv.height = height;
    tempCanv.setAttribute("style", "z-index: 1000; position: absolute; top: 0; left: 0;");
    cy.panningEnabled(false);
    cy.zoomingEnabled(false);
    cy.autounselectify(true);
    var points = [];

    tempCanv.onclick = function (event) {
      if (isClicked == false) {
        isClicked = true;
        var context = tempCanv.getContext("2d");
        context.strokeStyle = options.lassoStyle.lineColor;
        context.lineWidth = options.lassoStyle.lineWidth;
        context.lineJoin = "round";
        cy.panningEnabled(false);
        cy.zoomingEnabled(false);
        cy.autounselectify(true);
        var formerX = event.offsetX;
        var formerY = event.offsetY;
        points.push([formerX, formerY]);

        tempCanv.onmouseleave = function (e) {
          isClicked = false;
          container.removeChild(tempCanv);
          tempCanv = null;
          cy.panningEnabled(true);
          cy.zoomingEnabled(true);
          cy.autounselectify(false);

          if (callback) {
            callback();
          }
        };

        tempCanv.onmousemove = function (e) {
          context.beginPath();
          points.push([e.offsetX, e.offsetY]);
          context.moveTo(formerX, formerY);
          context.lineTo(e.offsetX, e.offsetY);
          formerX = e.offsetX;
          formerY = e.offsetY;
          context.stroke();
          context.closePath();
        };
      } else {
        var eles = cy.elements();
        points.push(points[0]);

        for (var i = 0; i < eles.length; i++) {
          if (eles[i].isEdge()) {
            var p1 = [eles[i].sourceEndpoint().x * cy.zoom() + cy.pan().x, eles[i].sourceEndpoint().y * cy.zoom() + cy.pan().y];
            var p2 = [eles[i].targetEndpoint().x * cy.zoom() + cy.pan().x, eles[i].targetEndpoint().y * cy.zoom() + cy.pan().y];

            if (geometric.pointInPolygon(p1, points) && geometric.pointInPolygon(p2, points)) {
              eles[i].select();
            }
          } else {
            cy.autounselectify(false);
            var bb = [[eles[i].renderedBoundingBox().x1, eles[i].renderedBoundingBox().y1], [eles[i].renderedBoundingBox().x1, eles[i].renderedBoundingBox().y2], [eles[i].renderedBoundingBox().x2, eles[i].renderedBoundingBox().y2], [eles[i].renderedBoundingBox().x2, eles[i].renderedBoundingBox().y1]];

            if (geometric.polygonIntersectsPolygon(bb, points) || geometric.polygonInPolygon(bb, points) || geometric.polygonInPolygon(points, bb)) {
              eles[i].select();
            }
          }
        }

        isClicked = false;
        container.removeChild(tempCanv);
        tempCanv = null;
        cy.panningEnabled(true);
        cy.zoomingEnabled(true);

        if (callback) {
          callback();
        }
      }
    };
  };

  instance.disableLassoMode = function () {
    var c = document.getElementById('lasso-canvas');

    if (c) {
      c.parentElement.removeChild(c);
      c = null;
    }

    cy.panningEnabled(true);
    cy.zoomingEnabled(true);
    cy.autounselectify(false);
  }; // return the instance


  return instance;
};

module.exports = viewUtilities;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__3__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jeXRvc2NhcGVWaWV3VXRpbGl0aWVzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9jeXRvc2NhcGVWaWV3VXRpbGl0aWVzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2N5dG9zY2FwZVZpZXdVdGlsaXRpZXMvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlVmlld1V0aWxpdGllcy8uL3NyYy91bmRvLXJlZG8uanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlVmlld1V0aWxpdGllcy8uL3NyYy92aWV3LXV0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVWaWV3VXRpbGl0aWVzL2V4dGVybmFsIFwiZ2VvbWV0cmljXCIiXSwibmFtZXMiOlsicmVnaXN0ZXIiLCJjeXRvc2NhcGUiLCJvcHRpb25zIiwiaGlnaGxpZ2h0U3R5bGVzIiwic2VsZWN0U3R5bGVzIiwic2V0VmlzaWJpbGl0eU9uSGlkZSIsInNldERpc3BsYXlPbkhpZGUiLCJ6b29tQW5pbWF0aW9uRHVyYXRpb24iLCJuZWlnaGJvciIsImVsZSIsIm5laWdoYm9yU2VsZWN0VGltZSIsImxhc3NvU3R5bGUiLCJsaW5lQ29sb3IiLCJsaW5lV2lkdGgiLCJodG1sRWxlbTRtYXJxdWVlWm9vbSIsIm1hcnF1ZWVab29tQ3Vyc29yIiwiaXNTaG93RWRnZXNCZXR3ZWVuVmlzaWJsZU5vZGVzIiwidW5kb1JlZG8iLCJyZXF1aXJlIiwidmlld1V0aWxpdGllcyIsIm9wdHMiLCJjeSIsImdldFNjcmF0Y2giLCJlbGVPckN5Iiwic2NyYXRjaCIsImluc3RhbmNlIiwiZXh0ZW5kT3B0aW9ucyIsIm91dCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJvYmoiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIkFycmF5IiwiaXNBcnJheSIsInNsaWNlIiwidXIiLCJpbml0aWFsaXplZCIsInNoaWZ0S2V5RG93biIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwib24iLCJ0YXJnZXQiLCJjeVRhcmdldCIsInRhcGhlbGQiLCJuZWlnaGJvcmhvb2QiLCJ0aW1lb3V0Iiwic2V0VGltZW91dCIsImVsZW1lbnRzIiwidW5zZWxlY3QiLCJzZWxlY3QiLCJsb2NrIiwidW5zZWxlY3RpZnkiLCJvbmUiLCJzZWxlY3RpZnkiLCJ1bmxvY2siLCJjbGVhclRpbWVvdXQiLCJlIiwidGFyZ2V0RHJhZ2dlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJoaWdobGlnaHRVUiIsImdldFN0YXR1cyIsImVsZXMiLCJjbGFzc2VzIiwiZ2V0QWxsSGlnaGxpZ2h0Q2xhc3NlcyIsInIiLCJwdXNoIiwiZmlsdGVyIiwic2VsZWN0b3IiLCJtYXAiLCJ4Iiwiam9pbiIsIm5vdCIsImdlbmVyYWxVbmRvIiwiYXJncyIsImN1cnJlbnQiLCJoaWdobGlnaHQiLCJyZW1vdmVIaWdobGlnaHRzIiwiZ2VuZXJhbFJlZG8iLCJnZW5lcmF0ZURvRnVuYyIsImZ1bmMiLCJyZXMiLCJmaXJzdFRpbWUiLCJpZHgiLCJhY3Rpb24iLCJoaWRlU2hvd1VSIiwidXJTaG93Iiwic2hvdyIsInVySGlkZSIsImhpZGUiLCJ1clNob3dIaWRkZW5OZWlnaGJvcnMiLCJzaG93SGlkZGVuTmVpZ2hib3JzIiwiY2xhc3NOYW1lczRTdHlsZXMiLCJ0b3RTdHlsZUNudCIsIm1hcnF1ZWVab29tRW5hYmxlZCIsImN0cmxLZXlEb3duIiwidGltZXI0S2V5VXAiLCJpc0Rvd25lZEtleVVwIiwicHJldkN1cnNvciIsImluaXQiLCJzIiwidXBkYXRlQ3lTdHlsZSIsImFkZFNlbGVjdGlvblN0eWxlcyIsImNhbGxLZXlVcE1hbnVhbGx5IiwiZW5hYmxlTWFycXVlZVpvb20iLCJkaXNhYmxlTWFycXVlZVpvb20iLCJzZXRDdXJzb3IiLCJpc1JldHVybkJhY2siLCJlbCIsInN0YXJ0c1dpdGgiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwic3Vic3RyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjb25zb2xlIiwibG9nIiwic3R5bGUiLCJjdXJzb3IiLCJpbmNsdWRlcyIsIm5vZGUiLCJjc3MiLCJ1cGRhdGUiLCJlZGdlIiwiY2xhc3NJZHgiLCJjbGFzc05hbWUiLCJjc3NOb2RlIiwiY3NzRWRnZSIsInN0YXJ0QmF0Y2giLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZW5kQmF0Y2giLCJnZXRXaXRoTmVpZ2hib3JzIiwiYWRkIiwiZGVzY2VuZGFudHMiLCJjbG9zZWROZWlnaGJvcmhvb2QiLCJ1bmlvbiIsImNvbm5lY3RlZEVkZ2VzIiwic291cmNlIiwidmlzaWJsZSIsImNvbnRhaW5zIiwiZ2V0SGlnaGxpZ2h0U3R5bGVzIiwiaGlnaGxpZ2h0TmVpZ2hib3JzIiwiaXNIaWdobGlnaHRlZCIsImlzSGlnaCIsImlzIiwiY2hhbmdlSGlnaGxpZ2h0U3R5bGUiLCJub2RlU3R5bGUiLCJlZGdlU3R5bGUiLCJhZGRIaWdobGlnaHRTdHlsZSIsIm8iLCJyZW1vdmVIaWdobGlnaHRTdHlsZSIsInN0eWxlSWR4Iiwic3BsaWNlIiwiYSIsInpvb21Ub1NlbGVjdGVkIiwiYm91bmRpbmdCb3giLCJkaWZmX3giLCJNYXRoIiwiYWJzIiwieDEiLCJ4MiIsImRpZmZfeSIsInkxIiwieTIiLCJwYWRkaW5nIiwid2lkdGgiLCJoZWlnaHQiLCJhbmltYXRlIiwiZml0IiwiZHVyYXRpb24iLCJ0YWJTdGFydEhhbmRsZXIiLCJ0YWJFbmRIYW5kbGVyIiwiY2FsbGJhY2siLCJyZWN0X3N0YXJ0X3Bvc194IiwicmVjdF9zdGFydF9wb3NfeSIsInJlY3RfZW5kX3Bvc194IiwicmVjdF9lbmRfcG9zX3kiLCJhdXRvdW5zZWxlY3RpZnkiLCJwb3NpdGlvbiIsInkiLCJ1bmRlZmluZWQiLCJ0ZW1wIiwiZXh0ZW5kUHgiLCJ6b29tTGV2ZWwiLCJtaW4iLCJwYW4iLCJwYW5CeSIsInpvb20iLCJjb21wbGV0ZSIsIm9mZiIsImdlb21ldHJpYyIsImNoYW5nZUxhc3NvU3R5bGUiLCJzdHlsZU9iaiIsImVuYWJsZUxhc3NvTW9kZSIsImlzQ2xpY2tlZCIsInRlbXBDYW52IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiY29udGFpbmVyIiwiYXBwZW5kQ2hpbGQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsInNldEF0dHJpYnV0ZSIsInBhbm5pbmdFbmFibGVkIiwiem9vbWluZ0VuYWJsZWQiLCJwb2ludHMiLCJvbmNsaWNrIiwiY29udGV4dCIsImdldENvbnRleHQiLCJzdHJva2VTdHlsZSIsImxpbmVKb2luIiwiZm9ybWVyWCIsIm9mZnNldFgiLCJmb3JtZXJZIiwib2Zmc2V0WSIsIm9ubW91c2VsZWF2ZSIsInJlbW92ZUNoaWxkIiwib25tb3VzZW1vdmUiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJjbG9zZVBhdGgiLCJpc0VkZ2UiLCJwMSIsInNvdXJjZUVuZHBvaW50IiwicDIiLCJ0YXJnZXRFbmRwb2ludCIsInBvaW50SW5Qb2x5Z29uIiwiYmIiLCJyZW5kZXJlZEJvdW5kaW5nQm94IiwicG9seWdvbkludGVyc2VjdHNQb2x5Z29uIiwicG9seWdvbkluUG9seWdvbiIsImRpc2FibGVMYXNzb01vZGUiLCJjIiwicGFyZW50RWxlbWVudCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7OztBQ2xGQTs7QUFDQSxDQUFDLFlBQVk7QUFDWCxlQURXLENBR1g7O0FBQ0EsTUFBSUEsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBVUMsU0FBVixFQUFxQjtBQUVsQyxRQUFJLENBQUNBLFNBQUwsRUFBZ0I7QUFDZDtBQUNELEtBSmlDLENBSWhDOzs7QUFFRixRQUFJQyxPQUFPLEdBQUc7QUFDWkMscUJBQWUsRUFBRSxFQURMO0FBRVpDLGtCQUFZLEVBQUUsRUFGRjtBQUdaQyx5QkFBbUIsRUFBRSxLQUhUO0FBR2dCO0FBQzVCQyxzQkFBZ0IsRUFBRSxJQUpOO0FBSVk7QUFDeEJDLDJCQUFxQixFQUFFLElBTFg7QUFLaUI7QUFDN0JDLGNBQVEsRUFBRSxrQkFBVUMsR0FBVixFQUFlO0FBQUU7QUFDekIsZUFBTyxLQUFQO0FBQ0QsT0FSVztBQVNaQyx3QkFBa0IsRUFBRSxHQVRSO0FBU2E7QUFDekJDLGdCQUFVLEVBQUU7QUFBRUMsaUJBQVMsRUFBRSxTQUFiO0FBQXdCQyxpQkFBUyxFQUFFO0FBQW5DLE9BVkE7QUFXWkMsMEJBQW9CLEVBQUUsRUFYVjtBQVdjO0FBQzFCQyx1QkFBaUIsRUFBRSxXQVpQO0FBWW9CO0FBQ2hDQyxvQ0FBOEIsRUFBRSxJQWJwQixDQWF5Qjs7QUFiekIsS0FBZDs7QUFnQkEsUUFBSUMsUUFBUSxHQUFHQyxtQkFBTyxDQUFDLENBQUQsQ0FBdEI7O0FBQ0EsUUFBSUMsYUFBYSxHQUFHRCxtQkFBTyxDQUFDLENBQUQsQ0FBM0I7O0FBRUFqQixhQUFTLENBQUMsTUFBRCxFQUFTLGVBQVQsRUFBMEIsVUFBVW1CLElBQVYsRUFBZ0I7QUFDakQsVUFBSUMsRUFBRSxHQUFHLElBQVQ7O0FBRUEsZUFBU0MsVUFBVCxDQUFvQkMsT0FBcEIsRUFBNkI7QUFDM0IsWUFBSSxDQUFDQSxPQUFPLENBQUNDLE9BQVIsQ0FBZ0IsZ0JBQWhCLENBQUwsRUFBd0M7QUFDdENELGlCQUFPLENBQUNDLE9BQVIsQ0FBZ0IsZ0JBQWhCLEVBQWtDLEVBQWxDO0FBQ0Q7O0FBRUQsZUFBT0QsT0FBTyxDQUFDQyxPQUFSLENBQWdCLGdCQUFoQixDQUFQO0FBQ0QsT0FUZ0QsQ0FXakQ7OztBQUNBLFVBQUlKLElBQUksS0FBSyxLQUFiLEVBQW9CO0FBQ2xCLGVBQU9FLFVBQVUsQ0FBQ0QsRUFBRCxDQUFWLENBQWVJLFFBQXRCO0FBQ0Q7QUFFRDs7Ozs7Ozs7QUFNQSxlQUFTQyxhQUFULENBQXVCQyxHQUF2QixFQUE0QjtBQUMxQkEsV0FBRyxHQUFHQSxHQUFHLElBQUksRUFBYjs7QUFFQSxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdDLFNBQVMsQ0FBQ0MsTUFBOUIsRUFBc0NGLENBQUMsRUFBdkMsRUFBMkM7QUFDekMsY0FBSUcsR0FBRyxHQUFHRixTQUFTLENBQUNELENBQUQsQ0FBbkI7QUFFQSxjQUFJLENBQUNHLEdBQUwsRUFDRTs7QUFFRixlQUFLLElBQUlDLEdBQVQsSUFBZ0JELEdBQWhCLEVBQXFCO0FBQ25CLGdCQUFJQSxHQUFHLENBQUNFLGNBQUosQ0FBbUJELEdBQW5CLENBQUosRUFBNkI7QUFDM0Isa0JBQUlFLEtBQUssQ0FBQ0MsT0FBTixDQUFjSixHQUFHLENBQUNDLEdBQUQsQ0FBakIsQ0FBSixFQUE2QjtBQUMzQkwsbUJBQUcsQ0FBQ0ssR0FBRCxDQUFILEdBQVdELEdBQUcsQ0FBQ0MsR0FBRCxDQUFILENBQVNJLEtBQVQsRUFBWDtBQUNELGVBRkQsTUFFTyxJQUFJLFFBQU9MLEdBQUcsQ0FBQ0MsR0FBRCxDQUFWLE1BQW9CLFFBQXhCLEVBQWtDO0FBQ3ZDTCxtQkFBRyxDQUFDSyxHQUFELENBQUgsR0FBV04sYUFBYSxDQUFDQyxHQUFHLENBQUNLLEdBQUQsQ0FBSixFQUFXRCxHQUFHLENBQUNDLEdBQUQsQ0FBZCxDQUF4QjtBQUNELGVBRk0sTUFFQTtBQUNMTCxtQkFBRyxDQUFDSyxHQUFELENBQUgsR0FBV0QsR0FBRyxDQUFDQyxHQUFELENBQWQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxlQUFPTCxHQUFQO0FBQ0Q7O0FBQUE7QUFFRHpCLGFBQU8sR0FBR3dCLGFBQWEsQ0FBQyxFQUFELEVBQUt4QixPQUFMLEVBQWNrQixJQUFkLENBQXZCLENBL0NpRCxDQWlEakQ7O0FBQ0EsVUFBSUssUUFBUSxHQUFHTixhQUFhLENBQUNFLEVBQUQsRUFBS25CLE9BQUwsQ0FBNUI7O0FBRUEsVUFBSW1CLEVBQUUsQ0FBQ0osUUFBUCxFQUFpQjtBQUNmLFlBQUlvQixFQUFFLEdBQUdoQixFQUFFLENBQUNKLFFBQUgsQ0FBWSxJQUFaLEVBQWtCLElBQWxCLENBQVQ7QUFDQUEsZ0JBQVEsQ0FBQ0ksRUFBRCxFQUFLZ0IsRUFBTCxFQUFTWixRQUFULENBQVI7QUFDRCxPQXZEZ0QsQ0F5RGpEOzs7QUFDQUgsZ0JBQVUsQ0FBQ0QsRUFBRCxDQUFWLENBQWVJLFFBQWYsR0FBMEJBLFFBQTFCOztBQUVBLFVBQUksQ0FBQ0gsVUFBVSxDQUFDRCxFQUFELENBQVYsQ0FBZWlCLFdBQXBCLEVBQWlDO0FBQy9CaEIsa0JBQVUsQ0FBQ0QsRUFBRCxDQUFWLENBQWVpQixXQUFmLEdBQTZCLElBQTdCO0FBRUEsWUFBSUMsWUFBWSxHQUFHLEtBQW5CO0FBQ0FDLGdCQUFRLENBQUNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFVBQVVDLEtBQVYsRUFBaUI7QUFDcEQsY0FBSUEsS0FBSyxDQUFDVixHQUFOLElBQWEsT0FBakIsRUFBMEI7QUFDeEJPLHdCQUFZLEdBQUcsSUFBZjtBQUNEO0FBQ0YsU0FKRDtBQUtBQyxnQkFBUSxDQUFDQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFVQyxLQUFWLEVBQWlCO0FBQ2xELGNBQUlBLEtBQUssQ0FBQ1YsR0FBTixJQUFhLE9BQWpCLEVBQTBCO0FBQ3hCTyx3QkFBWSxHQUFHLEtBQWY7QUFDRDtBQUNGLFNBSkQsRUFUK0IsQ0FjL0I7O0FBQ0FsQixVQUFFLENBQUNzQixFQUFILENBQU0sU0FBTixFQUFpQixZQUFqQixFQUErQixVQUFVRCxLQUFWLEVBQWlCO0FBQzlDLGNBQUlFLE1BQU0sR0FBR0YsS0FBSyxDQUFDRSxNQUFOLElBQWdCRixLQUFLLENBQUNHLFFBQW5DO0FBQ0EsY0FBSUMsT0FBTyxHQUFHLEtBQWQ7QUFDQSxjQUFJQyxZQUFKO0FBQ0EsY0FBSUMsT0FBTyxHQUFHQyxVQUFVLENBQUMsWUFBWTtBQUNuQyxnQkFBSVYsWUFBSixFQUFrQjtBQUNoQmxCLGdCQUFFLENBQUM2QixRQUFILEdBQWNDLFFBQWQ7QUFDQUosMEJBQVksR0FBRzdDLE9BQU8sQ0FBQ00sUUFBUixDQUFpQm9DLE1BQWpCLENBQWY7QUFDQSxrQkFBSUcsWUFBSixFQUNFQSxZQUFZLENBQUNLLE1BQWI7QUFDRlIsb0JBQU0sQ0FBQ1MsSUFBUCxHQUxnQixDQU9oQjtBQUNBO0FBQ0E7O0FBQ0FULG9CQUFNLENBQUNVLFdBQVAsR0FWZ0IsQ0FZaEI7QUFDQTtBQUNBOztBQUNBUixxQkFBTyxHQUFHLElBQVY7QUFDRDtBQUNGLFdBbEJ1QixFQWtCckI1QyxPQUFPLENBQUNRLGtCQUFSLEdBQTZCLEdBbEJSLENBQXhCLENBSjhDLENBd0I5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBVyxZQUFFLENBQUNrQyxHQUFILENBQU8sUUFBUCxFQUFpQixZQUFZO0FBQzNCLGdCQUFJVCxPQUFKLEVBQWE7QUFDWEcsd0JBQVUsQ0FBQyxZQUFZO0FBQ3JCTCxzQkFBTSxDQUFDWSxTQUFQO0FBQ0FaLHNCQUFNLENBQUNhLE1BQVA7QUFDQVgsdUJBQU8sR0FBRyxLQUFWO0FBQ0QsZUFKUyxFQUlQLEdBSk8sQ0FBVjtBQUtELGFBTkQsTUFPSztBQUNIWSwwQkFBWSxDQUFDVixPQUFELENBQVo7QUFDRDtBQUNGLFdBWEQ7QUFhQTNCLFlBQUUsQ0FBQ2tDLEdBQUgsQ0FBTyxNQUFQLEVBQWUsTUFBZixFQUF1QixVQUFVSSxDQUFWLEVBQWE7QUFDbEMsZ0JBQUlDLGFBQWEsR0FBR0QsQ0FBQyxDQUFDZixNQUFGLElBQVllLENBQUMsQ0FBQ2QsUUFBbEM7O0FBQ0EsZ0JBQUlELE1BQU0sSUFBSWdCLGFBQVYsSUFBMkJkLE9BQU8sS0FBSyxLQUEzQyxFQUFrRDtBQUNoRFksMEJBQVksQ0FBQ1YsT0FBRCxDQUFaO0FBQ0Q7QUFDRixXQUxEO0FBTUQsU0FoREQ7QUFpREQsT0E1SGdELENBOEhqRDs7O0FBQ0EsYUFBTzFCLFVBQVUsQ0FBQ0QsRUFBRCxDQUFWLENBQWVJLFFBQXRCO0FBQ0QsS0FoSVEsQ0FBVDtBQWtJRCxHQTNKRDs7QUE2SkEsTUFBSSxTQUFpQ29DLE1BQU0sQ0FBQ0MsT0FBNUMsRUFBcUQ7QUFBRTtBQUNyREQsVUFBTSxDQUFDQyxPQUFQLEdBQWlCOUQsUUFBakI7QUFDRDs7QUFFRCxNQUFJLElBQUosRUFBaUQ7QUFBRTtBQUNqRCtELHVDQUFtQyxZQUFZO0FBQzdDLGFBQU8vRCxRQUFQO0FBQ0QsS0FGSztBQUFBLG9HQUFOO0FBR0Q7O0FBRUQsTUFBSSxPQUFPQyxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBQUU7QUFDdENELFlBQVEsQ0FBQ0MsU0FBRCxDQUFSO0FBQ0Q7QUFFRixDQS9LRCxJOzs7Ozs7QUNEQTtBQUNBLFNBQVMrRCxXQUFULENBQXFCM0MsRUFBckIsRUFBeUJnQixFQUF6QixFQUE2QmxCLGFBQTdCLEVBQTRDO0FBQzFDLFdBQVM4QyxTQUFULENBQW1CQyxJQUFuQixFQUF5QjtBQUN2QkEsUUFBSSxHQUFHQSxJQUFJLEdBQUdBLElBQUgsR0FBVTdDLEVBQUUsQ0FBQzZCLFFBQUgsRUFBckI7QUFDQSxRQUFJaUIsT0FBTyxHQUFHaEQsYUFBYSxDQUFDaUQsc0JBQWQsRUFBZDtBQUNBLFFBQUlDLENBQUMsR0FBRyxFQUFSOztBQUNBLFNBQUssSUFBSXpDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd1QyxPQUFPLENBQUNyQyxNQUE1QixFQUFvQ0YsQ0FBQyxFQUFyQyxFQUF5QztBQUN2Q3lDLE9BQUMsQ0FBQ0MsSUFBRixDQUFPSixJQUFJLENBQUNLLE1BQUwsWUFBZ0JKLE9BQU8sQ0FBQ3ZDLENBQUQsQ0FBdkIsY0FBUDtBQUNEOztBQUNELFFBQUk0QyxRQUFRLEdBQUdMLE9BQU8sQ0FBQ00sR0FBUixDQUFZLFVBQUFDLENBQUM7QUFBQSxhQUFJLE1BQU1BLENBQVY7QUFBQSxLQUFiLEVBQTBCQyxJQUExQixDQUErQixHQUEvQixDQUFmLENBUHVCLENBUXZCOztBQUNBTixLQUFDLENBQUNDLElBQUYsQ0FBT0osSUFBSSxDQUFDSyxNQUFMLENBQVksVUFBWixFQUF3QkssR0FBeEIsQ0FBNEJKLFFBQTVCLENBQVA7QUFFQSxXQUFPSCxDQUFQO0FBQ0Q7O0FBRUQsV0FBU1EsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDekIsUUFBSUMsT0FBTyxHQUFHRCxJQUFJLENBQUNDLE9BQW5CO0FBQ0EsUUFBSVYsQ0FBQyxHQUFHLEVBQVI7O0FBQ0EsU0FBSyxJQUFJekMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2tELElBQUksQ0FBQ2hELE1BQUwsR0FBYyxDQUFsQyxFQUFxQ0YsQ0FBQyxFQUF0QyxFQUEwQztBQUN4Q3lDLE9BQUMsQ0FBQ0MsSUFBRixDQUFPbkQsYUFBYSxDQUFDNkQsU0FBZCxDQUF3QkYsSUFBSSxDQUFDbEQsQ0FBRCxDQUE1QixFQUFpQ0EsQ0FBakMsQ0FBUDtBQUNELEtBTHdCLENBTXpCOzs7QUFDQXlDLEtBQUMsQ0FBQ0MsSUFBRixDQUFPbkQsYUFBYSxDQUFDOEQsZ0JBQWQsQ0FBK0JILElBQUksQ0FBQ0EsSUFBSSxDQUFDaEQsTUFBTCxHQUFjLENBQWYsQ0FBbkMsQ0FBUDtBQUVBdUMsS0FBQyxDQUFDLFNBQUQsQ0FBRCxHQUFlVSxPQUFmO0FBQ0EsV0FBT1YsQ0FBUDtBQUNEOztBQUVELFdBQVNhLFdBQVQsQ0FBcUJKLElBQXJCLEVBQTJCO0FBQ3pCLFFBQUlDLE9BQU8sR0FBR0QsSUFBSSxDQUFDQyxPQUFuQjtBQUNBLFFBQUlWLENBQUMsR0FBRyxFQUFSOztBQUNBLFNBQUssSUFBSXpDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdtRCxPQUFPLENBQUNqRCxNQUFSLEdBQWlCLENBQXJDLEVBQXdDRixDQUFDLEVBQXpDLEVBQTZDO0FBQzNDeUMsT0FBQyxDQUFDQyxJQUFGLENBQU9uRCxhQUFhLENBQUM2RCxTQUFkLENBQXdCRCxPQUFPLENBQUNuRCxDQUFELENBQS9CLEVBQW9DQSxDQUFwQyxDQUFQO0FBQ0QsS0FMd0IsQ0FNekI7OztBQUNBeUMsS0FBQyxDQUFDQyxJQUFGLENBQU9uRCxhQUFhLENBQUM4RCxnQkFBZCxDQUErQkYsT0FBTyxDQUFDQSxPQUFPLENBQUNqRCxNQUFSLEdBQWlCLENBQWxCLENBQXRDLENBQVA7QUFFQXVDLEtBQUMsQ0FBQyxTQUFELENBQUQsR0FBZVUsT0FBZjtBQUNBLFdBQU9WLENBQVA7QUFDRDs7QUFFRCxXQUFTYyxjQUFULENBQXdCQyxJQUF4QixFQUE4QjtBQUM1QixXQUFPLFVBQVVOLElBQVYsRUFBZ0I7QUFDckIsVUFBSU8sR0FBRyxHQUFHcEIsU0FBUyxFQUFuQjtBQUNBLFVBQUlhLElBQUksQ0FBQ1EsU0FBVCxFQUNFbkUsYUFBYSxDQUFDaUUsSUFBRCxDQUFiLENBQW9CTixJQUFJLENBQUNaLElBQXpCLEVBQStCWSxJQUFJLENBQUNTLEdBQXBDLEVBREYsS0FHRUwsV0FBVyxDQUFDSixJQUFELENBQVg7QUFFRk8sU0FBRyxDQUFDTixPQUFKLEdBQWNkLFNBQVMsRUFBdkI7QUFFQSxhQUFPb0IsR0FBUDtBQUNELEtBVkQ7QUFXRDs7QUFFRGhELElBQUUsQ0FBQ21ELE1BQUgsQ0FBVSxvQkFBVixFQUFnQ0wsY0FBYyxDQUFDLG9CQUFELENBQTlDLEVBQXNFTixXQUF0RTtBQUNBeEMsSUFBRSxDQUFDbUQsTUFBSCxDQUFVLFdBQVYsRUFBdUJMLGNBQWMsQ0FBQyxXQUFELENBQXJDLEVBQW9ETixXQUFwRDtBQUNBeEMsSUFBRSxDQUFDbUQsTUFBSCxDQUFVLGtCQUFWLEVBQThCTCxjQUFjLENBQUMsa0JBQUQsQ0FBNUMsRUFBa0VOLFdBQWxFO0FBQ0QsQyxDQUVEOzs7QUFDQSxTQUFTWSxVQUFULENBQW9CcEUsRUFBcEIsRUFBd0JnQixFQUF4QixFQUE0QmxCLGFBQTVCLEVBQTJDO0FBQ3pDLFdBQVN1RSxNQUFULENBQWdCeEIsSUFBaEIsRUFBc0I7QUFDcEIsV0FBTy9DLGFBQWEsQ0FBQ3dFLElBQWQsQ0FBbUJ6QixJQUFuQixDQUFQO0FBQ0Q7O0FBRUQsV0FBUzBCLE1BQVQsQ0FBZ0IxQixJQUFoQixFQUFzQjtBQUNwQixXQUFPL0MsYUFBYSxDQUFDMEUsSUFBZCxDQUFtQjNCLElBQW5CLENBQVA7QUFDRDs7QUFFRCxXQUFTNEIscUJBQVQsQ0FBK0I1QixJQUEvQixFQUFxQztBQUNuQyxXQUFPL0MsYUFBYSxDQUFDNEUsbUJBQWQsQ0FBa0M3QixJQUFsQyxDQUFQO0FBQ0Q7O0FBRUQ3QixJQUFFLENBQUNtRCxNQUFILENBQVUsTUFBVixFQUFrQkUsTUFBbEIsRUFBMEJFLE1BQTFCO0FBQ0F2RCxJQUFFLENBQUNtRCxNQUFILENBQVUsTUFBVixFQUFrQkksTUFBbEIsRUFBMEJGLE1BQTFCO0FBQ0FyRCxJQUFFLENBQUNtRCxNQUFILENBQVUscUJBQVYsRUFBZ0NNLHFCQUFoQyxFQUF1REYsTUFBdkQ7QUFDRDs7QUFFRC9CLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFVekMsRUFBVixFQUFjZ0IsRUFBZCxFQUFrQmxCLGFBQWxCLEVBQWlDO0FBQ2hENkMsYUFBVyxDQUFDM0MsRUFBRCxFQUFLZ0IsRUFBTCxFQUFTbEIsYUFBVCxDQUFYO0FBQ0FzRSxZQUFVLENBQUNwRSxFQUFELEVBQUtnQixFQUFMLEVBQVNsQixhQUFULENBQVY7QUFDRCxDQUhELEM7Ozs7OztBQ2hGQSxJQUFJQSxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQVVFLEVBQVYsRUFBY25CLE9BQWQsRUFBdUI7QUFFekMsTUFBSThGLGlCQUFpQixHQUFHLEVBQXhCLENBRnlDLENBR3pDOztBQUNBLE1BQUlDLFdBQVcsR0FBRyxDQUFsQjtBQUNBLE1BQUlDLGtCQUFrQixHQUFHLEtBQXpCO0FBQ0EsTUFBSTNELFlBQVksR0FBRyxLQUFuQjtBQUNBLE1BQUk0RCxXQUFXLEdBQUcsS0FBbEI7QUFDQSxNQUFJQyxXQUFXLEdBQUcsS0FBbEI7QUFDQSxNQUFJQyxhQUFhLEdBQUcsS0FBcEI7QUFDQSxNQUFJQyxVQUFVLEdBQUcsSUFBakI7QUFDQUMsTUFBSTs7QUFDSixXQUFTQSxJQUFULEdBQWdCO0FBQ2Q7QUFDQSxTQUFLLElBQUkzRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMUIsT0FBTyxDQUFDQyxlQUFSLENBQXdCMkIsTUFBNUMsRUFBb0RGLENBQUMsRUFBckQsRUFBeUQ7QUFDdkQsVUFBSTRFLENBQUMsR0FBRyx1QkFBdUJQLFdBQS9CO0FBQ0FELHVCQUFpQixDQUFDMUIsSUFBbEIsQ0FBdUJrQyxDQUF2QjtBQUNBUCxpQkFBVztBQUNYUSxtQkFBYSxDQUFDN0UsQ0FBRCxDQUFiO0FBQ0QsS0FQYSxDQVNkOzs7QUFDQThFLHNCQUFrQjtBQUVsQmxFLFlBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsVUFBVUMsS0FBVixFQUFpQjtBQUNwRCxVQUFJQSxLQUFLLENBQUNWLEdBQU4sSUFBYSxTQUFiLElBQTBCVSxLQUFLLENBQUNWLEdBQU4sSUFBYSxPQUF2QyxJQUFrRFUsS0FBSyxDQUFDVixHQUFOLElBQWEsTUFBbkUsRUFBMkU7QUFDekU7QUFDRDs7QUFFRCxVQUFJVSxLQUFLLENBQUNWLEdBQU4sSUFBYSxTQUFiLElBQTBCVSxLQUFLLENBQUNWLEdBQU4sSUFBYSxNQUEzQyxFQUFtRDtBQUNqRG1FLG1CQUFXLEdBQUcsSUFBZDtBQUNELE9BRkQsTUFHSyxJQUFJekQsS0FBSyxDQUFDVixHQUFOLElBQWEsT0FBakIsRUFBMEI7QUFDN0JPLG9CQUFZLEdBQUcsSUFBZjtBQUNEOztBQUNEOEQsbUJBQWEsR0FBRyxLQUFoQjtBQUNBM0Msa0JBQVksQ0FBQzBDLFdBQUQsQ0FBWjtBQUNBQSxpQkFBVyxHQUFHbkQsVUFBVSxDQUFDMEQsaUJBQUQsRUFBb0IsR0FBcEIsQ0FBeEI7O0FBQ0EsVUFBSVIsV0FBVyxJQUFJNUQsWUFBZixJQUErQixDQUFDMkQsa0JBQXBDLEVBQXdEO0FBQ3REekUsZ0JBQVEsQ0FBQ21GLGlCQUFUO0FBQ0FWLDBCQUFrQixHQUFHLElBQXJCO0FBQ0Q7QUFDRixLQWxCRDtBQW9CQTFELFlBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBVUMsS0FBVixFQUFpQjtBQUNsRCxVQUFJQSxLQUFLLENBQUNWLEdBQU4sSUFBYSxTQUFiLElBQTBCVSxLQUFLLENBQUNWLEdBQU4sSUFBYSxPQUF2QyxJQUFrRFUsS0FBSyxDQUFDVixHQUFOLElBQWEsTUFBbkUsRUFBMkU7QUFDekU7QUFDRDs7QUFDRHFFLG1CQUFhLEdBQUcsSUFBaEI7O0FBQ0EsVUFBSTNELEtBQUssQ0FBQ1YsR0FBTixJQUFhLE9BQWpCLEVBQTBCO0FBQ3hCTyxvQkFBWSxHQUFHLEtBQWY7QUFDRCxPQUZELE1BR0ssSUFBSUcsS0FBSyxDQUFDVixHQUFOLElBQWEsU0FBYixJQUEwQlUsS0FBSyxDQUFDVixHQUFOLElBQWEsTUFBM0MsRUFBbUQ7QUFDdERtRSxtQkFBVyxHQUFHLEtBQWQ7QUFDRDs7QUFDRCxVQUFJRCxrQkFBa0IsS0FBSyxDQUFDM0QsWUFBRCxJQUFpQixDQUFDNEQsV0FBdkIsQ0FBdEIsRUFBMkQ7QUFDekQxRSxnQkFBUSxDQUFDb0Ysa0JBQVQ7QUFDQVgsMEJBQWtCLEdBQUcsS0FBckI7QUFDRDtBQUNGLEtBZkQ7QUFpQkQsR0E3RHdDLENBK0R6Qzs7O0FBQ0EsV0FBU1MsaUJBQVQsR0FBNkI7QUFDM0JQLGVBQVcsR0FBRyxJQUFkOztBQUNBLFFBQUlDLGFBQUosRUFBbUI7QUFDakI7QUFDRDs7QUFDRFMsYUFBUyxDQUFDLElBQUQsQ0FBVDtBQUNBVCxpQkFBYSxHQUFHLElBQWhCO0FBQ0E5RCxnQkFBWSxHQUFHLEtBQWY7QUFDQTRELGVBQVcsR0FBRyxLQUFkOztBQUNBLFFBQUlELGtCQUFKLEVBQXdCO0FBQ3RCekUsY0FBUSxDQUFDb0Ysa0JBQVQ7QUFDQVgsd0JBQWtCLEdBQUcsS0FBckI7QUFDRDtBQUNGOztBQUVELFdBQVNZLFNBQVQsR0FBeUM7QUFBQSxRQUF0QkMsWUFBc0IsdUVBQVAsS0FBTzs7QUFDdkMsUUFBSSxDQUFDN0csT0FBTyxDQUFDWSxvQkFBYixFQUFtQztBQUNqQztBQUNEOztBQUNELFFBQUlrRyxFQUFFLEdBQUcsSUFBVDs7QUFDQSxRQUFJOUcsT0FBTyxDQUFDWSxvQkFBUixDQUE2Qm1HLFVBQTdCLENBQXdDLEdBQXhDLENBQUosRUFBa0Q7QUFDaERELFFBQUUsR0FBR3hFLFFBQVEsQ0FBQzBFLHNCQUFULENBQWdDaEgsT0FBTyxDQUFDWSxvQkFBUixDQUE2QnFHLE1BQTdCLENBQW9DLENBQXBDLENBQWhDLEVBQXdFLENBQXhFLENBQUw7QUFDRDs7QUFDRCxRQUFJakgsT0FBTyxDQUFDWSxvQkFBUixDQUE2Qm1HLFVBQTdCLENBQXdDLEdBQXhDLENBQUosRUFBa0Q7QUFDaERELFFBQUUsR0FBR3hFLFFBQVEsQ0FBQzRFLGNBQVQsQ0FBd0JsSCxPQUFPLENBQUNZLG9CQUFSLENBQTZCcUcsTUFBN0IsQ0FBb0MsQ0FBcEMsQ0FBeEIsQ0FBTDtBQUNEOztBQUNELFFBQUksQ0FBQ0gsRUFBTCxFQUFTO0FBQ1BLLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFaO0FBQ0E7QUFDRDs7QUFDRCxRQUFJUCxZQUFKLEVBQWtCO0FBQ2hCQyxRQUFFLENBQUNPLEtBQUgsQ0FBU0MsTUFBVCxHQUFrQmxCLFVBQWxCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xBLGdCQUFVLEdBQUdVLEVBQUUsQ0FBQ08sS0FBSCxDQUFTQyxNQUF0Qjs7QUFDQSxVQUFJdEgsT0FBTyxDQUFDYSxpQkFBUixDQUEwQjBHLFFBQTFCLENBQW1DLEdBQW5DLENBQUosRUFBNkM7QUFDM0NULFVBQUUsQ0FBQ08sS0FBSCxDQUFTQyxNQUFULGtCQUEwQnRILE9BQU8sQ0FBQ2EsaUJBQWxDO0FBQ0QsT0FGRCxNQUVPO0FBQ0xpRyxVQUFFLENBQUNPLEtBQUgsQ0FBU0MsTUFBVCxHQUFrQnRILE9BQU8sQ0FBQ2EsaUJBQTFCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFdBQVMyRixrQkFBVCxHQUE4QjtBQUM1QixRQUFJeEcsT0FBTyxDQUFDRSxZQUFSLENBQXFCc0gsSUFBekIsRUFBK0I7QUFDN0JyRyxRQUFFLENBQUNrRyxLQUFILEdBQVcvQyxRQUFYLENBQW9CLGVBQXBCLEVBQXFDbUQsR0FBckMsQ0FBeUN6SCxPQUFPLENBQUNFLFlBQVIsQ0FBcUJzSCxJQUE5RCxFQUFvRUUsTUFBcEU7QUFDRDs7QUFDRCxRQUFJMUgsT0FBTyxDQUFDRSxZQUFSLENBQXFCeUgsSUFBekIsRUFBK0I7QUFDN0J4RyxRQUFFLENBQUNrRyxLQUFILEdBQVcvQyxRQUFYLENBQW9CLGVBQXBCLEVBQXFDbUQsR0FBckMsQ0FBeUN6SCxPQUFPLENBQUNFLFlBQVIsQ0FBcUJ5SCxJQUE5RCxFQUFvRUQsTUFBcEU7QUFDRDtBQUNGOztBQUVELFdBQVNuQixhQUFULENBQXVCcUIsUUFBdkIsRUFBaUM7QUFDL0IsUUFBSUMsU0FBUyxHQUFHL0IsaUJBQWlCLENBQUM4QixRQUFELENBQWpDO0FBQ0EsUUFBSUUsT0FBTyxHQUFHOUgsT0FBTyxDQUFDQyxlQUFSLENBQXdCMkgsUUFBeEIsRUFBa0NKLElBQWhEO0FBQ0EsUUFBSU8sT0FBTyxHQUFHL0gsT0FBTyxDQUFDQyxlQUFSLENBQXdCMkgsUUFBeEIsRUFBa0NELElBQWhEO0FBQ0F4RyxNQUFFLENBQUNrRyxLQUFILEdBQVcvQyxRQUFYLENBQW9CLFVBQVV1RCxTQUE5QixFQUF5Q0osR0FBekMsQ0FBNkNLLE9BQTdDLEVBQXNESixNQUF0RDtBQUNBdkcsTUFBRSxDQUFDa0csS0FBSCxHQUFXL0MsUUFBWCxDQUFvQixVQUFVdUQsU0FBOUIsRUFBeUNKLEdBQXpDLENBQTZDTSxPQUE3QyxFQUFzREwsTUFBdEQ7QUFDRCxHQXpId0MsQ0EySHpDOzs7QUFDQSxXQUFTNUMsU0FBVCxDQUFtQmQsSUFBbkIsRUFBeUJxQixHQUF6QixFQUE4QjtBQUM1QmxFLE1BQUUsQ0FBQzZHLFVBQUg7O0FBQ0EsU0FBSyxJQUFJdEcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzFCLE9BQU8sQ0FBQ0MsZUFBUixDQUF3QjJCLE1BQTVDLEVBQW9ERixDQUFDLEVBQXJELEVBQXlEO0FBQ3ZEc0MsVUFBSSxDQUFDaUUsV0FBTCxDQUFpQm5DLGlCQUFpQixDQUFDcEUsQ0FBRCxDQUFsQztBQUNEOztBQUNEc0MsUUFBSSxDQUFDa0UsUUFBTCxDQUFjcEMsaUJBQWlCLENBQUNULEdBQUQsQ0FBL0I7QUFDQWxFLE1BQUUsQ0FBQ2dILFFBQUg7QUFDRDs7QUFFRCxXQUFTQyxnQkFBVCxDQUEwQnBFLElBQTFCLEVBQWdDO0FBQzlCLFdBQU9BLElBQUksQ0FBQ3FFLEdBQUwsQ0FBU3JFLElBQUksQ0FBQ3NFLFdBQUwsRUFBVCxFQUE2QkMsa0JBQTdCLEVBQVA7QUFDRCxHQXZJd0MsQ0F3SXpDOzs7QUFDQSxNQUFJaEgsUUFBUSxHQUFHLEVBQWYsQ0F6SXlDLENBMkl6QztBQUNBOztBQUNBQSxVQUFRLENBQUNvRSxJQUFULEdBQWdCLFVBQVUzQixJQUFWLEVBQWdCO0FBQzlCO0FBQ0FBLFFBQUksR0FBR0EsSUFBSSxDQUFDSyxNQUFMLENBQVksVUFBWixDQUFQO0FBQ0FMLFFBQUksR0FBR0EsSUFBSSxDQUFDd0UsS0FBTCxDQUFXeEUsSUFBSSxDQUFDeUUsY0FBTCxFQUFYLENBQVA7QUFFQXpFLFFBQUksQ0FBQ2YsUUFBTDs7QUFFQSxRQUFJakQsT0FBTyxDQUFDRyxtQkFBWixFQUFpQztBQUMvQjZELFVBQUksQ0FBQ3lELEdBQUwsQ0FBUyxZQUFULEVBQXVCLFFBQXZCO0FBQ0Q7O0FBRUQsUUFBSXpILE9BQU8sQ0FBQ0ksZ0JBQVosRUFBOEI7QUFDNUI0RCxVQUFJLENBQUN5RCxHQUFMLENBQVMsU0FBVCxFQUFvQixNQUFwQjtBQUNEOztBQUVELFdBQU96RCxJQUFQO0FBQ0QsR0FoQkQsQ0E3SXlDLENBK0p6Qzs7O0FBQ0F6QyxVQUFRLENBQUNrRSxJQUFULEdBQWdCLFVBQVV6QixJQUFWLEVBQWdCO0FBQzlCQSxRQUFJLEdBQUdBLElBQUksQ0FBQ1UsR0FBTCxDQUFTLFVBQVQsQ0FBUDs7QUFFQSxRQUFJMUUsT0FBTyxDQUFDYyw4QkFBWixFQUE0QztBQUMxQyxVQUFJMkgsY0FBYyxHQUFHekUsSUFBSSxDQUFDeUUsY0FBTCxDQUFvQixVQUFVZCxJQUFWLEVBQWdCO0FBQ3ZELFlBQUksQ0FBQ0EsSUFBSSxDQUFDZSxNQUFMLEdBQWNDLE9BQWQsTUFBMkIzRSxJQUFJLENBQUM0RSxRQUFMLENBQWNqQixJQUFJLENBQUNlLE1BQUwsRUFBZCxDQUE1QixNQUE4RGYsSUFBSSxDQUFDakYsTUFBTCxHQUFjaUcsT0FBZCxNQUEyQjNFLElBQUksQ0FBQzRFLFFBQUwsQ0FBY2pCLElBQUksQ0FBQ2pGLE1BQUwsRUFBZCxDQUF6RixDQUFKLEVBQTRIO0FBQzFILGlCQUFPLElBQVA7QUFDRDs7QUFDRCxlQUFPLEtBQVA7QUFDRCxPQUxvQixDQUFyQjtBQU1Bc0IsVUFBSSxHQUFHQSxJQUFJLENBQUN3RSxLQUFMLENBQVdDLGNBQVgsQ0FBUDtBQUNEOztBQUVEekUsUUFBSSxDQUFDZixRQUFMOztBQUVBLFFBQUlqRCxPQUFPLENBQUNHLG1CQUFaLEVBQWlDO0FBQy9CNkQsVUFBSSxDQUFDeUQsR0FBTCxDQUFTLFlBQVQsRUFBdUIsU0FBdkI7QUFDRDs7QUFFRCxRQUFJekgsT0FBTyxDQUFDSSxnQkFBWixFQUE4QjtBQUM1QjRELFVBQUksQ0FBQ3lELEdBQUwsQ0FBUyxTQUFULEVBQW9CLFNBQXBCO0FBQ0Q7O0FBRUQsV0FBT3pELElBQVA7QUFDRCxHQXhCRCxDQWhLeUMsQ0EwTHpDOzs7QUFDQXpDLFVBQVEsQ0FBQ3NFLG1CQUFULEdBQStCLFVBQVU3QixJQUFWLEVBQWdCO0FBQzdDLFdBQU8sS0FBS3lCLElBQUwsQ0FBVTJDLGdCQUFnQixDQUFDcEUsSUFBRCxDQUExQixDQUFQO0FBQ0QsR0FGRCxDQTNMeUMsQ0ErTHpDOzs7QUFDQXpDLFVBQVEsQ0FBQ3VELFNBQVQsR0FBcUIsVUFBVWQsSUFBVixFQUF5QjtBQUFBLFFBQVRxQixHQUFTLHVFQUFILENBQUc7QUFDNUNQLGFBQVMsQ0FBQ2QsSUFBRCxFQUFPcUIsR0FBUCxDQUFULENBRDRDLENBQ3RCOztBQUN0QixXQUFPckIsSUFBUDtBQUNELEdBSEQ7O0FBS0F6QyxVQUFRLENBQUNzSCxrQkFBVCxHQUE4QixZQUFZO0FBQ3hDLFdBQU83SSxPQUFPLENBQUNDLGVBQWY7QUFDRCxHQUZELENBck15QyxDQXlNekM7OztBQUNBc0IsVUFBUSxDQUFDdUgsa0JBQVQsR0FBOEIsVUFBVTlFLElBQVYsRUFBeUI7QUFBQSxRQUFUcUIsR0FBUyx1RUFBSCxDQUFHO0FBQ3JELFdBQU8sS0FBS1AsU0FBTCxDQUFlc0QsZ0JBQWdCLENBQUNwRSxJQUFELENBQS9CLEVBQXVDcUIsR0FBdkMsQ0FBUDtBQUNELEdBRkQsQ0ExTXlDLENBOE16QztBQUNBOzs7QUFDQTlELFVBQVEsQ0FBQ3dELGdCQUFULEdBQTRCLFVBQVVmLElBQVYsRUFBZ0I7QUFDMUM3QyxNQUFFLENBQUM2RyxVQUFIOztBQUNBLFFBQUloRSxJQUFJLElBQUksSUFBUixJQUFnQkEsSUFBSSxDQUFDcEMsTUFBTCxJQUFlLElBQW5DLEVBQXlDO0FBQ3ZDb0MsVUFBSSxHQUFHN0MsRUFBRSxDQUFDNkIsUUFBSCxFQUFQO0FBQ0Q7O0FBQ0QsU0FBSyxJQUFJdEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzFCLE9BQU8sQ0FBQ0MsZUFBUixDQUF3QjJCLE1BQTVDLEVBQW9ERixDQUFDLEVBQXJELEVBQXlEO0FBQ3ZEc0MsVUFBSSxDQUFDaUUsV0FBTCxDQUFpQm5DLGlCQUFpQixDQUFDcEUsQ0FBRCxDQUFsQztBQUNEOztBQUNEUCxNQUFFLENBQUNnSCxRQUFIO0FBQ0EsV0FBT25FLElBQVA7QUFDRCxHQVZELENBaE55QyxDQTROekM7OztBQUNBekMsVUFBUSxDQUFDd0gsYUFBVCxHQUF5QixVQUFVeEksR0FBVixFQUFlO0FBQ3RDLFFBQUl5SSxNQUFNLEdBQUcsS0FBYjs7QUFDQSxTQUFLLElBQUl0SCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMUIsT0FBTyxDQUFDQyxlQUFSLENBQXdCMkIsTUFBNUMsRUFBb0RGLENBQUMsRUFBckQsRUFBeUQ7QUFDdkQsVUFBSW5CLEdBQUcsQ0FBQzBJLEVBQUosQ0FBTyxNQUFNbkQsaUJBQWlCLENBQUNwRSxDQUFELENBQXZCLEdBQTZCLFVBQXBDLENBQUosRUFBcUQ7QUFDbkRzSCxjQUFNLEdBQUcsSUFBVDtBQUNEO0FBQ0Y7O0FBQ0QsV0FBT0EsTUFBUDtBQUNELEdBUkQ7O0FBVUF6SCxVQUFRLENBQUMySCxvQkFBVCxHQUFnQyxVQUFVN0QsR0FBVixFQUFlOEQsU0FBZixFQUEwQkMsU0FBMUIsRUFBcUM7QUFDbkVwSixXQUFPLENBQUNDLGVBQVIsQ0FBd0JvRixHQUF4QixFQUE2Qm1DLElBQTdCLEdBQW9DMkIsU0FBcEM7QUFDQW5KLFdBQU8sQ0FBQ0MsZUFBUixDQUF3Qm9GLEdBQXhCLEVBQTZCc0MsSUFBN0IsR0FBb0N5QixTQUFwQztBQUNBN0MsaUJBQWEsQ0FBQ2xCLEdBQUQsQ0FBYjtBQUNBbUIsc0JBQWtCO0FBQ25CLEdBTEQ7O0FBT0FqRixVQUFRLENBQUM4SCxpQkFBVCxHQUE2QixVQUFVRixTQUFWLEVBQXFCQyxTQUFyQixFQUFnQztBQUMzRCxRQUFJRSxDQUFDLEdBQUc7QUFBRTlCLFVBQUksRUFBRTJCLFNBQVI7QUFBbUJ4QixVQUFJLEVBQUV5QjtBQUF6QixLQUFSO0FBQ0FwSixXQUFPLENBQUNDLGVBQVIsQ0FBd0JtRSxJQUF4QixDQUE2QmtGLENBQTdCO0FBQ0EsUUFBSWhELENBQUMsR0FBRyx1QkFBdUJQLFdBQS9CO0FBQ0FELHFCQUFpQixDQUFDMUIsSUFBbEIsQ0FBdUJrQyxDQUF2QjtBQUNBUCxlQUFXO0FBQ1hRLGlCQUFhLENBQUN2RyxPQUFPLENBQUNDLGVBQVIsQ0FBd0IyQixNQUF4QixHQUFpQyxDQUFsQyxDQUFiO0FBQ0E0RSxzQkFBa0I7QUFDbkIsR0FSRDs7QUFVQWpGLFVBQVEsQ0FBQ2dJLG9CQUFULEdBQWdDLFVBQVVDLFFBQVYsRUFBb0I7QUFDbEQsUUFBSUEsUUFBUSxHQUFHLENBQVgsSUFBZ0JBLFFBQVEsR0FBR3hKLE9BQU8sQ0FBQ0MsZUFBUixDQUF3QjJCLE1BQXhCLEdBQWlDLENBQWhFLEVBQW1FO0FBQ2pFO0FBQ0Q7O0FBQ0RULE1BQUUsQ0FBQzZCLFFBQUgsR0FBY2lGLFdBQWQsQ0FBMEJuQyxpQkFBaUIsQ0FBQzBELFFBQUQsQ0FBM0M7QUFDQXhKLFdBQU8sQ0FBQ0MsZUFBUixDQUF3QndKLE1BQXhCLENBQStCRCxRQUEvQixFQUF5QyxDQUF6QztBQUNBMUQscUJBQWlCLENBQUMyRCxNQUFsQixDQUF5QkQsUUFBekIsRUFBbUMsQ0FBbkM7QUFDRCxHQVBEOztBQVNBakksVUFBUSxDQUFDMkMsc0JBQVQsR0FBa0MsWUFBWTtBQUM1QyxRQUFJd0YsQ0FBQyxHQUFHLEVBQVI7O0FBQ0EsU0FBSyxJQUFJaEksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzFCLE9BQU8sQ0FBQ0MsZUFBUixDQUF3QjJCLE1BQTVDLEVBQW9ERixDQUFDLEVBQXJELEVBQXlEO0FBQ3ZEZ0ksT0FBQyxDQUFDdEYsSUFBRixDQUFPMEIsaUJBQWlCLENBQUNwRSxDQUFELENBQXhCO0FBQ0Q7O0FBQ0QsV0FBT29FLGlCQUFQO0FBQ0QsR0FORCxDQWpReUMsQ0F5UXpDOzs7QUFDQXZFLFVBQVEsQ0FBQ29JLGNBQVQsR0FBMEIsVUFBVTNGLElBQVYsRUFBZ0I7QUFDeEMsUUFBSTRGLFdBQVcsR0FBRzVGLElBQUksQ0FBQzRGLFdBQUwsRUFBbEI7QUFDQSxRQUFJQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxXQUFXLENBQUNJLEVBQVosR0FBaUJKLFdBQVcsQ0FBQ0ssRUFBdEMsQ0FBYjtBQUNBLFFBQUlDLE1BQU0sR0FBR0osSUFBSSxDQUFDQyxHQUFMLENBQVNILFdBQVcsQ0FBQ08sRUFBWixHQUFpQlAsV0FBVyxDQUFDUSxFQUF0QyxDQUFiO0FBQ0EsUUFBSUMsT0FBSjs7QUFDQSxRQUFJUixNQUFNLElBQUksR0FBVixJQUFpQkssTUFBTSxJQUFJLEdBQS9CLEVBQW9DO0FBQ2xDRyxhQUFPLEdBQUcsRUFBVjtBQUNELEtBRkQsTUFHSztBQUNIQSxhQUFPLEdBQUlsSixFQUFFLENBQUNtSixLQUFILEtBQWFuSixFQUFFLENBQUNvSixNQUFILEVBQWQsR0FDUCxDQUFDLE1BQU1WLE1BQVAsSUFBaUIsQ0FBakIsR0FBcUIxSSxFQUFFLENBQUNtSixLQUFILEVBQXJCLEdBQWtDLEdBRDNCLEdBQ21DLENBQUMsTUFBTUosTUFBUCxJQUFpQixDQUFqQixHQUFxQi9JLEVBQUUsQ0FBQ29KLE1BQUgsRUFBckIsR0FBbUMsR0FEaEY7QUFFRDs7QUFFRHBKLE1BQUUsQ0FBQ3FKLE9BQUgsQ0FBVztBQUNUQyxTQUFHLEVBQUU7QUFDSHpHLFlBQUksRUFBRUEsSUFESDtBQUVIcUcsZUFBTyxFQUFFQTtBQUZOO0FBREksS0FBWCxFQUtHO0FBQ0RLLGNBQVEsRUFBRTFLLE9BQU8sQ0FBQ0s7QUFEakIsS0FMSDtBQVFBLFdBQU8yRCxJQUFQO0FBQ0QsR0F0QkQsQ0ExUXlDLENBa1N6Qzs7O0FBQ0EsTUFBSTJHLGVBQUo7QUFDQSxNQUFJQyxhQUFKOztBQUVBckosVUFBUSxDQUFDbUYsaUJBQVQsR0FBNkIsVUFBVW1FLFFBQVYsRUFBb0I7QUFDL0NqRSxhQUFTLENBQUMsS0FBRCxDQUFUO0FBQ0FaLHNCQUFrQixHQUFHLElBQXJCO0FBQ0EsUUFBSThFLGdCQUFKLEVBQXNCQyxnQkFBdEIsRUFBd0NDLGNBQXhDLEVBQXdEQyxjQUF4RCxDQUgrQyxDQUkvQzs7QUFDQTlKLE1BQUUsQ0FBQytKLGVBQUgsQ0FBbUIsSUFBbkI7QUFFQS9KLE1BQUUsQ0FBQ2tDLEdBQUgsQ0FBTyxVQUFQLEVBQW1Cc0gsZUFBZSxHQUFHLHlCQUFVbkksS0FBVixFQUFpQjtBQUNwRCxVQUFJSCxZQUFZLElBQUksSUFBcEIsRUFBMEI7QUFDeEJ5SSx3QkFBZ0IsR0FBR3RJLEtBQUssQ0FBQzJJLFFBQU4sQ0FBZTNHLENBQWxDO0FBQ0F1Ryx3QkFBZ0IsR0FBR3ZJLEtBQUssQ0FBQzJJLFFBQU4sQ0FBZUMsQ0FBbEM7QUFDQUosc0JBQWMsR0FBR0ssU0FBakI7QUFDRDtBQUNGLEtBTkQ7QUFPQWxLLE1BQUUsQ0FBQ2tDLEdBQUgsQ0FBTyxRQUFQLEVBQWlCdUgsYUFBYSxHQUFHLHVCQUFVcEksS0FBVixFQUFpQjtBQUNoRHdJLG9CQUFjLEdBQUd4SSxLQUFLLENBQUMySSxRQUFOLENBQWUzRyxDQUFoQztBQUNBeUcsb0JBQWMsR0FBR3pJLEtBQUssQ0FBQzJJLFFBQU4sQ0FBZUMsQ0FBaEMsQ0FGZ0QsQ0FHaEQ7QUFDQTs7QUFDQSxVQUFJTixnQkFBZ0IsSUFBSU8sU0FBcEIsSUFBaUNMLGNBQWMsSUFBSUssU0FBdkQsRUFBa0U7QUFDaEVsSyxVQUFFLENBQUMrSixlQUFILENBQW1CLEtBQW5COztBQUNBLFlBQUlMLFFBQUosRUFBYztBQUNaQSxrQkFBUTtBQUNUOztBQUNEO0FBQ0QsT0FYK0MsQ0FZaEQ7QUFDQTtBQUNBOzs7QUFDQSxVQUFJQyxnQkFBZ0IsR0FBR0UsY0FBdkIsRUFBdUM7QUFDckMsWUFBSU0sSUFBSSxHQUFHUixnQkFBWDtBQUNBQSx3QkFBZ0IsR0FBR0UsY0FBbkI7QUFDQUEsc0JBQWMsR0FBR00sSUFBakI7QUFDRDs7QUFDRCxVQUFJUCxnQkFBZ0IsR0FBR0UsY0FBdkIsRUFBdUM7QUFDckMsWUFBSUssSUFBSSxHQUFHUCxnQkFBWDtBQUNBQSx3QkFBZ0IsR0FBR0UsY0FBbkI7QUFDQUEsc0JBQWMsR0FBR0ssSUFBakI7QUFDRCxPQXhCK0MsQ0EwQmhEOzs7QUFDQSxVQUFJTixjQUFjLEdBQUdGLGdCQUFqQixHQUFvQyxHQUF4QyxFQUE2QztBQUMzQyxZQUFJUyxRQUFRLEdBQUcsQ0FBQyxPQUFPUCxjQUFjLEdBQUdGLGdCQUF4QixDQUFELElBQThDLENBQTdEO0FBQ0FBLHdCQUFnQixJQUFJUyxRQUFwQjtBQUNBUCxzQkFBYyxJQUFJTyxRQUFsQjtBQUNEOztBQUNELFVBQUlOLGNBQWMsR0FBR0YsZ0JBQWpCLEdBQW9DLEdBQXhDLEVBQTZDO0FBQzNDLFlBQUlRLFFBQVEsR0FBRyxDQUFDLE9BQU9OLGNBQWMsR0FBR0YsZ0JBQXhCLENBQUQsSUFBOEMsQ0FBN0Q7QUFDQUEsd0JBQWdCLElBQUlRLFFBQXBCO0FBQ0FOLHNCQUFjLElBQUlNLFFBQWxCO0FBQ0QsT0FwQytDLENBc0NoRDtBQUNBOzs7QUFDQSxVQUFLVCxnQkFBZ0IsR0FBRzNKLEVBQUUsQ0FBQzZCLFFBQUgsR0FBYzRHLFdBQWQsR0FBNEJLLEVBQWhELElBQ0VlLGNBQWMsR0FBRzdKLEVBQUUsQ0FBQzZCLFFBQUgsR0FBYzRHLFdBQWQsR0FBNEJJLEVBRC9DLElBRUVlLGdCQUFnQixHQUFHNUosRUFBRSxDQUFDNkIsUUFBSCxHQUFjNEcsV0FBZCxHQUE0QlEsRUFGakQsSUFHRWEsY0FBYyxHQUFHOUosRUFBRSxDQUFDNkIsUUFBSCxHQUFjNEcsV0FBZCxHQUE0Qk8sRUFIbkQsRUFHd0Q7QUFDdERoSixVQUFFLENBQUMrSixlQUFILENBQW1CLEtBQW5COztBQUNBLFlBQUlMLFFBQUosRUFBYztBQUNaQSxrQkFBUTtBQUNUOztBQUNEO0FBQ0QsT0FqRCtDLENBbURoRDs7O0FBQ0EsVUFBSVcsU0FBUyxHQUFHMUIsSUFBSSxDQUFDMkIsR0FBTCxDQUFTdEssRUFBRSxDQUFDbUosS0FBSCxLQUFjUixJQUFJLENBQUNDLEdBQUwsQ0FBU2lCLGNBQWMsR0FBR0YsZ0JBQTFCLENBQXZCLEVBQ2QzSixFQUFFLENBQUNvSixNQUFILEtBQWNULElBQUksQ0FBQ0MsR0FBTCxDQUFTa0IsY0FBYyxHQUFHRixnQkFBMUIsQ0FEQSxDQUFoQjtBQUdBLFVBQUlsQixNQUFNLEdBQUcxSSxFQUFFLENBQUNtSixLQUFILEtBQWEsQ0FBYixJQUFrQm5KLEVBQUUsQ0FBQ3VLLEdBQUgsR0FBU2xILENBQVQsR0FBYWdILFNBQVMsSUFBSVYsZ0JBQWdCLEdBQUdFLGNBQXZCLENBQVQsR0FBa0QsQ0FBakYsQ0FBYjtBQUNBLFVBQUlkLE1BQU0sR0FBRy9JLEVBQUUsQ0FBQ29KLE1BQUgsS0FBYyxDQUFkLElBQW1CcEosRUFBRSxDQUFDdUssR0FBSCxHQUFTTixDQUFULEdBQWFJLFNBQVMsSUFBSVQsZ0JBQWdCLEdBQUdFLGNBQXZCLENBQVQsR0FBa0QsQ0FBbEYsQ0FBYjtBQUVBOUosUUFBRSxDQUFDcUosT0FBSCxDQUFXO0FBQ1RtQixhQUFLLEVBQUU7QUFBRW5ILFdBQUMsRUFBRXFGLE1BQUw7QUFBYXVCLFdBQUMsRUFBRWxCO0FBQWhCLFNBREU7QUFFVDBCLFlBQUksRUFBRUosU0FGRztBQUdUZCxnQkFBUSxFQUFFMUssT0FBTyxDQUFDSyxxQkFIVDtBQUlUd0wsZ0JBQVEsRUFBRSxvQkFBWTtBQUNwQixjQUFJaEIsUUFBSixFQUFjO0FBQ1pBLG9CQUFRO0FBQ1Q7O0FBQ0QxSixZQUFFLENBQUMrSixlQUFILENBQW1CLEtBQW5CO0FBQ0Q7QUFUUSxPQUFYO0FBV0QsS0FyRUQ7QUFzRUQsR0FwRkQ7O0FBc0ZBM0osVUFBUSxDQUFDb0Ysa0JBQVQsR0FBOEIsWUFBWTtBQUN4Q0MsYUFBUyxDQUFDLElBQUQsQ0FBVDtBQUNBekYsTUFBRSxDQUFDMkssR0FBSCxDQUFPLFVBQVAsRUFBbUJuQixlQUFuQjtBQUNBeEosTUFBRSxDQUFDMkssR0FBSCxDQUFPLFFBQVAsRUFBaUJsQixhQUFqQjtBQUNBekosTUFBRSxDQUFDK0osZUFBSCxDQUFtQixLQUFuQjtBQUNBbEYsc0JBQWtCLEdBQUcsS0FBckI7QUFDRCxHQU5ELENBNVh5QyxDQW1ZekM7OztBQUNBLE1BQUkrRixTQUFTLEdBQUcvSyxtQkFBTyxDQUFDLENBQUQsQ0FBdkI7O0FBRUFPLFVBQVEsQ0FBQ3lLLGdCQUFULEdBQTRCLFVBQVVDLFFBQVYsRUFBb0I7QUFDOUMsUUFBSUEsUUFBUSxDQUFDdEwsU0FBYixFQUNFWCxPQUFPLENBQUNTLFVBQVIsQ0FBbUJFLFNBQW5CLEdBQStCc0wsUUFBUSxDQUFDdEwsU0FBeEM7QUFDRixRQUFJc0wsUUFBUSxDQUFDdkwsU0FBYixFQUNFVixPQUFPLENBQUNTLFVBQVIsQ0FBbUJDLFNBQW5CLEdBQStCdUwsUUFBUSxDQUFDdkwsU0FBeEM7QUFDSCxHQUxEOztBQU9BYSxVQUFRLENBQUMySyxlQUFULEdBQTJCLFVBQVVyQixRQUFWLEVBQW9CO0FBRTdDLFFBQUlzQixTQUFTLEdBQUcsS0FBaEI7QUFDQSxRQUFJQyxRQUFRLEdBQUc5SixRQUFRLENBQUMrSixhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQUQsWUFBUSxDQUFDRSxFQUFULEdBQWMsY0FBZDtBQUNBLFFBQU1DLFNBQVMsR0FBR3BMLEVBQUUsQ0FBQ29MLFNBQUgsRUFBbEI7QUFDQUEsYUFBUyxDQUFDQyxXQUFWLENBQXNCSixRQUF0QjtBQUVBLFFBQU05QixLQUFLLEdBQUdpQyxTQUFTLENBQUNFLFdBQXhCO0FBQ0EsUUFBTWxDLE1BQU0sR0FBR2dDLFNBQVMsQ0FBQ0csWUFBekI7QUFFQU4sWUFBUSxDQUFDOUIsS0FBVCxHQUFpQkEsS0FBakI7QUFDQThCLFlBQVEsQ0FBQzdCLE1BQVQsR0FBa0JBLE1BQWxCO0FBQ0E2QixZQUFRLENBQUNPLFlBQVQsQ0FBc0IsT0FBdEI7QUFFQXhMLE1BQUUsQ0FBQ3lMLGNBQUgsQ0FBa0IsS0FBbEI7QUFDQXpMLE1BQUUsQ0FBQzBMLGNBQUgsQ0FBa0IsS0FBbEI7QUFDQTFMLE1BQUUsQ0FBQytKLGVBQUgsQ0FBbUIsSUFBbkI7QUFDQSxRQUFJNEIsTUFBTSxHQUFHLEVBQWI7O0FBRUFWLFlBQVEsQ0FBQ1csT0FBVCxHQUFtQixVQUFVdkssS0FBVixFQUFpQjtBQUVsQyxVQUFJMkosU0FBUyxJQUFJLEtBQWpCLEVBQXdCO0FBQ3RCQSxpQkFBUyxHQUFHLElBQVo7QUFDQSxZQUFJYSxPQUFPLEdBQUdaLFFBQVEsQ0FBQ2EsVUFBVCxDQUFvQixJQUFwQixDQUFkO0FBQ0FELGVBQU8sQ0FBQ0UsV0FBUixHQUFzQmxOLE9BQU8sQ0FBQ1MsVUFBUixDQUFtQkMsU0FBekM7QUFDQXNNLGVBQU8sQ0FBQ3JNLFNBQVIsR0FBb0JYLE9BQU8sQ0FBQ1MsVUFBUixDQUFtQkUsU0FBdkM7QUFDQXFNLGVBQU8sQ0FBQ0csUUFBUixHQUFtQixPQUFuQjtBQUNBaE0sVUFBRSxDQUFDeUwsY0FBSCxDQUFrQixLQUFsQjtBQUNBekwsVUFBRSxDQUFDMEwsY0FBSCxDQUFrQixLQUFsQjtBQUNBMUwsVUFBRSxDQUFDK0osZUFBSCxDQUFtQixJQUFuQjtBQUNBLFlBQUlrQyxPQUFPLEdBQUc1SyxLQUFLLENBQUM2SyxPQUFwQjtBQUNBLFlBQUlDLE9BQU8sR0FBRzlLLEtBQUssQ0FBQytLLE9BQXBCO0FBRUFULGNBQU0sQ0FBQzFJLElBQVAsQ0FBWSxDQUFDZ0osT0FBRCxFQUFVRSxPQUFWLENBQVo7O0FBQ0FsQixnQkFBUSxDQUFDb0IsWUFBVCxHQUF3QixVQUFVL0osQ0FBVixFQUFhO0FBQ25DMEksbUJBQVMsR0FBRyxLQUFaO0FBQ0FJLG1CQUFTLENBQUNrQixXQUFWLENBQXNCckIsUUFBdEI7QUFDQUEsa0JBQVEsR0FBRyxJQUFYO0FBQ0FqTCxZQUFFLENBQUN5TCxjQUFILENBQWtCLElBQWxCO0FBQ0F6TCxZQUFFLENBQUMwTCxjQUFILENBQWtCLElBQWxCO0FBQ0ExTCxZQUFFLENBQUMrSixlQUFILENBQW1CLEtBQW5COztBQUNBLGNBQUlMLFFBQUosRUFBYztBQUNaQSxvQkFBUTtBQUNUO0FBQ0YsU0FWRDs7QUFXQXVCLGdCQUFRLENBQUNzQixXQUFULEdBQXVCLFVBQVVqSyxDQUFWLEVBQWE7QUFDbEN1SixpQkFBTyxDQUFDVyxTQUFSO0FBQ0FiLGdCQUFNLENBQUMxSSxJQUFQLENBQVksQ0FBQ1gsQ0FBQyxDQUFDNEosT0FBSCxFQUFZNUosQ0FBQyxDQUFDOEosT0FBZCxDQUFaO0FBQ0FQLGlCQUFPLENBQUNZLE1BQVIsQ0FBZVIsT0FBZixFQUF3QkUsT0FBeEI7QUFDQU4saUJBQU8sQ0FBQ2EsTUFBUixDQUFlcEssQ0FBQyxDQUFDNEosT0FBakIsRUFBMEI1SixDQUFDLENBQUM4SixPQUE1QjtBQUNBSCxpQkFBTyxHQUFHM0osQ0FBQyxDQUFDNEosT0FBWjtBQUNBQyxpQkFBTyxHQUFHN0osQ0FBQyxDQUFDOEosT0FBWjtBQUNBUCxpQkFBTyxDQUFDYyxNQUFSO0FBQ0FkLGlCQUFPLENBQUNlLFNBQVI7QUFDRCxTQVREO0FBVUQsT0FsQ0QsTUFtQ0s7QUFDSCxZQUFJL0osSUFBSSxHQUFHN0MsRUFBRSxDQUFDNkIsUUFBSCxFQUFYO0FBQ0E4SixjQUFNLENBQUMxSSxJQUFQLENBQVkwSSxNQUFNLENBQUMsQ0FBRCxDQUFsQjs7QUFDQSxhQUFLLElBQUlwTCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHc0MsSUFBSSxDQUFDcEMsTUFBekIsRUFBaUNGLENBQUMsRUFBbEMsRUFBc0M7QUFDcEMsY0FBSXNDLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRc00sTUFBUixFQUFKLEVBQXNCO0FBRXBCLGdCQUFJQyxFQUFFLEdBQUcsQ0FBRWpLLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRd00sY0FBUixHQUF5QjFKLENBQTFCLEdBQStCckQsRUFBRSxDQUFDeUssSUFBSCxFQUEvQixHQUEyQ3pLLEVBQUUsQ0FBQ3VLLEdBQUgsR0FBU2xILENBQXJELEVBQXlEUixJQUFJLENBQUN0QyxDQUFELENBQUosQ0FBUXdNLGNBQVIsR0FBeUI5QyxDQUExQixHQUErQmpLLEVBQUUsQ0FBQ3lLLElBQUgsRUFBL0IsR0FBMkN6SyxFQUFFLENBQUN1SyxHQUFILEdBQVNOLENBQTVHLENBQVQ7QUFDQSxnQkFBSStDLEVBQUUsR0FBRyxDQUFFbkssSUFBSSxDQUFDdEMsQ0FBRCxDQUFKLENBQVEwTSxjQUFSLEdBQXlCNUosQ0FBMUIsR0FBK0JyRCxFQUFFLENBQUN5SyxJQUFILEVBQS9CLEdBQTJDekssRUFBRSxDQUFDdUssR0FBSCxHQUFTbEgsQ0FBckQsRUFBeURSLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRME0sY0FBUixHQUF5QmhELENBQTFCLEdBQStCakssRUFBRSxDQUFDeUssSUFBSCxFQUEvQixHQUEyQ3pLLEVBQUUsQ0FBQ3VLLEdBQUgsR0FBU04sQ0FBNUcsQ0FBVDs7QUFFQSxnQkFBSVcsU0FBUyxDQUFDc0MsY0FBVixDQUF5QkosRUFBekIsRUFBNkJuQixNQUE3QixLQUF3Q2YsU0FBUyxDQUFDc0MsY0FBVixDQUF5QkYsRUFBekIsRUFBNkJyQixNQUE3QixDQUE1QyxFQUFrRjtBQUNoRjlJLGtCQUFJLENBQUN0QyxDQUFELENBQUosQ0FBUXdCLE1BQVI7QUFDRDtBQUVGLFdBVEQsTUFVSztBQUNIL0IsY0FBRSxDQUFDK0osZUFBSCxDQUFtQixLQUFuQjtBQUNBLGdCQUFJb0QsRUFBRSxHQUFHLENBQUMsQ0FBQ3RLLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJ2RSxFQUEvQixFQUFtQ2hHLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJwRSxFQUFqRSxDQUFELEVBQ1QsQ0FBQ25HLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJ2RSxFQUEvQixFQUFtQ2hHLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJuRSxFQUFqRSxDQURTLEVBRVQsQ0FBQ3BHLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJ0RSxFQUEvQixFQUFtQ2pHLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJuRSxFQUFqRSxDQUZTLEVBR1QsQ0FBQ3BHLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJ0RSxFQUEvQixFQUFtQ2pHLElBQUksQ0FBQ3RDLENBQUQsQ0FBSixDQUFRNk0sbUJBQVIsR0FBOEJwRSxFQUFqRSxDQUhTLENBQVQ7O0FBS0EsZ0JBQUk0QixTQUFTLENBQUN5Qyx3QkFBVixDQUFtQ0YsRUFBbkMsRUFBdUN4QixNQUF2QyxLQUFrRGYsU0FBUyxDQUFDMEMsZ0JBQVYsQ0FBMkJILEVBQTNCLEVBQStCeEIsTUFBL0IsQ0FBbEQsSUFDQ2YsU0FBUyxDQUFDMEMsZ0JBQVYsQ0FBMkIzQixNQUEzQixFQUFtQ3dCLEVBQW5DLENBREwsRUFDNkM7QUFDM0N0SyxrQkFBSSxDQUFDdEMsQ0FBRCxDQUFKLENBQVF3QixNQUFSO0FBQ0Q7QUFDRjtBQUNGOztBQUNEaUosaUJBQVMsR0FBRyxLQUFaO0FBQ0FJLGlCQUFTLENBQUNrQixXQUFWLENBQXNCckIsUUFBdEI7QUFDQUEsZ0JBQVEsR0FBRyxJQUFYO0FBRUFqTCxVQUFFLENBQUN5TCxjQUFILENBQWtCLElBQWxCO0FBQ0F6TCxVQUFFLENBQUMwTCxjQUFILENBQWtCLElBQWxCOztBQUNBLFlBQUloQyxRQUFKLEVBQWM7QUFDWkEsa0JBQVE7QUFDVDtBQUNGO0FBQ0YsS0ExRUQ7QUEyRUQsR0EvRkQ7O0FBaUdBdEosVUFBUSxDQUFDbU4sZ0JBQVQsR0FBNEIsWUFBWTtBQUN0QyxRQUFJQyxDQUFDLEdBQUdyTSxRQUFRLENBQUM0RSxjQUFULENBQXdCLGNBQXhCLENBQVI7O0FBQ0EsUUFBSXlILENBQUosRUFBTztBQUNMQSxPQUFDLENBQUNDLGFBQUYsQ0FBZ0JuQixXQUFoQixDQUE0QmtCLENBQTVCO0FBQ0FBLE9BQUMsR0FBRyxJQUFKO0FBQ0Q7O0FBQ0R4TixNQUFFLENBQUN5TCxjQUFILENBQWtCLElBQWxCO0FBQ0F6TCxNQUFFLENBQUMwTCxjQUFILENBQWtCLElBQWxCO0FBQ0ExTCxNQUFFLENBQUMrSixlQUFILENBQW1CLEtBQW5CO0FBQ0QsR0FURCxDQTlleUMsQ0F3ZnpDOzs7QUFDQSxTQUFPM0osUUFBUDtBQUNELENBMWZEOztBQTRmQW9DLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjNDLGFBQWpCLEM7Ozs7OztBQzVmQSxnRCIsImZpbGUiOiJjeXRvc2NhcGUtdmlldy11dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJnZW9tZXRyaWNcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiZ2VvbWV0cmljXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImN5dG9zY2FwZVZpZXdVdGlsaXRpZXNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJnZW9tZXRyaWNcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZVZpZXdVdGlsaXRpZXNcIl0gPSBmYWN0b3J5KHJvb3RbXCJnZW9tZXRyaWNcIl0pO1xufSkod2luZG93LCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18zX18pIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCI7XG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gcmVnaXN0ZXJzIHRoZSBleHRlbnNpb24gb24gYSBjeXRvc2NhcGUgbGliIHJlZlxuICB2YXIgcmVnaXN0ZXIgPSBmdW5jdGlvbiAoY3l0b3NjYXBlKSB7XG5cbiAgICBpZiAoIWN5dG9zY2FwZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gY2FuJ3QgcmVnaXN0ZXIgaWYgY3l0b3NjYXBlIHVuc3BlY2lmaWVkXG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGhpZ2hsaWdodFN0eWxlczogW10sXG4gICAgICBzZWxlY3RTdHlsZXM6IHt9LFxuICAgICAgc2V0VmlzaWJpbGl0eU9uSGlkZTogZmFsc2UsIC8vIHdoZXRoZXIgdG8gc2V0IHZpc2liaWxpdHkgb24gaGlkZS9zaG93XG4gICAgICBzZXREaXNwbGF5T25IaWRlOiB0cnVlLCAvLyB3aGV0aGVyIHRvIHNldCBkaXNwbGF5IG9uIGhpZGUvc2hvd1xuICAgICAgem9vbUFuaW1hdGlvbkR1cmF0aW9uOiAxNTAwLCAvL2RlZmF1bHQgZHVyYXRpb24gZm9yIHpvb20gYW5pbWF0aW9uIHNwZWVkXG4gICAgICBuZWlnaGJvcjogZnVuY3Rpb24gKGVsZSkgeyAvLyByZXR1cm4gZGVzaXJlZCBuZWlnaGJvcnMgb2YgdGFwaGVsZCBub2RlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBuZWlnaGJvclNlbGVjdFRpbWU6IDUwMCwgLy9tcywgdGltZSB0byB0YXBob2xkIHRvIHNlbGVjdCBkZXNpcmVkIG5laWdoYm9yc1xuICAgICAgbGFzc29TdHlsZTogeyBsaW5lQ29sb3I6IFwiI2Q2NzYxNFwiLCBsaW5lV2lkdGg6IDMgfSxcbiAgICAgIGh0bWxFbGVtNG1hcnF1ZWVab29tOiAnJywgLy8gc2hvdWxkIGJlIHN0cmluZyBsaWtlIGAjY3lgIG9yIGAuY3lgLiBgI2N5YCBtZWFucyBnZXQgZWxlbWVudCB3aXRoIHRoZSBJRCAnY3knLiBgLmN5YCBtZWFucyB0aGUgZWxlbWVudCB3aXRoIGNsYXNzICdjeScgXG4gICAgICBtYXJxdWVlWm9vbUN1cnNvcjogJ3NlLXJlc2l6ZScsIC8vIHRoZSBjdXJzb3IgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIG1hcnF1ZWUgem9vbSBpcyBlbmFibGVkLiBJdCBjYW4gYWxzbyBiZSBhbiBpbWFnZSBpZiBhIFVSTCB0byBhbiBpbWFnZSBpcyBnaXZlbiBcbiAgICAgIGlzU2hvd0VkZ2VzQmV0d2VlblZpc2libGVOb2RlczogdHJ1ZSAvLyBXaGVuIHNob3dpbmcgZWxlbWVudHMsIHNob3cgZWRnZXMgaWYgYm90aCBzb3VyY2UgYW5kIHRhcmdldCBub2RlcyBiZWNvbWUgdmlzaWJsZVxuICAgIH07XG5cbiAgICB2YXIgdW5kb1JlZG8gPSByZXF1aXJlKFwiLi91bmRvLXJlZG9cIik7XG4gICAgdmFyIHZpZXdVdGlsaXRpZXMgPSByZXF1aXJlKFwiLi92aWV3LXV0aWxpdGllc1wiKTtcblxuICAgIGN5dG9zY2FwZSgnY29yZScsICd2aWV3VXRpbGl0aWVzJywgZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgIHZhciBjeSA9IHRoaXM7XG5cbiAgICAgIGZ1bmN0aW9uIGdldFNjcmF0Y2goZWxlT3JDeSkge1xuICAgICAgICBpZiAoIWVsZU9yQ3kuc2NyYXRjaChcIl92aWV3VXRpbGl0aWVzXCIpKSB7XG4gICAgICAgICAgZWxlT3JDeS5zY3JhdGNoKFwiX3ZpZXdVdGlsaXRpZXNcIiwge30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZU9yQ3kuc2NyYXRjaChcIl92aWV3VXRpbGl0aWVzXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiAnZ2V0JyBpcyBnaXZlbiBhcyB0aGUgcGFyYW0gdGhlbiByZXR1cm4gdGhlIGV4dGVuc2lvbiBpbnN0YW5jZVxuICAgICAgaWYgKG9wdHMgPT09ICdnZXQnKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JhdGNoKGN5KS5pbnN0YW5jZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIERlZXAgY29weSBvciBtZXJnZSBvYmplY3RzIC0gcmVwbGFjZW1lbnQgZm9yIGpRdWVyeSBkZWVwIGV4dGVuZFxuICAgICAgKiBUYWtlbiBmcm9tIGh0dHA6Ly95b3VtaWdodG5vdG5lZWRqcXVlcnkuY29tLyNkZWVwX2V4dGVuZFxuICAgICAgKiBhbmQgYnVnIHJlbGF0ZWQgdG8gZGVlcCBjb3B5IG9mIEFycmF5cyBpcyBmaXhlZC5cbiAgICAgICogVXNhZ2U6T2JqZWN0LmV4dGVuZCh7fSwgb2JqQSwgb2JqQilcbiAgICAgICovXG4gICAgICBmdW5jdGlvbiBleHRlbmRPcHRpb25zKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwge307XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgb2JqID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICAgICAgaWYgKCFvYmopXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpba2V5XSkpIHtcbiAgICAgICAgICAgICAgICBvdXRba2V5XSA9IG9ialtrZXldLnNsaWNlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIG91dFtrZXldID0gZXh0ZW5kT3B0aW9ucyhvdXRba2V5XSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dFtrZXldID0gb2JqW2tleV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgfTtcblxuICAgICAgb3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMoe30sIG9wdGlvbnMsIG9wdHMpO1xuXG4gICAgICAvLyBjcmVhdGUgYSB2aWV3IHV0aWxpdGllcyBpbnN0YW5jZVxuICAgICAgdmFyIGluc3RhbmNlID0gdmlld1V0aWxpdGllcyhjeSwgb3B0aW9ucyk7XG5cbiAgICAgIGlmIChjeS51bmRvUmVkbykge1xuICAgICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbyhudWxsLCB0cnVlKTtcbiAgICAgICAgdW5kb1JlZG8oY3ksIHVyLCBpbnN0YW5jZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB0aGUgaW5zdGFuY2Ugb24gdGhlIHNjcmF0Y2ggcGFkXG4gICAgICBnZXRTY3JhdGNoKGN5KS5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXG4gICAgICBpZiAoIWdldFNjcmF0Y2goY3kpLmluaXRpYWxpemVkKSB7XG4gICAgICAgIGdldFNjcmF0Y2goY3kpLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICB2YXIgc2hpZnRLZXlEb3duID0gZmFsc2U7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiU2hpZnRcIikge1xuICAgICAgICAgICAgc2hpZnRLZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJTaGlmdFwiKSB7XG4gICAgICAgICAgICBzaGlmdEtleURvd24gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL1NlbGVjdCB0aGUgZGVzaXJlZCBuZWlnaGJvcnMgYWZ0ZXIgdGFwaG9sZC1hbmQtZnJlZVxuICAgICAgICBjeS5vbigndGFwaG9sZCcsICdub2RlLCBlZGdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5jeVRhcmdldDtcbiAgICAgICAgICB2YXIgdGFwaGVsZCA9IGZhbHNlO1xuICAgICAgICAgIHZhciBuZWlnaGJvcmhvb2Q7XG4gICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzaGlmdEtleURvd24pIHtcbiAgICAgICAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICAgICAgICBuZWlnaGJvcmhvb2QgPSBvcHRpb25zLm5laWdoYm9yKHRhcmdldCk7XG4gICAgICAgICAgICAgIGlmIChuZWlnaGJvcmhvb2QpXG4gICAgICAgICAgICAgICAgbmVpZ2hib3Job29kLnNlbGVjdCgpO1xuICAgICAgICAgICAgICB0YXJnZXQubG9jaygpO1xuXG4gICAgICAgICAgICAgIC8vIHRoaXMgY2FsbCBpcyBuZWNlc3NhcnkgdG8gbWFrZSBzdXJlXG4gICAgICAgICAgICAgIC8vIHRoZSB0YXBoZWxkIG5vZGUgb3IgZWRnZSBzdGF5cyBzZWxlY3RlZFxuICAgICAgICAgICAgICAvLyBhZnRlciByZWxlYXNpbmcgdGFwaG9sZFxuICAgICAgICAgICAgICB0YXJnZXQudW5zZWxlY3RpZnkoKTtcblxuICAgICAgICAgICAgICAvLyB0cmFja3Mgd2hldGhlciB0aGUgdGFwaG9sZCBldmVudCBoYXBwZW5lZFxuICAgICAgICAgICAgICAvLyBuZWNlc3NhcnkgaWYgd2Ugd2FudCB0byBrZWVwICduZWlnaGJvclNlbGVjdFRpbWUnXG4gICAgICAgICAgICAgIC8vIHByb3BlcnR5LCBvdGhlcndpc2UgdW5uZWNlc3NhcnkgXG4gICAgICAgICAgICAgIHRhcGhlbGQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIG9wdGlvbnMubmVpZ2hib3JTZWxlY3RUaW1lIC0gNTAwKTtcblxuICAgICAgICAgIC8vIHRoaXMgbGlzdGVuZXIgcHJldmVudHMgdGhlIG9yaWdpbmFsIHRhcGhlbGQgbm9kZSBvciBlZGdlXG4gICAgICAgICAgLy8gZnJvbSBiZWluZyB1bnNlbGVjdGVkIGFmdGVyIHJlbGVhc2luZyBmcm9tIHRhcGhvbGRcbiAgICAgICAgICAvLyB0b2dldGhlciB3aXRoIHRoZSAndW5zZWxlY3RpZnknIGNhbGwgYWJvdmVcbiAgICAgICAgICAvLyBjYWxsZWQgYXMgb25lIHRpbWUgZXZlbnQgc2luY2UgaXQncyBkZWZpbmVkIGluc2lkZSBhbm90aGVyIGV2ZW50LFxuICAgICAgICAgIC8vIHNob3VsZG4ndCBiZSBkZWZpbmVkIG92ZXIgYW5kIG92ZXIgd2l0aCAnb24nXG4gICAgICAgICAgY3kub25lKCd0YXBlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGFwaGVsZCkge1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2VsZWN0aWZ5KCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnVubG9jaygpO1xuICAgICAgICAgICAgICAgIHRhcGhlbGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjeS5vbmUoJ2RyYWcnLCAnbm9kZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RHJhZ2dlZCA9IGUudGFyZ2V0IHx8IGUuY3lUYXJnZXQ7XG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09IHRhcmdldERyYWdnZWQgJiYgdGFwaGVsZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyByZXR1cm4gdGhlIGluc3RhbmNlIG9mIGV4dGVuc2lvblxuICAgICAgcmV0dXJuIGdldFNjcmF0Y2goY3kpLmluc3RhbmNlO1xuICAgIH0pO1xuXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7IC8vIGV4cG9zZSBhcyBhIGNvbW1vbmpzIG1vZHVsZVxuICAgIG1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkgeyAvLyBleHBvc2UgYXMgYW4gYW1kL3JlcXVpcmVqcyBtb2R1bGVcbiAgICBkZWZpbmUoJ2N5dG9zY2FwZS12aWV3LXV0aWxpdGllcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZWdpc3RlcjtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJykgeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxuICAgIHJlZ2lzdGVyKGN5dG9zY2FwZSk7XG4gIH1cblxufSkoKTtcbiIsIi8vIFJlZ2lzdGVycyB1ciBhY3Rpb25zIHJlbGF0ZWQgdG8gaGlnaGxpZ2h0XG5mdW5jdGlvbiBoaWdobGlnaHRVUihjeSwgdXIsIHZpZXdVdGlsaXRpZXMpIHtcbiAgZnVuY3Rpb24gZ2V0U3RhdHVzKGVsZXMpIHtcbiAgICBlbGVzID0gZWxlcyA/IGVsZXMgOiBjeS5lbGVtZW50cygpO1xuICAgIHZhciBjbGFzc2VzID0gdmlld1V0aWxpdGllcy5nZXRBbGxIaWdobGlnaHRDbGFzc2VzKCk7XG4gICAgdmFyIHIgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHIucHVzaChlbGVzLmZpbHRlcihgLiR7Y2xhc3Nlc1tpXX06dmlzaWJsZWApKVxuICAgIH1cbiAgICB2YXIgc2VsZWN0b3IgPSBjbGFzc2VzLm1hcCh4ID0+ICcuJyArIHgpLmpvaW4oJywnKTtcbiAgICAvLyBsYXN0IGVsZW1lbnQgb2YgYXJyYXkgaXMgZWxlbWVudHMgd2hpY2ggYXJlIG5vdCBoaWdobGlnaHRlZCBieSBhbnkgc3R5bGVcbiAgICByLnB1c2goZWxlcy5maWx0ZXIoXCI6dmlzaWJsZVwiKS5ub3Qoc2VsZWN0b3IpKTtcbiAgICBcbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxVbmRvKGFyZ3MpIHtcbiAgICB2YXIgY3VycmVudCA9IGFyZ3MuY3VycmVudDtcbiAgICB2YXIgciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIHIucHVzaCh2aWV3VXRpbGl0aWVzLmhpZ2hsaWdodChhcmdzW2ldLCBpKSk7XG4gICAgfVxuICAgIC8vIGxhc3QgZWxlbWVudCBpcyBmb3Igbm90IGhpZ2hsaWdodGVkIGJ5IGFueSBzdHlsZVxuICAgIHIucHVzaCh2aWV3VXRpbGl0aWVzLnJlbW92ZUhpZ2hsaWdodHMoYXJnc1thcmdzLmxlbmd0aCAtIDFdKSk7XG5cbiAgICByWydjdXJyZW50J10gPSBjdXJyZW50O1xuICAgIHJldHVybiByO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhbFJlZG8oYXJncykge1xuICAgIHZhciBjdXJyZW50ID0gYXJncy5jdXJyZW50O1xuICAgIHZhciByID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgci5wdXNoKHZpZXdVdGlsaXRpZXMuaGlnaGxpZ2h0KGN1cnJlbnRbaV0sIGkpKTtcbiAgICB9XG4gICAgLy8gbGFzdCBlbGVtZW50IGlzIGZvciBub3QgaGlnaGxpZ2h0ZWQgYnkgYW55IHN0eWxlXG4gICAgci5wdXNoKHZpZXdVdGlsaXRpZXMucmVtb3ZlSGlnaGxpZ2h0cyhjdXJyZW50W2N1cnJlbnQubGVuZ3RoIC0gMV0pKTtcblxuICAgIHJbJ2N1cnJlbnQnXSA9IGN1cnJlbnQ7XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZURvRnVuYyhmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgcmVzID0gZ2V0U3RhdHVzKCk7XG4gICAgICBpZiAoYXJncy5maXJzdFRpbWUpXG4gICAgICAgIHZpZXdVdGlsaXRpZXNbZnVuY10oYXJncy5lbGVzLCBhcmdzLmlkeCk7XG4gICAgICBlbHNlXG4gICAgICAgIGdlbmVyYWxSZWRvKGFyZ3MpO1xuXG4gICAgICByZXMuY3VycmVudCA9IGdldFN0YXR1cygpO1xuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gIH1cblxuICB1ci5hY3Rpb24oXCJoaWdobGlnaHROZWlnaGJvcnNcIiwgZ2VuZXJhdGVEb0Z1bmMoXCJoaWdobGlnaHROZWlnaGJvcnNcIiksIGdlbmVyYWxVbmRvKTtcbiAgdXIuYWN0aW9uKFwiaGlnaGxpZ2h0XCIsIGdlbmVyYXRlRG9GdW5jKFwiaGlnaGxpZ2h0XCIpLCBnZW5lcmFsVW5kbyk7XG4gIHVyLmFjdGlvbihcInJlbW92ZUhpZ2hsaWdodHNcIiwgZ2VuZXJhdGVEb0Z1bmMoXCJyZW1vdmVIaWdobGlnaHRzXCIpLCBnZW5lcmFsVW5kbyk7XG59XG5cbi8vIFJlZ2lzdGVycyB1ciBhY3Rpb25zIHJlbGF0ZWQgdG8gaGlkZS9zaG93XG5mdW5jdGlvbiBoaWRlU2hvd1VSKGN5LCB1ciwgdmlld1V0aWxpdGllcykge1xuICBmdW5jdGlvbiB1clNob3coZWxlcykge1xuICAgIHJldHVybiB2aWV3VXRpbGl0aWVzLnNob3coZWxlcyk7XG4gIH1cblxuICBmdW5jdGlvbiB1ckhpZGUoZWxlcykge1xuICAgIHJldHVybiB2aWV3VXRpbGl0aWVzLmhpZGUoZWxlcyk7XG4gIH1cblxuICBmdW5jdGlvbiB1clNob3dIaWRkZW5OZWlnaGJvcnMoZWxlcykge1xuICAgIHJldHVybiB2aWV3VXRpbGl0aWVzLnNob3dIaWRkZW5OZWlnaGJvcnMoZWxlcyk7XG4gIH1cblxuICB1ci5hY3Rpb24oXCJzaG93XCIsIHVyU2hvdywgdXJIaWRlKTtcbiAgdXIuYWN0aW9uKFwiaGlkZVwiLCB1ckhpZGUsIHVyU2hvdyk7XG4gIHVyLmFjdGlvbihcInNob3dIaWRkZW5OZWlnaGJvcnNcIix1clNob3dIaWRkZW5OZWlnaGJvcnMsIHVySGlkZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGN5LCB1ciwgdmlld1V0aWxpdGllcykge1xuICBoaWdobGlnaHRVUihjeSwgdXIsIHZpZXdVdGlsaXRpZXMpO1xuICBoaWRlU2hvd1VSKGN5LCB1ciwgdmlld1V0aWxpdGllcyk7XG59O1xuIiwidmFyIHZpZXdVdGlsaXRpZXMgPSBmdW5jdGlvbiAoY3ksIG9wdGlvbnMpIHtcblxuICB2YXIgY2xhc3NOYW1lczRTdHlsZXMgPSBbXTtcbiAgLy8gZ2l2ZSBhIHVuaXF1ZSBuYW1lIGZvciBlYWNoIHVuaXF1ZSBzdHlsZSBFVkVSIGFkZGVkXG4gIHZhciB0b3RTdHlsZUNudCA9IDA7XG4gIHZhciBtYXJxdWVlWm9vbUVuYWJsZWQgPSBmYWxzZTtcbiAgdmFyIHNoaWZ0S2V5RG93biA9IGZhbHNlO1xuICB2YXIgY3RybEtleURvd24gPSBmYWxzZTtcbiAgdmFyIHRpbWVyNEtleVVwID0gZmFsc2U7XG4gIHZhciBpc0Rvd25lZEtleVVwID0gZmFsc2U7XG4gIHZhciBwcmV2Q3Vyc29yID0gbnVsbDtcbiAgaW5pdCgpO1xuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIGFkZCBwcm92aWRlZCBzdHlsZXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMuaGlnaGxpZ2h0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcyA9ICdfX2hpZ2hsaWd0aWdodGVkX18nICsgdG90U3R5bGVDbnQ7XG4gICAgICBjbGFzc05hbWVzNFN0eWxlcy5wdXNoKHMpO1xuICAgICAgdG90U3R5bGVDbnQrKztcbiAgICAgIHVwZGF0ZUN5U3R5bGUoaSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHN0eWxlcyBmb3Igc2VsZWN0ZWRcbiAgICBhZGRTZWxlY3Rpb25TdHlsZXMoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmtleSAhPSBcIkNvbnRyb2xcIiAmJiBldmVudC5rZXkgIT0gXCJTaGlmdFwiICYmIGV2ZW50LmtleSAhPSBcIk1ldGFcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC5rZXkgPT0gXCJDb250cm9sXCIgfHwgZXZlbnQua2V5ID09IFwiTWV0YVwiKSB7XG4gICAgICAgIGN0cmxLZXlEb3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGV2ZW50LmtleSA9PSBcIlNoaWZ0XCIpIHtcbiAgICAgICAgc2hpZnRLZXlEb3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlzRG93bmVkS2V5VXAgPSBmYWxzZTtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcjRLZXlVcCk7XG4gICAgICB0aW1lcjRLZXlVcCA9IHNldFRpbWVvdXQoY2FsbEtleVVwTWFudWFsbHksIDc1MCk7XG4gICAgICBpZiAoY3RybEtleURvd24gJiYgc2hpZnRLZXlEb3duICYmICFtYXJxdWVlWm9vbUVuYWJsZWQpIHtcbiAgICAgICAgaW5zdGFuY2UuZW5hYmxlTWFycXVlZVpvb20oKTtcbiAgICAgICAgbWFycXVlZVpvb21FbmFibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5rZXkgIT0gXCJDb250cm9sXCIgJiYgZXZlbnQua2V5ICE9IFwiU2hpZnRcIiAmJiBldmVudC5rZXkgIT0gXCJNZXRhXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXNEb3duZWRLZXlVcCA9IHRydWU7XG4gICAgICBpZiAoZXZlbnQua2V5ID09IFwiU2hpZnRcIikge1xuICAgICAgICBzaGlmdEtleURvd24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGV2ZW50LmtleSA9PSBcIkNvbnRyb2xcIiB8fCBldmVudC5rZXkgPT0gXCJNZXRhXCIpIHtcbiAgICAgICAgY3RybEtleURvd24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXJxdWVlWm9vbUVuYWJsZWQgJiYgKCFzaGlmdEtleURvd24gfHwgIWN0cmxLZXlEb3duKSkge1xuICAgICAgICBpbnN0YW5jZS5kaXNhYmxlTWFycXVlZVpvb20oKTtcbiAgICAgICAgbWFycXVlZVpvb21FbmFibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8vIGN0cmwgKyBzaGlmdCArIHRhYiBkb2VzIG5vdCBjYWxsIGtleXVwIGFmdGVyIGtleWRvd25cbiAgZnVuY3Rpb24gY2FsbEtleVVwTWFudWFsbHkoKSB7XG4gICAgdGltZXI0S2V5VXAgPSBudWxsO1xuICAgIGlmIChpc0Rvd25lZEtleVVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldEN1cnNvcih0cnVlKTtcbiAgICBpc0Rvd25lZEtleVVwID0gdHJ1ZTtcbiAgICBzaGlmdEtleURvd24gPSBmYWxzZTtcbiAgICBjdHJsS2V5RG93biA9IGZhbHNlO1xuICAgIGlmIChtYXJxdWVlWm9vbUVuYWJsZWQpIHtcbiAgICAgIGluc3RhbmNlLmRpc2FibGVNYXJxdWVlWm9vbSgpO1xuICAgICAgbWFycXVlZVpvb21FbmFibGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3Vyc29yKGlzUmV0dXJuQmFjayA9IGZhbHNlKSB7XG4gICAgaWYgKCFvcHRpb25zLmh0bWxFbGVtNG1hcnF1ZWVab29tKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBlbCA9IG51bGw7XG4gICAgaWYgKG9wdGlvbnMuaHRtbEVsZW00bWFycXVlZVpvb20uc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUob3B0aW9ucy5odG1sRWxlbTRtYXJxdWVlWm9vbS5zdWJzdHIoMSkpWzBdO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5odG1sRWxlbTRtYXJxdWVlWm9vbS5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9ucy5odG1sRWxlbTRtYXJxdWVlWm9vbS5zdWJzdHIoMSkpO1xuICAgIH1cbiAgICBpZiAoIWVsKSB7XG4gICAgICBjb25zb2xlLmxvZygnZWxlbWVudCBub3QgZm91bmQhJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc1JldHVybkJhY2spIHtcbiAgICAgIGVsLnN0eWxlLmN1cnNvciA9IHByZXZDdXJzb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXZDdXJzb3IgPSBlbC5zdHlsZS5jdXJzb3I7XG4gICAgICBpZiAob3B0aW9ucy5tYXJxdWVlWm9vbUN1cnNvci5pbmNsdWRlcygnLicpKSB7XG4gICAgICAgIGVsLnN0eWxlLmN1cnNvciA9IGB1cmwoJyR7b3B0aW9ucy5tYXJxdWVlWm9vbUN1cnNvcn0nKSwgcG9pbnRlcmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zdHlsZS5jdXJzb3IgPSBvcHRpb25zLm1hcnF1ZWVab29tQ3Vyc29yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNlbGVjdGlvblN0eWxlcygpIHtcbiAgICBpZiAob3B0aW9ucy5zZWxlY3RTdHlsZXMubm9kZSkge1xuICAgICAgY3kuc3R5bGUoKS5zZWxlY3Rvcignbm9kZTpzZWxlY3RlZCcpLmNzcyhvcHRpb25zLnNlbGVjdFN0eWxlcy5ub2RlKS51cGRhdGUoKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuc2VsZWN0U3R5bGVzLmVkZ2UpIHtcbiAgICAgIGN5LnN0eWxlKCkuc2VsZWN0b3IoJ2VkZ2U6c2VsZWN0ZWQnKS5jc3Mob3B0aW9ucy5zZWxlY3RTdHlsZXMuZWRnZSkudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQ3lTdHlsZShjbGFzc0lkeCkge1xuICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzNFN0eWxlc1tjbGFzc0lkeF07XG4gICAgdmFyIGNzc05vZGUgPSBvcHRpb25zLmhpZ2hsaWdodFN0eWxlc1tjbGFzc0lkeF0ubm9kZTtcbiAgICB2YXIgY3NzRWRnZSA9IG9wdGlvbnMuaGlnaGxpZ2h0U3R5bGVzW2NsYXNzSWR4XS5lZGdlO1xuICAgIGN5LnN0eWxlKCkuc2VsZWN0b3IoJ25vZGUuJyArIGNsYXNzTmFtZSkuY3NzKGNzc05vZGUpLnVwZGF0ZSgpO1xuICAgIGN5LnN0eWxlKCkuc2VsZWN0b3IoJ2VkZ2UuJyArIGNsYXNzTmFtZSkuY3NzKGNzc0VkZ2UpLnVwZGF0ZSgpO1xuICB9XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgaW50ZXJuYWwgdXNhZ2UgKG5vdCB0byBiZSBleHBvc2VkKVxuICBmdW5jdGlvbiBoaWdobGlnaHQoZWxlcywgaWR4KSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5oaWdobGlnaHRTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZXMucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lczRTdHlsZXNbaV0pO1xuICAgIH1cbiAgICBlbGVzLmFkZENsYXNzKGNsYXNzTmFtZXM0U3R5bGVzW2lkeF0pO1xuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRXaXRoTmVpZ2hib3JzKGVsZXMpIHtcbiAgICByZXR1cm4gZWxlcy5hZGQoZWxlcy5kZXNjZW5kYW50cygpKS5jbG9zZWROZWlnaGJvcmhvb2QoKTtcbiAgfVxuICAvLyB0aGUgaW5zdGFuY2UgdG8gYmUgcmV0dXJuZWRcbiAgdmFyIGluc3RhbmNlID0ge307XG5cbiAgLy8gU2VjdGlvbiBoaWRlLXNob3dcbiAgLy8gaGlkZSBnaXZlbiBlbGVzXG4gIGluc3RhbmNlLmhpZGUgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgIC8vZWxlcyA9IGVsZXMuZmlsdGVyKFwibm9kZVwiKVxuICAgIGVsZXMgPSBlbGVzLmZpbHRlcihcIjp2aXNpYmxlXCIpO1xuICAgIGVsZXMgPSBlbGVzLnVuaW9uKGVsZXMuY29ubmVjdGVkRWRnZXMoKSk7XG5cbiAgICBlbGVzLnVuc2VsZWN0KCk7XG5cbiAgICBpZiAob3B0aW9ucy5zZXRWaXNpYmlsaXR5T25IaWRlKSB7XG4gICAgICBlbGVzLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zZXREaXNwbGF5T25IaWRlKSB7XG4gICAgICBlbGVzLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZXM7XG4gIH07XG5cbiAgLy8gdW5oaWRlIGdpdmVuIGVsZXNcbiAgaW5zdGFuY2Uuc2hvdyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgZWxlcyA9IGVsZXMubm90KFwiOnZpc2libGVcIik7XG5cbiAgICBpZiAob3B0aW9ucy5pc1Nob3dFZGdlc0JldHdlZW5WaXNpYmxlTm9kZXMpIHtcbiAgICAgIHZhciBjb25uZWN0ZWRFZGdlcyA9IGVsZXMuY29ubmVjdGVkRWRnZXMoZnVuY3Rpb24gKGVkZ2UpIHtcbiAgICAgICAgaWYgKChlZGdlLnNvdXJjZSgpLnZpc2libGUoKSB8fCBlbGVzLmNvbnRhaW5zKGVkZ2Uuc291cmNlKCkpKSAmJiAoZWRnZS50YXJnZXQoKS52aXNpYmxlKCkgfHwgZWxlcy5jb250YWlucyhlZGdlLnRhcmdldCgpKSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGVsZXMgPSBlbGVzLnVuaW9uKGNvbm5lY3RlZEVkZ2VzKTtcbiAgICB9XG5cbiAgICBlbGVzLnVuc2VsZWN0KCk7XG5cbiAgICBpZiAob3B0aW9ucy5zZXRWaXNpYmlsaXR5T25IaWRlKSB7XG4gICAgICBlbGVzLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2V0RGlzcGxheU9uSGlkZSkge1xuICAgICAgZWxlcy5jc3MoJ2Rpc3BsYXknLCAnZWxlbWVudCcpO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVzO1xuICB9O1xuXG4gIC8vIFNlY3Rpb24gaGlnaGxpZ2h0XG4gIGluc3RhbmNlLnNob3dIaWRkZW5OZWlnaGJvcnMgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgIHJldHVybiB0aGlzLnNob3coZ2V0V2l0aE5laWdoYm9ycyhlbGVzKSk7XG4gIH07XG5cbiAgLy8gSGlnaGxpZ2h0cyBlbGVzXG4gIGluc3RhbmNlLmhpZ2hsaWdodCA9IGZ1bmN0aW9uIChlbGVzLCBpZHggPSAwKSB7XG4gICAgaGlnaGxpZ2h0KGVsZXMsIGlkeCk7IC8vIFVzZSB0aGUgaGVscGVyIGhlcmVcbiAgICByZXR1cm4gZWxlcztcbiAgfTtcblxuICBpbnN0YW5jZS5nZXRIaWdobGlnaHRTdHlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuaGlnaGxpZ2h0U3R5bGVzO1xuICB9O1xuXG4gIC8vIEhpZ2hsaWdodHMgZWxlcycgbmVpZ2hib3Job29kXG4gIGluc3RhbmNlLmhpZ2hsaWdodE5laWdoYm9ycyA9IGZ1bmN0aW9uIChlbGVzLCBpZHggPSAwKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0KGdldFdpdGhOZWlnaGJvcnMoZWxlcyksIGlkeCk7XG4gIH07XG5cbiAgLy8gUmVtb3ZlIGhpZ2hsaWdodHMgZnJvbSBlbGVzLlxuICAvLyBJZiBlbGVzIGlzIG5vdCBkZWZpbmVkIGNvbnNpZGVycyBjeS5lbGVtZW50cygpXG4gIGluc3RhbmNlLnJlbW92ZUhpZ2hsaWdodHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICBpZiAoZWxlcyA9PSBudWxsIHx8IGVsZXMubGVuZ3RoID09IG51bGwpIHtcbiAgICAgIGVsZXMgPSBjeS5lbGVtZW50cygpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMuaGlnaGxpZ2h0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGVzLnJlbW92ZUNsYXNzKGNsYXNzTmFtZXM0U3R5bGVzW2ldKTtcbiAgICB9XG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgICByZXR1cm4gZWxlcztcbiAgfTtcblxuICAvLyBJbmRpY2F0ZXMgaWYgdGhlIGVsZSBpcyBoaWdobGlnaHRlZFxuICBpbnN0YW5jZS5pc0hpZ2hsaWdodGVkID0gZnVuY3Rpb24gKGVsZSkge1xuICAgIHZhciBpc0hpZ2ggPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMuaGlnaGxpZ2h0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZWxlLmlzKCcuJyArIGNsYXNzTmFtZXM0U3R5bGVzW2ldICsgJzp2aXNpYmxlJykpIHtcbiAgICAgICAgaXNIaWdoID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzSGlnaDtcbiAgfTtcblxuICBpbnN0YW5jZS5jaGFuZ2VIaWdobGlnaHRTdHlsZSA9IGZ1bmN0aW9uIChpZHgsIG5vZGVTdHlsZSwgZWRnZVN0eWxlKSB7XG4gICAgb3B0aW9ucy5oaWdobGlnaHRTdHlsZXNbaWR4XS5ub2RlID0gbm9kZVN0eWxlO1xuICAgIG9wdGlvbnMuaGlnaGxpZ2h0U3R5bGVzW2lkeF0uZWRnZSA9IGVkZ2VTdHlsZTtcbiAgICB1cGRhdGVDeVN0eWxlKGlkeCk7XG4gICAgYWRkU2VsZWN0aW9uU3R5bGVzKCk7XG4gIH07XG5cbiAgaW5zdGFuY2UuYWRkSGlnaGxpZ2h0U3R5bGUgPSBmdW5jdGlvbiAobm9kZVN0eWxlLCBlZGdlU3R5bGUpIHtcbiAgICB2YXIgbyA9IHsgbm9kZTogbm9kZVN0eWxlLCBlZGdlOiBlZGdlU3R5bGUgfTtcbiAgICBvcHRpb25zLmhpZ2hsaWdodFN0eWxlcy5wdXNoKG8pO1xuICAgIHZhciBzID0gJ19faGlnaGxpZ3RpZ2h0ZWRfXycgKyB0b3RTdHlsZUNudDtcbiAgICBjbGFzc05hbWVzNFN0eWxlcy5wdXNoKHMpO1xuICAgIHRvdFN0eWxlQ250Kys7XG4gICAgdXBkYXRlQ3lTdHlsZShvcHRpb25zLmhpZ2hsaWdodFN0eWxlcy5sZW5ndGggLSAxKTtcbiAgICBhZGRTZWxlY3Rpb25TdHlsZXMoKTtcbiAgfTtcblxuICBpbnN0YW5jZS5yZW1vdmVIaWdobGlnaHRTdHlsZSA9IGZ1bmN0aW9uIChzdHlsZUlkeCkge1xuICAgIGlmIChzdHlsZUlkeCA8IDAgfHwgc3R5bGVJZHggPiBvcHRpb25zLmhpZ2hsaWdodFN0eWxlcy5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGN5LmVsZW1lbnRzKCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lczRTdHlsZXNbc3R5bGVJZHhdKTtcbiAgICBvcHRpb25zLmhpZ2hsaWdodFN0eWxlcy5zcGxpY2Uoc3R5bGVJZHgsIDEpO1xuICAgIGNsYXNzTmFtZXM0U3R5bGVzLnNwbGljZShzdHlsZUlkeCwgMSk7XG4gIH07XG5cbiAgaW5zdGFuY2UuZ2V0QWxsSGlnaGxpZ2h0Q2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5oaWdobGlnaHRTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGEucHVzaChjbGFzc05hbWVzNFN0eWxlc1tpXSk7XG4gICAgfVxuICAgIHJldHVybiBjbGFzc05hbWVzNFN0eWxlcztcbiAgfTtcblxuICAvL1pvb20gc2VsZWN0ZWQgTm9kZXNcbiAgaW5zdGFuY2Uuem9vbVRvU2VsZWN0ZWQgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgIHZhciBib3VuZGluZ0JveCA9IGVsZXMuYm91bmRpbmdCb3goKTtcbiAgICB2YXIgZGlmZl94ID0gTWF0aC5hYnMoYm91bmRpbmdCb3gueDEgLSBib3VuZGluZ0JveC54Mik7XG4gICAgdmFyIGRpZmZfeSA9IE1hdGguYWJzKGJvdW5kaW5nQm94LnkxIC0gYm91bmRpbmdCb3gueTIpO1xuICAgIHZhciBwYWRkaW5nO1xuICAgIGlmIChkaWZmX3ggPj0gMjAwIHx8IGRpZmZfeSA+PSAyMDApIHtcbiAgICAgIHBhZGRpbmcgPSA1MDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwYWRkaW5nID0gKGN5LndpZHRoKCkgPCBjeS5oZWlnaHQoKSkgP1xuICAgICAgICAoKDIwMCAtIGRpZmZfeCkgLyAyICogY3kud2lkdGgoKSAvIDIwMCkgOiAoKDIwMCAtIGRpZmZfeSkgLyAyICogY3kuaGVpZ2h0KCkgLyAyMDApO1xuICAgIH1cblxuICAgIGN5LmFuaW1hdGUoe1xuICAgICAgZml0OiB7XG4gICAgICAgIGVsZXM6IGVsZXMsXG4gICAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBkdXJhdGlvbjogb3B0aW9ucy56b29tQW5pbWF0aW9uRHVyYXRpb25cbiAgICB9KTtcbiAgICByZXR1cm4gZWxlcztcbiAgfTtcblxuICAvL01hcnF1ZWUgWm9vbVxuICB2YXIgdGFiU3RhcnRIYW5kbGVyO1xuICB2YXIgdGFiRW5kSGFuZGxlcjtcblxuICBpbnN0YW5jZS5lbmFibGVNYXJxdWVlWm9vbSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHNldEN1cnNvcihmYWxzZSk7XG4gICAgbWFycXVlZVpvb21FbmFibGVkID0gdHJ1ZTtcbiAgICB2YXIgcmVjdF9zdGFydF9wb3NfeCwgcmVjdF9zdGFydF9wb3NfeSwgcmVjdF9lbmRfcG9zX3gsIHJlY3RfZW5kX3Bvc195O1xuICAgIC8vTWFrZSB0aGUgY3kgdW5zZWxlY3RhYmxlXG4gICAgY3kuYXV0b3Vuc2VsZWN0aWZ5KHRydWUpO1xuXG4gICAgY3kub25lKCd0YXBzdGFydCcsIHRhYlN0YXJ0SGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKHNoaWZ0S2V5RG93biA9PSB0cnVlKSB7XG4gICAgICAgIHJlY3Rfc3RhcnRfcG9zX3ggPSBldmVudC5wb3NpdGlvbi54O1xuICAgICAgICByZWN0X3N0YXJ0X3Bvc195ID0gZXZlbnQucG9zaXRpb24ueTtcbiAgICAgICAgcmVjdF9lbmRfcG9zX3ggPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY3kub25lKCd0YXBlbmQnLCB0YWJFbmRIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICByZWN0X2VuZF9wb3NfeCA9IGV2ZW50LnBvc2l0aW9uLng7XG4gICAgICByZWN0X2VuZF9wb3NfeSA9IGV2ZW50LnBvc2l0aW9uLnk7XG4gICAgICAvL2NoZWNrIHdoZXRoZXIgY29ybmVycyBvZiByZWN0YW5nbGUgaXMgdW5kZWZpbmVkXG4gICAgICAvL2Fib3J0IG1hcnF1ZWUgem9vbSBpZiBvbmUgY29ybmVyIGlzIHVuZGVmaW5lZFxuICAgICAgaWYgKHJlY3Rfc3RhcnRfcG9zX3ggPT0gdW5kZWZpbmVkIHx8IHJlY3RfZW5kX3Bvc194ID09IHVuZGVmaW5lZCkge1xuICAgICAgICBjeS5hdXRvdW5zZWxlY3RpZnkoZmFsc2UpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vUmVvZGVyIHJlY3RhbmdsZSBwb3NpdGlvbnNcbiAgICAgIC8vVG9wIGxlZnQgb2YgdGhlIHJlY3RhbmdsZSAocmVjdF9zdGFydF9wb3NfeCwgcmVjdF9zdGFydF9wb3NfeSlcbiAgICAgIC8vcmlnaHQgYm90dG9tIG9mIHRoZSByZWN0YW5nbGUgKHJlY3RfZW5kX3Bvc194LCByZWN0X2VuZF9wb3NfeSlcbiAgICAgIGlmIChyZWN0X3N0YXJ0X3Bvc194ID4gcmVjdF9lbmRfcG9zX3gpIHtcbiAgICAgICAgdmFyIHRlbXAgPSByZWN0X3N0YXJ0X3Bvc194O1xuICAgICAgICByZWN0X3N0YXJ0X3Bvc194ID0gcmVjdF9lbmRfcG9zX3g7XG4gICAgICAgIHJlY3RfZW5kX3Bvc194ID0gdGVtcDtcbiAgICAgIH1cbiAgICAgIGlmIChyZWN0X3N0YXJ0X3Bvc195ID4gcmVjdF9lbmRfcG9zX3kpIHtcbiAgICAgICAgdmFyIHRlbXAgPSByZWN0X3N0YXJ0X3Bvc195O1xuICAgICAgICByZWN0X3N0YXJ0X3Bvc195ID0gcmVjdF9lbmRfcG9zX3k7XG4gICAgICAgIHJlY3RfZW5kX3Bvc195ID0gdGVtcDtcbiAgICAgIH1cblxuICAgICAgLy9FeHRlbmQgc2lkZXMgb2Ygc2VsZWN0ZWQgcmVjdGFuZ2xlIHRvIDIwMHB4IGlmIGxlc3MgdGhhbiAxMDBweFxuICAgICAgaWYgKHJlY3RfZW5kX3Bvc194IC0gcmVjdF9zdGFydF9wb3NfeCA8IDIwMCkge1xuICAgICAgICB2YXIgZXh0ZW5kUHggPSAoMjAwIC0gKHJlY3RfZW5kX3Bvc194IC0gcmVjdF9zdGFydF9wb3NfeCkpIC8gMjtcbiAgICAgICAgcmVjdF9zdGFydF9wb3NfeCAtPSBleHRlbmRQeDtcbiAgICAgICAgcmVjdF9lbmRfcG9zX3ggKz0gZXh0ZW5kUHg7XG4gICAgICB9XG4gICAgICBpZiAocmVjdF9lbmRfcG9zX3kgLSByZWN0X3N0YXJ0X3Bvc195IDwgMjAwKSB7XG4gICAgICAgIHZhciBleHRlbmRQeCA9ICgyMDAgLSAocmVjdF9lbmRfcG9zX3kgLSByZWN0X3N0YXJ0X3Bvc195KSkgLyAyO1xuICAgICAgICByZWN0X3N0YXJ0X3Bvc195IC09IGV4dGVuZFB4O1xuICAgICAgICByZWN0X2VuZF9wb3NfeSArPSBleHRlbmRQeDtcbiAgICAgIH1cblxuICAgICAgLy9DaGVjayB3aGV0aGVyIHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggYm91bmRpbmcgYm94IG9mIHRoZSBncmFwaFxuICAgICAgLy9pZiBub3QgYWJvcnQgbWFycXVlZSB6b29tXG4gICAgICBpZiAoKHJlY3Rfc3RhcnRfcG9zX3ggPiBjeS5lbGVtZW50cygpLmJvdW5kaW5nQm94KCkueDIpXG4gICAgICAgIHx8IChyZWN0X2VuZF9wb3NfeCA8IGN5LmVsZW1lbnRzKCkuYm91bmRpbmdCb3goKS54MSlcbiAgICAgICAgfHwgKHJlY3Rfc3RhcnRfcG9zX3kgPiBjeS5lbGVtZW50cygpLmJvdW5kaW5nQm94KCkueTIpXG4gICAgICAgIHx8IChyZWN0X2VuZF9wb3NfeSA8IGN5LmVsZW1lbnRzKCkuYm91bmRpbmdCb3goKS55MSkpIHtcbiAgICAgICAgY3kuYXV0b3Vuc2VsZWN0aWZ5KGZhbHNlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vQ2FsY3VsYXRlIHpvb20gbGV2ZWxcbiAgICAgIHZhciB6b29tTGV2ZWwgPSBNYXRoLm1pbihjeS53aWR0aCgpIC8gKE1hdGguYWJzKHJlY3RfZW5kX3Bvc194IC0gcmVjdF9zdGFydF9wb3NfeCkpLFxuICAgICAgICBjeS5oZWlnaHQoKSAvIE1hdGguYWJzKHJlY3RfZW5kX3Bvc195IC0gcmVjdF9zdGFydF9wb3NfeSkpO1xuXG4gICAgICB2YXIgZGlmZl94ID0gY3kud2lkdGgoKSAvIDIgLSAoY3kucGFuKCkueCArIHpvb21MZXZlbCAqIChyZWN0X3N0YXJ0X3Bvc194ICsgcmVjdF9lbmRfcG9zX3gpIC8gMik7XG4gICAgICB2YXIgZGlmZl95ID0gY3kuaGVpZ2h0KCkgLyAyIC0gKGN5LnBhbigpLnkgKyB6b29tTGV2ZWwgKiAocmVjdF9zdGFydF9wb3NfeSArIHJlY3RfZW5kX3Bvc195KSAvIDIpO1xuXG4gICAgICBjeS5hbmltYXRlKHtcbiAgICAgICAgcGFuQnk6IHsgeDogZGlmZl94LCB5OiBkaWZmX3kgfSxcbiAgICAgICAgem9vbTogem9vbUxldmVsLFxuICAgICAgICBkdXJhdGlvbjogb3B0aW9ucy56b29tQW5pbWF0aW9uRHVyYXRpb24sXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjeS5hdXRvdW5zZWxlY3RpZnkoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBpbnN0YW5jZS5kaXNhYmxlTWFycXVlZVpvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0Q3Vyc29yKHRydWUpO1xuICAgIGN5Lm9mZigndGFwc3RhcnQnLCB0YWJTdGFydEhhbmRsZXIpO1xuICAgIGN5Lm9mZigndGFwZW5kJywgdGFiRW5kSGFuZGxlcik7XG4gICAgY3kuYXV0b3Vuc2VsZWN0aWZ5KGZhbHNlKTtcbiAgICBtYXJxdWVlWm9vbUVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcbiAgLy9MYXNzbyBNb2RlXG4gIHZhciBnZW9tZXRyaWMgPSByZXF1aXJlKCdnZW9tZXRyaWMnKTtcblxuICBpbnN0YW5jZS5jaGFuZ2VMYXNzb1N0eWxlID0gZnVuY3Rpb24gKHN0eWxlT2JqKSB7XG4gICAgaWYgKHN0eWxlT2JqLmxpbmVXaWR0aClcbiAgICAgIG9wdGlvbnMubGFzc29TdHlsZS5saW5lV2lkdGggPSBzdHlsZU9iai5saW5lV2lkdGg7XG4gICAgaWYgKHN0eWxlT2JqLmxpbmVDb2xvcilcbiAgICAgIG9wdGlvbnMubGFzc29TdHlsZS5saW5lQ29sb3IgPSBzdHlsZU9iai5saW5lQ29sb3I7XG4gIH07XG5cbiAgaW5zdGFuY2UuZW5hYmxlTGFzc29Nb2RlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgaXNDbGlja2VkID0gZmFsc2U7XG4gICAgdmFyIHRlbXBDYW52ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGVtcENhbnYuaWQgPSAnbGFzc28tY2FudmFzJztcbiAgICBjb25zdCBjb250YWluZXIgPSBjeS5jb250YWluZXIoKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcENhbnYpO1xuXG4gICAgY29uc3Qgd2lkdGggPSBjb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gY29udGFpbmVyLm9mZnNldEhlaWdodDtcblxuICAgIHRlbXBDYW52LndpZHRoID0gd2lkdGg7XG4gICAgdGVtcENhbnYuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRlbXBDYW52LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGB6LWluZGV4OiAxMDAwOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDtgLCk7XG5cbiAgICBjeS5wYW5uaW5nRW5hYmxlZChmYWxzZSk7XG4gICAgY3kuem9vbWluZ0VuYWJsZWQoZmFsc2UpO1xuICAgIGN5LmF1dG91bnNlbGVjdGlmeSh0cnVlKTtcbiAgICB2YXIgcG9pbnRzID0gW107XG5cbiAgICB0ZW1wQ2Fudi5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgIGlmIChpc0NsaWNrZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgaXNDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0ZW1wQ2Fudi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBvcHRpb25zLmxhc3NvU3R5bGUubGluZUNvbG9yO1xuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IG9wdGlvbnMubGFzc29TdHlsZS5saW5lV2lkdGg7XG4gICAgICAgIGNvbnRleHQubGluZUpvaW4gPSBcInJvdW5kXCI7XG4gICAgICAgIGN5LnBhbm5pbmdFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgY3kuem9vbWluZ0VuYWJsZWQoZmFsc2UpO1xuICAgICAgICBjeS5hdXRvdW5zZWxlY3RpZnkodHJ1ZSk7XG4gICAgICAgIHZhciBmb3JtZXJYID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgICAgdmFyIGZvcm1lclkgPSBldmVudC5vZmZzZXRZO1xuXG4gICAgICAgIHBvaW50cy5wdXNoKFtmb3JtZXJYLCBmb3JtZXJZXSk7XG4gICAgICAgIHRlbXBDYW52Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaXNDbGlja2VkID0gZmFsc2U7XG4gICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHRlbXBDYW52KTtcbiAgICAgICAgICB0ZW1wQ2FudiA9IG51bGw7XG4gICAgICAgICAgY3kucGFubmluZ0VuYWJsZWQodHJ1ZSk7XG4gICAgICAgICAgY3kuem9vbWluZ0VuYWJsZWQodHJ1ZSk7XG4gICAgICAgICAgY3kuYXV0b3Vuc2VsZWN0aWZ5KGZhbHNlKTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0ZW1wQ2Fudi5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBwb2ludHMucHVzaChbZS5vZmZzZXRYLCBlLm9mZnNldFldKTtcbiAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhmb3JtZXJYLCBmb3JtZXJZKTtcbiAgICAgICAgICBjb250ZXh0LmxpbmVUbyhlLm9mZnNldFgsIGUub2Zmc2V0WSk7XG4gICAgICAgICAgZm9ybWVyWCA9IGUub2Zmc2V0WDtcbiAgICAgICAgICBmb3JtZXJZID0gZS5vZmZzZXRZO1xuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCk7XG4gICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChlbGVzW2ldLmlzRWRnZSgpKSB7XG5cbiAgICAgICAgICAgIHZhciBwMSA9IFsoZWxlc1tpXS5zb3VyY2VFbmRwb2ludCgpLngpICogY3kuem9vbSgpICsgY3kucGFuKCkueCwgKGVsZXNbaV0uc291cmNlRW5kcG9pbnQoKS55KSAqIGN5Lnpvb20oKSArIGN5LnBhbigpLnldO1xuICAgICAgICAgICAgdmFyIHAyID0gWyhlbGVzW2ldLnRhcmdldEVuZHBvaW50KCkueCkgKiBjeS56b29tKCkgKyBjeS5wYW4oKS54LCAoZWxlc1tpXS50YXJnZXRFbmRwb2ludCgpLnkpICogY3kuem9vbSgpICsgY3kucGFuKCkueV07XG5cbiAgICAgICAgICAgIGlmIChnZW9tZXRyaWMucG9pbnRJblBvbHlnb24ocDEsIHBvaW50cykgJiYgZ2VvbWV0cmljLnBvaW50SW5Qb2x5Z29uKHAyLCBwb2ludHMpKSB7XG4gICAgICAgICAgICAgIGVsZXNbaV0uc2VsZWN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjeS5hdXRvdW5zZWxlY3RpZnkoZmFsc2UpO1xuICAgICAgICAgICAgdmFyIGJiID0gW1tlbGVzW2ldLnJlbmRlcmVkQm91bmRpbmdCb3goKS54MSwgZWxlc1tpXS5yZW5kZXJlZEJvdW5kaW5nQm94KCkueTFdLFxuICAgICAgICAgICAgW2VsZXNbaV0ucmVuZGVyZWRCb3VuZGluZ0JveCgpLngxLCBlbGVzW2ldLnJlbmRlcmVkQm91bmRpbmdCb3goKS55Ml0sXG4gICAgICAgICAgICBbZWxlc1tpXS5yZW5kZXJlZEJvdW5kaW5nQm94KCkueDIsIGVsZXNbaV0ucmVuZGVyZWRCb3VuZGluZ0JveCgpLnkyXSxcbiAgICAgICAgICAgIFtlbGVzW2ldLnJlbmRlcmVkQm91bmRpbmdCb3goKS54MiwgZWxlc1tpXS5yZW5kZXJlZEJvdW5kaW5nQm94KCkueTFdXTtcblxuICAgICAgICAgICAgaWYgKGdlb21ldHJpYy5wb2x5Z29uSW50ZXJzZWN0c1BvbHlnb24oYmIsIHBvaW50cykgfHwgZ2VvbWV0cmljLnBvbHlnb25JblBvbHlnb24oYmIsIHBvaW50cylcbiAgICAgICAgICAgICAgfHwgZ2VvbWV0cmljLnBvbHlnb25JblBvbHlnb24ocG9pbnRzLCBiYikpIHtcbiAgICAgICAgICAgICAgZWxlc1tpXS5zZWxlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaXNDbGlja2VkID0gZmFsc2U7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh0ZW1wQ2Fudik7XG4gICAgICAgIHRlbXBDYW52ID0gbnVsbDtcblxuICAgICAgICBjeS5wYW5uaW5nRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgY3kuem9vbWluZ0VuYWJsZWQodHJ1ZSk7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGluc3RhbmNlLmRpc2FibGVMYXNzb01vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFzc28tY2FudmFzJyk7XG4gICAgaWYgKGMpIHtcbiAgICAgIGMucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChjKTtcbiAgICAgIGMgPSBudWxsO1xuICAgIH1cbiAgICBjeS5wYW5uaW5nRW5hYmxlZCh0cnVlKTtcbiAgICBjeS56b29taW5nRW5hYmxlZCh0cnVlKTtcbiAgICBjeS5hdXRvdW5zZWxlY3RpZnkoZmFsc2UpO1xuICB9XG4gIC8vIHJldHVybiB0aGUgaW5zdGFuY2VcbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB2aWV3VXRpbGl0aWVzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18zX187Il0sInNvdXJjZVJvb3QiOiIifQ==