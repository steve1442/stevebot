const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const https = require('https');
const cv = require('opencv4nodejs');
const Stream = require('stream').Transform
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

function drawDick(mat, x,y,size){
    let ballSize = size * 0.2;
    let center = new cv.Point(x ,y);
    let leftBall = new cv.Point(center.x - ballSize, center.y +  size * 0.3);
    let rightBall = new cv.Point(center.x + ballSize, center.y + size * 0.3);
    let shaftPos = new cv.Point(center.x,center.y - size * 0.1);
    mat.drawCircle(leftBall, ballSize, new cv.Vec(0, 255, 0), 5);
    mat.drawCircle(rightBall, ballSize, new cv.Vec(0, 255, 0), 5);
    let shaft = new cv.RotatedRect(shaftPos,new cv.Size(ballSize,size * 0.9), 0);
    mat.drawEllipse(shaft, new cv.Vec(0, 255, 0), 5);
    return mat
}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}

function dickhead(url, msg){
    https.request(url, function(response) {                                        
        var data = new Stream();                                                    
        let types = ['png','jpg','jpeg','webp'];
        let flag = false;
        let fileType = response.headers['content-type'].split('/')[1].toLowerCase();
        types.forEach( type =>{
            if( fileType == type){
                flag = true;
            }
        });
        if(!flag){
            msg.channel.send("oi cunt that wasnt a fucking jpg,jpeg,or png");
            return 0
        }
        response.on('data', function(chunk) {                                       
          data.push(chunk);                                                         
        });                                                                         
        response.on('end', function() {                                             
            fs.writeFileSync('image.'+fileType, data.read());   
          
            if(getFilesizeInBytes('image.png') >= 8000000){
                msg.channel.send('file too large');
                return 0
            }
            const mat = cv.imread('image.'+fileType);
            const matGray = mat.bgrToGray();
            classifier.detectMultiScaleAsync(matGray, (err, res) => {
                if (err) { return console.error(err); }
                if(res.objects == 0){
                    drawDick(mat,mat.cols/2.0, mat.rows/2, mat.rows/2);
                    msg.channel.send("no person found :(");
                }
                res.objects.forEach(thingy =>{
                    drawDick(mat,thingy.x + thingy.width/2.0, thingy.y + thingy.height/2.0, thingy.height);
                });
                console.log(res.objects.length);
                cv.imwriteAsync('gaylord.'+fileType,mat, ()=>{
                    if(getFilesizeInBytes('gaylord.'+fileType) >= 8000000){
                        msg.channel.send('file too large');
                        return 0
                    }
                    const attachment = new Discord.MessageAttachment('gaylord.'+fileType);
                    msg.channel.send(attachment);
                });
            });
        });                                      
    }).end();
}

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!stevehelp"); 
});

client.on('message', msg =>{ 
    if(msg.content.startsWith("!stevehelp")){
        msg.channel.send("```Steve Bot Command Help\n\n!dickhead (send an image with this command) draws a dick on the faces found in the image\n!dickhead link draws a dick on the image sent in the link \n!dickhead avatar @person draws a dick on that users avatar```");
    }
    if(msg.content.startsWith("!dickhead")){
        
        let url;
            if(msg.content.split(' ')[1] == "avatar"){ 
                    
                   if(msg.mentions.users.first() == null || msg.mentions.users.first().avatarURL() == null){
                       msg.channel.send('its fucking null bitch');
                   }
                   else{
                        dickhead(msg.mentions.users.first().avatarURL(),msg);
                   }
            }
            else if(msg.content.split(' ')[1] == 'link'){
                url = msg.content.split(' ')[2];
                dickhead(url,msg);   
            }
            else{
        msg.attachments.forEach(a =>{
            url = a.url
            dickhead(url, msg);            
        });
    }
    }
});

client.login('NDM3MjQ0MTM3MzE0NTgyNTMw.Xo-MPA.R8njCNRn16Q0Wd0j43uL5qqTMbo');