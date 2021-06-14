const { App, ExpressReceiver } = require('@slack/bolt');

// Bolt の Receiver を明に生成
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// App をこのレシーバーを指定して生成
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

// Slack とのやりとりは App のメソッドで定義
app.event('message', async ({ event, client }) => {
  // Do some slack-specific stuff here
  await client.chat.postMessage(...);
});

// それ以外の Web リクエストの処理は receiver.router のメソッドで定義
receiver.router.post('/secret-page', (req, res) => {
  // ここでは Express のリクエストやレスポンスをそのまま扱う
  res.send('yay!');
});

(async () => {
  await app.start(8080);
  console.log('app is running');
})();
