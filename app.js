import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {findUser,findUserData,addNewData,createUser, findDataId, findColumnPerson}from './backjs/main.js'
import { percentScore } from './backjs/caculator.js';
import { sendEmail } from './backjs/email.js';
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
    const email = userReqBack.id.email;
    const userData = userReqBack.User_Data;
    const correctAns = userReqBack.User_Correct;
    const totalQues = userReqBack.User_Total;
    const score = userReqBack.User_Score;
    const userQues = userReqBack.User_Questions;
    const AI_Res = userReqBack.AI_res;


    console.log(userReqBack);

    let checkUser = await findUser(username,password);

    // check if user exist
    if(checkUser === -1){
        // create va tim lai id user
        await createUser(username,password,email);
        checkUser = await findUser(username,password);

        addNewData(checkUser,JSON.stringify(userData),score,totalQues,correctAns,userQues,AI_Res)

    }else{
        addNewData(checkUser,JSON.stringify(userData),score,totalQues,correctAns,userQues,AI_Res)
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



//get single history id
app.get('/history.html/:id',async(req,res) => {
   const id = req.params.id
   const responseData = await findDataId(id);
   res.status(200).send(responseData)
})




app.get('*', (req,res) => {
    res.status(404).send('Page not found');
})



//get email
const getEmailAdr = async () => {
    const res = await findColumnPerson('Email');
    res.forEach(async (item) => {
        await sendEmail(item.Email);
    })
}


// send email per day
// const sendPerDay =  setInterval(getEmailAdr,60000)

// server port
app.listen(5500,() => console.log('server listening at port 5500'));