
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <BookX className="h-16 w-16 text-tutor-orange" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 tutor-gradient-text">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the educational content you were looking for.
        </p>
        <Button asChild className="bg-tutor-purple hover:bg-tutor-purple/90">
          <a href="/">Return to Tutor</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
