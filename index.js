const fs = require("fs");
FFMPEG = require('ffmpeg');
const ms = require("ms");
const weather = require('weather-js')
const Discord = require("discord.js");
const client = new Discord.Client();
const active = new Map();
const ytdl = require('ytdl-core');
const search = require('yt-search');
var botConfigs = {
    prefix: ".",
    gameStatus: "Music",
    statusType: "LISTENING",
    commands: [],
    plugins: [{"id":0,"name":"Purge messages","activated":false,"config":"","info":{"example":"!purge 20","note":"","requirements":"Create a logs channel"}},{"id":1,"name":"Welcome message","activated":false,"config":"welcomemessage","info":{"example":"","note":"","requirements":"Create a channel"}},{"id":2,"name":"Kick user","activated":false,"config":"","info":{"example":"!kick @user spam","note":"","requirements":"Create a logs channel"}},{"id":3,"name":"Ban user","activated":false,"config":"","info":{"example":"!ban @user spam","note":"","requirements":"Create a logs channel"}},{"id":4,"name":"Report user","activated":false,"config":"","info":{"example":"!report @user spam","note":"","requirements":"Create a logs channel"}},{"id":5,"name":"Temp mute user","activated":false,"config":"","info":{"example":"!tempmute @user 10s","note":"s = seconds, m = minutes, h = hours","requirements":"Create a logs channel"}},{"id":6,"name":"Server info","activated":false,"config":"","info":{"example":"!serverinfo","note":"","requirements":""}},{"id":7,"name":"Weather info","activated":false,"config":"weather","info":{"example":"!weather Copenhagen","note":"","requirements":""}},{"id":8,"name":"Music - Export only","activated":true,"config":"","info":{"example":"!play {YouTube URL}, !leave, !pause, !resume, !queue, !skip","note":"Export only","requirements":""}},{"id":9,"name":"Channel lockdown","activated":false,"config":"","info":{"example":"!lockdown 10s","note":"s = seconds, m = minutes, h = hours","requirements":""}},{"id":10,"name":"Shutdown command","activated":false,"config":"","info":{"example":"!shutdown","note":"","requirements":""}},{"id":11,"name":"Banned words","activated":false,"config":"bannedwords","info":{"example":"","note":"Auto delete messages contained banned words","requirements":""}},{"id":12,"name":"Ticket system","activated":false,"config":"ticketSystem","info":{"example":"!ticket I cant find Bob","note":"","requirements":"You need a channel to create tickets called: create-ticket, support or something like that."}}],
    welcomemessage: {"channelid":"","text":""},
    weather: {"degree":"C"},
    ticketsystem: {"ticketCategoryID":"","createTicketChannelID":""}
};

var ops = {
  active: active
}
//This section controls the bots Status
client.on('ready', () => {
  console.log("Connected as " + client.user.tag)
 client.user.setActivity("Space bot | .help", {type: "Playing"})
});

//This section Dms new users and tell thems to read the rules
client.on('guildMemberAdd', member => {
  member.send("Welcome to the server! Please read the section titled rules before proceeding! By joining the server you agree to adhere to the rules.");
});

// This section removes spoilers from discord. Pesky Kids. 
client.on('message', message => {
    let msg = message.content;
    let match = msg.match(/\|\|/g);
  //if a spoiler is detected, delete the message and Pm the user
    if (match && match.length > 1) {
      message.delete(); // needs permissions to delete the message!
      message.author.send("Sorry we do not allow spoilers here");
    }
  });

