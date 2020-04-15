const cv = require('opencv4nodejs');
//const jimp = require('jimp');
const ImgDownload = require('image-downloader');
const fs = require('fs');

const classifiers = {
    FACE: "face",
    EYE: "eye",
    BODY: "body"
}

async function downloadImage(url, path){
    const options = {
        url: url,
        dest: path
    }
    
    filename = '';
    try{
        filename = (await ImgDownload.image(options)).filename;
            console.log('Saved to', filename)  // Saved to /path/to/dest/photo.jpg
            return filename;
    }
    catch(e){
        console.error(e);
        return 1;
    }
}

function detect(path, classifier){
    switch(classifier){
        case "face":
            classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
            break;
        case "eye":
            classifier = new cv.CascadeClassifier(cv.HAAR_EYE);
            break;
        case "body":
            classifier = new cv.CascadeClassifier(cv.HAAR_FULLBODY);
        default:
            classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
            break;
    }
    const mat = cv.imread(path);
    const matGray = mat.bgrToGray();
    return (classifier.detectMultiScale(matGray)).objects;
}

function drawDick(mat, point,size){
    const ballSize = size * 0.2;
    const center = point;
    let leftBall = new cv.Point(center.x - ballSize, center.y +  size * 0.3);
    let rightBall = new cv.Point(center.x + ballSize, center.y + size * 0.3);
    let shaftPos = new cv.Point(center.x,center.y - size * 0.1);
    mat.drawCircle(leftBall, ballSize, new cv.Vec(0, 255, 0), 5);
    mat.drawCircle(rightBall, ballSize, new cv.Vec(0, 255, 0), 5);
    let shaft = new cv.RotatedRect(shaftPos,new cv.Size(ballSize,size * 0.9), 0);
    mat.drawEllipse(shaft, new cv.Vec(0, 255, 0), 5);
    return mat
}

function dickhead(path){
    let points = detect(path, classifiers.FACE);
    const mat = cv.imread(path);
    if(points == 0){
        drawDick(mat, new cv.Point(mat.cols/2.0,mat.rows/2.0), mat.rows);
    }
    else{
        for(let i = 0; i < points.length; i++){
            drawDick(mat, new cv.Point(points[i].x + points[i].width/2.0,points[i].y + points[i].height/2.0), points[i].height);
        }
    }
    cv.imwrite(path,mat);
}

module.exports = {
    downloadImage:downloadImage,
    dickhead: dickhead
}