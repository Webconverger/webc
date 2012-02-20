// -*-c++-*-
//
// This file defines the names of sections known by aptitude for cs.
//
// Due to bug #260446, double-quotes (") cannot be backslash-escaped.
// For this reason, aptitude treats adjacent pairs of apostrophese('')
// as double-quotes: that is, the string "''" in a section description
// will be rendered as one double quote.  No other characters are
// affected by this behavior.

Aptitude::Sections
{
  Descriptions {
    Unknown	"Balíky bez sekce\n Těmto balíkům nebyla přiřazena žádná sekce. Možná je chyba v souboru Packages?";
    Virtual	"Virtuální balíky\n Tyto balíky fyzicky neexistují; jsou to pouze jména, která využívají ostatní balíky vyžadující určitou funkčnost.";
    Tasks	"Balíky, které nastaví počítač pro vykonávání určité úlohy\n Balíky v sekci „Úlohy“ neobsahují žádné soubory, pouze závisí na ostatních balících. Tyto balíky nabízí jednoduchou cestu k instalaci všech balíků potřebných pro vykonávání určité úlohy.";

    admin	"Nástroje pro správu (instalace softwaru, správa uživatelů, atd.)\n Balíky v sekci „admin“ umožňují provádět správu systému, jako instalaci softwaru, správu uživatelů, nastavení a sledování systému, zkoumání síťového provozu, a tak podobně.";
    alien	"Balíky konvertované z cizích formátů (rpm, tgz, atd.)\n Balíky ze sekce „alien“ byly vytvořeny programem „alien“ z cizích formátů balíků, jako třeba RPM";
    base	"Základní systém Debianu\n Balíky ze sekce „base“ jsou součástí minimální instalace systému.";
    comm	"Programy pro faxmodemy a jiná komunikační zařízení\n Balíky ze sekce „comm“ se používají k ovládání modemů a dalších hardwarových komunikačních zařízení. To zahrnuje software pro faxmodemy (např. PPP pro vytáčené připojení k Internetu a původní software jako zmodem/kermit), mobilní telefony, rozhraní k FidoNetu, nebo vlastní BBS server.";
    devel	"Nástroje pro vývoj softwaru\n Balíky ze sekce „devel“ jsou používány k psaní nových programů a upravování programů stávajících. Neprogramátoři, kteří si sami nekompilují programy, z této sekce asi mnoho nepotřebují.\n .\n Zahrnuty jsou kompilátory, debugovací nástroje, programátorské editory, nástroje pro zpracování zdrojových textů a další věci s programováním spojené.";
    doc		"Dokumentace a programy pro její prohlížení\n Balíky ze sekce „doc“ dokumentují různé části Debianu, nebo slouží k prohlížení této dokumentace.";
    editors	"Textové editory a procesory\n Balíky ze sekce „editors“ umožňují editovat čistý ASCII text. Tyto nástroje nejsou textovými procesory, i když i ty můžete v této sekci nalézt.";
    electronics	"Programy pro práci s el. obvody a elektronikou\n Balíky ze sekce „electronics“ obsahují nástroje pro návrh elektrických obvodů, simulátory a assemblery mikrokontolerů a podobný software.";
    embedded	"Programy pro vložené (embeded) systémy\n Balíky ze sekce „embedded“ slouží k běhu na vložených zařízeních. Vložená zařízení jsou specializovaná hardwarová zařízení s minimálním příkonem, jako třeba PDA, mobilní telefony, nebo Tivo.";
    gnome	"Desktopové prostředí GNOME\n GNOME je kolekce programů, které společně nabízejí jednoduché a příjemné desktopové prostředí. Balíky v sekci „gnome“ jsou přímo součástí prostředí GNOME, nebo s ním úzce souvisí.";
    games	"Hry, hračky a zábavné programy\n Balíky ze sekce „games“ slouží primárně pro zábavu.";
    graphics	"Nástroje pro vytváření, prohlížení a úpravu grafických souborů\n Balíky v sekci „graphics“ zahrnují prohlížeče obrázků, software pro úpravu obrázků, software pro komunikaci s grafickým hardwarem (jako jsou grafické karty, scannery a digitální kamery) a také programovací nástroje pro řešení grafických úloh";
    hamradio	"Software pro radioamatéry\n Balíky v sekci „hamradio“ jsou primárně cílené na radioamatéry.";
    interpreters "Interprety pro interpretované jazyky\n Balíky v sekci „interpreters“ obsahují interprety pro jazyky jako Python, Perl nebo Ruby a také jejich rozšiřující knihovny.";
    kde		"Desktopové prostředí KDE\n KDE je kolekce programů, které společně nabízejí jednoduché a příjemné desktopové prostředí. Balíky v sekci „kde“ jsou přímo součástí prostředí KDE, nebo s ním úzce souvisí.";
    libdevel	"Vývojové soubory pro knihovny\n Balíky ze sekce „libdevel“ obsahují soubory vyžadované pro sestavení programů, které využívají knihovny ze sekce „libs“. Běžný uživatel tyto balíky nepotřebuje. (Pokud si ovšem nechcete sestavit systém sami.)";
    libs	"Kolekce softwarových knihoven\n Balíky ze sekce „libs“ poskytují nezbytnou funkcionalitu počítačovým programům. Kromě několika výjimek nemusíte v této sekci nic vybírat; balíčkovací systém si díky závislostem nainstaluje vše potřebné.";
    perl	"Interpret Perlu a rozšiřující knihovny\n Balíky ze sekce „perl“ poskytují programovací jazyk Perl a mnoho rozšiřujících knihoven z dalších zdrojů. Pokud nejste perlový programátor, nemusíte zde nic vybírat; pokud budou nějaké balíky potřeba, balíčkovací systém si díky závislostem nainstaluje vše potřebné.";
    python	"Interpret Pythonu a rozšiřující knihovny\n Balíky ze sekce „python“ poskytují programovací jazyk Python a mnoho rozšiřujících knihoven z dalších zdrojů. Pokud nejste pythonový programátor, nemusíte zde nic vybírat; pokud budou nějaké balíky potřeba, balíčkovací systém si díky závislostem nainstaluje vše potřebné.";
    mail	"Programy pro čtení, psaní, posílání a směrování pošty\n Balíky ze sekce „mail“ obsahují programy pro čtení pošty, poštovní démony, software pro poštovní konference, spamové filtry a spřízněné nástroje pro práci s elektronickou poštou.";
    math	"Numerická analýza a jiný matematický software\n Balíky ze sekce „math“ zahrnují kalkulačky, jazyky pro matematické výpočty (podobné s programem Mathematica), balíky pro symbolickou algebru a nástroje pro vizualizaci matematických objektů.";
    misc	"Nejrůznější software\n Balíky v sekci „misc“ mají tak neobvyklý účel, že se nedají zařadit jinam.";
    net		"Programy pro síťování a poskytování síťových služeb\n Balíky ze sekce „net“ obsahují klienty a servery mnoha protokolů, nástroje pro manipulaci a ladění nízkoúrovňových síťových protokolů, IM systémy a mnoho dalších síťových programů.";
    news	"Usenetoví klienti a servery\n Balíky ze sekce „news“ jsou spojeny s distribuovaným systémem Usenet news. Naleznete zde prohlížeče, stejně jako news servery.";
    oldlibs	"Zastaralé knihovny\n Balíky ze sekce „oldlibs“ jsou staré a v nových programech by se neměly používat. Poskytujeme je z důvodů kompatibility, protože některý software je stále může vyžadovat.\n .\n Kromě několika výjimek nemusíte v této sekci nic vybírat; balíčkovací systém si díky závislostem nainstaluje vše potřebné.";
    otherosfs	"Emulátory a nástroje pro přístup k cizím souborovým systémům\n Balíky ze sekce „otherosfs“ emulují různý hardware a operační systémy a poskytují nástroje pro přenos dat mezi různými operačními systémy a hardwarovými platformami. (Například komunikace s Palm Piloty.)\n .\n Je vhodné zmínit, že v TÉTO sekci je i software pro vypalování CD.";
    science	"Software pro vědeckou práci\n Balíky ze sekce „science“ zahrnují nástroje pro astronomii, biologii, chemii a software pro spřízněné obory.";
    shells	"Shelly a alternativní konzolová prostředí\n Balíky ze sekce „shells“ obsahují programy s řádkovým rozhraním.";
    sound	"Nástroje pro přehrávání a nahrávání zvuků\n Balíky ze sekce „sound“ zahrnují přehrávače, rekordéry a enkodéry mnoha formátů, mixážní pulty a ovladače hlasitosti, MIDI sekvencéry, programy pro zápis not, ovladače zvukových zařízení a software pro zpracování zvuku.";
    tex		"Typografický systém TeX\n Balíky ze sekce „tex“ jsou spřízněny s TeXem, systémem pro vytváření vysoce kvalitních výstupů. Zahrnují samotný TeX, editory speciálně navržené pro TeX, nástroje pro převod TeXových souborů do mnoha formátů, TeXové fonty a další příbuzný software.";
    text	"Nástroje pro zpracování textu\n Balíky ze sekce „text“ obsahují textové filtry, procesory, slovníky, hlídače překlepů, konverzní programy pro převod mezi různými formáty a nejrůznějšími kódováními, formátovače textu a další software, který pracuje s čistým textem.";
    utils	"Různé systémové nástroje\n Balíky v sekci „utils“ jsou nástroje, jejichž účel je příliš specifický pro zařazení do konkrétní skupiny.";
    web		"Webové prohlížeče, servery a okolní programy\n Balíky ze sekce „web“ nabízí webové prohlížeče, webové servery a proxy, software pro psaní CGI skriptů nebo webových služeb, a vůbec vše, co se týká World Wide Webu.";
    x11		"X Window System a spřízněný software\n Balíky v sekci „x11“ zahrnují jádro X Window Systému, správce oken, nástroje pro X a různé programy s grafickým X rozhraním, které se nehodily do žádné jiné kategorie.";

    main	"Hlavní archiv Debianu\n Debian se skládá z balíků ze sekce „main“. Každý balík v této sekci je svobodným softwarem.\n .\n Více informací o tom, co Debian považuje za svobodný software, naleznete v http://www.debian.org/social_contract#guidelines, nebo česky na http://www.debian.cz/info/social_contract.php#guidelines.";
    contrib	"Programy závisející na softwaru, který není v Debianu\n Balíky v sekci „contrib“ nejsou součástí Debianu.\n .\n Tyto balíky jsou svobodným softwarem, ale závisí na softwaru, který není součástí Debianu. To může mít dvě příčiny. Buď je tento software nesvobodný, nebo (zřídka) jej ještě nikdo nezabalil.\n .\n Více informací o tom, co Debian považuje za svobodný software, naleznete v http://www.debian.org/social_contract#guidelines, nebo česky na http://www.debian.cz/info/social_contract.php#guidelines.";
    non-free	"Nesvobodný software\n Balíky v sekci „non-free“ nejsou součástí Debianu.\n .\n Tyto balíky nesplňují některé požadavky z Debian Free Software Guidelines. Před použitím těchto balíků si přečtěte jejich licenční podmínky, zda můžete software používat pro zamýšlené účely.\n .\n Více informací o tom, co Debian považuje za svobodný software, naleznete v http://www.debian.org/social_contract#guidelines, nebo česky na http://www.debian.cz/info/social_contract.php#guidelines.";
    non-US	"Programy uložené mimo USA kvůli exportním omezením\n Balíky ze sekce „non-US“ nejčastěji obsahují kryptografii a několik patentovaných algoritmů. Díky tomu nemohou být vyváženy ze Spojených států a proto jsou uloženy na serverech ve „svobodném“ světě.\n .\n Poznámka: Po nedávných změnách v exportní politice USA jsou nyní tyto balíky přesouvány do hlavního archivu v sekci „main“.";
  };
};

