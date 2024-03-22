import React from "react";
import { navigateToUrl } from "single-spa";
import { PrimeIcons } from "primereact/api";
import { useDocumentTitle } from "usehooks-ts";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { useNodes } from "@learlifyweb/providers.services";
import { http } from "@learlifyweb/providers.https";

import { ICoupon } from "@learlifyweb/providers.schema";

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
import { styles } from "@views/Coupon/coupon.styles";

// - API
import { service } from "./coupon.service";

// - Utils
import { render } from "./coupon.utils";
import { pageReportTemplate, paginatorTemplate, path } from "@utils";
import { Fade } from "react-awesome-reveal";

const Coupon: React.FC = () => {
  const { token } = useHost();

  /**
   * @description
   * Message ref.
   */
  const message = React.useRef<Toast>();

  /**
   * @description
   * Setting view name.
   */
  useDocumentTitle("Learlify - Coupons");

  /**
   * @description
   * All coupon information.
   */
  const coupon = useQuery({
    queryKey: [CouponQuery.DATA],
    refetchOnWindowFocus: false,
    queryFn: http<ICoupon[]>({ token }, service.coupons),
  });

  /**
   * @description
   * Delete coupon service.
   */
  const deleteCouponService = useMutation({
    mutationKey: [CouponQuery.DELETE],
    mutationFn: ({ id }: Pick<ICoupon, "code" | "id">) => {
      const query = http<number>({ token }, service.delete, {
        params: [id],
      });

      return query();
    },
    onSuccess: (data, { code }) => {
      if (data?.response) {
        coupon.refetch();

        message.current?.clear();

        return message.current?.show({
          summary: code,
          severity: "success",
          detail: "Se ha eliminado el código",
        });
      }
    },
  });

  /**
   * @description
   * Nodes from coupon.
   */
  const { nodes } = useNodes(coupon?.data?.response, {
    key: "code",
    data: render,
    label: (info) => info.code,
  });

  /**
   * @description
   * Handle delete nodes.
   */
  const handleDeleteNode = React.useCallback(
    (id: number, code: string) => {
      message.current?.clear();

      const handleDeleteService = () => {
        deleteCouponService.mutate({
          id,
          code,
        });
      };

      return message.current?.show({
        sticky: true,
        severity: "info",
        content: () => (
          <div className={styles.content}>
            <div className={styles.center}>
              ¿Desea eliminar el código <b>{code}</b>?
            </div>
            <br />
            <div className={styles.controls}>
              <Button
                size="small"
                severity="danger"
                onClick={handleDeleteService}
              >
                Eliminar
              </Button>
              <Button
                size="small"
                severity="secondary"
                onClick={message?.current?.clear}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ),
      });
    },
    [deleteCouponService]
  );

  const ActionTemplateBody = React.useCallback(
    (node: TreeNode) => {
      const ref = node?.data as Partial<ICoupon>;

      const edit = path("/dashboard/coupons/edit", ref.id);

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
            onClick={() => handleDeleteNode(ref.id, ref.code)}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Button>
        </ActionTemplate>
      );
    },
    [handleDeleteNode]
  );

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
      <Toast position="bottom-right" ref={message} />
      <Fade delay={0.3}>
        <Container>
          <div>
            <Title>Cupones</Title>
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
                <Column header="Código" field="code" />
                <Column header="Cantidad" field="usage_limit" />
                <Column header="Estado" field="status" />
                <Column header="Descuento" field="discount_type" />
                <Column header="Expira" field="end_date" />
                <Column body={ActionTemplateBody} />
              </TableTreeStyled>
            </Loading>
          </div>
        </Container>
      </Fade>
    </>
  );
};

export default Coupon;
