title	lang	slug	order
Authorization
en
authorization
2
Authorization is the process of deciding which Slack credentials (such as a bot token) should be available while processing a specific incoming event.
Custom apps installed on a single workspace can simply use the token option at the time of App initialization. However, when your app needs to handle several tokens, such as cases where it will be installed on multiple workspaces or needs access to more than one user token, the authorize option should be used instead. If you're using the built-in OAuth support authorization is handled by default, so you do not need to pass in an authorize option.

The authorize option can be set to a function that takes an event source as its input, and should return a Promise for an object containing the authorized credentials. The source contains information about who and where the event is coming from by using properties like teamId (always available), userId, conversationId, and enterpriseId.

The authorized credentials should also have a few specific properties: botToken, userToken, botId (required for an app to ignore messages from itself), and botUserId. You can also include any other properties you'd like to make available on the context object.

You should always provide either one or both of the botToken and userToken properties. At least one of them is necessary to make helpers like say() work. If they are both given, then botToken will take precedence.

const app = new App({ authorize: authorizeFn, signingSecret: process.env.SLACK_SIGNING_SECRET });

// NOTE: This is for demonstration purposes only.
// All sensitive data should be stored in a secure database
// Assuming this app only uses bot tokens, the following object represents a model for storing the credentials as the app is installed into multiple workspaces.

const installations = [
  {
    enterpriseId: '',
    teamId: '',
    botToken: '',
    botId: '',
    botUserId: '',
  },
  {
    teamId: '',
    botToken: '',
    botId: '',
    botUserId: '',
  },
];

const authorizeFn = async ({ teamId, enterpriseId }) => {
  // Fetch team info from database
  for (const team of installations) {
    // Check for matching teamId and enterpriseId in the installations array
    if ((team.teamId === teamId) && (team.enterpriseId === enterpriseId)) {
      // This is a match. Use these installation credentials.
      return {
        // You could also set userToken instead
        botToken: team.botToken,
        botId: team.botId,
        botUserId: team.botUserId
      };
    }
  }

  throw new Error('No matching authorizations');
}
?? 2021 GitHub, Inc.
