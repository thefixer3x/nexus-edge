
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Apple Store Lekki Media Service</h1>
        <p className="text-xl text-gray-600 mb-8">Test and manage your media integration</p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/media-test">Media Test Interface</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/settings">Shutterstock Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
