FoxSaver.EventManager = function(A) {
    this.events = {}
};
FoxSaver.EventManager.prototype.newEvents = function(B) {
    var A = this;
    B.map(function(C) {
        A.register(C, new FoxSaver.Event())
    })
};
FoxSaver.EventManager.prototype.register = function(A, B) {
    this.events[A] = B
};
FoxSaver.EventManager.prototype.getEvent = function(A) {
    if (this.events[A]) {
        return this.events[A]
    } else {
        alert("The event: \"" + A + '" is not found.');
        return null
    }
};
FoxSaver.EventManager.prototype.addListener = function(A, B) {
    var C = this.getEvent(A);
    if (C) {
        C.on(B)
    }
};
FoxSaver.EventManager.prototype.on = FoxSaver.EventManager.prototype.addListener;
FoxSaver.EventManager.prototype.removeListener = function(A, B) {
    var C = this.getEvent(A);
    if (C) {
        C.removeListener(B)
    }
};
FoxSaver.EventManager.prototype.removeAllListeners = function(A) {
    var B = this.getEvent(A);
    if (B) {
        B.removeAllListener()
    }
};
FoxSaver.EventManager.prototype.fire = function(B, A) {
    var C = this.getEvent(B);
    if (C) {
        C.fire(A)
    }
};
FoxSaver.Event = function() {
    this.listeners = new Array()
};
FoxSaver.Event.prototype.addListener = function(A) {
    if (A.state != "fresh") {
        alert("You cannot add a stale listener to a event.");
        return
    }
    A.activate(this);
    this.listeners.push(A)
};
FoxSaver.Event.prototype.on = FoxSaver.Event.prototype.addListener;
FoxSaver.Event.prototype.removeListener = function(A) {
    A.deactivate()
};
FoxSaver.Event.prototype.removeAllListeners = function() {
    this.listeners.map(function(A) {
        A.deactivate()
    })
};
FoxSaver.Event.prototype.fire = function(A) {
    this.args = A;
    this.listeners.map(function(B) {
        B.exe()
    })
};
FoxSaver.EventListener = function(A, B) {
    if (B == null) {
        B = false
    }
    if (B) {
        this.fn = A
    } else {
        this.fn = function() {
            window.setTimeout(A, 0)
        }
    }
    this.state = "fresh"
};
FoxSaver.EventListener.prototype.exe = function() {
    if (this.state == "on") {
        this.fn(this.event)
    }
};
FoxSaver.EventListener.prototype.activate = function(A) {
    this.state = "on";
    this.event = A
};
FoxSaver.EventListener.prototype.isActive = function() {
    return this.state == "on"
};
FoxSaver.EventListener.prototype.deactivate = function() {
    this.state = "off"
};
FoxSaver.eventManager = new FoxSaver.EventManager();
FoxSaver.eventManager.newEvents(["FoxSaver.Start", "FoxSaver.Stop"])