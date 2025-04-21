
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedTutorHeader from "@/components/EnhancedTutorHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, Mail, LockKeyhole, User, School, Briefcase, CalendarClock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const { toast } = useToast();

  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    const profession = formData.get("profession") as string;
    const age = formData.get("age") as string;
    const standard = formData.get("standard") as string;
    
    try {
      await signUp(email, password, username, fullName, profession, age, standard, avatarFile);
      toast({
        title: "Account created!",
        description: "Check your email to confirm your account, then login.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!forgotPasswordEmail.trim()) {
        throw new Error("Please enter your email address");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EnhancedTutorHeader />
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] py-8">
        <div className="w-full max-w-md p-4">
          <Tabs defaultValue={isResetMode ? "reset" : "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="login" className="text-base py-3">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-base py-3">Sign Up</TabsTrigger>
              <TabsTrigger value="reset" className="text-base py-3">Reset Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-tutor-purple/20 shadow-lg bg-white/95 dark:bg-gray-800/95">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold tutor-gradient-text">Welcome Back</CardTitle>
                  <CardDescription className="text-base">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base flex items-center">
                        <Mail className="h-4 w-4 mr-2 opacity-70" />
                        Email
                      </Label>
                      <div className="relative">
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          required 
                          className="text-base py-6 pl-3" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-base flex items-center">
                        <LockKeyhole className="h-4 w-4 mr-2 opacity-70" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          name="password" 
                          type="password" 
                          required 
                          className="text-base py-6 pl-3" 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-tutor-blue via-tutor-purple to-tutor-purple hover:opacity-90 text-base py-6" 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsResetMode(true)}
                      className="text-base font-medium text-tutor-blue"
                    >
                      Forgot password?
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="border-tutor-purple/20 shadow-lg bg-white/95 dark:bg-gray-800/95">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tutor-gradient-text">Create an account</CardTitle>
                  <CardDescription className="text-base">
                    Join our learning community
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24 cursor-pointer border-2 border-tutor-purple/20">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-tutor-blue to-tutor-purple text-white">
                              <User className="h-10 w-10" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 cursor-pointer">
                          <Upload className="h-4 w-4 text-white" />
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>
                      <p className="text-base text-muted-foreground mt-2">Upload profile picture</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base flex items-center">
                        <Mail className="h-4 w-4 mr-2 opacity-70" />
                        Email
                      </Label>
                      <Input id="email" name="email" type="email" placeholder="name@example.com" required className="text-base py-5" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-base flex items-center">
                          <User className="h-4 w-4 mr-2 opacity-70" />
                          Username
                        </Label>
                        <Input id="username" name="username" placeholder="yourusername" required className="text-base py-5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-base flex items-center">
                          <User className="h-4 w-4 mr-2 opacity-70" />
                          Full Name
                        </Label>
                        <Input id="fullName" name="fullName" placeholder="Your Name" required className="text-base py-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-base flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 opacity-70" />
                        Profession
                      </Label>
                      <Input id="profession" name="profession" placeholder="Your Profession" required className="text-base py-5" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-base flex items-center">
                          <CalendarClock className="h-4 w-4 mr-2 opacity-70" />
                          Age
                        </Label>
                        <Input id="age" name="age" type="number" placeholder="Your Age" required className="text-base py-5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="standard" className="text-base flex items-center">
                          <School className="h-4 w-4 mr-2 opacity-70" />
                          Education Level
                        </Label>
                        <Select name="standard">
                          <SelectTrigger className="text-base py-5">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elementary">Elementary School</SelectItem>
                            <SelectItem value="middle">Middle School</SelectItem>
                            <SelectItem value="high">High School</SelectItem>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base flex items-center">
                        <LockKeyhole className="h-4 w-4 mr-2 opacity-70" />
                        Password
                      </Label>
                      <Input id="password" name="password" type="password" required className="text-base py-5" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-tutor-blue via-tutor-purple to-tutor-purple hover:opacity-90 text-base py-5" 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="reset">
              <Card className="border-tutor-purple/20 shadow-lg bg-white/95 dark:bg-gray-800/95">
                <form onSubmit={handleForgotPassword}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tutor-gradient-text">Reset Password</CardTitle>
                    <CardDescription className="text-base">
                      Enter your email to receive a password reset link
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-base flex items-center">
                        <Mail className="h-4 w-4 mr-2 opacity-70" />
                        Email
                      </Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                        className="text-base py-5"
                        placeholder="name@example.com"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-tutor-blue via-tutor-purple to-tutor-purple hover:opacity-90 text-base py-5"
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsResetMode(false)}
                      className="w-full text-base"
                    >
                      Back to Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
