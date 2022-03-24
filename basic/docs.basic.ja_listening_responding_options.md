app.options('external_action', async ({ options, ack }) => {
  const results = await db.get(options.team.id);

  if (results) {
    let options = [];
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
