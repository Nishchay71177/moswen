
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    username: string, 
    fullName: string, 
    profession?: string, 
    age?: string, 
    standard?: string, 
    avatarFile?: File | null
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
};

type ProfileData = {
  username: string;
  full_name: string;
  profession: string;
  age: string;
  standard: string;
  avatar_url: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session:", initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile fetched:", data);
      setProfile(data);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log("Uploading avatar:", filePath);

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log("Avatar uploaded:", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    username: string, 
    fullName: string, 
    profession?: string, 
    age?: string, 
    standard?: string, 
    avatarFile?: File | null
  ) => {
    try {
      // First upload avatar if provided
      let avatarUrl = null;
      if (avatarFile) {
        console.log("Uploading avatar for signup");
        // Create a temporary user ID for the avatar
        const tempId = Math.random().toString(36).substring(2);
        avatarUrl = await uploadAvatar(tempId, avatarFile);
      }

      console.log("Signing up:", email);
      // Then sign up the user
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            profession,
            age,
            standard,
            avatar_url: avatarUrl,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user) {
      console.error("No user logged in");
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Updating profile for user:", user.id, data);
      let avatarUrl = data.avatar_url;
      
      // If there's a file included, upload it
      if (data.avatar_url && data.avatar_url.startsWith('blob:')) {
        console.log("Uploading new avatar from blob URL");
        // This is a new file
        const response = await fetch(data.avatar_url);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.png', { type: 'image/png' });
        
        const uploadedUrl = await uploadAvatar(user.id, file);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          delete data.avatar_url; // Don't update if upload failed
        }
      }
      
      const updateData = {
        ...data,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      console.log("Final update data:", updateData);
      
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Refresh profile data
      await fetchProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
