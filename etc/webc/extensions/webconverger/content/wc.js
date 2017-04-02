Components.utils.import('resource:///modules/CustomizableUI.jsm')

function E (id, context) {
  var element = context.getElementById(id)
  return element
}

function hide (element) {
  if (element) {
    element.setAttribute('hidden', 'true')
  }
}

function disable (element) {
  if (element) {
    element.disabled = true
    element.setAttribute('disabled', 'true')
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

var webc = {
  init: function (event) {
    // Following https://github.com/mkaply/cck2wizard/blob/9968f143386dfaa2afe519ee48aa2ae730a12055/cck2/modules/CCK2BrowserOverlay.jsm#L24
    var doc = event.target

    removeDeveloperTools(doc)

    if (gBrowser) {
      gBrowser.tabContainer.addEventListener('TabClose', webc.tabRemoved, false)
    }
    gBrowser.getStatusPanel().setAttribute('hidden', 'true')
  },

  tabRemoved: function (event) {
    var closeWindowWithLastTab = true
    try {
      closeWindowWithLastTab = Services.prefs.getBoolPref('browser.tabs.closeWindowWithLastTab')
    } catch (e) {}

        // Get number of tabs
    var num = gBrowser.browsers.length

        // If there are two tabs, the second tab has no title and the closed tab
        // does have a title (ie is not the same tab) then close the browser
    if ((num === 2) && (!gBrowser.getBrowserAtIndex(1).contentTitle) && event.target.linkedBrowser.contentTitle) {
      if (closeWindowWithLastTab) {
        goQuitApplication()
      }
    }
    if ((num === 2) && (!gBrowser.getBrowserAtIndex(0).contentTitle)) {
      if (closeWindowWithLastTab) {
        goQuitApplication()
      }
    }
  }

}

window.addEventListener('load', function load (event) {
  window.removeEventListener('load', load, false) // remove listener, no longer needed
  webc.init(event)
},
false)

function BrowserLoadURL (aTriggeringEvent, aPostData) { // override browser.js
  var url = gURLBar.value
  if (url.match(/^file:/) || url.match(/^\//) || url.match(/^resource:/) || url.match(/^about:/)) {
    alert('Access to this protocol has been disabled!')
    return
  }

  if (aTriggeringEvent instanceof MouseEvent) {
    if (aTriggeringEvent.button === 2) {
      return // Do nothing for right clicks
    }

        // We have a mouse event (from the go button), so use the standard UI link behaviors
    openUILink(url, aTriggeringEvent, false, false, true, aPostData)
    return
  }

  if (aTriggeringEvent && aTriggeringEvent.altKey) {
    handleURLBarRevert()
    content.focus()
    gBrowser.loadOneTab(url, null, null, aPostData, false, true
        /* allow third party fixup */
        )
    aTriggeringEvent.preventDefault()
    aTriggeringEvent.stopPropagation()
  } else {
    loadURI(url, null, aPostData, true
        /* allow third party fixup */
        )
  }

  focusElement(content)
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

  function startup () {
    var navigatorToolbox = document.getElementById('navigator-toolbox')
    navigatorToolbox.iconsize = 'small'
    navigatorToolbox.setAttribute('iconsize', 'small')
    var showPrintButton = false
    try {
      showPrintButton = Services.prefs.getBoolPref('extensions.webconverger.showprintbutton')
    } catch (e) {}
    if (showPrintButton) {
      CustomizableUI.addWidgetToArea('print-button', 'nav-bar')
    } else {
      CustomizableUI.removeWidgetFromArea('print-button')
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
              console.log('parsing failed', ex)
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

