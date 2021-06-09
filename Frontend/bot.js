// Require the Bolt package (github.com/slackapi/bolt)
const { App, LogLevel, ExpressReceiver, WorkflowStep } = require("@slack/bolt");
const getQuestion = require("./getQuestion");
const getPrompt = require("./getPrompt");
const axios = require("axios");

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
});

// All the room in the world for your code
const mainChannel = "C021WSASHC5"; //sara-tutorial ID -> change it to "general"...

// for testing purpuses:
app.command("/test", async ({ command, ack, say }) => {
  let user = "U02204A8QKD"; //my ID
  let channel = "general"; 
  // Acknowledge command request
  await ack();
  //Here are functions I want to try out...
  try {
    const result = await app.client.chat.postMessage({
      token: SLACK_BOT_TOKEN,
    channel,
    text: "Hello world"
  });
    //populateConversationStore();
    //to delete:
    /*const channel1= "";
    const channel2= "";
    inviteUserToSubChannel(user, channel1);
    inviteUserToSubChannel(user, channel2);*/
  } catch(error){
    console.log(error);
  }
})


//Timed messages
//For now working with slash command...
//works?? Not yet
//also bot has it's own time zone!
app.command("/schedule", async ({ command, ack, say }) => {
  ack();
  scheduleMessage()
});
async function scheduleMessage(){
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(9, 0, 0);
const today = new Date();
today.setDate(tomorrow.getDate());
today.setHours(18, 11, 0);
  try {
    // Call chat.scheduleMessage with the built-in client
    const result = await app.client.chat.scheduleMessage({
      token: SLACK_BOT_TOKEN,
      channel: mainChannel,
      post_at: today.getTime() / 1000,
      text: "It's a new day, make sure to chat with your team!"
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}


//QUESTION SEQUENCE
async function populateConversationStore() {
  try {
    // Call the conversations.list method
    const result = await app.client.conversations.list({
      token: SLACK_BOT_TOKEN,
      types: "public_channel,private_channel"
    });
    let conversationsStore = [];
    //console.log("All channels: " + JSON.stringify(result.channels));
    result.channels.forEach(channel => {
      let name = channel.name_normalized;
      conversationsStore.push(name);
    });
    return conversationsStore;
  } catch (error) {
    console.error(error);
  }
}
async function postInNewChannel(channelName, channel) {
  //const dogChannel = DOG_CHANNEL_ID;
  //const catChannel = CAT_CHANNEL_ID;
  let questions = "";
  let universalTruth = "";
  let topic = "";
  let imageUrl = "";
  let headerText = "";
  if (channelName === "dog-people") {
    headerText = "Welcome to the #dog-people channel! :tada:",
    questions = [
      "If you have a dog, share its name and a photo!",
      "Who is your favorite fictional dog from a TV show/movie?"
    ];
    universalTruth = "Dogs are man's best friends.";
    topic = "dog. :dog:";
    imageUrl = "https://sdk.bitmoji.com/render/panel/999b856f-016c-45e6-8293-d2fe8e800eba-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1";
  }
  if (channelName === "cat-people") {
    headerText = "Welcome to the #cat-people channel! :tada:",
    questions = [
      "If you have a cat, share its name and a photo!",
      " What is it about felines that you love?"
    ];
    universalTruth = "Cats are liquids :cat:";
    topic = "cat. :cat:";
    imageUrl = "https://sdk.bitmoji.com/render/panel/0c328139-5339-4e86-b677-41d39a604b5e-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1";
  }
  try {
    await app.client.chat.postMessage({
    token: SLACK_BOT_TOKEN,
    // Channel to send message to
    channel: channel,
    // Include a button in the message (or whatever blocks you want!)
    "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": headerText,
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Share any thoughts with your peers and enjoy conversations about all things ${topic} \nHere are some ideas to get you started:\n\n1. _${questions[0]}_ \n2. _${questions[1]}_\n\n *The Universal Truth of this channel:* _${universalTruth}_`
			},
			"accessory": {
				"type": "image",
				"image_url": imageUrl,
				"alt_text": topic
			}
		}
	]
  });
} catch (error){
    console.log(error);
}}
async function createNewChannel(newChannel) {
  console.log("Creating new channel: " + newChannel);
  // Call the conversations.create method
  try {
    const newConvo = await app.client.conversations.create({
      // The name of the conversation
      token: SLACK_BOT_TOKEN,
      name: newChannel,
      is_private: false
    });
    //console.log(newConvo + " ID: " + JSON.stringify(newConvo));
    const newChannelId = newConvo.channel.id; //send it to database!
    postInNewChannel(newChannel, newChannelId);
    //console.log(newChannel + " ID: " + JSON.stringify(newChannelId));
    return {[newChannel]: newChannelId}
  } catch (error) {
    console.error(error);
  }
}
async function inviteUserToSubChannel(user, subChannel) {
  try {
    const invite = await app.client.conversations.invite({
      token: SLACK_BOT_TOKEN,
      channel: subChannel,
      users: user
    });
  } catch (error) {
    console.error(error);
  }
}
async function forEachNewChannel(newChannels, conversationsStore){
  let createdNewChannels = {};
  
  for (const newChannel of newChannels) {
    if (conversationsStore.includes(newChannel)) {
      console.log("this channel " + newChannel + " already exists");
      return;
    } else {
      let myNewChannel = await createNewChannel(newChannel);
      //console.log(newChannel + "'s object = " + JSON.stringify(myNewChannel));
      createdNewChannels = Object.assign(createdNewChannels, myNewChannel);
    }
  }
  //console.log("All created new channels' inside FUNCTION OBJECT = " + JSON.stringify(createdNewChannels));
  return createdNewChannels;
}
app.command("/quickquestion", async ({ ack, payload, context }) => {
  // Acknowledge command request
  await ack();
  try {
    const conversationsStore = await populateConversationStore();
    //console.log("conversationsStore: " + conversationsStore);
    //getaquestion();
    let newChannels = ["dog-people", "cat-people"];
    let createdNewChannels = await forEachNewChannel(newChannels, conversationsStore);
    //console.log("All created new channels' OBJECT = " + JSON.stringify(createdNewChannels));
    //console.log("dog-people channel ID = " + JSON.stringify(createdNewChannels["dog-people"]));
    const dogId = createdNewChannels["dog-people"];
    //console.log("DogID = " + JSON.stringify(dogId));
    const catId = createdNewChannels["cat-people"];
    //console.log("CatID = " + JSON.stringify(catId));
    //const createdNewChannels = "get them from database"; // with names and IDs
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Quick Question 💡",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Hi <#${payload.channel_id}>, it's time for your scheduled question ⏰\nLet's have some fun! \n\n\n\n*Are you a dog or cat person?*`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/214e2e2c-3a98-46f6-9b61-50c57a0d8fca-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "Sarabot waving"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Select an answer below to be added to a channel with people of similar interests 👯",
					"emoji": true
				}
			]
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Dog Person 🐶",
						"emoji": true
					},
					"value": `${dogId}`,
					"action_id": "dog_btn"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Cat Person 🐱",
						"emoji": true
					},
					"value": `${catId}`,
					"action_id": "cat_btn"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Both 🐾",
						"emoji": true
					},
					"value": `${dogId}, ${catId}`,
					"action_id": "both_btn"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Not much of a pet person 🚫",
						"emoji": true
					},
					"value": "no channels for you",
					"action_id": "none_btn"
				}
			]
		},
		{
			"type": "divider"
		}
	],
      // Text in the notification
      text: "Message from Test App"
    });
  } catch (error) {
    console.error(error);
  }
});
//buttons
// You must set up a Request URL under Interactive Components on your app configuration page
app.action("dog_btn", async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
  const subChannel = body.actions[0].value;
  console.log("body actions: " + JSON.stringify(body.actions[0]));
  console.log("Clicked subChannel = " + JSON.stringify(subChannel));
  const user = body.user.id;
  try {
    // post another message
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: body.channel.id,
      // Include a button in the message (or whatever blocks you want!)
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `*<@${user}>* answered: dog people :dog:`
				}
			]
		}
	]
    });
    inviteUserToSubChannel(user, subChannel);
    await app.client.chat.postEphemeral({
      token: context.botToken,
      // Channel of message
      channel: body.channel.id,
      user,
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `You've been added to the <#${subChannel}> :dog: channel. Check it out to chat with your peers!`
				}
			]
		}
	]
    });
  } catch (error) {
    console.error(error);
  }
});
app.action("cat_btn", async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
  //const subChannel = CAT_CHANNEL_ID; //cat-people channel ID
  const subChannel = body.actions[0].value;
  const user = body.user.id;
  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: body.channel.id,
      // Include a button in the message (or whatever blocks you want!)
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `*<@${user}>* answered: cat people :cat:`
				}
			]
		}
	]
    });
    inviteUserToSubChannel(user, subChannel);
    await app.client.chat.postEphemeral({
      token: context.botToken,
      // Channel of message
      channel: body.channel.id,
      user,
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `You've been added to the <#${subChannel}> :cat: channel. Check it out to chat with your peers!`
				}
			]
		}
	]
    });
  } catch (error) {
    console.error(error);
  }
});
app.action("both_btn", async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
  const subChannels = body.actions[0].value;
  const options = subChannels.split(",");
  //const subChannel1 = DOG_CHANNEL_ID; //dog-people channel
  const subChannel1 = options[0].trim();
  //const subChannel2 = CAT_CHANNEL_ID; //cat-people channel ID
  const subChannel2 = options[1].trim();
  const user = body.user.id;
  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: body.channel.id,
      // Include a button in the message (or whatever blocks you want!)
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `*<@${user}>* answered: both 🐾`
				}
			]
		}
	]
    });
    inviteUserToSubChannel(user, subChannel1);
    inviteUserToSubChannel(user, subChannel2);
    await app.client.chat.postEphemeral({
      token: context.botToken,
      // Channel of message
      channel: body.channel.id,
      user,
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `You've been added to the <#${subChannel1}> :dog: and <#${subChannel2}> :cat: channels. Check them out to chat with your peers!`
				}
			]
		}
	]
    });
  } catch (error) {
    console.error(error);
  }
});
app.action("none_btn", async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
  const user = body.user.id;
  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: body.channel.id,
      // Include a button in the message (or whatever blocks you want!)
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `*<@${user}>* answered: none 🚫`
				}
			]
		}
	]
    });
    await app.client.chat.postEphemeral({
      token: context.botToken,
      // Channel of message
      channel: body.channel.id,
      user,
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `That's too bad :cry:. I guess we'll find your peers with a different question.`
				}
			]
		}
	]
    });
  } catch (error) {
    console.error(error);
  }
});

