import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

interface ScoreResults {
    grammar: number;
    coherence: number;
    relevance: number;
    overallScore: number;
    feedback: string;
}

app.post('/score', async (req: Request, res: Response) => {
    const { essay } = req.body;

    try {
        const scoreResults = await scoreEssay(essay);
        res.json(scoreResults); // This sends a JSON response to the client
    } catch (error) {
        console.error("Error scoring essay:", error);
        res.status(500).json({ error: "Error processing your request." });
    }
});


async function scoreEssay(essayText: string): Promise<ScoreResults> {
    const OPENAI_API_URL = 'https://api.openai.com/v1/completions';
    const apiKey = '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' 
    const prompt = `
    Essay: "${essayText}"
    Please provide an evaluation of the essay above with scores from 1 to 10 for all of the following criterias and provide feedback in a valid json format like this example:
    
    {
        "grammar": 7, 
        "coherence": 8, 
        "relevance": 9, 
        "overallScore": 8, 
        "feedback": "This is an example of feedback." 
    }

    Please ensure the entire response is in valid JSON format, including closing all brackets and braces.
    relevant is how relevant the essay is to the topic that the essay is about.
    overallScore is the sum of the scores of the criterias divided by the number of criter.
    Feedback is a freeform text field.
    `;

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-3.5-turbo-instruct",
                prompt: prompt.trim(),
                top_p: 1.0,
                max_tokens: 300,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                }
            }
        );

        console.log("API raw response:", response.data); 
        const resultText = response.data.choices[0].text.trim();
        console.log("API trimmed response text:", resultText); 

        return parseStructuredResponse(resultText);
    } catch (error) {
        console.error("Error scoring essay:", error);
        throw new Error("Failed to score essay");
    }
}

function parseStructuredResponse(responseText: string): ScoreResults {
    try {
        // Attempt to parse the JSON response
        const result = JSON.parse(responseText);

        // Check if all expected fields are present
        if (typeof result.grammar !== 'number' ||
            typeof result.coherence !== 'number' ||
            typeof result.relevance !== 'number' ||
            typeof result.overallScore !== 'number' ||
            typeof result.feedback !== 'string') {
            throw new Error('Incomplete or invalid response structure');
        }

        return result;
    } catch (error) {
        console.error('Failed to parse response:', responseText, '\nError:', error);
        throw new Error('Failed to parse GPT-3.5 response or incomplete response structure');
    }
}


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Essay Scoring Backend is running!');
});





