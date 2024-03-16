import React from "react";
import { Fade } from "react-awesome-reveal";
import { useParams } from "react-router-dom";

import CreatePlan from "@views/Plans/Create";

const EditPlan: React.FC = () => {
  const { id } = useParams();

  return (
    <Fade delay={0.3}>
      <CreatePlan id={id} isEditMode />;
    </Fade>
  );
};

export default EditPlan;