//Scans for message being sent on the server
client.on('message', message => {
  //1 blacklisted words
  let blacklisted = [insert censored words here] //words put , after the word

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

//This section Controls all Commands issued to the bot
client.on('message', message => {
  if (message.content === '.help') {
    message.delete();
    message.author.send("`--Commands List--\n.motd = PM's User a link to the PRP MOTD\n.forums = PM's User a link to the PRP Forums\n.donate = PM's User a link to the PRP Donation Page\n.steam = PM's User a link to the PRP Steam Group\n.bans = Posts a link to the bans page of the PRP servers`") 
  }
  if (message.content === '.forums') {
    message.delete();
    message.author.send('https://forums.prpservers.com/')
  }
  if (message.content === '.motd') {
    message.delete();
    message.author.send('https://forums.prpservers.com/threads/drp-rules.4/')
  }
  if (message.content === '.donate') {
    message.delete();
    message.author.send('https://donate.prpservers.com/')
  }
  if (message.content === '.steam') {
    message.delete();
    message.author.send('https://steamcommunity.com/groups/prpservers')
  }
  if (message.content === 'how tall is hyper?') {
    message.channel.send('Hyper inactive is above average height.')
  }
   if (message.content === 'spacebot') {
    message.channel.send('cant stop fucking')
  }
  if (message.content === 'jamie') {
    message.channel.send('retard')
  }
  if (message.content === '.bans') {
    message.delete();
    message.author.send('https://bans.prpservers.com/')
  }
   if (message.content === 'lordy lordy') {
    message.channel.send('Id never roam again')
  }
});

//music bot 
client.on("guildMemberAdd", async function (member) {
  if (botConfigs.plugins[1].activated == true) {
    member.guild.channels
      .get(botConfigs.welcomemessage.channelid)
      .send(`${member}, ${botConfigs.welcomemessage.text}`);
  }
});

client.on("message", async function (message) {

    let prefix = botConfigs.prefix;

    if (message.author.bot) return;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();



    botConfigs.commands.forEach(element => {
        element.command = element.command.toLowerCase();
        if (command === element.command) {
            if (element.embed) {
                if (element.embedFields.length == 1) {
                    let embed = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .addField(element.embedFields[0].title, element.embedFields[0].text);

                    message.channel.send({ embed });
                } else if (element.embedFields.length == 2) {
                    let embed = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .addField(element.embedFields[0].title, element.embedFields[0].text)
                        .addField(element.embedFields[1].title, element.embedFields[1].text);

                    message.channel.send({ embed });
                } else if (element.embedFields.length == 3) {
                    let embed = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .addField(element.embedFields[0].title, element.embedFields[0].text)
                        .addField(element.embedFields[1].title, element.embedFields[1].text)
                        .addField(element.embedFields[2].title, element.embedFields[2].text);

                    message.channel.send({ embed });
                } else if (element.embedFields.length == 4) {
                    let embed = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .addField(element.embedFields[0].title, element.embedFields[0].text)
                        .addField(element.embedFields[1].title, element.embedFields[1].text)
                        .addField(element.embedFields[2].title, element.embedFields[2].text)
                        .addField(element.embedFields[3].title, element.embedFields[3].text);

                    message.channel.send({ embed });
                } else if (element.embedFields.length == 5) {
                    let embed = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .addField(element.embedFields[0].title, element.embedFields[0].text)
                        .addField(element.embedFields[1].title, element.embedFields[1].text)
                        .addField(element.embedFields[2].title, element.embedFields[2].text)
                        .addField(element.embedFields[3].title, element.embedFields[3].text)
                        .addField(element.embedFields[4].title, element.embedFields[4].text);

                    message.channel.send({ embed });
                } else {
                    message.channel.send("Error, contact an administrator.");
                }
            } else {
                message.channel.send(element.message);
            }
        }
    });
  if (command === "leave" && botConfigs.plugins[8].activated == true || command === "stop" && botConfigs.plugins[8].activated == true) {
    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');
    if (!message.guild.me.voiceChannel) return message.channel.send('Sorry, the bot isn\'t connected to the guild');
    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send('Sorry, you aren\'t connected to the same channel');
    message.guild.me.voiceChannel.leave();
    message.channel.send('Leaving Channel....');
  }

  if (command === "pause" && botConfigs.plugins[8].activated == true) {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send('There currently isn\'t any music playing in this guild!');

    if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('Sorry, you aren\'t in the same channel as the music bot!');

    if (fetched.dispatcher.paused) return message.channel.send('This music is already paused.');

    fetched.dispatcher.pause();

    message.channel.send(`Successfully paused ${fetched.queue[0].songTitle}`);
  }

  if (command === "play" && botConfigs.plugins[8].activated == true) {
    if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');
    if (!args[0]) return message.channel.send('Sorry, please input a url following the command');

    let validate = await ytdl.validateURL(args[0]);

    if (!validate) {
      let ops = {
        active: active
      }
      return searchYT(client, message, args, ops);
    }

    let info = await ytdl.getInfo(args[0]);
    let data = ops.active.get(message.guild.id) || {};

    if (!data.connection) data.connection = await message.member.voiceChannel.join();
    if (!data.queue) data.queue = [];

    data.guildID = message.guild.id;
    data.queue.push({
      songTitle: info.title,
      requester: message.author.tag,
      url: args[0],
      announceChannel: message.channel.id
    });

    if (!data.dispatcher) play(client, ops, data);
    else {
      message.channel.send(`Added To Queue: ${info.title} | Requested By: ${message.author.tag}`);
    }

    ops.active.set(message.guild.id, data);
  }

  if (command === "queue" && botConfigs.plugins[8].activated == true) {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send('There currently isn\'t any music playing in this guild!');

    let queue = fetched.queue;
    let nowPlaying = queue[0];
    let resp = `__**Now Playing**__\n**${nowPlaying.songTitle}** -- **Requested By:** *${nowPlaying.requester}*\n\n__**Queue**__\n`;

    for (var i = 1; i < queue.length; i++) {
      resp += `${i}. **${queue[i].songTitle}** -- **Requested By:** *${queue[i].requester}*\n`;
    }
    message.channel.send(resp);
  }

  if (command === "resume" && botConfigs.plugins[8].activated == true) {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send('There currently isn\'t any music playing in this guild!');
    if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('Sorry, you aren\'t in the same channel as the music bot!');
    if (!fetched.dispatcher.paused) return message.channel.send('This music isn\'t paused.');

    fetched.dispatcher.resume();
    message.channel.send(`Successfully resumed ${fetched.queue[0].songTitle}`);
  }

  if (command === "skip" && botConfigs.plugins[8].activated == true) {
    let fetched = ops.active.get(message.guild.id)

    if (!fetched) return message.channel.send('There currently isn\'t any music playing in the guild!');
    if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('Sorry, you currently aren\'t in the same channel as the bot');

    let userCount = message.member.voiceChannel.members.size;
    let required = Math.ceil(userCount / 2);

    if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];
    if (fetched.queue[0].voteSkips.includes(message.member.id)) return message.channel.send(`Sorry, you already voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required.`);

    fetched.queue[0].voteSkips.push(message.member.id);
    ops.active.set(message.guild.id, fetched);

    if (fetched.queue[0].voteSkips.length >= required) {
      message.channel.send('Successfully skipped song!');
      return fetched.dispatcher.end();
    }
    message.channel.send(`Succesfully voted to skip ${fetched.queue[0].voteSkips.length}/${required} required`);
  }
});

bot.login(process.env.BOT_TOKEN);
console.log("Bot started!");


async function play(client, ops, data) {

  client.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} | Requested By: ${data.queue[0].requester}`);

  data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
  data.dispatcher.guildID = data.guildID;

  data.dispatcher.once('end', function () {
    finish(client, ops, this);
  })


}

function finish(client, ops, dispatcher) {
  let fetched = ops.active.get(dispatcher.guildID);

  fetched.queue.shift();

  if (fetched.queue.length > 0) {

    ops.active.set(dispatcher.guildID, fetched);

    play(client, ops, fetched);

  }
  else {
    ops.active.delete(dispatcher.guildID);

    let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
    if (vc) vc.leave();

  }
}

async function searchYT(client, message, args, ops) {
  search(args.join(' '), function (err, res) {
    if (err) return message.channel.send('Sorry, something went wrong.');

    let videos = res.videos.slice(0, 10);

    let resp = '';
    for (var i in videos) {
      resp += `\n**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
    }

    resp += `\n Choose a number between \`1-${videos.length}\``;

    message.channel.send(resp);

    const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;

    const collector = message.channel.createMessageCollector(filter);

    collector.videos = videos;

    collector.once('collect', function (m) {
      playYT(client, message, [this.videos[parseInt(m.content) - 1].url], ops);
    })

  })
}

async function playYT(client, message, args, ops) {
  if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');

  // if (message.guild.me.voiceChannel) return message.channel.send('Sorry, the bot is already connected to the guild.');

  if (!args[0]) return message.channel.send('Sorry, please input a url following the command');

  let validate = await ytdl.validateURL(args[0]);

  if (!validate) {
    let ops = {
      active: active
    }

    //let commandFile = require(`./search.js`);
    return searchYT(client, message, args, ops);

  }

  let info = await ytdl.getInfo(args[0]);

  let data = ops.active.get(message.guild.id) || {};

  if (!data.connection) data.connection = await message.member.voiceChannel.join();
  if (!data.queue) data.queue = [];
  data.guildID = message.guild.id;

  data.queue.push({
    songTitle: info.title,
    requester: message.author.tag,
    url: args[0],
    announceChannel: message.channel.id
  });

  if (!data.dispatcher) play(client, ops, data);
  else {

    message.channel.send(`Added To Queue: ${info.title} | Requested By: ${message.author.tag}`);
  }

  ops.active.set(message.guild.id, data);
}
bot.run('<BOT_TOKEN>')
