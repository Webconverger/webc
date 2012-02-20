/*
 * sys/times.h
 */

#ifndef _SYS_TIMES_H
#define _SYS_TIMES_H

#include <stdint.h>

struct tms {
    /* Empty */
};

#define HZ		1000
#define CLK_TCK		HZ

typedef uint32_t clock_t;

clock_t times(struct tms *);

#endif /* _SYS_TIMES_H */
