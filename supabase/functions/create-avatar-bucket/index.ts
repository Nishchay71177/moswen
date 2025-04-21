
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if the avatars bucket already exists
    const { data: existingBuckets } = await supabaseClient.storage.listBuckets();
    const avatarBucketExists = existingBuckets?.some(bucket => bucket.name === 'avatars');

    if (!avatarBucketExists) {
      // Create the avatars bucket
      const { error: bucketError } = await supabaseClient.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
      });

      if (bucketError) {
        throw bucketError;
      }

      // Create a policy to allow public read access
      const { error: policyError } = await supabaseClient.storage.from('avatars').createPolicy('public-read', {
        name: 'Public Read Access',
        definition: {
          action: 'select',
          type: 'public',
        },
      });

      if (policyError) {
        throw policyError;
      }

      // Create a policy to allow authenticated users to upload
      const { error: uploadPolicyError } = await supabaseClient.storage.from('avatars').createPolicy('authenticated-upload', {
        name: 'Authenticated User Upload',
        definition: {
          action: 'insert',
          role: 'authenticated',
        },
      });

      if (uploadPolicyError) {
        throw uploadPolicyError;
      }

      return new Response(
        JSON.stringify({ success: true, message: "Avatars bucket created successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: true, message: "Avatars bucket already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
