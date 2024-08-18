import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs"; // Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

const file = document.getElementById("fileInput");
let fileContent = '';

function readPDF() {
    // create file and read file
    const inputf = file.files[0];
    const reader = new FileReader();

    //read file
    reader.readAsDataURL(inputf);
    reader.onload = () => {
        loadPDF(reader.result);
    }
}


async function loadPDF(data){
    fileContent = '';
    const pdffile = await pdfjsLib.getDocument(data).promise;

    // doc file
    let pages = pdffile.numPages;
    for(let i = 1;i<=pages;i++){
        let page = await pdffile.getPage(i);
        let txt = await page.getTextContent();
        fileContent = txt.items.map((s)=>s.str).join("");
    }

    console.log(fileContent);
}

function readWord() {
    fileContent = ''; // Reset fileContent
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(readerEvent) {
            var arrayBuffer = readerEvent.target.result;

            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(function(result) {
                    fileContent = result.value;

                    // In nội dung lên console
                    console.log(fileContent);
                })
                .catch(function(err) {
                    console.log(err);
                    alert('Đã xảy ra lỗi khi chuyển đổi file. Vui lòng thử lại.');
                });
        };
        reader.readAsArrayBuffer(file);
    }
}

let text,final_s;


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
    let pre_prompt = [
    
        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${fileContent}. Trong 4 đáp án của từng câu, chỉ có 1 đáp án true và 3 đáp án false. Đáp án true là ngẫu nhiên trong 4 đáp án 1, 2, 3, 4. Cấu trúc nó sẽ nên như này (và chỉ promt ra nội dung câu hỏi dựa theo cấu trúc, ko nên thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
        [
            {subject: "Môn học",class: "Lớp ..."},
            { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
        ];`,

        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${fileContent}. Trong 4 đáp án của từng câu, có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng. Đáp án đúng sẽ được sắp xếp ngẫu nhiên trong 4 đáp án. Cấu trúc câu hỏi như sau (chỉ in ra nội dung câu hỏi theo cấu trúc này, không thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
        [
            {subject: "Môn học",class: "Lớp ..."},
            { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] }
        ];`,

        `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, dựa trên nội dung hoặc chủ đề là: ${fileContent}. Mỗi câu có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng, được phân bố ngẫu nhiên trong 4 đáp án. Cấu trúc dữ liệu như sau (chỉ xuất nội dung câu hỏi theo cấu trúc này, không thêm thông tin khác):
        [
            {subject: "Môn học",class: "Lớp .."},
            { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] },
            { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: true or false }, { text: "Đáp án 2", correct: true or false }, { text: "Đáp án 3", correct: true or false }, { text: "Đáp án 4", correct: true or false } ] }
        ];`
    ]

    let t = ["Multiple Choice","Multiple Response","True or False"];
    prompt = pre_prompt[t.indexOf(type)];

    try {
        const result = await model.generateContentStream(prompt);
        const response = await result.response;
        text = await response.text();
        let temp = cleanJsonString(text);
        final_s = temp;

        if(numQuestions - final_s.length > 0){
            let config_promp = pre_prompt[t.indexOf(type)];
            config_promp = config_promp.replace(`${numQuestions}`,`${numQuestions-final_s.length}`);
            const rs = await model.generateContentStream(config_promp);
            const rp = await rs.response;
            text = await rp.text();
            temp = cleanJsonString(text);
            final_s = final_s.concat(temp);
        }

        document.getElementById('loading').innerHTML = "Done!";
    } catch (error) {
        console.error("Error generating content:", error);
    }
    console.log(prompt);
}
let quizArray; // Biến lưu trữ dữ liệu câu hỏi
let jsonDataLoaded = false; // Biến cờ để theo dõi xem dữ liệu đã được tải hay chưa

function get() {
    renderQuiz(final_s);
}

function renderQuiz(quizData) {
    const type1 = document.getElementById('question-type').value;
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Clear previous quiz content
    console.log(quizData);
    if (type1 === "Multiple Response") {
        quizData.forEach((quiz, quizIndex) => {
            if(quizIndex == 0)return;
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');

            const quizTitle = document.createElement('h3');
            quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
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
                                    resultSpan.classList.add('correct-text');
                                } else {
                                    resultSpan.textContent = 'Wrong!';
                                    resultSpan.classList.add('incorrect-text');
                                }
                            } else {
                                resultSpan.textContent = '';
                                resultSpan.classList.remove('correct-text', 'incorrect-text');
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
            if(quizIndex == 0)return ;
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');

            const quizTitle = document.createElement('h3');
            quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
            quizDiv.appendChild(quizTitle);

            const answersDiv = document.createElement('div');
            answersDiv.classList.add('answers');

            quiz.answers.forEach((answer, answerIndex) => {
                const answerLabel = document.createElement('label');
                answerLabel.classList.add('answer-item');

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `quiz${quizIndex}_answer`;
                radio.value = answerIndex;

                const answerText = document.createElement('span');
                answerText.textContent = answer.text;
                answerLabel.appendChild(radio);
                answerLabel.appendChild(answerText);

                const resultText = document.createElement('span');
                resultText.classList.add('result-text');
                answerLabel.appendChild(resultText);

                radio.addEventListener('change', () => {
                    const allLabels = answersDiv.querySelectorAll('label');
                    allLabels.forEach(label => {
                        const resultSpan = label.querySelector('.result-text');
                        if (label === answerLabel) {
                            if (answer.correct) {
                                resultSpan.textContent = 'Correct!';
                                resultSpan.classList.add('correct-text');
                            } else {
                                resultSpan.textContent = 'Wrong!';
                                resultSpan.classList.add('incorrect-text');
                            }
                        } else {
                            resultSpan.textContent = '';
                            resultSpan.classList.remove('correct-text', 'incorrect-text');
                        }
                    });
                });

                answersDiv.appendChild(answerLabel);
            });

            quizDiv.appendChild(answersDiv);
            container.appendChild(quizDiv);
        });
    } else if (type1 === "True or False") {
        quizData.forEach((quiz, quizIndex) => {
            if(quizIndex == 0)return;
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');

            const quizTitle = document.createElement('h3');
            quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
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
                    const selectedValue = answersDiv.querySelector(`input[name="quiz${quizIndex}_answer${answerIndex}"]:checked`).value;
                    if ((selectedValue === 'true' && answer.correct) || (selectedValue === 'false' && !answer.correct)) {
                        resultText.textContent = 'Correct!';
                        resultText.classList.remove('correct-text', 'incorrect-text');
                        resultText.classList.add('correct-text');
                    } else {
                        resultText.textContent = 'Wrong!';
                        resultText.classList.add('incorrect-text');
                    }
                };

                trueRadio.addEventListener('change', checkAnswer);
                falseRadio.addEventListener('change', checkAnswer);

                answersDiv.appendChild(answerLabel);
            });

            quizDiv.appendChild(answersDiv);
            container.appendChild(quizDiv);
        });
    }
}


// post data
async function postData(score,correctQuestion,totalQuestions,userQues,content){
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
                AI_res: content
            }
        })
    })
}

// change url when click
async function urlChange() {
    const url = "http://localhost:5500/history.html"
    window.location.href = url;
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



// caculate score
function scoreQuiz() {
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
        } else {
            incorrectQuestions.push(final_s[quizIndex]);
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
                            Nêu ra những điểm học sinh cần cải thiện.` }],
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
            console.log(content);

            postData(score,correctCount,totalQuestions,fileContent,content);
            
            
            document.getElementById('loading').innerHTML = 'Done';
            document.getElementById('result').innerHTML += `<div>${content}</div>`;
                
        }
        

        console.log(resultString);
        renderQuiz(incorrectQuestions);
        run2()
        const text = "This is a test.";
        
    } else {
        alert(`Your score is ${score.toFixed(2)} out of 10.`);
    }
 
}






document.getElementById('get').addEventListener('click', get);

document.getElementById('submit').addEventListener('click', run);

document.getElementById('pdf').addEventListener('click', readPDF);

document.getElementById('word').addEventListener('click', readWord);

document.getElementById('calculate-score').addEventListener('click', scoreQuiz);

document.getElementById('history').addEventListener('click',urlChange)
