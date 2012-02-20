;;; man-addons.el - some helpful additions for browsing man pages.
;;;
;;; Copyright (c) 1998-2001 Karl M. Hegbloom <karlheg@hegbloom.net>
;;; Released under the terms of the GPL version >= 2.0
;;;
;;; See: /usr/share/common-licences/GPL-2
;;;
;;; The usual instructions apply...  Place this file in a directory on
;;; your `load-path' and then add (require 'man-addons) to your
;;; `user-init-file'.
;;;
;;; This is tested in XEmacs 21 with both the native XEmacs man.el and
;;; one I ported from GNU Emacs.  I hope it works equally well for GNU
;;; Emacs users.
;;;
;;; After loading this file, when you have man page source files
;;; visible from a `dired' buffer, you can push `l' when the cursor is
;;; over them, and preview the page in man mode.  I find this very
;;; helpful while editting manual pages!
;;;

;;;###autoload
(defun dired-man-locally ()
  "From a dired buffer, view the man page file at point, using \"man
  -l file\"."
  (interactive)
  (if (= 1 (function-max-args #'manual-entry))
      (manual-entry (concat (dired-get-filename) " -l"))
    (manual-entry (dired-get-filename) "-l")))

;;;###autoload
(add-hook 'dired-setup-keys-hook
	  #'(lambda ()
	      (define-key dired-mode-map [(?l)] #'dired-man-locally)))

(require 'thingatpt)

;;;###autoload
(defun man-locally-at-point ()
  "From any buffer, view the man page file at point, using \"man -l
  file\".  This is useful when you use `view-file' to visit one of the
  .list files in /var/lib/dpkg/info -- put the cursor over a man page
  listed there, and use `M-x man-locally-at-point' to view it."
  (interactive)
  (let ((manpage (thing-at-point 'filename)))
    (if (= 1 (function-max-args #'manual-entry))
        (manual-entry (concat manpage " -l"))
      (manual-entry manpage "-l"))))

(provide 'man-addons)
