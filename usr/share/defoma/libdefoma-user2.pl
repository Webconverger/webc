sub user_update {
    my @apps = &Debian::Defoma::Configure::get_apps();

    unless (@apps) {
	user_update_message("No application is ready for userlevel font ",
			    "autoconfiguration.");
	return;
    }
    
    user_update_message("Following applications are ready for userlevel font ",
			"autoconfiguration: @apps.");
    
    foreach my $app (@apps) {
	my $appinfo = &Debian::Defoma::Configure::get_app_info($app);

	my $ch = $appinfo->{script_change};
	if ($ch eq 'new') {
	    my $r = user_update_question(" $app is not configured for ",
					 USERLOGIN, ". ",
					 "Do you want to configure? ");

	    if ($r) {
		user_update_invoke("update", $app);
	    }
	} elsif ($ch eq 'updated') {
	    user_update_invoke("update", $app);
	} elsif ($ch eq 'obsoleted') {
	    user_update_invoke("purge", $app);
	} elsif ($ch eq 'same') {
	    user_update_message("font configuration for $app is up-to-date.");
	}
    }
}

1;
