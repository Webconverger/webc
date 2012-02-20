require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYSCALL_H)) {
    die("Never use <bits/syscall.h> directly; include <sys/syscall.h> instead.");
}
require 'bits/wordsize.ph';
unless(defined(&SYS__sysctl)) {
    sub SYS__sysctl () {	 &__NR__sysctl;}
}
unless(defined(&SYS_access)) {
    sub SYS_access () {	 &__NR_access;}
}
unless(defined(&SYS_acct)) {
    sub SYS_acct () {	 &__NR_acct;}
}
unless(defined(&SYS_add_key)) {
    sub SYS_add_key () {	 &__NR_add_key;}
}
unless(defined(&SYS_adjtimex)) {
    sub SYS_adjtimex () {	 &__NR_adjtimex;}
}
unless(defined(&SYS_afs_syscall)) {
    sub SYS_afs_syscall () {	 &__NR_afs_syscall;}
}
unless(defined(&SYS_alarm)) {
    sub SYS_alarm () {	 &__NR_alarm;}
}
unless(defined(&SYS_brk)) {
    sub SYS_brk () {	 &__NR_brk;}
}
unless(defined(&SYS_capget)) {
    sub SYS_capget () {	 &__NR_capget;}
}
unless(defined(&SYS_capset)) {
    sub SYS_capset () {	 &__NR_capset;}
}
unless(defined(&SYS_chdir)) {
    sub SYS_chdir () {	 &__NR_chdir;}
}
unless(defined(&SYS_chmod)) {
    sub SYS_chmod () {	 &__NR_chmod;}
}
unless(defined(&SYS_chown)) {
    sub SYS_chown () {	 &__NR_chown;}
}
unless(defined(&SYS_chroot)) {
    sub SYS_chroot () {	 &__NR_chroot;}
}
unless(defined(&SYS_clock_getres)) {
    sub SYS_clock_getres () {	 &__NR_clock_getres;}
}
unless(defined(&SYS_clock_gettime)) {
    sub SYS_clock_gettime () {	 &__NR_clock_gettime;}
}
unless(defined(&SYS_clock_nanosleep)) {
    sub SYS_clock_nanosleep () {	 &__NR_clock_nanosleep;}
}
unless(defined(&SYS_clock_settime)) {
    sub SYS_clock_settime () {	 &__NR_clock_settime;}
}
unless(defined(&SYS_clone)) {
    sub SYS_clone () {	 &__NR_clone;}
}
unless(defined(&SYS_close)) {
    sub SYS_close () {	 &__NR_close;}
}
unless(defined(&SYS_creat)) {
    sub SYS_creat () {	 &__NR_creat;}
}
unless(defined(&SYS_create_module)) {
    sub SYS_create_module () {	 &__NR_create_module;}
}
unless(defined(&SYS_delete_module)) {
    sub SYS_delete_module () {	 &__NR_delete_module;}
}
unless(defined(&SYS_dup)) {
    sub SYS_dup () {	 &__NR_dup;}
}
unless(defined(&SYS_dup2)) {
    sub SYS_dup2 () {	 &__NR_dup2;}
}
unless(defined(&SYS_dup3)) {
    sub SYS_dup3 () {	 &__NR_dup3;}
}
unless(defined(&SYS_epoll_create)) {
    sub SYS_epoll_create () {	 &__NR_epoll_create;}
}
unless(defined(&SYS_epoll_create1)) {
    sub SYS_epoll_create1 () {	 &__NR_epoll_create1;}
}
unless(defined(&SYS_epoll_ctl)) {
    sub SYS_epoll_ctl () {	 &__NR_epoll_ctl;}
}
unless(defined(&SYS_epoll_pwait)) {
    sub SYS_epoll_pwait () {	 &__NR_epoll_pwait;}
}
unless(defined(&SYS_epoll_wait)) {
    sub SYS_epoll_wait () {	 &__NR_epoll_wait;}
}
unless(defined(&SYS_eventfd)) {
    sub SYS_eventfd () {	 &__NR_eventfd;}
}
unless(defined(&SYS_eventfd2)) {
    sub SYS_eventfd2 () {	 &__NR_eventfd2;}
}
unless(defined(&SYS_execve)) {
    sub SYS_execve () {	 &__NR_execve;}
}
unless(defined(&SYS_exit)) {
    sub SYS_exit () {	 &__NR_exit;}
}
unless(defined(&SYS_exit_group)) {
    sub SYS_exit_group () {	 &__NR_exit_group;}
}
unless(defined(&SYS_faccessat)) {
    sub SYS_faccessat () {	 &__NR_faccessat;}
}
unless(defined(&SYS_fadvise64)) {
    sub SYS_fadvise64 () {	 &__NR_fadvise64;}
}
unless(defined(&SYS_fallocate)) {
    sub SYS_fallocate () {	 &__NR_fallocate;}
}
unless(defined(&SYS_fchdir)) {
    sub SYS_fchdir () {	 &__NR_fchdir;}
}
unless(defined(&SYS_fchmod)) {
    sub SYS_fchmod () {	 &__NR_fchmod;}
}
unless(defined(&SYS_fchmodat)) {
    sub SYS_fchmodat () {	 &__NR_fchmodat;}
}
unless(defined(&SYS_fchown)) {
    sub SYS_fchown () {	 &__NR_fchown;}
}
unless(defined(&SYS_fchownat)) {
    sub SYS_fchownat () {	 &__NR_fchownat;}
}
unless(defined(&SYS_fcntl)) {
    sub SYS_fcntl () {	 &__NR_fcntl;}
}
unless(defined(&SYS_fdatasync)) {
    sub SYS_fdatasync () {	 &__NR_fdatasync;}
}
unless(defined(&SYS_fgetxattr)) {
    sub SYS_fgetxattr () {	 &__NR_fgetxattr;}
}
unless(defined(&SYS_flistxattr)) {
    sub SYS_flistxattr () {	 &__NR_flistxattr;}
}
unless(defined(&SYS_flock)) {
    sub SYS_flock () {	 &__NR_flock;}
}
unless(defined(&SYS_fork)) {
    sub SYS_fork () {	 &__NR_fork;}
}
unless(defined(&SYS_fremovexattr)) {
    sub SYS_fremovexattr () {	 &__NR_fremovexattr;}
}
unless(defined(&SYS_fsetxattr)) {
    sub SYS_fsetxattr () {	 &__NR_fsetxattr;}
}
unless(defined(&SYS_fstat)) {
    sub SYS_fstat () {	 &__NR_fstat;}
}
unless(defined(&SYS_fstatfs)) {
    sub SYS_fstatfs () {	 &__NR_fstatfs;}
}
unless(defined(&SYS_fsync)) {
    sub SYS_fsync () {	 &__NR_fsync;}
}
unless(defined(&SYS_ftruncate)) {
    sub SYS_ftruncate () {	 &__NR_ftruncate;}
}
unless(defined(&SYS_futex)) {
    sub SYS_futex () {	 &__NR_futex;}
}
unless(defined(&SYS_futimesat)) {
    sub SYS_futimesat () {	 &__NR_futimesat;}
}
unless(defined(&SYS_get_kernel_syms)) {
    sub SYS_get_kernel_syms () {	 &__NR_get_kernel_syms;}
}
unless(defined(&SYS_get_mempolicy)) {
    sub SYS_get_mempolicy () {	 &__NR_get_mempolicy;}
}
unless(defined(&SYS_get_robust_list)) {
    sub SYS_get_robust_list () {	 &__NR_get_robust_list;}
}
unless(defined(&SYS_get_thread_area)) {
    sub SYS_get_thread_area () {	 &__NR_get_thread_area;}
}
unless(defined(&SYS_getcwd)) {
    sub SYS_getcwd () {	 &__NR_getcwd;}
}
unless(defined(&SYS_getdents)) {
    sub SYS_getdents () {	 &__NR_getdents;}
}
unless(defined(&SYS_getdents64)) {
    sub SYS_getdents64 () {	 &__NR_getdents64;}
}
unless(defined(&SYS_getegid)) {
    sub SYS_getegid () {	 &__NR_getegid;}
}
unless(defined(&SYS_geteuid)) {
    sub SYS_geteuid () {	 &__NR_geteuid;}
}
unless(defined(&SYS_getgid)) {
    sub SYS_getgid () {	 &__NR_getgid;}
}
unless(defined(&SYS_getgroups)) {
    sub SYS_getgroups () {	 &__NR_getgroups;}
}
unless(defined(&SYS_getitimer)) {
    sub SYS_getitimer () {	 &__NR_getitimer;}
}
unless(defined(&SYS_getpgid)) {
    sub SYS_getpgid () {	 &__NR_getpgid;}
}
unless(defined(&SYS_getpgrp)) {
    sub SYS_getpgrp () {	 &__NR_getpgrp;}
}
unless(defined(&SYS_getpid)) {
    sub SYS_getpid () {	 &__NR_getpid;}
}
unless(defined(&SYS_getpmsg)) {
    sub SYS_getpmsg () {	 &__NR_getpmsg;}
}
unless(defined(&SYS_getppid)) {
    sub SYS_getppid () {	 &__NR_getppid;}
}
unless(defined(&SYS_getpriority)) {
    sub SYS_getpriority () {	 &__NR_getpriority;}
}
unless(defined(&SYS_getresgid)) {
    sub SYS_getresgid () {	 &__NR_getresgid;}
}
unless(defined(&SYS_getresuid)) {
    sub SYS_getresuid () {	 &__NR_getresuid;}
}
unless(defined(&SYS_getrlimit)) {
    sub SYS_getrlimit () {	 &__NR_getrlimit;}
}
unless(defined(&SYS_getrusage)) {
    sub SYS_getrusage () {	 &__NR_getrusage;}
}
unless(defined(&SYS_getsid)) {
    sub SYS_getsid () {	 &__NR_getsid;}
}
unless(defined(&SYS_gettid)) {
    sub SYS_gettid () {	 &__NR_gettid;}
}
unless(defined(&SYS_gettimeofday)) {
    sub SYS_gettimeofday () {	 &__NR_gettimeofday;}
}
unless(defined(&SYS_getuid)) {
    sub SYS_getuid () {	 &__NR_getuid;}
}
unless(defined(&SYS_getxattr)) {
    sub SYS_getxattr () {	 &__NR_getxattr;}
}
unless(defined(&SYS_init_module)) {
    sub SYS_init_module () {	 &__NR_init_module;}
}
unless(defined(&SYS_inotify_add_watch)) {
    sub SYS_inotify_add_watch () {	 &__NR_inotify_add_watch;}
}
unless(defined(&SYS_inotify_init)) {
    sub SYS_inotify_init () {	 &__NR_inotify_init;}
}
unless(defined(&SYS_inotify_init1)) {
    sub SYS_inotify_init1 () {	 &__NR_inotify_init1;}
}
unless(defined(&SYS_inotify_rm_watch)) {
    sub SYS_inotify_rm_watch () {	 &__NR_inotify_rm_watch;}
}
unless(defined(&SYS_io_cancel)) {
    sub SYS_io_cancel () {	 &__NR_io_cancel;}
}
unless(defined(&SYS_io_destroy)) {
    sub SYS_io_destroy () {	 &__NR_io_destroy;}
}
unless(defined(&SYS_io_getevents)) {
    sub SYS_io_getevents () {	 &__NR_io_getevents;}
}
unless(defined(&SYS_io_setup)) {
    sub SYS_io_setup () {	 &__NR_io_setup;}
}
unless(defined(&SYS_io_submit)) {
    sub SYS_io_submit () {	 &__NR_io_submit;}
}
unless(defined(&SYS_ioctl)) {
    sub SYS_ioctl () {	 &__NR_ioctl;}
}
unless(defined(&SYS_ioperm)) {
    sub SYS_ioperm () {	 &__NR_ioperm;}
}
unless(defined(&SYS_iopl)) {
    sub SYS_iopl () {	 &__NR_iopl;}
}
unless(defined(&SYS_ioprio_get)) {
    sub SYS_ioprio_get () {	 &__NR_ioprio_get;}
}
unless(defined(&SYS_ioprio_set)) {
    sub SYS_ioprio_set () {	 &__NR_ioprio_set;}
}
unless(defined(&SYS_kexec_load)) {
    sub SYS_kexec_load () {	 &__NR_kexec_load;}
}
unless(defined(&SYS_keyctl)) {
    sub SYS_keyctl () {	 &__NR_keyctl;}
}
unless(defined(&SYS_kill)) {
    sub SYS_kill () {	 &__NR_kill;}
}
unless(defined(&SYS_lchown)) {
    sub SYS_lchown () {	 &__NR_lchown;}
}
unless(defined(&SYS_lgetxattr)) {
    sub SYS_lgetxattr () {	 &__NR_lgetxattr;}
}
unless(defined(&SYS_link)) {
    sub SYS_link () {	 &__NR_link;}
}
unless(defined(&SYS_linkat)) {
    sub SYS_linkat () {	 &__NR_linkat;}
}
unless(defined(&SYS_listxattr)) {
    sub SYS_listxattr () {	 &__NR_listxattr;}
}
unless(defined(&SYS_llistxattr)) {
    sub SYS_llistxattr () {	 &__NR_llistxattr;}
}
unless(defined(&SYS_lookup_dcookie)) {
    sub SYS_lookup_dcookie () {	 &__NR_lookup_dcookie;}
}
unless(defined(&SYS_lremovexattr)) {
    sub SYS_lremovexattr () {	 &__NR_lremovexattr;}
}
unless(defined(&SYS_lseek)) {
    sub SYS_lseek () {	 &__NR_lseek;}
}
unless(defined(&SYS_lsetxattr)) {
    sub SYS_lsetxattr () {	 &__NR_lsetxattr;}
}
unless(defined(&SYS_lstat)) {
    sub SYS_lstat () {	 &__NR_lstat;}
}
unless(defined(&SYS_madvise)) {
    sub SYS_madvise () {	 &__NR_madvise;}
}
unless(defined(&SYS_mbind)) {
    sub SYS_mbind () {	 &__NR_mbind;}
}
unless(defined(&SYS_migrate_pages)) {
    sub SYS_migrate_pages () {	 &__NR_migrate_pages;}
}
unless(defined(&SYS_mincore)) {
    sub SYS_mincore () {	 &__NR_mincore;}
}
unless(defined(&SYS_mkdir)) {
    sub SYS_mkdir () {	 &__NR_mkdir;}
}
unless(defined(&SYS_mkdirat)) {
    sub SYS_mkdirat () {	 &__NR_mkdirat;}
}
unless(defined(&SYS_mknod)) {
    sub SYS_mknod () {	 &__NR_mknod;}
}
unless(defined(&SYS_mknodat)) {
    sub SYS_mknodat () {	 &__NR_mknodat;}
}
unless(defined(&SYS_mlock)) {
    sub SYS_mlock () {	 &__NR_mlock;}
}
unless(defined(&SYS_mlockall)) {
    sub SYS_mlockall () {	 &__NR_mlockall;}
}
unless(defined(&SYS_mmap)) {
    sub SYS_mmap () {	 &__NR_mmap;}
}
unless(defined(&SYS_modify_ldt)) {
    sub SYS_modify_ldt () {	 &__NR_modify_ldt;}
}
unless(defined(&SYS_mount)) {
    sub SYS_mount () {	 &__NR_mount;}
}
unless(defined(&SYS_move_pages)) {
    sub SYS_move_pages () {	 &__NR_move_pages;}
}
unless(defined(&SYS_mprotect)) {
    sub SYS_mprotect () {	 &__NR_mprotect;}
}
unless(defined(&SYS_mq_getsetattr)) {
    sub SYS_mq_getsetattr () {	 &__NR_mq_getsetattr;}
}
unless(defined(&SYS_mq_notify)) {
    sub SYS_mq_notify () {	 &__NR_mq_notify;}
}
unless(defined(&SYS_mq_open)) {
    sub SYS_mq_open () {	 &__NR_mq_open;}
}
unless(defined(&SYS_mq_timedreceive)) {
    sub SYS_mq_timedreceive () {	 &__NR_mq_timedreceive;}
}
unless(defined(&SYS_mq_timedsend)) {
    sub SYS_mq_timedsend () {	 &__NR_mq_timedsend;}
}
unless(defined(&SYS_mq_unlink)) {
    sub SYS_mq_unlink () {	 &__NR_mq_unlink;}
}
unless(defined(&SYS_mremap)) {
    sub SYS_mremap () {	 &__NR_mremap;}
}
unless(defined(&SYS_msync)) {
    sub SYS_msync () {	 &__NR_msync;}
}
unless(defined(&SYS_munlock)) {
    sub SYS_munlock () {	 &__NR_munlock;}
}
unless(defined(&SYS_munlockall)) {
    sub SYS_munlockall () {	 &__NR_munlockall;}
}
unless(defined(&SYS_munmap)) {
    sub SYS_munmap () {	 &__NR_munmap;}
}
unless(defined(&SYS_nanosleep)) {
    sub SYS_nanosleep () {	 &__NR_nanosleep;}
}
unless(defined(&SYS_nfsservctl)) {
    sub SYS_nfsservctl () {	 &__NR_nfsservctl;}
}
unless(defined(&SYS_open)) {
    sub SYS_open () {	 &__NR_open;}
}
unless(defined(&SYS_openat)) {
    sub SYS_openat () {	 &__NR_openat;}
}
unless(defined(&SYS_pause)) {
    sub SYS_pause () {	 &__NR_pause;}
}
unless(defined(&SYS_perf_event_open)) {
    sub SYS_perf_event_open () {	 &__NR_perf_event_open;}
}
unless(defined(&SYS_personality)) {
    sub SYS_personality () {	 &__NR_personality;}
}
unless(defined(&SYS_pipe)) {
    sub SYS_pipe () {	 &__NR_pipe;}
}
unless(defined(&SYS_pipe2)) {
    sub SYS_pipe2 () {	 &__NR_pipe2;}
}
unless(defined(&SYS_pivot_root)) {
    sub SYS_pivot_root () {	 &__NR_pivot_root;}
}
unless(defined(&SYS_poll)) {
    sub SYS_poll () {	 &__NR_poll;}
}
unless(defined(&SYS_ppoll)) {
    sub SYS_ppoll () {	 &__NR_ppoll;}
}
unless(defined(&SYS_prctl)) {
    sub SYS_prctl () {	 &__NR_prctl;}
}
unless(defined(&SYS_pread64)) {
    sub SYS_pread64 () {	 &__NR_pread64;}
}
unless(defined(&SYS_preadv)) {
    sub SYS_preadv () {	 &__NR_preadv;}
}
unless(defined(&SYS_pselect6)) {
    sub SYS_pselect6 () {	 &__NR_pselect6;}
}
unless(defined(&SYS_ptrace)) {
    sub SYS_ptrace () {	 &__NR_ptrace;}
}
unless(defined(&SYS_putpmsg)) {
    sub SYS_putpmsg () {	 &__NR_putpmsg;}
}
unless(defined(&SYS_pwrite64)) {
    sub SYS_pwrite64 () {	 &__NR_pwrite64;}
}
unless(defined(&SYS_pwritev)) {
    sub SYS_pwritev () {	 &__NR_pwritev;}
}
unless(defined(&SYS_query_module)) {
    sub SYS_query_module () {	 &__NR_query_module;}
}
unless(defined(&SYS_quotactl)) {
    sub SYS_quotactl () {	 &__NR_quotactl;}
}
unless(defined(&SYS_read)) {
    sub SYS_read () {	 &__NR_read;}
}
unless(defined(&SYS_readahead)) {
    sub SYS_readahead () {	 &__NR_readahead;}
}
unless(defined(&SYS_readlink)) {
    sub SYS_readlink () {	 &__NR_readlink;}
}
unless(defined(&SYS_readlinkat)) {
    sub SYS_readlinkat () {	 &__NR_readlinkat;}
}
unless(defined(&SYS_readv)) {
    sub SYS_readv () {	 &__NR_readv;}
}
unless(defined(&SYS_reboot)) {
    sub SYS_reboot () {	 &__NR_reboot;}
}
unless(defined(&SYS_remap_file_pages)) {
    sub SYS_remap_file_pages () {	 &__NR_remap_file_pages;}
}
unless(defined(&SYS_removexattr)) {
    sub SYS_removexattr () {	 &__NR_removexattr;}
}
unless(defined(&SYS_rename)) {
    sub SYS_rename () {	 &__NR_rename;}
}
unless(defined(&SYS_renameat)) {
    sub SYS_renameat () {	 &__NR_renameat;}
}
unless(defined(&SYS_request_key)) {
    sub SYS_request_key () {	 &__NR_request_key;}
}
unless(defined(&SYS_restart_syscall)) {
    sub SYS_restart_syscall () {	 &__NR_restart_syscall;}
}
unless(defined(&SYS_rmdir)) {
    sub SYS_rmdir () {	 &__NR_rmdir;}
}
unless(defined(&SYS_rt_sigaction)) {
    sub SYS_rt_sigaction () {	 &__NR_rt_sigaction;}
}
unless(defined(&SYS_rt_sigpending)) {
    sub SYS_rt_sigpending () {	 &__NR_rt_sigpending;}
}
unless(defined(&SYS_rt_sigprocmask)) {
    sub SYS_rt_sigprocmask () {	 &__NR_rt_sigprocmask;}
}
unless(defined(&SYS_rt_sigqueueinfo)) {
    sub SYS_rt_sigqueueinfo () {	 &__NR_rt_sigqueueinfo;}
}
unless(defined(&SYS_rt_sigreturn)) {
    sub SYS_rt_sigreturn () {	 &__NR_rt_sigreturn;}
}
unless(defined(&SYS_rt_sigsuspend)) {
    sub SYS_rt_sigsuspend () {	 &__NR_rt_sigsuspend;}
}
unless(defined(&SYS_rt_sigtimedwait)) {
    sub SYS_rt_sigtimedwait () {	 &__NR_rt_sigtimedwait;}
}
unless(defined(&SYS_rt_tgsigqueueinfo)) {
    sub SYS_rt_tgsigqueueinfo () {	 &__NR_rt_tgsigqueueinfo;}
}
unless(defined(&SYS_sched_get_priority_max)) {
    sub SYS_sched_get_priority_max () {	 &__NR_sched_get_priority_max;}
}
unless(defined(&SYS_sched_get_priority_min)) {
    sub SYS_sched_get_priority_min () {	 &__NR_sched_get_priority_min;}
}
unless(defined(&SYS_sched_getaffinity)) {
    sub SYS_sched_getaffinity () {	 &__NR_sched_getaffinity;}
}
unless(defined(&SYS_sched_getparam)) {
    sub SYS_sched_getparam () {	 &__NR_sched_getparam;}
}
unless(defined(&SYS_sched_getscheduler)) {
    sub SYS_sched_getscheduler () {	 &__NR_sched_getscheduler;}
}
unless(defined(&SYS_sched_rr_get_interval)) {
    sub SYS_sched_rr_get_interval () {	 &__NR_sched_rr_get_interval;}
}
unless(defined(&SYS_sched_setaffinity)) {
    sub SYS_sched_setaffinity () {	 &__NR_sched_setaffinity;}
}
unless(defined(&SYS_sched_setparam)) {
    sub SYS_sched_setparam () {	 &__NR_sched_setparam;}
}
unless(defined(&SYS_sched_setscheduler)) {
    sub SYS_sched_setscheduler () {	 &__NR_sched_setscheduler;}
}
unless(defined(&SYS_sched_yield)) {
    sub SYS_sched_yield () {	 &__NR_sched_yield;}
}
unless(defined(&SYS_select)) {
    sub SYS_select () {	 &__NR_select;}
}
unless(defined(&SYS_sendfile)) {
    sub SYS_sendfile () {	 &__NR_sendfile;}
}
unless(defined(&SYS_set_mempolicy)) {
    sub SYS_set_mempolicy () {	 &__NR_set_mempolicy;}
}
unless(defined(&SYS_set_robust_list)) {
    sub SYS_set_robust_list () {	 &__NR_set_robust_list;}
}
unless(defined(&SYS_set_thread_area)) {
    sub SYS_set_thread_area () {	 &__NR_set_thread_area;}
}
unless(defined(&SYS_set_tid_address)) {
    sub SYS_set_tid_address () {	 &__NR_set_tid_address;}
}
unless(defined(&SYS_setdomainname)) {
    sub SYS_setdomainname () {	 &__NR_setdomainname;}
}
unless(defined(&SYS_setfsgid)) {
    sub SYS_setfsgid () {	 &__NR_setfsgid;}
}
unless(defined(&SYS_setfsuid)) {
    sub SYS_setfsuid () {	 &__NR_setfsuid;}
}
unless(defined(&SYS_setgid)) {
    sub SYS_setgid () {	 &__NR_setgid;}
}
unless(defined(&SYS_setgroups)) {
    sub SYS_setgroups () {	 &__NR_setgroups;}
}
unless(defined(&SYS_sethostname)) {
    sub SYS_sethostname () {	 &__NR_sethostname;}
}
unless(defined(&SYS_setitimer)) {
    sub SYS_setitimer () {	 &__NR_setitimer;}
}
unless(defined(&SYS_setpgid)) {
    sub SYS_setpgid () {	 &__NR_setpgid;}
}
unless(defined(&SYS_setpriority)) {
    sub SYS_setpriority () {	 &__NR_setpriority;}
}
unless(defined(&SYS_setregid)) {
    sub SYS_setregid () {	 &__NR_setregid;}
}
unless(defined(&SYS_setresgid)) {
    sub SYS_setresgid () {	 &__NR_setresgid;}
}
unless(defined(&SYS_setresuid)) {
    sub SYS_setresuid () {	 &__NR_setresuid;}
}
unless(defined(&SYS_setreuid)) {
    sub SYS_setreuid () {	 &__NR_setreuid;}
}
unless(defined(&SYS_setrlimit)) {
    sub SYS_setrlimit () {	 &__NR_setrlimit;}
}
unless(defined(&SYS_setsid)) {
    sub SYS_setsid () {	 &__NR_setsid;}
}
unless(defined(&SYS_settimeofday)) {
    sub SYS_settimeofday () {	 &__NR_settimeofday;}
}
unless(defined(&SYS_setuid)) {
    sub SYS_setuid () {	 &__NR_setuid;}
}
unless(defined(&SYS_setxattr)) {
    sub SYS_setxattr () {	 &__NR_setxattr;}
}
unless(defined(&SYS_sigaltstack)) {
    sub SYS_sigaltstack () {	 &__NR_sigaltstack;}
}
unless(defined(&SYS_signalfd)) {
    sub SYS_signalfd () {	 &__NR_signalfd;}
}
unless(defined(&SYS_signalfd4)) {
    sub SYS_signalfd4 () {	 &__NR_signalfd4;}
}
unless(defined(&SYS_splice)) {
    sub SYS_splice () {	 &__NR_splice;}
}
unless(defined(&SYS_stat)) {
    sub SYS_stat () {	 &__NR_stat;}
}
unless(defined(&SYS_statfs)) {
    sub SYS_statfs () {	 &__NR_statfs;}
}
unless(defined(&SYS_swapoff)) {
    sub SYS_swapoff () {	 &__NR_swapoff;}
}
unless(defined(&SYS_swapon)) {
    sub SYS_swapon () {	 &__NR_swapon;}
}
unless(defined(&SYS_symlink)) {
    sub SYS_symlink () {	 &__NR_symlink;}
}
unless(defined(&SYS_symlinkat)) {
    sub SYS_symlinkat () {	 &__NR_symlinkat;}
}
unless(defined(&SYS_sync)) {
    sub SYS_sync () {	 &__NR_sync;}
}
unless(defined(&SYS_sync_file_range)) {
    sub SYS_sync_file_range () {	 &__NR_sync_file_range;}
}
unless(defined(&SYS_sysfs)) {
    sub SYS_sysfs () {	 &__NR_sysfs;}
}
unless(defined(&SYS_sysinfo)) {
    sub SYS_sysinfo () {	 &__NR_sysinfo;}
}
unless(defined(&SYS_syslog)) {
    sub SYS_syslog () {	 &__NR_syslog;}
}
unless(defined(&SYS_tee)) {
    sub SYS_tee () {	 &__NR_tee;}
}
unless(defined(&SYS_tgkill)) {
    sub SYS_tgkill () {	 &__NR_tgkill;}
}
unless(defined(&SYS_time)) {
    sub SYS_time () {	 &__NR_time;}
}
unless(defined(&SYS_timer_create)) {
    sub SYS_timer_create () {	 &__NR_timer_create;}
}
unless(defined(&SYS_timer_delete)) {
    sub SYS_timer_delete () {	 &__NR_timer_delete;}
}
unless(defined(&SYS_timer_getoverrun)) {
    sub SYS_timer_getoverrun () {	 &__NR_timer_getoverrun;}
}
unless(defined(&SYS_timer_gettime)) {
    sub SYS_timer_gettime () {	 &__NR_timer_gettime;}
}
unless(defined(&SYS_timer_settime)) {
    sub SYS_timer_settime () {	 &__NR_timer_settime;}
}
unless(defined(&SYS_timerfd_create)) {
    sub SYS_timerfd_create () {	 &__NR_timerfd_create;}
}
unless(defined(&SYS_timerfd_gettime)) {
    sub SYS_timerfd_gettime () {	 &__NR_timerfd_gettime;}
}
unless(defined(&SYS_timerfd_settime)) {
    sub SYS_timerfd_settime () {	 &__NR_timerfd_settime;}
}
unless(defined(&SYS_times)) {
    sub SYS_times () {	 &__NR_times;}
}
unless(defined(&SYS_tkill)) {
    sub SYS_tkill () {	 &__NR_tkill;}
}
unless(defined(&SYS_truncate)) {
    sub SYS_truncate () {	 &__NR_truncate;}
}
unless(defined(&SYS_umask)) {
    sub SYS_umask () {	 &__NR_umask;}
}
unless(defined(&SYS_umount2)) {
    sub SYS_umount2 () {	 &__NR_umount2;}
}
unless(defined(&SYS_uname)) {
    sub SYS_uname () {	 &__NR_uname;}
}
unless(defined(&SYS_unlink)) {
    sub SYS_unlink () {	 &__NR_unlink;}
}
unless(defined(&SYS_unlinkat)) {
    sub SYS_unlinkat () {	 &__NR_unlinkat;}
}
unless(defined(&SYS_unshare)) {
    sub SYS_unshare () {	 &__NR_unshare;}
}
unless(defined(&SYS_uselib)) {
    sub SYS_uselib () {	 &__NR_uselib;}
}
unless(defined(&SYS_ustat)) {
    sub SYS_ustat () {	 &__NR_ustat;}
}
unless(defined(&SYS_utime)) {
    sub SYS_utime () {	 &__NR_utime;}
}
unless(defined(&SYS_utimensat)) {
    sub SYS_utimensat () {	 &__NR_utimensat;}
}
unless(defined(&SYS_utimes)) {
    sub SYS_utimes () {	 &__NR_utimes;}
}
unless(defined(&SYS_vfork)) {
    sub SYS_vfork () {	 &__NR_vfork;}
}
unless(defined(&SYS_vhangup)) {
    sub SYS_vhangup () {	 &__NR_vhangup;}
}
unless(defined(&SYS_vmsplice)) {
    sub SYS_vmsplice () {	 &__NR_vmsplice;}
}
unless(defined(&SYS_vserver)) {
    sub SYS_vserver () {	 &__NR_vserver;}
}
unless(defined(&SYS_wait4)) {
    sub SYS_wait4 () {	 &__NR_wait4;}
}
unless(defined(&SYS_waitid)) {
    sub SYS_waitid () {	 &__NR_waitid;}
}
unless(defined(&SYS_write)) {
    sub SYS_write () {	 &__NR_write;}
}
unless(defined(&SYS_writev)) {
    sub SYS_writev () {	 &__NR_writev;}
}
if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
    eval 'sub SYS_accept () { &__NR_accept;}' unless defined(&SYS_accept);
    eval 'sub SYS_accept4 () { &__NR_accept4;}' unless defined(&SYS_accept4);
    eval 'sub SYS_arch_prctl () { &__NR_arch_prctl;}' unless defined(&SYS_arch_prctl);
    eval 'sub SYS_bind () { &__NR_bind;}' unless defined(&SYS_bind);
    eval 'sub SYS_connect () { &__NR_connect;}' unless defined(&SYS_connect);
    eval 'sub SYS_epoll_ctl_old () { &__NR_epoll_ctl_old;}' unless defined(&SYS_epoll_ctl_old);
    eval 'sub SYS_epoll_wait_old () { &__NR_epoll_wait_old;}' unless defined(&SYS_epoll_wait_old);
    eval 'sub SYS_getpeername () { &__NR_getpeername;}' unless defined(&SYS_getpeername);
    eval 'sub SYS_getsockname () { &__NR_getsockname;}' unless defined(&SYS_getsockname);
    eval 'sub SYS_getsockopt () { &__NR_getsockopt;}' unless defined(&SYS_getsockopt);
    eval 'sub SYS_listen () { &__NR_listen;}' unless defined(&SYS_listen);
    eval 'sub SYS_msgctl () { &__NR_msgctl;}' unless defined(&SYS_msgctl);
    eval 'sub SYS_msgget () { &__NR_msgget;}' unless defined(&SYS_msgget);
    eval 'sub SYS_msgrcv () { &__NR_msgrcv;}' unless defined(&SYS_msgrcv);
    eval 'sub SYS_msgsnd () { &__NR_msgsnd;}' unless defined(&SYS_msgsnd);
    eval 'sub SYS_newfstatat () { &__NR_newfstatat;}' unless defined(&SYS_newfstatat);
    eval 'sub SYS_recvfrom () { &__NR_recvfrom;}' unless defined(&SYS_recvfrom);
    eval 'sub SYS_recvmsg () { &__NR_recvmsg;}' unless defined(&SYS_recvmsg);
    eval 'sub SYS_security () { &__NR_security;}' unless defined(&SYS_security);
    eval 'sub SYS_semctl () { &__NR_semctl;}' unless defined(&SYS_semctl);
    eval 'sub SYS_semget () { &__NR_semget;}' unless defined(&SYS_semget);
    eval 'sub SYS_semop () { &__NR_semop;}' unless defined(&SYS_semop);
    eval 'sub SYS_semtimedop () { &__NR_semtimedop;}' unless defined(&SYS_semtimedop);
    eval 'sub SYS_sendmsg () { &__NR_sendmsg;}' unless defined(&SYS_sendmsg);
    eval 'sub SYS_sendto () { &__NR_sendto;}' unless defined(&SYS_sendto);
    eval 'sub SYS_setsockopt () { &__NR_setsockopt;}' unless defined(&SYS_setsockopt);
    eval 'sub SYS_shmat () { &__NR_shmat;}' unless defined(&SYS_shmat);
    eval 'sub SYS_shmctl () { &__NR_shmctl;}' unless defined(&SYS_shmctl);
    eval 'sub SYS_shmdt () { &__NR_shmdt;}' unless defined(&SYS_shmdt);
    eval 'sub SYS_shmget () { &__NR_shmget;}' unless defined(&SYS_shmget);
    eval 'sub SYS_shutdown () { &__NR_shutdown;}' unless defined(&SYS_shutdown);
    eval 'sub SYS_socket () { &__NR_socket;}' unless defined(&SYS_socket);
    eval 'sub SYS_socketpair () { &__NR_socketpair;}' unless defined(&SYS_socketpair);
    eval 'sub SYS_tuxcall () { &__NR_tuxcall;}' unless defined(&SYS_tuxcall);
} else {
    eval 'sub SYS__llseek () { &__NR__llseek;}' unless defined(&SYS__llseek);
    eval 'sub SYS__newselect () { &__NR__newselect;}' unless defined(&SYS__newselect);
    eval 'sub SYS_bdflush () { &__NR_bdflush;}' unless defined(&SYS_bdflush);
    eval 'sub SYS_break () { &__NR_break;}' unless defined(&SYS_break);
    eval 'sub SYS_chown32 () { &__NR_chown32;}' unless defined(&SYS_chown32);
    eval 'sub SYS_fadvise64_64 () { &__NR_fadvise64_64;}' unless defined(&SYS_fadvise64_64);
    eval 'sub SYS_fchown32 () { &__NR_fchown32;}' unless defined(&SYS_fchown32);
    eval 'sub SYS_fcntl64 () { &__NR_fcntl64;}' unless defined(&SYS_fcntl64);
    eval 'sub SYS_fstat64 () { &__NR_fstat64;}' unless defined(&SYS_fstat64);
    eval 'sub SYS_fstatat64 () { &__NR_fstatat64;}' unless defined(&SYS_fstatat64);
    eval 'sub SYS_fstatfs64 () { &__NR_fstatfs64;}' unless defined(&SYS_fstatfs64);
    eval 'sub SYS_ftime () { &__NR_ftime;}' unless defined(&SYS_ftime);
    eval 'sub SYS_ftruncate64 () { &__NR_ftruncate64;}' unless defined(&SYS_ftruncate64);
    eval 'sub SYS_getcpu () { &__NR_getcpu;}' unless defined(&SYS_getcpu);
    eval 'sub SYS_getegid32 () { &__NR_getegid32;}' unless defined(&SYS_getegid32);
    eval 'sub SYS_geteuid32 () { &__NR_geteuid32;}' unless defined(&SYS_geteuid32);
    eval 'sub SYS_getgid32 () { &__NR_getgid32;}' unless defined(&SYS_getgid32);
    eval 'sub SYS_getgroups32 () { &__NR_getgroups32;}' unless defined(&SYS_getgroups32);
    eval 'sub SYS_getresgid32 () { &__NR_getresgid32;}' unless defined(&SYS_getresgid32);
    eval 'sub SYS_getresuid32 () { &__NR_getresuid32;}' unless defined(&SYS_getresuid32);
    eval 'sub SYS_getuid32 () { &__NR_getuid32;}' unless defined(&SYS_getuid32);
    eval 'sub SYS_gtty () { &__NR_gtty;}' unless defined(&SYS_gtty);
    eval 'sub SYS_idle () { &__NR_idle;}' unless defined(&SYS_idle);
    eval 'sub SYS_ipc () { &__NR_ipc;}' unless defined(&SYS_ipc);
    eval 'sub SYS_lchown32 () { &__NR_lchown32;}' unless defined(&SYS_lchown32);
    eval 'sub SYS_lock () { &__NR_lock;}' unless defined(&SYS_lock);
    eval 'sub SYS_lstat64 () { &__NR_lstat64;}' unless defined(&SYS_lstat64);
    eval 'sub SYS_madvise1 () { &__NR_madvise1;}' unless defined(&SYS_madvise1);
    eval 'sub SYS_mmap2 () { &__NR_mmap2;}' unless defined(&SYS_mmap2);
    eval 'sub SYS_mpx () { &__NR_mpx;}' unless defined(&SYS_mpx);
    eval 'sub SYS_nice () { &__NR_nice;}' unless defined(&SYS_nice);
    eval 'sub SYS_oldfstat () { &__NR_oldfstat;}' unless defined(&SYS_oldfstat);
    eval 'sub SYS_oldlstat () { &__NR_oldlstat;}' unless defined(&SYS_oldlstat);
    eval 'sub SYS_oldolduname () { &__NR_oldolduname;}' unless defined(&SYS_oldolduname);
    eval 'sub SYS_oldstat () { &__NR_oldstat;}' unless defined(&SYS_oldstat);
    eval 'sub SYS_olduname () { &__NR_olduname;}' unless defined(&SYS_olduname);
    eval 'sub SYS_prof () { &__NR_prof;}' unless defined(&SYS_prof);
    eval 'sub SYS_profil () { &__NR_profil;}' unless defined(&SYS_profil);
    eval 'sub SYS_readdir () { &__NR_readdir;}' unless defined(&SYS_readdir);
    eval 'sub SYS_sendfile64 () { &__NR_sendfile64;}' unless defined(&SYS_sendfile64);
    eval 'sub SYS_setfsgid32 () { &__NR_setfsgid32;}' unless defined(&SYS_setfsgid32);
    eval 'sub SYS_setfsuid32 () { &__NR_setfsuid32;}' unless defined(&SYS_setfsuid32);
    eval 'sub SYS_setgid32 () { &__NR_setgid32;}' unless defined(&SYS_setgid32);
    eval 'sub SYS_setgroups32 () { &__NR_setgroups32;}' unless defined(&SYS_setgroups32);
    eval 'sub SYS_setregid32 () { &__NR_setregid32;}' unless defined(&SYS_setregid32);
    eval 'sub SYS_setresgid32 () { &__NR_setresgid32;}' unless defined(&SYS_setresgid32);
    eval 'sub SYS_setresuid32 () { &__NR_setresuid32;}' unless defined(&SYS_setresuid32);
    eval 'sub SYS_setreuid32 () { &__NR_setreuid32;}' unless defined(&SYS_setreuid32);
    eval 'sub SYS_setuid32 () { &__NR_setuid32;}' unless defined(&SYS_setuid32);
    eval 'sub SYS_sgetmask () { &__NR_sgetmask;}' unless defined(&SYS_sgetmask);
    eval 'sub SYS_sigaction () { &__NR_sigaction;}' unless defined(&SYS_sigaction);
    eval 'sub SYS_signal () { &__NR_signal;}' unless defined(&SYS_signal);
    eval 'sub SYS_sigpending () { &__NR_sigpending;}' unless defined(&SYS_sigpending);
    eval 'sub SYS_sigprocmask () { &__NR_sigprocmask;}' unless defined(&SYS_sigprocmask);
    eval 'sub SYS_sigreturn () { &__NR_sigreturn;}' unless defined(&SYS_sigreturn);
    eval 'sub SYS_sigsuspend () { &__NR_sigsuspend;}' unless defined(&SYS_sigsuspend);
    eval 'sub SYS_socketcall () { &__NR_socketcall;}' unless defined(&SYS_socketcall);
    eval 'sub SYS_ssetmask () { &__NR_ssetmask;}' unless defined(&SYS_ssetmask);
    eval 'sub SYS_stat64 () { &__NR_stat64;}' unless defined(&SYS_stat64);
    eval 'sub SYS_statfs64 () { &__NR_statfs64;}' unless defined(&SYS_statfs64);
    eval 'sub SYS_stime () { &__NR_stime;}' unless defined(&SYS_stime);
    eval 'sub SYS_stty () { &__NR_stty;}' unless defined(&SYS_stty);
    eval 'sub SYS_truncate64 () { &__NR_truncate64;}' unless defined(&SYS_truncate64);
    eval 'sub SYS_ugetrlimit () { &__NR_ugetrlimit;}' unless defined(&SYS_ugetrlimit);
    eval 'sub SYS_ulimit () { &__NR_ulimit;}' unless defined(&SYS_ulimit);
    eval 'sub SYS_umount () { &__NR_umount;}' unless defined(&SYS_umount);
    eval 'sub SYS_vm86 () { &__NR_vm86;}' unless defined(&SYS_vm86);
    eval 'sub SYS_vm86old () { &__NR_vm86old;}' unless defined(&SYS_vm86old);
    eval 'sub SYS_waitpid () { &__NR_waitpid;}' unless defined(&SYS_waitpid);
}
1;
