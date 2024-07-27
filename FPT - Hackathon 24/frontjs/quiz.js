import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";
const API_KEY = "AIzaSyAWEPC945637GjSgW6V0WFtwcoA4f4SmKs";

const genAI = new GoogleGenerativeAI(API_KEY);

let model;
(async () => {
    model = await genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
})();

let text,final_s;

var num_prompt = 0;
var prompt_0 = '';
var text_0 = '';

    async function run() {
        document.getElementById('loading').innerHTML = `
        <span>Loading...</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
        `;
    
        const numQuestions = document.getElementById('num-questions').value;
        const type = document.getElementById('question-type').value;
        const promptContent = document.getElementById('prompt').value;
    
        const pre_prompts = [
            `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${promptContent}. Trong 4 đáp án của từng câu, chỉ có 1 đáp án true và 3 đáp án false. Đáp án true là ngẫu nhiên trong 4 đáp án 1, 2, 3, 4. Cấu trúc nó sẽ nên như này (và chỉ promt ra nội dung câu hỏi dựa theo cấu trúc, ko nên thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
            [
                { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true }, { text: "Đáp án 2", correct: false }, { text: "Đáp án 3", correct: false }, { text: "Đáp án 4", correct: false } ] },
                { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: false }, { text: "Đáp án 2", correct: true }, { text: "Đáp án 3", correct: false }, { text: "Đáp án 4", correct: false } ] },
                { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: false }, { text: "Đáp án 2", correct: false }, { text: "Đáp án 3", correct: true }, { text: "Đáp án 4", correct: false } ] },
            ];`,
    
            `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, có dựa theo nội dung hoặc chủ đề là: ${promptContent}. Trong 4 đáp án của từng câu, có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng. Đáp án đúng sẽ được sắp xếp ngẫu nhiên trong 4 đáp án. Cấu trúc câu hỏi như sau (chỉ in ra nội dung câu hỏi theo cấu trúc này, không thêm bất cứ thông tin nào khác, không thêm lưu ý, không thêm tiêu đề):
            [
                { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true }, { text: "Đáp án 2", correct: true }, { text: "Đáp án 3", correct: false }, { text: "Đáp án 4", correct: false } ] },
                { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true }, { text: "Đáp án 2", correct: false }, { text: "Đáp án 3", correct: true }, { text: "Đáp án 4", correct: false } ] },
                { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: false }, { text: "Đáp án 2", correct: true }, { text: "Đáp án 3", correct: true }, { text: "Đáp án 4", correct: false } ] }
            ];`,
    
            `Tạo ra chính xác ${numQuestions} câu hỏi quiz với 4 đáp án khả thi mỗi câu, dựa trên nội dung hoặc chủ đề là: ${promptContent}. Mỗi câu có ít nhất 1 đáp án sai và ít nhất 2 đáp án đúng, được phân bố ngẫu nhiên trong 4 đáp án. Cấu trúc dữ liệu như sau (chỉ xuất nội dung câu hỏi theo cấu trúc này, không thêm thông tin khác):
            [
                { question: "Câu hỏi 1", answers: [ { text: "Đáp án 1", correct: true }, { text: "Đáp án 2", correct: false }, { text: "Đáp án 3", correct: true }, { text: "Đáp án 4", correct: false } ] },
                { question: "Câu hỏi 2", answers: [ { text: "Đáp án 1", correct: true }, { text: "Đáp án 2", correct: true }, { text: "Đáp án 3", correct: false }, { text: "Đáp án 4", correct: false } ] },
                { question: "Câu hỏi 3", answers: [ { text: "Đáp án 1", correct: false }, { text: "Đáp án 2", correct: true }, { text: "Đáp án 3", correct: true }, { text: "Đáp án 4", correct: false } ] }
            ];`
        ];
    
        const questionTypes = ["Multiple Choice", "Multiple Response", "True or False"];
        const prompt = pre_prompts[questionTypes.indexOf(type)];
    
        if (num_prompt === 0) {
            const result = await model.generateContentStream(prompt);
            const response = await result.response;
            let text = await response.text();
    
            let temp = cleanJsonString(text);
            final_s = temp;
    
            if (numQuestions - final_s.length > 0) {
                let config_prompt = pre_prompts[questionTypes.indexOf(type)];
                config_prompt = config_prompt.replace(`${numQuestions}`, `${numQuestions - final_s.length}`);
                const rs = await model.generateContentStream(config_prompt);
                const rp = await rs.response;
                text = await rp.text();
                temp = cleanJsonString(text);
                final_s = final_s.concat(temp);
            }
    
            num_prompt = 1;
            prompt_0 = prompt;
            text_0 = final_s;
        } else {
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: prompt_0 }],
                    },
                    {
                        role: "model",
                        parts: [{ text:text_0 }],
                    },
                ],
            });
    
            const msg = document.getElementById('prompt').value;
            const result = await chat.sendMessage(msg);
            const response = await result.response;
            const text = await response.text();
            console.log(num_prompt);
            console.log(text_0);
            text_0 = JSON.parse(text);
        }
        document.getElementById('loading').innerHTML = "Done!";
        console.log(prompt);
    
        // Debugging statement to check the content of final_s
        console.log("final_s:", final_s);
    }

    function get() {
        renderQuiz(final_s);
        document.getElementById('before-result').innerHTML += `
                <div style="text-align: center;" id="container">
                    <button id="good">Good</button>
                    <button id="normal">Normal</button>
                    <button id="bad">Bad</button>
                </div>
            `;
    }        

    function renderQuiz(quizData) {    
        const type1 = document.getElementById('question-type').value;
        const container = document.getElementById('quiz-container');
        container.innerHTML = ''; // Clear previous quiz content
    
        if (!Array.isArray(quizData)) {
            console.error("Expected quizData to be an array, but received:", quizData);
            return;
        }
    
        if (type1 === "Multiple Response") {
            quizData.forEach((quiz, quizIndex) => {
                const quizDiv = document.createElement('div');
                quizDiv.classList.add('quiz');
    
                const quizTitle = document.createElement('h3');
                quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
                quizDiv.appendChild(quizTitle);
    
                const answersDiv = document.createElement('div');
                answersDiv.classList.add('answers');
    
                quiz.answers.forEach((answer, answerIndex) => {
                    const answerLabel = document.createElement('label');
                    const answerInput = document.createElement('input');
                    answerInput.type = 'checkbox';
                    answerInput.name = `quiz-${quizIndex}-answer-${answerIndex}`;
                    answerInput.value = answer.correct;
    
                    answerLabel.appendChild(answerInput);
                    answerLabel.appendChild(document.createTextNode(answer.text));
                    answersDiv.appendChild(answerLabel);
                });
    
                quizDiv.appendChild(answersDiv);
                container.appendChild(quizDiv);
            });
        } else if (type1 === "Multiple Choice") {
            quizData.forEach((quiz, quizIndex) => {
                const quizDiv = document.createElement('div');
                quizDiv.classList.add('quiz');
    
                const quizTitle = document.createElement('h3');
                quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
                quizDiv.appendChild(quizTitle);
    
                const answersDiv = document.createElement('div');
                answersDiv.classList.add('answers');
    
                quiz.answers.forEach((answer, answerIndex) => {
                    const answerLabel = document.createElement('label');
                    const answerInput = document.createElement('input');
                    answerInput.type = 'radio';
                    answerInput.name = `quiz-${quizIndex}-answer`;
                    answerInput.value = answer.correct;
    
                    answerLabel.appendChild(answerInput);
                    answerLabel.appendChild(document.createTextNode(answer.text));
                    answersDiv.appendChild(answerLabel);
                });
    
                quizDiv.appendChild(answersDiv);
                container.appendChild(quizDiv);
            });
        } else if (type1 === "True or False") {
            quizData.forEach((quiz, quizIndex) => {
                const quizDiv = document.createElement('div');
                quizDiv.classList.add('quiz');
    
                const quizTitle = document.createElement('h3');
                quizTitle.textContent = `Question ${quizIndex + 1}: ${quiz.question}`;
                quizDiv.appendChild(quizTitle);
    
                const answersDiv = document.createElement('div');
                answersDiv.classList.add('answers');
    
                quiz.answers.forEach((answer, answerIndex) => {
                    const answerLabel = document.createElement('label');
                    const answerInput = document.createElement('input');
                    answerInput.type = 'radio';
                    answerInput.name = `quiz-${quizIndex}-answer`;
                    answerInput.value = answer.correct;
    
                    answerLabel.appendChild(answerInput);
                    answerLabel.appendChild(document.createTextNode(answer.text));
                    answersDiv.appendChild(answerLabel);
                });
    
                quizDiv.appendChild(answersDiv);
                container.appendChild(quizDiv);
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
            if (input.checked) {
                selectedAnswers.push(answerIndex);
            }
        });

        let correct = false;
        if (type1 === "Multiple Response") {
            const correctAnswers = final_s[quizIndex].answers.filter(answer => answer.correct).map((answer, index) => index);
            correct = correctAnswers.length === selectedAnswers.length && correctAnswers.every(index => selectedAnswers.includes(index));
        } else {
            const correctAnswerIndex = final_s[quizIndex].answers.findIndex(answer => answer.correct);
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
                        parts: [{ text: "Dựa trên các thông tin sau đây, hãy viết một nhận xét chi tiết về tình hình học tập của học sinh. Hãy khuyến khích học sinh cải thiện điểm yếu của mình. Bài nhận xét nên dài ít nhất 500 từ. Dưới đây là danh sách các câu hỏi và câu trả lời sai của học sinh dưới dạng file JSON" }], 
                    },    
                    {
                        role: "model",
                        parts: [{ text: `Tôi sẽ nhận xét với tư cách là một giáo viên bộ môn. 
                                        Tôi sẽ:
                                            1. Đánh giá tổng quan tình hình học tập của học sinh.
                                            2. Nêu ra những điểm mạnh và điểm yếu của học sinh.
                                            3. Cung cấp các kiến thức cần thiết và phương pháp học tập để cải thiện điểm số.
                                            4. Tạo một lịch trình học tập phù hợp với tình hình hiện tại.` }],
                    },
                ],
            });
    
            const msg = resultString;
    
            const result = await chat.sendMessage(msg);
            const response = await result.response;
            content = await response.text(); 
            console.log(content);

            
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

document.getElementById('calculate-score').addEventListener('click', scoreQuiz);


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