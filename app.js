//Author: Cameron Mayes
//Version: 1.0.0
var restify = require('restify');
var builder = require('botbuilder');

//Setting up restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//Creating chat bot and listening to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

//Setting up the bot
var bot = new builder.UniversalBot(connector, function(session){
    session.send("Hello, what can I do for you today? (Type option(s) for list of options)");
});

//Running the main dialog
bot.dialog('mainDialog', [
    function(session){
        builder.Prompts.text(session, "Please Select an option: News|Weather");
        session.send(" or type cancel to end the session");
    },
    function(session, results){
        // console.log("\n\n\n\n\n" + results.response + "\n\n\n");
         var card = getCard(session, results);
         var reply = new builder.Message(session).addAttachment(card);
         console.log("\n\n\n\nREPLY!!!!" + reply);
         session.send(reply);
    }
]).triggerAction({
        matches: /^option*s*/i
});

//Ending the session on user request. "Cancel"
bot.dialog('cancelDialog', function(session){
    session.endConversation("Goodbye.");
}).triggerAction({
        matches: /cancel/i
});

//Creating the appropriate card to send back to the user.
function getCard(session, results){
    //console.log("\n\n\n\n\n" + results.response.entity + "\n\n\n");
    var cardType = results.response.toLowerCase();
    var card;
    switch(cardType){
        case "weather":
            card = new builder.HeroCard(session)
            .title('Weather Channel')
            .subtitle('See what the day has in store!')
            .text('No matter the activies you have planned for the day, stay up to date and prepared!')
            .images([
                builder.CardImage.create(session, 'http://www.noaa.gov/sites/default/files/styles/crop_394x394/public/thumbnails/image/FocusArea__Weather-02.jpg?itok=fO6wu2A8')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://weather.com/', 'Visit weather.com')
            ])
            break;
        case "news":
            card = new builder.HeroCard(session)
            .title('News')
            .subtitle('Stay up to date on current events!')
            .text('Did you hear, read, or see what happened? If not, catch up!')
            .images([
                builder.CardImage.create(session, 'http://www.sandyspringsga.gov/Home/ShowImage?id=4167&t=636220939703270000')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.washingtonpost.com', 'Click')
            ])
            break;
        default:
            card = new builder.HeroCard(session)
            .title('Uh-oh!')
            .subtitle('Looks like you didn\'\t pick a valid option')
            .text('Here\'\s a random card')
            .images([
                builder.CardImage.create(session, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPRM0a8dXcSGS11mpQp_-t1Rq5xCjKRGAgV27zbpqVFVV00aML')
            ])
            break;
    }
    return card;
}



