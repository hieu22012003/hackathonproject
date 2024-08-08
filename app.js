import exp from 'constants';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.use('/css',express.static('./css'))
// app.use(express.static(path.join(__dirname,'frontjs')))
console.log(path.join(__dirname,'css'))

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})


app.listen(5500,() => console.log('server listening at port 5500'))