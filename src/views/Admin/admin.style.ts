import styled from "styled-components";
import tailwind from "tailwind-styled-components";

import { TreeTable } from "primereact/treetable";

export const Container = tailwind.div`
  flex
  items-center
  justify-center
  gap-20
`;

export const Filter = tailwind.div`
  flex
  items-center
  justify-start
  gap-2
`;

export const Actions = tailwind.div`
  flex
  flex-wrap
  gap-2
`;

export const TableTreeStyled = styled(TreeTable)`
  .p-treetable-wrapper {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .p-treetable-tbody > tr {
    font-family: var(--font);
  }

  .p-paginator-bottom {
    border-width: 0 0 1px 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .p-column-title {
    font-weight: 500;
    font-family: var(--font);
  }
`;

export const Title = tailwind.div`
  text-lg
  text-white
  leading-5
  my-4
  mr-2
`;

export const ActionTemplate = tailwind.div`
  flex
  justify-center
  flex-wrap
  gap-2
`;
