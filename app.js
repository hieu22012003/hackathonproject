import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {findUser,findUserData,addNewData,createUser}from './backjs/main.js'
import { percentScore } from './backjs/caculator.js';
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

const htmlFiles = ['/quiz.html','/pomodoro.html','/File_Upload.html','/history.html'];
htmlFiles.forEach((item) => {
    app.get(item,(req,res) => {
        res.sendFile(path.join(__dirname,'public',item.substring(1)));
    })
})




// get request from quiz.html
app.post('/quiz.html',async (req,res) => {

    //get req data
    const userReqBack = req.body.data;
    const username = userReqBack.id.username;
    const password = userReqBack.id.password;
    const userData = userReqBack.User_Data;
    const correctAns = userReqBack.User_Correct;
    const totalQues = userReqBack.User_Total;
    const score = userReqBack.User_Score;


    console.log(username,password,userData,correctAns,totalQues,score);

    let checkUser = await findUser(username,password);

    // check if user exist
    if(checkUser === -1){
        // create va tim lai id user
        await createUser(username,password);
        checkUser = await findUser(username,password);
        addNewData(checkUser,JSON.stringify(userData),score,totalQues,correctAns)

    }else{
        addNewData(checkUser,JSON.stringify(userData),score,totalQues,correctAns)
    }

})



// get username and pass
let reqDataBack2;
app.post('/history.html', (req,res) => {
    res.send('<h1>hello</h1>');
    reqDataBack2 = req.body.id;
    console.log(reqDataBack2)
})


//send user data back
app.get('/history',async (req,res) => {
    if(typeof reqDataBack2 == "undefined")return;
    const username = reqDataBack2.username;
    const password = reqDataBack2.password;
    const scoreByPercent = []

    // check if user exit
    let id = await findUser(username,password)
    if(id === -1){
        res.status(200).send([]);
        return;
    }
    const userData = await findUserData(id);
    if(userData.length === 0){
        res.status(200).send([]);
        return
    }


    // caculate percent correct
    userData.forEach(item => {
        let temp = percentScore(item.Number_Of_Question,item.Correct_Questions)
        scoreByPercent.push(temp.toFixed(2));
    })
    
    //send userdata back
    userData.push({percentScore: scoreByPercent});
    res.status(200).send(userData);
})
// server port
app.listen(5500,() => console.log('server listening at port 5500'));