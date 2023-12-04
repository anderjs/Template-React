import React from "react";
import { navigateToUrl } from "single-spa";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "@learlifyweb/providers.schema";

import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";
import { Loading } from "@learlifyweb/providers.loading";
import { useNodes } from "@learlifyweb/providers.services";

import { Fade } from "react-awesome-reveal";

// - Prime
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";

// - Views
import { MarginY } from "@views/Coupon/coupon.styles";
import {
  ActionTemplate,
  Container,
  TableTreeStyled,
  Title,
} from "@views/Admin/admin.style";

// - Utils
import {
  paginatorLeft,
  paginatorRight,
  paginatorTemplate,
  pageReportTemplate,
  path,
} from "@utils";
import { render } from "./categories.utils";

// - Service
import { CategoryQuery, api } from "./categories.service";
import { TreeNode } from "primereact/treenode";

const Categories: React.FC = () => {
  const { token } = useHost();

  const categories = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [CategoryQuery.FETCH],
    queryFn: http<ICategory[]>({ token }, api.categories),
  });

  const { nodes } = useNodes(categories?.data?.response, {
    key: "id",
    data: render,
    label: (label) => label.id,
  });

  const ActionTemplateBody = React.useCallback((node: TreeNode) => {
    const ref = node?.data as Partial<ICategory>;

    const edit = path("/dashboard/categories/edit", ref.id);

    return (
      <ActionTemplate>
        <Button
          size="small"
          severity="info"
          onClick={() => navigateToUrl(edit)}
        >
          <i className="fa-solid fa-pencil"></i>
        </Button>
        <Button size="small" severity="danger" onClick={() => {}}>
          <i className="fa-regular fa-trash-can"></i>
        </Button>
      </ActionTemplate>
    );
  }, []);

  /**
   * @description
   * Start creating categories.
   */
  const handleClickCreate = () => {
    navigateToUrl("/dashboard/categories/create");
  };

  return (
    <Fade delay={0.5}>
      <Title>Categorías</Title>
      <MarginY />
      <Button onClick={handleClickCreate}>
        Crear <i className="fa fa-plus fa-solid fa-md ml-1" />
      </Button>
      <MarginY />
      <Container>
        <Loading status={categories.isLoading || categories.isFetching}>
          <TableTreeStyled
            paginator
            rows={10}
            value={nodes}
            sortOrder={0}
            showGridlines
            resizableColumns
            paginatorLeft={paginatorLeft}
            paginatorRight={paginatorRight}
            paginatorTemplate={paginatorTemplate}
            currentPageReportTemplate={pageReportTemplate}
            emptyMessage="No hay categorías disponibles"
          >
            <Column header="Categoría" field="name" />
            <Column header="Estilos" field="first_color" />
            <Column header="Marca" field="icon" />
            <Column body={ActionTemplateBody} />
          </TableTreeStyled>
        </Loading>
      </Container>
    </Fade>
  );
};

export default Categories;
