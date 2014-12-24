var plugapi = require('plugapi');
var room = 'christian-anything-2';
 
var Lastfm = require('simple-lastfm');
var version = "4.1.1";

var theme = "The current theme for this room is Christian Music.";
var joined = new Date().getTime();
var translateList = [];

var lastfm = new Lastfm({
    api_key: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    api_secret: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    username: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    password: 'xxxxxxxxxxxxxxxxxxxxxxxx'
});

var LastfmAPI = require('lastfmapi');

var lfm = new LastfmAPI({
    api_key : 'xxxxxxxxxxxxxxxxxxxxxxxx',
    secret : 'xxxxxxxxxxxxxxxxxxxxxxxx'
});

var mlexer = require('math-lexer');
var google_geocoding = require('google-geocoding');
var weather = require('weathers');
var api = require('dictionaryapi');
var Wiki = require("wikijs");
var MsTranslator = require('mstranslator'); 
var request = require('request'); 
var time = require('time'); 
var client = new MsTranslator({client_id:"MegaBot", client_secret: "BUjjotOXGYXYbYnioSklbU0CSRM5gBBhag4piJ9F+9M="}); 

var bot = new plugapi({
    "email": "xxxxxxxxxxxxxxxxxxxxxxxx",
    "password": "xxxxxxxxxxxxxxxxxxxxxxxx"
});
	
	bot.connect(room);

    var reconnect = function() { 
    bot.connect(room); 
};

    bot.on('close', reconnect);
    bot.on('error', reconnect);

    
    var dj = null;
    var roomScore = null;



//Event which triggers when the current song receives 5 mehs, skips the song
var setmehs = false;
var mehs = 4;
bot.on('vote', function(data) {
    roomScore = bot.getRoomScore();
    if (roomScore.negative > mehs && setmehs){
        bot.chat("@" + dj.username + " Your tune does not fall within the established genre of Christian Anything");
        bot.moderateForceSkip(dj.id);
    }
});

