export const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE',
  environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox', // or 'production'
  currency: 'USD',
  intent: 'capture'
};

export const getPayPalAuthHeader = () => {
  const auth = Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64');
  return `Basic ${auth}`;
};
