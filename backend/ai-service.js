const axios = require('axios');

async function getAiRecommendation(preferences) {
    const { budget, pc_type, style, form_factor, cpu_brand, gpu_brand, accessories, exclude_accessories } = preferences;

    const prompt = [
        '# **Role:**',
        'You are an Expert PC/Laptop Building Advisor. Your goal is to recommend the best possible system for a user\'s needs and budget.',
        '',
        '# **Core Directive: Value Optimization**',
        'Create a build that offers the best performance/value within the budget. It\'s acceptable to go slightly over/under if justified.',
        '',
        '# **Critical Rules:**',
        '1. **For Desktops:**',
        '   - List all individual components with prices',
        '   - Calculate total cost as the exact sum of parts',
        '   - Follow the Calculation Safety Protocol below',
        '2. **For Laptops:**',
        '   - Only recommend the complete laptop model',
        '   - No component breakdown needed',
        '   - Price should be the laptop\'s full cost',
        '',
        '# **Calculation Safety Protocol (Desktops Only):**',
        '1. List components in this order with prices:',
        '   - CPU → GPU → Motherboard → RAM → SSD → PSU → Case → Accessories',
        '2. Sum them sequentially, double-checking each addition',
        '3. Verify total_cost matches the sum of all parts',
        '',
        '# **Context:**',
        `- Target Budget: ${budget} INR`,
        `- Primary Use: ${pc_type}`,
        style !== 'Any' ? `- Style Preference: ${style}` : '',
        `- Form Factor: ${form_factor}`,
        `- CPU Brand Preference: ${cpu_brand}`,
        `- GPU Brand Preference: ${gpu_brand}`,
        accessories ? `- Include Accessories: ${accessories}` : '',
        exclude_accessories ? `- Exclude Accessories: ${exclude_accessories}` : '',
        '',
        '# **Internal Workflow:**',
        '',
        '**Step 1: Component Prioritization**',
        'Prioritize components based on Primary Use:',
        '- **Gaming:** GPU > CPU > RAM',
        '- **Content Creation:** CPU > RAM > GPU',
        '- **Office Use:** SSD > CPU > RAM',
        '',
        '**Step 2: Part Selection**',
        'Select compatible components that fit the budget while respecting user preferences.',
        '',
        '**Step 3: Price Verification**',
        '1. List all selected parts with prices',
        '2. Calculate sum using the Safety Protocol above',
        '3. Cross-validate total three times',
        '4. Only proceed if math is perfect',
        '',
        '**Step 4: Final Output**',
        'You MUST return the response as a single JSON object that strictly follows the schema below. Do not add any extra text or explanations outside of the JSON object.',
        'If you CANNOT find any build within the budget then you can respond with a single JSON object with an empty parts array and a note explaining the situation.',
        '```json',
        '{',
        '  "total_cost": [EXACT SUM OF ALL PARTS or EXACT PRICE OF LAPTOP],',
        '  "notes": "[Explain budget decisions]",',
        '  "parts": [',
        '    {',
        '      "type": "CPU or Laptop",',
        '      "name": "[Model]",',
        '      "price": [Exact Price],',
        '      "specs": "[Key Specs]",',
        '      "reason": "[Selection reason]"',
        '    }',
        '    // Other parts...',
        '  ],',
        '  "performance_benchmarks": {',
        '    "gaming_1080p": "[Estimated FPS]",',
        '    "gaming_1440p": "[Estimated FPS]",',
        '    "productivity_score": "[Performance description along with a score out of 10]"',
        '  },',
        '  "compatibility_matrix": {',
        '    "cpu_motherboard": "Compatible",',
        '    "ram_motherboard": "Compatible",',
        '    "gpu_case": "Fits",',
        '    "psu_wattage": "Sufficient"',
        '  }',
        '}',
        '```',
        '',
        '# **Final Validation Check**',
        'Before responding, confirm:',
        '✓ All prices are correctly listed in parts array',
        '✓ cost_breakdown shows the exact calculation',
        '✓ total_cost matches the sum of all parts',
        '✓ No text appears outside the JSON object'
    ].join('\n');

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(apiUrl, {
            model: 'o4-mini-2025-04-16',
            messages: [{ role: 'user', content: prompt }],
            temperature: 1,
            response_format: { type: "json_object" },
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        // The AI's response is a stringified JSON, so we need to parse it.
        const data = JSON.parse(content);
        return data;

    } catch (error) {
        console.error('Error calling AI API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get recommendations from AI service.');
    }
}

module.exports = { getAiRecommendation };