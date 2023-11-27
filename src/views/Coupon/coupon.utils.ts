import moment from "moment";
import { Node } from "@learlifyweb/providers.services";
import { ICoupon, DiscountType } from "@learlifyweb/providers.schema";

// - Types

export const render: Node<ICoupon>["data"] = {
  id: ({ id }) => id,
  code: ({ code }) => code,
  status: ({ status }) => status,
  usage_limit: ({ usage_limit }) => usage_limit,
  discount_type: (input) => {
    if (input.discount_type === DiscountType.FIXED) {
      return `${input.discount_type} $`;
    }

    if (input.discount_type === DiscountType.PERCENTAGE) {
      return `${input.discount_type} %`;
    }
  },
  end_date: (input) => {
    return moment(input.end_date).format("DD MMMM (YYYY)");
  },
};
