import { ICategory } from "@learlifyweb/providers.schema";
import { RegisterOptions } from "react-hook-form";

type PlanRegisterOptions =
  | "disabled"
  | "valueAsNumber"
  | "valueAsDate"
  | "setValueAs";

export const nameRules: Omit<
  RegisterOptions<ICategory, "name">,
  PlanRegisterOptions
> = {
  required: "El nombre de la categoría, es requerido",
  minLength: {
    value: 4,
    message: "El nombre de la categoría debe ser mínimo dos carácteres",
  },
  maxLength: {
    value: 20,
    message: "El nombre de la categoría debe ser máximo de 20 carácteres",
  },
};

export const descriptionRules: Omit<
  RegisterOptions<ICategory, "description">,
  PlanRegisterOptions
> = {
  required: "La descripción, es requerida",
  minLength: {
    value: 24,
    message: "La descripción debe tener un mínimo de 24 carácteres",
  },
  maxLength: {
    value: 1000,
    message: "La descripción debe tener un máximo de 256 carácteres",
  },
};

export const iconRules: Omit<
  RegisterOptions<ICategory, "icon">,
  PlanRegisterOptions
> = {
  required: "El icono debe ser seleccionado",
};
