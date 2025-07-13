# Integrating a New Payment Gateway

This document outlines the process for integrating a new payment gateway into the system. The new architecture is designed to minimize changes to core components, making the integration process streamlined and efficient.

## Overview of the New Architecture

The payment gateway system is built around a flexible, extensible architecture:

*   **[`IPaymentGateway`](src/interfaces/IPaymentGateway.ts):** This interface defines the contract that all payment gateway services must adhere to. It ensures a consistent API for processing payments, refunds, and handling webhooks, regardless of the underlying payment provider.
*   **`PaymentGatewayFactory`:** This factory class is responsible for creating and managing instances of various payment gateway services. It acts as a central registry where new gateway implementations are registered and retrieved based on a `gatewayType` identifier.
*   **`PaymentController`:** This controller interacts with the `PaymentGatewayFactory` to dynamically select the appropriate payment gateway service based on the `gatewayType` provided in the payment request. This decouples the controller from specific payment gateway implementations.

## Creating a New Gateway Service

To integrate a new payment gateway (e.g., Stripe), you need to create a new class that implements the `IPaymentGateway` interface.

1.  Create a new file, for example, `src/services/StripeService.ts`.
2.  Implement the `IPaymentGateway` interface, ensuring all required methods are defined.

    ```typescript
    // src/services/StripeService.ts
    import { IPaymentGateway } from '../interfaces/IPaymentGateway';
    import { PaymentRequest } from '../models/PaymentRequest';
    import { PaymentResponse } from '../models/PaymentResponse'; // Assuming this exists

    export class StripeService implements IPaymentGateway {
        private apiKey: string;

        constructor(apiKey: string) {
            this.apiKey = apiKey;
            // Initialize Stripe SDK or client here
        }

        async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
            console.log(`Processing Stripe payment for amount: ${request.amount}`);
            // Logic to interact with Stripe API to process payment
            // Example: const stripeResponse = await stripe.charges.create(...);
            return { success: true, transactionId: 'stripe_txn_123' };
        }

        async refundPayment(transactionId: string, amount: number): Promise<boolean> {
            console.log(`Refunding Stripe payment ${transactionId} for amount: ${amount}`);
            // Logic to interact with Stripe API to process refund
            return true;
        }

        async handleWebhook(payload: any, headers: any): Promise<any> {
            console.log('Handling Stripe webhook');
            // Logic to verify and process Stripe webhook events
            return { status: 'success' };
        }
    }
    ```

## Adding Configuration

Gateway-specific configurations, such as API keys and secrets, should be added to `src/config/config.ts` or a new dedicated configuration file if the settings are extensive.

1.  Open `src/config/config.ts`.
2.  Add a new property for your gateway's configuration.

    ```typescript
    // src/config/config.ts
    export const config = {
        // ... existing configurations
        stripe: {
            apiKey: process.env.STRIPE_API_KEY || 'your_default_stripe_api_key',
            secret: process.env.STRIPE_SECRET || 'your_default_stripe_secret',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'your_default_stripe_webhook_secret',
        },
        // ... other gateway configurations
    };
    ```
    Remember to add `STRIPE_API_KEY`, `STRIPE_SECRET`, and `STRIPE_WEBHOOK_SECRET` to your `.env` file.

## Registering the Gateway

The new gateway service must be registered with the `PaymentGatewayFactory` so it can be instantiated and used by the system. This is typically done in the `initialize()` method of the factory.

