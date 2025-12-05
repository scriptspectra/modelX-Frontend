import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Your Groq API key
});

export async function POST(req: Request) {
  try {
    const { prompt, city: requestedCity } = await req.json();
    console.log('Received prompt on server:', prompt);

    // Use the city from frontend search, fallback to Colombo if empty
    const city = requestedCity?.trim() || 'Colombo';
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );

    const data = await res.json();
    console.log('API response from OpenWeather:', data);

    // Validate weather data
    if (!data || !data.main || !data.weather) {
      return NextResponse.json(
        { error: 'Failed to fetch valid weather data. Check API key or city.' },
        { status: 400 }
      );
    }

    // ---------------------------
    // Detailed LLM Prompt
    // ---------------------------
    const llmPrompt = `
You are a Weather Insights Assistant. Your task is to generate actionable insights based on weather data for two categories: Business Owners and the General Public. Each insight must include a "why" section explaining the reasoning behind it based on the weather data. Do NOT mention the API in the "why" section.

Format your response strictly in JSON like this:

{
  "insights": [
    {
      "category": "Business",
      "area": "Solar Energy",
      "insight": "...",
      "why": "..."
    },
    {
      "category": "Business",
      "area": "Transportation & Logistics",
      "insight": "...",
      "why": "..."
    },
    {
      "category": "Business",
      "area": "Workforce & Outdoor Activities",
      "insight": "...",
      "why": "..."
    },
    {
      "category": "Public",
      "area": "Personal Comfort",
      "insight": "...",
      "why": "..."
    },
    {
      "category": "Public",
      "area": "Rain Preparedness",
      "insight": "...",
      "why": "..."
    },
    {
      "category": "Public",
      "area": "Outdoor Activities",
      "insight": "...",
      "why": "..."
    }
  ]
}

Example input (weather data):

{
  "coord": { "lon": 79.8478, "lat": 6.9319 },
  "weather": [ { "id": 804, "main": "Clouds", "description": "overcast clouds", "icon": "04d" } ],
  "main": { "temp": 303.17, "feels_like": 308.73, "temp_min": 303.17, "temp_max": 304.12, "pressure": 1012, "humidity": 72 },
  "visibility": 10000,
  "wind": { "speed": 2, "deg": 282, "gust": 1.7 },
  "clouds": { "all": 90 },
  "sys": { "sunrise": 1764895151, "sunset": 1764937410 },
  "timezone": 19800,
  "name": "Colombo",
  "cod": 200
}

Example JSON response:

{
  "insights": [
    {
      "category": "Business",
      "area": "Solar Energy",
      "insight": "High cloud cover (overcast clouds, 90%) may reduce solar panel efficiency today, so plan energy storage or backup sources accordingly.",
      "why": "Cloud cover is at 90%, meaning most sunlight is blocked, which lowers energy generation from solar panels."
    },
    {
      "category": "Business",
      "area": "Transportation & Logistics",
      "insight": "Moderate wind (2 m/s) and clear visibility (10 km) suggest that transport and delivery operations are mostly safe, but heavy cloud cover may affect drone or aerial deliveries.",
      "why": "Wind speed is 2 m/s and visibility is 10 km, which supports safe transport. However, cloud cover at 90% could interfere with drone navigation or aerial operations."
    },
    {
      "category": "Business",
      "area": "Workforce & Outdoor Activities",
      "insight": "High temperature (303.17 K ≈ 30°C) with high humidity (72%) indicates that outdoor workers may experience heat stress; consider adjusting work schedules or providing hydration.",
      "why": "Temperature is 303.17 K with 72% humidity, creating conditions that can increase heat stress for workers outdoors."
    },
    {
      "category": "Public",
      "area": "Personal Comfort",
      "insight": "Carry a hat or wear light clothing due to high temperature (30°C) and high humidity (72%).",
      "why": "High heat and humidity can cause discomfort or dehydration, so wearing breathable clothing helps."
    },
    {
      "category": "Public",
      "area": "Rain Preparedness",
      "insight": "Consider bringing an umbrella, as heavy cloud cover (90%) suggests a possibility of rain.",
      "why": "Cloud cover at 90% usually indicates overcast skies and a chance of precipitation."
    },
    {
      "category": "Public",
      "area": "Outdoor Activities",
      "insight": "Wind is light (2 m/s), so outdoor activities are mostly safe, but monitor skies for sudden changes.",
      "why": "Low wind speed minimizes risk for outdoor events, though overcast conditions may still affect comfort."
    }
  ]
}

Instructions:
- Read the provided weather data carefully.
- Generate 3–5 key insights for business owners and 3 key insights for the general public.
- Always include a 'why' explaining your reasoning from the weather data.
- Return valid JSON only.
- Focus on actionable insights, not just raw numbers.

Weather data to process:
${JSON.stringify(data)}
`;

    // ---------------------------
    // Call Groq LLM
    // ---------------------------
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: llmPrompt,
        },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 1,
      max_completion_tokens: 8192,
    });

    const jsonResponse = chatCompletion.choices[0]?.message?.content;
    console.log('LLM raw response:', jsonResponse);

    if (!jsonResponse) {
      return NextResponse.json(
        { error: 'LLM returned no content' },
        { status: 500 }
      );
    }

    let llmInsights;
    try {
      llmInsights = JSON.parse(jsonResponse);
    } catch (err) {
      console.error('Failed to parse LLM JSON response:', err);
      return NextResponse.json(
        { error: 'Failed to parse LLM response as JSON' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, llmInsights });
  } catch (error) {
    console.error('Server-side error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data or generate insights' },
      { status: 500 }
    );
  }
}
