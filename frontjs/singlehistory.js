const historyContainer = document.querySelector('.history');





const renderHeader = async (res) => {
    // implement
    const correct = res.Correct_Questions
    const totalQues = res.Number_Of_Question
    const score = res.Score
    let userData = res.User_Data

    userData = JSON.parse(userData)
    const subject = userData[0].subject
    const grade = userData[0].class

    console.log(correct,totalQues,score,subject,grade)



    // header
    const headerArticle = document.createElement('div');
    headerArticle.className = 'header-article';

    // Create the left section of the header
    const leftHeader = document.createElement('div');
    leftHeader.className = 'left';

    // the grade and sub ject
    const h3Class = document.createElement('h3');
    h3Class.textContent = grade;


    const h3Subject = document.createElement('h3');
    h3Subject.textContent = subject;


    leftHeader.appendChild(h3Class);
    leftHeader.appendChild(h3Subject);

    // Create the right section of the header
    const rightHeader = document.createElement('div');
    rightHeader.className = 'right';

    const correctDiv = document.createElement('div');
    correctDiv.className = 'correct';


    const correctLabel = document.createElement('p');
    correctLabel.textContent = 'Số câu đúng';


    const correctValue = document.createElement('p');
    correctValue.textContent = correct;// so cau dung

    // append
    correctDiv.appendChild(correctLabel);
    correctDiv.appendChild(correctValue);

    const wrongDiv = document.createElement('div');
    wrongDiv.className = 'wrong';
    
    const wrongLabel = document.createElement('p');
    wrongLabel.textContent = 'Số câu sai';


    const wrongValue = document.createElement('p');
    wrongValue.textContent = totalQues-correct; // number of wrong ans


    wrongDiv.appendChild(wrongLabel);
    wrongDiv.appendChild(wrongValue);


    // total;
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total';

    const totalLabel = document.createElement('p');
    totalLabel.textContent = 'Tổng điểm';

    const totalValue = document.createElement('p');
    totalValue.textContent = score + "/10"; // tong diem


    //append
    totalDiv.appendChild(totalLabel);
    totalDiv.appendChild(totalValue);


    // Append correct, wrong, and total to the rightHeader
    rightHeader.appendChild(correctDiv);
    rightHeader.appendChild(wrongDiv);
    rightHeader.appendChild(totalDiv);


    // Append left and right sections to the headerArticle
    headerArticle.appendChild(leftHeader);
    headerArticle.appendChild(rightHeader);

    // Append the headerArticle to the history container
    historyContainer.appendChild(headerArticle);
}



// query each question
// Function to create a query item
const createQuery = (isCorrect, questionText, selectedAnswer,answer) => {

    // create query div
    const query = document.createElement('div');
    query.className = 'query';
    query.classList.add(isCorrect ? 'correct-border' : 'wrong-border');

    // create the top
    const top = document.createElement('div');
    top.className = 'top';

    const questionTitle = document.createElement('h3');
    questionTitle.textContent = questionText;


    // check if each question correct
    const resultText = document.createElement('h3');
    resultText.className = isCorrect ? 'correctword' : 'notcorrect';
    resultText.textContent = isCorrect ? 'Chính xác' : 'Không chính xác';

    // append to top
    top.appendChild(questionTitle);
    top.appendChild(resultText);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'choice';

    for (let i = 1; i <= 4; i++) {
        const ansDiv = document.createElement('div');
        ansDiv.className = `ans${i}`;

        const choiceIndicator = document.createElement('div');

        // check question = correct choice 
        if (i === selectedAnswer) {
            choiceIndicator.className = isCorrect ? 'correct-choice' : 'wrong-choice';
        }

        const choiceText = document.createElement('p');
        choiceText.textContent = answer[i-1].text;

        ansDiv.appendChild(choiceIndicator);
        ansDiv.appendChild(choiceText);
        choiceContainer.appendChild(ansDiv);
    }

    // append to query
    query.appendChild(top);
    query.appendChild(choiceContainer);

    return query;
}




// loop qua tung query
const loopQueries = (res) => {
    // implement
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'Questions';

    let userData = res.User_Data;
    let userCheck = res.True_False;
    
    
    userData = JSON.parse(userData); // userData parse
    userCheck = userCheck.split(','); // usercheck check lai

    userData.forEach((item,index) => {
        if(index === 0)return; // skip the first json

        let data = JSON.parse(userCheck[index-1]);
        
        // return  false question
        if(data.true === undefined){
            console.log
           let query = createQuery(false,`Question ${index}: ${item.question}`,data.false,item.answers)
            questionsContainer.appendChild(query) // append query to question

        }else{ // return true question
            let query = createQuery(true,`Question ${index}: ${item.question}`,data.true,item.answers)
            questionsContainer.appendChild(query) // append query to question
        }

    });
    console.log(userData);
    historyContainer.appendChild(questionsContainer)
}










// render feed back
const renderFeedBack = (res) => {
    const fb = res.AI_Res;
    console.log(fb)
}








// getId Data
const getIdData = async() => {
    const url = window.location.href + "/singleid"
    console.log(url);
    const res = await fetch(url,{
        method : "GET"
    })
    
    const [resJson] = await res.json();
    console.log(resJson)

    renderHeader(resJson);
    loopQueries(resJson);
    renderFeedBack(resJson)
}





getIdData()
// loopQueries();