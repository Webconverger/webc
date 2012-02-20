#ifndef _NETINET_IN_H
#define _NETINET_IN_H

/* COM32 will be running on an i386 platform */

#include <stdint.h>
#include <klibc/compiler.h>
#include <klibc/extern.h>

#define __htons_macro(v) ((uint16_t)		  			\
			  (((uint16_t)(v) << 8) | 			\
			   ((uint16_t)(v) >> 8)))

static inline __constfunc uint16_t __htons(uint16_t v)
{
    return __htons_macro(v);
}

#define htons(x) (__builtin_constant_p(x) ? __htons_macro(x) :  __htons(x))
#define ntohs(x) htons(x)

#define __htonl_macro(v) ((uint32_t)					\
                          ((((uint32_t)(v) & 0x000000ff) << 24) |	\
			   (((uint32_t)(v) & 0x0000ff00) << 8)  |	\
			  (((uint32_t)(v) & 0x00ff0000) >> 8)  |	\
			   (((uint32_t)(v) & 0xff000000) >> 24)))

static inline __constfunc uint32_t __htonl(uint32_t v)
{
    asm("xchgb %h0,%b0 ; roll $16,%0 ; xchgb %h0,%b0"
	: "+q" (v));
    return v;
}

#define htonl(x) (__builtin_constant_p(x) ? __htonl_macro(x) : __htonl(x))
#define ntohl(x) htonl(x)

#define __htonq_macro(v) ((uint64_t)					\
    (((uint64_t)__htonl_macro((uint32_t)(v)) << 32) |			\
     (__htonl_macro((uint32_t)((uint64_t)(v) >> 32)))))

static inline __constfunc uint64_t __htonq(uint64_t v)
{
    return ((uint64_t)__htonl(v) << 32) | __htonl(v >> 32);
}

#define htonq(x) (__builtin_constant_p(x) ? __htonq_macro(x) :  __htonq(x))
#define ntohq(x) htonq(x)

typedef uint32_t in_addr_t;
typedef uint16_t in_port_t;

struct in_addr {
    in_addr_t s_addr;
};

__extern char *inet_ntoa(struct in_addr);

#endif /* _NETINET_IN_H */
