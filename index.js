import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from OpenAI." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
