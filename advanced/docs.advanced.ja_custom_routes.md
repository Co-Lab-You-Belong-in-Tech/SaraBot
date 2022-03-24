const { App, ExpressReceiver } = require('@slack/bolt');

// Bolt Receiver 
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// App
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

// Slack 
app.event('message', async ({ event, client }) => {
  // Do some slack-specific stuff here
  await client.chat.postMessage(...);
});

// Web  receiver.router 
receiver.router.post('/secret-page', (req, res) => {
  // Express 
  res.send('yay!');
});

(async () => {
  await app.start(8080);
  console.log('app is running');
})();
