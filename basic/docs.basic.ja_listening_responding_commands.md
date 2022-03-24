app.command('/echo', async ({ command, ack, say }) => {
  await ack();

  await say(`${command.text}`);
});
