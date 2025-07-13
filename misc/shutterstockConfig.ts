
export const getShutterstockCredentials = () => {
  const apiKey = process.env.SHUTTERSTOCK_API_KEY;
  const apiSecret = process.env.SHUTTERSTOCK_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Shutterstock API credentials not found in environment variables');
  }

  return { apiKey, apiSecret };
};

