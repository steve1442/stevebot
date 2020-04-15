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
    msg.channel.send("```"+
    "Steve-Bot Help\n"+
    "!dick \n"+
    "   -file           draws dick on people in attachment\n"+
    "   -pfp            draws dick on people mentioned inpersons pfp\n"+
    "   -url            draws dick on image sent via url\n"+
    "!steve github      for stinky nerds that want to see my github\n"+
    "```")
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
            webp.dwebp(filePath, 'temp/converted.jpg', "-o", (status, error) => {
                if (status === '100'){
                    fs.unlinkSync(filePath);
                    console.log("succesfully deleted: " + filePath);
                    filePath = 'temp/converted.jpg';
                }
                else console.log(status, error);
              });
            computerVision.dickhead(filePath);
            const attachment = new Discord.MessageAttachment(filePath);
            await msg.channel.send(attachment);
            console.log('sent image');
            fs.unlink(filePath, () =>{
                console.log("succesfully deleted: " + filePath);
            });
}

module.exports = {
    dick:dick,
    onReady:onReady,
    help:help
}