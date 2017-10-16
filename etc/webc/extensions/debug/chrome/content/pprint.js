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
 * The Original Code is aboutSupport.xhtml.
 *
 * The Initial Developer of the Original Code is
 *  Mozilla Foundation.
 *
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Curtis Bartley <cbartley@mozilla.com>
 *   Heather Arthur <fayearthur@gmail.com>
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

var nightlyPPrint = {

// Return the plain text representation of an element.  Do a little bit
// of pretty-printing to make it human-readable.
createTextForElement : function(elem) {
  // Generate the initial text.
  let textFragmentAccumulator = [];
  nightlyPPrint.generateTextForElement(elem, "", textFragmentAccumulator);
  let text = textFragmentAccumulator.join("");

  // Trim extraneous whitespace before newlines, then squash extraneous
  // blank lines.
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n\n\n+/g, "\n\n");

  return text;
},

generateTextForElement : function(elem, indent, textFragmentAccumulator) {
  // Add a little extra spacing around most elements.
  if (elem.tagName != "td")
    textFragmentAccumulator.push("\n");

  // Generate the text representation for each child node.
  let node = elem.firstChild;
  while (node) {

    if (node.nodeType == Node.TEXT_NODE) {
      // Text belonging to this element uses its indentation level.
      nightlyPPrint.generateTextForTextNode(node, indent, textFragmentAccumulator);
    }
    else if (node.nodeType == Node.ELEMENT_NODE) {
      // Recurse on the child element with an extra level of indentation.
      nightlyPPrint.generateTextForElement(node, indent + "  ", textFragmentAccumulator);
    }

    // Advance!
    node = node.nextSibling;
  }
},

generateTextForTextNode : function(node, indent, textFragmentAccumulator) {
  // If the text node is the first of a run of text nodes, then start
  // a new line and add the initial indentation.
  let prevNode = node.previousSibling;
  if (!prevNode || prevNode.nodeType == Node.TEXT_NODE)
    textFragmentAccumulator.push("\n" + indent);

  // Trim the text node's text content and add proper indentation after
  // any internal line breaks.
  let text = node.textContent.trim().replace("\n", "\n" + indent, "g");
  textFragmentAccumulator.push(text);
}

}