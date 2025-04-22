
import React from 'react';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ShutterstockCredentials {
  clientId: string;
  clientSecret: string;
}

export const ShutterstockSettings = () => {
  const [credentials, setCredentials] = useState<ShutterstockCredentials>(() => {
    const saved = localStorage.getItem('shutterstock_credentials');
    return saved ? JSON.parse(saved) : { clientId: '', clientSecret: '' };
  });

  const form = useForm<ShutterstockCredentials>({
    defaultValues: credentials
  });

  const onSubmit = (data: ShutterstockCredentials) => {
    localStorage.setItem('shutterstock_credentials', JSON.stringify(data));
    setCredentials(data);
    toast.success("Shutterstock credentials saved");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Shutterstock API Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your Shutterstock Client ID" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="Enter your Shutterstock Client Secret" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Credentials
          </Button>
        </form>
      </Form>

      {credentials.clientId && (
        <div className="text-center text-sm text-muted-foreground">
          ✓ Credentials are saved locally
        </div>
      )}
    </div>
  );
};

