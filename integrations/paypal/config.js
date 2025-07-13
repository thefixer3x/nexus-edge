const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  currency: 'USD'
};

export const loadPayPalScript = async () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&currency=${PAYPAL_CONFIG.currency}`;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export default PAYPAL_CONFIG;
