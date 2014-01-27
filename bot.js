var PlugAPI = require('./plugapi');
var ROOM = 'christian-anything-2';
var UPDATECODE = 'p9R*'; 

var Lastfm = require('simple-lastfm');
var version = "1.4.0";

var lastfm = new Lastfm({
    api_key: 'dc116468a760d9c586562d79e302aadf',
    api_secret: 'c68c25364ccfa0961f60abe9250f8233',
    username: 'kingzimmer',
    password: 'Starwarskotor1'
});

var mlexer = require('math-lexer');
var google_geocoding = require('google-geocoding');
var weather = require('weathers');

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
        console.log(data, bot.getUser(data.currentDJ));
        console.log(bot.getDJs()[0].username, bot.getDJs());
    });
    
    bot.on('chat', function(data) {
        //if (data.from == 'christian-anything-2') {
            var command = data.message.split(' ')[0];
            var firstIndex = data.message.indexOf(' ');
            var qualifier = "";
            if (firstIndex!=-1) {
                qualifier = data.message.substring(firstIndex+1, data.message.length); 
            }
            switch (command)
            {
                case ".commands":
                    bot.chat("List of Commands: .commands, .hey, .woot, .meh, .props, .calc, .join, .leave, .skip, .forecast, .version, .artist, .track, .genre, .github, .help");
                    break;
                case ".hey":
                    bot.chat("Well hey there! @" + data.from);
                    break;
                case ".woot":
                    bot.woot();
                    bot.chat("I love this song.");
                    break;
                case ".meh":
                    bot.meh();
                    bot.chat("I hate this song.");
                    break;
                case ".props":
                    console.log(bot.getDJs()[0].username, bot.getDJs(), bot.getDJs()[0]);
                    bot.chat("Epic Play! @" + bot.getDJs()[0].username);
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
                    if (qualifier!="" && !(/\d\(/g.test(qualifier)) && !(/[\!\,\@\'\"\?\#\$\%\&\_\=\<\>\:\;\[\]\{\}\`\~\|]/g.test(qualifier)) &&  !(/\^\s{0,}\d{0,}\s{0,}\^/g.test(qualifier)) && !(/\)\d/g.test(qualifier)) && !(/^[\+\-\*\/\^]/g.test(qualifier)) && !(/[\+\-\*\/\^]$/g.test(qualifier)) && !(/[\+\-\*\/\^]\s{0,}[\+\-\*\/\^]/g.test(qualifier)) && !(/([a-zA-Z])\d/g.test(qualifier)) && !(/\d([a-zA-Z])/g.test(qualifier)) && !(/\d\s{1,}\d/g.test(qualifier)) && !(/\s\.\s/g.test(qualifier)) && !(/\.\d\./g.test(qualifier)) && !(/\d\.\s{1,}\d/g.test(qualifier)) && !(/\d\s{1,}\.\d/g.test(qualifier)) && !(/\.\./g.test(qualifier)) && counter==counter2){
                        var func=qualifier;
                        func+=" + (0*x) + (0*y)";
                        var realfunc=mlexer.parseString(func);
                        var answer=(realfunc({x:0,y:0}));
                        if (answer.toString()!="NaN"){
                            bot.chat(answer.toString());
                        }
                        else{
                            bot.chat("/me does not compute.");
                        }
                    }
                    else{
                        bot.chat("/me does not compute.");
                    }
                    break;
                case ".join":
                    bot.waitListJoin();
                    bot.chat("Joining The Waitlist!");
                    break;
                case ".leave":
                    bot.waitListLeave();
                    bot.chat("Leaving The Waitlist.");
                    break;
                case ".skip":
                    bot.skipSong();
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
                                        else{
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
                                else{
                                    bot.chat("No weather found.")
                                }
                            });
                        }
                        else{
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
                    else{
                        artistChoice=qualifier;
                    }
                    lastfm.getArtistInfo({
                        artist: artistChoice,
                        callback: function(result) { 
                            //console.log(result);
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
                            //console.log(result);
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
                    else{
                        artistChoice=qualifier;
                        trackChoice=null;
                    }
                    lastfm.getTags({
                        artist: artistChoice,
                        track: trackChoice,
                        callback: function(result) {
                            //console.log(result);
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
                                    bot.chat("No genre found.")
                                }
                            }
                            else{
                                if (tags!=""){
                                    bot.chat("Genre of "+artistChoice+": "+tags);
                                }
                                else{
                                    bot.chat("No genre found.")
                                }
                            }
                        }
                    });
                    break;
                case ".github":
                    bot.chat("Check me out on GitHub! https://github.com/Spiderlover/Mega-Bot");
                    break;
                case ".help":
                    bot.chat("Welcome to Plug.DJ! You can populate your playlists by finding songs with YouTube and Soundcloud.");
                    break;
              }
        });
    });
});