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


// create user
const createUser = async(username,password,email) => {
    await conn.query(`INSERT INTO people(Username,Pass,Email) 
        VALUES(?,?,?)`,[username,password,email]);
}

// find id user
const findUser = async(username,password) => {
    const [res] = await conn.query(`SELECT * FROM people
        WHERE Username = ? && Pass = ?`,[username,password])
    if(res.length === 0) return -1;
    return res[0].PersonId; 
}

// find user data
const findUserData = async(id) => {
    const [res] = await conn.query(`SELECT * FROM userData
        WHERE PersonId = ?`,[id])
    return res;
}

// add new data
const addNewData = async(PersonId,User_Data,Score,Number_Of_Question,Correct_Questions,User_Question,AI_res,trueFalse) => {
    await conn.query(`INSERT INTO userData (PersonID,User_Data,Score,Number_Of_Question,Correct_Questions,User_Question,AI_Res,True_False)
        VALUES(?,?,?,?,?,?,?,?)`,[PersonId,User_Data,Score,Number_Of_Question,Correct_Questions,User_Question,AI_res,trueFalse]);
}

// find data via id
const findDataId = async(id) => {
    const [res] = await conn.query(`SELECT * FROM userData
        WHERE DataId = ?`,[id]);
    return res;
}


/// find Column this one just for backend and server
const findColumnPerson = async(column) => {
    const [res] = await conn.query(`SELECT ${column} FROM people`);
    return res;
}


export {findUser,findUserData,addNewData,createUser,findDataId,findColumnPerson};

