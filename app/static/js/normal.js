/*!
 * ----------------------------------------------------------------------
 * elegance: Front-end site library
 * Other scripts may access this api using an async handler:
 *   var elegance = elegance || [];
 *   elegance.push(readyFunction);
 * ----------------------------------------------------------------------
 */
var elegance = { w: elegance };
elegance.init = function () {
  'use strict';
  
  var $ = window.$;
  var api = {};
  var modules = {};
  var primary = [];
  var secondary = this.w || [];
  var $win = $(window);
  var _ = api._ = underscore();
  var domready = false;
  
  /**
   * elegance.define() - Define a elegance.js module
   * @param  {string} name
   * @param  {function} factory
   */
  api.define = function (name, factory) {
    var module = modules[name] = factory($, _);
    if (!module) return;
    // If running in elegance app, subscribe to design/preview events
    if (api.env()) {
      $.isFunction(module.design) && window.addEventListener('__wf_design', module.design);
      $.isFunction(module.preview) && window.addEventListener('__wf_preview', module.preview);
    }
    // Look for a ready method on module
    if (module.ready && $.isFunction(module.ready)) {
      // If domready has already happened, call ready method
      if (domready) module.ready();
      // Otherwise push ready method into primary queue
      else primary.push(module.ready);
    }
  };
  
  /**
   * elegance.require() - Load a elegance.js module
   * @param  {string} name
   * @return {object}
   */
  api.require = function (name) {
    return modules[name];
  };
  
  /**
   * elegance.push() - Add a ready handler into secondary queue
   * @param {function} ready  Callback to invoke on domready
   */
  api.push = function (ready) {
    // If domready has already happened, invoke handler
    if (domready) {
      $.isFunction(ready) && ready();
      return;
    }
    // Otherwise push into secondary queue
    secondary.push(ready);
  };
  
  /**
   * elegance.env() - Get the state of the elegance app
   * @param {string} mode [optional]
   * @return {boolean}
   */
  api.env = function (mode) {
    var designFlag = window.__wf_design;
    var inApp = typeof designFlag != 'undefined';
    if (!mode) return inApp;
    if (mode == 'design') return inApp && designFlag;
    if (mode == 'preview') return inApp && !designFlag;
    if (mode == 'slug') return inApp && window.__wf_slug;
  };
  
  // Feature detects + browser sniffs  ಠ_ಠ
  var ua = navigator.userAgent;
  api.env.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch;
  api.env.chrome = /chrome|crios/i.test(ua);
  
  /**
   * elegance.script() - Append script to document head
   * @param {string} src
   */
  api.script = function (src) {
    var doc = document;
    var scriptNode = doc.createElement('script');
    scriptNode.type = 'text/javascript';
    scriptNode.src = src;
    doc.getElementsByTagName('head')[0].appendChild(scriptNode);
  };
  
  /**
   * elegance.resize - Centralized window resize events
   */
  api.resize = function () {
    // Set up throttled resize event
    var handlers = [];
    var resize = {};
    resize.up = _.throttle(function (evt) {
      _.each(handlers, function (h) { h(evt); });
    });
    // Bind resize events to window
    $win.on('resize.elegance orientationchange.elegance load.elegance', resize.up);
    /**
     * Add an event handler
     * @param  {function} handler
     */
    resize.on = function (handler) {
      if (typeof handler != 'function') return;
      if (_.contains(handlers, handler)) return;
      handlers.push(handler);
    };
    /**
     * Remove an event handler
     * @param  {function} handler
     */
    resize.off = function (handler) {
      handlers = _.filter(handlers, function (h) {
        return h !== handler;
      });
    };
    return resize;
  }();
  
  // Wrap window.location in api
  api.location = function (url) {
    window.location = url;
  };
  
  // Designer-specific methods
  if (api.env()) {
    // Trigger redraw for specific elements
    var Event = window.Event;
    var redraw = new Event('__wf_redraw');
    $.fn.redraw = function () {
      return this.each(function () {
        this.dispatchEvent(redraw);
      });
    };
    // Trigger event instead of changing location
    api.location = function (url) {
      window.dispatchEvent(new CustomEvent('__wf_location', { detail: url }));
    };
  }
  
  // DOM ready - Call primary and secondary handlers
  $(function () {
    domready = true;
    $.each(primary.concat(secondary), function (index, value) {
      $.isFunction(value) && value();
    });
    // Trigger resize
    api.resize.up();
  });
  
  /*!
   * elegance._ (aka) Underscore.js 1.5.2 (custom build)
   * _.each
   * _.map
   * _.filter
   * _.any
   * _.contains
   * _.delay
   * _.defer
   * _.throttle (elegance)
   * _.debounce
   * _.keys
   * _.has
   * 
   * http://underscorejs.org
   * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Underscore may be freely distributed under the MIT license.
   */
  function underscore() {
    var _ = {};
    
    // Current version.
    _.VERSION = '1.5.2-elegance';
    
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    
    // Create quick reference variables for speed access to core prototypes.
    var
      push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;
    
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeForEach      = ArrayProto.forEach,
      nativeMap          = ArrayProto.map,
      nativeReduce       = ArrayProto.reduce,
      nativeReduceRight  = ArrayProto.reduceRight,
      nativeFilter       = ArrayProto.filter,
      nativeEvery        = ArrayProto.every,
      nativeSome         = ArrayProto.some,
      nativeIndexOf      = ArrayProto.indexOf,
      nativeLastIndexOf  = ArrayProto.lastIndexOf,
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind;
    
    // Collection Functions
    // --------------------
    
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
      /* jshint shadow:true */
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
      }
    };
    
    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
      });
      return results;
    };
    
    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
      each(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) results.push(value);
      });
      return results;
    };
    
    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = false;
      if (obj == null) return result;
      if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
      each(obj, function(value, index, list) {
        if (result || (result = iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
    
    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function(obj, target) {
      if (obj == null) return false;
      if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
      return any(obj, function(value) {
        return value === target;
      });
    };
    
    // Function (ahem) Functions
    // --------------------
    
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function(){ return func.apply(null, args); }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function(func) {
      return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };
    
    // Returns a function, that, when invoked, will only be triggered once every
    // browser animation frame - using tram's requestAnimationFrame polyfill.
    _.throttle = function(func) {
      var wait, args, context;
      return function () {
        if (wait) return;
        wait = true;
        args = arguments;
        context = this;
        window.tram.frame(function () {
          wait = false;
          func.apply(context, args);
        });
      };
    };
    
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      return function() {
        context = this;
        args = arguments;
        timestamp = new Date();
        var later = function() {
          var last = (new Date()) - timestamp;
          if (last < wait) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
          }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        if (callNow) result = func.apply(context, args);
        return result;
      };
    };
    
    // Object Functions
    // ----------------

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = nativeKeys || function(obj) {
      if (obj !== Object(obj)) throw new TypeError('Invalid object');
      var keys = [];
      for (var key in obj) if (_.has(obj, key)) keys.push(key);
      return keys;
    };
    
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
      return hasOwnProperty.call(obj, key);
    };
    
    // Export underscore
    return _;
  }
    
  // Export api
  elegance = api;
};
/*!
 * ----------------------------------------------------------------------
 * elegance: 3rd party plugins
 */
