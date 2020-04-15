require('dotenv').config();
const computerVision = require('./computerVision');
const fs = require('fs');
const Discord = require('discord.js');
const path = require('path');
const client = new Discord.Client();
let image = 0;
const filesTypes = [".png",".jpeg",".jpg"];


client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!stevehelp"); 
    if(!fs.existsSync('temp/')){
        fs.mkdirSync('temp/');
    }
});

client.on('message', msg =>{
    if(msg.content.startsWith("!stevehelp")){
        msg.channel.send("```!dick      send this with an attachment to get an image returned with a dick on the faces found```");
    }
    if(msg.content.startsWith('!dick')){
        msg.attachments.forEach(async a =>{
            let filePath = await computerVision.downloadImage(a.url,'temp/');
            console.log(filePath);
            const stats = fs.statSync(filePath);
            if(stats["size"] > 8000000){
                msg.channel.send('too big sorry');
                return 1;
            }
            const filetype = path.extname(filePath).toLowerCase();
            let flag = false;
            filesTypes.forEach(type =>{
                if(filetype == type){
                    flag = true;
                }
            });
            if(!flag){
                msg.channel.send("cant accept type" + filetype);
                return 1;
            }
            computerVision.dickhead(filePath);
            const attachment = new Discord.MessageAttachment(filePath);
            await msg.channel.send(attachment);
            fs.unlink(filePath, () =>{
                console.log("succesfully deleted: " + filePath);
            });
            image++;
        });
        return 0;
    }
});

client.login(process.env.BOT_TOKEN);