//PROMPTED AND THEMED QUESTIONS
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//app.command("/convostarter", async ({ command, ack, respond }) => {
app.command("/convostarter", async ({ ack, payload, context }) => {
  // Acknowledge command request
  await ack();
  //console.log("Payload: " + JSON.stringify(payload));
  //console.log("Context: " + JSON.stringify(context));
  //let promptTheme = command.text.toLowerCase().trim();
  let promptTheme = payload.text.toLowerCase().trim();
  //const user = command.user_id;
  const user = payload.user_id;
  const allPrompts = await getPrompt();
  const themedPrompts = await allPrompts[promptTheme];
  //console.log("command: " + JSON.stringify(command));
  //console.log("All prompts: " + JSON.stringify(allPrompts));
  //console.log("Prompt theme: " + JSON.stringify(promptTheme));
  //console.log("Themed prompts: " + JSON.stringify(themedPrompts));
  if (!themedPrompts) {
    //await respond({
      //response_type: "ephemeral",
      //text: `<@${user}>, you asked for a question prompt about *${promptTheme}*, but there are no prompt questions avaliable for this theme, sorry.\nWhy don't you try some of these: general, working-style, fun, mentor or direct-report/boss`
    //});
    const result = await app.client.chat.postEphemeral({
      token: context.botToken,
    channel: payload.channel_id,
    user: user,
    text: `<@${user}>, you asked for a question prompt about *${promptTheme}*, but there are no prompt questions avaliable for this theme, sorry.\nWhy don't you try some of these: general, working-style, fun, mentor or direct-report/boss`
  });
  } else {
    const promptNumber = themedPrompts.length;
    const promptIndex = await getRandomNumber(0, promptNumber);
    //await respond({
      //response_type: "ephemeral",
      //text: `<@${user}>, you asked for a question prompt about *${promptTheme}*. Here's an example of what you could ask:\n_${themedPrompts[promptIndex]}_`
    //});
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Conversation Starter 💬",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*<@${user}>* prompted a conversation starter in the topic *${promptTheme}* \nShare your answers to the question below!\n\n*_${themedPrompts[promptIndex]}_*`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/80449733-5883-4546-98ef-8c56880403de-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "Sarabot watercooler"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Refresh Question :arrows_counterclockwise:",
						"emoji": true
					},
					"value": `${promptTheme}`,
					"action_id": "refresh_question_btn"
				}
			]
		}
	],
      // Text in the notification
      text: "Message from Test App"
    });
  }
});
app.action('refresh_question_btn', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
//console.log("refresh body: " + JSON.stringify(body));
//console.log("refresh context: " + JSON.stringify(context));
  const user = body.user.id;
  const promptTheme = body.actions[0].value;
  const allPrompts = await getPrompt();
  const themedPrompts = await allPrompts[promptTheme];
  const promptNumber = themedPrompts.length;
  const promptIndex = await getRandomNumber(0, promptNumber);
  try {
    // Update the message
    const result = await app.client.chat.update({
      token: context.botToken,
      // ts of message to update
      ts: body.message.ts,
      // Channel of message
      channel: body.channel.id,
      "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Conversation Starter (Refresh) 💬",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*<@${user}>* refreshed the question. The topic is *${promptTheme}*. \nShare your answers to the question below!\n\n*_${themedPrompts[promptIndex]}_*`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/80449733-5883-4546-98ef-8c56880403de-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "Sarabot watercooler"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Refresh Question :arrows_counterclockwise:",
						"emoji": true
					},
					"value": `${promptTheme}`,
					"action_id": "refresh_question_btn"
				}
			]
		}
	],
      text: 'Message from Test App'
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

//GAMES
app.command("/game", async ({ ack, payload, context }) => {
  // Acknowledge command request
  await ack();
  const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      "blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*Let's play a game 🕹* \n*<@${payload.user_id}>* wants to play an online game. \nHere are some options!`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/5eeab627-dcca-4374-baa2-5a740d64648e-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "sarabot cards"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🎲 *The Classics*\nTic Tac Toe, Connect Four, and more! (2 player or tournament style)"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": "Play"
				},
				"url": "https://papergames.io/en"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "✏️ *Skribbl* \nOnline pictionary (2+ players)"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": "Play"
				},
				"url": "https://skribbl.io"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🔎 *Codenames*\n A social word game (4+ players)"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": "Play"
				},
				"url": "https://codenames.game"
			}
		},
		{
			"type": "divider"
		}
	],
      // Text in the notification
      text: "Message from Test App"
    });
});

