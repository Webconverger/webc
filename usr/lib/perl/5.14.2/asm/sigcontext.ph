require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_ASM_X86_SIGCONTEXT_H)) {
    eval 'sub _ASM_X86_SIGCONTEXT_H () {1;}' unless defined(&_ASM_X86_SIGCONTEXT_H);
    require 'linux/types.ph';
    eval 'sub FP_XSTATE_MAGIC1 () {0x46505853;}' unless defined(&FP_XSTATE_MAGIC1);
    eval 'sub FP_XSTATE_MAGIC2 () {0x46505845;}' unless defined(&FP_XSTATE_MAGIC2);
    eval 'sub FP_XSTATE_MAGIC2_SIZE () {$sizeof{ &FP_XSTATE_MAGIC2};}' unless defined(&FP_XSTATE_MAGIC2_SIZE);
    if(defined(&__i386__)) {
	eval 'sub X86_FXSR_MAGIC () {0x;}' unless defined(&X86_FXSR_MAGIC);
    } else {
    }
}
1;
