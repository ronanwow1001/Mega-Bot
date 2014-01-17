var PlugAPI = require('./plugapi');
var ROOM = 'christian-anything-2';
var UPDATECODE = '_:8s[H@*dnPe!nNerEM'; 

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
    
    var reconnect = function() { bot.connect('christian-anything-2'); };

    bot.on('close', reconnect);
    bot.on('error', reconnect);
    
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
                    bot.chat("List of Commands: .commands, .hey, .woot, .meh, .props");
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
            }
        });
    });
});