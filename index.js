var Botkit = require('botkit')

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
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



bot.api.chat.postMessage(
  {
    text: 'Hi, I am Francis J Underwood, welcome to Slack! It is great to talk to you! \nIf you want me to stop helping at any point, say "opt out"',
    as_user:true,
    channel: 'U11NXAJU8' // a valid slack channel, group, mpim, or im ID
  }
);


controller.hears(['hello', 'hi', 'hola', 'sup', 'ola'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hi, I am Francis J Underwood, welcome to Slack! It is great to talk to you!')
  bot.reply(message, 'If you want me to stop helping at any point, say "opt out"')
})


controller.hears(['opt out', 'optout'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Great! I am here if you want help. Just say "opt in" if you need anything')
})



controller.hears(['opt in', 'optin'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('*Phew* I\'m back! Would you like to continue learning about Slack?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Okay, let\'s continue with where we left off. \nThis is what you look like in chats. Edit your profile details by tapping on your image or your name here:');
                    convo.say({
                        "text": "I am a test message http://i.imgur.com/E5i8kwl.png",
                        "attachments": [
                            {
                                "text": "And here's an attachment!"
                            }
                        ]
                    })
                    convo.say('let me know when you are done editing your details');
                    convo.say('`I\'m done` `Skip this step`');
//                    convo.say('`Skip this step`');
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
