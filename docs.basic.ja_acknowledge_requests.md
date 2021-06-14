// Regex でメールアドレスが有効かチェック
let isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
// 制約付きのオブジェクト を使用して ticket_submit という callback_id を持つダイアログ送信をリッスン
app.action({ callback_id: 'ticket_submit' }, async ({ action, ack }) => {
  // メールアドレスが有効。ダイアログを受信
  if (isEmail.test(action.submission.email)) {
    await ack();
  } else {
    // メールアドレスが無効。エラーを確認
    await ack({
      errors: [{
        "name": "email_address",
        "error": "Sorry, this isn’t a valid email"
      }]
    });
  }
});
