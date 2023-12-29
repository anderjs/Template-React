import React from "react";
import { navigateToUrl } from "single-spa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Fade } from "react-awesome-reveal";

import { Loading } from "@learlifyweb/providers.loading";
import { useNodes } from "@learlifyweb/providers.services";

// - Prime API Components
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { TreeNode } from "primereact/treenode";
import { InputSwitch } from "primereact/inputswitch";

// - Providers
import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";

// - Styled Components
import {
  ActionTemplate,
  TableTreeStyled,
  Title,
} from "@views/Admin/admin.style";
import { MarginY } from "@views/Coupon/coupon.styles";

// - Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { flex } from "./styles";

// - Utils
import {
  path,
  pageReportTemplate,
  paginatorLeft,
  paginatorRight,
  paginatorTemplate,
} from "@utils";
import { draft, render } from "./courses.utils";

// - Service
import { api } from "./courses.service";
import { IDraft } from "./courses.interface";
import { AxiosError, HttpStatusCode } from "axios";

const Courses: React.FC = () => {
  const { token } = useHost();

  const message = React.useRef<Toast>();

  const [isDraftMode, setIsDraftMode] = React.useState(true);

  const draftService = useMutation({
    onError: (err: AxiosError) => {
      switch (err.response.status) {
        case HttpStatusCode.Unauthorized:
          return navigateToUrl("/login");
      }
    },
    onSuccess: ({ response }) => {
      const { _id } = response;

      navigateToUrl(path("/dashboard/courses/create", _id));
    },
    mutationFn: () => {
      const request = http<{ _id: number }>({ token }, api.createDraft, {
        body: draft,
      });

      return request();
    },
    mutationKey: ["draft"],
  });

  const drafts = useQuery({
    queryKey: ["drafts"],
    refetchOnWindowFocus: false,
    queryFn: http<IDraft[]>({ token }, api.findDrafts),
  });

  const { nodes } = useNodes(drafts.data?.response, {
    key: "_id",
    data: render,
    label: (info) => info._id,
  });

  const handleCreateDraft = () => {
    message?.current?.show({
      severity: "info",
      summary: "Cursos",
      detail: "Preparando Workspace",
    });

    draftService.mutate();
  };

  const handleChangeIsDraft = () => {
    setIsDraftMode((draftStatus) => !draftStatus);
  };

  const ActionTemplateBody = React.useCallback((node: TreeNode) => {
    const ref = node?.data as Partial<IDraft>;

    const edit = path("/dashboard/courses/create", ref._id);

    return (
      <ActionTemplate>
        <Button
          size="small"
          severity="info"
          onClick={() => navigateToUrl(edit)}
        >
          <i className="fa-solid fa-pencil"></i>
        </Button>
        <Button size="small" severity="danger">
          <i className="fa-regular fa-trash-can"></i>
        </Button>
      </ActionTemplate>
    );
  }, []);

  return (
    <>
      <Toast position="bottom-right" ref={message} />
      <Fade delay={0.1}>
        <Title>Cursos</Title>
        <MarginY />
        <div className="flex justify-start items-center gap-4">
          <Button
            className={flex}
            onClick={handleCreateDraft}
            disabled={draftService.isLoading}
          >
            <span>Crear</span> <FontAwesomeIcon icon="plus" />
          </Button>
          <InputSwitch
            tooltip="Desactiva el draft mode para ver los cursos creados"
            checked={isDraftMode}
            onChange={handleChangeIsDraft}
          />
        </div>
        <MarginY />
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
          loading={drafts.isLoading || drafts.isRefetching}
          emptyMessage="No hay cupones disponibles"
        >
          <Column header="Draft" field="_id" />
          <Column header="Estado" field="status" />
          <Column body={ActionTemplateBody} />
        </TableTreeStyled>
      </Fade>
    </>
  );
};

export default Courses;
