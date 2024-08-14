import {findUser,findUserData,addNewData,createUser} from "./main.js"


const percentScore = (total,correct) => {
    return correct/(total/100)
}

export {percentScore}