function E (id, context) {
  var element = context.getElementById(id)
  return element
}

function hide (element) {
  if (element) {
    element.setAttribute('hidden', 'true')
  }
}

function removeDeveloperTools (doc) {
  var win = doc.defaultView
  // Need to delay this because devtools is created dynamically
  win.setTimeout(function () {
    CustomizableUI.destroyWidget('developer-button')
    hide(E('webDeveloperMenu', doc))
    var devtoolsKeyset = doc.getElementById('devtoolsKeyset')
    if (devtoolsKeyset) {
      for (var i = 0; i < devtoolsKeyset.childNodes.length; i++) {
        devtoolsKeyset.childNodes[i].removeAttribute('oncommand')
        devtoolsKeyset.childNodes[i].removeAttribute('command')
      }
    }
  }, 500)
  try {
    doc.getElementById('Tools:ResponsiveUI').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:Scratchpad').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:BrowserConsole').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:BrowserToolbox').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:DevAppsMgr').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:DevToolbar').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:DevToolbox').removeAttribute('oncommand')
  } catch (e) {}
  try {
    doc.getElementById('Tools:DevToolbarFocus').removeAttribute('oncommand')
  } catch (e) {}
  CustomizableUI.destroyWidget('developer-button')
}

(function () {
  function onPageLoad (event) {
    var doc = event.target
    var win = doc.defaultView
    // ignore frame loads
    if (win != win.top) {
      return
    }
    var uri = doc.documentURIObject
    // If we get a neterror, try again in 10 seconds
    if (uri.spec.match('about:neterror')) {
      window.setTimeout(function (win) {
        win.location.reload()
      }, 10000, win)
    }
  }

  function startup (event) {
    var doc = event.target
    removeDeveloperTools(doc)
		// let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;
    window.removeEventListener('load', startup, false)
    var navigatorToolbox = document.getElementById('navigator-toolbox')
    navigatorToolbox.iconsize = 'small'
    navigatorToolbox.setAttribute('iconsize', 'small')

    var tabSwitchInterval = 0
    try {
			// console.log("Trying to get tabSwitchInterval");
      tabSwitchInterval = Services.prefs.getIntPref('extensions.webconverger.tabswitchinterval') * 1000
			// console.log("Got it!", tabSwitchInterval);
    } catch (e) {}
    if (tabSwitchInterval > 0) {
			// console.log("Hello from tabSwitchInterval code", tabSwitchInterval);
      window.setInterval(function () {
        var visibleTabs = gBrowser.visibleTabs
        if (visibleTabs.length == 1) {
					// Don't do anything if there is only one tab
          return
        }
        var selectedIndex = visibleTabs.indexOf(gBrowser.selectedTab)
        selectedIndex = selectedIndex + 1
        if (selectedIndex == visibleTabs.length) {
          selectedIndex = 0
        }
        gBrowser.selectTabAtIndex(selectedIndex)
      }, tabSwitchInterval)
    }
    document.getElementById('appcontent').addEventListener('DOMContentLoaded', onPageLoad, false)
		// Remove social API
    SocialActivationListener = {
      init: function () {}
    }
    gBrowser.getStatusPanel().setAttribute('hidden', 'true')
  }

  function shutdown () {
    window.removeEventListener('unload', shutdown, false)
    document.getElementById('appcontent').removeEventListener('DOMContentLoaded', onPageLoad, false)
  }

  window.addEventListener('load', startup, false)
  window.addEventListener('unload', shutdown, false)
})()

// Disable shift click from opening window
// Fixes https://github.com/Webconverger/webconverger-addon/issues/18
var ffWhereToOpenLink = whereToOpenLink

whereToOpenLink = function (e, ignoreButton, ignoreAlt) {
  var where = ffWhereToOpenLink(e, ignoreButton, ignoreAlt)
  if (where == 'window') {
    where = 'tab'
  }
  return where
}

