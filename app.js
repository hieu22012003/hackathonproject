import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {showAll,showData, createUser} from './backjs/main.js'
import { avgScore, maxScore } from './backjs/caculator.js';
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);


// middleware use statc files
app.use('/css',express.static('./css'))
app.use('/images',express.static('./images'))
app.use('/frontjs',express.static('./frontjs'))
app.use('/Video',express.static('/Video'))
app.use(express.json());



// set req and render html
app.get(['/','/index.html'],(req,res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
})

const htmlFiles = ['/quiz.html','/pomodoro.html','/File_Upload.html'];
htmlFiles.forEach((item) => {
    app.get(item,(req,res) => {
        res.sendFile(path.join(__dirname,'public',item.substring(1)));
    })
})




// get request from quiz.html
app.post('/quiz.html',async (req,res) => {

    //get req data
    const reqDataBack = req.body.data;
    const personalInfor = reqDataBack.id;
    const userData = reqDataBack.User_Data;
    const userScore = reqDataBack.User_Score;


    // req database , get user info, create new records
    const response = await showData(personalInfor.username, personalInfor.password)
    createUser(personalInfor.username,personalInfor.password,JSON.stringify(userData),userScore);

    console.log(reqDataBack)
    res.status(200).send({status: "ok"})

})



// send data back;
let reqDataBack2;
app.post('/history', (req,res) => {
    res.send('<h1>hello</h1>');
    reqDataBack2 = req.body.id;
    console.log(reqDataBack2)
})

app.get('/history',async (req,res) => {
    // res.send(`<h1>Hello</h1>`)
    const userData = await showData(reqDataBack2.username,reqDataBack2.password);
    
    // parse json and push json data to resData
    let resData = [];
    userData.forEach(item => {
        resData.push(JSON.parse(item.User_Data))
    })

    const numberOfTest = resData.length;
    const average = await avgScore(reqDataBack2.username,reqDataBack2.password)
    const mx = await maxScore(reqDataBack2.username,reqDataBack2.password);

    resData.push([{
        "averageScore" : average,
        "maxScore": mx ,
        "numberOfTest": numberOfTest
    }])

    res.status(200).send(resData);
})
// server port
app.listen(5500,() => console.log('server listening at port 5500'))