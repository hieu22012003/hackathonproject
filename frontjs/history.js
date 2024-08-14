const allContent = document.getElementsByClassName('all-content')
let responseData;

const createNewTableLayout = () => {
    // create table layout
    const arr = ["history-content","list","text","info"
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


//get data from server
const getData = async() => {
    const url = "http://localhost:5500/history";
    const res = await fetch(url,{
        method: "GET"
    })
    const responseData= await res.json();
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

}
