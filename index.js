require('dotenv').config();
const commands = require('./commands');
const Discord = require('discord.js');
const client = new Discord.Client();
const link = /^((?:(?:http[s]?|ftp):\/)?\/?(?:[^:\/\s]+)(?:(?:\/\w+)*\/)(?:[\w\-\.]+[^#?\s]+)(?:.*)?(?:#[\w\-]+)?)$/
const regID = /!dick \d{18}/;
const userReg = /<@!?\d{18}>/;

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
        if(link.test(content[1])){
            url = msg.content.split(' ')[1];
            console.log(url);
        }
        else if(userReg.test(content[1])){
            if(msg.mentions.users.first() == null || msg.mentions.users.first().avatarURL() == null){
                msg.channel.send('its fucking null bitch');
                return 1;
            }
            else
                url = msg.mentions.users.first().avatarURL();
        }
        else if(regID.test(msg.content)){
            try {
                let user = await client.users.fetch(content[1]);
                if(user.avatarURL() == null){
                    msg.channel.send('its fucking null bitch');
                    return 1;
                }
                url = user.avatarURL();   
            } catch (error) {
                msg.channel.send('not a user id');
                return 1
            }
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