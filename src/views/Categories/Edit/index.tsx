import React from "react";
import { useParams } from "react-router-dom";

import CreateCategory from "../Create";

const EditCategory: React.FC = () => {
  const { id } = useParams();

  return <CreateCategory id={id} isEditMode={true} />;
};

export default EditCategory;
