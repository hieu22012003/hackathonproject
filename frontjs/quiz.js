import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";
const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";

let check = localStorage.getItem("check");
let userQues = "";
if(check == null){
    const username = prompt("nhap username: ")
    const password = prompt("nhap password: ")
    const Email = prompt("Nhap email")
    localStorage.setItem("username",username);
    localStorage.setItem("password",password);
    localStorage.setItem("email",Email)
    localStorage.setItem("check",true);
}




let text,final_s;

const API_URL = "https://api.coze.com/open_api/v2/chat";
const PSN_TOKEN = "pat_haBI1XCMgRmOiOyE8msUg64pduijELo4x9sPr3OBPrgTWG7gBuZOaTMpkmpHRSkm";

async function run() {
    document.getElementById('loading').innerHTML = `
    <span>Loading...</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
    `;

    const numQuestions = document.getElementById('num-questions').value;
    const type = document.getElementById('question-type').value;
    let prompt;
    userQues = document.getElementById('prompt').value;
    let pre_prompt = [
    
        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu và sắp xếp thự tự các "answer" ngẫu nhiên, có dựa theo nội dung hoặc chủ đề là: ${document.getElementById('prompt').value}. Trong 4 đáp án của từng câu, chỉ có 1 đáp án true và 3 đáp án false. Đáp án true là ngẫu nhiên trong 4 đáp án 1, 2, 3, 4. Cấu trúc nó sẽ nên như này (và chỉ promt ra nội dung câu hỏi dựa theo cấu trúc, ko nên thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề) ghi rõ là "Lớp mấy" ví dụ (Lớp 11):
        [
            {"subject":"môn học",class : "Lớp bao nhiêu"},
            { "question": "", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
            { "question": "", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
            { "question": "", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
        ]; `,

        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câuvà sắp xếp thự tự các "answer" ngẫu nhiên, dựa theo nội dung hoặc chủ đề là: ${document.getElementById('prompt').value}. Trong 4 đáp án của từng câu, có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng. Đáp án đúng sẽ được sắp xếp ngẫu nhiên trong 4 đáp án. Cấu trúc câu hỏi như sau (chỉ in ra nội dung câu hỏi theo cấu trúc này, không thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề) ghi rõ là "Lớp mấy" ví dụ (Lớp 11):
        [
            {"subject":"môn học",class : "Lớp bao nhiêu"},
            { "question": "Câu hỏi 1", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
            { "question": "Câu hỏi 2", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
            { "question": "Câu hỏi 3", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] }
        ];`,

        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu và sắp xếp thự tự các "answer" ngẫu nhiên, dựa trên nội dung hoặc chủ đề là: ${document.getElementById('prompt').value}. Mỗi câu có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng, được phân bố ngẫu nhiên trong 4 đáp án. Cấu trúc dữ liệu như sau (chỉ xuất nội dung câu hỏi theo cấu trúc này, không thêm thông tin khác) ghi rõ là "Lớp mấy" ví dụ (Lớp 11):
        [
            {"subject":"môn học",class : "Lớp bao nhiêu"},
            { "question": "Câu hỏi 1", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
            { "question": "Câu hỏi 2", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] },
            { "question": "Câu hỏi 3", "answers": [ { "text": "Đáp án 1", "correct": true or false }, { "text": "Đáp án 2", "correct": true or false }, { "text": "Đáp án 3", "correct": true or false }, { "text": "Đáp án 4", "correct": true or false } ] }
        ];`
    ]

    let t = ["Multiple Choice","Multiple Response","True or False"];
    prompt = pre_prompt[t.indexOf(type)];

    const data = {
        conservation_id: "demo-0",
        bot_id: "7393345978566885384",
        user: "demo-user",
        query: prompt,
        stream: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PSN_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error();
        }

        const responseData = await response.json();
        
        if (responseData.messages && responseData.messages.length > 0) {
            const aiAnswer = responseData.messages.find(message => message.type === "answer");
            if (aiAnswer) {
                text = aiAnswer.content;
                final_s = cleanJsonString(text)
                console.log(final_s);
                console.log(typeof text);
                // console.log(aiAnswer.content);
                // let temp = cleanJsonString(text);
                // final_s = temp;

                document.getElementById('loading').innerHTML = "Done!";
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
    console.log(prompt);
    console.log(final_s);
    console.log(typeof final_s); // Kiểm tra kiểu dữ liệu
    // console.log(Array.isArray(final_s)); // Kiểm tra xem nó có phải là mảng không   
}

    function get() {
        console.log("final_s: ",final_s);
        renderQuiz(final_s);
        document.getElementById('before-result').innerHTML += `
                <div style="text-align: center;" id="container">
                    <button id="good">Good</button>
                    <button id="normal">Normal</button>
                    <button id="bad">Bad</button>
                </div>
            `;
    }        


    async function postData(score,correctQuestion,totalQuestions,userQues,content,trueFalse){
        const url = "http://localhost:5500/quiz.html";
        const res = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            // convert json to string
            body: JSON.stringify({
                data: {
                    id: {
                        "username":localStorage.getItem("username"),
                        "password":localStorage.getItem("password"),
                        "email": localStorage.getItem('email')
                    },
                    User_Data: final_s,
                    User_Score: score,
                    User_Correct: correctQuestion,
                    User_Total: totalQuestions,
                    User_Questions: userQues,
                    AI_res: content,
                    True_False: trueFalse
                }
            })
        })
    }

    async function urlChange() {
        const url = "http://localhost:5500/history.html"
        window.location.href = url;
    }


    function renderQuiz(quizData) {
        const type1 = document.getElementById('question-type').value;
        const container = document.getElementById('quiz-container');
        container.innerHTML = ''; // Clear previous quiz content
    
        if (type1 === "Multiple Response") {
            quizData.forEach((quiz, quizIndex) => {
                if(quizIndex == 0)return;
                const quizDiv = document.createElement('div');
                quizDiv.classList.add('quiz');
    
                const quizTitle = document.createElement('h3');
                quizTitle.textContent = `Question ${quizIndex}: ${quiz.question}`;
                quizDiv.appendChild(quizTitle);
    
                const answersDiv = document.createElement('div');
                answersDiv.classList.add('answers');
    
                quiz.answers.forEach((answer, answerIndex) => {
                    const answerLabel = document.createElement('label');
                    answerLabel.classList.add('answer-item');
    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = `quiz${quizIndex}_answer`;
                    checkbox.value = answerIndex;
    
                    const answerText = document.createElement('span');
                    answerText.textContent = answer.text;
                    answerLabel.appendChild(checkbox);
                    answerLabel.appendChild(answerText);
    
                    const resultText = document.createElement('span');
                    resultText.classList.add('result-text');
                    answerLabel.appendChild(resultText);
    
                    checkbox.addEventListener('change', () => {
                        const allLabels = answersDiv.querySelectorAll('label');
                        allLabels.forEach(label => {
                            const resultSpan = label.querySelector('.result-text');
                            if (label === answerLabel) {
                                if (checkbox.checked) {
                                    if (answer.correct) {
                                        resultSpan.textContent = 'Correct!';
                                        resultSpan.classList.remove('wrong');
                                        resultSpan.classList.add('correct-text');
                                    } else {
                                        resultSpan.textContent = 'Wrong!';
                                        resultSpan.classList.remove('correct');
                                        resultSpan.classList.add('wrong-text');
                                    }
                                } else {
                                    resultSpan.textContent = '';
                                }
                            }
                        });
                    });
    
                    answersDiv.appendChild(answerLabel);
                });
    
                quizDiv.appendChild(answersDiv);
                container.appendChild(quizDiv);
            });
        } else if (type1 === "Multiple Choice") {
            quizData.forEach((quiz, quizIndex) => {
                if(quizIndex == 0)return;
                const quizDiv = document.createElement('div');
                quizDiv.classList.add('quiz');
    
                const quizTitle = document.createElement('h3');
                quizTitle.textContent = `Question ${quizIndex}: ${quiz.question}`;
                quizDiv.appendChild(quizTitle);
    
                const answersDiv = document.createElement('div');
                answersDiv.classList.add('answers');
    
                quiz.answers.forEach((answer, answerIndex) => {
                    const answerLabel = document.createElement('label');
                    answerLabel.classList.add('answer-item');
    
                    const radioButton = document.createElement('input');
                    radioButton.type = 'radio';
                    radioButton.name = `quiz${quizIndex}_answer`;
                    radioButton.value = answerIndex;
    
                    const answerText = document.createElement('span');
                    answerText.textContent = answer.text;
                    answerLabel.appendChild(radioButton);
                    answerLabel.appendChild(answerText);
    
                    const resultText = document.createElement('span');
                    resultText.classList.add('result-text');
                    answerLabel.appendChild(resultText);
    
                    radioButton.addEventListener('change', () => {
                        const allLabels = answersDiv.querySelectorAll('label');
                        allLabels.forEach(label => {
                            const resultSpan = label.querySelector('.result-text');
                            if (label === answerLabel) {
                                if (answer.correct) {
                                    resultSpan.textContent = 'Correct!';
                                    resultSpan.classList.remove('wrong');
                                    resultSpan.classList.add('correct-text');
                                } else {
                                    resultSpan.textContent = 'Wrong!';
                                    resultSpan.classList.remove('correct');
                                    resultSpan.classList.add('incorrect-text');
                                }
                            } else {
                                label.querySelector('input').checked = false;
                                resultSpan.textContent = '';
                            }
                        });
                    });
    
                    answersDiv.appendChild(answerLabel);
                });
    
                quizDiv.appendChild(answersDiv);
                container.appendChild(quizDiv);
            });
        } else if (type1 =="True or False") {
            quizData.forEach((quiz, quizIndex) => {
                if(quizIndex == 0)return;
                const quizDiv = document.createElement('div');
                quizDiv.classList.add('quiz');
              
                const quizTitle = document.createElement('h3');
                quizTitle.textContent = `Question ${quizIndex}: ${quiz.question}`;
                quizDiv.appendChild(quizTitle);
              
                const answersDiv = document.createElement('div');
                answersDiv.classList.add('answers');
              
                quiz.answers.forEach((answer, answerIndex) => {
                  const answerLabel = document.createElement('label');
                  answerLabel.classList.add('answer-item');
              
                  const answerText = document.createElement('span');
                  answerText.textContent = answer.text;
                  answerLabel.appendChild(answerText);
              
                  const trueRadio = document.createElement('input');
                  trueRadio.type = 'radio';
                  trueRadio.name = `quiz${quizIndex}_answer${answerIndex}`;
                  trueRadio.value = 'true';
              
                  const trueLabel = document.createElement('label');
                  trueLabel.textContent = 'True';
                  trueLabel.appendChild(trueRadio);
                  answerLabel.appendChild(trueLabel);
              
                  const falseRadio = document.createElement('input');
                  falseRadio.type = 'radio';
                  falseRadio.name = `quiz${quizIndex}_answer${answerIndex}`;
                  falseRadio.value = 'false';
              
                  const falseLabel = document.createElement('label');
                  falseLabel.textContent = 'False';
                  falseLabel.appendChild(falseRadio);
                  answerLabel.appendChild(falseLabel);
              
                  const resultText = document.createElement('span');
                  resultText.classList.add('result-text');
                  answerLabel.appendChild(resultText);
              
                  const checkAnswer = () => {
                    const selectedValue = answersDiv.querySelector(input[name=`quiz${quizIndex}_answer${answerIndex}`],checked).value;
                    if ((selectedValue === 'true' && answer.correct) || (selectedValue === 'false' && !answer.correct)) {
                      resultText.textContent = 'Correct!';
                      resultText.classList.remove('correct-text', 'incorrect-text');
                      resultText.classList.add('correct-text');
                    } else {
                      resultText.textContent = 'Wrong!';
                      resultText.classList.add('incorrect-text');
                    }
                  };
              
                  // Add event listener outside the loop (attached to both radio buttons)
                  trueRadio.addEventListener('change', checkAnswer);
                  falseRadio.addEventListener('change', checkAnswer);
              
                  answersDiv.appendChild(answerLabel);
                });
              
                quizDiv.appendChild(answersDiv);
              
                // Make sure `container` is defined before appending
                if (container) {
                  container.appendChild(quizDiv);
                } else {
                  // Handle the case where container is not available
                  console.error("Container element not found. Please define the 'container' variable.");
                }
              });
              
        }
    }
    
function cleanJsonString(json) {
    console.log('Original JSON:', json);
    json = json.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log('Cleaned JSON:', json);
    try {
        let parsedJson = JSON.parse(json);
        return parsedJson;
    } catch (e) {
        console.error("Invalid JSON string", e);
        return null;
    }
}

function scoreQuiz() {
    let correctAndWrong = [];
    if (!final_s || final_s.length === 0) {
        alert("Please generate the quiz first!");
        return;
    }

    const type1 = document.getElementById('question-type').value;
    const allQuizDivs = document.querySelectorAll('.quiz');
    let correctCount = 0;
    let totalQuestions = allQuizDivs.length;
    let incorrectQuestions = [];

    allQuizDivs.forEach((quizDiv, quizIndex) => {
        const selectedAnswers = [];
        const answerInputs = quizDiv.querySelectorAll('input');

        answerInputs.forEach((input, answerIndex) => {
            // if(answerIndex == 0)return;
            if (input.checked) {
                selectedAnswers.push(answerIndex);  
            }
        });

        let correct = false;
        if (type1 === "Multiple Response") {
            const correctAnswers = final_s[quizIndex+1].answers.filter(answer => answer.correct).map((answer, index) => index);
            correct = correctAnswers.length === selectedAnswers.length && correctAnswers.every(index => selectedAnswers.includes(index));
        } else {
            const correctAnswerIndex = final_s[quizIndex+1].answers.findIndex(answer => answer.correct);
            correct = selectedAnswers.length === 1 && selectedAnswers[0] === correctAnswerIndex;
        }

        if (correct) {
            correctCount++;
            correctAndWrong.push(`{"true": ${selectedAnswers[0]+1}}`)
        } else {
            incorrectQuestions.push(final_s[quizIndex]);
            correctAndWrong.push(`{"false": ${selectedAnswers[0]+1}}`)
        }
    });

    let resultString =''

    const score = (correctCount / totalQuestions) * 10;
    document.getElementById('score').textContent = score.toFixed(2);
    
    if (incorrectQuestions.length > 0) {
        const retryMessage = `You got ${incorrectQuestions.length} question(s) wrong. Let's try those again!`;
        alert(retryMessage);
        console.log("run incorrect");
        let arrayString = JSON.stringify(incorrectQuestions);
        resultString = `"${arrayString}"`;
        
        let content;
        const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";
        
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        async function run2() {
            document.getElementById('loading').innerHTML = `
            <span>Loading...</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
            `;
            
            // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "Dựa trên các thông tin sau đây, hãy viết một nhận xét về điểm cần cải thiện của học sinh. Hãy khuyến khích học sinh cải thiện điểm yếu của mình. Bài nhận xét nên dài ít nhất 500 từ. Dưới đây là danh sách các câu hỏi và câu trả lời sai của học sinh dưới dạng file JSON" }], 
                    },    
                    {
                        role: "model",
                        parts: [{ text: `Tôi sẽ nhận xét với tư cách là một giáo viên bộ môn và chỉ nhận xét đúng điểm cần cải thiện không nhận xét gì khác.
                            Tôi sẽ:
                            1. Nêu ra những điểm học sinh cần cải thiện.
                            2. Đưa ra lời khuyên dành cho học sinh
                            3. theo cú pháp sau đây:
                            * Nhận xét bài làm:
                            gì đó đó
                            * Điểm cần cải thiện 1: điểm cần cải thiện
                            * Điểm cần cải thiện 2: điểm cần cải thiện
                            * điểm cần cải thiện 3: điểm cần cải thiện
                            * Lời khuyền: đưa ra lời khuyên` }],
                        },
                    ],
                    generationConfig : {
                    temperature: 0.8,
                    topP: 1,
                    topK: 16,
                },
            });
            
            const msg = resultString;
            
            const result = await chat.sendMessage(msg);
            const response = await result.response;
            content = await response.text(); 
            // content = content.replaceAll('*','');
            console.log(content);

            postData(score,correctCount,totalQuestions,userQues,content,correctAndWrong);
            
            
            document.getElementById('loading').innerHTML = 'Done';
            document.getElementById('result').innerHTML += `<div>${content}</div>`;
                
        }
        

        console.log(resultString);
        renderQuiz(incorrectQuestions);
        run2()
        const text = "This is a test.";
        
    } else {
        alert(`Your score is ${score.toFixed(2)} out of 10.`);
        postData(score,correctCount,totalQuestions,userQues,"",correctAndWrong);
    }
    
}