1.  Open the `PaymentGatewayFactory` file (e.g., `src/services/PaymentGatewayFactory.ts`).
2.  Import your new service and register it.

    ```typescript
    // src/services/PaymentGatewayFactory.ts
    import { IPaymentGateway } from '../interfaces/IPaymentGateway';
    import { PayPalService } from './PayPalService'; // Assuming PayPalService exists
    import { StripeService } from './StripeService'; // Import your new service
    import { config } from '../config/config';

    export class PaymentGatewayFactory {
        private static gateways: Map<string, IPaymentGateway> = new Map();

        public static initialize() {
            // Register PayPal Service
            PaymentGatewayFactory.registerGateway('paypal', new PayPalService(config.paypal.apiKey));

            // Register Stripe Service
            PaymentGatewayFactory.registerGateway('stripe', new StripeService(config.stripe.apiKey));
            // Add other gateway initializations here
        }

        private static registerGateway(type: string, gateway: IPaymentGateway) {
            PaymentGatewayFactory.gateways.set(type, gateway);
        }

        public static getGateway(type: string): IPaymentGateway {
            const gateway = PaymentGatewayFactory.gateways.get(type);
            if (!gateway) {
                throw new Error(`Payment gateway type "${type}" not found.`);
            }
            return gateway;
        }
    }
    ```

## Frontend Integration (Briefly)

The frontend will need to specify the `gatewayType` when initiating payment requests. This `gatewayType` will correspond to the identifier used during gateway registration (e.g., `'stripe'`, `'paypal'`).

Example (conceptual):

```typescript
// Frontend payment initiation
const paymentDetails = {
    amount: 100.00,
    currency: 'USD',
    gatewayType: 'stripe', // Specify the desired gateway
    // ... other payment details
};

// Send paymentDetails to your backend API
apiClient.post('/payments/process', paymentDetails);
```

## Webhook Handling

For gateways that send webhooks (e.g., for payment confirmations, refunds, or disputes), you will need to extend the webhook handling logic.

1.  **Extend `determineGatewayFromHeaders`:** If your new gateway sends unique headers that can identify it, you can extend the `determineGatewayFromHeaders` method in `PaymentController` to route the webhook to the correct service.

    ```typescript
    // src/controllers/PaymentController.ts
    import { Request, Response } from 'express';
    import { PaymentGatewayFactory } from '../services/PaymentGatewayFactory';

    export class PaymentController {
        // ... existing methods

        public static async handleWebhook(req: Request, res: Response) {
            const gatewayType = PaymentController.determineGatewayFromHeaders(req.headers);
            if (!gatewayType) {
                return res.status(400).send('Unknown gateway webhook');
            }

            try {
                const gateway = PaymentGatewayFactory.getGateway(gatewayType);
                await gateway.handleWebhook(req.body, req.headers);
                res.status(200).send('Webhook processed');
            } catch (error) {
                console.error(`Error handling webhook for ${gatewayType}:`, error);
                res.status(500).send('Error processing webhook');
            }
        }

        private static determineGatewayFromHeaders(headers: any): string | null {
            if (headers['paypal-transmission-id']) {
                return 'paypal';
            }
            if (headers['stripe-signature']) { // Example for Stripe
                return 'stripe';
            }
            // Add logic for other gateways based on their unique headers
            return null;
        }
    }
    ```

2.  **Modify Webhook Route (Alternative):** If a gateway requires a completely different webhook endpoint or processing logic, you might consider adding a new route specifically for that gateway's webhooks in `src/routes/payment.routes.ts`.

    ```typescript
    // src/routes/payment.routes.ts
    import { Router } from 'express';
    import { PaymentController } from '../controllers/PaymentController';
    // import { StripeWebhookController } from '../controllers/StripeWebhookController'; // If you create a dedicated controller

    const router = Router();

    router.post('/process', PaymentController.processPayment);
    router.post('/refund', PaymentController.refundPayment);
    router.post('/webhook', PaymentController.handleWebhook); // Generic webhook handler

    // If a dedicated Stripe webhook endpoint is preferred:
    // router.post('/webhook/stripe', StripeWebhookController.handleWebhook);

    export default router;
    ```

## Testing

Thoroughly test the new payment gateway integration to ensure it functions correctly. This includes:

*   **Unit Tests:** Test your new gateway service methods (`processPayment`, `refundPayment`, `handleWebhook`) in isolation.
*   **Integration Tests:** Test the end-to-end flow, from frontend initiation to backend processing and webhook handling.
*   **Error Handling:** Verify that error scenarios (e.g., invalid credentials, payment failures) are handled gracefully.