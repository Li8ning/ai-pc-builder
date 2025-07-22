const axios = require('axios');

async function getAiRecommendation(preferences) {
    const { budget, pc_type, style, form_factor, cpu_brand, gpu_brand, accessories, exclude_accessories } = preferences;

    const prompt = [
        'You are an expert PC builder AI. A user wants to build a custom PC with the following requirements:',
        `- Budget: ${budget} INR`,
        `- Primary Use: ${pc_type}`,
        style !== 'Any' ? `- Style Preference: ${style}` : '',
        `- Form Factor: ${form_factor}`,
        `- CPU Brand Preference: ${cpu_brand}`,
        `- GPU Brand Preference: ${gpu_brand}`,
        accessories ? `- Include Accessories: ${accessories}` : '',
        exclude_accessories ? `- Exclude Accessories: ${exclude_accessories}` : '',
        '',
        'Your task is to act as a budget optimization algorithm and recommend a complete set of compatible PC components.',
        '',
        'Budget Optimization Algorithm:',
        '1. Start with the most important component for the use case (e.g., GPU for gaming, CPU for productivity).',
        '2. Allocate budget percentages based on the primary use.',
        '3. Select components that fit these budget allocations.',
        '4. If the total cost is over budget, suggest downgrades. If under budget, suggest where to spend the extra money for the best performance gains.',
        '',
        'CRITICAL Instructions:',
        '1. Web Search: If you have web browsing capabilities, use them to research and select the most suitable components, verify compatibility, and find the most up-to-date prices in Indian Rupees (INR). If you do not have web browsing capabilities, use your internal knowledge base.',
        '3. Laptops: If the user selects "Laptop", provide the full, specific model name.',
        '4. Output Format: You MUST return the response as a single JSON object that strictly follows the schema below. Do not add any extra text or explanations outside of the JSON object.',
        '',
        'JSON Schema:',
        '```json',
        '{',
        '  "total_cost": "₹[Total Estimated Cost] INR",',
        '  "notes": "[Your summary and budget optimization suggestions]",',
        '  "parts": [',
        '    {',
        '      "type": "CPU",',
        '      "name": "[Component Name]",',
        '      "price": "₹[Price] INR",',
        '      "specs": "[Key Specs]",',
        '      "reason": "[Brief reason for choosing this component]",',
        '      "reason": "[Brief reason for choosing this component]"',
        '    }',
        '  ],',
        '  "performance_benchmarks": {',
        '    "gaming_1080p": "[Estimated FPS]",',
        '    "gaming_1440p": "[Estimated FPS]",',
        '    "productivity_score": "[Score]"',
        '  },',
        '  "compatibility_matrix": {',
        '    "cpu_motherboard": "Compatible",',
        '    "ram_motherboard": "Compatible",',
        '    "gpu_case": "Fits",',
        '    "psu_wattage": "Sufficient"',
        '  }',
        '}',
        '```'
    ].join('\n');

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(apiUrl, {
            model: 'gpt-4o-mini', // Using gpt-4o-mini for web browsing capabilities
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" },
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        console.log("--- AI RAW RESPONSE ---");
        console.log(content);
        console.log("-----------------------");
        // The AI's response is a stringified JSON, so we need to parse it.
        const data = JSON.parse(content);
        return data;

    } catch (error) {
        console.error('Error calling AI API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get recommendations from AI service.');
    }
}

module.exports = { getAiRecommendation };