
import React from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <div className="md:hidden block">
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-background border border-border shadow-md active:scale-95 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl py-6">
          <div className="w-full px-4">
            <h3 className="text-xl font-medium mb-6">Appearance</h3>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="h-6 w-6 text-orange-400" />
                <Label htmlFor="theme-mode" className="text-lg font-medium">
                  Light
                </Label>
              </div>
              <Switch
                id="theme-mode"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-purple-600 scale-125"
              />
              <div className="flex items-center space-x-2">
                <Moon className="h-6 w-6 text-blue-400" />
                <Label htmlFor="theme-mode" className="text-lg font-medium">
                  Dark
                </Label>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileThemeToggle;
