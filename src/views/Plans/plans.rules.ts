import { IPlan } from "@learlifyweb/providers.schema";
import { RegisterOptions } from "react-hook-form";

export const nameRules: Omit<
  RegisterOptions<IPlan, "name">,
  "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
> = {
  required: "El nombre del plan, es requerido",
  minLength: {
    value: 3,
    message: "El nombre del plan debe ser válido",
  },
};

export const priceRules: Omit<
  RegisterOptions<IPlan, "price">,
  "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
> = {
  required: "El precio del plan, es requerido",
};

export const descriptionRules: Omit<
  RegisterOptions<IPlan, "description">,
  "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
> = {
  required: "La descripción, es requerida",
  minLength: {
    value: 10,
    message: "La descripción debe ser válida",
  },
  maxLength: {
    value: 255,
    message: "La descripción debe ser válida",
  },
};
