import React from "react";

import { Loading } from "@learlifyweb/providers.loading";

// - Prime API Components
import { Menubar } from "primereact/menubar";

// - Styled Components
import { Title } from "@views/Admin/admin.style";
import { MarginY } from "@views/Coupon/coupon.styles";
import { MenuItem } from "primereact/menuitem";
import { navigateToUrl } from "single-spa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";

const Courses: React.FC = () => {
  const handleClickCreate = () => {
    navigateToUrl("/dashboard/courses/create");
  };

  return (
    <>
      <Title>Cursos</Title>
      <MarginY />
      <Button onClick={handleClickCreate}>
        Crear <FontAwesomeIcon className="ml-1" icon="plus" />
      </Button>
      <MarginY />
      <Loading status></Loading>
    </>
  );
};

export default Courses;
