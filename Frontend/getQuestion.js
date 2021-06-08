module.exports = async () => {
  console.log("Get question was called");
  const questions = [
    {
      question: "Are you a dog person or a cat person?",
      answers: [
        {
          option_1: {
            button_text: "Dog Person",
            icon: ":dog:"
          }
        },
        {
          option_2: {
            button_text: "Cat Person",
            icon: ":cat:"
          }
        },
        {
          option_both: {
            button_text: "Both",
            icon: ":paws:"
          }
        },
        {
          option_none: {
            button_text: "Not much of a pet person",
            icon: ":no:"
          }
        },
      ],
      channels: {
        names: ["dog-people", "cat-people"],
        channel_1: {
          image: {
            url: "dog-image-url",
            alt_text: "cool dog"
          },
          topic: {
            text: "dog",
            icon: ":dog:"
          },
          questions: ["If you have a dog, share its name and a photo!", "Who is your favorite fictional dog from a TV show/movie?"],
          universal_truth: "Dogs are man's best friends."
        },
        channel_2: {
          image: {
            url: "cat-image-url",
            alt_text: "cute cat"
          },
          topic: {
            text: "cat",
            icon: ":cat:"
          },
          questions: ["If you have a cat, share its name and a photo!", "What is it about felines that you love?"],
          universal_truth: "Cats are liquids."
        }
      }
    }, 
    //{NEXT QUESTION}, {NEXT QUESTION}, {NEXT QUESTION},...
  ];
};
//Yes? No?


//How to extract info = QUESTION SEQUENCE:

/*
async function postInNewChannel(channelName, channel, payload) {
  let questions = "";
  let universalTruth = "";
  let topic = "";
  let imageUrl = "";
  let headerText = "";
  if (channelName === payload.names[0]) {
    headerText = `Welcome to the #${} channel! :tada:`,
    questions = [
      "If you have a dog, share its name and a photo!",
      "Who is your favorite fictional dog from a TV show/movie?"
    ];
    universalTruth = "Dogs are man's best friends.";
    topic = "dog. :dog:";
    imageUrl = "https://sdk.bitmoji.com/render/panel/999b856f-016c-45e6-8293-d2fe8e800eba-df0bf4e6-040d-4d35-9902-8b77c6b9017f-v1.png?transparent=1&palette=1";
  }
  if (channelName === payload.names[1]) {
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
    token: `SLACK_BOT_TOKEN`,
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

async function createNewChannel(newChannel, payload) {
  console.log("Creating new channel: " + newChannel);
  // Call the conversations.create method
  try {
    const newConvo = await app.client.conversations.create({
      // The name of the conversation
      token: `SLACK_BOT_TOKEN,
      name: newChannel,
      is_private: false
    });
    //console.log(newConvo + " ID: " + JSON.stringify(newConvo));
    const newChannelId = newConvo.channel.id; //send it to database!
    postInNewChannel(newChannel, newChannelId, payload);
    //console.log(newChannel + " ID: " + JSON.stringify(newChannelId));
    return {[newChannel]: newChannelId}
  } catch (error) {
    console.error(error);
  }
}

async function forEachNewChannel(newChannels, conversationsStore, payload){
  let createdNewChannels = {};
  for (const newChannel of newChannels) {
    if (conversationsStore.includes(newChannel)) {
      console.log("this channel " + newChannel + " already exists");
      //get the ID anyway and pass it to the createdNewChannels!!!
      return;
    } else {
      let myNewChannel = await createNewChannel(newChannel, payload);
      //console.log(newChannel + "'s object = " + JSON.stringify(myNewChannel));
      createdNewChannels = Object.assign(createdNewChannels, myNewChannel);
    }
  }
  //console.log("All created new channels' inside FUNCTION OBJECT = " + JSON.stringify(createdNewChannels));
  return createdNewChannels;
}

app.command("/quickquestion", async ({ ack, payload, context }) => {
  await ack();
  try {
    const conversationsStore = await populateConversationStore();
    let question = await getQuestion()[random number];
    let newChannels = question.channels.names;
    let createdNewChannels = await forEachNewChannel(newChannels, conversationsStore, question.channels);
    const firstChannelId = createdNewChannels[newChannels[0]];
    const secondChannelId = createdNewChannels[newChannels[1]];
    const result = await app.client.chat.postMessage({
      token: context.botToken,
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
				"text": `Hi <#${payload.channel_id}>, it's time for your scheduled question ⏰\nLet's have some fun! \n\n\n\n*${question.question}*`
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
						"text": `${question.answers.option_1.button_text} ${question.answers.option_1.icon}`,
						"emoji": true
					},
					"value": firstChannelId,
					"action_id": "option_1_btn"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": ${question.answers.option_2.button_text} ${question.answers.option_2.icon}`,
						"emoji": true
					},
					"value": secondChannelId,
					"action_id": "option_2_btn"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": ${question.answers.option_both.button_text} ${question.answers.option_both.icon}`,
						"emoji": true
					},
					"value": `${FirstChannelId}, ${secondChannelId}`,
					"action_id": "both_btn"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": ${question.answers.option_none.button_text} ${question.answers.option_none.icon}`,
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
app.action("option_1_btn", async ({ ack, body, context }) => {
  ack();
  const subChannel = body.actions[0].value;
  const user = body.user.id;
  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: body.channel.id,
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `*<@${user}>* answered: ....dog people :dog:....` ....get this from somewhere inside body....
				}
			]
		}
	]
    });
    inviteUserToSubChannel(user, subChannel);
    await app.client.chat.postEphemeral({
      token: context.botToken,
      channel: body.channel.id,
      user,
      "blocks": [
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `You've been added to the <#${subChannel}> ....:dog:.... channel. Check it out to chat with your peers!` ....again from body....
				}
			]
		}
	]
    });
  } catch (error) {
    console.error(error);
  }
});

*/