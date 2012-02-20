/*
 * setjmp.h
 */

#ifndef _SETJMP_H
#define _SETJMP_H

#include <klibc/extern.h>
#include <klibc/compiler.h>
#include <stddef.h>

#include <klibc/archsetjmp.h>

__extern int setjmp(jmp_buf);
__extern __noreturn longjmp(jmp_buf, int);

typedef jmp_buf sigjmp_buf;

#define sigsetjmp(__env, __save) setjmp(__env)
#define siglongjmp(__env, __val) longjmp(__env, __val)

#endif /* _SETJMP_H */
