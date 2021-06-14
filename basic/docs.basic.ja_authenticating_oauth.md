const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:read', 'groups:read', 'channels:manage', 'chat:write', 'incoming-webhook'],
  installationStore: {
    storeInstallation: async (installation) => {
      // 実際のデータベースに保存するために、ここのコードを変更
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        // OrG 全体へのインストールに対応する場合
        return await database.set(installation.enterprise.id, installation);
      }
      if (installation.team !== undefined) {
        // 単独のワークスペースへのインストールの場合
        return await database.set(installation.team.id, installation);
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      // 実際のデータベースから取得するために、ここのコードを変更
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // OrG 全体へのインストール情報の参照
        return await database.get(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // 単独のワークスペースへのインストール情報の参照
        return await database.get(installQuery.teamId);
      }
      throw new Error('Failed fetching installation');
    },
  },
});