/* jshint ignore:start */
/*!
 * tram.js v0.6.2-global
 * Cross-browser CSS3 transitions in JavaScript.
 * https://github.com/bkwld/tram
 * MIT License
 */
window.tram=function(t){function i(t,i){var e=new I.Bare;return e.init(t,i)}function e(t){return t.replace(/[A-Z]/g,function(t){return"-"+t.toLowerCase()})}function n(t){var i=parseInt(t.slice(1),16),e=255&i>>16,n=255&i>>8,r=255&i;return[e,n,r]}function r(t,i,e){return"#"+(1<<24|t<<16|i<<8|e).toString(16).slice(1)}function s(){}function a(t,i){V("Type warning: Expected: ["+t+"] Got: ["+typeof i+"] "+i)}function o(t,i,e){V("Units do not match ["+t+"]: "+i+", "+e)}function u(t,i,e){if(void 0!==i&&(e=i),void 0===t)return e;var n=e;return J.test(t)||!K.test(t)?n=parseInt(t,10):K.test(t)&&(n=1e3*parseFloat(t)),0>n&&(n=0),n===n?n:e}function c(t){for(var i=-1,e=t?t.length:0,n=[];e>++i;){var r=t[i];r&&n.push(r)}return n}var h=function(t,i,e){function n(t){return"object"==typeof t}function r(t){return"function"==typeof t}function s(){}function a(o,u){function c(){var t=new h;return r(t.init)&&t.init.apply(t,arguments),t}function h(){}u===e&&(u=o,o=Object),c.Bare=h;var l,f=s[t]=o[t],d=h[t]=c[t]=new s;return d.constructor=c,c.mixin=function(i){return h[t]=c[t]=a(c,i)[t],c},c.open=function(t){if(l={},r(t)?l=t.call(c,d,f,c,o):n(t)&&(l=t),n(l))for(var e in l)i.call(l,e)&&(d[e]=l[e]);return r(d.init)||(d.init=o),c},c.open(u)}return a}("prototype",{}.hasOwnProperty),l={ease:["ease",function(t,i,e,n){var r=(t/=n)*t,s=r*t;return i+e*(-2.75*s*r+11*r*r+-15.5*s+8*r+.25*t)}],"ease-in":["ease-in",function(t,i,e,n){var r=(t/=n)*t,s=r*t;return i+e*(-1*s*r+3*r*r+-3*s+2*r)}],"ease-out":["ease-out",function(t,i,e,n){var r=(t/=n)*t,s=r*t;return i+e*(.3*s*r+-1.6*r*r+2.2*s+-1.8*r+1.9*t)}],"ease-in-out":["ease-in-out",function(t,i,e,n){var r=(t/=n)*t,s=r*t;return i+e*(2*s*r+-5*r*r+2*s+2*r)}],linear:["linear",function(t,i,e,n){return e*t/n+i}],"ease-in-quad":["cubic-bezier(0.550, 0.085, 0.680, 0.530)",function(t,i,e,n){return e*(t/=n)*t+i}],"ease-out-quad":["cubic-bezier(0.250, 0.460, 0.450, 0.940)",function(t,i,e,n){return-e*(t/=n)*(t-2)+i}],"ease-in-out-quad":["cubic-bezier(0.455, 0.030, 0.515, 0.955)",function(t,i,e,n){return 1>(t/=n/2)?e/2*t*t+i:-e/2*(--t*(t-2)-1)+i}],"ease-in-cubic":["cubic-bezier(0.550, 0.055, 0.675, 0.190)",function(t,i,e,n){return e*(t/=n)*t*t+i}],"ease-out-cubic":["cubic-bezier(0.215, 0.610, 0.355, 1)",function(t,i,e,n){return e*((t=t/n-1)*t*t+1)+i}],"ease-in-out-cubic":["cubic-bezier(0.645, 0.045, 0.355, 1)",function(t,i,e,n){return 1>(t/=n/2)?e/2*t*t*t+i:e/2*((t-=2)*t*t+2)+i}],"ease-in-quart":["cubic-bezier(0.895, 0.030, 0.685, 0.220)",function(t,i,e,n){return e*(t/=n)*t*t*t+i}],"ease-out-quart":["cubic-bezier(0.165, 0.840, 0.440, 1)",function(t,i,e,n){return-e*((t=t/n-1)*t*t*t-1)+i}],"ease-in-out-quart":["cubic-bezier(0.770, 0, 0.175, 1)",function(t,i,e,n){return 1>(t/=n/2)?e/2*t*t*t*t+i:-e/2*((t-=2)*t*t*t-2)+i}],"ease-in-quint":["cubic-bezier(0.755, 0.050, 0.855, 0.060)",function(t,i,e,n){return e*(t/=n)*t*t*t*t+i}],"ease-out-quint":["cubic-bezier(0.230, 1, 0.320, 1)",function(t,i,e,n){return e*((t=t/n-1)*t*t*t*t+1)+i}],"ease-in-out-quint":["cubic-bezier(0.860, 0, 0.070, 1)",function(t,i,e,n){return 1>(t/=n/2)?e/2*t*t*t*t*t+i:e/2*((t-=2)*t*t*t*t+2)+i}],"ease-in-sine":["cubic-bezier(0.470, 0, 0.745, 0.715)",function(t,i,e,n){return-e*Math.cos(t/n*(Math.PI/2))+e+i}],"ease-out-sine":["cubic-bezier(0.390, 0.575, 0.565, 1)",function(t,i,e,n){return e*Math.sin(t/n*(Math.PI/2))+i}],"ease-in-out-sine":["cubic-bezier(0.445, 0.050, 0.550, 0.950)",function(t,i,e,n){return-e/2*(Math.cos(Math.PI*t/n)-1)+i}],"ease-in-expo":["cubic-bezier(0.950, 0.050, 0.795, 0.035)",function(t,i,e,n){return 0===t?i:e*Math.pow(2,10*(t/n-1))+i}],"ease-out-expo":["cubic-bezier(0.190, 1, 0.220, 1)",function(t,i,e,n){return t===n?i+e:e*(-Math.pow(2,-10*t/n)+1)+i}],"ease-in-out-expo":["cubic-bezier(1, 0, 0, 1)",function(t,i,e,n){return 0===t?i:t===n?i+e:1>(t/=n/2)?e/2*Math.pow(2,10*(t-1))+i:e/2*(-Math.pow(2,-10*--t)+2)+i}],"ease-in-circ":["cubic-bezier(0.600, 0.040, 0.980, 0.335)",function(t,i,e,n){return-e*(Math.sqrt(1-(t/=n)*t)-1)+i}],"ease-out-circ":["cubic-bezier(0.075, 0.820, 0.165, 1)",function(t,i,e,n){return e*Math.sqrt(1-(t=t/n-1)*t)+i}],"ease-in-out-circ":["cubic-bezier(0.785, 0.135, 0.150, 0.860)",function(t,i,e,n){return 1>(t/=n/2)?-e/2*(Math.sqrt(1-t*t)-1)+i:e/2*(Math.sqrt(1-(t-=2)*t)+1)+i}],"ease-in-back":["cubic-bezier(0.600, -0.280, 0.735, 0.045)",function(t,i,e,n,r){return void 0===r&&(r=1.70158),e*(t/=n)*t*((r+1)*t-r)+i}],"ease-out-back":["cubic-bezier(0.175, 0.885, 0.320, 1.275)",function(t,i,e,n,r){return void 0===r&&(r=1.70158),e*((t=t/n-1)*t*((r+1)*t+r)+1)+i}],"ease-in-out-back":["cubic-bezier(0.680, -0.550, 0.265, 1.550)",function(t,i,e,n,r){return void 0===r&&(r=1.70158),1>(t/=n/2)?e/2*t*t*(((r*=1.525)+1)*t-r)+i:e/2*((t-=2)*t*(((r*=1.525)+1)*t+r)+2)+i}]},f={"ease-in-back":"cubic-bezier(0.600, 0, 0.735, 0.045)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.320, 1)","ease-in-out-back":"cubic-bezier(0.680, 0, 0.265, 1)"},d=document,p=window,b="bkwld-tram",m=/[\-\.0-9]/g,v=/[A-Z]/,g="number",y=/^(rgb|#)/,w=/(em|cm|mm|in|pt|pc|px)$/,k=/(em|cm|mm|in|pt|pc|px|%)$/,x=/(deg|rad|turn)$/,z="unitless",q=" ",$=d.createElement("a"),M=["Webkit","Moz","O","ms"],A=["-webkit-","-moz-","-o-","-ms-"],B=function(t){if(t in $.style)return{dom:t,css:t};var i,e,n="",r=t.split("-");for(i=0;r.length>i;i++)n+=r[i].charAt(0).toUpperCase()+r[i].slice(1);for(i=0;M.length>i;i++)if(e=M[i]+n,e in $.style)return{dom:e,css:A[i]+t}},R=i.support={bind:Function.prototype.bind,transform:B("transform"),transition:B("transition"),backface:B("backface-visibility"),timing:B("transition-timing-function")};if(R.transition){var F=R.timing.dom;if($.style[F]=l["ease-in-back"][0],!$.style[F])for(var j in f)l[j][0]=f[j]}var G=i.frame=function(){var t=p.requestAnimationFrame||p.webkitRequestAnimationFrame||p.mozRequestAnimationFrame||p.oRequestAnimationFrame||p.msRequestAnimationFrame;return t&&R.bind?t.bind(p):function(t){p.setTimeout(t,16)}}(),T=i.now=function(){var t=p.performance,i=t&&(t.now||t.webkitNow||t.msNow||t.mozNow);return i&&R.bind?i.bind(t):Date.now||function(){return+new Date}}(),U=h(function(i){function n(t,i){var e=c((""+t).split(q)),n=e[0];i=i||{};var r=Q[n];if(!r)return V("Unsupported property: "+n);if(!i.weak||!this.props[n]){var s=r[0],a=this.props[n];return a||(a=this.props[n]=new s.Bare),a.init(this.$el,e,r,i),a}}function r(t,i,e){if(t){var r=typeof t;if(i||(this.timer&&this.timer.destroy(),this.queue=[],this.active=!1),"number"==r&&i)return this.timer=new X({duration:t,context:this,complete:o}),this.active=!0,void 0;if("string"==r&&i)return n.call(this,t,e&&e[1]),o.call(this);if("function"==r)return t.call(this,this),void 0;if("object"==r){var s=0;b.call(this,t,function(t,i){t.span>s&&(s=t.span),t.stop(),t.animate(i)},function(t){"wait"in t&&(s=u(t.wait,0))}),p.call(this),s>0&&(this.timer=new X({duration:s,context:this}),this.active=!0,i&&(this.timer.complete=o));var a=this,c=!1,h={};G(function(){b.call(a,t,function(t){t.active&&(c=!0,h[t.name]=t.nextStyle)}),c&&a.$el.css(h)})}}}function s(t){t=u(t,0),this.active?this.queue.push({options:t}):(this.timer=new X({duration:t,context:this,complete:o}),this.active=!0)}function a(t){return this.active?(this.queue.push({options:t,args:arguments}),this.timer.complete=o,void 0):V("No active transition timer. Use start() or wait() before then().")}function o(){if(this.timer&&this.timer.destroy(),this.active=!1,this.queue.length){var t=this.queue.shift();r.call(this,t.options,!0,t.args)}}function h(t){this.timer&&this.timer.destroy(),this.queue=[],this.active=!1;var i;"string"==typeof t?(i={},i[t]=1):i="object"==typeof t?t:this.props,b.call(this,i,m),p.call(this)}function l(t){h.call(this,t),b.call(this,t,g,y)}function f(t){"string"!=typeof t&&(t="block"),this.el.style.display=t}function d(){h.call(this),this.el.style.display="none"}function p(){var t,i,e=[];for(t in this.props)i=this.props[t],i.active&&e.push(i.string);e=e.join(","),this.style!==e&&(this.style=e,this.el.style[R.transition.dom]=e)}function b(t,i,r){var s,a,o,u,c=i!==m,h={};for(s in t)o=t[s],s in W?(h.transform||(h.transform={}),h.transform[s]=o):(v.test(s)&&(s=e(s)),s in Q?h[s]=o:(u||(u={}),u[s]=o));for(s in h){if(o=h[s],a=this.props[s],!a){if(!c)continue;a=n.call(this,s)}i.call(this,a,o)}r&&u&&r.call(this,u)}function m(t){t.stop()}function g(t,i){t.set(i)}function y(t){this.$el.css(t)}function w(t,e){i[t]=function(){return this.children?k.call(this,e,arguments):(this.el&&e.apply(this,arguments),this)}}function k(t,i){var e,n=this.children.length;for(e=0;n>e;e++)t.apply(this.children[e],i);return this}i.init=function(i){this.$el=t(i),this.el=this.$el[0],this.props={},this.queue=[],this.style="",this.active=!1,R.backface&&E.hideBackface&&C(this.el,R.backface.css,"hidden")},w("add",n),w("start",r),w("wait",s),w("then",a),w("next",o),w("stop",h),w("set",l),w("show",f),w("hide",d)}),I=h(U,function(i){function e(i,e){var n=t.data(i,b)||t.data(i,b,new U.Bare);return n.el||n.init(i),e?n.start(e):n}i.init=function(i,n){var r=t(i);if(!r.length)return this;if(1===r.length)return e(r[0],n);var s=[];return r.each(function(t,i){s.push(e(i,n))}),this.children=s,this}}),S=h(function(t){function i(t,i,e){return void 0!==i&&(e=i),t in l?t:e}function e(t){var i=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(t);return(i?r(i[1],i[2],i[3]):t).replace(/#(\w)(\w)(\w)$/,"#$1$1$2$2$3$3")}var n={duration:500,ease:"ease",delay:0};t.init=function(t,e,r,s){this.$el=t,this.el=t[0];var a=e[0];r[2]&&(a=r[2]),L[a]&&(a=L[a]),this.name=a,this.type=r[1],this.duration=u(e[1],this.duration,n.duration),this.ease=i(e[2],this.ease,n.ease),this.delay=u(e[3],this.delay,n.delay),this.span=this.duration+this.delay,this.active=!1,this.unit=s.unit||this.unit||E.defaultUnit,this.angle=s.angle||this.angle||E.defaultAngle,E.fallback||s.fallback?this.animate=this.fallback:(this.animate=this.transition,this.string=this.name+q+this.duration+"ms"+("ease"!=this.ease?q+l[this.ease][0]:"")+(this.delay?q+this.delay+"ms":""))},t.set=function(t){t=this.convert(t,this.type),this.update(t),this.redraw()},t.transition=function(t){this.active=!0,this.nextStyle=this.convert(t,this.type)},t.fallback=function(t){this.tween=new P({from:this.convert(this.get(),this.type),to:this.convert(t,this.type),duration:this.duration,delay:this.delay,ease:this.ease,update:this.update,context:this})},t.get=function(){return D(this.el,this.name)},t.update=function(t){C(this.el,this.name,t)},t.stop=function(){this.tween&&this.tween.destroy(),this.active&&(this.active=!1,C(this.el,this.name,this.get()))},t.convert=function(t,i){var n,r="number"==typeof t,s="string"==typeof t;switch(i){case g:if(r)return t;if(s&&""===t.replace(m,""))return+t;n="number(unitless)";break;case y:if(s){if(""===t&&this.original)return this.original;if(i.test(t))return"#"==t.charAt(0)&&7==t.length?t:e(t)}n="hex or rgb string";break;case w:if(r)return t+this.unit;if(s&&i.test(t))return t;n="number(px) or string(unit)";break;case k:if(r)return t+this.unit;if(s&&i.test(t))return t;n="number(px) or string(unit or %)";break;case x:if(r)return t+this.angle;if(s&&i.test(t))return t;n="number(deg) or string(angle)";break;case z:if(r)return t;if(s&&k.test(t))return t;n="number(unitless) or string(unit or %)"}return a(n,t),t},t.redraw=function(){this.el.offsetHeight}}),Z=h(S,function(t,i){t.init=function(){i.init.apply(this,arguments),this.original||(this.original=this.convert(this.get(),y))}}),N=h(S,function(t,i){t.init=function(){i.init.apply(this,arguments),this.animate=this.fallback},t.get=function(){return this.$el[this.name]()},t.update=function(t){this.$el[this.name](t)}}),O=h(S,function(t,i){function e(t,i){var e,n,r,s,a;for(e in t)s=W[e],r=s[0],n=s[1]||e,a=this.convert(t[e],r),i.call(this,n,a,r)}t.init=function(){i.init.apply(this,arguments),this.current||(this.current={},W.perspective&&E.perspective&&(this.current.perspective=E.perspective,C(this.el,this.name,this.style(this.current)),this.redraw()))},t.set=function(t){e.call(this,t,function(t,i){this.current[t]=i}),C(this.el,this.name,this.style(this.current)),this.redraw()},t.transition=function(t){var i=this.values(t);this.tween=new Y({current:this.current,values:i,duration:this.duration,delay:this.delay,ease:this.ease});var e,n={};for(e in this.current)n[e]=e in i?i[e]:this.current[e];this.active=!0,this.nextStyle=this.style(n)},t.fallback=function(t){var i=this.values(t);this.tween=new Y({current:this.current,values:i,duration:this.duration,delay:this.delay,ease:this.ease,update:this.update,context:this})},t.update=function(){C(this.el,this.name,this.style(this.current))},t.style=function(t){var i,e="";for(i in t)e+=i+"("+t[i]+") ";return e},t.values=function(t){var i,n={};return e.call(this,t,function(t,e,r){n[t]=e,void 0===this.current[t]&&(i=0,~t.indexOf("scale")&&(i=1),this.current[t]=this.convert(i,r))}),n}}),P=h(function(i){function e(t){1===d.push(t)&&G(a)}function a(){var t,i,e,n=d.length;if(n)for(G(a),i=T(),t=n;t--;)e=d[t],e&&e.render(i)}function u(i){var e,n=t.inArray(i,d);n>=0&&(e=d.slice(n+1),d.length=n,e.length&&(d=d.concat(e)))}function c(t){return Math.round(t*p)/p}function h(t,i,e){return r(t[0]+e*(i[0]-t[0]),t[1]+e*(i[1]-t[1]),t[2]+e*(i[2]-t[2]))}var f={ease:l.ease[1],from:0,to:1};i.init=function(t){this.duration=t.duration||0,this.delay=t.delay||0;var i=t.ease||f.ease;l[i]&&(i=l[i][1]),"function"!=typeof i&&(i=f.ease),this.ease=i,this.update=t.update||s,this.complete=t.complete||s,this.context=t.context||this,this.name=t.name;var e=t.from,n=t.to;void 0===e&&(e=f.from),void 0===n&&(n=f.to),this.unit=t.unit||"","number"==typeof e&&"number"==typeof n?(this.begin=e,this.change=n-e):this.format(n,e),this.value=this.begin+this.unit,this.start=T(),t.autoplay!==!1&&this.play()},i.play=function(){this.active||(this.start||(this.start=T()),this.active=!0,e(this))},i.stop=function(){this.active&&(this.active=!1,u(this))},i.render=function(t){var i,e=t-this.start;if(this.delay){if(this.delay>=e)return;e-=this.delay}if(this.duration>e){var n=this.ease(e,0,1,this.duration);return i=this.startRGB?h(this.startRGB,this.endRGB,n):c(this.begin+n*this.change),this.value=i+this.unit,this.update.call(this.context,i),void 0}i=this.endHex||this.begin+this.change,this.value=i+this.unit,this.update.call(this.context,i),this.complete.call(this.context),this.destroy()},i.format=function(t,i){if(i+="",t+="","#"==t.charAt(0))return this.startRGB=n(i),this.endRGB=n(t),this.endHex=t,this.begin=0,this.change=1,void 0;if(!this.unit){var e=i.replace(m,""),r=t.replace(m,"");e!==r&&o("tween",i,t),this.unit=e}i=parseFloat(i),t=parseFloat(t),this.begin=this.value=i,this.change=t-i},i.destroy=function(){this.stop(),this.ease=this.update=this.complete=this.context=null};var d=[],p=1e3}),X=h(P,function(t){t.init=function(t){this.duration=t.duration||0,this.complete=t.complete||s,this.context=t.context,this.play()},t.render=function(t){var i=t-this.start;this.duration>i||(this.complete.call(this.context),this.destroy())}}),Y=h(P,function(t,i){t.init=function(t){this.context=t.context,this.update=t.update,this.tweens=[],this.current=t.current;var i,e;for(i in t.values)e=t.values[i],this.current[i]!==e&&this.tweens.push(new P({name:i,from:this.current[i],to:e,duration:t.duration,delay:t.delay,ease:t.ease,autoplay:!1}));this.play()},t.render=function(t){var i,e,n=this.tweens.length,r=!1;for(i=n;i--;)e=this.tweens[i],e.ease&&(e.render(t),this.current[e.name]=e.value,r=!0);return r?(this.update&&this.update.call(this.context),void 0):this.destroy()},t.destroy=function(){if(i.destroy.call(this),this.tweens){var t,e=this.tweens.length;for(t=e;t--;)this.tweens[t].destroy();this.tweens=null,this.current=null}}}),E=i.config={defaultUnit:"px",defaultAngle:"deg",hideBackface:!0,perspective:"",fallback:!R.transition,agentTests:[]};i.fallback=function(t){if(!R.transition)return E.fallback=!0;E.agentTests.push("("+t+")");var i=RegExp(E.agentTests.join("|"),"i");E.fallback=i.test(navigator.userAgent)},i.fallback("6.0.[2-5] Safari");var H={};i.macro=function(t,i){H[t]=i},i.tween=function(t){return new P(t)},i.delay=function(t,i,e){return new X({complete:i,duration:t,context:e})},t.fn.tram=function(t){return i.call(null,this,t)};var C=t.style,D=t.css,L={transform:R.transform&&R.transform.css},Q={color:[Z,y],background:[Z,y,"background-color"],"outline-color":[Z,y],"border-color":[Z,y],"border-top-color":[Z,y],"border-right-color":[Z,y],"border-bottom-color":[Z,y],"border-left-color":[Z,y],"border-width":[S,w],"border-top-width":[S,w],"border-right-width":[S,w],"border-bottom-width":[S,w],"border-left-width":[S,w],"border-spacing":[S,w],"letter-spacing":[S,w],margin:[S,w],"margin-top":[S,w],"margin-right":[S,w],"margin-bottom":[S,w],"margin-left":[S,w],padding:[S,w],"padding-top":[S,w],"padding-right":[S,w],"padding-bottom":[S,w],"padding-left":[S,w],"outline-width":[S,w],opacity:[S,g],top:[S,k],right:[S,k],bottom:[S,k],left:[S,k],"font-size":[S,k],"text-indent":[S,k],"word-spacing":[S,k],width:[S,k],"min-width":[S,k],"max-width":[S,k],height:[S,k],"min-height":[S,k],"max-height":[S,k],"line-height":[S,z],"scroll-top":[N,g,"scrollTop"],"scroll-left":[N,g,"scrollLeft"]},W={};R.transform&&(Q.transform=[O],W={x:[k,"translateX"],y:[k,"translateY"],rotate:[x],rotateX:[x],rotateY:[x],scale:[g],scaleX:[g],scaleY:[g],skew:[x],skewX:[x],skewY:[x]}),R.transform&&R.backface&&(W.z=[k,"translateZ"],W.rotateZ=[x],W.scaleZ=[g],W.perspective=[w]);var J=/ms/,K=/s|\./,V=function(){var t="warn",i=window.console;return i&&i[t]?function(e){i[t](e)}:s}();return t.tram=i}(window.jQuery);
/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.1 - 2013-10-17
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2013 Jason Moon (@JSONMOON)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function($){if(!$.support.cors&&$.ajaxTransport&&window.XDomainRequest){var n=/^https?:\/\//i;var o=/^get|post$/i;var p=new RegExp('^'+location.protocol,'i');var q=/text\/html/i;var r=/\/json/i;var s=/\/xml/i;$.ajaxTransport('* text html xml json',function(i,j,k){if(i.crossDomain&&i.async&&o.test(i.type)&&n.test(i.url)&&p.test(i.url)){var l=null;var m=(j.dataType||'').toLowerCase();return{send:function(f,g){l=new XDomainRequest();if(/^\d+$/.test(j.timeout)){l.timeout=j.timeout}l.ontimeout=function(){g(500,'timeout')};l.onload=function(){var a='Content-Length: '+l.responseText.length+'\r\nContent-Type: '+l.contentType;var b={code:200,message:'success'};var c={text:l.responseText};try{if(m==='html'||q.test(l.contentType)){c.html=l.responseText}else if(m==='json'||(m!=='text'&&r.test(l.contentType))){try{c.json=$.parseJSON(l.responseText)}catch(e){b.code=500;b.message='parseerror'}}else if(m==='xml'||(m!=='text'&&s.test(l.contentType))){var d=new ActiveXObject('Microsoft.XMLDOM');d.async=false;try{d.loadXML(l.responseText)}catch(e){d=undefined}if(!d||!d.documentElement||d.getElementsByTagName('parsererror').length){b.code=500;b.message='parseerror';throw'Invalid XML: '+l.responseText;}c.xml=d}}catch(parseMessage){throw parseMessage;}finally{g(b.code,b.message,c,a)}};l.onprogress=function(){};l.onerror=function(){g(500,'error',{text:l.responseText})};var h='';if(j.data){h=($.type(j.data)==='string')?j.data:$.param(j.data)}l.open(i.type,i.url);l.send(h)},abort:function(){if(l){l.abort()}}}}})}})(jQuery);
/*!
 * tap.js
 * Copyright (c) 2013 Alex Gibson, http://alxgbsn.co.uk/
 * Released under MIT license
 */
(function (window, document) {

    'use strict';

    function Tap(el) {
        el = typeof el === 'object' ? el : document.getElementById(el);
        this.element = el;
        this.moved = false; //flags if the finger has moved
        this.startX = 0; //starting x coordinate
        this.startY = 0; //starting y coordinate
        this.hasTouchEventOccured = false; //flag touch event
        el.addEventListener('touchstart', this, false);
        el.addEventListener('touchmove', this, false);
        el.addEventListener('touchend', this, false);
        el.addEventListener('touchcancel', this, false);
        el.addEventListener('mousedown', this, false);
        el.addEventListener('mouseup', this, false);
    }

    Tap.prototype.start = function (e) {
        if (e.type === 'touchstart') {
            this.hasTouchEventOccured = true;
        }
        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    };

    Tap.prototype.move = function (e) {
        //if finger moves more than 10px flag to cancel
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
            this.moved = true;
        }
    };

    Tap.prototype.end = function (e) {
        var evt;

        if (this.hasTouchEventOccured && e.type === 'mouseup') {
            e.preventDefault();
            e.stopPropagation();
            this.hasTouchEventOccured = false;
            return;
        }

        if (!this.moved) {
            //create custom event
            if (typeof document.CustomEvent !== "undefined") {
                evt = new document.CustomEvent('tap', {
                    bubbles: true,
                    cancelable: true
                });
            } else {
                evt = document.createEvent('Event');
                evt.initEvent('tap', true, true);
            }
            e.target.dispatchEvent(evt);
        }
    };

    Tap.prototype.cancel = function (e) {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };

    Tap.prototype.destroy = function () {
        var el = this.element;
        el.removeEventListener('touchstart', this, false);
        el.removeEventListener('touchmove', this, false);
        el.removeEventListener('touchend', this, false);
        el.removeEventListener('touchcancel', this, false);
        el.removeEventListener('mousedown', this, false);
        el.removeEventListener('mouseup', this, false);
        this.element = null;
    };

    Tap.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'touchstart': this.start(e); break;
        case 'touchmove': this.move(e); break;
        case 'touchend': this.end(e); break;
        case 'touchcancel': this.cancel(e); break;
        case 'mousedown': this.start(e); break;
        case 'mouseup': this.end(e); break;
        }
    };

    window.Tap = Tap;

}(window, document));
/* jshint ignore:end */
/**
 * ----------------------------------------------------------------------
 * Init lib after plugins
 */
elegance.init();
/**
 * ----------------------------------------------------------------------
 * elegance: Touch events for jQuery based on tap.js
 */
elegance.define('elegance-touch', function ($, _) {
  'use strict';
  
  var Tap = window.Tap;
  var namespace = '.w-events-';
  var dataKey = namespace + 'tap';
  var fallback = !document.addEventListener;
  
  // jQuery event "tap" - use click in old + non-touch browsers
  $.event.special.tap = (fallback || !elegance.env.touch) ? { bindType: 'click', delegateType: 'click' } : {
    setup: function () {
      $.data(this, dataKey, new Tap(this));
    },
    teardown: function () {
      var tap = $.data(this, dataKey);
      if (tap && tap.destroy) {
        tap.destroy();
        $.removeData(this, dataKey);
      }
    },
    add: function (handleObj) {
      this.addEventListener('tap', handleObj.handler, false);
    },
    remove: function (handleObj) {
      this.removeEventListener('tap', handleObj.handler, false);
    }
  };
  
  // No swipe events for old browsers
  if (fallback || !Object.create) return;
  
  // jQuery event "swipe"
  dataKey = namespace + 'swipe';
  
  $.event.special.swipe = {
    setup: function () {
      $.data(this, dataKey, new Swipe(this));
    },
    teardown: function () {
      var tap = $.data(this, dataKey);
      if (tap && tap.destroy) {
        tap.destroy();
        $.removeData(this, dataKey);
      }
    },
    add: function (handleObj) {
      this.addEventListener('swipe', handleObj.handler, false);
    },
    remove: function (handleObj) {
      this.removeEventListener('swipe', handleObj.handler, false);
    }
  };
  
  /**
   * Swipe - extends Tap, supports mouse swipes!
   */
  function Swipe(el) {
    Tap.call(this, el);
  }
  
  (function () {
    var supr = Tap.prototype;
    var proto = Swipe.prototype = Object.create(supr);
    var threshold = Math.round(screen.width * 0.04) || 20;
    if (threshold > 40) threshold = 40;
    
    proto.start = function (e) {
      supr.start.call(this, e);
      this.element.addEventListener('mousemove', this, false);
      document.addEventListener('mouseup', this, false);
      this.velocityX = 0;
      this.lastX = this.startX;
      this.enabled = true;
    };
    
    proto.move = _.throttle(function (e) {
      if (!this.enabled) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      this.velocityX = x - this.lastX;
      this.lastX = x;
      if (Math.abs(this.velocityX) > threshold) {
        this.end(e);
      }
    });
    
    proto.end = function (e) {
      if (!this.enabled) return;
      var velocityX = this.velocityX;
      this.cancel();
      if (Math.abs(velocityX) > threshold) {
        $(this.element).triggerHandler('swipe', { direction: velocityX > 0 ? 'right' : 'left' });
      }
    };
    
    proto.destroy = function () {
      this.cancel();
      supr.destroy.call(this);
    };
    
    proto.cancel = function () {
      this.enabled = false;
      this.element.removeEventListener('mousemove', this, false);
      document.removeEventListener('mouseup', this, false);
      supr.cancel.call(this);
    };
    
    proto.handleEvent = function (e) {
      if (e.type == 'mousemove') return this.move(e);
      supr.handleEvent.call(this, e);
    };
  }());
  
});

/**
 * ----------------------------------------------------------------------
 * elegance: Smooth scroll
 */
elegance.define('elegance-scroll', function ($) {
  'use strict';
  
  var $doc = $(document);
  var $body = $(document.body);
  var win = window;
  var loc = win.location;
  
  function ready() {
    // If hash is already present on page load, scroll to it right away
    if (loc.hash) {
      findEl(loc.hash.substring(1));
    }

    // When clicking on a link, check if it links to another part of the page
    $doc.on('click', 'a', function(e) {
      if (elegance.env('design')) {
        return;
      }
      
      // Ignore links being used by jQuery mobile
      if (window.$.mobile && $(e.currentTarget).hasClass('ui-link')) return;
      
      var hash = this.hash ? this.hash.substring(1) : null;
      if (hash) {
        findEl(hash, e);
      }
    });
  }
  
  function findEl(hash, e) {
    var el = $('#' + hash);
    if (!el.length) {
      return;
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Push new history state
    if (loc.hash !== hash && win.history && win.history.pushState) {
      win.history.pushState(null, null, '#' + hash);
    }

    // If a fixed header exists, offset for the height
    var header = $('header, body > .header, body > .w-nav, body > div:first-child');
    var offset = header.css('position') === 'fixed' ? header.outerHeight() : 0;

    win.setTimeout(function() {
      scroll(el, offset);
    }, e ? 0 : 300);
  }
  
  function scroll(el, offset){
    var start = $(win).scrollTop();
    var end = el.offset().top - offset;
    var clock = Date.now();
    var animate = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || function(fn) { win.setTimeout(fn, 15); };
    var duration = 472.143 * Math.log(Math.abs(start - end) +125) - 2000;
    
    var step = function() {
      var elapsed = Date.now() - clock;
      win.scroll(0, getY(start, end, elapsed, duration));

      if (elapsed <= duration) {
        animate(step);
      }
    };

    step();
  }
  
  function getY(start, end, elapsed, duration) {
    if (elapsed > duration) {
      return end;
    }

    return start + (end - start) * ease(elapsed / duration); 
  }
  
  function ease(t) {
    return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
  }
  
  // Export module
  return { ready: ready };
});

/**
 * ----------------------------------------------------------------------
 * elegance: Navbar widget
 */
elegance.define('elegance-navbar', function ($, _) {
  'use strict';
  
  var api = {};
  var tram = window.tram;
  var $win = $(window);
  var $doc = $(document);
  var $body;
  var $navbars;
  var designer;
  var inApp = elegance.env();
  var overlay = '<div class="w-nav-overlay" data-wf-ignore />';
  var namespace = '.w-nav';
  var buttonOpen = 'w--open';
  var menuOpen = 'w--nav-menu-open';
  var linkOpen = 'w--nav-link-open';
  var linkCurrent = 'w--current';
  
  // -----------------------------------
  // Module methods
  
  api.ready = function () {
    init();
  };
  
  api.design = function () {
    designer = true;
    init();
  };
  
  api.preview = function () {
    designer = false;
    init();
  };
  
  // -----------------------------------
  // Private methods
  
  function init() {
    $body = $(document.body);
    
    // Find all instances on the page
    $navbars = $doc.find(namespace);
    $navbars.each(build);
    
    // Wire events
    listen && listen();
    listen = null;
  }
  
  function listen() {
    elegance.resize.on(function () {
      $navbars.each(resize);
    });
  }
  
  function build(i, el) {
    var $el = $(el);
    
    // Store state in data
    var data = $.data(el, namespace);
    if (!data) data = $.data(el, namespace, { open: false, el: $el, config: {} });
    data.menu = $el.find('.w-nav-menu');
    data.links = data.menu.find('.w-nav-link');
    data.button = $el.find('.w-nav-button');
    data.container = $el.find('.w-container');
    data.outside = outside(data);
    
    // Remove old events
    data.button.off(namespace);
    data.menu.off(namespace);
    
    // Set config from data attributes
    configure(data);
    
    // Add events based on mode
    if (designer) {
      removeOverlay(data);
      $el.on('setting' + namespace, handler(data));
    } else {
      addOverlay(data);
      data.button.on('tap' + namespace, toggle(data));
      data.menu.on('click' + namespace, '> a', navigate(data));
    }
    
    // Select current section
    data.links.each(select);
    
    // Trigger initial resize
    resize(i, el);
  }
  
  function select(i, el) {
    el = $(el);
    var slug = (inApp ? elegance.env('slug') : window.location.pathname) || '';
    var href = el.attr('href');
    el.toggleClass(linkCurrent, slug === href || slug.indexOf(href, slug.length - href.length) !== -1);
  }
  
  function removeOverlay(data) {
    if (!data.overlay) return;
    close(data, true);
    data.overlay.remove();
    data.overlay = null;
  }
  
  function addOverlay(data) {
    if (data.overlay) return;
    data.overlay = $(overlay).appendTo(data.el);
    data.parent = data.menu.parent();
    close(data, true);
  }
  
  function configure(data) {
    var config = {};
    var old = data.config || {};
    
    // Set config options from data attributes
    config.animation = data.el.attr('data-animation') || 'default';
    
    // Re-open menu if the animation type changed
    if (old.animation != config.animation) {
      data.open && _.defer(reopen, data);
    }
    
    config.easing = data.el.attr('data-easing') || 'ease';
    config.easing2 = data.el.attr('data-easing2') || 'ease';
    
    var duration = data.el.attr('data-duration');
    config.duration = duration != null ? +duration : 400;
    
    // Store config in data
    data.config = config;
  }
  
  function handler(data) {
    return function (evt, options) {
      options = options || {};
      
      // Designer settings
      if (designer && evt.type == 'setting') {
        var winWidth = $win.width();
        configure(data);
        options.open === true && open(data, true);
        options.open === false && close(data, true);
        // Reopen if media query changed after setting
        data.open && _.defer(function () {
          if (winWidth != $win.width()) reopen(data);
        });
        return;
      }
    };
  }
  
  function closeEach(i, el) {
    var data = $.data(el, namespace);
    data.open && close(data);
  }
  
  function reopen(data) {
    if (!data.open) return;
    close(data, true);
    open(data, true);
  }
  
  function toggle(data) {
    return _.debounce(function (evt) {
      data.open ? close(data) : open(data);
    });
  }

  function navigate(data) {
    return function (evt) {
      var link = $(this);
      var href = link.attr('href');

      // Close when navigating to an in-page anchor
      if (href && href.indexOf('#') === 0 && data.open) {
        close(data);
      }
    };
  }
  
  function outside(data) {
    return function (evt) {
      var target = evt.target;
      // Close navbars when tapped outside
      var isOutside = !data.el.has(target).length && !data.el.is(target);
      if (isOutside || /close/i.test(evt.target.className)) close(data);
    };
  }
  
  function resize(i, el) {
    var data = $.data(el, namespace);
    // Check for collapsed state based on button display
    var collapsed = data.collapsed = data.button.css('display') != 'none';
    // Close menu if button is no longer visible (and not in designer)
    if (data.open && !collapsed && !designer) close(data, true);
    // Set max-width of links to match container
    data.container.length && data.links.each(maxLink(data));
  }
  
  var maxWidth = 'max-width';
  function maxLink(data) {
    // Set max-width of each link (unless it has an upstream value)
    var containMax = data.container.css(maxWidth);
    if (containMax == 'none') containMax = '';
    return function (i, link) {
      link = $(link);
      link.css(maxWidth, '');
      if (link.css(maxWidth) == 'none') link.css(maxWidth, containMax);
    };
  }
  
  function open(data, immediate) {
    if (data.open) return;
    data.open = true;
    data.menu.addClass(menuOpen);
    data.links.addClass(linkOpen);
    data.button.addClass(buttonOpen);
    var config = data.config;
    var animation = config.animation;
    if (animation == 'none' || !tram.support.transform) immediate = true;
    var animOver = /^over/.test(animation);
    var navFixed = data.el.css('position') == 'fixed';
    var bodyHeight = $body.height();
    var menuHeight = data.menu.outerHeight(true);
    var menuWidth = data.menu.outerWidth(true);
    var navHeight = data.el.height();
    var direction = /left$/.test(animation) ? -1 : 1;
    resize(0, data.el[0]);
    
    // Listen for tap outside events
    if (!designer) $doc.on('tap' + namespace, data.outside);
    
    // Update menu height for Over state
    if (animOver) {
      if (!navFixed) bodyHeight -= data.el.offset().top;
      data.menu.height(bodyHeight);
    }
    
    // No transition for immediate
    if (immediate) return;
    
    var transConfig = 'transform ' + config.duration + 'ms ' + config.easing;
    
    // Add menu to overlay
    if (data.overlay) {
      data.overlay.show()
        .append(data.menu)
        .height(menuHeight);
    }
    
    // Over left/right
    if (animOver) {
      tram(data.menu)
        .add(transConfig)
        .set({ x: direction * menuWidth, height: bodyHeight }).start({ x: 0 });
      data.overlay && data.overlay.css({ width: menuWidth, height: bodyHeight });
      return;
    }
    
    // Drop Down
    var offsetY = navHeight + menuHeight;
    tram(data.menu)
      .add(transConfig)
      .set({ y: -offsetY }).start({ y: 0 });
  }
  
  function close(data, immediate) {
    data.open = false;
    data.button.removeClass(buttonOpen);
    var config = data.config;
    if (config.animation == 'none' || !tram.support.transform) immediate = true;
    var animation = config.animation;
    
    // Stop listening for tap outside events
    $doc.off('tap' + namespace, data.outside);
    
    if (immediate) {
      tram(data.menu).stop();
      complete();
      return;
    }
    
    var transConfig = 'transform ' + config.duration + 'ms ' + config.easing2;
    var menuHeight = data.menu.outerHeight(true);
    var menuWidth = data.menu.outerWidth(true);
    var navHeight = data.el.height();
    var direction = /left$/.test(animation) ? -1 : 1;
    var animOver = /^over/.test(animation);
    
    // Over left/right
    if (animOver) {
      tram(data.menu)
        .add(transConfig)
        .start({ x: menuWidth * direction }).then(complete);
      return;
    }
    
    // Drop Down
    var offsetY = navHeight + menuHeight;
    tram(data.menu)
      .add(transConfig)
      .start({ y: -offsetY }).then(complete);
    
    function complete() {
      data.menu.height('');
      tram(data.menu).set({ x: 0, y: 0 });
      data.menu.removeClass(menuOpen);
      data.links.removeClass(linkOpen);
      if (data.overlay && data.overlay.children().length) {
        // Move menu back to parent
        data.menu.appendTo(data.parent);
        data.overlay.attr('style', '').hide();
      }
    }
  }
  
  // Export module
  return api;
});
