
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MathHistoryService } from "@/services/MathHistoryService";
import EnhancedTutorHeader from "@/components/EnhancedTutorHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Contact, Mail, HelpCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Profile() {
  const { user, profile, signOut, isLoading, updateProfile } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    profession: '',
    standard: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchHistory();
      
      // Initialize profile data
      if (profile) {
        setProfileData({
          username: profile.username || '',
          fullName: profile.full_name || '',
          profession: profile.profession || '',
          standard: profile.standard || ''
        });
        
        console.log("Initialized profile data:", {
          username: profile.username || '',
          fullName: profile.full_name || '',
          profession: profile.profession || '',
          standard: profile.standard || ''
        });
      }
    }
  }, [user, isLoading, profile, navigate]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await MathHistoryService.getUserHistory();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Could not load your history. Please try again later.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Please select an image less than 5MB.");
        return;
      }
      
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`Input changed - ${name}: ${value}`);
  };

  const handleSelectChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      standard: value
    }));
    console.log(`Standard changed: ${value}`);
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const updateData: any = {
        username: profileData.username,
        full_name: profileData.fullName,
        profession: profileData.profession,
        standard: profileData.standard
      };
      
      console.log("Submitting profile update:", updateData);
      
      if (avatarPreview) {
        updateData.avatar_url = avatarPreview;
      }
      
      await updateProfile(updateData);
      toast.success("Profile updated successfully!");
      setAvatarPreview(null);
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <EnhancedTutorHeader />
        <div className="container mx-auto p-4 text-center">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-pulse text-xl">Loading your profile...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <EnhancedTutorHeader />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {profile?.username?.charAt(0) || user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-2xl">{profile?.full_name || "User"}</CardTitle>
                    <CardDescription className="text-lg">@{profile?.username || user?.email?.split('@')[0]}</CardDescription>
                    {profile?.profession && (
                      <p className="text-lg text-muted-foreground mt-1">{profile.profession}</p>
                    )}
                    {profile?.standard && (
                      <div className="bg-primary/10 text-primary text-base px-3 py-1 rounded-full mt-2 inline-block">
                        {profile.standard}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex justify-start text-lg py-6"
                    onClick={() => navigate("/")}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" /> Solve Math Problems
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex justify-start text-lg py-6"
                  >
                    <Mail className="mr-2 h-5 w-5" /> Email: {user?.email}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex justify-start text-lg py-6"
                  >
                    <Contact className="mr-2 h-5 w-5" /> Contact Support
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full text-lg py-6"
                    onClick={async () => {
                      await signOut();
                      navigate("/auth");
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="settings">
              <TabsList className="w-full">
                <TabsTrigger value="settings" className="flex-1 text-lg py-3">Profile Settings</TabsTrigger>
                <TabsTrigger value="history" className="flex-1 text-lg py-3">Problem History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Profile Settings</CardTitle>
                    <CardDescription className="text-lg">
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-5">
                      <div className="flex flex-col items-center mb-4">
                        <div className="relative">
                          <Avatar className="h-24 w-24 cursor-pointer">
                            {avatarPreview ? (
                              <AvatarImage src={avatarPreview} alt="Profile" />
                            ) : (
                              <>
                                <AvatarImage src={profile?.avatar_url} />
                                <AvatarFallback className="bg-gray-200">
                                  <Camera className="h-10 w-10 text-gray-400" />
                                </AvatarFallback>
                              </>
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
                        <p className="text-lg text-muted-foreground mt-2">
                          {avatarPreview ? "New profile picture selected" : "Click to change your profile picture"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-lg">Username</Label>
                          <Input 
                            id="username" 
                            name="username" 
                            value={profileData.username}
                            onChange={handleInputChange}
                            placeholder="yourusername"
                            className="text-lg py-6"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-lg">Full Name</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={profileData.fullName}
                            onChange={handleInputChange}
                            placeholder="Your Name"
                            className="text-lg py-6"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profession" className="text-lg">Profession</Label>
                        <Input 
                          id="profession" 
                          name="profession" 
                          value={profileData.profession}
                          onChange={handleInputChange}
                          placeholder="Your Profession"
                          className="text-lg py-6"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="standard" className="text-lg">Standard/Grade</Label>
                          <Select 
                            name="standard" 
                            value={profileData.standard}
                            onValueChange={handleSelectChange}
                          >
                            <SelectTrigger className="text-lg py-6">
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
                        <Label htmlFor="email" className="text-lg">Email</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ""} 
                          disabled 
                          className="bg-muted text-lg py-6"
                        />
                        <p className="text-base text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-tutor-blue hover:bg-tutor-blue/90 text-lg py-6"
                        disabled={updating}
                      >
                        {updating ? "Updating..." : "Update Profile"}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Your Math Problem History</CardTitle>
                    <CardDescription className="text-lg">
                      View all the math problems you've solved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="text-center p-4">Loading history...</div>
                    ) : history.length === 0 ? (
                      <div className="text-center p-4">
                        <p className="text-lg mb-3">You haven't solved any math problems yet.</p>
                        <Button 
                          className="mt-2 bg-tutor-blue hover:bg-tutor-blue/90 text-lg py-6" 
                          onClick={() => navigate("/")}
                        >
                          Solve Problems Now
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {history.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-muted/50">
                              <div>
                                <h3 className="font-medium text-lg">{item.subject}</h3>
                                <p className="text-base text-muted-foreground">
                                  {new Date(item.created_at).toLocaleString()}
                                </p>
                              </div>
                              {item.is_correct !== null && (
                                <div className={`px-3 py-1 rounded text-base font-medium ${
                                  item.is_correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                  {item.is_correct ? "Correct" : "Incorrect"}
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <p className="font-medium mb-1 text-lg">Question:</p>
                              <p className="mb-3 text-lg">{item.question}</p>
                              <p className="font-medium mb-1 text-lg">Answer:</p>
                              <p className="text-lg">{item.answer.length > 200 
                                ? `${item.answer.substring(0, 200)}...` 
                                : item.answer}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
