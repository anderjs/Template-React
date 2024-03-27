import tw from "tailwind-styled-components";
import styled from "styled-components";
import { Dropdown } from "primereact/dropdown";

export const TextLabel = tw.label`
  text-[#ada8a8] 
  font-medium 
  text-base 
  tracking-wider
`;

export const Elements = tw.div`
  flex 
  gap-2 
  justify-start 
  items-center
`;

export const Margin = tw.div`
  my-4
`;

export const MarginView = tw.div`
  my-8
`;

export const StyledDropdown = styled(Dropdown)`
  & .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
    padding: 0.5rem 1.25rem !important;
  }
`;

export const Cols = tw.div`
  grid 
  grid-cols-2
  gap-x-4
`;
