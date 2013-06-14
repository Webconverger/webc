# Returns a true value if there seems to be a system user account.
is_system_user () {
	if ! [ -e $ROOT/etc/passwd ]; then
		return 1
	fi
	
        # Assume NIS, or any uid from 1000 to 59999,  means there is a user.
        if grep -q '^+:' $ROOT/etc/passwd || \
           grep -q '^[^:]*:[^:]*:[1-9][0-9][0-9][0-9]:' $ROOT/etc/passwd || \
           grep -q '^[^:]*:[^:]*:[1-5][0-9][0-9][0-9][0-9]:' $ROOT/etc/passwd; then
                return 0
        else
                return 1
        fi
}

# Returns a true value if root already has a password.
root_password () {
	if ! [ -e $ROOT/etc/passwd ]; then
		return 1
	fi
	
	# Assume there is a root password if NIS is being used.
	if grep -q '^+:' $ROOT/etc/passwd; then
		return 0
	fi

	return 1
}
