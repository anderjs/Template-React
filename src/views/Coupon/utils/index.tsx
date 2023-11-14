import moment from "moment";
import { Node } from "@learlifyweb/providers.services";

// - Types
import { ICoupon, Type } from "../api/interface";

export const render: Node<ICoupon>["data"] = {
  id: ({ id }) => id,
  code: ({ code }) => code,
  status: ({ status }) => status,
  usageLimit: ({ usageLimit }) => usageLimit,
  discountType: (input) => {
    if (input.discountType === Type.FIXED) {
      return `${input.discountValue} $`;
    }

    if (input.discountType === Type.PERCENTAGE) {
      return `${input.discountValue} %`;
    }
  },
  endDate: (input) => {
    return moment(input.endDate).format("DD MMMM (YYYY)");
  },
};
