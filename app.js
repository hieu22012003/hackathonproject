import exp from 'constants';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.use('/css',express.static('./css'))
app.use('/images',express.static('./images'))
app.use('/frontjs',express.static('./frontjs'))
// app.use(express.static(path.join(__dirname,'frontjs')))
console.log(path.join(__dirname,'css'))

app.get(['/','/index.html'],(req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})

const htmlFiles = ['/quiz.html','/pomodoro.html','/File_Upload.html'];
htmlFiles.forEach((item) => {
    app.get(item,(req,res) => {
        res.sendFile(path.join(__dirname,item.substring(1)));
    })
})



app.listen(5500,() => console.log('server listening at port 5500'))