import { randomColor } from "@views/Categories/categories.utils";
import { Chip } from "primereact/chip";
import styled from "styled-components";
import tw from "tailwind-styled-components";

export const Content = tw.div`
  my-10
  mx-5
`;

export const Label = tw.label`
  ml-2
`;

export const CategoryContainer = tw.div`
  my-4
  flex
  items-center
  justify-start
`;

export const StepperTitle = tw.div`
  text-xl
`;

export const Context = tw.div`
  my-8
  mx-8
`;

export const size = "my-2";

export const Tag = styled(Chip)`
  background-color: ${(props) => props?.color ?? randomColor()};
`;

export const Tags = tw.div`
  grid 
  grid-cols-2 
  auto-rows-max 
  md:grid-cols-2 
  lg:grid-cols-4 
  gap-2
`;
