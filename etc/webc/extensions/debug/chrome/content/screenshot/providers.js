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

var Providers = {
  _providers: [],
  _selected: null,
  
  addProvider: function(provider)
  {
    this._providers.push(provider);
    if (this._selected == null)
      this._selected = provider;
  },
  
  selectProvider: function(provider)
  {
    this._selected = provider;
  },
  
  getSelectedProvider: function()
  {
    return this._selected;
  },
  
  getProviders: function()
  {
    return this._providers;
  }
}

var ImageShack = {
  addFormFields: function(formdata)
  {
    formdata.addControl("uploadtype", "on");
    formdata.addControl("url", "paste image url here");
    formdata.addControl("MAX_FILE_SIZE", "3145728");
    formdata.addControl("refer", "");
    formdata.addControl("brand", "");
    formdata.addControl("optsize", "320x320");
  },
  
  getFileFormField: function()
  {
    return "fileupload";
  },
  
  getReferer: function()
  {
    return "http://www.imageshack.us/";
  },
  
  getSubmissionURL: function()
  {
    return "http://www.imageshack.us/";
  }
}

var AllYouCanUpload = {
  addFormFields: function(formdata)
  {
    formdata.addControl("images[0].submittedPhotoSize", "100%");
    formdata.addControl("imagesCount", "1");
  },
  
  getFileFormField: function()
  {
    return "images[0].fileName";
  },
  
  getReferer: function()
  {
    return "http://allyoucanupload.webshots.com/";
  },
  
  getSubmissionURL: function()
  {
    return "http://allyoucanupload.webshots.com/uploadcomplete";
  }
}

Providers.addProvider(ImageShack);
//Providers.addProvider(AllYouCanUpload);
