// -*-c++-*-
//
// This file defines the names of sections known by aptitude for sv.
//
// Due to bug #260446, double-quotes (") cannot be backslash-escaped.
// For this reason, aptitude treats adjacent pairs of apostrophese('')
// as double-quotes: that is, the string "''" in a section description
// will be rendered as one double quote.  No other characters are
// affected by this behavior.

Aptitude::Sections
{
  Descriptions {
    Unknown	"Paket med ingen deklarerad sektion\n Ingen sektion har tilldelats dessa paket. Kanske är det på grund av ett fel i filen Packages?";
    Virtual	"Virtuella paket\n Dessa paket finns inte, de är namn som andra paket använder för att kräva eller tillhandahålla funktionalitet.";
    Tasks	"Paket som ställer in din dator att genomföra en speciell funktion\n Paket i sektionen ''Tasks'' innehåller inga filer, de är helt beroende av andra paket. Dessa paket ger ett enkelt sätt att välja en fördefinierad uppsättning av paket för en speciell funktion.";

    admin	"Administrativa verktyg (installationsprogram, hantera användare, etc)\n Paket i sektionen ''admin'' ger dig möjlighet att utföra administrativa uppgifter såsom programvaruinstallation, hantera användare, konfigurera och övervaka ditt system, analysera nätverkstrafik och så vidare.";
    alien	"Paket konverterade från ett främmande format (rpm, tgz, etc)\n Paket i sektionen ''alien'' skapades av programmet ''alien'' från ett icke-Debian-paketformat såsom RPM";
    base	"Debians grundsystem\n Paket i sektionen ''base'' är en del av den initiala systeminstallationen.";
    comm	"Program för faxmodem och andra kommunikationsenheter\n Paket i sektionen ''comm'' används för att kontrollera modem och andra hårdvaruenheter för kommunikation. Detta inkluderar programvara för att kontrollera faxmodem (till exempel PPP för uppringd förbindelse till Internet och program som ursprungligen skrevs för det ändamålet, såsom zmodem/kermit) såväl som programvara för att kontrollera mobiltelefoner, gränssnitt mot FidoNet och för att driva en BBS.";
    devel	"Verktyg och program för programvaruutveckling\n Paket i sektionen ''devel'' används för att skriva ny programvara och arbeta på befintlig programvara. Icke-programmare som inte bygger sin egna programvara kanske inte behöver så mycket programvara från denna sektion.\n\n Den inkluderar kompilatorer, verktyg för felsökning, redigerare för programmare, verktyg för att hantera källkod och andra saker relaterade till programvaruutveckling.";
    doc		"Dokumentation och specialiserade program för visning av dokumentation\n Paket i sektionen ''doc'' dokumenterar delar av Debiansystemet eller är visningsprogram för olika dokumentationsformat.";
    editors	"Textredigerare och ordbehandlare\n Paket i sektionen ''editors'' ger dig möjlighet att ändra ASCII-text. Dessa är inte nödvändigtvis ordbehandlare även om några ordbehandlare kan hittas i denna sektion.";
    electronics	"Program för arbete med kretsar och elektronik\n Paket i sektionen ''electronics'' inkluderar verktyg för kretsdesign, simulatorer och assemblers för mikrokontrollrar och annan relaterad programvara.";
    embedded	"Program för inbäddade system\n Paket i sektionen ''embedded'' är tänkta att köras på inbäddade enheter. Inbäddade enheter är specialiserade hårdvaruenheter med mycket mindre kraft än en normal arbetsstation, till exempel en PDA, en mobiltelefon eller en TiVo.";
    gnome	"Skrivbordsmiljön GNOME\n GNOME är en samling programvaror som tillhandahåller ett enkelt sätt att använda skrivbordsmiljön för Linux.  Paketen i sektionen ''gnome'' är en del av GNOME-miljön och är tätt integrerade med den.";
    games	"Spel, leksaker och roliga program\n Paket i sektionen ''games'' är tänkt primärt för underhållning.";
    graphics	"Verktyg för att skapa, visa och redigera grafiska filer\n Paket i sektionen ''graphics'' inkluderar visningsprogram för bildfiler, programvara för hantering och manipulation av bilder, programvara att interagera med grafikhårdvara (såsom videokort, bildläsare och digitalkameror) och programmeringsverktyg för hantering av grafik.";
    hamradio	"Programvaror för HAM-radiooperatörer\n Paket i sektionen ''hamradio'' är tänkt primärt för HAM-radiooperatörer.";
    interpreters "Tolk för tolkade språk\n Paket i sektionen ''interpreters'' inkluderar tolkare för språk såsom Python, Perl och Ruby såväl bibliotek för dessa språk.";
    kde		"Skrivbordsmiljön KDE\n KDE är en samling programvaror som tillhandahåller ett enkelt sätt att använda skrivbordsmiljön för Linux.  Paketen i sektionen ''kde'' är en del av KDE-miljön och är tätt integrerade med den.";
    libdevel	"Utvecklingsfiler för bibliotek\n Paket i sektionen ''libdevel'' innehåller filer som är nödvändiga för att bygga program som använder bibliotek i sektionen ''libs''.  Du behöver inte paket från denna sektion om du inte ska bygga program själv.";
    libs	"Samlingar av programvarurutiner\n Paket i sektionen ''libs'' tillhandahåller nödvändig funktionalitet för annan programvara på datorn. Med några få undantag bör du inte installera paket från denna sektion; paketsystemet kommer att installera dem för att tillfredsställa beroenden.";
    perl	"Perl-tolk och bibliotek\n Paket i sektionen ''perl'' tillhandahåller programmeringsspråket Perl och många bibliotek för det. Om du inte är en Perl-programmerare behöver du inte installera paket från denna sektion, paketsystemet kommer att installera dem åt dig om de behövs.";
    python	"Python-tolk och bibliotek\n Paket i sektionen ''python'' tillhandahåller programmeringsspråket Python och många bibliotek för det. Om du inte är en Python-programmerare behöver du inte installera paket från denna sektion, paketsystemet kommer att installera dem åt dig om de behövs.";
    mail	"Program för att skriva, skicka och dirigera e-postmeddelanden\n Paket i sektionen ''mail'' inkluderar e-postläsare, transportdemoner, programvara för sändlistor och skräpfilter såväl som annan programvara relaterad till elektroniska meddelanden.";
    math	"Numeriska analyser och andra matematiskt relaterade programvaror\n Paket i sektionen ''math'' inkluderar miniräknare, språk för matematiska beräkningar (liknande Mathematica), symboliska algebrapaket och program för att visualisera matematiska objekt.";
    misc	"Allmäna programvaror\n Paket i sektionen ''misc'' har en för ovanlig funktion för att klassificeras.";
    net		"Program för att ansluta till och tillhandahålla olika tjänster\n Paket i sektionen ''net'' inkluderar klienter och servrar för många olika protokoll, verktyg för att manipulera och felsöka nätverksprotokoll på låg nivå, snabbmeddelandesystem och annan nätverksrelaterad programvara.";
    news	"Usenet-klienter och servrar\n Paket i sektionen ''news'' är relaterade till distribution av nyhetsgrupper på Usenet.  De inkluderar nyhetsläsare och nyhetsservrar.";
    oldlibs	"Föråldrade bibliotek\n Paket i sektionen ''oldlibs'' är föråldrade och bör inte användas av nya programvaror.  De tillhandahålls av kompatibilitetsskäl eller för att programvara distribuerad av Debian fortfarande använder dem.\n .\n Med väldigt få undantag behöver du inte installera paket från denna sektion, paketsystemet kommer att installera dem om de krävs för att uppfylla beroenden.";
    otherosfs	"Emulatorer och programvaror för att läsa främmande filsystem\n Paket i sektionen ''otherosfs'' emulerar hårdvara och operativsystem, och ger verktyg för att överföra data mellan olika operativsystem och hårdvaruplattformar. (till exempel, verktyg för att läsa DOS-disketter och verktyg för att kommunicera med Palm Pilot)\n .\n Det är värt att notera att programvaror för cd-bränning finns inkluderade i DENNA sektion.";
    science	"Programvaror för vetenskapsarbete\n Paket i sektionen ''science'' inkluderar verktyg för astronomi, biologi och kemi såväl som annan programvara relaterad till vetenskap/forskning.";
    shells	"Kommandoskal och alternativa konsollmiljöer\n Paket i sektionen ''shells'' inkluderar program som tillhandahåller ett kommandoradsgränssnitt.";
    sound	"Verktyg för att spela upp och spela in ljud\n Paket i sektionen ''sound'' inkluderar ljuduppspelare, inspelare och kodare för många format, mixrar och volymkontrollerare, MIDI-sequencers och program för att generera noter, drivrutiner för ljudhårdvara och programvara för att hantera ljud.";
    tex		"TeX-typsättningssystemet\n Paket i sektionen ''tex'' är relaterade till TeX, ett system för produktion av högkvalitativa typsättningar.  De inkluderar själva TeX, TeX-paket, redigerare designade för TeX, verktyg för att konvertera TeX och TeX-skrivna filer till olika format, TeX-typsnitt och annan relaterad programvara för TeX.";
    text	"Textbearbetningsverktyg\n Paketen i sektionen ''text'' inkluderar textfiler och textbearbetare, stavningskontroll, ordboksprogram, verktyg för konvertering mellan olika teckenkodningar och textfilformat (såsom Unix och DOS), textformaterare och fina utskrifter och annan programvara som hanterar vanlig text.";
    utils	"Olika systemverktyg\n Paket i sektionen ''utils'' är verktyg vars avsikter är för unika för att klassificeras.";
    web		"Webbläsare, servrar, proxyservrar och andra verktyg\n Paket in sektionen ''web'' inkluderar webbläsare, webbservrar och proxyservrar, program för att skriva CGI-skript eller webbaserade program, redan skrivna webbaserade program och andra programvaror relaterade till webben.";
    x11		"Fönsterhanteraren X och relaterade programvaror\n Paket i sektionen ''x11'' inkluderar kärnpaket för fönstersystemet X, fönsterhanterare, verktyg för X och allmänna program med ett X-gränssnitt som har placerats här för att de inte passade in någon annanstans.";

    main	"Huvudarkivet för Debian\n Debian-utgåvan innehåller paket från sektionen ''main''. Alla paket i ''main'' är fri programvara.\n\n För mer information om vad Debian anser vara fri programvara, se http://www.debian.org/social_contract#guidelines";
    contrib	"Program som är beroende av programvara som inte finns i Debian\n Paket i sektionen ''contrib'' är inte en del av Debian.\n .\n Dessa paket är fri programvara men de är beroende av programvara som inte är en del av Debian.  Detta kan bero på att de inte är fri programvara men är paketerade i arkivsektionen ''non-free'' för att Debian inte kan distribuera det alls eller (i få fall) för att ingen har paketerat det än.\n .\n För mer information om vad Debian anser vara fri programvara, se http://www.debian.org/social_contract#guidelines";
    non-free	"Program som inte är fri programvara\n Paket i sektionen ''non-free'' är inte en del av Debian.\n .\n Dessa paket klarar inte ett eller flera av kraven för Debians riktlinjer för fri programvara (se nedan). Du bör läsa licensen för programmen i denna sektion för att vara säker på att du har tillåtelse att använda dem på det sätt du önskar.\n .\nFör mer information om vad Debian anser vara fri programvara, se http://www.debian.org/social_contract#guidelines";
    non-US	"Program lagrade utanför USA på grund av exportrestriktioner\n Paket i sektionen ''non-US'' innehåller sannolikt kryptografi, ett antal implementerade patenterade algoritmer. Därför kan de inte exporteras från USA och därför är de lagrade på en server i ''den fria världen''.\n\n Notera: Debianprojektet jobbar för närvarande med att flytta in kryptografisk programvara in i USA-baserade arkiv efter konsultering med juridiska experter efter de senaste ändringarna i exportpolicyn. De flesta paket som tidigare kunde hittas i denna sektion finns numera i ''main''.";
  };
};

