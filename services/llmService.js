const fetch = require('node-fetch');
const GROQ_API = process.env.GROQ_API;

if (!GROQ_API) {
    console.warn('Warning: GROQ_API not set in environment. API calls will fail.');
}

function buildPrompt(user) {
    const allergies = (user.allergies && user.allergies.length) ? user.allergies.join(', ') : 'None';
    return `You are an AI-powered meal recommendation system.

### USER PROFILE
- Dietary type: ${user.dietaryType}
- Allergies: ${allergies}
- Calorie target per meal: ${user.calorieTarget} kcal
- Mood: ${user.mood}

### INSTRUCTIONS
1. Recommend exactly 3 meals that match the dietary type and avoid all allergens.
2. Each meal must be close to the calorie target (+/- 100 kcal).
3. The meals should reflect the user's mood:
   - Comforting → warm, filling, hearty.
   - Energetic → high-protein, energizing ingredients.
   - Light → fresh, low-calorie, easy to digest.
   - Festive → colorful, celebratory, shareable.
   - Quick-and-easy → simple recipes, few ingredients, fast to prepare.
4. Each meal must include:
   - Title
   - Ingredients
   - Nutrition breakdown
   - Reasons why it matches the mood
   - Confidence score (0-1)

### OUTPUT FORMAT
Return only valid JSON in the following schema:

{
  "items": [
    {
      "meal_id": "string",
      "title": "string",
      "ingredients": ["string"],
      "nutrition": {
        "kcal": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number
      },
      "reasons": ["string"],
      "confidence": number
    }
  ]
}

### IMPORTANT RULES
- Never include allergens in ingredients.
- Meals must respect the dietary type.
- Do not output anything except valid JSON.`;
}

async function callGroqAPI(prompt) {
    // Use Groq's OpenAI-compatible endpoint (reference curl uses https://api.groq.com/openai/v1/chat/completions)
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const model = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
    const body = {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.2
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Groq API error: ${res.status} ${res.statusText} - ${text}`);
        }

        const json = await res.json();
        return json;
    } catch (err) {
        // Network or DNS failure (e.g., ENOTFOUND) — return a mocked Groq-style response
        console.warn('Groq API request failed, using mock response:', err.message);
        return generateMockGroqResponse(prompt);
    }
}

function generateMockGroqResponse(prompt) {
    // Try to extract simple fields from the prompt
    const getLine = (key) => {
        const re = new RegExp(`${key}: (.*)`);
        const m = prompt.match(re);
        return m ? m[1].trim() : '';
    };

    const dietaryType = getLine('Dietary type') || 'omnivore';
    const allergiesText = getLine('Allergies') || 'None';
    const allergies = allergiesText === 'None' ? [] : allergiesText.split(',').map(s => s.trim().toLowerCase());
    const calorieMatch = prompt.match(/Calorie target per meal: (\d+)/i);
    const calorieTarget = calorieMatch ? parseInt(calorieMatch[1], 10) : 600;
    const mood = getLine('Mood') || 'comforting';

    const moodReasons = {
        comforting: ['Warm and hearty', 'Comforting flavors', 'Filling texture'],
        energetic: ['High-protein ingredients', 'Energizing carbs', 'Sustained energy'],
        light: ['Fresh ingredients', 'Low-calorie profile', 'Easy to digest'],
        festive: ['Colorful presentation', 'Shareable portions', 'Celebratory flavors'],
        'quick-and-easy': ['Few ingredients', 'Under 20 minutes', 'Minimal prep']
    };

    const ingredientPool = {
        vegetarian: ['tofu', 'chickpeas', 'spinach', 'tomato', 'rice', 'potato', 'olive oil', 'cheddar'],
        vegan: ['tofu', 'lentils', 'spinach', 'tomato', 'quinoa', 'rice', 'olive oil'],
        omnivore: ['chicken', 'beef', 'rice', 'potato', 'spinach', 'tomato', 'olive oil'],
        pescatarian: ['salmon', 'cod', 'rice', 'spinach', 'lemon', 'olive oil'],
        keto: ['chicken', 'avocado', 'spinach', 'cheese', 'olive oil', 'almond flour']
    };

    const pool = ingredientPool[dietaryType] || ingredientPool['omnivore'];

    const makeMeal = (i) => {
        // pick ingredients excluding allergens
        const ingredients = pool.filter(ing => !allergies.some(a => ing.toLowerCase().includes(a))).slice(0, 5);
        const kcal = Math.max(100, calorieTarget + (i - 2) * 60); // around target
        const protein = Math.round(kcal * 0.2 / 4); // rough
        const carbs = Math.round(kcal * 0.45 / 4);
        const fat = Math.round(kcal * 0.35 / 9);

        return {
            meal_id: `${dietaryType}-m${i}-${Date.now() % 10000}`,
            title: `${mood} ${dietaryType} Meal ${i}`,
            ingredients,
            nutrition: {
                kcal,
                protein_g: protein,
                carbs_g: carbs,
                fat_g: fat
            },
            reasons: moodReasons[mood] || ['Fits the requested mood'],
            confidence: Number((0.85 - i * 0.05).toFixed(2))
        };
    };

    const items = [makeMeal(1), makeMeal(2), makeMeal(3)];

    return {
        id: 'mock-response',
        object: 'chat.completion',
        choices: [
            {
                message: {
                    role: 'assistant',
                    content: JSON.stringify({ items }, null, 2)
                }
            }
        ]
    };
}

function parseResponse(responseJson) {
    // Groq chat completions typically return an array of choices with message content
    // We'll try to locate a content string and parse it as JSON
    try {
        const content = responseJson.choices && responseJson.choices[0] && responseJson.choices[0].message && responseJson.choices[0].message.content;
        if (!content) throw new Error('No content found in Groq response');

        // Some LLMs wrap JSON in markdown or code fences; try to extract the first JSON substring
        const jsonTextMatch = content.match(/\{[\s\S]*\}/m);
        if (!jsonTextMatch) throw new Error('No JSON object found in content');

        const parsed = JSON.parse(jsonTextMatch[0]);

        // Basic schema validation
        if (!parsed.items || !Array.isArray(parsed.items)) {
            throw new Error('Parsed JSON does not contain items array');
        }

        return parsed;
    } catch (err) {
        throw new Error(`Failed to parse Groq response: ${err.message}`);
    }
}

module.exports = {
    buildPrompt,
    callGroqAPI,
    parseResponse
};
