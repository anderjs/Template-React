import styled from "styled-components";
import tailwind from "tailwind-styled-components";

import { TreeTable } from "primereact/treetable";

export const Container = tailwind.div`
  flex
  items-center
  justify-between
  gap-4
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
`;

export const TextTitle = tailwind.div`
  text-lg
  text-white
  leading-5
  my-4
  mr-2
`;