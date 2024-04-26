export interface LinkedCustomer {
  _id: string;
}

export interface LineItem {
  _id: string;
  linkedProduct: {
    name: string;
  };
  amount: number;
}

export interface Order {
  _id: string;
  customer: string | null;
  orderDate: string;
  status: string;
  totalPrice: number;
  paymentId: string | null;
  linkedCustomer: LinkedCustomer;
  lineItems: LineItem[];
}
