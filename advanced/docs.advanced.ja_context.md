---
title: context の追加
lang: ja-jp
slug: context
order: 6
---

<div class="section-content">
`context`

`context` 
</div>

```javascript
async function addTimezoneContext({ payload, client, context, next }) {
  const user = await client.users.info({
    user: payload.user_id,
    include_locale: true
  });
 
  context.tz_offset = user.tz_offset;
  await next();
}

app.command('request', addTimezoneContext, async ({ command, ack, client, context }) => {
  await ack();
  const local_hour = (Date.UTC() + context.tz_offset).getHours();
  const requestChannel = 'C12345';

  const requestText = `:large_blue_circle: *New request from <@${command.user_id}>*: ${command.text}`;
  if (local_hour > 17 || local_hour < 9) {
    const local_tomorrow = getLocalTomorrow(context.tz_offset);
    try {
      const result = await client.chat.scheduleMessage({
        channel: requestChannel,
        text: requestText,
        post_at: local_tomorrow
      });
    }
    catch (error) {
      console.error(error);
    }
  } else {
    try {
      const result = client.chat.postMessage({
        channel: requestChannel,
        text: requestText
      });
    }
    catch (error) {
      console.error(error);
    }
  }
});
