import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";

// - UI
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  Container,
  TextTitle,
  TableTreeStyled,
} from "@views/Admin/admin.style";

// - Providers
import { Loading } from "@learlifyweb/providers.loading";
import { useNodes } from "@learlifyweb/providers.services";

// - Def
import { render } from "./history.utils";
import { service } from "./history.service";
import { HistoryQuery } from "./history.query";

// - Client
import { httpsClient } from "@learlifyweb/providers.https";

// - Schema
import { IHistory } from "@learlifyweb/providers.schema";
import { pageReportTemplate, paginatorTemplate } from "@utils";

const History: React.FC = () => {
  const { token } = useHost();

  const history = useQuery({
    queryKey: [HistoryQuery.HISTORY],
    queryFn: httpsClient<IHistory[]>({ token }, service.history),
  });

  const historyNodeRef = useNodes(history?.data?.response, {
    key: "id",
    data: render,
    label: (info) => info.id,
  });

  const message = React.useRef<Toast>();

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  return (
    <>
      <Toast ref={message} />
      <TextTitle>
        Historial
        <i className="fa-solid fa-cloack-rotate-left fa-sm float-right" />
      </TextTitle>
      <Container>
        <Loading status={history.isLoading || history.isRefetching}>
          <TableTreeStyled
            paginator
            rows={10}
            showGridlines
            resizableColumns
            selectionMode="checkbox"
            value={historyNodeRef.nodes}
            paginatorLeft={paginatorLeft}
            paginatorRight={paginatorRight}
            paginatorTemplate={paginatorTemplate}
            currentPageReportTemplate={pageReportTemplate}
          >
            <Column header="Acción" field="action" />
            <Column header="Fecha" field="timestamp" />
            <Column header="Detalles" field="details" />
          </TableTreeStyled>
        </Loading>
      </Container>
    </>
  );
};

export default History;
