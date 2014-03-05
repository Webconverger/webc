FoxSaver.YUI.util.CustomEvent = function(type, oScope, silent, signature) {
    this.type = type;
    this.scope = oScope || window;
    this.silent = silent;
    this.signature = signature || FoxSaver.YUI.util.CustomEvent.LIST;
    this.subscribers = [];
    if (!this.silent) {
    }
    var onsubscribeType = "_YUICEOnSubscribe";
    if (type !== onsubscribeType) {
        this.subscribeEvent = new FoxSaver.YUI.util.CustomEvent(onsubscribeType, this, true)
    }
    this.lastError = null
};
FoxSaver.YUI.util.CustomEvent.LIST = 0;
FoxSaver.YUI.util.CustomEvent.FLAT = 1;
FoxSaver.YUI.util.CustomEvent.prototype = {subscribe: function(fn, obj, override) {
        if (!fn) {
            throw new Error("Invalid callback for subscriber to '" + this.type + '\'')
        }
        if (this.subscribeEvent) {
            this.subscribeEvent.fire(fn, obj, override)
        }
        this.subscribers.push(new FoxSaver.YUI.util.Subscriber(fn, obj, override))
    }, unsubscribe: function(fn, obj) {
        if (!fn) {
            return this.unsubscribeAll()
        }
        var found = false;
        for (var i = 0, len = this.subscribers.length; i < len; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true
            }
        }
        return found
    }, fire: function() {
        var len = this.subscribers.length;
        if (!len && this.silent) {
            return true
        }
        var args = [], ret = true, i, rebuild = false;
        for (i = 0; i < arguments.length; ++i) {
            args.push(arguments[i])
        }
        if (!this.silent) {
        }
        for (i = 0; i < len; ++i) {
            var s = this.subscribers[i];
            if (!s) {
                rebuild = true
            } else {
                if (!this.silent) {
                }
                var scope = s.getScope(this.scope);
                if (this.signature == FoxSaver.YUI.util.CustomEvent.FLAT) {
                    var param = null;
                    if (args.length > 0) {
                        param = args[0]
                    }
                    try {
                        ret = s.fn.call(scope, param, s.obj)
                    } catch (e) {
                        this.lastError = e
                    }
                } else {
                    try {
                        ret = s.fn.call(scope, this.type, args, s.obj)
                    } catch (e) {
                        this.lastError = e
                    }
                }
                if (false === ret) {
                    if (!this.silent) {
                    }
                    return false
                }
            }
        }
        if (rebuild) {
            var newlist = [], subs = this.subscribers;
            for (i = 0, len = subs.length; i < len; i = i + 1) {
                newlist.push(subs[i])
            }
            this.subscribers = newlist
        }
        return true
    }, unsubscribeAll: function() {
        for (var i = 0, len = this.subscribers.length; i < len; ++i) {
            this._delete(len - 1 - i)
        }
        this.subscribers = [];
        return i
    }, _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj
        }
        this.subscribers[index] = null
    }, toString: function() {
        return"CustomEvent: '" + this.type + "', scope: " + this.scope
    }};
