import mysql from "mysql2";
import dotenv from 'dotenv'
dotenv.config();

const conn = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'db'
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

const updateData = async(username,password,data) => {
    await conn.query(`UPDATE people
        SET User_Data = ?
        WHERE Username = ? && Pass = ?
    `,[data,username,password])
}

const res = await showAll();
console.log(res);