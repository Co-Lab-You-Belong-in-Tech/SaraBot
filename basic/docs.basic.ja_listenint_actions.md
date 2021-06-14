// action_id が "approve_button" のインタラクティブコンポーネントがトリガーされる毎にミドルウェアが呼び出される
app.action('approve_button', async ({ ack }) => {
  await ack();
  // アクションを反映してメッセージをアップデート
});
