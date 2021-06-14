app.options('external_action', async ({ options, ack }) => {
  // チームまたはチャンネル情報を取得
  const results = await db.get(options.team.id);

  if (results) {
    let options = [];
    // ack 応答 するために options 配列に情報をプッシュ
    for (const result of results) {
      options.push({
        "text": {
          "type": "plain_text",
          "text": result.label
        },
        "value": result.value
      });
    }

    await ack({
      "options": options
    });
  } else {
    await ack();
  }
});
