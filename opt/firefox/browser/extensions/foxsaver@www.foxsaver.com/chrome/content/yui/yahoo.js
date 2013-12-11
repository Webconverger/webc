FoxSaver.YUI = {};
FoxSaver.YUI.namespace = function() {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = FoxSaver.YUI;
        for (j = (d[0] == "FoxSaver.YUI") ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]]
        }
    }
    return o
};
FoxSaver.YUI.log = function(msg, cat, src) {
    var l = FoxSaver.YUI.widget.Logger;
    if (l && l.log) {
        return l.log(msg, cat, src)
    } else {
        return false
    }
};
FoxSaver.YUI.register = function(name, mainClass, data) {
    var mods = FoxSaver.YUI.env.modules;
    if (!mods[name]) {
        mods[name] = {versions: [], builds: []}
    }
    var m = mods[name], v = data.version, b = data.build, ls = FoxSaver.YUI.env.listeners;
    m.name = name;
    m.version = v;
    m.build = b;
    m.versions.push(v);
    m.builds.push(b);
    m.mainClass = mainClass;
    for (var i = 0; i < ls.length; i = i + 1) {
        ls[i](m)
    }
    if (mainClass) {
        mainClass.VERSION = v;
        mainClass.BUILD = b
    } else {
        FoxSaver.YUI.log("mainClass is undefined for module " + name, "warn")
    }
};
FoxSaver.YUI.env = FoxSaver.YUI.env || {modules: [], listeners: []};
FoxSaver.YUI.env.getVersion = function(name) {
    return FoxSaver.YUI.env.modules[name] || null
};
FoxSaver.YUI.env.ua = function() {
    var o = {ie: 0, opera: 0, gecko: 0, webkit: 0, mobile: null};
    var ua = navigator.userAgent, m;
    if ((/KHTML/).test(ua)) {
        o.webkit = 1
    }
    m = ua.match(/AppleWebKit\/([^\s]*)/);
    if (m && m[1]) {
        o.webkit = parseFloat(m[1]);
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"
        } else {
            m = ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]
            }
        }
    }
    if (!o.webkit) {
        m = ua.match(/Opera[\s\/]([^\s]*)/);
        if (m && m[1]) {
            o.opera = parseFloat(m[1]);
            m = ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]
            }
        } else {
            m = ua.match(/MSIE\s([^;]*)/);
            if (m && m[1]) {
                o.ie = parseFloat(m[1])
            } else {
                m = ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko = 1;
                    m = ua.match(/rv:([^\s\)]*)/);
                    if (m && m[1]) {
                        o.gecko = parseFloat(m[1])
                    }
                }
            }
        }
    }
    return o
}();
(function() {
    FoxSaver.YUI.namespace("util", "widget", "example");
    if ("undefined" !== typeof FoxSaver.YUI_config) {
        var l = FoxSaver.YUI_config.listener, ls = FoxSaver.YUI.env.listeners, unique = true, i;
        if (l) {
            for (i = 0; i < ls.length; i = i + 1) {
                if (ls[i] == l) {
                    unique = false;
                    break
                }
            }
            if (unique) {
                ls.push(l)
            }
        }
    }
})();
FoxSaver.YUI.lang = FoxSaver.YUI.lang || {isArray: function(o) {
        if (o) {
            var l = FoxSaver.YUI.lang;
            return l.isNumber(o.length) && l.isFunction(o.splice)
        }
        return false
    }, isBoolean: function(o) {
        return typeof o === "boolean"
    }, isFunction: function(o) {
        return typeof o === "function"
    }, isNull: function(o) {
        return o === null
    }, isNumber: function(o) {
        return typeof o === "number" && isFinite(o)
    }, isObject: function(o) {
        return(o && (typeof o === "object" || FoxSaver.YUI.lang.isFunction(o))) || false
    }, isString: function(o) {
        return typeof o === "string"
    }, isUndefined: function(o) {
        return typeof o === "undefined"
    }, hasOwnProperty: function(o, prop) {
        if (Object.prototype.hasOwnProperty) {
            return o.hasOwnProperty(prop)
        }
        return !FoxSaver.YUI.lang.isUndefined(o[prop]) && o.constructor.prototype[prop] !== o[prop]
    }, _IEEnumFix: function(r, s) {
        if (FoxSaver.YUI.env.ua.ie) {
            var add = ["toString", "valueOf"], i;
            for (i = 0; i < add.length; i = i + 1) {
                var fname = add[i], f = s[fname];
                if (FoxSaver.YUI.lang.isFunction(f) && f != Object.prototype[fname]) {
                    r[fname] = f
                }
            }
        }
    }, extend: function(subc, superc, overrides) {
        if (!superc || !subc) {
            throw new Error("FoxSaver.YUI.lang.extend failed, please check that all dependencies are included.")
        }
        var F = function() {
        };
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc
        }
        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i] = overrides[i]
            }
            FoxSaver.YUI.lang._IEEnumFix(subc.prototype, overrides)
        }
    }, augmentObject: function(r, s) {
        if (!s || !r) {
            throw new Error("Absorb failed, verify dependencies.")
        }
        var a = arguments, i, p, override = a[2];
        if (override && override !== true) {
            for (i = 2; i < a.length; i = i + 1) {
                r[a[i]] = s[a[i]]
            }
        } else {
            for (p in s) {
                if (override || !r[p]) {
                    r[p] = s[p]
                }
            }
            FoxSaver.YUI.lang._IEEnumFix(r, s)
        }
    }, augmentProto: function(r, s) {
        if (!s || !r) {
            throw new Error("Augment failed, verify dependencies.")
        }
        var a = [r.prototype, s.prototype];
        for (var i = 2; i < arguments.length; i = i + 1) {
            a.push(arguments[i])
        }
        FoxSaver.YUI.lang.augmentObject.apply(this, a)
    }, dump: function(o, d) {
        var l = FoxSaver.YUI.lang, i, len, s = [], OBJ = "{...}", FUN = "f(){...}", COMMA = ", ", ARROW = " => ";
        if (!l.isObject(o)) {
            return o + ""
        } else {
            if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
                return o
            } else {
                if (l.isFunction(o)) {
                    return FUN
                }
            }
        }
        d = (l.isNumber(d)) ? d : 3;
        if (l.isArray(o)) {
            s.push("[");
            for (i = 0, len = o.length; i < len; i = i + 1) {
                if (l.isObject(o[i])) {
                    s.push((d > 0) ? l.dump(o[i], d - 1) : OBJ)
                } else {
                    s.push(o[i])
                }
                s.push(COMMA)
            }
            if (s.length > 1) {
                s.pop()
            }
            s.push("]")
        } else {
            s.push("{");
            for (i in o) {
                if (l.hasOwnProperty(o, i)) {
                    s.push(i + ARROW);
                    if (l.isObject(o[i])) {
                        s.push((d > 0) ? l.dump(o[i], d - 1) : OBJ)
                    } else {
                        s.push(o[i])
                    }
                    s.push(COMMA)
                }
            }
            if (s.length > 1) {
                s.pop()
            }
            s.push("}")
        }
        return s.join("")
    }, substitute: function(s, o, f) {
        var i, j, k, key, v, meta, l = FoxSaver.YUI.lang, saved = [], token, DUMP = "dump", SPACE = " ", LBRACE = "{", RBRACE = "}";
        for (; ; ) {
            i = s.lastIndexOf(LBRACE);
            if (i < 0) {
                break
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break
            }
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k)
            }
            v = o[key];
            if (f) {
                v = f(key, v, meta)
            }
            if (l.isObject(v)) {
                if (l.isArray(v)) {
                    v = l.dump(v, parseInt(meta, 10))
                } else {
                    meta = meta || "";
                    var dump = meta.indexOf(DUMP);
                    if (dump > -1) {
                        meta = meta.substring(4)
                    }
                    if (v.toString === Object.prototype.toString || dump > -1) {
                        v = l.dump(v, parseInt(meta, 10))
                    } else {
                        v = v.toString()
                    }
                }
            } else {
                if (!l.isString(v) && !l.isNumber(v)) {
                    v = "~-" + saved.length + "-~";
                    saved[saved.length] = token
                }
            }
            s = s.substring(0, i) + v + s.substring(j + 1)
        }
        for (i = saved.length - 1; i >= 0; i = i - 1) {
            s = s.replace(new RegExp("~-" + i + "-~"), "{" + saved[i] + "}", "g")
        }
        return s
    }, trim: function(s) {
        try {
            return s.replace(/^\s+|\s+$/g, "")
        } catch (e) {
            return s
        }
    }, merge: function() {
        var o = {}, a = arguments;
        for (var i = 0, l = a.length; i < l; i = i + 1) {
            FoxSaver.YUI.lang.augmentObject(o, a[i], true)
        }
        return o
    }, later: function(when, o, fn, data, periodic) {
        when = when || 0;
        o = o || {};
        var m = fn, d = data, f, r;
        if (FoxSaver.YUI.lang.isString(fn)) {
            m = o[fn]
        }
        if (!m) {
            throw new TypeError("method undefined")
        }
        if (!FoxSaver.YUI.lang.isArray(d)) {
            d = [data]
        }
        f = function() {
            m.apply(o, d)
        };
        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);
        return{interval: periodic, cancel: function() {
                if (this.interval) {
                    clearInterval(r)
                } else {
                    clearTimeout(r)
                }
            }}
    }, isValue: function(o) {
        var l = FoxSaver.YUI.lang;
        return(l.isObject(o) || l.isString(o) || l.isNumber(o) || l.isBoolean(o))
    }};
FoxSaver.YUI.util.Lang = FoxSaver.YUI.lang;
FoxSaver.YUI.lang.augment = FoxSaver.YUI.lang.augmentProto;
FoxSaver.YUI.augment = FoxSaver.YUI.lang.augmentProto;
FoxSaver.YUI.extend = FoxSaver.YUI.lang.extend;
FoxSaver.YUI.register("FoxSaver.YUI", FoxSaver.YUI, {version: "2.4.0", build: "733"})