document.getElementById('get').addEventListener('click', get);

document.getElementById('submit').addEventListener('click', run);

document.getElementById('calculate-score').addEventListener('click', scoreQuiz);

const historyBtn = document.getElementById('history')
historyBtn.addEventListener('click',urlChange);


function rating() {
    document.getElementById('good').addEventListener('click', async () => {
        text_0 = `Đây là câu trả lời của bạn ${text} và nó được đánh giá là Tốt. Vì bạn đã đáp ứng chính xác câu hỏi, dễ hiểu, chi tiết, hoặc hữu ích. 
        Hãy tiếp tục tạo ra những nội dung như này.`;
        console.log("run good");
    });

    document.getElementById('normal').addEventListener('click', async () => {
        text_0 = `Đây là câu trả lời của bạn ${text} và nó được đánh giá là Bình thường. Hãy cố cải thiện độ chính xác của câu trả lời, tính rõ ràng và dễ hiểu, mức độ chi tiết và toàn diện, tính liên quan đến câu hỏi ban đầu.
        Nên cố gắng cải thiện thêm về độ chi tiết và chất lượng câu trả lời.`;
        console.log("run normal");
    });

    document.getElementById('bad').addEventListener('click', async () => {
        text_0 = `Đây là câu trả lời của bạn ${text} và nó được đánh giá là Tệ. Bởi vì câu trả lời của bạn thiếu thông tin cần thiết, câu trả lời không rõ ràng hoặc khó hiểu, câu trả lời không liên quan đến câu hỏi ban đầu, ngữ pháp hoặc cú pháp không chính xác.
        Thực sự cần thay đổi cách trả lời hoặc đưa ra câu trả lời thực sự chi tiết.`;
        console.log("run bad");
    });
}
