import React from "react";
import { navigateToUrl } from "single-spa";
import { useMutation, useQuery } from "@tanstack/react-query";

import { IPlan } from "@learlifyweb/providers.schema";
import { useHost } from "@learlifyweb/providers.host";
import { Loading } from "@learlifyweb/providers.loading";
import { useNodes } from "@learlifyweb/providers.services";
import { httpsClient } from "@learlifyweb/providers.https";

// - Components
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

// - Styled
import { MarginY } from "@views/Coupon/coupon.styles";
import {
  ActionTemplate,
  Container,
  TableTreeStyled,
  Title,
} from "@views/Admin/admin.style";

// - Query
import { PlanMutation, PlanQuery } from "./plans.query";
import { api } from "./plans.service";

// - Utils
import { render } from "./plans.utils";
import { pageReportTemplate, paginatorTemplate, path } from "@utils";
import { TreeNode } from "primereact/treenode";
import { Deleted } from "@components/Deleted";

const Plans: React.FC = () => {
  const { token } = useHost();

  /**
   * @description
   * Fetch all plans to manage it.
   */
  const plans = useQuery({
    queryKey: [PlanQuery.PLANS],
    queryFn: httpsClient<IPlan[]>({ token }, api.plans),
  });

  /**
   * @description
   * Delete plan service.
   */
  const deletePlan = useMutation({
    mutationKey: [PlanMutation.DELETE],
    mutationFn: (id: number) => {
      const request = httpsClient({ token }, api.delete, {
        params: [id],
      });

      return request();
    },
  });

  /**
   * @description
   * Derived render nodes from plans.
   */
  const plansNodeRef = useNodes(plans?.data?.response, {
    key: "name",
    data: render,
    label: (info) => info.name,
  });

  /**
   * @description
   * Toast message.
   */
  const message = React.useRef<Toast>();

  /**
   * @description
   * Redirect to start creating a plan.
   */
  const handleClickCreate = () => {
    navigateToUrl("/dashboard/plans/create");
  };

  /**
   * @description
   * Handle delete nodes.
   */
  const handleDeleteNode = React.useCallback(
    ({ name, id }: Pick<IPlan, "name" | "id">) => {
      message.current?.clear();

      const handleDeleteService = () => {
        deletePlan.mutate(id);
      };

      return message.current?.show({
        sticky: true,
        severity: "info",
        content: () => (
          <Deleted
            onCancel={message?.current?.clear}
            onDelete={handleDeleteService}
            title={
              <div>
                ¿Desea eliminar el plan <b>{name}</b>?
              </div>
            }
          />
        ),
      });
    },
    [deletePlan]
  );

  const ActionTemplateBody = React.useCallback(
    (node: TreeNode) => {
      const { id, name } = node?.data as Partial<IPlan>;

      const edit = path("/dashboard/plans/edit", id);

      return (
        <ActionTemplate>
          <Button
            size="small"
            severity="info"
            onClick={() => navigateToUrl(edit)}
          >
            <i className="fa-solid fa-pencil"></i>
          </Button>
          <Button
            size="small"
            severity="danger"
            onClick={() =>
              handleDeleteNode({
                id,
                name,
              })
            }
          >
            <i className="fa-regular fa-trash-can"></i>
          </Button>
        </ActionTemplate>
      );
    },
    [handleDeleteNode]
  );

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  return (
    <>
      <Toast ref={message} />
      <Title>Planes</Title>
      <Button type="button" onClick={handleClickCreate}>
        Crear <i className="fa fa-plus fa-solid ml-1" />
      </Button>
      <MarginY />
      <Container>
        <Loading status={plans.isLoading || plans.isFetching}>
          <TableTreeStyled
            paginator
            rows={10}
            showGridlines
            resizableColumns
            selectionMode="checkbox"
            value={plansNodeRef.nodes}
            paginatorLeft={paginatorLeft}
            paginatorRight={paginatorRight}
            paginatorTemplate={paginatorTemplate}
            currentPageReportTemplate={pageReportTemplate}
          >
            <Column header="Nombre" field="name" />
            <Column header="Precio" field="price" />
            <Column body={ActionTemplateBody} />
          </TableTreeStyled>
        </Loading>
      </Container>
    </>
  );
};

export default Plans;