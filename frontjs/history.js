const allContent = document.getElementsByClassName('all-content')
let responseData;



const createNewTableLayout = () => {
    // create table layout
    const arr = ["history-list","list","text","info"
        ,"total","correct","wrong","accuracy","sum"]


    // loop and create single elements
    let storage = []
    arr.forEach(item => {
        let temp = document.createElement("div")
        temp.setAttribute('class',item);

        storage.push(temp);
    })

    // add extra class "layout"
    for(let i = 4;i<=8;i++){
        storage[i].classList.add("layout");
    }

    return storage;
}

// create new element data
const createElement = (arr) => {
    const elements = createNewTableLayout();
    const [historyList,list,text,info] = elements

    // info

    const pElements = [];
    let stringElements = ["Tổng số câu hỏi","Số câu đúng","Số câu sai","Độ chính xác","Tổng điểm"]
    
    // create p element
    for(let i = 0;i<5;i++){
        let temp = document.createElement("p");
        let temp2 = document.createElement("p");//create element for the seccond p
        
        let node = document.createTextNode(stringElements[i])
        let node2 = document.createTextNode(arr[i]) // number in the arr above
        
        temp.appendChild(node);
        temp2.appendChild(node2);

        pElements.push(temp,temp2);
    }

    // push those p elements to class
    let pos = 0;
    for(let i = 4;i<=8;i++){
        elements[i].appendChild(pElements[pos]);
        elements[i].appendChild(pElements[pos+1]);
        pos+=2;
    }

    //push to info class
    for(let i = 4;i<=8;i++) info.appendChild(elements[i])
    

    // text
    let pLeft = document.createElement("p") // left
    pLeft.setAttribute('class','left')
    let nodeLeft = document.createTextNode(arr[5]);
    pLeft.appendChild(nodeLeft)

    let pRight = document.createElement("p") // right
    pRight.setAttribute('class','right');
    let nodeRight = document.createTextNode(arr[6])
    pRight.appendChild(nodeRight)


    text.appendChild(pLeft);
    text.appendChild(pRight);


    list.appendChild(text); // append text to list
    list.appendChild(info);
    historyList.appendChild(list)// append list to historyList
    allContent[0].appendChild(historyList)// .... 

    console.log(list);
    console.log(text);
    console.log(historyList)

}


//get data from server
const getData = async() => {
    const url = "http://localhost:5500/history";
    const res = await fetch(url,{
        method: "GET"
    })
    responseData = await res.json();
    console.log(responseData)
}

// post data
const postData = async() => {
    const url = "http://localhost:5500/history.html"
    const res = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            id: {
                "username":localStorage.getItem("username"),
                "password":localStorage.getItem("password")
            }
        })
    })
}

// post and get data
await postData();
await getData();

// renderData from json
const renderData = () => {

    // get percentScore from the last of array
    const percentScore = responseData[responseData.length-1].percentScore;

    // loop thorugh array
    responseData.forEach((item,index) => {
        if(index === responseData.length-1)return;
        const userData = JSON.parse(item.User_Data);

        // get json data
        let total = item.Number_Of_Question.toString();
        let correct = item.Correct_Questions.toString();
        let wrong = (total-correct).toString(); 
        let percent = percentScore[index]+"%";
        let score = item.Score.toString() + "/10";



        // create new element
        createElement([total,correct,wrong,percent,score,
            userData[0].class,userData[0].subject]);
    })
}

renderData();
