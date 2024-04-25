export interface CreateProduct {
  id?: string; // funkar det om man gör den optional?
  name: string;
  image: string;
  inStock: number;
  price: number;
  status: string;
  description: string;
}
