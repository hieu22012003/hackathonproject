async function run(transcript) {
    // Khởi tạo mô hình Generative AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Bắt đầu cuộc trò chuyện
    const chat = model.startChat({
        history: [
            {
                role: "system",
                parts: [{ text: "Dựa trên kịch bản YouTube đã phiên âm, hãy tạo một bản tóm tắt về nó. Tóm tắt nên có khoảng 500 từ." }],
            },
            {
                role: "user",
                parts: [{ text: transcript }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    try {
        const result = await chat.sendMessage("Hãy tóm tắt văn bản trên");
        const response = await result.response;
        const summary = await response.text();

        // Hiển thị kết quả tóm tắt
        const summaryDiv = document.getElementById('transcript-result');
        summaryDiv.innerHTML += `<h2>Summary:</h2><p>${summary}</p>`;
    } catch (error) {
        console.error("Error in AI request:", error);
        const resultDiv = document.getElementById('transcript-result');
        resultDiv.innerHTML += `<p>Error: ${error.message}</p>`;
    }
}
