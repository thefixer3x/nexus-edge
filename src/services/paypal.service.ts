import { PAYPAL_CONFIG, getPayPalAuthHeader } from '../config/paypal.config';

const BASE_URL = PAYPAL_CONFIG.environment === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

export class PayPalService {
  static async createOrder(amount: number) {
    const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getPayPalAuthHeader(),
      },
      body: JSON.stringify({
        intent: PAYPAL_CONFIG.intent,
        purchase_units: [{
          amount: {
            currency_code: PAYPAL_CONFIG.currency,
            value: amount.toString()
          }
        }]
      })
    });

    return response.json();
  }

  static async capturePayment(orderId: string) {
    const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': getPayPalAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}