// Listen for a slash command invocation
app.command("/image", async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();
  let imageRequest = payload.text;
  console.log("Get an image was called with a query: " + imageRequest);
  const pexelsUrl = "https://api.pexels.com/v1/search?query=" + imageRequest;
  const pexelsApiKey =
    "563492ad6f91700001000001a3dc11e17fb1440db798f1c33646cef7";
  const headers = { Authorization: `Bearer ${pexelsApiKey}` };
  try {
    let image = await axios
      .get(`${pexelsUrl}&per_page=1`, { headers: headers })
      .then(response => {
        let imageUrl = response.data.photos[0].src.original;
        return imageUrl;
      });
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "This is a section block with an accessory image of " +
              imageRequest
          },
          accessory: {
            type: "image",
            image_url: image,
            alt_text: "image of " + imageRequest
          }
        }
      ],
      // Text in the notification
      text: "Message from Test App"
    });
  } catch (error) {
    console.error(error);
  }
});

// Listens for messages containing "knock knock" and responds with an italicized "who's there?"
app.message("knock knock", async ({ message, say }) => {
  //console.log(message);
  await say(`_Who's there?_`);
});
// This will match any message that contains 👋
app.message(":wave:", async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

// when bot mentioned
app.event("app_mention", async ({ event, client, context }) => {
  let text = event.text.replace("<@U022R8W2ZNU>", "").trim();
  //console.log(`full text: ` + event.text);
  //console.log(`filtered text: ` + text);
  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: event.channel,
      text: `Yes, <@${event.user}>, I heard you say: "${text}"`
    });
  } catch (error) {
    console.error(error);
  }
});

