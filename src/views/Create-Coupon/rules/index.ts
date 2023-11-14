import { ICoupon } from "@views/Coupon/api/interface";
import { RegisterOptions } from "react-hook-form";
import { State } from "..";

export const codeAsRules: Omit<
  RegisterOptions<ICoupon & State, "code">,
  "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
> = {
  required: "El nombre del cupón, es requerido",
  minLength: {
    value: 4,
    message: "El nombre del código debe ser válido",
  },
};

export const discountAsRules: Omit<
  RegisterOptions<ICoupon & State, "discountValue">,
  "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
> = {
  min: {
    value: 1,
    message: "El valor mínimo es 1",
  },
  required: "El valor del cupón, es requerido",
};

export const usageAsRules: Omit<
  RegisterOptions<ICoupon & State, "discountValue">,
  "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
> = {
  min: {
    value: 1,
    message: "El valor mínimo es 1",
  },
  max: {
    value: 9999,
    message: "El valor máximo es 99999",
  },
  minLength: {
    value: 1,
    message: "El valor mínimo es 1",
  },
  maxLength: {
    value: 9999,
    message: "El valor máximo es 99999",
  },
  required: "La cantidad de usos, es requerido",
};
