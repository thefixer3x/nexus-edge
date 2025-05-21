const PAYPAL_CONFIG = {
  clientId: 'YOUR_CLIENT_ID_HERE',
  currency: 'USD'
};

export const initPayPal = async (container) => {
  const paypalConfig = {
    clientId: 'YOUR_CLIENT_ID',
    currency: 'USD'
  };

  // Initialize PayPal SDK
  await loadPayPalScript(paypalConfig);
  
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '0.01'
          }
        }]
      });
    },
    onApprove: async (data, actions) => {
      const order = await actions.order.capture();
      console.log('Transaction completed:', order);
    }
  }).render(container);
};

function loadPayPalScript(config) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${config.clientId}&currency=${config.currency}`;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default PAYPAL_CONFIG;
