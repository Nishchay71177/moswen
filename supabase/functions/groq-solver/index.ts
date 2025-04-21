
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GroqRequestBody {
  question: string;
  subject: string;
  inputType: 'text' | 'voice' | 'image';
  isComplex?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "API key configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Parse the request body
    const { question, subject, inputType, isComplex = false } = await req.json() as GroqRequestBody;
    
    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create the prompt based on input parameters
    const prompt = createPrompt(question, subject, inputType, isComplex);
    
    const systemMessage = isComplex 
      ? 'You are an advanced mathematics tutor specializing in complex mathematical problems. Provide detailed, rigorous solutions with formal mathematical notation. Explore multiple solution approaches when appropriate, discuss mathematical theory behind the solutions, and point out connections to other areas of mathematics. Use latex formatting for advanced equations.'
      : 'You are a mathematics tutor specialized in helping students solve math problems. Provide clear, step-by-step solutions, identify common mistakes, and explain mathematical concepts. Always check the student\'s work for errors and explain the correct approach. Include latex-style formatting for equations when appropriate.';

    // Prepare request for Groq API
    const requestBody = {
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-70b-8192',
      temperature: isComplex ? 0.4 : 0.3,
      top_p: 0.9,
      max_tokens: 4096
    };

    console.log("Sending request to Groq API for question:", question);
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return new Response(
        JSON.stringify({ error: `API request failed: ${errorText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const data = await response.json();
    console.log("Received answer from Groq API");
    
    return new Response(
      JSON.stringify({ answer: data.choices[0].message.content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in groq-solver function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

function createPrompt(
  question: string, 
  subject: string, 
  inputType: 'text' | 'voice' | 'image',
  isComplex: boolean = false
): string {
  let promptPrefix = '';
  
  // Customize the prompt based on math subject
  switch (subject) {
    case 'algebra':
      promptPrefix = 'Solve this algebra problem step by step, showing all work and explaining each step clearly:';
      break;
    case 'geometry':
      promptPrefix = 'Solve this geometry problem showing all steps, diagrams are described in text:';
      break;
    case 'calculus':
      promptPrefix = 'Solve this calculus problem with all steps and relevant rules/theorems:';
      break;
    case 'trigonometry':
      promptPrefix = 'Solve this trigonometry problem showing all necessary identities and steps:';
      break;
    case 'statistics':
      promptPrefix = 'Solve this statistics problem with the relevant formulas and calculations:';
      break;
    case 'problem-solving':
      promptPrefix = 'Solve this math word problem by identifying the approach and showing all steps:';
      break;
    case 'advanced-mathematics':
      promptPrefix = 'Solve this advanced mathematics problem with full mathematical rigor, showing all necessary steps and theoretical concepts:';
      break;
    default:
      promptPrefix = 'Solve this math problem step by step:';
  }
  
  // Customize based on input type
  let inputTypePrefix = '';
  if (inputType === 'image') {
    inputTypePrefix = "[The question is from an image, which appears to show the following math problem: ";
    return `${promptPrefix} ${inputTypePrefix}${question}]`;
  } else if (inputType === 'voice') {
    inputTypePrefix = "[The question was provided via voice and transcribed as: ";
    return `${promptPrefix} ${inputTypePrefix}${question}]. Please correct any potential transcription errors if needed.`;
  }
  
  return `${promptPrefix} ${question}`;
}
