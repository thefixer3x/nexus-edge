export interface PaymentRequest {
  apiOperation: string;
  order: {
    amount: string;
    currency: string;
    id?: string;
  };
  sourceOfFunds?: {
    type: string;
    provided?: {
      card?: {
        number: string;
        expiry: {
          month: string;
          year: string;
        };
        securityCode?: string;
      }
    }
  };
  session?: {
    id: string;
  };
}
