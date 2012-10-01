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
 
var Ci = Components.interfaces;
var Cc = Components.classes;
var Cr = Components.results;


function NTT_MakeStream(data)
{
  var stream = Cc["@mozilla.org/io/string-input-stream;1"]
                 .createInstance(Ci.nsIStringInputStream);
  stream.setData(data, data.length);
  return stream;
}

const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function NTT_decode64(input)
{
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  do
  {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64)
    {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64)
    {
      output = output + String.fromCharCode(chr3);
    }
  }
  while (i < input.length);

  return output;
}

function MultipartFormData()
{
  this.boundary = "hsdluicmwos";
  this.controls = [];
  this.files = [];
  this.postdata = "";
}

MultipartFormData.prototype = {

boundary: null,
controls: null,
files: null,
length: null,
postdata: null,

getPostData: function()
{
  if (this.postdata)
    return this.postdata;
  
  var data = "";
  
  for (var name in this.controls)
  {
    data+="\r\n--"+this.boundary+"\r\n";
    data+="Content-Disposition: form-data; name=\""+name+"\"\r\n\r\n";
    data+=this.controls[name];
  }
  
  for (var name in this.files)
  {
    var filedata = this.files[name];
    data+="\r\n--"+this.boundary+"\r\n";
    data+="Content-Disposition: form-data; name=\""+name+"\"; filename=\""+filedata.filename+"\"\r\n";
    data+="Content-Type: "+filedata.contenttype+"\r\n";
    if (filedata.source)
    {
      data+="Content-Transfer-Encoding: base64\r\n\r\n";
      
      var fis = Cc["@mozilla.org/network/file-input-stream;1"]
                  .createInstance(Ci.nsIFileInputStream);
      fis.init(filedata.source, 1, 384, Ci.nsIFileInputStream.CLOSE_ON_EOF);
      
      var bis = Cc["@mozilla.org/binaryinputstream;1"]
                  .createInstance(Ci.nsIBinaryInputStream);
      bis.setInputStream(fis);
      
      //TODO this isnt needed as yet
    }
    else
    {
      data+="Content-Transfer-Encoding: binary\r\n\r\n";
      if (filedata.encoding == "base64")
      {
        data+=NTT_decode64(filedata.data);
      }
      else if (filedata.encoding == "binary")
      {
        data+=filedata.data;
      }
    }
  }
  data+="\r\n--"+this.boundary+"--\r\n";

  this.length = data.length-2;
  this.postdata = data;
  
  return data;
},
  
getPostDataStream: function()
{
  return NTT_MakeStream(this.getPostData());
},
  
getHeaders: function()
{
  if (!this.length)
    this.getPostData();
  
  var headers = "";
  headers+="Content-Type: "+this.getContentType()+"\r\n";
  headers+="Content-Length: "+this.length+"\r\n";
  return headers;
},
  
getHeaderStream: function()
{
  return NTT_MakeStream(this.getHeaders());
},
  
getContentType: function()
{
  return "multipart/form-data; boundary=\""+this.boundary+"\"";
},
  
addControl: function(name, value)
{
  this.controls[name]=value;
  this.postdata = null;
  this.length = null;
},
  
addFile: function(name, contenttype, file)
{
  throw Components.results.NS_NOT_IMPLEMENTED;
  var filedata = {
    filename: file.leafName,
    contenttype: contenttype,
    source: file
  };
  this.files[name] = filedata;
  this.postdata = null;
  this.length = null;
},
  
addFileData: function(name, filename, contenttype, encoding, data)
{
  var filedata = {
    filename: filename,
    contenttype: contenttype,
    encoding: encoding,
    data: data
  };
  this.files[name] = filedata;
  this.postdata = null;
  this.length = null;
},
}