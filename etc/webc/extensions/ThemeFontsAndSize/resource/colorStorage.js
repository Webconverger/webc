/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
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
 * The Original Code is Rainbow.
 *
 * The Initial Developer of the Original Code is
 * Heather Arthur.
 * Portions created by the Initial Developer are Copyright (C) 2009
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
const Cc = Components.classes;
const Ci = Components.interfaces;
const DB_VERSION = 1;


var EXPORTED_SYMBOLS = ["ColorStorageService"];

var obService = Components.classes["@mozilla.org/observer-service;1"]
			          .getService(Components.interfaces.nsIObserverService);

var ColorStorageService = {

  _tables : {
    colors : "id INTEGER PRIMARY KEY ON CONFLICT REPLACE, date INTEGER, url TEXT",
    tagof : "id INTEGER, tag TEXT NOT NULL, date INTEGER"
  },

  /* initialize database and create if necessary */
  initialize : function() {
    var file = Cc["@mozilla.org/file/directory_service;1"]  
               .getService(Components.interfaces.nsIProperties)  
               .get("ProfD", Components.interfaces.nsIFile);
    file.append("themefontsizechangerrainbow-easel");
    if(!file.exists())
      file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
    file.append("themefontsizechangerrainbow-colors.sqlite");  

    var storageService = Cc["@mozilla.org/storage/service;1"]
                      	 .getService(Ci.mozIStorageService);
    this._dbConnection = storageService.openDatabase(file);

    if(this._dbConnection.schemaVersion == 0)
      this._dbCreate();
  },

  addColor : function(color, tagstring, url) {
    var cid = this._colorToInt32(color);
		
    /* Wrap in transaction for atomicity and efficiency */
    this._dbConnection.beginTransaction();

    var wasSaved = this.isSaved(color);
    if(wasSaved)
      this.removeColor(color);


    var query = "INSERT INTO colors (id, date, url) VALUES (?1, ?2, ?3)";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);
    statement.bindInt64Parameter(1, Date.now());
    statement.bindUTF8StringParameter(2, url);
    statement.execute();
    statement.reset();

    this.addTags(color, tagstring);

    /* end transaction */
    this._dbConnection.commitTransaction();
		
    /* notify those waiting on modification to color database */
    if(wasSaved)
      obService.notifyObservers(null, "themefontsizechangerrainbow-color-edited", [color]);
    else
      obService.notifyObservers(null, "themefontsizechangerrainbow-color-added", [color]);
  },

  addTags : function(color, tagstring) {
    var cid = this._colorToInt32(color);
    var tags = this._stringToArray(tagstring);

    var query = "INSERT INTO tagof (id, tag, date) VALUES (?1, ?2, ?3)";
    for (let i = 0; i < tags.length; i++) {
      let statement = this._dbConnection.createStatement(query);
      statement.bindInt32Parameter(0, cid);
      statement.bindUTF8StringParameter(1, tags[i]);
      statement.bindInt64Parameter(2, Date.now());
      statement.execute();
      statement.reset();
    }

    if(tags.length > 0)
      obService.notifyObservers(null, "themefontsizechangerrainbow-color-edited", [color]);
  },

  removeColor : function(color) {
    var cid = this._colorToInt32(color);

    /* if called from addColor then already have transaction */
    var transaction = false;
    if(!this._dbConnection.transactionInProgress) {
      transaction = true;
      this._dbConnection.beginTransaction();
    }

    var query = "DELETE FROM colors where id = ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);
    statement.execute();
    statement.reset();

    this.removeTags(cid);
		
    if(transaction)
      this._dbConnection.commitTransaction();	
  },

  removeTags : function(cid) {
    var query = "DELETE FROM tagof where id = ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);
    statement.execute();
    statement.reset();
  },

  tagsOf : function(color) {
    var cid = this._colorToInt32(color);
    var query = "SELECT DISTINCT tag FROM tagof WHERE id = ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);

    var tags = [];
    while(statement.executeStep())
      tags.push(statement.getUTF8String(0));
    statement.reset();
    return this._arrayToString(tags);
  },

  dateOf : function(color) {
    var cid = this._colorToInt32(color);
    var query = "SELECT date FROM colors WHERE id = ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);
		
    try {
      statement.executeStep();
      var date = statement.getInt64(0);
    }
    catch (e) {
      // log failure
    }
    finally {
      statement.reset(); // ?
    }
    return date;
  },

  urlOf : function(color) {
    var cid = this._colorToInt32(color);
    var query = "SELECT url FROM colors WHERE id = ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);
		
    try {
      statement.executeStep();
      var url = statement.getUTF8String(0);
    }
    catch (e) {
      var url = "";
    }
    finally {
      statement.reset();
    }
    return url;
  },
  
  colorsWithTag : function(tag) {
    var colors = [];
    var query = "SELECT DISTINCT id FROM tagof WHERE tag LIKE ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindUTF8StringParameter(0, "%" + tag + "%");
    while(statement.executeStep())
      colors.push(this._int32ToColor(statement.getInt32(0)));
  
    statement.reset();
    return colors;
  },

  colorsWithUrl : function(url) {
    var colors = [];
    var query = "SELECT DISTINCT id FROM colors WHERE url LIKE ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindUTF8StringParameter(0, "%" + url + "%");
    while(statement.executeStep())
      colors.push(this._int32ToColor(statement.getInt32(0)));
  
    statement.reset();
    return colors;
  },

  colorsMatching : function(filter) {
    var colors = [];
    var ands = this._stringToArray(filter);

    /* if it is comma-separated, find matches that have all tags */
    if(ands.length > 1) {
      var query = "SELECT id FROM tagof WHERE tag LIKE ?1";
      for(var i = 1; i < ands.length; i++) // need to find query for urls too
        query += " INTERSECT SELECT id FROM tagof WHERE tag LIKE ?" + (i + 1);

      var statement = this._dbConnection.createStatement(query);

      for(var i = 0; i < ands.length; i++)
        statement.bindUTF8StringParameter(i, "%" + ands[i] + "%");

      while(statement.executeStep())
        colors.push(this._int32ToColor(statement.getInt32(0)));

      return colors;
    }
    /* if it is semi-colon separated find matches with any one of tags */
    var ors = this._stringToOrs(filter);
    var query = "SELECT id FROM colors WHERE url LIKE ?1 ";
    for(var i = 0; i < ors.length; i++)
      query += " OR url LIKE?" + (i + 2);
    query += " UNION SELECT id FROM tagof WHERE tag LIKE ?1"; 
    for(var i = 0; i < ors.length; i++)
      query += " OR tag LIKE ?" + (i + 2);

    var statement = this._dbConnection.createStatement(query);
    statement.bindUTF8StringParameter(0, "%" + filter + "%");
    for(var i = 0; i < ors.length; i++)
      statement.bindUTF8StringParameter(i + 1, "%" + ors[i] + "%");

    while(statement.executeStep())
      colors.push(this._int32ToColor(statement.getInt32(0)));

    return colors;
  },

  colorsMatchingTag : function(filter) {
    var colors = [];
    var ands = this._stringToArray(filter);

    /* if it is comma-separated, find matches that have all tags */
    if(ands.length > 1) {
      var query = "SELECT colors.id FROM colors, tagof WHERE colors.id == tagof.id" +
                  " AND tagof.tag LIKE ?1";
      for(var i = 1; i < ands.length; i++)
        query += " INTERSECT SELECT colors.id FROM colors, tagof" + 
                 " WHERE colors.id == tagof.id AND tagof.tag LIKE ?" + (i + 1);

      var statement = this._dbConnection.createStatement(query);

      for(var i = 0; i < ands.length; i++)
        statement.bindUTF8StringParameter(i, "%" + ands[i] + "%");

      while(statement.executeStep())
        colors.push(this._int32ToColor(statement.getInt32(0)));

      return colors;
    }
    /* if it is semi-colon separated find matches with any one of tags */
    var ors = this._stringToOrs(filter);
    var query = "SELECT DISTINCT colors.id FROM colors, tagof "
                + "WHERE colors.id == tagof.id AND ( tagof.tag LIKE ?1";
    for(var i = 0; i < ors.length; i++)
      query += " OR tagof.tag LIKE ?" + (i + 2);
    query += ")";

    var statement = this._dbConnection.createStatement(query);
    statement.bindUTF8StringParameter(0, "%" + filter + "%");
    for(var i = 0; i < ors.length; i++)
      statement.bindUTF8StringParameter(i + 1, "%" + ors[i] + "%");

    while(statement.executeStep())
      colors.push(this._int32ToColor(statement.getInt32(0)));

    return colors;
  },

  isSaved : function(color) {
    var cid = this._colorToInt32(color);
    var query = "SELECT COUNT(1) FROM colors WHERE id = ?1";
    var statement = this._dbConnection.createStatement(query);
    statement.bindInt32Parameter(0, cid);

    try {
      statement.executeStep();
      var count = statement.getInt32(0);
    }
    catch(e) {
      //log failure
    }
    finally {
      statement.reset();
    } 
    return count > 0 ? true : false;
  },

  allColors : function() {
    var query = "SELECT DISTINCT id FROM colors";
    var statement = this._dbConnection.createStatement(query);
    var colors = [];		
    while(statement.executeStep()) 
      colors.push(this._int32ToColor(statement.getInt32(0)));
    statement.reset();
    return colors;
  },

  allTags : function() {
    var query = "SELECT DISTINCT tag FROM tagof";
    var statement = this._dbConnection.createStatement(query);
    var tags = [];		
    while(statement.executeStep()) 
      tags.push(statement.getUTF8String(0));
    statement.reset();		
    return tags;
  },

  recentTags : function() {
    var query = "SELECT DISTINCT tag FROM tagof ORDER BY date DESC LIMIT 10";
    var statement = this._dbConnection.createStatement(query);
    var tags = [];		
    while(statement.executeStep()) 
      tags.push(statement.getUTF8String(0));
    statement.reset();		
    return tags;
  },

  countTags : function() {
    var query = "SELECT count(*) FROM tagof";
    var statement = this._dbConnection.createStatement(query);
    statement.executeStep(); 
    var count = statement.getInt32(0);
    statement.reset();		
    return count;
  },

  /* normalize */	
  _colorToInt32 : function (color) {
    return parseInt(color.slice(1), 16);
  },

  _stringToArray : function (string) {
    /* split on groups of at least one comma and whitespace */
    var trimmed = string.replace(/^[\s,]+/, '').replace(/[\s,]+$/,'').split(/[\s,]*,[\s,]*/);
    var values = [];
    for(var i = 0; i < trimmed.length; i++) // remove empty entries
      if(trimmed[i] != "")
        values.push(trimmed[i]);
    return values;
  },

  _stringToOrs : function (string) {
    /* split on groups of at least one comma and whitespace */
    var trimmed = string.replace(/^[\s,]+/, '').replace(/[\s,]+$/,'').split(/[\s;]*;[\s;]*/);
    var values = [];
    for(var i = 0; i < trimmed.length; i++) // remove empty entries
      if(trimmed[i] != "")
        values.push(trimmed[i]);
    return values;
  },

  _arrayToString : function (array) {
    return array.join(", ");
  },

  _int32ToColor : function(cid) {
    var hex = cid.toString(16).toUpperCase();
    while(hex.length < 6)
      hex = '0' + hex;
    hex = '#' + hex;
    return hex;
  },
  
  _dateToString : function(date) {
    var dateStr = (new Date(date)).toDateString();
    var dateRegex = /^(.*?) (.*)$/;
    var result = dateStr.match(dateRegex);
    if(result)
      return result[2];
  },

  /* shamelessly stolen from passwordmgr which stole from nsPrefContentService */	
  _dbCreate : function () {
    this._dbCreateTables();
    this._dbConnection.schemaVersion = DB_VERSION;
  },
	
  _dbCreateTables : function() {
    for(let name in this._tables) 
      this._dbConnection.createTable(name, this._tables[name]);  
  },

  _dbCreateIndices : function() {
    for(let name in this._indices) {
      let index = this._indices[name];
      let statement = "CREATE INDEX IF NOT EXISTS " + name + " ON " + index.table
			    + "(" + index.columns.join(", ") + ")";
      this._dbConnection.executeSimpleSQL(statement);
    }
  }
}

ColorStorageService.initialize();
