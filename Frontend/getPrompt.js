module.exports = async () => {
  console.log("Get a prompt was called");
  const prompts = {
    "general": [
      "How are things going?",
      "What's something you're really jazzed about outside of work?",
      "What’s the coolest thing you’re working on right now?",
      "What are the toughest challenges you’ve had at work?",
      "What skill do you think everyone should learn?",
      "What’s one of your favorite memories from the past year?",
      "What’s your favorite way to unwind after a busy day?",
      "Do you have a pet? What’s he/she like?"
    ],
    "working-style": [
      "How would you describe your work style?",
      "What time of day do you do your best work?",
      "How do you like people to communicate with you?",
      "What do you value most in working with teams?",
      "Which activities give you energy?",
      "Which activities deplete your energy?",
      "How can people earn an extra gold star with you?",
      "How can people tell when you're really stressed out? What's the best way to support you when you're stressed?",
      "What’s the best way to get your attention if you’re busy?",
      "What might people misunderstand about you, and what do you want to clarify?",
      "If all the people with whom you work were surveyed and asked to describe you in three words, what three words would you most hope to hear?"
    ],
    "fun": [
      "What's your favorite place you've ever visited?",
      "Got any phobias you'd like to break?",
      "Do you collect anything?",
      "What's your favorite ice cream flavor?",
      "Share something new that you learned recently! A skill, a fun fact, etc.",
      "What's a hobby or activity you've picked up in the last couple months?",
      "If you could only have three apps on your smartphone, which would you pick?"
    ],
    "mentor": [
      "Was there a time you messed up and felt like you’d failed? How did you bounce back?",
      "How did you learn to embrace risk-taking?",
      "Tell me about a recent business setback. How did you recover?",
      "Think back to five years ago. Did you envision your career as it is today?",
      "Was there ever a role you applied for and landed, but weren't 100% qualified to do? How did you proceed?",
      "What do you wish you had known before taking your first management role?",
      "Which leadership skills were the most difficult to develop?",
      "Can you tell me about a time when you had a difficult boss? How did you handle the situation?",
      "What’s the most important leadership lesson you’ve learned and how has it proven invaluable?",
      "How did you develop the skill of speaking so engagingly in front of groups?",
      "Who inspired you to pursue the career you have today?"
    ],
    "direct-report/boss": [
      "What, if anything, is stressing you out this week?",
      "Am I giving you enough feedback on your work?",
      "Is there any outstanding work we owe each other?",
      "What are the biggest time wasters for you each week?",
      "How can we improve the way our team works together?",
      "Who in the company would you like to learn from? What do you want to learn?"
    ]
  }
  return prompts;
}