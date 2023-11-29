import { Node } from "@learlifyweb/providers.services";
import { IPlan } from "@learlifyweb/providers.schema";

export const render: Node<IPlan>["data"] = {
  id: (render) => render?.id,
  name: (render) => render?.name,
  price: (render) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(render.price),
};
