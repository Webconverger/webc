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
 
var EXPORTED_SYMBOLS = ["LOG", "WARN", "ERROR"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

var gLoggingEnabled = false;

function logMessage(text, level) {
  var caller = null;
  try {
    caller = Components.stack.caller.caller;
  }
  catch (e) { }

  var msg = Cc["@mozilla.org/scripterror;1"].
            createInstance(Ci.nsIScriptError);
  if (caller) {
    var filename = caller.filename;
    var sourceLine = caller.sourceLine;
    var lineNumber = caller.lineNumber;
  }
  else {
    var filename = "";
    var sourceLine = "";
    var lineNumber = 0;
  }
  msg.init(text, filename, sourceLine, lineNumber, 0,
           level, "XUL JavaScript");

  var console = Cc["@mozilla.org/consoleservice;1"].
                getService(Ci.nsIConsoleService);
  console.logMessage(msg);
}

function ERROR(string) {
  dump("NTT ERROR: " + string + "\n");
  logMessage("NTT: " + string, Ci.nsIScriptError.errorFlag);
}

function WARN(string) {
  dump("NTT WARN : " + string + "\n");
  logMessage("NTT: " + string, Ci.nsIScriptError.warningFlag);
}

function LOG(string) {
  if (gLoggingEnabled) {
    dump("NTT LOG  : " + string + "\n");
    
    var caller = null;
    try {
      caller = Components.stack.caller;
    }
    catch (e) { }
    
    if (caller)
      string += " (" + caller.filename + ":" + caller.lineNumber + ")";

    var console = Cc["@mozilla.org/consoleservice;1"].
                  getService(Ci.nsIConsoleService);
    console.logStringMessage("NTT: " + string);
  }
}

var prefs = Cc["@mozilla.org/preferences-service;1"].
            getService(Ci.nsIPrefBranch);
try {
  gLoggingEnabled = prefs.getBoolPref("nightly.logging");
}
catch (e) { }
