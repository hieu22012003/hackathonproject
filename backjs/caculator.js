import {findUser,findUserData,addNewData,createUser} from "./main.js"


const avgScore = async(id) => {
    const userData = await findUserData(id);
    const numberOfTest = userData.length;
    let sum = 0;
    userData.forEach(item => {
        sum += item.Score;
    });
    return sum/numberOfTest;
}

const maxScore = async (id) => {
    const userData = await findUserData(id);
    let mx = 0;
    userData.forEach(item => {
        mx = Math.max(mx,item.Score)
    });
    return mx;
}

export {avgScore,maxScore}