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
    if (win !== win.top) {
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

    var navigatorToolbox = document.getElementById('navigator-toolbox')
    navigatorToolbox.iconsize = 'small'
    navigatorToolbox.setAttribute('iconsize', 'small')
    var showPrintButton = false
    try {
      showPrintButton = Services.prefs.getBoolPref('extensions.webconverger.showprintbutton')
    } catch (e) {}
    if (showPrintButton) {
      document.getElementById('wc-print').removeAttribute('hidden')
    }
    window.removeEventListener('load', startup, false)

    var nobrand = false
    try {
      nobrand = Services.prefs.getBoolPref('extensions.webconverger.nobrand')
    } catch (e) {}
    if (!nobrand) {
      var insertAfter = document.getElementById('alltabs-button')
      document.getElementById('alltabs-button')
      var allTabsButton = document.getElementById('alltabs-button')
      var spacer = document.createElement('spacer')
      spacer.setAttribute('flex', '1')
      insertAfter.parentNode.appendChild(spacer)
      var box = document.createElement('box')
      box.setAttribute('pack', 'center')
      box.setAttribute('align', 'center')
      var image = document.createElement('image')
      image.setAttribute('src', 'chrome://webconverger/content/webclogo.svg')
      image.setAttribute('tooltiptext', 'Webconverger')
      box.appendChild(image)
      insertAfter.parentNode.appendChild(box)
    }
    document.getElementById('appcontent').addEventListener('DOMContentLoaded', onPageLoad, false)
    // Remove social API
    SocialActivationListener = {
      init: function () {}
    }
    gBrowser.getStatusPanel().setAttribute('hidden', 'true')
    CustomizableUI.destroyWidget('social-share-button')
    CustomizableUI.destroyWidget('pocket-button')

    try {
      themeURL = Services.prefs.getCharPref('extensions.webconverger.themeURL')
      if (themeURL) {
        fetch(themeURL, { method: 'GET' })
.then(function (response) {
  return response.json()
}).then(function (json) {
  console.log('parsed json', json)
  var temp = {}
  Components.utils.import('resource://gre/modules/LightweightThemeManager.jsm', temp)
  temp.LightweightThemeManager.currentTheme = json
}).catch(function (ex) {
  console.log('Issue downloading the theme', ex)
})
      }
    } catch (e) { console.log('Issue setting the theme', e) }
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
  if (where === 'window') {
    where = 'tab'
  }
  return where
}

