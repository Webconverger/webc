/* ----------------------------------------------------------------------- *
 *
 *   Copyright 2007-2008 H. Peter Anvin - All Rights Reserved
 *
 *   Permission is hereby granted, free of charge, to any person
 *   obtaining a copy of this software and associated documentation
 *   files (the "Software"), to deal in the Software without
 *   restriction, including without limitation the rights to use,
 *   copy, modify, merge, publish, distribute, sublicense, and/or
 *   sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following
 *   conditions:
 *
 *   The above copyright notice and this permission notice shall
 *   be included in all copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *   OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *   HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *   WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *   OTHER DEALINGS IN THE SOFTWARE.
 *
 * ----------------------------------------------------------------------- */

#ifndef _SYSLINUX_FEATURES_H
#define _SYSLINUX_FEATURES_H

#define SYSLINUX_FEATURE_LOCAL_BOOT	(0*8+0)
#define SYSLINUX_FEATURE_NOOP_IDLE	(0*8+1)

extern struct __syslinux_feature_flags {
    unsigned int len;
    const unsigned char *ptr;
} __syslinux_feature_flags;

static inline int syslinux_has_feature(unsigned int __flag)
{
    unsigned int __byte = __flag >> 3;
    unsigned int __bit = __flag & 7;

    if (__byte <= __syslinux_feature_flags.len)
	return (__syslinux_feature_flags.ptr[__byte] >> __bit) & 1;
    else
	return 0;
}

#endif /* _SYSLINUX_FEATURE_H */
