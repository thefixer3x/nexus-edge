import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Nexus Edge</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-foreground/80 hover:text-foreground">
            Products
          </Link>
          <Link to="/admin/workspace" className="text-foreground/80 hover:text-foreground">
            Workspace
          </Link>
          <Link to="/login" className="text-foreground/80 hover:text-foreground">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            The AI-Powered Development Platform
          </h1>
          <p className="mt-6 text-xl text-foreground/80">
            Nexus Edge provides intelligent code generation, real-time collaboration, and project management tools to accelerate your development workflow.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90">
              Explore Products
            </Link>
            <Link to="/signup" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md text-lg font-medium hover:bg-secondary/90">
              Get Started
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-secondary mt-auto py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium">Nexus Edge</h3>
              <p className="mt-2 text-sm text-foreground/70">
                The next-generation development platform powered by AI.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products" className="text-foreground/70 hover:text-foreground">All Products</Link></li>
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">About Us</Link></li>
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">Careers</Link></li>
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="text-foreground/70 hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-foreground/10 text-center text-sm text-foreground/70">
            © {new Date().getFullYear()} Nexus Edge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
