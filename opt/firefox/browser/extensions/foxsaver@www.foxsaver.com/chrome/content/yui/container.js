(function() {
    FoxSaver.YUI.util.Config = function(owner) {
        if (owner) {
            this.init(owner)
        }
    };
    var Lang = FoxSaver.YUI.lang, CustomEvent = FoxSaver.YUI.util.CustomEvent, Config = FoxSaver.YUI.util.Config;
    Config.CONFIG_CHANGED_EVENT = "configChanged";
    Config.BOOLEAN_TYPE = "boolean";
    Config.prototype = {owner: null, queueInProgress: false, config: null, initialConfig: null, eventQueue: null, configChangedEvent: null, init: function(owner) {
            this.owner = owner;
            this.configChangedEvent = this.createEvent(Config.CONFIG_CHANGED_EVENT);
            this.configChangedEvent.signature = CustomEvent.LIST;
            this.queueInProgress = false;
            this.config = {};
            this.initialConfig = {};
            this.eventQueue = []
        }, checkBoolean: function(val) {
            return(typeof val == Config.BOOLEAN_TYPE)
        }, checkNumber: function(val) {
            return(!isNaN(val))
        }, fireEvent: function(key, value) {
            var property = this.config[key];
            if (property && property.event) {
                property.event.fire(value)
            }
        }, addProperty: function(key, propertyObject) {
            key = key.toLowerCase();
            this.config[key] = propertyObject;
            propertyObject.event = this.createEvent(key, {scope: this.owner});
            propertyObject.event.signature = CustomEvent.LIST;
            propertyObject.key = key;
            if (propertyObject.handler) {
                propertyObject.event.subscribe(propertyObject.handler, this.owner)
            }
            this.setProperty(key, propertyObject.value, true);
            if (!propertyObject.suppressEvent) {
                this.queueProperty(key, propertyObject.value)
            }
        }, getConfig: function() {
            var cfg = {}, prop, property;
            for (prop in this.config) {
                property = this.config[prop];
                if (property && property.event) {
                    cfg[prop] = property.value
                }
            }
            return cfg
        }, getProperty: function(key) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                return property.value
            } else {
                return undefined
            }
        }, resetProperty: function(key) {
            key = key.toLowerCase();
            var property = this.config[key];
            if (property && property.event) {
                if (this.initialConfig[key] && !Lang.isUndefined(this.initialConfig[key])) {
                    this.setProperty(key, this.initialConfig[key]);
                    return true
                }
            } else {
                return false
            }
        }, setProperty: function(key, value, silent) {
            var property;
            key = key.toLowerCase();
            if (this.queueInProgress && !silent) {
                this.queueProperty(key, value);
                return true
            } else {
                property = this.config[key];
                if (property && property.event) {
                    if (property.validator && !property.validator(value)) {
                        return false
                    } else {
                        property.value = value;
                        if (!silent) {
                            this.fireEvent(key, value);
                            this.configChangedEvent.fire([key, value])
                        }
                        return true
                    }
                } else {
                    return false
                }
            }
        }, queueProperty: function(key, value) {
            key = key.toLowerCase();
            var property = this.config[key], foundDuplicate = false, iLen, queueItem, queueItemKey, queueItemValue, sLen, supercedesCheck, qLen, queueItemCheck, queueItemCheckKey, queueItemCheckValue, i, s, q;
            if (property && property.event) {
                if (!Lang.isUndefined(value) && property.validator && !property.validator(value)) {
                    return false
                } else {
                    if (!Lang.isUndefined(value)) {
                        property.value = value
                    } else {
                        value = property.value
                    }
                    foundDuplicate = false;
                    iLen = this.eventQueue.length;
                    for (i = 0; i < iLen; i++) {
                        queueItem = this.eventQueue[i];
                        if (queueItem) {
                            queueItemKey = queueItem[0];
                            queueItemValue = queueItem[1];
                            if (queueItemKey == key) {
                                this.eventQueue[i] = null;
                                this.eventQueue.push([key, (!Lang.isUndefined(value) ? value : queueItemValue)]);
                                foundDuplicate = true;
                                break
                            }
                        }
                    }
                    if (!foundDuplicate && !Lang.isUndefined(value)) {
                        this.eventQueue.push([key, value])
                    }
                }
                if (property.supercedes) {
                    sLen = property.supercedes.length;
                    for (s = 0; s < sLen; s++) {
                        supercedesCheck = property.supercedes[s];
                        qLen = this.eventQueue.length;
                        for (q = 0; q < qLen; q++) {
                            queueItemCheck = this.eventQueue[q];
                            if (queueItemCheck) {
                                queueItemCheckKey = queueItemCheck[0];
                                queueItemCheckValue = queueItemCheck[1];
                                if (queueItemCheckKey == supercedesCheck.toLowerCase()) {
                                    this.eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
                                    this.eventQueue[q] = null;
                                    break
                                }
                            }
                        }
                    }
                }
                return true
            } else {
                return false
            }
        }, refireEvent: function(key) {
            key = key.toLowerCase();
            var property = this.config[key];
            if (property && property.event && !Lang.isUndefined(property.value)) {
                if (this.queueInProgress) {
                    this.queueProperty(key)
                } else {
                    this.fireEvent(key, property.value)
                }
            }
        }, applyConfig: function(userConfig, init) {
            var sKey, oConfig;
            if (init) {
                oConfig = {};
                for (sKey in userConfig) {
                    if (Lang.hasOwnProperty(userConfig, sKey)) {
                        oConfig[sKey.toLowerCase()] = userConfig[sKey]
                    }
                }
                this.initialConfig = oConfig
            }
            for (sKey in userConfig) {
                if (Lang.hasOwnProperty(userConfig, sKey)) {
                    this.queueProperty(sKey, userConfig[sKey])
                }
            }
        }, refresh: function() {
            var prop;
            for (prop in this.config) {
                this.refireEvent(prop)
            }
        }, fireQueue: function() {
            var i, queueItem, key, value, property;
            this.queueInProgress = true;
            for (i = 0; i < this.eventQueue.length; i++) {
                queueItem = this.eventQueue[i];
                if (queueItem) {
                    key = queueItem[0];
                    value = queueItem[1];
                    property = this.config[key];
                    property.value = value;
                    this.fireEvent(key, value)
                }
            }
            this.queueInProgress = false;
            this.eventQueue = []
        }, subscribeToConfigEvent: function(key, handler, obj, override) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                if (!Config.alreadySubscribed(property.event, handler, obj)) {
                    property.event.subscribe(handler, obj, override)
                }
                return true
            } else {
                return false
            }
        }, unsubscribeFromConfigEvent: function(key, handler, obj) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                return property.event.unsubscribe(handler, obj)
            } else {
                return false
            }
        }, toString: function() {
            var output = "Config";
            if (this.owner) {
                output += " [" + this.owner.toString() + "]"
            }
            return output
        }, outputEventQueue: function() {
            var output = "", queueItem, q, nQueue = this.eventQueue.length;
            for (q = 0; q < nQueue; q++) {
                queueItem = this.eventQueue[q];
                if (queueItem) {
                    output += queueItem[0] + "=" + queueItem[1] + ", "
                }
            }
            return output
        }, destroy: function() {
            var oConfig = this.config, sProperty, oProperty;
            for (sProperty in oConfig) {
                if (Lang.hasOwnProperty(oConfig, sProperty)) {
                    oProperty = oConfig[sProperty];
                    oProperty.event.unsubscribeAll();
                    oProperty.event = null
                }
            }
            this.configChangedEvent.unsubscribeAll();
            this.configChangedEvent = null;
            this.owner = null;
            this.config = null;
            this.initialConfig = null;
            this.eventQueue = null
        }};
    Config.alreadySubscribed = function(evt, fn, obj) {
        var nSubscribers = evt.subscribers.length, subsc, i;
        if (nSubscribers > 0) {
            i = nSubscribers - 1;
            do {
                subsc = evt.subscribers[i];
                if (subsc && subsc.obj == obj && subsc.fn == fn) {
                    return true
                }
            } while (i--)
        }
        return false
    };
    FoxSaver.YUI.lang.augmentProto(Config, FoxSaver.YUI.util.EventProvider)
}());
(function() {
    FoxSaver.YUI.widget.Module = function(el, userConfig) {
        if (el) {
            this.init(el, userConfig)
        } else {
        }
    };
    var Dom = FoxSaver.YUI.util.Dom, Config = FoxSaver.YUI.util.Config, Event = FoxSaver.YUI.util.Event, CustomEvent = FoxSaver.YUI.util.CustomEvent, Module = FoxSaver.YUI.widget.Module, m_oModuleTemplate, m_oHeaderTemplate, m_oBodyTemplate, m_oFooterTemplate, EVENT_TYPES = {"BEFORE_INIT": "beforeInit", "INIT": "init", "APPEND": "append", "BEFORE_RENDER": "beforeRender", "RENDER": "render", "CHANGE_HEADER": "changeHeader", "CHANGE_BODY": "changeBody", "CHANGE_FOOTER": "changeFooter", "CHANGE_CONTENT": "changeContent", "DESTORY": "destroy", "BEFORE_SHOW": "beforeShow", "SHOW": "show", "BEFORE_HIDE": "beforeHide", "HIDE": "hide"}, DEFAULT_CONFIG = {"VISIBLE": {key: "visible", value: true, validator: FoxSaver.YUI.lang.isBoolean}, "EFFECT": {key: "effect", suppressEvent: true, supercedes: ["visible"]}, "MONITOR_RESIZE": {key: "monitorresize", value: true}, "APPEND_TO_DOCUMENT_BODY": {key: "appendtodocumentbody", value: false}};
    Module.IMG_ROOT = null;
    Module.IMG_ROOT_SSL = null;
    Module.CSS_MODULE = "yui-module";
    Module.CSS_HEADER = "hd";
    Module.CSS_BODY = "bd";
    Module.CSS_FOOTER = "ft";
    Module.RESIZE_MONITOR_SECURE_URL = "javascript:false;";
    Module.textResizeEvent = new CustomEvent("textResize");
    function createModuleTemplate() {
        if (!m_oModuleTemplate) {
            m_oModuleTemplate = document.createElement("div");
            m_oModuleTemplate.innerHTML = ("<div class=\"" + Module.CSS_HEADER + '"></div><div class="' + Module.CSS_BODY + '"></div><div class="' + Module.CSS_FOOTER + '"></div>');
            m_oHeaderTemplate = m_oModuleTemplate.firstChild;
            m_oBodyTemplate = m_oHeaderTemplate.nextSibling;
            m_oFooterTemplate = m_oBodyTemplate.nextSibling
        }
        return m_oModuleTemplate
    }
    function createHeader() {
        if (!m_oHeaderTemplate) {
            createModuleTemplate()
        }
        return(m_oHeaderTemplate.cloneNode(false))
    }
    function createBody() {
        if (!m_oBodyTemplate) {
            createModuleTemplate()
        }
        return(m_oBodyTemplate.cloneNode(false))
    }
    function createFooter() {
        if (!m_oFooterTemplate) {
            createModuleTemplate()
        }
        return(m_oFooterTemplate.cloneNode(false))
    }
    Module.prototype = {constructor: Module, element: null, header: null, body: null, footer: null, id: null, imageRoot: Module.IMG_ROOT, initEvents: function() {
            var SIGNATURE = CustomEvent.LIST;
            this.beforeInitEvent = this.createEvent(EVENT_TYPES.BEFORE_INIT);
            this.beforeInitEvent.signature = SIGNATURE;
            this.initEvent = this.createEvent(EVENT_TYPES.INIT);
            this.initEvent.signature = SIGNATURE;
            this.appendEvent = this.createEvent(EVENT_TYPES.APPEND);
            this.appendEvent.signature = SIGNATURE;
            this.beforeRenderEvent = this.createEvent(EVENT_TYPES.BEFORE_RENDER);
            this.beforeRenderEvent.signature = SIGNATURE;
            this.renderEvent = this.createEvent(EVENT_TYPES.RENDER);
            this.renderEvent.signature = SIGNATURE;
            this.changeHeaderEvent = this.createEvent(EVENT_TYPES.CHANGE_HEADER);
            this.changeHeaderEvent.signature = SIGNATURE;
            this.changeBodyEvent = this.createEvent(EVENT_TYPES.CHANGE_BODY);
            this.changeBodyEvent.signature = SIGNATURE;
            this.changeFooterEvent = this.createEvent(EVENT_TYPES.CHANGE_FOOTER);
            this.changeFooterEvent.signature = SIGNATURE;
            this.changeContentEvent = this.createEvent(EVENT_TYPES.CHANGE_CONTENT);
            this.changeContentEvent.signature = SIGNATURE;
            this.destroyEvent = this.createEvent(EVENT_TYPES.DESTORY);
            this.destroyEvent.signature = SIGNATURE;
            this.beforeShowEvent = this.createEvent(EVENT_TYPES.BEFORE_SHOW);
            this.beforeShowEvent.signature = SIGNATURE;
            this.showEvent = this.createEvent(EVENT_TYPES.SHOW);
            this.showEvent.signature = SIGNATURE;
            this.beforeHideEvent = this.createEvent(EVENT_TYPES.BEFORE_HIDE);
            this.beforeHideEvent.signature = SIGNATURE;
            this.hideEvent = this.createEvent(EVENT_TYPES.HIDE);
            this.hideEvent.signature = SIGNATURE
        }, platform: function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) {
                return"windows"
            } else {
                if (ua.indexOf("macintosh") != -1) {
                    return"mac"
                } else {
                    return false
                }
            }
        }(), browser: function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("opera") != -1) {
                return"opera"
            } else {
                if (ua.indexOf("msie 7") != -1) {
                    return"ie7"
                } else {
                    if (ua.indexOf("msie") != -1) {
                        return"ie"
                    } else {
                        if (ua.indexOf("safari") != -1) {
                            return"safari"
                        } else {
                            if (ua.indexOf("gecko") != -1) {
                                return"gecko"
                            } else {
                                return false
                            }
                        }
                    }
                }
            }
        }(), isSecure: function() {
            if (window.location.href.toLowerCase().indexOf("https") === 0) {
                return true
            } else {
                return false
            }
        }(), initDefaultConfig: function() {
            this.cfg.addProperty(DEFAULT_CONFIG.VISIBLE.key, {handler: this.configVisible, value: DEFAULT_CONFIG.VISIBLE.value, validator: DEFAULT_CONFIG.VISIBLE.validator});
            this.cfg.addProperty(DEFAULT_CONFIG.EFFECT.key, {suppressEvent: DEFAULT_CONFIG.EFFECT.suppressEvent, supercedes: DEFAULT_CONFIG.EFFECT.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.MONITOR_RESIZE.key, {handler: this.configMonitorResize, value: DEFAULT_CONFIG.MONITOR_RESIZE.value});
            this.cfg.addProperty(DEFAULT_CONFIG.APPEND_TO_DOCUMENT_BODY.key, {value: DEFAULT_CONFIG.APPEND_TO_DOCUMENT_BODY.value})
        }, init: function(el, userConfig) {
            var elId, child;
            this.initEvents();
            this.beforeInitEvent.fire(Module);
            this.cfg = new Config(this);
            if (this.isSecure) {
                this.imageRoot = Module.IMG_ROOT_SSL
            }
            if (typeof el == "string") {
                elId = el;
                el = document.getElementById(el);
                if (!el) {
                    el = (createModuleTemplate()).cloneNode(false);
                    el.id = elId
                }
            }
            this.element = el;
            if (el.id) {
                this.id = el.id
            }
            child = this.element.firstChild;
            if (child) {
                var fndHd = false, fndBd = false, fndFt = false;
                do {
                    if (1 == child.nodeType) {
                        if (!fndHd && Dom.hasClass(child, Module.CSS_HEADER)) {
                            this.header = child;
                            fndHd = true
                        } else {
                            if (!fndBd && Dom.hasClass(child, Module.CSS_BODY)) {
                                this.body = child;
                                fndBd = true
                            } else {
                                if (!fndFt && Dom.hasClass(child, Module.CSS_FOOTER)) {
                                    this.footer = child;
                                    fndFt = true
                                }
                            }
                        }
                    }
                } while ((child = child.nextSibling))
            }
            this.initDefaultConfig();
            Dom.addClass(this.element, Module.CSS_MODULE);
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            if (!Config.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) {
                this.renderEvent.subscribe(this.cfg.fireQueue, this.cfg, true)
            }
            this.initEvent.fire(Module)
        }, initResizeMonitor: function() {
            var oDoc, oIFrame, sHTML;
            function fireTextResize() {
                Module.textResizeEvent.fire()
            }
            if (!FoxSaver.YUI.env.ua.opera) {
                oIFrame = Dom.get("_yuiResizeMonitor");
                if (!oIFrame) {
                    oIFrame = document.createElement("iframe");
                    if (this.isSecure && Module.RESIZE_MONITOR_SECURE_URL && FoxSaver.YUI.env.ua.ie) {
                        oIFrame.src = Module.RESIZE_MONITOR_SECURE_URL
                    }
                    if (FoxSaver.YUI.env.ua.gecko) {
                        sHTML = ["<html><head><script ", 'type="text/javascript">', "window.onresize=function(){window.parent.", "FoxSaver.YUI.widget.Module.textResizeEvent.", "fire();}", "<\/script></head>", "<body></body></html>"].join("");
                        oIFrame.src = "data:text/html;charset=utf-8," + encodeURIComponent(sHTML)
                    }
                    oIFrame.id = "_yuiResizeMonitor";
                    oIFrame.style.position = "absolute";
                    oIFrame.style.visibility = "hidden";
                    var fc = document.body.firstChild;
                    if (fc) {
                        document.body.insertBefore(oIFrame, fc)
                    } else {
                        document.body.appendChild(oIFrame)
                    }
                    oIFrame.style.width = "10em";
                    oIFrame.style.height = "10em";
                    oIFrame.style.top = (-1 * oIFrame.offsetHeight) + "px";
                    oIFrame.style.left = (-1 * oIFrame.offsetWidth) + "px";
                    oIFrame.style.borderWidth = "0";
                    oIFrame.style.visibility = "visible";
                    if (FoxSaver.YUI.env.ua.webkit) {
                        oDoc = oIFrame.contentWindow.document;
                        oDoc.open();
                        oDoc.close()
                    }
                }
                if (oIFrame && oIFrame.contentWindow) {
                    Module.textResizeEvent.subscribe(this.onDomResize, this, true);
                    if (!Module.textResizeInitialized) {
                        if (!FoxSaver.YUI.env.ua.gecko) {
                            if (!Event.on(oIFrame.contentWindow, "resize", fireTextResize)) {
                                Event.on(oIFrame, "resize", fireTextResize)
                            }
                        }
                        Module.textResizeInitialized = true
                    }
                    this.resizeMonitor = oIFrame
                }
            }
        }, onDomResize: function(e, obj) {
            var nLeft = -1 * this.resizeMonitor.offsetWidth, nTop = -1 * this.resizeMonitor.offsetHeight;
            this.resizeMonitor.style.top = nTop + "px";
            this.resizeMonitor.style.left = nLeft + "px"
        }, setHeader: function(headerContent) {
            var oHeader = this.header || (this.header = createHeader());
            if (typeof headerContent == "string") {
                oHeader.innerHTML = headerContent
            } else {
                oHeader.innerHTML = "";
                oHeader.appendChild(headerContent)
            }
            this.changeHeaderEvent.fire(headerContent);
            this.changeContentEvent.fire()
        }, appendToHeader: function(element) {
            var oHeader = this.header || (this.header = createHeader());
            oHeader.appendChild(element);
            this.changeHeaderEvent.fire(element);
            this.changeContentEvent.fire()
        }, setBody: function(bodyContent) {
            var oBody = this.body || (this.body = createBody());
            if (typeof bodyContent == "string") {
                oBody.innerHTML = bodyContent
            } else {
                oBody.innerHTML = "";
                oBody.appendChild(bodyContent)
            }
            this.changeBodyEvent.fire(bodyContent);
            this.changeContentEvent.fire()
        }, appendToBody: function(element) {
            var oBody = this.body || (this.body = createBody());
            oBody.appendChild(element);
            this.changeBodyEvent.fire(element);
            this.changeContentEvent.fire()
        }, setFooter: function(footerContent) {
            var oFooter = this.footer || (this.footer = createFooter());
            if (typeof footerContent == "string") {
                oFooter.innerHTML = footerContent
            } else {
                oFooter.innerHTML = "";
                oFooter.appendChild(footerContent)
            }
            this.changeFooterEvent.fire(footerContent);
            this.changeContentEvent.fire()
        }, appendToFooter: function(element) {
            var oFooter = this.footer || (this.footer = createFooter());
            oFooter.appendChild(element);
            this.changeFooterEvent.fire(element);
            this.changeContentEvent.fire()
        }, render: function(appendToNode, moduleElement) {
            var me = this, firstChild;
            function appendTo(parentNode) {
                if (typeof parentNode == "string") {
                    parentNode = document.getElementById(parentNode)
                }
                if (parentNode) {
                    me._addToParent(parentNode, me.element);
                    me.appendEvent.fire()
                }
            }
            this.beforeRenderEvent.fire();
            if (!moduleElement) {
                moduleElement = this.element
            }
            if (appendToNode) {
                appendTo(appendToNode)
            } else {
                if (!Dom.inDocument(this.element)) {
                    return false
                }
            }
            if (this.header && !Dom.inDocument(this.header)) {
                firstChild = moduleElement.firstChild;
                if (firstChild) {
                    moduleElement.insertBefore(this.header, firstChild)
                } else {
                    moduleElement.appendChild(this.header)
                }
            }
            if (this.body && !Dom.inDocument(this.body)) {
                if (this.footer && Dom.isAncestor(this.moduleElement, this.footer)) {
                    moduleElement.insertBefore(this.body, this.footer)
                } else {
                    moduleElement.appendChild(this.body)
                }
            }
            if (this.footer && !Dom.inDocument(this.footer)) {
                moduleElement.appendChild(this.footer)
            }
            this.renderEvent.fire();
            return true
        }, destroy: function() {
            var parent, e;
            if (this.element) {
                Event.purgeElement(this.element, true);
                parent = this.element.parentNode
            }
            if (parent) {
                parent.removeChild(this.element)
            }
            this.element = null;
            this.header = null;
            this.body = null;
            this.footer = null;
            Module.textResizeEvent.unsubscribe(this.onDomResize, this);
            this.cfg.destroy();
            this.cfg = null;
            this.destroyEvent.fire();
            for (e in this) {
                if (e instanceof CustomEvent) {
                    e.unsubscribeAll()
                }
            }
        }, show: function() {
            this.cfg.setProperty("visible", true)
        }, hide: function() {
            this.cfg.setProperty("visible", false)
        }, configVisible: function(type, args, obj) {
            var visible = args[0];
            if (visible) {
                this.beforeShowEvent.fire();
                Dom.setStyle(this.element, "display", "block");
                this.showEvent.fire()
            } else {
                this.beforeHideEvent.fire();
                Dom.setStyle(this.element, "display", "none");
                this.hideEvent.fire()
            }
        }, configMonitorResize: function(type, args, obj) {
            var monitor = args[0];
            if (monitor) {
                this.initResizeMonitor()
            } else {
                Module.textResizeEvent.unsubscribe(this.onDomResize, this, true);
                this.resizeMonitor = null
            }
        }, _addToParent: function(parentNode, element) {
            if (!this.cfg.getProperty("appendtodocumentbody") && parentNode === document.body && parentNode.firstChild) {
                parentNode.insertBefore(element, parentNode.firstChild)
            } else {
                parentNode.appendChild(element)
            }
        }, toString: function() {
            return"Module " + this.id
        }};
    FoxSaver.YUI.lang.augmentProto(Module, FoxSaver.YUI.util.EventProvider)
}());
(function() {
    FoxSaver.YUI.widget.Overlay = function(el, userConfig) {
        FoxSaver.YUI.widget.Overlay.superclass.constructor.call(this, el, userConfig)
    };
    var Lang = FoxSaver.YUI.lang, CustomEvent = FoxSaver.YUI.util.CustomEvent, Module = FoxSaver.YUI.widget.Module, Event = FoxSaver.YUI.util.Event, Dom = FoxSaver.YUI.util.Dom, Config = FoxSaver.YUI.util.Config, Overlay = FoxSaver.YUI.widget.Overlay, m_oIFrameTemplate, EVENT_TYPES = {"BEFORE_MOVE": "beforeMove", "MOVE": "move"}, DEFAULT_CONFIG = {"X": {key: "x", validator: Lang.isNumber, suppressEvent: true, supercedes: ["iframe"]}, "Y": {key: "y", validator: Lang.isNumber, suppressEvent: true, supercedes: ["iframe"]}, "XY": {key: "xy", suppressEvent: true, supercedes: ["iframe"]}, "CONTEXT": {key: "context", suppressEvent: true, supercedes: ["iframe"]}, "FIXED_CENTER": {key: "fixedcenter", value: false, validator: Lang.isBoolean, supercedes: ["iframe", "visible"]}, "WIDTH": {key: "width", suppressEvent: true, supercedes: ["context", "fixedcenter", "iframe"]}, "HEIGHT": {key: "height", suppressEvent: true, supercedes: ["context", "fixedcenter", "iframe"]}, "ZINDEX": {key: "zindex", value: null}, "CONSTRAIN_TO_VIEWPORT": {key: "constraintoviewport", value: false, validator: Lang.isBoolean, supercedes: ["iframe", "x", "y", "xy"]}, "IFRAME": {key: "iframe", value: (FoxSaver.YUI.env.ua.ie == 6 ? true : false), validator: Lang.isBoolean, supercedes: ["zindex"]}};
    Overlay.IFRAME_SRC = "javascript:false;";
    Overlay.IFRAME_OFFSET = 3;
    Overlay.VIEWPORT_OFFSET = 10;
    Overlay.TOP_LEFT = "tl";
    Overlay.TOP_RIGHT = "tr";
    Overlay.BOTTOM_LEFT = "bl";
    Overlay.BOTTOM_RIGHT = "br";
    Overlay.CSS_OVERLAY = "yui-overlay";
    Overlay.windowScrollEvent = new CustomEvent("windowScroll");
    Overlay.windowResizeEvent = new CustomEvent("windowResize");
    Overlay.windowScrollHandler = function(e) {
        if (FoxSaver.YUI.env.ua.ie) {
            if (!window.scrollEnd) {
                window.scrollEnd = -1
            }
            clearTimeout(window.scrollEnd);
            window.scrollEnd = setTimeout(function() {
                Overlay.windowScrollEvent.fire()
            }, 1)
        } else {
            Overlay.windowScrollEvent.fire()
        }
    };
    Overlay.windowResizeHandler = function(e) {
        if (FoxSaver.YUI.env.ua.ie) {
            if (!window.resizeEnd) {
                window.resizeEnd = -1
            }
            clearTimeout(window.resizeEnd);
            window.resizeEnd = setTimeout(function() {
                Overlay.windowResizeEvent.fire()
            }, 100)
        } else {
            Overlay.windowResizeEvent.fire()
        }
    };
    Overlay._initialized = null;
    if (Overlay._initialized === null) {
        Event.on(window, "scroll", Overlay.windowScrollHandler);
        Event.on(window, "resize", Overlay.windowResizeHandler);
        Overlay._initialized = true
    }
    FoxSaver.YUI.extend(Overlay, Module, {init: function(el, userConfig) {
            Overlay.superclass.init.call(this, el);
            this.beforeInitEvent.fire(Overlay);
            Dom.addClass(this.element, Overlay.CSS_OVERLAY);
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            if (this.platform == "mac" && FoxSaver.YUI.env.ua.gecko) {
                if (!Config.alreadySubscribed(this.showEvent, this.showMacGeckoScrollbars, this)) {
                    this.showEvent.subscribe(this.showMacGeckoScrollbars, this, true)
                }
                if (!Config.alreadySubscribed(this.hideEvent, this.hideMacGeckoScrollbars, this)) {
                    this.hideEvent.subscribe(this.hideMacGeckoScrollbars, this, true)
                }
            }
            this.initEvent.fire(Overlay)
        }, initEvents: function() {
            Overlay.superclass.initEvents.call(this);
            var SIGNATURE = CustomEvent.LIST;
            this.beforeMoveEvent = this.createEvent(EVENT_TYPES.BEFORE_MOVE);
            this.beforeMoveEvent.signature = SIGNATURE;
            this.moveEvent = this.createEvent(EVENT_TYPES.MOVE);
            this.moveEvent.signature = SIGNATURE
        }, initDefaultConfig: function() {
            Overlay.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty(DEFAULT_CONFIG.X.key, {handler: this.configX, validator: DEFAULT_CONFIG.X.validator, suppressEvent: DEFAULT_CONFIG.X.suppressEvent, supercedes: DEFAULT_CONFIG.X.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.Y.key, {handler: this.configY, validator: DEFAULT_CONFIG.Y.validator, suppressEvent: DEFAULT_CONFIG.Y.suppressEvent, supercedes: DEFAULT_CONFIG.Y.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.XY.key, {handler: this.configXY, suppressEvent: DEFAULT_CONFIG.XY.suppressEvent, supercedes: DEFAULT_CONFIG.XY.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.CONTEXT.key, {handler: this.configContext, suppressEvent: DEFAULT_CONFIG.CONTEXT.suppressEvent, supercedes: DEFAULT_CONFIG.CONTEXT.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.FIXED_CENTER.key, {handler: this.configFixedCenter, value: DEFAULT_CONFIG.FIXED_CENTER.value, validator: DEFAULT_CONFIG.FIXED_CENTER.validator, supercedes: DEFAULT_CONFIG.FIXED_CENTER.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.WIDTH.key, {handler: this.configWidth, suppressEvent: DEFAULT_CONFIG.WIDTH.suppressEvent, supercedes: DEFAULT_CONFIG.WIDTH.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.HEIGHT.key, {handler: this.configHeight, suppressEvent: DEFAULT_CONFIG.HEIGHT.suppressEvent, supercedes: DEFAULT_CONFIG.HEIGHT.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.ZINDEX.key, {handler: this.configzIndex, value: DEFAULT_CONFIG.ZINDEX.value});
            this.cfg.addProperty(DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.key, {handler: this.configConstrainToViewport, value: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.value, validator: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.validator, supercedes: DEFAULT_CONFIG.CONSTRAIN_TO_VIEWPORT.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.IFRAME.key, {handler: this.configIframe, value: DEFAULT_CONFIG.IFRAME.value, validator: DEFAULT_CONFIG.IFRAME.validator, supercedes: DEFAULT_CONFIG.IFRAME.supercedes})
        }, moveTo: function(x, y) {
            this.cfg.setProperty("xy", [x, y])
        }, hideMacGeckoScrollbars: function() {
            Dom.removeClass(this.element, "show-scrollbars");
            Dom.addClass(this.element, "hide-scrollbars")
        }, showMacGeckoScrollbars: function() {
            Dom.removeClass(this.element, "hide-scrollbars");
            Dom.addClass(this.element, "show-scrollbars")
        }, configVisible: function(type, args, obj) {
            var visible = args[0], currentVis = Dom.getStyle(this.element, "visibility"), effect = this.cfg.getProperty("effect"), effectInstances = [], isMacGecko = (this.platform == "mac" && FoxSaver.YUI.env.ua.gecko), alreadySubscribed = Config.alreadySubscribed, eff, ei, e, i, j, k, h, nEffects, nEffectInstances;
            if (currentVis == "inherit") {
                e = this.element.parentNode;
                while (e.nodeType != 9 && e.nodeType != 11) {
                    currentVis = Dom.getStyle(e, "visibility");
                    if (currentVis != "inherit") {
                        break
                    }
                    e = e.parentNode
                }
                if (currentVis == "inherit") {
                    currentVis = "visible"
                }
            }
            if (effect) {
                if (effect instanceof Array) {
                    nEffects = effect.length;
                    for (i = 0; i < nEffects; i++) {
                        eff = effect[i];
                        effectInstances[effectInstances.length] = eff.effect(this, eff.duration)
                    }
                } else {
                    effectInstances[effectInstances.length] = effect.effect(this, effect.duration)
                }
            }
            if (visible) {
                if (isMacGecko) {
                    this.showMacGeckoScrollbars()
                }
                if (effect) {
                    if (visible) {
                        if (currentVis != "visible" || currentVis === "") {
                            this.beforeShowEvent.fire();
                            nEffectInstances = effectInstances.length;
                            for (j = 0; j < nEffectInstances; j++) {
                                ei = effectInstances[j];
                                if (j === 0 && !alreadySubscribed(ei.animateInCompleteEvent, this.showEvent.fire, this.showEvent)) {
                                    ei.animateInCompleteEvent.subscribe(this.showEvent.fire, this.showEvent, true)
                                }
                                ei.animateIn()
                            }
                        }
                    }
                } else {
                    if (currentVis != "visible" || currentVis === "") {
                        this.beforeShowEvent.fire();
                        Dom.setStyle(this.element, "visibility", "visible");
                        this.cfg.refireEvent("iframe");
                        this.showEvent.fire()
                    }
                }
            } else {
                if (isMacGecko) {
                    this.hideMacGeckoScrollbars()
                }
                if (effect) {
                    if (currentVis == "visible") {
                        this.beforeHideEvent.fire();
                        nEffectInstances = effectInstances.length;
                        for (k = 0; k < nEffectInstances; k++) {
                            h = effectInstances[k];
                            if (k === 0 && !alreadySubscribed(h.animateOutCompleteEvent, this.hideEvent.fire, this.hideEvent)) {
                                h.animateOutCompleteEvent.subscribe(this.hideEvent.fire, this.hideEvent, true)
                            }
                            h.animateOut()
                        }
                    } else {
                        if (currentVis === "") {
                            Dom.setStyle(this.element, "visibility", "hidden")
                        }
                    }
                } else {
                    if (currentVis == "visible" || currentVis === "") {
                        this.beforeHideEvent.fire();
                        Dom.setStyle(this.element, "visibility", "hidden");
                        this.hideEvent.fire()
                    }
                }
            }
        }, doCenterOnDOMEvent: function() {
            if (this.cfg.getProperty("visible")) {
                this.center()
            }
        }, configFixedCenter: function(type, args, obj) {
            var val = args[0], alreadySubscribed = Config.alreadySubscribed, windowResizeEvent = Overlay.windowResizeEvent, windowScrollEvent = Overlay.windowScrollEvent;
            if (val) {
                this.center();
                if (!alreadySubscribed(this.beforeShowEvent, this.center, this)) {
                    this.beforeShowEvent.subscribe(this.center)
                }
                if (!alreadySubscribed(windowResizeEvent, this.doCenterOnDOMEvent, this)) {
                    windowResizeEvent.subscribe(this.doCenterOnDOMEvent, this, true)
                }
                if (!alreadySubscribed(windowScrollEvent, this.doCenterOnDOMEvent, this)) {
                    windowScrollEvent.subscribe(this.doCenterOnDOMEvent, this, true)
                }
            } else {
                this.beforeShowEvent.unsubscribe(this.center);
                windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
                windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this)
            }
        }, configHeight: function(type, args, obj) {
            var height = args[0], el = this.element;
            Dom.setStyle(el, "height", height);
            this.cfg.refireEvent("iframe")
        }, configWidth: function(type, args, obj) {
            var width = args[0], el = this.element;
            Dom.setStyle(el, "width", width);
            this.cfg.refireEvent("iframe")
        }, configzIndex: function(type, args, obj) {
            var zIndex = args[0], el = this.element;
            if (!zIndex) {
                zIndex = Dom.getStyle(el, "zIndex");
                if (!zIndex || isNaN(zIndex)) {
                    zIndex = 0
                }
            }
            if (this.iframe || this.cfg.getProperty("iframe") === true) {
                if (zIndex <= 0) {
                    zIndex = 1
                }
            }
            Dom.setStyle(el, "zIndex", zIndex);
            this.cfg.setProperty("zIndex", zIndex, true);
            if (this.iframe) {
                this.stackIframe()
            }
        }, configXY: function(type, args, obj) {
            var pos = args[0], x = pos[0], y = pos[1];
            this.cfg.setProperty("x", x);
            this.cfg.setProperty("y", y);
            this.beforeMoveEvent.fire([x, y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            this.cfg.refireEvent("iframe");
            this.moveEvent.fire([x, y])
        }, configX: function(type, args, obj) {
            var x = args[0], y = this.cfg.getProperty("y");
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            this.beforeMoveEvent.fire([x, y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            Dom.setX(this.element, x, true);
            this.cfg.setProperty("xy", [x, y], true);
            this.cfg.refireEvent("iframe");
            this.moveEvent.fire([x, y])
        }, configY: function(type, args, obj) {
            var x = this.cfg.getProperty("x"), y = args[0];
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            this.beforeMoveEvent.fire([x, y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            Dom.setY(this.element, y, true);
            this.cfg.setProperty("xy", [x, y], true);
            this.cfg.refireEvent("iframe");
            this.moveEvent.fire([x, y])
        }, showIframe: function() {
            var oIFrame = this.iframe, oParentNode;
            if (oIFrame) {
                oParentNode = this.element.parentNode;
                if (oParentNode != oIFrame.parentNode) {
                    this._addToParent(oParentNode, oIFrame)
                }
                oIFrame.style.display = "block"
            }
        }, hideIframe: function() {
            if (this.iframe) {
                this.iframe.style.display = "none"
            }
        }, syncIframe: function() {
            var oIFrame = this.iframe, oElement = this.element, nOffset = Overlay.IFRAME_OFFSET, nDimensionOffset = (nOffset * 2), aXY;
            if (oIFrame) {
                oIFrame.style.width = (oElement.offsetWidth + nDimensionOffset + "px");
                oIFrame.style.height = (oElement.offsetHeight + nDimensionOffset + "px");
                aXY = this.cfg.getProperty("xy");
                if (!Lang.isArray(aXY) || (isNaN(aXY[0]) || isNaN(aXY[1]))) {
                    this.syncPosition();
                    aXY = this.cfg.getProperty("xy")
                }
                Dom.setXY(oIFrame, [(aXY[0] - nOffset), (aXY[1] - nOffset)])
            }
        }, stackIframe: function() {
            if (this.iframe) {
                var overlayZ = Dom.getStyle(this.element, "zIndex");
                if (!FoxSaver.YUI.lang.isUndefined(overlayZ) && !isNaN(overlayZ)) {
                    Dom.setStyle(this.iframe, "zIndex", (overlayZ - 1))
                }
            }
        }, configIframe: function(type, args, obj) {
            var bIFrame = args[0];
            function createIFrame() {
                var oIFrame = this.iframe, oElement = this.element, oParent;
                if (!oIFrame) {
                    if (!m_oIFrameTemplate) {
                        m_oIFrameTemplate = document.createElement("iframe");
                        if (this.isSecure) {
                            m_oIFrameTemplate.src = Overlay.IFRAME_SRC
                        }
                        if (FoxSaver.YUI.env.ua.ie) {
                            m_oIFrameTemplate.style.filter = "alpha(opacity=0)";
                            m_oIFrameTemplate.frameBorder = 0
                        } else {
                            m_oIFrameTemplate.style.opacity = "0"
                        }
                        m_oIFrameTemplate.style.position = "absolute";
                        m_oIFrameTemplate.style.border = "none";
                        m_oIFrameTemplate.style.margin = "0";
                        m_oIFrameTemplate.style.padding = "0";
                        m_oIFrameTemplate.style.display = "none"
                    }
                    oIFrame = m_oIFrameTemplate.cloneNode(false);
                    oParent = oElement.parentNode;
                    var parentNode = oParent || document.body;
                    this._addToParent(parentNode, oIFrame);
                    this.iframe = oIFrame
                }
                this.showIframe();
                this.syncIframe();
                this.stackIframe();
                if (!this._hasIframeEventListeners) {
                    this.showEvent.subscribe(this.showIframe);
                    this.hideEvent.subscribe(this.hideIframe);
                    this.changeContentEvent.subscribe(this.syncIframe);
                    this._hasIframeEventListeners = true
                }
            }
            function onBeforeShow() {
                createIFrame.call(this);
                this.beforeShowEvent.unsubscribe(onBeforeShow);
                this._iframeDeferred = false
            }
            if (bIFrame) {
                if (this.cfg.getProperty("visible")) {
                    createIFrame.call(this)
                } else {
                    if (!this._iframeDeferred) {
                        this.beforeShowEvent.subscribe(onBeforeShow);
                        this._iframeDeferred = true
                    }
                }
            } else {
                this.hideIframe();
                if (this._hasIframeEventListeners) {
                    this.showEvent.unsubscribe(this.showIframe);
                    this.hideEvent.unsubscribe(this.hideIframe);
                    this.changeContentEvent.unsubscribe(this.syncIframe);
                    this._hasIframeEventListeners = false
                }
            }
        }, configConstrainToViewport: function(type, args, obj) {
            function constrainBeforeShow() {
                if (FoxSaver.YUI.lang.isUndefined(this.cfg.getProperty("xy"))) {
                    this.syncPosition()
                }
                var x = this.cfg.getProperty("x");
                var y = this.cfg.getProperty("y");
                var cXY = this.getConstrainedXY(x, y);
                if (cXY[0] !== x || cXY[1] !== y) {
                    this.moveTo(cXY[0], cXY[1])
                }
            }
            var val = args[0];
            if (val) {
                if (!Config.alreadySubscribed(this.beforeMoveEvent, this.enforceConstraints, this)) {
                    this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true)
                }
                if (!Config.alreadySubscribed(this.beforeShowEvent, constrainBeforeShow)) {
                    this.beforeShowEvent.subscribe(constrainBeforeShow)
                }
            } else {
                this.beforeShowEvent.unsubscribe(constrainBeforeShow);
                this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this)
            }
        }, configContext: function(type, args, obj) {
            var contextArgs = args[0], contextEl, elementMagnetCorner, contextMagnetCorner;
            if (contextArgs) {
                contextEl = contextArgs[0];
                elementMagnetCorner = contextArgs[1];
                contextMagnetCorner = contextArgs[2];
                if (contextEl) {
                    if (typeof contextEl == "string") {
                        this.cfg.setProperty("context", [document.getElementById(contextEl), elementMagnetCorner, contextMagnetCorner], true)
                    }
                    if (elementMagnetCorner && contextMagnetCorner) {
                        this.align(elementMagnetCorner, contextMagnetCorner)
                    }
                }
            }
        }, align: function(elementAlign, contextAlign) {
            var contextArgs = this.cfg.getProperty("context"), me = this, context, element, contextRegion;
            function doAlign(v, h) {
                switch (elementAlign) {
                    case Overlay.TOP_LEFT:
                        me.moveTo(h, v);
                        break;
                    case Overlay.TOP_RIGHT:
                        me.moveTo((h - element.offsetWidth), v);
                        break;
                    case Overlay.BOTTOM_LEFT:
                        me.moveTo(h, (v - element.offsetHeight));
                        break;
                    case Overlay.BOTTOM_RIGHT:
                        me.moveTo((h - element.offsetWidth), (v - element.offsetHeight));
                        break
                    }
            }
            if (contextArgs) {
                context = contextArgs[0];
                element = this.element;
                me = this;
                if (!elementAlign) {
                    elementAlign = contextArgs[1]
                }
                if (!contextAlign) {
                    contextAlign = contextArgs[2]
                }
                if (element && context) {
                    contextRegion = Dom.getRegion(context);
                    switch (contextAlign) {
                        case Overlay.TOP_LEFT:
                            doAlign(contextRegion.top, contextRegion.left);
                            break;
                        case Overlay.TOP_RIGHT:
                            doAlign(contextRegion.top, contextRegion.right);
                            break;
                        case Overlay.BOTTOM_LEFT:
                            doAlign(contextRegion.bottom, contextRegion.left);
                            break;
                        case Overlay.BOTTOM_RIGHT:
                            doAlign(contextRegion.bottom, contextRegion.right);
                            break
                        }
                }
            }
        }, enforceConstraints: function(type, args, obj) {
            var pos = args[0];
            var cXY = this.getConstrainedXY(pos[0], pos[1]);
            this.cfg.setProperty("x", cXY[0], true);
            this.cfg.setProperty("y", cXY[1], true);
            this.cfg.setProperty("xy", cXY, true)
        }, getConstrainedXY: function(x, y) {
            var nViewportOffset = Overlay.VIEWPORT_OFFSET, viewPortWidth = Dom.getViewportWidth(), viewPortHeight = Dom.getViewportHeight(), offsetHeight = this.element.offsetHeight, offsetWidth = this.element.offsetWidth, scrollX = Dom.getDocumentScrollLeft(), scrollY = Dom.getDocumentScrollTop();
            var xNew = x;
            var yNew = y;
            if (offsetWidth + nViewportOffset < viewPortWidth) {
                var leftConstraint = scrollX + nViewportOffset;
                var rightConstraint = scrollX + viewPortWidth - offsetWidth - nViewportOffset;
                if (x < leftConstraint) {
                    xNew = leftConstraint
                } else {
                    if (x > rightConstraint) {
                        xNew = rightConstraint
                    }
                }
            } else {
                xNew = nViewportOffset + scrollX
            }
            if (offsetHeight + nViewportOffset < viewPortHeight) {
                var topConstraint = scrollY + nViewportOffset;
                var bottomConstraint = scrollY + viewPortHeight - offsetHeight - nViewportOffset;
                if (y < topConstraint) {
                    yNew = topConstraint
                } else {
                    if (y > bottomConstraint) {
                        yNew = bottomConstraint
                    }
                }
            } else {
                yNew = nViewportOffset + scrollY
            }
            return[xNew, yNew]
        }, center: function() {
            var nViewportOffset = Overlay.VIEWPORT_OFFSET, elementWidth = this.element.offsetWidth, elementHeight = this.element.offsetHeight, viewPortWidth = Dom.getViewportWidth(), viewPortHeight = Dom.getViewportHeight(), x, y;
            if (elementWidth < viewPortWidth) {
                x = (viewPortWidth / 2) - (elementWidth / 2) + Dom.getDocumentScrollLeft()
            } else {
                x = nViewportOffset + Dom.getDocumentScrollLeft()
            }
            if (elementHeight < viewPortHeight) {
                y = (viewPortHeight / 2) - (elementHeight / 2) + Dom.getDocumentScrollTop()
            } else {
                y = nViewportOffset + Dom.getDocumentScrollTop()
            }
            this.cfg.setProperty("xy", [parseInt(x, 10), parseInt(y, 10)]);
            this.cfg.refireEvent("iframe")
        }, syncPosition: function() {
            var pos = Dom.getXY(this.element);
            this.cfg.setProperty("x", pos[0], true);
            this.cfg.setProperty("y", pos[1], true);
            this.cfg.setProperty("xy", pos, true)
        }, onDomResize: function(e, obj) {
            var me = this;
            Overlay.superclass.onDomResize.call(this, e, obj);
            setTimeout(function() {
                me.syncPosition();
                me.cfg.refireEvent("iframe");
                me.cfg.refireEvent("context")
            }, 0)
        }, bringToTop: function() {
            var aOverlays = [], oElement = this.element;
            function compareZIndexDesc(p_oOverlay1, p_oOverlay2) {
                var sZIndex1 = Dom.getStyle(p_oOverlay1, "zIndex"), sZIndex2 = Dom.getStyle(p_oOverlay2, "zIndex"), nZIndex1 = (!sZIndex1 || isNaN(sZIndex1)) ? 0 : parseInt(sZIndex1, 10), nZIndex2 = (!sZIndex2 || isNaN(sZIndex2)) ? 0 : parseInt(sZIndex2, 10);
                if (nZIndex1 > nZIndex2) {
                    return -1
                } else {
                    if (nZIndex1 < nZIndex2) {
                        return 1
                    } else {
                        return 0
                    }
                }
            }
            function isOverlayElement(p_oElement) {
                var oOverlay = Dom.hasClass(p_oElement, Overlay.CSS_OVERLAY), Panel = FoxSaver.YUI.widget.Panel;
                if (oOverlay && !Dom.isAncestor(oElement, oOverlay)) {
                    if (Panel && Dom.hasClass(p_oElement, Panel.CSS_PANEL)) {
                        aOverlays[aOverlays.length] = p_oElement.parentNode
                    } else {
                        aOverlays[aOverlays.length] = p_oElement
                    }
                }
            }
            Dom.getElementsBy(isOverlayElement, "DIV", document.body);
            aOverlays.sort(compareZIndexDesc);
            var oTopOverlay = aOverlays[0], nTopZIndex;
            if (oTopOverlay) {
                nTopZIndex = Dom.getStyle(oTopOverlay, "zIndex");
                if (!isNaN(nTopZIndex)) {
                    var bRequiresBump = false;
                    if (oTopOverlay != oElement) {
                        bRequiresBump = true
                    } else {
                        if (aOverlays.length > 1) {
                            var nNextZIndex = Dom.getStyle(aOverlays[1], "zIndex");
                            if (!isNaN(nNextZIndex) && (nTopZIndex == nNextZIndex)) {
                                bRequiresBump = true
                            }
                        }
                    }
                    if (bRequiresBump) {
                        this.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2))
                    }
                }
            }
        }, destroy: function() {
            if (this.iframe) {
                this.iframe.parentNode.removeChild(this.iframe)
            }
            this.iframe = null;
            Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
            Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
            Overlay.superclass.destroy.call(this)
        }, toString: function() {
            return"Overlay " + this.id
        }})
}());
(function() {
    FoxSaver.YUI.widget.OverlayManager = function(userConfig) {
        this.init(userConfig)
    };
    var Overlay = FoxSaver.YUI.widget.Overlay, Event = FoxSaver.YUI.util.Event, Dom = FoxSaver.YUI.util.Dom, Config = FoxSaver.YUI.util.Config, CustomEvent = FoxSaver.YUI.util.CustomEvent, OverlayManager = FoxSaver.YUI.widget.OverlayManager;
    OverlayManager.CSS_FOCUSED = "focused";
    OverlayManager.prototype = {constructor: OverlayManager, overlays: null, initDefaultConfig: function() {
            this.cfg.addProperty("overlays", {suppressEvent: true});
            this.cfg.addProperty("focusevent", {value: "mousedown"})
        }, init: function(userConfig) {
            this.cfg = new Config(this);
            this.initDefaultConfig();
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            this.cfg.fireQueue();
            var activeOverlay = null;
            this.getActive = function() {
                return activeOverlay
            };
            this.focus = function(overlay) {
                var o = this.find(overlay);
                if (o) {
                    if (activeOverlay != o) {
                        if (activeOverlay) {
                            activeOverlay.blur()
                        }
                        this.bringToTop(o);
                        activeOverlay = o;
                        Dom.addClass(activeOverlay.element, OverlayManager.CSS_FOCUSED);
                        o.focusEvent.fire()
                    }
                }
            };
            this.remove = function(overlay) {
                var o = this.find(overlay), originalZ;
                if (o) {
                    if (activeOverlay == o) {
                        activeOverlay = null
                    }
                    var bDestroyed = (o.element === null && o.cfg === null) ? true : false;
                    if (!bDestroyed) {
                        originalZ = Dom.getStyle(o.element, "zIndex");
                        o.cfg.setProperty("zIndex", -1000, true)
                    }
                    this.overlays.sort(this.compareZIndexDesc);
                    this.overlays = this.overlays.slice(0, (this.overlays.length - 1));
                    o.hideEvent.unsubscribe(o.blur);
                    o.destroyEvent.unsubscribe(this._onOverlayDestroy, o);
                    if (!bDestroyed) {
                        Event.removeListener(o.element, this.cfg.getProperty("focusevent"), this._onOverlayElementFocus);
                        o.cfg.setProperty("zIndex", originalZ, true);
                        o.cfg.setProperty("manager", null)
                    }
                    o.focusEvent.unsubscribeAll();
                    o.blurEvent.unsubscribeAll();
                    o.focusEvent = null;
                    o.blurEvent = null;
                    o.focus = null;
                    o.blur = null
                }
            };
            this.blurAll = function() {
                var nOverlays = this.overlays.length, i;
                if (nOverlays > 0) {
                    i = nOverlays - 1;
                    do {
                        this.overlays[i].blur()
                    } while (i--)
                }
            };
            this._onOverlayBlur = function(p_sType, p_aArgs) {
                activeOverlay = null
            };
            var overlays = this.cfg.getProperty("overlays");
            if (!this.overlays) {
                this.overlays = []
            }
            if (overlays) {
                this.register(overlays);
                this.overlays.sort(this.compareZIndexDesc)
            }
        }, _onOverlayElementFocus: function(p_oEvent) {
            var oTarget = Event.getTarget(p_oEvent), oClose = this.close;
            if (oClose && (oTarget == oClose || Dom.isAncestor(oClose, oTarget))) {
                this.blur()
            } else {
                this.focus()
            }
        }, _onOverlayDestroy: function(p_sType, p_aArgs, p_oOverlay) {
            this.remove(p_oOverlay)
        }, register: function(overlay) {
            var mgr = this, zIndex, regcount, i, nOverlays;
            if (overlay instanceof Overlay) {
                overlay.cfg.addProperty("manager", {value: this});
                overlay.focusEvent = overlay.createEvent("focus");
                overlay.focusEvent.signature = CustomEvent.LIST;
                overlay.blurEvent = overlay.createEvent("blur");
                overlay.blurEvent.signature = CustomEvent.LIST;
                overlay.focus = function() {
                    mgr.focus(this)
                };
                overlay.blur = function() {
                    if (mgr.getActive() == this) {
                        Dom.removeClass(this.element, OverlayManager.CSS_FOCUSED);
                        this.blurEvent.fire()
                    }
                };
                overlay.blurEvent.subscribe(mgr._onOverlayBlur);
                overlay.hideEvent.subscribe(overlay.blur);
                overlay.destroyEvent.subscribe(this._onOverlayDestroy, overlay, this);
                Event.on(overlay.element, this.cfg.getProperty("focusevent"), this._onOverlayElementFocus, null, overlay);
                zIndex = Dom.getStyle(overlay.element, "zIndex");
                if (!isNaN(zIndex)) {
                    overlay.cfg.setProperty("zIndex", parseInt(zIndex, 10))
                } else {
                    overlay.cfg.setProperty("zIndex", 0)
                }
                this.overlays.push(overlay);
                this.bringToTop(overlay);
                return true
            } else {
                if (overlay instanceof Array) {
                    regcount = 0;
                    nOverlays = overlay.length;
                    for (i = 0; i < nOverlays; i++) {
                        if (this.register(overlay[i])) {
                            regcount++
                        }
                    }
                    if (regcount > 0) {
                        return true
                    }
                } else {
                    return false
                }
            }
        }, bringToTop: function(p_oOverlay) {
            var oOverlay = this.find(p_oOverlay), nTopZIndex, oTopOverlay, aOverlays;
            if (oOverlay) {
                aOverlays = this.overlays;
                aOverlays.sort(this.compareZIndexDesc);
                oTopOverlay = aOverlays[0];
                if (oTopOverlay) {
                    nTopZIndex = Dom.getStyle(oTopOverlay.element, "zIndex");
                    if (!isNaN(nTopZIndex)) {
                        var bRequiresBump = false;
                        if (oTopOverlay !== oOverlay) {
                            bRequiresBump = true
                        } else {
                            if (aOverlays.length > 1) {
                                var nNextZIndex = Dom.getStyle(aOverlays[1].element, "zIndex");
                                if (!isNaN(nNextZIndex) && (nTopZIndex == nNextZIndex)) {
                                    bRequiresBump = true
                                }
                            }
                        }
                        if (bRequiresBump) {
                            oOverlay.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2))
                        }
                    }
                    aOverlays.sort(this.compareZIndexDesc)
                }
            }
        }, find: function(overlay) {
            var aOverlays = this.overlays, nOverlays = aOverlays.length, i;
            if (nOverlays > 0) {
                i = nOverlays - 1;
                if (overlay instanceof Overlay) {
                    do {
                        if (aOverlays[i] == overlay) {
                            return aOverlays[i]
                        }
                    } while (i--)
                } else {
                    if (typeof overlay == "string") {
                        do {
                            if (aOverlays[i].id == overlay) {
                                return aOverlays[i]
                            }
                        } while (i--)
                    }
                }
                return null
            }
        }, compareZIndexDesc: function(o1, o2) {
            var zIndex1 = (o1.cfg) ? o1.cfg.getProperty("zIndex") : null, zIndex2 = (o2.cfg) ? o2.cfg.getProperty("zIndex") : null;
            if (zIndex1 === null && zIndex2 === null) {
                return 0
            } else {
                if (zIndex1 === null) {
                    return 1
                } else {
                    if (zIndex2 === null) {
                        return -1
                    } else {
                        if (zIndex1 > zIndex2) {
                            return -1
                        } else {
                            if (zIndex1 < zIndex2) {
                                return 1
                            } else {
                                return 0
                            }
                        }
                    }
                }
            }
        }, showAll: function() {
            var aOverlays = this.overlays, nOverlays = aOverlays.length, i;
            if (nOverlays > 0) {
                i = nOverlays - 1;
                do {
                    aOverlays[i].show()
                } while (i--)
            }
        }, hideAll: function() {
            var aOverlays = this.overlays, nOverlays = aOverlays.length, i;
            if (nOverlays > 0) {
                i = nOverlays - 1;
                do {
                    aOverlays[i].hide()
                } while (i--)
            }
        }, toString: function() {
            return"OverlayManager"
        }}
}());
(function() {
    FoxSaver.YUI.widget.Tooltip = function(el, userConfig) {
        FoxSaver.YUI.widget.Tooltip.superclass.constructor.call(this, el, userConfig)
    };
    var Lang = FoxSaver.YUI.lang, Event = FoxSaver.YUI.util.Event, Dom = FoxSaver.YUI.util.Dom, Tooltip = FoxSaver.YUI.widget.Tooltip, m_oShadowTemplate, DEFAULT_CONFIG = {"PREVENT_OVERLAP": {key: "preventoverlap", value: true, validator: Lang.isBoolean, supercedes: ["x", "y", "xy"]}, "SHOW_DELAY": {key: "showdelay", value: 200, validator: Lang.isNumber}, "AUTO_DISMISS_DELAY": {key: "autodismissdelay", value: 5000, validator: Lang.isNumber}, "HIDE_DELAY": {key: "hidedelay", value: 250, validator: Lang.isNumber}, "TEXT": {key: "text", suppressEvent: true}, "CONTAINER": {key: "container"}};
    Tooltip.CSS_TOOLTIP = "yui-tt";
    function restoreOriginalWidth(p_sType, p_aArgs, p_oObject) {
        var sOriginalWidth = p_oObject[0], sNewWidth = p_oObject[1], oConfig = this.cfg, sCurrentWidth = oConfig.getProperty("width");
        if (sCurrentWidth == sNewWidth) {
            oConfig.setProperty("width", sOriginalWidth)
        }
        this.unsubscribe("hide", this._onHide, p_oObject)
    }
    function setWidthToOffsetWidth(p_sType, p_aArgs) {
        var oBody = document.body, oConfig = this.cfg, sOriginalWidth = oConfig.getProperty("width"), sNewWidth, oClone;
        if ((!sOriginalWidth || sOriginalWidth == "auto") && (oConfig.getProperty("container") != oBody || oConfig.getProperty("x") >= Dom.getViewportWidth() || oConfig.getProperty("y") >= Dom.getViewportHeight())) {
            oClone = this.element.cloneNode(true);
            oClone.style.visibility = "hidden";
            oClone.style.top = "0px";
            oClone.style.left = "0px";
            oBody.appendChild(oClone);
            sNewWidth = (oClone.offsetWidth + "px");
            oBody.removeChild(oClone);
            oClone = null;
            oConfig.setProperty("width", sNewWidth);
            oConfig.refireEvent("xy");
            this.subscribe("hide", restoreOriginalWidth, [(sOriginalWidth || ""), sNewWidth])
        }
    }
    function onDOMReady(p_sType, p_aArgs, p_oObject) {
        this.render(p_oObject)
    }
    function onInit() {
        Event.onDOMReady(onDOMReady, this.cfg.getProperty("container"), this)
    }
    FoxSaver.YUI.extend(Tooltip, FoxSaver.YUI.widget.Overlay, {init: function(el, userConfig) {
            Tooltip.superclass.init.call(this, el);
            this.beforeInitEvent.fire(Tooltip);
            Dom.addClass(this.element, Tooltip.CSS_TOOLTIP);
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            this.cfg.queueProperty("visible", false);
            this.cfg.queueProperty("constraintoviewport", true);
            this.setBody("");
            this.subscribe("beforeShow", setWidthToOffsetWidth);
            this.subscribe("init", onInit);
            this.subscribe("render", this.onRender);
            this.initEvent.fire(Tooltip)
        }, initDefaultConfig: function() {
            Tooltip.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty(DEFAULT_CONFIG.PREVENT_OVERLAP.key, {value: DEFAULT_CONFIG.PREVENT_OVERLAP.value, validator: DEFAULT_CONFIG.PREVENT_OVERLAP.validator, supercedes: DEFAULT_CONFIG.PREVENT_OVERLAP.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.SHOW_DELAY.key, {handler: this.configShowDelay, value: 200, validator: DEFAULT_CONFIG.SHOW_DELAY.validator});
            this.cfg.addProperty(DEFAULT_CONFIG.AUTO_DISMISS_DELAY.key, {handler: this.configAutoDismissDelay, value: DEFAULT_CONFIG.AUTO_DISMISS_DELAY.value, validator: DEFAULT_CONFIG.AUTO_DISMISS_DELAY.validator});
            this.cfg.addProperty(DEFAULT_CONFIG.HIDE_DELAY.key, {handler: this.configHideDelay, value: DEFAULT_CONFIG.HIDE_DELAY.value, validator: DEFAULT_CONFIG.HIDE_DELAY.validator});
            this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, {handler: this.configText, suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent});
            this.cfg.addProperty(DEFAULT_CONFIG.CONTAINER.key, {handler: this.configContainer, value: document.body})
        }, configText: function(type, args, obj) {
            var text = args[0];
            if (text) {
                this.setBody(text)
            }
        }, configContainer: function(type, args, obj) {
            var container = args[0];
            if (typeof container == "string") {
                this.cfg.setProperty("container", document.getElementById(container), true)
            }
        }, _removeEventListeners: function() {
            var aElements = this._context, nElements, oElement, i;
            if (aElements) {
                nElements = aElements.length;
                if (nElements > 0) {
                    i = nElements - 1;
                    do {
                        oElement = aElements[i];
                        Event.removeListener(oElement, "mouseover", this.onContextMouseOver);
                        Event.removeListener(oElement, "mousemove", this.onContextMouseMove);
                        Event.removeListener(oElement, "mouseout", this.onContextMouseOut)
                    } while (i--)
                }
            }
        }, configContext: function(type, args, obj) {
            var context = args[0], aElements, nElements, oElement, i;
            if (context) {
                if (!(context instanceof Array)) {
                    if (typeof context == "string") {
                        this.cfg.setProperty("context", [document.getElementById(context)], true)
                    } else {
                        this.cfg.setProperty("context", [context], true)
                    }
                    context = this.cfg.getProperty("context")
                }
                this._removeEventListeners();
                this._context = context;
                aElements = this._context;
                if (aElements) {
                    nElements = aElements.length;
                    if (nElements > 0) {
                        i = nElements - 1;
                        do {
                            oElement = aElements[i];
                            Event.on(oElement, "mouseover", this.onContextMouseOver, this);
                            Event.on(oElement, "mousemove", this.onContextMouseMove, this);
                            Event.on(oElement, "mouseout", this.onContextMouseOut, this)
                        } while (i--)
                    }
                }
            }
        }, onContextMouseMove: function(e, obj) {
            obj.pageX = Event.getPageX(e);
            obj.pageY = Event.getPageY(e)
        }, onContextMouseOver: function(e, obj) {
            var context = this;
            if (obj.hideProcId) {
                clearTimeout(obj.hideProcId);
                obj.hideProcId = null
            }
            Event.on(context, "mousemove", obj.onContextMouseMove, obj);
            if (context.title) {
                obj._tempTitle = context.title;
                context.title = ""
            }
            obj.showProcId = obj.doShow(e, context)
        }, onContextMouseOut: function(e, obj) {
            var el = this;
            if (obj._tempTitle) {
                el.title = obj._tempTitle;
                obj._tempTitle = null
            }
            if (obj.showProcId) {
                clearTimeout(obj.showProcId);
                obj.showProcId = null
            }
            if (obj.hideProcId) {
                clearTimeout(obj.hideProcId);
                obj.hideProcId = null
            }
            obj.hideProcId = setTimeout(function() {
                obj.hide()
            }, obj.cfg.getProperty("hidedelay"))
        }, doShow: function(e, context) {
            var yOffset = 25, me = this;
            if (FoxSaver.YUI.env.ua.opera && context.tagName && context.tagName.toUpperCase() == "A") {
                yOffset += 12
            }
            return setTimeout(function() {
                var txt = me.cfg.getProperty("text");
                if (me._tempTitle && (txt === "" || FoxSaver.YUI.lang.isUndefined(txt) || FoxSaver.YUI.lang.isNull(txt))) {
                    me.setBody(me._tempTitle)
                } else {
                    me.cfg.refireEvent("text")
                }
                me.moveTo(me.pageX, me.pageY + yOffset);
                if (me.cfg.getProperty("preventoverlap")) {
                    me.preventOverlap(me.pageX, me.pageY)
                }
                Event.removeListener(context, "mousemove", me.onContextMouseMove);
                me.show();
                me.hideProcId = me.doHide()
            }, this.cfg.getProperty("showdelay"))
        }, doHide: function() {
            var me = this;
            return setTimeout(function() {
                me.hide()
            }, this.cfg.getProperty("autodismissdelay"))
        }, preventOverlap: function(pageX, pageY) {
            var height = this.element.offsetHeight, mousePoint = new FoxSaver.YUI.util.Point(pageX, pageY), elementRegion = Dom.getRegion(this.element);
            elementRegion.top -= 5;
            elementRegion.left -= 5;
            elementRegion.right += 5;
            elementRegion.bottom += 5;
            if (elementRegion.contains(mousePoint)) {
                this.cfg.setProperty("y", (pageY - height - 5))
            }
        }, onRender: function(p_sType, p_aArgs) {
            function sizeShadow() {
                var oElement = this.element, oShadow = this._shadow;
                if (oShadow) {
                    oShadow.style.width = (oElement.offsetWidth + 6) + "px";
                    oShadow.style.height = (oElement.offsetHeight + 1) + "px"
                }
            }
            function addShadowVisibleClass() {
                Dom.addClass(this._shadow, "yui-tt-shadow-visible")
            }
            function removeShadowVisibleClass() {
                Dom.removeClass(this._shadow, "yui-tt-shadow-visible")
            }
            function createShadow() {
                var oShadow = this._shadow, oElement, Module, nIE, me;
                if (!oShadow) {
                    oElement = this.element;
                    Module = FoxSaver.YUI.widget.Module;
                    nIE = FoxSaver.YUI.env.ua.ie;
                    me = this;
                    if (!m_oShadowTemplate) {
                        m_oShadowTemplate = document.createElement("div");
                        m_oShadowTemplate.className = "yui-tt-shadow"
                    }
                    oShadow = m_oShadowTemplate.cloneNode(false);
                    oElement.appendChild(oShadow);
                    this._shadow = oShadow;
                    addShadowVisibleClass.call(this);
                    this.subscribe("beforeShow", addShadowVisibleClass);
                    this.subscribe("beforeHide", removeShadowVisibleClass);
                    if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {
                        window.setTimeout(function() {
                            sizeShadow.call(me)
                        }, 0);
                        this.cfg.subscribeToConfigEvent("width", sizeShadow);
                        this.cfg.subscribeToConfigEvent("height", sizeShadow);
                        this.subscribe("changeContent", sizeShadow);
                        Module.textResizeEvent.subscribe(sizeShadow, this, true);
                        this.subscribe("destroy", function() {
                            Module.textResizeEvent.unsubscribe(sizeShadow, this)
                        })
                    }
                }
            }
            function onBeforeShow() {
                createShadow.call(this);
                this.unsubscribe("beforeShow", onBeforeShow)
            }
            if (this.cfg.getProperty("visible")) {
                createShadow.call(this)
            } else {
                this.subscribe("beforeShow", onBeforeShow)
            }
        }, destroy: function() {
            this._removeEventListeners();
            Tooltip.superclass.destroy.call(this)
        }, toString: function() {
            return"Tooltip " + this.id
        }})
}());
(function() {
    FoxSaver.YUI.widget.Panel = function(el, userConfig) {
        FoxSaver.YUI.widget.Panel.superclass.constructor.call(this, el, userConfig)
    };
    var Lang = FoxSaver.YUI.lang, DD = FoxSaver.YUI.util.DD, Dom = FoxSaver.YUI.util.Dom, Event = FoxSaver.YUI.util.Event, Overlay = FoxSaver.YUI.widget.Overlay, CustomEvent = FoxSaver.YUI.util.CustomEvent, Config = FoxSaver.YUI.util.Config, Panel = FoxSaver.YUI.widget.Panel, m_oMaskTemplate, m_oUnderlayTemplate, m_oCloseIconTemplate, EVENT_TYPES = {"SHOW_MASK": "showMask", "HIDE_MASK": "hideMask", "DRAG": "drag"}, DEFAULT_CONFIG = {"CLOSE": {key: "close", value: true, validator: Lang.isBoolean, supercedes: ["visible"]}, "DRAGGABLE": {key: "draggable", value: (DD ? true : false), validator: Lang.isBoolean, supercedes: ["visible"]}, "DRAG_ONLY": {key: "dragonly", value: false, validator: Lang.isBoolean, supercedes: ["draggable"]}, "UNDERLAY": {key: "underlay", value: "shadow", supercedes: ["visible"]}, "MODAL": {key: "modal", value: false, validator: Lang.isBoolean, supercedes: ["visible", "zindex"]}, "KEY_LISTENERS": {key: "keylisteners", suppressEvent: true, supercedes: ["visible"]}};
    Panel.CSS_PANEL = "yui-panel";
    Panel.CSS_PANEL_CONTAINER = "yui-panel-container";
    function createHeader(p_sType, p_aArgs) {
        if (!this.header && this.cfg.getProperty("draggable")) {
            this.setHeader("&#160;")
        }
    }
    function restoreOriginalWidth(p_sType, p_aArgs, p_oObject) {
        var sOriginalWidth = p_oObject[0], sNewWidth = p_oObject[1], oConfig = this.cfg, sCurrentWidth = oConfig.getProperty("width");
        if (sCurrentWidth == sNewWidth) {
            oConfig.setProperty("width", sOriginalWidth)
        }
        this.unsubscribe("hide", restoreOriginalWidth, p_oObject)
    }
    function setWidthToOffsetWidth(p_sType, p_aArgs) {
        var nIE = FoxSaver.YUI.env.ua.ie, oConfig, sOriginalWidth, sNewWidth;
        if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {
            oConfig = this.cfg;
            sOriginalWidth = oConfig.getProperty("width");
            if (!sOriginalWidth || sOriginalWidth == "auto") {
                sNewWidth = (this.element.offsetWidth + "px");
                oConfig.setProperty("width", sNewWidth);
                this.subscribe("hide", restoreOriginalWidth, [(sOriginalWidth || ""), sNewWidth])
            }
        }
    }
    function onElementFocus() {
        this.blur()
    }
    function addFocusEventHandlers(p_sType, p_aArgs) {
        var me = this;
        function isFocusable(el) {
            var sTagName = el.tagName.toUpperCase(), bFocusable = false;
            switch (sTagName) {
                case"A":
                case"BUTTON":
                case"SELECT":
                case"TEXTAREA":
                    if (!Dom.isAncestor(me.element, el)) {
                        Event.on(el, "focus", onElementFocus, el, true);
                        bFocusable = true
                    }
                    break;
                case"INPUT":
                    if (el.type != "hidden" && !Dom.isAncestor(me.element, el)) {
                        Event.on(el, "focus", onElementFocus, el, true);
                        bFocusable = true
                    }
                    break
            }
            return bFocusable
        }
        this.focusableElements = Dom.getElementsBy(isFocusable)
    }
    function removeFocusEventHandlers(p_sType, p_aArgs) {
        var aElements = this.focusableElements, nElements = aElements.length, el2, i;
        for (i = 0; i < nElements; i++) {
            el2 = aElements[i];
            Event.removeListener(el2, "focus", onElementFocus)
        }
    }
    FoxSaver.YUI.extend(Panel, Overlay, {init: function(el, userConfig) {
            Panel.superclass.init.call(this, el);
            this.beforeInitEvent.fire(Panel);
            Dom.addClass(this.element, Panel.CSS_PANEL);
            this.buildWrapper();
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            this.subscribe("showMask", addFocusEventHandlers);
            this.subscribe("hideMask", removeFocusEventHandlers);
            this.subscribe("beforeRender", createHeader);
            this.initEvent.fire(Panel)
        }, initEvents: function() {
            Panel.superclass.initEvents.call(this);
            var SIGNATURE = CustomEvent.LIST;
            this.showMaskEvent = this.createEvent(EVENT_TYPES.SHOW_MASK);
            this.showMaskEvent.signature = SIGNATURE;
            this.hideMaskEvent = this.createEvent(EVENT_TYPES.HIDE_MASK);
            this.hideMaskEvent.signature = SIGNATURE;
            this.dragEvent = this.createEvent(EVENT_TYPES.DRAG);
            this.dragEvent.signature = SIGNATURE
        }, initDefaultConfig: function() {
            Panel.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty(DEFAULT_CONFIG.CLOSE.key, {handler: this.configClose, value: DEFAULT_CONFIG.CLOSE.value, validator: DEFAULT_CONFIG.CLOSE.validator, supercedes: DEFAULT_CONFIG.CLOSE.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.DRAGGABLE.key, {handler: this.configDraggable, value: DEFAULT_CONFIG.DRAGGABLE.value, validator: DEFAULT_CONFIG.DRAGGABLE.validator, supercedes: DEFAULT_CONFIG.DRAGGABLE.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.DRAG_ONLY.key, {value: DEFAULT_CONFIG.DRAG_ONLY.value, validator: DEFAULT_CONFIG.DRAG_ONLY.validator, supercedes: DEFAULT_CONFIG.DRAG_ONLY.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.UNDERLAY.key, {handler: this.configUnderlay, value: DEFAULT_CONFIG.UNDERLAY.value, supercedes: DEFAULT_CONFIG.UNDERLAY.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.MODAL.key, {handler: this.configModal, value: DEFAULT_CONFIG.MODAL.value, validator: DEFAULT_CONFIG.MODAL.validator, supercedes: DEFAULT_CONFIG.MODAL.supercedes});
            this.cfg.addProperty(DEFAULT_CONFIG.KEY_LISTENERS.key, {handler: this.configKeyListeners, suppressEvent: DEFAULT_CONFIG.KEY_LISTENERS.suppressEvent, supercedes: DEFAULT_CONFIG.KEY_LISTENERS.supercedes})
        }, configClose: function(type, args, obj) {
            var val = args[0], oClose = this.close;
            function doHide(e, obj) {
                obj.hide()
            }
            if (val) {
                if (!oClose) {
                    if (!m_oCloseIconTemplate) {
                        m_oCloseIconTemplate = document.createElement("span");
                        m_oCloseIconTemplate.innerHTML = "&#160;";
                        m_oCloseIconTemplate.className = "container-close"
                    }
                    oClose = m_oCloseIconTemplate.cloneNode(true);
                    this.innerElement.appendChild(oClose);
                    Event.on(oClose, "click", doHide, this);
                    this.close = oClose
                } else {
                    oClose.style.display = "block"
                }
            } else {
                if (oClose) {
                    oClose.style.display = "none"
                }
            }
        }, configDraggable: function(type, args, obj) {
            var val = args[0];
            if (val) {
                if (!DD) {
                    this.cfg.setProperty("draggable", false);
                    return
                }
                if (this.header) {
                    Dom.setStyle(this.header, "cursor", "move");
                    this.registerDragDrop()
                }
                this.subscribe("beforeShow", setWidthToOffsetWidth)
            } else {
                if (this.dd) {
                    this.dd.unreg()
                }
                if (this.header) {
                    Dom.setStyle(this.header, "cursor", "auto")
                }
                this.unsubscribe("beforeShow", setWidthToOffsetWidth)
            }
        }, configUnderlay: function(type, args, obj) {
            var UA = FoxSaver.YUI.env.ua, bMacGecko = (this.platform == "mac" && UA.gecko), sUnderlay = args[0].toLowerCase(), oUnderlay = this.underlay, oElement = this.element;
            function fixWebkitUnderlay() {
                var u = this.underlay;
                Dom.addClass(u, "yui-force-redraw");
                window.setTimeout(function() {
                    Dom.removeClass(u, "yui-force-redraw")
                }, 0)
            }
            function createUnderlay() {
                var nIE;
                if (!oUnderlay) {
                    if (!m_oUnderlayTemplate) {
                        m_oUnderlayTemplate = document.createElement("div");
                        m_oUnderlayTemplate.className = "underlay"
                    }
                    oUnderlay = m_oUnderlayTemplate.cloneNode(false);
                    this.element.appendChild(oUnderlay);
                    this.underlay = oUnderlay;
                    nIE = UA.ie;
                    if (nIE == 6 || (nIE == 7 && document.compatMode == "BackCompat")) {
                        this.sizeUnderlay();
                        this.cfg.subscribeToConfigEvent("width", this.sizeUnderlay);
                        this.cfg.subscribeToConfigEvent("height", this.sizeUnderlay);
                        this.changeContentEvent.subscribe(this.sizeUnderlay);
                        FoxSaver.YUI.widget.Module.textResizeEvent.subscribe(this.sizeUnderlay, this, true)
                    }
                    if (UA.webkit && UA.webkit < 420) {
                        this.changeContentEvent.subscribe(fixWebkitUnderlay)
                    }
                }
            }
            function onBeforeShow() {
                createUnderlay.call(this);
                this._underlayDeferred = false;
                this.beforeShowEvent.unsubscribe(onBeforeShow)
            }
            function destroyUnderlay() {
                if (this._underlayDeferred) {
                    this.beforeShowEvent.unsubscribe(onBeforeShow);
                    this._underlayDeferred = false
                }
                if (oUnderlay) {
                    this.cfg.unsubscribeFromConfigEvent("width", this.sizeUnderlay);
                    this.cfg.unsubscribeFromConfigEvent("height", this.sizeUnderlay);
                    this.changeContentEvent.unsubscribe(this.sizeUnderlay);
                    this.changeContentEvent.unsubscribe(fixWebkitUnderlay);
                    FoxSaver.YUI.widget.Module.textResizeEvent.unsubscribe(this.sizeUnderlay, this, true);
                    this.element.removeChild(oUnderlay);
                    this.underlay = null
                }
            }
            switch (sUnderlay) {
                case"shadow":
                    Dom.removeClass(oElement, "matte");
                    Dom.addClass(oElement, "shadow");
                    break;
                case"matte":
                    if (!bMacGecko) {
                        destroyUnderlay.call(this)
                    }
                    Dom.removeClass(oElement, "shadow");
                    Dom.addClass(oElement, "matte");
                    break;
                default:
                    if (!bMacGecko) {
                        destroyUnderlay.call(this)
                    }
                    Dom.removeClass(oElement, "shadow");
                    Dom.removeClass(oElement, "matte");
                    break
            }
            if ((sUnderlay == "shadow") || (bMacGecko && !oUnderlay)) {
                if (this.cfg.getProperty("visible")) {
                    createUnderlay.call(this)
                } else {
                    if (!this._underlayDeferred) {
                        this.beforeShowEvent.subscribe(onBeforeShow);
                        this._underlayDeferred = true
                    }
                }
            }
        }, configModal: function(type, args, obj) {
            var modal = args[0];
            if (modal) {
                if (!this._hasModalityEventListeners) {
                    this.subscribe("beforeShow", this.buildMask);
                    this.subscribe("beforeShow", this.bringToTop);
                    this.subscribe("beforeShow", this.showMask);
                    this.subscribe("hide", this.hideMask);
                    Overlay.windowResizeEvent.subscribe(this.sizeMask, this, true);
                    this._hasModalityEventListeners = true
                }
            } else {
                if (this._hasModalityEventListeners) {
                    if (this.cfg.getProperty("visible")) {
                        this.hideMask();
                        this.removeMask()
                    }
                    this.unsubscribe("beforeShow", this.buildMask);
                    this.unsubscribe("beforeShow", this.bringToTop);
                    this.unsubscribe("beforeShow", this.showMask);
                    this.unsubscribe("hide", this.hideMask);
                    Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
                    this._hasModalityEventListeners = false
                }
            }
        }, removeMask: function() {
            var oMask = this.mask, oParentNode;
            if (oMask) {
                this.hideMask();
                oParentNode = oMask.parentNode;
                if (oParentNode) {
                    oParentNode.removeChild(oMask)
                }
                this.mask = null
            }
        }, configKeyListeners: function(type, args, obj) {
            var listeners = args[0], listener, nListeners, i;
            if (listeners) {
                if (listeners instanceof Array) {
                    nListeners = listeners.length;
                    for (i = 0; i < nListeners; i++) {
                        listener = listeners[i];
                        if (!Config.alreadySubscribed(this.showEvent, listener.enable, listener)) {
                            this.showEvent.subscribe(listener.enable, listener, true)
                        }
                        if (!Config.alreadySubscribed(this.hideEvent, listener.disable, listener)) {
                            this.hideEvent.subscribe(listener.disable, listener, true);
                            this.destroyEvent.subscribe(listener.disable, listener, true)
                        }
                    }
                } else {
                    if (!Config.alreadySubscribed(this.showEvent, listeners.enable, listeners)) {
                        this.showEvent.subscribe(listeners.enable, listeners, true)
                    }
                    if (!Config.alreadySubscribed(this.hideEvent, listeners.disable, listeners)) {
                        this.hideEvent.subscribe(listeners.disable, listeners, true);
                        this.destroyEvent.subscribe(listeners.disable, listeners, true)
                    }
                }
            }
        }, configHeight: function(type, args, obj) {
            var height = args[0], el = this.innerElement;
            Dom.setStyle(el, "height", height);
            this.cfg.refireEvent("iframe")
        }, configWidth: function(type, args, obj) {
            var width = args[0], el = this.innerElement;
            Dom.setStyle(el, "width", width);
            this.cfg.refireEvent("iframe")
        }, configzIndex: function(type, args, obj) {
            Panel.superclass.configzIndex.call(this, type, args, obj);
            if (this.mask || this.cfg.getProperty("modal") === true) {
                var panelZ = Dom.getStyle(this.element, "zIndex");
                if (!panelZ || isNaN(panelZ)) {
                    panelZ = 0
                }
                if (panelZ === 0) {
                    this.cfg.setProperty("zIndex", 1)
                } else {
                    this.stackMask()
                }
            }
        }, buildWrapper: function() {
            var elementParent = this.element.parentNode, originalElement = this.element, wrapper = document.createElement("div");
            wrapper.className = Panel.CSS_PANEL_CONTAINER;
            wrapper.id = originalElement.id + "_c";
            if (elementParent) {
                elementParent.insertBefore(wrapper, originalElement)
            }
            wrapper.appendChild(originalElement);
            this.element = wrapper;
            this.innerElement = originalElement;
            Dom.setStyle(this.innerElement, "visibility", "inherit")
        }, sizeUnderlay: function() {
            var oUnderlay = this.underlay, oElement;
            if (oUnderlay) {
                oElement = this.element;
                oUnderlay.style.width = oElement.offsetWidth + "px";
                oUnderlay.style.height = oElement.offsetHeight + "px"
            }
        }, registerDragDrop: function() {
            var me = this;
            if (this.header) {
                if (!DD) {
                    return
                }
                var bDragOnly = (this.cfg.getProperty("dragonly") === true);
                this.dd = new DD(this.element.id, this.id, {dragOnly: bDragOnly});
                if (!this.header.id) {
                    this.header.id = this.id + "_h"
                }
                this.dd.startDrag = function() {
                    var offsetHeight, offsetWidth, viewPortWidth, viewPortHeight, scrollX, scrollY;
                    if (FoxSaver.YUI.env.ua.ie == 6) {
                        Dom.addClass(me.element, "drag")
                    }
                    if (me.cfg.getProperty("constraintoviewport")) {
                        var nViewportOffset = Overlay.VIEWPORT_OFFSET;
                        offsetHeight = me.element.offsetHeight;
                        offsetWidth = me.element.offsetWidth;
                        viewPortWidth = Dom.getViewportWidth();
                        viewPortHeight = Dom.getViewportHeight();
                        scrollX = Dom.getDocumentScrollLeft();
                        scrollY = Dom.getDocumentScrollTop();
                        if (offsetHeight + nViewportOffset < viewPortHeight) {
                            this.minY = scrollY + nViewportOffset;
                            this.maxY = scrollY + viewPortHeight - offsetHeight - nViewportOffset
                        } else {
                            this.minY = scrollY + nViewportOffset;
                            this.maxY = scrollY + nViewportOffset
                        }
                        if (offsetWidth + nViewportOffset < viewPortWidth) {
                            this.minX = scrollX + nViewportOffset;
                            this.maxX = scrollX + viewPortWidth - offsetWidth - nViewportOffset
                        } else {
                            this.minX = scrollX + nViewportOffset;
                            this.maxX = scrollX + nViewportOffset
                        }
                        this.constrainX = true;
                        this.constrainY = true
                    } else {
                        this.constrainX = false;
                        this.constrainY = false
                    }
                    me.dragEvent.fire("startDrag", arguments)
                };
                this.dd.onDrag = function() {
                    me.syncPosition();
                    me.cfg.refireEvent("iframe");
                    if (this.platform == "mac" && FoxSaver.YUI.env.ua.gecko) {
                        this.showMacGeckoScrollbars()
                    }
                    me.dragEvent.fire("onDrag", arguments)
                };
                this.dd.endDrag = function() {
                    if (FoxSaver.YUI.env.ua.ie == 6) {
                        Dom.removeClass(me.element, "drag")
                    }
                    me.dragEvent.fire("endDrag", arguments);
                    me.moveEvent.fire(me.cfg.getProperty("xy"))
                };
                this.dd.setHandleElId(this.header.id);
                this.dd.addInvalidHandleType("INPUT");
                this.dd.addInvalidHandleType("SELECT");
                this.dd.addInvalidHandleType("TEXTAREA")
            }
        }, buildMask: function() {
            var oMask = this.mask;
            if (!oMask) {
                if (!m_oMaskTemplate) {
                    m_oMaskTemplate = document.createElement("div");
                    m_oMaskTemplate.className = "mask";
                    m_oMaskTemplate.innerHTML = "&#160;"
                }
                oMask = m_oMaskTemplate.cloneNode(true);
                oMask.id = this.id + "_mask";
                document.body.insertBefore(oMask, document.body.firstChild);
                this.mask = oMask;
                this.stackMask()
            }
        }, hideMask: function() {
            if (this.cfg.getProperty("modal") && this.mask) {
                this.mask.style.display = "none";
                this.hideMaskEvent.fire();
                Dom.removeClass(document.body, "masked")
            }
        }, showMask: function() {
            if (this.cfg.getProperty("modal") && this.mask) {
                Dom.addClass(document.body, "masked");
                this.sizeMask();
                this.mask.style.display = "block";
                this.showMaskEvent.fire()
            }
        }, sizeMask: function() {
            if (this.mask) {
                this.mask.style.height = Dom.getDocumentHeight() + "px";
                this.mask.style.width = Dom.getDocumentWidth() + "px"
            }
        }, stackMask: function() {
            if (this.mask) {
                var panelZ = Dom.getStyle(this.element, "zIndex");
                if (!FoxSaver.YUI.lang.isUndefined(panelZ) && !isNaN(panelZ)) {
                    Dom.setStyle(this.mask, "zIndex", panelZ - 1)
                }
            }
        }, render: function(appendToNode) {
            return Panel.superclass.render.call(this, appendToNode, this.innerElement)
        }, destroy: function() {
            Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
            this.removeMask();
            if (this.close) {
                Event.purgeElement(this.close)
            }
            Panel.superclass.destroy.call(this)
        }, toString: function() {
            return"Panel " + this.id
        }})
}());
(function() {
    FoxSaver.YUI.widget.Dialog = function(el, userConfig) {
        FoxSaver.YUI.widget.Dialog.superclass.constructor.call(this, el, userConfig)
    };
    var Event = FoxSaver.YUI.util.Event, CustomEvent = FoxSaver.YUI.util.CustomEvent, Dom = FoxSaver.YUI.util.Dom, KeyListener = FoxSaver.YUI.util.KeyListener, Connect = FoxSaver.YUI.util.Connect, Dialog = FoxSaver.YUI.widget.Dialog, Lang = FoxSaver.YUI.lang, EVENT_TYPES = {"BEFORE_SUBMIT": "beforeSubmit", "SUBMIT": "submit", "MANUAL_SUBMIT": "manualSubmit", "ASYNC_SUBMIT": "asyncSubmit", "FORM_SUBMIT": "formSubmit", "CANCEL": "cancel"}, DEFAULT_CONFIG = {"POST_METHOD": {key: "postmethod", value: "async"}, "BUTTONS": {key: "buttons", value: "none"}};
    Dialog.CSS_DIALOG = "yui-dialog";
    function removeButtonEventHandlers() {
        var aButtons = this._aButtons, nButtons, oButton, i;
        if (Lang.isArray(aButtons)) {
            nButtons = aButtons.length;
            if (nButtons > 0) {
                i = nButtons - 1;
                do {
                    oButton = aButtons[i];
                    if (FoxSaver.YUI.widget.Button && oButton instanceof FoxSaver.YUI.widget.Button) {
                        oButton.destroy()
                    } else {
                        if (oButton.tagName.toUpperCase() == "BUTTON") {
                            Event.purgeElement(oButton);
                            Event.purgeElement(oButton, false)
                        }
                    }
                } while (i--)
            }
        }
    }
    FoxSaver.YUI.extend(Dialog, FoxSaver.YUI.widget.Panel, {form: null, initDefaultConfig: function() {
            Dialog.superclass.initDefaultConfig.call(this);
            this.callback = {success: null, failure: null, argument: null};
            this.cfg.addProperty(DEFAULT_CONFIG.POST_METHOD.key, {handler: this.configPostMethod, value: DEFAULT_CONFIG.POST_METHOD.value, validator: function(val) {
                    if (val != "form" && val != "async" && val != "none" && val != "manual") {
                        return false
                    } else {
                        return true
                    }
                }});
            this.cfg.addProperty(DEFAULT_CONFIG.BUTTONS.key, {handler: this.configButtons, value: DEFAULT_CONFIG.BUTTONS.value})
        }, initEvents: function() {
            Dialog.superclass.initEvents.call(this);
            var SIGNATURE = CustomEvent.LIST;
            this.beforeSubmitEvent = this.createEvent(EVENT_TYPES.BEFORE_SUBMIT);
            this.beforeSubmitEvent.signature = SIGNATURE;
            this.submitEvent = this.createEvent(EVENT_TYPES.SUBMIT);
            this.submitEvent.signature = SIGNATURE;
            this.manualSubmitEvent = this.createEvent(EVENT_TYPES.MANUAL_SUBMIT);
            this.manualSubmitEvent.signature = SIGNATURE;
            this.asyncSubmitEvent = this.createEvent(EVENT_TYPES.ASYNC_SUBMIT);
            this.asyncSubmitEvent.signature = SIGNATURE;
            this.formSubmitEvent = this.createEvent(EVENT_TYPES.FORM_SUBMIT);
            this.formSubmitEvent.signature = SIGNATURE;
            this.cancelEvent = this.createEvent(EVENT_TYPES.CANCEL);
            this.cancelEvent.signature = SIGNATURE
        }, init: function(el, userConfig) {
            Dialog.superclass.init.call(this, el);
            this.beforeInitEvent.fire(Dialog);
            Dom.addClass(this.element, Dialog.CSS_DIALOG);
            this.cfg.setProperty("visible", false);
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            this.showEvent.subscribe(this.focusFirst, this, true);
            this.beforeHideEvent.subscribe(this.blurButtons, this, true);
            this.subscribe("changeBody", this.registerForm);
            this.initEvent.fire(Dialog)
        }, doSubmit: function() {
            var oForm = this.form, bUseFileUpload = false, bUseSecureFileUpload = false, aElements, nElements, i, sMethod;
            switch (this.cfg.getProperty("postmethod")) {
                case"async":
                    aElements = oForm.elements;
                    nElements = aElements.length;
                    if (nElements > 0) {
                        i = nElements - 1;
                        do {
                            if (aElements[i].type == "file") {
                                bUseFileUpload = true;
                                break
                            }
                        } while (i--)
                    }
                    if (bUseFileUpload && FoxSaver.YUI.env.ua.ie && this.isSecure) {
                        bUseSecureFileUpload = true
                    }
                    sMethod = (oForm.getAttribute("method") || "POST").toUpperCase();
                    Connect.setForm(oForm, bUseFileUpload, bUseSecureFileUpload);
                    Connect.asyncRequest(sMethod, oForm.getAttribute("action"), this.callback);
                    this.asyncSubmitEvent.fire();
                    break;
                case"form":
                    oForm.submit();
                    this.formSubmitEvent.fire();
                    break;
                case"none":
                case"manual":
                    this.manualSubmitEvent.fire();
                    break
                }
        }, registerForm: function() {
            var form = this.element.getElementsByTagName("form")[0], me = this, firstElement, lastElement;
            if (this.form) {
                if (this.form == form && Dom.isAncestor(this.element, this.form)) {
                    return
                } else {
                    Event.purgeElement(this.form);
                    this.form = null
                }
            }
            if (!form) {
                form = document.createElement("form");
                form.name = "frm_" + this.id;
                this.body.appendChild(form)
            }
            if (form) {
                this.form = form;
                Event.on(form, "submit", function(e) {
                    Event.stopEvent(e);
                    this.submit();
                    this.form.blur()
                }, this, true);
                this.firstFormElement = function() {
                    var f, el, nElements = form.elements.length;
                    for (f = 0; f < nElements; f++) {
                        el = form.elements[f];
                        if (el.focus && !el.disabled && el.type != "hidden") {
                            return el
                        }
                    }
                    return null
                }();
                this.lastFormElement = function() {
                    var f, el, nElements = form.elements.length;
                    for (f = nElements - 1; f >= 0; f--) {
                        el = form.elements[f];
                        if (el.focus && !el.disabled && el.type != "hidden") {
                            return el
                        }
                    }
                    return null
                }();
                if (this.cfg.getProperty("modal")) {
                    firstElement = this.firstFormElement || this.firstButton;
                    if (firstElement) {
                        this.preventBackTab = new KeyListener(firstElement, {shift: true, keys: 9}, {fn: me.focusLast, scope: me, correctScope: true});
                        this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
                        this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true)
                    }
                    lastElement = this.lastButton || this.lastFormElement;
                    if (lastElement) {
                        this.preventTabOut = new KeyListener(lastElement, {shift: false, keys: 9}, {fn: me.focusFirst, scope: me, correctScope: true});
                        this.showEvent.subscribe(this.preventTabOut.enable, this.preventTabOut, true);
                        this.hideEvent.subscribe(this.preventTabOut.disable, this.preventTabOut, true)
                    }
                }
            }
        }, configClose: function(type, args, obj) {
            var val = args[0];
            function doCancel(e, obj) {
                obj.cancel()
            }
            if (val) {
                if (!this.close) {
                    this.close = document.createElement("div");
                    Dom.addClass(this.close, "container-close");
                    this.close.innerHTML = "&#160;";
                    this.innerElement.appendChild(this.close);
                    Event.on(this.close, "click", doCancel, this)
                } else {
                    this.close.style.display = "block"
                }
            } else {
                if (this.close) {
                    this.close.style.display = "none"
                }
            }
        }, configButtons: function(type, args, obj) {
            var Button = FoxSaver.YUI.widget.Button, aButtons = args[0], oInnerElement = this.innerElement, oButton, oButtonEl, oYUIButton, nButtons, oSpan, oFooter, i;
            removeButtonEventHandlers.call(this);
            this._aButtons = null;
            if (Lang.isArray(aButtons)) {
                oSpan = document.createElement("span");
                oSpan.className = "button-group";
                nButtons = aButtons.length;
                this._aButtons = [];
                for (i = 0; i < nButtons; i++) {
                    oButton = aButtons[i];
                    if (Button) {
                        oYUIButton = new Button({label: oButton.text, container: oSpan});
                        oButtonEl = oYUIButton.get("element");
                        if (oButton.isDefault) {
                            oYUIButton.addClass("default");
                            this.defaultHtmlButton = oButtonEl
                        }
                        if (Lang.isFunction(oButton.handler)) {
                            oYUIButton.set("onclick", {fn: oButton.handler, obj: this, scope: this})
                        } else {
                            if (Lang.isObject(oButton.handler) && Lang.isFunction(oButton.handler.fn)) {
                                oYUIButton.set("onclick", {fn: oButton.handler.fn, obj: ((!Lang.isUndefined(oButton.handler.obj)) ? oButton.handler.obj : this), scope: (oButton.handler.scope || this)})
                            }
                        }
                        this._aButtons[this._aButtons.length] = oYUIButton
                    } else {
                        oButtonEl = document.createElement("button");
                        oButtonEl.setAttribute("type", "button");
                        if (oButton.isDefault) {
                            oButtonEl.className = "default";
                            this.defaultHtmlButton = oButtonEl
                        }
                        oButtonEl.innerHTML = oButton.text;
                        if (Lang.isFunction(oButton.handler)) {
                            Event.on(oButtonEl, "click", oButton.handler, this, true)
                        } else {
                            if (Lang.isObject(oButton.handler) && Lang.isFunction(oButton.handler.fn)) {
                                Event.on(oButtonEl, "click", oButton.handler.fn, ((!Lang.isUndefined(oButton.handler.obj)) ? oButton.handler.obj : this), (oButton.handler.scope || this))
                            }
                        }
                        oSpan.appendChild(oButtonEl);
                        this._aButtons[this._aButtons.length] = oButtonEl
                    }
                    oButton.htmlButton = oButtonEl;
                    if (i === 0) {
                        this.firstButton = oButtonEl
                    }
                    if (i == (nButtons - 1)) {
                        this.lastButton = oButtonEl
                    }
                }
                this.setFooter(oSpan);
                oFooter = this.footer;
                if (Dom.inDocument(this.element) && !Dom.isAncestor(oInnerElement, oFooter)) {
                    oInnerElement.appendChild(oFooter)
                }
                this.buttonSpan = oSpan
            } else {
                oSpan = this.buttonSpan;
                oFooter = this.footer;
                if (oSpan && oFooter) {
                    oFooter.removeChild(oSpan);
                    this.buttonSpan = null;
                    this.firstButton = null;
                    this.lastButton = null;
                    this.defaultHtmlButton = null
                }
            }
            this.cfg.refireEvent("iframe");
            this.cfg.refireEvent("underlay")
        }, getButtons: function() {
            var aButtons = this._aButtons;
            if (aButtons) {
                return aButtons
            }
        }, focusFirst: function(type, args, obj) {
            var oElement = this.firstFormElement, oEvent;
            if (args) {
                oEvent = args[1];
                if (oEvent) {
                    Event.stopEvent(oEvent)
                }
            }
            if (oElement) {
                try {
                    oElement.focus()
                } catch (oException) {
                }
            } else {
                this.focusDefaultButton()
            }
        }, focusLast: function(type, args, obj) {
            var aButtons = this.cfg.getProperty("buttons"), oElement = this.lastFormElement, oEvent;
            if (args) {
                oEvent = args[1];
                if (oEvent) {
                    Event.stopEvent(oEvent)
                }
            }
            if (aButtons && Lang.isArray(aButtons)) {
                this.focusLastButton()
            } else {
                if (oElement) {
                    try {
                        oElement.focus()
                    } catch (oException) {
                    }
                }
            }
        }, focusDefaultButton: function() {
            var oElement = this.defaultHtmlButton;
            if (oElement) {
                try {
                    oElement.focus()
                } catch (oException) {
                }
            }
        }, blurButtons: function() {
            var aButtons = this.cfg.getProperty("buttons"), nButtons, oButton, oElement, i;
            if (aButtons && Lang.isArray(aButtons)) {
                nButtons = aButtons.length;
                if (nButtons > 0) {
                    i = (nButtons - 1);
                    do {
                        oButton = aButtons[i];
                        if (oButton) {
                            oElement = oButton.htmlButton;
                            if (oElement) {
                                try {
                                    oElement.blur()
                                } catch (oException) {
                                }
                            }
                        }
                    } while (i--)
                }
            }
        }, focusFirstButton: function() {
            var aButtons = this.cfg.getProperty("buttons"), oButton, oElement;
            if (aButtons && Lang.isArray(aButtons)) {
                oButton = aButtons[0];
                if (oButton) {
                    oElement = oButton.htmlButton;
                    if (oElement) {
                        try {
                            oElement.focus()
                        } catch (oException) {
                        }
                    }
                }
            }
        }, focusLastButton: function() {
            var aButtons = this.cfg.getProperty("buttons"), nButtons, oButton, oElement;
            if (aButtons && Lang.isArray(aButtons)) {
                nButtons = aButtons.length;
                if (nButtons > 0) {
                    oButton = aButtons[(nButtons - 1)];
                    if (oButton) {
                        oElement = oButton.htmlButton;
                        if (oElement) {
                            try {
                                oElement.focus()
                            } catch (oException) {
                            }
                        }
                    }
                }
            }
        }, configPostMethod: function(type, args, obj) {
            this.registerForm()
        }, validate: function() {
            return true
        }, submit: function() {
            if (this.validate()) {
                this.beforeSubmitEvent.fire();
                this.doSubmit();
                this.submitEvent.fire();
                this.hide();
                return true
            } else {
                return false
            }
        }, cancel: function() {
            this.cancelEvent.fire();
            this.hide()
        }, getData: function() {
            var oForm = this.form, aElements, nTotalElements, oData, sName, oElement, nElements, sType, sTagName, aOptions, nOptions, aValues, oOption, sValue, oRadio, oCheckbox, i, n;
            function isFormElement(p_oElement) {
                var sTag = p_oElement.tagName.toUpperCase();
                return((sTag == "INPUT" || sTag == "TEXTAREA" || sTag == "SELECT") && p_oElement.name == sName)
            }
            if (oForm) {
                aElements = oForm.elements;
                nTotalElements = aElements.length;
                oData = {};
                for (i = 0; i < nTotalElements; i++) {
                    sName = aElements[i].name;
                    oElement = Dom.getElementsBy(isFormElement, "*", oForm);
                    nElements = oElement.length;
                    if (nElements > 0) {
                        if (nElements == 1) {
                            oElement = oElement[0];
                            sType = oElement.type;
                            sTagName = oElement.tagName.toUpperCase();
                            switch (sTagName) {
                                case"INPUT":
                                    if (sType == "checkbox") {
                                        oData[sName] = oElement.checked
                                    } else {
                                        if (sType != "radio") {
                                            oData[sName] = oElement.value
                                        }
                                    }
                                    break;
                                case"TEXTAREA":
                                    oData[sName] = oElement.value;
                                    break;
                                case"SELECT":
                                    aOptions = oElement.options;
                                    nOptions = aOptions.length;
                                    aValues = [];
                                    for (n = 0; n < nOptions; n++) {
                                        oOption = aOptions[n];
                                        if (oOption.selected) {
                                            sValue = oOption.value;
                                            if (!sValue || sValue === "") {
                                                sValue = oOption.text
                                            }
                                            aValues[aValues.length] = sValue
                                        }
                                    }
                                    oData[sName] = aValues;
                                    break
                                }
                        } else {
                            sType = oElement[0].type;
                            switch (sType) {
                                case"radio":
                                    for (n = 0; n < nElements; n++) {
                                        oRadio = oElement[n];
                                        if (oRadio.checked) {
                                            oData[sName] = oRadio.value;
                                            break
                                        }
                                    }
                                    break;
                                case"checkbox":
                                    aValues = [];
                                    for (n = 0; n < nElements; n++) {
                                        oCheckbox = oElement[n];
                                        if (oCheckbox.checked) {
                                            aValues[aValues.length] = oCheckbox.value
                                        }
                                    }
                                    oData[sName] = aValues;
                                    break
                                }
                        }
                    }
                }
            }
            return oData
        }, destroy: function() {
            removeButtonEventHandlers.call(this);
            this._aButtons = null;
            var aForms = this.element.getElementsByTagName("form"), oForm;
            if (aForms.length > 0) {
                oForm = aForms[0];
                if (oForm) {
                    Event.purgeElement(oForm);
                    if (oForm.parentNode) {
                        oForm.parentNode.removeChild(oForm)
                    }
                    this.form = null
                }
            }
            Dialog.superclass.destroy.call(this)
        }, toString: function() {
            return"Dialog " + this.id
        }})
}());
(function() {
    FoxSaver.YUI.widget.SimpleDialog = function(el, userConfig) {
        FoxSaver.YUI.widget.SimpleDialog.superclass.constructor.call(this, el, userConfig)
    };
    var Dom = FoxSaver.YUI.util.Dom, SimpleDialog = FoxSaver.YUI.widget.SimpleDialog, DEFAULT_CONFIG = {"ICON": {key: "icon", value: "none", suppressEvent: true}, "TEXT": {key: "text", value: "", suppressEvent: true, supercedes: ["icon"]}};
    SimpleDialog.ICON_BLOCK = "blckicon";
    SimpleDialog.ICON_ALARM = "alrticon";
    SimpleDialog.ICON_HELP = "hlpicon";
    SimpleDialog.ICON_INFO = "infoicon";
    SimpleDialog.ICON_WARN = "warnicon";
    SimpleDialog.ICON_TIP = "tipicon";
    SimpleDialog.ICON_CSS_CLASSNAME = "yui-icon";
    SimpleDialog.CSS_SIMPLEDIALOG = "yui-simple-dialog";
    FoxSaver.YUI.extend(SimpleDialog, FoxSaver.YUI.widget.Dialog, {initDefaultConfig: function() {
            SimpleDialog.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty(DEFAULT_CONFIG.ICON.key, {handler: this.configIcon, value: DEFAULT_CONFIG.ICON.value, suppressEvent: DEFAULT_CONFIG.ICON.suppressEvent});
            this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, {handler: this.configText, value: DEFAULT_CONFIG.TEXT.value, suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent, supercedes: DEFAULT_CONFIG.TEXT.supercedes})
        }, init: function(el, userConfig) {
            SimpleDialog.superclass.init.call(this, el);
            this.beforeInitEvent.fire(SimpleDialog);
            Dom.addClass(this.element, SimpleDialog.CSS_SIMPLEDIALOG);
            this.cfg.queueProperty("postmethod", "manual");
            if (userConfig) {
                this.cfg.applyConfig(userConfig, true)
            }
            this.beforeRenderEvent.subscribe(function() {
                if (!this.body) {
                    this.setBody("")
                }
            }, this, true);
            this.initEvent.fire(SimpleDialog)
        }, registerForm: function() {
            SimpleDialog.superclass.registerForm.call(this);
            this.form.innerHTML += '<input type="hidden" name="' + this.id + '" value=""/>'
        }, configIcon: function(type, args, obj) {
            var sIcon = args[0], oBody = this.body, sCSSClass = SimpleDialog.ICON_CSS_CLASSNAME, oIcon, oIconParent;
            if (sIcon && sIcon != "none") {
                oIcon = Dom.getElementsByClassName(sCSSClass, "*", oBody);
                if (oIcon) {
                    oIconParent = oIcon.parentNode;
                    if (oIconParent) {
                        oIconParent.removeChild(oIcon);
                        oIcon = null
                    }
                }
                if (sIcon.indexOf(".") == -1) {
                    oIcon = document.createElement("span");
                    oIcon.className = (sCSSClass + " " + sIcon);
                    oIcon.innerHTML = "&#160;"
                } else {
                    oIcon = document.createElement("img");
                    oIcon.src = (this.imageRoot + sIcon);
                    oIcon.className = sCSSClass
                }
                if (oIcon) {
                    oBody.insertBefore(oIcon, oBody.firstChild)
                }
            }
        }, configText: function(type, args, obj) {
            var text = args[0];
            if (text) {
                this.setBody(text);
                this.cfg.refireEvent("icon")
            }
        }, toString: function() {
            return"SimpleDialog " + this.id
        }})
}());
(function() {
    FoxSaver.YUI.widget.ContainerEffect = function(overlay, attrIn, attrOut, targetElement, animClass) {
        if (!animClass) {
            animClass = FoxSaver.YUI.util.Anim
        }
        this.overlay = overlay;
        this.attrIn = attrIn;
        this.attrOut = attrOut;
        this.targetElement = targetElement || overlay.element;
        this.animClass = animClass
    };
    var Dom = FoxSaver.YUI.util.Dom, CustomEvent = FoxSaver.YUI.util.CustomEvent, Easing = FoxSaver.YUI.util.Easing, ContainerEffect = FoxSaver.YUI.widget.ContainerEffect;
    ContainerEffect.FADE = function(overlay, dur) {
        var fin = {attributes: {opacity: {from: 0, to: 1}}, duration: dur, method: Easing.easeIn};
        var fout = {attributes: {opacity: {to: 0}}, duration: dur, method: Easing.easeOut};
        var fade = new ContainerEffect(overlay, fin, fout, overlay.element);
        fade.handleUnderlayStart = function() {
            var underlay = this.overlay.underlay;
            if (underlay && FoxSaver.YUI.env.ua.ie) {
                var hasFilters = (underlay.filters && underlay.filters.length > 0);
                if (hasFilters) {
                    Dom.addClass(overlay.element, "yui-effect-fade")
                }
            }
        };
        fade.handleUnderlayComplete = function() {
            var underlay = this.overlay.underlay;
            if (underlay && FoxSaver.YUI.env.ua.ie) {
                Dom.removeClass(overlay.element, "yui-effect-fade")
            }
        };
        fade.handleStartAnimateIn = function(type, args, obj) {
            Dom.addClass(obj.overlay.element, "hide-select");
            if (!obj.overlay.underlay) {
                obj.overlay.cfg.refireEvent("underlay")
            }
            obj.handleUnderlayStart();
            Dom.setStyle(obj.overlay.element, "visibility", "visible");
            Dom.setStyle(obj.overlay.element, "opacity", 0)
        };
        fade.handleCompleteAnimateIn = function(type, args, obj) {
            Dom.removeClass(obj.overlay.element, "hide-select");
            if (obj.overlay.element.style.filter) {
                obj.overlay.element.style.filter = null
            }
            obj.handleUnderlayComplete();
            obj.overlay.cfg.refireEvent("iframe");
            obj.animateInCompleteEvent.fire()
        };
        fade.handleStartAnimateOut = function(type, args, obj) {
            Dom.addClass(obj.overlay.element, "hide-select");
            obj.handleUnderlayStart()
        };
        fade.handleCompleteAnimateOut = function(type, args, obj) {
            Dom.removeClass(obj.overlay.element, "hide-select");
            if (obj.overlay.element.style.filter) {
                obj.overlay.element.style.filter = null
            }
            Dom.setStyle(obj.overlay.element, "visibility", "hidden");
            Dom.setStyle(obj.overlay.element, "opacity", 1);
            obj.handleUnderlayComplete();
            obj.overlay.cfg.refireEvent("iframe");
            obj.animateOutCompleteEvent.fire()
        };
        fade.init();
        return fade
    };
    ContainerEffect.SLIDE = function(overlay, dur) {
        var x = overlay.cfg.getProperty("x") || Dom.getX(overlay.element), y = overlay.cfg.getProperty("y") || Dom.getY(overlay.element), clientWidth = Dom.getClientWidth(), offsetWidth = overlay.element.offsetWidth, slide = new ContainerEffect(overlay, {attributes: {points: {to: [x, y]}}, duration: dur, method: Easing.easeIn}, {attributes: {points: {to: [(clientWidth + 25), y]}}, duration: dur, method: Easing.easeOut}, overlay.element, FoxSaver.YUI.util.Motion);
        slide.handleStartAnimateIn = function(type, args, obj) {
            obj.overlay.element.style.left = ((-25) - offsetWidth) + "px";
            obj.overlay.element.style.top = y + "px"
        };
        slide.handleTweenAnimateIn = function(type, args, obj) {
            var pos = Dom.getXY(obj.overlay.element), currentX = pos[0], currentY = pos[1];
            if (Dom.getStyle(obj.overlay.element, "visibility") == "hidden" && currentX < x) {
                Dom.setStyle(obj.overlay.element, "visibility", "visible")
            }
            obj.overlay.cfg.setProperty("xy", [currentX, currentY], true);
            obj.overlay.cfg.refireEvent("iframe")
        };
        slide.handleCompleteAnimateIn = function(type, args, obj) {
            obj.overlay.cfg.setProperty("xy", [x, y], true);
            obj.startX = x;
            obj.startY = y;
            obj.overlay.cfg.refireEvent("iframe");
            obj.animateInCompleteEvent.fire()
        };
        slide.handleStartAnimateOut = function(type, args, obj) {
            var vw = Dom.getViewportWidth(), pos = Dom.getXY(obj.overlay.element), yso = pos[1];
            obj.animOut.attributes.points.to = [(vw + 25), yso]
        };
        slide.handleTweenAnimateOut = function(type, args, obj) {
            var pos = Dom.getXY(obj.overlay.element), xto = pos[0], yto = pos[1];
            obj.overlay.cfg.setProperty("xy", [xto, yto], true);
            obj.overlay.cfg.refireEvent("iframe")
        };
        slide.handleCompleteAnimateOut = function(type, args, obj) {
            Dom.setStyle(obj.overlay.element, "visibility", "hidden");
            obj.overlay.cfg.setProperty("xy", [x, y]);
            obj.animateOutCompleteEvent.fire()
        };
        slide.init();
        return slide
    };
    ContainerEffect.prototype = {init: function() {
            this.beforeAnimateInEvent = this.createEvent("beforeAnimateIn");
            this.beforeAnimateInEvent.signature = CustomEvent.LIST;
            this.beforeAnimateOutEvent = this.createEvent("beforeAnimateOut");
            this.beforeAnimateOutEvent.signature = CustomEvent.LIST;
            this.animateInCompleteEvent = this.createEvent("animateInComplete");
            this.animateInCompleteEvent.signature = CustomEvent.LIST;
            this.animateOutCompleteEvent = this.createEvent("animateOutComplete");
            this.animateOutCompleteEvent.signature = CustomEvent.LIST;
            this.animIn = new this.animClass(this.targetElement, this.attrIn.attributes, this.attrIn.duration, this.attrIn.method);
            this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
            this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);
            this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this);
            this.animOut = new this.animClass(this.targetElement, this.attrOut.attributes, this.attrOut.duration, this.attrOut.method);
            this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
            this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
            this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this)
        }, animateIn: function() {
            this.beforeAnimateInEvent.fire();
            this.animIn.animate()
        }, animateOut: function() {
            this.beforeAnimateOutEvent.fire();
            this.animOut.animate()
        }, handleStartAnimateIn: function(type, args, obj) {
        }, handleTweenAnimateIn: function(type, args, obj) {
        }, handleCompleteAnimateIn: function(type, args, obj) {
        }, handleStartAnimateOut: function(type, args, obj) {
        }, handleTweenAnimateOut: function(type, args, obj) {
        }, handleCompleteAnimateOut: function(type, args, obj) {
        }, toString: function() {
            var output = "ContainerEffect";
            if (this.overlay) {
                output += " [" + this.overlay.toString() + "]"
            }
            return output
        }};
    FoxSaver.YUI.lang.augmentProto(ContainerEffect, FoxSaver.YUI.util.EventProvider)
})();
FoxSaver.YUI.register("container", FoxSaver.YUI.widget.Module, {version: "2.4.0", build: "733"})