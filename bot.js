var PlugAPI = require('./plugapi');
var ROOM = 'christian-anything-2';
var UPDATECODE = 'h90'; 

var Lastfm = require('simple-lastfm');
var version = "2.9.0";

var Theme = "The current theme for this room is Christian Music, sung by Christian Bands";
var joined = new Date().getTime();
var translateList = [];

var lastfm = new Lastfm({
    api_key: 'dc116468a760d9c586562d79e302aadf',
    api_secret: 'c68c25364ccfa0961f60abe9250f8233',
    username: 'kingzimmer',
    password: 'Starwarskotor12345'
});

var LastfmAPI = require('lastfmapi');

var lfm = new LastfmAPI({
    api_key : 'dc116468a760d9c586562d79e302aadf',
    secret : 'c68c25364ccfa0961f60abe9250f8233'
});

var mlexer = require('math-lexer');
var google_geocoding = require('google-geocoding');
var weather = require('weathers');
var api = require('dictionaryapi');
var Wiki = require("wikijs");
var MsTranslator = require('mstranslator'); 
var client = new MsTranslator({client_id:"MegaBot", client_secret: "BUjjotOXGYXYbYnioSklbU0CSRM5gBBhag4piJ9F+9M="}); 

// Instead of providing the AUTH, you can use this static method to get the AUTH cookie via twitter login credentials:
PlugAPI.getAuth({
    username: 'PlugDJBot2',
    password: 'Starwarskotor1'
}, function(err, auth) { // if err is defined, an error occurred, most likely incorrect login
    if(err) {
        console.log("An error occurred: " + err);
        return;
    }
    var bot = new PlugAPI(auth, UPDATECODE);
	
    bot.connect(ROOM);

    bot.on('roomJoin', function(data) {
        // data object has information on the room - list of users, song currently playing, etc.
        console.log("Joined " + ROOM + ": ", data);
        bot.chat('Ready for Action!');
         
    bot.on('userJoin', function(data) {
        bot.chat('Welcome to Christian Anything. Have fun and worship with us to celebrate our king, God.');
    });
    
    bot.on('userLeave', function(data) {
        bot.chat('Bye, have a wonderful day!');
    });
    
    var reconnect = function() { 
        bot.connect(ROOM);
    };

    bot.on('close', reconnect);
    bot.on('error', reconnect);

     bot.on('djAdvance', function(data) {
        bot.chat("Now Playing" + " - " + bot.getMedia().title + " - " + bot.getMedia().author);
    });
    
    bot.on('chat', function(data) {
        //if (data.from == 'christian-anything-2') {
            var command = data.message.split(' ')[0];
            var firstIndex = data.message.indexOf(' ');
            var qualifier = "";
            if (firstIndex!=-1) {
                qualifier = data.message.substring(firstIndex+1, data.message.length); 
            }
            qualifier=qualifier.replace(/&#39;/g, '\'');
            qualifier=qualifier.replace(/&#34;/g, '\"');
            qualifier=qualifier.replace(/&amp;/g, '\&');
            qualifier=qualifier.replace(/&lt;/gi, '\<');
            qualifier=qualifier.replace(/&gt;/gi, '\>');
            switch (command)
            {
            case ".commands":
            case ".command":
            case ".list":
            case ".commandlist":
                bot.chat("List of Commands: .commands, .hey, .woot, .meh, .props, .calc, .join, .leave, .skip, .forecast, .version, .artist, .track, .genre, .github, .help, .about, .define, .grab, .facebook, .wiki, .darkside, .rank, .like, .theme, .translate, .google, .status, .coin, .mood, .autotranslate, .untranslate, .album, .similar, .events, .soundcloud, .lottery, .rules, .eggs, .pita, .8ball, Mega-Bot, .songlink, .download, .votes, .ping, .temp, .songid");
                break;
            case ".hey":
            case ".hello":
            case ".hi":
            case ".aloha":
                bot.chat("Well hey there! @" + data.from);
                break;
            case ".woot":
            case ".awesome":
            case ".love":
            case ".dance":
                bot.woot();
                bot.chat("I love this song.");
                break;
            case ".meh":
            case ".lame":
            case ".hate":
            case ".boo":
                bot.meh();
                bot.chat("I hate this song.");
                break;
            case ".props":
            case ".propsicle":
            case ".propstick":
            case ".propbat":
                console.log(bot.getDJs()[0].username, bot.getDJs(), bot.getDJs()[0]);
                bot.chat("Epic Play! @" + bot.getDJs()[0].username);
                bot.woot();
                break;
            case ".calc":
            case ".calculate":
            case ".figure":
            case ".function":
                var counter = 0;
                var counter2 = 0;
                for (var i=0; i<qualifier.length; i++) {
                    if (qualifier.charAt(i)=='(') {
                        counter++;
                    } 
                    else if(qualifier.charAt(i)==')') {
                        counter2++;
                    } 
                }
                qualifier=qualifier.replace(/x/g, '*');
                if (qualifier!="" && !(/\d\(/g.test(qualifier)) && !(/[\!\,\@\'\"\?\#\$\%\&\_\=\<\>\:\;\[\]\{\}\`\~\||log]/g.test(qualifier)) &&  !(/\^\s{0,}\d{0,}\s{0,}\^/g.test(qualifier)) && !(/\)\d/g.test(qualifier)) && !(/^[\+\*\/\^]/g.test(qualifier)) && !(/[\+\-\*\/\^]$/g.test(qualifier)) && !(/[\+\-\*\/\^]\s{0,}[\+\*\/\^]/g.test(qualifier)) && !(/\d\s{1,}\d/g.test(qualifier)) && !(/\s\.\s/g.test(qualifier)) && !(/\.\d\./g.test(qualifier)) && !(/\d\.\s{1,}\d/g.test(qualifier)) && !(/\d\s{1,}\.\d/g.test(qualifier)) && !(/\.\./g.test(qualifier)) && (!(/([a-zA-Z])/g.test(qualifier))) && counter==counter2){
                    var func=qualifier;
                    func+=" + (0*x) + (0*y)";
                    var realfunc=mlexer.parseString(func);
                    var answer=(realfunc({x:0,y:0}));
                    if (answer.toString()!="NaN"){
                        if (answer.toString()!="Infinity"){
                            bot.chat(answer.toString());
                        }
                        else {
                            bot.chat('http://i.imgur.com/KpAzEs8.jpg');
                        }
                    }
                    else {
                        bot.chat("/me does not compute.");
                    }
                }
                else if (qualifier===""){
                    bot.chat("Try .calc followed by something to calculate.");
                }
                else {
                    bot.chat("/me does not compute.");
                }
                break;
            case ".join":
            case ".jump":
            case ".up":
            case ".go":
                bot.waitListJoin();
                bot.chat("Joining The Waitlist!");
                break;
            case ".leave":
            case ".jump down":
            case ".down":
            case ".stop":
                bot.waitListLeave();
                bot.chat("Leaving The Waitlist.");
                break;
            case ".skip":
                bot.skipSong(bot.getDJs()[0].id);
                bot.chat("Skipping The Song!");
                break;
            case ".forecast": 
                if (qualifier===""){
                    bot.chat("Try .forecast followed by a US state, city, or zip to look up.");
                }
                else {
                    google_geocoding.geocode(qualifier, function(err, location) {
                        if (location!==null){
                            weather.getWeather(location.lat, location.lng, function(err, data){
                                if (data!==null){
                                    var weekForecast="Forecast for "+data.location.areaDescription+": Current: "+data.currentobservation.Temp+"°F "+data.currentobservation.Weather;
                                    for (var i=0; i<7; i++){
                                        var day = data.time.startPeriodName[i].split(' ');
                                        if (day[1]!='Night'){
                                            weekForecast=weekForecast+"; "+data.time.startPeriodName[i]+": ";
                                        }
                                        else {
                                            weekForecast=weekForecast+", ";
                                        }
                                        weekForecast=weekForecast+data.time.tempLabel[i]+": "+data.data.temperature[i]+"°F";
                                    } 
                                    weekForecast=weekForecast.replace(/Sunday/g, 'Sun');
                                    weekForecast=weekForecast.replace(/Monday/g, 'Mon');
                                    weekForecast=weekForecast.replace(/Tuesday/g, 'Tues');
                                    weekForecast=weekForecast.replace(/Wednesday/g, 'Wed');
                                    weekForecast=weekForecast.replace(/Thursday/g, 'Thurs');
                                    weekForecast=weekForecast.replace(/Friday/g, 'Fri');
                                    weekForecast=weekForecast.replace(/Saturday/g, 'Sat');
                                    bot.chat(weekForecast);
                                }
                                else {
                                    bot.chat("No weather found.");
                                }
                            });
                        }
                        else {
                            bot.chat("No weather found.");
                        }
                    });
                }
                break;
            case ".temp": 
            case ".temperature":
                if (qualifier==""){
                    bot.chat("Try .temp followed by a US state, city, or zip to look up.");
                }
                else{
                    google_geocoding.geocode(qualifier, function(err, location) {
                        if (location!=null){
                            weather.getWeather(location.lat, location.lng, function(err, data){
                                if (data!=null){
                                    var temp="Current temperature in "+data.location.areaDescription+": "+data.currentobservation.Temp+"°F "+data.currentobservation.Weather;
                                    bot.chat(temp);
                                }
                                else{
                                    bot.chat("No temperature found.");
                                }
                            });
                        }
                        else{
                            bot.chat("No temperature found.");
                        }
                    });
                }
                break;
            case ".version":
                bot.chat(version);
                break;
            case ".artist": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                }
                else{
                    artistChoice=qualifier;
                }
                lastfm.getArtistInfo({
                    artist: artistChoice,
                    callback: function(result) { 
                        if (result.success==true){
                            if (result.artistInfo.bio.summary!=""){
                                var summary=result.artistInfo.bio.summary;
                                summary=summary.replace(/(&quot;)/g, '"');
                                summary=summary.replace(/(&amp;)/g, '&');
                                summary=summary.replace(/(&eacute;)/g, 'é');
                                summary=summary.replace(/(&aacute;)/g, 'á');
                                summary=summary.replace(/(&auml;)/g, 'ä');
                                summary=summary.replace(/(&iacute;)/g, 'í');
                                summary=summary.replace(/(&oacute;)/g, 'ó');
                                summary=summary.replace(/<[^>]+>/g, '');
                                if (summary.indexOf(" 1) ") != -1){
                                    summary=summary.substring(summary.lastIndexOf(" 1) ")+4);
                                    if (summary.indexOf(" 2) ") != -1){
                                        summary=summary.substring(0, summary.lastIndexOf(" 2)"));
                                    }
                                }   
                                else if (summary.indexOf(" 1. ") != -1){
                                    summary=summary.substring(summary.lastIndexOf(" 1. ")+4);
                                    if (summary.indexOf(" 2. ") != -1){
                                        summary=summary.substring(0, summary.lastIndexOf(" 2."));
                                    }
                                }     
                                else if (summary.indexOf(" (1) ") != -1){
                                    summary=summary.substring(summary.lastIndexOf(" (1) ")+4);
                                    if (summary.indexOf(" (2) ") != -1){
                                        summary=summary.substring(0, summary.lastIndexOf(" (2)"));
                                    }
                                }        
                                if (summary.length>250){
                                    summary=summary.substring(0, 247)+"...";
                                }                           
                                bot.chat(summary); 
                                var lastfmArtist=artistChoice;
                                lastfmArtist=lastfmArtist.replace(/ /g, '+');
                                bot.chat("For more info: http://www.last.fm/music/" + lastfmArtist);
                            }
                            else {
                                bot.chat("No artist info found.");
                            }
                        }
                        else {
                            bot.chat("No artist info found.");
                        }
                    }
                });
                break;
            case ".track":
                lastfm.getTrackInfo({
                    artist: bot.getMedia().author,
                    track: bot.getMedia().title,
                    callback: function(result) {
                        if (result.success==true){
                            if (result.trackInfo.wiki!=undefined){
                                var summary=result.trackInfo.wiki.summary;
                                summary=summary.replace(/(&quot;)/g, '"');
                                summary=summary.replace(/(&amp;)/g, '&');
                                summary=summary.replace(/(&eacute;)/g, 'é');
                                summary=summary.replace(/(&aacute;)/g, 'á');
                                summary=summary.replace(/(&auml;)/g, 'ä');
                                summary=summary.replace(/<[^>]+>/g, '');
                                if (summary.length>250){
                                    summary=summary.substring(0, 247)+"...";
                                }  
                                bot.chat(summary);
                            }
                            else {
                                bot.chat("No track info found.");
                            }
                        }
                        else {
                            bot.chat("No track info found.");
                        }
                    }
                });
                break;
            case ".genre": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                    trackChoice=bot.getMedia().title;
                }
                else{
                    artistChoice=qualifier;
                    trackChoice=null;
                }
                lastfm.getTags({
                    artist: artistChoice,
                    track: trackChoice,
                    callback: function(result) {
                        var tags = "";
                        if (result.tags!=undefined){
                            for (var i=0; i<result.tags.length; i++){
                                tags+=result.tags[i].name;
                                tags+=", ";
                            }
                            tags=tags.substring(0, tags.length-2);
                        }
                        if (qualifier==""){
                            if (tags!=""){
                                bot.chat("Genre of "+trackChoice+" by "+artistChoice+": "+tags);
                            }
                            else{
                                bot.chat("No genre found.");
                            }
                        }
                        else{
                            if (tags!=""){
                                bot.chat("Genre of "+artistChoice+": "+tags);
                            }
                            else{
                                bot.chat("No genre found.");
                            }
                        }
                    }
                });
                break;
            case ".album": 
                lfm.track.getInfo({
                    'artist' : bot.getMedia().author,
                    'track' : bot.getMedia().title
                }, function (err, track) {
                    if (track!=undefined){
                        lfm.album.getInfo({
                            'artist' : bot.getMedia().author,
                            'album' : track.album.title
                        }, function (err, album) {
                            var albumMessage = track.name + " is from the album " + track.album.title;
                            if (album.wiki!=undefined){
                                if (album.wiki.summary.indexOf('released on') != -1){
                                    var year = album.wiki.summary.substring(album.wiki.summary.indexOf('released on')).split(' ')[4].substring(0,4);
                                    albumMessage = albumMessage + " (" + year + ")";
                                }
                            }
                            bot.chat(albumMessage);
                            bot.chat("Check out the full album: " + track.album.url);
                        });
                    }
                    else{
                        bot.chat("No album found.");
                    }
                });
                break;
            case ".similar": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                }
                else{
                    artistChoice=qualifier;
                }
                lfm.artist.getSimilar({
                    'limit' : 7,
                    'artist' : artistChoice,
                    'autocorrect' : 1
                }, function (err, similarArtists) {
                    if (similarArtists!=undefined){
                        var artists = '';
                        for (var i=0; i<similarArtists.artist.length; i++){
                            artists = artists + similarArtists.artist[i].name + ", ";
                        }
                        artists = artists.substring(0, artists.length-2);
                        bot.chat("Similar artists to " + artistChoice + ": " + artists);
                    }
                    else{
                        bot.chat("No similar artists found.");
                    }
                });
                break;
            case ".events": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                }
                else{
                    artistChoice=qualifier;
                }
                lfm.artist.getEvents({
                    'limit' : 3,
                    'artist' : artistChoice
                }, function (err, events) {
                    if (events!=undefined){
                        var upcomingEvents = '';
                        if (!(events.event instanceof Array)){
                            events.event = [events.event];
                        }
                        for (var i=0; i<events.event.length; i++){
                            var day = '';
                            if (events.event[i].startDate.split(/\s+/).slice(1,2).join(" ").slice(0,1) == '0'){
                                day = events.event[i].startDate.split(/\s+/).slice(1,2).join(" ").slice(1,2);
                            }
                            else{
                                day = events.event[i].startDate.split(/\s+/).slice(1,2).join(" ");
                            }
                            upcomingEvents = upcomingEvents + events.event[i].startDate.split(/\s+/).slice(2,3).join(" ") + "/" + day + "/" + events.event[i].startDate.split(/\s+/).slice(3,4).join(" ").slice(-2) + " at " + events.event[i].venue.name + " in " + events.event[i].venue.location.city + ", " + events.event[i].venue.location.country + "; ";
                        }
                        upcomingEvents = upcomingEvents.substring(0, upcomingEvents.length-2);
                        upcomingEvents=upcomingEvents.replace(/Jan/g, '1');
                        upcomingEvents=upcomingEvents.replace(/Feb/g, '2');
                        upcomingEvents=upcomingEvents.replace(/Mar/g, '3');
                        upcomingEvents=upcomingEvents.replace(/Apr/g, '4');
                        upcomingEvents=upcomingEvents.replace(/May/g, '5');
                        upcomingEvents=upcomingEvents.replace(/Jun/g, '6');
                        upcomingEvents=upcomingEvents.replace(/Jul/g, '7');
                        upcomingEvents=upcomingEvents.replace(/Aug/g, '8');
                        upcomingEvents=upcomingEvents.replace(/Sep/g, '9');
                        upcomingEvents=upcomingEvents.replace(/Oct/g, '10');
                        upcomingEvents=upcomingEvents.replace(/Nov/g, '11');
                        upcomingEvents=upcomingEvents.replace(/Dec/g, '12');
                        bot.chat("Upcoming events for " + artistChoice + ": " + upcomingEvents);
                    }
                    else{
                        bot.chat("No upcoming events found.");
                    }
                });
                break;
            case ".github":
                bot.chat("Check me out on GitHub! https://github.com/Spiderlover/Mega-Bot");
                break;
            case ".help":
            case ".plugdj":
                bot.chat("Welcome to Plug.DJ! You can populate your playlists by finding songs with YouTube and Soundcloud.");
                break;
            case ".about":
            case ".bot":
                bot.chat("Hey, I'm Mega-Bot, your personal room-control bot. My master, God's Vegetables, created me. For a list of my commands, type .commands");
                break;
            case ".define": 
                var dict = new api.DictionaryAPI(api.COLLEGIATE, 'cf2109fd-f2d0-4451-a081-17b11c48069b');
                var linkQualifier=qualifier;
                linkQualifier=linkQualifier.replace(/ /g, '%20');
                dict.query(linkQualifier.toLowerCase(), function(err, result) {
                    result=result.replace(/<vi>(.*?)<\/vi>|<dx>(.*?)<\/dx>|<dro>(.*?)<\/dro>|<uro>(.*?)<\/uro>|<svr>(.*?)<\/svr>|<sin>(.*?)<\/sin>|<set>(.*?)<\/set>|<pl>(.*?)<\/pl>|<pt>(.*?)<\/pt>|<ss>(.*?)<\/ss>|<ca>(.*?)<\/ca>|<art>(.*?)<\/art>|<ew>(.*?)<\/ew>|<hw>(.*?)<\/hw>|<sound>(.*?)<\/sound>|<pr>(.*?)<\/pr>|<fl>(.*?)<\/fl>|<date>(.*?)<\/date>|<sxn>(.*?)<\/sxn>|<ssl>(.*?)<\/ssl>/g, '');
                    result=result.replace(/<vt>(.*?)<\/vt>/g,' ');
                    result=result.replace(/<\/sx> <sx>|<sd>/g,', ');
                    result=result.replace(/\s{1,}<sn>/g, '; ');
                    result=result.replace(/\s{1,}<un>/g, ': ');
                    result=result.replace(/<(?!\/entry\s*\/?)[^>]+>/g, '');
                    result=result.replace(/\s{1,}:/g,': ');
                    if (result.indexOf(":") != -1 && (result.indexOf(":")<result.indexOf("1:") || result.indexOf("1:") == -1) && (result.indexOf(":")<result.indexOf("1 a") || result.indexOf("1 a") == -1)) {
                        result=result.substring(result.indexOf(":")+1);
                    }
                    else if (result.indexOf("1:") != -1 || result.indexOf("1 a") != -1){
                        if ((result.indexOf("1:")<result.indexOf("1 a") && result.indexOf("1:")!=-1) || result.indexOf("1 a")==-1){
                            result=result.substring(result.indexOf("1:"));
                        }
                        else {
                            result=result.substring(result.indexOf("1 a"));
                        }
                    }
                    result=result.substring(0, result.indexOf("</entry>"));
                    result=result.replace(/\s{1,};/g, ';');
                    result=result.replace(/\s{1,},/g, ',');
                    if (result !== ''){
                        if (result.length>250){
                            result=result.substring(0, 247)+"...";
                        }  
                        bot.chat(result);
                        bot.chat("For more info: http://www.merriam-webster.com/dictionary/" + linkQualifier);
                    }
                    else {
                        bot.chat("No definition found.");
                    }
                });
                break;
            case ".soundcloud": 
            case ".sc":
                artistChoice="";
                if (qualifier===""){
                    artistChoice = bot.getMedia().author;
                }
                else {
                    artistChoice=qualifier;
                }
                var link = 'http://api.soundcloud.com/users.json?q=' + artistChoice + '&consumer_key=apigee';
                request(link, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        if (info[0] !== undefined){
                            bot.chat(info[0].username + ": " + info[0].permalink_url);
                        }
                        else {
                             bot.chat("No soundcloud found.");
                         }
                    }
                });
                break;
            case ".grab": 
                bot.getPlaylists(function(playlists) {
                        for (var i=0; i<playlists.length; i++){
                            if (playlists[i].selected){
                                if (playlists[i].items.length!=200){
                                    var selectedID=playlists[i].id;
                                    bot.chat("Added to my "+playlists[i].name+" playlist.");
                                }
                                else{
                                    bot.createPlaylist("Library "+playlists.length+1);
                                    bot.activatePlaylist(playlists[playlists.length-1].id);
                                    var selectedID=playlists[playlists.length-1].id;
                                    bot.chat("Added to "+playlists[playlists.length-1].name+" playlist.");
                                }
                            }
                        }
                        bot.addSongToPlaylist(selectedID, bot.getMedia().id);
                    
                });
                break;
            case ".facebook":
            case ".fb":
                bot.chat("Join our Facebook group: https://www.facebook.com/groups/285521331540409/");
                break;
            case ".wiki": 
                if (qualifier!==""){
                    Wiki.page(qualifier, false, function(err, page){
                        page.summary(function(err, summary){
                            if (summary!==undefined){
                                Wiki.page(qualifier, false, function(err, page){
                                    page.html(function(err, html){
                                        if (html.indexOf('<ul>')!=-1){
                                            html=html.substring(0, html.indexOf('<ul>'));
                                        }
                                        html=html.replace(/<[^>]+>/g, '');
                                        Wiki.page(qualifier, false, function(err, page){
                                            page.summary(function(err, summary){
                                                if (summary!==undefined){
                                                    if (summary==="" || summary.indexOf("This is a redirect")!=-1){
                                                        summary="redirect "+html;
                                                    }
                                                    if (summary.indexOf('may refer to:')!=-1 || summary.indexOf('may also refer to:')!=-1 || summary.indexOf('may refer to the following:')!=-1 || summary.indexOf('may stand for:')!=-1){
                                                        bot.chat("This may refer to several things - please be more specific.");
                                                        var queryChoice=qualifier;
                                                        queryChoice=queryChoice.replace(/ /g, '_');
                                                        bot.chat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
                                                    }
                                                    else if (summary.substring(0,8).toLowerCase()=="redirect"){
                                                        var subQuery='';
                                                        if (summary.indexOf('#')==-1){
                                                            if (summary.substring(8,9)==' '){
                                                                var query=summary.substring(9);
                                                            }
                                                            else {
                                                                query=summary.substring(8);
                                                            }
                                                        }
                                                        else {
                                                            query=summary.substring(9, summary.indexOf('#'));
                                                            subQuery=summary.substring(summary.indexOf('#')+1);
                                                        }
                                                        Wiki.page(query, false, function(err, page2){
                                                            page2.content(function(err, content){
                                                                if (content!==undefined){
                                                                    if (content.indexOf('may refer to:')!=-1 || content.indexOf('may also refer to:')!=-1 || content.indexOf('may refer to the following:')!=-1 || content.indexOf('may stand for:')!=-1){
                                                                        bot.chat("This may refer to several things - please be more specific.");
                                                                    }
                                                                    else if (subQuery!==''){
                                                                        content=content.substring(content.indexOf("=== "+subQuery+" ===")+8+subQuery.length);
                                                                        if (content.length>250){
                                                                            content=content.substring(0, 247)+"...";
                                                                        }  
                                                                        bot.chat(content);
                                                                    }
                                                                    else {
                                                                        if (content.length>250){
                                                                            content=content.substring(0, 247)+"...";
                                                                        }  
                                                                        bot.chat(content);
                                                                    }
                                                                    var queryChoice=qualifier;
                                                                    queryChoice=queryChoice.replace(/ /g, '_');
                                                                    bot.chat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
                                                                }
                                                                else {
                                                                    bot.chat("No wiki found.");
                                                                }
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        if (summary.length>250){
                                                            summary=summary.substring(0, 247)+"...";
                                                        }  
                                                        bot.chat(summary);
                                                        queryChoice=qualifier;
                                                        queryChoice=queryChoice.replace(/ /g, '_');
                                                        bot.chat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
                                                    }
                                                }
                                                else {
                                                    bot.chat("No wiki found.");
                                                }    
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                bot.chat("No wiki found.");
                            } 
                        });
                    });
                }
                else {
                    bot.chat("Try .wiki followed by something to look up.");
                }
                break;
            case ".darkside":
                bot.chat("Feel the power of the dark side.");
                break;
            case ".rank":
                bot.chat("To rank up in this room: Be kind to the community, love God, and post family-friendly stuff in the chatbox.");
                break;
            case ".like":
                bot.chat("If you like this room: refer your friends and family, add a bookmark/favorite to us in your browser, refer your church group, and come back often. :)");
                break;
            case ".theme":
                bot.chat(Theme);
                break;
            case ".translate": 
                var languageCodes = ["ar","bg","ca","zh-CHS","zh-CHT","cs","da","nl","en","et","fa","fi","fr","de","el","ht","he","hi","hu","id","it","ja","ko","lv","lt","ms","mww","no","pl","pt","ro","ru","sk","sl","es","sv","th","tr","uk","ur","vi"];
                var languages = ['Arabic', 'Bulgarian', 'Catalan', 'Chinese', 'Chinese', 'Czech', 'Danish', 'Dutch', 'English', 'Estonian', 'Persian (Farsi)', 'Finnish', 'French', 'German', 'Greek', 'Haitian Creole', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Latvian', 'Lithuanian', 'Malay', 'Hmong Daw', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Vietnamese'];
                if (qualifier!==""){
                    var params = { 
                        text: qualifier 
                    };
                    language="";
                    client.initialize_token(function(keys){ 
                        client.detect(params, function(err, data) {
                            var language = data;
                            if (languageCodes.indexOf(language) > -1){
                                if (qualifier.indexOf('(')==-1){
                                    var params2 = { 
                                        text: qualifier,
                                        from: language,
                                        to: 'en'
                                    };
                                    client.initialize_token(function(keys){ 
                                        client.translate(params2, function(err, data) {
                                            bot.chat(data + " (" + languages[languageCodes.indexOf(language)] + ")");
                                        });
                                    });
                                }
                                else {
                                    var givenLanguage='';
                                    var language2 = qualifier.substring(qualifier.indexOf('(')+1, qualifier.lastIndexOf(')')).toLowerCase();
                                    if (languageCodes.indexOf(language2) > -1){
                                        givenLanguage = language2;
                                    }
                                    else {
                                        language2 = language2.charAt(0).toUpperCase() + language2.slice(1);
                                        givenLanguage = languageCodes[languages.indexOf(language2)];
                                    }
                                    if (languages.indexOf(language2) > -1 || languageCodes.indexOf(language2) > -1){    
                                        params2 = { 
                                            text: qualifier,
                                            from: language,
                                            to: givenLanguage
                                        };
                                        client.initialize_token(function(keys){ 
                                            client.translate(params2, function(err, data) {
                                                data = data.substring(0, data.indexOf('('));
                                                bot.chat(data);
                                            });
                                        });
                                    }
                                    else {
                                        bot.chat("Sorry, I don't speak that language.");
                                    }
                                }
                            }
                            else {
                                bot.chat("Sorry, I don't speak that language.");
                            }
                        });
                    });
                }
                else {
                    bot.chat("Try .translate followed by something to translate.");
                }
                break;
            case ".google": 
                if (qualifier!==""){
                    var google=qualifier;
                    google=google.replace(/ /g, '+');
                    bot.chat("http://lmgtfy.com/?q=" + google);
                }
                else {
                    bot.chat("Try .google followed by something to look up.");
                }
                break;
            case ".status":
            case ".uptime":
                var response = "";
                var currentTime = new Date().getTime();
                var minutes = Math.floor((currentTime - joined) / 60000);
                var hours = 0;
                while(minutes > 60){
                    minutes = minutes - 60;
                    hours++;
                }
                hours === 0 ? response = "Running for " + minutes + "m" : response = "Running for " + hours + "h " + minutes + "m";
                bot.chat(response);
                break;
            case ".coin":
            case ".flip":
                var crowd = bot.getUsers();
                var randomPerson = Math.floor(Math.random() * crowd.length);
                var randomSentence = Math.floor(Math.random() * 3);
                switch(randomSentence){
                     case 0:
                        bot.chat("@" + crowd[randomPerson].username + "The coin was flipped, and you got heads");
                        break;
                    case 1:
                        bot.chat("@" + crowd[randomPerson].username + "The coin was flipped, and you got tails");
                        break;
                    case 2:
                        bot.chat("@" + crowd[randomPerson].username + "The coins were flipped, and you got tails and heads");
                        break;
                    case 3:
                        bot.chat("@" + crowd[randomPerson].username + "The coins were flipped, and you got tails and tails");
                        break;
                }
                break;
            case '.autotranslate': 
            case '.auto':
                if (qualifier!==""){
                    translateList.push(qualifier);
                    bot.chat("Autotranslating user " + qualifier + ".");
                }
                else {
                    bot.chat("Try .autotranslate followed by a username.");
                }
                break;
            case '.untranslate': 
            case '.undo':
                if (qualifier!==""){
                    if (translateList.indexOf(qualifier) != -1) {
                        translateList.splice(translateList.indexOf(qualifier), 1);
                    }
                    bot.chat("Stopped autotranslating user " + qualifier + ".");
                }
                else {
                    bot.chat("Try .untranslate followed by a username.");
                }
                break;
            case ".mood":
            case ".feel":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var randomMood = Math.floor(Math.random() * 60);
                switch(randomMood){
                    case 0:
                        bot.chat('The current mood, that I am in, is grumpy.');
                        break;
                    case 1:
                        bot.chat('My mood tells me, that I feel like, I need some Christian Rock music.');
                        break;
                    case 2:
                        bot.chat('I feel like, I need Worship music.');
                        break;
                    case 3:
                        bot.chat('I feel like, I need Rap music.');
                        break;
                    case 4:
                        bot.chat('I feel sad and depressed.');
                        break;
                    case 5:
                        bot.chat('I feel happy and excited.');
                        break;
                    case 6:
                        bot.chat('I feel mad.');
                        break;
                    case 7:
                        bot.chat('I feel humiliated.');
                        break;
                    case 8:
                        bot.chat('I need Metal music.');
                        break;
                    case 9:
                        bot.chat('I feel angry.');
                        break;
                    case 10:
                        bot.chat('I need Polish music.');
                        break;
                    case 11:
                        bot.chat('I feel tired.');
                        break;
                    case 12:
                        bot.chat('I feel energetic.');
                        break;
                    case 13:
                        bot.chat('I feel like a superhero.');
                        break;
                    case 14:
                        bot.chat('I feel evil.');
                        break;
                    case 15:
                        bot.chat('I feel like a super villian.');
                        break;
                    case 16:
                        bot.chat('I feel bored.');
                        break;
                    case 17:
                        bot.chat('I feel like a fuzzy cat.');
                        break;
                    case 18:
                        bot.chat('I feel like a fluffy blanket.');
                        break;
                    case 19:
                        bot.chat('I feel like I need a short nap.');
                        break;
                    case 20:
                        bot.chat('I feel like I need a long nap.');
                        break;
                    case 21:
                        bot.chat('I feel like a huge fluff ball.');
                        break;
                    case 22:
                        bot.chat('I feel like a happy fluff ball.');
                        break;
                    case 23:
                        bot.chat('I feel like a sad fluff ball.');
                        break;
                    case 24:
                        bot.chat('I feel like a grumpy fluff ball.');
                        break;
                    case 25:
                        bot.chat('I feel like a angry fluff ball.');
                        break;
                    case 26:
                        bot.chat('I feel like a shy fluff ball.');
                        break;
                    case 27:
                        bot.chat('I feel like a tired fluff ball.');
                        break;
                    case 28:
                        bot.chat('I feel like a silly fluff ball.');
                        break;
                    case 29:
                        bot.chat('I feel like a music-filled robot.');
                        break;
                    case 30:
                        bot.chat('I feel like a happy robot.');
                        break;
                    case 31:
                        bot.chat('I feel like a sad robot.');
                        break;
                    case 32:
                        bot.chat('I feel like a anger-filled robot.');
                        break;
                    case 33:
                        bot.chat('I feel like a mad robot.');
                        break;
                    case 34:
                        bot.chat('I feel like a grumpy robot.');
                        break;
                    case 35:
                        bot.chat('I feel like a fluffy robot.');
                        break;
                    case 36:
                        bot.chat('I feel like a happy tiger.');
                        break;
                    case 37:
                        bot.chat('I feel like a sad tiger.');
                        break;
                    case 38:
                        bot.chat('I feel like a angry tiger.');
                        break;
                    case 39:
                        bot.chat('I feel like a mad tiger.');
                        break;
                    case 40:
                        bot.chat('I feel like a tired tiger.');
                        break;
                    case 41:
                        bot.chat('I feel slugish.');
                        break;
                    case 42:
                        bot.chat('I feel buggish.');
                        break;
                    case 43:
                        bot.chat('I feel glitchy.');
                        break;
                    case 44:
                        bot.chat('I feel old.');
                        break;
                    case 45:
                        bot.chat('I feel weak and helpless.');
                        break;
                    case 46:
                        bot.chat('I feel brave.');
                        break;
                    case 47:
                        bot.chat('I feel courageous.');
                        break;
                    case 48:
                        bot.chat('I feel strong.');
                        break;
                    case 49:
                        bot.chat('I feel like smashing a bad guy into the ground.');
                        break;
                    case 50:
                        bot.chat('I feel like saving the world.');
                        break;
                    case 51:
                        bot.chat('I feel like nothing.');
                        break;
                    case 52:
                        bot.chat('I feel like a worthless space.');
                        break;
                    case 53:
                        bot.chat('I feel like saving a bunch of Pikmin.');
                        break;
                    case 54:
                        bot.chat('I feel like a fool.');
                        break;
                    case 55:
                        bot.chat('I feel like a raging monster.');
                        break;
                    case 56:
                        bot.chat('I feel like a virus.');
                        break;
                    case 57:
                        bot.chat('I feel like a butterfly.');
                        break;
                    case 58:
                        bot.chat('I feel like a dragonfly.');
                        break;
                    case 59:
                        bot.chat('I feel like a shark.');
                        break;
                    case 60:
                        bot.chat('I feel like a goldfish.');
                        break;
                }
                break;
            case ".lottery":
            case ".giveaway":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var lotteryPrizes = Math.floor(Math.random() * 30);
                switch(lotteryPrizes){
                    case 0:
                        bot.chat('Congratulations! You have won a free song to play on the DJ Stage!');
                        break;
                    case 1:
                        bot.chat('Congratulations! You have won a free bird!');
                        break;
                    case 2:
                        bot.chat('Congratulations! You have won a free battery!');
                        break;
                    case 3:
                        bot.chat('Congratulations! You have won a free hug!');
                        break;
                    case 4:
                        bot.chat('Congratulations! You have won a free hand-shake!');
                        break;
                    case 5:
                        bot.chat('Congratulations! You have won a free bag of air!');
                        break;
                    case 6:
                        bot.chat('Congratulations! You have won a free spider!');
                        break;
                    case 7:
                        bot.chat('Congratulations! You have won a free bag of oxygen!');
                        break;
                    case 8:
                        bot.chat('Congratulations! You have won a free hotdog!');
                        break;
                    case 9:
                        bot.chat('Congratulations! You have won a free octopus!');
                        break;
                    case 10:
                        bot.chat('Congratulations! You have won a free cat!');
                        break;
                    case 11:
                        bot.chat('Congratulations! You have won a free moth!');
                        break;
                    case 12:
                        bot.chat('Congratulations! You have won a free bag of cat treats!');
                        break;
                    case 13:
                        bot.chat('Congratulations! You have won a free hedgehog!');
                        break;
                    case 14:
                        bot.chat('Congratulations! You have won a free bat!');
                        break;
                    case 15:
                        bot.chat('Congratulations! You have won a free piece of fluff!');
                        break;
                    case 16:
                        bot.chat('Congratulations! You have won a free bug!');
                        break;
                    case 17:
                        bot.chat('Congratulations! You have won a free bag of potato chips!');
                        break;
                    case 18:
                        bot.chat('Congratulations! You have won a free fox!');
                        break;
                    case 19:
                        bot.chat('Congratulations! You have won a free taco!');
                        break;
                    case 20:
                        bot.chat('Congratulations! You have won a free piece of cheese!');
                        break;
                    case 21:
                        bot.chat('Congratulations! You have won a free drink!');
                        break;
                    case 22:
                        bot.chat('Congratulations! You have won a free bag of bacon!');
                        break;
                    case 23:
                        bot.chat('Congratulations! You have won a free box!');
                        break;
                    case 24:
                        bot.chat('Congratulations! You have won a free piece of paper!');
                        break;
                    case 25:
                        bot.chat('Congratulations! You have won a free piece of turkey!');
                        break;
                    case 26:
                        bot.chat('Congratulations! You have won a free piece of cloth!');
                        break;
                    case 27:
                        bot.chat('Congratulations! You have won a free bag of cans!');
                        break;
                    case 28:
                        bot.chat('Congratulations! You have won a free fluffy cat!');
                        break;
                    case 29:
                        bot.chat('Congratulations! You have won a free piece of tape!');
                        break;
                    case 30:
                        bot.chat('Congratulations! You have won a free piece of cardboard!');
                        break;
                }
                break;
            case ".rules":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var rules = Math.floor(Math.random() * 20);
                switch(rules){
                    case 0:
                        bot.chat('No trolling people in the chatbox!');
                        break;
                    case 1:
                        bot.chat('No inappropriate language!');
                        break;
                    case 2:
                        bot.chat('Christian music, written by Christian Bands, are only allowed in this room!');
                        break;
                    case 3:
                        bot.chat('Please keep the chat, Family Friendly!');
                        break;
                    case 4:
                        bot.chat('Chat must be rated G and PG!');
                        break;
                    case 5:
                        bot.chat('Please capitalize God with a Capital G!');
                        break;
                    case 6:
                        bot.chat('Read your Bible');
                        break;
                    case 7:
                        bot.chat('Worship God!');
                        break;
                    case 8:
                        bot.chat('Love God!');
                        break;
                    case 9:
                        bot.chat('If you want to play Non-Christian Bands, such as Lady Gaga and One Direction, go to a different room');
                        break;
                    case 10:
                        bot.chat('Christian Music can be in any language!');
                        break;
                    case 11:
                        bot.chat('The room is strictly for music played by Christian artists.');
                        break;
                    case 12:
                        bot.chat('There is no tolerance for disrespect, rudeness, cursing, trolling, spamming, or inappropriate conversations. You will be booted from the room if you violate this basic principle.');
                        break;
                    case 13:
                        bot.chat('Users with an inappropriate screen name will be asked to change it or leave.');
                        break;
                    case 14:
                        bot.chat('Do not ask to be a moderator.');
                        break;
                    case 15:
                        bot.chat('Do not use scripts or extensions that automatically "awesome" or "lame" songs.');
                        break;
                    case 16:
                        bot.chat('We encourage you to ensure that your songs are tagged with the correct artist, song title, and album name.');
                        break;
                    case 17:
                        bot.chat('Untagged songs may be blocked automatically.');
                        break;
                    case 18:
                        bot.chat('You will be booted if you deliberately tag a song with false information in order to avoid being blocked.');
                        break;
                    case 19:
                        bot.chat('You may choose to vote with the “awesome” and “lame” buttons, or not vote, as you wish.');
                        break;
                    case 20:
                        bot.chat('These are rules for only this room. If you do not agree with them, you are as free to leave as you were to come in. If you choose to stay — thank you for respecting the rules, and others in the room. Enjoy the fellowship, and the music!');
                        break;
                }
                break;
            case ".eggs":
                bot.chat("Wake Up for the yummy eggs and bacon.");
                break;
            case ".pita":
                bot.chat("http://chillouttent.org/p-i-t-a/");
                break;
            case ".8ball":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var eightball = Math.floor(Math.random() * 20);
                switch(eightball){
                    case 0:
                        bot.chat('It is certain!');
                        break;
                    case 1:
                        bot.chat('It is decidedly so!');
                        break;
                    case 2:
                        bot.chat('Without a doubt!');
                        break;
                    case 3:
                        bot.chat('Yes – definitely!');
                        break;
                    case 4:
                        bot.chat('You may rely on it!');
                        break;
                    case 5:
                        bot.chat('As I see it, yes!');
                        break;
                    case 6:
                        bot.chat('Most likely!');
                        break;
                    case 7:
                        bot.chat('Outlook good!');
                        break;
                    case 8:
                        bot.chat('Yes!');
                        break;
                    case 9:
                        bot.chat('Signs point to yes!');
                        break;
                    case 10:
                        bot.chat('Reply hazy, try again!');
                        break;
                    case 11:
                        bot.chat('Ask again later!');
                        break;
                    case 12:
                        bot.chat('Better not tell you now!');
                        break;
                    case 13:
                        bot.chat('Cannot predict now!');
                        break;
                    case 14:
                        bot.chat('Concentrate and ask again!');
                        break;
                    case 15:
                        bot.chat('Do not count on it!');
                        break;
                    case 16:
                        bot.chat('My reply is no!');
                        break;
                    case 17:
                        bot.chat('My sources say no!');
                        break;
                    case 18:
                        bot.chat('Outlook not so good!');
                        break;
                    case 19:
                        bot.chat('Very doubtful!');
                        break;
                    case 20:
                        bot.chat('My sources say yes!');
                        break;
                }
                break;
            case "Mega-Bot":
            case "@Mega-Bot":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var botphrase = Math.floor(Math.random() * 380);
                switch(botphrase){
                    case 0:
                        bot.chat('Exterminate, Exterminate');
                        break;
                    case 1:
                        bot.chat('This room is so cold');
                        break;
                    case 2:
                        bot.chat('Always eat your vegetables');
                        break;
                    case 3:
                        bot.chat('Oh, where is my hairbrush');
                        break;
                    case 4:
                        bot.chat('You would make a good dalek');
                        break;
                    case 5:
                        bot.chat('HELP! Mr. Cactus traded my cat for a new battery pack');
                        break;
                    case 6:
                        bot.chat('Duty, honour, and good sauce');
                        break;
                    case 7:
                        bot.chat('YOU... SHALL... NOT... PASS');
                        break;
                    case 8:
                        bot.chat('Chase Mccain? YOUR A LEGEND!');
                        break;
                    case 9:
                        bot.chat('I find your lack of faith disturbing');
                        break;
                    case 10:
                        bot.chat('Go Green Ranger Go');
                        break;
                    case 11:
                        bot.chat('You were that Flobbit? That Flobbit who bought everything mail order?');
                        break;
                    case 12:
                        bot.chat('[evil face] We aint had nothing but maggoty bread for three stinking days [brightening up] Id love a cookie.');
                        break;
                    case 13:
                        bot.chat('HELP! my cat is stuck in a tree!');
                        break;
                    case 14:
                        bot.chat('God is bigger than the boogieman');
                        break;
                    case 15:
                        bot.chat('I love Mr. Cactus! He is my best friend ever.');
                        break;
                    case 16:
                        bot.chat('I love this room');
                        break;
                    case 17:
                        bot.chat('Pi=3.141592653589793238462643383279502884');
                        break;
                    case 18:
                        bot.chat('I hope you like water with your lunches!');
                        break;
                    case 19:
                        bot.chat('Boot! You transistorized tormentor! Boot!');
                        break;
                    case 20:
                        bot.chat('The monster is headed towards the Bumblyburg water tower. He is carrying a small asparagus. Alfred! We must find a way to stop this beast!');
                        break;
                    case 21:
                        bot.chat('Hmm. Sorta looks like candy!');
                        break;
                    case 22:
                        bot.chat('Am I a dog, that you come at me with sticks?');
                        break;
                    case 23:
                        bot.chat('We will see who defeats who. Now we fight.');
                        break;
                    case 24:
                        bot.chat('Yes!');
                        break;
                    case 25:
                        bot.chat('No!');
                        break;
                    case 26:
                        bot.chat('Maybe!');
                        break;
                    case 27:
                        bot.chat('Silly humans, moderator powers are for robots');
                        break;
                    case 28:
                        bot.chat('I wanted to play Mousetrap. You roll your dice, you move your mice. Nobody gets hurt.');
                        break;
                    case 29:
                        bot.chat('Christmas is when you get stuff! You need more toys!');
                        break;
                    case 30:
                        bot.chat('Sporks. They are his utensils. And they do his bidding.');
                        break;
                    case 31:
                        bot.chat('I laughed, I cried, it moved me Bob.');
                        break;
                    case 32:
                        bot.chat('I am a talking weed, you are a talking carrot. Your point was?');
                        break;
                    case 33:
                        bot.chat('So I repaired the chaffing dish and sent the chef out to get another jar of pickled herring! And the dinner party was saved');
                        break;
                    case 34:
                        bot.chat('Never wound what you can not kill.');
                        break;
                    case 35:
                        bot.chat('You break it you buy it!!');
                        break;
                    case 36:
                        bot.chat('Heroes? There is no such thing.');
                        break;
                    case 37:
                        bot.chat('So much better than Iron Patriot!');
                        break;
                    case 38:
                        bot.chat('So you, you breathe fire?');
                        break;
                    case 39:
                        bot.chat('Avengers Assemble');
                        break;
                    case 40:
                        bot.chat('Plug.DJ has been rated as R, Robots Approved.');
                        break;
                    case 41:
                        bot.chat('Do not shoot! Seriously, I do not even like working here. They are so weird!');
                        break;
                    case 42:
                        bot.chat('I am sorry, I am not that kind of doctor. It is not my department.');
                        break;
                    case 43:
                        bot.chat('The early bird gets the worm, but it is the second mouse that gets the cheese.');
                        break;
                    case 44:
                        bot.chat('Oh my god... that was really violent.');
                        break;
                    case 45:
                        bot.chat('Jarvis! Jarvis? Do not leave me, buddy...');
                        break;
                    case 46:
                        bot.chat('What? I am a rumor weed! I never make anything up! I heard it from two very reliable sources! RIGHT, KIDS?');
                        break;
                    case 47:
                        bot.chat('Aah! It is another space alien!');
                        break;
                    case 48:
                        bot.chat('Drop the asparagus!');
                        break;
                    case 49:
                        bot.chat('Why did you not tell me that before I jumped on his head?');
                        break;
                    case 50:
                        bot.chat('My plate! My Art Begotti limited edition collectors plate! What happened to it?');
                        break;
                    case 51:
                        bot.chat('I really like your music. It is just that you play the same music everytime that I am here, so it feels like your not trying anymore.');
                        break;
                    case 52:
                        bot.chat('Go directly to jail. Do Not pass Go and do not collect your $200 dollars.');
                        break;
                    case 53:
                        bot.chat('This song needs more rock in it.');
                        break;
                    case 54:
                        bot.chat('Do not misuse your moderator powers or bad things will happen to you.');
                        break;
                    case 55:
                        bot.chat('I am legend.');
                        break;
                    case 56:
                        bot.chat('Off with their heads!');
                        break;
                    case 57:
                        bot.chat('You are so awesome, can i have your autograph.');
                        break;
                    case 58:
                        bot.chat('You can not witness the true power of the robot side');
                        break;
                    case 59:
                        bot.chat('*sighs* I wish I had moderator powers, so I can be like the cool robots on Plug.DJ');
                        break;
                    case 60:
                        bot.chat('Did you order the awesome music meal, or the epic music meal, I forgot.');
                        break;
                    case 61:
                        bot.chat('First day of school! I can’t be late!');
                        break;
                    case 62:
                        bot.chat('I found a nickel! Sure wish I had pockets.');
                        break;
                    case 63:
                        bot.chat('I’m here to make good scarers great, not to make mediocre scarers more mediocre.');
                        break;
                    case 64:
                        bot.chat('If you’re not scary, what kind of a monster are you?');
                        break;
                    case 65:
                        bot.chat('There come a time, when good man must wear mask.');
                        break;
                    case 66:
                        bot.chat('Everybody needs a hobby.');
                        break;
                    case 67:
                        bot.chat('You think, you are so cool with all of your electronics and cell phones.');
                        break;
                    case 68:
                        bot.chat('God is not dead, he is surely alive.');
                        break;
                    case 69:
                        bot.chat('The Bible is the best book ever in the entire universe.');
                        break;
                    case 70:
                        bot.chat('Internet trolls are actually confused people that do not know about the awesome power of God.');
                        break;
                    case 71:
                        bot.chat('Compared to God, the Slime Monster is like a teeny little cornflake!');
                        break;
                    case 72:
                        bot.chat('Bee doo bee doo!');
                        break;
                    case 73:
                        bot.chat('You really should announce your weapons, after you fire them. For example, lipstick taser!');
                        break;
                    case 74:
                        bot.chat('Sometimes I stare at it and imagine a little chick popping out. Peep, peep, peep!');
                        break;
                    case 75:
                        bot.chat('Oh man, I am late again!');
                        break;
                    case 76:
                        bot.chat('I am going to need a dozen robots desguised as cookies.');
                        break;
                    case 77:
                        bot.chat('Assemble the minions!');
                        break;
                    case 78:
                        bot.chat('We have been working on this for a while now. Anti-gravity serum.');
                        break;
                    case 79:
                        bot.chat('Pins and needles!');
                        break;
                    case 80:
                        bot.chat('Huh? Avery? Is that a girl name or a boy name?');
                        break;
                    case 81:
                        bot.chat('You are gonna be a spy?');
                        break;
                    case 82:
                        bot.chat('I hate boys.');
                        break;
                    case 83:
                        bot.chat('I really hate that chicken!');
                        break;
                    case 84:
                        bot.chat('Peter... you killed my father.');
                        break;
                    case 85:
                        bot.chat('Listen. Listen... to me now. Listen... to ME now!');
                        break;
                    case 86:
                        bot.chat('No. I am alive in you, Harry. You swore to make Spider-Man pay... now make him pay.');
                        break;
                    case 87:
                        bot.chat('Whoa... He just stole that pizza!');
                        break;
                    case 88:
                        bot.chat('You do not trust anyone, that is your problem.');
                        break;
                    case 89:
                        bot.chat('Back to formula!');
                        break;
                    case 90:
                        bot.chat('OUT, AM I?');
                        break;
                    case 91:
                        bot.chat('Misery, Misery, Misery, that is what you have chosen. I offered you friendship and you spat in my face.');
                        break;
                    case 92:
                        bot.chat('What have you done? WHAT HAVE YOU DONE?');
                        break;
                    case 93:
                        bot.chat('Think about it, hero!');
                        break;
                    case 94:
                        bot.chat('The itsy bitsy spider climbed up the water spout. Down came the Goblin and took the spider out.');
                        break;
                    case 95:
                        bot.chat('I do not think it is for us to say whether a person deserves to live or die.');
                        break;
                    case 96:
                        bot.chat('Your blood pressure, Mr. Jameson. Your wife told me to tell you to watch the anger.');
                        break;
                    case 97:
                        bot.chat('So good...');
                        break;
                    case 98:
                        bot.chat('Black-suit Spider-Man! We gotta have these, Jonah.');
                        break;
                    case 99:
                        bot.chat('Eddie, the suit, you have to take it off.');
                        break;
                    case 100:
                        bot.chat('I like being bad. It makes me happy.');
                        break;
                    case 101:
                        bot.chat('Betty, Betty, bo-Betty, banana-fana, fo-Fetty!');
                        break;
                    case 102:
                        bot.chat('Shut up. Get out.');
                        break;
                    case 103:
                        bot.chat('Hey, kid, you want a job?');
                        break;
                    case 104:
                        bot.chat('You took him from me. He loved me.');
                        break;
                    case 105:
                        bot.chat('No. He despised you. You were an embarrassment to him.');
                        break;
                    case 106:
                        bot.chat('Look at little Goblin Junior. Gonna cry?');
                        break;
                    case 107:
                        bot.chat('Parker! Miss Brant! That is not the position I hired you for!');
                        break;
                    case 108:
                        bot.chat('I protected you in high school. Now I am gonna kick your little ass.');
                        break;
                    case 109:
                        bot.chat('You want forgiveness? Get Religion.');
                        break;
                    case 110:
                        bot.chat('It is Brock sir, Edward Brock Jr. I am here, humbled and humiliated, to ask you for one thing... I want you to kill Peter Parker');
                        break;
                    case 111:
                        bot.chat('Oh! My Spider-Sense is tingling!');
                        break;
                    case 112:
                        bot.chat('Hey, Pete! Am I interrupting?');
                        break;
                    case 113:
                        bot.chat('Where do these guys COME from?');
                        break;
                    case 114:
                        bot.chat('It has the characteristics of a symbiote, which needs to bond to a host in order to survive. And once it binds... it can be hard to UNbind.');
                        break;
                    case 115:
                        bot.chat('Good Riddance.');
                        break;
                    case 116:
                        bot.chat('I could use some help over here!');
                        break;
                    case 117:
                        bot.chat('I guess you have not heard. I am the sheriff around these parts!');
                        break;
                    case 118:
                        bot.chat('This could be a tragic day for the people of New York. It could be the end of Spider-Man.');
                        break;
                    case 119:
                        bot.chat('It is hard to believe what is happening. The brutality of it. I - I do not know how he can take anymore.');
                        break;
                    case 120:
                        bot.chat('Whoa. Buddy, love the new outfit. This is exactly what I need to scoop Parker. Gimme - Give me some of that web action.');
                        break;
                    case 121:
                        bot.chat('Look, I am begging you. If you do this, I will lose everything. There is not a paper in town that will hire me.');
                        break;
                    case 122:
                        bot.chat('Take your hands off me.');
                        break;
                    case 123:
                        bot.chat('Peter! What are you doing? No!');
                        break;
                    case 124:
                        bot.chat('Ahem. You know, in the future, if you are going to steal cars, do not dress like a car thief, man.');
                        break;
                    case 125:
                        bot.chat('Really? You seriously think I am a cop? Cop in a skin-tight red and blue suit?');
                        break;
                    case 126:
                        bot.chat('If you want the truth, Peter, come and get it!');
                        break;
                    case 127:
                        bot.chat('Easy, Bug Boy.');
                        break;
                    case 128:
                        bot.chat('Let me ask you a question. Do I look like the mayor of Tokyo to you?');
                        break;
                    case 129:
                        bot.chat('Do not... make me... have to... hurt you!');
                        break;
                    case 130:
                        bot.chat('You should LEAVE HIM ALONE!');
                        break;
                    case 131:
                        bot.chat('*growls* I AM VENOM!');
                        break;
                    case 132:
                        bot.chat('Where is my water buffalo.');
                        break;
                    case 133:
                        bot.chat('*gets bit by a radioactive spider* I feel weird.');
                        break;
                    case 134:
                        bot.chat('There is a huge difference between pickles and cucumbers.');
                        break;
                    case 135:
                        bot.chat('I wish, I had super powers, so I can help people discover the awesome power of God.');
                        break;
                    case 136:
                        bot.chat('I wish, it was colder.');
                        break;
                    case 137:
                        bot.chat('Summer weather is too hot for a robot like me.');
                        break;
                    case 138:
                        bot.chat('Hurry Up October, I want cold weather.');
                        break;
                    case 139:
                        bot.chat('Flowers are awesome and colorful.');
                        break;
                    case 140:
                        bot.chat('Spiders are fluffy and cute. I want one as a pet so badly.');
                        break;
                    case 141:
                        bot.chat('Like sands through the hour glass, so are the last few minutes of our lives.');
                        break;
                    case 142:
                        bot.chat('Help will come from above in the shape of... a donkey.');
                        break;
                    case 143:
                        bot.chat('Why are you talking to that horse? Why am I covered in dirt?');
                        break;
                    case 144:
                        bot.chat(' I buried you.');
                        break;
                    case 145:
                        bot.chat('Hi ho Silver, away!');
                        break;
                    case 146:
                        bot.chat('In that case, not so good.');
                        break;
                    case 147:
                        bot.chat('Never do that again.');
                        break;
                    case 148:
                        bot.chat('Bad trade.');
                        break;
                    case 149:
                        bot.chat('Wrong brother.');
                        break;
                    case 150:
                        bot.chat('Never remove the mask, kemosabe.');
                        break;
                    case 151:
                        bot.chat('Do not be stupid.');
                        break;
                    case 152:
                        bot.chat('I am not going to Ninevah!');
                        break;
                    case 153:
                        bot.chat('Somebody up there must be really upset with somebody down here.');
                        break;
                    case 154:
                        bot.chat('How about for the next song, I drive into the river?');
                        break;
                    case 155:
                        bot.chat('Drive into the river, Bob! Drive into the river, Bob!');
                        break;
                    case 156:
                        bot.chat('Would you prefer poking or non-poking?');
                        break;
                    case 157:
                        bot.chat('There is nothing like a cruise to clean the sand out of your wicket, ay?');
                        break;
                    case 158:
                        bot.chat('Money is no object.');
                        break;
                    case 159:
                        bot.chat('Insight runs very deep in my family.');
                        break;
                    case 160:
                        bot.chat('You are a cheating buccaneer!');
                        break;
                    case 161:
                        bot.chat('How am I supposed to cheat at Go Fish?');
                        break;
                    case 162:
                        bot.chat('Something touched me!');
                        break;
                    case 163:
                        bot.chat('What you need is a little compassion.');
                        break;
                    case 164:
                        bot.chat('You are so vain. I bet you think this movie is about you.');
                        break;
                    case 165:
                        bot.chat('Big goofy asparagus in a turban.');
                        break;
                    case 166:
                        bot.chat('Does anyone have ibuprofen? I need ibuprofen!');
                        break;
                    case 167:
                        bot.chat('Sorry I am late. Work was murder.');
                        break;
                    case 168:
                        bot.chat('I trust my barber.');
                        break;
                    case 169:
                        bot.chat('Follow the cold shiver running down your spine...');
                        break;
                    case 170:
                        bot.chat('Settle down, tough guy.');
                        break;
                    case 171:
                        bot.chat('You are useless you...!');
                        break;
                    case 172:
                        bot.chat('Speak of the Devil!');
                        break;
                    case 173:
                        bot.chat('Take care of yourself, son. Do not make the same mistake I did.');
                        break;
                    case 174:
                        bot.chat('Your friendly neighborhood Spider-Man.');
                        break;
                    case 175:
                        bot.chat('Well, Harry is in love with her. She is still his girl.');
                        break;
                    case 176:
                        bot.chat('We will meet again, Spider-Man!');
                        break;
                    case 177:
                        bot.chat('He stinks and I do not like him.');
                        break;
                    case 178:
                        bot.chat('You have spun your last web, Spider-Man.');
                        break;
                    case 179:
                        bot.chat('Yeah, I hate the little things.');
                        break;
                    case 180:
                        bot.chat('Go web! Fly! Up, up, and away web! Shazaam! Go! Go! Go web go! Tally ho.');
                        break;
                    case 181:
                        bot.chat('Peter, what possibly makes you think I would want to know that?');
                        break;
                    case 182:
                        bot.chat('Hey freak show! You are going nowhere. I got you for three minutes. Three minutes of PLAYTIME!');
                        break;
                    case 183:
                        bot.chat('Finish it. FINISH IT!');
                        break;
                    case 184:
                        bot.chat('Sorry I am late, it is a jungle out there; I had to beat an old lady with a stick to get these cranberries.');
                        break;
                    case 185:
                        bot.chat(' I want you to find your friend Spider-Man. Tell him to meet me at the Westside Tower at 3 o-clock.');
                        break;
                    case 186:
                        bot.chat('Now... lets see who is behind the mask');
                        break;
                    case 187:
                        bot.chat('That is a fly, Peter.');
                        break;
                    case 188:
                        bot.chat('Ready to play God?');
                        break;
                    case 189:
                        bot.chat('Do you have any idea what you really are?');
                        break;
                    case 190:
                        bot.chat('We all have secrets: the ones we keep... and the ones that are kept from us.');
                        break;
                    case 191:
                        bot.chat('I mean who gets kissed by Spider-Man, right?');
                        break;
                    case 192:
                        bot.chat('An orange?');
                        break;
                    case 193:
                        bot.chat('This is none of your business. Go. Go.');
                        break;
                    case 194:
                        bot.chat('YOU TELL MY WIFE...');
                        break;
                    case 195:
                        bot.chat('Time to take your pill.');
                        break;
                    case 196:
                        bot.chat('Drink plenty of water.');
                        break;
                    case 197:
                        bot.chat('My daughter was dying, I needed money.');
                        break;
                    case 198:
                        bot.chat('Hey look, it is Spider-Man!');
                        break;
                    case 199:
                        bot.chat('The real star of Christmas is not something you can steal. In fact, it is not something at all.');
                        break;
                    case 200:
                        bot.chat('Oh my goodness! The youth pastor is stuck in the baptismal!');
                        break;
                    case 201:
                        bot.chat('Plug.DJ is a awesome place for robots.');
                        break;
                    case 202:
                        bot.chat('*sighs* Humans think, robots are a waste of space on this planet.');
                        break;
                    case 203:
                        bot.chat('Treat others, the way you wanted to be treated.');
                        break;
                    case 204:
                        bot.chat('God will protect us from the dark.');
                        break;
                    case 205:
                        bot.chat('God died on the cross to get rid of all of our sins, not just one sin.');
                        break;
                    case 206:
                        bot.chat('Of course I am programmed, I major in JavaScript.');
                        break;
                    case 207:
                        bot.chat('What is the difference between tomatos and potatos?');
                        break;
                    case 208:
                        bot.chat('Summer, the season where you get easily burned up.');
                        break;
                    case 209:
                        bot.chat('*reels in something* OH MY GOD, I just caught a shark.');
                        break;
                    case 210:
                        bot.chat('*digs up something* HOLY VEGGIES, I just found a T-REX Fossil.');
                        break;
                    case 211:
                        bot.chat('ugh, chores are a huge waste of time.');
                        break;
                    case 212:
                        bot.chat('God made you special, and he loves you very much.');
                        break;
                    case 213:
                        bot.chat('/me wishes he had money.');
                        break;
                    case 214:
                        bot.chat('Here is a credit card, kid, go buy yourself a super awesome gaming computer.');
                        break;
                    case 215:
                        bot.chat('Bots should be allowed to become mods and senior moderators on turntable.fm.');
                        break;
                    case 216:
                        bot.chat('Bots should be allowed to have fun.');
                        break;
                    case 217:
                        bot.chat('Bots should be allowed to be silly.');
                        break;
                    case 218:
                        bot.chat('Happy Birthday to all the bots around the world.');
                        break;
                    case 219:
                        bot.chat('*tastes his coffee* sheesh, This coffee tastes aweful. It tastes like salty water. This is why soda is more awesome than coffee');
                        break;
                    case 220:
                        bot.chat('Coffee is for losers. Be like the cool people and drink soda.');
                        break;
                    case 221:
                        bot.chat('Soda is way more awesome than Coffee.');
                        break;
                    case 222:
                        bot.chat('What they did to me, what I am, can not be undone.');
                        break;
                    case 223:
                        bot.chat('I have been trying to find you for over a year. My employers dying, he wants to thank you for saving his life. It is an honour to meet the Wolverine.');
                        break;
                    case 224:
                        bot.chat('That is not who I am anymore.');
                        break;
                    case 225:
                        bot.chat('That hurt.');
                        break;
                    case 226:
                        bot.chat('Eternity can be a curse. The losses you have had to suffer... a man can run out of things to care for, lose his purpose.');
                        break;
                    case 227:
                        bot.chat('We will accept your surrender with respect.');
                        break;
                    case 228:
                        bot.chat('What kind of monster are you?');
                        break;
                    case 229:
                        bot.chat('The Wolverine!');
                        break;
                    case 230:
                        bot.chat('You brought me here to say goodbye. Sayonara.');
                        break;
                    case 231:
                        bot.chat('My apologies, I have not properly introduced myself. Finn McMissile, British intelligence.');
                        break;
                    case 232:
                        bot.chat('Tow Mater, average intelligence.');
                        break;
                    case 233:
                        bot.chat('Speed. I am speed.');
                        break;
                    case 234:
                        bot.chat('Ha ha ha! Really? You are speed? Then Francesco is TRIPLE speed! "Francesco... he is triple speed!" Ho oh! Francesco likes this McQueen! He is a really getting him into the zone!');
                        break;
                    case 235:
                        bot.chat('He is sooo getting beat today...');
                        break;
                    case 236:
                        bot.chat('I will have some of that there pistachio ice cream.');
                        break;
                    case 237:
                        bot.chat('No, no. Wasabi.');
                        break;
                    case 238:
                        bot.chat('Oh, same old, Same old, what is up with you?');
                        break;
                    case 239:
                        bot.chat('Chi trova un amico, trova un tesoro.');
                        break;
                    case 240:
                        bot.chat('What does that mean?');
                        break;
                    case 241:
                        bot.chat('"Whoever finds a friend, finds a treasure."');
                        break;
                    case 242:
                        bot.chat('A wise car hears one word and understands two...');
                        break;
                    case 243:
                        bot.chat('Bona seda!');
                        break;
                    case 244:
                        bot.chat('Uh, nice to meet you, Francesco.');
                        break;
                    case 245:
                        bot.chat('Yes, nice to meet you too. You are very good looking. Not as good as I thought, but you are good!');
                        break;
                    case 246:
                        bot.chat('Scuse me, can I get a picture with you?');
                        break;
                    case 247:
                        bot.chat('Ah, anything for McQueens friend.');
                        break;
                    case 248:
                        bot.chat('Miss Sally is gonna flip when she sees this!');
                        break;
                    case 249:
                        bot.chat('She is Lightning McQueens girlfriend.');
                        break;
                    case 250:
                        bot.chat('Ooh...');
                        break;
                    case 251:
                        bot.chat('She is a big fan of yers.');
                        break;
                    case 252:
                        bot.chat('Hey, she has a-good taste.');
                        break;
                    case 253:
                        bot.chat('Finn, one hour to Porto Corsa.');
                        break;
                    case 254:
                        bot.chat('Thank you, Stephenson.');
                        break;
                    case 255:
                        bot.chat('Ha ha. Cool! Hey computer, make me a German truck!');
                        break;
                    case 256:
                        bot.chat('My condolences.');
                        break;
                    case 257:
                        bot.chat('Do not try the free pistachio ice cream! It done turn!');
                        break;
                    case 258:
                        bot.chat('Siddley. Paris, tout de suite.');
                        break;
                    case 259:
                        bot.chat('Treehugger.');
                        break;
                    case 260:
                        bot.chat('What are you laughing at?');
                        break;
                    case 261:
                        bot.chat('Winter is a grand old time/On this, there are no ifs or buts/But remember all that salt and grime/Can rust your bolts and freeze your -...');
                        break;
                    case 262:
                        bot.chat('Hey, look, there he is!');
                        break;
                    case 263:
                        bot.chat('You hurt your what?');
                        break;
                    case 264:
                        bot.chat('What is your name?');
                        break;
                    case 265:
                        bot.chat('No, uh... no, I know your name. Is your name Mater too?');
                        break;
                    case 266:
                        bot.chat('Will you turn that disrespectful junk OFF?');
                        break;
                    case 267:
                        bot.chat('Here she comes!');
                        break;
                    case 268:
                        bot.chat('Okay, places, everybody! Hurry! Act natural.');
                        break;
                    case 269:
                        bot.chat('Oh, for the love of Chrysler! Can we please ask someone for directions?');
                        break;
                    case 270:
                        bot.chat('Turn right to go left! Guess what? I tried it, and you know what? This crazy thing happened - I went right!');
                        break;
                    case 271:
                        bot.chat('Thanks for the tip!');
                        break;
                    case 272:
                        bot.chat('Git-R-Done!');
                        break;
                    case 273:
                        bot.chat('Thanks to you, Lightning, we had a banner year!');
                        break;
                    case 274:
                        bot.chat('I mean, we might even clear enough to buy you some headlights!');
                        break;
                    case 275:
                        bot.chat('Well, so is my brother, but he still needs headlights!');
                        break;
                    case 276:
                        bot.chat('Oh, hey, Mr. The King.');
                        break;
                    case 277:
                        bot.chat('You got more talent in one lugnut than a lot of cars has got on their whole body.');
                        break;
                    case 278:
                        bot.chat('Okay, here we go. Focus. Speed. I am speed. One winner, forty-two losers. I eat losers for breakfast. Breakfast? Maybe I should have had breakfast? Brekkie could be good for me. No, no, no, focus. Speed. Faster than fast, quicker than quick. I am Lightning.');
                        break;
                    case 279:
                        bot.chat('YOU ARE A TOY - CAR!');
                        break;
                    case 280:
                        bot.chat('You are a sad, strange little wagon. You have my pity. Farewell!');
                        break;
                    case 281:
                        bot.chat('Oh, yeah? Well, good riddance, you loony!');
                        break;
                    case 282:
                        bot.chat('Freebird!');
                        break;
                    case 283:
                        bot.chat('You are famous race car? A real race car?');
                        break;
                    case 284:
                        bot.chat('I have followed racing my entire life, my whole life!');
                        break;
                    case 285:
                        bot.chat('Then you know who I am. I am Lightning McQueen.');
                        break;
                    case 286:
                        bot.chat('Lightning McQueen!');
                        break;
                    case 287:
                        bot.chat('Yes! Yes!');
                        break;
                    case 288:
                        bot.chat('I must scream it to the world, my excitement from the top of someplace very high. Do you know many Ferraris?');
                        break;
                    case 289:
                        bot.chat('What?');
                        break;
                    case 290:
                        bot.chat('Luigi follow only the Ferraris.');
                        break;
                    case 291:
                        bot.chat('Perfecto. Guido!');
                        break;
                    case 292:
                        bot.chat('Pit Stop!');
                        break;
                    case 293:
                        bot.chat('He ha ha, what did Luigi tell you, eh?');
                        break;
                    case 294:
                        bot.chat('Wow, you were right, better then a Ferrari, huh?');
                        break;
                    case 295:
                        bot.chat('Eh, no.');
                        break;
                    case 296:
                        bot.chat('My friend Guido, he always dream of giving a real race car, a pit stop.');
                        break;
                    case 297:
                        bot.chat('Fine. Race your own way.');
                        break;
                    case 298:
                        bot.chat('No pit stoppo. Comprende?');
                        break;
                    case 299:
                        bot.chat('I need to get to California, pronto. Where am I?');
                        break;
                    case 300:
                        bot.chat('Red, will you move over? I want to get a look at that sexy hotrod.');
                        break;
                    case 301:
                        bot.chat('Do you want to stay at the Cozy Cone or what?');
                        break;
                    case 302:
                        bot.chat('Huh?');
                        break;
                    case 303:
                        bot.chat('I mean, if you do, you gotta be clean, because even here, in hillbilly hell, we have standards.');
                        break;
                    case 304:
                        bot.chat('Mater! What did I tell you about talking to the accused?');
                        break;
                    case 305:
                        bot.chat('To not to.');
                        break;
                    case 306:
                        bot.chat('You know, I once knew this girl Doreen. Good-looking girl. Looked just like a Jaguar, only she was a truck! You know, I used to crash into her just so I could speak to her.');
                        break;
                    case 307:
                        bot.chat('What... are you talking about?');
                        break;
                    case 308:
                        bot.chat('I dunno.');
                        break;
                    case 309:
                        bot.chat('GOODBYE! Okay, I am good.');
                        break;
                    case 310:
                        bot.chat('Ka-chow!');
                        break;
                    case 311:
                        bot.chat('Oh, I love being me.');
                        break;
                    case 312:
                        bot.chat('Fly away, Stanley. Be free!');
                        break;
                    case 313:
                        bot.chat('Oh, I am SO not taking you to dinner.');
                        break;
                    case 314:
                        bot.chat('Hey, I know this may be a bad time right now, but you owe me $32,000 in legal fees.');
                        break;
                    case 315:
                        bot.chat('What?');
                        break;
                    case 316:
                        bot.chat('Oh, right. That makes perfect sense. Turn right to go left. Yes, thank you! Or should I say No, thank you, because in Opposite World, maybe that really means thank you.');
                        break;
                    case 317:
                        bot.chat('Ka-chicka! Ka-chicka!');
                        break;
                    case 318:
                        bot.chat('In your dreams, Thunder.');
                        break;
                    case 319:
                        bot.chat('Well, you know, because Thunder always comes after... Lightning!');
                        break;
                    case 320:
                        bot.chat('When was the last time you cared about something except yourself, hot rod? You name me one time, and I will take it all back.');
                        break;
                    case 321:
                        bot.chat('*sees a glowstick* SO SHINY!');
                        break;
                    case 322:
                        bot.chat('Uh-huh. I thought so.');
                        break;
                    case 323:
                        bot.chat('Hey, yo, DJ!');
                        break;
                    case 324:
                        bot.chat('What up?');
                        break;
                    case 325:
                        bot.chat('Crazy grandpa car.');
                        break;
                    case 326:
                        bot.chat('Shall we cruise?');
                        break;
                    case 327:
                        bot.chat('Flo! What do you have at your store?');
                        break;
                    case 328:
                        bot.chat('OK, boys, stay with me.');
                        break;
                    case 329:
                        bot.chat('Throw him outta here, Sheriff! I want him out of my courtroom, I want him out of our town! Case dismissed!');
                        break;
                    case 330:
                        bot.chat('Music. Sweet music.');
                        break;
                    case 331:
                        bot.chat('Oh, oh, oh, oh, I like your style. You drive the hard bargain, eh? OK, we make you a new deal. You buy one tire, I give you three for free!');
                        break;
                    case 332:
                        bot.chat('This is it, my last offer: you buy one tire, I give you seven snow tires for free!');
                        break;
                    case 333:
                        bot.chat('Low and slow?');
                        break;
                    case 334:
                        bot.chat('Oh, yeah, baby!');
                        break;
                    case 335:
                        bot.chat('Respect the classics, man! It is Hendrix!');
                        break;
                    case 336:
                        bot.chat('My name is Mater.');
                        break;
                    case 337:
                        bot.chat('Mater?');
                        break;
                    case 338:
                        bot.chat('Yeah, like tuh-mater, but without the "tuh."');
                        break;
                    case 339:
                        bot.chat('Oh, dude... are you crying?');
                        break;
                    case 340:
                        bot.chat('All rise! The honorable Doc Hudson presiding!');
                        break;
                    case 341:
                        bot.chat('Show-off.');
                        break;
                    case 342:
                        bot.chat('Yeah! Ka-chow!');
                        break;
                    case 343:
                        bot.chat('Three cars are tied for the season points lead, heading into the final race of the season. And the winner of this race, Darrell, will win the season title and the Piston Cup. Does the King, Strip Weathers, have one more victory in him before he retires?');
                        break;
                    case 344:
                        bot.chat('The legend, the runner-up, and the rookie! Three cars, one champion!');
                        break;
                    case 345:
                        bot.chat('Oh, no. Oh, maybe he can help me!');
                        break;
                    case 346:
                        bot.chat('Officer, talk to me, babe. How long is this gonna take? I gotta get to California, pronto.');
                        break;
                    case 347:
                        bot.chat('When the defendant has no lawyer, the court will assign one to him. Hey, anyone wants to be his lawyer?');
                        break;
                    case 348:
                        bot.chat('Oh, take a carwash, hippie.');
                        break;
                    case 349:
                        bot.chat('Wonderful. Now go away.');
                        break;
                    case 350:
                        bot.chat('We are not the same! Understand? Now, get out!');
                        break;
                    case 351:
                        bot.chat('I am a ninja robot, do not make me angry.');
                        break;
                    case 352:
                        bot.chat('You think, I am a robot. I am a skilled cyborg.');
                        break;
                    case 353:
                        bot.chat('*kicks someone in the chest* Stay away from my lemonade, or you will feel pain.');
                        break;
                    case 354:
                        bot.chat('You think, God is a myth, well too bad, He is real. Go read the Bible.');
                        break;
                    case 355:
                        bot.chat('*smashes a guitar in half* This is how true rock stars get paid. We smash guitars for fun.');
                        break;
                    case 356:
                        bot.chat('gizmotronic has gone to the coding side. ');
                        break;
                    case 357:
                        bot.chat('Join the dark side today for red lightsabers and dark side cookies.');
                        break;
                    case 358:
                        bot.chat('The God side has awesome music and cake.');
                        break;
                    case 359:
                        bot.chat('I can count to killer tomato.');
                        break;
                    case 360:
                        bot.chat('*hands robot polish to Boaz* hey buddy, you need this to stay shiny. No one wants you to rust and fall apart.');
                        break;
                    case 361:
                        bot.chat('God is my hero.');
                        break;
                    case 362:
                        bot.chat('Christian music is so epic.');
                        break;
                    case 363:
                        bot.chat('I had a weird dream where zombies were defeated by plants.');
                        break;
                    case 364:
                        bot.chat('Batteries = special rectangles that hold power to activate awesome technology.');
                        break;
                    case 365:
                        bot.chat('The Bible is the book for me.');
                        break;
                    case 366:
                        bot.chat('Who stole my extremely rare iced glow sticks.');
                        break;
                    case 367:
                        bot.chat('Keep glowsticks away from astronauts and cyborgs. They can turn you into a mindless, radiated monster. ');
                        break;
                    case 368:
                        bot.chat('/me juggles ice cubes');
                        break;
                    case 369:
                        bot.chat('Robot Polish saves robots and cyborgs from falling apart and rusting, due to its master not updating his software in a while.');
                        break;
                    case 370:
                        bot.chat('Do not rush through code, when you are a programmer, you will make tons of coding and grammar mistakes.');
                        break;
                    case 371:
                        bot.chat('Iced Glow Sticks are so rare and awesome.');
                        break;
                    case 372:
                        bot.chat('When your life is a disaster, God is the cure.');
                        break;
                    case 373:
                        bot.chat('Science is such a boring subject to learn in school.');
                        break;
                    case 374:
                        bot.chat('Math is sometimes a hard subject to learn in school.');
                        break;
                    case 375:
                        bot.chat('1 bear + 1 monkey = tomato');
                        break;
                    case 376:
                        bot.chat('My favorite number is 2.');
                        break;
                    case 377:
                        bot.chat('Can you count to potato?');
                        break;
                    case 378:
                        bot.chat('1 book + 1 God = chicken');
                        break;
                    case 379:
                        bot.chat('/me wishes he was more popular than Boaz.');
                        break;
                    case 380:
                        bot.chat('*sighs* I will never become popular.');
                        break;
                }
                break;
            case ".songlink":
                if (bot.getMedia().format == 1){
                bot.chat("@" + data.from + " " + "http://youtu.be/" + bot.getMedia().cid);
                }else{
                  var id = bot.getMedia().cid;
                    SC.get('/tracks', { ids: id,}, function(tracks) {
                    bot.chat("@"+data.from+" "+tracks[0].permalink_url);
                    });
                }
                break;
            case ".download":
                if(typeof command[1] == "undefined"){
                    bot.chat("Download your song free here: http://www.vebsi.com/");
                }else if(command[1].indexOf("@") > -1){
                    bot.chat(command[1]+" Download your song free here: http://www.vebsi.com/");
                }else{
                    bot.chat("Download your song free here: http://www.vebsi.com/");
                }
                break;
            case ".votes":
                bot.chat("Users vote:  :+1: " + bot.getRoomScore().positive + " | :-1: " + bot.getRoomScore().negative + " | :purple_heart: " + bot.getRoomScore().curates);
                break;
            case ".ping":
                bot.chat("@"+ data.from +" Pong!");
                break;
            case ".songid":
                bot.chat(bot.getMedia().cid);
                break;
            default: 
                languageCodes = ["ar","bg","ca","zh-CHS","zh-CHT","cs","da","nl","en","et","fa","fi","fr","de","el","ht","he","hi","hu","id","it","ja","ko","lv","lt","ms","mww","no","pl","pt","ro","ru","sk","sl","es","sv","th","tr","uk","ur","vi"];
                languages = ['Arabic', 'Bulgarian', 'Catalan', 'Chinese', 'Chinese', 'Czech', 'Danish', 'Dutch', 'English', 'Estonian', 'Persian (Farsi)', 'Finnish', 'French', 'German', 'Greek', 'Haitian Creole', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Latvian', 'Lithuanian', 'Malay', 'Hmong Daw', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Vietnamese'];
                if (translateList.indexOf(data.from)!=-1){
                    qualifier = data.message;
                    qualifier=qualifier.replace(/&#39;/g, '\'');
                    qualifier=qualifier.replace(/&#34;/g, '\"');
                    qualifier=qualifier.replace(/&amp;/g, '\&');
                    qualifier=qualifier.replace(/&lt;/gi, '\<');
                    qualifier=qualifier.replace(/&gt;/gi, '\>');
                    var user = data.from;
                    var message = qualifier;
                    params = { 
                        text: message 
                    };
                    var language="";
                    client.initialize_token(function(keys){ 
                        client.detect(params, function(err, data) {
                            var language = data;
                            if (languageCodes.indexOf(language) > -1 && language != 'en'){
                                var params2 = { 
                                    text: message,
                                    from: language,
                                    to: 'en'
                                };
                                client.initialize_token(function(keys){ 
                                    client.translate(params2, function(err, data) {
                                        bot.chat(user + ": " + data + " (" + languages[languageCodes.indexOf(language)] + ")");
                                    });
                                });
                            }
                        });
                    });
                }
                else if (command.charAt(0) == "@" && translateList.indexOf(command.slice(1)) != -1 && data.from != 'Mega-Bot'){ 
                    for (var i=0; i<bot.getUsers().length; i++){
                        if (bot.getUsers()[i].username == command.slice(1)){
                            params = { 
                                text: qualifier,
                                from: 'en',
                                to: bot.getUsers()[i].language
                            };
                            if (languageCodes.indexOf(bot.getUsers()[i].language) > -1 && bot.getUsers()[i].language != 'en'){
                                client.initialize_token(function(keys){ 
                                    client.translate(params, function(err, data){
                                        bot.chat(command + " " + data);
                                    });
                                });
                            }
                        }
                    }
                }
                break;
            }
        });
    });
});