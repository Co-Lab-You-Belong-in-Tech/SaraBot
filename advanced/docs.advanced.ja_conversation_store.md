const app = new App({
  token,
  signingSecret,
  // クラスを作成する感じで
  convoStore: new simpleConvoStore()
});

// Firebaseのようなデータベースを使い conversation store を実装
class simpleConvoStore {
  set(conversationId, value, expiresAt) {
    // Promise を返す
    return db().ref('conversations/' + conversationId).set({ value, expiresAt });
  }

  get(conversationId) {
    // Promise を返す
    return new Promise((resolve, reject) => {
      db().ref('conversations/' + conversationId).once('value').then((result) => {
        if (result !== undefined) {
          if (result.expiresAt !== undefined && Date.now() > result.expiresAt) {
            db().ref('conversations/' + conversationId).delete();

            reject(new Error('Conversation expired'));
          }
          resolve(result.value)
        } else {
          // Conversation が存在しないエラー
          reject(new Error('Conversation not found'));
        }
      });
    });
  }
}
