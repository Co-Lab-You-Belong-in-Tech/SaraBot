const app = new App({
  token,
  signingSecret
  convoStore: new simpleConvoStore()
});

// Firebase conversation store
class simpleConvoStore {
  set(conversationId, value, expiresAt) {
    // Promise
    return db().ref('conversations/' + conversationId).set({ value, expiresAt });
  }

  get(conversationId) {
    // Promise 
    return new Promise((resolve, reject) => {
      db().ref('conversations/' + conversationId).once('value').then((result) => {
        if (result !== undefined) {
          if (result.expiresAt !== undefined && Date.now() > result.expiresAt) {
            db().ref('conversations/' + conversationId).delete();

            reject(new Error('Conversation expired'));
          }
          resolve(result.value)
        } else {
          // Conversation 
          reject(new Error('Conversation not found'));
        }
      });
    });
  }
}
