//  Acme ID情報管理プロバイダ上のユーザからの着信イベントと紐つけた認証ミドルウェア
async function authWithAcme({ payload, client, context, next }) {
  const slackUserId = payload.user;
  const helpChannelId = 'C12345';

  // Slack ユーザ ID を使って Acmeシステム上にあるユーザ情報を検索できる関数があるとと仮定
  try {
    const user = await acme.lookupBySlackId(slackUserId)
    
    // 検索できたらそのユーザ情報でコンテクストを生成
    context.user = user;
  } catch (error) {
      // Acme システム上にユーザが存在しないのでエラーをわたし、イベントプロセスを終了
      if (error.message === 'Not Found') {
        await client.chat.postEphemeral({
          channel: payload.channel,
          user: slackUserId,
          text: `Sorry <@${slackUserId}>, you aren't registered in Acme. Please post in <#${helpChannelId}> for assistance.`
        });
        return;
      }

      // 制御とリスナー関数を（もしあれば）前のミドルウェア渡す、もしくはグローバルエラーハンドラに引き渡し
      throw error;
  }
  
  // 制御とリスナー関数を次のミドルウェアに引き渡し
  await next();
}
