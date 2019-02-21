const Discord = require('discord.js');
const bot = new Discord.Client();
const { Client, Attachment } = require('discord.js');

// This section removes spoilers from discord. Pesky Kids. 
bot.on('message', message => {
    let msg = message.content;
    let match = msg.match(/\|\|/g);
  //if a spoiler is detected, delete the message and Pm the user
    if (match && match.length > 1) {
      message.delete(); // needs permissions to delete the message!
      message.author.send("Sorry we do not allow spoilers here");
    }
  });

//Scans for message being sent on the server
bot.on('message', message => {
  //1 blacklisted words
  let blacklisted = ['nigger',"n1gg3r","n1gger","nigg3r","nlgger","n|gger","n!gger","njgger","chink","ch1nk", "n  i  g  g  e  r","n igger","ni gger","nig ger","nigg er","nigge r","n.igger","n i g g e r","||igger","N 1gger","N¡gger","ngger"] //words put , after the word

  //2 Looks for words that are in the above blacklist.
  let foundInText = false;
  for (var i in blacklisted) { // loops through the blacklisted list
    if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
  }
  //3 deletes the message and send the user a message.
    if (foundInText) {
      message.delete();
      message.author.sendMessage('Hey! No bad words!')
  }
});

//This Section dms the users the Help
bot.on('message', message => {
  if (message.content === '.help') {
    message.delete();
    message.author.send("--Commands List--")
    message.author.send("`.motd = PM's User a link to the PRP MOTD`") 
    message.author.send("`.forums = PM's User a link to the PRP FORUMS`")
  }
});

//This section dms the users a link to the forums
bot.on('message', message => {
  if (message.content === '.forums') {
    message.delete();
    message.author.send('https://forums.prpservers.com/')
  }
});

//This Section dms the users the MOTD
bot.on('message', message => {
  if (message.content === '.motd') {
    message.delete();
    message.author.send('https://forums.prpservers.com/threads/drp-rules.4/')
  }
});

//This section Dms new users and tell thems to read the rules
bot.on('guildMemberAdd', member => {
  member.send("Welcome to the server! Please read the section titled rules before proceeding! By joining the server you agree to adhere to the rules.");
});

bot.login(process.env.BOT_TOKEN);
