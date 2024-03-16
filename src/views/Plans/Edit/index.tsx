import React from "react";
import { useParams } from "react-router-dom";

import CreatePlan from "@views/Plans/Create";

const EditPlan: React.FC = () => {
  const { id } = useParams();

  return <CreatePlan id={id} isEditMode />;
};

export default EditPlan;
