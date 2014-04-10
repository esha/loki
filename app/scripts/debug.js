'use strict';
function _debug(o, key) {
    var fn = o[key];
    if (!fn._debugged) {
        o[key] = function() {
            console.log(key, 'arguments', arguments);
            var ret = fn.apply(this, Array.prototype.slice.call(arguments));
            if (ret !== undefined) {
                console.debug(key, 'return', ret);
                return ret;
            }
        };
        Object.defineProperty(o[key], '_debugged', {value:true});
    }
}
function debug(o) {
    for (var key in o) {
        if (typeof o[key] === 'function') {
            _debug(o, key);
        }
    }
}
window.debug = debug;
debug.auto = function() {
    var targets = window.location.hash.match(/debug=?([\w\.,]*)/);
    if (targets) {
        (targets[1]||'app').split(',').forEach(function(target) {
            debug(window[target]);
        });
    }
};
debug.auto();
window.onhashchange = debug.auto;
//debug(window.app);
//debug(window.Clone);
//debug(window.Values);
