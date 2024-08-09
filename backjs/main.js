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

const createUser = async(username,password,userData,score) => {
    await conn.query(`INSERT INTO people (Username,Pass,User_Data,Score) VALUES (?,?,?,?)`,[username,password,userData,score]);
}


const res = await showData("person1","hellp");
console.log(res);


export {showAll,showData,createUser};