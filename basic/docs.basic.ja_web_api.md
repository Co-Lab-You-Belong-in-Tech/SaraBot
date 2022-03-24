const whenSeptemberEnds = '1569887999';

app.message('wake me up', async ({ message, context }) => {
  try {
    //chat.scheduleMessage
    const result = await app.client.chat.scheduleMessage({
      // `context` 
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
