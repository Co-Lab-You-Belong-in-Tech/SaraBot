// action_id: button_abc
app.action('button_abc', async ({ ack, body, client }) => {
  await ack();

  try {
    const result = await client.views.update({
      view_id: body.view.id,
      //hash 
      hash: body.view.hash,
      view: {
        type: 'modal',
        // callback_id view
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Updated modal'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'You updated the modal!'
            }
          },
          {
            type: 'image',
            image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
            alt_text: 'Yay! The modal was updated'
          }
        ]
      }
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});
