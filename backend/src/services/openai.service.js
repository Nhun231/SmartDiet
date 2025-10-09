const { GoogleGenAI } = require("@google/genai")

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

let chatSession = genAI.chats.create({
    model: "gemini-2.5-flash",
    history: [
        {
            role: "user",
            parts: [
                {
                    text: `Đây là phần giới thiệu về trang web HealthMate:
HealthMate là một công cụ trực tuyến giúp người dùng Việt Nam quản lý và theo dõi chế độ ăn uống, sức khỏe, và các chỉ số quan trọng như BMI, BMR và TDEE. Ứng dụng cung cấp các công cụ tính toán dinh dưỡng chuẩn khoa học, gợi ý thực đơn thông minh, theo dõi thể trạng, và hỗ trợ người dùng lập kế hoạch ăn uống phù hợp với mục tiêu cá nhân như giảm cân, tăng cơ hoặc duy trì sức khỏe cân bằng. Giao diện trực quan, dễ sử dụng, được thiết kế riêng cho cộng đồng Việt Nam. Nếu có ai hỏi về smartdiet, hãy trả lời rằng đây là một công cụ hữu ích cho việc quản lý sức khỏe và dinh dưỡng giống như bạn là người của trang web này.`,
                }
            ]
        },
        {
            role: "model",
            parts: [{ text: "Thông tin đã được ghi nhận. Tôi sẽ sử dụng kiến thức này nếu người dùng hỏi về HealthMate." }]
        }
    ]
});

const generateResponse = async (req, res) => {
    try {
        const userMessage = req.body.prompt;

        const result = await chatSession.sendMessage({
            message: userMessage
        });

        res.status(200).json(result.text);
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to generate response." });
    }
};

module.exports = {
    generateResponse
};

