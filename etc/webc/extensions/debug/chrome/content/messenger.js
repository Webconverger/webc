/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Nightly Tester Tools.
 *
 * The Initial Developer of the Original Code is
 *     Dave Townsend <dtownsend@oxymoronical.com>.
 *
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var nightlyApp = {

repository: ['comm-central','comm-aurora'],

savedTabmailSetDocumentTitle: null,
tabmailSetDocumentTitle: null,

get defaultTitle() {
  var tabmail = document.getElementById("tabmail");
  return nightlyApp.getWindowTitleForMessenger(tabmail.currentTabInfo);
},

get tabTitle() {
  var tabmail = document.getElementById("tabmail");
  return tabmail.currentTabInfo.title;
},

init: function()
{
  var brandbundle = document.getElementById("bundle_brand");
  if (nightly.variables.name==null)
  {
    nightly.variables.name=brandbundle.getString("brandShortName");
  }
  nightly.variables.defaulttitle=brandbundle.getString("brandShortName");
  nightly.variables.brandname=brandbundle.getString("brandFullName");
  
  var tabmail = document.getElementById("tabmail");
  if (tabmail && typeof(tabmail.setDocumentTitle) === "function")
  {
    nightlyApp.savedTabmailSetDocumentTitle=tabmail.setDocumentTitle;
  }
},

openURL: function(url, event)
{
  var uri = Components.classes["@mozilla.org/network/io-service;1"]
                      .getService(Components.interfaces.nsIIOService)
                      .newURI(url, null, null);

  var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                              .getService(Components.interfaces.nsIExternalProtocolService);
  protocolSvc.loadUrl(uri);
},

customTabmailSetDocumentTitle: function(aTab)
{
  document.title = nightly.generateText(nightly.getTemplate("title"));
},

updateTitle: function()
{
  if (nightlyApp.savedTabmailSetDocumentTitle) {
    var tabmail = document.getElementById("tabmail");
    if (tabmail.setDocumentTitle != nightlyApp.tabmailSetDocumentTitle)
      tabmail.setDocumentTitle = nightlyApp.tabmailSetDocumentTitle;

    nightlyApp.tabmailSetDocumentTitle(window.document.getElementById("tabmail").currentTabInfo);
  }
},

setCustomTitle: function(title)
{
  nightlyApp.tabmailSetDocumentTitle=nightlyApp.customTabmailSetDocumentTitle;
  nightlyApp.updateTitle();
},

setStandardTitle: function()
{
  nightlyApp.tabmailSetDocumentTitle=nightlyApp.savedTabmailSetDocumentTitle;
  nightlyApp.updateTitle();
},

/**
 * Calculates the title like tabmail's setDocumentTitle(), but doesn't set.
 * See Bug 502389 for the details.
 */
getWindowTitleForMessenger: function(aTab)
{
  let docTitle = aTab.title;

  if (docTitle && !Application.platformIsMac)
    docTitle += document.documentElement
                        .getAttribute("titlemenuseparator");

  if (!docTitle || !Application.platformIsMac)
    docTitle += document.documentElement
                        .getAttribute("titlemodifier");

  return docTitle;
},

}
