import React from 'react';

export function ShutterstockSettings() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shutterstock Settings</h1>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-muted-foreground">
          Shutterstock API configuration will be available here.
        </p>
      </div>
    </div>
  );
}

export function ShutterstockSettings() {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shutterstock Settings</h1>
      <div className="bg-card p-6 rounded-lg border border-border">
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
    </div>
  );
}

