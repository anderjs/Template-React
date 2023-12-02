import React from "react";
import { PrimeIcons } from "primereact/api";
import { navigateToUrl } from "single-spa";
import { Fade } from "react-awesome-reveal";

// - Hooks
import { useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { useNodes } from "@learlifyweb/providers.services";

// - Https
import { IRoles, Role } from "@learlifyweb/providers.schema";
import { Loading } from "@learlifyweb/providers.loading";
import { httpsClient } from "@learlifyweb/providers.https";

// - Styles
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { TreeTableSelectionEvent } from "primereact/treetable";
import { Container, Filter, TableTreeStyled, Title } from "./admin.style";

// - API
import { request } from "./api/requests";

// - Query
import { AdminQuery } from "@query";

// - Interfaces
import { ISearch } from "./api/interface";

// - State
import { initialState, reducer } from "./admin.state";
import { selectProfessor, selectRole, selectUser } from "./admin.action";

// - Utils
import { pageReportTemplate, paginatorTemplate } from "@utils";
import { render } from "./admin.utils";
import { MarginY } from "@views/Coupon/coupon.styles";
import { StyledDropdown } from "@views/Categories/categories.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Admin: React.FC = () => {
  const { token } = useHost();

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
    queryKey: ["users"],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<ISearch[]>({ token }, request.users, {
      query: {
        role: state.role ?? Role.INSTRUCTOR,
      },
    }),
  });

  const roles = useQuery({
    queryKey: ["roles"],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<IRoles[]>({ token }, request.roles),
  });

  /**
   * @description
   * Node service to get into table.
   */
  const userNodeRef = useNodes(users.data?.response ?? [], {
    key: "email",
    data: render,
    icon: "fa fa-user",
    label: (user) => user.email,
  });

  /**
   * @description
   * Every time state.role changes, refetch users.
   */
  React.useEffect(() => {
    if (users.isFetchedAfterMount) {
      users.refetch();
    }
  }, [users.isFetchedAfterMount, state.role]);

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

  const handleFilterByRole = (e: DropdownChangeEvent) => {
    dispatch(selectRole(e.value));
  };

  const ItemTemplate = (item) => {
    return <small>{item.name}</small>;
  };

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  return (
    <>
      <Toast position="bottom-left" ref={message} />
      <Fade delay={0.5}>
        <Container>
          <div>
            <Title>Usuarios</Title>
            <Menubar model={userModelTemplate} />
            <MarginY />
            <Filter>
              <Dropdown
                optionLabel="name"
                optionValue="name"
                value={state?.role}
                onChange={handleFilterByRole}
                placeholder="Tipo de usuario"
                options={roles?.data?.response}
                itemTemplate={ItemTemplate}
              />
              <FontAwesomeIcon color="white" size="xl" icon="folder-tree" />
            </Filter>
            <MarginY />
            <Loading>
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
                loading={users.isLoading || users.isRefetching}
                loadingIcon={
                  <FontAwesomeIcon size="2xl" icon="circle-user" fade />
                }
                currentPageReportTemplate={pageReportTemplate}
              >
                <Column field="first_name" sortable />
                <Column header="Correo electrónico" field="email" />
              </TableTreeStyled>
            </Loading>
          </div>
        </Container>
      </Fade>
    </>
  );
};

export default Admin;
