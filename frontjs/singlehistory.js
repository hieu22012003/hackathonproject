const getIdData = async() => {
    const url = window.location.href + "/singleid"
    console.log(url);
    const res = await fetch(url,{
        method : "GET"
    })
    
    const [resJson] = await res.json();
   console.log(resJson)
}

getIdData()