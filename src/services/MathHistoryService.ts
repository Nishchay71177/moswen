
import { supabase } from "@/integrations/supabase/client";

type MathHistoryItem = {
  question: string;
  answer: string;
  subject: string;
  inputType: string;
  isCorrect?: boolean;
  mistake?: string;
};

export const MathHistoryService = {
  async saveHistory(history: MathHistoryItem) {
    const user = supabase.auth.getUser();
    if (!user) {
      console.log("No user logged in, not saving history");
      return;
    }

    try {
      const { error } = await supabase.from("math_history").insert({
        user_id: (await user).data.user?.id,
        question: history.question,
        answer: history.answer,
        subject: history.subject,
        input_type: history.inputType,
        is_correct: history.isCorrect,
        mistake: history.mistake
      });

      if (error) {
        console.error("Error saving math history:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in saveHistory:", error);
    }
  },

  async getUserHistory() {
    try {
      const { data, error } = await supabase
        .from("math_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching math history:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserHistory:", error);
      return [];
    }
  }
};
