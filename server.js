require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/analyze", async (req, res) => {

    const data = req.body;

    const prompt = `
حلل مشكلة المستخدم:

اسم المستخدم: ${data.username}
البريد: ${data.email}
الهاتف: ${data.phone}
نوع المشكلة: ${data.problem}
التفاصيل: ${data.details}

أعط:
1- تحليل المشكلة
2- نسبة احتمالية استرجاع الحساب
3- استئناف احترافي بالعربية
4- استئناف احترافي بالإنجليزية
`;

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "أنت خبير دعم حسابات التواصل الاجتماعي."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        }
    );

    const result = await response.json();

    res.json({
        answer: result.choices[0].message.content
    });
});

app.listen(process.env.PORT || 3000);
