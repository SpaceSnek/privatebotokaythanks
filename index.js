const Discord = require('discord.js');
const bot = new Discord.Client();
const { Client, Attachment } = require('discord.js');
const yourID = "@459538709264597002"; //Instructions on how to get this: https://redd.it/40zgse
const setupCMD = ".createrolemessage"
let initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`;
const roles = ["NSFW"];
const reactions = ["🔞"];

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

//this section auto assigns roles
//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";

//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`React below to get the **"${role}"** role!`); //DONT CHANGE THIS
    return messages;
}


bot.on("message", message => {
    if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})


bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find(r => r.name === role);
                var memberObj = msg.guild.members.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj)
                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }   
});
bot.login(process.env.BOT_TOKEN);
