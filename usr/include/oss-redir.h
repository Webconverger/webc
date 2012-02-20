#ifndef __OSS_REDIR_H
/*
 *  OSS Redirector
 *  Copyright (c) by Jaroslav Kysela <perex@perex.cz>
 *
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, write to the Free Software
 *   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307 USA
 *
 */

#include <sys/select.h>
#include <sys/types.h>

struct pollfd;

#define OSS_WAIT_EVENT_READ	(1<<0)
#define OSS_WAIT_EVENT_WRITE	(1<<1)
#define OSS_WAIT_EVENT_ERROR	(1<<2)

#ifdef __cplusplus
extern "C" {
#endif

extern int oss_pcm_open(const char *pathname, int flags, ...);
extern int oss_pcm_close(int fd);
extern int (*oss_pcm_nonblock)(int fd, int nonblock);
extern ssize_t (*oss_pcm_read)(int fd, void *buf, size_t count);
extern ssize_t (*oss_pcm_write)(int fd, const void *buf, size_t count);
extern void * (*oss_pcm_mmap)(void *start, size_t length, int prot, int flags, int fd, off_t offset);
extern int (*oss_pcm_munmap)(void *start, size_t length);
extern int (*oss_pcm_ioctl)(int fd, unsigned long int request, ...);
extern int (*oss_pcm_select_prepare)(int fd, int fmode, fd_set *readfds, fd_set *writefds, fd_set *exceptfds);
extern int (*oss_pcm_select_result)(int fd, fd_set *readfds, fd_set *writefds, fd_set *exceptfds);
extern int (*oss_pcm_poll_fds)(int fd);
extern int (*oss_pcm_poll_prepare)(int fd, int fmode, struct pollfd *ufds);
extern int (*oss_pcm_poll_result)(int fd, struct pollfd *ufds);

extern int oss_mixer_open(const char *pathname, int flags, ...);
extern int oss_mixer_close(int fd);
extern int (*oss_mixer_ioctl)(int fd, unsigned long int request, ...);

#ifdef __cplusplus
}
#endif

#endif /* __OSS_REDIR_H */
