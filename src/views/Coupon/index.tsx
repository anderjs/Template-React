import React from "react";

import { useQuery } from "@tanstack/react-query";

// - Query
import { CouponQuery } from "@query";
import { httpsClient } from "@learlifyweb/providers.https";
import { request } from "./api/requests";

const Coupon: React.FC = () => {
  const { data } = useQuery({
    queryKey: [CouponQuery.DATA],
    queryFn: httpsClient({}, request.coupons),
  });

  return <>Hola!</>;
};

export default Coupon;
