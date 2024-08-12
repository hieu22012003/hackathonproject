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


const createUser = async(username,password) => {
    await conn.query(`INSERT INTO people(Username,Pass) 
        VALUES(?,?)`,[username,password]);
}

const findUser = async(username,password) => {
    const [res] = await conn.query(`SELECT * FROM people
        WHERE Username = ? && Pass = ?`,[username,password])
    if(res.length === 0) return -1;
    return res[0].PersonId; 
}

const findUserData = async(id) => {
    const [res] = await conn.query(`SELECT * FROM userData
        WHERE PersonId = ?`,[id])
    return res;
}

const addNewData = async(PersonId,User_Data,Score,Number_Of_Questions,Correct_Questions) => {
    await conn.query(`INSERT INTO userData(PersonID,User_Data,Score,Number_Of_Questions,Correct_Questions)
        Values(?,?,?,?,?)`,[PersonId,User_Data,Score,Number_Of_Questions,Correct_Questions]);
}



export {findUser,findUserData,addNewData,createUser};

