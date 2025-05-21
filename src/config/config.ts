interface PaymentGatewayConfig {
  host: string;
  merchantId: string;
  apiPassword: string;
  apiVersion: string;
}

export class Config {
  private static validateEnvVars() {
    const required = [
      'GATEWAY_HOST', 
      'MERCHANT_ID', 
      'API_PASSWORD',
      'NODE_ENV',
      'PORT',
      'CORS_ORIGIN'
    ];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  static getPaymentGatewayConfig(): PaymentGatewayConfig {
    this.validateEnvVars();
    
    return {
      host: process.env.GATEWAY_HOST!,
      merchantId: process.env.MERCHANT_ID!,
      apiPassword: process.env.API_PASSWORD!,
      apiVersion: process.env.API_VERSION || '100'
    };
  }

  static getAppConfig() {
    this.validateEnvVars();
    
    return {
      nodeEnv: process.env.NODE_ENV!,
      port: parseInt(process.env.PORT!, 10),
      corsOrigin: process.env.CORS_ORIGIN!,
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW!, 10) * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX!, 10)
      }
    };
  }
}
