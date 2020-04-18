require('dotenv').config();
const commands = require('./commands');
const Discord = require('discord.js');
const client = new Discord.Client();
const link = /^((?:(?:http[s]?|ftp):\/)?\/?(?:[^:\/\s]+)(?:(?:\/\w+)*\/)(?:[\w\-\.]+[^#?\s]+)(?:.*)?(?:#[\w\-]+)?)$/
const regID = /!dick \d{18}/;
const faceRegID = /!face \d{18}/;
const userReg = /<@!?\d{18}>/;
const impersonateReg =  /!impersonate <?@?!?\d{18}>?/; 

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!stevehelp");
    commands.onReady(); 
});

client.on('message', async msg =>{
    if(msg.content.startsWith("!stevehelp")){
        commands.help(msg);
    }
    else if(msg.content.startsWith("!steve github")){
        msg.channel.send(new Discord.MessageEmbed()
            .setColor('#00ffd5')
            .setTitle('Steve Bot Github')
            .setThumbnail('https://avatars0.githubusercontent.com/u/34516255?s=460&u=34c73060337b6baf172789c1e46e8f0bd687a812&v=4')
            .setAuthor('@SteveKeller', 'https://avatars0.githubusercontent.com/u/34516255?s=460&u=34c73060337b6baf172789c1e46e8f0bd687a812&v=4', 'https://github.com/steve1442')
            .addFields(
                {
                    name: `Steve's github`,
                    value: `https://github.com/steve1442`,
                    inline: false
                },
                {
                    name: `Bot's Code`,
                    value: `https://github.com/steve1442/stevebot`,
                    inline: false
                }
            )
        );
    }
    else if(msg.content.startsWith('!dick')){
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
    else if(msg.content.startsWith('!face ')){
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
        else if(faceRegID.test(msg.content)){
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
        commands.faceSwap(msg, url);
        return 0;
    }
    else if(msg.content.startsWith('!impersonate')){
        if(userReg.test(msg.content.split(' ')[1]) && msg.mentions.users.first() != null){
            try{
                let message = msg.content.substr(msg.content.indexOf('>') + 1);
                commands.impersonate(msg, message, msg.mentions.members.first());
            }
            catch(e){
                msg.channel.send('error something happened');
            }
        }
        else{
            try{
                let message = msg.content.substr(31);
                let member = await msg.guild.members.fetch(msg.content.split(' ')[1]);
                commands.impersonate(msg, message,member);
            } 
            catch(e){
                msg.channel.send('error something happened');
            }
        }
    }
    else if(msg.content.startsWith('!rng')){
        if(msg.content.split(' ')[1] == 'list'){
            commands.listRandom(msg, msg.content.substr(10));
        }
        else if(msg.content.split(' ')[1] == 'listorder'){
            commands.randomizeOrder(msg, msg.content.substr(15));
        }
        else{
            commands.randomNumb(msg, msg.content.split(' ')[1], msg.content.split(' ')[2]);
        }
    }
});

client.login(process.env.BOT_TOKEN);