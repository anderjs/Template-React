import React from "react";
import { Fade } from "react-awesome-reveal";
import { useParams } from "react-router-dom";

// - View
import CreateCoupon from "@views/Coupon/Create";

const EditCoupon: React.FC = (props) => {
  const { id } = useParams();

  return <CreateCoupon id={id} isEditMode={true} {...props} />;
};

export default EditCoupon;
