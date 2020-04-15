require('dotenv').config();
const command = require('./commands');
const Discord = require('discord.js');
const client = new Discord.Client();
const link = /^!dickhead\s+url\s+((?:(?:http[s]?|ftp):\/)?\/?(?:[^:\/\s]+)(?:(?:\/\w+)*\/)(?:[\w\-\.]+[^#?\s]+)(?:.*)?(?:#[\w\-]+)?)$/


client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!stevehelp");
    command.onReady(); 
});

client.on('message', async msg =>{
    if(msg.content.startsWith("!stevehelp")){
        msg.channel.send("```!dick      send this with an attachment to get an image returned with a dick on the faces found```");
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
        command.dick(msg, url);
        return 0;
    }
});

client.login(process.env.BOT_TOKEN);