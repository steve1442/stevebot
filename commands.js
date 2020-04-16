const path = require('path');
const fs = require('fs');
const computerVision = require('./computerVision');
const Discord = require('discord.js');
const webp = require('webp-converter');

const filesTypes = [".png",".jpeg",".jpg",".webp"];

function onReady(){
    if(!fs.existsSync('temp/')){
        fs.mkdirSync('temp/');
    }
}

async function help(msg){
    msg.channel.send(new Discord.MessageEmbed()
        .setColor('#00ffd5')
        .setTitle('Commands')
        .setAuthor('@SteveKeller', 'https://avatars0.githubusercontent.com/u/34516255?s=460&u=34c73060337b6baf172789c1e46e8f0bd687a812&v=4', 'https://github.com/steve1442')
        .setThumbnail(msg.client.user.avatarURL())
        .addFields(
            {
                name: `!stevehelp`,
                value: 'displays the list of available commands',
                inline: false
            },
            {
                name: `!dick, !dick <mention>, !dick <userID>, !dick <attachment>`,
                value: 'displays specified user profile picture with a dick on the face',
                inline: false
            },
            {
                name: `!face, !face <mention>, !face <link>, !face <attachment>`,
                value: 'puts a random image on faces in the image',
                inline: false
            },
            {
                name: `!steve github`,
                value: 'sends link to bots source code',
                inline: false
            }
        )
    );
}

async function faceSwap(msg, url){
let filePath = await computerVision.downloadImage(url,'temp/');
            const stats = fs.statSync(filePath);
            if(stats["size"] > 8000000){
                msg.channel.send('too big sorry');
                return 'too big sorry';
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
                return ("cant accept type" + filetype);
            }
            webp.dwebp(filePath, 'temp/converted.jpg', "-o", async (status, error) => {
                if (status == '100'){
                    fs.unlink(filePath,() =>{

                    });
                    console.log("succesfully deleted: " + filePath);
                    filePath = 'temp/converted.jpg';   
                }
                else console.log(status, error);
                await computerVision.faceReplace(filePath);
                const attachment = new Discord.MessageAttachment(filePath);
                await msg.channel.send(new Discord.MessageEmbed()
                .setTitle('Steve Bot')
                .setColor('#00ffd5')
                .setAuthor('@SteveKeller', 'https://avatars0.githubusercontent.com/u/34516255?s=460&u=34c73060337b6baf172789c1e46e8f0bd687a812&v=4', 'https://github.com/steve1442')
                .setFooter('this used the !face command !stevehelp for more info')
                .attachFiles(attachment)
                .setImage('attachment://'+ attachment.attachment.substr(5))
            );
                console.log('sent image');
                fs.unlink(filePath, () =>{
                    console.log("succesfully deleted: " + filePath);
                });
            });
}


async function impersonate(msg, content, member){
    const bot_name = member.displayName;
    const bot_pfp = member.user.avatarURL();
    try {
        let hook = await msg.channel.createWebhook(bot_name, {
          avatar: bot_pfp,
          reason: 'impersonation'
        });
        await hook.send(content);
        console.log('impersonation complete');
        await hook.delete();
      }
      catch (e) {
        try { await hook.delete(); }
        catch (ee) { console.error(ee); }
        console.error(e);
        return 1;
      }
      msg.delete();
}

async function dick(msg, url){
    let filePath = await computerVision.downloadImage(url,'temp/');
            const stats = fs.statSync(filePath);
            if(stats["size"] > 8000000){
                msg.channel.send('too big sorry');
                return 'too big sorry';
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
                return ("cant accept type" + filetype);
            }
            await webp.dwebp(filePath, 'temp/converted.jpg', "-o", (status, error) => {
                if (status == '100'){
                    fs.unlinkSync(filePath);
                    console.log("succesfully deleted: " + filePath);
                    filePath = 'temp/converted.jpg';
                }
                else console.log(status, error);
              });
            computerVision.dickhead(filePath);
            const attachment = new Discord.MessageAttachment(filePath);
            console.log(attachment.attachment.substr(5));
            await msg.channel.send(new Discord.MessageEmbed()
                .setTitle('Steve Bot')
                .setColor('#00ffd5')
                .setAuthor('@SteveKeller', 'https://avatars0.githubusercontent.com/u/34516255?s=460&u=34c73060337b6baf172789c1e46e8f0bd687a812&v=4', 'https://github.com/steve1442')
                .setFooter('this used the !dick command !stevehelp for more info')
                .attachFiles(attachment)
                .setImage('attachment://'+ attachment.attachment.substr(5))
            );
            console.log('sent image');
            fs.unlink(filePath, () =>{
                console.log("succesfully deleted: " + filePath);
            });
}

module.exports = {
    dick:dick,
    onReady:onReady,
    help:help,
    faceSwap:faceSwap,
    impersonate:impersonate
}