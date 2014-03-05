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
 * Portions created by the Initial Developer are Copyright (C) 2010
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

function allPartitions(array) {
  if(!array.length)
    return [];
  var partitions = [];
  for(var i = 1; i <= array.length; i++) {
     var s1 = array.slice(0, i);
     var s2 = array.slice(i, array.length);
     var p2 = allPartitions(s2);
     for(var j = 0; j < p2.length; j++)
       partitions.push([s1].concat(p2[j]))
  }
  partitions.push([array]);
  return partitions;
}

function lineCost(row, maxPixels) {
  var total = row.reduce(function(width, word) { return width + wordWidth(word) }, 0);
  if(total > maxPixels)
    return 10000; // can't go over
  return maxPixels - total;  
}

function partitionCost(partition, maxPixels) {
  var cost = 0;
  for(var i = 0; i < partition.length; i++) 
    cost = Math.max(lineCost(partition[i], maxPixels), cost);
  return cost;
}

function wordWidth(word) {
  var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
  var context = canvas.getContext("2d");
  context.font = "15px sans-serif";
  return context.measureText(word).width;
}

/* intelligent word-wrapping, for short text only */
function getLines(text, maxPixels) {
  if(themefontsizechangerrainbowc.getFirefoxVersion() < 3.5)
    return [text]; // no measureText support

  var words = text.split(/\s+/);
  var partitions = allPartitions(words);
  var minCost = 100000;
  for(var i = 0; i < partitions.length; i++) {
    var cost = partitionCost(partitions[i], maxPixels);
    if(cost < minCost) {
      minCost = cost;
      var bestPartition = partitions[i];
    }
  }
  return bestPartition.map(function(row) {return row.join(" ")});
}
