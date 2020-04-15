require('dotenv').config();
const commands = require('./commands');
const Discord = require('discord.js');
const client = new Discord.Client();
const link = /^!dickhead\s+url\s+((?:(?:http[s]?|ftp):\/)?\/?(?:[^:\/\s]+)(?:(?:\/\w+)*\/)(?:[\w\-\.]+[^#?\s]+)(?:.*)?(?:#[\w\-]+)?)$/


client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!stevehelp");
    commands.onReady(); 
});

client.on('message', async msg =>{
    if(msg.content.startsWith("!stevehelp")){
        commands.help(msg);
    }
    if(msg.content.startsWith("!steve github")){
        msg.channel.send(("Steve\'s github\n" + "https://github.com/steve1442" + "\nBot's Code\n" + "https://github.com/steve1442/stevebot"));
    }
    if(msg.content.startsWith('!dick')){
        let url = '';
        const content = msg.content.split(' ');
        if(content[1] == "url" && link.test(content[2])){
            url = msg.content.split(' ')[2];
        }
        else if(content[1] == 'pfp'){
            if(msg.mentions.users.first() == null || msg.mentions.users.first().avatarURL() == null){
                msg.channel.send('its fucking null bitch');
                return 1;
            }
            else
                url = msg.mentions.users.first().avatarURL();
        }
        else{
            msg.attachments.forEach(a =>{
                url = a.url;
            });
        }
        commands.dick(msg, url);
        return 0;
    }
});

client.login(process.env.BOT_TOKEN);