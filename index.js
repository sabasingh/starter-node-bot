var Botkit = require('botkit')
//var Slack = require("slack-client");

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
//var slack = new Slack(token, true, true);
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

var controller = Botkit.slackbot()
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }
})

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

//var Slack = require("slack-client");
//var slack = new Slack(token, true, true);
//// login dance 
//slack._send({
//  id: 1,
//  type: "typing",
//  channel: "U11NXAJU8"
//});


//bot.api.chat._send({id: 1,
//  type: "typing",
//  channel: "U11NXAJU8"
//});


bot.api.chat.postMessage({
//    "id": 1,
//    "type": "typing",
    text: 'Hey, I am Francis J Underwood, welcome to Slack! I\'m here to help you understand what you can do on Slack! \nIf you want me to stop helping at any point, just tap opt out. \nShall we start learning Slack? Just type "yes" or "no"',
    as_user:true,
    channel: 'U11NXAJU8', // a valid slack channel, group, mpim, or im ID
  });


controller.hears(['no', 'nope', 'nah', 'not yet', ], ['direct_message'], function (bot, message) {
  bot.startConversation(message, function(err, convo) {
    convo.say({
        "text": "Okay. I am here if you want help. Just say 'opt in' if you need anything"
      });
  })
});






//-----------------------------------------edit profile conversation---------------------------
controller.hears(['yes', 'yea', 'y', 'sure', 'okay'], ['direct_message'], function (bot, message) {
  bot.startConversation(message, function(err, convo) {
    convo.say({
        "text": "Okay. First let's look at your profile. This is what you look like in chats. Edit your profile details by tapping on your image or your name here:",
        "attachments": [{
                "image_url": "http://i.imgur.com/E5i8kwl.png",
                "text":"cover this text."
            }]
      });
    convo.say({
        "text":"when you are done, just tap on I\'m done below",
        "attachments": [{
            "image_url": "http://i.imgur.com/8fNIC7S.png",
            "text":"cover this text with buttons",
            "color": "#ffffff",
        }]
    });
    convo.next();
  })
});


//WAIT FOR A FEW SECONDS TILL YOU ARE DONE TYPING IM DONE


bot.api.chat.postMessage({ //SHOULD ONLY HAPPEN AFTER THE IM DONE BUTTON ON EDIT PROFILE IS SELECTED
        text: 'If you want to edit your profile at any time, tap on the ... icon, go to settings, and then go to edit profile',
        as_user:true,
        channel: 'U11NXAJU8', // a valid slack channel, group, mpim, or im ID
     });








//-----------------------------------------you can ask me questions at any time---------------------------

bot.api.chat.postMessage({ //SHOULD ONLY HAPPEN AFTER THE ... ICON ANIMATION IS DONE
        text: 'If you have any questions, you can ask me at any time. What do you want to know about?',
        as_user:true,
        channel: 'U11NXAJU8', // a valid slack channel, group, mpim, or im ID
     });

controller.hears(['job', 'title', 'job title'], ['direct message'], function (bot,message){
    bot.startConversation(message, function(err, convo) {
        convo.say({
            "text":"You can change your Job Title by tapping on the ... icon, tapping on Settings, and then going to Edit Profile",
            "attachments": [{
                "image_url": "http://i.imgur.com/8fNIC7S.png",
                "text":"this is tell me more and show me buttons."
            }]
           });
        });
    });





//-----------------------------------------random hello message---------------------------
controller.hears(['hello', 'hi', 'hola', 'sup', 'ola'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hi, I am Francis J Underwood, welcome to Slack! It is great to talk to you! What can I help you learn about Slack today?')
  bot.reply(message, 'If you want me to stop helping at any point, say "opt out"')
});







//-----------------------------------------opt out message---------------------------
controller.hears(['opt out', 'optout'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Great! I am here if you want help. Just say "opt in" if you need anything')
});



//BOT IS TYPING INDICATOR
//COMPLETE CONVERSATION LOGIC
//GET BOT.API.CHAT TO ONLY WORK IN ORDER
//opt out to DEACTIVATE THE BOT
//-----------------------------------------opt in conversation starting at edit profile---------------------------
controller.hears(['opt in', 'optin'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('*Phew* I\'m back! Would you like to continue learning about Slack?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say({
                        "text":"Okay. This is what you look like in chats. Edit your ptofile details by tapping on your image or your name here:",
                        "attachments": [{
                            "image_url": "http://i.imgur.com/E5i8kwl.png",
                            "text":"cover this text."
                        }]
                      });
                    convo.say({
                        "text":"when you are done, just tap on I\'m done below",
                        "attachments": [{
                            "image_url": "http://i.imgur.com/8fNIC7S.png",
                            "text":"cover this text with buttons",
                            "color": "#ffffff",
                        }]
                    });
                    convo.next();
              }
            },
            {
                pattern: bot.utterances.no,
                default: true,
                callback: function(response, convo) {
                    convo.say('Okay, just say "opt in" when you need me to help out again.');
                    convo.next();
                }
            }
        ])
    });
});


//------------------------------------------------------------------------------------------------------------------------------------------


controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
