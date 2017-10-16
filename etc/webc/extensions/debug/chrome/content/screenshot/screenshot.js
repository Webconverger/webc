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

const Ci = Components.interfaces;
const Cc = Components.classes;

var shotWindow = window.opener;

var timer = 0;

var canvas = null;
var bundle = null;

var windows = [];

function init(event)
{
  canvas = document.getElementById("canvas");
  drawScreenshot();
  //canvas.parentNode.addEventListener("mousedown", startAreaSelect, true);
  
  buildWinPopup()
    
  var winlist = document.getElementById("winlist");
  winlist.addEventListener("ValueChange", winChange, false);
  
  var winpopup = document.getElementById("winpopup");
  winpopup.addEventListener("popupshowing", buildWinPopup, false);
  
  bundle = document.getElementById("bundle");

  try
  {
    var win = getTopWin();
    var webnav = win.content.QueryInterface(Ci.nsIInterfaceRequestor)
                            .getInterface(Ci.nsIWebNavigation);
    if (webnav.loadURI)
      document.getElementById("imgsubmit").hidden = false;
  }
  catch (e)
  {
  }
}

function getTopWin()
{
  var windowManager = Cc['@mozilla.org/appshell/window-mediator;1']
                        .getService(Ci.nsIWindowMediator);
  return windowManager.getMostRecentWindow("navigator:browser");
}

function timedCapture()
{
  if (timer==0)
  {
    timer = 5;
    var button = document.getElementById("timerbtn");
    button.checked = true;
    window.setTimeout(captureTimer, 1000);
  }
}

function captureTimer()
{
  var button = document.getElementById("timerbtn");
  timer--;
  if (timer==0)
  {
    drawScreenshot();
    button.setAttribute("label", bundle.getFormattedString("screenshot.timer.label", [5]));
    button.checked = false;
  }
  else
  {
    button.setAttribute("label", bundle.getFormattedString("screenshot.timer.label", [timer]));
    window.setTimeout(captureTimer, 1000);
  }
}

function submitScreenshot()
{
  var fileService = ImageShack;
  
  var data = canvas.toDataURL("image/png");
  var pos = data.indexOf(";",5);
  var contenttype = data.substring(5,pos);
  var npos = data.indexOf(",",pos+1);
  var encoding = data.substring(pos+1,npos);
  data = data.substring(npos+1);
  
  var fd = new MultipartFormData();
  fileService.addFormFields(fd);
  fd.addFileData(fileService.getFileFormField(), "screenshot.png", contenttype, encoding, data);
  
  var ioService = Cc["@mozilla.org/network/io-service;1"]
                    .getService(Ci.nsIIOService);
  
  var referer = ioService.newURI(fileService.getReferer(), "UTF8", null);
  
  var win = getTopWin();
  win.gBrowser.selectedTab = win.gBrowser.addTab("about:blank");
  var webnav = win.content.QueryInterface(Ci.nsIInterfaceRequestor)
                          .getInterface(Ci.nsIWebNavigation);
  webnav.loadURI(fileService.getSubmissionURL(), Ci.nsIWebNavigation.LOAD_FLAGS_NONE
                , referer, fd.getPostDataStream(), fd.getHeaderStream());
}

function saveScreenshot()
{
  var fp = Cc["@mozilla.org/filepicker;1"]
             .createInstance(Ci.nsIFilePicker);
  fp.init(window, bundle.getString("screenshot.filepicker.title"), fp.modeSave);
  fp.appendFilter(bundle.getString("screenshot.filepicker.filterPNG"), "*.png");
  fp.appendFilter(bundle.getString("screenshot.filepicker.filterJPG"), "*.jpg");
  fp.filterIndex = 0;
  fp.defaultString="screenshot";

  var result = fp.show();
  if (result==fp.returnOK || result==fp.returnReplace)
  {
    var file = fp.file;
    var mimetype = "image/png";
    var options = "";
    var extension = "png";
    if (fp.filterIndex == 1)
    {
      extension = "jpg";
      mimetype = "image/jpeg";
      options = "quality=80";
    }

    if (file.leafName.indexOf(".") < 0)
      file.leafName += "." + extension;
    
    var ioService = Cc["@mozilla.org/network/io-service;1"]
                      .getService(Ci.nsIIOService);
    
    var source = ioService.newURI(canvas.toDataURL(mimetype, options), "UTF8", null);
    var target = ioService.newFileURI(file)
    
    var persist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
                    .createInstance(Ci.nsIWebBrowserPersist);
  
    persist.persistFlags = Ci.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
    persist.persistFlags |= Ci.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
  
    var tr = Cc["@mozilla.org/transfer;1"]
               .createInstance(Ci.nsITransfer);
  
    tr.init(source, target, "", null, null, null, persist);
    persist.progressListener = tr;
    persist.saveURI(source, null, null, null, null, file);
  }
}