FoxSaver.YUI.util.Subscriber = function(fn, obj, override) {
    this.fn = fn;
    this.obj = FoxSaver.YUI.lang.isUndefined(obj) ? null : obj;
    this.override = override
};
FoxSaver.YUI.util.Subscriber.prototype.getScope = function(defaultScope) {
    if (this.override) {
        if (this.override === true) {
            return this.obj
        } else {
            return this.override
        }
    }
    return defaultScope
};
FoxSaver.YUI.util.Subscriber.prototype.contains = function(fn, obj) {
    if (obj) {
        return(this.fn == fn && this.obj == obj)
    } else {
        return(this.fn == fn)
    }
};
FoxSaver.YUI.util.Subscriber.prototype.toString = function() {
    return"Subscriber { obj: " + this.obj + ", override: " + (this.override || "no") + " }"
};
if (!FoxSaver.YUI.util.Event) {
    FoxSaver.YUI.util.Event = function() {
        var loadComplete = false;
        var listeners = [];
        var unloadListeners = [];
        var legacyEvents = [];
        var legacyHandlers = [];
        var retryCount = 0;
        var onAvailStack = [];
        var legacyMap = [];
        var counter = 0;
        var webkitKeymap = {63232: 38, 63233: 40, 63234: 37, 63235: 39, 63276: 33, 63277: 34, 25: 9};
        return{POLL_RETRYS: 4000, POLL_INTERVAL: 10, EL: 0, TYPE: 1, FN: 2, WFN: 3, UNLOAD_OBJ: 3, ADJ_SCOPE: 4, OBJ: 5, OVERRIDE: 6, lastError: null, isSafari: FoxSaver.YUI.env.ua.webkit, webkit: FoxSaver.YUI.env.ua.webkit, isIE: FoxSaver.YUI.env.ua.ie, _interval: null, _dri: null, DOMReady: false, startInterval: function() {
                if (!this._interval) {
                    var self = this;
                    var callback = function() {
                        self._tryPreloadAttach()
                    };
                    this._interval = setInterval(callback, this.POLL_INTERVAL)
                }
            }, onAvailable: function(p_id, p_fn, p_obj, p_override, checkContent) {
                var a = (FoxSaver.YUI.lang.isString(p_id)) ? [p_id] : p_id;
                for (var i = 0; i < a.length; i = i + 1) {
                    onAvailStack.push({id: a[i], fn: p_fn, obj: p_obj, override: p_override, checkReady: checkContent})
                }
                retryCount = this.POLL_RETRYS;
                this.startInterval()
            }, onContentReady: function(p_id, p_fn, p_obj, p_override) {
                this.onAvailable(p_id, p_fn, p_obj, p_override, true)
            }, onDOMReady: function(p_fn, p_obj, p_override) {
                if (this.DOMReady) {
                    setTimeout(function() {
                        var s = window;
                        if (p_override) {
                            if (p_override === true) {
                                s = p_obj
                            } else {
                                s = p_override
                            }
                        }
                        p_fn.call(s, "DOMReady", [], p_obj)
                    }, 0)
                } else {
                    this.DOMReadyEvent.subscribe(p_fn, p_obj, p_override)
                }
            }, addListener: function(el, sType, fn, obj, override) {
                if (!fn || !fn.call) {
                    return false
                }
                if (this._isValidCollection(el)) {
                    var ok = true;
                    for (var i = 0, len = el.length; i < len; ++i) {
                        ok = this.on(el[i], sType, fn, obj, override) && ok
                    }
                    return ok
                } else {
                    if (FoxSaver.YUI.lang.isString(el)) {
                        var oEl = this.getEl(el);
                        if (oEl) {
                            el = oEl
                        } else {
                            this.onAvailable(el, function() {
                                FoxSaver.YUI.util.Event.on(el, sType, fn, obj, override)
                            });
                            return true
                        }
                    }
                }
                if (!el) {
                    return false
                }
                if ("unload" == sType && obj !== this) {
                    unloadListeners[unloadListeners.length] = [el, sType, fn, obj, override];
                    return true
                }
                var scope = el;
                if (override) {
                    if (override === true) {
                        scope = obj
                    } else {
                        scope = override
                    }
                }
                var wrappedFn = function(e) {
                    return fn.call(scope, FoxSaver.YUI.util.Event.getEvent(e, el), obj)
                };
                var li = [el, sType, fn, wrappedFn, scope, obj, override];
                var index = listeners.length;
                listeners[index] = li;
                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    if (legacyIndex == -1 || el != legacyEvents[legacyIndex][0]) {
                        legacyIndex = legacyEvents.length;
                        legacyMap[el.id + sType] = legacyIndex;
                        legacyEvents[legacyIndex] = [el, sType, el["on" + sType]];
                        legacyHandlers[legacyIndex] = [];
                        el["on" + sType] = function(e) {
                            FoxSaver.YUI.util.Event.fireLegacyEvent(FoxSaver.YUI.util.Event.getEvent(e), legacyIndex)
                        }
                    }
                    legacyHandlers[legacyIndex].push(li)
                } else {
                    try {
                        this._simpleAdd(el, sType, wrappedFn, false)
                    } catch (ex) {
                        this.lastError = ex;
                        this.removeListener(el, sType, fn);
                        return false
                    }
                }
                return true
            }, fireLegacyEvent: function(e, legacyIndex) {
                var ok = true, le, lh, li, scope, ret;
                lh = legacyHandlers[legacyIndex];
                for (var i = 0, len = lh.length; i < len; ++i) {
                    li = lh[i];
                    if (li && li[this.WFN]) {
                        scope = li[this.ADJ_SCOPE];
                        ret = li[this.WFN].call(scope, e);
                        ok = (ok && ret)
                    }
                }
                le = legacyEvents[legacyIndex];
                if (le && le[2]) {
                    le[2](e)
                }
                return ok
            }, getLegacyIndex: function(el, sType) {
                var key = this.generateId(el) + sType;
                if (typeof legacyMap[key] == "undefined") {
                    return -1
                } else {
                    return legacyMap[key]
                }
            }, useLegacyEvent: function(el, sType) {
                if (this.webkit && ("click" == sType || "dblclick" == sType)) {
                    var v = parseInt(this.webkit, 10);
                    if (!isNaN(v) && v < 418) {
                        return true
                    }
                }
                return false
            }, removeListener: function(el, sType, fn) {
                var i, len, li;
                if (typeof el == "string") {
                    el = this.getEl(el)
                } else {
                    if (this._isValidCollection(el)) {
                        var ok = true;
                        for (i = 0, len = el.length; i < len; ++i) {
                            ok = (this.removeListener(el[i], sType, fn) && ok)
                        }
                        return ok
                    }
                }
                if (!fn || !fn.call) {
                    return this.purgeElement(el, false, sType)
                }
                if ("unload" == sType) {
                    for (i = 0, len = unloadListeners.length; i < len; i++) {
                        li = unloadListeners[i];
                        if (li && li[0] == el && li[1] == sType && li[2] == fn) {
                            unloadListeners[i] = null;
                            return true
                        }
                    }
                    return false
                }
                var cacheItem = null;
                var index = arguments[3];
                if ("undefined" === typeof index) {
                    index = this._getCacheIndex(el, sType, fn)
                }
                if (index >= 0) {
                    cacheItem = listeners[index]
                }
                if (!el || !cacheItem) {
                    return false
                }
                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    var llist = legacyHandlers[legacyIndex];
                    if (llist) {
                        for (i = 0, len = llist.length; i < len; ++i) {
                            li = llist[i];
                            if (li && li[this.EL] == el && li[this.TYPE] == sType && li[this.FN] == fn) {
                                llist[i] = null;
                                break
                            }
                        }
                    }
                } else {
                    try {
                        this._simpleRemove(el, sType, cacheItem[this.WFN], false)
                    } catch (ex) {
                        this.lastError = ex;
                        return false
                    }
                }
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners[index] = null;
                return true
            }, getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t)
            }, resolveTextNode: function(node) {
                if (node && 3 == node.nodeType) {
                    return node.parentNode
                } else {
                    return node
                }
            }, getPageX: function(ev) {
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;
                    if (this.isIE) {
                        x += this._getScrollLeft()
                    }
                }
                return x
            }, getPageY: function(ev) {
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;
                    if (this.isIE) {
                        y += this._getScrollTop()
                    }
                }
                return y
            }, getXY: function(ev) {
                return[this.getPageX(ev), this.getPageY(ev)]
            }, getRelatedTarget: function(ev) {
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == "mouseout") {
                        t = ev.toElement
                    } else {
                        if (ev.type == "mouseover") {
                            t = ev.fromElement
                        }
                    }
                }
                return this.resolveTextNode(t)
            }, getTime: function(ev) {
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t
                    } catch (ex) {
                        this.lastError = ex;
                        return t
                    }
                }
                return ev.time
            }, stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev)
            }, stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation()
                } else {
                    ev.cancelBubble = true
                }
            }, preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault()
                } else {
                    ev.returnValue = false
                }
            }, getEvent: function(e, boundEl) {
                var ev = e || window.event;
                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break
                        }
                        c = c.caller
                    }
                }
                return ev
            }, getCharCode: function(ev) {
                var code = ev.keyCode || ev.charCode || 0;
                if (FoxSaver.YUI.env.ua.webkit && (code in webkitKeymap)) {
                    code = webkitKeymap[code]
                }
                return code
            }, _getCacheIndex: function(el, sType, fn) {
                for (var i = 0, len = listeners.length; i < len; ++i) {
                    var li = listeners[i];
                    if (li && li[this.FN] == fn && li[this.EL] == el && li[this.TYPE] == sType) {
                        return i
                    }
                }
                return -1
            }, generateId: function(el) {
                var id = el.id;
                if (!id) {
                    id = "yuievtautoid-" + counter;
                    ++counter;
                    el.id = id
                }
                return id
            }, _isValidCollection: function(o) {
                try {
                    return(o && typeof o !== "string" && o.length && !o.tagName && !o.alert && typeof o[0] !== "undefined")
                } catch (e) {
                    return false
                }
            }, elCache: {}, getEl: function(id) {
                return(typeof id === "string") ? document.getElementById(id) : id
            }, clearCache: function() {
            }, DOMReadyEvent: new FoxSaver.YUI.util.CustomEvent("DOMReady", this), _load: function(e) {
                if (!loadComplete) {
                    loadComplete = true;
                    var EU = FoxSaver.YUI.util.Event;
                    EU._ready();
                    EU._tryPreloadAttach()
                }
            }, _ready: function(e) {
                var EU = FoxSaver.YUI.util.Event;
                if (!EU.DOMReady) {
                    EU.DOMReady = true;
                    EU.DOMReadyEvent.fire();
                    EU._simpleRemove(document, "DOMContentLoaded", EU._ready)
                }
            }, _tryPreloadAttach: function() {
                if (this.locked) {
                    return false
                }
                if (this.isIE) {
                    if (!this.DOMReady) {
                        this.startInterval();
                        return false
                    }
                }
                this.locked = true;
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0)
                }
                var notAvail = [];
                var executeItem = function(el, item) {
                    var scope = el;
                    if (item.override) {
                        if (item.override === true) {
                            scope = item.obj
                        } else {
                            scope = item.override
                        }
                    }
                    item.fn.call(scope, item.obj)
                };
                var i, len, item, el;
                for (i = 0, len = onAvailStack.length; i < len; ++i) {
                    item = onAvailStack[i];
                    if (item && !item.checkReady) {
                        el = this.getEl(item.id);
                        if (el) {
                            executeItem(el, item);
                            onAvailStack[i] = null
                        } else {
                            notAvail.push(item)
                        }
                    }
                }
                for (i = 0, len = onAvailStack.length; i < len; ++i) {
                    item = onAvailStack[i];
                    if (item && item.checkReady) {
                        el = this.getEl(item.id);
                        if (el) {
                            if (loadComplete || el.nextSibling) {
                                executeItem(el, item);
                                onAvailStack[i] = null
                            }
                        } else {
                            notAvail.push(item)
                        }
                    }
                }
                retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;
                if (tryAgain) {
                    this.startInterval()
                } else {
                    clearInterval(this._interval);
                    this._interval = null
                }
                this.locked = false;
                return true
            }, purgeElement: function(el, recurse, sType) {
                var oEl = (FoxSaver.YUI.lang.isString(el)) ? this.getEl(el) : el;
                var elListeners = this.getListeners(oEl, sType), i, len;
                if (elListeners) {
                    for (i = 0, len = elListeners.length; i < len; ++i) {
                        var l = elListeners[i];
                        this.removeListener(oEl, l.type, l.fn, l.index)
                    }
                }
                if (recurse && oEl && oEl.childNodes) {
                    for (i = 0, len = oEl.childNodes.length; i < len; ++i) {
                        this.purgeElement(oEl.childNodes[i], recurse, sType)
                    }
                }
            }, getListeners: function(el, sType) {
                var results = [], searchLists;
                if (!sType) {
                    searchLists = [listeners, unloadListeners]
                } else {
                    if (sType === "unload") {
                        searchLists = [unloadListeners]
                    } else {
                        searchLists = [listeners]
                    }
                }
                var oEl = (FoxSaver.YUI.lang.isString(el)) ? this.getEl(el) : el;
                for (var j = 0; j < searchLists.length; j = j + 1) {
                    var searchList = searchLists[j];
                    if (searchList && searchList.length > 0) {
                        for (var i = 0, len = searchList.length; i < len; ++i) {
                            var l = searchList[i];
                            if (l && l[this.EL] === oEl && (!sType || sType === l[this.TYPE])) {
                                results.push({type: l[this.TYPE], fn: l[this.FN], obj: l[this.OBJ], adjust: l[this.OVERRIDE], scope: l[this.ADJ_SCOPE], index: i})
                            }
                        }
                    }
                }
                return(results.length) ? results : null
            }, _unload: function(e) {
                var EU = FoxSaver.YUI.util.Event, i, j, l, len, index;
                for (i = 0, len = unloadListeners.length; i < len; ++i) {
                    l = unloadListeners[i];
                    if (l) {
                        var scope = window;
                        if (l[EU.ADJ_SCOPE]) {
                            if (l[EU.ADJ_SCOPE] === true) {
                                scope = l[EU.UNLOAD_OBJ]
                            } else {
                                scope = l[EU.ADJ_SCOPE]
                            }
                        }
                        l[EU.FN].call(scope, EU.getEvent(e, l[EU.EL]), l[EU.UNLOAD_OBJ]);
                        unloadListeners[i] = null;
                        l = null;
                        scope = null
                    }
                }
                unloadListeners = null;
                if (FoxSaver.YUI.env.ua.IE && listeners && listeners.length > 0) {
                    j = listeners.length;
                    while (j) {
                        index = j - 1;
                        l = listeners[index];
                        if (l) {
                            l[EU.EL].clearAttributes()
                        }
                        j = j - 1
                    }
                    l = null
                }
                legacyEvents = null;
                EU._simpleRemove(window, "unload", EU._unload)
            }, _getScrollLeft: function() {
                return this._getScroll()[1]
            }, _getScrollTop: function() {
                return this._getScroll()[0]
            }, _getScroll: function() {
                var dd = document.documentElement, db = document.body;
                if (dd && (dd.scrollTop || dd.scrollLeft)) {
                    return[dd.scrollTop, dd.scrollLeft]
                } else {
                    if (db) {
                        return[db.scrollTop, db.scrollLeft]
                    } else {
                        return[0, 0]
                    }
                }
            }, regCE: function() {
            }, _simpleAdd: function() {
                if (window.addEventListener) {
                    return function(el, sType, fn, capture) {
                        el.addEventListener(sType, fn, (capture))
                    }
                } else {
                    if (window.attachEvent) {
                        return function(el, sType, fn, capture) {
                            el.attachEvent("on" + sType, fn)
                        }
                    } else {
                        return function() {
                        }
                    }
                }
            }(), _simpleRemove: function() {
                if (window.removeEventListener) {
                    return function(el, sType, fn, capture) {
                        el.removeEventListener(sType, fn, (capture))
                    }
                } else {
                    if (window.detachEvent) {
                        return function(el, sType, fn) {
                            el.detachEvent("on" + sType, fn)
                        }
                    } else {
                        return function() {
                        }
                    }
                }
            }()}
    }();
    (function() {
        var EU = FoxSaver.YUI.util.Event;
        EU.on = EU.addListener;
        if (EU.isIE) {
            FoxSaver.YUI.util.Event.onDOMReady(FoxSaver.YUI.util.Event._tryPreloadAttach, FoxSaver.YUI.util.Event, true);
            EU._dri = setInterval(function() {
                var n = document.createElement("p");
                try {
                    n.doScroll("left");
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                    n = null
                } catch (e) {
                    n = null
                }
            }, EU.POLL_INTERVAL)
        } else {
            if (EU.webkit) {
                EU._dri = setInterval(function() {
                    var rs = document.readyState;
                    if ("loaded" == rs || "complete" == rs) {
                        clearInterval(EU._dri);
                        EU._dri = null;
                        EU._ready()
                    }
                }, EU.POLL_INTERVAL)
            } else {
                EU._simpleAdd(document, "DOMContentLoaded", EU._ready)
            }
        }
        EU._simpleAdd(window, "load", EU._load);
        EU._simpleAdd(window, "unload", EU._unload);
        EU._tryPreloadAttach()
    })()
}
FoxSaver.YUI.util.EventProvider = function() {
};
FoxSaver.YUI.util.EventProvider.prototype = {__yui_events: null, __yui_subscribers: null, subscribe: function(p_type, p_fn, p_obj, p_override) {
        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];
        if (ce) {
            ce.subscribe(p_fn, p_obj, p_override)
        } else {
            this.__yui_subscribers = this.__yui_subscribers || {};
            var subs = this.__yui_subscribers;
            if (!subs[p_type]) {
                subs[p_type] = []
            }
            subs[p_type].push({fn: p_fn, obj: p_obj, override: p_override})
        }
    }, unsubscribe: function(p_type, p_fn, p_obj) {
        this.__yui_events = this.__yui_events || {};
        var evts = this.__yui_events;
        if (p_type) {
            var ce = evts[p_type];
            if (ce) {
                return ce.unsubscribe(p_fn, p_obj)
            }
        } else {
            var ret = true;
            for (var i in evts) {
                if (FoxSaver.YUI.lang.hasOwnProperty(evts, i)) {
                    ret = ret && evts[i].unsubscribe(p_fn, p_obj)
                }
            }
            return ret
        }
        return false
    }, unsubscribeAll: function(p_type) {
        return this.unsubscribe(p_type)
    }, createEvent: function(p_type, p_config) {
        this.__yui_events = this.__yui_events || {};
        var opts = p_config || {};
        var events = this.__yui_events;
        if (events[p_type]) {
        } else {
            var scope = opts.scope || this;
            var silent = (opts.silent);
            var ce = new FoxSaver.YUI.util.CustomEvent(p_type, scope, silent, FoxSaver.YUI.util.CustomEvent.FLAT);
            events[p_type] = ce;
            if (opts.onSubscribeCallback) {
                ce.subscribeEvent.subscribe(opts.onSubscribeCallback)
            }
            this.__yui_subscribers = this.__yui_subscribers || {};
            var qs = this.__yui_subscribers[p_type];
            if (qs) {
                for (var i = 0; i < qs.length; ++i) {
                    ce.subscribe(qs[i].fn, qs[i].obj, qs[i].override)
                }
            }
        }
        return events[p_type]
    }, fireEvent: function(p_type, arg1, arg2, etc) {
        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];
        if (!ce) {
            return null
        }
        var args = [];
        for (var i = 1; i < arguments.length; ++i) {
            args.push(arguments[i])
        }
        return ce.fire.apply(ce, args)
    }, hasEvent: function(type) {
        if (this.__yui_events) {
            if (this.__yui_events[type]) {
                return true
            }
        }
        return false
    }};
