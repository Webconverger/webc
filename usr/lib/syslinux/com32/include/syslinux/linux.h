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

/*
 * syslinux/linux.h
 *
 * Definitions used to boot a Linux kernel
 */

#ifndef _SYSLINUX_LINUX_H
#define _SYSLINUX_LINUX_H

#include <stddef.h>
#include <stdint.h>

/* A chunk of an initramfs.  These are kept as a doubly-linked
   circular list with headnode; the headnode is distinguished by
   having len == 0.  The data pointer can be NULL if data_len is zero;
   if data_len < len then the balance of the region is zeroed. */

struct initramfs {
    struct initramfs *prev, *next;
    size_t len;
    size_t align;
    const void *data;
    size_t data_len;
};
#define INITRAMFS_MAX_ALIGN	4096

int syslinux_boot_linux(void *kernel_buf, size_t kernel_size,
			struct initramfs *initramfs, char *cmdline);

/* Initramfs manipulation functions */

struct initramfs *initramfs_init(void);
int initramfs_add_data(struct initramfs *ihead, const void *data,
		       size_t data_len, size_t len, size_t align);
int initramfs_mknod(struct initramfs *ihead, const char *filename,
		    int do_mkdir,
		    uint16_t mode, size_t len, uint32_t major, uint32_t minor);
int initramfs_add_file(struct initramfs *ihead, const void *data,
		       size_t data_len, size_t len,
		       const char *filename, int do_mkdir, uint32_t mode);
int initramfs_load_file(struct initramfs *ihead, const char *src_filename,
			const char *dst_filename, int do_mkdir, uint32_t mode);
int initramfs_add_trailer(struct initramfs *ihead);
int initramfs_load_archive(struct initramfs *ihead, const char *filename);

#endif /* _SYSLINUX_LINUX_H */
