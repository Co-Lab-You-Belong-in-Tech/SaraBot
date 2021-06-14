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
