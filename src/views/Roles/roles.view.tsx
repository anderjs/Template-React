import React from "react";
import { navigateToUrl } from "single-spa";
import { PrimeIcons } from "primereact/api";

import { useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { useNodes } from "@learlifyweb/providers.services";
import { httpsClient } from "@learlifyweb/providers.https";

import { ICoupon, IRoles } from "@learlifyweb/providers.schema";

// - Query
import { CouponQuery } from "@query";

// - Prime
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Menubar } from "primereact/menubar";
import { TreeNode } from "primereact/treenode";
import { MenuItem } from "primereact/menuitem";
import { Loading } from "@learlifyweb/providers.loading";
import {
  Title,
  Container,
  ActionTemplate,
  TableTreeStyled,
} from "@views/Admin/admin.style";

// - API
import { service } from "./roles.service";

// - Utils
import { render } from "./roles.utils";
import { pageReportTemplate, paginatorTemplate } from "@utils";

const Coupon: React.FC = () => {
  /**
   * @description
   * Token host.
   */
  const { token } = useHost();

  /**
   * @description
   * Message ref.
   */
  const message = React.useRef<Toast>();

  /**
   * @description
   * All coupon information.
   */
  const roles = useQuery({
    queryKey: [CouponQuery.DATA],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<IRoles[]>({ token }, service.roles),
  });

  /**
   * @description
   * Nodes from coupon.
   */
  const { nodes } = useNodes(roles?.data?.response, {
    key: "name",
    data: render,
    label: (info) => info.name,
  });

  const ActionTemplateBody = React.useCallback((node: TreeNode) => {
    const ref = node?.data as Partial<ICoupon>;

    return <ActionTemplate></ActionTemplate>;
  }, []);

  /**
   * @description
   * Menu of coupon.
   */
  const menu = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Crear",
        icon: PrimeIcons.PLUS,
        items: [
          {
            label: "Rol",
            icon: PrimeIcons.SHIELD,
            command: () => {
              navigateToUrl("/dashboard/roles/create");
            },
          },
          {
            label: "Permiso",
            icon: PrimeIcons.USER_PLUS,
            command: () => {
              navigateToUrl("/dashboard/roles/update");
            },
          },
        ],
      },
    ],
    []
  );

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  return (
    <>
      <Toast position="bottom-right" ref={message} />
      <Container>
        <div>
          <Title>Roles</Title>
          <Loading status={roles.isLoading || roles.isRefetching}>
            <Menubar model={menu} />
            <Divider type="solid" />
            <TableTreeStyled
              paginator
              rows={10}
              showGridlines
              value={nodes}
              resizableColumns
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              paginatorTemplate={paginatorTemplate}
              currentPageReportTemplate={pageReportTemplate}
              emptyMessage="No hay cupones disponibles"
            >
              <Column header="Tipo" field="name" />
            </TableTreeStyled>
          </Loading>
        </div>
      </Container>
    </>
  );
};

export default Coupon;
