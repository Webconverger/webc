" Vim syntax file
" Language:	udev rules files
" Maintainer:	Marco d'Itri <md@linux.it>
" Last Change:	2005 August
"
" This syntax file is unfinished. If you can, please clean it up and submit
" it for inclusion in the vim package.

if exists("b:current_syntax")
  finish
endif

let b:current_syntax = "udev"

syn keyword Ucondition	ACTION ENV RESULT KERNEL SUBSYSTEM DRIVER ATTR
syn keyword Ucondition	KERNELS SUBSYSTEMS DRIVERS ATTRS DEVPATH TEST
syn keyword Ucondition	nextgroup=Uparambr,Uoperator
syn keyword Uaction	PROGRAM NAME SYMLINK OWNER GROUP MODE RUN OPTIONS
syn keyword Uaction	IMPORT GOTO LABEL
syn keyword Uaction	nextgroup=Uparambr,Uoperator
syn region  Uparambr	start=/{/ end=/}/ contains=Uparam
syn match   Uparam	'[A-Za-z0-9_]*' contained
syn match   Ufnmatch	"[?*|]" contained
syn region  Ufnmatch	start=/\[/ skip=/\\\]/ end=/\]/ contained
syn match   Uprintf	'%[beknMmps%]\|%c{[0-9]}' contained
syn match   Ustringvar	'\$[a-z]*' nextgroup=Uparambr
syn match   Ustring	'"[^"]*"' contains=Uprintf,Ufnmatch,Ustringvar
syn match   Uoperator	"==\|!=\|=\|+=\|:=\|,"
syn match   Ueol	'\\$'
syn region  Ucomment	start=/#/ end=/$/
syn keyword Utodo	contained TODO FIXME XXX

hi def link Ucondition	Identifier
hi def link Uaction	Identifier
hi def link Uparambr	Delimiter
hi def link Uparam	PreProc
hi def link Ufnmatch	Special
hi def link Uprintf	Special
hi def link Ustringvar	Function
hi def link Ustring	String
hi def link Uoperator	Operator
hi def link Ueol	Delimiter
hi def link Ucomment	Comment
hi def link Utodo	Todo