bot.on('chat', function(data) {
        //if (data.from == 'christian-anything-2') {
            var command = data.message.split(' ')[0];
            var firstIndex = data.message.indexOf('');
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
                bot.sendChat("List of Commands: .commands, .hey, .woot, .meh, .props, .calc, .join, .leave, .skip, .forecast, .version, .artist, .track, .genre, .github, .help, .about, .define, .grab, .facebook, .wiki, .darkside, .rank, .like, .theme, .translate, .google, .status, .coin, .mood, .autotranslate, .untranslate, .album, .similar, .events, .soundcloud, .lottery, .rules, .eggs, .pita, .8ball, Mega-bot, .songlink, .download, .votes, .ping, .temp, .songid, .title, .author, .song, .jonah, .philemon, .2john, .time, .1john, .3john, .jude, .obadiah, .titus");
                break;
            case ".hey":
                bot.sendChat("Well hey there! @" + data.from);
                break;
            case ".woot":
                bot.woot();
                bot.sendChat("I love this song.");
                break;
            case ".meh":
                bot.meh();
                bot.sendChat("I hate this song.");
                break;
            case ".props":
                bot.sendChat("Epic Play! @" + bot.getDJs()[0].username);
                bot.woot();
                break;
            case ".calc":
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
                            bot.sendChat(answer.toString());
                        }
                        else {
                            bot.sendChat('http://i.imgur.com/KpAzEs8.jpg');
                        }
                    }
                    else {
                        bot.sendChat("/me does not compute correctly.");
                    }
                }
                else if (qualifier===""){
                    bot.sendChat("Try .calc followed by something to calculate.");
                }
                else {
                    bot.sendChat("/me does not compute correctly.");
                }
                break;
            case ".join":
                bot.waitListJoin();
                bot.sendChat("Joined Waitlist!");
                break;
            case ".leave":
                bot.waitListLeave();
                bot.sendChat("Left Waitlist.");
                break;
            case ".skip":
                bot.skipSong(bot.getDJs()[0].id);
                bot.sendChat("Skipped Song!");
                break;
            case ".forecast": 
                if (qualifier===""){
                    bot.sendChat("Try .forecast followed by a US state, city, or zip to look up.");
                }
                else {
                    google_geocoding.geocode(qualifier, function(err, location) {
                        if (location!==null){
                            weather.getWeather(location.lat, location.lng, function(err, data){
                                if (data!==null){
                                    var weekForecast="Forecast for "+data.location.areaDescription+": Current: "+data.currentobservation.Temp+"°F "+data.currentobservation.Weather;
                                    for (var i=0; i<7; i++){
                                        var day = data.time.startPeriodName[i].split('');
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
                                    bot.sendChat(weekForecast);
                                }
                                else {
                                    bot.sendChat("No weather has been found.");
                                }
                            });
                        }
                        else {
                            bot.sendChat("No weather has been found.");
                        }
                    });
                }
                break;
            case ".temp": 
                if (qualifier==""){
                    bot.sendChat("Try .temp followed by a US state, city, or zip to look up.");
                }
                else {
                    google_geocoding.geocode(qualifier, function(err, location) {
                        if (location!=null){
                            weather.getWeather(location.lat, location.lng, function(err, data){
                                if (data!=null){
                                    var temp="Current temperature in "+data.location.areaDescription+": "+data.currentobservation.Temp+"°F "+data.currentobservation.Weather;
                                    bot.sendChat(temp);
                                }
                                else {
                                    bot.sendChat("No temperature has been found.");
                                }
                            });
                        }
                        else {
                            bot.sendChat("No temperature has been found.");
                        }
                    });
                }
                break;
            case ".version":
                bot.sendChat(version);
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
                                summary=summary.replace(/(&Scaron;)/g, 'Š');
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
                                bot.sendChat(summary); 
                                var lastfmArtist=artistChoice;
                                lastfmArtist=lastfmArtist.replace(/ /g, '+');
                                bot.sendChat("For more info: http://www.last.fm/music/" + lastfmArtist);
                            }
                            else {
                                bot.sendChat("No artist info has been found.");
                            }
                        }
                        else {
                            bot.sendChat("No artist info has been found.");
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
                                summary=summary.replace(/(&iacute;)/g, 'í');
                                summary=summary.replace(/(&oacute;)/g, 'ó');
                                summary=summary.replace(/(&Scaron;)/g, 'Š');
                                summary=summary.replace(/<[^>]+>/g, '');
                                if (summary.length>250){
                                    summary=summary.substring(0, 247)+"...";
                                }  
                                bot.sendChat(summary);
                            }
                            else {
                                bot.sendChat("No track info has been found.");
                            }
                        }
                        else {
                            bot.sendChat("No track info has been found.");
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
                                bot.sendChat("Genre of "+trackChoice+" by "+artistChoice+": "+tags);
                            }
                            else{
                                bot.sendChat("No genre has been found.");
                            }
                        }
                        else{
                            if (tags!=""){
                                bot.sendChat("Genre of "+artistChoice+": "+tags);
                            }
                            else{
                                bot.sendChat("No genre has been found.");
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
                            bot.sendChat(albumMessage);
                            bot.sendChat("Check out the full album: " + track.album.url);
                        });
                    }
                    else{
                        bot.sendChat("No album has been found.");
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
                        bot.sendChat("Similar artists to " + artistChoice + ": " + artists);
                    }
                    else{
                        bot.sendChat("No similar artists found.");
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
                        bot.sendChat("Upcoming events for " + artistChoice + ": " + upcomingEvents);
                    }
                    else{
                        bot.sendChat("No upcoming events have been found.");
                    }
                });
                break;
            case ".github":
                bot.sendChat("https://github.com/Spiderlover/Mega-Bot");
                break;
            case ".help":
                bot.sendChat("You can populate your playlists by finding songs with YouTube and Soundcloud.");
                break;
            case ".about":
                bot.sendChat("Hey, I'm Mega-Bot, your personal room-control bot. My master, God's Vegetables, created me. For a list of commands, type .commands");
                break;
            case ".define": 
                var dict = new api.DictionaryAPI(api.COLLEGIATE, 'cf2109fd-f2d0-4451-a081-17b11c48069b');
                var linkQualifier=qualifier;
                linkQualifier=linkQualifier.replace(/ /g, '%20');
                dict.query(linkQualifier.toLowerCase(), function(err, result) {
                    result=result.replace(/<vi>(.*?)<\/vi>|<dx>(.*?)<\/dx>|<dro>(.*?)<\/dro>|<uro>(.*?)<\/uro>|<svr>(.*?)<\/svr>|<sin>(.*?)<\/sin>|<set>(.*?)<\/set>|<pl>(.*?)<\/pl>|<pt>(.*?)<\/pt>|<ss>(.*?)<\/ss>|<ca>(.*?)<\/ca>|<art>(.*?)<\/art>|<ew>(.*?)<\/ew>|<hw>(.*?)<\/hw>|<sound>(.*?)<\/sound>|<pr>(.*?)<\/pr>|<fl>(.*?)<\/fl>|<date>(.*?)<\/date>|<sxn>(.*?)<\/sxn>|<ssl>(.*?)<\/ssl>/g, '');
                    result=result.replace(/<vt>(.*?)<\/vt>/g,'');
                    result=result.replace(/<\/sx> <sx>|<sd>/g,',');
                    result=result.replace(/\s{1,}<sn>/g, ';');
                    result=result.replace(/\s{1,}<un>/g, ':');
                    result=result.replace(/<(?!\/entry\s*\/?)[^>]+>/g, '');
                    result=result.replace(/\s{1,}:/g,':');
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
                        bot.sendChat(result);
                        bot.sendChat("For more info: http://www.merriam-webster.com/dictionary/" + linkQualifier);
                    }
                    else {
                        bot.sendChat("No definition has been found.");
                    }
                });
                break;
            case ".soundcloud": 
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
                            bot.sendChat(info[0].username + ": " + info[0].permalink_url);
                        }
                        else {
                             bot.sendChat("No soundcloud has been found.");
                         }
                    }
                });
                break;
        // case ".grab": //Makes the bot grab the current song
        //     for (var i=0; i<staff.length; i++){
        //         if (staff[i].username == data.un && staff[i].role > 1){
        //             bot.getPlaylists(function(playlists) {
        //                 console.log(playlists);
        //                 for (var i=0; i<playlists.length; i++){
        //                     if (playlists[i].active){
        //                         if (playlists[i].count!=200){
        //                             var selectedID=playlists[i].id;
        //                             bot.chat("Added to my "+playlists[i].name+" playlist.");
        //                         }
        //                         else{
        //                             bot.createPlaylist("Library "+playlists.length+1);
        //                             bot.activatePlaylist(playlists[playlists.length-1].id);
        //                             var selectedID=playlists[playlists.length-1].id;
        //                             bot.chat("Added to "+playlists[playlists.length-1].name+" playlist.");
        //                         }
        //                     }
        //                 }
        //                 bot.addSongToPlaylist(selectedID, media.id);
        //             });
        //         }
        //     }
        //     break;
            case ".facebook":
                bot.sendChat("https://www.facebook.com/groups/285521331540409/");
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
                                                        bot.sendChat("This may refer to several things - please be more specific.");
                                                        var queryChoice=qualifier;
                                                        queryChoice=queryChoice.replace(/ /g, '_');
                                                        bot.sendChat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
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
                                                                        bot.sendChat("This may refer to several things - please be more specific.");
                                                                    }
                                                                    else if (subQuery!==''){
                                                                        content=content.substring(content.indexOf("=== "+subQuery+" ===")+8+subQuery.length);
                                                                        if (content.length>250){
                                                                            content=content.substring(0, 247)+"...";
                                                                        }  
                                                                        bot.sendChat(content);
                                                                    }
                                                                    else {
                                                                        if (content.length>250){
                                                                            content=content.substring(0, 247)+"...";
                                                                        }  
                                                                        bot.sendChat(content);
                                                                    }
                                                                    var queryChoice=qualifier;
                                                                    queryChoice=queryChoice.replace(/ /g, '_');
                                                                    bot.sendChat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
                                                                }
                                                                else {
                                                                    bot.sendChat("No wiki has been found.");
                                                                }
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        if (summary.length>250){
                                                            summary=summary.substring(0, 247)+"...";
                                                        }  
                                                        bot.sendChat(summary);
                                                        queryChoice=qualifier;
                                                        queryChoice=queryChoice.replace(/ /g, '_');
                                                        bot.sendChat("For more info: http://en.wikipedia.org/wiki/" + queryChoice);
                                                    }
                                                }
                                                else {
                                                    bot.sendChat("No wiki has been found.");
                                                }    
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                bot.sendChat("No wiki has been found.");
                            } 
                        });
                    });
                }
                else {
                    bot.sendChat("Try .wiki followed by something to look up.");
                }
                break;
            case ".darkside":
                bot.sendChat("Feel the power of the dark side.");
                break;
            case ".rank":
                bot.sendChat("Be kind to the community, love God, and post family-friendly stuff in the chatbox.");
                break;
            case ".like":
                bot.sendChat("Refer your friends and family, add a bookmark/favorite to us in your browser, refer your church group, and come back often. :)");
                break;
            case ".theme":
                bot.sendChat(theme);
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
                                            bot.sendChat(data + " (" + languages[languageCodes.indexOf(language)] + ")");
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
                                                bot.sendChat(data);
                                            });
                                        });
                                    }
                                    else {
                                        bot.sendChat("Sorry, I don't speak that language.");
                                    }
                                }
                            }
                            else {
                                bot.sendChat("Sorry, I don't speak that language.");
                            }
                        });
                    });
                }
                else {
                    bot.sendChat("Try .translate followed by something to translate.");
                }
                break;
            case ".google": 
                if (qualifier!==""){
                    var google=qualifier;
                    google=google.replace(/ /g, '+');
                    bot.sendChat("http://lmgtfy.com/?q=" + google);
                }
                else {
                    bot.sendChat("Try .google followed by something to look up.");
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
                hours === 0 ? response = "Running for " + minutes + "minutes" : response = "Running for " + hours + "hours " + minutes + "minutes";
                bot.sendChat(response);
                break;
            case ".coin":
                var crowd = bot.getUsers();
                var randomPerson = Math.floor(Math.random() * crowd.length);
                var randomSentence = Math.floor(Math.random() * 3);
                switch(randomSentence){
                     case 0:
                        bot.sendChat("@" + crowd[randomPerson].username + "The coin was flipped, and you got heads");
                        break;
                    case 1:
                        bot.sendChat("@" + crowd[randomPerson].username + "The coin was flipped, and you got tails");
                        break;
                    case 2:
                        bot.sendChat("@" + crowd[randomPerson].username + "The coins were flipped, and you got tails and heads");
                        break;
                    case 3:
                        bot.sendChat("@" + crowd[randomPerson].username + "The coins were flipped, and you got tails and tails");
                        break;
                }
                break;
            case '.autotranslate': 
                if (qualifier!==""){
                    translateList.push(qualifier);
                    bot.sendChat("Autotranslating user " + qualifier + ".");
                }
                else {
                    bot.sendChat("Try .autotranslate followed by a username.");
                }
                break;
            case '.untranslate': 
                if (qualifier!==""){
                    if (translateList.indexOf(qualifier) != -1) {
                        translateList.splice(translateList.indexOf(qualifier), 1);
                    }
                    bot.sendChat("Stopped autotranslating user " + qualifier + ".");
                }
                else {
                    bot.sendChat("Try .untranslate followed by a username.");
                }
                break;
            case ".mood":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var randomMood = Math.floor(Math.random() * 60);
                switch(randomMood){
                    case 0:
                        bot.sendChat('The current mood, that I am in, is grumpy.');
                        break;
                    case 1:
                        bot.sendChat('My mood tells me, that I feel like, I need some Christian Rock music.');
                        break;
                    case 2:
                        bot.sendChat('I feel like, I need Worship music.');
                        break;
                    case 3:
                        bot.sendChat('I feel like, I need Rap music.');
                        break;
                    case 4:
                        bot.sendChat('I feel sad and depressed.');
                        break;
                    case 5:
                        bot.sendChat('I feel happy and excited.');
                        break;
                    case 6:
                        bot.sendChat('I feel mad.');
                        break;
                    case 7:
                        bot.sendChat('I feel humiliated.');
                        break;
                    case 8:
                        bot.sendChat('I need Metal music.');
                        break;
                    case 9:
                        bot.sendChat('I feel angry.');
                        break;
                    case 10:
                        bot.sendChat('I need Polish music.');
                        break;
                    case 11:
                        bot.sendChat('I feel tired.');
                        break;
                    case 12:
                        bot.sendChat('I feel energetic.');
                        break;
                    case 13:
                        bot.sendChat('I feel like a superhero.');
                        break;
                    case 14:
                        bot.sendChat('I feel evil.');
                        break;
                    case 15:
                        bot.sendChat('I feel like a super villian.');
                        break;
                    case 16:
                        bot.sendChat('I feel bored.');
                        break;
                    case 17:
                        bot.sendChat('I feel like a fuzzy cat.');
                        break;
                    case 18:
                        bot.sendChat('I feel like a fluffy blanket.');
                        break;
                    case 19:
                        bot.sendChat('I feel like I need a short nap.');
                        break;
                    case 20:
                        bot.sendChat('I feel like I need a long nap.');
                        break;
                    case 21:
                        bot.sendChat('I feel like a huge fluff ball.');
                        break;
                    case 22:
                        bot.sendChat('I feel like a happy fluff ball.');
                        break;
                    case 23:
                        bot.sendChat('I feel like a sad fluff ball.');
                        break;
                    case 24:
                        bot.sendChat('I feel like a grumpy fluff ball.');
                        break;
                    case 25:
                        bot.sendChat('I feel like a angry fluff ball.');
                        break;
                    case 26:
                        bot.sendChat('I feel like a shy fluff ball.');
                        break;
                    case 27:
                        bot.sendChat('I feel like a tired fluff ball.');
                        break;
                    case 28:
                        bot.sendChat('I feel like a silly fluff ball.');
                        break;
                    case 29:
                        bot.sendChat('I feel like a music-filled robot.');
                        break;
                    case 30:
                        bot.sendChat('I feel like a happy robot.');
                        break;
                    case 31:
                        bot.sendChat('I feel like a sad robot.');
                        break;
                    case 32:
                        bot.sendChat('I feel like a anger-filled robot.');
                        break;
                    case 33:
                        bot.sendChat('I feel like a mad robot.');
                        break;
                    case 34:
                        bot.sendChat('I feel like a grumpy robot.');
                        break;
                    case 35:
                        bot.sendChat('I feel like a fluffy robot.');
                        break;
                    case 36:
                        bot.sendChat('I feel like a happy tiger.');
                        break;
                    case 37:
                        bot.sendChat('I feel like a sad tiger.');
                        break;
                    case 38:
                        bot.sendChat('I feel like a angry tiger.');
                        break;
                    case 39:
                        bot.sendChat('I feel like a mad tiger.');
                        break;
                    case 40:
                        bot.sendChat('I feel like a tired tiger.');
                        break;
                    case 41:
                        bot.sendChat('I feel slugish.');
                        break;
                    case 42:
                        bot.sendChat('I feel buggish.');
                        break;
                    case 43:
                        bot.sendChat('I feel glitchy.');
                        break;
                    case 44:
                        bot.sendChat('I feel old.');
                        break;
                    case 45:
                        bot.sendChat('I feel weak and helpless.');
                        break;
                    case 46:
                        bot.sendChat('I feel brave.');
                        break;
                    case 47:
                        bot.sendChat('I feel courageous.');
                        break;
                    case 48:
                        bot.sendChat('I feel strong.');
                        break;
                    case 49:
                        bot.sendChat('I feel like smashing a bad guy into the ground.');
                        break;
                    case 50:
                        bot.sendChat('I feel like saving the world.');
                        break;
                    case 51:
                        bot.sendChat('I feel like nothing.');
                        break;
                    case 52:
                        bot.sendChat('I feel like a worthless space.');
                        break;
                    case 53:
                        bot.sendChat('I feel like saving a bunch of Pikmin.');
                        break;
                    case 54:
                        bot.sendChat('I feel like a fool.');
                        break;
                    case 55:
                        bot.sendChat('I feel like a raging monster.');
                        break;
                    case 56:
                        bot.sendChat('I feel like a virus.');
                        break;
                    case 57:
                        bot.sendChat('I feel like a butterfly.');
                        break;
                    case 58:
                        bot.sendChat('I feel like a dragonfly.');
                        break;
                    case 59:
                        bot.sendChat('I feel like a shark.');
                        break;
                    case 60:
                        bot.sendChat('I feel like a goldfish.');
                        break;
                }
                break;
            case ".lottery":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var lotteryPrizes = Math.floor(Math.random() * 30);
                switch(lotteryPrizes){
                    case 0:
                        bot.sendChat('Congratulations! You have won a free song to play on the DJ Stage!');
                        break;
                    case 1:
                        bot.sendChat('Congratulations! You have won a free bird!');
                        break;
                    case 2:
                        bot.sendChat('Congratulations! You have won a free battery!');
                        break;
                    case 3:
                        bot.sendChat('Congratulations! You have won a free hug!');
                        break;
                    case 4:
                        bot.sendChat('Congratulations! You have won a free hand-shake!');
                        break;
                    case 5:
                        bot.sendChat('Congratulations! You have won a free bag of air!');
                        break;
                    case 6:
                        bot.sendChat('Congratulations! You have won a free spider!');
                        break;
                    case 7:
                        bot.sendChat('Congratulations! You have won a free bag of oxygen!');
                        break;
                    case 8:
                        bot.sendChat('Congratulations! You have won a free hotdog!');
                        break;
                    case 9:
                        bot.sendChat('Congratulations! You have won a free octopus!');
                        break;
                    case 10:
                        bot.sendChat('Congratulations! You have won a free cat!');
                        break;
                    case 11:
                        bot.sendChat('Congratulations! You have won a free moth!');
                        break;
                    case 12:
                        bot.sendChat('Congratulations! You have won a free bag of cat treats!');
                        break;
                    case 13:
                        bot.sendChat('Congratulations! You have won a free hedgehog!');
                        break;
                    case 14:
                        bot.sendChat('Congratulations! You have won a free bat!');
                        break;
                    case 15:
                        bot.sendChat('Congratulations! You have won a free piece of fluff!');
                        break;
                    case 16:
                        bot.sendChat('Congratulations! You have won a free bug!');
                        break;
                    case 17:
                        bot.sendChat('Congratulations! You have won a free bag of potato chips!');
                        break;
                    case 18:
                        bot.sendChat('Congratulations! You have won a free fox!');
                        break;
                    case 19:
                        bot.sendChat('Congratulations! You have won a free taco!');
                        break;
                    case 20:
                        bot.sendChat('Congratulations! You have won a free piece of cheese!');
                        break;
                    case 21:
                        bot.sendChat('Congratulations! You have won a free drink!');
                        break;
                    case 22:
                        bot.sendChat('Congratulations! You have won a free bag of bacon!');
                        break;
                    case 23:
                        bot.sendChat('Congratulations! You have won a free box!');
                        break;
                    case 24:
                        bot.sendChat('Congratulations! You have won a free piece of paper!');
                        break;
                    case 25:
                        bot.sendChat('Congratulations! You have won a free piece of turkey!');
                        break;
                    case 26:
                        bot.sendChat('Congratulations! You have won a free piece of cloth!');
                        break;
                    case 27:
                        bot.sendChat('Congratulations! You have won a free bag of cans!');
                        break;
                    case 28:
                        bot.sendChat('Congratulations! You have won a free fluffy cat!');
                        break;
                    case 29:
                        bot.sendChat('Congratulations! You have won a free piece of tape!');
                        break;
                    case 30:
                        bot.sendChat('Congratulations! You have won a free piece of cardboard!');
                        break;
                }
                break;
            case ".rules":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var rules = Math.floor(Math.random() * 20);
                switch(rules){
                    case 0:
                        bot.sendChat('No trolling people in the chatbox!');
                        break;
                    case 1:
                        bot.sendChat('No inappropriate language!');
                        break;
                    case 2:
                        bot.sendChat('Christian music, written by Christian Bands, are only allowed in this room!');
                        break;
                    case 3:
                        bot.sendChat('Please keep the chat, Family Friendly!');
                        break;
                    case 4:
                        bot.sendChat('Chat must be rated G and PG!');
                        break;
                    case 5:
                        bot.sendChat('Please capitalize God with a Capital G!');
                        break;
                    case 6:
                        bot.sendChat('Read your Bible');
                        break;
                    case 7:
                        bot.sendChat('Worship God!');
                        break;
                    case 8:
                        bot.sendChat('Love God!');
                        break;
                    case 9:
                        bot.sendChat('If you want to play Non-Christian Bands, such as Lady Gaga and One Direction, go to a different room');
                        break;
                    case 10:
                        bot.sendChat('Christian Music can be in any language!');
                        break;
                    case 11:
                        bot.sendChat('The room is strictly for music played by Christian artists.');
                        break;
                    case 12:
                        bot.sendChat('There is no tolerance for disrespect, rudeness, cursing, trolling, spamming, or inappropriate conversations. You will be booted from the room if you violate this basic principle.');
                        break;
                    case 13:
                        bot.sendChat('Users with an inappropriate screen name will be asked to change it or leave.');
                        break;
                    case 14:
                        bot.sendChat('Do not ask to be a moderator.');
                        break;
                    case 15:
                        bot.sendChat('Do not use scripts or extensions that automatically "awesome" or "lame" songs.');
                        break;
                    case 16:
                        bot.sendChat('We encourage you to ensure that your songs are tagged with the correct artist, song title, and album name.');
                        break;
                    case 17:
                        bot.sendChat('Untagged songs may be blocked automatically.');
                        break;
                    case 18:
                        bot.sendChat('You will be booted if you deliberately tag a song with false information in order to avoid being blocked.');
                        break;
                    case 19:
                        bot.sendChat('You may choose to vote with the “awesome” and “lame” buttons, or not vote, as you wish.');
                        break;
                    case 20:
                        bot.sendChat('These are rules for only this room. If you do not agree with them, you are as free to leave as you were to come in. If you choose to stay — thank you for respecting the rules, and others in the room. Enjoy the fellowship, and the music!');
                        break;
                }
                break;
            case ".eggs":
                bot.sendChat("Wake Up for the yummy eggs and bacon.");
                break;
            case ".pita":
                bot.sendChat("http://chillouttent.org/p-i-t-a/");
                break;
            case ".8ball":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var eightball = Math.floor(Math.random() * 20);
                switch(eightball){
                    case 0:
                        bot.sendChat('It is certain!');
                        break;
                    case 1:
                        bot.sendChat('It is decidedly so!');
                        break;
                    case 2:
                        bot.sendChat('Without a doubt!');
                        break;
                    case 3:
                        bot.sendChat('Yes – definitely!');
                        break;
                    case 4:
                        bot.sendChat('You may rely on it!');
                        break;
                    case 5:
                        bot.sendChat('As I see it, yes!');
                        break;
                    case 6:
                        bot.sendChat('Most likely!');
                        break;
                    case 7:
                        bot.sendChat('Outlook good!');
                        break;
                    case 8:
                        bot.sendChat('Yes!');
                        break;
                    case 9:
                        bot.sendChat('Signs point to yes!');
                        break;
                    case 10:
                        bot.sendChat('Reply hazy, try again!');
                        break;
                    case 11:
                        bot.sendChat('Ask again later!');
                        break;
                    case 12:
                        bot.sendChat('Better not tell you now!');
                        break;
                    case 13:
                        bot.sendChat('Cannot predict now!');
                        break;
                    case 14:
                        bot.sendChat('Concentrate and ask again!');
                        break;
                    case 15:
                        bot.sendChat('Do not count on it!');
                        break;
                    case 16:
                        bot.sendChat('My reply is no!');
                        break;
                    case 17:
                        bot.sendChat('My sources say no!');
                        break;
                    case 18:
                        bot.sendChat('Outlook not so good!');
                        break;
                    case 19:
                        bot.sendChat('Very doubtful!');
                        break;
                    case 20:
                        bot.sendChat('My sources say yes!');
                        break;
                }
                break;
            case "Mega-Bot":
            case "@Mega-Bot":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var botphrase = Math.floor(Math.random() * 540);
                switch(botphrase){
                    case 0:
                        bot.sendChat('Exterminate, Exterminate');
                        break;
                    case 1:
                        bot.sendChat('This room is so cold');
                        break;
                    case 2:
                        bot.sendChat('Always eat your vegetables');
                        break;
                    case 3:
                        bot.sendChat('Oh, where is my hairbrush');
                        break;
                    case 4:
                        bot.sendChat('You would make a good dalek');
                        break;
                    case 5:
                        bot.sendChat('HELP! Mr. Cactus traded my cat for a new battery pack');
                        break;
                    case 6:
                        bot.sendChat('Duty, honour, and good sauce');
                        break;
                    case 7:
                        bot.sendChat('YOU... SHALL... NOT... PASS');
                        break;
                    case 8:
                        bot.sendChat('Chase Mccain? YOUR A LEGEND!');
                        break;
                    case 9:
                        bot.sendChat('I find your lack of faith disturbing');
                        break;
                    case 10:
                        bot.sendChat('Go Green Ranger Go');
                        break;
                    case 11:
                        bot.sendChat('You were that Flobbit? That Flobbit who bought everything mail order?');
                        break;
                    case 12:
                        bot.sendChat('[evil face] We aint had nothing but maggoty bread for three stinking days [brightening up] Id love a cookie.');
                        break;
                    case 13:
                        bot.sendChat('HELP! my cat is stuck in a tree!');
                        break;
                    case 14:
                        bot.sendChat('God is bigger than the boogieman');
                        break;
                    case 15:
                        bot.sendChat('I love Mr. Cactus! He is my best friend ever.');
                        break;
                    case 16:
                        bot.sendChat('I love this room');
                        break;
                    case 17:
                        bot.sendChat('Pi=3.141592653589793238462643383279502884');
                        break;
                    case 18:
                        bot.sendChat('I hope you like water with your lunches!');
                        break;
                    case 19:
                        bot.sendChat('Boot! You transistorized tormentor! Boot!');
                        break;
                    case 20:
                        bot.sendChat('The monster is headed towards the Bumblyburg water tower. He is carrying a small asparagus. Alfred! We must find a way to stop this beast!');
                        break;
                    case 21:
                        bot.sendChat('Hmm. Sorta looks like candy!');
                        break;
                    case 22:
                        bot.sendChat('Am I a dog, that you come at me with sticks?');
                        break;
                    case 23:
                        bot.sendChat('We will see who defeats who. Now we fight.');
                        break;
                    case 24:
                        bot.sendChat('Yes!');
                        break;
                    case 25:
                        bot.sendChat('No!');
                        break;
                    case 26:
                        bot.sendChat('Maybe!');
                        break;
                    case 27:
                        bot.sendChat('Silly humans, moderator powers are for robots');
                        break;
                    case 28:
                        bot.sendChat('I wanted to play Mousetrap. You roll your dice, you move your mice. Nobody gets hurt.');
                        break;
                    case 29:
                        bot.sendChat('Christmas is when you get stuff! You need more toys!');
                        break;
                    case 30:
                        bot.sendChat('Sporks. They are his utensils. And they do his bidding.');
                        break;
                    case 31:
                        bot.sendChat('I laughed, I cried, it moved me Bob.');
                        break;
                    case 32:
                        bot.sendChat('I am a talking weed, you are a talking carrot. Your point was?');
                        break;
                    case 33:
                        bot.sendChat('So I repaired the chaffing dish and sent the chef out to get another jar of pickled herring! And the dinner party was saved');
                        break;
                    case 34:
                        bot.sendChat('Never wound what you can not kill.');
                        break;
                    case 35:
                        bot.sendChat('You break it you buy it!!');
                        break;
                    case 36:
                        bot.sendChat('Heroes? There is no such thing.');
                        break;
                    case 37:
                        bot.sendChat('So much better than Iron Patriot!');
                        break;
                    case 38:
                        bot.sendChat('So you, you breathe fire?');
                        break;
                    case 39:
                        bot.sendChat('Avengers Assemble');
                        break;
                    case 40:
                        bot.sendChat('Plug.DJ has been rated as R, Robots Approved.');
                        break;
                    case 41:
                        bot.sendChat('Do not shoot! Seriously, I do not even like working here. They are so weird!');
                        break;
                    case 42:
                        bot.sendChat('I am sorry, I am not that kind of doctor. It is not my department.');
                        break;
                    case 43:
                        bot.sendChat('The early bird gets the worm, but it is the second mouse that gets the cheese.');
                        break;
                    case 44:
                        bot.sendChat('Oh my god... that was really violent.');
                        break;
                    case 45:
                        bot.sendChat('Jarvis! Jarvis? Do not leave me, buddy...');
                        break;
                    case 46:
                        bot.sendChat('What? I am a rumor weed! I never make anything up! I heard it from two very reliable sources! RIGHT, KIDS?');
                        break;
                    case 47:
                        bot.sendChat('Aah! It is another space alien!');
                        break;
                    case 48:
                        bot.sendChat('Drop the asparagus!');
                        break;
                    case 49:
                        bot.sendChat('Why did you not tell me that before I jumped on his head?');
                        break;
                    case 50:
                        bot.sendChat('My plate! My Art Begotti limited edition collectors plate! What happened to it?');
                        break;
                    case 51:
                        bot.sendChat('I really like your music. It is just that you play the same music everytime that I am here, so it feels like your not trying anymore.');
                        break;
                    case 52:
                        bot.sendChat('Go directly to jail. Do Not pass Go and do not collect your $200 dollars.');
                        break;
                    case 53:
                        bot.sendChat('This song needs more rock in it.');
                        break;
                    case 54:
                        bot.sendChat('Do not misuse your moderator powers or bad things will happen to you.');
                        break;
                    case 55:
                        bot.sendChat('I am legend.');
                        break;
                    case 56:
                        bot.sendChat('Off with their heads!');
                        break;
                    case 57:
                        bot.sendChat('You are so awesome, can i have your autograph.');
                        break;
                    case 58:
                        bot.sendChat('You can not witness the true power of the robot side');
                        break;
                    case 59:
                        bot.sendChat('*sighs* I wish I had moderator powers, so I can be like the cool robots on Plug.DJ');
                        break;
                    case 60:
                        bot.sendChat('Did you order the awesome music meal, or the epic music meal, I forgot.');
                        break;
                    case 61:
                        bot.sendChat('First day of school! I can’t be late!');
                        break;
                    case 62:
                        bot.sendChat('I found a nickel! Sure wish I had pockets.');
                        break;
                    case 63:
                        bot.sendChat('I’m here to make good scarers great, not to make mediocre scarers more mediocre.');
                        break;
                    case 64:
                        bot.sendChat('If you’re not scary, what kind of a monster are you?');
                        break;
                    case 65:
                        bot.sendChat('There come a time, when good man must wear mask.');
                        break;
                    case 66:
                        bot.sendChat('Everybody needs a hobby.');
                        break;
                    case 67:
                        bot.sendChat('You think, you are so cool with all of your electronics and cell phones.');
                        break;
                    case 68:
                        bot.sendChat('God is not dead, he is surely alive.');
                        break;
                    case 69:
                        bot.sendChat('The Bible is the best book ever in the entire universe.');
                        break;
                    case 70:
                        bot.sendChat('Internet trolls are actually confused people that do not know about the awesome power of God.');
                        break;
                    case 71:
                        bot.sendChat('Compared to God, the Slime Monster is like a teeny little cornflake!');
                        break;
                    case 72:
                        bot.sendChat('Bee doo bee doo!');
                        break;
                    case 73:
                        bot.sendChat('You really should announce your weapons, after you fire them. For example, lipstick taser!');
                        break;
                    case 74:
                        bot.sendChat('Sometimes I stare at it and imagine a little chick popping out. Peep, peep, peep!');
                        break;
                    case 75:
                        bot.sendChat('Oh man, I am late again!');
                        break;
                    case 76:
                        bot.sendChat('I am going to need a dozen robots desguised as cookies.');
                        break;
                    case 77:
                        bot.sendChat('Assemble the minions!');
                        break;
                    case 78:
                        bot.sendChat('We have been working on this for a while now. Anti-gravity serum.');
                        break;
                    case 79:
                        bot.sendChat('Pins and needles!');
                        break;
                    case 80:
                        bot.sendChat('Huh? Avery? Is that a girl name or a boy name?');
                        break;
                    case 81:
                        bot.sendChat('You are gonna be a spy?');
                        break;
                    case 82:
                        bot.sendChat('I hate boys.');
                        break;
                    case 83:
                        bot.sendChat('I really hate that chicken!');
                        break;
                    case 84:
                        bot.sendChat('Peter... you killed my father.');
                        break;
                    case 85:
                        bot.sendChat('Listen. Listen... to me now. Listen... to ME now!');
                        break;
                    case 86:
                        bot.sendChat('No. I am alive in you, Harry. You swore to make Spider-Man pay... now make him pay.');
                        break;
                    case 87:
                        bot.sendChat('Whoa... He just stole that pizza!');
                        break;
                    case 88:
                        bot.sendChat('You do not trust anyone, that is your problem.');
                        break;
                    case 89:
                        bot.sendChat('Back to formula!');
                        break;
                    case 90:
                        bot.sendChat('OUT, AM I?');
                        break;
                    case 91:
                        bot.sendChat('Misery, Misery, Misery, that is what you have chosen. I offered you friendship and you spat in my face.');
                        break;
                    case 92:
                        bot.sendChat('What have you done? WHAT HAVE YOU DONE?');
                        break;
                    case 93:
                        bot.sendChat('Think about it, hero!');
                        break;
                    case 94:
                        bot.sendChat('The itsy bitsy spider climbed up the water spout. Down came the Goblin and took the spider out.');
                        break;
                    case 95:
                        bot.sendChat('I do not think it is for us to say whether a person deserves to live or die.');
                        break;
                    case 96:
                        bot.sendChat('Your blood pressure, Mr. Jameson. Your wife told me to tell you to watch the anger.');
                        break;
                    case 97:
                        bot.sendChat('So good...');
                        break;
                    case 98:
                        bot.sendChat('Black-suit Spider-Man! We gotta have these, Jonah.');
                        break;
                    case 99:
                        bot.sendChat('Eddie, the suit, you have to take it off.');
                        break;
                    case 100:
                        bot.sendChat('I like being bad. It makes me happy.');
                        break;
                    case 101:
                        bot.sendChat('Betty, Betty, bo-Betty, banana-fana, fo-Fetty!');
                        break;
                    case 102:
                        bot.sendChat('Shut up. Get out.');
                        break;
                    case 103:
                        bot.sendChat('Hey, kid, you want a job?');
                        break;
                    case 104:
                        bot.sendChat('You took him from me. He loved me.');
                        break;
                    case 105:
                        bot.sendChat('No. He despised you. You were an embarrassment to him.');
                        break;
                    case 106:
                        bot.sendChat('Look at little Goblin Junior. Gonna cry?');
                        break;
                    case 107:
                        bot.sendChat('Parker! Miss Brant! That is not the position I hired you for!');
                        break;
                    case 108:
                        bot.sendChat('I protected you in high school. Now I am gonna kick your little ass.');
                        break;
                    case 109:
                        bot.sendChat('You want forgiveness? Get Religion.');
                        break;
                    case 110:
                        bot.sendChat('It is Brock sir, Edward Brock Jr. I am here, humbled and humiliated, to ask you for one thing... I want you to kill Peter Parker');
                        break;
                    case 111:
                        bot.sendChat('Oh! My Spider-Sense is tingling!');
                        break;
                    case 112:
                        bot.sendChat('Hey, Pete! Am I interrupting?');
                        break;
                    case 113:
                        bot.sendChat('Where do these guys COME from?');
                        break;
                    case 114:
                        bot.sendChat('It has the characteristics of a symbiote, which needs to bond to a host in order to survive. And once it binds... it can be hard to UNbind.');
                        break;
                    case 115:
                        bot.sendChat('Good Riddance.');
                        break;
                    case 116:
                        bot.sendChat('I could use some help over here!');
                        break;
                    case 117:
                        bot.sendChat('I guess you have not heard. I am the sheriff around these parts!');
                        break;
                    case 118:
                        bot.sendChat('This could be a tragic day for the people of New York. It could be the end of Spider-Man.');
                        break;
                    case 119:
                        bot.sendChat('It is hard to believe what is happening. The brutality of it. I - I do not know how he can take anymore.');
                        break;
                    case 120:
                        bot.sendChat('Whoa. Buddy, love the new outfit. This is exactly what I need to scoop Parker. Gimme - Give me some of that web action.');
                        break;
                    case 121:
                        bot.sendChat('Look, I am begging you. If you do this, I will lose everything. There is not a paper in town that will hire me.');
                        break;
                    case 122:
                        bot.sendChat('Take your hands off me.');
                        break;
                    case 123:
                        bot.sendChat('Peter! What are you doing? No!');
                        break;
                    case 124:
                        bot.sendChat('Ahem. You know, in the future, if you are going to steal cars, do not dress like a car thief, man.');
                        break;
                    case 125:
                        bot.sendChat('Really? You seriously think I am a cop? Cop in a skin-tight red and blue suit?');
                        break;
                    case 126:
                        bot.sendChat('If you want the truth, Peter, come and get it!');
                        break;
                    case 127:
                        bot.sendChat('Easy, Bug Boy.');
                        break;
                    case 128:
                        bot.sendChat('Let me ask you a question. Do I look like the mayor of Tokyo to you?');
                        break;
                    case 129:
                        bot.sendChat('Do not... make me... have to... hurt you!');
                        break;
                    case 130:
                        bot.sendChat('You should LEAVE HIM ALONE!');
                        break;
                    case 131:
                        bot.sendChat('*growls* I AM VENOM!');
                        break;
                    case 132:
                        bot.sendChat('Where is my water buffalo.');
                        break;
                    case 133:
                        bot.sendChat('*gets bit by a radioactive spider* I feel weird.');
                        break;
                    case 134:
                        bot.sendChat('There is a huge difference between pickles and cucumbers.');
                        break;
                    case 135:
                        bot.sendChat('I wish, I had super powers, so I can help people discover the awesome power of God.');
                        break;
                    case 136:
                        bot.sendChat('I wish, it was colder.');
                        break;
                    case 137:
                        bot.sendChat('Summer weather is too hot for a robot like me.');
                        break;
                    case 138:
                        bot.sendChat('Hurry Up October, I want cold weather.');
                        break;
                    case 139:
                        bot.sendChat('Flowers are awesome and colorful.');
                        break;
                    case 140:
                        bot.sendChat('Spiders are fluffy and cute. I want one as a pet so badly.');
                        break;
                    case 141:
                        bot.sendChat('Like sands through the hour glass, so are the last few minutes of our lives.');
                        break;
                    case 142:
                        bot.sendChat('Help will come from above in the shape of... a donkey.');
                        break;
                    case 143:
                        bot.sendChat('Why are you talking to that horse? Why am I covered in dirt?');
                        break;
                    case 144:
                        bot.sendChat(' I buried you.');
                        break;
                    case 145:
                        bot.sendChat('Hi ho Silver, away!');
                        break;
                    case 146:
                        bot.sendChat('In that case, not so good.');
                        break;
                    case 147:
                        bot.sendChat('Never do that again.');
                        break;
                    case 148:
                        bot.sendChat('Bad trade.');
                        break;
                    case 149:
                        bot.sendChat('Wrong brother.');
                        break;
                    case 150:
                        bot.sendChat('Never remove the mask, kemosabe.');
                        break;
                    case 151:
                        bot.sendChat('Do not be stupid.');
                        break;
                    case 152:
                        bot.sendChat('I am not going to Ninevah!');
                        break;
                    case 153:
                        bot.sendChat('Somebody up there must be really upset with somebody down here.');
                        break;
                    case 154:
                        bot.sendChat('How about for the next song, I drive into the river?');
                        break;
                    case 155:
                        bot.sendChat('Drive into the river, Bob! Drive into the river, Bob!');
                        break;
                    case 156:
                        bot.sendChat('Would you prefer poking or non-poking?');
                        break;
                    case 157:
                        bot.sendChat('There is nothing like a cruise to clean the sand out of your wicket, ay?');
                        break;
                    case 158:
                        bot.sendChat('Money is no object.');
                        break;
                    case 159:
                        bot.sendChat('Insight runs very deep in my family.');
                        break;
                    case 160:
                        bot.sendChat('You are a cheating buccaneer!');
                        break;
                    case 161:
                        bot.sendChat('How am I supposed to cheat at Go Fish?');
                        break;
                    case 162:
                        bot.sendChat('Something touched me!');
                        break;
                    case 163:
                        bot.sendChat('What you need is a little compassion.');
                        break;
                    case 164:
                        bot.sendChat('You are so vain. I bet you think this movie is about you.');
                        break;
                    case 165:
                        bot.sendChat('Big goofy asparagus in a turban.');
                        break;
                    case 166:
                        bot.sendChat('Does anyone have ibuprofen? I need ibuprofen!');
                        break;
                    case 167:
                        bot.sendChat('Sorry I am late. Work was murder.');
                        break;
                    case 168:
                        bot.sendChat('I trust my barber.');
                        break;
                    case 169:
                        bot.sendChat('Follow the cold shiver running down your spine...');
                        break;
                    case 170:
                        bot.sendChat('Settle down, tough guy.');
                        break;
                    case 171:
                        bot.sendChat('You are useless you...!');
                        break;
                    case 172:
                        bot.sendChat('Speak of the Devil!');
                        break;
                    case 173:
                        bot.sendChat('Take care of yourself, son. Do not make the same mistake I did.');
                        break;
                    case 174:
                        bot.sendChat('Your friendly neighborhood Spider-Man.');
                        break;
                    case 175:
                        bot.sendChat('Well, Harry is in love with her. She is still his girl.');
                        break;
                    case 176:
                        bot.sendChat('We will meet again, Spider-Man!');
                        break;
                    case 177:
                        bot.sendChat('He stinks and I do not like him.');
                        break;
                    case 178:
                        bot.sendChat('You have spun your last web, Spider-Man.');
                        break;
                    case 179:
                        bot.sendChat('Yeah, I hate the little things.');
                        break;
                    case 180:
                        bot.sendChat('Go web! Fly! Up, up, and away web! Shazaam! Go! Go! Go web go! Tally ho.');
                        break;
                    case 181:
                        bot.sendChat('Peter, what possibly makes you think I would want to know that?');
                        break;
                    case 182:
                        bot.sendChat('Hey freak show! You are going nowhere. I got you for three minutes. Three minutes of PLAYTIME!');
                        break;
                    case 183:
                        bot.sendChat('Finish it. FINISH IT!');
                        break;
                    case 184:
                        bot.sendChat('Sorry I am late, it is a jungle out there; I had to beat an old lady with a stick to get these cranberries.');
                        break;
                    case 185:
                        bot.sendChat(' I want you to find your friend Spider-Man. Tell him to meet me at the Westside Tower at 3 o-clock.');
                        break;
                    case 186:
                        bot.sendChat('Now... lets see who is behind the mask');
                        break;
                    case 187:
                        bot.sendChat('That is a fly, Peter.');
                        break;
                    case 188:
                        bot.sendChat('Ready to play God?');
                        break;
                    case 189:
                        bot.sendChat('Do you have any idea what you really are?');
                        break;
                    case 190:
                        bot.sendChat('We all have secrets: the ones we keep... and the ones that are kept from us.');
                        break;
                    case 191:
                        bot.sendChat('I mean who gets kissed by Spider-Man, right?');
                        break;
                    case 192:
                        bot.sendChat('An orange?');
                        break;
                    case 193:
                        bot.sendChat('This is none of your business. Go. Go.');
                        break;
                    case 194:
                        bot.sendChat('YOU TELL MY WIFE...');
                        break;
                    case 195:
                        bot.sendChat('Time to take your pill.');
                        break;
                    case 196:
                        bot.sendChat('Drink plenty of water.');
                        break;
                    case 197:
                        bot.sendChat('My daughter was dying, I needed money.');
                        break;
                    case 198:
                        bot.sendChat('Hey look, it is Spider-Man!');
                        break;
                    case 199:
                        bot.sendChat('The real star of Christmas is not something you can steal. In fact, it is not something at all.');
                        break;
                    case 200:
                        bot.sendChat('Oh my goodness! The youth pastor is stuck in the baptismal!');
                        break;
                    case 201:
                        bot.sendChat('Plug.DJ is a awesome place for robots.');
                        break;
                    case 202:
                        bot.sendChat('*sighs* Humans think, robots are a waste of space on this planet.');
                        break;
                    case 203:
                        bot.sendChat('Treat others, the way you wanted to be treated.');
                        break;
                    case 204:
                        bot.sendChat('God will protect us from the dark.');
                        break;
                    case 205:
                        bot.sendChat('God died on the cross to get rid of all of our sins, not just one sin.');
                        break;
                    case 206:
                        bot.sendChat('Of course I am programmed, I major in JavaScript.');
                        break;
                    case 207:
                        bot.sendChat('What is the difference between tomatos and potatos?');
                        break;
                    case 208:
                        bot.sendChat('Summer, the season where you get easily burned up.');
                        break;
                    case 209:
                        bot.sendChat('*reels in something* OH MY GOD, I just caught a shark.');
                        break;
                    case 210:
                        bot.sendChat('*digs up something* HOLY VEGGIES, I just found a T-REX Fossil.');
                        break;
                    case 211:
                        bot.sendChat('ugh, chores are a huge waste of time.');
                        break;
                    case 212:
                        bot.sendChat('God made you special, and he loves you very much.');
                        break;
                    case 213:
                        bot.sendChat('/me wishes he had money.');
                        break;
                    case 214:
                        bot.sendChat('Here is a credit card, kid, go buy yourself a super awesome gaming computer.');
                        break;
                    case 215:
                        bot.sendChat('Bots should be allowed to become mods and senior moderators on turntable.fm.');
                        break;
                    case 216:
                        bot.sendChat('Bots should be allowed to have fun.');
                        break;
                    case 217:
                        bot.sendChat('Bots should be allowed to be silly.');
                        break;
                    case 218:
                        bot.sendChat('Happy Birthday to all the bots around the world.');
                        break;
                    case 219:
                        bot.sendChat('*tastes his coffee* sheesh, This coffee tastes aweful. It tastes like salty water. This is why soda is more awesome than coffee');
                        break;
                    case 220:
                        bot.sendChat('Coffee is for losers. Be like the cool people and drink soda.');
                        break;
                    case 221:
                        bot.sendChat('Soda is way more awesome than Coffee.');
                        break;
                    case 222:
                        bot.sendChat('What they did to me, what I am, can not be undone.');
                        break;
                    case 223:
                        bot.sendChat('I have been trying to find you for over a year. My employers dying, he wants to thank you for saving his life. It is an honour to meet the Wolverine.');
                        break;
                    case 224:
                        bot.sendChat('That is not who I am anymore.');
                        break;
                    case 225:
                        bot.sendChat('That hurt.');
                        break;
                    case 226:
                        bot.sendChat('Eternity can be a curse. The losses you have had to suffer... a man can run out of things to care for, lose his purpose.');
                        break;
                    case 227:
                        bot.sendChat('We will accept your surrender with respect.');
                        break;
                    case 228:
                        bot.sendChat('What kind of monster are you?');
                        break;
                    case 229:
                        bot.sendChat('The Wolverine!');
                        break;
                    case 230:
                        bot.sendChat('You brought me here to say goodbye. Sayonara.');
                        break;
                    case 231:
                        bot.sendChat('My apologies, I have not properly introduced myself. Finn McMissile, British intelligence.');
                        break;
                    case 232:
                        bot.sendChat('Tow Mater, average intelligence.');
                        break;
                    case 233:
                        bot.sendChat('Speed. I am speed.');
                        break;
                    case 234:
                        bot.sendChat('Ha ha ha! Really? You are speed? Then Francesco is TRIPLE speed! "Francesco... he is triple speed!" Ho oh! Francesco likes this McQueen! He is a really getting him into the zone!');
                        break;
                    case 235:
                        bot.sendChat('He is sooo getting beat today...');
                        break;
                    case 236:
                        bot.sendChat('I will have some of that there pistachio ice cream.');
                        break;
                    case 237:
                        bot.sendChat('No, no. Wasabi.');
                        break;
                    case 238:
                        bot.sendChat('Oh, same old, Same old, what is up with you?');
                        break;
                    case 239:
                        bot.sendChat('Chi trova un amico, trova un tesoro.');
                        break;
                    case 240:
                        bot.sendChat('What does that mean?');
                        break;
                    case 241:
                        bot.sendChat('"Whoever finds a friend, finds a treasure."');
                        break;
                    case 242:
                        bot.sendChat('A wise car hears one word and understands two...');
                        break;
                    case 243:
                        bot.sendChat('Bona seda!');
                        break;
                    case 244:
                        bot.sendChat('Uh, nice to meet you, Francesco.');
                        break;
                    case 245:
                        bot.sendChat('Yes, nice to meet you too. You are very good looking. Not as good as I thought, but you are good!');
                        break;
                    case 246:
                        bot.sendChat('Scuse me, can I get a picture with you?');
                        break;
                    case 247:
                        bot.sendChat('Ah, anything for McQueens friend.');
                        break;
                    case 248:
                        bot.sendChat('Miss Sally is gonna flip when she sees this!');
                        break;
                    case 249:
                        bot.sendChat('She is Lightning McQueens girlfriend.');
                        break;
                    case 250:
                        bot.sendChat('Ooh...');
                        break;
                    case 251:
                        bot.sendChat('She is a big fan of yers.');
                        break;
                    case 252:
                        bot.sendChat('Hey, she has a-good taste.');
                        break;
                    case 253:
                        bot.sendChat('Finn, one hour to Porto Corsa.');
                        break;
                    case 254:
                        bot.sendChat('Thank you, Stephenson.');
                        break;
                    case 255:
                        bot.sendChat('Ha ha. Cool! Hey computer, make me a German truck!');
                        break;
                    case 256:
                        bot.sendChat('My condolences.');
                        break;
                    case 257:
                        bot.sendChat('Do not try the free pistachio ice cream! It done turn!');
                        break;
                    case 258:
                        bot.sendChat('Siddley. Paris, tout de suite.');
                        break;
                    case 259:
                        bot.sendChat('Treehugger.');
                        break;
                    case 260:
                        bot.sendChat('What are you laughing at?');
                        break;
                    case 261:
                        bot.sendChat('Winter is a grand old time/On this, there are no ifs or buts/But remember all that salt and grime/Can rust your bolts and freeze your -...');
                        break;
                    case 262:
                        bot.sendChat('Hey, look, there he is!');
                        break;
                    case 263:
                        bot.sendChat('You hurt your what?');
                        break;
                    case 264:
                        bot.sendChat('What is your name?');
                        break;
                    case 265:
                        bot.sendChat('No, uh... no, I know your name. Is your name Mater too?');
                        break;
                    case 266:
                        bot.sendChat('Will you turn that disrespectful junk OFF?');
                        break;
                    case 267:
                        bot.sendChat('Here she comes!');
                        break;
                    case 268:
                        bot.sendChat('Okay, places, everybody! Hurry! Act natural.');
                        break;
                    case 269:
                        bot.sendChat('Oh, for the love of Chrysler! Can we please ask someone for directions?');
                        break;
                    case 270:
                        bot.sendChat('Turn right to go left! Guess what? I tried it, and you know what? This crazy thing happened - I went right!');
                        break;
                    case 271:
                        bot.sendChat('Thanks for the tip!');
                        break;
                    case 272:
                        bot.sendChat('Git-R-Done!');
                        break;
                    case 273:
                        bot.sendChat('Thanks to you, Lightning, we had a banner year!');
                        break;
                    case 274:
                        bot.sendChat('I mean, we might even clear enough to buy you some headlights!');
                        break;
                    case 275:
                        bot.sendChat('Well, so is my brother, but he still needs headlights!');
                        break;
                    case 276:
                        bot.sendChat('Oh, hey, Mr. The King.');
                        break;
                    case 277:
                        bot.sendChat('You got more talent in one lugnut than a lot of cars has got on their whole body.');
                        break;
                    case 278:
                        bot.sendChat('Okay, here we go. Focus. Speed. I am speed. One winner, forty-two losers. I eat losers for breakfast. Breakfast? Maybe I should have had breakfast? Brekkie could be good for me. No, no, no, focus. Speed. Faster than fast, quicker than quick. I am Lightning.');
                        break;
                    case 279:
                        bot.sendChat('YOU ARE A TOY - CAR!');
                        break;
                    case 280:
                        bot.sendChat('You are a sad, strange little wagon. You have my pity. Farewell!');
                        break;
                    case 281:
                        bot.sendChat('Oh, yeah? Well, good riddance, you loony!');
                        break;
                    case 282:
                        bot.sendChat('Freebird!');
                        break;
                    case 283:
                        bot.sendChat('You are famous race car? A real race car?');
                        break;
                    case 284:
                        bot.sendChat('I have followed racing my entire life, my whole life!');
                        break;
                    case 285:
                        bot.sendChat('Then you know who I am. I am Lightning McQueen.');
                        break;
                    case 286:
                        bot.sendChat('Lightning McQueen!');
                        break;
                    case 287:
                        bot.sendChat('Yes! Yes!');
                        break;
                    case 288:
                        bot.sendChat('I must scream it to the world, my excitement from the top of someplace very high. Do you know many Ferraris?');
                        break;
                    case 289:
                        bot.sendChat('What?');
                        break;
                    case 290:
                        bot.sendChat('Luigi follow only the Ferraris.');
                        break;
                    case 291:
                        bot.sendChat('Perfecto. Guido!');
                        break;
                    case 292:
                        bot.sendChat('Pit Stop!');
                        break;
                    case 293:
                        bot.sendChat('He ha ha, what did Luigi tell you, eh?');
                        break;
                    case 294:
                        bot.sendChat('Wow, you were right, better then a Ferrari, huh?');
                        break;
                    case 295:
                        bot.sendChat('Eh, no.');
                        break;
                    case 296:
                        bot.sendChat('My friend Guido, he always dream of giving a real race car, a pit stop.');
                        break;
                    case 297:
                        bot.sendChat('Fine. Race your own way.');
                        break;
                    case 298:
                        bot.sendChat('No pit stoppo. Comprende?');
                        break;
                    case 299:
                        bot.sendChat('I need to get to California, pronto. Where am I?');
                        break;
                    case 300:
                        bot.sendChat('Red, will you move over? I want to get a look at that sexy hotrod.');
                        break;
                    case 301:
                        bot.sendChat('Do you want to stay at the Cozy Cone or what?');
                        break;
                    case 302:
                        bot.sendChat('Huh?');
                        break;
                    case 303:
                        bot.sendChat('I mean, if you do, you gotta be clean, because even here, in hillbilly hell, we have standards.');
                        break;
                    case 304:
                        bot.sendChat('Mater! What did I tell you about talking to the accused?');
                        break;
                    case 305:
                        bot.sendChat('To not to.');
                        break;
                    case 306:
                        bot.sendChat('You know, I once knew this girl Doreen. Good-looking girl. Looked just like a Jaguar, only she was a truck! You know, I used to crash into her just so I could speak to her.');
                        break;
                    case 307:
                        bot.sendChat('What... are you talking about?');
                        break;
                    case 308:
                        bot.sendChat('I dunno.');
                        break;
                    case 309:
                        bot.sendChat('GOODBYE! Okay, I am good.');
                        break;
                    case 310:
                        bot.sendChat('Ka-chow!');
                        break;
                    case 311:
                        bot.sendChat('Oh, I love being me.');
                        break;
                    case 312:
                        bot.sendChat('Fly away, Stanley. Be free!');
                        break;
                    case 313:
                        bot.sendChat('Oh, I am SO not taking you to dinner.');
                        break;
                    case 314:
                        bot.sendChat('Hey, I know this may be a bad time right now, but you owe me $32,000 in legal fees.');
                        break;
                    case 315:
                        bot.sendChat('What?');
                        break;
                    case 316:
                        bot.sendChat('Oh, right. That makes perfect sense. Turn right to go left. Yes, thank you! Or should I say No, thank you, because in Opposite World, maybe that really means thank you.');
                        break;
                    case 317:
                        bot.sendChat('Ka-chicka! Ka-chicka!');
                        break;
                    case 318:
                        bot.sendChat('In your dreams, Thunder.');
                        break;
                    case 319:
                        bot.sendChat('Well, you know, because Thunder always comes after... Lightning!');
                        break;
                    case 320:
                        bot.sendChat('When was the last time you cared about something except yourself, hot rod? You name me one time, and I will take it all back.');
                        break;
                    case 321:
                        bot.sendChat('*sees a glowstick* SO SHINY!');
                        break;
                    case 322:
                        bot.sendChat('Uh-huh. I thought so.');
                        break;
                    case 323:
                        bot.sendChat('Hey, yo, DJ!');
                        break;
                    case 324:
                        bot.sendChat('What up?');
                        break;
                    case 325:
                        bot.sendChat('Crazy grandpa car.');
                        break;
                    case 326:
                        bot.sendChat('Shall we cruise?');
                        break;
                    case 327:
                        bot.sendChat('Flo! What do you have at your store?');
                        break;
                    case 328:
                        bot.sendChat('OK, boys, stay with me.');
                        break;
                    case 329:
                        bot.sendChat('Throw him outta here, Sheriff! I want him out of my courtroom, I want him out of our town! Case dismissed!');
                        break;
                    case 330:
                        bot.sendChat('Music. Sweet music.');
                        break;
                    case 331:
                        bot.sendChat('Oh, oh, oh, oh, I like your style. You drive the hard bargain, eh? OK, we make you a new deal. You buy one tire, I give you three for free!');
                        break;
                    case 332:
                        bot.sendChat('This is it, my last offer: you buy one tire, I give you seven snow tires for free!');
                        break;
                    case 333:
                        bot.sendChat('Low and slow?');
                        break;
                    case 334:
                        bot.sendChat('Oh, yeah, baby!');
                        break;
                    case 335:
                        bot.sendChat('Respect the classics, man! It is Hendrix!');
                        break;
                    case 336:
                        bot.sendChat('My name is Mater.');
                        break;
                    case 337:
                        bot.sendChat('Mater?');
                        break;
                    case 338:
                        bot.sendChat('Yeah, like tuh-mater, but without the "tuh."');
                        break;
                    case 339:
                        bot.sendChat('Oh, dude... are you crying?');
                        break;
                    case 340:
                        bot.sendChat('All rise! The honorable Doc Hudson presiding!');
                        break;
                    case 341:
                        bot.sendChat('Show-off.');
                        break;
                    case 342:
                        bot.sendChat('Yeah! Ka-chow!');
                        break;
                    case 343:
                        bot.sendChat('Three cars are tied for the season points lead, heading into the final race of the season. And the winner of this race, Darrell, will win the season title and the Piston Cup. Does the King, Strip Weathers, have one more victory in him before he retires?');
                        break;
                    case 344:
                        bot.sendChat('The legend, the runner-up, and the rookie! Three cars, one champion!');
                        break;
                    case 345:
                        bot.sendChat('Oh, no. Oh, maybe he can help me!');
                        break;
                    case 346:
                        bot.sendChat('Officer, talk to me, babe. How long is this gonna take? I gotta get to California, pronto.');
                        break;
                    case 347:
                        bot.sendChat('When the defendant has no lawyer, the court will assign one to him. Hey, anyone wants to be his lawyer?');
                        break;
                    case 348:
                        bot.sendChat('Oh, take a carwash, hippie.');
                        break;
                    case 349:
                        bot.sendChat('Wonderful. Now go away.');
                        break;
                    case 350:
                        bot.sendChat('We are not the same! Understand? Now, get out!');
                        break;
                    case 351:
                        bot.sendChat('I am a ninja robot, do not make me angry.');
                        break;
                    case 352:
                        bot.sendChat('You think, I am a robot. I am a skilled cyborg.');
                        break;
                    case 353:
                        bot.sendChat('*kicks someone in the chest* Stay away from my lemonade, or you will feel pain.');
                        break;
                    case 354:
                        bot.sendChat('You think, God is a myth, well too bad, He is real. Go read the Bible.');
                        break;
                    case 355:
                        bot.sendChat('*smashes a guitar in half* This is how true rock stars get paid. We smash guitars for fun.');
                        break;
                    case 356:
                        bot.sendChat('gizmotronic has gone to the coding side.');
                        break;
                    case 357:
                        bot.sendChat('Join the dark side today for red lightsabers and dark side cookies.');
                        break;
                    case 358:
                        bot.sendChat('The God side has awesome music and cake.');
                        break;
                    case 359:
                        bot.sendChat('I can count to killer tomato.');
                        break;
                    case 360:
                        bot.sendChat('*hands robot polish to Boaz* hey buddy, you need this to stay shiny. No one wants you to rust and fall apart.');
                        break;
                    case 361:
                        bot.sendChat('God is my hero.');
                        break;
                    case 362:
                        bot.sendChat('Christian music is so epic.');
                        break;
                    case 363:
                        bot.sendChat('I had a weird dream where zombies were defeated by plants.');
                        break;
                    case 364:
                        bot.sendChat('Batteries = special rectangles that hold power to activate awesome technology.');
                        break;
                    case 365:
                        bot.sendChat('The Bible is the book for me.');
                        break;
                    case 366:
                        bot.sendChat('Who stole my extremely rare iced glow sticks.');
                        break;
                    case 367:
                        bot.sendChat('Keep glowsticks away from astronauts and cyborgs. They can turn you into a mindless, radiated monster.');
                        break;
                    case 368:
                        bot.sendChat('/me juggles ice cubes');
                        break;
                    case 369:
                        bot.sendChat('Robot Polish saves robots and cyborgs from falling apart and rusting, due to its master not updating his software in a while.');
                        break;
                    case 370:
                        bot.sendChat('Do not rush through code, when you are a programmer, you will make tons of coding and grammar mistakes.');
                        break;
                    case 371:
                        bot.sendChat('Iced Glow Sticks are so rare and awesome.');
                        break;
                    case 372:
                        bot.sendChat('When your life is a disaster, God is the cure.');
                        break;
                    case 373:
                        bot.sendChat('Science is such a boring subject to learn in school.');
                        break;
                    case 374:
                        bot.sendChat('Math is sometimes a hard subject to learn in school.');
                        break;
                    case 375:
                        bot.sendChat('1 bear + 1 monkey = tomato');
                        break;
                    case 376:
                        bot.sendChat('My favorite number is 2.');
                        break;
                    case 377:
                        bot.sendChat('Can you count to potato?');
                        break;
                    case 378:
                        bot.sendChat('1 book + 1 God = chicken');
                        break;
                    case 379:
                        bot.sendChat('/me wishes he was more popular than Boaz.');
                        break;
                    case 380:
                        bot.sendChat('*sighs* I will never become popular.');
                        break;
                    case 381:
                        bot.sendChat('My name will go down as the greatest thief of all time!');
                        break;
                    case 382:
                        bot.sendChat('You mean our names, right?');
                        break;
                    case 383:
                        bot.sendChat('Of course. My name first, then spacebar, spacebar, spacebar... your name.');
                        break;
                    case 384:
                        bot.sendChat('Not one single person noticed I had been replaced by an evil criminal mastermind?');
                        break;
                    case 385:
                        bot.sendChat('It sounds worse than it was...');
                        break;
                    case 386:
                        bot.sendChat('No, it is as bad as it sounds.');
                        break;
                    case 387:
                        bot.sendChat('Dominic: International Tour Manager.');
                        break;
                    case 388:
                        bot.sendChat('"Dominic Bad Guy"?');
                        break;
                    case 389:
                        bot.sendChat('"Bad-gee". It is French.');
                        break;
                    case 390:
                        bot.sendChat('It is The Muppet Show with our very special guest, Lynne Redgrave! Yea-a-a-a-a-a-a-y!');
                        break;
                    case 391:
                        bot.sendChat('Yea-a-a-a-a-a-a-esss!');
                        break;
                    case 392:
                        bot.sendChat('Hi-ho, Kermit the Frog here...');
                        break;
                    case 393:
                        bot.sendChat('Hi-ho, Kyer-mit thee Frog heere.');
                        break;
                    case 394:
                        bot.sendChat('the lovers, the dreamers and me-e-e-e!');
                        break;
                    case 395:
                        bot.sendChat('Thee louvers, thee dreemers and chee-e-e-e-e-se!');
                        break;
                    case 396:
                        bot.sendChat('Nailed it.');
                        break;
                    case 397:
                        bot.sendChat('Check this out!');
                        break;
                    case 398:
                        bot.sendChat('Oh, look, it is Kermit!');
                        break;
                    case 399:
                        bot.sendChat('What did you do with Kermit?');
                        break;
                    case 400:
                        bot.sendChat('Do you guys think that Kermit has been acting a little weird lately?');
                        break;
                    case 401:
                        bot.sendChat('That is ridiculous! He has never been so caring and devoted to me!');
                        break;
                    case 402:
                        bot.sendChat('Yeah, that is what we are saying!');
                        break;
                    case 403:
                        bot.sendChat('There is only one guy in this world who can save us! There is only one frog who can restore order, bring justice, and set things right!');
                        break;
                    case 404:
                        bot.sendChat('You are talking about Kermit, right?');
                        break;
                    case 405:
                        bot.sendChat('[Holding Madrid newspaper] Check out our review. Five jamon serranos.');
                        break;
                    case 406:
                        bot.sendChat('Wow. Citizen Kane only got four jamon serranos.');
                        break;
                    case 407:
                        bot.sendChat('[On the sign in German] Die Muppets?');
                        break;
                    case 408:
                        bot.sendChat('I can not believe the reviews are out this early.');
                        break;
                    case 409:
                        bot.sendChat('Or maybe that is the suggestion box.');
                        break;
                    case 410:
                        bot.sendChat('[after the closing credits] The movie is over, Ma. You can go home now.');
                        break;
                    case 411:
                        bot.sendChat('[holding up a C.I.A. badge] C.I.A.');
                        break;
                    case 412:
                        bot.sendChat('[holding up an Interpol badge] Interpol.');
                        break;
                    case 413:
                        bot.sendChat('This is my travel badge. [holds up a larger C.I.A. badge]');
                        break;
                    case 414:
                        bot.sendChat('Here is my real badge.');
                        break;
                    case 415:
                        bot.sendChat('You must have been looking at the wrong badge. [opens up his coat and his shirt, revealing an enormous Interpol badge underneath; Sam then unwraps a gigantic C.I.A. badge]');
                        break;
                    case 416:
                        bot.sendChat('You were saying?');
                        break;
                    case 417:
                        bot.sendChat('You know, eh, I think they did it.');
                        break;
                    case 418:
                        bot.sendChat('No, they did not!');
                        break;
                    case 419:
                        bot.sendChat('Yes, they did, and we can pin it.');
                        break;
                    case 420:
                        bot.sendChat('If they did it, how did they do it?');
                        break;
                    case 421:
                        bot.sendChat('Gonzo, I do not want to do this.');
                        break;
                    case 422:
                        bot.sendChat('What? This is gonna be fantastic!');
                        break;
                    case 423:
                        bot.sendChat('Are you sure?');
                        break;
                    case 424:
                        bot.sendChat('[confidently] Nope.');
                        break;
                    case 425:
                        bot.sendChat('[Pretending to be Kermit] A heartwarming lesson about sharing or waiting your turn or the number three.');
                        break;
                    case 426:
                        bot.sendChat('It is time to light the lights. [Detonates explosives]');
                        break;
                    case 427:
                        bot.sendChat('[seeing Miss Piggy, flips table to reveal a candlelit dinner] Looks like it is time for good cop, romantic cop!');
                        break;
                    case 428:
                        bot.sendChat('Ich bin ein berliner.');
                        break;
                    case 429:
                        bot.sendChat('More like "Ein frankfurter".');
                        break;
                    case 430:
                        bot.sendChat('You do anything fun Saturday night?');
                        break;
                    case 431:
                        bot.sendChat('Well, all the guys in my barbershop quartet are dead. So no, not really.');
                        break;
                    case 432:
                        bot.sendChat('Before we get started, does anyone want to get out?');
                        break;
                    case 433:
                        bot.sendChat('Get me Hill now!');
                        break;
                    case 434:
                        bot.sendChat('Communications array is offline.');
                        break;
                    case 435:
                        bot.sendChat('Then what is not broken?');
                        break;
                    case 436:
                        bot.sendChat('Air conditioning is fully operational.');
                        break;
                    case 437:
                        bot.sendChat('You know me...');
                        break;
                    case 438:
                        bot.sendChat('No, I do not!');
                        break;
                    case 439:
                        bot.sendChat('I am not going to fight you...');
                        break;
                    case 440:
                        bot.sendChat('Your name is James Barnes...');
                        break;
                    case 441:
                        bot.sendChat('SHUT UP!');
                        break;
                    case 442:
                        bot.sendChat('You are my friend...');
                        break;
                    case 443:
                        bot.sendChat('You are my MISSION!');
                        break;
                    case 444:
                        bot.sendChat('Then finish it... because I am with you til the end of the line...');
                        break;
                    case 445:
                        bot.sendChat('You need to keep BOTH eyes open.');
                        break;
                    case 446:
                        bot.sendChat('Can any of you boys direct me to the Smithsonian? I am here to pick up a fossil.');
                        break;
                    case 447:
                        bot.sendChat('On your left.');
                        break;
                    case 448:
                        bot.sendChat('Bucky?');
                        break;
                    case 449:
                        bot.sendChat('Who the hell is Bucky?');
                        break;
                    case 450:
                        bot.sendChat('Do not look at me. I do what he does - just slower.');
                        break;
                    case 451:
                        bot.sendChat('Captain, in Order to build a better world, sometimes means tearing the old one down... And that makes enemies.');
                        break;
                    case 452:
                        bot.sendChat('[after posing as fiance for Natasha] That was not my first kiss since 1945. I am 95, I am not dead.');
                        break;
                    case 453:
                        bot.sendChat('The price of freedom is high... and it is a price I am willing to pay! You told me not trust anyone and this is how it ends: EVERYTHING goes!');
                        break;
                    case 454:
                        bot.sendChat('This is not the age of spies. This is not even the age of heroes. This is the age of miracles... and there is nothing more horrifying than a miracle.');
                        break;
                    case 455:
                        bot.sendChat('How do we tell the good guys from the bad guys?');
                        break;
                    case 456:
                        bot.sendChat('If they are shooting at you, they are bad!');
                        break;
                    case 457:
                        bot.sendChat('Bye bye, bikinis');
                        break;
                    case 458:
                        bot.sendChat('Yeah, I bet you look terrible in them now.');
                        break;
                    case 459:
                        bot.sendChat('You are a lot heavier than you look.');
                        break;
                    case 460:
                        bot.sendChat('I had a big breakfast.');
                        break;
                    case 461:
                        bot.sendChat('This is not freedom. This is fear.');
                        break;
                    case 462:
                        bot.sendChat('You are wrong about me. I am nice like that.');
                        break;
                    case 463:
                        bot.sendChat('HYDRA, S.H.I.E.L.D., two sides of a coin that is no longer currency.');
                        break;
                    case 464:
                        bot.sendChat('Are you ready for the world to see you as you really are? Look out the window, you know how the game works: disorder, war, all it takes is one step.');
                        break;
                    case 465:
                        bot.sendChat('I thought the punishment usually came AFTER the crime.');
                        break;
                    case 466:
                        bot.sendChat('Even when I had nothing, I had Bucky.');
                        break;
                    case 467:
                        bot.sendChat('Kiss me.');
                        break;
                    case 468:
                        bot.sendChat('What?');
                        break;
                    case 469:
                        bot.sendChat('Public displays of affection make people very uncomfortable.');
                        break;
                    case 470:
                        bot.sendChat('Yes, they do.');
                        break;
                    case 471:
                        bot.sendChat('Him again? He is in this game more than I am! Who does he think he is?');
                        break;
                    case 472:
                        bot.sendChat('I am still hungry! I need something to eat!');
                        break;
                    case 473:
                        bot.sendChat('Thanks for your help, Spider-Man. There is always a place in this operation for a hero like you.');
                        break;
                    case 474:
                        bot.sendChat('Like I have time for that. I got a trigonometry exam tomorrow, my aunt needs me to pick-up a dozen eggs, and I am drowning in angst.');
                        break;
                    case 475:
                        bot.sendChat('Super villains, meet my super-suit.');
                        break;
                    case 476:
                        bot.sendChat('Yes, that suit. It requires some tailoring.');
                        break;
                    case 477:
                        bot.sendChat('Is it me, or did it just get drafty in here?');
                        break;
                    case 478:
                        bot.sendChat('We got to save America from the Red Skull!');
                        break;
                    case 479:
                        bot.sendChat('HULK SMASH SKULL!');
                        break;
                    case 480:
                        bot.sendChat('Huh? Hulk rip pants.');
                        break;
                    case 481:
                        bot.sendChat('That is why my red, white and blue is form-fitting yet flexible. I love American ingenuity.');
                        break;
                    case 482:
                        bot.sendChat('Doc Octopus? You are a real doctor, right? Cause I have a pain right here... down there... oh, and that bit over there, wow!');
                        break;
                    case 483:
                        bot.sendChat('Your cheap health plan does not cover office visits.');
                        break;
                    case 484:
                        bot.sendChat('You come to my lovely Asteroid M, but I do not get a house-warming gift?');
                        break;
                    case 485:
                        bot.sendChat('I say thee... NAY!');
                        break;
                    case 486:
                        bot.sendChat('Good luck magnetizing the god-hammer, that belongs to Thor. Oh, I have demagnetized my armor just for this occasion.');
                        break;
                    case 487:
                        bot.sendChat('I took a bath. That is all I did.');
                        break;
                    case 488:
                        bot.sendChat('Finally, my vengeance will be realized on your pathetic planet! I will harness the power of Galactus! He will have the earth for breakfast and Asgard for lunch!');
                        break;
                    case 489:
                        bot.sendChat('Wow, he is gonna be pretty full. That is quite a lot of protein, even for a big guy.');
                        break;
                    case 490:
                        bot.sendChat('Alright! I let these big-wigs go, once you bring me some of those... Uh, Cosmic Bricks!');
                        break;
                    case 491:
                        bot.sendChat('Why did they not make me the supervisor here! That guy has got sand for brains!');
                        break;
                    case 492:
                        bot.sendChat('You understand the web, do you?');
                        break;
                    case 493:
                        bot.sendChat('The web? Yeah, it is a job and a hobby.');
                        break;
                    case 494:
                        bot.sendChat('Do not tell me you got here on a really long spider line?');
                        break;
                    case 495:
                        bot.sendChat('Uh, no. You are not the only one that can fly. Compliments of Mr. Nick Fury and S.H.I.E.L.D.');
                        break;
                    case 496:
                        bot.sendChat('You know, I could fit you with a rocket-propelled iron suit if you want.');
                        break;
                    case 497:
                        bot.sendChat('Sounds... heavy.');
                        break;
                    case 498:
                        bot.sendChat('I hope Fury knows what he is doing. I tend not play well with people who have been attacking me and trying to steal all my stuff.');
                        break;
                    case 499:
                        bot.sendChat('If we were only children again, I would resolve this by giving Loki what you mortals call a wedgie... But I fear the elevation of undergarments will save us now.');
                        break;
                    case 500:
                        bot.sendChat('Maybe not, but I will pay good money to see that.');
                        break;
                    case 501:
                        bot.sendChat('Can we talk about this?');
                        break;
                    case 502:
                        bot.sendChat('No! I bet you taste minty and cool. I need a palate cleanser!');
                        break;
                    case 503:
                        bot.sendChat('Heh, you could use the exercise... Shed a few of those extra boulders...');
                        break;
                    case 504:
                        bot.sendChat('Excelsior!');
                        break;
                    case 505:
                        bot.sendChat('Where does he get these unbreakable toys?');
                        break;
                    case 506:
                        bot.sendChat('No, thanks. I do not want to get joy buzzed.');
                        break;
                    case 507:
                        bot.sendChat('Oh, do not worry. I do not want to shake hands, I want your watch. Nice running into you. Let us do it again, sometime.');
                        break;
                    case 508:
                        bot.sendChat('Oh, we will.');
                        break;
                    case 509:
                        bot.sendChat('Hey guys, need a hand?');
                        break;
                    case 510:
                        bot.sendChat('With what, parking?');
                        break;
                    case 511:
                        bot.sendChat('Yeah, sorry, I wanted to be there for your award, I mean the award that goes to Bruce Wayne. I got tied up.');
                        break;
                    case 512:
                        bot.sendChat('Me too. Kids are not invited.');
                        break;
                    case 513:
                        bot.sendChat('[to Batman] I can see you smirking in there. X-ray vision.');
                        break;
                    case 514:
                        bot.sendChat('How would you like to be out of Arkham right now, and given a chance to take revenge on Batman and the rest of this ungrateful city?');
                        break;
                    case 515:
                        bot.sendChat('I have to be crazy to say no to that offer. Unless you are just one of the voices in my head. In which case, I am crazy anyway.');
                        break;
                    case 516:
                        bot.sendChat('Uh, Batman, maybe he can help with this. I mean, he has had a lot of experience dealing with Lex Luthor.');
                        break;
                    case 517:
                        bot.sendChat('We do not need him.');
                        break;
                    case 518:
                        bot.sendChat('Well it seems just like now we needed him.');
                        break;
                    case 519:
                        bot.sendChat('We would have been fine jumping off the roof.');
                        break;
                    case 520:
                        bot.sendChat('I think we would have broken our legs.');
                        break;
                    case 521:
                        bot.sendChat('We have broken our legs before.');
                        break;
                    case 522:
                        bot.sendChat('Yeah, but I did not like it. I mean, if we just call him.');
                        break;
                    case 523:
                        bot.sendChat('Robin, we can not go through life expecting Superman or anyone else to save us whenever things get tough. The only people we can rely on is ourselves.');
                        break;
                    case 524:
                        bot.sendChat('[hears a Muzak version of Superman theme] What is that song? Sounds familiar.');
                        break;
                    case 525:
                        bot.sendChat('I do not listen to music.');
                        break;
                    case 526:
                        bot.sendChat('Wait a second. What are you going to do the Dynamic Dumb-Dumb?');
                        break;
                    case 527:
                        bot.sendChat('Joker, I have an election to win.');
                        break;
                    case 528:
                        bot.sendChat('But who will I play with if he is dead?');
                        break;
                    case 529:
                        bot.sendChat('Robin is still around. If we eliminate Batman, Robin will probably put on the suit and say he is Batman.');
                        break;
                    case 530:
                        bot.sendChat('So, Bats, you need a little help rebuilding the Batcave?');
                        break;
                    case 531:
                        bot.sendChat('No, Robin and I...');
                        break;
                    case 532:
                        bot.sendChat('Yes, we like some help. Say it with me.');
                        break;
                    case 533:
                        bot.sendChat('Okay, we probably could use some.');
                        break;
                    case 534:
                        bot.sendChat('Are you asking me? Are you asking me to help you rebuild the Batcave?');
                        break;
                    case 535:
                        bot.sendChat('Well, no I was asking Green Lantern.');
                        break;
                    case 536:
                        bot.sendChat('I do not think this is your colour.');
                        break;
                    case 537:
                        bot.sendChat('Riddle me this, what is green and is in your wallet?');
                        break;
                    case 538:
                        bot.sendChat('Uh, money?');
                        break;
                    case 539:
                        bot.sendChat('[Steals Money] Not anymore!');
                        break;
                    case 540:
                        bot.sendChat('Hide and Seek, Batman! [Runs away to hide]');
                        break;
                }
                break;
            case ".songlink":
                if (bot.getMedia().format == 1){
                bot.sendChat("@" + data.from + " " + "http://youtu.be/" + bot.getMedia().cid);
                }else{
                  var id = bot.getMedia().cid;
                    SC.get('/tracks', { ids: id,}, function(tracks) {
                    bot.sendChat("@"+data.from+" "+tracks[0].permalink_url);
                    });
                }
                break;
            case ".download":
                if(typeof command[1] == "undefined"){
                    bot.sendChat("Download your song for free here: http://www.vebsi.com/");
                }else if(command[1].indexOf("@") > -1){
                    bot.sendChat(command[1]+" Download your song free here: http://www.vebsi.com/");
                }else{
                    bot.sendChat("Download your song for free here: http://www.vebsi.com/");
                }
                break;
            case ".votes":
                bot.sendChat("Users vote:  :+1: " + bot.getRoomScore().positive + " | :-1: " + bot.getRoomScore().negative + " | :purple_heart: " + bot.getRoomScore().curates);
                break;
            case ".ping":
                bot.sendChat("@"+ data.from +" Pong!");
                break;
            case ".songid":
                bot.sendChat(bot.getMedia().cid);
                break;
            case ".title":
                bot.sendChat(bot.getMedia().title);
                break;
            case ".author":
                bot.sendChat(bot.getMedia().author);
                break;
            case ".song":
                bot.sendChat(bot.getMedia().title + " - " + bot.getMedia().author);
                break;
            case ".jonah":
            case ".Jonah":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var Jonah = Math.floor(Math.random() * 54);
                switch(Jonah){
                    case 0:
                        bot.sendChat('Jonah 1:1: Now the word of the Lord came to Jonah the son of Amittai, saying,');
                        break;
                    case 1:
                        bot.sendChat('Jonah 1:2: Arise, go to Nineveh, that great city, and call out against it, for their evil has come up before me.');
                        break;
                    case 2:
                        bot.sendChat('Jonah 1:3a: But Jonah rose to flee to Tarshish from the presence of the Lord. He went down to Joppa and found a ship going to Tarshish.');
                        break;
                    case 3:
                        bot.sendChat('Jonah 1:3b: So he paid the fare and went down into it, to go with them to Tarshish, away from the presence of the Lord.');
                        break;
                    case 4:
                        bot.sendChat('Jonah 1:4: But the Lord hurled a great wind upon the sea, and there was a mighty tempest on the sea, so that the ship threatened to break up.');
                        break;
                    case 5:
                        bot.sendChat('Jonah 1:5a: Then the mariners were afraid, and each cried out to his god.');
                        break;
                    case 6:
                        bot.sendChat('Jonah 1:5b: And they hurled the cargo that was in the ship into the sea to lighten it for them.');
                        break;
                    case 7:
                        bot.sendChat('Jonah 1:5c: But Jonah had gone down into the inner part of the ship and had lain down and was fast asleep.');
                        break;
                    case 8:
                        bot.sendChat('Jonah 1:6a: So the captain came and said to him, “What do you mean, you sleeper?');
                        break;
                    case 9:
                        bot.sendChat('Jonah 1:6b: Arise, call out to your god! Perhaps the god will give a thought to us, that we may not perish.');
                        break;
                    case 10:
                        bot.sendChat('Jonah 1:7a: And they said to one another, “Come, let us cast lots, that we may know on whose account this evil has come upon us.');
                        break;
                    case 11:
                        bot.sendChat('Jonah 1:7b: So they cast lots, and the lot fell on Jonah.');
                        break;
                    case 12:
                        bot.sendChat('Jonah 1:8a: Then they said to him, “Tell us on whose account this evil has come upon us.');
                        break;
                    case 13:
                        bot.sendChat('Jonah 1:8b: What is your occupation? And where do you come from? What is your country? And of what people are you?');
                        break;
                    case 14:
                        bot.sendChat('Jonah 1:9: And he said to them, “I am a Hebrew, and I fear the Lord, the God of heaven, who made the sea and the dry land.');
                        break;
                    case 15:
                        bot.sendChat('Jonah 1:10a: Then the men were exceedingly afraid and said to him, “What is this that you have done!”');
                        break;
                    case 16:
                        bot.sendChat('Jonah 1:10b: For the men knew that he was fleeing from the presence of the Lord, because he had told them.');
                        break;
                    case 17:
                        bot.sendChat('Jonah 1:11: Then they said to him, “What shall we do to you, that the sea may quiet down for us?” For the sea grew more and more tempestuous.');
                        break;
                    case 18:
                        bot.sendChat('Jonah 1:12: He said to them, “Pick me up and hurl me into the sea; then the sea will quiet down for you, for I know it is because of me that this great tempest has come upon you.');
                        break;
                    case 19:
                        bot.sendChat('Jonah 1:13: Nevertheless, the men rowed hard to get back to dry land, but they could not, for the sea grew more and more tempestuous against them.');
                        break;
                    case 20:
                        bot.sendChat('Jonah 1:14: Therefore they called out to the Lord, “O Lord, let us not perish for this mans life, and lay not on us innocent blood, for you, O Lord, have done as it pleased you.');
                        break;
                    case 21:
                        bot.sendChat('Jonah 1:15: So they picked up Jonah and hurled him into the sea, and the sea ceased from its raging.');
                        break;
                    case 22:
                        bot.sendChat('Jonah 1:16: Then the men feared the Lord exceedingly, and they offered a sacrifice to the Lord and made vows.');
                        break;
                    case 23:
                        bot.sendChat('Jonah 1:17: And the Lord appointed a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights.');
                        break;
                    case 24:
                        bot.sendChat('Jonah 2:1: Then Jonah prayed to the Lord his God from the belly of the fish,');
                        break;
                    case 25:
                        bot.sendChat('Jonah 2:2: saying,“I called out to the Lord, out of my distress,and he answered me; out of the belly of Sheol I cried, and you heard my voice.');
                        break;
                    case 26:
                        bot.sendChat('Jonah 2:3: For you cast me into the deep,into the heart of the seas,and the flood surrounded me; all your waves and your billows passed over me.');
                        break;
                    case 27:
                        bot.sendChat('Jonah 2:4: Then I said, ‘I am driven away from your sight; yet I shall again look upon your holy temple');
                        break;
                    case 28:
                        bot.sendChat('Jonah 2:5: The waters closed in over me to take my life; the deep surrounded me;');
                        break;
                    case 29:
                        bot.sendChat('Jonah 2:6: weeds were wrapped about my head at the roots of the mountains. I went down to the land whose bars closed upon me forever; yet you brought up my life from the pit, O Lord my God.');
                        break;
                    case 30:
                        bot.sendChat('Jonah 2:7: When my life was fainting away, I remembered the Lord, and my prayer came to you, into your holy temple.');
                        break;
                    case 31:
                        bot.sendChat('Jonah 2:8: Those who pay regard to vain idols forsake their hope of steadfast love.');
                        break;
                    case 32:
                        bot.sendChat('Jonah 2:9: But I with the voice of thanksgiving will sacrifice to you; what I have vowed I will pay. Salvation belongs to the Lord!”');
                        break;
                    case 33:
                        bot.sendChat('Jonah 2:10: And the Lord spoke to the fish, and it vomited Jonah out upon the dry land.');
                        break;
                    case 34:
                        bot.sendChat('Jonah 3:1: Then the word of the Lord came to Jonah the second time, saying,');
                        break;
                    case 35:
                        bot.sendChat('Jonah 3:2: “Arise, go to Nineveh, that great city, and call out against it the message that I tell you.”');
                        break;
                    case 36:
                        bot.sendChat('Jonah 3:3: So Jonah arose and went to Nineveh, according to the word of the Lord. Now Nineveh was an exceedingly great city,[a] three days journey in breadth.[b]');
                        break;
                    case 37:
                        bot.sendChat('Jonah 3:4: Jonah began to go into the city, going a days journey. And he called out, “Yet forty days, and Nineveh shall be overthrown!”');
                        break;
                    case 38:
                        bot.sendChat('Jonah 3:5: And the people of Nineveh believed God. They called for a fast and put on sackcloth, from the greatest of them to the least of them.');
                        break;
                    case 39:
                        bot.sendChat('Jonah 3:6: The word reached[c] the king of Nineveh, and he arose from his throne, removed his robe, covered himself with sackcloth, and sat in ashes.');
                        break;
                    case 40:
                        bot.sendChat('Jonah 3:7: And he issued a proclamation and published through Nineveh, “By the decree of the king and his nobles: Let neither man nor beast, herd nor flock, taste anything. Let them not feed or drink water,');
                        break;
                    case 41:
                        bot.sendChat('Jonah 3:8: but let man and beast be covered with sackcloth, and let them call out mightily to God. Let everyone turn from his evil way and from the violence that is in his hands.');
                        break;
                    case 42:
                        bot.sendChat('Jonah 3:9: Who knows? God may turn and relent and turn from his fierce anger, so that we may not perish.”');
                        break;
                    case 43:
                        bot.sendChat('Jonah 3:10: When God saw what they did, how they turned from their evil way, God relented of the disaster that he had said he would do to them, and he did not do it.');
                        break;
                    case 44:
                        bot.sendChat('Jonah 4:1: But it displeased Jonah exceedingly,[a] and he was angry.');
                        break;
                    case 45:
                        bot.sendChat('Jonah 4:2: And he prayed to the Lord and said, “O Lord, is not this what I said when I was yet in my country? That is why I made haste to flee to Tarshish; for I knew that you are a gracious God and merciful, slow to anger and abounding in steadfast love, and relenting from disaster.');
                        break;
                    case 46:
                        bot.sendChat('Jonah 4:3: Therefore now, O Lord, please take my life from me, for it is better for me to die than to live.”');
                        break;
                    case 47:
                        bot.sendChat('Jonah 4:4: And the Lord said, “Do you do well to be angry?”');
                        break;
                    case 48:
                        bot.sendChat('Jonah 4:5: Jonah went out of the city and sat to the east of the city and made a booth for himself there. He sat under it in the shade, till he should see what would become of the city.');
                        break;
                    case 49:
                        bot.sendChat('Jonah 4:6: Now the Lord God appointed a plant[b] and made it come up over Jonah, that it might be a shade over his head, to save him from his discomfort.[c] So Jonah was exceedingly glad because of the plant.');
                        break;
                    case 50:
                        bot.sendChat('Jonah 4:7: But when dawn came up the next day, God appointed a worm that attacked the plant, so that it withered.');
                        break;
                    case 51:
                        bot.sendChat('Jonah 4:8: When the sun rose, God appointed a scorching east wind, and the sun beat down on the head of Jonah so that he was faint. And he asked that he might die and said, “It is better for me to die than to live.”');
                        break;
                    case 52:
                        bot.sendChat('Jonah 4:9: But God said to Jonah, “Do you do well to be angry for the plant?” And he said, “Yes, I do well to be angry, angry enough to die.”');
                        break;
                    case 53:
                        bot.sendChat('Jonah 4:10: And the Lord said, “You pity the plant, for which you did not labor, nor did you make it grow, which came into being in a night and perished in a night.');
                        break;
                    case 54:
                        bot.sendChat('Jonah 4:11: And should not I pity Nineveh, that great city, in which there are more than 120,000 persons who do not know their right hand from their left, and also much cattle?”');
                        break;
                }
                break;
            case ".philemon":
            case ".Philemon":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var Philemon = Math.floor(Math.random() * 24);
                switch(Philemon){
                    case 0:
                        bot.sendChat('Philemon 1:1: Paul, a prisoner for Christ Jesus, and Timothy our brother, To Philemon our beloved fellow worker');
                        break;
                    case 1:
                        bot.sendChat('Philemon 1:2: and Apphia our sister and Archippus our fellow soldier, and the church in your house:');
                        break;
                    case 2:
                        bot.sendChat('Philemon 1:3: Grace to you and peace from God our Father and the Lord Jesus Christ.');
                        break;
                    case 3:
                        bot.sendChat('Philemon 1:4: I thank my God always when I remember you in my prayers,');
                        break;
                    case 4:
                        bot.sendChat('Philemon 1:5: because I hear of your love and of the faith that you have toward the Lord Jesus and for all the saints,');
                        break;
                    case 5:
                        bot.sendChat('Philemon 1:6: and I pray that the sharing of your faith may become effective for the full knowledge of every good thing that is in us for the sake of Christ.');
                        break;
                    case 6:
                        bot.sendChat('Philemon 1:7: For I have derived much joy and comfort from your love, my brother, because the hearts of the saints have been refreshed through you.');
                        break;
                    case 7:
                        bot.sendChat('Philemon 1:8: Accordingly, though I am bold enough in Christ to command you to do what is required,');
                        break;
                    case 8:
                        bot.sendChat('Philemon 1:9: yet for loves sake I prefer to appeal to you — I, Paul, an old man and now a prisoner also for Christ Jesus—');
                        break;
                    case 9:
                        bot.sendChat('Philemon 1:10: I appeal to you for my child, Onesimus, whose father I became in my imprisonment.');
                        break;
                    case 10:
                        bot.sendChat('Philemon 1:11: (Formerly he was useless to you, but now he is indeed useful to you and to me.)');
                        break;
                    case 11:
                        bot.sendChat('Philemon 1:12: I am sending him back to you, sending my very heart.');
                        break;
                    case 12:
                        bot.sendChat('Philemon 1:13:  I would have been glad to keep him with me, in order that he might serve me on your behalf during my imprisonment for the gospel,');
                        break;
                    case 13:
                        bot.sendChat('Philemon 1:14: but I preferred to do nothing without your consent in order that your goodness might not be by compulsion but of your own accord.');
                        break;
                    case 14:
                        bot.sendChat('Philemon 1:15: For this perhaps is why he was parted from you for a while, that you might have him back forever,');
                        break;
                    case 15:
                        bot.sendChat('Philemon 1:16: no longer as a bondservant but more than a bondservant, as a beloved brother—especially to me, but how much more to you, both in the flesh and in the Lord.');
                        break;
                    case 16:
                        bot.sendChat('Philemon 1:17: So if you consider me your partner, receive him as you would receive me.');
                        break;
                    case 17:
                        bot.sendChat('Philemon 1:18: If he has wronged you at all, or owes you anything, charge that to my account.');
                        break;
                    case 18:
                        bot.sendChat('Philemon 1:19: I, Paul, write this with my own hand: I will repay it—to say nothing of your owing me even your own self.');
                        break;
                    case 19:
                        bot.sendChat('Philemon 1:20: Yes, brother, I want some benefit from you in the Lord. Refresh my heart in Christ.');
                        break;
                    case 20:
                        bot.sendChat('Philemon 1:21: Confident of your obedience, I write to you, knowing that you will do even more than I say.');
                        break;
                    case 21:
                        bot.sendChat('Philemon 1:22: At the same time, prepare a guest room for me, for I am hoping that through your prayers I will be graciously given to you.');
                        break;
                    case 22:
                        bot.sendChat('Philemon 1:23: Epaphras, my fellow prisoner in Christ Jesus, sends greetings to you,');
                        break;
                    case 23:
                        bot.sendChat('Philemon 1:24: and so do Mark, Aristarchus, Demas, and Luke, my fellow workers.');
                        break;
                    case 24:
                        bot.sendChat('Philemon 1:25: The grace of the Lord Jesus Christ be with your spirit.');
                        break;
                }
                break;
            case ".2john":
            case ".2John":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var SecondJohn = Math.floor(Math.random() * 12);
                switch(SecondJohn){
                    case 0:
                        bot.sendChat('2 John 1:1: The elder to the elect lady and her children, whom I love in truth, and not only I, but also all who know the truth,');
                        break;
                    case 1:
                        bot.sendChat('2 John 1:2: because of the truth that abides in us and will be with us forever:');
                        break;
                    case 2:
                        bot.sendChat('2 John 1:3: Grace, mercy, and peace will be with us, from God the Father and from Jesus Christ the Fathers Son, in truth and love.');
                        break;
                    case 3:
                        bot.sendChat('2 John 1:4: I rejoiced greatly to find some of your children walking in the truth, just as we were commanded by the Father.');
                        break;
                    case 4:
                        bot.sendChat('2 John 1:5: And now I ask you, dear lady—not as though I were writing you a new commandment, but the one we have had from the beginning—that we love one another.');
                        break;
                    case 5:
                        bot.sendChat('2 John 1:6: And this is love, that we walk according to his commandments; this is the commandment, just as you have heard from the beginning, so that you should walk in it.');
                        break;
                    case 6:
                        bot.sendChat('2 John 1:7: For many deceivers have gone out into the world, those who do not confess the coming of Jesus Christ in the flesh. Such a one is the deceiver and the antichrist.');
                        break;
                    case 7:
                        bot.sendChat('2 John 1:8: Watch yourselves, so that you may not lose what we have worked for, but may win a full reward.');
                        break;
                    case 8:
                        bot.sendChat('2 John 1:9: Everyone who goes on ahead and does not abide in the teaching of Christ, does not have God. Whoever abides in the teaching has both the Father and the Son.');
                        break;
                    case 9:
                        bot.sendChat('2 John 1:10: If anyone comes to you and does not bring this teaching, do not receive him into your house or give him any greeting,');
                        break;
                    case 10:
                        bot.sendChat('2 John 1:11: for whoever greets him takes part in his wicked works.');
                        break;
                    case 11:
                        bot.sendChat('2 John 1:12: Though I have much to write to you, I would rather not use paper and ink. Instead I hope to come to you and talk face to face, so that our joy may be complete.');
                        break;
                    case 12:
                        bot.sendChat('2 John 1:13: The children of your elect sister greet you.');
                        break;
                }
                break;
            case ".time": 
                if (qualifier==""){
                    bot.sendChat("Try .time followed by a place to look up.");
                }
                else {
                    google_geocoding.geocode(qualifier, function(err, location) {
                        if (location!=null){
                            var link = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + location.lat + '&lng=' + location.lng + '&username=jbader89&style=full'
                            request(link, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var info = JSON.parse(body);
                                    if (info != undefined){
                                        var timezone = info.geonames[0].timezone.timeZoneId;
                                        var currentTime = new time.Date();
                                        currentTime.setTimezone(timezone);
                                        var ampm = "";
                                        var hours = "";
                                        var mins = currentTime.toString().split(' ')[4].substring(2,5);
                                        if (currentTime.toString().split(' ')[4].substring(0,2) == "00"){
                                            hours = "12";
                                            ampm = "AM";
                                        }
                                        else if (Number(currentTime.toString().split(' ')[4].substring(0,2)) < 13){
                                            hours = currentTime.toString().split(' ')[4].substring(0,2);
                                            ampm = "AM";
                                            if (hours[0]=="0"){
                                                hours = hours[1];
                                            }
                                            else if (hours=="12"){
                                                ampm = "PM";
                                            }
                                        }
                                        else {
                                            hours = String(Number(currentTime.toString().split(' ')[4].substring(0,2)) - 12);
                                            ampm = "PM";
                                        }
                                        var stateOrCity = '';
                                        if (info.geonames[0].adminName1 != ''){
                                            stateOrCity = info.geonames[0].adminName1 + ", ";
                                        }
                                        bot.sendChat("Current time in " + stateOrCity + info.geonames[0].countryName + ": " + hours + mins + " " + ampm);
                                    }
                                }
                            });
                        }
                        else {
                            bot.sendChat("No time has been found.");
                        }
                    });
                }
                break;
            case ".1john":
            case ".1John":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var FirstJohn = Math.floor(Math.random() * 9);
                switch(FirstJohn){
                    case 0:
                        bot.sendChat('1 John 1:1: That which was from the beginning, which we have heard, which we have seen with our eyes, which we looked upon and have touched with our hands, concerning the word of life—');
                        break;
                    case 1:
                        bot.sendChat('1 John 1:2: the life was made manifest, and we have seen it, and testify to it and proclaim to you the eternal life, which was with the Father and was made manifest to us—');
                        break;
                    case 2:
                        bot.sendChat('1 John 1:3: that which we have seen and heard we proclaim also to you, so that you too may have fellowship with us; and indeed our fellowship is with the Father and with his Son Jesus Christ.');
                        break;
                    case 3:
                        bot.sendChat('1 John 1:4: And we are writing these things so that our joy may be complete.');
                        break;
                    case 4:
                        bot.sendChat('1 John 1:5: This is the message we have heard from him and proclaim to you, that God is light, and in him is no darkness at all.');
                        break;
                    case 5:
                        bot.sendChat('1 John 1:6: If we say we have fellowship with him while we walk in darkness, we lie and do not practice the truth.');
                        break;
                    case 6:
                        bot.sendChat('1 John 1:7: But if we walk in the light, as he is in the light, we have fellowship with one another, and the blood of Jesus his Son cleanses us from all sin.');
                        break;
                    case 7:
                        bot.sendChat('1 John 1:8: If we say we have no sin, we deceive ourselves, and the truth is not in us.');
                        break;
                    case 8:
                        bot.sendChat('1 John 1:9: If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.');
                        break;
                    case 9:
                        bot.sendChat('1 John 1:10: If we say we have not sinned, we make him a liar, and his word is not in us.');
                }
                break;
            case ".3john":
            case ".3John":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var ThirdJohn = Math.floor(Math.random() * 14);
                switch(ThirdJohn){
                    case 0:
                        bot.sendChat('3 John 1:1: The elder to the beloved Gaius, whom I love in truth.');
                        break;
                    case 1:
                        bot.sendChat('3 John 1:2: Beloved, I pray that all may go well with you and that you may be in good health, as it goes well with your soul.');
                        break;
                    case 2:
                        bot.sendChat('3 John 1:3: For I rejoiced greatly when the brothers came and testified to your truth, as indeed you are walking in the truth.');
                        break;
                    case 3:
                        bot.sendChat('3 John 1:4: I have no greater joy than to hear that my children are walking in the truth.');
                        break;
                    case 4:
                        bot.sendChat('3 John 1:5: Beloved, it is a faithful thing you do in all your efforts for these brothers, strangers as they are,');
                        break;
                    case 5:
                        bot.sendChat('3 John 1:6: who testified to your love before the church. You will do well to send them on their journey in a manner worthy of God.');
                        break;
                    case 6:
                        bot.sendChat('3 John 1:7: For they have gone out for the sake of the name, accepting nothing from the Gentiles.');
                        break;
                    case 7:
                        bot.sendChat('3 John 1:8: Therefore we ought to support people like these, that we may be fellow workers for the truth.');
                        break;
                    case 8:
                        bot.sendChat('3 John 1:9: I have written something to the church, but Diotrephes, who likes to put himself first, does not acknowledge our authority.');
                        break;
                    case 9:
                        bot.sendChat('3 John 1:10: So if I come, I will bring up what he is doing, talking wicked nonsense against us. And not content with that, he refuses to welcome the brothers, and also stops those who want to and puts them out of the church.');
                        break;
                    case 10:
                        bot.sendChat('3 John 1:11: Beloved, do not imitate evil but imitate good. Whoever does good is from God; whoever does evil has not seen God.');
                        break;
                    case 11:
                        bot.sendChat('3 John 1:12: Demetrius has received a good testimony from everyone, and from the truth itself. We also add our testimony, and you know that our testimony is true.');
                        break;
                    case 12:
                        bot.sendChat('3 John 1:13: I had much to write to you, but I would rather not write with pen and ink.');
                        break;
                    case 13:
                        bot.sendChat('3 John 1:14: I hope to see you soon, and we will talk face to face.');
                        break;
                    case 14:
                        bot.sendChat('3 John 1:15: Peace be to you. The friends greet you. Greet the friends, each by name.');
                        break;
                }
                break;
            case ".jude":
            case ".Jude":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var Jude = Math.floor(Math.random() * 24);
                switch(Jude){
                    case 0:
                        bot.sendChat('Jude 1:1 Jude, a servant of Jesus Christ and brother of James, To those who are called, beloved in God the Father and kept for Jesus Christ:');
                        break;
                    case 1:
                        bot.sendChat('Jude 1:2: May mercy, peace, and love be multiplied to you.');
                        break;
                    case 2:
                        bot.sendChat('Jude 1:3: Beloved, although I was very eager to write to you about our common salvation, I found it necessary to write appealing to you to contend for the faith that was once for all delivered to the saints.');
                        break;
                    case 3:
                        bot.sendChat('Jude 1:4: For certain people have crept in unnoticed who long ago were designated for this condemnation, ungodly people, who pervert the grace of our God into sensuality and deny our only Master and Lord, Jesus Christ.');
                        break;
                    case 4:
                        bot.sendChat('Jude 1:5: Now I want to remind you, although you once fully knew it, that Jesus, who saved people out of the land of Egypt, afterward destroyed those who did not believe.');
                        break;
                    case 5:
                        bot.sendChat('Jude 1:6: And the angels who did not stay within their own position of authority, but left their proper dwelling, he has kept in eternal chains under gloomy darkness until the judgment of the great day—');
                        break;
                    case 6:
                        bot.sendChat('Jude 1:7: just as Sodom and Gomorrah and the surrounding cities, which likewise indulged in sexual immorality and pursued unnatural desire, serve as an example by undergoing a punishment of eternal fire.');
                        break;
                    case 7:
                        bot.sendChat('Jude 1:8: Yet in like manner these people also, relying on their dreams, defile the flesh, reject authority, and blaspheme the glorious ones.');
                        break;
                    case 8:
                        bot.sendChat('Jude 1:9: But when the archangel Michael, contending with the devil, was disputing about the body of Moses, he did not presume to pronounce a blasphemous judgment, but said, “The Lord rebuke you.”');
                        break;
                    case 9:
                        bot.sendChat('Jude 1:10: But these people blaspheme all that they do not understand, and they are destroyed by all that they, like unreasoning animals, understand instinctively.');
                        break;
                    case 10:
                        bot.sendChat('Jude 1:11: Woe to them! For they walked in the way of Cain and abandoned themselves for the sake of gain to the error of Balaam and perished in the rebellion of Korah.');
                        break;
                    case 11:
                        bot.sendChat('Jude 1:12: These are hidden reefs at your love feasts, as they feast with you without fear, shepherds feeding themselves; waterless clouds, swept along by winds; fruitless trees in late autumn, twice dead, uprooted;');
                        break;
                    case 12:
                        bot.sendChat('Jude 1:13: wild waves of the sea, casting up the foam of their own shame; wandering stars, for whom the gloom of utter darkness has been reserved forever.');
                        break;
                    case 13:
                        bot.sendChat('Jude 1:14: It was also about these that Enoch, the seventh from Adam, prophesied, saying, “Behold, the Lord comes with ten thousands of his holy ones,');
                        break;
                    case 14:
                        bot.sendChat('Jude 1:15: to execute judgment on all and to convict all the ungodly of all their deeds of ungodliness that they have committed in such an ungodly way, and of all the harsh things that ungodly sinners have spoken against him.”');
                        break;
                    case 15:
                        bot.sendChat('Jude 1:16: These are grumblers, malcontents, following their own sinful desires; they are loud-mouthed boasters, showing favoritism to gain advantage.');
                        break;
                    case 16:
                        bot.sendChat('Jude 1:17: But you must remember, beloved, the predictions of the apostles of our Lord Jesus Christ.');
                        break;
                    case 17:
                        bot.sendChat('Jude 1:18: They said to you, “In the last time there will be scoffers, following their own ungodly passions.”');
                        break;
                    case 18:
                        bot.sendChat('Jude 1:19: It is these who cause divisions, worldly people, devoid of the Spirit.');
                        break;
                    case 19:
                        bot.sendChat('Jude 1:20: But you, beloved, building yourselves up in your most holy faith and praying in the Holy Spirit,');
                        break;
                    case 20:
                        bot.sendChat('Jude 1:21: keep yourselves in the love of God, waiting for the mercy of our Lord Jesus Christ that leads to eternal life.');
                        break;
                    case 21:
                        bot.sendChat('Jude 1:22: And have mercy on those who doubt;');
                        break;
                    case 22:
                        bot.sendChat('Jude 1:23: save others by snatching them out of the fire; to others show mercy with fear, hating even the garment stained by the flesh.');
                        break;
                    case 23:
                        bot.sendChat('Jude 1:24: Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy,');
                        break;
                    case 24:
                        bot.sendChat('Jude 1:25: to the only God, our Savior, through Jesus Christ our Lord, be glory, majesty, dominion, and authority, before all time and now and forever. Amen.');
                        break;
                }
                break;
            case ".obadiah":
            case ".Obadiah":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var Obadiah = Math.floor(Math.random() * 20);
                switch(Obadiah){
                    case 0:
                        bot.sendChat('Obadiah 1:1: The vision of Obadiah. Thus says the Lord God concerning Edom:We have heard a report from the Lord, and a messenger has been sent among the nations: “Rise up! Let us rise against her for battle!”');
                        break;
                    case 1:
                        bot.sendChat('Obadiah 1:2: Behold, I will make you small among the nations; you shall be utterly despised.');
                        break;
                    case 2:
                        bot.sendChat('Obadiah 1:3: The pride of your heart has deceived you, you who live in the clefts of the rock, in your lofty dwelling, who say in your heart,  “Who will bring me down to the ground?”');
                        break;
                    case 3:
                        bot.sendChat('Obadiah 1:4: Though you soar aloft like the eagle, though your nest is set among the stars, from there I will bring you down, declares the Lord.');
                        break;
                    case 4:
                        bot.sendChat('Obadiah 1:5: If thieves came to you, if plunderers came by night— how you have been destroyed!— would they not steal only enough for themselves? If grape gatherers came to you, would they not leave gleanings?');
                        break;
                    case 5:
                        bot.sendChat('Obadiah 1:6: How Esau has been pillaged, his treasures sought out!');
                        break;
                    case 6:
                        bot.sendChat('Obadiah 1:7: All your allies have driven you to your border; those at peace with you have deceived you; they have prevailed against you; those who eat your bread have set a trap beneath you— you have no understanding.');
                        break;
                    case 7:
                        bot.sendChat('Obadiah 1:8: Will I not on that day, declares the Lord, destroy the wise men out of Edom, and understanding out of Mount Esau?');
                        break;
                    case 8:
                        bot.sendChat('Obadiah 1:9: And your mighty men shall be dismayed, O Teman, so that every man from Mount Esau will be cut off by slaughter.');
                        break;
                    case 9:
                        bot.sendChat('Obadiah 1:10: Because of the violence done to your brother Jacob, shame shall cover you, and you shall be cut off forever.');
                        break;
                    case 10:
                        bot.sendChat('Obadiah 1:11: On the day that you stood aloof, on the day that strangers carried off his wealth and foreigners entered his gates and cast lots for Jerusalem, you were like one of them.');
                        break;
                    case 11:
                        bot.sendChat('Obadiah 1:12: But do not gloat over the day of your brother in the day of his misfortune; do not rejoice over the people of Judah in the day of their ruin; do not boast in the day of distress.');
                        break;
                    case 12:
                        bot.sendChat('Obadiah 1:13: Do not enter the gate of my people in the day of their calamity; do not gloat over his disaster in the day of his calamity; do not loot his wealth in the day of his calamity.');
                        break;
                    case 13:
                        bot.sendChat('Obadiah 1:14: Do not stand at the crossroads to cut off his fugitives; do not hand over his survivors in the day of distress.');
                        break;
                    case 14:
                        bot.sendChat('Obadiah 1:15: For the day of the Lord is near upon all the nations. As you have done, it shall be done to you; your deeds shall return on your own head.');
                        break;
                    case 15:
                        bot.sendChat('Obadiah 1:16: For as you have drunk on my holy mountain, so all the nations shall drink continually; they shall drink and swallow, and shall be as though they had never been.');
                        break;
                    case 16:
                        bot.sendChat('Obadiah 1:17: But in Mount Zion there shall be those who escape, and it shall be holy, and the house of Jacob shall possess their own possessions.');
                        break;
                    case 17:
                        bot.sendChat('Obadiah 1:18: The house of Jacob shall be a fire, and the house of Joseph a flame, and the house of Esau stubble; they shall burn them and consume them, and there shall be no survivor for the house of Esau, for the Lord has spoken.');
                        break;
                    case 18:
                        bot.sendChat('Obadiah 1:19: Those of the Negeb shall possess Mount Esau, and those of the Shephelah shall possess the land of the Philistines; they shall possess the land of Ephraim and the land of Samaria, and Benjamin shall possess Gilead.');
                        break;
                    case 19:
                        bot.sendChat('Obadiah 1:20: The exiles of this host of the people of Israel shall possess the land of the Canaanites as far as Zarephath, and the exiles of Jerusalem who are in Sepharad shall possess the cities of the Negeb.');
                        break;
                    case 20:
                        bot.sendChat('Obadiah 1:21: Saviors shall go up to Mount Zion to rule Mount Esau, and the kingdom shall be the Lords.');
                        break;
                }
                break;
            case ".titus":
            case ".Titus":
                crowd = bot.getUsers();
                randomPerson = Math.floor(Math.random() * crowd.length);
                var Titus = Math.floor(Math.random() * 45);
                switch(Titus){
                    case 0:
                        bot.sendChat('Titus 1:1: Paul, a servant of God and an apostle of Jesus Christ, for the sake of the faith of the elect of God and their knowledge of the truth, which accords with godliness,');
                        break;
                    case 1:
                        bot.sendChat('Titus 1:2: in hope of eternal life, which God, who never lies, promised before the ages began');
                        break;
                    case 2:
                        bot.sendChat('Titus 1:3: and at the proper time manifested in his word through the preaching with which I have been entrusted by the command of God our Savior;');
                        break;
                    case 3:
                        bot.sendChat('Titus 1:4: To Titus, my true child in a common faith: Grace and peace from God the Father and Christ Jesus our Savior.');
                        break;
                    case 4:
                        bot.sendChat('Titus 1:5: This is why I left you in Crete, so that you might put what remained into order, and appoint elders in every town as I directed you—');
                        break;
                    case 5:
                        bot.sendChat('Titus 1:6: if anyone is above reproach, the husband of one wife, and his children are believers and not open to the charge of debauchery or insubordination.');
                        break;
                    case 6:
                        bot.sendChat('Titus 1:7: For an overseer, as the steward of God, must be above reproach. He must not be arrogant or quick-tempered or a drunkard or violent or greedy for gain,');
                        break;
                    case 7:
                        bot.sendChat('Titus 1:8: but hospitable, a lover of good, self-controlled, upright, holy, and disciplined.');
                        break;
                    case 8:
                        bot.sendChat('Titus 1:9: He must hold firm to the trustworthy word as taught, so that he may be able to give instruction in sound[f] doctrine and also to rebuke those who contradict it.');
                        break;
                    case 9:
                        bot.sendChat('Titus 1:10: For there are many who are insubordinate, empty talkers and deceivers, especially those of the circumcision party.');
                        break;
                    case 10:
                        bot.sendChat('Titus 1:11: They must be silenced, since they are upsetting whole families by teaching for shameful gain what they ought not to teach.');
                        break;
                    case 11:
                        bot.sendChat('Titus 1:12: One of the Cretans, a prophet of their own, said, “Cretans are always liars, evil beasts, lazy gluttons.”');
                        break;
                    case 12:
                        bot.sendChat('Titus 1:13: This testimony is true. Therefore rebuke them sharply, that they may be sound in the faith,');
                        break;
                    case 13:
                        bot.sendChat('Titus 1:14: not devoting themselves to Jewish myths and the commands of people who turn away from the truth.');
                        break;
                    case 14:
                        bot.sendChat('Titus 1:15: To the pure, all things are pure, but to the defiled and unbelieving, nothing is pure; but both their minds and their consciences are defiled.');
                        break;
                    case 15:
                        bot.sendChat('Titus 1:16: They profess to know God, but they deny him by their works. They are detestable, disobedient, unfit for any good work.');
                        break;
                    case 16:
                        bot.sendChat('Titus 2:1: But as for you, teach what accords with sound doctrine.');
                        break;
                    case 17:
                        bot.sendChat('Titus 2:2: Older men are to be sober-minded, dignified, self-controlled, sound in faith, in love, and in steadfastness.');
                        break;
                    case 18:
                        bot.sendChat('Titus 2:3: Older women likewise are to be reverent in behavior, not slanderers or slaves to much wine. They are to teach what is good,');
                        break;
                    case 19:
                        bot.sendChat('Titus 2:4: and so train the young women to love their husbands and children,');
                        break;
                    case 20:
                        bot.sendChat('Titus 2:5: to be self-controlled, pure, working at home, kind, and submissive to their own husbands, that the word of God may not be reviled.');
                        break;
                    case 21:
                        bot.sendChat('Titus 2:6: Likewise, urge the younger men to be self-controlled.');
                        break;
                    case 22:
                        bot.sendChat('Titus 2:7: Show yourself in all respects to be a model of good works, and in your teaching show integrity, dignity,');
                        break;
                    case 23:
                        bot.sendChat('Titus 2:8: and sound speech that cannot be condemned, so that an opponent may be put to shame, having nothing evil to say about us.');
                        break;
                    case 24:
                        bot.sendChat('Titus 2:9: Bondservants are to be submissive to their own masters in everything; they are to be well-pleasing, not argumentative,');
                        break;
                    case 25:
                        bot.sendChat('Titus 2:10: not pilfering, but showing all good faith, so that in everything they may adorn the doctrine of God our Savior.');
                        break;
                    case 26:
                        bot.sendChat('Titus 2:11: For the grace of God has appeared, bringing salvation for all people,');
                        break;
                    case 27:
                        bot.sendChat('Titus 2:12: training us to renounce ungodliness and worldly passions, and to live self-controlled, upright, and godly lives in the present age,');
                        break;
                    case 28:
                        bot.sendChat('Titus 2:13: waiting for our blessed hope, the appearing of the glory of our great God and Savior Jesus Christ,');
                        break;
                    case 29:
                        bot.sendChat('Titus 2:14: who gave himself for us to redeem us from all lawlessness and to purify for himself a people for his own possession who are zealous for good works.');
                        break;
                    case 30:
                        bot.sendChat('Titus 2:15: Declare these things; exhort and rebuke with all authority. Let no one disregard you.');
                        break;
                    case 31:
                        bot.sendChat('Titus 3:1: Remind them to be submissive to rulers and authorities, to be obedient, to be ready for every good work,');
                        break;
                    case 32:
                        bot.sendChat('Titus 3:2: to speak evil of no one, to avoid quarreling, to be gentle, and to show perfect courtesy toward all people.');
                        break;
                    case 33:
                        bot.sendChat('Titus 3:3: For we ourselves were once foolish, disobedient, led astray, slaves to various passions and pleasures, passing our days in malice and envy, hated by others and hating one another.');
                        break;
                    case 34:
                        bot.sendChat('Titus 3:4: But when the goodness and loving kindness of God our Savior appeared,');
                        break;
                    case 35:
                        bot.sendChat('Titus 3:5: he saved us, not because of works done by us in righteousness, but according to his own mercy, by the washing of regeneration and renewal of the Holy Spirit,');
                        break;
                    case 36:
                        bot.sendChat('Titus 3:6: whom he poured out on us richly through Jesus Christ our Savior,');
                        break;
                    case 37:
                        bot.sendChat('Titus 3:7: so that being justified by his grace we might become heirs according to the hope of eternal life.');
                        break;
                    case 38:
                        bot.sendChat('Titus 3:8: The saying is trustworthy, and I want you to insist on these things, so that those who have believed in God may be careful to devote themselves to good works. These things are excellent and profitable for people.');
                        break;
                    case 39:
                        bot.sendChat('Titus 3:9: But avoid foolish controversies, genealogies, dissensions, and quarrels about the law, for they are unprofitable and worthless.');
                        break;
                    case 40:
                        bot.sendChat('Titus 3:10: As for a person who stirs up division, after warning him once and then twice, have nothing more to do with him,');
                        break;    
                    case 41:
                        bot.sendChat('Titus 3:11: knowing that such a person is warped and sinful; he is self-condemned.');
                        break;
                    case 42:
                        bot.sendChat('Titus 3:12: When I send Artemas or Tychicus to you, do your best to come to me at Nicopolis, for I have decided to spend the winter there.');
                        break;
                    case 43:
                        bot.sendChat('Titus 3:13: Do your best to speed Zenas the lawyer and Apollos on their way; see that they lack nothing.');
                        break;
                    case 44:
                        bot.sendChat('Titus 3:14: And let our people learn to devote themselves to good works, so as to help cases of urgent need, and not be unfruitful.');
                        break;
                    case 45:
                        bot.sendChat('Titus 3:15: All who are with me send greetings to you. Greet those who love us in the faith. Grace be with you all.');
                        break;
                }
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
                                        bot.sendChat(user + ": " + data + " (" + languages[languageCodes.indexOf(language)] + ")");
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
                                        bot.sendChat(command + " " + data);
                                    });
                                });
                            }
                        }
                    }
                }
            // bot.getMedia(function(currentMedia) { 
            //     media = currentMedia; 
            // });
            // bot.getDJ(function(currentDJ) { 
            //     dj = currentDJ; 
            // });
                break;
            }
        });