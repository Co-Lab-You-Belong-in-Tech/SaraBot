// Regex 
let isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
ticket_submit 
callback_id 
app.action({ callback_id: 'ticket_submit' }, async ({ action, ack }) => {
  if (isEmail.test(action.submission.email)) {
    await ack();
  } else {
    await ack({
      errors: [{
        "name": "email_address",
        "error": "Sorry, this isn’t a valid email"
      }]
    });
  }
});
