import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-9xl font-bold text-primary/20">404</div>
      <h1 className="mt-6 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-4 text-center text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
