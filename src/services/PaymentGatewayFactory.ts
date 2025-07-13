import { IPaymentGateway } from '../interfaces/IPaymentGateway.ts';
import { PayPalService } from './paypal.service.ts';

export class PaymentGatewayFactory {
  private static gatewayMap: Map<string, IPaymentGateway> = new Map();

  public static registerGateway(name: string, gatewayInstance: IPaymentGateway): void {
    if (PaymentGatewayFactory.gatewayMap.has(name)) {
      console.warn(`Warning: Gateway with name '${name}' is already registered. Overwriting.`);
    }
    PaymentGatewayFactory.gatewayMap.set(name, gatewayInstance);
  }

  public static getGateway(name: string): IPaymentGateway {
    const gateway = PaymentGatewayFactory.gatewayMap.get(name);
    if (!gateway) {
      throw new Error(`Payment gateway '${name}' not found.`);
    }
    return gateway;
  }

  public static initialize(): void {
    // Register all known payment gateways here
    PaymentGatewayFactory.registerGateway('PayPal', new PayPalService());
    // Add other gateways as they are implemented
  }
}