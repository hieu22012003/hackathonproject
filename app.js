import exp from 'constants';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {showAll,showData, createUser ,updateData} from './backjs/main.js'
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
app.post('/quiz.html',(req,res) => {
    console.log(req.body);
    res.status(200).send({status: "ok"});
})



// server port
app.listen(5500,() => console.log('server listening at port 5500'))