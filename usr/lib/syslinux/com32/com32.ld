/*
 * Linker script for COM32 binaries using libcom32
 */

/* Script for -z combreloc: combine and sort reloc sections */
OUTPUT_FORMAT("elf32-i386", "elf32-i386",
	      "elf32-i386")
OUTPUT_ARCH(i386)
EXTERN(_start)
ENTRY(_start)
SECTIONS
{
  /* Read-only sections, merged into text segment: */
  . = 0;
  PROVIDE (__executable_start = .);
  PROVIDE (_stext = .);

  .init           :
  {
    KEEP (*(.init))
  } =0x90909090
  .text           :
  {
    *(.text .stub .text.* .gnu.linkonce.t.*)
    /* .gnu.warning sections are handled specially by elf32.em.  */
    *(.gnu.warning)
  } =0x90909090
  .fini           :
  {
    KEEP (*(.fini))
  } =0x90909090
  PROVIDE (_etext = .);

  __rodata_start = .;
  .rodata         : { *(.rodata .rodata.* .gnu.linkonce.r.*) }
  .rodata1        : { *(.rodata1) }
  __rodata_end = .;

  /* Ensure the __preinit_array_start label is properly aligned.  We
     could instead move the label definition inside the section, but
     the linker would then create the section even if it turns out to
     be empty, which isn't pretty.  */
  . = ALIGN(4);
  .preinit_array     : {
    PROVIDE (__preinit_array_start = .);
    *(.preinit_array)
    PROVIDE (__preinit_array_end = .);
  }
  .init_array     : {
    PROVIDE (__init_array_start = .);
    *(.init_array)
    PROVIDE (__init_array_end = .);
  }
  .fini_array     : {
    PROVIDE (__fini_array_start = .);
    *(.fini_array)
    PROVIDE (__fini_array_end = .);
  }
  .ctors          : {
    PROVIDE (__ctors_start = .);
    KEEP (*(SORT(.ctors.*)))
    KEEP (*(.ctors))
    PROVIDE (__ctors_end = .);
  }
  .dtors          : {
    PROVIDE (__dtors_start = .);
    KEEP (*(SORT(.dtors.*)))
    KEEP (*(.dtors))
    PROVIDE (__dtors_end = .);
  }

  .got            : {
    PROVIDE (__got_start = .);
    KEEP (*(.got.plt))
    KEEP (*(.got))
    PROVIDE (__got_end = .);
  }

  /* Adjust the address for the data segment.  Avoid mixing code and
     data within same 128-byte chunk. */
  . = ALIGN(128);

  .data           :
  {
    _sdata = .;
    KEEP(*(.data .data.* .gnu.linkonce.d.*))
    SORT(CONSTRUCTORS)
    *(.data1)
    . = ALIGN(4);
    _edata = .;
  }

  __bss_start = .;
  .bss            :
  {
   *(.dynbss)
   *(.bss .bss.* .gnu.linkonce.b.*)
   *(COMMON)
   /* Align here to ensure that the .bss section occupies space up to
      _end.  Align after .bss to ensure correct alignment even if the
      .bss section disappears because there are no input sections.  */
   . = ALIGN(4);
  }
  . = ALIGN(4);
  _end = .;

  /* Stabs debugging sections.  */
  .stab          0 : { *(.stab) }
  .stabstr       0 : { *(.stabstr) }
  .stab.excl     0 : { *(.stab.excl) }
  .stab.exclstr  0 : { *(.stab.exclstr) }
  .stab.index    0 : { *(.stab.index) }
  .stab.indexstr 0 : { *(.stab.indexstr) }
  .comment       0 : { *(.comment) }
  /* DWARF debug sections.
     Symbols in the DWARF debugging sections are relative to the beginning
     of the section so we begin them at 0.  */
  /* DWARF 1 */
  .debug          0 : { *(.debug) }
  .line           0 : { *(.line) }
  /* GNU DWARF 1 extensions */
  .debug_srcinfo  0 : { *(.debug_srcinfo) }
  .debug_sfnames  0 : { *(.debug_sfnames) }
  /* DWARF 1.1 and DWARF 2 */
  .debug_aranges  0 : { *(.debug_aranges) }
  .debug_pubnames 0 : { *(.debug_pubnames) }
  /* DWARF 2 */
  .debug_info     0 : { *(.debug_info .gnu.linkonce.wi.*) }
  .debug_abbrev   0 : { *(.debug_abbrev) }
  .debug_line     0 : { *(.debug_line) }
  .debug_frame    0 : { *(.debug_frame) }
  .debug_str      0 : { *(.debug_str) }
  .debug_loc      0 : { *(.debug_loc) }
  .debug_macinfo  0 : { *(.debug_macinfo) }
  /* SGI/MIPS DWARF 2 extensions */
  .debug_weaknames 0 : { *(.debug_weaknames) }
  .debug_funcnames 0 : { *(.debug_funcnames) }
  .debug_typenames 0 : { *(.debug_typenames) }
  .debug_varnames  0 : { *(.debug_varnames) }
  /DISCARD/ : { *(.note.GNU-stack) }
}
