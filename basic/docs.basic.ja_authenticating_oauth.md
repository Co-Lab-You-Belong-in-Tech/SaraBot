const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:read', 'groups:read', 'channels:manage', 'chat:write', 'incoming-webhook'],
  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        return await database.set(installation.enterprise.id, installation);
      }
      if (installation.team !== undefined) {
        return await database.set(installation.team.id, installation);
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        return await database.get(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        return await database.get(installQuery.teamId);
      }
      throw new Error('Failed fetching installation');
    },
  },
});
