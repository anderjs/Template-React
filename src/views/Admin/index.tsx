import React from "react";
import { PrimeIcons } from "primereact/api";
import { navigateToUrl } from "single-spa";

// - Hooks
import { useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { useNodes } from "@learlifyweb/providers.services";

// - Https
import { Role } from "@learlifyweb/providers.schema";
import { Loading } from "@learlifyweb/providers.loading";
import { httpsClient } from "@learlifyweb/providers.https";

// - Styles
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { TreeTableSelectionEvent } from "primereact/treetable";
import { Container, TableTreeStyled, TextTitle } from "./styles";

// - API
import { request } from "./api/requests";

// - Query
import { AdminQuery } from "@query";

// - Interfaces
import { ISearch } from "./api/interface";

// - State
import { initialState, reducer } from "./state/slice";
import { selectProfessor, selectUser } from "./state/actions";

// - Utils
import { getName, pageReportTemplate, paginatorTemplate } from "@utils";

const Admin: React.FC = () => {
  const host = useHost();

  /**
   * @description
   * Breadcrumb current item.
   */
  const home = React.useRef<MenuItem>({
    icon: PrimeIcons.USERS,
    command: () => {
      navigateToUrl("/dashboard/admin");
    },
  });

  /**
   * @description
   * Toast message context.
   */
  const message = React.useRef<Toast>();

  /**
   * @description
   * Local state management.npm install @tanstack/react-table primereact
   */
  const [state, dispatch] = React.useReducer(reducer, initialState);

  /**
   * @description
   * Query for users.
   */
  const users = useQuery({
    queryKey: [AdminQuery.USERS],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<ISearch[]>({ token: host.token }, request.users, {
      query: {
        role: Role.USER,
        search: state.user.search,
      },
    }),
  });

  /**
   * @description
   * Node service to get into table.
   */
  const userNodeRef = useNodes(users.data?.response ?? [], {
    key: "email",
    icon: "fa fa-user",
    data: {
      email: (value) => value.email,
      first_name: ({ first_name, last_name }) => getName(first_name, last_name),
    },
    label: (user) => user.email,
  });

  /**
   * @description
   * Query for professors.
   */
  const professors = useQuery({
    queryKey: [AdminQuery.PROFESSORS],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<ISearch[]>({ token: host.token }, request.users, {
      query: {
        role: Role.PROFESSOR,
        search: state.professor.search,
      },
    }),
  });

  /**
   * @description
   * Professors node to get into table.
   */
  const professorNodeRef = useNodes(professors.data?.response ?? [], {
    key: "email",
    data: {
      email: (data) => data.email,
      first_name: ({ first_name, last_name }) => getName(first_name, last_name),
    },
    label: (user) => user.email,
  });

  /**
   * @description
   * Added to checkbox selection user.
   */
  const handleSelectUser = (event: TreeTableSelectionEvent) => {
    dispatch(selectUser(event.value));
  };

  /**
   * @description
   * Added to checkbox selection user.
   */
  const handleSelectProfessor = (event: TreeTableSelectionEvent) => {
    dispatch(selectProfessor(event.value));
  };

  /**
   * @description
   * User model template.
   * @requires MenuItem
   */
  const userModelTemplate = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Agregar",
        icon: PrimeIcons.PLUS,
        items: [
          {
            label: "Regalo",
            icon: PrimeIcons.HEART,
          },
          {
            label: "Paquete",
            icon: PrimeIcons.CREDIT_CARD,
            command: () => {
              message.current?.clear();
            },
          },
          {
            label: "Usuario",
            icon: PrimeIcons.USER,
          },
        ],
      },
      {
        label: "Email",
        icon: PrimeIcons.ENVELOPE,
        items: [
          {
            label: "Automático",
            icon: PrimeIcons.SITEMAP,
            items: [
              {
                label: "Ticket",
                icon: PrimeIcons.TICKET,
              },
              {
                label: "Password",
                icon: PrimeIcons.REFRESH,
              },
            ],
          },
          {
            label: "Personalizado",
            icon: PrimeIcons.COMMENTS,
          },
        ],
      },
      {
        label: "Usuario",
        icon: PrimeIcons.USER,
        items: [
          {
            label: "Verificación",
            icon: PrimeIcons.CHECK_SQUARE,
          },
          {
            label: "Notificación",
            icon: PrimeIcons.BELL,
          },
        ],
      },
      {
        label: "Administrar",
        icon: PrimeIcons.FOLDER,
        items: [
          {
            label: "Cupones",
            icon: PrimeIcons.PERCENTAGE,
            command: () => navigateToUrl("/dashboard/coupons"),
          },
          {
            label: "Regalos",
            icon: PrimeIcons.HEART,
          },
          {
            label: "Paquetes",
            icon: PrimeIcons.CREDIT_CARD,
          },
          {
            label: "Reportes",
            icon: PrimeIcons.FLAG,
          },
        ],
      },
    ],
    [state.users]
  );

  /**
   * @description
   * User model template.
   * @requires MenuItem
   */
  const professorModelTemplate = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Agregar",
        icon: PrimeIcons.PLUS,
        items: [
          {
            label: "Paquete",
            icon: PrimeIcons.CREDIT_CARD,
            command: () => {},
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
      <Toast position="bottom-left" ref={message} />
      <br />
      <Container>
        <div>
          <TextTitle>
            Usuarios
            <i className="fa-solid fa-users fa-fade fa-sm float-right" />
          </TextTitle>
          <Menubar model={userModelTemplate} />
          <br />
          <Loading status={users.isLoading || users.isRefetching}>
            <TableTreeStyled
              paginator
              rows={10}
              showGridlines
              resizableColumns
              selectionMode="checkbox"
              value={userNodeRef.nodes}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              selectionKeys={state.users}
              paginatorTemplate={paginatorTemplate}
              onSelectionChange={handleSelectUser}
              currentPageReportTemplate={pageReportTemplate}
            >
              <Column field="firstName" expander sortable />
              <Column field="email" sortable />
            </TableTreeStyled>
          </Loading>
        </div>
        <div>
          <TextTitle>
            Profesores
            <i className="fa-solid fa-users fa-fade fa-sm float-right" />
          </TextTitle>
          <Menubar model={professorModelTemplate} />
          <br />
          <Loading status={professors.isLoading || professors.isRefetching}>
            <TableTreeStyled
              paginator
              rows={10}
              showGridlines
              resizableColumns
              selectionMode="checkbox"
              value={professorNodeRef.nodes}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              paginatorTemplate={paginatorTemplate}
              selectionKeys={state.professors}
              onSelectionChange={handleSelectProfessor}
              currentPageReportTemplate={pageReportTemplate}
            >
              <Column field="firstName" expander sortable />
              <Column field="email" sortable />
            </TableTreeStyled>
          </Loading>
        </div>
      </Container>
    </>
  );
};

export default Admin;