function copyScreenshot()
{
  var image = document.getElementById("previewImage");
  var docshell = window.QueryInterface(Ci.nsIInterfaceRequestor)
                       .getInterface(Ci.nsIWebNavigation)
                       .QueryInterface(Ci.nsIDocShell);
  var edit = docshell.contentViewer.QueryInterface(Ci.nsIContentViewerEdit);
  document.popupNode = image;
  edit.copyImage(Ci.nsIContentViewerEdit.COPY_IMAGE_DATA);
}

function buildWinPopup(event)
{
  var winlist = document.getElementById("winlist");
  var winpopup = document.getElementById("winpopup");
  
  windows = [];
  while (winpopup.firstChild)
    winpopup.removeChild(winpopup.firstChild);

  var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
            .getService(Ci.nsIWindowMediator);
  var wins = wm.getEnumerator(null);
  var pos = 0;
  while (wins.hasMoreElements())
  {
    var win = wins.getNext().QueryInterface(Ci.nsIDOMWindow);
    if (win != window)
    {
      windows[pos] = win;
      var item = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menuitem");
      if (win.document.title)
        item.setAttribute("label", win.document.title);
      else
        item.setAttribute("label", win.document.location.href);
      item.setAttribute("value", pos);
      winpopup.appendChild(item);
      
      if (!event && win==shotWindow)
        winlist.value=pos;
        
      pos++;
    }
  }
}

function winChange(event)
{
  var winlist = document.getElementById("winlist");
  shotWindow = windows[winlist.value];
  drawScreenshot();
}

function drawScreenshot()
{
  var width = shotWindow.innerWidth;
  var height = shotWindow.innerHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + "px";
  canvas.style.minWidth = width + "px";
  canvas.style.maxWidth = width + "px";
  canvas.style.height = height + "px";
  canvas.style.minHeight = height + "px";
  canvas.style.maxHeight = height + "px";

  var ctx = canvas.getContext("2d");
  
  var winbo = shotWindow.document.getBoxObjectFor(shotWindow.document.documentElement);
  var winx = winbo.screenX;
  var winy = winbo.screenY;

  // This draws the main window
  try
  {
    ctx.drawWindow(shotWindow, shotWindow.scrollX, shotWindow.scrollY,
                               shotWindow.innerWidth, shotWindow.innerHeight,
                               "rgba(255,255,255,255)");
  }
  catch (e)
  {
  }

  // Must also draw inner windows as inner-content from chrome are not included
  var docshell = shotWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                           .getInterface(Ci.nsIWebNavigation)
                           .QueryInterface(Ci.nsIDocShell);
  var shells = docshell.getDocShellEnumerator(Ci.nsIDocShellTreeItem.typeAll, Ci.nsIDocShell.ENUMERATE_FORWARDS);
  while (shells.hasMoreElements())
  {
    var shell = shells.getNext().QueryInterface(Ci.nsIDocShell);
    try
    {
      if (shell == docshell)
        continue;
  
      shell.QueryInterface(Ci.nsIBaseWindow);
      if (!shell.visibility)
        continue;
  
      var shellwin = shell.QueryInterface(Ci.nsIInterfaceRequestor)
                          .getInterface(Ci.nsIDOMWindow);
      var shellbo = shellwin.document.getBoxObjectFor(shellwin.document.documentElement);
      
      ctx.save();
      try
      {
        ctx.translate(shellbo.screenX - winx + shellwin.scrollX,
                      shellbo.screenY - winy + shellwin.scrollY);
        ctx.drawWindow(shellwin, shellwin.scrollX, shellwin.scrollY,
                                 shellwin.innerWidth, shellwin.innerHeight,
                                 "rgba(255,255,255,255)");
      }
      catch (e)
      {
      }
      ctx.restore();
    }
    catch (e)
    {
    }
  }

  var url = canvas.toDataURL();
  var oldImage = document.getElementById("previewImage");
  if (oldImage)
    oldImage.parentNode.removeChild(oldImage);

  var image = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
  image.id = "previewImage";
  document.getElementById("container").appendChild(image);

  image.style.width = width + "px";
  image.style.height = height + "px";
  image.width = width;
  image.height = height;
  image.src = url;
}

window.addEventListener("load", init, false);
