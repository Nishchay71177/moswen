
// This service will handle integration with the Groq API via Supabase edge function
import { supabase } from "@/integrations/supabase/client";

interface GroqResponse {
  answer: string;
  error?: string;
}

class GroqService {
  async generateAnswer(
    question: string, 
    subject: string, 
    inputType: 'text' | 'voice' | 'image',
    isComplex: boolean = false
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke<GroqResponse>('groq-solver', {
        body: {
          question,
          subject,
          inputType,
          isComplex,
          imageData: inputType === 'image' ? question : null // Pass the base64 image data when input is image
        }
      });

      if (error) {
        console.error('Error calling groq-solver function:', error);
        throw new Error(`Failed to generate answer: ${error.message}`);
      }

      if (data?.error) {
        console.error('Error from groq-solver function:', data.error);
        throw new Error(`Failed to generate answer: ${data.error}`);
      }

      if (!data?.answer) {
        throw new Error('No answer received from the server');
      }

      return data.answer;
    } catch (error) {
      console.error('Error generating answer:', error);
      if (error instanceof Error) {
        return `Error: ${error.message}. Please try again later.`;
      }
      return 'An unknown error occurred. Please try again later.';
    }
  }
}

export const groqService = new GroqService();