// When a user joins the team, send a message in a predefined channel asking them to introduce themselves
async function sendWelcomeImMessage(user, channel){
  try {
  // Call the chat.postMessage method using the WebClient
  const result = await app.client.chat.postMessage({
    token: SLACK_BOT_TOKEN,
    channel: user,
    "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "You've joined a new channel 🎉 ",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Hi *<@${user}>* 👋\nI'm Sarabot, and I'm here to spark some fun in your team's channels. \nCheck out the Sarabot homepage to see how to make use of my features!`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/8b80b4d8-32db-4668-8490-9b1227b0754b-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "hello"
			}
		},
		{
			"type": "divider"
		}
	]
  });
}
catch (error) {
  console.error(error);
}
}
async function sendEphemeralMessage(user, joinedChannel){
  try {
  // Call the chat.postEphemeral method using the WebClient
  const result = await app.client.chat.postEphemeral({
    token: SLACK_BOT_TOKEN,
    channel: joinedChannel,
    user: user,
    "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "You've joined a new channel 🎉 ",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Hi *<@${user}>* 👋\nI'm Sarabot, and I'm here to spark some fun in your team's channels. \nCheck out the Sarabot homepage to see how to make use of my features!`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/8b80b4d8-32db-4668-8490-9b1227b0754b-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "hello"
			}
		},
		{
			"type": "divider"
		}
	]
  });
}
catch (error) {
  console.error(error);
}
}
app.event("member_joined_channel", async ({ event, client }) => {
  const thisChannel = event.channel;
  const user = event.user;
  if (user === "B0221LX0QHH") {
    return;
  } else {
    if (thisChannel === mainChannel) {
      try {
        // Call chat.postMessage with the built-in client
        const result = await client.chat.postMessage({
          channel: mainChannel,
        "blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "New User 🎉 ",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Looks like we have a newbie in the channel. Everyone please welcome, *<@${user}>*! 👋 `
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*<@${user}>* We'd love to hear about you, so please introduce yourself! \n\nStart by sharing your preferred name, pronouns, what you do, and your favorite song/artist at the moment. 🎵`
			},
			"accessory": {
				"type": "image",
				"image_url": "https://sdk.bitmoji.com/render/panel/4c26f880-4fba-40d2-af7e-6556ba1f6ff1-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
				"alt_text": "hello"
			}
		},
		{
			"type": "divider"
		}
	]
        });
        sendWelcomeImMessage(user, thisChannel);
        //sendEphemeralMessage(user, thisChannel)
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        // Call chat.postMessage with the built-in client
        const result = await client.chat.postMessage({
          channel: thisChannel,
          text: `Welcome to the <#${thisChannel}> channel, *<@${user}>*! 🎉`
        });
        //postInNewChannel(thisChannel)//just trying how it works... it DOESN'T!
      } catch (error) {
        console.error(error);
      }
    }
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

