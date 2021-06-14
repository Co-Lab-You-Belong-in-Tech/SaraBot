// Authentication middleware that associates incoming event with user in Acme identity provider
async function authWithAcme({ payload, client, context, next }) {
  const slackUserId = payload.user;
  const helpChannelId = 'C12345';

  // Assume we have a function that accepts a Slack user ID to find user details from Acme
  try {
    // Assume we have a function that can take a Slack user ID as input to find user details from the provider
    const user = await acme.lookupBySlackId(slackUserId);
      
    // When the user lookup is successful, add the user details to the context
    context.user = user;
  } catch (error) {
    // This user wasn't found in Acme. Send them an error and don't continue processing event
    if (error.message === 'Not Found') {
        await client.chat.postEphemeral({
          channel: payload.channel,
          user: slackUserId,
          text: `Sorry <@${slackUserId}>, you aren't registered in Acme. Please post in <#${helpChannelId}> for assistance.`
        });
        return;
    }
    
    // Pass control to previous middleware (if any) or the global error handler
    throw error;
  }
  
  // Pass control to the next middleware (if there are any) and the listener functions
  // Note: You probably don't want to call this inside a `try` block, or any middleware
  //       after this one that throws will be caught by it. 
  await next();
}
