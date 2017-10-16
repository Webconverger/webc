/*
 * Copyright (c) 2008 Ted Mielczarek
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */

var EXPORTED_SYMBOLS = ["Crasher"];

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

let Crasher = {
  CRASH_NULL_POINTER_DEREF: 0,
  CRASH_NULL_POINTER_FNCALL: 1,
  CRASH_DIVIDE_BY_ZERO: 2,
  CRASH_STACK_OVERFLOW: 3,
  CRASH_PURE_VIRTUAL_CALL: 4,
  CRASH_INVALID_CRT_PARAM: 5,
  CRASH_OBJC_EXCEPTION: 6,
};

XPCOMUtils.defineLazyGetter(Crasher, "crash", function () {
  Components.utils.import("resource://gre/modules/ctypes.jsm");
  var dir = __LOCATION__.parent.parent;
  var file = dir.clone();
  file.append(ctypes.libraryName("crashme"));
  if (!file.exists()) {
    // look in ABI dir
    file = dir.clone();
    file.append("platform");

    let xr = Components.classes["@mozilla.org/xre/app-info;1"]
               .getService(Components.interfaces.nsIXULRuntime);
    file.append(xr.OS + "_" + xr.XPCOMABI);
    file.append(ctypes.libraryName("crashme"));
  }
  var lib = ctypes.open(file.path);
  return lib.declare("Crash", ctypes.default_abi, ctypes.bool, ctypes.int32_t);
});
