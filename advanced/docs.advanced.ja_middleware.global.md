//  Acme ID
async function authWithAcme({ payload, client, context, next }) {
  const slackUserId = payload.user;
  const helpChannelId = 'C12345';

  // Slack ID
  try {
    const user = await acme.lookupBySlackId(slackUserId)
    
  } catch (error) {
      // Acme
      if (error.message === 'Not Found') {
        await client.chat.postEphemeral({
          channel: payload.channel,
          user: slackUserId,
          text: `Sorry <@${slackUserId}>, you aren't registered in Acme. Please post in <#${helpChannelId}> for assistance.`
        });
        return;
      }
      //throw error;
  }
  await next();
}
