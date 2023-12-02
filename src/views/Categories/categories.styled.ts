import { Dropdown } from "primereact/dropdown";
import styled from "styled-components";

export const StyledDropdown = styled(Dropdown)`
  .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
    margin: 0;
    padding: 1.5rem 1.25rem !important;
    border: 0 none;
    color: #495057;
    background: rgba(0, 0, 0, 0);
    transition: box-shadow 0.2s;
    border-radius: 0;
  }
`;
