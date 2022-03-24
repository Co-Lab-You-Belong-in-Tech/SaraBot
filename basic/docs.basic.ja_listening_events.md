const welcomeChannelId = 'C12345';

app.event('team_join', async ({ event, client }) => {
  try {
    const result = await client.chat.postMessage({
      channel: welcomeChannelId,
      text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});
