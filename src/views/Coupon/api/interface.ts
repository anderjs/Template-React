export enum Type {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum Status {
  Active = "Active",
  Expired = "Expired",
  Disabled = "Disabled",
}

export interface ICoupon {
  id: number;
  code: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  endDate?: string;
  startDate?: string;
  description: string;
  discountType: Type;
  usageCount: number;
  usageLimit: number;
  discountValue: number;
  purchaseAmount: number;
}
