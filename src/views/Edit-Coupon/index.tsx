import React from "react";
import { useParams } from "react-router-dom";

// - View
import CreateCoupon from "@views/Create-Coupon";

const EditCoupon: React.FC = (props) => {
  const { id } = useParams();

  return <CreateCoupon id={id} isEditMode={true} {...props} />;
};

export default EditCoupon;