//on app_home_oppened
app.event("app_home_opened", async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Hi, I'm Sarabot. Welcome to my home!",
              "emoji": true
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Working remotely can be lonely. I'm here to spark some fun in your team's channels and facilitate meaningful conversations between you and your colleagues. Check out some of my features below."
            },
            "accessory": {
              "type": "image",
              "image_url": "https://sdk.bitmoji.com/render/panel/63792a53-bf54-49f9-a538-7076cd924728-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1",
              "alt_text": "sarabot cards"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "⚡ Slash Commands"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*/quickquestion*\nPrompts a multiple choice question to gage interests in various topics and match users with similar interests."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*/convostarter*\nPrompts an open ended question to spark conversations in a channel."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*/game*\nProvides users with links to online games that vary in objective and number of players."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*/weather*\n Type in a city after this command to see what the weather is like in that city (COMING SOON)."
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "💬 Convo Starter Configurations (COMING SOON)"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": "Use the settings below to configure how frequently you would like Sarabot to provide conversation starters in a channel.",
              "emoji": true
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "channels_select",
                "placeholder": {
                "type": "plain_text",
                "text": "Select a channel",
                "emoji": true
                },
                "action_id": "actionId-1"
              },
              {
                "type": "static_select",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Frequency",
                  "emoji": true
                },
                "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Daily",
                    "emoji": true
                  },
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Weekly",
                    "emoji": true
                  },
                  "value": "value-1"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Biweekly",
                    "emoji": true
                  },
                  "value": "value-3"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Monthly",
                    "emoji": true
                  },
                  "value": "value-4"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Off",
                    "emoji": true
                  },
                  "value": "value-5"
                }
                ],
              "action_id": "actionId-3"
              }
            ]
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit",
                  "emoji": true
                },
                "value": "click_me_123",
                "action_id": "actionId-0"
              }
            ]
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "➕ Want to add your own question? (COMING SOON)"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": "Submit a form to add a question to the database.",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_text_input-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Question",
              "emoji": true
            }
          },
          {
          "type": "input",
          "element": {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select",
              "emoji": true
            },
            "options": [
              {
              "text": {
                "type": "plain_text",
                "text": "General",
                "emoji": true
              },
              "value": "value-0"
              },
              {
              "text": {
                "type": "plain_text",
                "text": "Working Style",
                "emoji": true
              },
              "value": "value-1"
              },
              {
              "text": {
                "type": "plain_text",
                "text": "Fun",
                "emoji": true
              },
              "value": "value-2"
              },
              {
              "text": {
                "type": "plain_text",
                "text": "Mentor",
                "emoji": true
              },
              "value": "value-3"
              },
              {
              "text": {
                "type": "plain_text",
                "text": "Direct Report/Boss",
                "emoji": true
              },
              "value": "value-4"
              }
            ],
            "action_id": "static_select-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Category",
              "emoji": true
            }
          },
          {
            "type": "actions",
            "elements": [
              {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
              },
              "value": "click_me_123",
              "action_id": "actionId-0"
              }
            ]
          },
          {
            "type": "divider"
          },
          {
          "type": "context",
            "elements": [
            {
              "type": "mrkdwn",
              "text": "For questions, comments, and suggestions please contact us at sarabotslack@gmail.com"
            }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
  }
});
