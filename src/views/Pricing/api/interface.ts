export interface IPlan {
  name: string;
  price: number;
  currency: "EUR" | "USD";
}

export interface IPricing {
  title: string;
  price: number;
  description: string;
}
