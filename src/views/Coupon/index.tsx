import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { useNodes } from "@learlifyweb/providers.services";
import { httpsClient } from "@learlifyweb/providers.https";

// - Query
import { CouponQuery } from "@query";

// - Prime
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { TieredMenu } from "primereact/tieredmenu";
import { Loading } from "@learlifyweb/providers.loading";
import { Container, TableTreeStyled, TextTitle } from "@views/Admin/styles";

// - API
import { request } from "./api/requests";
import { ICoupon } from "./api/interface";

import { pageReportTemplate, paginatorTemplate } from "@utils";
import { MenuItem } from "primereact/menuitem";
import { PrimeIcons } from "primereact/api";
import { Menubar } from "primereact/menubar";
import { navigateToUrl } from "single-spa";

const Coupon: React.FC = () => {
  const { token } = useHost();

  /**
   * @description
   * All coupon information.
   */
  const coupon = useQuery({
    refetchOnMount: false,
    queryKey: [CouponQuery.DATA],
    queryFn: httpsClient<ICoupon[]>({ token }, request.coupons),
  });

  /**
   * @description
   * Nodes from coupon.
   */
  const { nodes } = useNodes(coupon?.data?.response, {
    key: "code",
    data: {
      code: (input) => {
        return input.code;
      },
    },
    label: (info) => info.code,
  });

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
            label: "Cupón",
            icon: PrimeIcons.DOLLAR,
            command: () => {
              navigateToUrl("/dashboard/coupons/create");
            },
          },
          {
            label: "Descuento",
            icon: PrimeIcons.PERCENTAGE,
            command: () => {
              navigateToUrl("/dashboard/coupons/discount");
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
      <Container>
        <div>
          <TextTitle>Cupones</TextTitle>
          <Menubar model={menu} />
          <Divider type="solid" />
          <Loading status={coupon.isLoading || coupon.isRefetching}>
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
              <Column field="code" />
            </TableTreeStyled>
          </Loading>
        </div>
      </Container>
    </>
  );
};

export default Coupon;
