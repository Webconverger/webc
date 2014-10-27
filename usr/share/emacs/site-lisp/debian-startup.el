;;; debian-startup.el --- Debian specific emacsen startup code.

;; Copyright (C) 1998-2012 Rob Browning

;; Maintainer: Rob Browning <rlb@defaultvalue.org>
;; Keywords: debian

;; This file is part of the debian release of GNU Emacs, and will
;; be contributed to the FSF after testing. It is released under the same
;; terms, namely the GPL v2 or later.

;; GNU Emacs is free software; you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation; either version 2, or (at your option)
;; any later version.

;; GNU Emacs is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with GNU Emacs; see the file COPYING.  If not, write to the
;; Free Software Foundation, Inc., 59 Temple Place - Suite 330,
;; Boston, MA 02111-1307, USA.

;;; Commentary:

;; This file contains startup code needed by all the various flavors
;; of Emacs for a Debian system.


(defun debian-pkg-add-load-path-item (item)
  "Takes a path item (a string) and adds it to load path in the
correct position for an add-on package, before the emacs system
directories, but after the /usr/local/ directories.  After modifying
load-path, returns the new load-path."
  (let ((pos 0)
        (last-local-pos nil)
        (lp-rest load-path))
    
    ;; Find the last /usr/local/ element.
    (while (not (null lp-rest))
      (if (and (not (null (car lp-rest)))
               (string-match "^/usr/local" (car lp-rest)))
          (setq last-local-pos pos))
      (setq pos (+ pos 1))
      (setq lp-rest (cdr lp-rest)))

    (if (not last-local-pos)
        (error "No /usr/local/ prefixed paths in load-path"))

    (let ((result '())
          (pos 0)
          (remainder load-path))
      (while (consp remainder)
        (setq result (cons (car remainder) result))
        (setq remainder (cdr remainder))
        (if (= pos last-local-pos)
            (setq result (cons item result)))
        (setq pos (+ pos 1)))
      (setq load-path (nreverse result))
      load-path)))

(defun debian-unique-strings (strings) 
  "Takes a list of strings and returns the list with *adjacent*
duplicates removed."
  (let ((result '()))
    (while (consp strings)
      (if (not (string= (car strings) (car (cdr strings))))
          (setq result (cons (car strings) result)))
      (setq strings (cdr strings)))
    (nreverse result)))

(defun debian-run-directories (&rest dirs)
  "Load each file of the form XXfilename.el or XXfilename.elc in any
of the dirs, where XX must be a number.  The files will be run in
alphabetical order.  If a file appears in more than one of the dirs,
then the earlier dir takes precedence, and a .elc file always
supercedes a .el file of the same name."

  (let* ((paths (mapcar 'copy-sequence dirs)) ; Ensure we have unique objects.

         ;; Get a list of all the files in all the specified
         ;; directories that match the pattern.
         (files
          (apply 'append 
                 (mapcar 
                  (lambda (dir) 
                    (directory-files dir nil "^[0-9][0-9].*\\.elc?$" t))
                  paths)))

         ;; Now strip the directory portion, remove any .el or .elc
         ;; extension.
         (stripped-names
          (mapcar (lambda (file) 
                    (if (string-match "\\.el$" file)
                        (substring file 0 -3)
                      (if (string-match "\\.elc$" file)
                          (substring file 0 -4)
                        file)))
                  (mapcar 
                   (lambda (file) (file-name-nondirectory file))
                   files)))
         
         ;; Finally sort them, and delete duplicates
         (base-names (debian-unique-strings (sort stripped-names 'string<))))

    (setq load-path (append paths load-path)) ; Prefix paths temporarily.
    ;; Now load the files.  "load" will make sure we get the byte
    ;; compiled one first, if any, and will respect load-path's
    ;; ordering.
    (mapc
     (lambda (file)
       (condition-case err
           (load file nil)
         (error (message "Error while loading %s: %s"
                         file (error-message-string err)))))
     base-names)
    ;; Remove the paths we inserted, and only those paths.
    (dolist (item paths)
      (setq load-path (remq item load-path)))))

(defun debian-startup (flavor)

  ;; Our handling of debian-emacs-flavor here is truly weird, but we
  ;; have to do it like this because some of the emacsen flavors
  ;; didn't DWIM in their startup sequence.  I wasn't as clear as I
  ;; should have been in debian-policy, but they were also
  ;; technically violating policy.

  ;; It's even weirder now.  I've changed policy back to the old way,
  ;; but I'm also doing some sanity checking here and making sure that
  ;; even debian-emacs-flavor gets set no matter what.  I'm in a rush
  ;; right now, but I'll come back later and make all this cleaner and
  ;; better documented.  Sorry.

  (unless (boundp 'debian-emacs-flavor)
    (defconst debian-emacs-flavor flavor
      "A symbol representing the particular debian flavor of emacs that's
running.  Something like 'emacs20, 'xemacs20, etc."))

  (let ((common-dir "/etc/emacs/site-start.d")
        (flavor-dir (concat "/etc/" (symbol-name flavor) "/site-start.d")))
    (debian-run-directories flavor-dir common-dir)))
