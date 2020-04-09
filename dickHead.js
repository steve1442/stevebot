const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const https = require('https');
const cv = require('opencv4nodejs');
const Stream = require('stream').Transform
//const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

function dickhead(url, msg){
    https.request(url, function(response) {                                        
        var data = new Stream();                                                    
      
        response.on('data', function(chunk) {                                       
          data.push(chunk);                                                         
        });                                                                         
      
        response.on('end', function() {                                             
          fs.writeFileSync('image.png', data.read());
          let types = ['png','jpg','jpeg','webp'];
          let flag = false;
          types.forEach( type =>{
          let splitUrl = url.split('.');
            if(splitUrl[splitUrl.length-1] == type){
                flag = true;
            }
          });
          if(!flag){
              msg.channel.send("oi cunt that wasnt a fucking jpg,jpeg,or png");
              return 0
          }
          const mat = cv.imread('image.png');
          const matGray = mat.bgrToGray();
          console.log('1');
          classifier.detectMultiScaleAsync(matGray, (err, res) => {
            if (err) { return console.error(err); }
        console.log('2');
        if(res.objects == 0){
            msg.channel.send("no person found :(");
            return 0;
        }
        res.objects.forEach(thingy =>{
            let ballSize = thingy.height * 0.2;
            let center = new cv.Point(thingy.x + (thingy.width/2.0),thingy.y + (thingy.height/2.0));
            let leftBall = new cv.Point(center.x - ballSize, center.y +  thingy.height * 0.3);
            let rightBall = new cv.Point(center.x + ballSize, center.y + thingy.height * 0.3);
            let shaftPos = new cv.Point(center.x,center.y - thingy.height * 0.1);
           // mat.drawCircle(center,thingy.height/2.0, new cv.Vec(0, 255, 0), 5);
            mat.drawCircle(leftBall, ballSize, new cv.Vec(0, 255, 0), 5);
            mat.drawCircle(rightBall, ballSize, new cv.Vec(0, 255, 0), 5);
            let shaft = new cv.RotatedRect(shaftPos,new cv.Size(ballSize,thingy.height * 0.9), 0);
            mat.drawEllipse(shaft, new cv.Vec(0, 255, 0), 5);
        
           // cv.drawDetection(mat, thingy);
            console.log('2.5');
        });
          console.log('3');
        
          cv.imwriteAsync('gaylord.png',mat, ()=>{
            const attachment = new Discord.MessageAttachment('gaylord.png');
            msg.channel.send(attachment);
            console.log('4');
        });
        });
                                
        });                                                                         
      }).end();
}

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!dickhead"); 
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
                dickhead(url,msg)
            }
            else{
        msg.attachments.forEach(a =>{
            url = a.url
            dickhead(url, msg);
        });
    }
    }
});

client.login('NDM3MjQ0MTM3MzE0NTgyNTMw.Xo5saA.HxorxmR3FQa0DV__vWruVI8mT38');