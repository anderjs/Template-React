import React from "react";

import { Loading } from "@learlifyweb/providers.loading";

// - Prime API Components
import { Menubar } from "primereact/menubar";

// - Styled Components
import { Title } from "@views/Admin/admin.style";
import { MarginY } from "@views/Coupon/coupon.styles";
import { MenuItem } from "primereact/menuitem";

const Courses: React.FC = () => {
  const model = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Crear",
        icon: "fa fa-graduation-cap fa-solid fa-md",
        items: [
          {
            label: "Curso",
          },
          {
            label: "Categoría",
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <Title>Cursos</Title>
      <MarginY />
      <Menubar model={model} />
      <MarginY />
      <Loading status></Loading>
    </>
  );
};

export default Courses;
