// export interface LinkedCustomer {
//   _id: string;
// }

import { ReactNode } from "react";

export interface LineItem {
  amount: ReactNode;
  _id: string;
  linkedProduct: {
    image: string | undefined;
    name: string;
  };
  quantity: number;
}

export interface Order {
  email: string;
  _id: string;
  customer: string | null;
  address: string | null;
  orderDate: string;
  status: string;
  totalPrice: number;
  paymentId: string | null;
  lineItems: LineItem[];
}
