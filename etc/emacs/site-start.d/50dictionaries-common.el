;; File: startup.el.in
;; Description: Emacsen startup for dictionaries-common in Debian
;; Authors: Rafael Laboissière <rafael@debian.org>
;;          Agustin Martin     <agmartin@debian.org>
;; Created on: Fri Oct 22 09:48:21 CEST 1999

(let ((skip-emacs-flavors-list '(emacs19
				 emacs20
				 emacs21
				 emacs22
				 emacs-snapshot))
      (debian-dict-entries "/var/cache/dictionaries-common/emacsen-ispell-dicts.el"))
  (if (member debian-emacs-flavor skip-emacs-flavors-list)
      (message "Skipping dictionaries-common setup for %s" debian-emacs-flavor)

    (debian-pkg-add-load-path-item
     (concat "/usr/share/"
	     (symbol-name debian-emacs-flavor)
	     "/site-lisp/dictionaries-common"))

    (autoload 'flyspell-word "flyspell" nil t)
    (autoload 'flyspell-mode "flyspell" nil t)
    (autoload 'flyspell-prog-mode "flyspell" nil t)

    ;; Load the Debian emacsen cache file, containing entries for each
    ;; installed dictionary.
    ;; Since this might result in a call to debian-ispell do this only if
    ;; it exists, that is, if package is not removed

    (if (file-exists-p "/usr/share/emacs/site-lisp/dictionaries-common/debian-ispell.el")
	(let ((coding-system-for-read 'raw-text)) ;; Read these as data streams
	  (load "debian-ispell" t)
	  (load debian-dict-entries t))
      (message "Info: Package dictionaries-common removed but not purged."))))

;;; Previous code for loading ispell.el and refreshing spell-checking
;;; pulldown menus has been removed from this file since it should no
;;; longer be needed.


