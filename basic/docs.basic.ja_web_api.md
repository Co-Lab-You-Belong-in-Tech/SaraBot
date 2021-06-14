const whenSeptemberEnds = '1569887999';

app.message('wake me up', async ({ message, context }) => {
  try {
    // トークンを用いて chat.scheduleMessage 関数を呼び出す
    const result = await app.client.chat.scheduleMessage({
      // アプリの初期化に用いたトークンを `context` オブジェクトに保存
      token: context.botToken,
      channel: message.channel,
      post_at: whenSeptemberEnds,
      text: 'Summer has come and passed'
    });
  }
  catch (error) {
    console.error(error);
  }
});
