require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_TYPES_H)) {
    die("Never include <bits/typesizes.h> directly; use <sys/types.h> instead.");
}
unless(defined(&_BITS_TYPESIZES_H)) {
    eval 'sub _BITS_TYPESIZES_H () {1;}' unless defined(&_BITS_TYPESIZES_H);
    eval 'sub __DEV_T_TYPE () { &__UQUAD_TYPE;}' unless defined(&__DEV_T_TYPE);
    eval 'sub __UID_T_TYPE () { &__U32_TYPE;}' unless defined(&__UID_T_TYPE);
    eval 'sub __GID_T_TYPE () { &__U32_TYPE;}' unless defined(&__GID_T_TYPE);
    eval 'sub __INO_T_TYPE () { &__ULONGWORD_TYPE;}' unless defined(&__INO_T_TYPE);
    eval 'sub __INO64_T_TYPE () { &__UQUAD_TYPE;}' unless defined(&__INO64_T_TYPE);
    eval 'sub __MODE_T_TYPE () { &__U32_TYPE;}' unless defined(&__MODE_T_TYPE);
    eval 'sub __NLINK_T_TYPE () { &__UWORD_TYPE;}' unless defined(&__NLINK_T_TYPE);
    eval 'sub __OFF_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__OFF_T_TYPE);
    eval 'sub __OFF64_T_TYPE () { &__SQUAD_TYPE;}' unless defined(&__OFF64_T_TYPE);
    eval 'sub __PID_T_TYPE () { &__S32_TYPE;}' unless defined(&__PID_T_TYPE);
    eval 'sub __RLIM_T_TYPE () { &__ULONGWORD_TYPE;}' unless defined(&__RLIM_T_TYPE);
    eval 'sub __RLIM64_T_TYPE () { &__UQUAD_TYPE;}' unless defined(&__RLIM64_T_TYPE);
    eval 'sub __BLKCNT_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__BLKCNT_T_TYPE);
    eval 'sub __BLKCNT64_T_TYPE () { &__SQUAD_TYPE;}' unless defined(&__BLKCNT64_T_TYPE);
    eval 'sub __FSBLKCNT_T_TYPE () { &__ULONGWORD_TYPE;}' unless defined(&__FSBLKCNT_T_TYPE);
    eval 'sub __FSBLKCNT64_T_TYPE () { &__UQUAD_TYPE;}' unless defined(&__FSBLKCNT64_T_TYPE);
    eval 'sub __FSFILCNT_T_TYPE () { &__ULONGWORD_TYPE;}' unless defined(&__FSFILCNT_T_TYPE);
    eval 'sub __FSFILCNT64_T_TYPE () { &__UQUAD_TYPE;}' unless defined(&__FSFILCNT64_T_TYPE);
    eval 'sub __ID_T_TYPE () { &__U32_TYPE;}' unless defined(&__ID_T_TYPE);
    eval 'sub __CLOCK_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__CLOCK_T_TYPE);
    eval 'sub __TIME_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__TIME_T_TYPE);
    eval 'sub __USECONDS_T_TYPE () { &__U32_TYPE;}' unless defined(&__USECONDS_T_TYPE);
    eval 'sub __SUSECONDS_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__SUSECONDS_T_TYPE);
    eval 'sub __DADDR_T_TYPE () { &__S32_TYPE;}' unless defined(&__DADDR_T_TYPE);
    eval 'sub __SWBLK_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__SWBLK_T_TYPE);
    eval 'sub __KEY_T_TYPE () { &__S32_TYPE;}' unless defined(&__KEY_T_TYPE);
    eval 'sub __CLOCKID_T_TYPE () { &__S32_TYPE;}' unless defined(&__CLOCKID_T_TYPE);
    eval 'sub __TIMER_T_TYPE () { &void *;}' unless defined(&__TIMER_T_TYPE);
    eval 'sub __BLKSIZE_T_TYPE () { &__SLONGWORD_TYPE;}' unless defined(&__BLKSIZE_T_TYPE);
    eval 'sub __FSID_T_TYPE () {1; };}' unless defined(&__FSID_T_TYPE);
    eval 'sub __SSIZE_T_TYPE () { &__SWORD_TYPE;}' unless defined(&__SSIZE_T_TYPE);
    eval 'sub __FD_SETSIZE () {1024;}' unless defined(&__FD_SETSIZE);
}
1;
