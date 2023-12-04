import React from "react";
import { navigateToUrl } from "single-spa";
import { useMutation } from "@tanstack/react-query";

import { Loading } from "@learlifyweb/providers.loading";

// - Prime API Components
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";

// - Providers
import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";

// - Styled Components
import { Title } from "@views/Admin/admin.style";
import { MarginY } from "@views/Coupon/coupon.styles";

// - Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { flex } from "./styles";

// - Utils
import { draft } from "./courses.utils";
import { api } from "./courses.service";

const Courses: React.FC = () => {
  const { token } = useHost();

  const draft = useMutation({
    onSuccess: () => {},
    mutationFn: () => {
      const request = http<{ _id: number }>({ token }, api.createDraft, {
        body: draft,
      });

      return request();
    },
    mutationKey: ["draft"],
  });

  const handleCreateDraft = () => {
    draft.mutate();
  };

  const handleClickCreate = () => {
    navigateToUrl("/dashboard/courses/create");
  };

  return (
    <>
      <Title>Cursos</Title>
      <MarginY />
      <Button className={flex} onClick={handleClickCreate}>
        <span>Crear</span> <FontAwesomeIcon icon="plus" />
      </Button>
      <MarginY />
      <Loading status />
    </>
  );
};

export default Courses;
