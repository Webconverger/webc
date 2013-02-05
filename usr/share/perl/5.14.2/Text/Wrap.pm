package Text::Wrap;

use warnings::register;
require Exporter;

@ISA = qw(Exporter);
@EXPORT = qw(wrap fill);
@EXPORT_OK = qw($columns $break $huge);

$VERSION = 2009.0305;

use vars qw($VERSION $columns $debug $break $huge $unexpand $tabstop
	$separator $separator2);
use strict;

BEGIN	{
	$columns = 76;  # <= screen width
	$debug = 0;
	$break = '\s';
	$huge = 'wrap'; # alternatively: 'die' or 'overflow'
	$unexpand = 1;
	$tabstop = 8;
	$separator = "\n";
	$separator2 = undef;
}

use Text::Tabs qw(expand unexpand);

sub wrap
{
	my ($ip, $xp, @t) = @_;

	local($Text::Tabs::tabstop) = $tabstop;
	my $r = "";
	my $tail = pop(@t);
	my $t = expand(join("", (map { /\s+\z/ ? ( $_ ) : ($_, ' ') } @t), $tail));
	my $lead = $ip;
	my $nll = $columns - length(expand($xp)) - 1;
	if ($nll <= 0 && $xp ne '') {
		my $nc = length(expand($xp)) + 2;
		warnings::warnif "Increasing \$Text::Wrap::columns from $columns to $nc to accommodate length of subsequent tab";
		$columns = $nc;
		$nll = 1;
	}
	my $ll = $columns - length(expand($ip)) - 1;
	$ll = 0 if $ll < 0;
	my $nl = "";
	my $remainder = "";

	use re 'taint';

	pos($t) = 0;
	while ($t !~ /\G(?:$break)*\Z/gc) {
		if ($t =~ /\G([^\n]{0,$ll})($break|\n+|\z)/xmgc) {
			$r .= $unexpand 
				? unexpand($nl . $lead . $1)
				: $nl . $lead . $1;
			$remainder = $2;
		} elsif ($huge eq 'wrap' && $t =~ /\G([^\n]{$ll})/gc) {
			$r .= $unexpand 
				? unexpand($nl . $lead . $1)
				: $nl . $lead . $1;
			$remainder = defined($separator2) ? $separator2 : $separator;
		} elsif ($huge eq 'overflow' && $t =~ /\G([^\n]*?)($break|\n+|\z)/xmgc) {
			$r .= $unexpand 
				? unexpand($nl . $lead . $1)
				: $nl . $lead . $1;
			$remainder = $2;
		} elsif ($huge eq 'die') {
			die "couldn't wrap '$t'";
		} elsif ($columns < 2) {
			warnings::warnif "Increasing \$Text::Wrap::columns from $columns to 2";
			$columns = 2;
			return ($ip, $xp, @t);
		} else {
			die "This shouldn't happen";
		}
			
		$lead = $xp;
		$ll = $nll;
		$nl = defined($separator2)
			? ($remainder eq "\n"
				? "\n"
				: $separator2)
			: $separator;
	}
	$r .= $remainder;

	print "-----------$r---------\n" if $debug;

	print "Finish up with '$lead'\n" if $debug;

	$r .= $lead . substr($t, pos($t), length($t)-pos($t))
		if pos($t) ne length($t);

	print "-----------$r---------\n" if $debug;;

	return $r;
}

sub fill 
{
	my ($ip, $xp, @raw) = @_;
	my @para;
	my $pp;

	for $pp (split(/\n\s+/, join("\n",@raw))) {
		$pp =~ s/\s+/ /g;
		my $x = wrap($ip, $xp, $pp);
		push(@para, $x);
	}

	# if paragraph_indent is the same as line_indent, 
	# separate paragraphs with blank lines

	my $ps = ($ip eq $xp) ? "\n\n" : "\n";
	return join ($ps, @para);
}

1;
__END__

