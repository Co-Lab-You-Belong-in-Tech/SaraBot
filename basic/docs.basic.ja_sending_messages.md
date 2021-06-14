// Listens for messages containing "knock knock" and responds with an italicized "who's there?"
app.message('knock knock', async ({ message, say }) => {
  await say(`_Who's there?_`);
});
