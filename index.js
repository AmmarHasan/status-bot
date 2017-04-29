var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

var channel;
controller.on('bot_channel_join', function (bot, message) {
  channel = message.channel;
  bot.reply(message, "I'm here!")
})

controller.on('user_change', function (bot, message) {
  var status = message.user.profile;
  var name = message.user.real_name || message.user.name;
  bot.say({
    // text: `${name} is *${status.status_text} ${status.status_emoji}*`,
    attachments: [
      {
        color: '#36a64f',
        text: `${name} is *${status.status_text} ${status.status_emoji}*`,
        mrkdwn_in: ['text'],
        thumb_url: status.image_72
      }
    ],
    channel: channel
  });
})
