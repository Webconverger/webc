
function getFont(element) {
  // create canvas in owner doc to get @font-face fonts
  var doc = element.ownerDocument;
  var canvas = doc.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
  var context = canvas.getContext("2d");

  if(!context.measureText)
    return "Text";

  var style = doc.defaultView.getComputedStyle(element, null);
  var fonts = style.fontFamily.split(',');

  for(var i = 0; i < fonts.length; i++)
    if(testFont(fonts[i], context))
      return fonts[i];
  return "serif";
}

function testFont(font, context) {
  var testString = "abcdefghijklmnopqrstuvwxyz";

  context.font = "400px serif";
  var defaultWidth = context.measureText(testString).width;

  context.font = "400px " + font;
  var fontWidth = context.measureText(testString).width;

  if(defaultWidth == fontWidth)
    return false;
  return true;
}
