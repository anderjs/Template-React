import { Node } from "@learlifyweb/providers.services";
import { IHistory } from "@learlifyweb/providers.schema";
import moment from "moment";

export const render: Node<IHistory>["data"] = {
  action: (render) => <>{render.action}</>,
  details: (render) => render.details,
  timestamp: (render) =>
    moment(render.timestamp).format("DD (MMM) YYYY - HH:mm A"),
};