FoxSaver.YUI.util.KeyListener = function(attachTo, keyData, handler, event) {
    if (!attachTo) {
    } else {
        if (!keyData) {
        } else {
            if (!handler) {
            }
        }
    }
    if (!event) {
        event = FoxSaver.YUI.util.KeyListener.KEYDOWN
    }
    var keyEvent = new FoxSaver.YUI.util.CustomEvent("keyPressed");
    this.enabledEvent = new FoxSaver.YUI.util.CustomEvent("enabled");
    this.disabledEvent = new FoxSaver.YUI.util.CustomEvent("disabled");
    if (typeof attachTo == "string") {
        attachTo = document.getElementById(attachTo)
    }
    if (typeof handler == "function") {
        keyEvent.subscribe(handler)
    } else {
        keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope)
    }
    function handleKeyPress(e, obj) {
        if (!keyData.shift) {
            keyData.shift = false
        }
        if (!keyData.alt) {
            keyData.alt = false
        }
        if (!keyData.ctrl) {
            keyData.ctrl = false
        }
        if (e.shiftKey == keyData.shift && e.altKey == keyData.alt && e.ctrlKey == keyData.ctrl) {
            var dataItem;
            if (keyData.keys instanceof Array) {
                for (var i = 0; i < keyData.keys.length; i++) {
                    dataItem = keyData.keys[i];
                    if (dataItem == e.charCode) {
                        keyEvent.fire(e.charCode, e);
                        break
                    } else {
                        if (dataItem == e.keyCode) {
                            keyEvent.fire(e.keyCode, e);
                            break
                        }
                    }
                }
            } else {
                dataItem = keyData.keys;
                if (dataItem == e.charCode) {
                    keyEvent.fire(e.charCode, e)
                } else {
                    if (dataItem == e.keyCode) {
                        keyEvent.fire(e.keyCode, e)
                    }
                }
            }
        }
    }
    this.enable = function() {
        if (!this.enabled) {
            FoxSaver.YUI.util.Event.addListener(attachTo, event, handleKeyPress);
            this.enabledEvent.fire(keyData)
        }
        this.enabled = true
    };
    this.disable = function() {
        if (this.enabled) {
            FoxSaver.YUI.util.Event.removeListener(attachTo, event, handleKeyPress);
            this.disabledEvent.fire(keyData)
        }
        this.enabled = false
    };
    this.toString = function() {
        return"KeyListener [" + keyData.keys + "] " + attachTo.tagName + (attachTo.id ? "[" + attachTo.id + "]" : "")
    }
};
FoxSaver.YUI.util.KeyListener.KEYDOWN = "keydown";
FoxSaver.YUI.util.KeyListener.KEYUP = "keyup";
FoxSaver.YUI.util.KeyListener.KEY = {ALT: 18, BACK_SPACE: 8, CAPS_LOCK: 20, CONTROL: 17, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, META: 224, NUM_LOCK: 144, PAGE_DOWN: 34, PAGE_UP: 33, PAUSE: 19, PRINTSCREEN: 44, RIGHT: 39, SCROLL_LOCK: 145, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38};
FoxSaver.YUI.register("event", FoxSaver.YUI.util.Event, {version: "2.4.0", build: "733"})