import {showAll,showData,createUser} from "./main.js"


const avgScore = async(username,password) => {
    const userData = await showData(username,password);
    const numberOfTest = userData.length;
    let sum = 0;
    userData.forEach(item => {
        sum += item.Score;
    });
    return sum/numberOfTest;
}

const maxScore = async (username,password) => {
    const userData = await showData(username,password);
    let mx = 0;
    userData.forEach(item => {
        mx = Math.max(mx,item.Score)
    });
    return mx;
}

export {avgScore,maxScore}