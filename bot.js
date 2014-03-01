var PlugAPI = require('./plugapi');
var ROOM = 'christian-anything-2';
var UPDATECODE = '4w@fWs$'; 

var Lastfm = require('simple-lastfm');
var version = "2.0.1";

var Theme = "The current theme for this room is Christian Music, sung by Christian Bands";
var joined = new Date().getTime();
var translateList = [];

var lastfm = new Lastfm({
    api_key: 'dc116468a760d9c586562d79e302aadf',
    api_secret: 'c68c25364ccfa0961f60abe9250f8233',
    username: 'kingzimmer',
    password: 'Starwarskotor1'
});

var LastfmAPI = require('lastfmapi');

var lfm = new LastfmAPI({
    'api_key' : 'dc116468a760d9c586562d79e302aadf',
    'secret' : 'c68c25364ccfa0961f60abe9250f8233'
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
        bot.chat('Mega-Bot is now online!');
         
    bot.on('userJoin', function(data) {
        bot.chat('Welcome to Christian Anything. All Christian Bands and Christian Songs are allowed in this epic room. Have fun and worship with us to celebrate our king, God.');
    });
    
    var reconnect = function() { 
        bot.connect(ROOM);
    };

    bot.on('close', reconnect);
    bot.on('error', reconnect);

     bot.on('djAdvance', function(data) {
        //console.log(data, bot.getUser(data.currentDJ));
        console.log(bot.getDJs()[0].username);//, bot.getDJs());
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
            switch (command)
            {
            case ".commands":
                bot.chat("List of Commands: .commands, .hey, .woot, .meh, .props, .calc, .join, .leave, .skip, .forecast, .version, .artist, .track, .genre, .github, .help, .about, .define, .grab, .facebook, .wiki, .darkside, .rank, .like, .theme, .translate, .google, .status, .coin, .mood, .autotranslate, .untranslate, .album, .similar, .events, .soundcloud, .lottery, .rules");
                break;
            case ".hey":
                bot.chat("Well hey there! @" + data.from);
                break;
            case ".woot":
            case ".awesome":
                bot.woot();
                bot.chat("I love this song.");
                break;
            case ".meh":
            case ".lame":
                bot.meh();
                bot.chat("I hate this song.");
                break;
            case ".props":
            case ".propsicle":
                console.log(bot.getDJs()[0].username, bot.getDJs(), bot.getDJs()[0]);
                bot.chat("Epic Play! @" + bot.getDJs()[0].username);
                bot.woot();
                break;
            case ".calc":
            case ".calculate":
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
                if (qualifier!="" && !(/\d\(/g.test(qualifier)) && !(/[\!\,\@\'\"\?\#\$\%\&\_\=\<\>\:\;\[\]\{\}\`\~\||log]/g.test(qualifier)) &&  !(/\^\s{0,}\d{0,}\s{0,}\^/g.test(qualifier)) && !(/\)\d/g.test(qualifier)) && !(/^[\+\*\/\^]/g.test(qualifier)) && !(/[\+\-\*\/\^]$/g.test(qualifier)) && !(/[\+\-\*\/\^]\s{0,}[\+\*\/\^]/g.test(qualifier)) && (!(/([a-zA-Z])\d/g.test(qualifier))) && !(/\d([a-zA-Z])/g.test(qualifier)) && !(/\d\s{1,}\d/g.test(qualifier)) && !(/\s\.\s/g.test(qualifier)) && !(/\.\d\./g.test(qualifier)) && !(/\d\.\s{1,}\d/g.test(qualifier)) && !(/\d\s{1,}\.\d/g.test(qualifier)) && !(/\.\./g.test(qualifier)) && counter==counter2){
                    func=qualifier;
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
                else if (qualifier==""){
                    bot.chat("Try .calc followed by something to calculate.");
                }
                else {
                    bot.chat("/me does not compute.");
                }
                break;
            case ".join":
            case ".jump":
                bot.waitListJoin();
                bot.chat("Joining The Waitlist!");
                break;
            case ".leave":
            case ".jump down":
                bot.waitListLeave();
                bot.chat("Leaving The Waitlist.");
                break;
            case ".skip":
                bot.skipSong(bot.getDJs()[0].id);
                bot.chat("Skipping The Song!");
                break;
            case ".forecast": 
                google_geocoding.geocode(qualifier, function(err, location) {
                    if (location!=null){
                        weather.getWeather(location.lat, location.lng, function(err, data){
                            if (data!=null){
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
                                bot.chat("No weather found.")
                            }
                        });
                    }
                    else {
                        bot.chat("No weather found.")
                    }
                });
                break;
            case ".version":
                    bot.chat(version);
                    break;
            case ".artist": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                }
                else {
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
                                bot.chat("No artist info found.")
                            }
                        }
                        else {
                            bot.chat("No artist info found.")
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
                                bot.chat("No track info found.")
                            }
                        }
                        else {
                            bot.chat("No track info found.")
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
                else {
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
                            else {
                                bot.chat("No genre found.");
                            }
                        }
                        else {
                            if (tags!=""){
                                bot.chat("Genre of "+artistChoice+": "+tags);
                            }
                            else {
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
                    else {
                        bot.chat("No album found.")
                    }
                });
                break;
            case ".similar": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                }
                else {
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
                    else {
                        bot.chat("No similar artists found.")
                    }
                });
                break;
            case ".events": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice=bot.getMedia().author;
                }
                else {
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
                            else {
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
                    else {
                        bot.chat("No upcoming events found.");
                    }
                });
                break;
            case ".github":
                bot.chat("Check me out on GitHub! https://github.com/Spiderlover/Mega-Bot");
                break;
            case ".help":
                bot.chat("Welcome to Plug.DJ! You can populate your playlists by finding songs with YouTube and Soundcloud.");
                break;
            case ".about":
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
                    result=result.replace(/\s{1,}:/g,': ')
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
                    if (result != ''){
                        if (result.length>250){
                            result=result.substring(0, 247)+"...";
                        }  
                        bot.chat(result);
                        bot.chat("For more info: http://www.merriam-webster.com/dictionary/" + linkQualifier);
                    }
                    else {
                        bot.chat("No definition found.")
                    }
                });
                break;
            case ".soundcloud": 
                var artistChoice="";
                if (qualifier==""){
                    artistChoice = bot.getMedia().author;
                }
                else {
                    artistChoice=qualifier;
                }
                var link = 'http://api.soundcloud.com/users.json?q=' + artistChoice + '&consumer_key=apigee';
                request(link, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        if (info[0] != undefined){
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
                            else {
                                bot.createPlaylist("Library "+playlists.length+1);
                                bot.activatePlaylist(playlists[playlists.length-1].id)
                                var selectedID=playlists[playlists.length-1].id;
                                bot.chat("Added to "+playlists[playlists.length-1].name+" playlist.");
                            }
                        }
                    }
                    bot.addSongToPlaylist(selectedID, bot.getMedia().id);
                });
                break;
            case ".facebook":
                bot.chat("Join our Facebook group: https://www.facebook.com/groups/285521331540409/");
                break;
            case ".wiki": 
                if (qualifier!=""){
                    Wiki.page(qualifier, false, function(err, page){
                        page.summary(function(err, summary){
                            if (summary!=undefined){
                                Wiki.page(qualifier, false, function(err, page){
                                    page.html(function(err, html){
                                        if (html.indexOf('<ul>')!=-1){
                                            html=html.substring(0, html.indexOf('<ul>'));
                                        }
                                        html=html.replace(/<[^>]+>/g, '');
                                        Wiki.page(qualifier, false, function(err, page){
                                            page.summary(function(err, summary){
                                                if (summary!=undefined){
                                                    if (summary=="" || summary.indexOf("This is a redirect")!=-1){
                                                        summary="redirect "+html;
                                                    }
                                                    if (summary.indexOf('may refer to:')!=-1 || summary.indexOf('may also refer to:')!=-1 || summary.indexOf('may refer to the following:')!=-1 || summary.indexOf('may stand for:')!=-1){
                                                        bot.chat("This may refer to several things - please be more specific.");
                                                        var queryChoice=qualifier;
                                                        queryChoice=queryChoice.replace(/ /g, '_');
                                                        bot.chat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
                                                    }
                                                    else if (summary.substring(0,8).toLowerCase()=="redirect"){
                                                        subQuery='';
                                                        if (summary.indexOf('#')==-1){
                                                            if (summary.substring(8,9)==' '){
                                                                var query=summary.substring(9);
                                                            }
                                                            else {
                                                                var query=summary.substring(8);
                                                            }
                                                        }
                                                        else {
                                                            var query=summary.substring(9, summary.indexOf('#'));
                                                            subQuery=summary.substring(summary.indexOf('#')+1);
                                                        }
                                                        Wiki.page(query, false, function(err, page2){
                                                            page2.content(function(err, content){
                                                                if (content!=undefined){
                                                                    if (content.indexOf('may refer to:')!=-1 || content.indexOf('may also refer to:')!=-1 || content.indexOf('may refer to the following:')!=-1 || content.indexOf('may stand for:')!=-1){
                                                                        bot.chat("This may refer to several things - please be more specific.");
                                                                    }
                                                                    else if (subQuery!=''){
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
                                                        var queryChoice=qualifier;
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
                var languages = ['Arabic', 'Bulgarian', 'Catalan', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Czech', 'Danish', 'Dutch', 'English', 'Estonian', 'Persian (Farsi)', 'Finnish', 'French', 'German', 'Greek', 'Haitian Creole', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Latvian', 'Lithuanian', 'Malay', 'Hmong Daw', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Vietnamese'];
                if (qualifier!=""){
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
                                        var params2 = { 
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
                if (qualifier!=""){
                    var google=qualifier;
                    google=google.replace(/ /g, '+');
                    bot.chat("http://lmgtfy.com/?q=" + google);
                }
                else {
                    bot.chat("Try .google followed by something to look up.");
                }
                break;
            case ".status":
                var response = "";
                var currentTime = new Date().getTime();
                var minutes = Math.floor((currentTime - joined) / 60000);
                var hours = 0;
                while(minutes > 60){
                    minutes = minutes - 60;
                    hours++;
                }
                hours == 0 ? response = "Running for " + minutes + "m " : response = "Running for " + hours + "h " + minutes + "m";
                bot.chat(response);
                break;
            case ".coin":
                var crowd = bot.getUsers();
                var randomPerson = Math.floor(Math.random() * crowd.length);
                var randomSentence = Math.floor(Math.random() * 1);
                switch(randomSentence){
                     case 0:
                        bot.chat("@" + crowd[randomPerson].username + "The coin was flipped, and you got heads");
                        break;
                    case 1:
                        bot.chat("@" + crowd[randomPerson].username + "The coin was flipped, and you got tails");
                        break;
                }
                break;
            case '.autotranslate': 
                if (qualifier!=""){
                    translateList.push(qualifier);
                    bot.chat("Autotranslating user " + qualifier + ".");
                }
                else {
                    bot.chat("Try .autotranslate followed by a username.");
                }
                break;
            case '.untranslate': 
                if (qualifier!=""){
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
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var lotteryPrizes = Math.floor(Math.random() * 20);
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
                }
                break;
            case ".rules":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var rules = Math.floor(Math.random() * 10);
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
                }
                break;
            default: 
                languageCodes = ["ar","bg","ca","zh-CHS","zh-CHT","cs","da","nl","en","et","fa","fi","fr","de","el","ht","he","hi","hu","id","it","ja","ko","lv","lt","ms","mww","no","pl","pt","ro","ru","sk","sl","es","sv","th","tr","uk","ur","vi"];
                languages = ['Arabic', 'Bulgarian', 'Catalan', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Czech', 'Danish', 'Dutch', 'English', 'Estonian', 'Persian (Farsi)', 'Finnish', 'French', 'German', 'Greek', 'Haitian Creole', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Latvian', 'Lithuanian', 'Malay', 'Hmong Daw', 'Norwegian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Vietnamese'];        
                if (translateList.indexOf(data.from)!=-1){
                    qualifier = data.message;
                    qualifier=qualifier.replace(/&#39;/g, '\'');
                    qualifier=qualifier.replace(/&#34;/g, '\"');
                    qualifier=qualifier.replace(/&amp;/g, '\&');
                    var user = data.from;
                    var message = qualifier;
                    var params = { 
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
                            var params = { 
                                text: qualifier,
                                from: 'en',
                                to: bot.getUsers()[i].language
                            };
                            if (bot.getUsers()[i].language != 'en'){
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