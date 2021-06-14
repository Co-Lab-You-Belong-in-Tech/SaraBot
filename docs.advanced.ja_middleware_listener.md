// 'bot_message' サブタイプを持つメッセージをフィルタリングするリスナーミドルウェア
async function noBotMessages({ message, next }) {
  if (!message.subtype || message.subtype !== 'bot_message') {
    await next();
  }
}

// ボットではなく人間からのメッセージのみを受信するリスナー
app.message(noBotMessages, async ({ message }) => console.log(
  `(MSG) User: ${message.user}
   Message: ${message.text}`
));
