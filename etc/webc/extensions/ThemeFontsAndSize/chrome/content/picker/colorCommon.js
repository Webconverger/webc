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
var colorCommon = {
  abbRegex : /^#?([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
  hexRegex : /^#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
  rgbRegex : /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([10]?\.?\d*)\s*)?\)/,
  perRegex : /^rgba?\(\s*(\d{1,3}\.?\d?)\%\s*,\s*(\d{1,3}\.?\d?)\%\s*,\s*(\d{1,3}\.?\d?)\%\s*(?:,\s*([10]?\.?\d*)\s*)?\)/,
  hslRegex : /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3}\.?\d?)%\s*,\s*(\d{1,3}\.?\d?)%\s*(?:,\s*([10]?\.?\d*)\s*)?\)/,
  hsvRegex : /^hsv\(\s*(\d{1,3})\s*,\s*(\d{1,3}\.?\d?)%\s*,\s*(\d{1,3}\.?\d?)%\s*(?:,\s*([10]?\.?\d*)\s*)?\)/,
  keywordRegex : /(\D+)/,

  toRgb : function(color) {
    var values = this.rgbValues(color);
    var alpha = this.alphaValue(color);
    str = "rgb(" + values['red'] + ", " + values['green'] + ", " + values['blue'];
    /* if(alpha != 1)
       str += ", " + alpha; */
    return str + ")";    
  },

  toHex : function(color) {
    var values = this.rgbValues(color); 
    return "#" + this.hexDouble(values['red']) + this.hexDouble(values['green'])
               + this.hexDouble(values['blue']);
  },

  toPlain : function(color) {
    return this.toHex(color).slice(1);
  },

  toPercent : function(color, whole) {
    var values = this.rgbValues(color);
    var r = whole ? Math.round(values['red']/255 * 100) : Math.round(values['red']/ 255 * 1000)/10;
    var g = whole ? Math.round(values['green']/255 * 100) : Math.round(values['green']/255 * 1000)/10;
    var b = whole ? Math.round(values['blue']/255 * 100) : Math.round(values['blue']/255 * 1000)/10;
    return "rgb(" + r + "%, " + g + "%, " + b + "%)";   
  },

  toHsl : function(color, whole) {
    var values = this.hslValues(color, whole);
    return "hsl(" + values['hue'] + ", " + values['sat']  +
                 "%, " + values['light'] + "%)";
  },

  toHsv : function(color) {
    var values = this.hsvValues(color);
    return "hsv(" + values['hue'] + ", " + values['satv']  +
                 "%, " + values['val'] + "%)";
  },

  toRgbShort : function(color) {
    var values = this.rgbValues(color);
    return "rgb(" + values['red'] + "," + values['green'] + "," + values['blue'] + ")";    
  },

  toPercentShort : function(color) {
    var values = this.rgbValues(color);
    var r = Math.round(values['red']/ 255 * 100);
    var g = Math.round(values['green']/255 * 100);
    var b = Math.round(values['blue']/255 * 100);
    return "rgb(" + r + "%," + g + "%," + b + "%)";   
  },

  toHslShort : function(color) {
    var values = this.hslValues(color);
    return "hsl(" + values['hue'] + "," + Math.round(values['sat']) + "%" + 
                 "," + Math.round(values['light']) + "%" +  ")";
  },

  toHsvShort : function(color) {
    var values = this.hsvValues(color);
    return "hsv(" + values['hue'] + "," + Math.round(values['satv'])  +
                 "," + Math.round(values['val']) + ")";
  },

  formatColor : function(color, format, whole) {
     switch(format) {
       case 'hex':
         return this.toHex(color);
       case 'plain':
         return this.toPlain(color);
       case 'rgb':
         return this.toRgb(color);
       case 'per':
         return this.toPercent(color, whole);
       case 'hsl':
         return this.toHsl(color, whole);
       default:
         return this.toHex(color);
    }
  },

  hslString : function(h, s, l) {
     return "hsl(" + h + ", " + s  +
                 "%, " + l + "%)";
  },

  hsvString : function(h, s, v) {
     return "hsv(" + h + ", " + s  +
                 "%, " + v + "%)";
  },

  rgbString : function(r, g, b) {
     return "rgb(" + r + ", " + g + ", " + b + ")";    
  },

  isHex : function(color) {
    return color.match(this.hexRegex);
  },

  isHsl : function(color) {
    return color.match(this.hslRegex);
  },

  isRgb : function(color) {
    return color.match(this.rgbRegex);
  },

  isPer : function(color) {
    return color.match(this.perRegex);
  },

  getFormat : function(color) {
    if(this.isHex(color))
      return 'hex';
    else if(this.isPer(color))
      return 'per';
    else if(this.isHsl(color))
      return 'hsl';
    else if(this.isRgb(color))
      return 'rgb';
    else
      return 'hex';
  },

  hslValues : function(color, whole) {
    /* returns {360, 100, 100} */
    var hslExp = color.match(this.hslRegex);
    if(hslExp) {
      if(whole) {
        return {
          hue : parseInt(hslExp[1]),
          sat : Math.round(parseFloat(hslExp[2])),
          light : Math.round(parseFloat(hslExp[3]))
        };
      }
      return {
        hue : parseInt(hslExp[1]),
        sat : parseFloat(hslExp[2]),
        light : parseFloat(hslExp[3])
      };
    }

    /* thank you http://130.113.54.154/~monger/hsl-rgb.html */
    var h, s, l;
    var values = this.rgbValues(color);
    var r = values['red']/ 255;
    var g = values['green']/255;
    var b = values['blue']/255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
  
    if(max == min)
      h = 0;
	  else if(r == max) 
      h = (g - b)/ delta; 
    else if(g == max)
      h = 2 + (b - r) / delta; 
    else if(b == max)
      h = 4 + (r - g)/ delta;

    h = Math.min(Math.round(h * 60), 360);

    if(h < 0) 
      h += 360;

    l = (min + max) / 2;
  
    if(max == min)
      s = 0;
    else if(l <= 0.5)
      s = delta/(max + min);
    else
      s = delta/(2 - max - min);

    if(whole)
      return { hue: h, sat : Math.round(s * 100), light : Math.round(l * 100) }; 
    return { hue: h, sat: Math.round(s * 1000)/10, light: Math.round(l * 1000)/10 };
  },

  hsvValues : function(color, whole) {
    var hsvExp = color.match(this.hsvRegex);
    if(hsvExp) {
      if(whole) {
        return { hue: parseInt(hsvExp[1]),
                 satv: Math.round(parseFloat(hsvExp[2])),
                 val: Math.round(parseFloat(hsvExp[3]))};
     }
     return { hue: parseInt(hsvExp[1]),
              satv: parseFloat(hsvExp[2]),
              val: parseFloat(hsvExp[3])};
    }
    var h, s, v;
    var values = this.rgbValues(color);
    var r = values['red'];
    var g = values['green'];
    var b = values['blue'];

    var min = Math.min(r,g,b);
    var max = Math.max(r,g,b);
    var delta = max - min;

    if(max == 0)
      s = 0;
    else
	    s = Math.round(delta/max * 1000)/10;

    if(max == min)
      h = 0;
	  else if(r == max) 
      h = (g - b)/ delta; 
    else if(g == max)
      h = 2 + (b - r) / delta; 
    else if(b == max)
      h = 4 + (r - g)/ delta;

    h = Math.min(Math.round(h * 60), 360);

    if(h < 0) 
      h += 360;

    v = Math.round((max/255)*1000)/10;

    if(whole)
      return { hue : h, satv : Math.round(s), val : Math.round(v) };
    return { hue: h, satv: s, val: v };
  },
  
  rgbValues : function(color) {
    /* returns {red : 255, green: 255, blue: 255} */
    var rgbExp = color.match(this.rgbRegex);
    if(rgbExp) {
      return {
        red: parseInt(rgbExp[1]),
        green: parseInt(rgbExp[2]),
        blue: parseInt(rgbExp[3])
      };
    }
    var hexExp = color.match(this.hexRegex);
    if(hexExp) {
      return {
        red: parseInt(hexExp[1], 16),
        green: parseInt(hexExp[2], 16),
        blue: parseInt(hexExp[3], 16)
      };
    }
    var abbExp = color.match(this.abbRegex);
    if(abbExp) {
      return {
        red: parseInt(abbExp[1] + abbExp[1], 16),
        green: parseInt(abbExp[2] + abbExp[2], 16),
        blue: parseInt(abbExp[3] + abbExp[3], 16)
      };
    }
    var perExp = color.match(this.perRegex);
    if(perExp) {
      return {
        red : Math.round(parseFloat(perExp[1]) / 100 * 255),
        green : Math.round(parseFloat(perExp[2]) / 100 * 255),
        blue : Math.round(parseFloat(perExp[3]) / 100 * 255)
      };
    } 
    var hslExp = color.match(this.hslRegex);
    if(hslExp) {
      var t1, t2, t3, retval;
      var h = parseInt(hslExp[1]) / 360;
      var s = parseFloat(hslExp[2]) / 100;
      var l = parseFloat(hslExp[3]) / 100;
    
      if(s == 0) {
        let val = Math.round(l * 255);
        return {
          red: val,
          green : val,
          blue : val
        }
      }
   
      if(l < 0.5)
        t2 = l * (1 + s);
      else
        t2 = l + s - l * s;

      t1 = 2 * l - t2;
   
      t3 = {
        red:  h + 1/3,
        green:  h,
        blue : h - 1/3
      };

      retval = {
        red:  0,
        green:  0,
        blue : 0
      };

      for(t in t3) {
        let val = t3[t];
        if(val < 0)
          val = val + 1;
        if(val > 1)
          val = val - 1;

        if(6 * val < 1)
          retval[t] = t1 + (t2 - t1) * 6 * val;
        else if(2 * val < 1)
          retval[t] = t2;
        else if(3 * val < 2)
          retval[t] = t1 + (t2 - t1) * (2/3 - val) * 6;
        else
          retval[t] = t1;

        retval[t] = Math.round(retval[t] * 255);
      }
      return retval;
    }

    var hsvExp = color.match(this.hsvRegex);
    if(hsvExp) {
      var r, g, b;
      var h = parseInt(hsvExp[1]);
      var s = parseFloat(hsvExp[2]) / 100;
      var v = parseFloat(hsvExp[3]) / 100;
      var hi = Math.floor(h / 60) % 6;

      var f = h/60 - Math.floor(h/60);
      var p = Math.round(255 * v * (1 - s));
      var q = Math.round(255 * v * (1 - (s * f)));
      var t = Math.round(255 * v * (1 - (s * (1 - f))));
      var v = Math.round(255 * v);

      switch(hi) {
        case 0:
          return {red: v, green: t, blue: p};
        case 1:
          return {red: q, green: v, blue: p};
        case 2:
          return {red: p, green: v, blue: t};
        case 3:
          return {red: p, green: q, blue: v};
        case 4:
          return {red: t, green: p, blue: v};
        case 5:
          return {red: v, green: p, blue: q};
        default:
          throw "InvalidColorValue " + color;
      }
    }
    var keywordExp = color.match(this.keywordRegex);
    if(keywordExp) {
      if(this.cssKeywords[keywordExp[1]])
        return this.rgbValues(this.cssKeywords[keywordExp[1]]);
      return;
    }
    else throw "InvalidColorValue " + color;
  },

  alphaValue : function(color) {
    if(this.hexRegex.test(color))
      return 1;
    if(this.abbRegex.test(color))
      return 1;

    var rgbExp = color.match(this.rgbRegex);
    if(rgbExp) {
      if(rgbExp.length > 4)
        return parseFloat(rgbExp[4])
      else
        return 0;
    }
    var perExp = color.match(this.perRegex);
    if(perExp) {
      if(perExp.length > 4)
        return parseFloat(perExp[4])
      else
        return 0;
    } 
    var hslExp = color.match(this.hslRegex);
    if(hslExp) {
      if(hslExp.length > 4)
        return parseFloat(hslExp[4])
      else
        return 0;
    }
    var hsvExp = color.match(this.hsvRegex);
    if(hsvExp) {
      if(hsvExp.length > 4)
        return parseFloat(hsvExp[4])
      else
        return 0;
    }
    if(this.keywordRegex.test(color))
      return 1;
    else throw "InvalidColorValue " + color;
  },

  isValid : function(color) {
    try {
      var values = this.rgbValues(color);
    
      var r = values['red'];
      var g = values['green'];
      var b = values['blue'];
      if (r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0)
	      return false;
      return true;
    }
    catch(e) {
      return false;
    }
  },

  luminosity : function(color) {
    var values = this.rgbValues(color);

    var r = values['red'] / 255;
    var g = values['green'] / 255;
    var b = values['blue'] / 255;
    var red = (r <= 0.03928) ? r/12.92 : Math.pow(((r + 0.055)/1.055), 2.4);
    var green = (g <= 0.03928) ? g/12.92 : Math.pow(((g + 0.055)/1.055), 2.4);
    var blue = (b <= 0.03928) ? b/12.92 : Math.pow(((b + 0.055)/1.055), 2.4);

    // w3c recommended wcag 2.0 relative luminance
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  },

  contrast : function(color1, color2) {
    var lum1 = this.luminosity(color1);
    var lum2 = this.luminosity(color2);
    if(lum1 > lum2)
      return (lum1 + 0.05) / (lum2 + 0.05);
    return (lum2 + 0.05) / (lum1 + 0.05);
  },

  goodContrast : function(color1, color2) {
    return this.contrast(color1, color2) > 10 ? true : false;
  },

  blackText : function(color) {
    //return (this.luminosity(color) > .40) ? true : false;
    return (this.contrast(color, "#000000") > this.contrast(color, "#ffffff")) 
          && this.luminosity(color) > .21 ? true : false;
  },
 
  merge : function(color1, color2) {
    var rgb1 = this.rgbValues(color1);
    var rgb2 = this.rgbValues(color2);
    var r = Math.round((rgb1["red"] + rgb2["red"] )/ 2);
    var g = Math.round((rgb1["green"] + rgb2["green"] )/ 2);
    var b = Math.round((rgb1["blue"] + rgb2["blue"] )/ 2);
    return this.rgbString(r, g, b);
  },

  distanceLAB : function(color1, color2) {
    var rgb1 = this.rgbValues(color1);
    var col1 = convertRGBtoLAB(rgb1.red, rgb1.green, rgb1.blue);
    var rgb2 = this.rgbValues(color2);
    var col2 = convertRGBtoLAB(rgb2.red, rgb2.green, rgb2.blue);
    return Math.sqrt(Math.pow(col2[0] - col1[0], 2) + Math.pow(col2[1] - col1[1], 2) + Math.pow(col2[2] - col1[2], 2));
  },

  distanceLCH : function(color1, color2) {
    var rgb1 = this.rgbValues(color1);
    var lch1 = convertRGBtoLCH(rgb1.red, rgb1.green, rgb1.blue);
    var rgb2 = this.rgbValues(color2);
    var lch2 = convertRGBtoLCH(rgb2.red, rgb2.green, rgb2.blue);
    return Math.sqrt(Math.pow(lch2[0] - lch1[0], 2) + Math.pow((lch2[1] - lch1[1]), 2) + Math.pow((lch2[2] - lch1[2]), 2));
  },
 
  isEdge : function(color1, color2) {
    var diff = this.distance(color1, color2);
    if(diff > 25)
      return true;
    return false;
  },

  hexDouble : function(num) {
    var hexStr = num.toString(16).toUpperCase();
    return (hexStr.length < 2) ? "0" + hexStr : hexStr;   
  },

  fromBits : function(color) {
    return this.rgbString(color >> 16, color >> 8 & 0xff, color & 0xff);
  },

  cssKeywords : {
    aliceblue :	'#f0f8ff',
    antiquewhite  : '#faebd7',
    aqua  : '#00ffff',
    aquamarine  : '#7fffd4',
    azure  : '#f0ffff',
    beige  : '#f5f5dc',
    bisque  : '#ffe4c4',
    black  : '#000000',
    blanchedalmond  : 	'#ffebcd',
    blue  : '#0000ff',
    blueviolet  : '#8a2be2',
    brown  : '#a52a2a',
    burlywood  : '#deb887',
    cadetblue  : '#5f9ea0',
    chartreuse  : '#7fff00',
    chocolate  : '#d2691e',
    coral  : '#ff7f50',
    cornflowerblue  : '#6495ed',
    cornsilk  : '#fff8dc',
    crimson  : '#dc143c',
    cyan  : '#00ffff',
    darkblue  : '#00008b',
    darkcyan  : '#008b8b',
    darkgoldenrod  : '#b8860b',
    darkgray  : '#a9a9a9',
    darkgreen  : '#006400',
    darkgrey  : '#a9a9a9',
    darkkhaki  : '#bdb76b',
    darkmagenta  : '#8b008b',
    darkolivegreen  : '#556b2f',
    darkorange  : '#ff8c00',
    darkorchid  : '#9932cc',
    darkred  : '#8b0000',
    darksalmon  : '#e9967a',
    darkseagreen  : '#8fbc8f',
    darkslateblue  : '#483d8b',
    darkslategray  : '#2f4f4f',
    darkslategrey  : '#2f4f4f',
    darkturquoise  : '#00ced1',
    darkviolet  : '#9400d3',
    deeppink  : '#ff1493',
    deepskyblue  : '#00bfff',
    dimgray  : '#696969',
    dimgrey  : '#696969',
    dodgerblue  : '#1e90ff',
    firebrick  : '#b22222',
    floralwhite  : '#fffaf0',
    forestgreen  : '#228b22',
    fuchsia  : '#ff00ff',
    gainsboro :	'#dcdcdc',
  	ghostwhite  : '#f8f8ff',
    gold  : '#ffd700',
    goldenrod  : '#daa520',
    gray  : '#808080',
    green  : '#008000',
    greenyellow  : '#adff2f',
    grey  : '#808080',
    honeydew  : '#f0fff0',
    hotpink  : '#ff69b4',
    indianred  : '#cd5c5c',
    indigo  : '#4b0082',
    ivory  : '#fffff0',
    khaki  : '#f0e68c',
    lavender  : '#e6e6fa',
    lavenderblush  : '#fff0f5',
    lawngreen  : '#7cfc00',
    lemonchiffon :	'#fffacd',
  	lightblue  : '#add8e6',
    lightcoral  : '#f08080',
    lightcyan  : '#e0ffff',
    lightgoldenrodyellow  : '#fafad2',
    lightgray  : '#d3d3d3',
    lightgreen  : '#90ee90',
    lightgrey  : '#d3d3d3',
    lightpink  : '#ffb6c1',
    lightsalmon  : '#ffa07a',
    lightseagreen  : '#20b2aa',
    lightskyblue  : '#87cefa',
    lightslategray  : '#778899',
    lightslategrey  : '#778899',
    lightsteelblue  : '#b0c4de',
    lightyellow  : '#ffffe0',
    lime  : '#00ff00',
    limegreen  : '#32cd32',
    linen  : '#faf0e6',
    magenta  : '#ff00ff',
    maroon  : '#800000',
    mediumaquamarine  : '#66cdaa',
    mediumblue  : '#0000cd',
    mediumorchid  : '#ba55d3',
    mediumpurple  : '#9370db',
    mediumseagreen  : '#3cb371',
    mediumslateblue  : '#7b68ee',
    mediumspringgreen  : '#00fa9a',
    mediumturquoise  : '#48d1cc',
    mediumvioletred  : '#c71585',
    midnightblue  : '#191970',
    mintcream  : '#f5fffa',
    mistyrose  : '#ffe4e1',
    moccasin  : '#ffe4b5',
    navajowhite : '#ffdead',
  	navy  : '#000080',
    oldlace  : '#fdf5e6',
    olive  : '#808000',
    olivedrab  : '#6b8e23',
    orange  : '#ffa500',
    orangered  : '#ff4500',
    orchid  : '#da70d6',
    palegoldenrod  : '#eee8aa',
    palegreen  : '#98fb98',
    paleturquoise :	'#afeeee',
  	palevioletred  : '#db7093',
    papayawhip  : '#ffefd5',
    peachpuff  : '#ffdab9',
    peru  : '#cd853f',
    pink  : '#ffc0cb',
    plum  : '#dda0dd',
    powderblue  : '#b0e0e6',
    purple  : '#800080',
    red  : '#ff0000',
    rosybrown  : '#bc8f8f',
    royalblue  : '#4169e1',
    saddlebrown  : '#8b4513',
    salmon  : '#fa8072',
    sandybrown  : '#f4a460',
    seagreen  : '#2e8b57',
    seashell  : '#fff5ee',
    sienna  : '#a0522d',
    silver  : '#c0c0c0',
    skyblue  : '#87ceeb',
    slateblue  : '#6a5acd',
    slategray  : '#708090',
    slategrey  : '#708090',
    snow :	'#fffafa',
  	springgreen  : '#00ff7f',
    steelblue  : '#4682b4',
    tan  : '#d2b48c',
    teal  : '#008080',
    thistle  : '#d8bfd8',
    tomato  : '#ff6347',
    turquoise  : '#40e0d0',
    violet  : '#ee82ee',
    wheat  : '#f5deb3',
    white  : '#ffffff',
  	whitesmoke  : '#f5f5f5',
    yellow  : '#ffff00',
    yellowgreen  : '#9acd32'
  }

}
