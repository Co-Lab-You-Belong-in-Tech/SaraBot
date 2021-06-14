app.view('view_b', async ({ ack, body, view, client }) => {
  // モーダルでのデータ送信イベントを確認
  await ack();

  // 入力値を使ってやりたいことをここで実装 - ここでは DB に保存して送信内容の確認を送っている

  // block_id: block_1 という input ブロック内で action_id: input_a の場合の入力
  const val = view['state']['values']['block_1']['input_a'];
  const user = body['user']['id'];

  // ユーザーに対して送信するメッセージ
  let msg = '';
  // DB に保存
  const results = await db.set(user.input, val);

  if (results) {
    // DB への保存が成功
    msg = 'Your submission was successful';
  } else {
    msg = 'There was an error with your submission';
  }

  // ユーザーにメッセージを送信
  try {
    await client.chat.postMessage({
      channel: user,
      text: msg
    });
  }
  catch (error) {
    console.error(error);
  }

});
