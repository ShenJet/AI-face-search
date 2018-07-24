const express = require('express');
const bodyParser = require('body-parser')

const fs = require('fs');
// const path = require('path');
// const mineType = require('mime-types');

const app = express();
const port = 3004;
// 防止报413数据过大错误
// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// 引入核心模块
const AipFaceClient = require("baidu-aip-sdk").face;
// 设置APPID/AK/SK
const APP_ID = "10569253";
const API_KEY = "CzRsLsylfL4W3koiQ1CsIFKk";
const SECRET_KEY = "OcSUZ8N6fGwyG47T4Tr3n6XbOQc4VqKg";
// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

app.use(express.static(__dirname+"/static"));

//创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/face', (req, res) => {
    res.sendFile(__dirname+`/static/index.html`);
});
app.post('/upload', urlencodedParser, (req, res) => {
// app.get('/upload', (req, res) => {
    var base64 = req.body.base64
    // console.log(base64);
    if(base64){
        //过滤data:URL
        base64 = base64.replace(/^data:image\/\w+;base64,/, "");
        // var dataBuffer = new Buffer(_base64, 'base64');
        // fs.writeFile(__dirname+"/upload/"+Math.floor(Math.random()*10000000)+".jpeg", dataBuffer, function(err) {
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("save OK~");
        //     }
        // });
        var imageType = "BASE64";
        // 从指定的group中进行查找 用逗号分隔，上限20个
        var groupIdList = "test01";
        // 如果有可选参数
        var options = {};
        // 图片质量控制 NONE: 不进行控制 LOW:较低的质量要求 NORMAL: 一般的质量要求 HIGH: 较高的质量要求 默认 NONE
        options["quality_control"] = "NORMAL";
        // 活体检测控制 NONE: 不进行控制 LOW:较低的活体要求(高通过率 低攻击拒绝率) NORMAL: 一般的活体要求(平衡的攻击拒绝率, 通过率) HIGH: 较高的活体要求(高攻击拒绝率 低通过率) 默认NONE
        options["liveness_control"] = "LOW";
        // 当需要对特定用户进行比对时，指定user_id进行比对。即人脸认证功能
        // options["user_id"] = "233451";
        // 查找后返回的用户数量。返回相似度最高的几个用户，默认为1，最多返回20个。
        options["max_user_num"] = "1";

        client.search(base64, imageType, groupIdList, options).then(function(result) {
            // 人脸搜索
            console.log('---人脸搜索---');
            console.log(result);
            // console.log(JSON.stringify(result));
            console.log('---人脸搜索结束---');
            res.json(result)
            // return result
        }).catch(function(err) {
            // 如果发生网络错误
            console.log('---人脸搜索---');
            console.log(err);
            console.log('---人脸搜索结束---');
            return err
        });
    }else{
        res.send({code:0,msg:"img data is null"});
    } 
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));




// 1.获取用户人脸列表
// var userId = "shenjie";
// var groupId = "test01";
function getUserFaces(userId,groupId) {
    // 调用获取用户人脸列表
    client.faceGetlist(userId, groupId).then(function(result) {
        console.log("----获取人脸列表----");
        console.log(JSON.stringify(result));
        console.log("----获取人脸列表结束----");
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}

// let filePath = path.resolve(__dirname +  "/faceimg/shenjie02.jpeg");
// let filePath = path.resolve(__dirname +  "/faceimg/csm02.jpeg");
// let filePath = path.resolve(__dirname +  "/faceimg/shenjie03.jpeg");
// console.log(filePath);
// // 同步读文件
// let base64 = fs.readFileSync(filePath).toString("base64");
// let imageType = "BASE64";//BASE64 / URL / face_token 3选1
// // 调用人脸检测
// // 如果有可选参数
// var options = {};
// options["face_field"] = "age,gender,glasses,beauty";
// options["max_face_num"] = "1";
// options["face_type"] = "LIVE";
function manFaceCheck(filePath,base64,imageType,options) {
    // 2.人脸检测：检测图片中的人脸并标记出位置信息
    client.detect(base64, imageType, options).then(function(result) {
        console.log('------人脸检测------');
        console.log(JSON.stringify(result));
        console.log('------检测结束------');
    }).catch(function(err) {
        // 如果发生网络错误
        console.log('------人脸检测------');
        console.log(err);
        console.log('------检测结束------');
    });
}


// 3.人脸搜索
// 考勤、打卡、签到等场景
// 有a,b两种模式：
// a) 1：N人脸搜索：也称为1：N识别，在指定人脸集合中，找到最相似的人脸；
// b) 1：N人脸认证：基于uid维度的1：N识别，由于uid已经锁定固定数量的人脸，所以检索范围更聚焦；
// let filePath = __dirname+"/faceimg/csm02.jpeg";
// let image = fs.readFileSync(filePath).toString("base64");
// let imageType = "BASE64";
// // 从指定的group中进行查找 用逗号分隔，上限20个
// let groupIdList = "test01";
// // 如果有可选参数
// var options = {};
// // 图片质量控制 NONE: 不进行控制 LOW:较低的质量要求 NORMAL: 一般的质量要求 HIGH: 较高的质量要求 默认 NONE
// options["quality_control"] = "NORMAL";
// // 活体检测控制 NONE: 不进行控制 LOW:较低的活体要求(高通过率 低攻击拒绝率) NORMAL: 一般的活体要求(平衡的攻击拒绝率, 通过率) HIGH: 较高的活体要求(高攻击拒绝率 低通过率) 默认NONE
// options["liveness_control"] = "LOW";
// // 当需要对特定用户进行比对时，指定user_id进行比对。即人脸认证功能
// // options["user_id"] = "233451";
// // 查找后返回的用户数量。返回相似度最高的几个用户，默认为1，最多返回20个。
// options["max_user_num"] = "1";
function faceSearch(image, imageType, groupIdList, options){
    console.log(imageType);
    console.log(image);
    // 带参数调用人脸搜索
    client.search(image, imageType, groupIdList, options).then(function(result) {
        // 人脸搜索
        console.log('---人脸搜索---');
        console.log(result);
        console.log(JSON.stringify(result));
        console.log('---人脸搜索结束---');
        
        return result
    }).catch(function(err) {
        // 如果发生网络错误
        console.log('---人脸搜索---');
        console.log(err);
        console.log('---人脸搜索结束---');
        return err
    });
}

