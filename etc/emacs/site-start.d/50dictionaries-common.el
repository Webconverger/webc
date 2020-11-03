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

    ;; Load Debian emacsen cache file, with entries for installed dictionaries
    ;; This might result in a call to debian-ispell, so do this only if
    ;;  a) It exists, that is, package is not removed.
    ;;  b) Not in installations under dpkg control, otherwise we might get some
    ;;     bogus errors on installation because of #132355 and friends.
    (if (file-exists-p
	 (concat "/usr/share/"
		 (symbol-name debian-emacs-flavor)
		 "/site-lisp/dictionaries-common/debian-ispell.el"))
	(if (getenv "DPKG_RUNNING_VERSION")
	    (message "Info: Skip debian-el loading if run under dpkg control.")
	  (let ((coding-system-for-read 'raw-text)) ;; Read these as data streams
	    (load "debian-ispell" t)
	    (load debian-dict-entries t)))
      (message "Info: Package dictionaries-common removed but not purged."))))

;;; Previous code for loading ispell.el and refreshing spell-checking
;;; pulldown menus has been removed from this file since it should no
;;; longer be needed.
