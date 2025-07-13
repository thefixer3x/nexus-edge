export interface PaymentRequest {
  apiOperation: string;
  order: {
    amount: string;
    currency: string;
    id?: string;
  };
  sourceOfFunds?: {
    type: string;
    token?: string; // Add token field for tokenized payments
  };
  session?: {
    id: string;
  };
}
