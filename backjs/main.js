import mysql from "mysql2";
import dotenv from 'dotenv'
dotenv.config({path: "./backjs/.env"});


const conn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: process.env.PORT
}).promise()

const showAll = async() => {
    const res = await conn.query("SELECT * FROM people")
    return res[0];
}

const showData = async(username,password) => {
    const res = await conn.query(`SELECT * FROM people WHERE Username = ? && Pass = ?`,[username,password]);
    return res[0];
}

const createUser = async(username,password) => {
    await conn.query(`INSERT INTO people (Username,Pass) VALUES (?,?)`,[username,password]);
}

const updateData = async(username,password,data,numberOfQuiz,avgScore,maxScore) => {
    await conn.query(`UPDATE people
        SET User_Data = ?, Number_Of_Test = ?, Avg_Score = ?, Max_Score = ?
        WHERE Username = ? && Pass = ?
    `,[data,numberOfQuiz,avgScore,maxScore,username,password]);
}

const res = await showAll();
await updateData("person1","test","hello everyone");
console.log(res);


export {showAll,showData,createUser,updateData};