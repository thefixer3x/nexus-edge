import axios from 'axios';
import { Config } from '../config/config';

export class PaymentGatewayService {
  private baseUrl: string;
  private merchantId: string;
  private apiPassword: string;
  private apiVersion: string;

  constructor() {
    const config = Config.getPaymentGatewayConfig();
    this.baseUrl = config.host;
    this.merchantId = config.merchantId;
    this.apiPassword = config.apiPassword;
    this.apiVersion = config.apiVersion;
  }

  protected async makeRequest(endpoint: string, method: string, data?: any) {
    const url = `${this.baseUrl}/api/rest/version/${this.apiVersion}/merchant/${this.merchantId}${endpoint}`;
    
    try {
      const response = await axios({
        method,
        url,
        data,
        auth: {
          username: `merchant.${this.merchantId}`,
          password: this.apiPassword
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    // Handle specific gateway errors
    if (error.response?.data) {
      return error.response.data;
    }
    return error;
  }
}
